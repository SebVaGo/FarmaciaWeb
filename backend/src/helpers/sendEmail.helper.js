const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const transporter = require('../configurations/emailConfig');

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        console.log(`📧 Enviando correo a: ${to}`);
        console.log(`📨 Asunto: ${subject}`);
        console.log(`📜 Texto: ${text}`);
        console.log(`📄 HTML: ${html}`);
        console.log(`📤 Enviando desde: ${process.env.EMAIL_USER}`);

        if (!to) {
            throw new Error('Destinatario no definido');
        }

        const info = await transporter.sendMail({
            from: `"Soporte" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });

        console.log(`✅ Correo enviado con éxito: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`❌ Error al enviar correo: ${error.message}`);
        return false;
    }
};

module.exports = { sendEmail };
