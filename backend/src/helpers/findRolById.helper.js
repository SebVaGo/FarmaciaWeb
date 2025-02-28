const Rol = require ('../models/Rol.js');
const logger = require('../configurations/logger.js');
const { notFoundError, internalServerError } = require('../helpers/error.helper.js');
const CustomError = require('../helpers/customError.helper.js');

const findRolById = async (id) => {
    try{
        if (!id) {
            throw notFoundError('ID de rol no proporcionado');
        }
        const role = await Rol.findByPk(id, {
            attributes : ['nombre', 'descripcion']
        });

        if (!role) {
            logger.warn(`Rol no encontrado`);
            throw notFoundError(`Rol no encontrado`, 'ROLE_NOT_FOUND');
        }

        return {
            nombre: role.nombre,
            descripcion: role.descripcion
        };
    
    }catch(error){
        if (!(error instanceof CustomError)) {
            logger.error(`Error en findRolById: ${error.message}`);
            throw internalServerError('No se pudo obtener el rol', 'FIND_ONE_ROLE_ERROR');
        }
        throw error;
    }
}

module.exports = { findRolById };
    