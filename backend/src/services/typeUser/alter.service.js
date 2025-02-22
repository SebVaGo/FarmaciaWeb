const Role = require('../../models/Role.js');
const logger = require('../../configurations/logger.js');

const alterRole = async (roleId, role) => {
    try {
        const [updatedRows] = await Role.update(role, { where: { id: roleId } });

        if (updatedRows === 0) {
            
            logger.error(`Error en alterRole: No se pudo actualizar el rol con id ${roleId}`);
            throw new Error('No se pudo actualizar el rol');
        }

        return { message: 'Rol actualizado correctamente' };
    } catch (error) {
        logger.error(`Error en alterRole: ${error.message}`);
        throw new Error('Error al intentar actualizar el rol');
    }
}

module.exports = { alterRole };