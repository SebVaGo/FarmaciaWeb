const { findAll, findOne } = require('../../../src/services/typeUser/find.service.js');
const RolRepository = require('../../../src/repositories/RolRepository.js');
const logger = require('../../../src/configurations/logger.js');
const { notFoundError, internalServerError } = require('../../../src/helpers/error.helper.js');
const CustomError = require('../../../src/helpers/customError.helper.js');

jest.mock('../../../src/repositories/RolRepository.js', () => ({
    findAll: jest.fn(),
    findById: jest.fn(),
}));

jest.mock('../../../src/configurations/logger.js', () => ({
    error: jest.fn(),
    warn: jest.fn(),
}));

jest.mock('../../../src/helpers/error.helper.js', () => ({
    notFoundError: jest.fn(),
    internalServerError: jest.fn(),
}));

describe('Servicio find', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        test('✅ Debe retornar todos los roles correctamente', async () => {
            const mockRoles = [{ id: 1, nombre: 'Admin' }, { id: 2, nombre: 'User' }];
            RolRepository.findAll.mockResolvedValue(mockRoles);

            const result = await findAll();

            expect(result).toEqual(mockRoles);
            expect(RolRepository.findAll).toHaveBeenCalled();
            expect(logger.warn).not.toHaveBeenCalled();
        });

        test('❌ Debe lanzar un error si no hay roles', async () => {
            RolRepository.findAll.mockResolvedValue([]);
            notFoundError.mockReturnValue(new CustomError('No se encontraron roles', 404, 'ROLES_NOT_FOUND'));

            await expect(findAll()).rejects.toThrow(CustomError);
            await expect(findAll()).rejects.toMatchObject({
                message: 'No se encontraron roles',
                httpStatus: 404,
                code: 'ROLES_NOT_FOUND',
            });

            expect(logger.warn).toHaveBeenCalledWith('No se encontraron roles');
            expect(notFoundError).toHaveBeenCalledWith('No se encontraron roles', 'ROLES_NOT_FOUND');
        });

        test('❌ Debe lanzar un error 500 si hay un fallo en la BD', async () => {
            const dbError = new Error('Error en la BD');
            RolRepository.findAll.mockRejectedValue(dbError);
            internalServerError.mockReturnValue(new CustomError('No se pudo obtener los roles', 500, 'FIND_ALL_ROLES_ERROR'));

            await expect(findAll()).rejects.toThrow(CustomError);
            await expect(findAll()).rejects.toMatchObject({
                message: 'No se pudo obtener los roles',
                httpStatus: 500,
                code: 'FIND_ALL_ROLES_ERROR',
            });

            expect(logger.error).toHaveBeenCalledWith(`Error en findAllRole: ${dbError.message}`);
            expect(internalServerError).toHaveBeenCalledWith('No se pudo obtener los roles', 'FIND_ALL_ROLES_ERROR');
        });
    });

    describe('findOne', () => {
        test('✅ Debe retornar un rol si existe', async () => {
            const mockRole = { id: 1, nombre: 'Admin' };
            RolRepository.findById.mockResolvedValue(mockRole);

            const result = await findOne(1);

            expect(result).toEqual(mockRole);
            expect(RolRepository.findById).toHaveBeenCalledWith(1);
            expect(logger.warn).not.toHaveBeenCalled();
        });

        test('❌ Debe lanzar un error si el ID no se proporciona', async () => {
            notFoundError.mockReturnValue(new CustomError('ID de rol no proporcionado', 404, 'ROLE_ID_MISSING'));

            await expect(findOne(null)).rejects.toThrow(CustomError);
            await expect(findOne(null)).rejects.toMatchObject({
                message: 'ID de rol no proporcionado',
                httpStatus: 404,
                code: 'ROLE_ID_MISSING',
            });

            expect(logger.error).not.toHaveBeenCalled();
            expect(notFoundError).toHaveBeenCalledWith('ID de rol no proporcionado', 'ROLE_ID_MISSING');
        });

        test('❌ Debe lanzar un error si el rol no existe', async () => {
            RolRepository.findById.mockResolvedValue(null);
            notFoundError.mockReturnValue(new CustomError('Rol con id 99 no encontrado', 404, 'ROLE_NOT_FOUND'));

            await expect(findOne(99)).rejects.toThrow(CustomError);
            await expect(findOne(99)).rejects.toMatchObject({
                message: 'Rol con id 99 no encontrado',
                httpStatus: 404,
                code: 'ROLE_NOT_FOUND',
            });

            expect(logger.warn).toHaveBeenCalledWith('Rol con id 99 no encontrado');
            expect(notFoundError).toHaveBeenCalledWith('Rol con id 99 no encontrado', 'ROLE_NOT_FOUND');
        });

        test('❌ Debe lanzar un error 500 si hay un fallo en la BD', async () => {
            const dbError = new Error('Error en la BD');
            RolRepository.findById.mockRejectedValue(dbError);
            internalServerError.mockReturnValue(new CustomError('No se pudo obtener el rol', 500, 'FIND_ONE_ROLE_ERROR'));

            await expect(findOne(1)).rejects.toThrow(CustomError);
            await expect(findOne(1)).rejects.toMatchObject({
                message: 'No se pudo obtener el rol',
                httpStatus: 500,
                code: 'FIND_ONE_ROLE_ERROR',
            });

            expect(logger.error).toHaveBeenCalledWith(`Error en findOneRole: ${dbError.message}`);
            expect(internalServerError).toHaveBeenCalledWith('No se pudo obtener el rol', 'FIND_ONE_ROLE_ERROR');
        });
    });
});