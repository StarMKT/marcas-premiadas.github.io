(() => {
  const DESKTOP_MIN = 992;

  function startPrizeEffects() {
    const section = document.querySelector('#premios.brands, .brands#premios');
    if (!section || window.innerWidth < DESKTOP_MIN) return;

    const pngs = Array.from(section.querySelectorAll('.brand-item .brand-png'));
    if (!pngs.length) return;

    // estados por imagem
    const items = pngs.map((el, i) => ({
      el,
      // sementes diferentes (flutuação)
      sx: Math.random() * Math.PI * 2,
      sy: Math.random() * Math.PI * 2,
      sr: Math.random() * Math.PI * 2,
      ampX: 6 + (i % 3) * 1.2,
      ampY: 7 + ((i + 1) % 3) * 1.1,
      ampR: 0.6,
      vx: 0.8 + (i % 5) * 0.03,
      vy: 0.9 + ((i + 2) % 5) * 0.03,
      vr: 0.25 + (i % 4) * 0.02,
      gx: 0, gy: 0, tx: 0, ty: 0  // posição gravitacional
    }));

    const secRect = () => section.getBoundingClientRect();
    let mouse = { x: 0, y: 0, inside: false };

    section.addEventListener('mousemove', (e) => {
      const r = secRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.inside = true;
    });
    section.addEventListener('mouseleave', () => (mouse.inside = false));

    // calcula centros e dimensões
    let secBox, centers = [];
    function recomputeCenters() {
      secBox = secRect();
      centers = items.map(it => {
        const box = it.el.getBoundingClientRect();
        return {
          cx: (box.left - secBox.left) + box.width / 2,
          cy: (box.top  - secBox.top)  + box.height / 2
        };
      });
    }
    recomputeCenters();

    let lastCentersAt = 0;
    const ease = 0.12;   // inércia suave
    const radius = 300;  // raio de influência do cursor
    const pull = 0.12;   // intensidade da gravidade
    const maxShift = 18; // deslocamento máximo (px)

    function tick(t) {
      if (t - lastCentersAt > 250) { recomputeCenters(); lastCentersAt = t; }

      items.forEach((it, i) => {
        // flutuação contínua tipo bolha
        const bx = Math.sin(t * 0.001 * it.vx + it.sx) * it.ampX;
        const by = Math.cos(t * 0.001 * it.vy + it.sy) * it.ampY;
        const br = Math.sin(t * 0.001 * it.vr + it.sr) * it.ampR;

        // atração gravitacional leve
        let gx = 0, gy = 0;
        if (mouse.inside) {
          const c = centers[i];
          const dx = mouse.x - c.cx;
          const dy = mouse.y - c.cy;
          const dist = Math.hypot(dx, dy);
          const force = Math.max(0, 1 - dist / radius); // decai com a distância
          gx = dx * force * pull;
          gy = dy * force * pull;
        }

        // aplica inércia (suavização)
        it.gx += (gx - it.gx) * ease;
        it.gy += (gy - it.gy) * ease;

        // limita deslocamento máximo
        const fx = Math.max(-maxShift, Math.min(maxShift, bx + it.gx));
        const fy = Math.max(-maxShift, Math.min(maxShift, by + it.gy));

        // aplica transformação final
        it.el.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${br}deg)`;
      });

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', startPrizeEffects);
  else startPrizeEffects();
})();
