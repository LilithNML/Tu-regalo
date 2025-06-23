// script.js - Lógica principal de la aplicación

// Referencias a elementos clave del DOM
const CODE_FORM = document.getElementById('code-form');
const CODE_INPUT = document.getElementById('code-input');
const ERROR_MSG = document.getElementById('error-message');
const GIFT_MODAL = document.getElementById('gift-modal');
const GIFT_CONTAINER = document.getElementById('gift-container');
const CLOSE_MODAL = document.querySelector('.close-modal');
const SETTINGS_GEAR = document.getElementById('settings-gear');
const SETTINGS_PANEL = document.getElementById('settings-panel');
const CLOSE_SETTINGS = document.querySelector('.close-settings');
const THEME_PICKER = document.getElementById('theme-picker');
const DARK_MODE_TOGGLE = document.getElementById('dark-mode-toggle');
const UNLOCKED_LIST = document.getElementById('unlocked-list');
const RESET_BTN = document.getElementById('reset-btn');
const PROGRESS_COUNT = document.getElementById('unlocked-count');
const TOTAL_COUNT = document.getElementById('total-count');
const NO_GIFTS_MESSAGE = document.getElementById('no-gifts-message'); // Nuevo elemento para mensaje de lista vacía

// Definición de temas disponibles
const THEMES = [
  { key: "rosado", label: "Rosado pastel", colors: ["#e57373", "#f7cac9"] },
  { key: "celeste", label: "Celeste claro", colors: ["#64b5f6", "#aee1fa"] },
  { key: "dorado", label: "Dorado suave", colors: ["#ffc107", "#ffe082"] },
  { key: "noche", label: "Noche estrellada", colors: ["#5f72bd", "#393e54"] },
  { key: "galaxia", label: "Galaxia violeta", colors: ["#b085f5", "#e1bee7"] },
  { key: "lavanda", label: "Lavanda", colors: ["#b39ddb", "#e1bee7"] },
  { key: "bosque", label: "Verde bosque", colors: ["#388e3c", "#a5d6a7"] },
  { key: "sepia", label: "Vintage sepia", colors: ["#b3702b", "#ecdbc1"] },
  { key: "cereza", label: "Rojo cereza", colors: ["#d72660", "#f98ca4"] },
  { key: "atardecer", label: "Atardecer cálido", colors: ["#ff884d", "#ffd6ad"] },
  { key: "crema", label: "Crema elegante", colors: ["#e9c46a", "#ffe1a8"] },
  { key: "gris", label: "Gris minimalista", colors: ["#a2a2a2", "#dddddd"] }
];

// --- UTILIDADES ---

/**
 * Decodifica una cadena Base64 a una cadena UTF-8.
 * @param {string} str La cadena Base64 a decodificar.
 * @returns {string} La cadena decodificada o una cadena vacía si hay un error.
 */
function b64decode(str) {
  try {
    // Usar TextDecoder para un manejo más robusto de UTF-8
    const decoded = atob(str);
    const decoder = new TextDecoder('utf-8');
    const bytes = new Uint8Array(decoded.split('').map(char => char.charCodeAt(0)));
    return decoder.decode(bytes);
  } catch (error) {
    console.error("Error decoding Base64:", error);
    return "";
  }
}

/**
 * Guarda un estado en localStorage.
 * @param {string} key La clave para almacenar.
 * @param {any} value El valor a almacenar.
 */
