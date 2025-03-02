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

    async update(id_usuario, clave_hash, transaction = null) {
        const result = await UsuarioContrasena.update({ clave_hash },
            { where: { id_usuario }, transaction}
        );
        
        return result[0] > 0;
    }

}

module.exports = new UsuarioContrasenaRepository();