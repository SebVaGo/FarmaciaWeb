const UsuarioId = require('../../models/UsuarioId');
const logger = require('../../configurations/logger.js');
const CustomError = require('../../helpers/customError.helper');
const { 
    conflictError, 
    internalServerError, 
    badRequestError 
} = require('../../helpers/error.helper.js');
const guidHelper = require('../../helpers/guid.helper');

const createUserGUID = async (id_usuario, transaction) => {
    try {

        if (!id_usuario) {
            throw badRequestError('El ID del usuario es obligatorio', 'USER_ID_REQUIRED');
        }
        if (!transaction) {
            throw internalServerError('La transacción no fue proporcionada', 'TRANSACTION_REQUIRED');
        }

        let usuarioGuid;
        try {
            usuarioGuid = guidHelper.generateGuid();
            if (!usuarioGuid) {
                throw new Error("GUID generado es inválido");
            }
        } catch (guidError) {
            logger.error(`Error al generar GUID: ${guidError.message}`);
            throw internalServerError('Error al generar el GUID del usuario', 'GUID_GENERATION_ERROR');
        }

        const [nuevoUsuarioId, created] = await UsuarioId.findOrCreate({
            where: { id_usuario },
            defaults: { usuario_guid: usuarioGuid },
            transaction
        });

        if (!created) {
            logger.error(`Error en createUserGUID: El usuario '${id_usuario}' ya tiene un GUID.`);
            throw conflictError('El usuario ya tiene un GUID registrado', 'USER_GUID_ALREADY_EXISTS');
        }

        return nuevoUsuarioId;
    } 
    catch (error) {
        if (!(error instanceof CustomError)) {
            logger.error(`Error en createUserGUID: ${error.message}`);
            throw internalServerError('Error al crear el GUID del usuario', 'USER_GUID_CREATION_ERROR');
        }
        throw error;
    }
};

module.exports = { createUserGUID };
