const Role = require('../../models/Rol.js');
const logger = require('../../configurations/logger.js');
const { conflictError, internalServerError } = require('../../helpers/error.helper.js');
const CustomError = require('../../helpers/customError.helper');

const createRol = async (role) => {
    try {
        const [newRole, created] = await Role.findOrCreate({
            where: { nombre: role.nombre },
            defaults: { descripcion: role.descripcion }
        });

        if (!created) {
            logger.error(`Error en createRole: El rol '${role.nombre}' ya existe.`);
            throw conflictError(`El rol '${role.nombre}' ya existe.`, 'ROLE_ALREADY_EXISTS');
        }

        return newRole;
    } catch (error) {
        if (!(error instanceof CustomError)) {
            logger.error(`Error en createRole: ${error.message}`);
            throw internalServerError('Error al crear el rol', 'ROLE_CREATION_ERROR');
        }
        throw error;
    }
};

module.exports = { createRol };