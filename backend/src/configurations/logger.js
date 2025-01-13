const { createLogger, format, transports } = require('winston');

const customFormat = format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const loginTransport = new transports.File({
    filename: 'logs/login.log',
    level: 'info',
});

const logger = createLogger({
    level: 'info', 
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
    ),
    transports: [
        new transports.Console(), 
        new transports.File({ filename: 'logs/error.log', level: 'error' }), 
        new transports.File({ filename: 'logs/combined.log' }),
        loginTransport,
    ],
});

module.exports = logger;
