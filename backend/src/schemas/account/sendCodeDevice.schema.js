const joi = require('joi');

const sendCodeDeviceSchema = joi.object({

    correo_electronico: joi.string().trim().lowercase().email().max(100).required().messages({
        'string.empty': "El correo es obligatorio.",
        'any.required': "El correo es obligatorio.",
        'string.email': "Debe ser un correo válido.",
        'string.max': "No debe superar los 100 caracteres."
    })
});

module.exports = sendCodeDeviceSchema;