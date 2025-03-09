const CodigoVerificacionRepository = require('../../repositories/CodigoVerificacionRepository');
const UsuarioRepository = require('../../repositories/UsuarioRepository');

const { generateVerificationCode } = require('../../helpers/generateCode.helper');
const { notFoundError, internalServerError, forbiddenError } = require('../../helpers/error.helper');
const CustomError = require('../../helpers/customError.helper');

const {sequelize} = require('../../db/index.js');

const generateCode = async (id = null, email = null, type) => {
    const transaction = await sequelize.transaction();

    try {
        const usuario = await obtenerUsuario(id, email, type, transaction);
        const codigo = generateVerificationCode();
        const expiracion = new Date();
        expiracion.setMinutes(expiracion.getMinutes() + 5);

        await CodigoVerificacionRepository.markCodeAsUsedByTypeAndId(usuario.id, type, transaction);
        await CodigoVerificacionRepository.create({
            id_usuario: usuario.id,
            codigo,
            expiracion,
            usado: false,
            id_tipo: type
        }, transaction);

        await transaction.commit();
        
        return [codigo, usuario.correo_electronico];
    } catch (error) {
        await transaction.rollback();
        logger.error(`Error al generar el código: ${error.message}`, { error });

        if (error instanceof CustomError) {
            throw error;
        }

        throw internalServerError('Error al generar el código de verificación', 'GENERATE_CODE_ERROR');
    }
};

const obtenerUsuario = async (id, email, type, transaction) => {
    try {
        let usuario = null;

        if (type !== '2' && id) {
            usuario = await UsuarioRepository.findById(id, transaction);
            if (!usuario) {
                throw notFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
            }
            if (usuario.is_verified) {
                throw forbiddenError('La cuenta ya está verificada, no se puede generar un código.', 'ACCOUNT_ALREADY_VERIFIED');
            }
        }

        if (type === '2' && email) {
            usuario = await UsuarioRepository.findByEmail(email, transaction);
            if (!usuario) {
                throw notFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
            }
        }

        if (!usuario) {
            throw badRequestError('No se pudo determinar el usuario para generar el código', 'INVALID_USER_DATA');
        }

        return usuario;
    } catch (error) {
        logger.error(`Error en obtenerUsuario: ${error.message}`, { error });
        throw error;
    }
};


module.exports = { generateCode };
