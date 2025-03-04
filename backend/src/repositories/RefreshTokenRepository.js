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

    async deleteExpiredTokens() {
        return await RefreshToken.destroy({ where: { expires_at: { [Op.lt]: new Date() } } });
    }
}

module.exports = new RefreshTokenRepository();
