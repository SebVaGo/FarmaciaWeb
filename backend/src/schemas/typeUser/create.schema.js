const joi = require('joi');

const createRolSchema = joi.object({
    nombre: joi.string().min(1).messages({
        'string.empty': "El campo 'nombre' no puede estar vacío",
        'any.required': "El campo 'nombre' es obligatorio"
    }).required(),
    descripcion: joi.string().min(3).max(255).trim().regex(/^[a-zA-Z0-9\s]+$/).messages(
        { 'string.empty': "El campo 'descripcion' no puede estar vacío",
        'any.required': "El campo 'descripcion' es obligatorio"}
    ).required()
});

module.exports = createRolSchema;