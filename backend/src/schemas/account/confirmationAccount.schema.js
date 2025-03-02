const joi = require('joi');

const confirmationAccountSchema = joi.object({
    usuario_guid: joi.string().uuid().required().messages({
        'string.base': 'El usuario guid debe ser un string.',
        'string.empty': 'El usuario guid es obligatorio.',
        'string.guid': 'El usuario guid debe ser un UUID válido.',
        'any.required': 'El usuario guid es obligatorio.'
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

module.exports = confirmationAccountSchema;
