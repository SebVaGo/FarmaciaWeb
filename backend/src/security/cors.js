const cors = require('cors');

const whitelist = [
    'http://localhost:3000',
    'http://localhost:3001'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) { // Activar origin para restringir solicitudes sin origen
            callback(null, true);
        } else {
            callback(new Error('Bloqueado por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-Access-Token',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 3600, 
    exposedHeaders: ['Content-Range', 'X-Content-Range'], 
};

// Middleware personalizado para logging de CORS
const corsMiddleware = cors(corsOptions);

const corsWithLogging = (req, res, next) => {
    corsMiddleware(req, res, next);
};

module.exports = { corsWithLogging };
