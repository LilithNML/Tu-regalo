// Usamos 'const' para variables que no cambian y 'let' para las que sí.
const MESSAGES = {
  "luna": `Te hablo desde la Luna,
no la que cuelga del cielo,
sino la que duerme en mi nombre.

Soy la marea que se agita
cuando tu voz toca mi orilla,
el silencio que se vuelve canción
al roce de tu risa.

He aprendido a amar mis sombras
porque en ellas tú te reflejas,
como luz callada,
como deseo que no grita
pero arde.

No soy de fuego,
pero contigo
ardería sin cenizas;
sería luna nueva
para nacerte cada noche.

Te miro desde lejos,
pero mi alma gira en torno a ti,
como si fueras tierra
y yo solo supiera
amar girando.`,
  "fortnite": {
    text: "¡Amo jugar contigo!",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Reemplazo con un video de ejemplo, asegúrate de poner el real.
  },
  "tazadecafe": {
    image: "archivos/cafesito.webp"
  },
  "cofrevalioso": {
    link: "https://lilithnml.github.io/Cofre/"
  },
  "nbujo85ft": {
    file: "archivos/mi_mayor_sueno.png"
  },
  // Ejemplo de mensaje con audio (añadido para demostración)
  "melodia": {
    text: "¡Escucha esta hermosa melodía!",
    audio: "archivos/melodia_secreta.mp3" // Asegúrate de tener este archivo
  }
};

// Referencias a elementos del DOM para evitar buscarlos repetidamente
const codeInput = document.getElementById("codeInput");
const contenidoDiv = document.getElementById("contenido");
const progresoParagraph = document.getElementById("progreso");
const correctSound = document.getElementById("correctSound");
const incorrectSound = document.getElementById("incorrectSound");
const bgMusic = document.getElementById("bgMusic");
const codeAudio = document.getElementById("codeAudio");
const imageModal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");

/**
 * Normaliza un texto eliminando acentos, espacios y convirtiéndolo a minúsculas.
 * @param {string} text El texto a normalizar.
 * @returns {string} El texto normalizado.
 */
function normalizeText(text) {
  return text
    .normalize("NFD") // Normaliza a la forma de descomposición (separando acentos)
    .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos (acentos)
    .replace(/\s+/g, "") // Elimina múltiples espacios y los reemplaza por uno (o ninguno si es el final)
    .toLowerCase(); // Convierte a minúsculas
}

/**
 * Gestiona la reproducción de sonidos y música de fondo.
 * @param {HTMLAudioElement} audioElement El elemento de audio a reproducir/pausar.
 * @param {boolean} play Si es true, reproduce; si es false, pausa.
 * @param {boolean} resetTime Si es true, reinicia el tiempo de reproducción.
 */
function manageAudio(audioElement, play, resetTime = false) {
  if (!audioElement) return; // Salir si el elemento no existe

  if (play) {
    // Solo intentar reproducir si está pausado para evitar errores.
    if (audioElement.paused) {
      audioElement.play().catch(e => console.error("Error al reproducir audio:", e));
    }
  } else {
    if (!audioElement.paused) {
      audioElement.pause();
    }
    if (resetTime) {
      audioElement.currentTime = 0;
    }
  }
}

/**
 * Muestra el contenido del mensaje desbloqueado.
 * @param {string} htmlContent El HTML a insertar en el div de contenido.
 * @param {boolean} isError Indica si el mensaje es de error para aplicar estilos o lógicas específicas.
 */
function displayContent(htmlContent, isError = false) {
  contenidoDiv.innerHTML = htmlContent;
  // Añadir/quitar clase para animaciones y estilos
  contenidoDiv.classList.add("show");
  if (isError) {
    contenidoDiv.style.color = 'var(--highlight-pink)'; // Color de error definido en CSS
  } else {
    contenidoDiv.style.color = ''; // Resetear color si no es error
  }
}

/**
 * Maneja la lógica cuando un código es correcto.
 * @param {string} code El código correcto ingresado.
 * @param {object} data Los datos asociados a ese código.
 */
