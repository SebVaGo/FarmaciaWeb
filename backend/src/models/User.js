const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Role = require('./Role');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(50), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role_id: { type: DataTypes.INTEGER, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
});

// Definir la relación con Role
User.belongsTo(Role, { foreignKey: 'role_id', onDelete: 'CASCADE' });

module.exports = User;
