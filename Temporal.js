// Referencias a elementos del DOM
const codeInput = document.getElementById("codeInput");
const contenidoDiv = document.getElementById("contenido");
const correctSound = document.getElementById("correctSound");
const incorrectSound = document.getElementById("incorrectSound");
const bgMusic = document.getElementById("bgMusic");
const codeAudio = document.getElementById("codeAudio");
const progresoParrafo = document.getElementById("progreso");
const musicToggleBtn = document.getElementById("musicToggle");
const musicToggleIcon = musicToggleBtn.querySelector('i');
const toggleUnlockedCodesBtn = document.getElementById("toggleUnlockedCodes");
const unlockedCodesList = document.getElementById("unlockedCodesList");

/**
 * Normaliza un texto eliminando acentos, espacios, y convirtiendo caracteres especiales (como 'ñ')
 * a su equivalente más común, y luego a minúsculas.
 * @param {string} text El texto a normalizar.
 * @returns {string} El texto normalizado.
 */
function normalizarTexto(texto) {
  return texto
    .normalize("NFD") // Normaliza a la forma de descomposición (ej. "á" -> "a" + diacrítico)
    .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos (acentos, tildes)
    .replace(/ñ/g, 'n').replace(/Ñ/g, 'N') // Reemplaza 'ñ' por 'n'
    .replace(/\s+/g, "") // Elimina espacios múltiples y al inicio/final
    .toLowerCase(); // Convierte a minúsculas
}

/**
 * Aplica feedback visual al input (borde verde para éxito, rojo para error).
 * @param {boolean} success True para éxito, false para error.
 */
function applyInputFeedback(success) {
  codeInput.classList.remove("success", "error");
  if (success) {
    codeInput.classList.add("success");
  } else {
    codeInput.classList.add("error");
  }
  // Eliminar el feedback después de un tiempo
  setTimeout(() => {
    codeInput.classList.remove("success", "error");
  }, 1500);
}

function checkCode() {
  const code = normalizarTexto(codeInput.value);

  // Pausar audio de código si está sonando y reproducir música de fondo si estaba pausada
  if (codeAudio && !codeAudio.paused) {
    codeAudio.pause();
    codeAudio.currentTime = 0;
    if (bgMusic.paused && !musicToggleBtn.classList.contains('paused')) { // Solo si no fue pausado manualmente
      bgMusic.play().catch(() => {});
    }
  }

  if (mensajes.hasOwnProperty(code)) {
    const data = mensajes[code];
    let desbloqueados = JSON.parse(localStorage.getItem("desbloqueados") || "[]");

    // Añadir el código si no estaba desbloqueado
    if (!desbloqueados.includes(code)) {
      desbloqueados.push(code);
      localStorage.setItem("desbloqueados", JSON.stringify(desbloqueados));
      applyInputFeedback(true); // Feedback de éxito solo si es un código nuevo
    } else {
      applyInputFeedback(true); // Feedback de éxito incluso si ya estaba
    }

    let html = '';

    if (typeof data === 'string') {
      html = `<p>${data}</p>`;
    } else if (typeof data === 'object') {
      // Si hay texto, agregarlo
      if (data.texto) {
        html += `<p>${data.texto}</p>`;
      }

      // Manejar videos incrustados
      if (data.videoEmbed) {
        html += `<div class="video-container"><iframe src="${data.videoEmbed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Contenido de video desbloqueado"></iframe></div>`;
      }

      // Manejar enlaces externos
      if (data.link) {
        html += `<p><a href="${data.link}" target="_blank" rel="noopener noreferrer" class="download-link">Abrir contenido especial</a></p>`;
      }

      // Manejar descargas (como enlace, no descarga automática)
      if (data.descarga) {
        html += `<p><a href="${data.descarga.url}" download="${data.descarga.nombre || 'archivo_desbloqueado'}" class="download-link">${data.descarga.textoEnlace || 'Descargar archivo'}</a></p>`;
      }

      // Manejar imágenes en modal
      if (data.imagen) {
        mostrarImagenModal(data.imagen);
        // No agregamos HTML aquí, ya que se muestra en un modal.
      }

      // Manejar audios de código
      if (data.audio) {
        if (!bgMusic.paused) { // Pausar solo si la música de fondo está sonando
          bgMusic.pause();
        }

        if (codeAudio) {
          // Solo cargar y reproducir si es un audio diferente
          if (codeAudio.src !== data.audio) {
            codeAudio.src = data.audio;
          }
          codeAudio.play().catch(e => console.error("Error al reproducir audio del código:", e));
          codeAudio.onended = () => {
            if (!musicToggleBtn.classList.contains('paused')) { // Reanudar solo si la música de fondo no fue pausada manualmente
              bgMusic.play().catch(() => {});
            }
          };
        }
      }
    }

    contenidoDiv.innerHTML = html;
    contenidoDiv.classList.add("show");
    correctSound.play();
  } else {
    contenidoDiv.innerHTML = "<p style='color: var(--error-color);'>Código no válido. Intenta con otro.</p>";
    contenidoDiv.classList.add("show");
    incorrectSound.play();
    applyInputFeedback(false); // Feedback de error
  }

  codeInput.value = ""; // Limpiar el input
  actualizarProgreso();

  // Hace que el input pierda el foco, ocultando el teclado en móviles
  codeInput.blur();
}

