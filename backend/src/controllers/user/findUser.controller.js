const getUserSchema = require('../../schemas/user/findUser.schema.js');
const validate = require('../../helpers/validate.helper.js');
const { findAll } = require('../../services/user/index.service.js');

const findAllUsers = async (req, res, next) => {
    try {
        const response = await findAll(req.body);

        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
}

module.exports = { findAllUsers };
