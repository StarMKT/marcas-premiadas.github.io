// ====== Toggle do menu mobile (robusto p/ id novo ou classe antiga) ======
const toggleBtn = document.querySelector('#k-menu-toggle') || document.querySelector('.menu-toggle');
const navList   = document.querySelector('.nav-list');

if (toggleBtn && navList) {
  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('open');
    navList.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Fecha ao clicar em um link
  navList.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      toggleBtn.classList.remove('open');
      navList.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header')) {
      toggleBtn.classList.remove('open');
      navList.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  }, { passive: true });
}
