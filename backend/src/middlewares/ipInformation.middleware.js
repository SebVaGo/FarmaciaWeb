const { verificarSesionActiva, verificarRegistroDispositivo, registrarAccesoDispositivo, createNewInformation } = require('../services/middleware/index.service');
const { internalServerError} = require('../helpers/error.helper');
const { sendCodeVerification } = require('../services/account/index.service');
const CustomError = require('../helpers/customError.helper');
const  logger  = require('../configurations/emailConfig');

const getIpInformation = async (req, res, next) => {
    try {
        const { email, ip, location, device } = req.body;

        const necesitaVerificacion = await verificarRegistroDispositivo(email, ip, location, device);

        if (necesitaVerificacion) {
            await manejarVerificacion(email, ip, location, device);
            return res.status(401).json({ message: 'Verificación requerida. Se envió un código a su correo.' });
        }
        next();

    } catch (error) {
        logger.error(`Error al obtener información de la IP: ${error.message}`, { error, stack: error.stack });
        next(error instanceof CustomError ? error : internalServerError('Error al obtener información de la IP', 'GET_IP_INFORMATION_ERROR'));
    }
};

const manejarVerificacion = async (email, ip, location, device) => {
    try {
        const tipo_codigo = '2'; // Device-confirmation
        await Promise.all([
            sendCodeVerification(null, email, tipo_codigo),
            createNewInformation(null, email, ip, location, device)
        ]);
    } catch (error) {
        logger.error(`Error en la verificación de dispositivo: ${error.message}`, { error });
        throw internalServerError('Error en el proceso de verificación', 'DEVICE_VERIFICATION_ERROR');
    }
};

module.exports = { getIpInformation };

