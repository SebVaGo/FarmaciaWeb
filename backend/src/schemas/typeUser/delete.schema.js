const joi = require('joi');

const deleteTypeUserSchema = joi.object({
    roleId: joi.number().integer().positive().min(1).required()
});

module.exports = deleteTypeUserSchema;
