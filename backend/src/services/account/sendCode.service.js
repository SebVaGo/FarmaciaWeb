const { sendEmail } = require('../../helpers/sendEmail.helper.js'); // Helper para enviar correo
const CustomError = require('../../helpers/customError.helper.js');
const { internalServerError } = require('../../helpers/error.helper.js');
const { generateCode } = require('./generateCode.service.js');

const sendCode = async (id_usuario) => {
    try {
        console.log(`📨 Iniciando envío de código para el usuario ID: ${id_usuario}`);

        // Generar código de verificación
        const [codigo, correo_electronico] = await generateCode(id_usuario);

        console.log(`📧 Intentando enviar código a: ${correo_electronico}`);

        if (!correo_electronico) {
            console.error('⚠️ El correo electrónico es inválido o no existe.');
            throw internalServerError('Correo electrónico no definido', 'INVALID_EMAIL');
        }

        // Enviar código por correo
        const emailSend = await sendEmail({
            to: correo_electronico,
            subject: 'Código de verificación',
            text: `Tu código de verificación es: ${codigo}`,
            html: `<h1>Tu código de verificación es:</h1><h2>${codigo}</h2>`
        });

        if (!emailSend) {
            console.error('❌ Error al enviar el correo.');
            throw internalServerError('Error al enviar el código de verificación', 'SENDING_CODE_ERROR');
        }

        console.log('✅ Código enviado correctamente.');
        return { message: 'Código enviado correctamente' };

    } catch (error) {
        console.error('❌ Error en sendCode:', error);
        if (!(error instanceof CustomError)) {
            throw internalServerError('Error inesperado al enviar el código de verificación', 'SENDING_CODE_ERROR');
        }
        throw error;
    }
};


module.exports = { sendCode };
