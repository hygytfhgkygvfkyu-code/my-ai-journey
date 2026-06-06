// 分区动态背景 — Hero 网格脉冲 / 其他区域 粒子集群流
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'bgCanvas';
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '0',
    pointerEvents: 'none'
  });
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function getCurrentZone() {
    const sections = document.querySelectorAll('.section');
    const sy = window.scrollY + window.innerHeight / 2;
    let zone = 'hero';
    sections.forEach(sec => {
      if (sec.offsetTop <= sy && sec.offsetTop + sec.offsetHeight > sy) zone = sec.id;
    });
    return zone;
  }

  // ========== 粒子集群初始化 ==========
  const SWARM_COUNT = 4;
  const PARTICLES_PER_SWARM = 30;
  const swarms = [];

  function createSwarm() {
    const cx = Math.random() * w;
    const cy = Math.random() * h;
    const particles = [];
    for (let i = 0; i < PARTICLES_PER_SWARM; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 80;
      particles.push({
        ox: Math.cos(angle) * dist,  // 相对集群中心的偏移
        oy: Math.sin(angle) * dist,
        r: 1 + Math.random() * 2.5,
        speed: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        wander: 0.2 + Math.random() * 0.4
      });
    }
    return {
      cx, cy,                                  // 集群中心
      vx: (Math.random() - 0.5) * 0.4,        // 移动速度
      vy: (Math.random() - 0.5) * 0.4,
      freqX: 0.3 + Math.random() * 0.5,       // 正弦路径频率
      freqY: 0.3 + Math.random() * 0.5,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      amplitude: 80 + Math.random() * 160,
      particles
    };
  }

  function initSwarms() {
    if (swarms.length) return;
    for (let i = 0; i < SWARM_COUNT; i++) swarms.push(createSwarm());
  }

  // ========== Hero: 网格脉冲 ==========
  function drawGridPulse(t) {
    const gs = Math.max(28, Math.min(40, Math.floor(w / 30)));
    const cols = Math.floor(w / gs) + 1;
    const rows = Math.floor(h / gs) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * gs, y = row * gs;
        const wave = Math.sin(col * 0.4 + t * 2.5) * Math.cos(row * 0.5 + t * 2) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 1.2 + wave * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37,99,235,${0.2 + wave * 0.45})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 2; i++) {
      const cx = w * (0.3 + i * 0.4), cy = h * (0.3 + i * 0.3);
      const phase = (t * 0.6 + i * 2) % 3, rr = 30 + phase * 120;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(37,99,235,${(1 - phase / 3) * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // ========== 粒子集群流 ==========
  function drawSwarmParticles(t) {
    initSwarms();

    swarms.forEach(swarm => {
      // 集群中心沿正弦路径移动
      swarm.cx += swarm.vx;
      swarm.cy += swarm.vy;
      if (swarm.cx < -100) swarm.cx = w + 100;
      if (swarm.cx > w + 100) swarm.cx = -100;
      if (swarm.cy < -100) swarm.cy = h + 100;
      if (swarm.cy > h + 100) swarm.cy = -100;

      // 额外正弦扰动
      const cx = swarm.cx + Math.sin(t * swarm.freqX + swarm.phaseX) * swarm.amplitude * 0.3;
      const cy = swarm.cy + Math.cos(t * swarm.freqY + swarm.phaseY) * swarm.amplitude * 0.3;

      const screenPositions = [];
      const PARTICLE_COLOR = 'rgba(37,99,235,0.5)';
      const CONNECT_COLOR = 'rgba(37,99,235,0.15)';

      // 计算每个粒子屏幕坐标
      swarm.particles.forEach(p => {
        p.ox += (Math.random() - 0.5) * p.wander;
        p.oy += (Math.random() - 0.5) * p.wander;
        const maxDist = 100;
        if (Math.abs(p.ox) > maxDist) p.ox *= 0.98;
        if (Math.abs(p.oy) > maxDist) p.oy *= 0.98;

        const px = cx + p.ox;
        const py = cy + p.oy;
        screenPositions.push({ x: px, y: py, r: p.r });
      });

      // 画连线（同一集群内距离 < 100px）
      for (let i = 0; i < screenPositions.length; i++) {
        for (let j = i + 1; j < screenPositions.length; j++) {
          const dx = screenPositions[i].x - screenPositions[j].x;
          const dy = screenPositions[i].y - screenPositions[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(screenPositions[i].x, screenPositions[i].y);
            ctx.lineTo(screenPositions[j].x, screenPositions[j].y);
            ctx.strokeStyle = CONNECT_COLOR;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // 画粒子
      screenPositions.forEach(sp => {
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.fill();
      });
    });
  }

  // ========== 主循环 ==========
  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const zone = getCurrentZone();

    if (zone === 'hero') {
      drawGridPulse(t);
    } else {
      drawSwarmParticles(t);
    }
  }

  resize();
  window.addEventListener('resize', resize);

  let lastTime = performance.now();
  function loop(now) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    draw(now / 1000);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // 内容层置顶
  document.querySelectorAll('.section, .footer').forEach(el => {
    el.style.position = 'relative';
    el.style.zIndex = '1';
  });
  const nb = document.querySelector('.navbar');
  if (nb) nb.style.zIndex = '100';
})();
