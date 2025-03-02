const UsuarioRepository = require('../../repositories/UsuarioRepository');
const RolRepository = require('../../repositories/RolRepository');
const EstadoUsuarioRepository = require('../../repositories/EstadoUsuarioRepository');

const { sequelize } = require('../../db/index.js');
const logger = require('../../configurations/logger.js');
const CustomError = require('../../helpers/customError.helper');
const { notFoundError, conflictError, internalServerError, badRequestError } = require('../../helpers/error.helper.js');

const { updateUserPassword } = require('./updateUserPassword.service');

const updateUser = async (id_usuario, userData) => {
    const transaction = await sequelize.transaction();
    try {
        if (!userData) {
            throw badRequestError('Los datos del usuario son obligatorios', 'MISSING_USER_DATA');
        }

        // Verificar que el usuario existe
        const existingUser = await UsuarioRepository.findById(id_usuario, transaction);
        if (!existingUser) {
            throw notFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
        }

        // VALIDACIONES
        const { correo_electronico, numero_documento, password, id_rol, id_estado } = userData;
        
        // Validar rol si se va a actualizar
        if (id_rol) {
            const rolExists = await RolRepository.findById(id_rol, transaction);
            if (!rolExists) {
                throw badRequestError('El rol no es válido', 'INVALID_ROLE');
            }
        }

        // Verificar que el email y número de documento no estén en uso por otro usuario
        if (correo_electronico) {
            const duplicateUser = await UsuarioRepository.checkUserExistsExcept({ 
                correo_electronico
            }, id_usuario, transaction);
        
            if (duplicateUser) {
                throw conflictError('El email ya se encuentra registrado por otro usuario', 'EMAIL_ALREADY_EXISTS');
            }
        }

        if (id_estado) {
            const estadoExists = await EstadoUsuarioRepository.findById(id_estado, transaction);
            if (!estadoExists) {
                throw badRequestError('El estado no es válido', 'INVALID_STATE');
            }
        }

        // FIN VALIDACIONES
        
        // Preparar datos a actualizar (sin incluir password)
        const updateData = { };
        // Incluir solo los campos que son permitidos actualizar según el esquema
        if (correo_electronico !== undefined) updateData.correo_electronico = correo_electronico;
        if (userData.celular !== undefined) updateData.celular = userData.celular;
        if (userData.direccion !== undefined) updateData.direccion = userData.direccion;
        if (id_rol !== undefined) updateData.id_rol = id_rol;
        if (id_estado !== undefined) updateData.id_estado = id_estado;
        
        // Actualizar usuario solo si hay datos para actualizar
        if (Object.keys(updateData).length > 0) {
            const updatedUser = await UsuarioRepository.update(id_usuario, updateData, transaction);
            if (!updatedUser) {
                throw internalServerError('Error al actualizar el usuario', 'UPDATE_USER_ERROR');
            }
        }
        
        // Actualizar contraseña si se incluye
        if (userData.password) {
            await updateUserPassword(id_usuario, userData.password, transaction);
        }

        await transaction.commit();


        // Obtener usuario actualizado para la respuesta
        const refreshedUser = await UsuarioRepository.findById(id_usuario);
        
        return {
            dni: refreshedUser.numero_documento,
            primer_nombre: refreshedUser.primer_nombre,
            apellido_paterno: refreshedUser.apellido_paterno,
            correo: refreshedUser.correo_electronico,
            celular: refreshedUser.celular,
            direccion: refreshedUser.direccion,
            fecha_nacimiento: refreshedUser.fecha_nacimiento
        };
    } catch (error) {
        await transaction.rollback();
        if (!(error instanceof CustomError)) {
            logger.error(`Error en updateUser: ${error.message}, id_usuario: ${id_usuario}, userData: ${JSON.stringify(userData)}`);
            throw internalServerError('Error al actualizar el usuario', 'UPDATE_USER_ERROR');
        }
        throw error;
    }
};

module.exports = { updateUser };