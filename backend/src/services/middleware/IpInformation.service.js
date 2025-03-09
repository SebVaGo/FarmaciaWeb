const LoginRecordRepository = require('../../repositories/LoginRecordRepository');
const UsuarioRepository = require('../../repositories/UsuarioRepository.js');
const { notFoundError, internalServerError } = require('../../helpers/error.helper.js');
const logger = require('../../configurations/emailConfig.js');
const CustomError = require('../../helpers/customError.helper.js');


const STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

// 🔹 1. Verificar si la sesión ya está activa
const verificarSesionActiva = async (correo_electronico) => {
    try {
        const sessionDetails = await UsuarioRepository.getSessionDetails(correo_electronico);
        return sessionDetails?.session_status === STATUS.ACTIVE ? sessionDetails : null;
    } catch (error) {
        logger.error(`Error en verificarSesionActiva: ${error}`);
        throw error instanceof CustomError ? error : internalServerError('Error en verificarSesionActiva', 'VERIFY_SESSION_ERROR');
    }
};

// 🔹 2. Verificar si el dispositivo ya está registrado
const verificarRegistroDispositivo = async (correo_electronico, ip, location, device) => {
    try {
        const sessionDetails = await UsuarioRepository.getSessionDetails(correo_electronico);
        if (!sessionDetails?.user_id) {
            throw notFoundError(`Usuario no encontrado: ${correo_electronico}`, 'USER_NOT_FOUND');
        }

        const existingRecord = await LoginRecordRepository.findByUserAndIpOrDevice(sessionDetails.user_id, ip, location, device);
        
        return !existingRecord || existingRecord.status === STATUS.INACTIVE;
    } catch (error) {
        logger.error(`Error en verificarRegistroDispositivo: ${error}`);
        throw error instanceof CustomError ? error : internalServerError('Error en verificarRegistroDispositivo', 'VERIFY_DEVICE_ERROR');
    }
};

// 🔹 3. Registrar acceso del dispositivo si ya está verificado
const registrarAccesoDispositivo = async (correo_electronico, ip, location, device) => {
    try {
        const sessionDetails = await UsuarioRepository.getSessionDetails(correo_electronico);
        if (!sessionDetails?.user_id) {
            throw notFoundError(`Usuario no encontrado: ${correo_electronico}`, 'USER_NOT_FOUND');
        }
        await LoginRecordRepository.addIpInformation(sessionDetails.user_id, ip, location, device);
    } catch (error) {
        logger.error(`Error en registrarAccesoDispositivo: ${error}`);
        throw error instanceof CustomError ? error : internalServerError('Error en registrarAccesoDispositivo', 'REGISTER_ACCESS_ERROR');
    }
};

const createNewInformation = async (id_usuario = null, correo_electronico = null, ip, location, device) => {
    try {
        if (!id_usuario) {
            const usuario = await UsuarioRepository.findByEmail(correo_electronico);
            if (!usuario) {
                throw notFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
            }
            id_usuario = usuario.id;
        }

        await LoginRecordRepository.create({
            id_usuario,
            ip,
            location,
            device,
            status: STATUS.INACTIVE
        });
    } catch (error) {
        logger.error(`Error en createNewInformation: ${error}`);
        throw error instanceof CustomError ? error : internalServerError('Error al registrar nuevo dispositivo', 'REGISTER_NEW_DEVICE_ERROR');
    }
};

const updateInformation = async (correo_electronico, ip, location, device) => {
    try {
        await LoginRecordRepository.updateStatus(correo_electronico, ip, location, device, STATUS.ACTIVE);
    } catch (error) {
        logger.error(`Error en updateInformation: ${error}`);
        throw error instanceof CustomError ? error : internalServerError('Error en actualizarEstadoDispositivo', 'UPDATE_DEVICE_STATUS_ERROR');
    }}

module.exports = {
    verificarSesionActiva,
    verificarRegistroDispositivo,
    registrarAccesoDispositivo,
    createNewInformation,
    updateInformation
};
