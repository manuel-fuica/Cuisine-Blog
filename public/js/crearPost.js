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
    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const ingredientes = document.getElementById('ingredientes').value.trim();
    const preparacion = document.getElementById('preparacion').value.trim();
    const errors = [];

    // Validación de campos
    if (!titulo) errors.push('El título es obligatorio.');
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

    // Mostrar el mensaje de estado "Creando post..." y mostrar el spinner
    const statusMessage = document.getElementById('statusMessage');
    const statusText = document.getElementById('statusText');
    const statusIcon = document.getElementById('statusIcon');
    statusMessage.classList.remove('d-none'); // Mostrar el mensaje de estado
    statusText.textContent = 'Creando post...';
    statusIcon.classList.add('fa-spin'); // Agregar animación de carga

    // Crear objeto para enviar al servidor
    const postData = {
        titulo,
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
            // Cambiar icono y texto por éxito
            statusIcon.classList.remove('fa-spinner', 'fa-spin');
            statusIcon.classList.add('fa-check-circle', 'text-success');
            statusText.textContent = "Post creado con éxito";

            // Limpiar el formulario después de 2 segundos
            setTimeout(() => {
                document.getElementById('postForm').reset();
                statusMessage.classList.add('d-none');
            }, 2000);
        } else {
                    const errorData = await response.json();
                    console.error('Error al crear el post:', errorData);
                    // Mostrar mensaje de error
                    statusText.textContent = 'Ocurrió un error al crear el post. Inténtalo de nuevo.';
                    statusIcon.classList.remove('fa-spin'); // Detener la animación de carga
                    statusIcon.classList.add('fa-times-circle'); // Icono de error
                    setTimeout(() => {
                        statusMessage.classList.add('d-none'); // Ocultar el mensaje de estado después de 2 segundos
                    }, 2000);
                }
            } catch (error) {
                console.error('Error de red:', error);
                // Mostrar mensaje de error de red
                statusText.textContent = 'Ocurrió un error de red. Por favor, revisa tu conexión.';
                statusIcon.classList.remove('fa-spin'); // Detener la animación de carga
                statusIcon.classList.add('fa-times-circle'); // Icono de error
                setTimeout(() => {
                    statusMessage.classList.add('d-none'); // Ocultar el mensaje de estado después de 2 segundos
                }, 2000);
            }
        });