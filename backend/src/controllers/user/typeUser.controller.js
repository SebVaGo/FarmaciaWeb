const typeUserSchema = require("../../schemas/users/typeUser.schema.js");
const validate = require("../../helpers/validate.helper.js");
const typeUserService = require("../../services/user/index.service.js");

const main = async (req, res, next) => {
    try {
        console.log('Datos recibidos:', req.body);
        //Se valida el esquema
        await validate.main(typeUserSchema, req.body);

        console.log('Datos después de validación:', req.body);
        //Se prepara respuesta
        const response = await typeUserService.create(req.body); // Ahora esto coincidirá con lo exportado

        //Se envía respuesta
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
}

module.exports = { main };