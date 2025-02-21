const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  role_name: { type: DataTypes.STRING(50), allowNull: false },
  description: { type: DataTypes.TEXT },
}, {
  timestamps: false, // No queremos createdAt ni updatedAt
});

module.exports = Role;
