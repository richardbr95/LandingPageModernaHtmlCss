const menu = document.querySelector(".main-nav");
const botao = document.querySelector(".nav-toggle");
const hamburger = document.querySelector(".hamburger");
const form = document.querySelector("#contact-form");

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

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = form.querySelector('[name="name"]').value;
  const email = form.querySelector('[name="email"]').value;
  const message = form.querySelector('[name="message"]').value;

  console.log("Nome:", name);
  console.log("E-mail:", email);
  console.log("Mensagem:", message);
});
