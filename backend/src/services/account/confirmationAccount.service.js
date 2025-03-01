const Usuario = require('../../models/Usuario');
const CodigoVerificacion = require('../../models/CodigoVerificacion');
const { Op } = require('sequelize');
const { sequelize } = require('../../db/index.js');

const confirmAccount = async (id_usuario, codigo) => {
    const transaction = await sequelize.transaction();

    try {
        console.log(`🔍 Buscando código de verificación para usuario ID: ${id_usuario} con código: ${codigo}`);

        const verificationCode = await CodigoVerificacion.findOne({
            where: {
                id_usuario,
                codigo,
                expiracion: { [Op.gt]: new Date() },
                usado: false
            },
            transaction
        });

        if (!verificationCode) {
            console.error('❌ Código de verificación inválido o expirado');
            throw new Error('Código inválido o expirado');
        }

        console.log('✅ Código de verificación válido, procediendo a verificar usuario.');

        // Actualizar el estado de verificación del usuario
        const updateUser = await Usuario.update(
            { is_verified: true },
            { where: { id: id_usuario }, transaction }
        );

        console.log(`✅ Usuario con ID: ${id_usuario} ha sido verificado. Filas afectadas: ${updateUser}`);

        // Marcar código como usado en lugar de eliminarlo
        const updateCode = await CodigoVerificacion.update(
            { usado: true },
            { where: { id_usuario, codigo }, transaction }
        );

        console.log(`✅ Código de verificación marcado como usado. Filas afectadas: ${updateCode}`);

        await transaction.commit();
        return { message: 'Cuenta verificada exitosamente' };

    } catch (error) {
        await transaction.rollback();
        console.error('❌ Error al confirmar la cuenta:', error.message);
        throw error;
    }
};

module.exports = { confirmAccount };
