const RefreshToken = require('../models/RefreshToken');

class RefreshTokenRepository {

    async deleteByUser(userId) {
        return await RefreshToken.destroy({ where: { id_usuario: userId } });
    }
    
    async create(refreshTokenData) {
        return await RefreshToken.create(refreshTokenData);
    }

    async findByToken(token) {
        return await RefreshToken.findOne({ where: { refresh_token: token, is_revoked: false } });
    }

    async findByUser(userId) {
        return await RefreshToken.findOne({ where: { id_usuario: userId, is_revoked: false } });
    }

    async revokeToken(tokenId) {
        return await RefreshToken.update({ is_revoked: true }, { where: { id: tokenId } });
    }

    async revokeTokenByUser(userId) {
        return await RefreshToken.update({ is_revoked: true }, { where: { id_usuario: userId } });
    }

    async deleteExpiredTokens() {
        return await RefreshToken.update(
            { is_revoked: true }, 
            { where: { expires_at: { [Op.lt]: new Date() } } }
        );
    }
    
    async findAllByUser(userId) {
        return await RefreshToken.findAll({ 
            where: { 
                id_usuario: userId,
                is_revoked: false 
            } 
        });
    }
}

module.exports = new RefreshTokenRepository();
