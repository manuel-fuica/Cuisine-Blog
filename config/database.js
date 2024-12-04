// config/database.js
const { Sequelize } = require('sequelize');

// Cargar las variables de entorno
require('dotenv').config();

// Crear la instancia de Sequelize para la conexión con PostgreSQL
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = sequelize;
