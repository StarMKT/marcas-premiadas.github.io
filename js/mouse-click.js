  // === Click de FAQ ===
  document.addEventListener("DOMContentLoaded", () => {
    const clickSound = new Audio("sounds/mouse-click.mp3");
    clickSound.volume = 0.25; // volume sutil

    // seleciona todos os <details> da FAQ
    document.querySelectorAll(".faq-item").forEach(item => {
      item.addEventListener("toggle", () => {
        // reinicia o áudio pra poder tocar rápido várias vezes seguidas
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {}); // ignora bloqueio se autoplay desativado
      });
    });
  });
