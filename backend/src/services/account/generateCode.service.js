const CodigoVerificacion = require('../../models/CodigoVerificacion');
const Usuario = require('../../models/Usuario');
const { generateVerificationCode } = require('../../helpers/generateCode.helper');

const { notFoundError, internalServerError } = require('../../helpers/error.helper');
const CustomError = require('../../helpers/customError.helper');

const generateCode = async (id) => {
    try {
        console.log(`🔍 Buscando usuario con ID: ${id}`);

        // Buscar usuario en la BD
        const usuario = await Usuario.findByPk(id, {
            attributes: ['id', 'correo_electronico']
        });

        if (!usuario) {
            console.error('❌ Usuario no encontrado');
            throw new CustomError(notFoundError('Usuario no encontrado'));
        }

        console.log(`✅ Usuario encontrado: ${JSON.stringify(usuario)}`);

        // Generar código de verificación
        const codigo = generateVerificationCode();
        console.log(`🔢 Código generado: ${codigo}`);

        // Establecer tiempo de expiración (ejemplo: 5 min)
        const expiracion = new Date();
        expiracion.setMinutes(expiracion.getMinutes() + 5);
        console.log(`⏳ Código expirará en: ${expiracion}`);

        // Eliminar códigos previos del usuario
        console.log('🗑️ Eliminando códigos anteriores...');
        await CodigoVerificacion.destroy({
            where: { id_usuario: usuario.id }  // ✅ Corregido
        });
        console.log('✅ Códigos previos eliminados.');

        // Guardar nuevo código en la BD
        console.log('💾 Guardando nuevo código de verificación...');
        await CodigoVerificacion.create({
            id_usuario: usuario.id,  // ✅ Corregido
            codigo,
            expiracion,
            usado: false
        });
        console.log('✅ Código guardado correctamente.');

        return [codigo, usuario.correo_electronico];

    } catch (error) {
        console.error('❌ Error en generateCode:', error);
        if (!(error instanceof CustomError)) {
            throw new CustomError(internalServerError());
        }
        throw error;
    }
};

module.exports = { generateCode };
