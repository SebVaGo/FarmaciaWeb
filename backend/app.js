const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const helmet = require('helmet');
const router = require('./src/routers/index.router.js');
const { corsWithLogging } = require('./src/security/cors.js');
const { errorController } = require('./src/controllers/error/index.controller.js');
const setupSwagger = require('./src/configurations/swagger.js');

const app = express();

//Usar una variable de entorno para el puerto
const PORT = 3000;

setupSwagger(app); 

app.use(helmet());
app.use(express.json()); // Añade esta línea
app.use(express.urlencoded({ extended: true })); // Y esta también para procesar datos de formularios
app.use(corsWithLogging);

app.use(router);
app.use(errorController);


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
