document.addEventListener('DOMContentLoaded', () => {
    const book = document.querySelector('.book');
    const pages = document.querySelectorAll('.page');
    const startButton = document.getElementById('startButton');
    const pageFlipSound = document.getElementById('pageFlipSound');

    let currentPageIndex = 0;
    const totalPages = pages.length;

    // Función para actualizar la página activa en modo móvil
    function updateMobilePageVisibility() {
        if (window.innerWidth <= 768) { // Si es móvil
            pages.forEach((page, index) => {
                if (index === currentPageIndex) {
                    page.classList.add('active-page');
                } else {
                    page.classList.remove('active-page');
                }
            });
        } else { // Si no es móvil, asegúrate de que no haya clases de móvil
            pages.forEach(page => {
                page.classList.remove('active-page');
            });
        }
    }

    // Inicializar la visibilidad de las páginas al cargar
    updateMobilePageVisibility();

    // Reaccionar a cambios de tamaño de ventana (para responsive)
    window.addEventListener('resize', updateMobilePageVisibility);

    // Oculta todas las páginas excepto la portada al inicio (para desktop)
    if (window.innerWidth > 768) {
        pages.forEach((page, index) => {
            if (index > 0) {
                page.style.display = 'none'; // Oculta los capítulos y contraportada inicialmente
            }
        });
    }

    // Función para pasar la página
    function flipPage(direction) {
        let prevPageIndex = currentPageIndex;

        if (direction === 'next' && currentPageIndex < totalPages - 1) {
            if (window.innerWidth <= 768) { // Modo móvil
                currentPageIndex++;
                updateMobilePageVisibility();
                pageFlipSound.play();
            } else { // Modo desktop
                const currentPage = pages[currentPageIndex];
                if (currentPageIndex === 0) { // Si es la portada, muestra el resto del libro
                    book.style.width = '100%'; // Abrir el libro
                    book.style.aspectRatio = '3/2'; // Cambiar a proporción de libro abierto
                    // Muestra las páginas una vez que el libro se "abre"
                    pages.forEach((page, index) => {
                        if (index > 0) {
                            page.style.display = 'flex'; // Vuelve a mostrar las páginas
                        }
                    });
                    setTimeout(() => { // Pequeño retraso para que el libro se abra primero
                        currentPage.classList.add('flipped');
                        currentPage.style.zIndex = totalPages - (currentPageIndex + 1); // Baja el z-index de la portada
                        pageFlipSound.play();
                        currentPageIndex++;
                    }, 500); // Ajusta este tiempo si la transición del libro es más larga
                } else {
                    currentPage.classList.add('flipped');
                    // Ajusta el z-index para que la página volteada vaya al fondo
                    currentPage.style.zIndex = totalPages - (currentPageIndex + 1);
                    pageFlipSound.play();
                    currentPageIndex++;
                }
            }
        } else if (direction === 'prev' && currentPageIndex > 0) {
            if (window.innerWidth <= 768) { // Modo móvil
                currentPageIndex--;
                updateMobilePageVisibility();
                pageFlipSound.play();
            } else { // Modo desktop
                const previousPage = pages[currentPageIndex - 1];
                previousPage.classList.remove('flipped');
                // Restaura el z-index al original de la página
                previousPage.style.zIndex = (totalPages - (currentPageIndex - 1));
                pageFlipSound.play();
                currentPageIndex--;

                // Si volvemos a la portada desde el capítulo 1
                if (currentPageIndex === 0) {
                    setTimeout(() => { // Pequeño retraso para que la página se cierre primero
                        book.style.width = '50%'; // Cerrar el libro
                        book.style.aspectRatio = '1/1.5'; // Cambiar a proporción de libro cerrado
                        pages.forEach((page, index) => {
                            if (index > 0) {
                                page.style.display = 'none'; // Oculta los capítulos al cerrar
                            }
                        });
                    }, 800); // Ajusta este tiempo para la transición del libro
                }
            }
        }
        console.log(`Página actual: ${currentPageIndex}`);
    }

    // Event listener para el botón "Empezar"
    startButton.addEventListener('click', () => {
        if (window.innerWidth > 768) { // Solo en desktop
            startButton.style.display = 'none'; // Oculta el botón
            flipPage('next'); // Inicia el libro
        } else { // En móvil, simplemente pasa a la primera página de la historia
            currentPageIndex = 1; // Pasa de la portada (0) a la primera página de la historia (1)
            updateMobilePageVisibility();
            pageFlipSound.play();
            startButton.style.display = 'none'; // Oculta el botón
        }
    });

    // Event listeners para pasar página (clic o táctil)
    book.addEventListener('click', (e) => {
        // Evitar que el clic en el botón active el pase de página
        if (e.target.id === 'startButton') return;

        // Comprobación para evitar pasar de página en la contraportada (última página)
        if (currentPageIndex === totalPages -1 && window.innerWidth > 768) {
            // En desktop, si estamos en la contraportada, no hacemos nada más
            return;
        } else if (currentPageIndex === totalPages - 1 && window.innerWidth <= 768) {
            // En móvil, si estamos en la última página, tampoco hacemos nada
            return;
        }

        // Determina si es un clic en la mitad derecha (para desktop)
        const rect = book.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const bookWidth = rect.width;

        if (window.innerWidth > 768) { // Modo desktop
            if (clickX > bookWidth / 2) { // Clic en la mitad derecha (avanzar)
                flipPage('next');
            } else { // Clic en la mitad izquierda (retroceder)
                flipPage('prev');
            }
        } else { // Modo móvil (cualquier clic pasa página)
            flipPage('next'); // En móvil, un tap avanza la página
        }
    });

    // Soporte táctil (Swipe)
    let touchStartX = 0;
    let touchEndX = 0;

    book.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    book.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });

    book.addEventListener('touchend', () => {
        if (touchStartX - touchEndX > 50) { // Swipe left (avanzar)
            flipPage('next');
        } else if (touchEndX - touchStartX > 50) { // Swipe right (retroceder)
            flipPage('prev');
        }
        touchStartX = 0;
        touchEndX = 0;
    });
});
