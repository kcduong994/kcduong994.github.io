const root = document.documentElement;
const toggle = document.getElementById("themeToggle");
const icon = document.getElementById("themeIcon");

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", prefersDark ? "dark" : "light");
}

function updateIcon() {
  const theme = root.getAttribute("data-theme");
  icon.textContent = theme === "dark" ? "☀️" : "🌙";
}

updateIcon();

toggle.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme");
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  root.setAttribute("data-theme", nextTheme);
  localStorage.setItem("theme", nextTheme);

  updateIcon();
});