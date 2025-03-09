const validate = require('../../helpers/validate.helper.js');
const sendCodeDeviceSchema = require('../../schemas/account/sendCodeDevice.schema.js');
const {sendCodeVerification} = require('../../services/account/index.service.js');
const {createNewInformation} = require('../../services/middleware/index.service.js');

const sendCodeDeviceConfirmation = async (req, res, next) => {
    try {
        const { email: correo_electronico } = req.params; // Extrae desde params
        const tipo_codigo = '2'; // Fijo para device-confirmation

        console.log('correo_electronico', correo_electronico);
        console.log('tipo_codigo', tipo_codigo);

        await validate.main(sendCodeDeviceSchema, {correo_electronico});

        const response = await sendCodeVerification(null, correo_electronico, tipo_codigo);

        if (!response) {
            throw new Error('Error al enviar código de verificación');
        }        
        
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

const sendCodeAccountConfirmation = async (req, res, next) => {
    try {

        const params = { 
            usuario_guid: req.params.usuario_guid, 
            tipo_codigo: req.query.tipo_codigo // Extraer tipo de código desde query params
        };

        await validate.main(sendCodeSchema, req.params);

        const response = await sendCodeVerification(req.userId, params.tipo_codigo);

        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
}


module.exports = { sendCodeAccountConfirmation, sendCodeDeviceConfirmation };
