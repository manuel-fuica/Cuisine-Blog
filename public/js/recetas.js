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
    if (userNameElement) {
        userNameElement.textContent = userName;
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
