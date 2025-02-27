const UsuarioContrasena = require('../../models/UsuarioContrasena');
const logger = require('../../configurations/logger.js');
const CustomError = require('../../helpers/customError.helper');
const { 
    conflictError, 
    internalServerError, 
    badRequestError 
} = require('../../helpers/error.helper.js');
const passwordHelper = require('../../helpers/password.helper');

const createUserPassword = async (idUsuario, password, transaction) => {
    try {
        if (!idUsuario) {
            throw badRequestError('El ID del usuario es obligatorio', 'USER_ID_REQUIRED');
        }
        if (!password) {
            throw badRequestError('La contraseña es obligatoria', 'PASSWORD_REQUIRED');
        }
        if (!transaction) {
            throw internalServerError('La transacción no fue proporcionada', 'TRANSACTION_REQUIRED');
        }

        let hashedPassword;
        try {
            ({ hashedPassword } = await passwordHelper.hashPassword(password));
        } catch (hashError) {
            logger.error(`Error al hashear la contraseña: ${hashError.message}`);
            throw internalServerError('Error interno al procesar la contraseña', 'PASSWORD_HASH_ERROR');
        }

        const [nuevoUsuarioContrasena, created] = await UsuarioContrasena.findOrCreate({
            where: { id_usuario: idUsuario },
            defaults: { clave_hash: hashedPassword },
            transaction
        });

        if (!created) {
            logger.error(`Error en createUserPassword: El usuario '${idUsuario}' ya tiene una contraseña.`);
            throw conflictError('El usuario ya tiene una contraseña registrada', 'USER_PASSWORD_ALREADY_EXISTS');
        }

        return nuevoUsuarioContrasena;
    } 
    catch (error) {
        if (!(error instanceof CustomError)) {
            logger.error(`Error en createUserPassword: ${error.message}`);
            throw internalServerError('Error al crear la contraseña del usuario', 'USER_PASSWORD_CREATION_ERROR');
        }
        throw error;
    }
};

module.exports = { createUserPassword };
