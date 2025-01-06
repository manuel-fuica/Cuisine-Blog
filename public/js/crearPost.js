document.addEventListener('DOMContentLoaded', () => {
    // Verificar el token en el localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se encontró token en el localStorage');
        return;
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


// Manejo del envío del formulario para crear un post
document.getElementById('postForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token no encontrado. No se puede enviar el post.');
        return;
    }

    // Definir variables directamente desde los inputs
    const title = document.getElementById('title').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const ingredientes = document.getElementById('ingredientes').value.trim();
    const preparacion = document.getElementById('preparacion').value.trim();
    const errors = [];

    // Validación de campos
    if (!title) errors.push('El título es obligatorio.');
    if (!descripcion) errors.push('La descripción es obligatoria.');
    if (!ingredientes) errors.push('Los ingredientes son obligatorios.');
    if (!preparacion) {
        errors.push('La preparación es obligatoria.');
    } else {
        const validFormat = /^\d+\..+/;
        const pasos = preparacion.split(/,|\n/);
        if (!pasos.every(paso => validFormat.test(paso.trim()))) {
            errors.push('El campo preparación debe tener un formato válido (ejemplo: "1. Mezclar ingredientes").');
        }
    }

    // Mostrar errores si existen
    const errorElement = document.getElementById('preparacionError');
    if (errors.length > 0) {
        errorElement.innerHTML = errors.map(err => `<p>${err}</p>`).join('');
        errorElement.style.display = 'block';
        return;
    } else {
        errorElement.style.display = 'none';
    }

    // Crear objeto para enviar al servidor
    const postData = {
        title,
        descripcion,
        ingredientes, // Enviar como cadena de texto
        preparacion
    };

    // Configurar fetch
    try {
        const response = await fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            const data = await response.json();
            alert('Post creado exitosamente.');
            

            // Limpiar el formulario
            document.getElementById('postForm').reset();
        } else {
            const errorData = await response.json();
            console.error('Error al crear el post:', errorData);
            alert('Ocurrió un error al crear el post. Inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Ocurrió un error de red. Por favor, revisa tu conexión.');
    }
});
