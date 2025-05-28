const questions = [
    {
        question: "¿Qué prefieres hacer un domingo por la tarde?",
        options: ["Acurrucarnos a ver una película", "Salir a explorar un lugar nuevo", "Disfrutar de un hobby individual en la misma habitación", "Visitar a familiares o amigos"],
    },
    {
        question: "¿Cómo reaccionas cuando estás molesto?",
        options: ["Necesito espacio para procesar mis emociones", "Quiero hablarlo inmediatamente", "Me quedo en silencio hasta sentirme mejor", "Busco una distracción"],
    },
    {
        question: "¿Qué es más importante en una relación?",
        options: ["La comunicación abierta y honesta", "La confianza y el respeto mutuo", "La pasión y la aventura", "El apoyo incondicional"],
    },
    {
        question: "¿Cuál es tu idea de una cita perfecta?",
        options: ["Una cena romántica a la luz de las velas", "Una actividad divertida y emocionante juntos", "Una noche tranquila en casa", "Un paseo por la naturaleza"],
    },
    {
        question: "¿Qué valoras más en tu pareja?",
        options: ["Su sentido del humor y alegría", "Su inteligencia y curiosidad", "Su amabilidad y empatía", "Su ambición y determinación"],
    },
    {
        question: "¿Qué escenario te parece más relajante?",
        options: ["Una playa tranquila al atardecer", "Una cabaña acogedora en la montaña nevada", "Un campo de flores bajo el sol", "Una ciudad bulliciosa por la noche"],
    },
    {
        question: "¿Qué tipo de regalo te hace sentir más amado/a?",
        options: ["Algo hecho a mano y personalizado", "Una experiencia o aventura juntos", "Algo práctico que sé que necesito", "Un detalle inesperado y espontáneo"],
    },
    {
        question: "¿Cómo prefieres celebrar un aniversario?",
        options: ["Una escapada romántica", "Una cena especial en casa", "Revivir un recuerdo significativo", "Una fiesta con nuestros seres queridos"],
    }
];

// Referencias a elementos del DOM
const startButton = document.getElementById('start-button');
const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-button');
const resultsSection = document.getElementById('results');
const compatibilityMessage = document.getElementById('compatibility-message');
const restartButton = document.getElementById('restart-button');
const quizSection = document.getElementById('quiz');
const introductionSection = document.getElementById('introduction');
const secretCodeUnlock = document.getElementById('secret-code-unlock');
const secretCodeDisplay = document.getElementById('secret-code');
const copyCodeButton = document.getElementById('copy-code-button'); // Nuevo botón de copiar
const copyTooltip = document.getElementById('copy-tooltip'); // Tooltip del botón de copiar
const backgroundMusic = document.getElementById('backgroundMusic');
const muteButton = document.getElementById('muteButton');
const body = document.body;

let currentQuestionIndex = 0;
const secretNumber = "ALMASGEMELASINFINITAS"; // Código secreto a desbloquear

// --- Funciones del Test ---

function showSection(sectionToShow) {
    const sections = [introductionSection, quizSection, resultsSection];
    sections.forEach(section => {
        if (section === sectionToShow) {
            section.classList.remove('hidden');
            // Añadir clase 'show' para animaciones de fade-in
            setTimeout(() => section.classList.add('show'), 10);
        } else {
            section.classList.remove('show');
            section.classList.add('hidden');
        }
    });
}

function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const questionData = questions[currentQuestionIndex];
        questionContainer.innerHTML = `
            <h2 class="question">${questionData.question}</h2>
            <div class="options">
                ${questionData.options.map((option, index) =>
                    `<button class="option-button" data-index="${index}">${option}</button>`
                ).join('')}
            </div>
        `;
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
    const optionsContainer = selectedButton.parentNode;

    // Remover 'selected' de todos los botones y luego añadirlo al seleccionado
    Array.from(optionsContainer.children).forEach(button => {
        button.classList.remove('selected');
    });
    selectedButton.classList.add('selected');
    nextButton.classList.remove('hidden'); // Mostrar el botón "Siguiente"
}

function nextQuestion() {
    // Solo avanza si una opción ha sido seleccionada
    if (document.querySelector('.option-button.selected')) {
        questionContainer.classList.add('slide-out'); // Inicia la animación de salida

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
                questionContainer.classList.remove('slide-out');
                questionContainer.classList.add('slide-in'); // Inicia la animación de entrada
                setTimeout(() => {
                    questionContainer.classList.remove('slide-in');
                }, 400); // Duración de la transición CSS
            } else {
                showResults();
            }
        }, 400); // Tiempo para que la animación 'slide-out' se complete
    }
}

