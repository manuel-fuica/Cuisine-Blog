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

    // Mostrar u ocultar el botón de flecha hacia arriba según el desplazamiento
    window.onscroll = function () {
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');

        // Si el desplazamiento es mayor que 100px, mostrar el botón
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollToTopBtn.style.display = 'block'; // Mostrar el botón
        } else {
            scrollToTopBtn.style.display = 'none'; // Ocultar el botón
        }
    };

    // Al hacer clic en el botón, llevar al usuario al inicio
    document.getElementById('scrollToTopBtn').addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Desplazamiento suave
        });
    });
});
