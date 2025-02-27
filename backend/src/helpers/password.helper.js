const bcrypt = require('bcrypt');
const logger = require('../configurations/logger.js');
const { internalServerError, badRequestError } = require('./error.helper.js');

const hashPassword = async (password) => {
    try {
        if (!password || typeof password !== 'string') {
            throw badRequestError('La contraseña no es válida', 'INVALID_PASSWORD');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return { hashedPassword };
    } 
    catch (error) {
        logger.error(`Error en hashPassword: ${error.message}`);
        throw internalServerError('Error al hashear la contraseña', 'PASSWORD_HASHING_ERROR');
    }
};

module.exports = { hashPassword };
