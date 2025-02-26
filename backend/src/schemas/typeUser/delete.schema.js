const joi = require('joi');

const deleteTypeUserSchema = joi.object({
    roleId: joi.number()
        .integer()
        .positive()
        .min(1)
        .required()
        .messages({
            'number.base': "El 'roleId' debe ser un número",
            'number.integer': "El 'roleId' debe ser un número entero",
            'number.positive': "El 'roleId' debe ser un número positivo",
            'number.min': "El 'roleId' debe ser mayor a 0",
            'any.required': "El 'roleId' es obligatorio"
        })
});

module.exports = deleteTypeUserSchema;
