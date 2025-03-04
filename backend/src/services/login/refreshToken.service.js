const RefreshTokenRepository = require('../../repositories/RefreshTokenRepository');
const  CustomError = require('../../helpers/customError.helper');
const { internalServerError } = require('../../helpers/error.helper');
const { generateRefreshToken } = require('../../helpers/token.helper');

const refreshTokenCreate = async (userId, sessionId) => {

    try {
        const existingToken = await RefreshTokenRepository.findByUser(userId);

        if (existingToken) {
            await RefreshTokenRepository.deleteByUser(userId);
        }

        const refreshToken = generateRefreshToken({ id: userId });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Expira en 7 días

        const refreshTokenData = await RefreshTokenRepository.create({
            id_usuario: userId,
            refresh_token: refreshToken,
            id_session: sessionId,  // Asegúrate de que sessionId no sea null
            expires_at: expiresAt   // Agrega la fecha de expiración
        });

        return refreshTokenData;
    } catch (error) {
        throw error instanceof CustomError ? error : internalServerError('Error al crear el token de refresco', 'CREATE_REFRESH_TOKEN_ERROR');
    }
};

const validateRefreshToken = async (refreshToken) => {
    try{
        const storedToken = await RefreshTokenRepository.findByToken(refreshToken);
        if (!storedToken) {
            throw internalServerError('Token de refresco no encontrado', 'REFRESH_TOKEN_NOT_FOUND');
        }
        
        const decodedToken = verifyToken(refreshToken, process.env.REFRESH_SECRET);
        if (!decodedToken) {
            throw internalServerError('Token de refresco inválido', 'INVALID_REFRESH_TOKEN');
        }

        return { valid: true, userId: decodedToken.id };
    }catch(error){
        throw error instanceof CustomError ? error : internalServerError('Error al validar el token de refresco', 'VALIDATE_REFRESH_TOKEN_ERROR');
    }
}

const revokeRefreshToken = async (refreshToken) => {
    try{
        const storedToken = await RefreshTokenRepository.findByToken(refreshToken);
        if (!storedToken) {
            throw internalServerError('Token de refresco no encontrado', 'REFRESH_TOKEN_NOT_FOUND');
        }

        await RefreshTokenRepository.revokeToken(storedToken.id);
    }catch(error){
        throw error instanceof CustomError ? error : internalServerError('Error al revocar el token de refresco', 'REVOKE_REFRESH_TOKEN_ERROR');
    }
}

module.exports = { refreshTokenCreate, validateRefreshToken, revokeRefreshToken };
