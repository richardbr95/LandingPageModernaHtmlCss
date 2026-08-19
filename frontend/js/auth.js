function getStoredUser() {
  const userData = localStorage.getItem("user");

  if (!userData) {
    return null;
  }
  return JSON.parse(userData);
}

function getAuthToken() {
  return localStorage.getItem("token");
}

function requireAdmin() {
  const token = getAuthToken();
  const user = getStoredUser();

  if (!token || !user) {
    window.location.href = "../pages/login.html";
    return null;
  }

  if (user.role !== "admin") {
    window.location.href = "../pages/landing.html";
    return null;
  }
  return user;
}
