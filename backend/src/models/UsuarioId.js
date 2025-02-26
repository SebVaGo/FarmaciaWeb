const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Usuario = require('./Usuario');

const UsuarioId = sequelize.define('UsuarioId', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    usuario_guid: { type: DataTypes.STRING(36), allowNull: false, unique: true },
    estado: { type: DataTypes.BOOLEAN, defaultValue: true },
    fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fecha_actualizacion: { type: DataTypes.DATE }
}, { tableName: 'UsuarioId', timestamps: false });

// Relaciones
UsuarioId.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });

module.exports = UsuarioId;