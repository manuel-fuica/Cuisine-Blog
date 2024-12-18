const express = require('express');
const auth = require('./auth');
const Post = require('../models/Post');

const router = express.Router();

// Crear un post (protegido)
router.post('/', auth, async (req, res) => {
    const { title, descripcion, receta } = req.body;
    const userId = req.user.userId;
    console.log(userId);

    try {
        const newPost = await Post.create({ title, descripcion, receta, UserId: userId });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el post' });
    }
});

// Obtener todos los posts (protegido)
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los posts' });
    }
});

module.exports = router;
