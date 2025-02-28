const createUserSchema = require('../../schemas/user/createUser.schema.js');
const validate = require('../../helpers/validate.helper.js');
const { createUser } = require('../../services/user/index.service.js');

const create = async (req, res, next) => {
    try {
        await validate.main(createUserSchema, req.body);

        const response = await createUser(req.body);

        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
}

module.exports = { create };
