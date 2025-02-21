const Role = require('../../models/Role.js');
const logger = require('../../configurations/logger.js');

const create = async (role) => {
    try{
        console.log('Datos en el servicio:', role);
        const newRole = await Role.create(role);
        return newRole;
    }
    catch (error){
        logger.error(`Error en createRole: ${error.message}`);
        throw new Error('No se pudo crear el rol');
    }
}

module.exports = { create }; 