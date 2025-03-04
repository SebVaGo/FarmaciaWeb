const UserSessionRepository = require('../../repositories/UserSessionRepository');
const { generateAccessToken } = require('../../helpers/token.helper');

const createSession = async (userId, location, ip , device) => {

    const existingSession = await UserSessionRepository.findActiveByUser(userId);

    if (existingSession) {
        closeSession(existingSession.id);
    }

    const accessToken = generateAccessToken(userId);
    
    const sessionData = {
        id_usuario: userId,
        ip_address: ip,
        location: location,
        device_info: device,
        status: 'active',
        access_token: accessToken,
        expires_at: new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
    };

    const sessionCreated = await UserSessionRepository.create(sessionData);
    
    return sessionCreated.id;
}

const closeSession = async (sessionId) => {
    try{
        const [rowsAffected] = await UserSessionRepository.updateSessionStatus(sessionId, 'inactive');

        // Si no se actualizó ninguna fila, la sesión no existe, implementar manera para cerrar sesión
        if(rowsAffected === 0){
            throw internalServerError('Sesión no encontrada', 'SESSION_NOT_FOUND');
        }

    }catch(error){
        throw error instanceof CustomError ? error : internalServerError('Error al cerrar la sesión', 'CLOSE_SESSION_ERROR');
    }
}

module.exports = { createSession, closeSession };