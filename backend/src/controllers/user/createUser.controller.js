const createUserSchema = require('../../schemas/user/createUser.schema.js');
const validate = require('../../helpers/validate.helper.js');
const { createUser } = require('../../services/user/index.service.js');

const create = async (req, res, next) => {

    console.log('req.body', req.body);

    try {
        // Validate schema
        await validate.main(createUserSchema, req.body);

        // Prepare response
        const response = await createUser(req.body);

        // Send response
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
}

module.exports = { create };
