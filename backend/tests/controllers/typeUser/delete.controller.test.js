const request = require('supertest');
const express = require('express');
const { deleteTypeUser } = require('../../../src/controllers/typeUser/delete.controller.js');
const validate = require('../../../src/helpers/validate.helper.js');
const { deleteRole } = require('../../../src/services/typeUser/index.service.js');
const CustomError = require('../../../src/helpers/customError.helper.js');
const logger = require('../../../src/configurations/logger.js');
const { errorController } = require('../../../src/controllers/error/index.controller.js');

jest.mock('../../../src/helpers/validate.helper.js', () => ({
    main: jest.fn()
}));

jest.mock('../../../src/services/typeUser/index.service.js', () => ({
    deleteRole: jest.fn()
}));

jest.mock('../../../src/configurations/logger.js', () => ({
    error: jest.fn()
}));

describe('DELETE /api/user/type/delete/:roleId', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        // Configurar la ruta con el parámetro roleId como en la implementación
        app.delete('/api/user/type/delete/:roleId', deleteTypeUser);
        app.use(errorController); // Registrar middleware de errores
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe eliminar un rol exitosamente', async () => {
        const roleId = '6';
        const successResponse = { message: 'Rol eliminado correctamente' };

        validate.main.mockResolvedValueOnce(); // Validación exitosa
        deleteRole.mockResolvedValueOnce(successResponse);

        const response = await request(app).delete(`/api/user/type/delete/${roleId}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(successResponse);
        expect(validate.main).toHaveBeenCalled();
        expect(deleteRole).toHaveBeenCalledWith(roleId); // El ID se pasa como string según el controlador
        expect(logger.error).not.toHaveBeenCalled();
    });

    test('Debe retornar error 400 si falla la validación del ID', async () => {
        const invalidId = 'abc';
        const validationError = new CustomError('ID de rol no válido', 400, 'BAD_REQUEST_ERROR');

        validate.main.mockRejectedValueOnce(validationError);

        const response = await request(app).delete(`/api/user/type/delete/${invalidId}`);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            error: {
                message: 'ID de rol no válido',
                code: 'BAD_REQUEST_ERROR',
                status: 400
            }
        });
        expect(logger.error).toHaveBeenCalled();
        expect(deleteRole).not.toHaveBeenCalled();
    });

    test('Debe retornar error 404 si el rol no existe', async () => {
        const roleId = '999';
        const notFoundError = new CustomError('Rol no encontrado', 404, 'ROLE_NOT_FOUND');

        validate.main.mockResolvedValueOnce(); // Validación exitosa
        deleteRole.mockRejectedValueOnce(notFoundError);

        const response = await request(app).delete(`/api/user/type/delete/${roleId}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            error: {
                message: 'Rol no encontrado',
                code: 'ROLE_NOT_FOUND',
                status: 404
            }
        });
        expect(logger.error).toHaveBeenCalled();
    });

    test('Debe retornar error 500 si ocurre un error interno', async () => {
        const roleId = '6';
        const unexpectedError = new Error('Error inesperado');

        validate.main.mockResolvedValueOnce(); // Validación exitosa
        deleteRole.mockRejectedValueOnce(unexpectedError);

        const response = await request(app).delete(`/api/user/type/delete/${roleId}`);

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            error: {
                message: 'Error inesperado',
                code: 'INTERNAL_ERROR',
                status: 500
            }
        });
        expect(logger.error).toHaveBeenCalled();
    });

    test('Debe registrar error en el logger cuando ocurre una excepción', async () => {
        const roleId = '6';
        const errorMessage = 'Error en la base de datos';
        const dbError = new Error(errorMessage);

        validate.main.mockResolvedValueOnce(); // Validación exitosa
        deleteRole.mockRejectedValueOnce(dbError);

        await request(app).delete(`/api/user/type/delete/${roleId}`);

        expect(logger.error).toHaveBeenCalledWith(`Error en deleteTypeUser: ${errorMessage}`);
    });
});