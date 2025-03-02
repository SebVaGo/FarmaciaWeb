const UsuarioContrasenaRepository = require('../../repositories/UsuarioContrasenaRepository');
const UsuarioRepository = require('../../repositories/UsuarioRepository');
const logger = require('../../configurations/logger.js');
const CustomError = require('../../helpers/customError.helper');
const { conflictError, internalServerError} = require('../../helpers/error.helper.js');
const passwordHelper = require('../../helpers/password.helper');

const updateUserPassword = async (id_usuario, password, transaction) => {
    try {

        const userExists = await UsuarioRepository.findById(id_usuario, transaction);
        if (!userExists) {
            throw notFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
        }

        const existingPassword = await UsuarioContrasenaRepository.findByUserId(id_usuario, transaction);
        if (!existingPassword) {
            throw notFoundError('El usuario no tiene una contraseña registrada', 'USER_PASSWORD_NOT_FOUND');
        }

        const { hashedPassword } = await passwordHelper.hashPassword(password);
        if (!hashedPassword) {
            throw internalServerError('Error al generar la contraseña', 'PASSWORD_HASH_ERROR');
        }

        const updated = await UsuarioContrasenaRepository.update(id_usuario, hashedPassword, transaction);
        if (!updated) {
            throw internalServerError('Error al actualizar la contraseña', 'PASSWORD_UPDATE_ERROR');
        }

        return {
            id_usuario,
            updated: true,
            fecha_cambio: new Date()
        };

    } catch (error) {
        throw error instanceof CustomError ? error : internalServerError('Error al crear la contraseña del usuario');
    }
};

module.exports = { updateUserPassword };
