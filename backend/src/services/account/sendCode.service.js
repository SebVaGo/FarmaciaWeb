const { sendEmail } = require('../../helpers/sendEmail.helper.js'); // Helper para enviar correo
const CustomError = require('../../helpers/customError.helper.js');
const { internalServerError, badRequestError } = require('../../helpers/error.helper.js');
const { generateCode } = require('./generateCode.service.js');
const logger = require('../../configurations/logger.js');

const sendCode = async (id_usuario = null, email = null, type) => {

    console.log('sendCode', id_usuario, email, type);
    try {
        if (!type) {
            throw badRequestError('El tipo de código es obligatorio', 'MISSING_CODE_TYPE');
        }

        const [codigo, correo_electronico] = await generateCode(id_usuario, email, type);

        if (!correo_electronico) {
            throw internalServerError('Correo electrónico no definido', 'INVALID_EMAIL');
        }

        setImmediate(() => {
            sendEmail({
                to: correo_electronico,
                subject: 'Código de verificación',
                text: `Tu código de verificación es: ${codigo}`,
                html: `<h1>Tu código de verificación es:</h1><h2>${codigo}</h2>`
            }).catch((err) => {
                logger.error("Error al enviar correo en segundo plano:", err);
            });
        });

        return { message: 'El correo está siendo enviado' };

    } catch (error) {
        if (!(error instanceof CustomError)) {
            logger.error('Error inesperado al enviar el código de verificación:', error);
            throw internalServerError('Error inesperado al enviar el código de verificación', 'SENDING_CODE_ERROR');
        }
        throw error;
    }
};



module.exports = { sendCode };
