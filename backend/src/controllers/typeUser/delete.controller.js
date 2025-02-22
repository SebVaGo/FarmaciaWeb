const deleteTypeUserSchema = require("../../schemas/typeUser/delete.schema.js");
const deleteType = require("../../services/typeUser/index.service.js");
const validate = require("../../helpers/validate.helper.js");
const logger = require("../../configurations/logger.js");

const deleteTypeUser = async (req, res, next) => {
    try {
        // Validamos el ID recibido
        await validate.main(deleteTypeUserSchema, req.params);

        // Eliminamos el rol
        const response = await deleteType.deleteRole(req.params.roleId);

        if (!response) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }

        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error en deleteTypeUser: ${error.message}`);
        next(error);
    }
}

module.exports = { deleteTypeUser };
