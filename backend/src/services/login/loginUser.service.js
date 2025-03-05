const bcrypt = require('bcrypt');
const UsuarioRepository = require('../../repositories/UsuarioRepository.js');
const RefreshTokenRepository = require('../../repositories/RefreshTokenRepository');

const { refreshTokenCreate } = require('./refreshToken.service.js');
const { createSession } = require('./userSession.service');

const { notAuthorizedError, notFoundError, internalServerError } = require('../../helpers/error.helper.js'); 
const CustomError = require('../../helpers/customError.helper.js');

const { setAuthCookie } = require('../../helpers/token.helper.js');
const { sequelize } = require('../../db/index.js');

const preLoginUser = async (email, password) => {
    const transaction = await sequelize.transaction();
    try {
        const user = await UsuarioRepository.getUserWithDetails(email, transaction);
        if (!user || user.length === 0) throw notFoundError('Usuario no encontrado', 'USER_NOT_FOUND');

        const { usuario_guid, correo_electronico, id: id_usuario, is_verified, clave_hash, estado_usuario } = user[0];

        if (!is_verified) throw notAuthorizedError('Usuario no verificado', 'USER_NOT_VERIFIED');
        if (estado_usuario.toLowerCase() !== 'activo') throw notAuthorizedError('Usuario inactivo', 'USER_INACTIVE');

        const passwordMatch = await bcrypt.compare(password, clave_hash);
        if (!passwordMatch) throw notAuthorizedError('Contraseña incorrecta', 'INCORRECT_PASSWORD');

        const [{ session, accessToken }, _] = await Promise.all([
            createSession(usuario_guid, id_usuario, 'Lima', '191.168.64.28', 'Desktop', transaction),
            RefreshTokenRepository.revokeTokenByUser(id_usuario, transaction)
        ]);

        // Si todo salió bien, confirmar transacción
        await transaction.commit();

        return { 
            access_token: accessToken,
            usuario_guid,
            id_usuario,
            session_id: session,
        };

    } catch (error) {
        await transaction.rollback(); // Hacer rollback solo si la transacción no ha sido confirmada
        throw error;
    }
};

const LoginUser = async (email, password, res) => {

    const { access_token, usuario_guid, id_usuario, session_id } = await preLoginUser(email, password);
    try{
        const createdRefreshToken = await refreshTokenCreate(usuario_guid, id_usuario, session_id);
        setAuthCookie(res, access_token);

        return { access_token, refresh_token: createdRefreshToken.refresh_token }; 

    }catch(error){
        throw error instanceof CustomError ? error : internalServerError('Error en la verificación de sesión', 'VERIFICATION_SESSION_ERROR');
    }
}

module.exports = { preLoginUser, LoginUser };