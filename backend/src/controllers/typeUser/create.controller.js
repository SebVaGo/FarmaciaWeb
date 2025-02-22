const createRolSchema = require("../../schemas/typeUser/create.schema.js");
const validate = require("../../helpers/validate.helper.js");
const { createRol } = require("../../services/typeUser/index.service.js");

const create = async (req, res, next) => {
    try {
        //Se valida el esquema
        await validate.main(createRolSchema, req.body);

        //Se prepara respuesta
        const response = await createRol(req.body);

        //Se envía respuesta
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
}

module.exports = { create };