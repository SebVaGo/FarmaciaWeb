const LoginRecord = require('../models/LoginRecord');
const { sequelize } = require('../db/index.js');
const { Op, QueryTypes } = require('sequelize');

class LoginRecordRepository {

    async findByUserAndIpOrDevice(id_usuario, ip, device, location) {
        const query = `
            SELECT id, status FROM login_record 
            WHERE id_usuario = :id_usuario 
            AND (ip = :ip OR device = :device OR location = :location)
            LIMIT 1;
        `;
    
        const [result] = await sequelize.query(query, {
            replacements: { id_usuario, ip, device, location },
            type: sequelize.QueryTypes.SELECT
        });
    
        return result || null; // Retorna el objeto con `id` y `status`, o null si no hay coincidencias
    }

    /**
     * 2️⃣ Insertar un nuevo registro si no existía
     */
    async addIpInformation(id_usuario, ip, location, device, transaction = null) {
        const query = `
            INSERT INTO login_record (id_usuario, ip, location, device)
            VALUES (:id_usuario, :ip, :location, :device);
        `;
        await sequelize.query(query, {
            replacements: { id_usuario, ip, location, device },
            type: sequelize.QueryTypes.INSERT,
            transaction
        });
    }

    async updateStatusByUser(id_usuario, status, transaction = null) {
        const query = `
            UPDATE login_record
            SET status = :status
            WHERE id_usuario = :id_usuario AND status = 'inactive';
        `;
        await sequelize.query(query, {
            replacements: { id_usuario, status },
            type: sequelize.QueryTypes.UPDATE,
            transaction
        });
    }

    async create(data, transaction = null) {
        return LoginRecord.create(data, { transaction });
    }
}

module.exports = new LoginRecordRepository();