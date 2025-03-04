const validate = require('../../helpers/validate.helper.js');
const { loginUserSchema } = require('../../schemas/login/loginUser.schema.js');
const { loginUser } = require('../../services/login/index.service.js');

const loginUserHandler = async (req, res, next) => {

    try{
        //Validar el esquema
        await validate.main(loginUserSchema, req.body);

        //Llamar al servicio de loginUser
        const response = await loginUser(req.body.email, req.body.password);

        //Enviar respuesta
        res.status(201).json(response);

    }catch(error){
        next(error);
    }
}


module.exports = {loginUserHandler};