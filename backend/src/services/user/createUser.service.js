const UsuarioRepository = require('../../repositories/UsuarioRepository');
const RolRepository = require('../../repositories/RolRepository');

const { sequelize } = require('../../db/index.js');
const logger = require('../../configurations/logger.js');
const CustomError = require('../../helpers/customError.helper');
const { conflictError, internalServerError, badRequestError } = require('../../helpers/error.helper.js');

const { createUserGUID } = require('./createUserGuid.service');
const { createUserPassword } = require('./createUserPassword.service');

const createUser = async (userData) => {
    const transaction = await sequelize.transaction();
    try {
        if (!userData) {
            throw badRequestError('Los datos del usuario son obligatorios', 'MISSING_USER_DATA');
        }

        
        //VALIDACIONES
        const { correo_electronico, numero_documento, password, id_rol } = userData;
        
        const rolExists = await RolRepository.findById(id_rol, transaction);
        if (!rolExists) {
            throw badRequestError('El rol no es válido', 'INVALID_ROLE');
        }

        const existingUser = await UsuarioRepository.checkUserExists({ 
            correo_electronico, 
            numero_documento 
        }, transaction);

        if (existingUser) {
            if (existingUser.correo_electronico === correo_electronico) {
                throw conflictError('El email ya se encuentra registrado', 'EMAIL_ALREADY_EXISTS');
            }
            if (existingUser.numero_documento === numero_documento) {
                throw conflictError('El DNI ya se encuentra registrado', 'DNI_ALREADY_EXISTS');
            }
        }

        //FIN VALIDACIONES
        
        const newUserData = { ...userData, is_verified: false, is_logged_in: false };
        const createdUser = await UsuarioRepository.create(newUserData, transaction);

        const usuarioGuid = await createUserGUID(createdUser.id, transaction);
        await createUserPassword(createdUser.id, password, transaction);

        await transaction.commit();

        return {
            usuario_guid: usuarioGuid.usuario_guid,
            dni: createdUser.numero_documento,
            primer_nombre: createdUser.primer_nombre,
            apellido_paterno: createdUser.apellido_paterno,
            correo: createdUser.correo_electronico,
            direccion: createdUser.direccion,
            fecha_nacimiento: createdUser.fecha_nacimiento
        };
    } catch (error) {
        await transaction.rollback();
        if (!(error instanceof CustomError)) {
            logger.error(`Error en createUser: ${error.message}, userData: ${JSON.stringify(userData)}`);

            throw internalServerError('Error al crear el usuario', 'CREATE_USER_ERROR');
        }
        throw error;
    }
};

module.exports = { createUser };
