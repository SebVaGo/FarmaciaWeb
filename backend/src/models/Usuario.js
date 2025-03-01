const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Rol = require('./Rol');
const UsuarioId = require('./UsuarioId');

const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    numero_documento: { type: DataTypes.STRING(9), allowNull: false, unique: true },
    primer_nombre: { type: DataTypes.STRING(50), allowNull: false },
    segundo_nombre: { type: DataTypes.STRING(50), allowNull: true },
    apellido_paterno: { type: DataTypes.STRING(50), allowNull: false },
    apellido_materno: { type: DataTypes.STRING(50), allowNull: false },
    correo_electronico: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    celular: { type: DataTypes.STRING(20) },
    direccion: { type: DataTypes.TEXT },
    fecha_nacimiento: { type: DataTypes.DATE, allowNull: true,
      get() {
        const rawValue = this.getDataValue('fecha_nacimiento');

        if (!rawValue) return null; 
        
        const dateObject = new Date(rawValue); 
        
        if (isNaN(dateObject)) {
            console.error("Error: fecha_nacimiento no es una fecha válida:", rawValue);
            return null;
        }

        return dateObject.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }   },
    is_logged_in: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    id_rol: { type: DataTypes.INTEGER, allowNull: true },
    fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fecha_actualizacion: { type: DataTypes.DATE },
    fecha_anulacion: { type: DataTypes.DATE }
}, { tableName: 'Usuario', timestamps: false });

// Relaciones

module.exports = Usuario;


