const Usuario = require('../../models/Usuario.js');
const Rol = require('../../models/Rol.js');
const UsuarioId = require('../../models/UsuarioId.js');
const logger = require('../../configurations/logger.js');
const { notFoundError, internalServerError } = require('../../helpers/error.helper.js');
const CustomError = require('../../helpers/customError.helper.js');
/*
const findOne = async (id) => {
    try {
        if (!id?.toString().trim()) {
            throw notFoundError('ID de usuario no proporcionado', 'USER_ID_REQUIRED');
        }

        const user = await Usuario.findByPk(id, {
            attributes: ['id', 'correo_electronico', 'numero_documento', 'primer_nombre', 'apellido_paterno', 'apellido_materno', 'is_verified', 'id_rol'],
            include: [{
                model: Rol,
                attributes: ['nombre', 'descripcion']
            }]
        });

        if (!user) {
            throw notFoundError(`Usuario con id ${id} no encontrado`, 'USER_NOT_FOUND');
        }

        return {
            usuario_guid: id,
            correo: user.correo_electronico,
            dni: user.numero_documento,
            primer_nombre: user.primer_nombre,
            apellido_paterno: user.apellido_paterno,
            apelleido_materno: user.apellido_materno,
            verificacion: user.is_verified,
            rol_nombre: user.Rol?.nombre || 'Sin rol',
            rol_descripcion: user.Rol?.descripcion || 'Sin descripción'
        };
    } catch (error) {
        if (!(error instanceof CustomError)) {
            logger.error(`Error en findOne: ${error.message}`);
            throw internalServerError('No se pudo obtener el usuario', 'FIND_ONE_USER_ERROR');
        }
        throw error;
    }
};
*/

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
        console.error('Error al buscar usuarios:', error);
        throw error;
    }
}

module.exports = { findAll };


