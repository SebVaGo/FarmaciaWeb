const { getAllRoles, getRoleById } = require('../../../src/controllers/typeUser/find.controller.js');
const { findAll, findOne } = require('../../../src/services/typeUser/index.service.js');
const validate = require('../../../src/helpers/validate.helper.js');
const logger = require('../../../src/configurations/logger.js');

jest.mock('../../../src/services/typeUser/index.service.js');
jest.mock('../../../src/helpers/validate.helper.js');
jest.mock('../../../src/configurations/logger.js');

describe('Controlador find - getAllRoles & getRoleById', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();

        req = { params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('✅ getAllRoles', () => {
        test('Debe retornar todos los roles correctamente', async () => {
            const mockRoles = [
                { id: 1, nombre: 'Admin' },
                { id: 2, nombre: 'Usuario' }
            ];
            findAll.mockResolvedValue(mockRoles);

            await getAllRoles(req, res, next);

            expect(findAll).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockRoles);
            expect(logger.error).not.toHaveBeenCalled();
        });

        test('❌ Debe manejar errores correctamente', async () => {
            const error = new Error('Error en la base de datos');
            findAll.mockRejectedValue(error);

            await getAllRoles(req, res, next);

            expect(findAll).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalledWith(`Error en getAllRoles: ${error.message}`);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

        test('Debe retornar una lista vacía si no hay roles', async () => {
            findAll.mockResolvedValue([]);

            await getAllRoles(req, res, next);

            expect(findAll).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
            expect(logger.error).not.toHaveBeenCalled();
        });

    describe('✅ getRoleById', () => {
        test('Debe retornar un rol por ID correctamente', async () => {
            req.params.roleId = '1';
            const mockRole = { id: 1, nombre: 'Admin' };

            validate.main.mockResolvedValue();
            findOne.mockResolvedValue(mockRole);

            await getRoleById(req, res, next);

            expect(validate.main).toHaveBeenCalledWith(expect.any(Object), req.params);
            expect(findOne).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockRole);
            expect(logger.error).not.toHaveBeenCalled();
        });

        test('❌ Debe manejar errores en la validación', async () => {
            req.params.roleId = '1';
            const validationError = new Error('ID inválido');
            validate.main.mockRejectedValue(validationError);

            await getRoleById(req, res, next);

            expect(validate.main).toHaveBeenCalledWith(expect.any(Object), req.params);
            expect(logger.error).toHaveBeenCalledWith(`Error en getRoleById: ${validationError.message}`);
            expect(next).toHaveBeenCalledWith(validationError);
            expect(findOne).not.toHaveBeenCalled();
        });

        test('❌ Debe manejar errores al buscar un rol', async () => {
            req.params.roleId = '1';
            const serviceError = new Error('Rol no encontrado');

            validate.main.mockResolvedValue();
            findOne.mockRejectedValue(serviceError);

            await getRoleById(req, res, next);

            expect(findOne).toHaveBeenCalledWith('1');
            expect(logger.error).toHaveBeenCalledWith(`Error en getRoleById: ${serviceError.message}`);
            expect(next).toHaveBeenCalledWith(serviceError);
        });
        test('❌ Debe manejar el caso cuando no se envía roleId', async () => {
            req.params = {}; // No hay roleId

            const validationError = new Error('ID de rol requerido');
            validate.main.mockRejectedValue(validationError);

            await getRoleById(req, res, next);

            expect(validate.main).toHaveBeenCalledWith(expect.any(Object), req.params);
            expect(logger.error).toHaveBeenCalledWith(`Error en getRoleById: ${validationError.message}`);
            expect(next).toHaveBeenCalledWith(validationError);
            expect(findOne).not.toHaveBeenCalled();
        });




    });
});
