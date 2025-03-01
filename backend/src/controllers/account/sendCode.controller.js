const validate = require('../../helpers/validate.helper.js');
const sendCodeSchema = require('../../schemas/account/sendCode.schema.js');
const {sendCodeEmailVerification} = require('../../services/account/index.service.js');

const sendCode = async (req, res, next) => {
    try {
        await validate.main(sendCodeSchema, req.params);

        const response = await sendCodeEmailVerification(req.userId);

        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
}

module.exports = { sendCode };
