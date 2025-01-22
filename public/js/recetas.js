document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('username');

    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement) {
        const spanElement = userInfoElement.querySelector('span');
        if (spanElement) {
            spanElement.textContent = userName || 'Usuario';
        }

        userInfoElement.title = 'Haz clic para cerrar sesión';
        userInfoElement.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.href = '/';
        });
    }

    if (token) {
        const headers = { 'Authorization': `Bearer ${token}` };
        fetchPosts(headers);
    } else {
        alert('Por favor, inicia sesión nuevamente.');
        window.location.href = '/login';
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



const fetchPosts = async (headers) => {
    try {
        const response = await fetch('/posts', { headers });
        const posts = await response.json();

        const postContainer = document.querySelector('.container');
        if (postContainer) {
            postContainer.innerHTML = ''; // Limpiar contenido previo
        }

        posts.forEach((post) => {
            const preparacion = post.preparacion ? post.preparacion : 'Preparación no disponible';
            const pasos = preparacion.split(/(?=\d+\.)/);
            const listaPreparacion = pasos.map(paso => `<ol>${paso.trim()}</ol>`).join('');

            const cardHTML = `
            <div class="card mb-4" id="post-${post.id}">
                <div class="card-body">
                    <h5 class="card-title text-center lead">${post.titulo}</h5>
                    <p class="card-text lead">Descripción: ${post.descripcion}</p>
                    <p class="card-text"><strong>Ingredientes:</strong> ${post.ingredientes}</p>
                    <p class="card-text"><strong>Preparación:</strong></p>
                    <ol class="ps-3">${listaPreparacion}</ol>
                    <div class="d-flex gap-3 mt-3">
                        <button id="like-btn-${post.id}" class="btn btn-outline-primary bg-primary text-white">❤️ <span id="like-count-${post.id}">0</span></button>
                        <button id="view-comments-btn-${post.id}" class="btn bg-success text-white">Ver comentarios</button>
                    </div>

                    <!-- Sección de comentarios oculta inicialmente -->
                    <div id="comments-section-${post.id}" class="comments-section d-none mt-3 border border-2 rounded p-3">
                        <h6>Comentarios:</h6>
                        <div id="comments-list-${post.id}"></div>
                        <div id="add-comment-section-${post.id}" class="mt-3">
                            <button id="add-comment-btn-${post.id}" class="btn btn-primary w-100">Agregar comentario</button>
                        </div>
                    </div>
                </div>
            </div>
            `;

            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'w-100';
            cardWrapper.innerHTML = cardHTML;
            postContainer.appendChild(cardWrapper);

            // Añadir event listener para "Ver comentarios"
            const viewCommentsBtn = document.getElementById(`view-comments-btn-${post.id}`);
            viewCommentsBtn.addEventListener('click', () => {
                toggleComments(post.id, headers);
            });

            // Añadir event listener para "Agregar comentario"
            const addCommentBtn = document.getElementById(`add-comment-btn-${post.id}`);
            addCommentBtn.addEventListener('click', () => {
                promptAddComment(post.id);
            });
        });

        handleHashNavigation(); // Llama a la función de navegación por hash al cargar los posts
    } catch (error) {
        console.error('Error al cargar los posts:', error);
    }
};

const toggleComments = async (postId, headers) => {
    const commentsSection = document.getElementById(`comments-section-${postId}`);
    const commentsList = document.getElementById(`comments-list-${postId}`);
    const addCommentBtn = document.getElementById(`add-comment-btn-${postId}`);

    if (commentsSection.classList.contains('d-none')) {
        try {
            const response = await fetch(`/posts/${postId}`, { headers });
            const post = await response.json();

            commentsList.innerHTML = ''; // Limpiar los comentarios previos

            post.comments.forEach(comment => {
                const commentHTML = `
                    <div class="comment mb-2 p-2 border border-success rounded">
                        <strong>${comment.user.username}:</strong> ${comment.contenido}
                    </div>
                `;
                commentsList.innerHTML += commentHTML;
            });

            commentsSection.classList.remove('d-none');
            addCommentBtn.classList.remove('d-none');
        } catch (error) {
            console.error('Error al obtener los comentarios:', error);
        }
    } else {
        commentsSection.classList.add('d-none');
        addCommentBtn.classList.add('d-none');
    }
};

const promptAddComment = (postId) => {
    const commentContent = prompt("Escribe tu comentario:");

    if (commentContent) {
        console.log(`Comentario agregado al post ${postId}: ${commentContent}`);
        // Lógica para guardar el comentario en el servidor...
    }
};

const handleHashNavigation = () => {
    const hash = window.location.hash.substring(1); // Obtener el hash sin #
    if (hash) {
        const targetElement = document.getElementById(`post-${hash}`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetElement.classList.add('highlight');
            setTimeout(() => targetElement.classList.remove('highlight'), 2000); // Resaltar por 2 segundos
        }
    }
};
