const fonts = [
  'Kirang Haerang',
  'Indie Flower',
  'Rye',
  'Amatic SC',
  'Bangers',
  'Fredericka the Great'
];

const letters = document.querySelectorAll('.letter');
const music = document.getElementById('bg-music');
const enterBtn = document.getElementById('enter-btn');
const introScreen = document.getElementById('intro');
const mainContent = document.getElementById('main');
const clickable = document.getElementById('clickable');

function rollIntro() {
  letters.forEach(letter => {
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    letter.style.fontFamily = randomFont;
  });
}

// Cambiar fuentes continuamente
setInterval(rollIntro, 350);

// Mostrar el contenido al hacer clic en "Entrar"
enterBtn.addEventListener('click', () => {
  music.play().catch(e => console.log("Autoplay bloqueado:", e));
  introScreen.style.display = 'none';
  mainContent.classList.add('show');
});

// Redirigir al hacer clic en el nombre
clickable.addEventListener('click', () => {
  window.location.href = "https://sendgb.com/zNcrBeWqFR5"; // ← URL de destino
});
