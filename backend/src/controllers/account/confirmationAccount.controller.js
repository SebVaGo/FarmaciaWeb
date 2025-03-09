const validate = require('../../helpers/validate.helper.js');
const confirmDeviceCodeSchema = require('../../schemas/account/confirmDeviceCode.schema.js');
const { confirmAccount } = require('../../services/account/confirmationAccount.service.js');

const confirmDeviceCode = async (req, res, next) => {
    try {

        const tipo_codigo = '2'; // Fijo para device-confirmation

        await validate.main(confirmDeviceCodeSchema, req.body);

        const response = await confirmAccount(null, req.body.correo_electronico, req.body.codigo, tipo_codigo);

        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
}


const confirmCode = async (req, res, next) => {
    try {
        await validate.main(confirmationAccountSchema, req.body);

        const response = await confirmAccount(req.userId, req.body.codigo);

        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
}

const confirmAccountCode = async (req, res, next) => {
    try {
        await validate.main(confirmationAccountSchema, req.body);

        const response = await confirmAccount(req.userId, req.body.codigo);

        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
}



module.exports = { confirmCode, confirmAccountCode, confirmDeviceCode };
