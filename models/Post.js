// models/Post.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');  // Importar el modelo de User

// Definir el modelo para la tabla "Posts"
const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true,  // Activa los campos createdAt y updatedAt
});

// Definir relaciones
Post.belongsTo(User);  // Un post pertenece a un usuario
User.hasMany(Post);    // Un usuario tiene muchos posts

module.exports = Post;

