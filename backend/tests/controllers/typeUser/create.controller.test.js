const request = require('supertest');
const express = require('express');
const { create } = require('../../../src/controllers/typeUser/create.controller.js');
const validate = require('../../../src/helpers/validate.helper.js');
const { createRol } = require('../../../src/services/typeUser/index.service.js');
const CustomError = require('../../../src/helpers/customError.helper.js');
const { errorController } = require('../../../src/controllers/error/index.controller.js'); // Agregar middleware

jest.mock('../../../src/helpers/validate.helper.js', () => ({
    main: jest.fn()
}));

jest.mock('../../../src/services/typeUser/index.service.js', () => ({
    createRol: jest.fn()
}));

describe('POST /api/user/type/create', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.post('/api/user/type/create', create);
        app.use(errorController); // Registrar middleware de errores
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe crear un rol exitosamente', async () => {
        const roleData = { nombre: 'Admin', descripcion: 'Rol administrador' };
        const createdRole = { id: 1, ...roleData };

        validate.main.mockResolvedValueOnce(Promise.resolve()); // Validación exitosa
        createRol.mockResolvedValueOnce(createdRole); // Mock de creación

        const response = await request(app).post('/api/user/type/create').send(roleData);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(createdRole);
    });

    test('Debe retornar error 400 si falla la validación', async () => {
        const roleData = { nombre: '', descripcion: 'Rol administrador' };
        const validationError = new CustomError('"nombre" is not allowed to be empty', 400, 'BAD_REQUEST_ERROR');
        validationError.details = [{ message: '"nombre" is not allowed to be empty' }];
    
        validate.main.mockRejectedValueOnce(validationError);
    
        const response = await request(app).post('/api/user/type/create').send(roleData);
    
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            error: {
                message: '"nombre" is not allowed to be empty', // 👈 Ajusta esto
                code: 'BAD_REQUEST_ERROR',
                status: 400
            }
        });
    });

    test('Debe retornar error 400 si falla la validación, descripcion', async () => {
        const roleData = { nombre: 'Admin', descripcion: '' };
        const validationError = new CustomError('"descripcion" is not allowed to be empty', 400, 'BAD_REQUEST_ERROR');
        validationError.details = [{ message: '"descripcion" is not allowed to be empty' }];
    
        validate.main.mockRejectedValueOnce(validationError);
    
        const response = await request(app).post('/api/user/type/create').send(roleData);
    
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            error: {
                message: '"descripcion" is not allowed to be empty', // 👈 Ajusta esto
                code: 'BAD_REQUEST_ERROR',
                status: 400
            }
        });
    });

    test('Debe retornar error 409 si el rol ya existe', async () => {
        const roleData = { nombre: 'Admin', descripcion: 'Rol administrador' };
        const conflictError = new CustomError('El rol ya existe.', 409, 'ROLE_ALREADY_EXISTS');

        createRol.mockRejectedValueOnce(conflictError);

        const response = await request(app).post('/api/user/type/create').send(roleData);

        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
            error: {
                message: 'El rol ya existe.',
                code: 'ROLE_ALREADY_EXISTS',
                status: 409
            }
        });
    });

    test('Debe retornar error 500 si ocurre un error interno', async () => {
        const roleData = { nombre: 'Admin', descripcion: 'Rol administrador' };
        const unexpectedError = new Error('Error inesperado');

        createRol.mockRejectedValueOnce(unexpectedError);

        const response = await request(app).post('/api/user/type/create').send(roleData);

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            error: {
                message: 'Error inesperado',
                code: 'INTERNAL_ERROR',
                status: 500
            }
        });
    });
});