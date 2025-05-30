const fonts = [
  'Kirang Haerang',
  'Indie Flower',
  'Rye',
  'Amatic SC',
  'Bangers',
  'Fredericka the Great'
];

const letters = document.querySelectorAll('.letter');

const rollIntro = () => {
  letters.forEach(letter => {
    let randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    letter.style.fontFamily = randomFont;
  });
};

// Cambiar fuentes sin parar
setInterval(rollIntro, 350);

// Redirección al hacer clic
document.getElementById('clickable').addEventListener('click', () => {
  window.location.href = "https://tupagina.com"; // ← cámbialo por tu URL
});
