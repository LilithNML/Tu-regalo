document.addEventListener('DOMContentLoaded', () => {
    const chestContainer = document.getElementById('chestContainer');
    const chestLid = document.getElementById('chestLid');
    const letterContainer = document.getElementById('letterContainer');
    const closeLetterButton = document.getElementById('closeLetterButton');
    const openChestSound = document.getElementById('openChestSound');
    const readLetterSound = document.getElementById('readLetterSound');
    const body = document.body;
    const mainContainer = document.querySelector('.container'); // Contenedor principal
    const clickText = chestContainer.querySelector('.click-text');
    const overlay = document.getElementById('overlay'); // El nuevo overlay

    let isChestOpen = false;

    chestContainer.addEventListener('click', () => {
        if (!isChestOpen) {
            // Reproducir sonido de abrir cofre
            openChestSound.currentTime = 0;
            openChestSound.play();

            // Añadir clase para animar la tapa del cofre
            chestContainer.classList.add('open');

            // Ocultar texto de "toca el cofre"
            clickText.style.display = 'none';

            // Añadir clase de desenfoque al contenedor principal
            mainContainer.classList.add('blurred');
            // Mostrar el overlay
            overlay.classList.add('show');
            // Bloquear el scroll del body
            body.classList.add('letter-open');


            // Mostrar la carta con una pequeña demora
            setTimeout(() => {
                letterContainer.classList.add('show');
                readLetterSound.currentTime = 0;
                readLetterSound.play();
            }, 600); // Coincide con la duración de la animación del cofre

            isChestOpen = true;
        }
    });

    closeLetterButton.addEventListener('click', () => {
        // Detener el sonido de lectura si está sonando
        readLetterSound.pause();
        readLetterSound.currentTime = 0;

        // Animación de cierre de la carta
        letterContainer.style.animation = 'fadeOutZoom 0.5s forwards';

        setTimeout(() => {
            letterContainer.classList.remove('show');
            letterContainer.style.animation = ''; // Limpiar la animación para la próxima vez

            // Remover clase de desenfoque del contenedor principal
            mainContainer.classList.remove('blurred');
            // Ocultar el overlay
            overlay.classList.remove('show');
            // Desbloquear el scroll del body
            body.classList.remove('letter-open');

            // Resetear el estado del cofre
            chestContainer.classList.remove('open');
            clickText.style.display = 'block';
            isChestOpen = false;
        }, 500); // Coincide con la duración de fadeOutZoom
    });
});
