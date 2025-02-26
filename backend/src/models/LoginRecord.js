const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./Usuario');

const LoginRecord = sequelize.define('LoginRecord', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  ip_address: { type: DataTypes.STRING(45), allowNull: false },
  location: { type: DataTypes.STRING(255) },
  device_info: { type: DataTypes.STRING(255) },
  status: { type: DataTypes.ENUM('success', 'failure'), allowNull: false },
}, {
  timestamps: true, // createdAt manejará attempted_at
});

// Relación con User
LoginRecord.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = LoginRecord;
