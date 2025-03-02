const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const EstadoUsuario = sequelize.define('EstadoUsuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { 
        type: DataTypes.ENUM('activo', 'suspendido', 'eliminado'), 
        allowNull: false, 
        unique: true 
    }
}, { tableName: 'estado_usuario', timestamps: false  });

module.exports = EstadoUsuario;
