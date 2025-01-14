// models/Post.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Like = require('./Like');
const Comment = require('./Comment');

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ingredientes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    preparacion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true, // Para usar 'createdAt' y 'updatedAt'
});

// Relaciones explícitas
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' }); // Relación con User
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });  // Relación inversa de User -> Post

Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });  // Relación con Like
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' }); // Relación inversa de Like -> Post

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });  // Relación con Comment
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });    // Relación inversa de Comment -> Post

// Nuevas relaciones: Comentarios -> Usuario y Usuario -> Comentarios
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });    // Relación con User
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });  // Relación inversa de User -> Comment


// Para obtener el contador de likes en un post
Post.prototype.getLikesCount = async function() {
    const count = await Like.count({ where: { postId: this.id } });
    return count;
};

module.exports = Post;