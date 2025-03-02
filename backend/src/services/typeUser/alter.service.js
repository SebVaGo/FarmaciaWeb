const RolRepository = require('../../repositories/RolRepository');
const logger = require('../../configurations/logger.js');
const { notFoundError, internalServerError } = require('../../helpers/error.helper.js');
const CustomError = require('../../helpers/customError.helper');

const alterRole = async (roleId, roleData) => {
    try {
        const existingRole = await RolRepository.updateRole(roleId, roleData);
        
        if (!existingRole) {
            logger.error(`Error en updateRole: El rol con ID ${roleId} no existe.`);
            throw notFoundError(`El rol con ID ${roleId} no existe.`, 'ROLE_NOT_FOUND');
        }

        return {
            message: 'Rol actualizado correctamente',
            updatedRole: {
                id: existingRole.id,
                nombre: existingRole.nombre,
                descripcion: existingRole.descripcion
            }
        };

    } catch (error) {
        if (!(error instanceof CustomError)) {
            logger.error(`Error en alterRole: ${error.message}`);
            throw internalServerError('Error al actualizar el rol', 'ROLE_UPDATE_ERROR');
        }
        throw error;
    }
};

module.exports = { alterRole };
