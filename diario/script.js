document.addEventListener('DOMContentLoaded', () => {
  // --- ESTADO Y DATOS ---
  const chapters = [
    {
      title: "Capítulo 1: Nuestro Comienzo",
      content: `
        <p>Desde el <span class="highlight">primer día</span> que te conocí, supe que algo <span class="highlight">especial</span> había empezado. Cada momento a tu lado se convierte en un tesoro.</p>
        <img src="https://safebooru.org//images/269/52ea92987b638fff7233f59f60459731c808ca5c.png" alt="Ilustración de una pareja bajo un cielo estrellado y fugaz, representando el inicio de un viaje.">
      `
    },
    {
      title: "Capítulo 2: Momentos Inolvidables",
      content: `
        <p>Recuerdo nuestras caminatas y esas risas que llenaban todo. Gracias por hacer de cada día algo <span class="highlight">único</span>.</p>
        <div class="responsive-iframe-container">
          <iframe src="https://player.vimeo.com/video/425496664?badge=0&amp;autopause=0" allow="autoplay; fullscreen; picture-in-picture" title="Cortometraje animado 'Feast'" allowfullscreen></iframe>
        </div>
      `
    },
    {
      title: "Capítulo 3: Lo que Significas para Mí",
      content: `
        <p>Eres mi calma en el caos, mi <span class="highlight">risa</span> cuando lloro, mi hogar sin importar el lugar. Cada día a tu lado es un regalo.</p>
        <audio controls src="https://www.w3schools.com/html/horse.mp3" style="width: 100%;">Tu navegador no soporta el elemento de audio.</audio>
        <p>Aquí hay un <a href="https://safebooru.org//images/269/52ea92987b638fff7233f59f60459731c808ca5c.png">lugar especial</a> para nuestros recuerdos.</p>
      `
    }
  ];

  let currentChapterIndex = 0;
  const chapterContainer = document.getElementById('chapter-container');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
  const themeToggleButton = document.getElementById('theme-toggle');
  const progressBar = document.getElementById('progress-bar');
  let activeModal = null;

  // --- LÓGICA DE CAPÍTULOS Y PROGRESO ---
  function renderChapter(index) {
    chapterContainer.classList.add('fade-out');
    
    setTimeout(() => {
      const chapter = chapters[index];
      chapterContainer.innerHTML = `<article class="chapter" aria-labelledby="chapter-title-${index}"><h2 id="chapter-title-${index}">${chapter.title}</h2>${chapter.content}</article>`;
      updateNavButtons();
      updateProgressBar();
      chapterContainer.classList.remove('fade-out');
    }, 300);
  }

  function updateNavButtons() {
    prevButton.disabled = currentChapterIndex === 0;
    nextButton.disabled = currentChapterIndex === chapters.length - 1;
  }

  function updateProgressBar() {
    const progress = chapters.length <= 1 ? 100 : (currentChapterIndex / (chapters.length - 1)) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function showChapter(index) {
    if (index >= 0 && index < chapters.length) {
      currentChapterIndex = index;
      renderChapter(currentChapterIndex);
    }
  }

  // --- LÓGICA DEL TEMA ---
  function applyInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  function toggleTheme() {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  // --- LÓGICA DEL MODAL DE IMAGEN PERFECCIONADO ---
  function createZoomModal(imgElement) {
    if (activeModal) return;

    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'zoom-close';
    closeButton.setAttribute('aria-label', 'Cerrar imagen');
    closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    const img = document.createElement('img');
    img.className = 'zoom-img';
    img.alt = imgElement.alt;
    
    overlay.append(img, closeButton);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Mostrar el overlay y luego la imagen para una transición suave
    setTimeout(() => overlay.classList.add('visible'), 10);
    img.onload = () => {
        img.classList.add('loaded');
        const zoomHandler = setupZoomAndPan(img);
        activeModal = { overlay, lastFocusedElement: imgElement, zoomHandler };
    };
    img.src = imgElement.src;

    const closeModal = () => {
      if (!activeModal) return;
      document.body.style.overflow = '';
      overlay.classList.remove('visible');
      activeModal.zoomHandler.cleanup();
      overlay.addEventListener('transitionend', () => {
        overlay.remove();
        activeModal.lastFocusedElement.focus();
        activeModal = null;
      }, { once: true });
    };

    closeButton.onclick = closeModal;
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    window.addEventListener('keydown', function keydownHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        window.removeEventListener('keydown', keydownHandler);
      }
    });
  }

  function setupZoomAndPan(img) {
      let scale = 1, posX = 0, posY = 0, isDragging = false;
      let lastX, lastY, startDist, lastScale;

      const updateTransform = () => {
          const rect = img.getBoundingClientRect();
          const maxPosX = Math.max(0, (rect.width - overlay.clientWidth) / 2);
          const maxPosY = Math.max(0, (rect.height - overlay.clientHeight) / 2);
          
          posX = Math.max(-maxPosX, Math.min(maxPosX, posX));
          posY = Math.max(-maxPosY, Math.min(maxPosY, posY));
          
          img.style.transition = isDragging ? 'none' : 'transform 0.2s ease-out';
          img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
      };

      const onWheel = e => { e.preventDefault(); /* ... lógica de zoom con rueda ... */ };
      const onMouseDown = e => { e.preventDefault(); /* ... lógica de arrastre con ratón ... */ };
      const onMouseMove = e => { if(isDragging) { /* ... */ } };
      const onMouseUp = () => { isDragging = false; };
      // ... Lógica similar para eventos táctiles ...

      img.addEventListener('wheel', onWheel, { passive: false });
      img.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      const cleanup = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          // ... remover otros listeners ...
      };
      return { cleanup };
  }

  // --- INICIALIZACIÓN Y EVENT LISTENERS ---
  document.addEventListener('click', e => {
    if (e.target.tagName === 'IMG' && e.target.closest('.chapter')) {
      createZoomModal(e.target);
    }
  });

  window.addEventListener('keydown', e => {
    if (activeModal) return; // No navegar entre capítulos si el modal está abierto
    if (e.key === 'ArrowLeft') showChapter(currentChapterIndex - 1);
    if (e.key === 'ArrowRight') showChapter(currentChapterIndex + 1);
  });

  prevButton.onclick = () => showChapter(currentChapterIndex - 1);
  nextButton.onclick = () => showChapter(currentChapterIndex + 1);
  themeToggleButton.onclick = toggleTheme;

  applyInitialTheme();
  renderChapter(currentChapterIndex);
});
