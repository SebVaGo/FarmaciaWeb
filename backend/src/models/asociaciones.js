// src/models/asociaciones.js
const Usuario = require('./Usuario');
const UsuarioId = require('./UsuarioId');
const UsuarioContrasena = require('./UsuarioContrasena');
const Rol = require('./Rol'); 
const CodigoVerificacion = require('./CodigoVerificacion'); 
const EstadoUsuario = require('./EstadoUsuario');


const setupAssociations = () => {
  // Relación Usuario - Rol
  Usuario.belongsTo(Rol, { foreignKey: 'id_rol', onDelete: 'SET NULL' });
  Rol.hasMany(Usuario, { foreignKey: 'id_rol' });
  
  // Relación Usuario - UsuarioId
  Usuario.hasMany(UsuarioId, { foreignKey: 'id_usuario' });
  UsuarioId.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });

  // Relación Usuario - CodigoVerificacion
  Usuario.hasMany(CodigoVerificacion, { foreignKey: 'id_usuario' });
  CodigoVerificacion.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });

  //Relación Usuario - EstadoUsuario
  Usuario.belongsTo(EstadoUsuario, { foreignKey: 'id_estado', as : 'estado' });
  EstadoUsuario.hasMany(Usuario, { foreignKey: 'id_estado' }); 

};

module.exports = setupAssociations;