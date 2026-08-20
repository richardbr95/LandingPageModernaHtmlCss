const themes = {
  blue: {
    "--bg-1": "#07111f",
    "--bg-2": "#11263f",
    "--bg-3": "#1a2c46",
    "--cyan": "#7ce8ff",
    "--blue": "#5ea3ff",
    "--violet": "#9a7cff",
  },
  green: {
    "--bg-1": "#0e0c0c",
    "--bg-2": "#145023",
    "--bg-3": "#163d22",
    "--cyan": "#5effa0",
    "--blue": "#294739",
    "--violet": "#a8ff78",
  },
  red: {
    "--bg-1": "#0a0a0a",
    "--bg-2": "#141414",
    "--bg-3": "#1c1c1c",
    "--cyan": "#ff4d4d",
    "--blue": "#e02020",
    "--violet": "#ff8080",
  },
};

function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;
  Object.keys(theme).forEach(function (variable) {
    document.documentElement.style.setProperty(variable, theme[variable]);
  });
  localStorage.setItem("admin-theme", themeName);
}

function loadSavedTheme() {
  const saved = localStorage.getItem("admin-theme");

  if (saved && themes[saved]) {
    applyTheme(saved);
  }
}

loadSavedTheme();

const pickerBtn = document.querySelector("#theme-picker-btn");
const popup = document.querySelector("#theme-popup");

if (pickerBtn && popup) {
  pickerBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    popup.classList.toggle("open");
  });

  document.addEventListener("click", function () {
    popup.classList.remove("open");
  });
}
