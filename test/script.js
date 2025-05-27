const mensajes = {
"chester": `Ey tú, mi niño hermoso <br><br>
¿Sabías que tu niña hermosa te ama con locura? <br>
Así, sin pausas, sin reglas, sin frenos. <br>
Te amo como si fueras mi videojuego favorito, <br>
quiero jugar contigo todos los días, <br>
explorarte, cuidarte, y ganar contigo siempre.<br><br>
Eres mi glitch perfecto, <br>
mi premio secreto, <br>
mi lugar feliz.<br><br>


Y no lo olvides, <br>
soy tu princesa, <br>
y estoy completamente hechizada por ti.`,
"primernovio": {
    texto: "Hoy quiero dedicarte unas palabras que quizás no siempre te digo, pero que siento profundamente en cada rincón de mi corazón. Tú eres mi primer amor real, el primero con el que entendí lo que significa amar de verdad, lo que es confiar, compartir, y construir algo hermoso juntos.<br><br>Antes de ti, amaba con sueños, con esperanza, con ilusión, pero tú llegaste y me enseñaste que el amor no es solo un sentimiento, es un acto diario, una decisión constante, una forma de ser que solo se vive en la realidad. Y eso, mi amor, es lo que más valoro de ti. Tú me has mostrado lo que es un amor real, con sus altos, sus bajos, pero siempre lleno de honestidad, paciencia y ternura.<br><br>Gracias por ser mi primer amor que nunca se desvanece, por ser quien me enseña, quien me cuida, quien me ama con una intensidad que no sabía que podía existir. Gracias por ser tú, por darme lo mejor de ti, por regalarme tu corazón y hacerme sentir tan especial. Eres mi primer amor real, y no puedo evitar sentirme afortunada por tenerte a mi lado.<br><br>Con todo mi amor,<br>Tu niña.",
    video: "[https://www.youtube.com/embed/NwIdD8PI-_c](https://www.youtube.com/embed/NwIdD8PI-_c)"
},
"tazadecafe": {
    imagen: "archivos/cafesito.webp"
},
"cofrevalioso": {
    link: "[https://lilithnml.github.io/Cofre/](https://lilithnml.github.io/Cofre/)"
},
"increible": {
    archivo: "archivos/mapa_de_estrellas.jpg"
},

};
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


if (mensajes.hasOwnProperty(code)) {
    const data = mensajes [code];
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
            window.open(data.video, "_blank");
        }


        if (data.link) {
            window.open(data.link, "_blank");
        }


        if (data.archivo) {
            const a = document.createElement("a");
            a.href = data.archivo;
            a.download = data.archivo.split('/').pop(); // Obtener el nombre del archivo
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
    contenido.classList.add("show", "animate__fadeIn");
    correctSound.play();
} else {
    contenido.innerHTML = "<p style='color: #ffdddd;'>Código no válido. Intenta con otro.</p>";
    contenido.classList.add("show", "animate__shakeX");
    incorrectSound.play();
    setTimeout(() => {
        contenido.classList.remove("animate__shakeX");
    }, 1000);
}


input.value = "";
actualizarProgreso();

}
function actualizarProgreso() {
const progreso = document.getElementById("progreso");
const total = Object.keys(mensajes).length;
const desbloqueados = JSON.parse(localStorage.getItem("desbloqueados") || "[]");
if (progreso) {
progreso.textContent = Has desbloqueado ${desbloqueados.length} de ${total} mensajes secretos.;
}
}
window.addEventListener("click", () => {
const music = document.getElementById("bgMusic");
if (music && music.paused) {
music.play().catch(() => {});
}
}, { once: true });
window.addEventListener("load", () => {
document.getElementById("codeInput").addEventListener("keypress", function(event) {
if (event.key === "Enter") {
event.preventDefault();
checkCode();
}
});
actualizarProgreso();
});
function mostrarImagenModal(src) {
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
modal.style.display = "block";
modalImg.src = src;
}
function cerrarModal() {
document.getElementById("imageModal").style.display = "none";
}
document.addEventListener("visibilitychange", () => {
const bgMusic = document.getElementById("bgMusic");
const codeAudio = document.getElementById("codeAudio");
if (document.visibilityState === "visible") {
    if (bgMusic && bgMusic.paused && codeAudio.paused) {
        bgMusic.play().catch(() => {});
    }
}

});
