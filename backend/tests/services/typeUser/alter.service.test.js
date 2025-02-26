const { alterRole } = require('../../../src/services/typeUser/index.service');
const Role = require('../../../src/models/Rol');
const CustomError = require('../../../src/helpers/customError.helper');
const errorHelper = require('../../../src/helpers/error.helper');

// Mock para logger
jest.mock('../../../src/configurations/logger.js', () => ({
    error: jest.fn(),
    info: jest.fn(),
}));

// Mock para Role
jest.mock('../../../src/models/Rol.js', () => ({
    findByPk: jest.fn(),
}));

// Mock para error.helper.js
jest.mock('../../../src/helpers/error.helper.js', () => ({
    notFoundError: jest.fn(),
    internalServerError: jest.fn(),
}));

describe('alterRole', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('✅Actualiza correctamente un rol con un solo campo', async () => {
        const roleId = 1;
        const roleData = { descripcion: 'Nueva descripción' };

        const mockRole = {
            id: roleId,
            nombre: 'Administrador',
            descripcion: 'Antigua descripción',
            activo: true,
            update: jest.fn().mockImplementation((data) => {
                Object.assign(mockRole, data);
            }),
        };

        Role.findByPk.mockResolvedValue(mockRole);

        const result = await alterRole(roleId, roleData);

        expect(result).toEqual({
            message: 'Rol actualizado correctamente',
            updatedRole: {
                id: roleId,
                nombre: 'Administrador',
                descripcion: 'Nueva descripción',
                activo: true,
            },
        });
    });

    test(' Actualiza múltiples campos del rol', async () => {
        const roleId = 2;
        const roleData = { nombre: 'Nuevo Nombre', activo: false };

        const mockRole = {
            id: roleId,
            nombre: 'Viejo Nombre',
            descripcion: 'Descripción',
            activo: true,
            update: jest.fn().mockImplementation((data) => {
                Object.assign(mockRole, data);
            }),
        };

        Role.findByPk.mockResolvedValue(mockRole);

        const result = await alterRole(roleId, roleData);

        expect(result).toEqual({
            message: 'Rol actualizado correctamente',
            updatedRole: {
                id: roleId,
                nombre: 'Nuevo Nombre',
                descripcion: 'Descripción',
                activo: false,
            },
        });
    });

    test(' No se realizan cambios si no se envían campos válidos', async () => {
        const roleId = 3;
        const roleData = {}; // No se envían cambios

        Role.findByPk.mockResolvedValue({
            id: roleId,
            nombre: 'Administrador',
            descripcion: 'Antigua descripción',
            activo: true,
            update: jest.fn(),
        });

        const result = await alterRole(roleId, roleData);

        expect(result).toEqual({
            message: 'No se realizaron cambios, no se enviaron campos válidos.',
        });
    });

    test(' Retorna error si el rol no existe', async () => {
        const roleId = 99;
        const roleData = { nombre: 'Intento Fallido' };

        Role.findByPk.mockResolvedValue(null);
        
        const notFoundErr = new CustomError(`El rol con ID ${roleId} no existe.`, 404, 'ROLE_NOT_FOUND');
        errorHelper.notFoundError.mockReturnValue(notFoundErr);

        await expect(alterRole(roleId, roleData)).rejects.toThrow('El rol con ID 99 no existe.');
    });

    test(' Retorna error en caso de fallo interno', async () => {
        const roleId = 4;
        const roleData = { nombre: 'Error' };

        Role.findByPk.mockRejectedValue(new Error('Fallo en la base de datos'));
        
        const serverError = new CustomError('Fallo en la base de datos', 500, 'ROLE_UPDATE_ERROR');
        errorHelper.internalServerError.mockReturnValue(serverError);

        await expect(alterRole(roleId, roleData)).rejects.toThrow('Fallo en la base de datos');
    });
});
