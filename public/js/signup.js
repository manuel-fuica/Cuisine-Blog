
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenir el envío por defecto del formulario

        // Obtener los datos del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validar que los campos no estén vacíos
        if (!nombre || !correo || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Crear el objeto de usuario
        const userData = {
            username: nombre,
            email: correo,
            password: password
        };

        try {
            // Llamar al endpoint para registrar al usuario
            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert('Usuario registrado exitosamente.');
                // Redirigir a la página raíz
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                alert(`Error al registrar usuario: ${errorData.message || 'Inténtelo nuevamente.'}`);
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            alert('Ocurrió un error inesperado. Por favor, inténtelo más tarde.');
        }
    });
});

