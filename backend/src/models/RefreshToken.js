const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Usuario = require('./Usuario');
const UserSession = require('./UserSession');

const RefreshToken = sequelize.define('RefreshToken', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    id_session: { type: DataTypes.INTEGER, allowNull: false },
    refresh_token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    is_revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
    issued_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    expires_at: { type: DataTypes.DATE, allowNull: false }
}, { tableName: 'refresh_tokens', timestamps: false });

// Relaciones
RefreshToken.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
RefreshToken.belongsTo(UserSession, { foreignKey: 'id_session', onDelete: 'CASCADE' });

module.exports = RefreshToken;
