const Rol = require('../models/Rol.js');
const logger = require('../configurations/logger.js');
const CustomError = require('../helpers/customError.helper.js');

const verifyRol = async (id_rol) => {
    try {
        const rol = await Rol.findByPk( id_rol );
        return !!rol;
    }
    catch (error) {
        if (!(error instanceof CustomError)) {
            logger.error(`Error en verifyRol: ${error.message}`);
            throw internalServerError('Error al verificar el rol', 'ROL_VERIFICATION_ERROR');
        }
        throw error;
    }
}

module.exports = { verifyRol };

