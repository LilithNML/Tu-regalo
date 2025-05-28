const questions = [
    {
        question: "¿Qué prefieres hacer un domingo por la tarde?",
        options: ["Acurrucarnos a ver una película", "Salir a explorar un lugar nuevo", "Disfrutar de un hobby individual en la misma habitación", "Visitar a familiares o amigos"],
        values: [1, 1, 1, 1] // Todos suman para el "100%"
    },
    {
        question: "¿Cómo reaccionas cuando estás molesto?",
        options: ["Necesito espacio para procesar mis emociones", "Quiero hablarlo inmediatamente", "Me quedo en silencio hasta sentirme mejor", "Busco una distracción"],
        values: [1, 1, 1, 1]
    },
    {
        question: "¿Qué es más importante en una relación?",
        options: ["La comunicación abierta y honesta", "La confianza y el respeto mutuo", "La pasión y la aventura", "El apoyo incondicional"],
        values: [1, 1, 1, 1]
    },
    {
        question: "¿Cuál es tu idea de una cita perfecta?",
        options: ["Una cena romántica a la luz de las velas", "Una actividad divertida y emocionante juntos", "Una noche tranquila en casa", "Un paseo por la naturaleza"],
        values: [1, 1, 1, 1]
    },
    {
        question: "¿Qué valoras más en tu pareja?",
        options: ["Su sentido del humor y alegría", "Su inteligencia y curiosidad", "Su amabilidad y empatía", "Su ambición y determinación"],
        values: [1, 1, 1, 1]
    },
    {
        question: "¿Qué escenario te parece más relajante?",
        options: ["Una playa tranquila al atardecer", "Una cabaña acogedora en la montaña nevada", "Un campo de flores bajo el sol", "Una ciudad bulliciosa por la noche"],
        values: [1, 1, 1, 1]
    },
    {
        question: "¿Qué tipo de regalo te hace sentir más amado/a?",
        options: ["Algo hecho a mano y personalizado", "Una experiencia o aventura juntos", "Algo práctico que sé que necesito", "Un detalle inesperado y espontáneo"],
        values: [1, 1, 1, 1]
    },
    {
        question: "¿Cómo prefieres celebrar un aniversario?",
        options: ["Una escapada romántica", "Una cena especial en casa", "Revivir un recuerdo significativo", "Una fiesta con nuestros seres queridos"],
        values: [1, 1, 1, 1]
    }
];

const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-button');
const resultsSection = document.getElementById('results');
const compatibilityMessage = document.getElementById('compatibility-message');
const restartButton = document.getElementById('restart-button');
const shareButton = document.getElementById('share-button');
const quizSection = document.getElementById('quiz');
const introductionSection = document.getElementById('introduction');
const secretCodeUnlock = document.getElementById('secret-code-unlock');
const secretCodeDisplay = document.getElementById('secret-code');
const backgroundMusic = document.getElementById('backgroundMusic');
const muteButton = document.getElementById('muteButton');
const body = document.body;

let currentQuestionIndex = 0;
let compatibilityScore = 0; // Aunque no se usa para el resultado, se mantiene si quieres expandir
const secretNumber = "AMOREMIOETERNO"; // Código secreto desbloqueado al finalizar

function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const questionData = questions[currentQuestionIndex];
        questionContainer.innerHTML = `<h2 class="question">${questionData.question}</h2><div class="options">${questionData.options.map((option, index) => `<button class="option-button" data-index="${index}">${option}</button>`).join('')}</div>`;
        const optionButtons = document.querySelectorAll('.option-button');
        optionButtons.forEach(button => {
            button.addEventListener('click', selectAnswer);
        });
        nextButton.classList.add('hidden'); // Ocultar el botón "Siguiente" hasta que se seleccione una respuesta
    } else {
        showResults();
    }
}

function selectAnswer(event) {
    const selectedButton = event.target;
    // const index = parseInt(selectedButton.dataset.index); // No usado, pero útil si se suman puntos reales
    // compatibilityScore += questions[currentQuestionIndex].values[index]; // Lógica para sumar puntos si fuera necesario

    const optionsContainer = selectedButton.parentNode;
    // Remover 'selected' de todos los botones y luego añadirlo al seleccionado
    Array.from(optionsContainer.children).forEach(button => {
        button.classList.remove('selected');
    });
    selectedButton.classList.add('selected');
    nextButton.classList.remove('hidden'); // Mostrar el botón "Siguiente"
}

function nextQuestion() {
    // Si hay una pregunta seleccionada, avanza
    if (document.querySelector('.option-button.selected')) {
        // Transición suave entre preguntas
        questionContainer.classList.add('slide-out'); // Inicia la animación de salida

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
                questionContainer.classList.remove('slide-out');
                questionContainer.classList.add('slide-in'); // Inicia la animación de entrada
                // Asegurar que la clase 'slide-in' se remueve después de la animación
                setTimeout(() => {
                    questionContainer.classList.remove('slide-in');
                }, 500); // Duración de la transición CSS
            } else {
                showResults();
            }
        }, 300); // Tiempo para que la animación 'slide-out' se complete antes de cargar nueva pregunta
    }
}

function showResults() {
    quizSection.classList.add('hidden');
    introductionSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    resultsSection.classList.add('show');

    // El resultado siempre será "alma gemela" según tu solicitud
    compatibilityMessage.textContent = "¡Ustedes dos son fuego y ternura, alma con alma!";
    // Puedes cambiar esta frase por otras opciones de "100% compatibles" si quieres, ej:
    // compatibilityMessage.textContent = "¡Conexión cósmica! Son almas gemelas ✨";
    // compatibilityMessage.textContent = "¡Perfectamente conectados! Un amor que trasciende ❤️";

    // Desbloquear el código secreto
    secretCodeUnlock.classList.remove('hidden');
    secretCodeDisplay.textContent = secretNumber;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    compatibilityScore = 0;
    resultsSection.classList.remove('show');
    resultsSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    introductionSection.classList.remove('hidden');
    secretCodeUnlock.classList.add('hidden'); // Ocultar el código secreto al reiniciar
    loadQuestion();
}

