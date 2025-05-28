const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(20, 20);

const scoreElement = document.getElementById("score");
const modal = document.getElementById("code-modal");
const copyBtn = document.getElementById("copy-btn");

const secretCode = "amorparasiempre";
const unlockScore = 5000;

let score = 0;

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = "#d63384";
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (
        m[y][x] !== 0 &&
        (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

function arenaSweep() {
  outer: for (let y = arena.length - 1; y >= 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;
    score += 100;
  }
}

function updateScore() {
  scoreElement.innerText = score;
  if (score >= unlockScore && !localStorage.getItem("codeUnlocked")) {
    modal.classList.remove("hidden");
    localStorage.setItem("codeUnlocked", "true");
  }
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerRotate() {
  const m = player.matrix;
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [m[x][y], m[y][x]] = [m[y][x], m[x][y]];
    }
  }
  m.forEach(row => row.reverse());
  if (collide(arena, player)) {
    m.forEach(row => row.reverse());
    m.reverse();
  }
}

function createPiece() {
  return [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ];
}

function playerReset() {
  player.matrix = createPiece();
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    score = 0;
    updateScore();
  }
}

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, {x: 0, y: 0});
  drawMatrix(player.matrix, player.pos);
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}

const arena = createMatrix(12, 20);
const player = {
  pos: {x: 0, y: 0},
  matrix: null,
};

playerReset();
updateScore();
update();

// Controles de teclado
window.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") playerMove(-1);
  else if (e.key === "ArrowRight") playerMove(1);
  else if (e.key === "ArrowDown") playerDrop();
  else if (e.key === "ArrowUp") playerRotate();
});

// Controles táctiles
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const rotateBtn = document.getElementById("rotate");
const downBtn = document.getElementById("down");

leftBtn.addEventListener("click", () => playerMove(-1));
rightBtn.addEventListener("click", () => playerMove(1));
rotateBtn.addEventListener("click", () => playerRotate());
downBtn.addEventListener("click", () => playerDrop());

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(secretCode).then(() => {
    copyBtn.innerText = "¡Copiado!";
    setTimeout(() => {
      copyBtn.innerText = "Copiar código";
    }, 2000);
  });
});

// Mostrar el modal si ya se desbloqueó
if (localStorage.getItem("codeUnlocked")) {
  modal.classList.remove("hidden");
         }
