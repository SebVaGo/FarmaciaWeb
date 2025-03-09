const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Usuario = require('./Usuario');

const CodigoVerificacion = sequelize.define('CodigoVerificacion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiracion: {
    type: DataTypes.DATE,
    allowNull: false
  },
  usado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  id_tipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'CodigoVerificacion',
  timestamps: false
});

module.exports = CodigoVerificacion;