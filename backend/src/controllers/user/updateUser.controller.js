const updateUserSchema = require('../../schemas/user/updateUser.schema.js');
const validate = require('../../helpers/validate.helper.js');
const { updateUser } = require('../../services/user/index.service.js');

const update = async (req, res, next) => {
    console.log(req.body);
    try {
        await validate.main(updateUserSchema, req.body);

        const response = await updateUser(req.userId, req.body);

        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
}

module.exports = { update };
