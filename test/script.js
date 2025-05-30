const fonts = [
  "'Cinzel', serif",
  "'Fredericka the Great', cursive",
  "'Raleway', sans-serif",
  "'Orbitron', sans-serif",
  "'Special Elite', cursive",
  "'Anton', sans-serif"
];

const letters = document.querySelectorAll('.letter');

// Cambia tipografía cada 700ms
setInterval(() => {
  letters.forEach(letter => {
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    letter.style.fontFamily = randomFont;
  });
}, 700);

// Redirección al hacer clic
document.getElementById('container').addEventListener('click', () => {
  window.location.href = "https://tupagina.com"; // ← CAMBIA ESTA URL
});
