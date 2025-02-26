const Role = require('../../models/Rol.js');
const logger = require('../../configurations/logger.js');
const { notFoundError, internalServerError } = require('../../helpers/error.helper.js'); 
const CustomError = require('../../helpers/customError.helper.js'); 

const findAll = async () => {
    try{
        const roles = await Role.findAll();

        if (!roles || roles.length === 0) {
            logger.warn('No se encontraron roles');
            throw notFoundError('No se encontraron roles', 'ROLES_NOT_FOUND');
        }
        return roles;
    }
    catch (error){
        logger.error(`Error en findAllRole: ${error.message}`);

        if (error instanceof CustomError) {
            throw error;
        }
        throw internalServerError('No se pudo obtener los roles', 'FIND_ALL_ROLES_ERROR');
    }
}
const findOne = async (id) => {
    try {
        if (!id) {
            throw notFoundError('ID de rol no proporcionado');
        }

        const role = await Role.findByPk(id);

        if (!role) {
            logger.warn(`Rol con id ${id} no encontrado`);
            throw notFoundError(`Rol con id ${id} no encontrado`, 'ROLE_NOT_FOUND');
        }

        return role;
    } catch (error) {
        if (!(error instanceof CustomError)) {
            logger.error(`Error en findOneRole: ${error.message}`);
            throw internalServerError('No se pudo obtener el rol', 'FIND_ONE_ROLE_ERROR');
        }
        throw error;
    }
};

module.exports = { findAll, findOne}; 