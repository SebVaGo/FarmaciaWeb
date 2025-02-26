const { deleteRole } = require('../../../src/services/typeUser/index.service.js');
const Role = require('../../../src/models/Rol.js');
const logger = require('../../../src/configurations/logger.js');
const CustomError = require('../../../src/helpers/customError.helper.js');

jest.mock('../../../src/models/Rol.js', () => ({
    destroy: jest.fn(),
}));

jest.mock('../../../src/configurations/logger.js', () => ({
    error: jest.fn(),
}));

describe('deleteRole', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('✅ Debe eliminar un rol correctamente', async () => {
        Role.destroy.mockResolvedValue(1);

        const roleId = 1;
        const result = await deleteRole(roleId);

        expect(result).toEqual({ message: 'Rol eliminado correctamente' });
        expect(Role.destroy).toHaveBeenCalledWith({ where: { id: roleId } });
        expect(logger.error).not.toHaveBeenCalled();
    });

    test('❌ Debe lanzar un error 404 si el rol no existe', async () => {
        Role.destroy.mockResolvedValue(0);

        const roleId = 99;

        await expect(deleteRole(roleId)).rejects.toThrow(CustomError);
        await expect(deleteRole(roleId)).rejects.toMatchObject({
            message: 'Rol no encontrado',
            httpStatus: 404,
            code: 'ROLE_NOT_FOUND',
        });

        expect(logger.error).toHaveBeenCalledWith(`Error en deleteRole: No se pudo eliminar el rol con id ${roleId}`);
    });

    test('❌ Debe lanzar un error 500 si ocurre un error en la base de datos', async () => {
        const dbError = new Error('Error en la base de datos');
        Role.destroy.mockRejectedValue(dbError);

        await expect(deleteRole(1)).rejects.toThrow(Error);
        await expect(deleteRole(1)).rejects.toHaveProperty('message', 'Error al intentar eliminar el rol');

        expect(logger.error).toHaveBeenCalledWith(`Error en deleteRole: ${dbError.message}`);
    });

    test('❌ Debe lanzar un error si el roleId es null', async () => {
        await expect(deleteRole(null)).rejects.toThrow(Error);
        await expect(deleteRole(null)).rejects.toHaveProperty('message', 'Error al intentar eliminar el rol');
    });

    test('❌ Debe lanzar un error si el roleId es undefined', async () => {
        await expect(deleteRole(undefined)).rejects.toThrow(Error);
        await expect(deleteRole(undefined)).rejects.toHaveProperty('message', 'Error al intentar eliminar el rol');
    });

    test('❌ Debe lanzar un error si el roleId es una cadena en lugar de un número', async () => {
        await expect(deleteRole("abc")).rejects.toThrow(Error);
        await expect(deleteRole("abc")).rejects.toHaveProperty('message', 'Error al intentar eliminar el rol');
    });

    test('❌ Debe lanzar un error si Role.destroy devuelve null o undefined', async () => {
        Role.destroy.mockResolvedValue(null);

        await expect(deleteRole(1)).rejects.toThrow(Error);
        await expect(deleteRole(1)).rejects.toHaveProperty('message', 'Rol no encontrado');

        expect(logger.error).toHaveBeenCalled();
    });

    test('✅ No debe registrar múltiples errores en logger si se lanza un error', async () => {
        Role.destroy.mockResolvedValue(0);

        try {
            await deleteRole(99);
        } catch (error) {}

        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
