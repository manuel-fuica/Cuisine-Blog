document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        fetchPosts(headers);
    } else {
        console.error('No se encontró token en el localStorage');
    }

    const userName = localStorage.getItem('username');
    const userNameElement = document.getElementById('user-name');
    userNameElement.textContent = userName;
});


// Validación del campo "Preparación"
document.getElementById('postForm').addEventListener('submit', function (e) {
    const preparacion = document.getElementById('preparacion').value.trim();
    const preparacionError = document.getElementById('preparacionError');

    // Expresión regular para validar pasos con formato: "1. texto, 2. texto"
    const validFormat = /^\d+\..+/;

    // Dividir en líneas por coma o salto de línea
    const pasos = preparacion.split(/,|\n/);

    // Validar cada paso
    const isValid = pasos.every(paso => validFormat.test(paso.trim()));

    if (!isValid) {
        e.preventDefault(); // Prevenir envío del formulario
        preparacionError.style.display = 'block';
    } else {
        preparacionError.style.display = 'none';
    }
});