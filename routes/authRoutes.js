const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Ruta de registro
router.post('/register', async (req, res) => {
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
        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario por correo electrónico
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña proporcionada con la contraseña encriptada en la base de datos
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('¿La contraseña es correcta?', isMatch);

        if (!isMatch) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Generar un token JWT si la contraseña es correcta
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Enviar el token al cliente
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;
