const joi = require('joi');

const sendCodeSchema = joi.object({
        usuario_guid: joi.string().uuid().required().messages({
            'string.empty': 'El GUID de usuario es obligatorio.',
            'string.uuid': 'El GUID de usuario debe ser un UUID válido.',
            'any.required': 'El GUID de usuario es obligatorio.'
        })
    });

module.exports = sendCodeSchema;