const request = require('supertest');
const express = require('express');
const { alter } = require('../../../src/controllers/typeUser/alter.controller.js');
const validate = require('../../../src/helpers/validate.helper.js');
const { alterRole } = require('../../../src/services/typeUser/index.service.js');
const CustomError = require('../../../src/helpers/customError.helper.js');
const { errorController } = require('../../../src/controllers/error/index.controller.js');

jest.mock('../../../src/helpers/validate.helper.js', () => ({
    main: jest.fn()
}));

jest.mock('../../../src/services/typeUser/index.service.js', () => ({
    alterRole: jest.fn()
}));

describe('PUT /api/user/type/alter', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.put('/api/user/type/alter', alter);
        app.use(errorController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('✅ Debe actualizar un rol exitosamente', async () => {
        const requestData = { roleId: 1, role: { descripcion: 'Nueva descripción' } };
        const serviceResponse = {
            message: 'Rol actualizado correctamente',
            updatedRole: { id: 1, nombre: 'Administrador', descripcion: 'Nueva descripción', activo: true }
        };

        validate.main.mockResolvedValueOnce();
        alterRole.mockResolvedValueOnce(serviceResponse);

        const response = await request(app).put('/api/user/type/alter').send(requestData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(serviceResponse);
    });

    test('❌ Debe retornar error 400 si falla la validación', async () => {
        const requestData = { roleId: '', role: {} };
        const validationError = new CustomError('"roleId" is required', 400, 'BAD_REQUEST_ERROR');
        validationError.details = [{ message: '"roleId" is required' }];

        validate.main.mockRejectedValueOnce(validationError);

        const response = await request(app).put('/api/user/type/alter').send(requestData);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            error: {
                message: '"roleId" is required',
                code: 'BAD_REQUEST_ERROR',
                status: 400
            }
        });
    });

    test('❌ Debe retornar error 404 si el rol no existe', async () => {
        const requestData = { roleId: 99, role: { descripcion: 'Nueva descripción' } };
        const notFoundError = new CustomError('El rol con ID 99 no existe.', 404, 'ROLE_NOT_FOUND');

        alterRole.mockRejectedValueOnce(notFoundError);

        const response = await request(app).put('/api/user/type/alter').send(requestData);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            error: {
                message: 'El rol con ID 99 no existe.',
                code: 'ROLE_NOT_FOUND',
                status: 404
            }
        });
    });

    test('❌ Debe retornar error 500 si ocurre un error inesperado', async () => {
        const requestData = { roleId: 1, role: { descripcion: 'Nueva descripción' } };
        const unexpectedError = new Error('Error inesperado');

        alterRole.mockRejectedValueOnce(unexpectedError);

        const response = await request(app).put('/api/user/type/alter').send(requestData);

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