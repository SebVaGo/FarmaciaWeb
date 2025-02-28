const { sequelize, connectDB } = require('./index');
const logger = require('../configurations/logger');


const setupAssociations = require('../models/asociaciones.js');

const syncDatabase = async () => {

  await connectDB();

  setupAssociations();

  try {
    await sequelize.sync({ alter: true }); // Actualizar la tabla sin borrar datos
  } catch (error) {
    logger.error('Error al sincronizar la base de datos:', error);
} finally {
    await sequelize.close();
    process.exit(0);
  }
};

syncDatabase();
