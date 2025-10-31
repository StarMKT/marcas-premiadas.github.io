// js/hero-stickers-burst.js
(() => {
  const STICKER_IMAGES = [
    'images/blurry_ticket.png',
    'images/blurry_ticket2.png',
    'images/bottom_ticket.png',
    'images/bottom_right_ticket.png',
    'images/clear_ticket.png',
    'images/medium_ticket.png',
    'images/ticket.png'
  ];

  // === NOVO: itens pesados (prêmios) ===
  const HEAVY_IMAGES = [
    'images/airfryer_solo.png',
    'images/frigideira.png',
    'images/panela.png',
    'images/potes.png'
  ];

  const HERO_SELECTOR = '.hero';
  const HERO_IMG_SELECTOR = '.hero .hero-art';

  // Física dos selos (papel leve)
  const CONFIG = {
    burstCount: { min: 30, max: 42 },
    speed: { min: 180, max: 620 },
    gravity: 200,
    drag: 0.986,
    rotSpeed: { min: -120, max: 120 },
    scale: { min: 0.12, max: 0.28 },
    life: 5.0,
    edgeSoftFade: 200,
    spawnJitter: 60,
    upBiasDeg: 75,
    upBoost: { min: 140, max: 260 }
  };

  // Física dos itens pesados
  const HEAVY = {
    speed: { min: 260, max: 440 },
    gravity: 340,
    drag: 0.975,
    rotSpeed: { min: -60, max: 60 },
    scale: { min: 0.34, max: 0.60 },
    life: 8.8,
    upBoost: { min: 110, max: 250 }
  };

  const hero = document.querySelector(HERO_SELECTOR);
  const heroImg = document.querySelector(HERO_IMG_SELECTOR);
  if (!hero || !heroImg) return;

  // Camada de explosão
  let burstLayer = hero.querySelector('.hero-burst-layer');
  if (!burstLayer) {
    burstLayer = document.createElement('div');
    burstLayer.className = 'hero-burst-layer';
    hero.appendChild(burstLayer);
  }

  const rand = (a, b) => a + Math.random() * (b - a);
  const randInt = (a, b) => Math.round(rand(a, b));

  // === Selos (leves) ===
  function createParticle(x, y, bounds) {
    const el = document.createElement('img');
    el.className = 'sticker-particle';
    el.src = STICKER_IMAGES[randInt(0, STICKER_IMAGES.length - 1)];
    el.alt = '';
    el.decoding = 'async';
    el.loading = 'lazy';
    el.style.position = 'absolute';
    el.style.left = '0';
    el.style.top = '0';
    el.style.willChange = 'transform,opacity';
    burstLayer.appendChild(el);

    // Ângulo centrado para cima (-90°)
    const upCenter = -90 * Math.PI / 180;
    const spread = CONFIG.upBiasDeg * Math.PI / 180;
    const angle = upCenter + rand(-spread, spread);

    const speed = rand(CONFIG.speed.min, CONFIG.speed.max);
    const vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;
    vy -= rand(CONFIG.upBoost.min, CONFIG.upBoost.max);

    const rot = rand(0, 360);
    const rotSpeed = rand(CONFIG.rotSpeed.min, CONFIG.rotSpeed.max);
    const scale = rand(CONFIG.scale.min, CONFIG.scale.max);
    const life = CONFIG.life * rand(0.85, 1.15);

    const spawnX = x + rand(-CONFIG.spawnJitter, CONFIG.spawnJitter);
    const spawnY = y + rand(-CONFIG.spawnJitter, CONFIG.spawnJitter);

    return {
      el, x: spawnX, y: spawnY, vx, vy, rot, rotSpeed, scale,
      age: 0, life, bounds
    };
  }

  // === Itens pesados ===
  function createHeavyParticle(src, x, y, angleRad, bounds) {
    const el = document.createElement('img');
    el.className = 'sticker-particle sticker-heavy';
    el.src = src;
    el.alt = '';
    el.decoding = 'async';
    el.loading = 'lazy';
    el.style.position = 'absolute';
    el.style.left = '0';
    el.style.top = '0';
    el.style.willChange = 'transform,opacity';
    burstLayer.appendChild(el);

    const speed = rand(HEAVY.speed.min, HEAVY.speed.max);
    const vx = Math.cos(angleRad) * speed;
    let vy = Math.sin(angleRad) * speed;
    vy -= rand(HEAVY.upBoost.min, HEAVY.upBoost.max);

    const rot = rand(0, 360);
    const rotSpeed = rand(HEAVY.rotSpeed.min, HEAVY.rotSpeed.max);
    const scale = rand(HEAVY.scale.min, HEAVY.scale.max);
    const life = HEAVY.life * rand(0.9, 1.1);

    return {
      el, x, y, vx, vy, rot, rotSpeed, scale,
      age: 0, life, bounds,
      heavy: true
    };
  }

  // Loop de animação
  let particles = [];
  let rafId = null;
  let last = 0;

  function tick(ts) {
    if (!last) last = ts;
    const dt = Math.min((ts - last) / 1000, 0.033);
    last = ts;

    const rect = hero.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    particles.forEach(p => {
      const drag = p.heavy ? HEAVY.drag : CONFIG.drag;
      const gravity = p.heavy ? HEAVY.gravity : CONFIG.gravity;

      p.vx *= drag;
      p.vy += gravity * dt;

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      p.rot += p.rotSpeed * dt;
      p.age += dt;

      const t = p.age / p.life;

      // --- Fading suave, único e sem oscilação ---
      let alpha;
      if (t < 0.8) {
        alpha = 1; // 100% visível em 80% do tempo
      } else {
        const fadeProgress = (t - 0.8) / 0.2; // últimos 20%
        alpha = 1 - fadeProgress;
      }

      // Reforço visual leve (mais brilho)
      if (alpha > 1) alpha = 1;
      if (alpha < 0) alpha = 0;

      p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg) scale(${p.scale})`;
      p.el.style.opacity = alpha;

      if (alpha <= 0 || p.y > height + 240 || p.x < -240 || p.x > width + 240) {
        p.remove = true;
      }
    });

    if (particles.some(p => p.remove)) {
      particles = particles.filter(p => {
        if (p.remove) p.el.remove();
        return !p.remove;
      });
    }

    if (particles.length) {
      rafId = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafId);
      rafId = null;
      last = 0;
    }
  }

  // --- Explosão ---
  function burstFromHero() {
    const heroRect = hero.getBoundingClientRect();
    const artRect = heroImg.getBoundingClientRect();

    const originX = (artRect.left - heroRect.left) + artRect.width / 2;
    const originY = (artRect.top - heroRect.top) + artRect.height / 2;

    const count = randInt(CONFIG.burstCount.min, CONFIG.burstCount.max);
    const bounds = { width: heroRect.width, height: heroRect.height };

    // Selos leves
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(originX, originY, bounds));
    }

    // Itens pesados (dois por explosão, em lados opostos)
    (function spawnHeavyPair() {
      const pool = [
        'images/airfryer_solo.png',
        'images/airfryer_solo.png', // duplicada = dobra a chance
        'images/frigideira.png',
        'images/panela.png',
        'images/potes.png'
      ];
      const pick1 = pool.splice(randInt(0, pool.length - 1), 1)[0];
      const pick2 = pool[randInt(0, pool.length - 1)];

      const baseDeg = rand(40, 70); // ângulo mais pra cima
      const jitter = rand(-8, 8);
      const rightDeg = -(baseDeg + jitter);
      const leftDeg = 180 + (baseDeg - jitter);
      const toRad = d => (d * Math.PI) / 180;

      particles.push(
        createHeavyParticle(pick1, originX, originY, toRad(rightDeg), bounds),
        createHeavyParticle(pick2, originX, originY, toRad(leftDeg), bounds)
      );
    })();

    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  // Interação principal
  let cooldown = false;
  const COOLDOWN_MS = 600;
  heroImg.addEventListener('mouseenter', () => {
    if (cooldown) return;
    cooldown = true;
    burstFromHero();
    setTimeout(() => (cooldown = false), COOLDOWN_MS);
  });
})();