function actualizarProgreso() {
  const total = Object.keys(mensajes).length;
  const desbloqueados = JSON.parse(localStorage.getItem("desbloqueados") || "[]");

  if (progresoParrafo) {
    progresoParrafo.textContent = `Has desbloqueado ${desbloqueados.length} de ${total} mensajes secretos.`;
  }

  // Actualizar la lista de códigos desbloqueados
  unlockedCodesList.innerHTML = '';
  if (desbloqueados.length > 0) {
    desbloqueados.forEach(code => {
      const li = document.createElement('li');
      // Solo mostramos el código, no el contenido para mantener el misterio de los mensajes
      li.textContent = `${code}`; 
      unlockedCodesList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'Ningún código desbloqueado aún.';
    unlockedCodesList.appendChild(li);
  }
}

/**
 * Gestiona la reproducción/pausa de la música de fondo.
 */
function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      musicToggleIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
      musicToggleBtn.classList.remove('paused');
    }).catch(e => console.error("Error al reproducir música de fondo:", e));
  } else {
    bgMusic.pause();
    musicToggleIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
    musicToggleBtn.classList.add('paused');
  }
}

/**
 * Muestra la imagen en el modal.
 * @param {string} src La URL de la imagen.
 */
function mostrarImagenModal(src) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  modal.style.display = "block";
  modalImg.src = src;
  modal.focus(); // Enfocar el modal para accesibilidad
}

/**
 * Cierra el modal de imagen.
 */
function cerrarModal() {
  document.getElementById("imageModal").style.display = "none";
}

// --- Event Listeners y Lógica Inicial ---

// Reproducir música al primer click del usuario en cualquier parte
window.addEventListener("click", () => {
  if (bgMusic.paused && !musicToggleBtn.classList.contains('paused')) {
    bgMusic.play().catch(() => {
      // console.log("La reproducción automática de audio fue bloqueada. El usuario deberá interactuar con el botón de música.");
      // Actualizar el icono a 'mute' si no se pudo reproducir automáticamente
      musicToggleIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
      musicToggleBtn.classList.add('paused');
    });
  }
}, {
  once: true
});

// Inicialización cuando la página carga
window.addEventListener("load", () => {
  codeInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Evita el envío de formularios si existiera
      checkCode();
    }
  });

  musicToggleBtn.addEventListener("click", toggleMusic);

  toggleUnlockedCodesBtn.addEventListener("click", () => {
    const isHidden = unlockedCodesList.hidden;
    unlockedCodesList.hidden = !isHidden;
    toggleUnlockedCodesBtn.setAttribute('aria-expanded', !isHidden);
    toggleUnlockedCodesBtn.textContent = isHidden ? 'Ocultar Códigos Desbloqueados' : 'Mostrar Códigos Desbloqueados';
  });


  actualizarProgreso();

  // Asegurar que el icono de música refleje el estado inicial
  if (bgMusic.paused) {
    musicToggleIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
    musicToggleBtn.classList.add('paused');
  }
});

// Control de audio cuando la visibilidad de la pestaña cambia
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // Si la música de fondo estaba sonando y no está pausada manualmente, y el audio de código está pausado
    if (bgMusic.paused && codeAudio.paused && !musicToggleBtn.classList.contains('paused')) {
      bgMusic.play().catch(() => {});
    }
  } else {
    // Pausar ambos audios al salir de la pestaña
    if (!bgMusic.paused) bgMusic.pause();
    if (!codeAudio.paused) codeAudio.pause();
  }
});

// Manejo del foco del modal para accesibilidad
document.addEventListener('keydown', function(event) {
  const modal = document.getElementById('imageModal');
  if (modal.style.display === 'block') {
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Escape') {
      cerrarModal();
    } else if (event.key === 'Tab') {
      if (event.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          event.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          event.preventDefault();
        }
      }
    }
  }
});

// Código para el menú desplegable
const menuButton = document.getElementById('menuButton');
const dropdownMenu = document.getElementById('dropdownMenu');

if (menuButton && dropdownMenu) {
  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', !isExpanded);
    dropdownMenu.classList.toggle('show');
    dropdownMenu.setAttribute('aria-hidden', isExpanded);

    // Enfocar el primer elemento del menú cuando se abre para accesibilidad
    if (!isExpanded) {
      dropdownMenu.querySelector('a')?.focus();
    }
  });

  // Cerrar el menú si se hace clic fuera de él
  document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
      if (dropdownMenu.classList.contains('show')) {
        dropdownMenu.classList.remove('show');
        menuButton.setAttribute('aria-expanded', 'false');
        dropdownMenu.setAttribute('aria-hidden', 'true');
      }
    }
  });

  // Manejo de teclado para accesibilidad del menú
  dropdownMenu.addEventListener('keydown', function(event) {
    const focusableElements = this.querySelectorAll('a');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Escape') {
      dropdownMenu.classList.remove('show');
      menuButton.setAttribute('aria-expanded', 'false');
      dropdownMenu.setAttribute('aria-hidden', 'true');
      menuButton.focus(); // Devolver el foco al botón del menú
      event.preventDefault();
    } else if (event.key === 'Tab') {
      if (event.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          event.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          event.preventDefault();
        }
      }
    }
  });
}
