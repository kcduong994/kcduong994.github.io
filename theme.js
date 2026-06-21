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

function formatTime(timeZone) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

function updateWorldClocks() {
  const clocks = [
    ["clockSeoul", "Asia/Seoul"],
    ["clockVietnam", "Asia/Ho_Chi_Minh"],
    ["clockLondon", "Europe/London"],
    ["clockChina", "Asia/Shanghai"],
  ];

  clocks.forEach(([id, timeZone]) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = formatTime(timeZone);
    }
  });
}

updateWorldClocks();
setInterval(updateWorldClocks, 1000);

const contactButton = document.getElementById("contactButton");
const contactLinkButton = document.getElementById("contactLinkButton");
const contactPopover = document.getElementById("contactPopover");
const closeContact = document.getElementById("closeContact");

function openContactPopover() {
  contactPopover.classList.add("open");
}

function closeContactPopover() {
  contactPopover.classList.remove("open");
}

if (contactPopover && closeContact) {
  if (contactButton) {
    contactButton.addEventListener("click", openContactPopover);
  }

  if (contactLinkButton) {
    contactLinkButton.addEventListener("click", openContactPopover);
  }

  closeContact.addEventListener("click", closeContactPopover);

  contactPopover.addEventListener("click", (event) => {
    if (event.target === contactPopover) {
      closeContactPopover();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeContactPopover();
    }
  });
}