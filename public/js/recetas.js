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

const fetchPosts = async (headers) => {
    try {
        const response = await fetch('/posts', { headers });
        const posts = await response.json();
        console.log(posts);

        // Asegúrate de vaciar el contenedor antes de agregar los nuevos posts
        const postContainer = document.querySelector('.container');
        postContainer.innerHTML = ''; // Vaciar el contenedor

        // Agregar tarjetas una debajo de otra
        posts.forEach((post) => {
            const cardHTML = `
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title text-center">${post.title}</h5>
                        <p class="card-text">${post.descripcion}</p>
                        <p class="card-text">${post.receta}</p>
                        <div class="d-flex gap-3">
                            <button id="like-btn" class="btn btn-outline-primary">❤️ <span id="like-count">0</span></button>
                            <button id="view-recipe-btn" class="btn btn-outline-success">Ver receta</button>
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
