const { alterRole } = require('../../../src/services/typeUser/index.service');
const RolRepository = require('../../../src/repositories/RolRepository');
const logger = require('../../../src/configurations/logger');
const CustomError = require('../../../src/helpers/customError.helper');
const errorHelper = require('../../../src/helpers/error.helper');

jest.mock('../../../src/repositories/RolRepository', () => ({
    updateRole: jest.fn(),
}));

jest.mock('../../../src/configurations/logger', () => ({
    error: jest.fn(),
    info: jest.fn(),
}));

jest.mock('../../../src/helpers/error.helper', () => ({
    notFoundError: jest.fn(),
    internalServerError: jest.fn(),
}));

describe('alterRole', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('✅ Actualiza correctamente un rol con datos válidos', async () => {
        const roleId = 1;
        const roleData = { nombre: 'Nuevo Nombre', descripcion: 'Nueva Descripción' };
        
        const updatedRole = { id: roleId, nombre: 'Nuevo Nombre', descripcion: 'Nueva Descripción' };
        RolRepository.updateRole.mockResolvedValue(updatedRole);

        const result = await alterRole(roleId, roleData);

        expect(result).toEqual({
            message: 'Rol actualizado correctamente',
            updatedRole: {
                id: roleId,
                nombre: 'Nuevo Nombre',
                descripcion: 'Nueva Descripción',
            },
        });
    });

    test('❌ Retorna error si el rol no existe', async () => {
        const roleId = 99;
        const roleData = { nombre: 'Intento Fallido' };

        RolRepository.updateRole.mockResolvedValue(null);

        const notFoundErr = new CustomError(`El rol con ID ${roleId} no existe.`, 404, 'ROLE_NOT_FOUND');
        errorHelper.notFoundError.mockReturnValue(notFoundErr);

        await expect(alterRole(roleId, roleData)).rejects.toThrow('El rol con ID 99 no existe.');
    });

    test('🔥 Retorna error en caso de fallo interno', async () => {
        const roleId = 4;
        const roleData = { nombre: 'Error' };

        RolRepository.updateRole.mockRejectedValue(new Error('Fallo en la base de datos'));
        
        const serverError = new CustomError('Error al actualizar el rol', 500, 'ROLE_UPDATE_ERROR');
        errorHelper.internalServerError.mockReturnValue(serverError);

        await expect(alterRole(roleId, roleData)).rejects.toThrow('Error al actualizar el rol');
    });
});
