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

function updateClock() {
  const clock = document.getElementById("clock");
  const date = document.getElementById("date");
  const timezone = document.getElementById("timezone");

  if (!clock || !date || !timezone) return;

  const now = new Date();

  const timeText = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);

  const dateText = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(now);

  clock.textContent = timeText;
  date.textContent = dateText;
  timezone.textContent = "Seoul, South Korea";
}

updateClock();
setInterval(updateClock, 1000);