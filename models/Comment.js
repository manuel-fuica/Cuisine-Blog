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
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Posts',
            key: 'id',
        },
    },
    content: {
        type: DataTypes.TEXT,
    },
}, {
    timestamps: true,
});

module.exports = Comment;