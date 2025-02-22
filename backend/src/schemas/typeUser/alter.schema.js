const joi = require('joi');

const updateRoleSchema = joi.object({
    roleId: joi.number().integer().positive().required(),
    role: joi.object({
        role_name: joi.string().min(3).max(50).regex(/^[a-zA-Z0-9\s]+$/),
        description: joi.string().min(3).max(255).regex(/^[a-zA-Z0-9\s]+$/)
    }).min(1).required()
}); 

module.exports = updateRoleSchema;
