const logger = require('../../configurations/logger.js');
const bcrypt = require('bcrypt');
const UsuarioRepository = require('../../repositories/UsuarioRepository.js');
const RefreshTokenRepository = require('../../repositories/RefreshTokenRepository');

const { refreshTokenCreate } = require('./refreshToken.service.js');
const { createSession } = require('./userSession.service');

const { notAuthorizedError, notFoundError, internalServerError } = require('../../helpers/error.helper.js'); 
const CustomError = require('../../helpers/customError.helper.js');

const { setAuthCookie } = require('../../helpers/token.helper.js');
const { sequelize } = require('../../db/index.js');

const validateUserCredentials = async (user, password) => {
    if (!user || !user.length) {
      throw notFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
    }
  
    const { is_verified, clave_hash, estado_usuario } = user[0];
  
    if (!is_verified) {
      throw notAuthorizedError('Usuario no verificado', 'USER_NOT_VERIFIED');
    }
  
    if (estado_usuario.toLowerCase() !== 'activo') {
      throw notAuthorizedError('Usuario inactivo', 'USER_INACTIVE');
    }
  
    const passwordMatch = await bcrypt.compare(password, clave_hash);
    if (!passwordMatch) {
      throw notAuthorizedError('Contraseña incorrecta', 'INCORRECT_PASSWORD');
    }
  };


const preLoginUser = async (email, password) => {
      
    const transaction = await sequelize.transaction();

    try {
        const user = await UsuarioRepository.getUserWithDetails(email, transaction);
        await validateUserCredentials(user, password);


        const { usuario_guid, id: id_usuario } = user[0];

        const [{ session, accessToken }, _] = await Promise.all([
            createSession(usuario_guid, id_usuario, transaction),
            RefreshTokenRepository.revokeTokenByUser(id_usuario, transaction),
        ]);

        await transaction.commit();

        return { 
            access_token: accessToken,
            usuario_guid,
            id_usuario,
            session_id: session,
        };

    } catch (error) {
        if (transaction && transaction.finished !== 'commit') {
            await transaction.rollback();
          }
          
          logger.error(`Error en la autenticación (${email}): ${error.message}`, { 
            error,
            stack: error.stack,
            email: email.substring(0, 3) + '***' // Ocultar parte del email por seguridad
          });
          
          throw error;
        }
    };

const LoginUser = async (email, password, res) => {

    try {
        const { access_token, usuario_guid, id_usuario, session_id } = await preLoginUser(email, password);
        
        const createdRefreshToken = await refreshTokenCreate(usuario_guid, id_usuario, session_id);
        
        setAuthCookie(res, access_token);

        return { message: 'Usuario autenticado correctamente' }; 

    } catch (error) {
        logger.error(`Error en la autenticación: ${error.message}`, { 
            error, 
            stack: error.stack
          });
          
          if (error instanceof CustomError) {
            throw error;
          }
          
          throw internalServerError(
            'Error en el proceso de autenticación', 
            'AUTHENTICATION_ERROR'
          );
        }
      };

module.exports = { preLoginUser, LoginUser };