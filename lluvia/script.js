const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

let columns; // Número de columnas de "código"
const fontSize = 20; // Tamaño de la fuente del código Matrix
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:",.<>/?~`';
const dropPositions = []; // Posición Y de cada "gota" de código

// Función para ajustar el tamaño del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);

    // Reiniciar las posiciones de las gotas si el tamaño cambia
    for (let i = 0; i < columns; i++) {
        dropPositions[i] = Math.floor(Math.random() * canvas.height / fontSize); // Posición inicial aleatoria
    }
}

// Escucha el evento de redimensionamiento de la ventana
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Llama una vez para establecer el tamaño inicial

// Dibuja el efecto Matrix
function drawMatrix() {
    // Fondo semi-transparente para el efecto de rastro
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0'; // Color verde Matrix
    ctx.font = `${fontSize}px Major Mono Display`; // Fuente y tamaño

    for (let i = 0; i < columns; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        const y = dropPositions[i] * fontSize;

        ctx.fillText(text, x, y);

        // Reiniciar la "gota" cuando llega al final de la pantalla
        if (y > canvas.height && Math.random() > 0.975) { // 0.975 es la probabilidad de reiniciar
            dropPositions[i] = 0;
        } else {
            dropPositions[i]++; // Mueve la gota hacia abajo
        }
    }
}

// Inicia la animación del efecto Matrix
setInterval(drawMatrix, 50); // Llama a drawMatrix cada 50 milisegundos
