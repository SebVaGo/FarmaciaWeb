const Joi = require('joi');

const updateRoleSchema = Joi.object({
    roleId: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'El ID del rol debe ser un número.',
            'number.integer': 'El ID del rol debe ser un número entero.',
            'number.positive': 'El ID del rol debe ser un número positivo.',
            'any.required': 'El ID del rol es obligatorio.'
        }),
    role: Joi.object({
        nombre: Joi.string().max(50)
            .messages({
                'string.base': 'El nombre debe ser un texto.',
                'string.max': 'El nombre no puede tener más de 50 caracteres.'
            }),
        descripcion: Joi.string().allow(null, '').pattern(new RegExp('^[a-zA-Z0-9 ]*$')).max(255)
            .messages({
                'string.base': 'La descripción debe ser un texto.',
                'string.pattern.base': 'La descripción solo puede contener letras, números y espacios.',
            }),
        activo: Joi.boolean()
            .messages({
                'boolean.base': 'El estado activo debe ser un valor booleano.'
            })
    }).required()
        .messages({
            'any.required': 'El objeto de rol es obligatorio.'
        })
});

module.exports = updateRoleSchema;
