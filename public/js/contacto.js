document.addEventListener('DOMContentLoaded', () => {
    // Verificar el token en el localStorage
    const token = localStorage.getItem('token');
    if (token) {
        const headers = {
            'Authorization': `Bearer ${token}`
        };
    } else {
        console.error('No se encontró token en el localStorage');
    }

    // Obtener el nombre de usuario desde el localStorage
    const userName = localStorage.getItem('username');
    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement && userName) {
        const spanElement = userInfoElement.querySelector('span');
        if (spanElement) {
            spanElement.textContent = userName;
        }

        userInfoElement.title = 'Haz clic para cerrar sesión';
        userInfoElement.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.href = '/';
        });
    }

    // Manejar el envío del formulario de contacto
    const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

            // Mostrar el spinner de carga
            statusMessage.classList.remove('d-none');
            statusIcon.classList.add('fa-spinner', 'fa-spin');
            statusText.textContent = "Enviando mensaje...";

            // Recoger los datos del formulario
            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            const asunto = document.getElementById('asunto').value;
            const mensaje = document.getElementById('mensaje').value;

            try {
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ nombre, correo, asunto, mensaje }),
                });

                const data = await response.json();
                if (response.ok) {
                    // Cambiar icono y texto por éxito
                    statusIcon.classList.remove('fa-spinner', 'fa-spin');
                    statusIcon.classList.add('fa-check-circle', 'text-success');
                    statusText.textContent = "Mensaje enviado con éxito";

                    // Limpiar el formulario después de 2 segundos
                    setTimeout(() => {
                        form.reset();
                        statusMessage.classList.add('d-none');
                    }, 2000);
                } else {
                    // Mostrar error
                    statusIcon.classList.remove('fa-spinner', 'fa-spin');
                    statusIcon.classList.add('fa-times-circle', 'text-danger');
                    statusText.textContent = "No se pudo enviar el mensaje";

                    // Limpiar el spinner después de 2 segundos
                    setTimeout(() => {
                        statusMessage.classList.add('d-none');
                    }, 2000);
                }
            } catch (error) {
                console.error('Error al enviar el correo:', error);

                // Mostrar error
                statusIcon.classList.remove('fa-spinner', 'fa-spin');
                statusIcon.classList.add('fa-times-circle', 'text-danger');
                statusText.textContent = "No se pudo enviar el mensaje";

                // Limpiar el spinner después de 2 segundos
                setTimeout(() => {
                    statusMessage.classList.add('d-none');
                }, 2000);
            }
        });
    }
});
