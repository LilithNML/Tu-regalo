const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const modal = document.getElementById('code-modal');
const copyBtn = document.getElementById('copy-btn');
const closeModal = document.getElementById('close-modal');

context.scale(20, 20); // Escala el canvas

// Definición de piezas
const PIECES = {
  T: [[ [0,1,0], [1,1,1], [0,0,0] ]],
  O: [[ [1,1], [1,1] ]],
  L: [[ [0,0,1], [1,1,1], [0,0,0] ]],
  J: [[ [1,0,0], [1,1,1], [0,0,0] ]],
  I: [[ [0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0] ]],
  S: [[ [0,1,1], [1,1,0], [0,0,0] ]],
  Z: [[ [1,1,0], [0,1,1], [0,0,0] ]]
};

const colors = ['#000', '#f89fb2', '#f1c0cc', '#f5a6b3', '#eca5ba', '#e4a6c0', '#db9fb9'];

function createMatrix(w, h) {
  const matrix = [];
  while (h--) matrix.push(new Array(w).fill(0));
  return matrix;
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function draw() {
  context.fillStyle = '#fafafa';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, {x:0, y:0});
  drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) arena[y + player.pos.y][x + player.pos.x] = value;
    });
  });
}

function collide(arena, player) {
  const m = player.matrix;
  const o = player.pos;
  return m.some((row, y) => row.some((value, x) =>
    value !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0
  ));
}

function rotate(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
  }
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) player.pos.x -= dir;
}

function playerReset() {
  const pieces = 'TJLOSZI';
  player.matrix = PIECES[pieces[Math.floor(Math.random() * pieces.length)]][0];
  player.pos.y = 0;
  player.pos.x = Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
  }
}

function playerRotate() {
  const rotated = rotate(player.matrix);
  const pos = player.pos.x;
  let offset = 1;
  while (collide(arena, {pos: player.pos, matrix: rotated})) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) return;
  }
  player.matrix = rotated;
}

function arenaSweep() {
  outer: for (let y = arena.length - 1; y >= 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) continue outer;
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    player.score += 100;
    updateScore();
  }
}

function updateScore() {
  scoreDisplay.textContent = `Puntos: ${player.score}`;
  if (player.score >= 5000 && !modalShown) {
    modalShown = true;
    modal.classList.remove('hidden');
  }
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let modalShown = false;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) playerDrop();
  draw();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') playerMove(-1);
  else if (event.key === 'ArrowRight') playerMove(1);
  else if (event.key === 'ArrowDown') playerDrop();
  else if (event.key === 'ArrowUp') playerRotate();
});

restartBtn.addEventListener('click', () => {
  player.score = 0;
  modalShown = false;
  playerReset();
  updateScore();
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText("gibosamenguante");
  copyBtn.textContent = "¡Copiado!";
  setTimeout(() => copyBtn.textContent = "Copiar", 2000);
});

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

const arena = createMatrix(12, 20);
const player = {
  pos: {x: 0, y: 0},
  matrix: null,
  score: 0,
};

playerReset();
update();
