const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Usuario = require('./Usuario');

const UsuarioContrasena = sequelize.define('UsuarioContrasena', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    clave_hash: { type: DataTypes.STRING(255), allowNull: false },
    fecha_cambio: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'UsuarioContrasena', timestamps: false });

// Relaciones
UsuarioContrasena.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });

module.exports = UsuarioContrasena;

