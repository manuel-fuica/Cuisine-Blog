// models/Like.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Like = sequelize.define('Like', {
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
}, {
    timestamps: false,
});

module.exports = Like;