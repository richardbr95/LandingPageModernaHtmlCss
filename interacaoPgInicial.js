const menu = document.querySelector(".main-nav");
const botao = document.querySelector(".nav-toggle");
const hamburger = document.querySelector(".hamburger");

botao.addEventListener("click", function () {
  menu.classList.toggle("is-open");

  if (menu.classList.contains("is-open")) {
    hamburger.textContent = "✕";
    botao.setAttribute("aria-expanded", "true");
    botao.setAttribute("aria-label", "Fechar menu");
  } else {
    hamburger.textContent = "☰";
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu");
  }
});
