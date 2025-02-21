const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;

const { Sequelize } = require('sequelize');
const logger = require('../configurations/logger.js');

const sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PASS, {
  host: MYSQL_HOST,
  dialect: 'mysql',
  logging: false, 
  define: {
    timestamps: true, 
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Conexión con la BD establecida con éxito');
  } catch (error) {
    logger.error('Error al conectar con la BD:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
