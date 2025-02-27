const Usuario = require('../models/Usuario.js');
const logger = require('../configurations/logger.js');
const CustomError = require('../helpers/customError.helper.js');
const { conflictError, internalServerError } = require('../helpers/error.helper.js');

const verifyEmail = async (correo_electronico) => {
    try{
        const usuario = await Usuario.findByPk( correo_electronico );
        return !!usuario;
    }
    catch(error){
        if (!(error instanceof CustomError)) {
            logger.error(`Error en verifyEmail: ${error.message}`);
            throw internalServerError('Error al verificar el email', 'EMAIL_VERIFICATION_ERROR');
        }
        throw error;
    }
}

module.exports = { verifyEmail };



