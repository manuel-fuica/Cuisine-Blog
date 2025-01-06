document.addEventListener('DOMContentLoaded', () => {
    // Verificar el token en el localStorage
    const token = localStorage.getItem('token');
    if (token) {
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        // Puedes usar headers si es necesario
    } else {
        console.error('No se encontró token en el localStorage');
    }

    // Obtener el nombre de usuario desde el localStorage
    const userName = localStorage.getItem('username');

    // Verificar si el elemento con id 'user-info' está disponible en el DOM
    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement) {
        // Verificar que el nombre de usuario exista antes de mostrarlo
        if (userName) {
            const spanElement = userInfoElement.querySelector('span'); // Suponiendo que hay un span dentro del div
            if (spanElement) {
                spanElement.textContent = userName; // Mostrar el nombre de usuario en el span
            }

            userInfoElement.title = 'Haz clic para cerrar sesión'; // Añadir el título (tooltip) al div completo

            // Agregar evento de clic para cerrar sesión
            userInfoElement.addEventListener('click', () => {
                // Eliminar token y username del localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                
                // Redirigir a la página de login
                window.location.href = '/'; // Cambia esto si la ruta es diferente
            });
        } else {
            console.error('No se encontró el nombre de usuario en el localStorage');
        }
    } else {
        console.error('No se encontró el elemento con id "user-info" en el DOM');
    }
});
