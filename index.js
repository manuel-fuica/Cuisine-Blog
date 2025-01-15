const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database'); // Asegúrate de importar solo una vez
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const postRoutes = require('./routes/postRoutes'); // Rutas de posts
const commentRoutes = require('./routes/commentRoutes');
const path = require('path');
const nodemailer = require('nodemailer'); // Requerir Nodemailer

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite manejar datos en formato JSON

// Rutas públicas
// Servir archivos estáticos como el HTML
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la raíz que redirige a login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vistas', 'login.html')); // Redirigir a login.html
});
// Ruta para la página de registro
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vistas', 'signup.html')); // Redirigir a signup.html
});
// Ruta para la página de inicio
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vistas', 'home.html')); // Redirigir a home.html
});
// Ruta para la página de recetas
app.get('/recetas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vistas', 'recetas.html')); // Redirigir a recetas.html
});
//Ruta para crear nuevo post
app.get('/crearPost', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vistas', 'crearPost.html')); // Redirigir a crearPost.html
});
//ruta para nosotros
app.get('/nosotros', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vistas', 'nosotros.html')); // Redirigir a nosotros.html
});
//Ruta para contacto
app.get('/contacto', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vistas', 'contacto.html')); // Redirigir a contacto.html
});

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas protegidas
app.use('/posts', postRoutes);

//Ruta para crear comentarios
app.use('/comments', commentRoutes);

// Ruta para enviar el correo
app.post('/send-email', async (req, res) => {
    const { nombre, correo, asunto, mensaje } = req.body;

    // Configuración del transporte de Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Cambia esto si no usas Gmail
        auth: {
            user: process.env.EMAIL,  // Tu correo electrónico de envío
            pass: process.env.EMAIL_PASSWORD,  // Tu contraseña de correo electrónico
        },
    });

    // Opciones del correo
    const mailOptions = {
        from: correo,
        to: process.env.EMAIL, // Dirección de correo para recibir los correos
        subject: asunto,
        text: `Nombre: ${nombre}\nCorreo: ${correo}\nMensaje: ${mensaje}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo' });
    }
});

// Sincronizar las tablas
sequelize.sync({ force: false }) // Esto eliminará y recreará las tablas si es necesario
    .then(() => {
        console.log('Las tablas fueron sincronizadas.');

        // Iniciar el servidor solo después de la sincronización
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Servidor corriendo en el puerto ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => {
        console.error('Error al sincronizar las tablas:', err);
    });
