const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Usuario = require('./Usuario');

const UserSession = sequelize.define('UserSession', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    ip_address: { type: DataTypes.STRING(45), allowNull: false },
    location: { type: DataTypes.STRING(255) },
    device_info: { type: DataTypes.STRING(255) },
    status: { type: DataTypes.ENUM('active', 'inactive'), allowNull: false },
    access_token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    expires_at: { type: DataTypes.DATE, allowNull: false }
}, { tableName: 'user_sessions', timestamps: false });


module.exports = UserSession;