const Role = require('../../models/Role.js');
const logger = require('../../configurations/logger.js');

const deleteRole = async (roleId) => {
    try {
        const deletedRows = await Role.destroy({ where: { id: roleId } });

        if (deletedRows === 0) {
            logger.error(`Error en deleteRole: No se pudo eliminar el rol con id ${roleId}`);
            throw new error.NotFoundError('Rol no encontrado');  
        }

        return { message: 'Rol eliminado correctamente' };
    } catch (error) {
        logger.error(`Error en deleteRole: ${error.message}`);
        throw new Error('Error al intentar eliminar el rol');
    }
};

module.exports = { deleteRole };
