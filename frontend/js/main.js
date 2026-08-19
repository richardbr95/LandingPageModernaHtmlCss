const menu = document.querySelector(".main-nav");
const button = document.querySelector(".nav-toggle");
const hamburger = document.querySelector(".hamburger");
const loginNavItem = document.querySelector("#login-nav-item");
const dashboardNavItem = document.querySelector("#dashboard-nav-item");
const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");

const contactForm = document.querySelector("#contact-form");

contactForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = contactForm.querySelector('[name ="name"]').value;
  const email = contactForm.querySelector('[name ="email"]').value;
  const message = contactForm.querySelector('[name ="message"]').value;

  try {
    const response = await fetch("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error sending contact:", data);
      return;
    }

    console.log("Contact sent successfully:", data);

    contactForm.reset();
  } catch {
    console.error("Error sending contact:", error);
  }
});

if (token && userData) {
  const user = JSON.parse(userData);

  if (loginNavItem) {
    loginNavItem.hidden = true;
  }

  if (user.role === "admin" && dashboardNavItem) {
    dashboardNavItem.hidden = false;
  }
}
