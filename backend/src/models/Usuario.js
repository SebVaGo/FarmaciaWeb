const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Rol = require('./Rol');

const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    numero_documento: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    nombres: { type: DataTypes.STRING(100), allowNull: false },
    apellidos: { type: DataTypes.STRING(100), allowNull: false },
    correo_electronico: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    celular: { type: DataTypes.STRING(20) },
    direccion: { type: DataTypes.TEXT },
    fecha_nacimiento: { type: DataTypes.DATE },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    estado: { type: DataTypes.BOOLEAN, defaultValue: true },
    id_rol: { type: DataTypes.INTEGER, allowNull: true },
    fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fecha_actualizacion: { type: DataTypes.DATE },
    fecha_anulacion: { type: DataTypes.DATE }
}, { tableName: 'Usuario', timestamps: false });

// Relaciones
Usuario.belongsTo(Rol, { foreignKey: 'id_rol', onDelete: 'SET NULL' });

module.exports = Usuario;
