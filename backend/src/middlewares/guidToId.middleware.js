const UsuarioID = require('../models/UsuarioId.js');
const logger = require('../configurations/logger.js');
const CustomError = require('../helpers/customError.helper.js');

const guidToId = async (req, res, next) => {
    try {
        const usuario_guid = req.body.usuario_guid || req.params.usuario_guid || req.query.usuario_guid;
        
        if (!usuario_guid) {
            return next(badRequestError('GUID del usuario es requerido', 'USER_GUID_REQUIRED'));
        }
        
        const userMapping = await UsuarioID.findByPk(usuario_guid);
        
        if (!userMapping) {
            return next(notFoundError('Usuario no encontrado', 'USER_NOT_FOUND'));
        }

        req.userId = userMapping.id_usuario;
        next();
    }
    catch (error) {
        next(internalServerError('Error al convertir GUID a ID', 'GUID_TO_ID_ERROR'));
    }
}
module.exports = { guidToId };


