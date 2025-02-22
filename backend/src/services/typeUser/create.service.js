const Role = require('../../models/Role.js');
const logger = require('../../configurations/logger.js');

const createRol = async (role) => {
    try{
        const newRole = await Role.create(role);
        return newRole;
    }
    catch (error){
        logger.error(`Error en createRole: ${error.message}`);
        throw new Error('No se pudo crear el rol');
    }
}

module.exports = { createRol }; 