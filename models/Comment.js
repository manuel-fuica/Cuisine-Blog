// models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Aseguramos que no sea nulo
        references: {
            model: 'Users',  // Referencia a la tabla 'Users'
            key: 'id',       // Clave primaria de 'Users'
        },
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Aseguramos que no sea nulo
        references: {
            model: 'Posts',  // Referencia a la tabla 'Posts'
            key: 'id',       // Clave primaria de 'Posts'
        },
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false, // Aseguramos que el contenido no sea nulo
    },
}, {
    timestamps: true,  // Para que se creen las columnas 'createdAt' y 'updatedAt'
});



module.exports = Comment;