function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving state for key "${key}":`, error);
  }
}

/**
 * Carga un estado de localStorage.
 * @param {string} key La clave para cargar.
 * @param {any} defaultValue El valor predeterminado si no se encuentra o hay un error.
 * @returns {any} El valor cargado o el valor predeterminado.
 */
function loadState(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.warn(`Error loading state for key "${key}", using default:`, error);
    return defaultValue;
  }
}

/**
 * Función para pausar la ejecución (útil para animaciones secuenciales).
 * @param {number} ms Milisegundos a esperar.
 * @returns {Promise<void>} Una promesa que se resuelve después del tiempo especificado.
 */
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// --- ESTADO DE LA APLICACIÓN ---
let unlockedCodes = loadState("romantic_unlocked", []);
let currentThemeKey = loadState("romantic_theme", "rosado");
let isDarkMode = loadState("romantic_dark", false);

// --- INICIALIZACIÓN Y ACTUALIZACIÓN DE UI ---

/**
 * Aplica el tema seleccionado al documento.
 * @param {string} newThemeKey La clave del tema a aplicar.
 */
function setTheme(newThemeKey) {
  document.documentElement.setAttribute("data-theme", newThemeKey);
  currentThemeKey = newThemeKey;
  saveState("romantic_theme", newThemeKey);
}

/**
 * Aplica el modo oscuro/claro al documento.
 * @param {boolean} on Si el modo oscuro debe estar activado.
 */
function setDarkMode(on) {
  document.documentElement.setAttribute("data-mode", on ? "dark" : "light");
  isDarkMode = on;
  saveState("romantic_dark", on);
}

/**
 * Actualiza el contador de regalos desbloqueados.
 */
function updateProgress() {
  PROGRESS_COUNT.textContent = unlockedCodes.length;
  // Asegurarse de que GIFTS_DATA esté cargado antes de acceder a .length
  if (typeof GIFTS_DATA !== 'undefined' && GIFTS_DATA.length > 0) {
    TOTAL_COUNT.textContent = GIFTS_DATA.length;
  } else {
    TOTAL_COUNT.textContent = '...'; // Mostrar un placeholder si aún no se carga data.js
  }
}

/**
 * Renderiza la lista de regalos desbloqueados en el panel de configuración.
 */
function renderUnlockedList() {
  if (unlockedCodes.length === 0) {
    UNLOCKED_LIST.innerHTML = "";
    NO_GIFTS_MESSAGE.classList.remove("hidden");
  } else {
    NO_GIFTS_MESSAGE.classList.add("hidden");
    UNLOCKED_LIST.innerHTML = unlockedCodes.map(code => {
      const gift = GIFTS_DATA.find(g => g.code === code);
      const label = gift?.meta?.title || `Código: "${code}"`;
      return `<li>${label}</li>`;
    }).join("");
  }
}

/**
 * Muestra un mensaje de error al usuario.
 * @param {string} msg El mensaje de error a mostrar.
 */
function showError(msg) {
  ERROR_MSG.textContent = msg;
  ERROR_MSG.classList.add("show");
  ERROR_MSG.setAttribute("aria-live", "assertive");
}

/**
 * Oculta el mensaje de error.
 */
function hideError() {
  ERROR_MSG.classList.remove("show");
  ERROR_MSG.setAttribute("aria-live", "off");
}

/**
 * Reinicia todo el progreso y configuración.
 * @param {boolean} confirmFirst Si se debe pedir confirmación al usuario.
 */
function resetAll(confirmFirst = true) {
  if (confirmFirst && !confirm("¿Estás seguro de que quieres borrar tu progreso y la configuración? Esta acción no se puede deshacer.")) {
    return;
  }
  unlockedCodes = [];
  saveState("romantic_unlocked", unlockedCodes);
  setTheme("rosado");
  setDarkMode(false);
  DARK_MODE_TOGGLE.checked = false;
  updateProgress();
  renderUnlockedList();
  renderThemePicker();
  CODE_INPUT.value = "";
  CODE_INPUT.focus();
  closeSettings();
}

// --- LÓGICA DE DESBLOQUEO DE REGALOS ---

CODE_FORM.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const code = CODE_INPUT.value.trim();
  if (!code) {
    showError("Por favor, ingresa un código.");
    return;
  }

  CODE_INPUT.disabled = true;
  document.getElementById('unlock-btn').disabled = true;

  // Asegurarse de que GIFTS_DATA esté disponible
  if (typeof GIFTS_DATA === 'undefined' || GIFTS_DATA.length === 0) {
      showError("Error: No se pudieron cargar los datos de regalos. Intenta recargar la página.");
      CODE_INPUT.disabled = false;
      document.getElementById('unlock-btn').disabled = false;
      return;
  }

  const gift = GIFTS_DATA.find(g => g.code === code);

  if (!gift) {
    showError("Código incorrecto. ¡Sigue buscando!");
    await sleep(2000);
    showError("¿Lo intentamos de nuevo? 💖");
    await sleep(1800);
    hideError();
  } else {
    if (!unlockedCodes.includes(code)) {
      unlockedCodes.push(code);
      saveState("romantic_unlocked", unlockedCodes);
      updateProgress();
      renderUnlockedList();
    }
    showGiftModal(gift);
  }

  CODE_INPUT.value = "";
  CODE_INPUT.disabled = false;
  document.getElementById('unlock-btn').disabled = false;
  CODE_INPUT.focus();
});

/**
 * Muestra el modal de regalo con el contenido correspondiente.
 * @param {object} gift El objeto regalo a mostrar.
 */
function showGiftModal(gift) {
  GIFT_CONTAINER.innerHTML = "";
  const modalTitleEl = document.getElementById('gift-modal-title');

  if (gift.meta?.title) {
    modalTitleEl.textContent = gift.meta.title;
    GIFT_CONTAINER.innerHTML += `<h2 class="gift-modal-title">${gift.meta.title}</h2>`;
  } else {
    modalTitleEl.textContent = "¡Has descubierto un regalo!";
  }

  switch (gift.type) {
    case "text":
      showTypewriterText(b64decode(gift.content));
      break;
    case "image":
      showGiftImage(b64decode(gift.content), gift.meta?.alt || "Imagen de regalo");
      break;
    case "video":
      showGiftVideo(b64decode(gift.content));
      break;
    case "audio":
      showGiftAudio(b64decode(gift.content));
      break;
    case "download":
      showGiftDownload(b64decode(gift.content), gift.meta?.title || "Descargar regalo");
      break;
    default:
      GIFT_CONTAINER.innerHTML += `<p class="gift-text">Lo siento, este tipo de regalo no es compatible.</p>`;
      console.warn("Tipo de regalo desconocido:", gift.type);
      break;
  }

  GIFT_MODAL.classList.remove("hidden");
  // Asegurarse de que el modal content exista antes de intentar enfocarlo
  const modalContent = GIFT_MODAL.querySelector(".modal-content");
  if (modalContent) {
    modalContent.focus();
  }
}

/**
 * Cierra el modal de regalo y limpia su contenido.
 */
function closeGiftModal() {
  GIFT_MODAL.classList.add("hidden");
  GIFT_CONTAINER.innerHTML = "";
  document.getElementById('gift-modal-title').textContent = "";
  CODE_INPUT.focus();
}

// --- RENDERIZADORES DE TIPOS DE REGALOS ---

/**
 * Muestra texto con efecto de máquina de escribir.
 * @param {string} text El texto a mostrar.
 */
function showTypewriterText(text) {
  const el = document.createElement("p");
  el.className = "gift-text typewriter";
  GIFT_CONTAINER.appendChild(el);

  let i = 0;
  let speed = 38;

  const type = () => {
    if (i < text.length) {
      el.textContent += text[i];
      if (['.', ',', '!', '?', '\n'].includes(text[i])) {
        speed = 120;
      } else {
        speed = 38;
      }
      i++;
      setTimeout(type, speed);
    } else {
      el.classList.remove("typewriter");
    }
  };
  type();
}

/**
 * Muestra una imagen de regalo.
 * @param {string} src La URL de la imagen.
 * @param {string} alt El texto alternativo de la imagen.
 */
function showGiftImage(src, alt) {
  const img = document.createElement("img");
  img.className = "gift-image";
  img.alt = alt;
  img.src = src;
  img.loading = "lazy";

  img.addEventListener('click', () => {
    // Si ya está ampliada, la encoge. Si no, la amplía.
    if (img.style.transform === "scale(1.28)") {
        img.style.transform = "";
    } else {
        img.style.transform = "scale(1.28)";
    }
  });
  GIFT_CONTAINER.appendChild(img);
}

/**
 * Muestra un video de regalo.
 * @param {string} src La URL del video.
 */
function showGiftVideo(src) {
  const vid = document.createElement("video");
  vid.className = "gift-video";
  vid.src = src;
  vid.controls = true;
  vid.setAttribute("playsinline", "");
  vid.setAttribute("preload", "metadata");

  vid.addEventListener('error', () => {
    vid.innerHTML = '<p style="text-align:center; color: var(--text);">Lo sentimos, no se pudo cargar el video.</p>';
  });

  GIFT_CONTAINER.appendChild(vid);
}

/**
 * Muestra un audio de regalo.
 * @param {string} src La URL del audio.
 */
function showGiftAudio(src) {
  const aud = document.createElement("audio");
  aud.className = "gift-audio";
  aud.src = src;
  aud.controls = true;
  aud.setAttribute("preload", "metadata");

  aud.addEventListener('error', () => {
    aud.innerHTML = '<p style="text-align:center; color: var(--text);">Lo sentimos, no se pudo cargar el audio.</p>';
  });

  GIFT_CONTAINER.appendChild(aud);
}

/**
 * Muestra un botón de descarga para un regalo.
 * @param {string} src La URL del archivo a descargar.
 * @param {string} label El texto del botón de descarga.
 */
function showGiftDownload(src, label) {
  const a = document.createElement("a");
  a.href = src;
  a.download = "";
  a.className = "gift-download";
  a.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3v12m0 0l-4-4m4 4l4-4m-8 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> ${label}`;
  a.setAttribute("role", "button");
  GIFT_CONTAINER.appendChild(a);
}

