const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const nodemailer = require('nodemailer');

console.log('📩 Configurando transporte de correo...');
console.log(`📧 Usuario SMTP: ${process.env.EMAIL_USER}`);

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Error en la configuración de transporte:', error);
    } else {
        console.log('✅ Configuración de transporte correcta. Listo para enviar correos.');
    }
});

module.exports = transporter;
