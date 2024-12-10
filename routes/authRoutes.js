const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  // Usamos bcryptjs para mayor compatibilidad
const User = require('../models/User'); // Modelo de usuario

const router = express.Router();

// Ruta de registro (encriptando la contraseña)
router.post('/register', async (req, res) => {
    // Obtener los datos del usuario
    const { username, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuario ya existe' });
        }

        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario con la contraseña encriptada
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword, // Guardamos la contraseña encriptada
        });

        res.status(201).json({
            message: 'Usuario creado con éxito',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});

// Ruta de inicio de sesión (comparando la contraseña encriptada)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario por correo electrónico
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña proporcionada con la contraseña encriptada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Generar un token JWT si la contraseña es correcta
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;
