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

        // Crear una fila para las tarjetas
        const row = document.createElement('div');
        row.className = 'row';

        // Agregar tarjetas responsivas
        posts.forEach((post) => {
            const col = document.createElement('div');
            col.className = 'col-sm-12 col-md-6 col-lg-3 mb-4'; // Responsivo: 1 tarjeta por fila en pantallas pequeñas, 2 en medianas, 4 en grandes

            const cardHTML = `
              <div class="card h-100 d-flex flex-column">
                  <div class="card-body d-flex flex-column">
                      <h5 class="card-title">${post.title}</h5>
                      <p class="card-text">${post.descripcion}</p>
                      <div class="mt-auto">
                          <div class="d-flex gap-3">
                              <button id="like-btn" class="btn btn-outline-primary">❤️ <span id="like-count">0</span></button>
                              <button id="view-recipe-btn" class="btn btn-outline-success">Ver receta</button>
                          </div>
                      </div>
                  </div>
              </div>
          `;

            col.innerHTML = cardHTML;
            row.appendChild(col);
        });

        // Agregar la fila al contenedor
        postContainer.appendChild(row);
    } catch (error) {
        console.error('Error al cargar los posts:', error);
    }
};

