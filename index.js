const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const postRoutes = require('./routes/postRoutes'); // Rutas de posts

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/auth', authRoutes);

// Rutas protegidas
app.use('/posts', postRoutes);

// Sincronizar y levantar el servidor
sequelize.sync({ force: true })
    .then(() => {
        console.log('Tablas sincronizadas');
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Servidor corriendo en el puerto ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => console.error('Error al sincronizar tablas:', err));
