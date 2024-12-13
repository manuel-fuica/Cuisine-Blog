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
});

const fetchPosts = async (headers) => {
    try {
        const response = await fetch('/posts', { headers });
        const posts = await response.json();
        console.log(posts);
        // Carga los posts en el DOM
        const postContainer = document.querySelector('.container');
        posts.forEach((post) => {
            const postHTML = `
        <div class="card m-3">
          <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.content}</p>
            <div class="d-flex gap-3">
              <button id="like-btn" class="btn btn-outline-primary">❤️ Me gusta <span id="like-count">0</span></button>
              <button id="comment-btn" class="btn btn-outline-secondary">💬 Comentarios <span id="comment-count">0</span></button>
              <button id="view-recipe-btn" class="btn btn-outline-success">Ver receta completa</button>
            </div>
            <div id="comments-section" class="mt-4 d-none">
              <h6>Comentarios:</h6>
              <div id="comment-list"></div>
              <form id="comment-form" class="mt-3">
                <textarea id="comment-text" class="form-control" rows="3" placeholder="Escribe tu comentario..."></textarea>
                <button type="submit" class="btn btn-primary mt-2">Enviar Comentario</button>
              </form>
            </div>
          </div>
        </div>
      `;
            postContainer.innerHTML += postHTML;
        });
    } catch (error) {
        console.error(error);
    }
};