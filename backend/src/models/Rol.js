const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Rol = sequelize.define('Rol', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'Rol', timestamps: false });

module.exports = Rol;
