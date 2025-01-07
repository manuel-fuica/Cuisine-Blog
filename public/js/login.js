// JS para manejar los datos recibidos en el inicio de sesión y redirigir al home si el inicio de sesión es exitoso
//DomContentLoaded se utiliza para asegurarse de que el contenido del documento se haya cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signinForm');

    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar el comportamiento predeterminado del formulario al dar click en el submit

        //toma los datos del formulario
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

            //guarda los datos recibidos en la variable data
            const data = await response.json();

            // Verifica el estado de la respuesta
            if (response.ok) {
                console.log('Inicio de sesión exitoso, token recibido', data.token);
                //almacena el token en el localStorage
                localStorage.setItem('token', data.token);

                //Guarda el nombre y el id del usuario en el localStorage
                const userID = data.user.id;
                const userName = data.user.username;
                localStorage.setItem('userID', userID);
                localStorage.setItem('username', userName);

                //redirige al home
                window.location.href = 'http://localhost:5000/home';
            } else {
                //muestra un alert de error
                alert(data.error);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    });
});