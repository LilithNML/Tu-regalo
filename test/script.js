function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .toLowerCase();
}

function checkCode() {
    const input = document.getElementById("codeInput");
    const code = normalizarTexto(input.value);
    const contenido = document.getElementById("contenido");
    const correctSound = document.getElementById("correctSound");
    const incorrectSound = document.getElementById("incorrectSound");
    const bgMusic = document.getElementById("bgMusic");
    const codeAudio = document.getElementById("codeAudio");

    // Pausar audio de código si está sonando
    if (codeAudio && !codeAudio.paused) {
        codeAudio.pause();
        codeAudio.currentTime = 0;
        if (bgMusic && bgMusic.paused) bgMusic.play().catch(() => {});
    }

    // Aquí deberías tener tu objeto 'mensajes' definido con tus códigos y contenidos
    // Por ejemplo:
    const mensajes = {
    "micodesecreto": "Este es un mensaje secreto.",
    "otrocodigo": {
    texto: "Este es un mensaje con video.",
    video: "https://m.youtube.com/watch?v=aM0gNgbNKYY&pp=ygUlaSBsaWtlIHRoZSB3YXkgeW91IGtpc3MgbWUgaW52aW5jaWJsZQ%3D%3D"
       }
     };

    /* ... TUS MENSAJES Y CÓDIGOS AQUÍ ... */
    const mensajes = {
        // Tu objeto de mensajes completo iría aquí.
        // Por ejemplo, para que esto funcione, podrías pegar la sección
        // 'const mensajes = { ... }' de tu script.js original aquí.
        // Si lo dejas vacío, ningún código funcionará.
    };


    if (mensajes.hasOwnProperty(code)) {
        const data = mensajes[code];
        let desbloqueados = JSON.parse(localStorage.getItem("desbloqueados") || "[]");

        if (!desbloqueados.includes(code)) {
            desbloqueados.push(code);
            localStorage.setItem("desbloqueados", JSON.stringify(desbloqueados));
        }

        let html = '';

        if (typeof data === 'string') {
            html = `<p>${data}</p>`;
        } else if (typeof data === 'object') {
            html = `<p>${data.texto || ''}</p>`;

            if (data.video) {
                // Aquí podrías incrustar el video directamente si lo prefieres,
                // por ejemplo, con un iframe de YouTube.
                // html += `<iframe src="${data.video.replace("youtube.com/", "youtube.com/embed/")}" frameborder="0" allowfullscreen></iframe>`;
                window.open(data.video, "_blank"); // Abre el video en una nueva pestaña
            }

            if (data.link) {
                window.open(data.link, "_blank");
            }

            if (data.archivo) {
                const a = document.createElement("a");
                a.href = data.archivo;
                // Puedes cambiar el nombre de descarga si lo deseas
                a.download = data.archivo.split('/').pop(); 
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }

            if (data.imagen) {
                mostrarImagenModal(data.imagen);
            }

            if (data.audio) {
                if (bgMusic && !bgMusic.paused) {
                    bgMusic.pause();
                }

                if (codeAudio) {
                    // Verificamos que no sea el mismo audio ya cargado
                    if (!codeAudio.src.includes(data.audio)) {
                        codeAudio.src = data.audio;
                    }
                    codeAudio.play().catch(() => {});
                    codeAudio.onended = () => {
                        if (bgMusic && bgMusic.paused) {
                            bgMusic.play().catch(() => {});
                        }
                    };
                }
            }
        }

        contenido.innerHTML = html;
        contenido.classList.add("show");
        correctSound.play();
    } else {
        contenido.innerHTML = "<p class='error-message'>Código no válido. Intenta con otro.</p>";
        contenido.classList.add("show");
        incorrectSound.play();
    }

    input.value = "";
    actualizarProgreso(Object.keys(mensajes).length); // Pasa la cantidad total de mensajes
}

function actualizarProgreso(totalMensajes) {
    const progreso = document.getElementById("progreso");
    const desbloqueados = JSON.parse(localStorage.getItem("desbloqueados") || "[]");
    if (progreso) {
        progreso.textContent = `Has desbloqueado ${desbloqueados.length} de ${totalMensajes} mensajes secretos.`;
    }
}

// Escuchar el clic inicial para permitir la reproducción de audio
window.addEventListener("click", () => {
    const music = document.getElementById("bgMusic");
    if (music && music.paused) {
        music.play().catch(() => {
            // Manejar error si el navegador bloquea la reproducción automática
            console.warn("Reproducción de música de fondo bloqueada por el navegador. Se intentará de nuevo al interactuar.");
        });
    }
}, { once: true }); // 'once: true' asegura que el evento solo se dispare una vez

// Inicializar al cargar la página
window.addEventListener("load", () => {
    // Asignar el evento al botón
    document.getElementById("checkButton").addEventListener("click", checkCode);

    // Asignar el evento a la tecla Enter en el input
    document.getElementById("codeInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Previene el comportamiento por defecto de Enter (ej. enviar formulario)
            checkCode();
        }
    });

    // Obtener la cantidad total de mensajes para el progreso inicial
    // Necesitas poner tu objeto 'mensajes' aquí o pasarlo de alguna forma
    // para que la función pueda contar el total.
    // Si no tienes los mensajes aquí, el total será 0 inicialmente.
    // Una forma simple es contar el tamaño del objeto mensajes globalmente.
    const total = Object.keys(mensajes).length; // Esto funcionará si 'mensajes' está definido arriba
    actualizarProgreso(total);
});

function mostrarImagenModal(src) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    modal.style.display = "flex"; // Usa flexbox para centrar la imagen
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modalImg.src = src;
}

function cerrarModal() {
    document.getElementById("imageModal").style.display = "none";
}

// Manejo de la visibilidad de la pestaña para pausar/reanudar música
document.addEventListener("visibilitychange", () => {
    const bgMusic = document.getElementById("bgMusic");
    const codeAudio = document.getElementById("codeAudio");

    if (document.visibilityState === "visible") {
        if (bgMusic && bgMusic.paused && codeAudio.paused) {
            bgMusic.play().catch(() => {});
        }
    } else {
        // Pausar toda la música cuando la pestaña no está visible
        if (bgMusic && !bgMusic.paused) {
            bgMusic.pause();
        }
        if (codeAudio && !codeAudio.paused) {
            codeAudio.pause();
        }
    }
});
