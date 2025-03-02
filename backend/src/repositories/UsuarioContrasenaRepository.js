const UsuarioContrasena = require('../models/UsuarioContrasena');

class UsuarioContrasenaRepository {
    async findByUserId(id_usuario, transaction = null) {
        return await UsuarioContrasena.findOne({ where: { id_usuario }, transaction });
    }

    async create(id_usuario, clave_hash, transaction = null) {
        return await UsuarioContrasena.create({ id_usuario, clave_hash }, { transaction });
    }

    async findOrCreate(id_usuario, clave_hash, transaction = null) {
        return await UsuarioContrasena.findOrCreate({
            where: { id_usuario },
            defaults: { clave_hash },
            transaction
        });
    }
    
}

module.exports = new UsuarioContrasenaRepository();