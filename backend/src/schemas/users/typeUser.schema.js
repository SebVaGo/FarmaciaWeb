const joi = require('joi');

const typeUserSchema = joi.object({
    role_name: joi.string().min(3).max(50).required(),
    description: joi.string().min(3).max(255).required()
});

module.exports = typeUserSchema;