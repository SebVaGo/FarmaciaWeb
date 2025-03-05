const validate = require('../../helpers/validate.helper.js');
const { loginUserSchema } = require('../../schemas/login/loginUser.schema.js');
const { LoginUser } = require('../../services/login/index.service.js');

const loginUserHandler = async (req, res, next) => {

    try{
        //Validar el esquema
        await validate.main(loginUserSchema, req.body);

        //Llamar al servicio de loginUser
        const response = await LoginUser(req.body.email, req.body.password, res);
        
        //Enviar respuesta
        res.status(200).json(response);

    }catch(error){
        next(error);
    }
}


module.exports = {loginUserHandler};