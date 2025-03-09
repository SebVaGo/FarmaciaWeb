const TipoCodigoVerificacionRepository = require('../../repositories/TipoCodigoVerificacionRepository');
const logger = require('../../configurations/logger.js');
const { notFoundError, internalServerError } = require('../../helpers/error.helper.js');
const CustomError = require('../../helpers/customError.helper.js');

const findOne = async (id) => {
    console.log('id', id);
    try{
        const typeCode = await TipoCodigoVerificacionRepository.findById(id);
        
        console.log('typeCode', typeCode);
        
        if(!typeCode){
            logger.warn(`Tipo de código de verificación con id ${id} no encontrado`);
            throw notFoundError(`Tipo de código de verificación no encontrado`, 'TYPE_VERIFICATION_CODE_NOT_FOUND');
        }
        return typeCode.nombre;
    }catch(error){
        if (!(error instanceof CustomError)) {
            logger.error(`Error en getTypeCode: ${error.message}`);
            throw internalServerError('No se pudo obtener el tipo de código', 'TYPE_CODE_ERROR');
        }
        throw error;
    }
}

module.exports = { findOne };
