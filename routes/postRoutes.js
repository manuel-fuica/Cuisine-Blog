const express = require('express');
const auth = require('./auth');
const Post = require('../models/Post');
const User = require('../models/User');
const Like = require('../models/Like');
const Comment = require('../models/Comment');

const router = express.Router();

// Crear un post (protegido)
router.post('/', auth, async (req, res) => {
    try {
        const { title, descripcion, ingredientes, preparacion } = req.body;
        const userId = req.user?.userId; // Asegúrate de que el middleware auth agrega correctamente el userId

        if (!userId) {
            return res.status(400).json({ error: 'Falta el userId en la solicitud' });
        }

        console.log(`Creando post para el usuario: ${userId}`);
        const newPost = await Post.create({ title, descripcion, ingredientes, preparacion, UserId: userId });

        console.log('Post creado exitosamente:', newPost);
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error al crear el post:', error);
        res.status(500).json({ error: 'Error al crear el post', details: error.message });
    }
});

// Obtener todos los posts (protegido)
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.findAll();  // Elimina el include para solo obtener los posts
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error al obtener los posts:', error);
        res.status(500).json({ error: 'Error al obtener los posts', details: error.message });
    }
});


module.exports = router;
