const Usuario = require('../models/Usuario.js');
const logger = require('../configurations/logger.js');
const CustomError = require('../helpers/customError.helper.js');
const { conflictError, internalServerError } = require('../helpers/error.helper.js');

const verifyDni = async (numero_documento) => {
    try {
        const usuario = await Usuario.findOne({
            where: {
                numero_documento: numero_documento
            }
        });
        
        console.log('Usuario encontrado por DNI:', usuario);
        
        return !!usuario;
    }
    catch(error) {
        if (!(error instanceof CustomError)) {
            logger.error(`Error en verifyDni: ${error.message}`);
            throw internalServerError('Error al verificar el DNI', 'DNI_VERIFICATION_ERROR');
        }
        throw error;
    }
}

module.exports = { verifyDni };



