// --- Definición de Preguntas (Objetos sin valores secretos, ya que el resultado es fijo) ---
const questions = [
    {
        question: "¿Cuál es tu escenario ideal para una escapada romántica?",
        options: [
            "Una cabaña acogedora en la montaña con chimenea y chocolate caliente.",
            "Una playa de arena blanca al atardecer, con el sonido de las olas.",
            "Explorar una ciudad histórica, llena de arte y cultura.",
            "Un campamento bajo las estrellas, lejos de la civilización."
        ]
    },
    {
        question: "¿Qué gesto de cariño valoras más en el día a día?",
        options: [
            "Un mensaje inesperado de 'te quiero' durante el día.",
            "Un abrazo fuerte y silencioso cuando lo necesito.",
            "Que recuerde y celebre pequeños detalles importantes para mí.",
            "Compartir un momento de risas sin razón alguna."
        ]
    },
    {
        question: "¿Cómo prefieres celebrar un logro importante de tu pareja?",
        options: [
            "Una cena elegante y especial, solo para los dos.",
            "Organizar una pequeña reunión sorpresa con sus seres queridos.",
            "Comprar un regalo significativo que sé que desea.",
            "Estar ahí para escuchar y celebrar sus éxitos con entusiasmo."
        ]
    },
    {
        question: "¿Qué actividad te parece más divertida para hacer juntos un fin de semana?",
        options: [
            "Cocinar una nueva receta elaborada en casa.",
            "Aventurarnos en una excursión o deporte al aire libre.",
            "Visitar un museo o galería y hablar sobre arte.",
            "Simplemente relajarnos en casa viendo series o jugando."
        ]
    },
    {
        question: "¿Cómo manejas los desacuerdos o conflictos en la relación?",
        options: [
            "Prefiero hablarlo de inmediato y resolverlo lo antes posible.",
            "Necesito un tiempo para calmarme y luego lo hablamos con calma.",
            "Busco llegar a un compromiso que funcione para ambos.",
            "Me enfoco en el problema, no en la persona, para buscar soluciones."
        ]
    },
    {
        question: "¿Qué cualidad te atrae más en tu pareja a largo plazo?",
        options: [
            "Su capacidad de hacerme reír y ver el lado positivo.",
            "Su inteligencia y la profundidad de sus pensamientos.",
            "Su lealtad incondicional y su apoyo constante.",
            "Su pasión por la vida y su deseo de crecer."
        ]
    },
    {
        question: "¿Qué tipo de sorpresa te haría sentir más especial?",
        options: [
            "Un viaje sorpresa a un lugar que siempre he querido visitar.",
            "Una carta escrita a mano expresando sus sentimientos.",
            "Que me dedique tiempo de calidad y me escuche atentamente.",
            "Un gesto público de afecto que me haga sentir amado/a."
        ]
    },
    {
        question: "¿Qué prefieres para una noche tranquila en casa?",
        options: [
            "Ver una película o serie acurrucados en el sofá.",
            "Leer un libro cada uno en silencio, disfrutando la compañía.",
            "Jugar juegos de mesa o videojuegos juntos.",
            "Tener una conversación profunda y significativa."
        ]
    },
    {
        question: "¿Qué es lo más importante para ti en la intimidad emocional?",
        options: [
            "Sentir que puedo ser completamente vulnerable y comprendido/a.",
            "Compartir sueños y metas para el futuro.",
            "Saber que somos un equipo y nos apoyamos mutuamente.",
            "Experimentar una conexión profunda y apasionada."
        ]
    },
    {
        question: "¿Qué tipo de música preferirías escuchar juntos en un viaje largo?",
        options: [
            "Pop romántico y baladas que nos hagan cantar.",
            "Rock clásico o indie que nos llene de energía.",
            "Música instrumental suave que cree un ambiente relajado.",
            "Nuestros podcasts favoritos o audiolibros interesantes."
        ]
    }
];


// --- Referencias a elementos del DOM ---
const introductionSection = document.getElementById('introduction-section');
const quizSection = document.getElementById('quiz-section');
const resultsSection = document.getElementById('results-section');
const startButton = document.getElementById('startButton');
const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('nextButton');
const compatibilityMessage = document.getElementById('compatibility-message');
const restartButton = document.getElementById('restartButton');
const secretCodeUnlock = document.getElementById('secret-code-unlock');
const secretCodeDisplay = document.getElementById('secretCodeDisplay');
const copyCodeButton = document.getElementById('copyCodeButton');
const copyTooltip = document.getElementById('copyTooltip');
const backgroundMusic = document.getElementById('backgroundMusic');
const muteButton = document.getElementById('muteButton');
const body = document.body;

// --- Variables de Estado ---
let currentQuestionIndex = 0;
const SECRET_CODE = "NUESTROSAMORINFINITO"; // El código secreto que se desbloquea

// --- Funciones Principales de Navegación entre Secciones ---

/**
 * Muestra una sección específica y oculta las demás, con animaciones.
 * @param {HTMLElement} sectionToShow La sección que se debe mostrar.
 */
function showSection(sectionToShow) {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        if (card === sectionToShow) {
            card.classList.remove('hidden', 'leaving');
            card.classList.add('active', 'entering');
            // Quitar la clase 'entering' después de la animación para mantener el estado 'active'
            card.addEventListener('transitionend', () => {
                card.classList.remove('entering');
            }, { once: true });
        } else {
            card.classList.remove('active', 'entering');
            card.classList.add('leaving');
            // Ocultar completamente después de que la animación 'leaving' termine
            card.addEventListener('transitionend', () => {
                card.classList.add('hidden');
                card.classList.remove('leaving');
            }, { once: true });
        }
    });
}

