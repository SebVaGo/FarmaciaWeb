const UsuarioContrasenaRepository = require('../../repositories/UsuarioContrasenaRepository');
const logger = require('../../configurations/logger.js');
const CustomError = require('../../helpers/customError.helper');
const { conflictError, internalServerError} = require('../../helpers/error.helper.js');
const passwordHelper = require('../../helpers/password.helper');

const createUserPassword = async (id_usuario, password, transaction) => {
    try {
        const { hashedPassword } = await passwordHelper.hashPassword(password);
        if (!hashedPassword) {
            throw internalServerError('Error al generar la contraseña', 'PASSWORD_HASH_ERROR');
        }

        const [userPassword, created] = await UsuarioContrasenaRepository.findOrCreate(id_usuario, hashedPassword, transaction);

        if (!created) {
            throw new conflictError('El usuario ya tiene una contraseña registrada', 'USER_PASSWORD_ALREADY_EXISTS');
        }

        return userPassword;
    } catch (error) {
        throw error instanceof CustomError ? error : internalServerError('Error al crear la contraseña del usuario');
    }
};

module.exports = { createUserPassword };
