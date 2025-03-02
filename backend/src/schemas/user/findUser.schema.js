const joi = require('joi');

const getUserSchema = joi.object({
    usuario_guid: joi.string().uuid().required().messages({
        'string.base': 'El usuario guid debe ser un string.',
        'string.empty': 'El usuario guid es obligatorio.',
        'string.guid': 'El usuario guid debe ser un UUID válido.',
        'any.required': 'El usuario guid es obligatorio.'
    })
});

module.exports =  getUserSchema ;


