const { verificarSesionActiva, verificarRegistroDispositivo, registrarAccesoDispositivo, createNewInformation } = require('../services/middleware/index.service');
const { internalServerError} = require('../helpers/error.helper');
const { sendCodeVerification } = require('../services/account/index.service');
const CustomError = require('../helpers/customError.helper');

const getIpInformation = async (req, res, next) => {
    try {

        const { email, ip, location, device } = req.body;

        console.log('[INFO] Datos recibidos:', { email, ip, location, device });

        // Verificar sesión activa
        const sessionDetails = await verificarSesionActiva(email);
        console.log('[INFO] Sesión activa:', sessionDetails);
        /*
        if (sessionDetails) {
            return res.status(200).json({ message: 'Sesión activa' });
        }*/

        // Verificar si el dispositivo/IP ya está registrado
        const necesitaVerificacion = await verificarRegistroDispositivo(email, ip, location, device);
        console.log('[INFO] ¿Necesita verificación?', necesitaVerificacion);

        if (necesitaVerificacion) {
            const tipo_codigo = '2'; // Fijo para device-confirmation
            console.log('[INFO] Enviando código de verificación...');
            console.log('[INFO] Datos para enviar código:', { email, tipo_codigo });

            //Enviando dos códigos de verificación
            await sendCodeVerification(null, email, tipo_codigo);
            // 
            await createNewInformation(null, email, ip, location, device);
            
            return res.status(401).json({ message: 'Verificación requerida. Se envió un código a su correo.' });
        }
/*
        // Registrar acceso
        console.log('[INFO] Registrando acceso del dispositivo...');
        await registrarAccesoDispositivo(email, ip, location, device);

        console.log('[INFO] Acceso registrado con éxito.');
*/
        next();
    } catch (error) {
        console.error('[ERROR] Error en getIpInformation:', error);
        next(error instanceof CustomError ? error : internalServerError('Error al obtener información de la IP', 'GET_IP_INFORMATION_ERROR'));
    }
};


module.exports = { getIpInformation };

