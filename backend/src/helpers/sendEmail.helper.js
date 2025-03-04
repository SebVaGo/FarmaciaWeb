const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const transporter = require('../configurations/emailConfig');

const sendEmail = async ({ to, subject, text, html }) => {
    try {
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

        return true;
    } catch (error) {
        return false;
    }
};

module.exports = { sendEmail };
