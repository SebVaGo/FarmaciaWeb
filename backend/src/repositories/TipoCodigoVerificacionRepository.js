const TipoCodigoVerificacion = require('../models/TipoCodigoVerificacion');

class TipoCodigoVerificacionRepository {
    async findAll(transaction = null) {
        return await TipoCodigoVerificacion.findAll({ transaction });
    }

    async findById(id, transaction = null) {
        return await TipoCodigoVerificacion.findByPk(id, { transaction });
    }

    async findByName(nombre, transaction = null) {
        return await TipoCodigoVerificacion.findOne({ where: { nombre }, transaction });
    }
}

module.exports = new TipoCodigoVerificacionRepository();
