const validate = require('../../helpers/validate.helper.js');
const confirmationAccountSchema = require('../../schemas/account/confirmationAccount.schema.js');
const { confirmAccount } = require('../../services/account/confirmationAccount.service.js');

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

module.exports = { confirmCode };
