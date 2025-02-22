const joi = require('joi');

const findTypeUserSchema = joi.object({
    roleId: joi.number().integer().positive().min(1).required()
});

module.exports = findTypeUserSchema;
