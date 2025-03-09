const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const TipoCodigoVerificacion = sequelize.define('TipoCodigoVerificacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'tipo_codigoverificacion',
    timestamps: false
});

module.exports = TipoCodigoVerificacion;
