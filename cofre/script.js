document.addEventListener('DOMContentLoaded', () => {
    const chestContainer = document.getElementById('chestContainer');
    const chestLid = document.getElementById('chestLid'); // El grupo SVG de la tapa
    const letterContainer = document.getElementById('letterContainer');
    const closeLetterButton = document.getElementById('closeLetterButton');
    const openChestSound = document.getElementById('openChestSound');
    const readLetterSound = document.getElementById('readLetterSound');
    const body = document.body;
    const mainContainer = document.querySelector('.container');
    const clickText = chestContainer.querySelector('.click-text');

    let isChestOpen = false;

    chestContainer.addEventListener('click', () => {
        if (!isChestOpen) {
            // Reproducir sonido de abrir cofre
            openChestSound.currentTime = 0; // Reiniciar el sonido por si se toca rápido
            openChestSound.play();

            // Añadir clase para animar la tapa del cofre
            chestContainer.classList.add('open');

            // Ocultar texto de "toca el cofre"
            clickText.style.display = 'none';

            // Mostrar la carta con una pequeña demora para el efecto del sonido y la animación del cofre
            setTimeout(() => {
                letterContainer.classList.add('show');
                body.classList.add('letter-open'); // Añadir clase al body para evitar scroll
                mainContainer.classList.add('blurred'); // Desenfoque del fondo
                readLetterSound.currentTime = 0; // Reiniciar sonido de lectura
                readLetterSound.play(); // Reproducir sonido de leer carta
            }, 600); // Un poco más de tiempo para que la animación del cofre se aprecie
            // (El tiempo debe ser igual o ligeramente mayor que la transición de .chest-lid)

            isChestOpen = true;
        }
    });

    closeLetterButton.addEventListener('click', () => {
        // Animación de cierre de la carta (opcional, con keyframes en CSS)
        letterContainer.style.animation = 'fadeOutZoom 0.5s forwards';

        setTimeout(() => {
            letterContainer.classList.remove('show');
            letterContainer.style.animation = ''; // Limpiar la animación para la próxima vez

            // Resetear el estado del cofre
            chestContainer.classList.remove('open'); // Cerrar la tapa del cofre
            clickText.style.display = 'block'; // Volver a mostrar el texto de clic
            isChestOpen = false;

            body.classList.remove('letter-open'); // Remover clase para permitir scroll
            mainContainer.classList.remove('blurred'); // Remover desenfoque del fondo
        }, 500); // Coincide con la duración de fadeOutZoom
    });
});