function shareResult() {
    const message = encodeURIComponent(`¡Acabo de hacer el test de compatibilidad contigo y descubrimos que somos almas gemelas! ✨\n\n¿Quieres hacer el test y ver qué tan conectados estamos? [Aquí pondrás el enlace a tu página cuando la tengas desplegada]`);
    const shareUrl = `https://web.whatsapp.com/send?text=${message}`; // Ejemplo para WhatsApp Web
    // También puedes usar: `window.open(`mailto:?subject=Test de Compatibilidad&body=${message}`, '_blank');` para email
    // O una opción más general para móvil: `window.open(`whatsapp://send?text=${message}`, '_blank');`
    window.open(shareUrl, '_blank');
}

// --- Inicialización ---

// Event listener para el botón "Siguiente"
nextButton.addEventListener('click', nextQuestion);

// Event listeners para los botones de resultado
restartButton.addEventListener('click', restartQuiz);
shareButton.addEventListener('click', shareResult);

// --- Música de fondo ---
let isMusicPlaying = true; // Asume que la música intentará reproducirse al inicio

// Intentar reproducir la música al primer clic del usuario (para sortear autoplay policies)
window.addEventListener("click", () => {
    if (backgroundMusic.paused && isMusicPlaying) { // Solo si está pausada y debería estar sonando
        backgroundMusic.play().catch(e => {
            console.warn("Autoplay de música de fondo bloqueado por el navegador:", e);
            // Si es bloqueado, asume que está "silenciada" para el usuario y actualiza el estado
            isMusicPlaying = false;
            body.classList.add('mute-music');
        });
    }
}, { once: true }); // Solo necesitas este listener una vez

// Botón de silenciar/desilenciar
muteButton.addEventListener('click', () => {
    if (backgroundMusic.paused && !isMusicPlaying) { // Si está pausada y el estado es "silenciada"
        backgroundMusic.play().catch(e => {
            console.warn("Intento de reproducción manual bloqueado:", e);
            // Si incluso la interacción no la inicia, mantén el estado de silencio
            isMusicPlaying = false;
            body.classList.add('mute-music');
        });
        isMusicPlaying = true;
        body.classList.remove('mute-music');
    } else if (backgroundMusic.play && isMusicPlaying) { // Si está reproduciéndose y el estado es "sonando"
        backgroundMusic.pause();
        isMusicPlaying = false;
        body.classList.add('mute-music');
    }
});


// --- Partículas de corazón (implementación básica con Canvas) ---
const heartParticlesContainer = document.querySelector('.heart-particles');
const heartCanvas = document.createElement('canvas');
const heartContext = heartCanvas.getContext('2d');
heartParticlesContainer.appendChild(heartCanvas);

let hearts = [];
const maxHearts = 30; // Número máximo de corazones flotando

function resizeCanvas() {
    heartCanvas.width = window.innerWidth;
    heartCanvas.height = window.innerHeight;
}

class Heart {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * heartCanvas.width;
        this.y = heartCanvas.height + Math.random() * heartCanvas.height / 2; // Empieza desde abajo o fuera de pantalla
        this.size = Math.random() * 8 + 5; // Tamaño entre 5 y 13
        this.speedY = Math.random() * 0.5 + 0.2; // Velocidad de flotación
        this.opacity = Math.random() * 0.6 + 0.2; // Opacidad
        this.rotation = Math.random() * Math.PI * 2; // Rotación inicial
        this.rotationSpeed = (Math.random() - 0.5) * 0.02; // Velocidad de rotación
        this.hue = Math.floor(Math.random() * 30 + 330); // Tonos rosados/rojizos
    }

    draw() {
        heartContext.save();
        heartContext.translate(this.x, this.y);
        heartContext.rotate(this.rotation);
        heartContext.fillStyle = `hsla(${this.hue}, 100%, 80%, ${this.opacity})`;
        heartContext.shadowBlur = 5;
        heartContext.shadowColor = `hsla(${this.hue}, 100%, 80%, ${this.opacity * 0.8})`;

        heartContext.beginPath();
        heartContext.moveTo(0, this.size / 2);
        heartContext.bezierCurveTo(this.size / 2, 0, this.size, this.size / 2, 0, this.size);
        heartContext.bezierCurveTo(-this.size, this.size / 2, -this.size / 2, 0, 0, this.size / 2);
        heartContext.closePath();
        heartContext.fill();
        heartContext.restore();
    }

    update() {
        this.y -= this.speedY;
        this.rotation += this.rotationSpeed;
        if (this.y < -this.size * 2) { // Si el corazón sale por arriba, reiniciarlo
            this.reset();
        }
    }
}

function initHearts() {
    hearts = [];
    for (let i = 0; i < maxHearts; i++) {
        hearts.push(new Heart());
    }
}

function animateHearts() {
    heartContext.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
    hearts.forEach(heart => {
        heart.update();
        heart.draw();
    });
    requestAnimationFrame(animateHearts);
}

// Inicialización de la página
document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas(); // Asegurar que el canvas tenga el tamaño correcto al cargar
    initHearts(); // Crear los corazones iniciales
    animateHearts(); // Iniciar la animación de los corazones
    loadQuestion(); // Cargar la primera pregunta
});

// Listener para ajustar el canvas si la ventana cambia de tamaño
window.addEventListener('resize', resizeCanvas);
