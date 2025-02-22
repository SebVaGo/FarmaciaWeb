const updateRoleSchema = require('../../schemas/typeUser/alter.schema.js');
const validate = require('../../helpers/validate.helper.js');
const {alterRole} = require("../../services/typeUser/index.service.js");

const alter = async (req, res, next) => {
    try {
        //Se valida el esquema
        await validate.main(updateRoleSchema, req.body);

        //Se prepara respuesta
        const { roleId, role } = req.body;
        const response = await alterRole(roleId, role);

        //Se envía respuesta
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
}

module.exports = { alter };