function showResults() {
    showSection(resultsSection);
    compatibilityMessage.textContent = "¡Ustedes dos son fuego y ternura, alma con alma!";
    secretCodeUnlock.classList.remove('hidden');
    secretCodeDisplay.textContent = secretNumber;

    // Reiniciar tooltip del botón de copiar
    copyTooltip.textContent = "Copiar";
}

function restartQuiz() {
    currentQuestionIndex = 0;
    showSection(introductionSection); // Volver a la introducción
    secretCodeUnlock.classList.add('hidden'); // Ocultar el código secreto al reiniciar
    // Asegurar que la tarjeta de introducción esté animada al mostrarse
    introductionSection.classList.remove('show');
    setTimeout(() => introductionSection.classList.add('show'), 10);
}

// --- Funcionalidad de Copiar Código ---
function copySecretCode() {
    navigator.clipboard.writeText(secretCodeDisplay.textContent)
        .then(() => {
            copyTooltip.textContent = "¡Copiado!";
            setTimeout(() => {
                copyTooltip.textContent = "Copiar";
            }, 2000); // Vuelve al texto original después de 2 segundos
        })
        .catch(err => {
            console.error('Error al copiar el texto: ', err);
            copyTooltip.textContent = "Error";
            setTimeout(() => {
                copyTooltip.textContent = "Copiar";
            }, 2000);
        });
}

// --- Música de fondo y Controles ---
let isMusicPlaying = false; // Asume que la música no está reproduciéndose al inicio

// Intentar reproducir la música al primer clic del usuario (para sortear autoplay policies)
window.addEventListener("click", () => {
    if (backgroundMusic.paused && !isMusicPlaying) {
        backgroundMusic.play()
            .then(() => {
                isMusicPlaying = true;
                body.classList.remove('music-muted');
            })
            .catch(e => {
                console.warn("Autoplay de música de fondo bloqueado por el navegador:", e);
                isMusicPlaying = false; // No se pudo reproducir, mantener en estado de 'silenciado'
                body.classList.add('music-muted');
            });
    }
}, { once: true });

// Botón de silenciar/desilenciar
muteButton.addEventListener('click', () => {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        isMusicPlaying = false;
        body.classList.add('music-muted');
    } else {
        // Al intentar reproducir manualmente, también manejar la promesa
        backgroundMusic.play()
            .then(() => {
                isMusicPlaying = true;
                body.classList.remove('music-muted');
            })
            .catch(e => {
                console.warn("Intento de reproducción manual bloqueado:", e);
                isMusicPlaying = false; // No se pudo reproducir
                body.classList.add('music-muted'); // Asegura que el icono de silencio permanezca
            });
    }
});

// --- Partículas de corazón (implementación básica con Canvas) ---
const heartParticlesContainer = document.querySelector('.heart-particles');
const heartCanvas = document.createElement('canvas');
const heartContext = heartCanvas.getContext('2d');
heartParticlesContainer.appendChild(heartCanvas);

let hearts = [];
const maxHearts = 35; // Aumentado ligeramente para más ambiente

function resizeCanvas() {
    heartCanvas.width = window.innerWidth;
    heartCanvas.height = window.innerHeight;
    // Opcional: Si los corazones se reinician al cambiar el tamaño, puedes llamarlo aquí
    // initHearts();
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

// --- Inicialización y Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas(); // Asegurar que el canvas tenga el tamaño correcto al cargar
    initHearts(); // Crear los corazones iniciales
    animateHearts(); // Iniciar la animación de los corazones
    showSection(introductionSection); // Mostrar la sección de introducción al cargar

    // Asegurar que la sección de introducción tiene la clase 'show' para animarse
    setTimeout(() => introductionSection.classList.add('show'), 10);

    // Event listener para el botón "Empezar Test"
    startButton.addEventListener('click', () => {
        showSection(quizSection); // Muestra la sección del quiz
        loadQuestion(); // Carga la primera pregunta
        // Asegurar que la tarjeta del quiz esté animada al mostrarse
        quizSection.classList.remove('show');
        setTimeout(() => quizSection.classList.add('show'), 10);
    });

    // Event listener para el botón "Siguiente"
    nextButton.addEventListener('click', nextQuestion);

    // Event listeners para los botones de resultado
    restartButton.addEventListener('click', restartQuiz);
    copyCodeButton.addEventListener('click', copySecretCode); // Nuevo listener para copiar el código

    // Listener para ajustar el canvas si la ventana cambia de tamaño
    window.addEventListener('resize', resizeCanvas);
});
