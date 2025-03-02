const { sendEmail } = require('../../helpers/sendEmail.helper.js'); // Helper para enviar correo
const CustomError = require('../../helpers/customError.helper.js');
const { internalServerError } = require('../../helpers/error.helper.js');
const { generateCode } = require('./generateCode.service.js');
const logger = require('../../configurations/logger.js');

const sendCode = async (id_usuario) => {
    try {
        const [codigo, correo_electronico] = await generateCode(id_usuario);

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
                logger.error(" Error al enviar correo en segundo plano:", err);
                });
        });

        return { message: 'El correo está siendo envíado' };

    } catch (error) {
        if (!(error instanceof CustomError)) {
            throw internalServerError('Error inesperado al enviar el código de verificación', 'SENDING_CODE_ERROR');
        }
        throw error;
    }
};


module.exports = { sendCode };
