const joi = require('joi');

const sendCodeSchema = joi.object({
        usuario_guid: joi.string().uuid().required().messages({
            'string.empty': 'El GUID de usuario es obligatorio.',
            'string.uuid': 'El GUID de usuario debe ser un UUID válido.',
            'any.required': 'El GUID de usuario es obligatorio.'
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

module.exports = sendCodeSchema;