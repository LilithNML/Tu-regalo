let mensajes = {};
let codigosUsados = new Set();

function cargarMensajes() {
  fetch('mensajes.json')
    .then(response => response.json())
    .then(data => {
      mensajes = data;
      actualizarProgreso();
    })
    .catch(error => console.error("Error al cargar los mensajes:", error));
}

function checkCode() {
  const code = document.getElementById("codeInput").value.trim().toLowerCase();
  const mensajeContainer = document.getElementById("mensajeContainer");
  const mensajeTexto = document.getElementById("mensajeTexto");
  const mensajeImagen = document.getElementById("mensajeImagen");
  const mensajeVideo = document.getElementById("mensajeVideo");
  const mensajeError = document.getElementById("mensajeError");

  mensajeTexto.textContent = "";
  mensajeImagen.style.display = "none";
  mensajeVideo.style.display = "none";
  mensajeError.textContent = "";

  if (mensajes[code]) {
    if (codigosUsados.has(code)) {
      mensajeError.textContent = "Este código ya fue usado.";
    } else {
      codigosUsados.add(code);
      const contenido = mensajes[code];
      mensajeTexto.textContent = contenido.texto || "";

      if (contenido.imagen) {
        mensajeImagen.src = contenido.imagen;
        mensajeImagen.style.display = "block";
      }

      if (contenido.video) {
        mensajeVideo.src = contenido.video;
        mensajeVideo.style.display = "block";
      }

      actualizarProgreso();
    }
  } else {
    mensajeError.textContent = "Código incorrecto.";
  }

  document.getElementById("codeInput").value = "";
}

function actualizarProgreso() {
  const total = Object.keys(mensajes).length;
  const usados = codigosUsados.size;
  const porcentaje = total > 0 ? Math.round((usados / total) * 100) : 0;
  document.getElementById("progreso").textContent = `Progreso: ${porcentaje}%`;
}

window.addEventListener("load", () => {
  cargarMensajes();
  document.getElementById("codeInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      checkCode();
    }
  });
});
