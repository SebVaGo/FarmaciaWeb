const UsuarioId = require('../models/UsuarioId');

class UsuarioGuidRepository {
    async findByUserId(id_usuario, transaction = null) {
        return await UsuarioId.findOne({ where: { id_usuario }, transaction });
    }

    async findByGuid(usuario_guid, transaction = null) {
        return await UsuarioId.findOne({
            where: { usuario_guid },
            attributes: ['id_usuario'],
            transaction
        });
    }

    async create(id_usuario, usuario_guid, transaction = null) {
        return await UsuarioId.create({ id_usuario, usuario_guid }, { transaction });
    }

    async findOrCreate(id_usuario, usuario_guid, transaction = null) {
        return await UsuarioId.findOrCreate({
            where: { id_usuario },
            defaults: { usuario_guid },
            transaction
        });
    }
    
}

module.exports = new UsuarioGuidRepository();

