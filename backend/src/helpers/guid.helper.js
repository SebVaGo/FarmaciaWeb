const { v4: uuidv4 } = require('uuid');
const logger = require('../configurations/logger.js');
const { internalServerError } = require('./error.helper.js');

const generateGuid = () => {
    try {
        const guid = uuidv4();
        if (typeof guid !== 'string' || !guid) {
            throw new Error('GUID generado no es válido');
        }
        return guid;
    } 
    catch (error) {
        logger.error(`Error en generateGuid: ${error.message}`);
        throw internalServerError('Error al generar GUID', 'GUID_GENERATION_ERROR');
    }
};

module.exports = { generateGuid };
