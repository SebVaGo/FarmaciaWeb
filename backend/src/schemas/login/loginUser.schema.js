const joi = require('joi');

const loginUserSchema = joi.object({
    email: joi.string().trim().lowercase().email().max(100).required().messages({
            'string.empty': "El correo es obligatorio.",
            'any.required': "El correo es obligatorio.",
            'string.email': "Debe ser un correo válido.",
            'string.max': "No debe superar los 100 caracteres."
        }),
    password: joi.string().trim().min(8).max(50)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
            'string.empty': "La contraseña es obligatoria.",
            'any.required': "La contraseña es obligatoria.",
            'string.min': "Debe tener al menos 8 caracteres.",
            'string.max': "No debe superar los 50 caracteres.",
            'string.pattern.base': "Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial."
        })
});

module.exports = { loginUserSchema };