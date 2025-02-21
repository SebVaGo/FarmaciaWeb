const { sequelize, connectDB } = require('./index');
const logger = require('../configurations/logger');
const Role = require('../models/Role');
const User = require('../models/User');
const LoginRecord = require('../models/LoginRecord');

const syncDatabase = async () => {
  await connectDB();

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
