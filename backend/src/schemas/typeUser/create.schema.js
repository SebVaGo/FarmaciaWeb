const joi = require('joi');

const createRolSchema = joi.object({
    role_name: joi.string().min(3).max(50).trim().regex(/^[a-zA-Z0-9\s]+$/).required(),
    description: joi.string().min(3).max(255).trim().regex(/^[a-zA-Z0-9\s]+$/).message(
        { "string.pattern.base": "La descripción solo puede contener letras, números y espacios." }
    ).required()
});

module.exports = createRolSchema;