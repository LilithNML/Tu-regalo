const mensajes = {
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
  texto: "¡Amo jugar contigo!",
  video: "https://www.youtube.com/embed/t6YQDSgePxY"
  },
  "tazadecafe": {
  imagen: "archivos/cafesito.webp"
  }, 
  "cofrevalioso": {
  link: "https://lilithnml.github.io/Cofre/"
  },
  "nbujo85ft": {
  archivo: "archivos/mi_mayor_sueno.png"
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
