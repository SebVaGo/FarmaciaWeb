const UsuarioRepository = require('../../repositories/UsuarioRepository');
const CodigoVerificacionRepository = require('../../repositories/CodigoVerificacionRepository');
const { sequelize } = require('../../db/index.js');
const { notFoundError, internalServerError } = require('../../helpers/error.helper');
const CustomError = require('../../helpers/customError.helper');

const confirmAccount = async (id_usuario, codigo) => {

    const transaction = await sequelize.transaction();

    try {
        const verificationCode = await CodigoVerificacionRepository.findValidCode(id_usuario, codigo, transaction);
        if (!verificationCode) {
            throw notFoundError('Código inválido o expirado', 'INVALID_CODE');
        }

        await UsuarioRepository.updateVerificationStatus(id_usuario, true, transaction);

        await CodigoVerificacionRepository.markCodeAsUsed(id_usuario, codigo, transaction);

        await transaction.commit();
        return { message: 'Cuenta verificada exitosamente' };
    } catch (error) {
        await transaction.rollback();
        throw error instanceof CustomError ? error : internalServerError('Error al confirmar la cuenta', 'CONFIRM_ACCOUNT_ERROR');
    }
};

module.exports = { confirmAccount };
