const joi = require('joi');

const createUserSchema = joi.object({
    numero_documento: joi.string().trim().length(8).pattern(/^[0-9]+$/).required().messages({
        'string.empty': "El número de documento es obligatorio.",
        'any.required': "El número de documento es obligatorio.",
        'string.length': "Debe tener exactamente 8 dígitos.",
        'string.pattern.base': "Debe contener solo números."
    }),
    primer_nombre: joi.string().trim().max(50).pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/).required().messages({
        'string.empty': "El primer nombre es obligatorio.",
        'any.required': "El primer nombre es obligatorio.",
        'string.max': "No debe superar los 50 caracteres.",
        'string.pattern.base': "No debe contener caracteres especiales ni números."
    }),
    segundo_nombre: joi.string().trim().max(50).pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/).allow(null, '').messages({
        'string.max': "No debe superar los 50 caracteres.",
        'string.pattern.base': "No debe contener caracteres especiales ni números."
    }),
    apellido_paterno: joi.string().trim().max(50).pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/).required().messages({
        'string.empty': "El apellido paterno es obligatorio.",
        'any.required': "El apellido paterno es obligatorio.",
        'string.max': "No debe superar los 50 caracteres.",
        'string.pattern.base': "No debe contener caracteres especiales ni números."
    }),
    apellido_materno: joi.string().trim().max(50).pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/).required().messages({
        'string.empty': "El apellido materno es obligatorio.",
        'any.required': "El apellido materno es obligatorio.",
        'string.max': "No debe superar los 50 caracteres.",
        'string.pattern.base': "No debe contener caracteres especiales ni números."
    }),
    correo_electronico: joi.string().trim().lowercase().email().max(100).required().messages({
        'string.empty': "El correo es obligatorio.",
        'any.required': "El correo es obligatorio.",
        'string.email': "Debe ser un correo válido.",
        'string.max': "No debe superar los 100 caracteres."
    }),
    celular: joi.string().trim().length(9).pattern(/^[0-9]+$/).required().messages({
        'string.max': "No debe superar los 9 caracteres.",
        'string.empty': "El número de celular es obligatorio.",
        'string.pattern.base': "Debe contener solo números."
    }),
    direccion: joi.string().trim().pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ .,\-#]+$/).required().messages({
        'string.empty': "Debe ingresar una dirección válida.",
        'string.pattern.base': "No debe contener caracteres especiales no permitidos."
    }),
    fecha_nacimiento: joi.date().max('now').min('1920-01-01').required().messages({
        'date.max': "No puede ser mayor a la fecha actual.",
        'date.empty': "La fecha de nacimiento es obligatoria.",
        'date.min': "No puede ser menor a 1920.",
        'date.base': "Debe ser una fecha válida."
    }),
    id_rol: joi.number().integer().required().messages({
        'number.integer': "El rol debe ser un número entero.",
        'number.empty': "El rol es obligatorio.",
        'number.base': "Debe ser un número válido."
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

module.exports = createUserSchema;
