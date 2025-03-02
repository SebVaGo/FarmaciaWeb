const { deleteRole } = require('../../../src/services/typeUser/index.service.js');
const RolRepository = require('../../../src/repositories/RolRepository');
const logger = require('../../../src/configurations/logger.js');
const { notFoundError, internalServerError } = require('../../../src/helpers/error.helper.js');

jest.mock('../../../src/repositories/RolRepository', () => ({
    deleteRole: jest.fn(),
}));

jest.mock('../../../src/configurations/logger.js', () => ({
    error: jest.fn(),
}));

jest.mock('../../../src/helpers/error.helper.js', () => ({
    notFoundError: jest.fn().mockImplementation((msg, code) => ({ message: msg, httpStatus: 404, code })),
    internalServerError: jest.fn().mockImplementation((msg, code) => ({ message: msg, httpStatus: 500, code })),
}));

describe('deleteRole', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('✅ Debe eliminar un rol correctamente', async () => {
        RolRepository.deleteRole.mockResolvedValue(1);

        const roleId = 1;
        const result = await deleteRole(roleId);

        expect(result).toEqual({ message: 'Rol eliminado correctamente' });
        expect(RolRepository.deleteRole).toHaveBeenCalledWith(roleId);
        expect(logger.error).not.toHaveBeenCalled();
    });


    test('❌ Debe lanzar un error 500 si ocurre un error en la base de datos', async () => {
        const dbError = new Error('Error en la base de datos');
        RolRepository.deleteRole.mockRejectedValue(dbError);

        await expect(deleteRole(1)).rejects.toMatchObject({
            message: 'Error al intentar eliminar el rol',
            httpStatus: 500,
            code: 'DELETE_ROLE_ERROR',
        });

        expect(logger.error).toHaveBeenCalledWith(`Error en deleteRole: ${dbError.message}`);
        expect(internalServerError).toHaveBeenCalledWith('Error al intentar eliminar el rol', 'DELETE_ROLE_ERROR');
    });

    test.each([null, undefined, 'abc'])('❌ Debe lanzar un error si el roleId es inválido: %p', async (invalidId) => {
        await expect(deleteRole(invalidId)).rejects.toMatchObject({
            message: 'Error al intentar eliminar el rol',
            httpStatus: 500,
            code: 'DELETE_ROLE_ERROR',
        });
    });

});
