const bcrypt = require('bcrypt');
const UsuarioRepository = require('../../repositories/UsuarioRepository.js');

const { refreshTokenCreate } = require('./refreshToken.service.js');
const { createSession } = require('./userSession.service');

const { notAuthorizedError, notFoundError, internalServerError } = require('../../helpers/error.helper.js'); 
const CustomError = require('../../helpers/customError.helper.js');

const { sequelize } = require('../../db/index.js');


const loginUser = async (email, password) => {
    const transaction = await sequelize.transaction();
    try {
        // Obtener usuario con estado y contraseña en una sola consulta
        const user = await UsuarioRepository.getUserWithDetails(email, transaction);

        if (!user || user.length === 0) {
            throw notFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
        }

        const { correo_electronico, id: id_usuario, is_verified, clave_hash, estado_usuario } = user[0];

        if (!is_verified) throw notAuthorizedError('Usuario no verificado', 'USER_NOT_VERIFIED');
        if (estado_usuario.toLowerCase() !== 'activo') throw notAuthorizedError('Usuario inactivo', 'USER_INACTIVE');

        // Comparar contraseña
        const passwordMatch = await bcrypt.compare(password, clave_hash);
        if (!passwordMatch) throw notAuthorizedError('Contraseña incorrecta', 'INCORRECT_PASSWORD');

        // Crear sesión en la misma transacción
        const session = await createSession(id_usuario, 'Lima', '191.168.64.28', 'Desktop', transaction);

        // Confirmar la transacción antes de crear el refresh token
        await transaction.commit();

        // Crear token de refresco fuera de la transacción
        const refreshToken = await refreshTokenCreate(id_usuario, session);

        return { 
            id_usuario,
            correo_electronico,
            session_id: session,
            refresh_token: refreshToken.refresh_token
        };

    } catch (error) {
        await transaction.rollback();
        console.error(`⛔ Error en loginUser:`, error);
        throw error instanceof CustomError ? error : internalServerError('Error al iniciar sesión', 'LOGIN_USER_ERROR');
    }
};

module.exports = { loginUser };