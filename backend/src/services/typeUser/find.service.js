const Role = require('../../models/Role.js');
const logger = require('../../configurations/logger.js');

const findAll = async () => {
    try{
        const roles = await Role.findAll();
        return roles;
    }
    catch (error){
        logger.error(`Error en findAllRole: ${error.message}`);
        throw new Error('No se pudo obtener los roles');
    }
}

const findOne = async (id) => {
    try{
        const role = await Role.findOne({where: {id}});
        return role;
    }
    catch (error){
        logger.error(`Error en findOneRole: ${error.message}`);
        throw new Error('No se pudo obtener el rol');
    }
}

module.exports = { findAll, findOne}; 