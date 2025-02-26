class CustomError extends Error {
    constructor(message, httpStatus, code) {
        super(message);
        this.name = "CustomError";
        this.httpStatus = httpStatus;
        this.code = code;
        Error.captureStackTrace(this, this.constructor); // Captura el stack correctamente
    }
}

module.exports = CustomError;
