const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ error: 'No se proporcionó token de autenticación' });
    }

    const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Agregar el usuario decodificado a la solicitud
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token no válido o expirado' });
    }
};

module.exports = auth;
