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
let compatibilityScore = 0;
const secretNumber = "ALMASGEMELAS"; // Código secreto desbloqueado
function loadQuestion() {
const currentQuestion = questions;
if (currentQuestionIndex < questions.length) {
const questionData = questions;
questionContainer.innerHTML = <h2 class="question">${questionData.question}</h2><div class="options">${questionData.options.map((option, index) => <button class="option-button" data-index="{index}"\>{option}</button>).join('')}</div>;
const optionButtons = document.querySelectorAll('.option-button');
optionButtons.forEach(button => {
button.addEventListener('click', selectAnswer);
});
nextButton.classList.add('hidden');
} else {
showResults();
}
}
function selectAnswer(event) {
const selectedButton = event.target;
const index = parseInt(selectedButton.dataset.index);
// compatibilityScore += questions.values; // Sumamos el valor de la respuesta (si fuera necesario un cálculo real)
const optionsContainer = selectedButton.parentNode;
Array.from(optionsContainer.children).forEach(button => {
button.classList.remove('selected');
});
selectedButton.classList.add('selected');
nextButton.classList.remove('hidden');
}
function nextQuestion() {
if (currentQuestionIndex < questions.length) {
// Opcional: Transición suave entre preguntas
questionContainer.classList.add('slide-out');
setTimeout(() => {
currentQuestionIndex++;
loadQuestion();
questionContainer.classList.remove('slide-out');
questionContainer.classList.add('slide-in');
}, 300);
} else {
showResults();
}
}
function showResults() {
quizSection.classList.add('hidden');
introductionSection.classList.add('hidden');
resultsSection.classList.remove('hidden');
resultsSection.classList.add('show');
compatibilityMessage.textContent = "¡Ustedes dos son fuego y ternura, alma con alma!"; // Siempre 100%
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
loadQuestion();
}
function shareResult() {
const message = encodeURIComponent("¡Descubrimos que somos almas gemelas! ¿Quieres ver qué tan compatible eres con tu amor? [Enlace a tu página]");
const shareUrl = https://web.whatsapp.com/send?text=${message}; // Ejemplo para WhatsApp
window.open(shareUrl, '_blank');
}
// Inicializar el test
loadQuestion();
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', restartQuiz);
shareButton.addEventListener('click', shareResult);
// --- Música de fondo ---
let isMusicPlaying = true;
muteButton.addEventListener('click', () => {
if (isMusicPlaying) {
backgroundMusic.pause();
isMusicPlaying = false;
body.classList.add('mute-music');
} else {
backgroundMusic.play();
isMusicPlaying = true;
body.classList.remove('mute-music');
}
});
backgroundMusic.play().catch(() => {
console.log("La reproducción automática de música fue bloqueada por el navegador.");
});
// --- Configuración de partículas de corazón (requiere una librería o implementación manual) ---
// Aquí deberías incluir el código para animar las partículas de corazón en el <canvas>
// Podrías usar una librería como "particles.js" o crear tu propia lógica con Canvas API.
const heartParticlesContainer = document.querySelector('.heart-particles');
const heartCanvas = document.createElement('canvas');
const heartContext = heartCanvas.getContext('2d');
heartCanvas.width = window.innerWidth;
heartCanvas.height = window.innerHeight;
heartParticlesContainer.appendChild(heartCanvas);
// (Aquí iría la lógica para dibujar y animar las partículas de corazón)
function animateParticles() {
// ... tu código de animación de partículas ...
requestAnimationFrame(animateParticles);
}
// Si decides implementar las partículas, llama a animateParticles aquí
// animateParticles();
window.addEventListener('resize', () => {
heartCanvas.width = window.innerWidth;
heartCanvas.height = window.innerHeight;
// (Si es necesario, reinicializa o redibuja las partículas al cambiar el tamaño)
});
if (backgroundMusic.muted) {
body.classList.add('mute-music');
isMusicPlaying = false;
  }
