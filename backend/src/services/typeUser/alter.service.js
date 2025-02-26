const Role = require('../../models/Rol.js');
const logger = require('../../configurations/logger.js');
const { notFoundError, internalServerError } = require('../../helpers/error.helper.js');
const CustomError = require('../../helpers/customError.helper');

const alterRole = async (roleId, roleData) => {
    try {
        const existingRole = await Role.findByPk(roleId);
        if (!existingRole) {
            logger.error(`Error en alterRole: El rol con ID ${roleId} no existe.`);
            throw notFoundError(`El rol con ID ${roleId} no existe.`, 'ROLE_NOT_FOUND');
        }

        if (Object.keys(roleData).length === 0) {
            return { message: 'No se realizaron cambios, no se enviaron campos válidos.' };
        }

        await existingRole.update(roleData);

        return {
            message: 'Rol actualizado correctamente',
            updatedRole: {
                id: existingRole.id,
                nombre: roleData.nombre ?? existingRole.nombre,
                descripcion: roleData.descripcion ?? existingRole.descripcion,
                activo: roleData.activo ?? existingRole.activo,
            },
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
