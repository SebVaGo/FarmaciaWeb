const express = require('express');
const helmet = require('helmet');
const { corsWithLogging } = require('./middlewares/cors');

const app = express();
const PORT = 3000;

// Usar middlewares
app.use(helmet());
app.use(corsWithLogging);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Hola, Mundo!');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
