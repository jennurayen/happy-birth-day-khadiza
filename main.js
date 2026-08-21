
  // ---------- Gate open ----------
  const gate = document.getElementById('gate');
  const openBtn = document.getElementById('open-btn');
  openBtn.addEventListener('click', () => {
    gate.classList.add('hidden');
    document.body.style.overflow = 'auto';
    startHeroTitle();
    startAmbientHearts();
  }, { once:true });
  document.body.style.overflow = 'hidden';

  // ---------- Hero title stagger ----------
  function startHeroTitle(){
    const el = document.getElementById('hero-title');
    const text = "My Love";
    el.innerHTML = text.split(' ').map((w,i)=>
      `<span class="word" style="animation-delay:${i*0.18+0.15}s">${w}</span>`
    ).join(' ');
  }

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll('section');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
      }
    });
  }, { threshold:0.25 });
  revealEls.forEach(el=>io.observe(el));

  // ---------- Ambient floating hearts ----------
  const heartsLayer = document.getElementById('hearts-layer');
  const heartChars = ['💗','💕','🤍','✨'];
  let ambientRunning = false;
  function spawnHeart(){
    const h = document.createElement('div');
    h.className = 'heart-particle';
    h.textContent = heartChars[Math.floor(Math.random()*heartChars.length)];
    h.style.left = Math.random()*100 + '%';
    h.style.setProperty('--drift', (Math.random()*60-30)+'px');
    h.style.animationDuration = (7 + Math.random()*6) + 's';
    h.style.fontSize = (12 + Math.random()*14) + 'px';
    heartsLayer.appendChild(h);
    setTimeout(()=>h.remove(), 14000);
  }
  function startAmbientHearts(){
    if(ambientRunning) return;
    ambientRunning = true;
    spawnHeart();
    setInterval(spawnHeart, 1200);
  }

  // ---------- Make a wish + confetti ----------
  const cake = document.getElementById('cake');
  const finalMessage = document.getElementById('final-message');
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let particles = [];
  const confettiColors = ['#E63950','#F0B860','#FFE1E7','#9E1B3A','#FFFFFF'];
  function burstConfetti(){
    particles = [];
    const cx = canvas.width/2, cy = canvas.height*0.55;
    for(let i=0;i<90;i++){
      const angle = Math.random()*Math.PI*2;
      const speed = 3 + Math.random()*7;
      particles.push({
        x:cx, y:cy,
        vx:Math.cos(angle)*speed,
        vy:Math.sin(angle)*speed - 4,
        size:4+Math.random()*5,
        color:confettiColors[Math.floor(Math.random()*confettiColors.length)],
        rot:Math.random()*360,
        vr:(Math.random()-0.5)*10,
        life:0
      });
    }
    requestAnimationFrame(animateConfetti);
  }
  function animateConfetti(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive = false;
    particles.forEach(p=>{
      p.vy += 0.15;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      if(p.life < 140){
        alive = true;
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6);
        ctx.restore();
      }
    });
    if(alive) requestAnimationFrame(animateConfetti);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  let wished = false;
  cake.addEventListener('click', ()=>{
    cake.classList.add('blown');
    burstConfetti();
    if(!wished){
      wished = true;
      finalMessage.classList.add('show');
    }
  });