// src/repositories/CodigoVerificacionRepository.js
const CodigoVerificacion = require('../models/CodigoVerificacion');
const { Op } = require('sequelize');

class CodigoVerificacionRepository {
    async deleteByUserId(userId, transaction = null) {
        return await CodigoVerificacion.destroy({ where: { id_usuario: userId }, transaction });
    }

    async create(data, transaction = null) {
        return await CodigoVerificacion.create(data, { transaction });
    }
    
    async findValidCode(userId, code, transaction = null) {
        return await CodigoVerificacion.findOne({
            where: {
                id_usuario: userId,
                codigo: code,
                expiracion: { [Op.gt]: new Date() },
                usado: false
            },
            transaction
        });
    }

    async markCodeAsUsed(userId, code, transaction = null) {
        return await CodigoVerificacion.update(
            { usado: true },
            { where: { id_usuario: userId, codigo: code }, transaction }
        );
    }

    async markCodeAsUsedByTypeAndId(userId, type, transaction = null) {
        return await CodigoVerificacion.update(
            { usado: true },
            { where: { id_usuario: userId, id_tipo: type }, transaction }
        );
    }

    async updateStatusCodeByTypeAndId(userId, type, status, transaction = null) {
        return await CodigoVerificacion.update(
            { status },
            { where: { id_usuario: userId, id_tipo: type }, transaction }
        );
    }

}

module.exports = new CodigoVerificacionRepository();