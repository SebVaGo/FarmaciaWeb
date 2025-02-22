const joi = require('joi');

const createUserSchema = joi.object({
    username: joi.string().min(3).max(50).required().regex(/^[a-zA-Z0-9\s]+$/),
    email: joi.string().email().required(),
    password: joi.string()
    .min(8)
    .max(50)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .required()
    .messages({
        "string.pattern.base": "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial.",
        "string.min": "La contraseña debe tener al menos 8 caracteres.",
        "string.max": "La contraseña no puede tener más de 50 caracteres.",
        "any.required": "La contraseña es obligatoria."
    }),
    role_id: joi.number().integer().required()
});

module.exports = createUserSchema;


