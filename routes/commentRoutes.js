const express = require('express');
const auth = require('./auth');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

const router = express.Router();

// Crear un comentario (protegido)
router.post('/', auth, async (req, res) => {  // El prefijo '/comments' lo defines en app.js
    try {
        const { postId, userId, contenido } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'Falta el userId en la solicitud' });
        }

        if (!postId) {
            return res.status(400).json({ error: 'Falta el postId en la solicitud' });
        }

        if (!contenido) {
            return res.status(400).json({ error: 'El contenido del comentario es obligatorio' });
        }

        // Verificar si el post existe
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'El post no existe' });
        }

        // Crear el comentario asociado al post
        const newComment = await Comment.create({
            contenido,
            userId,
            postId,
        });

        console.log('Comentario creado exitosamente:', newComment);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error al crear el comentario:', error);
        res.status(500).json({ error: 'Error al crear el comentario', details: error.message });
    }
});

module.exports = router;
