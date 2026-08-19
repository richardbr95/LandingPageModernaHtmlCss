const currentUser = requireAdmin();

if (!currentUser) {
  throw new Error("Unauthorized access");
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

  renderContacts(result);
}

function renderContacts(contacts) {
  const tableBody = document.querySelector("#contacts-table-body");

  tableBody.innerHTML = "";

  contacts.forEach(function (contact) {
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${contact.name}</td>
    <td>${contact.email}</td>
    <td>${contact.message}</td>
    <td><button id="${contact.id}" class="delete-contact btn-delete btn-ghost">-</button></td>
    `;

    tableBody.appendChild(row);
    const deleteButton = row.querySelector(".delete-contact");

    deleteButton.addEventListener("click", async function () {
      const token = getAuthToken();
      const contactId = contact.id;
      try {
        const response = await fetch(
          `http://localhost:3000/api/contact/${contactId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (!response.ok) {
          console.error(data.message);
          return;
        }
        loadContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    });
  });
}

loadContacts();

const logoutButton = document.querySelector("#logout-button");

logoutButton.addEventListener("click", function () {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "../pages/login.html";
});
