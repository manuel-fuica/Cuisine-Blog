document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('username');

    // Manejo del elemento user-info para mostrar el nombre de usuario y permitir el cierre de sesión
    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement) {
        const spanElement = userInfoElement.querySelector('span'); // Suponiendo que el span está dentro del div con id "user-info"
        if (spanElement) {
            spanElement.textContent = userName || 'Usuario'; // Mostrar 'Usuario' como valor predeterminado si no hay nombre
        }

        userInfoElement.title = 'Haz clic para cerrar sesión'; // Agregar tooltip al div
        userInfoElement.addEventListener('click', () => {
            // Eliminar token y nombre de usuario del localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            // Redirigir al inicio de sesión
            window.location.href = '/'; // Cambia la ruta si es diferente
        });
    } else {
        console.error('No se encontró el elemento con id "user-info" en el DOM');
    }

    // Verificar si el token existe
    if (!token) {
        console.error('No se encontró token en el localStorage');
        alert('Por favor, inicia sesión nuevamente.');
        window.location.href = '/login'; // Redirigir al inicio de sesión si no hay token
    }
});
