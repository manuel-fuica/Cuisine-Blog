const express = require('express');
const auth = require('./auth');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

const router = express.Router();

// Crear un post (protegido)
router.post('/', auth, async (req, res) => {
    try {
        const { titulo, descripcion, ingredientes, preparacion } = req.body;
        const userId = req.user?.userId; // Asegúrate de que el middleware `auth` agrega correctamente el `userId`

        if (!userId) {
            return res.status(400).json({ error: 'Falta el userId en la solicitud' });
        }

        const newPost = await Post.create({ titulo, descripcion, ingredientes, preparacion, userId });

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error al crear el post:', error);
        res.status(500).json({ error: 'Error al crear el post', details: error.message });
    }
});

// Obtener todos los posts (protegido)
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'email'], // Seleccionar solo los datos necesarios del usuario
                },
                {
                    model: Comment,
                    as: 'comments',
                    attributes: ['id'], // Incluir solo la cantidad de comentarios (puedes ajustarlo)
                },
            ],
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error al obtener los posts:', error);
        res.status(500).json({ error: 'Error al obtener los posts', details: error.message });
    }
});

// Obtener un post por ID con sus comentarios (protegido)
router.get('/:postId', auth, async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findByPk(postId, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'email'],
                },
                {
                    model: Comment,
                    as: 'comments',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'username', 'email'], // Usuario que realizó el comentario
                        },
                    ],
                },
            ],
        });

        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error al obtener el post:', error);
        res.status(500).json({ error: 'Error al obtener el post', details: error.message });
    }
});

module.exports = router;
