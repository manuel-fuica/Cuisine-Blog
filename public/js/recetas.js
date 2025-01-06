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
    if (token) {
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        fetchPosts(headers);
    } else {
        console.error('No se encontró token en el localStorage');
        alert('Por favor, inicia sesión nuevamente.');
        window.location.href = '/login'; // Redirigir al inicio de sesión si no hay token
    }
});

const fetchPosts = async (headers) => {
    try {
        const response = await fetch('/posts', { headers });
        const posts = await response.json();
        console.log(posts);

        // Asegúrate de vaciar el contenedor antes de agregar los nuevos posts
        const postContainer = document.querySelector('.container');
        if (postContainer) {
            postContainer.innerHTML = ''; // Vaciar el contenedor
        }

        // Agregar tarjetas una debajo de otra
        posts.forEach((post) => {
            // Verifica si 'preparacion' está presente y no es null
            const preparacion = post.preparacion ? post.preparacion : 'Preparación no disponible';

            // Dividir la preparación en pasos (basado en los números)
            const pasos = preparacion.split(/(?=\d+\.)/);

            // Generar el HTML de la lista ordenada para la preparación
            const listaPreparacion = pasos.map(paso => `<ol>${paso.trim()}</ol>`).join('');

            const cardHTML = `
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title text-center lead">${post.title}</h5>
                    <p class="card-text lead">Descripción: ${post.descripcion}</p>
                    <p class="card-text"><strong>Ingredientes:</strong> ${post.ingredientes}</p>
                    <p class="card-text"><strong>Preparación:</strong></p>
                    <ol class="ps-3">${listaPreparacion}</ol>
                    <div class="d-flex gap-3 mt-3">
                        <button id="like-btn" class="btn btn-outline-primary bg-primary text-white">❤️ <span id="like-count">0</span></button>
                        <button id="view-recipe-btn" class="btn btn-outline-success bg-success text-white">Ver comentarios</button>
                    </div>
                </div>
            </div>
            `;

            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'w-100'; // Ocupa toda la fila
            cardWrapper.innerHTML = cardHTML;
            postContainer.appendChild(cardWrapper);
        });
    } catch (error) {
        console.error('Error al cargar los posts:', error);
    }
};
