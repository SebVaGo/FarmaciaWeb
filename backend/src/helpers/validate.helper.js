const errorHelper = require('./error.helper.js');
const logger = require('../configurations/logger.js');

const main = async (schema,data) => {
    try {
        await schema.validateAsync(data);
    }
    catch (error) {
        logger.error(`Error en validate: ${error.message}`);
        throw errorHelper.badRequestError(error.details[0]?.message);
        
    }
}

module.exports = { main };