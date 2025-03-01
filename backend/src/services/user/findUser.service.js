const Usuario = require('../../models/Usuario.js');
const Rol = require('../../models/Rol.js');
const UsuarioId = require('../../models/UsuarioId.js');
const logger = require('../../configurations/logger.js');
const { notFoundError, internalServerError } = require('../../helpers/error.helper.js');
const CustomError = require('../../helpers/customError.helper.js');

const findOne = async (id) => {

    console.log(id);

    try {
        const user = await Usuario.findOne({
            where: { id },
            attributes: ['id', 'correo_electronico', 'numero_documento', 'primer_nombre', 'segundo_nombre', 
                        'apellido_paterno', 'apellido_materno', 'celular', 'direccion', 
                        'fecha_nacimiento', 'is_verified', 'id_rol'],
            include: [
                {
                    model: Rol,
                    attributes: ['nombre', 'descripcion']
                },
                {
                    model: UsuarioId,
                    attributes: ['usuario_guid'],
                    where: { estado: true },
                    required: false
                }
            ]
        });

        if (!user) {
            throw notFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
        }

        return {
            usuario_guid: user.UsuarioIds && user.UsuarioIds.length > 0 ? user.UsuarioIds[0].usuario_guid : null,
            correo: user.correo_electronico,
            dni: user.numero_documento,
            primer_nombre: user.primer_nombre,
            segundo_nombre: user.segundo_nombre,
            apellido_paterno: user.apellido_paterno,
            apellido_materno: user.apellido_materno,
            celular: user.celular,
            direccion: user.direccion,
            fecha_nacimiento: user.fecha_nacimiento,
            verificacion: user.is_verified,
            rol_nombre: user.Rol?.nombre || 'Sin rol',
            rol_descripcion: user.Rol?.descripcion || 'Sin descripción'
        };

    } catch (error) {
        logger.error(`Error en findOne: ${error.message}`);

        if (error instanceof CustomError) {
            throw error;
        }
        throw internalServerError('No se pudo obtener el usuario', 'FIND_ONE_USER_ERROR');
    }
}


const findAll = async () => {
    try {
        const users = await Usuario.findAll({
            attributes: ['id', 'correo_electronico', 'numero_documento', 'primer_nombre', 'apellido_paterno', 'apellido_materno', 'is_verified', 'id_rol'],
            include: [
                {
                    model: Rol,
                    attributes: ['nombre', 'descripcion']
                },
                {
                    model: UsuarioId,
                    attributes: ['usuario_guid'],
                    where: { estado: true },
                    required: false
                }
            ]
        });

        if (!users || users.length === 0) {
            throw notFoundError('No se encontraron usuarios', 'USERS_NOT_FOUND');
        }

        return users.map(user => ({
            usuario_guid: user.UsuarioIds && user.UsuarioIds.length > 0 ? user.UsuarioIds[0].usuario_guid : null,
            correo: user.correo_electronico,
            dni: user.numero_documento,
            primer_nombre: user.primer_nombre,
            apellido_paterno: user.apellido_paterno,
            apellido_materno: user.apellido_materno,
            verificacion: user.is_verified,
            rol_nombre: user.Rol?.nombre || 'Sin rol',
            rol_descripcion: user.Rol?.descripcion || 'Sin descripción'
        }));

    } catch (error) {
        logger.error(`Error en findAll: ${error.message}`);

        if (error instanceof CustomError) {
            throw error;
        }
        throw internalServerError('No se pudo obtener los usuarios', 'FIND_ALL_USER_ERROR');
    
    }
}

module.exports = { findAll, findOne };


