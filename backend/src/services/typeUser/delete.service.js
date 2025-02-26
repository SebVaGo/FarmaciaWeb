const Role = require('../../models/Rol.js');
const logger = require('../../configurations/logger.js');
const { notFoundError, internalServerError } = require('../../helpers/error.helper.js');
const CustomError = require('../../helpers/customError.helper');

const deleteRole = async (roleId) => {
    try {
        const deletedRows = await Role.destroy({ where: { id: roleId } });

        if (!deletedRows) {
            logger.error(`Error en deleteRole: No se pudo eliminar el rol con id ${roleId}`);
            
            throw new CustomError(`Rol no encontrado`, 404, 'ROLE_NOT_FOUND');
        }

        return { message: 'Rol eliminado correctamente' };
    } catch (error) {
        if (!(error instanceof CustomError)) {
            logger.error(`Error en deleteRole: ${error.message}`);
            throw internalServerError('Error al intentar eliminar el rol', 'DELETE_ROLE_ERROR');
        }
        throw error;
    }
};

module.exports = { deleteRole };