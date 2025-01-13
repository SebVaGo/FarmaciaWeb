const rateLimit = require('express-rate-limit');

const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000 / 15, 
    max: 100, 
    message: 'Demasiados intentos, pruebe de nuevo en 15 minutos',
    headers: false,
});

module.exports = { authLimit };

