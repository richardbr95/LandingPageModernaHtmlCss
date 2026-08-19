const currentUser = requireAdmin();

if (!currentUser) {
  throw new Error("Unauthorized access.");
}

const userName = document.querySelector("#user-name");

if (userName) {
  userName.textContent = currentUser.name;
}
async function loadContacts() {
  const token = getAuthToken();
  const response = await fetch("http://localhost:3000/api/contact", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Error loading contacts:", result);
    return;
  }

  const contactsCount = document.querySelector("#contacts-count");

  if (contactsCount) {
    contactsCount.textContent = result.length;
  }
}
loadContacts();

const logoutButton = document.querySelector("#logout-button");

logoutButton.addEventListener("click", function () {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "../pages/login.html";
});
