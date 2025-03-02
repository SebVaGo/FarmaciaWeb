const UsuarioGuidRepository = require('../../repositories/UsuarioIdRepository');
const logger = require('../../configurations/logger.js');
const { notFoundError , internalServerError } = require('../../helpers/error.helper');
const CustomError = require('../../helpers/customError.helper');

const findIdByGuid = async (usuario_guid) => {
    try {
        const userMapping = await UsuarioGuidRepository.findByGuid(usuario_guid);
        
        if (!userMapping) {
            throw notFoundError('Guid no encontrado', 'GUID_NOT_FOUND');
        }
        
        return userMapping.id_usuario;
    } catch (error) {
        if (!(error instanceof CustomError)) {
            logger.error(`Error en guidToId: ${error.message}, usuario_guid: ${usuario_guid}`);
            throw internalServerError('Error al convertir GUID a ID', 'GUID_TO_ID_ERROR');
        }
        throw error;
    }
}

module.exports = { findIdByGuid };

