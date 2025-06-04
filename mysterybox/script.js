const cube = document.querySelector("#cube");
const cback = document.querySelector(".back");
const ctop = document.querySelector(".top");
const cleft = document.querySelector(".left");
const cright = document.querySelector(".right");
const glow = document.querySelector(".hexagon");
const message = document.querySelector(".message");

const transitionTime = "750ms";
let isOpen = false;

ctop.style.transition = `all ${transitionTime}`;
cleft.style.transition = `all ${transitionTime}`;
cright.style.transition = `all ${transitionTime}`;
cube.style.transition = `all ${transitionTime}`;
glow.style.transition = `all ${transitionTime}`;
cback.style.transition = `all ${transitionTime}`;

const rewards = [
  { text: "¡Power Play!", glow: "rgba(69,185,251,0.33)" },
  { text: "¡Glitch!", glow: "rgba(246,6,120,0.4)" },
  { text: "¡Bonus XP!", glow: "rgba(102,255,102,0.4)" },
  { text: "¡Ultra Rare!", glow: "rgba(255,102,204,0.4)" },
  { text: "¡Doble Recompensa!", glow: "rgba(255,255,102,0.4)" },
  { text: "¡NODKRAI!", glow: "rgba(255,100,50,0.4)" },
  { text: "¡Modo Fantasma!", glow: "rgba(150,150,255,0.4)" },
  { text: "¡Tiempo Extra!", glow: "rgba(255,165,0,0.4)" },
];

cube.addEventListener("click", openCube);

function openCube() {
  if (!isOpen) {
    showRandomReward();
    ctop.style.transform = "translateY(-3rem)";
    cleft.style.transform = "translateX(-3rem)";
    cright.style.transform = "translateX(3rem)";
    ctop.style.opacity = 0.1;
    cleft.style.opacity = 0.1;
    cright.style.opacity = 0.1;
    cback.style.opacity = 0.1;
    glow.style.opacity = 0.5;
    message.style.opacity = 1;
    cube.style.animationPlayState = "paused";
    isOpen = true;
  } else {
    ctop.style.transform = "translateY(0)";
    cleft.style.transform = "translateX(0)";
    cright.style.transform = "translateX(0)";
    ctop.style.opacity = 1;
    cleft.style.opacity = 1;
    cright.style.opacity = 1;
    cback.style.opacity = 1;
    glow.style.opacity = 1;
    message.style.opacity = 0;
    cube.style.animationPlayState = "running";
    isOpen = false;
    changeVar("rgba(255,195,26,0.4)");
  }
}

function changeVar(glowColor) {
  document.documentElement.style.setProperty("--glow", glowColor);
}

function showRandomReward() {
  const reward = rewards[Math.floor(Math.random() * rewards.length)];
  message.textContent = reward.text;
  changeVar(reward.glow);
}
