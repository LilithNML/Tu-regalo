const chapters = [
  { title:"Capítulo 1: Nuestro Comienzo", content:`
    <p>Desde el <span class="highlight">primer día</span> que te conocí…</p>
    <img src="https://cdn.donmai.us/original/a7/25/a7257485b09d67bd6c0af281fe5d1efc.jpg" alt="Primer momento">
  `},
  { title:"Capítulo 2: Momentos Inolvidables", content:`
    <p>Recuerdo esas risas <span class="highlight">únicas</span>.</p>
    <div style="position:relative;padding-top:56.25%">
      <iframe class="fluid-iframe" src="https://player.vimeo.com/video/425496664"
        frameborder="0" allow="autoplay; fullscreen;" allowfullscreen></iframe>
    </div>
  `},
  { title:"Capítulo 3: Lo que Significas para Mí", content:`
    <p>Eres mi calma en el caos…</p>
    <audio controls src="https://www.w3schools.com/html/horse.mp3"></audio>
    <p>Visita nuestro <a href="#">lugar especial</a>.</p>
  `}
];

let current=0;
const container = document.getElementById('chapter-container');
const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('side-menu');
const menuList = document.getElementById('menu-list');
const introModal = document.getElementById('intro-modal');

function preload() {
  chapters.forEach(c=>{
    const m = c.content.match(/src="([^"]+)"/g);
    if(m) m.forEach(u => {
      const url = u.slice(5,-1);
      if(url.endsWith('.jpg')||url.endsWith('.png'))
        new Image().src = url;
    });
  });
}
preload();

function renderChapter(i){
  container.innerHTML='';
  const div = document.createElement('div');
  div.className='chapter';
  div.innerHTML = chapters[i].content;
  container.appendChild(div);
  setTimeout(()=>div.classList.add('visible'),10);
}
renderChapter(current);

document.getElementById('prev').onclick=()=>{ current=(current-1+chapters.length)%chapters.length; renderChapter(current);}
document.getElementById('next').onclick=()=>{ current=(current+1)%chapters.length; renderChapter(current);}

chapters.forEach((c,i)=>{
  const li = document.createElement('li');
  const btn = document.createElement('button');
  btn.textContent = c.title;
  btn.onclick = ()=>{ current=i; renderChapter(i); sideMenu.classList.remove('open'); }
  li.appendChild(btn); menuList.appendChild(li);
});

menuBtn.onclick=()=>sideMenu.classList.toggle('open');

if(!localStorage.getItem('diarioVisto')){
  introModal.style.display='flex';
  document.getElementById('close-intro').onclick = ()=>{
    introModal.style.display='none';
    localStorage.setItem('diarioVisto','1');
  };
}

document.addEventListener('click',e=>{
  if(e.target.tagName==='IMG' && e.target.closest('.chapter')){
    const overlay=document.createElement('div'); overlay.className='zoom-overlay';
    const cont=document.createElement('div'); cont.className='zoom-img-container'; cont.style.transform='translate(0,0) scale(1)';
    const img=document.createElement('img'); img.src=e.target.src;
    overlay.append(cont,img);
    const close=document.createElement('button'); close.className='zoom-close';
    close.innerHTML='<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    close.onclick=()=>overlay.remove(); overlay.append(close);
    let scale=1,last=1,startDist,dx=0,dy=0,ox=0,oy=0;

    overlay.addEventListener('touchstart',e=>{
      if(e.touches.length===2){
        last=scale;
        startDist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX,
                              e.touches[0].clientY-e.touches[1].clientY);
      } else {
        ox= e.touches[0].clientX - dx;
        oy= e.touches[0].clientY - dy;
      }
    },{passive:false});
    overlay.addEventListener('touchmove',e=>{
      e.preventDefault();
      if(e.touches.length===2){
        const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,
                           e.touches[0].clientY-e.touches[1].clientY);
        scale=Math.min(5,Math.max(1,last*d/startDist));
      } else {
        dx=e.touches[0].clientX-ox;
        dy=e.touches[0].clientY-oy;
      }
      cont.style.transform=\`translate(\${dx}px,\${dy}px) scale(\${scale})\`;
    },{passive:false});

    document.body.append(overlay);
  }
});

// Partículas adaptativas simples
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let w,h, particles=[];
function resize(){
  w=canvas.width=window.innerWidth;
  h=canvas.height=window.innerHeight;
}
function initParticles(){
  particles = Array.from({length: w/20},()=>{
    return {x: Math.random()*w, y: Math.random()*h,
      vx:(Math.random()-0.5)/2, vy:(Math.random()-0.5)/2,
      radius: Math.random()*1.2+0.6,
      hue: 200 + Math.random()*40
    };
  });
}
function draw(){
  ctx.clearRect(0,0,w,h);
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,2*Math.PI);
    ctx.fillStyle = \`hsla(\${p.hue},50%,80%,0.6)\`;
    ctx.fill();
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>w)p.x=(p.x+w)%w;
    if(p.y<0||p.y>h)p.y=(p.y+h)%h;
  });
  requestAnimationFrame(draw);
}
window.addEventListener('resize',()=>{
  resize(); initParticles();
});
resize(); initParticles(); draw();
