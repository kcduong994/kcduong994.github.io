(function () {
"use strict";

var root = document.documentElement;
var themeToggle = document.getElementById("themeToggle");
var themeIcon = document.getElementById("themeIcon");
var themeColorMeta = document.querySelector('meta[name="theme-color"]');
var systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

function getStoredTheme() {
try {
var value = window.localStorage.getItem("theme");


  if (value === "dark" || value === "light") {
    return value;
  }

  return null;
} catch (error) {
  return null;
}

}

function storeTheme(theme) {
try {
window.localStorage.setItem("theme", theme);
} catch (error) {
return;
}
}

function getSystemTheme() {
return systemThemeQuery.matches ? "dark" : "light";
}

function applyTheme(theme, saveTheme) {
var isDark = theme === "dark";
var label;

root.setAttribute("data-theme", theme);

if (themeIcon) {
  themeIcon.textContent = isDark ? "☀" : "☾";
}

if (themeToggle) {
  label = isDark
    ? "Switch to light theme"
    : "Switch to dark theme";

  themeToggle.setAttribute("aria-label", label);
  themeToggle.setAttribute("title", label);
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

if (themeColorMeta) {
  themeColorMeta.setAttribute(
    "content",
    isDark ? "#0d1117" : "#f6f8fa"
  );
}

if (saveTheme) {
  storeTheme(theme);
}

}

var storedTheme = getStoredTheme();
var followsSystemTheme = storedTheme === null;

applyTheme(storedTheme || getSystemTheme(), false);

if (themeToggle) {
themeToggle.addEventListener("click", function () {
var currentTheme =
root.getAttribute("data-theme") || "light";

  var nextTheme =
    currentTheme === "dark" ? "light" : "dark";

  followsSystemTheme = false;

  applyTheme(nextTheme, true);
});

}

function handleSystemThemeChange() {
if (followsSystemTheme) {
applyTheme(getSystemTheme(), false);
}
}

if (
typeof systemThemeQuery.addEventListener === "function"
) {
systemThemeQuery.addEventListener(
"change",
handleSystemThemeChange
);
} else if (
typeof systemThemeQuery.addListener === "function"
) {
systemThemeQuery.addListener(
handleSystemThemeChange
);
}

var worldClocks = [
[
"clockVietnam",
"Asia/Ho_Chi_Minh",
"Hanoi"
],
[
"clockLondon",
"Europe/London",
"London"
],
[
"clockNewYork",
"America/New_York",
"New York"
],
[
"clockSeoul",
"Asia/Seoul",
"Seoul"
],
[
"clockChina",
"Asia/Shanghai",
"Beijing"
]
];

function updateWorldClocks() {
var now = new Date();

worldClocks.forEach(function (clock) {
  var id = clock[0];
  var timeZone = clock[1];
  var city = clock[2];
  var element = document.getElementById(id);

  if (!element) {
    return;
  }

  var time = new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    }
  ).format(now);

  var date = new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: timeZone,
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(now);

  element.textContent = time;

  element.setAttribute(
    "datetime",
    now.toISOString()
  );

  element.setAttribute(
    "title",
    city + " - " + date
  );
});

}

updateWorldClocks();

var clockIntervalId = window.setInterval(
updateWorldClocks,
1000
);

var contactButton =
document.getElementById("contactButton");

var contactLinkButton =
document.getElementById("contactLinkButton");

var contactPopover =
document.getElementById("contactPopover");

var closeContactButton =
document.getElementById("closeContact");

var previouslyFocusedElement = null;

function isContactOpen() {
return Boolean(
contactPopover &&
contactPopover.classList.contains("open")
);
}

function openContactPopover() {
if (!contactPopover || isContactOpen()) {
return;
}

if (
  document.activeElement instanceof HTMLElement
) {
  previouslyFocusedElement =
    document.activeElement;
} else {
  previouslyFocusedElement = null;
}

contactPopover.classList.add("open");

contactPopover.setAttribute(
  "aria-hidden",
  "false"
);

document.body.classList.add("modal-open");

window.requestAnimationFrame(function () {
  if (closeContactButton) {
    closeContactButton.focus();
  }
});

}

function closeContactPopover() {
if (!contactPopover || !isContactOpen()) {
return;
}

contactPopover.classList.remove("open");

contactPopover.setAttribute(
  "aria-hidden",
  "true"
);

document.body.classList.remove("modal-open");

if (previouslyFocusedElement) {
  previouslyFocusedElement.focus();
}

previouslyFocusedElement = null;

}

function getFocusableDialogElements() {
var selector;
var elements;

if (!contactPopover) {
  return [];
}

selector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(",");

elements = Array.prototype.slice.call(
  contactPopover.querySelectorAll(selector)
);

return elements.filter(function (element) {
  return (
    element instanceof HTMLElement &&
    element.offsetParent !== null
  );
});

}

function trapDialogFocus(event) {
var focusableElements;
var firstElement;
var lastElement;

if (
  event.key !== "Tab" ||
  !isContactOpen()
) {
  return;
}

focusableElements =
  getFocusableDialogElements();

if (focusableElements.length === 0) {
  event.preventDefault();
  return;
}

firstElement = focusableElements[0];

lastElement =
  focusableElements[
    focusableElements.length - 1
  ];

if (
  event.shiftKey &&
  document.activeElement === firstElement
) {
  event.preventDefault();
  lastElement.focus();
} else if (
  !event.shiftKey &&
  document.activeElement === lastElement
) {
  event.preventDefault();
  firstElement.focus();
}

}

if (contactButton) {
contactButton.addEventListener(
"click",
openContactPopover
);
}

if (contactLinkButton) {
contactLinkButton.addEventListener(
"click",
openContactPopover
);
}

if (closeContactButton) {
closeContactButton.addEventListener(
"click",
closeContactPopover
);
}

if (contactPopover) {
contactPopover.addEventListener(
"click",
function (event) {
if (event.target === contactPopover) {
closeContactPopover();
}
}
);
}

document.addEventListener(
"keydown",
function (event) {
if (
event.key === "Escape" &&
isContactOpen()
) {
closeContactPopover();
return;
}

  trapDialogFocus(event);
}

);

var quoteLine =
document.getElementById("quoteLine");

var reducedMotionQuery =
window.matchMedia(
"(prefers-reduced-motion: reduce)"
);

var quotes = [
"Forget what hurt you in the past, but never forget what it taught you.",
"The greatest luck in life is meeting someone who helps you become a better version of yourself.",
"Learning, building, and becoming - one thoughtful step at a time."
];

var quoteIndex = 0;
var characterIndex = 0;
var deleting = false;
var quoteTimerId = null;

function stopTypewriter() {
if (quoteTimerId !== null) {
window.clearTimeout(quoteTimerId);
quoteTimerId = null;
}
}

function runTypewriter() {
var quote;
var delay;

if (
  !quoteLine ||
  reducedMotionQuery.matches
) {
  return;
}

quote = quotes[quoteIndex];
delay = deleting ? 24 : 46;

if (
  !deleting &&
  characterIndex < quote.length
) {
  characterIndex += 1;
} else if (
  !deleting &&
  characterIndex === quote.length
) {
  deleting = true;
  delay = 2800;
} else if (
  deleting &&
  characterIndex > 0
) {
  characterIndex -= 1;
} else {
  deleting = false;

  quoteIndex =
    (quoteIndex + 1) % quotes.length;

  delay = 650;
}

quoteLine.textContent =
  quote.slice(0, characterIndex);

quoteTimerId = window.setTimeout(
  runTypewriter,
  delay
);

}

function startTypewriter() {
if (!quoteLine) {
return;
}

stopTypewriter();

quoteIndex = 0;
characterIndex = 0;
deleting = false;

if (reducedMotionQuery.matches) {
  quoteLine.textContent = quotes[0];
  return;
}

quoteLine.textContent = "";

quoteTimerId = window.setTimeout(
  runTypewriter,
  450
);

}

function handleMotionPreferenceChange() {
startTypewriter();
}

if (
typeof reducedMotionQuery.addEventListener ===
"function"
) {
reducedMotionQuery.addEventListener(
"change",
handleMotionPreferenceChange
);
} else if (
typeof reducedMotionQuery.addListener ===
"function"
) {
reducedMotionQuery.addListener(
handleMotionPreferenceChange
);
}

document.addEventListener(
"visibilitychange",
function () {
if (document.hidden) {
stopTypewriter();
} else if (
!reducedMotionQuery.matches &&
quoteTimerId === null
) {
quoteTimerId = window.setTimeout(
runTypewriter,
250
);
}
}
);

startTypewriter();

window.addEventListener(
"beforeunload",
function () {
window.clearInterval(clockIntervalId);
stopTypewriter();
}
);
})();
