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
    title: {
        type: DataTypes.STRING,
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    receta: {
        type: DataTypes.TEXT,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

// Relación explícita con User (asegurándonos de que sea 'UserId')
Post.belongsTo(User, { foreignKey: 'UserId' }); // Especifica el campo UserId
User.hasMany(Post, { foreignKey: 'UserId' });

Post.hasMany(Like);
Like.belongsTo(Post);

Post.hasMany(Comment);
Comment.belongsTo(Post);

module.exports = Post;
