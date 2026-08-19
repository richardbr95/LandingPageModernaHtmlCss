console.log("login.js carregado!");
const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = loginForm.querySelector('[name ="email"]').value;
  const password = loginForm.querySelector('[name ="password"]').value;

  const response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    loginMessage.textContent = result.message;
    return;
  }

  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.user));

  if (result.user.role === "admin") {
    window.location.href = "../pages/admin.html";
  } else if (result.user.role === "client") {
    window.location.href = "../pages/landing.html";
  }
});
