// src/models/asociaciones.js
const Usuario = require('./Usuario');
const UsuarioId = require('./UsuarioId');
const UsuarioContrasena = require('./UsuarioContrasena');
const Rol = require('./Rol'); 
const CodigoVerificacion = require('./CodigoVerificacion'); 
const EstadoUsuario = require('./EstadoUsuario');
const RefreshToken = require('./RefreshToken');
const UserSession = require('./UserSession');


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

  //Relación Usuario - UserSession
  UserSession.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
  Usuario.hasMany(UserSession, { foreignKey: 'id_usuario' });

  //Relación Usuario - EstadoUsuario
  Usuario.belongsTo(EstadoUsuario, { foreignKey: 'id_estado', as : 'estado' });
  EstadoUsuario.hasMany(Usuario, { foreignKey: 'id_estado' }); 

  //Relación Usuario - RefreshToken
  Usuario.hasMany(RefreshToken, { foreignKey: 'id_usuario' });
  RefreshToken.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });

  //Relación UserSession - RefreshToken
  UserSession.hasMany(RefreshToken, { foreignKey: 'id_session' });
  RefreshToken.belongsTo(UserSession, { foreignKey: 'id_session', onDelete: 'CASCADE' });

};

module.exports = setupAssociations;