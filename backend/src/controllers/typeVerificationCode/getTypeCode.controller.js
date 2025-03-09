const getTypeVerificactionCodeSchema = require("../../schemas/TypeVerificationCode/typeVerificationCode.schema.js");
const validate = require("../../helpers/validate.helper.js");
const { findOne } = require("../../services/typeVerification/index.service.js");
const logger = require("../../configurations/logger.js");

const getTypeVerificactionCode = async (req, res, next) => {

    try {
        // Validamos el ID recibido
        await validate.main(getTypeVerificactionCodeSchema, req.params);

        // Buscamos el rol por ID
        const typeCode = await findOne(req.params.codeId);

        res.status(200).json(typeCode);
        
    } catch (error) {
        logger.error(`Error en getRoleById: ${error.message}`);
        next(error);
    }
};

module.exports = { getTypeVerificactionCode };