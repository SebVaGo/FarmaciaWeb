const UsuarioRepository = require('../../repositories/UsuarioRepository');
const CodigoVerificacionRepository = require('../../repositories/CodigoVerificacionRepository');
const LoginRecordRepository = require('../../repositories/LoginRecordRepository');
const { sequelize } = require('../../db/index.js');
const { notFoundError, internalServerError } = require('../../helpers/error.helper');
const CustomError = require('../../helpers/customError.helper');

/*
    tipo de códigos:
    1 = account-verification
    2 = device-confirmation
    3 = password-reset
    4 = two-factor
*/
const confirmAccount = async (id_usuario=null, correo_electronico=null, codigo, tipo_codigo) => {

    const transaction = await sequelize.transaction();

    try {
        let usuario = null;

        if (tipo_codigo === '2') {
            usuario = await UsuarioRepository.findByEmail(correo_electronico);
            if (!usuario) {
                throw notFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
            }
            id_usuario = usuario.id; 
        }

        const verificationCode = await CodigoVerificacionRepository.findValidCode(id_usuario, codigo, transaction);
        if (!verificationCode) {
            throw notFoundError('Código inválido o expirado', 'INVALID_CODE');
        }

        await CodigoVerificacionRepository.markCodeAsUsed(id_usuario, codigo, transaction);

        if (tipo_codigo === 1) {
            await UsuarioRepository.updateVerificationStatus(id_usuario, true, transaction);
        } else

         if (tipo_codigo === '2') {
            await LoginRecordRepository.updateStatusByUser(id_usuario, 'active', transaction);
        }

        await transaction.commit();
        return { message: 'Confirmación existosa' };

    } catch (error) {
        await transaction.rollback();
        throw error instanceof CustomError ? error : internalServerError('Error al confirmar la cuenta', 'CONFIRM_ACCOUNT_ERROR');
    }
};

module.exports = { confirmAccount };
