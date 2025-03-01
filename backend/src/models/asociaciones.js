// src/models/asociaciones.js
const Usuario = require('./Usuario');
const UsuarioId = require('./UsuarioId');
const Rol = require('./Rol'); 
const CodigoVerificacion = require('./CodigoVerificacion'); 

const setupAssociations = () => {
  // Relación Usuario - Rol
  Usuario.belongsTo(Rol, { foreignKey: 'id_rol', onDelete: 'SET NULL' });
  Rol.hasMany(Usuario, { foreignKey: 'id_rol' });  // Añade esta línea para la relación inversa
  
  // Relación Usuario - UsuarioId
  Usuario.hasMany(UsuarioId, { foreignKey: 'id_usuario' });
  UsuarioId.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });

  // Relación Usuario - CodigoVerificacion
  Usuario.hasMany(CodigoVerificacion, { foreignKey: 'id_usuario' });
  CodigoVerificacion.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
};

module.exports = setupAssociations;