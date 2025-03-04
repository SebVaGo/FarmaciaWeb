const UserSession = require('../models/UserSession');

class UserSessionRepository {
    async create(sessionData) {
        return await UserSession.create(sessionData);
    }

    async findByUser(userId) {
        return await UserSession.findOne({ where: { id_usuario: userId, status: 'active' } });
    }

    async updateSessionStatus(sessionId, status) {
        return await UserSession.update({ status }, { where: { id: sessionId } });
    }

    async findActiveByUser(userId) {
        return await UserSession.findOne({ where: { id_usuario: userId, status: 'active' } });
    }

    async deleteById(sessionId) {
        return await UserSession.destroy({ where: { id: sessionId } });
    }

}


module.exports = new UserSessionRepository();