// --- MANEJO DE EVENTOS DE MODALES Y ACCESIBILIDAD ---

CLOSE_MODAL.addEventListener('click', closeGiftModal);
GIFT_MODAL.addEventListener('click', (e) => {
  // Asegura que solo se cierre al hacer clic en el overlay, no en el contenido del modal
  if (e.target === GIFT_MODAL) {
    closeGiftModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    if (!GIFT_MODAL.classList.contains("hidden")) {
      closeGiftModal();
    }
    if (!SETTINGS_PANEL.classList.contains("hidden")) {
      closeSettings();
    }
  }
  // Permitir cerrar modal con Enter si el foco no está en un elemento interactivo dentro
  if (!GIFT_MODAL.classList.contains("hidden") && e.key === "Enter") {
    const activeElement = document.activeElement;
    if (activeElement && !activeElement.matches('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')) {
      closeGiftModal();
    }
  }
});

// --- PANEL DE CONFIGURACIÓN ---

SETTINGS_GEAR.addEventListener('click', openSettings);

/**
 * Abre el panel de configuración.
 */
function openSettings() {
  SETTINGS_PANEL.classList.remove("hidden");
  const settingsContent = SETTINGS_PANEL.querySelector('.settings-content');
  if (settingsContent) {
    settingsContent.focus();
  }
}

