// JS para manejar los datos recibidos en el inicio de sesión y redirigir al home si el inicio de sesión es exitoso

document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signinForm');

    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar el comportamiento predeterminado del formulario

        const email = document.getElementById('correo').value;
        const password = document.getElementById('password').value;

        try {
            // Realiza la solicitud al servidor
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Inicio de sesión exitoso, token recibido', data.token);
                alert('Inicio de sesión exitoso');
                localStorage.setItem('token', data.token);
                window.location.href = 'http://localhost:5000/home';
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    });
});