:root {
  /* Variables de color para tema oscuro (default) y claro */
  --bg-color: #0c0a1d;
  --text-color: #e0e1e6;
  --bg-overlay-color: rgba(15, 12, 38, 0.7);
  --header-footer-bg: rgba(15, 12, 38, 0.8);
  --highlight-glow: #80dfff;
  --highlight-text: #aeefff;
  --button-bg: #1e90ff;
  --button-text: #ffffff;
  --media-shadow: rgba(43, 190, 255, 0.2);
  --progress-bar-color: var(--highlight-glow);

  --transition-speed: 300ms;
}

[data-theme="light"] {
  --bg-color: #f0f4f8;
  --text-color: #2c3e50;
  --bg-overlay-color: rgba(255, 255, 255, 0.7);
  --header-footer-bg: rgba(255, 255, 255, 0.85);
  --highlight-glow: #0077cc;
  --highlight-text: #005fa3;
  --button-bg: #0077cc;
  --media-shadow: rgba(44, 62, 80, 0.15);
  --progress-bar-color: var(--button-bg);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Open Sans', sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
}

/* === FONDO ANIMADO CON CSS === */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: transparent;
  overflow: hidden;
  z-index: -1;
}
.animated-bg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  background-image: 
    radial-gradient(circle at 10% 10%, var(--highlight-glow), transparent 20%),
    radial-gradient(circle at 80% 20%, var(--highlight-text), transparent 25%),
    radial-gradient(circle at 30% 90%, var(--button-bg), transparent 20%),
    radial-gradient(circle at 50% 50%, var(--highlight-glow), transparent 15%);
  background-size: 40% 40%;
  opacity: 0.15;
  filter: blur(40px);
  animation: move-glow 45s linear infinite;
}
[data-theme="light"] .animated-bg::after {
  opacity: 0.3;
}
@keyframes move-glow {
  0% { transform: translate(0, 0); }
  50% { transform: translate(-50%, -50%); }
  100% { transform: translate(0, 0); }
}

header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--header-footer-bg);
  padding: 1rem 2rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color var(--transition-speed) ease;
}
[data-theme="light"] header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

header h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 700;
  text-align: center;
  flex-grow: 1;
}

.progress-bar-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
}
#progress-bar {
  width: 0;
  height: 100%;
  background-color: var(--progress-bar-color);
  border-radius: 0 2px 2px 0;
  transition: width 400ms ease-in-out, background-color var(--transition-speed) ease;
}

main {
  flex: 1;
  max-width: 800px;
  width: 90%;
  margin: 2rem auto;
  padding: 1rem 0;
  transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
}
main.fade-out {
  opacity: 0;
  transform: translateY(20px);
}

.chapter {
  background: var(--bg-overlay-color);
  padding: clamp(1.5rem, 5vw, 3rem);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color var(--transition-speed) ease, border-color var(--transition-speed) ease;
}
[data-theme="light"] .chapter {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* ... (otros estilos de capítulo, navegación, highlight sin cambios significativos) ... */
.chapter h2 { font-family: 'Playfair Display', serif; font-size: clamp(1.5rem, 4vw, 2rem); color: var(--highlight-glow); margin-bottom: 1rem; transition: color var(--transition-speed) ease; }
.chapter p, .chapter a, .chapter li { font-size: 1.15rem; line-height: 1.8; color: var(--text-color); transition: color var(--transition-speed) ease; }
.chapter a { color: var(--highlight-glow); text-decoration: none; font-weight: bold; }
.chapter a:hover { text-decoration: underline; }
.chapter img { cursor: zoom-in; }
.chapter img, .chapter video, .chapter audio { display: block; max-width: 100%; margin: 2rem auto; border-radius: 15px; box-shadow: 0 6px 25px var(--media-shadow); transition: box-shadow var(--transition-speed) ease; }
.responsive-iframe-container { position: relative; overflow: hidden; padding-top: 56.25%; margin: 2rem auto; border-radius: 15px; box-shadow: 0 6px 25px var(--media-shadow); }
.responsive-iframe-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
nav.navigation { display: flex; justify-content: space-between; padding: 1rem 2rem; background: var(--header-footer-bg); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-top: 1px solid rgba(255, 255, 255, 0.1); transition: background-color var(--transition-speed) ease; }
[data-theme="light"] nav.navigation { border-top: 1px solid rgba(0, 0, 0, 0.1); }
nav.navigation button { background-color: var(--button-bg); color: var(--button-text); border: none; border-radius: 50px; padding: 0.8rem 1.6rem; font-size: 1rem; font-weight: bold; cursor: pointer; transition: background-color var(--transition-speed) ease, transform 150ms ease; }
nav.navigation button:hover:not(:disabled), nav.navigation button:focus-visible:not(:disabled) { transform: scale(1.05); filter: brightness(1.1); }
nav.navigation button:disabled { background-color: #555; color: #999; cursor: not-allowed; transform: none; filter: brightness(0.7); }

/* === MODAL DE IMAGEN PERFECCIONADO === */
.zoom-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  transition: opacity 250ms ease, backdrop-filter 250ms ease;
}
.zoom-overlay.visible {
  opacity: 1;
}
.zoom-img {
  max-width: 95vw;
  max-height: 95vh;
  object-fit: contain;
  touch-action: none;
  transform-origin: center center;
  will-change: transform;
  transition: transform 250ms ease;
  opacity: 0;
  transform: scale(0.9);
}
.zoom-img.loaded {
  opacity: 1;
  transform: scale(1);
}
.zoom-close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 200ms ease, transform 200ms ease;
}
.zoom-close:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}
.zoom-close svg {
  width: 32px;
  height: 32px;
  stroke: white;
  stroke-width: 2.5;
  filter: drop-shadow(0 0 5px black);
}

/* ... (Estilos del botón de tema sin cambios) ... */
.theme-toggle { background: none; border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 50%; cursor: pointer; padding: 8px; display: flex; align-items: center; justify-content: center; transition: all var(--transition-speed) ease; }
.theme-toggle:hover { border-color: var(--text-color); transform: scale(1.1) rotate(15deg); }
[data-theme="light"] .theme-toggle { border-color: rgba(0, 0, 0, 0.5); }
.theme-toggle .icon { stroke: var(--text-color); transition: stroke var(--transition-speed) ease; }
.theme-toggle .icon-sun { display: none; }
.theme-toggle .icon-moon { display: block; }
[data-theme="light"] .theme-toggle .icon-sun { display: block; }
[data-theme="light"] .theme-toggle .icon-moon { display: none; }
