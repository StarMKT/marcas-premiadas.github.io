// ====== Toggle do menu mobile ======
const toggleBtn = document.querySelector('.menu-toggle');
const navList   = document.querySelector('.nav-list');

if (toggleBtn && navList) {
  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('open');
    navList.classList.toggle('active');
  });

  // Fecha o menu ao clicar em qualquer link
  navList.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      toggleBtn.classList.remove('open');
      navList.classList.remove('active');
    }
  });
}

// ====== Header: esconde ao rolar p/ baixo, mostra ao rolar p/ cima ======
const header = document.querySelector('.header');
let lastY = window.scrollY;
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  const goingDown = y > lastY;
  const delta = Math.abs(y - lastY);

  // Evita “piscar” em micro movimentos
  if (delta < 4) { lastY = y; ticking = false; return; }

  if (goingDown && y > 56) {
    header.classList.add('header--hidden');     // some ao rolar p/ baixo
  } else {
    header.classList.remove('header--hidden');  // aparece ao rolar p/ cima
  }

  lastY = y;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });


document.addEventListener('click', (e) => {
  if (!e.target.closest('.header')) {
    navList.classList.remove('active');
    toggleBtn.classList.remove('open');
  }
}, { passive:true });

