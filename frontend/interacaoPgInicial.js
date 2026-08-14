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

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = form.querySelector('[name="name"]').value;
  const email = form.querySelector('[name="email"]').value;
  const message = form.querySelector('[name="message"]').value;

  const data = {
    name: name,
    email: email,
    message: message,
  };

  const response = await fetch("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  console.log(result);
});

async function buscarContatos() {
  const response = await fetch("http://localhost:3000/api/contact");
  const contatos = await response.json();

  const lista = document.querySelector("#contacts-list");

  contatos.forEach(function (contato) {
    const item = document.createElement("div");

    item.innerHTML = `
    <h3>${contato.name}<h3>
    <p>${contato.email}<p>
    <p>${contato.message}<p>
    `;

    lista.appendChild(item);
  });
}

buscarContatos();