function handleCorrectCode(code, data) {
  let unlockedCodes = JSON.parse(localStorage.getItem("desbloqueados") || "[]");

  if (!unlockedCodes.includes(code)) {
    unlockedCodes.push(code);
    localStorage.setItem("desbloqueados", JSON.stringify(unlockedCodes));
  }

  let html = '';

  if (typeof data === 'string') {
    html = `<p>${data}</p>`;
  } else if (typeof data === 'object') {
    html = `<p>${data.text || ''}</p>`;

    if (data.video) {
      // Uso de requestAnimationFrame para asegurar que la ventana se abre después de la renderización.
      requestAnimationFrame(() => window.open(data.video, "_blank"));
    }

    if (data.link) {
      requestAnimationFrame(() => window.open(data.link, "_blank"));
    }

    if (data.file) {
      // Creación dinámica de un enlace para descargar el archivo
      const a = document.createElement("a");
      a.href = data.file;
      a.download = data.file.split('/').pop(); // Asigna el nombre del archivo del URL
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    if (data.image) {
      showImageModal(data.image);
    }

    if (data.audio) {
      // Pausar música de fondo y reproducir audio del código
      manageAudio(bgMusic, false);
      manageAudio(codeAudio, false, true); // Reiniciar audio antes de cargar uno nuevo
      codeAudio.src = data.audio; // Cargar el nuevo audio
      manageAudio(codeAudio, true);
      codeAudio.onended = () => {
        // Al finalizar el audio del código, reanudar la música de fondo
        manageAudio(bgMusic, true);
      };
    }
  }

  displayContent(html);
  manageAudio(correctSound, true); // Reproducir sonido de éxito
  updateProgress();
}

/**
 * Verifica el código ingresado por el usuario.
 */
function checkCode() {
  const code = normalizeText(codeInput.value.trim()); // Eliminar espacios al inicio/final

  // Pausar audio de código si está sonando y reanudar música de fondo
  if (codeAudio && !codeAudio.paused) {
    manageAudio(codeAudio, false, true);
    manageAudio(bgMusic, true);
  }

  if (MESSAGES.hasOwnProperty(code)) {
    handleCorrectCode(code, MESSAGES[code]);
  } else {
    displayContent("<p>Código no válido. Intenta con otro.</p>", true);
    manageAudio(incorrectSound, true); // Reproducir sonido de error
  }

  codeInput.value = ""; // Limpiar el campo de entrada
}

/**
 * Actualiza el texto de progreso mostrando cuántos mensajes se han desbloqueado.
 */
function updateProgress() {
  const total = Object.keys(MESSAGES).length;
  const unlockedCodes = JSON.parse(localStorage.getItem("desbloqueados") || "[]");
  if (progresoParagraph) {
    progresoParagraph.textContent = `Has desbloqueado ${unlockedCodes.length} de ${total} mensajes secretos.`;
  }
}

/**
 * Muestra el modal con la imagen ampliada.
 * @param {string} src La URL de la imagen a mostrar.
 */
function showImageModal(src) {
  modalImg.src = src;
  imageModal.style.display = "block";
  imageModal.setAttribute("aria-hidden", "false"); // Hacer el modal visible para lectores de pantalla
  // Opcional: enfocar el botón de cerrar para mejorar la accesibilidad del modal
  const closeButton = imageModal.querySelector('.close');
  if (closeButton) {
    closeButton.focus();
  }
  // Añadir un event listener para cerrar el modal al presionar ESC
  document.addEventListener('keydown', handleModalEsc, { once: true });
}

/**
 * Cierra el modal de la imagen.
 */
function cerrarModal() {
  imageModal.style.display = "none";
  imageModal.setAttribute("aria-hidden", "true"); // Ocultar el modal para lectores de pantalla
  document.removeEventListener('keydown', handleModalEsc); // Eliminar el listener ESC al cerrar
  codeInput.focus(); // Devolver el foco al campo de entrada para una mejor UX
}

/**
 * Maneja el evento de teclado para cerrar el modal al presionar ESC.
 * @param {KeyboardEvent} event
 */
function handleModalEsc(event) {
  if (event.key === 'Escape') {
    cerrarModal();
  }
}


// --- Inicialización y Event Listeners ---

// Autoplay de música de fondo al primer clic del usuario (práctica recomendada)
window.addEventListener("click", () => {
  manageAudio(bgMusic, true);
}, { once: true }); // El evento se dispara solo una vez

// Inicialización cuando el DOM esté completamente cargado
window.addEventListener("DOMContentLoaded", () => {
  // Manejar el "Enter" en el campo de texto para activar el botón
  codeInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Previene la acción por defecto del Enter (ej. enviar formulario)
      checkCode();
    }
  });

  // Asegurarse de que el foco esté en el campo de entrada al cargar la página
  codeInput.focus();

  updateProgress(); // Actualizar el progreso al cargar la página
});


// Manejo de la visibilidad de la página para la música
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // Si la página vuelve a estar visible y la música de fondo está pausada y no hay audio de código sonando
    if (bgMusic && bgMusic.paused && codeAudio.paused) {
      manageAudio(bgMusic, true);
    }
  } else {
    // Pausar toda la música cuando la página no está visible
    manageAudio(bgMusic, false);
    manageAudio(codeAudio, false);
  }
});
