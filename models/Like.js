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
        allowNull: false,
    },
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Posts',
            key: 'id',
        },
        allowNull: false,
    },
}, {
    timestamps: false,
    // Aseguramos que no se creen duplicados de un like por usuario y post
    indexes: [
        {
            unique: true,
            fields: ['userId', 'postId'],
        }
    ]
});


module.exports = Like;
