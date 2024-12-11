const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database'); // Asegúrate de importar solo una vez
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const postRoutes = require('./routes/postRoutes'); // Rutas de posts
const path = require('path');

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

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas protegidas
app.use('/posts', postRoutes);

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
