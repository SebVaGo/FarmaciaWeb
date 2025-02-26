const logger = require('../../configurations/logger');
const CustomError = require('../../helpers/customError.helper');

const errorController = (err, req, res, next) => {
    if (err.isJoi) {
        return res.status(400).json({
            error: {
                message: err.details[0].message,
                code: 'BAD_REQUEST_ERROR',
                status: 400
            }
        });
    }

    const status = Number(err.httpStatus) || 500;

    logger.error(`Error capturado: ${err.message}`, {
        status,
        code: err.code || "INTERNAL_ERROR",
        stack: err.stack
    });

    res.status(status).json({
        error: {
            message: err.message || "Error interno del servidor",
            code: err.code || "INTERNAL_ERROR",
            status
        }
    });

};

module.exports = { errorController };
