const EstadoUsuario = require('../models/EstadoUsuario');

class EstadoUsuarioRepository {

    async findById(id, transaction = null) {
        return await EstadoUsuario.findByPk(id, { transaction });
    }
}

module.exports = new EstadoUsuarioRepository();
