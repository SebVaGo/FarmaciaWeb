const UsuarioGuidRepository = require('../../repositories/UsuarioIdRepository');
const logger = require('../../configurations/logger.js');
const CustomError = require('../../helpers/customError.helper');
const { 
    conflictError, 
    internalServerError
} = require('../../helpers/error.helper.js');

const guidHelper = require('../../helpers/guid.helper');

const createUserGUID = async (id_usuario, transaction) => {
    try {

        const usuarioGuid = guidHelper.generateGuid();
        if (!usuarioGuid) {
            throw internalServerError('Error al generar el GUID del usuario', 'GUID_GENERATION_ERROR');
        }

        const [usuarioId, created] = await UsuarioGuidRepository.findOrCreate(id_usuario, usuarioGuid, transaction);

        if (!created) {
            throw conflictError('El usuario ya tiene un GUID registrado', 'USER_GUID_ALREADY_EXISTS');
        }

        return usuarioId;
    } catch (error) {
        throw error instanceof CustomError ? error : internalServerError('Error al crear el GUID del usuario', 'CREATE_USER_GUID_ERROR');
    }
};

module.exports = { createUserGUID };
