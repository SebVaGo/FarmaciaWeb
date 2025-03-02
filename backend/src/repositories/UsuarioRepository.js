const Usuario = require('../models/Usuario');
const UsuarioId = require('../models/UsuarioId');
const Rol = require('../models/Rol');
const { Op } = require('sequelize');

class UsuarioRepository {
    async findById(id, transaction = null) {
        return await Usuario.findByPk(id, {
            attributes: ['id', 'correo_electronico', 'is_verified'],
            transaction
        });
    }

    async checkUserExists({ correo_electronico, numero_documento }, transaction = null) {
        return await Usuario.findOne({
            where: {
                [Op.or]: [
                    { correo_electronico },
                    { numero_documento }
                ]
            },
            transaction
        });
    }
    

    async updateVerificationStatus(id, isVerified, transaction = null) {
        return await Usuario.update(
            { is_verified: isVerified },
            { where: { id }, transaction }
        );
    }

    async create(userData, transaction = null) {
        return await Usuario.create(userData, { transaction });
    }

    async findAll(transaction = null) {
        return await Usuario.findAll({
            attributes: ['id', 'correo_electronico', 'numero_documento', 'primer_nombre', 'apellido_paterno', 'apellido_materno', 'is_verified', 'id_rol'],
            include: [
                {
                    model: Rol,
                    attributes: ['nombre', 'descripcion']
                },
                {
                    model: UsuarioId,
                    attributes: ['usuario_guid'],
                    where: { estado: true },
                    required: false
                }
            ],
            transaction
        });
    }

    async findOne(id, transaction = null) {
        return await Usuario.findOne({
            where: { id },
            attributes: ['id', 'correo_electronico', 'numero_documento', 'primer_nombre', 'segundo_nombre', 
                        'apellido_paterno', 'apellido_materno', 'celular', 'direccion', 
                        'fecha_nacimiento', 'is_verified', 'id_rol'],
            include: [
                {
                    model: Rol,
                    attributes: ['nombre', 'descripcion']
                },
                {
                    model: UsuarioId,
                    attributes: ['usuario_guid'],
                    where: { estado: true },
                    required: false
                }
            ],
            transaction
        });
    }
}

module.exports = new UsuarioRepository();
