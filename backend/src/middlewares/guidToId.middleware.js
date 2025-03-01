const logger = require('../configurations/logger.js');
const validate = require('../helpers/validate.helper');
const getUserSchema = require('../schemas/user/findUser.schema.js');
const { findIdByGuid } = require('../services/middleware/guidToId.service.js');

const guidToId = async (req, res, next) => {
    try {
        const usuario_guid = req.body.usuario_guid || req.params.usuario_guid || req.query.usuario_guid;

        await validate.main(getUserSchema, { usuario_guid });

        const userMapping = await findIdByGuid(usuario_guid);

        req.userId = userMapping;
        next();
    } catch (error) {
        logger.error(`Error en guidToId: ${error.message}`);
        next(error);
;
    }
};

module.exports = { guidToId };