/**
 * Carga la pregunta actual en el contenedor.
 */
function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const questionData = questions[currentQuestionIndex];
        questionContainer.innerHTML = `
            <p class="question-text">${questionData.question}</p>
            <div class="options-grid">
                ${questionData.options.map((option, index) =>
                    `<button class="option-button" data-index="${index}">${option}</button>`
                ).join('')}
            </div>
        `;
        // Añadir event listeners a los nuevos botones de opción
        document.querySelectorAll('.option-button').forEach(button => {
            button.addEventListener('click', selectAnswer);
        });
        nextButton.classList.add('hidden'); // Ocultar el botón "Siguiente" hasta que se seleccione una respuesta
    } else {
        showResults(); // Todas las preguntas respondidas, mostrar resultados
    }
}

/**
 * Marca la respuesta seleccionada y habilita el botón "Siguiente".
 * @param {Event} event El evento de clic.
 */
function selectAnswer(event) {
    const selectedButton = event.target;
    const optionsContainer = selectedButton.parentNode;

    // Remover la clase 'selected' de todos los botones y añadirla al botón clickeado
    Array.from(optionsContainer.children).forEach(button => {
        button.classList.remove('selected');
    });
    selectedButton.classList.add('selected');
    nextButton.classList.remove('hidden'); // Mostrar el botón "Siguiente"
}

/**
 * Avanza a la siguiente pregunta o muestra los resultados.
 */
function nextQuestion() {
    // Solo avanza si una opción ha sido seleccionada
    if (document.querySelector('.option-button.selected')) {
        // Aplica la clase 'leaving' a la tarjeta de quiz para iniciar la transición de salida
        quizSection.classList.add('leaving');

        // Espera a que termine la animación de salida antes de cargar la siguiente pregunta
        // y aplicar la animación de entrada.
        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion(); // Carga la siguiente pregunta o los resultados

            // Si aún estamos en la sección del quiz (no pasamos a resultados)
            if (currentQuestionIndex < questions.length) {
                // Elimina 'leaving' y añade 'entering' para la nueva pregunta
                quizSection.classList.remove('leaving');
                quizSection.classList.add('entering');
                // Asegura que la clase 'entering' se remueve después de su animación
                setTimeout(() => {
                    quizSection.classList.remove('entering');
                }, 400); // Duración de la transición CSS
            } else {
                // Si ya pasamos a resultados, showResults() ya manejará las clases
            }
        }, 400); // Coincide con la duración de la transición 'leaving' en CSS
    }
}


/**
 * Muestra la sección de resultados.
 */
function showResults() {
    showSection(resultsSection);
    compatibilityMessage.textContent = "¡Ustedes dos son fuego y ternura, alma con alma!";
    secretCodeUnlock.classList.remove('hidden');
    secretCodeDisplay.textContent = SECRET_CODE; // Asignar el código
    copyTooltip.textContent = "Copiar"; // Reiniciar texto del tooltip
}

/**
 * Reinicia el test volviendo a la introducción.
 */
function restartQuiz() {
    currentQuestionIndex = 0;
    showSection(introductionSection); // Volver a la introducción
    secretCodeUnlock.classList.add('hidden'); // Ocultar el código secreto
}

// --- Funcionalidad de Copiar Código ---
/**
 * Copia el código secreto al portapapeles y muestra un feedback visual.
 */
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
let isMusicPlaying = false; // Estado inicial: música pausada

/**
 * Intenta reproducir la música de fondo. Maneja la política de autoplay del navegador.
 */
function tryPlayMusic() {
    if (backgroundMusic.paused && !isMusicPlaying) {
        backgroundMusic.play()
            .then(() => {
                isMusicPlaying = true;
                body.classList.remove('music-muted'); // Asegura que el icono no esté silenciado
            })
            .catch(e => {
                console.warn("Autoplay de música de fondo bloqueado:", e);
                isMusicPlaying = false; // Si se bloquea, el estado sigue siendo "no reproduciendo"
                body.classList.add('music-muted'); // Mostrar el icono de silencio
            });
    }
}

/**
 * Alterna el estado de reproducción de la música.
 */
function toggleMusic() {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        isMusicPlaying = false;
        body.classList.add('music-muted');
    } else {
        backgroundMusic.play()
            .then(() => {
                isMusicPlaying = true;
                body.classList.remove('music-muted');
            })
            .catch(e => {
                console.warn("Intento de reproducción manual bloqueado:", e);
                isMusicPlaying = false;
                body.classList.add('music-muted');
            });
    }
}


// --- Inicialización y Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Establecer la sección de introducción como activa al cargar
    showSection(introductionSection);

    // Event Listeners
    startButton.addEventListener('click', () => {
        showSection(quizSection); // Muestra la sección del quiz
        loadQuestion(); // Carga la primera pregunta
    });

    nextButton.addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', restartQuiz);
    copyCodeButton.addEventListener('click', copySecretCode);
    muteButton.addEventListener('click', toggleMusic);

    // Intentar reproducir música al primer clic general del usuario (para navegadores restrictivos)
    // Se usa { once: true } para que solo se ejecute una vez.
    window.addEventListener("click", tryPlayMusic, { once: true });
});
