const Joi = require('joi');

const getTypeVerificactionCodeSchema = Joi.object({
    codeId: Joi.number()
        .integer()
        .positive()
        .min(1)
        .required()
        .messages({
            'number.base': "El 'roleId' debe ser un número válido",
            'number.integer': "El 'roleId' debe ser un número entero",
            'number.positive': "El 'roleId' debe ser un número positivo",
            'number.min': "El 'roleId' debe ser mayor a 0",
            'any.required': "El 'roleId' es obligatorio"
        })
});

module.exports = getTypeVerificactionCodeSchema;
