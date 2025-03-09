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
    }),
    tipo: joi.string()
        .valid('account-verification', 'device-confirmation', 'password-reset', 'two-factor')
        .required()
        .messages({
            'any.only': 'El tipo de código debe ser uno de: account-verification, device-confirmation, password-reset, two-factor.',
            'string.empty': 'El tipo de código es obligatorio.',
            'any.required': 'El tipo de código es obligatorio.'
    }) 
});

module.exports = confirmationAccountSchema;
