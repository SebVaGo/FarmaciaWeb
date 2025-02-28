const Usuario = require('../../models/Usuario');
const { sequelize } = require('../../db/index.js');

const logger = require('../../configurations/logger.js');

const CustomError = require('../../helpers/customError.helper');

const 
{ 
    conflictError, 
    internalServerError, 
    badRequestError 
} = require('../../helpers/error.helper.js');

const { verifyEmail } = require('../../verifications/verifyEmail.helper.js');
const { verifyDni } = require('../../verifications/verifyDni.helper.js');
const { verifyRol } = require('../../verifications/verifyRol.helper.js');

const { createUserGUID } = require('./createUserGuid.service');
const { createUserPassword } = require('./createUserPassword.service');

const createUser = async (userData) => {

    const transaction = await sequelize.transaction();
    
    try {
        if (!userData) {
            throw badRequestError('Los datos del usuario son obligatorios', 'USER_DATA_REQUIRED');
        }

        /*
        const { correo_electronico, numero_documento, password } = userData;
        
        
        if (!correo_electronico || !numero_documento || !password) {
            throw badRequestError('Correo, número de documento y contraseña son obligatorios', 'MISSING_REQUIRED_FIELDS');
        }

        */
        if (!(await verifyRol(userData.id_rol))) {
            throw badRequestError('El rol no es válido', 'INVALID_ROLE');
        }

        if (await verifyEmail(correo_electronico)) {
            throw conflictError('El email ya se encuentra registrado', 'EMAIL_ALREADY_EXISTS');
        }

        if (await verifyDni(numero_documento)) {
            throw conflictError('El DNI ya se encuentra registrado', 'DNI_ALREADY_EXISTS');
        }
        
        const newUserData = {
            ...userData,
            is_verified: false,
            is_logged_in: false
        };


        const createdUser = await Usuario.create(newUserData, { transaction });
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
            fecha_nacimiento: createdUser.fecha_nacimiento,
            verificacion: createdUser.is_verified,
        };
    } 
    catch (error) {
        await transaction.rollback();

        if (!(error instanceof CustomError)) {
            logger.error(`Error en createUser: ${error.message}, userData: ${JSON.stringify(userData)}`);
            throw internalServerError('Error al crear el usuario', 'USER_CREATION_ERROR');
        }
        throw error;
    }
};

module.exports = { createUser };
