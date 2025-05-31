const mensajes = {
"0011": "Cada amanecer contigo es un regalo que jamás imaginé merecer.",
"cancion": {
texto: "Nuestra canción favorita siempre me hace pensar en ti.",
video: "https://www.youtube.com/embed/kXYiU_JCYtU"
},
"skirk": {
texto: "Esta imagen siempre me recuerda a ti.",
imagen: "archivos/skirk_chibi.jpg"
},
"regalos": {
texto: "Aquí tienes un regalo especial, solo para ti.",
archivo: "archivo-sorpresa.png"
},
"wiki": {
texto: "Haz clic en el enlace para ver tu sorpresa...",
link: "https://es.m.wikipedia.org/wiki/Lilit"
},
};
/**
 * Normaliza un texto eliminando acentos, espacios, y convirtiendo caracteres especiales (como 'ñ')
 * a su equivalente más común, y luego a minúsculas.
 * @param {string} text El texto a normalizar.
 * @returns {string} El texto normalizado.
 */
function normalizarTexto(texto) {
  let normalized = texto
    .normalize("NFD") // Normaliza a la forma de descomposición (ej. "á" -> "a" + diacrítico)
    .replace(/[\u0300-\u036f]/g, ""); // Elimina los diacríticos (acentos, tildes)

  // NUEVO: Reemplazos específicos para caracteres que no son solo diacríticos
  normalized = normalized
    .replace(/ñ/g, 'n') // Reemplaza 'ñ' por 'n'
    .replace(/Ñ/g, 'N'); // Reemplaza 'Ñ' por 'N' (antes de convertir a minúsculas)

  // Elimina espacios múltiples y al inicio/final, luego convierte a minúsculas
  return normalized.replace(/\s+/g, "").toLowerCase();
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
        window.open(data.video, "_blank");
      }

      if (data.link) {
        window.open(data.link, "_blank");
      }

      if (data.archivo) {
        const a = document.createElement("a");
        a.href = data.archivo;
        a.download = data.archivo;
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
    contenido.innerHTML = "<p style='color: red;'>Código no válido. Intenta con otro.</p>";
    contenido.classList.add("show");
    incorrectSound.play();
  }

  input.value = "";
  actualizarProgreso();

  //Hace que el input pierda el foco, ocultando el teclado.
  codeInput.blur();
}

function actualizarProgreso() {
  const progreso = document.getElementById("progreso");
  const total = Object.keys(mensajes).length;
  const desbloqueados = JSON.parse(localStorage.getItem("desbloqueados") || "[]");
  if (progreso) {
    progreso.textContent = `Has desbloqueado ${desbloqueados.length} de ${total} mensajes secretos.`;
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
