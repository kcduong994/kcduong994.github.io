(function () {
"use strict";

var canvas = document.getElementById("environmentCanvas");

if (!canvas) {
return;
}

var ctx = canvas.getContext("2d");

if (!ctx) {
return;
}

var backgroundCanvas =
document.createElement("canvas");

var backgroundCtx =
backgroundCanvas.getContext("2d");

if (!backgroundCtx) {
return;
}

var buttons = Array.prototype.slice.call(
document.querySelectorAll("[data-environment-layer]")
);

var coordinates =
document.getElementById("environmentCoordinates");

var panelTitle =
document.querySelector(".environment-panel-header h2");

var panelStatus =
document.querySelector(".environment-status");

var legendBar =
document.querySelector(".environment-legend-bar");

var reducedMotion =
window.matchMedia("(prefers-reduced-motion: reduce)");

var layers = {
wind: {
title: "Regional wind-flow prototype",
status: "Synthetic wind field",
legend:
"linear-gradient(90deg,#1d4ed8,#0ea5e9,#22c55e,#facc15,#f97316)"
},

temperature: {
  title: "Regional temperature prototype",
  status: "Synthetic temperature field",
  legend:
    "linear-gradient(90deg,#1e3a8a,#2563eb,#22c55e,#facc15,#ef4444)"
},

waves: {
  title: "Regional wave-field prototype",
  status: "Synthetic wave field",
  legend:
    "linear-gradient(90deg,#172554,#1d4ed8,#06b6d4,#dbeafe)"
},

salinity: {
  title: "Regional salinity prototype",
  status: "Synthetic salinity field",
  legend:
    "linear-gradient(90deg,#312e81,#2563eb,#06b6d4,#10b981,#facc15)"
}

};

var land = [
[
[75, 58],
[95, 60],
[118, 56],
[138, 49],
[145, 42],
[137, 34],
[124, 27],
[114, 21],
[108, 14],
[101, 6],
[93, 11],
[84, 25],
[78, 40]
],

[
  [126, 39],
  [129, 41],
  [130, 39],
  [129, 36],
  [127, 34],
  [126, 36]
],

[
  [129, 31],
  [133, 34],
  [137, 36],
  [141, 42],
  [140, 45],
  [137, 39],
  [134, 35],
  [131, 33]
],

[
  [120, 22],
  [122, 25],
  [121, 26],
  [120, 24]
],

[
  [118, 19],
  [120, 18],
  [120, 16],
  [119, 15],
  [118, 17]
],

[
  [122, 14],
  [124, 15],
  [125, 13],
  [124, 11],
  [122, 12]
],

[
  [109, 7],
  [113, 7],
  [117, 5],
  [118, 2],
  [115, 1],
  [111, 2]
],

[
  [96, 5],
  [100, 3],
  [104, 0],
  [104, -4],
  [101, -5],
  [98, -2]
]

];

var state = {
width: 1,
height: 1,
dpr: 1,

cx: 0,
cy: 0,
radius: 1,

zoom: 1,
rotationLon: 110,
tiltLat: 18,

activeLayer: "wind",

dragging: false,
startX: 0,
startY: 0,
startLon: 110,
startTilt: 18,

lastTime: 0,
frameId: 0,
pageVisible: !document.hidden,
canvasVisible: true,
backgroundDirty: true

};

var particles = [];

function clamp(value, minimum, maximum) {
return Math.max(
minimum,
Math.min(maximum, value)
);
}

function radians(value) {
return value * Math.PI / 180;
}

function project(longitude, latitude) {
var lambda =
radians(longitude - state.rotationLon);

var phi =
  radians(latitude);

var tilt =
  radians(state.tiltLat);

var x =
  Math.cos(phi) *
  Math.sin(lambda);

var y =
  Math.sin(phi) *
    Math.cos(tilt) -
  Math.cos(phi) *
    Math.cos(lambda) *
    Math.sin(tilt);

var z =
  Math.sin(phi) *
    Math.sin(tilt) +
  Math.cos(phi) *
    Math.cos(lambda) *
    Math.cos(tilt);

return {
  x:
    state.cx +
    state.radius * x,

  y:
    state.cy -
    state.radius * y,

  visible:
    z > 0
};

}

function fieldAt(longitude, latitude) {
var x =
radians(longitude);

var y =
  radians(latitude);

var u;
var v;
var scalar;

if (
  state.activeLayer ===
  "temperature"
) {
  scalar = clamp(
    0.55 +
      (22 - latitude) / 70 +
      0.12 * Math.sin(x * 3),
    0,
    1
  );

  u =
    0.18 +
    0.08 * Math.cos(y * 4);

  v =
    0.05 * Math.sin(x * 3);
} else if (
  state.activeLayer ===
  "waves"
) {
  scalar = clamp(
    0.5 +
      0.3 *
        Math.sin(
          x * 4 +
          y * 3
        ),
    0,
    1
  );

  u =
    0.3 +
    0.12 * Math.sin(y * 5);

  v =
    0.12 * Math.cos(x * 4);
} else if (
  state.activeLayer ===
  "salinity"
) {
  var plume =
    Math.exp(
      -(
        Math.pow(
          (longitude - 106.7) / 9,
          2
        ) +
        Math.pow(
          (latitude - 10) / 6,
          2
        )
      )
    );

  scalar = clamp(
    0.8 -
      0.55 * plume +
      0.08 * Math.sin(x * 3),
    0,
    1
  );

  u =
    0.16 +
    0.08 * Math.sin(y * 3);

  v =
    0.04 +
    0.1 * plume;
} else {
  var dx =
    longitude - 124;

  var dy =
    latitude - 20;

  var radius =
    Math.sqrt(
      dx * dx +
      dy * dy
    ) + 0.001;

  var swirl =
    Math.exp(
      -radius / 16
    );

  u =
    0.45 *
      Math.cos(y * 2) -
    (dy / radius) *
      swirl *
      1.1;

  v =
    0.25 *
      Math.sin(x * 2) +
    (dx / radius) *
      swirl *
      1.1;

  scalar = clamp(
    Math.sqrt(
      u * u +
      v * v
    ) / 1.2,
    0,
    1
  );
}

return {
  u: u,
  v: v,
  scalar: scalar
};

}

function colorFor(value, alpha) {
var hue =
215 -
value * 165;

if (
  state.activeLayer ===
  "temperature"
) {
  hue =
    225 -
    value * 225;
}

if (
  state.activeLayer ===
  "waves"
) {
  hue =
    220 -
    value * 45;
}

if (
  state.activeLayer ===
  "salinity"
) {
  hue =
    250 -
    value * 190;
}

return (
  "hsla(" +
  Math.round(hue) +
  ",82%,58%," +
  alpha +
  ")"
);

}

function resize() {
var rectangle =
canvas.getBoundingClientRect();

state.width =
  Math.max(
    1,
    Math.round(
      rectangle.width
    )
  );

state.height =
  Math.max(
    1,
    Math.round(
      rectangle.height
    )
  );

state.dpr =
  Math.min(
    window.devicePixelRatio || 1,
    2
  );

canvas.width =
  Math.round(
    state.width *
    state.dpr
  );

canvas.height =
  Math.round(
    state.height *
    state.dpr
  );

backgroundCanvas.width =
  canvas.width;

backgroundCanvas.height =
  canvas.height;

ctx.setTransform(
  state.dpr,
  0,
  0,
  state.dpr,
  0,
  0
);

backgroundCtx.setTransform(
  state.dpr,
  0,
  0,
  state.dpr,
  0,
  0
);

state.cx =
  state.width / 2;

state.cy =
  state.height / 2;

state.radius =
  Math.min(
    state.width,
    state.height
  ) *
  0.42 *
  state.zoom;

createParticles();
state.backgroundDirty = true;
requestRender();

}

function drawBase() {
var dark =
document.documentElement.getAttribute(
"data-theme"
) === "dark";

var gradient =
  ctx.createRadialGradient(
    state.cx -
      state.radius * 0.35,

    state.cy -
      state.radius * 0.35,

    state.radius * 0.08,

    state.cx,
    state.cy,
    state.radius
  );

gradient.addColorStop(
  0,
  dark
    ? "#1f4b68"
    : "#2a6b8d"
);

gradient.addColorStop(
  0.55,
  dark
    ? "#0b2e47"
    : "#0b4c6b"
);

gradient.addColorStop(
  1,
  dark
    ? "#041521"
    : "#06293b"
);

ctx.beginPath();

ctx.arc(
  state.cx,
  state.cy,
  state.radius,
  0,
  Math.PI * 2
);

ctx.fillStyle =
  gradient;

ctx.fill();

ctx.lineWidth =
  2;

ctx.strokeStyle =
  dark
    ? "rgba(121,192,255,0.36)"
    : "rgba(191,229,255,0.5)";

ctx.stroke();

}

function drawHeat() {
ctx.save();

ctx.beginPath();

ctx.arc(
  state.cx,
  state.cy,
  state.radius - 1,
  0,
  Math.PI * 2
);

ctx.clip();

ctx.globalCompositeOperation =
  "screen";

for (
  var latitude = -70;
  latitude <= 70;
  latitude += 7
) {
  for (
    var longitude = 60;
    longitude <= 170;
    longitude += 7
  ) {
    var point =
      project(
        longitude,
        latitude
      );

    if (!point.visible) {
      continue;
    }

    var field =
      fieldAt(
        longitude,
        latitude
      );

    ctx.beginPath();

    ctx.arc(
      point.x,
      point.y,
      8 +
        field.scalar * 14,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      colorFor(
        field.scalar,
        state.activeLayer === "wind"
          ? 0.05
          : 0.11
      );

    ctx.fill();
  }
}

ctx.restore();

}

function drawGrid() {
ctx.save();

ctx.lineWidth =
  0.8;

ctx.strokeStyle =
  "rgba(255,255,255,0.14)";

var latitude;
var longitude;
var point;
var started;

for (
  latitude = -60;
  latitude <= 60;
  latitude += 20
) {
  ctx.beginPath();

  started = false;

  for (
    longitude = -180;
    longitude <= 180;
    longitude += 4
  ) {
    point =
      project(
        longitude,
        latitude
      );

    if (point.visible) {
      if (!started) {
        ctx.moveTo(
          point.x,
          point.y
        );

        started = true;
      } else {
        ctx.lineTo(
          point.x,
          point.y
        );
      }
    } else {
      started = false;
    }
  }

  ctx.stroke();
}

for (
  longitude = -180;
  longitude < 180;
  longitude += 20
) {
  ctx.beginPath();

  started = false;

  for (
    latitude = -85;
    latitude <= 85;
    latitude += 4
  ) {
    point =
      project(
        longitude,
        latitude
      );

    if (point.visible) {
      if (!started) {
        ctx.moveTo(
          point.x,
          point.y
        );

        started = true;
      } else {
        ctx.lineTo(
          point.x,
          point.y
        );
      }
    } else {
      started = false;
    }
  }

  ctx.stroke();
}

ctx.restore();

}

function drawLand() {
var dark =
document.documentElement.getAttribute(
"data-theme"
) === "dark";

ctx.save();

ctx.lineJoin =
  "round";

land.forEach(
  function (polygon) {
    var started =
      false;

    ctx.beginPath();

    polygon.forEach(
      function (coordinate) {
        var point =
          project(
            coordinate[0],
            coordinate[1]
          );

        if (!point.visible) {
          return;
        }

        if (!started) {
          ctx.moveTo(
            point.x,
            point.y
          );

          started =
            true;
        } else {
          ctx.lineTo(
            point.x,
            point.y
          );
        }
      }
    );

    if (!started) {
      return;
    }

    ctx.closePath();

    ctx.fillStyle =
      dark
        ? "rgba(34,67,61,0.92)"
        : "rgba(48,96,76,0.88)";

    ctx.strokeStyle =
      dark
        ? "rgba(168,255,227,0.36)"
        : "rgba(220,255,241,0.6)";

    ctx.lineWidth =
      1.1;

    ctx.fill();
    ctx.stroke();
  }
);

ctx.restore();

}

function newParticle() {
return {
lon:
70 +
Math.random() * 100,

  lat:
    -20 +
    Math.random() * 80,

  age:
    Math.random() * 100,

  maxAge:
    70 +
    Math.random() * 90
};

}

function createParticles() {
var count =
clamp(
Math.round(
state.width *
state.height /
1800
),
120,
420
);

particles = [];

for (
  var index = 0;
  index < count;
  index += 1
) {
  particles.push(
    newParticle()
  );
}

}

function resetParticle(particle) {
var fresh =
newParticle();

particle.lon =
  fresh.lon;

particle.lat =
  fresh.lat;

particle.age =
  0;

particle.maxAge =
  fresh.maxAge;

}

function drawParticles(delta) {
ctx.save();

ctx.globalCompositeOperation =
  "lighter";

ctx.lineCap =
  "round";

particles.forEach(
  function (particle) {
    var previous =
      project(
        particle.lon,
        particle.lat
      );

    var field =
      fieldAt(
        particle.lon,
        particle.lat
      );

    var factor =
      clamp(
        delta / 16.67,
        0.4,
        2
      ) *
      (
        state.activeLayer === "waves"
          ? 0.45
          : 0.32
      );

    particle.lon +=
      field.u * factor;

    particle.lat +=
      field.v * factor;

    particle.age +=
      1;

    var next =
      project(
        particle.lon,
        particle.lat
      );

    if (
      !previous.visible ||
      !next.visible ||
      particle.age >
        particle.maxAge ||
      particle.lon < 50 ||
      particle.lon > 180 ||
      particle.lat < -50 ||
      particle.lat > 80
    ) {
      resetParticle(
        particle
      );

      return;
    }

    ctx.beginPath();

    ctx.moveTo(
      previous.x,
      previous.y
    );

    ctx.lineTo(
      next.x,
      next.y
    );

    ctx.strokeStyle =
      colorFor(
        field.scalar,
        0.35 +
          field.scalar * 0.55
      );

    ctx.lineWidth =
      0.7 +
      field.scalar * 1.2;

    ctx.stroke();
  }
);

ctx.restore();

}

function drawBackground() {
var foregroundCtx = ctx;

ctx = backgroundCtx;

ctx.clearRect(
  0,
  0,
  state.width,
  state.height
);

drawBase();
drawHeat();
drawGrid();
drawLand();

ctx = foregroundCtx;
state.backgroundDirty = false;
}

function drawScene(timestamp) {
state.frameId = 0;

var delta =
state.lastTime
? timestamp -
state.lastTime
: 16.67;

state.lastTime =
  timestamp;

ctx.clearRect(
  0,
  0,
  state.width,
  state.height
);

if (state.backgroundDirty) {
  drawBackground();
}

ctx.drawImage(
  backgroundCanvas,
  0,
  0,
  state.width,
  state.height
);

if (!reducedMotion.matches) {
  drawParticles(delta);
}

if (
  state.pageVisible &&
  state.canvasVisible &&
  !reducedMotion.matches
) {
  state.frameId =
    window.requestAnimationFrame(
      drawScene
    );
}

}

function requestRender() {
if (state.frameId !== 0) {
return;
}

state.frameId =
  window.requestAnimationFrame(
    drawScene
  );
}

function stopRendering() {
if (state.frameId !== 0) {
  window.cancelAnimationFrame(
    state.frameId
  );

  state.frameId = 0;
}

state.lastTime = 0;
}

function updateLayerInterface() {
var information =
layers[
state.activeLayer
];

buttons.forEach(
  function (button) {
    var active =
      button.getAttribute(
        "data-environment-layer"
      ) ===
      state.activeLayer;

    button.classList.toggle(
      "active",
      active
    );

    button.setAttribute(
      "aria-pressed",
      String(active)
    );
  }
);

if (panelTitle) {
  panelTitle.textContent =
    information.title;
}

if (panelStatus) {
  panelStatus.textContent =
    information.status;
}

if (legendBar) {
  legendBar.style.background =
    information.legend;
}

}

function setLayer(layer) {
if (!layers[layer]) {
return;
}

state.activeLayer =
  layer;

state.backgroundDirty = true;
updateLayerInterface();
createParticles();
requestRender();

}

function updateCoordinates(event) {
if (!coordinates) {
return;
}

var rectangle =
  canvas.getBoundingClientRect();

var normalizedX =
  (
    event.clientX -
    rectangle.left -
    state.cx
  ) /
  state.radius;

var normalizedY =
  -(
    event.clientY -
    rectangle.top -
    state.cy
  ) /
  state.radius;

var distance =
  normalizedX *
    normalizedX +
  normalizedY *
    normalizedY;

if (distance > 1) {
  coordinates.textContent =
    "Outside globe";

  return;
}

var normalizedZ =
  Math.sqrt(
    1 - distance
  );

var tilt =
  radians(
    state.tiltLat
  );

var sphereY =
  normalizedY *
    Math.cos(tilt) +
  normalizedZ *
    Math.sin(tilt);

var sphereZ =
  -normalizedY *
    Math.sin(tilt) +
  normalizedZ *
    Math.cos(tilt);

var latitude =
  Math.asin(
    clamp(
      sphereY,
      -1,
      1
    )
  ) *
  180 /
  Math.PI;

var longitude =
  state.rotationLon +
  Math.atan2(
    normalizedX,
    sphereZ
  ) *
  180 /
  Math.PI;

while (longitude > 180) {
  longitude -= 360;
}

while (longitude < -180) {
  longitude += 360;
}

coordinates.textContent =
  Math.abs(latitude).toFixed(1) +
  "\u00B0 " +
  (
    latitude >= 0
      ? "N"
      : "S"
  ) +
  " \u00B7 " +
  Math.abs(longitude).toFixed(1) +
  "\u00B0 " +
  (
    longitude >= 0
      ? "E"
      : "W"
  );

}

function pointerDown(event) {
state.dragging =
true;

state.startX =
  event.clientX;

state.startY =
  event.clientY;

state.startLon =
  state.rotationLon;

state.startTilt =
  state.tiltLat;

canvas.setPointerCapture(
  event.pointerId
);

}

function pointerMove(event) {
updateCoordinates(event);

if (!state.dragging) {
  return;
}

state.rotationLon =
  state.startLon -
  (
    event.clientX -
    state.startX
  ) *
  0.35;

state.tiltLat =
  clamp(
    state.startTilt +
      (
        event.clientY -
        state.startY
      ) *
      0.2,
    -55,
    55
  );

state.backgroundDirty = true;
requestRender();

}

function pointerUp(event) {
state.dragging =
false;

if (
  canvas.hasPointerCapture(
    event.pointerId
  )
) {
  canvas.releasePointerCapture(
    event.pointerId
  );
}

}

function handleWheel(event) {
event.preventDefault();

state.zoom =
  clamp(
    state.zoom *
      (
        event.deltaY < 0
          ? 1.08
          : 0.92
      ),
    0.78,
    1.45
  );

state.radius =
  Math.min(
    state.width,
    state.height
  ) *
  0.42 *
  state.zoom;

state.backgroundDirty = true;
requestRender();

}

function resetView() {
state.rotationLon =
110;

state.tiltLat =
  18;

state.zoom =
  1;

state.radius =
  Math.min(
    state.width,
    state.height
  ) *
  0.42;

state.backgroundDirty = true;
requestRender();

}

buttons.forEach(
function (button) {
button.addEventListener(
"click",
function () {
setLayer(
button.getAttribute(
"data-environment-layer"
)
);
}
);
}
);

canvas.addEventListener(
"pointerdown",
pointerDown
);

canvas.addEventListener(
"pointermove",
pointerMove
);

canvas.addEventListener(
"pointerup",
pointerUp
);

canvas.addEventListener(
"pointercancel",
pointerUp
);

canvas.addEventListener(
"wheel",
handleWheel,
{
passive: false
}
);

canvas.addEventListener(
"dblclick",
resetView
);

var resizeObserver =
new ResizeObserver(
resize
);

resizeObserver.observe(
canvas
);

updateLayerInterface();
resize();

requestRender();

var intersectionObserver = null;

if ("IntersectionObserver" in window) {
intersectionObserver =
  new IntersectionObserver(
    function (entries) {
      state.canvasVisible =
        entries[0].isIntersecting;

      if (state.canvasVisible) {
        requestRender();
      } else {
        stopRendering();
      }
    },
    {
      rootMargin: "120px 0px"
    }
  );

intersectionObserver.observe(canvas);
}

document.addEventListener(
"visibilitychange",
function () {
state.pageVisible = !document.hidden;

if (state.pageVisible) {
  requestRender();
} else {
  stopRendering();
}
}
);

if (
typeof reducedMotion.addEventListener ===
"function"
) {
reducedMotion.addEventListener(
  "change",
  function () {
    stopRendering();
    requestRender();
  }
);
}

var themeObserver =
new MutationObserver(
function () {
state.backgroundDirty = true;
requestRender();
}
);

themeObserver.observe(
document.documentElement,
{
attributes: true,
attributeFilter: ["data-theme"]
}
);

window.addEventListener(
"beforeunload",
function () {
window.cancelAnimationFrame(
state.frameId
);

  resizeObserver.disconnect();

  if (intersectionObserver) {
    intersectionObserver.disconnect();
  }

  themeObserver.disconnect();
}

);
})();
