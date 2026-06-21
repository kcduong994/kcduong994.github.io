/**
 * ==========================================================
 * Duong Kim Cuong Personal Website
 * File: theme.js
 * Version: v1.8.2
 *
 * Features:
 * - Light/Dark mode
 * - Theme persistence using localStorage
 * - Live world clocks
 * - Contact popup
 * - Footer typewriter quote
========================================================== */

/* ==================================================
   THEME TOGGLE
================================================== */

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

/* ==================================================
   WORLD CLOCKS
================================================== */

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
    ["clockVietnam", "Asia/Ho_Chi_Minh"],
    ["clockLondon", "Europe/London"],
    ["clockNewYork", "America/New_York"],
    ["clockSeoul", "Asia/Seoul"],
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

/* ==================================================
   CONTACT POPOVER
================================================== */

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

/* ==================================================
   FOOTER TYPEWRITER QUOTE
================================================== */

const quoteLine = document.getElementById("quoteLine");

const quotes = [
  "Forget what hurt you in the past. But never forget what it taught you.",
  "The greatest luck in life is not finding money or winning the lottery, but meeting someone who can help you reach a higher level.",
];

let quoteIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeQuote() {
  if (!quoteLine) return;

  const currentQuote = quotes[quoteIndex];

  charIndex += isDeleting ? -1 : 1;

  quoteLine.textContent = currentQuote.slice(0, charIndex);

  let speed = isDeleting ? 28 : 45;

  if (!isDeleting && charIndex === currentQuote.length) {
    speed = 2200;
    isDeleting = true;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    quoteIndex = (quoteIndex + 1) % quotes.length;
    speed = 500;
  }

  setTimeout(typeQuote, speed);
}

typeQuote();