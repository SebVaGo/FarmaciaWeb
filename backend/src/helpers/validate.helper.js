const errorHelper = require('./error.helper.js');
const logger = require('../configurations/logger.js');

const main = async (schema, data) => {
    try {
        await schema.validateAsync(data, { abortEarly: false }); // Permitir múltiples errores
    } catch (error) {
        const errorMsg = error.details?.[0]?.message || error.message || 'Error de validación';  
        logger.warn(`Validación fallida: ${errorMsg}`); // Cambiado de error a warn
        throw errorHelper.badRequestError(errorMsg);
    }
};

module.exports = { main };
