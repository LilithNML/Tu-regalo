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
  window.location.href = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c185aac5-57e4-4f00-aea4-208c73532aef/ddqlluf-25d5289c-7891-4e97-a1f5-443f8549f3e4.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2MxODVhYWM1LTU3ZTQtNGYwMC1hZWE0LTIwOGM3MzUzMmFlZlwvZGRxbGx1Zi0yNWQ1Mjg5Yy03ODkxLTRlOTctYTFmNS00NDNmODU0OWYzZTQuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.WQfG5ur8TjqnmSYXczYkcONslJks4Xv8-asNig5RCrU"; // ← cámbialo por la URL de destino
});
