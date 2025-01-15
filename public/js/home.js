document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('username');

    // Manejo del nombre de usuario y cierre de sesión
    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement) {
        const spanElement = userInfoElement.querySelector('span');
        if (spanElement) {
            spanElement.textContent = userName || 'Usuario'; // Mostrar 'Usuario' si no hay nombre
        }

        userInfoElement.title = 'Haz clic para cerrar sesión'; // Tooltip
        userInfoElement.addEventListener('click', () => {
            // Eliminar token y username del localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            // Redirigir a la página de login
            window.location.href = '/';
        });
    } else {
        console.error('No se encontró el elemento con id "user-info" en el DOM');
    }

    // Verificar el token
    if (token) {
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        fetchPosts(headers);
    } else {
        console.error('No se encontró token en el localStorage');
        alert('Token no válido o expirado, inicia sesión nuevamente');
        window.location.href = '/';
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

// Función para obtener y mostrar los posts
const fetchPosts = async (headers) => {
    try {
        const response = await fetch('/posts', { headers });

        // Verificar si el token ha expirado o no es válido
        if (!response.ok) {
            throw new Error('Token no válido o expirado');
        }

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
                      <h5 class="card-title">${post.titulo}</h5>
                      <p class="card-text">${post.descripcion}</p>
                      <div class="mt-auto">
                          <div class="d-flex gap-3">
                              <button id="like-btn" class="btn btn-outline-primary bg-primary text-white">❤️ <span id="like-count">0</span></button>
                              <button 
                                  class="btn btn-outline-success bg-success text-white view-recipe-btn" 
                                  data-id="${post.id}">
                                  Ver receta
                              </button>
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

        // Añadir event listener a los botones "Ver receta"
        document.querySelectorAll('.view-recipe-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const recipeId = e.target.getAttribute('data-id');
                // Redirigir al endpoint con el ID de la receta como hash
                window.location.href = `/recetas#${recipeId}`;
            });
        });
    } catch (error) {
        console.error('Error al cargar los posts:', error);
        alert('Token no válido o expirado, inicia sesión nuevamente');
        window.location.href = '/';
    }
};
