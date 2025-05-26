const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

let columns; // Número de columnas de "código"
const fontSize = 20; // Tamaño de la fuente del código Matrix
const fallingText = 'TE AMO '; // Texto que caerá, con un espacio al final para separación
const dropPositions = []; // Posición Y de cada "gota" de código
const speed = 2; // Increased speed factor

// Función para ajustar el tamaño del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);

    // Reiniciar las posiciones de las gotas si el tamaño cambia
    for (let i = 0; i < columns; i++) {
        dropPositions [i] = Math.floor(Math.random() * canvas.height / fontSize); // Posición inicial aleatoria
    }
}

// Escucha el evento de redimensionamiento de la ventana
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Llama una vez para establecer el tamaño inicial

// Dibuja el efecto Matrix
function drawMatrix() {
    // Fondo semi-transparente para el efecto de rastro
    ctx.fillStyle = 'rgba(255, 105, 180, 0.1)'; // Fondo rosa semi-transparente
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00FF00'; // Color verde Matrix
    ctx.font = `${fontSize}px Major Mono Display`; // Fuente y tamaño

    for (let i = 0; i < columns; i++) {
        const textIndex = Math.floor(Math.random() * fallingText.length);
        const text = fallingText.charAt(textIndex);
        const x = i * fontSize;
        const y = dropPositions [i] * fontSize;

        ctx.fillText(text, x, y);

        // Reiniciar la "gota" cuando llega al final de la pantalla
        if (y > canvas.height && Math.random() > 0.95) { // Ajusté la probabilidad para más continuidad
            dropPositions [i] = 0;
        } else {
            dropPositions [i] += speed; // Mueve la gota hacia abajo más rápido
        }
    }
}

// Inicia la animación del efecto Matrix
setInterval(drawMatrix, 30); // Reduje el intervalo para mayor velocidad
