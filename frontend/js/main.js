const menu = document.querySelector(".main-nav");
const button = document.querySelector(".nav-toggle");
const hamburger = document.querySelector(".hamburger");
const loginNavItem = document.querySelector("#login-nav-item");
const dashboardNavItem = document.querySelector("#dashboard-nav-item");
const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");

if (token && userData) {
  const user = JSON.parse(userData);

  if (loginNavItem) {
    loginNavItem.hidden = true;
  }

  if (user.role === "admin" && dashboardNavItem) {
    dashboardNavItem.hidden = false;
  }
}
