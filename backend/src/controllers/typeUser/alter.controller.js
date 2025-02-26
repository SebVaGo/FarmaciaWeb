const updateRoleSchema = require('../../schemas/typeUser/alter.schema.js');
const validate = require('../../helpers/validate.helper.js');
const { alterRole } = require('../../services/typeUser/index.service.js');

const alter = async (req, res, next) => {
    try {
        // Validar el esquema
        await validate.main(updateRoleSchema, req.body);

        // Extraer los datos
        const { roleId, role } = req.body;

        // Ejecutar la actualización
        const response = await alterRole(roleId, role);

        // Responder con éxito
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = { alter };
