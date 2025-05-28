// script.js

const canvas = document.getElementById("tetris"); const context = canvas.getContext("2d"); const scoreDisplay = document.getElementById("score"); const modal = document.getElementById("codeModal"); const closeBtn = document.getElementById("closeModal"); const copyBtn = document.getElementById("copyCode"); const unlockedMessage = document.getElementById("unlocked-message");

context.scale(20, 20);

let score = 0; const unlockScore = 100; const unlockCode = "tetris123";

const matrix = [ [0, 0, 0], [1, 1, 1], [0, 1, 0], ];

const player = { pos: { x: 5, y: 5 }, matrix: matrix, };

function drawMatrix(matrix, offset) { matrix.forEach((row, y) => { row.forEach((value, x) => { if (value !== 0) { context.fillStyle = "#FF6F61"; context.fillRect(x + offset.x, y + offset.y, 1, 1); } }); }); }

function draw() { context.fillStyle = "#000"; context.fillRect(0, 0, canvas.width, canvas.height); drawMatrix(player.matrix, player.pos); }

function merge(arena, player) { player.matrix.forEach((row, y) => { row.forEach((value, x) => { if (value !== 0) { arena[y + player.pos.y][x + player.pos.x] = value; } }); }); }

function collide(arena, player) { const [m, o] = [player.matrix, player.pos]; for (let y = 0; y < m.length; ++y) { for (let x = 0; x < m[y].length; ++x) { if ( m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0 ) { return true; } } } return false; }

function createMatrix(w, h) { const matrix = []; while (h--) { matrix.push(new Array(w).fill(0)); } return matrix; }

function playerDrop() { player.pos.y++; if (collide(arena, player)) { player.pos.y--; merge(arena, player); player.pos.y = 0; score += 10; scoreDisplay.innerText = score; if (score >= unlockScore && !localStorage.getItem("codeUnlocked")) { localStorage.setItem("codeUnlocked", true); document.getElementById("codeText").innerText = unlockCode; modal.classList.remove("hidden"); unlockedMessage.classList.remove("hidden"); } } dropCounter = 0; }

function playerMove(dir) { player.pos.x += dir; if (collide(arena, player)) { player.pos.x -= dir; } }

function playerRotate() { const m = player.matrix; for (let y = 0; y < m.length; ++y) { for (let x = 0; x < y; ++x) { [m[x][y], m[y][x]] = [m[y][x], m[x][y]]; } } m.forEach(row => row.reverse()); if (collide(arena, player)) { for (let y = 0; y < m.length; ++y) { for (let x = 0; x < y; ++x) { [m[x][y], m[y][x]] = [m[y][x], m[x][y]]; } } m.forEach(row => row.reverse()); } }

let dropCounter = 0; let dropInterval = 1000; let lastTime = 0;

function update(time = 0) { const deltaTime = time - lastTime; lastTime = time; dropCounter += deltaTime; if (dropCounter > dropInterval) { playerDrop(); } draw(); requestAnimationFrame(update); }

const arena = createMatrix(12, 20);

document.addEventListener("keydown", (event) => { if (event.key === "ArrowLeft") { playerMove(-1); } else if (event.key === "ArrowRight") { playerMove(1); } else if (event.key === "ArrowDown") { playerDrop(); } else if (event.key === "ArrowUp") { playerRotate(); } });

closeBtn.addEventListener("click", () => { modal.classList.add("hidden"); });

copyBtn.addEventListener("click", () => { navigator.clipboard.writeText(unlockCode).then(() => { copyBtn.innerText = "¡Copiado!"; setTimeout(() => { copyBtn.innerText = "Copiar código"; }, 1500); }); });

if (localStorage.getItem("codeUnlocked")) { unlockedMessage.classList.remove("hidden"); }

update();

  