/**
 * Cierra el panel de configuración.
 */
function closeSettings() {
  SETTINGS_PANEL.classList.add("hidden");
  SETTINGS_GEAR.focus();
}

CLOSE_SETTINGS.addEventListener('click', closeSettings);
SETTINGS_PANEL.addEventListener('click', (e) => {
  // Asegura que solo se cierre al hacer clic en el overlay
  if (e.target === SETTINGS_PANEL) {
    closeSettings();
  }
});

// --- SELECTOR DE TEMAS ---

/**
 * Renderiza los selectores de tema.
 */
function renderThemePicker() {
  THEME_PICKER.innerHTML = "";
  THEMES.forEach(themeObj => {
    const swatch = document.createElement("div");
    swatch.className = "theme-swatch" + (themeObj.key === currentThemeKey ? " selected" : "");
    swatch.style.background = `linear-gradient(45deg, ${themeObj.colors[0]}, ${themeObj.colors[1]})`;
    swatch.title = themeObj.label;
    swatch.setAttribute("role", "radio");
    swatch.setAttribute("aria-checked", themeObj.key === currentThemeKey);
    swatch.setAttribute("tabindex", "0"); // Para poder navegar con teclado

    swatch.addEventListener('click', () => {
      setTheme(themeObj.key);
      renderThemePicker();
    });
    swatch.addEventListener('keydown', (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setTheme(themeObj.key);
        renderThemePicker();
      }
    });

    const labelSpan = document.createElement('span');
    labelSpan.className = 'theme-label';
    labelSpan.textContent = themeObj.label;
    swatch.appendChild(labelSpan);

    THEME_PICKER.appendChild(swatch);
  });
}

// --- MODO OSCURO ---
DARK_MODE_TOGGLE.addEventListener('change', (e) => {
  setDarkMode(e.target.checked);
});

// --- BOTÓN DE REINICIAR ---
RESET_BTN.addEventListener('click', () => resetAll(true));

// --- FUNCIÓN DE INICIO GENERAL ---
/**
 * Inicializa la aplicación cargando el estado y renderizando la UI.
 * Se ejecuta cuando el DOM está completamente cargado.
 */
function init() {
  setTheme(currentThemeKey);
  setDarkMode(isDarkMode);
  DARK_MODE_TOGGLE.checked = isDarkMode;

  renderThemePicker();
  updateProgress(); // Asegurar que el progreso se actualice antes de renderizar la lista
  renderUnlockedList();

  hideError();
}

// Llamar a la función de inicialización cuando el DOM esté completamente cargado
// y también cuando data.js se haya cargado (si es asíncrono y dependemos de él).
// Una forma más robusta sería que data.js fuese parte del mismo script
// o que el script esperara a que data.js se cargara.
// Para este caso, asumimos que data.js se carga antes o casi al mismo tiempo debido al 'defer'.
document.addEventListener('DOMContentLoaded', init);
