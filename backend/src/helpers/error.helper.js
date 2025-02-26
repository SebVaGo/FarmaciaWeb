const CustomError = require('./customError.helper.js');

const createError = (message, httpStatus, code) => new CustomError(message, httpStatus, code);
const throwError = (message, httpStatus, code) => { throw new CustomError(message, httpStatus, code); };

// Funciones que devuelven el error
const conflictError = (msg, code = 'CONFLICT') => createError(msg, 409, code);
const notFoundError = (msg, code = 'NOT_FOUND') => createError(msg, 404, code);
const notAuthorizedError = (msg, code = 'UNAUTHORIZED') => createError(msg, 401, code);
const forbiddenError = (msg, code = 'FORBIDDEN') => createError(msg, 403, code);
const internalServerError = (msg, code = 'INTERNAL_ERROR') => createError(msg, 500, code);
const badRequestError = (msg, code = 'BAD_REQUEST_ERROR') => createError(msg, 400, code);

// Funciones que lanzan el error directamente
const throwConflictError = (msg, code = 'CONFLICT') => throwError(msg, 409, code);
const throwNotFoundError = (msg, code = 'NOT_FOUND') => throwError(msg, 404, code);
const throwUnauthorizedError = (msg, code = 'UNAUTHORIZED') => throwError(msg, 401, code);
const throwForbiddenError = (msg, code = 'FORBIDDEN') => throwError(msg, 403, code);
const throwInternalServerError = (msg, code = 'INTERNAL_ERROR') => throwError(msg, 500, code);
const throwBadRequestError = (msg, code = 'BAD_REQUEST_ERROR') => throwError(msg, 400, code);

module.exports = {
    // Versiones que devuelven el error
    conflictError,
    notFoundError,
    notAuthorizedError,
    forbiddenError,
    internalServerError,
    badRequestError,
    // Versiones que lanzan el error
    throwConflictError,
    throwNotFoundError,
    throwUnauthorizedError,
    throwForbiddenError,
    throwInternalServerError,
    throwBadRequestError
};
