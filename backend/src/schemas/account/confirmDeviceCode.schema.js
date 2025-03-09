const joi = require('joi');

const confirmDeviceCodeSchema = joi.object({
    correo_electronico: joi.string().trim().lowercase().email().max(100).required().messages({
        'string.empty': "El correo es obligatorio.",
        'any.required': "El correo es obligatorio.",
        'string.email': "Debe ser un correo válido.",
        'string.max': "No debe superar los 100 caracteres."
    }),
    codigo: joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .required()
    .messages({
        'string.empty': 'El código de verificación es obligatorio.',
        'any.required': 'El código de verificación es obligatorio.',
        'string.length': 'El código de verificación debe tener exactamente 6 dígitos.',
        'string.pattern.base': 'El código de verificación solo puede contener números.'
    })    
});

module.exports = confirmDeviceCodeSchema;
