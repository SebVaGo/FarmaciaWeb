const UsuarioRepository = require('../../repositories/UsuarioRepository.js');
const logger = require('../../configurations/logger.js');
const { notFoundError, internalServerError } = require('../../helpers/error.helper.js');
const CustomError = require('../../helpers/customError.helper.js');

/**
 * Encuentra todos los usuarios
 * @returns {Array} Lista de usuarios formateada
 */
const findAll = async () => {
    try {
        const users = await UsuarioRepository.findAll();
        
        if (!users || users.length === 0) {
            throw notFoundError('No se encontraron usuarios', 'USERS_NOT_FOUND');
        }
        
        return users.map(user => formatUserResponse(user));
    } catch (error) {
        logger.error(`Error en findAll: ${error.message}`);
        
        if (error instanceof CustomError) {
            throw error;
        }
        
        throw internalServerError('No se pudo obtener los usuarios', 'FIND_ALL_USERS_ERROR');
    }
};

/**
 * Encuentra un usuario por su ID
 * @param {string|number} id - ID del usuario a buscar
 * @returns {Object} Datos del usuario formateados
 */
const findOne = async (id) => {
    try {
        const user = await UsuarioRepository.findOne(id);

        if (!user) {
            throw notFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
        }

        return formatUserResponse(user, true);
    } catch (error) {
        logger.error(`Error en findOne: ${error.message}`);

        if (error instanceof CustomError) {
            throw error;
        }
        
        throw internalServerError('No se pudo obtener el usuario', 'FIND_ONE_USER_ERROR');
    }
};

/**
 * Formatea la respuesta del usuario
 * @param {Object} user - Objeto usuario de la base de datos
 * @param {boolean} includeDetails - Indica si se deben incluir detalles adicionales
 * @returns {Object} Datos del usuario formateados
 */
const formatUserResponse = (user, includeDetails = false) => {
    const baseResponse = {
        usuario_guid: getUserGuid(user),
        correo: user.correo_electronico,
        dni: user.numero_documento,
        primer_nombre: user.primer_nombre,
        apellido_paterno: user.apellido_paterno,
        verificacion: user.is_verified,
        rol_nombre: user.Rol?.nombre || 'Sin rol',
        rol_descripcion: user.Rol?.descripcion || 'Sin descripción'
    };

    if (!includeDetails) {
        baseResponse.apellido_materno = user.apellido_materno;
        return baseResponse;
    }

    // Incluir detalles adicionales para la vista detallada de un usuario
    return {
        ...baseResponse,
        segundo_nombre: user.segundo_nombre,
        apellido_materno: user.apellido_materno,
        celular: user.celular,
        direccion: user.direccion,
        fecha_nacimiento: user.fecha_nacimiento
    };
};

/**
 * Extrae el GUID del usuario de manera segura
 * @param {Object} user - Objeto usuario
 * @returns {string|null} GUID del usuario o null si no existe
 */
const getUserGuid = (user) => {
    return user.UsuarioIds && user.UsuarioIds.length > 0 
        ? user.UsuarioIds[0].usuario_guid 
        : null;
};

module.exports = { findAll, findOne };