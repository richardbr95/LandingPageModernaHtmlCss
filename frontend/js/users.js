const currentUser = requireAdmin();

if (!currentUser) {
  throw new Error("Unauthorized access.");
}

async function loadUsers() {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    const error = await response.json();
    console.error("Status:", response.status);
    console.error("Erro detalhado:", error);
    return;
  }

  renderUsers(result);
}

function renderUsers(users) {
  const tableBody = document.querySelector("#users-table-body");

  tableBody.innerHTML = "";

  users.forEach(function (user) {
    const row = document.createElement("tr");

    const isCurrentUser = user.id === currentUser.id;

    row.innerHTML = `
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${user.role}</td>
     <td>${isCurrentUser ? '<span class="btn-ghost"  style="opacity:0.3; margin-left: 10px">-</span>' : `<button id="${user.id}" class="delete-user btn-delete btn-ghost">-</button>`}</td>
    `;

    tableBody.appendChild(row);

    if (!isCurrentUser) {
      const deleteButton = row.querySelector(".delete-user");
      deleteButton.addEventListener("click", async function () {
        const token = getAuthToken();

        try {
          const response = await fetch(`${API_URL}/${user.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();

          if (!response.ok) {
            console.error(data.message);
            return;
          }
          loadUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      });
    }
  });
}

loadUsers();

const searchInput = document.querySelector("#search-input");

searchInput.addEventListener("input", function () {
  const term = searchInput.value.toLowerCase();
  const rows = document.querySelectorAll("#contacts-table-body tr");

  rows.forEach(function (row) {
    const name = row.querySelector("td:first-child").textContent.toLowerCase();
    row.style.display = name.includes(term) ? "" : "none";
  });
});

const logoutButton = document.querySelector("#logout-button");

logoutButton.addEventListener("click", function () {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "../pages/login.html";
});
