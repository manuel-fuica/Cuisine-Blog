// Variables
let likeCount = 0;
let isLiked = false;
let commentsVisible = false;
let commentCount = 0; // Contador de comentarios
const likeBtn = document.getElementById("like-btn");
const likeCountElement = document.getElementById("like-count");
const commentBtn = document.getElementById("comment-btn");
const commentCountElement = document.getElementById("comment-count");
const commentsSection = document.getElementById("comments-section");
const commentForm = document.getElementById("comment-form");
const commentList = document.getElementById("comment-list");

// Manejar el botón "Me gusta"
likeBtn.addEventListener("click", function() {
    if (isLiked) {
        likeCount--; // Restar 1 si ya dio "Me gusta"
        isLiked = false; // Cambiar estado de "Me gusta" a no dado
    } else {
        likeCount++; // Sumar 1 si da "Me gusta"
        isLiked = true; // Cambiar estado de "Me gusta" a dado
    }

    // Actualizar el contador de "Me gusta"
    likeCountElement.textContent = likeCount;
});

// Manejar el botón "Comentarios"
commentBtn.addEventListener("click", function() {
    commentsVisible = !commentsVisible; // Cambiar estado de la visibilidad
    if (commentsVisible) {
        commentsSection.classList.remove("d-none"); // Mostrar comentarios
        commentBtn.textContent = `Cerrar Comentarios`;
    } else {
        commentsSection.classList.add("d-none"); // Ocultar comentarios
        commentBtn.textContent = `💬 Comentarios`;
    }
});

// Manejar el envío de comentarios
commentForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar que se recargue la página al enviar

    const commentText = document.getElementById("comment-text").value;
    if (commentText.trim()) {
        // Crear nuevo comentario
        const newComment = document.createElement("div");
        newComment.classList.add("comment", "bg-light", "p-2", "mb-2", "rounded");
        newComment.textContent = commentText;
        commentList.appendChild(newComment);

        // Incrementar el contador de comentarios
        commentCount++;
        commentCountElement.textContent = commentCount;

        // Limpiar el formulario
        document.getElementById("comment-text").value = "";
    }
});

// Manejar el botón "Ver receta completa"
viewRecipeBtn.addEventListener("click", function() {
    alert("Redirigiendo a la receta completa...");
});
