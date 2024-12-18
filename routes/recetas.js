const express = require('express');
const auth = require('./auth');
const Post = require('../models/Post');

const router = express.Router();

router.get('/recetas', auth, async (req, res) => {
    try {
        const posts = await Post.findAll({ where: { receta: { [Op.ne]: null } } }); // Buscar posts con receta diferente de null
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los posts de recetas' });
    }
});

