const express = require('express');
const auth = require('./auth');
const Post = require('../models/Post');
const User = require('../models/User');
const Like = require('../models/Like'); // Asegúrate de que tienes el modelo Like
const router = express.Router();

// Ruta para agregar un like
router.post('/add-like', auth, async (req, res) => {
    try {
        const { postId, userId } = req.body; // Obtener postId y userId desde el cuerpo de la solicitud

        // Verificar si el like ya existe
        const existingLike = await Like.findOne({ where: { postId, userId } });
        if (existingLike) {
            return res.status(400).json({ error: 'Ya le has dado like a este post.' });
        }

        // Crear un nuevo like
        const newLike = await Like.create({ postId, userId });

        // Actualizar el número de likes en el post (opcional)
        const post = await Post.findByPk(postId);
        if (post) {
            post.likes = post.likes + 1;
            await post.save();
        }

        res.status(201).json({ message: 'Like agregado con éxito', like: newLike });
    } catch (error) {
        console.error('Error al agregar el like:', error);
        res.status(500).json({ error: 'Error al agregar el like', details: error.message });
    }
});

// Ruta para eliminar un like
router.post('/remove-like', auth, async (req, res) => {
    try {
        const { postId, userId } = req.body;

        // Verificar si el like existe
        const existingLike = await Like.findOne({ where: { postId, userId } });
        if (!existingLike) {
            return res.status(400).json({ error: 'No has dado like a este post.' });
        }

        // Eliminar el like
        await existingLike.destroy();

        // Actualizar el número de likes en el post (opcional)
        const post = await Post.findByPk(postId);
        if (post) {
            post.likes = post.likes - 1;
            await post.save();
        }

        res.status(200).json({ message: 'Like eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el like:', error);
        res.status(500).json({ error: 'Error al eliminar el like', details: error.message });
    }
});

module.exports = router;
