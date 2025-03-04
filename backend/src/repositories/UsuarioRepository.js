const Usuario = require('../models/Usuario');
const UsuarioId = require('../models/UsuarioId');
const Rol = require('../models/Rol');
const { Op, QueryTypes } = require('sequelize');
const { sequelize } = require('../db/index.js');

class UsuarioRepository {
    async findById(id, transaction = null) {
        return await Usuario.findByPk(id, {transaction});
    }

    async getUserWithDetails(correo, transaction = null) {
        return await sequelize.query(
            `SELECT 
                u.correo_electronico,
                u.id,
                u.is_verified,
                u.primer_nombre,
                c.clave_hash,
                e.nombre AS estado_usuario
            FROM usuario u
            JOIN estado_usuario e ON u.id_estado = e.id
            JOIN usuariocontrasena c ON u.id = c.id_usuario
            WHERE u.correo_electronico = :correo`,
            {
                replacements: { correo },
                type: QueryTypes.SELECT,
                transaction
            }
        );
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
    // Actualiza un usuario existente
    async update(id, userData, transaction = null) {
        const result = await Usuario.update(
            userData,
            {
                where: { id },
                transaction
            }
        );
        
        return result[0] > 0; // Retorna true si se actualizó al menos un registro
    }

    // Verifica si existe un usuario con el mismo correo o documento, excluyendo el usuario actual
    async checkUserExistsExcept({ correo_electronico }, id_usuario, transaction = null) {
        const whereClause = { id: { [Op.ne]: id_usuario } }; // Excluir el usuario actual
        
        if (correo_electronico) {
            whereClause.correo_electronico = correo_electronico;
        } else {
            return null;
        }      
        return await Usuario.findOne({
            where: whereClause,
            transaction
        });
    }
    

}

module.exports = new UsuarioRepository();
