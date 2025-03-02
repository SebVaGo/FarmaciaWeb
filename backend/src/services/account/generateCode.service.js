const CodigoVerificacionRepository = require('../../repositories/CodigoVerificacionRepository');
const UsuarioRepository = require('../../repositories/UsuarioRepository');

const { generateVerificationCode } = require('../../helpers/generateCode.helper');
const { notFoundError, internalServerError, forbiddenError } = require('../../helpers/error.helper');
const CustomError = require('../../helpers/customError.helper');

const {sequelize} = require('../../db/index.js');

const generateCode = async (id) => {
    const transaction = await sequelize.transaction();

    try {
        const usuario = await UsuarioRepository.findById(id, transaction);
        if (!usuario) {
            throw notFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
        }

        if (usuario.is_verified) {
            throw forbiddenError('La cuenta ya está verificada, no se puede generar un código.', 'ACCOUNT_ALREADY_VERIFIED');
        }

        const codigo = generateVerificationCode();
        const expiracion = new Date();
        expiracion.setMinutes(expiracion.getMinutes() + 5);

        await CodigoVerificacionRepository.deleteByUserId(usuario.id, transaction);

        await CodigoVerificacionRepository.create({
            id_usuario: usuario.id,
            codigo,
            expiracion,
            usado: false
        }, transaction);

        await transaction.commit();

        return [codigo, usuario.correo_electronico];

    } catch (error) {
        await transaction.rollback();
        throw error instanceof CustomError ? error : new internalServerError('Error al generar el código de verificación', 'GENERATE_CODE_ERROR');

    }
};

module.exports = { generateCode };
