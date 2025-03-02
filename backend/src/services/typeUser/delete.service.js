const RolRepository = require('../../repositories/RolRepository');
const logger = require('../../configurations/logger.js');
const { notFoundError, internalServerError } = require('../../helpers/error.helper.js');
const CustomError = require('../../helpers/customError.helper');

const deleteRole = async (roleId) => {
    try {
        const deletedRows = await RolRepository.deleteRole(roleId);

        if (!deletedRows) {
            logger.error(`Error en deleteRole: No se pudo eliminar el rol con id ${roleId}`);
            throw notFoundError('Rol no encontrado', 'ROLE_NOT_FOUND');
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