const joi = require('joi');

const updateUserSchema = joi.object({
    usuario_guid: joi.string().uuid().required().messages({
            'string.base': 'El usuario guid debe ser un string.',
            'string.empty': 'El usuario guid es obligatorio.',
            'string.guid': 'El usuario guid debe ser un UUID válido.',
            'any.required': 'El usuario guid es obligatorio.'
    }),
    correo_electronico: joi.string().trim().lowercase().email().max(100).messages({
        'string.email': "Debe ser un correo válido.",
        'string.max': "No debe superar los 100 caracteres."
    }),
    celular: joi.string().trim().length(9).pattern(/^[0-9]+$/).messages({
        'string.length': "Debe tener exactamente 9 caracteres.",
        'string.pattern.base': "Debe contener solo números."
    }),
    direccion: joi.string().trim().pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ .,\-#]+$/).messages({
        'string.pattern.base': "No debe contener caracteres especiales no permitidos."
    }),
    id_rol: joi.number().integer().messages({
        'number.integer': "El rol debe ser un número entero.",
        'number.base': "Debe ser un número válido."
    }),
    id_estado: joi.number().integer().messages({
        'number.integer': "El estado debe ser un número entero.",
        'number.base': "Debe ser un número válido."
    }),
    password: joi.string().trim().min(8).max(50)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .messages({
            'string.min': "Debe tener al menos 8 caracteres.",
            'string.max': "No debe superar los 50 caracteres.",
            'string.pattern.base': "Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial."
        })
});

module.exports = updateUserSchema;
