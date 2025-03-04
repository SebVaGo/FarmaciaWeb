const joi = require('joi');

const loginUserSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

module.exports = { loginUserSchema };