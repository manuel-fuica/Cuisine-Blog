const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la instancia de Sequelize

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Para que se creen las columnas `createdAt` y `updatedAt`
});

module.exports = User;
