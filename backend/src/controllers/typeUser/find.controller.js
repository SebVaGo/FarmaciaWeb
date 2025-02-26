const findTypeUserSchema = require("../../schemas/typeUser/find.schema.js");
const validate = require("../../helpers/validate.helper.js");
const {findOne, findAll} = require("../../services/typeUser/index.service.js");
const logger = require("../../configurations/logger.js");

const getAllRoles = async (req, res, next) => {
    try {
        // Obtiene todos los roles
        const roles = await findAll();


        res.status(200).json(roles);
    } catch (error) {
        logger.error(`Error en getAllRoles: ${error.message}`);
        next(error);
    }
};

const getRoleById = async (req, res, next) => {
    try {
        // Validamos el ID recibido
        await validate.main(findTypeUserSchema, req.params);

        // Buscamos el rol por ID
        const role = await findOne(req.params.roleId);

        res.status(200).json(role);
    } catch (error) {
        logger.error(`Error en getRoleById: ${error.message}`);
        next(error);
    }
};

module.exports = { getAllRoles, getRoleById };