const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return input.replace(/[<>'";]/g, ''); // Elimina caracteres peligrosos
    }
    return input;
};

const sanitizeObject = (obj) => {
    const sanitizedObj = {};
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizedObj[key] = sanitizeObject(obj[key]); // Si es un objeto anidado, limpiar recursivamente
        } else {
            sanitizedObj[key] = sanitizeInput(obj[key]); // Limpiar valores individuales
        }
    }
    return sanitizedObj;
};

module.exports = { sanitizeInput, sanitizeObject };
