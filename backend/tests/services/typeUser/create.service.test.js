const { createRol } = require('../../../src/services/typeUser/index.service.js');
const Role = require('../../../src/models/Rol.js');
const CustomError = require('../../../src/helpers/customError.helper.js');
const errorHelper = require('../../../src/helpers/error.helper.js');

// Mock para logger
jest.mock('../../../src/configurations/logger.js', () => ({
    error: jest.fn(),
    info: jest.fn(),
    // Añade cualquier otro método que uses
}));

// Mock para Role
jest.mock('../../../src/models/Rol.js', () => ({
    findOrCreate: jest.fn(),
}));

// Mock para error.helper.js
jest.mock('../../../src/helpers/error.helper.js', () => ({
    conflictError: jest.fn(),
    internalServerError: jest.fn(),
}));

describe('createRol', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe crear un rol exitosamente', async () => {
        Role.findOrCreate.mockResolvedValue([{ id: 1, nombre: 'Admin', descripcion: 'Rol administrador' }, true]);

        const roleData = { nombre: 'Admin', descripcion: 'Rol administrador' };
        const result = await createRol(roleData);

        expect(result).toHaveProperty('id');
        expect(result.nombre).toBe('Admin');
        expect(result.descripcion).toBe('Rol administrador');
    });

    test(' Debe lanzar un error de conflicto si el rol ya existe', async () => {
        Role.findOrCreate.mockResolvedValue([{ id: 1, nombre: 'Admin', descripcion: 'Rol administrador' }, false]);
        
        const customError = new CustomError(`El rol 'Admin' ya existe.`, 409, 'ROLE_ALREADY_EXISTS');
        errorHelper.conflictError.mockReturnValue(customError);

        const roleData = { nombre: 'Admin', descripcion: 'Rol administrador' };
        
        try {
            await createRol(roleData);
            fail('createRol debería haber lanzado un error');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomError);
            expect(error.message).toBe(`El rol 'Admin' ya existe.`);
            expect(error.httpStatus).toBe(409);
            expect(errorHelper.conflictError).toHaveBeenCalledWith(
                `El rol 'Admin' ya existe.`,
                'ROLE_ALREADY_EXISTS'
            );
        }
    });

    test('Debe lanzar un error 500 si ocurre un error al crear el rol', async () => {
        const dbError = new Error('Error en la base de datos');
        Role.findOrCreate.mockRejectedValue(dbError);
        
        const serverError = new CustomError('Error en la base de datos', 500, 'ROLE_CREATION_ERROR');
        errorHelper.internalServerError.mockReturnValue(serverError);

        const roleData = { nombre: 'Admin', descripcion: 'Rol administrador' };
        
        try {
            await createRol(roleData);
            fail('createRol debería haber lanzado un error');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomError);
            expect(error.message).toBe('Error en la base de datos');
            expect(error.httpStatus).toBe(500);
            expect(errorHelper.internalServerError).toHaveBeenCalledWith(
                'Error en la base de datos',
                'ROLE_CREATION_ERROR'
            );
        }
    });

    test('Debe manejar un error personalizado', async () => {
        const customError = new CustomError('Error personalizado', 400, 'CUSTOM_ERROR');
        Role.findOrCreate.mockRejectedValue(customError);

        const roleData = { nombre: 'Admin', descripcion: 'Rol administrador' };
        
        try {
            await createRol(roleData);
            fail('createRol debería haber lanzado un error');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomError);
            expect(error.message).toBe('Error personalizado');
            expect(error.httpStatus).toBe(400);
            expect(error.code).toBe('CUSTOM_ERROR');
            expect(errorHelper.internalServerError).not.toHaveBeenCalled();
        }
    });
});