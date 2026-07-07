(() => {
  "use strict";

  const TWO_PI = Math.PI * 2;
  const DEG = Math.PI / 180;
  const EARTH_OBLIQUITY = 23.44 * DEG;

  const LAYER_ALIASES = {
    wind: "wind",
    temperature: "temperature",
    temp: "temperature",
    waves: "tides",
    wave: "tides",
    tide: "tides",
    tides: "tides",
    salinity: "salinity",
    salt: "salinity",
  };

  const LAYER_LABELS = {
    wind: "Wind",
    temperature: "Temperature",
    tides: "Tides & Waves",
    salinity: "Salinity",
  };

  const LAYER_DESCRIPTIONS = {
    wind: "Atmospheric flow field over a rotating ocean planet.",
    temperature: "Latitudinal sea-surface temperature gradient with polar cooling.",
    tides: "Moon-driven tide bulges with animated coastal and open-ocean wave crests.",
    salinity: "Ocean salinity structure with major river-plume signatures.",
  };

  const SOLAR_SYSTEM = [
    { name: "Sun", radius: 18, colorA: "#fde68a", colorB: "#f97316", order: 0 },
    { name: "Mercury", radius: 3.6, colorA: "#e5e7eb", colorB: "#64748b", order: 1 },
    { name: "Venus", radius: 5.2, colorA: "#fed7aa", colorB: "#c2410c", order: 2 },
    { name: "Earth", radius: 5.6, colorA: "#67e8f9", colorB: "#2563eb", order: 3 },
    { name: "Mars", radius: 4.6, colorA: "#fecaca", colorB: "#b91c1c", order: 4 },
    { name: "Jupiter", radius: 10.5, colorA: "#fde68a", colorB: "#92400e", order: 5 },
    { name: "Saturn", radius: 9.2, colorA: "#fef3c7", colorB: "#a16207", order: 6, ring: true },
    { name: "Uranus", radius: 7.2, colorA: "#bae6fd", colorB: "#0891b2", order: 7 },
    { name: "Neptune", radius: 7.0, colorA: "#93c5fd", colorB: "#1d4ed8", order: 8 },
  ];

  const CONTINENTS = [
    {
      name: "North America",
      group: "temperate",
      paths: [
        [
          [-168, 70], [-150, 72], [-135, 70], [-122, 60], [-128, 51],
          [-123, 43], [-117, 33], [-105, 25], [-96, 21], [-88, 18],
          [-83, 25], [-79, 31], [-75, 38], [-67, 45], [-60, 51],
          [-54, 58], [-58, 66], [-73, 70], [-95, 74], [-125, 73],
          [-150, 70], [-168, 70],
        ],
        [
          [-170, 62], [-158, 66], [-146, 63], [-138, 58], [-148, 54],
          [-160, 55], [-170, 62],
        ],
        [
          [-96, 21], [-88, 18], [-83, 15], [-80, 9], [-83, 8],
          [-88, 12], [-92, 15], [-96, 21],
        ],
      ],
    },
    {
      name: "Greenland",
      group: "ice",
      paths: [
        [
          [-52, 83], [-35, 80], [-24, 73], [-30, 64], [-43, 59],
          [-55, 61], [-63, 68], [-63, 76], [-52, 83],
        ],
      ],
    },
    {
      name: "South America",
      group: "tropical",
      paths: [
        [
          [-81, 12], [-73, 11], [-64, 8], [-52, 2], [-44, -10],
          [-38, -20], [-44, -33], [-54, -45], [-67, -55], [-73, -49],
          [-72, -35], [-76, -22], [-81, -8], [-81, 12],
        ],
      ],
    },
    {
      name: "Europe",
      group: "temperate",
      paths: [
        [
          [-11, 36], [-6, 43], [2, 49], [10, 55], [21, 60],
          [32, 58], [42, 51], [40, 43], [28, 39], [18, 41],
          [10, 37], [2, 36], [-5, 35], [-11, 36],
        ],
        [
          [-8, 50], [-2, 56], [2, 58], [2, 51], [-3, 50], [-8, 50],
        ],
        [
          [12, 57], [20, 67], [31, 70], [35, 64], [28, 58], [12, 57],
        ],
      ],
    },
    {
      name: "Africa",
      group: "arid",
      paths: [
        [
          [-17, 35], [-5, 37], [10, 34], [25, 32], [34, 28],
          [43, 12], [51, 5], [44, -12], [36, -26], [28, -34],
          [18, -35], [8, -29], [-2, -18], [-11, 0], [-17, 15],
          [-17, 35],
        ],
      ],
    },
    {
      name: "Asia",
      group: "mixed",
      paths: [
        [
          [32, 58], [45, 62], [65, 65], [90, 69], [120, 65],
          [145, 58], [160, 50], [150, 40], [135, 35], [121, 23],
          [109, 18], [101, 6], [95, 15], [86, 20], [78, 8],
          [72, 18], [62, 25], [50, 28], [42, 36], [32, 42],
          [32, 58],
        ],
        [
          [72, 18], [78, 8], [82, 7], [88, 21], [80, 28], [72, 18],
        ],
        [
          [100, 6], [106, 0], [116, -5], [122, 1], [118, 12],
          [109, 18], [100, 6],
        ],
        [
          [138, 45], [144, 39], [141, 34], [135, 34], [132, 39],
          [138, 45],
        ],
      ],
    },
    {
      name: "Arabia",
      group: "arid",
      paths: [
        [
          [35, 30], [47, 30], [56, 23], [55, 14], [48, 12],
          [43, 16], [38, 22], [35, 30],
        ],
      ],
    },
    {
      name: "Australia",
      group: "dry",
      paths: [
        [
          [112, -11], [129, -10], [145, -17], [153, -28], [146, -39],
          [132, -43], [117, -35], [112, -22], [112, -11],
        ],
      ],
    },
    {
      name: "Antarctica",
      group: "ice",
      paths: [
        [
          [-180, -63], [-140, -67], [-100, -70], [-60, -66], [-20, -72],
          [20, -68], [60, -71], [100, -66], [140, -70], [180, -64],
          [180, -90], [-180, -90], [-180, -63],
        ],
      ],
    },
    {
      name: "Madagascar",
      group: "tropical",
      paths: [
        [[47, -12], [50, -16], [50, -24], [46, -26], [43, -20], [47, -12]],
      ],
    },
    {
      name: "New Zealand",
      group: "temperate",
      paths: [
        [[166, -35], [174, -36], [178, -43], [171, -46], [166, -35]],
      ],
    },
    {
      name: "Indonesia",
      group: "tropical",
      paths: [
        [
          [96, 5], [106, 2], [116, -3], [126, -4], [134, -2],
          [129, -8], [113, -8], [101, -3], [96, 5],
        ],
      ],
    },
  ];

  const RIVER_PLUMES = [
    { name: "Amazon", lon: -50, lat: 0, spread: 13, strength: 0.95 },
    { name: "Mississippi", lon: -90, lat: 29, spread: 8, strength: 0.65 },
    { name: "Mekong", lon: 106, lat: 9, spread: 7, strength: 0.75 },
    { name: "Ganges-Brahmaputra", lon: 90, lat: 22, spread: 9, strength: 0.85 },
    { name: "Nile", lon: 31, lat: 31, spread: 6, strength: 0.55 },
    { name: "Yangtze", lon: 122, lat: 31, spread: 7, strength: 0.6 },
    { name: "Congo", lon: 12, lat: -6, spread: 8, strength: 0.7 },
  ];

  const COASTAL_FOCUS = [
    { name: "Wadden Sea", lon: 5.3, lat: 53.2 },
    { name: "Mekong Delta", lon: 106.7, lat: 9.2 },
    { name: "Ganges Delta", lon: 90.4, lat: 22.1 },
    { name: "Mississippi Delta", lon: -89.2, lat: 29.1 },
    { name: "Amazon Mouth", lon: -50.2, lat: 0.2 },
    { name: "Nile Delta", lon: 31.2, lat: 31.3 },
    { name: "Pearl River", lon: 113.5, lat: 22.2 },
    { name: "Rhine-Meuse", lon: 4.1, lat: 51.9 },
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function wrapLon(lon) {
    let value = lon;
    while (value < -180) value += 360;
    while (value > 180) value -= 360;
    return value;
  }

  function normalizeLayerName(value) {
    if (!value) return "wind";
    const key = String(value).trim().toLowerCase();
    return LAYER_ALIASES[key] || "wind";
  }

  function randomFromSeed(seed) {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function latLonToVector(lon, lat) {
    const lambda = lon * DEG;
    const phi = lat * DEG;
    const cosPhi = Math.cos(phi);

    return {
      x: cosPhi * Math.sin(lambda),
      y: Math.sin(phi),
      z: cosPhi * Math.cos(lambda),
    };
  }

  function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function findCanvas() {
    const selectors = [
      "#environment-map",
      "#environmentMap",
      "#environment-canvas",
      "#environmentCanvas",
      "canvas[data-environment-map]",
      ".environment-map canvas",
      ".environment-visual canvas",
      ".hero-visual canvas",
      ".hero-map canvas",
      "canvas",
    ];

    for (let i = 0; i < selectors.length; i += 1) {
      const element = document.querySelector(selectors[i]);
      if (element && element instanceof HTMLCanvasElement) {
        return element;
      }
    }

    return null;
  }

  function getThemeMode() {
    const root = document.documentElement;
    const body = document.body;
    const rootTheme = root.getAttribute("data-theme");
    const bodyTheme = body.getAttribute("data-theme");

    if (rootTheme === "dark" || bodyTheme === "dark") return "dark";
    if (root.classList.contains("dark") || body.classList.contains("dark")) return "dark";

    return "light";
  }

  function createStarField(count) {
    const stars = [];

    for (let i = 0; i < count; i += 1) {
      const r1 = randomFromSeed(i + 12);
      const r2 = randomFromSeed(i + 41);
      const r3 = randomFromSeed(i + 91);
      const r4 = randomFromSeed(i + 173);

      stars.push({
        x: r1,
        y: r2,
        radius: 0.35 + r3 * 1.45,
        alpha: 0.18 + r4 * 0.62,
        twinkle: 0.6 + randomFromSeed(i + 231) * 1.4,
      });
    }

    return stars;
  }

  function createOceanSamples() {
    const samples = [];
    let index = 0;

    for (let lat = -62; lat <= 72; lat += 4) {
      for (let lon = -180; lon <= 180; lon += 4) {
        const jitterLon = (randomFromSeed(index + 7) - 0.5) * 1.6;
        const jitterLat = (randomFromSeed(index + 17) - 0.5) * 1.2;

        samples.push({
          lon: wrapLon(lon + jitterLon),
          lat: clamp(lat + jitterLat, -84, 84),
          seed: index,
        });

        index += 1;
      }
    }

    return samples;
  }

  function createWindSamples() {
    const samples = [];
    let index = 0;

    for (let lat = -60; lat <= 65; lat += 9) {
      for (let lon = -180; lon < 180; lon += 10) {
        samples.push({
          lon: lon + (randomFromSeed(index + 31) - 0.5) * 4,
          lat: lat + (randomFromSeed(index + 63) - 0.5) * 4,
          seed: index,
        });
        index += 1;
      }
    }

    return samples;
  }

  function createOpenOceanWaveCrests() {
    const crests = [];
    let index = 0;

    for (let band = -55; band <= 55; band += 11) {
      for (let lon = -180; lon < 180; lon += 18) {
        crests.push({
          lon,
          lat: band + (randomFromSeed(index + 87) - 0.5) * 4.5,
          length: 5 + randomFromSeed(index + 120) * 8,
          phase: randomFromSeed(index + 230) * TWO_PI,
          seed: index,
        });

        index += 1;
      }
    }

    return crests;
  }

  function createCoastalWaveSamples() {
    const samples = [];

    for (let i = 0; i < COASTAL_FOCUS.length; i += 1) {
      const focus = COASTAL_FOCUS[i];

      for (let j = 0; j < 26; j += 1) {
        const angle = (j / 26) * TWO_PI;
        const radius = 1.2 + randomFromSeed(i * 40 + j) * 3.6;

        samples.push({
          lon: wrapLon(focus.lon + Math.cos(angle) * radius),
          lat: clamp(focus.lat + Math.sin(angle) * radius * 0.65, -82, 82),
          seed: i * 100 + j,
          label: focus.name,
        });
      }
    }

    return samples;
  }

  class EarthSystemRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: true });

      this.width = 0;
      this.height = 0;
      this.dpr = 1;

      this.state = {
        activeLayer: "wind",
        rotationLon: -20,
        pitch: -8,
        zoom: 1,
        targetZoom: 1,
        isDragging: false,
        lastPointerX: 0,
        lastPointerY: 0,
        userInteractedAt: 0,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        theme: getThemeMode(),
        pointerCoord: { lat: 20, lon: 110 },
      };

      this.starField = createStarField(220);
      this.oceanSamples = createOceanSamples();
      this.windSamples = createWindSamples();
      this.openOceanWaveCrests = createOpenOceanWaveCrests();
      this.coastalWaveSamples = createCoastalWaveSamples();

      this.startTime = performance.now();
      this.lastFrameTime = this.startTime;
      this.animationFrame = 0;

      this.resizeObserver = null;
      this.boundRender = this.render.bind(this);
      this.boundResize = this.resize.bind(this);
      this.boundPointerDown = this.handlePointerDown.bind(this);
      this.boundPointerMove = this.handlePointerMove.bind(this);
      this.boundPointerUp = this.handlePointerUp.bind(this);
      this.boundWheel = this.handleWheel.bind(this);
      this.boundPointerHover = this.handlePointerHover.bind(this);
      this.boundDocumentLayerEvent = this.handleDocumentLayerEvent.bind(this);

      this.init();
    }

    init() {
      if (!this.ctx) return;

      this.canvas.style.display = "block";
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
      this.canvas.style.touchAction = "none";
      this.canvas.setAttribute(
        "aria-label",
        "Interactive 2.5D Earth system visualization with axial tilt, moon-driven tides, waves, wind, temperature, salinity, and ordered solar-system background."
      );

      this.attachCanvasEvents();
      this.attachLayerButtons();
      this.hideExternalCoordinateReadout();
      document.addEventListener("click", this.boundDocumentLayerEvent, true);
      document.addEventListener("pointerdown", this.boundDocumentLayerEvent, true);
      window.setTimeout(() => {
        this.attachLayerButtons();
        this.hideExternalCoordinateReadout();
      }, 250);
      window.setTimeout(() => {
        this.attachLayerButtons();
        this.hideExternalCoordinateReadout();
      }, 900);
      window.setTimeout(() => this.hideExternalCoordinateReadout(), 1800);

      this.resize();

      if ("ResizeObserver" in window && this.canvas.parentElement) {
        this.resizeObserver = new ResizeObserver(this.boundResize);
        this.resizeObserver.observe(this.canvas.parentElement);
      } else {
        window.addEventListener("resize", this.boundResize);
      }

      this.animationFrame = window.requestAnimationFrame(this.boundRender);
    }

    attachCanvasEvents() {
      this.canvas.addEventListener("pointerdown", this.boundPointerDown);
      window.addEventListener("pointermove", this.boundPointerMove);
      window.addEventListener("pointerup", this.boundPointerUp);
      this.canvas.addEventListener("wheel", this.boundWheel, { passive: false });
      this.canvas.addEventListener("pointermove", this.boundPointerHover);
      this.canvas.addEventListener("mousemove", this.boundPointerHover);
    }

    attachLayerButtons() {
      const selectors = [
        "[data-layer]",
        "[data-map-layer]",
        ".layer-button",
        ".map-layer",
        ".environment-layer button",
        ".environment-controls button",
        ".environment-control button",
        ".hero-visual button",
        ".hero-map button",
      ];

      let candidates = Array.prototype.slice.call(document.querySelectorAll(selectors.join(",")));

      /*
        Fallback: inspect buttons only inside the visual parent, not all buttons
        on the entire page. This avoids binding nav/theme buttons.
      */
      if (this.canvas.parentElement) {
        const localButtons = Array.prototype.slice.call(
          this.canvas.parentElement.querySelectorAll("button, [role='button'], div, span")
        );
        candidates = candidates.concat(localButtons);
      }

      const unique = Array.from(new Set(candidates));
      const buttons = [];

      for (let i = 0; i < unique.length; i += 1) {
        const button = unique[i];

        if (!(button instanceof HTMLElement)) continue;

        const layer = this.layerFromElement(button);

        if (!layer) continue;

        button.setAttribute("data-layer", layer);

        if (button.tagName === "BUTTON") {
          button.setAttribute("type", button.getAttribute("type") || "button");
        }

        button.style.cursor = "pointer";
        button.style.pointerEvents = "auto";

        if (button.dataset.knEarthLayerBound !== "true") {
          const activate = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.setActiveLayer(layer);
          };

          button.addEventListener("click", activate);
          button.addEventListener("pointerdown", activate);
          button.dataset.knEarthLayerBound = "true";
        }

        buttons.push(button);
      }

      this.layerButtons = buttons;
      this.updateLayerButtons();
    }

    layerFromText(value) {
      if (!value) return "";

      const raw = String(value).trim().toLowerCase();

      if (raw === "wind") return "wind";
      if (raw === "temperature" || raw === "temp") return "temperature";
      if (raw === "waves" || raw === "wave" || raw === "tides" || raw === "tide") return "tides";
      if (raw === "salinity" || raw === "salt" || raw === "sali") return "salinity";

      /*
        Only match short labels. Do not match a parent container whose text is
        "Wind Temperature Waves Salinity", otherwise every click can resolve as Wind.
      */
      if (raw.length <= 28) {
        if (raw.includes("temperature") || raw.includes("temp")) return "temperature";
        if (raw.includes("salinity") || raw.includes("salt") || raw.includes("sali")) return "salinity";
        if (raw.includes("waves") || raw.includes("wave") || raw.includes("tides") || raw.includes("tide")) return "tides";
        if (raw.includes("wind")) return "wind";
      }

      return "";
    }

    layerFromElement(element) {
      if (!(element instanceof Element)) return "";

      const direct = element instanceof HTMLElement ? element : null;

      if (direct) {
        const layer =
          this.layerFromText(direct.getAttribute("data-layer")) ||
          this.layerFromText(direct.getAttribute("data-map-layer")) ||
          this.layerFromText(direct.getAttribute("aria-label")) ||
          this.layerFromText(direct.textContent);

        if (layer) return layer;
      }

      const closest = element.closest("[data-layer], [data-map-layer], button, [role='button'], .layer-button, .map-layer");

      if (closest instanceof HTMLElement) {
        return (
          this.layerFromText(closest.getAttribute("data-layer")) ||
          this.layerFromText(closest.getAttribute("data-map-layer")) ||
          this.layerFromText(closest.getAttribute("aria-label")) ||
          this.layerFromText(closest.textContent)
        );
      }

      return "";
    }

    handleDocumentLayerEvent(event) {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const inVisual = this.canvas.parentElement && this.canvas.parentElement.contains(target);
      const layer = this.layerFromElement(target) || this.layerFromCanvasPoint(event.clientX, event.clientY);

      if (!layer) return;

      /*
        Only consume the event when it is in/near the visual area or exactly on
        a layer-labeled element.
      */
      if (!inVisual && !this.layerFromElement(target)) return;

      event.preventDefault();
      event.stopPropagation();
      this.setActiveLayer(layer);
    }

    layerFromCanvasPoint(clientX, clientY) {
      if (!this.canvas || typeof clientX !== "number" || typeof clientY !== "number") return "";

      const rect = this.canvas.getBoundingClientRect();

      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
        return "";
      }

      const x = ((clientX - rect.left) / rect.width) * this.width;
      const y = ((clientY - rect.top) / rect.height) * this.height;

      /*
        Fallback hit-zone for the existing right-side layer panel.
        This is intentionally generous because the panel is HTML above/near canvas.
      */
      const layers = ["wind", "temperature", "tides", "salinity"];
      const panelWidth = 126;
      const panelX = this.width - panelWidth - 14;
      const panelY = 26;
      const buttonHeight = 44;
      const gap = 6;

      for (let i = 0; i < layers.length; i += 1) {
        const by = panelY + i * (buttonHeight + gap);

        if (x >= panelX && x <= panelX + panelWidth && y >= by && y <= by + buttonHeight) {
          return layers[i];
        }
      }

      return "";
    }

    setActiveLayer(layer) {
      const nextLayer = normalizeLayerName(layer);

      if (!LAYER_LABELS[nextLayer]) return;

      this.state.activeLayer = nextLayer;
      this.state.userInteractedAt = performance.now();

      /*
        Keep the Earth/Moon view stable. Layer clicks should not make the camera
        jump around.
      */
      this.state.targetZoom = 1;

      this.updateLayerButtons();
      this.updateExternalStatus();
    }

    updateLayerButtons() {
      if (!this.layerButtons) return;

      for (let i = 0; i < this.layerButtons.length; i += 1) {
        const button = this.layerButtons[i];
        const layer = normalizeLayerName(button.getAttribute("data-layer"));
        const isActive = layer === this.state.activeLayer;

        button.classList.toggle("active", isActive);
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");

        if (isActive && button.textContent && button.textContent.trim().length <= 24) {
          button.style.background = "linear-gradient(180deg, rgba(37,99,235,0.94), rgba(29,78,216,0.94))";
          button.style.borderColor = "rgba(191,219,254,0.72)";
          button.style.color = "rgba(248,250,252,0.98)";
        } else if (button.textContent && button.textContent.trim().length <= 24) {
          button.style.background = "";
          button.style.borderColor = "";
          button.style.color = "";
        }
      }
    }

    updateExternalStatus() {
      const status = document.querySelector(
        "[data-environment-status], .environment-status, .map-status, .simulation-status"
      );

      if (!status) return;

      const shortBadges = {
        wind: "WIND FIELD",
        temperature: "TEMP FIELD",
        tides: "WAVE FIELD",
        salinity: "SALT FIELD",
      };

      status.textContent = shortBadges[this.state.activeLayer] || "SIMULATED FIELD";

      if (status instanceof HTMLElement) {
        status.style.whiteSpace = "nowrap";
        status.style.overflow = "hidden";
        status.style.textOverflow = "ellipsis";
        status.style.maxWidth = "150px";
      }
    }

    resize() {
      const parent = this.canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : this.canvas.getBoundingClientRect();

      const fallbackWidth = 720;
      const fallbackHeight = 620;

      this.width = Math.max(320, rect.width || fallbackWidth);
      this.height = Math.max(420, rect.height || fallbackHeight);

      this.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;

      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    handlePointerHover(event) {
      const coord = this.screenToLatLon(event.clientX, event.clientY);

      if (!coord) return;

      this.state.pointerCoord = coord;
      this.updateExternalCoordinateReadout(coord);
    }

    screenToLatLon(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();

      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return null;
      }

      const layout = this.getLayout();
      const x = ((clientX - rect.left) / rect.width) * this.width;
      const y = ((clientY - rect.top) / rect.height) * this.height;
      const sx = (x - layout.centerX) / layout.radius;
      const sy = (layout.centerY - y) / layout.radius;
      const r2 = sx * sx + sy * sy;

      if (r2 > 1) return null;

      const cosTilt = Math.cos(EARTH_OBLIQUITY);
      const sinTilt = Math.sin(EARTH_OBLIQUITY);

      /*
        Invert screen obliquity rotation:
        screenX = sphereX*cos - sphereY*sin
        screenY = sphereX*sin + sphereY*cos
      */
      const sphereX = sx * cosTilt + sy * sinTilt;
      const sphereYProjected = -sx * sinTilt + sy * cosTilt;
      const sphereZProjected = Math.sqrt(Math.max(0, 1 - sphereX * sphereX - sphereYProjected * sphereYProjected));

      const pitch = this.state.pitch * DEG;
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);

      /*
        Invert pitch rotation.
      */
      const sphereY = sphereYProjected * cosPitch + sphereZProjected * sinPitch;
      const sphereZ = -sphereYProjected * sinPitch + sphereZProjected * cosPitch;

      const lat = Math.asin(clamp(sphereY, -1, 1)) / DEG;
      const lon = wrapLon(Math.atan2(sphereX, sphereZ) / DEG - this.state.rotationLon);

      return { lat, lon };
    }

    formatCoordinate(coord) {
      const latDir = coord.lat >= 0 ? "N" : "S";
      const lonDir = coord.lon >= 0 ? "E" : "W";

      return `${Math.abs(coord.lat).toFixed(1)}° ${latDir} · ${Math.abs(coord.lon).toFixed(1)}° ${lonDir}`;
    }

    hideExternalCoordinateReadout() {
      /*
        v17: the old page coordinate pill is not useful here and was sitting on
        top of the visualization. Hide only elements that explicitly look like
        latitude/longitude readouts.
      */
      const selectors = [
        "[data-map-coordinates]",
        "[data-environment-coordinates]",
        ".map-coordinates",
        ".coordinates",
        ".coordinate",
        ".coord",
        ".hero-coordinates",
      ];

      const candidates = Array.prototype.slice.call(
        document.querySelectorAll(selectors.join(","))
      );

      if (this.canvas.parentElement) {
        candidates.push(
          ...Array.prototype.slice.call(
            this.canvas.parentElement.querySelectorAll("div, span, small, p")
          )
        );
      }

      const coordPattern = /\d+(\.\d+)?°\s*[NS]\s*[·,]\s*\d+(\.\d+)?°\s*[EW]/i;

      for (let i = 0; i < candidates.length; i += 1) {
        const element = candidates[i];

        if (!(element instanceof HTMLElement)) continue;

        const current = element.textContent || "";
        const hasCoordinateAttr =
          element.hasAttribute("data-map-coordinates") ||
          element.hasAttribute("data-environment-coordinates");

        if (hasCoordinateAttr || coordPattern.test(current)) {
          element.style.display = "none";
          element.setAttribute("aria-hidden", "true");
        }
      }
    }

    updateExternalCoordinateReadout(coord) {
      /*
        Disabled intentionally in v17.
        The old lon/lat pill looked static/non-functional and overlapped the
        lower UI, so we hide it instead of updating it.
      */
      this.hideExternalCoordinateReadout();
    }

    handlePointerDown(event) {
      const layer = this.layerFromCanvasPoint(event.clientX, event.clientY);

      if (layer) {
        event.preventDefault();
        this.setActiveLayer(layer);
        return;
      }

      this.state.isDragging = true;
      this.state.lastPointerX = event.clientX;
      this.state.lastPointerY = event.clientY;
      this.state.userInteractedAt = performance.now();

      try {
        this.canvas.setPointerCapture(event.pointerId);
      } catch (error) {
        // Pointer capture may fail in older browsers. Dragging still works through window events.
      }
    }

    handlePointerMove(event) {
      if (!this.state.isDragging) return;

      const dx = event.clientX - this.state.lastPointerX;
      const dy = event.clientY - this.state.lastPointerY;

      this.state.rotationLon = wrapLon(this.state.rotationLon + dx * 0.24);
      this.state.pitch = clamp(this.state.pitch + dy * 0.16, -42, 42);

      this.state.lastPointerX = event.clientX;
      this.state.lastPointerY = event.clientY;
      this.state.userInteractedAt = performance.now();
    }

    handlePointerUp() {
      this.state.isDragging = false;
    }

    handleWheel(event) {
      event.preventDefault();

      const direction = event.deltaY > 0 ? -1 : 1;
      const nextZoom = this.state.targetZoom + direction * 0.08;

      this.state.targetZoom = clamp(nextZoom, 0.82, 1.34);
      this.state.userInteractedAt = performance.now();
    }

    getLayout() {
      const rightReserve = Math.min(150, Math.max(112, this.width * 0.2));
      const topReserve = Math.min(112, Math.max(68, this.height * 0.14));
      const bottomReserve = Math.min(124, Math.max(96, this.height * 0.18));
      const safeLeft = 18;
      const safeRight = this.width - rightReserve;
      const safeTop = topReserve;
      const safeBottom = this.height - bottomReserve;
      const safeWidth = Math.max(260, safeRight - safeLeft);
      const safeHeight = Math.max(250, safeBottom - safeTop);

      const radius = Math.min(safeWidth * 0.28, safeHeight * 0.39, this.height * 0.265) * this.state.zoom;

      return {
        centerX: safeLeft + safeWidth * 0.58,
        centerY: safeTop + safeHeight * 0.52,
        radius,
        safeLeft,
        safeRight,
        safeTop,
        safeBottom,
        safeWidth,
        safeHeight,
      };
    }

    rotateScreenByObliquity(x, y) {
      const cosTilt = Math.cos(EARTH_OBLIQUITY);
      const sinTilt = Math.sin(EARTH_OBLIQUITY);

      return {
        x: x * cosTilt - y * sinTilt,
        y: x * sinTilt + y * cosTilt,
      };
    }

    project(lon, lat, altitude) {
      const layout = this.getLayout();
      const totalLon = wrapLon(lon + this.state.rotationLon);
      const vector = latLonToVector(totalLon, lat);

      const pitch = this.state.pitch * DEG;
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);

      const y = vector.y * cosPitch - vector.z * sinPitch;
      const z = vector.y * sinPitch + vector.z * cosPitch;
      const x = vector.x;

      const tilted = this.rotateScreenByObliquity(x, y);

      const distanceScale = 1 + (altitude || 0);
      const perspective = 0.91 + z * 0.11;
      const scale = layout.radius * distanceScale * perspective;

      return {
        x: layout.centerX + tilted.x * scale,
        y: layout.centerY - tilted.y * scale,
        z,
        visible: z > -0.05,
        front: z > 0,
        shade: clamp(0.3 + z * 0.7, 0, 1),
        unit: { x: vector.x, y: vector.y, z: vector.z },
      };
    }

    getMoonState(timeSeconds) {
      const angle = timeSeconds * 0.115 + 0.9;
      const orbitTilt = -0.36;
      const moonLon = wrapLon(angle / DEG - 45);
      const moonLat = Math.sin(angle * 0.74) * 5.1;

      return {
        angle,
        orbitTilt,
        lon: moonLon,
        lat: moonLat,
        unit: latLonToVector(moonLon, moonLat),
      };
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    render(now) {
      const ctx = this.ctx;
      if (!ctx) return;

      const elapsed = (now - this.startTime) / 1000;
      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastFrameTime) / 1000));
      this.lastFrameTime = now;

      this.state.theme = getThemeMode();
      this.state.zoom = lerp(this.state.zoom, this.state.targetZoom, 0.08);

      const idleTime = now - this.state.userInteractedAt;

      if (!this.state.reducedMotion && !this.state.isDragging && idleTime > 1800) {
        this.state.rotationLon = wrapLon(this.state.rotationLon + dt * 2.1);
      }

      this.clear();

      const moon = this.getMoonState(elapsed);
      const satellite = this.getSatelliteState(elapsed);

      this.drawSpaceBackground(elapsed);
      this.drawBackgroundOrrery(elapsed);
      this.drawScientificFrame(elapsed);

      this.drawBackOrbit(moon, satellite);
      this.drawBackMoonAndSatellite(moon, satellite, elapsed);

      this.drawEarth(elapsed, moon);

      this.drawFrontOrbit(moon, satellite);
      this.drawFrontMoonAndSatellite(moon, satellite, elapsed);

      this.drawOverlayPanel(elapsed, moon);

      this.animationFrame = window.requestAnimationFrame(this.boundRender);
    }

    drawSpaceBackground(elapsed) {
      const ctx = this.ctx;
      const dark = this.state.theme === "dark";

      const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
      gradient.addColorStop(0, dark ? "#020617" : "#cfeefa");
      gradient.addColorStop(0.45, dark ? "#062033" : "#e8f8fc");
      gradient.addColorStop(1, dark ? "#083d52" : "#d6f3f7");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.save();
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";

      for (let i = 0; i < this.starField.length; i += 1) {
        const star = this.starField[i];
        const twinkle = 0.72 + Math.sin(elapsed * star.twinkle + i) * 0.28;

        ctx.beginPath();
        ctx.fillStyle = dark
          ? `rgba(180, 228, 255, ${star.alpha * twinkle})`
          : `rgba(14, 92, 130, ${star.alpha * 0.14})`;
        ctx.arc(star.x * this.width, star.y * this.height, star.radius, 0, TWO_PI);
        ctx.fill();
      }

      ctx.restore();

      const glow = ctx.createRadialGradient(
        this.width * 0.66,
        this.height * 0.28,
        10,
        this.width * 0.66,
        this.height * 0.28,
        Math.max(this.width, this.height) * 0.7
      );

      glow.addColorStop(0, dark ? "rgba(56, 189, 248, 0.18)" : "rgba(37, 99, 235, 0.13)");
      glow.addColorStop(0.55, "rgba(20, 184, 166, 0.05)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    drawBackgroundOrrery(elapsed) {
      if (this.width < 540 || this.height < 420) return;

      const ctx = this.ctx;
      const dark = this.state.theme === "dark";
      const layout = this.getLayout();

      /*
        Decorative solar-system orrery.
        It is intentionally not boxed like a UI panel and does not need clicks.
      */
      const cx = clamp(layout.safeLeft + layout.safeWidth * 0.19, 86, this.width * 0.42);
      const cy = clamp(layout.safeTop - 10, 74, this.height * 0.31);
      const maxOrbit = Math.min(layout.radius * 0.9, this.width * 0.18, 118);

      ctx.save();
      ctx.globalCompositeOperation = dark ? "screen" : "source-over";

      const core = ctx.createRadialGradient(cx, cy, 4, cx, cy, maxOrbit * 1.42);
      core.addColorStop(0, dark ? "rgba(216, 180, 254, 0.22)" : "rgba(59, 130, 246, 0.12)");
      core.addColorStop(0.48, dark ? "rgba(125, 211, 252, 0.16)" : "rgba(14, 165, 233, 0.1)");
      core.addColorStop(1, "rgba(125, 211, 252, 0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.ellipse(cx, cy, maxOrbit * 1.36, maxOrbit * 0.56, -0.28, 0, TWO_PI);
      ctx.fill();

      this.drawOrrerySun(cx, cy);

      for (let i = 1; i < SOLAR_SYSTEM.length; i += 1) {
        const planet = SOLAR_SYSTEM[i];
        const t = i / (SOLAR_SYSTEM.length - 1);
        const orbitX = maxOrbit * (0.2 + t * 0.92);
        const orbitY = orbitX * 0.38;
        const angle = elapsed * (0.9 / (i * 0.55 + 0.8)) + i * 0.74;
        const x = cx + Math.cos(angle) * orbitX;
        const y = cy + Math.sin(angle) * orbitY;
        const front = Math.sin(angle) >= 0;

        ctx.save();
        ctx.strokeStyle = dark ? "rgba(125, 211, 252, 0.26)" : "rgba(2, 132, 199, 0.2)";
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.ellipse(cx, cy, orbitX, orbitY, 0, 0, TWO_PI);
        ctx.stroke();
        ctx.restore();

        this.drawOrreryPlanet(planet, x, y, front, i);
      }

      ctx.fillStyle = dark ? "rgba(226, 232, 240, 0.56)" : "rgba(15, 23, 42, 0.42)";
      ctx.font = "800 8px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Solar system", cx, cy + maxOrbit * 0.55);

      ctx.restore();
    }

    drawOrrerySun(x, y) {
      const ctx = this.ctx;
      const radius = 13;

      const glow = ctx.createRadialGradient(x, y, 2, x, y, radius * 3.2);
      glow.addColorStop(0, "rgba(254, 240, 138, 0.95)");
      glow.addColorStop(0.46, "rgba(251, 146, 60, 0.28)");
      glow.addColorStop(1, "rgba(251, 146, 60, 0)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius * 3.2, 0, TWO_PI);
      ctx.fill();

      const gradient = ctx.createRadialGradient(x - 4, y - 4, 1, x, y, radius);
      gradient.addColorStop(0, "#fff7ae");
      gradient.addColorStop(0.45, "#facc15");
      gradient.addColorStop(1, "#f97316");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TWO_PI);
      ctx.fill();
    }

    drawOrreryPlanet(planet, x, y, front, index) {
      const ctx = this.ctx;
      const radius = Math.max(2.6, planet.radius * 0.82 * (front ? 1.1 : 0.9));

      ctx.save();
      ctx.globalAlpha = front ? 0.96 : 0.55;

      const gradient = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.35, 1, x, y, radius * 1.16);
      gradient.addColorStop(0, planet.colorA);
      gradient.addColorStop(1, planet.colorB);

      if (planet.ring) {
        ctx.strokeStyle = "rgba(254, 243, 199, 0.72)";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.ellipse(x, y, radius * 1.9, radius * 0.6, -0.28, 0, TWO_PI);
        ctx.stroke();
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TWO_PI);
      ctx.fill();

      if (planet.name === "Jupiter") {
        ctx.strokeStyle = "rgba(120, 53, 15, 0.32)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(x, y, radius * 0.82, radius * 0.08, 0, 0, TWO_PI);
        ctx.stroke();
      }

      if (front || planet.name === "Jupiter" || planet.name === "Saturn") {
        ctx.fillStyle = this.state.theme === "dark" ? "rgba(226, 232, 240, 0.68)" : "rgba(15, 23, 42, 0.5)";
        ctx.font = "700 7px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(planet.name, x, y + radius + 4);
      }

      ctx.restore();
    }

    drawSolarSystemStrip(elapsed) {
      if (this.width < 560) return;

      const ctx = this.ctx;
      const dark = this.state.theme === "dark";
      const layout = this.getLayout();

      const panelWidth = Math.min(this.width * 0.82, 660);
      const panelHeight = 64;
      const panelX = (this.width - panelWidth) * 0.5;
      const panelY = Math.max(24, layout.centerY - layout.radius - 106);

      const left = panelX + 28;
      const right = panelX + panelWidth - 28;
      const available = right - left;
      const railY = panelY + 30;

      ctx.save();

      this.roundedRect(ctx, panelX, panelY, panelWidth, panelHeight, 16);
      ctx.fillStyle = dark ? "rgba(2, 8, 23, 0.42)" : "rgba(255, 255, 255, 0.46)";
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.strokeStyle = dark ? "rgba(125, 211, 252, 0.22)" : "rgba(2, 132, 199, 0.18)";
      ctx.stroke();

      ctx.fillStyle = dark ? "rgba(226, 232, 240, 0.72)" : "rgba(15, 23, 42, 0.58)";
      ctx.font = "700 9px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("SOLAR SYSTEM ORDER", panelX + 16, panelY + 13);

      ctx.strokeStyle = dark ? "rgba(186, 230, 253, 0.34)" : "rgba(2, 132, 199, 0.26)";
      ctx.lineWidth = 1.2;

      ctx.beginPath();

      for (let i = 0; i <= 100; i += 1) {
        const t = i / 100;
        const x = left + available * t;
        const y = railY + Math.sin(t * Math.PI) * 10;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();

      for (let i = 0; i < SOLAR_SYSTEM.length; i += 1) {
        const planet = SOLAR_SYSTEM[i];
        const t = planet.order / (SOLAR_SYSTEM.length - 1);
        const orbitPulse = Math.sin(elapsed * 0.45 + i * 0.75) * 2.4;
        const x = left + available * t;
        const y = railY + Math.sin(t * Math.PI) * 10 + orbitPulse;

        this.drawMiniPlanet(planet, x, y, dark);
      }

      ctx.restore();
    }

    drawMiniPlanet(planet, x, y, dark) {
      const ctx = this.ctx;
      const radius = planet.radius * 1.18;

      ctx.save();

      const gradient = ctx.createRadialGradient(
        x - radius * 0.35,
        y - radius * 0.35,
        radius * 0.1,
        x,
        y,
        radius * 1.2
      );

      gradient.addColorStop(0, planet.colorA);
      gradient.addColorStop(1, planet.colorB);

      if (planet.name === "Sun") {
        const sunGlow = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 2.8);
        sunGlow.addColorStop(0, "rgba(253, 224, 71, 0.68)");
        sunGlow.addColorStop(1, "rgba(253, 224, 71, 0)");

        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2.8, 0, TWO_PI);
        ctx.fill();
      }

      if (planet.ring) {
        ctx.strokeStyle = dark ? "rgba(254, 243, 199, 0.75)" : "rgba(120, 113, 108, 0.52)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(x, y, radius * 1.95, radius * 0.66, -0.28, 0, TWO_PI);
        ctx.stroke();
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TWO_PI);
      ctx.fill();

      ctx.lineWidth = 0.8;
      ctx.strokeStyle = dark ? "rgba(248, 250, 252, 0.42)" : "rgba(15, 23, 42, 0.2)";
      ctx.stroke();

      ctx.fillStyle = dark ? "rgba(226, 232, 240, 0.88)" : "rgba(15, 23, 42, 0.68)";
      ctx.font = "700 9px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(planet.name, x, y + radius + 4);

      ctx.restore();
    }

    drawScientificFrame(elapsed) {
      const ctx = this.ctx;
      const dark = this.state.theme === "dark";

      ctx.save();

      const spacing = 54;
      const offset = (elapsed * 6) % spacing;

      ctx.lineWidth = 1;
      ctx.strokeStyle = dark ? "rgba(148, 197, 253, 0.075)" : "rgba(15, 76, 117, 0.07)";

      for (let x = -spacing + offset; x < this.width + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.height);
        ctx.stroke();
      }

      for (let y = -spacing + offset; y < this.height + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
        ctx.stroke();
      }

      ctx.restore();
    }

    drawBackOrbit(moon, satellite) {
      this.drawOrbitPath(moon.angle, moon.orbitTilt, "back", 1);
      this.drawOrbitPath(satellite.angle, satellite.orbitTilt, "back", 0.62);
    }

    drawFrontOrbit(moon, satellite) {
      this.drawOrbitPath(moon.angle, moon.orbitTilt, "front", 1);
      this.drawOrbitPath(satellite.angle, satellite.orbitTilt, "front", 0.62);
    }

    drawOrbitPath(angle, tilt, half, radiusScale) {
      const ctx = this.ctx;
      const layout = this.getLayout();
      const orbitRadius = layout.radius * (1.37 + radiusScale * 0.52);
      const verticalScale = 0.42 + Math.abs(tilt) * 0.18;
      const dark = this.state.theme === "dark";

      ctx.save();
      ctx.beginPath();

      let started = false;

      for (let i = 0; i <= 180; i += 1) {
        const a = (i / 180) * TWO_PI + tilt;
        const depth = Math.sin(a + angle * 0.05);
        const isFront = depth > 0;

        if ((half === "front" && !isFront) || (half === "back" && isFront)) {
          started = false;
          continue;
        }

        const x = layout.centerX + Math.cos(a) * orbitRadius;
        const y = layout.centerY + Math.sin(a) * orbitRadius * verticalScale;

        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineWidth = radiusScale > 0.8 ? 1.2 : 0.8;
      ctx.strokeStyle =
        half === "front"
          ? dark
            ? "rgba(186, 230, 253, 0.46)"
            : "rgba(2, 132, 199, 0.38)"
          : dark
            ? "rgba(148, 163, 184, 0.26)"
            : "rgba(15, 23, 42, 0.18)";
      ctx.stroke();

      ctx.restore();
    }

    getSatelliteState(elapsed) {
      return {
        angle: elapsed * 0.85 + 2.3,
        orbitTilt: 0.62,
      };
    }

    getOrbitalScreenPosition(angle, tilt, radiusScale) {
      const layout = this.getLayout();
      const orbitRadius = layout.radius * (1.37 + radiusScale * 0.52);
      const verticalScale = 0.42 + Math.abs(tilt) * 0.18;
      const depth = Math.sin(angle + tilt);

      return {
        x: layout.centerX + Math.cos(angle + tilt) * orbitRadius,
        y: layout.centerY + Math.sin(angle + tilt) * orbitRadius * verticalScale,
        depth,
      };
    }

    drawBackMoonAndSatellite(moon, satellite, elapsed) {
      const moonPosition = this.getOrbitalScreenPosition(moon.angle, moon.orbitTilt, 1);
      const satellitePosition = this.getOrbitalScreenPosition(satellite.angle, satellite.orbitTilt, 0.62);

      if (moonPosition.depth < 0) {
        this.drawMoon(moonPosition.x, moonPosition.y, moonPosition.depth, elapsed);
      }

      if (satellitePosition.depth < 0) {
        this.drawSatellite(satellitePosition.x, satellitePosition.y, satellitePosition.depth, elapsed);
      }
    }

    drawFrontMoonAndSatellite(moon, satellite, elapsed) {
      const moonPosition = this.getOrbitalScreenPosition(moon.angle, moon.orbitTilt, 1);
      const satellitePosition = this.getOrbitalScreenPosition(satellite.angle, satellite.orbitTilt, 0.62);

      if (moonPosition.depth >= 0) {
        this.drawMoon(moonPosition.x, moonPosition.y, moonPosition.depth, elapsed);
      }

      if (satellitePosition.depth >= 0) {
        this.drawSatellite(satellitePosition.x, satellitePosition.y, satellitePosition.depth, elapsed);
      }
    }

    drawMoon(x, y, depth, elapsed) {
      const ctx = this.ctx;
      const layout = this.getLayout();
      const moonRadius = layout.radius * 0.105 * (depth > 0 ? 1.04 : 0.92);
      const alpha = depth > 0 ? 0.95 : 0.42;

      ctx.save();
      ctx.globalAlpha = alpha;

      const glow = ctx.createRadialGradient(x, y, moonRadius * 0.2, x, y, moonRadius * 3.5);
      glow.addColorStop(0, "rgba(226, 232, 240, 0.55)");
      glow.addColorStop(0.45, "rgba(125, 211, 252, 0.16)");
      glow.addColorStop(1, "rgba(125, 211, 252, 0)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, moonRadius * 3.5, 0, TWO_PI);
      ctx.fill();

      const gradient = ctx.createRadialGradient(
        x - moonRadius * 0.35,
        y - moonRadius * 0.4,
        moonRadius * 0.1,
        x,
        y,
        moonRadius
      );

      gradient.addColorStop(0, "#f8fafc");
      gradient.addColorStop(0.45, "#cbd5e1");
      gradient.addColorStop(1, "#64748b");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, moonRadius, 0, TWO_PI);
      ctx.fill();

      ctx.fillStyle = "rgba(71, 85, 105, 0.24)";
      for (let i = 0; i < 7; i += 1) {
        const a = elapsed * 0.05 + i * 1.73;
        const r = moonRadius * (0.25 + randomFromSeed(i + 600) * 0.48);
        const cx = x + Math.cos(a) * moonRadius * 0.45;
        const cy = y + Math.sin(a * 1.4) * moonRadius * 0.38;

        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.25, 0, TWO_PI);
        ctx.fill();
      }

      ctx.restore();
    }

    drawSatellite(x, y, depth, elapsed) {
      const ctx = this.ctx;
      const alpha = depth > 0 ? 0.95 : 0.35;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(elapsed * 1.2);
      ctx.globalAlpha = alpha;

      ctx.strokeStyle = "rgba(186, 230, 253, 0.75)";
      ctx.fillStyle = "rgba(226, 232, 240, 0.92)";
      ctx.lineWidth = 1;

      ctx.fillRect(-4, -3, 8, 6);
      ctx.strokeRect(-4, -3, 8, 6);

      ctx.fillStyle = "rgba(56, 189, 248, 0.55)";
      ctx.fillRect(-16, -2, 9, 4);
      ctx.fillRect(7, -2, 9, 4);

      ctx.beginPath();
      ctx.moveTo(-7, 0);
      ctx.lineTo(-4, 0);
      ctx.moveTo(4, 0);
      ctx.lineTo(7, 0);
      ctx.stroke();

      ctx.restore();
    }

    drawEarth(elapsed, moon) {
      const layout = this.getLayout();

      this.drawAtmosphereOuter();

      this.ctx.save();
      this.clipToEarth();

      this.drawOceanBase();
      this.drawOceanBathymetry(elapsed);
      this.drawOpenOceanWaveCrests(elapsed, moon);
      this.drawTideBulges(elapsed, moon);
      this.drawTemperatureLayer(elapsed);
      this.drawSalinityLayer(elapsed);
      this.drawWindLayer(elapsed);
      this.drawLandMasses(elapsed);
      this.drawCoastalWaves(elapsed, moon);
      this.drawGraticule();
      this.drawDayNightTerminator(elapsed);
      this.drawEarthGloss();

      this.ctx.restore();

      this.drawEarthRim();
      this.drawSpinAxis(layout);
      this.drawEarthLabels();
    }

    clipToEarth() {
      const ctx = this.ctx;
      const layout = this.getLayout();

      ctx.beginPath();
      ctx.arc(layout.centerX, layout.centerY, layout.radius, 0, TWO_PI);
      ctx.clip();
    }

    drawAtmosphereOuter() {
      const ctx = this.ctx;
      const layout = this.getLayout();

      ctx.save();

      const glow = ctx.createRadialGradient(
        layout.centerX,
        layout.centerY,
        layout.radius * 0.78,
        layout.centerX,
        layout.centerY,
        layout.radius * 1.28
      );

      glow.addColorStop(0, "rgba(56, 189, 248, 0)");
      glow.addColorStop(0.58, "rgba(56, 189, 248, 0.24)");
      glow.addColorStop(1, "rgba(14, 165, 233, 0)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(layout.centerX, layout.centerY, layout.radius * 1.32, 0, TWO_PI);
      ctx.fill();

      ctx.restore();
    }

    drawOceanBase() {
      const ctx = this.ctx;
      const layout = this.getLayout();
      const dark = this.state.theme === "dark";

      const ocean = ctx.createRadialGradient(
        layout.centerX - layout.radius * 0.38,
        layout.centerY - layout.radius * 0.34,
        layout.radius * 0.12,
        layout.centerX,
        layout.centerY,
        layout.radius * 1.08
      );

      if (dark) {
        ocean.addColorStop(0, "#0f766e");
        ocean.addColorStop(0.28, "#075985");
        ocean.addColorStop(0.72, "#082f49");
        ocean.addColorStop(1, "#020617");
      } else {
        ocean.addColorStop(0, "#2dd4bf");
        ocean.addColorStop(0.35, "#0284c7");
        ocean.addColorStop(0.78, "#075985");
        ocean.addColorStop(1, "#0f172a");
      }

      ctx.fillStyle = ocean;
      ctx.beginPath();
      ctx.arc(layout.centerX, layout.centerY, layout.radius, 0, TWO_PI);
      ctx.fill();
    }

    drawOceanBathymetry(elapsed) {
      const ctx = this.ctx;
      const layer = this.state.activeLayer;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < this.oceanSamples.length; i += 1) {
        const sample = this.oceanSamples[i];
        const projected = this.project(sample.lon, sample.lat, 0);

        if (!projected.front) continue;

        const wave =
          Math.sin(sample.lon * DEG * 2.1 + elapsed * 0.75) *
          Math.cos(sample.lat * DEG * 3.3 - elapsed * 0.54);

        const intensity = clamp(0.12 + wave * 0.09 + projected.shade * 0.12, 0.05, 0.34);
        const radius = layer === "tides" ? 1.15 : 0.78;

        ctx.fillStyle = `rgba(103, 232, 249, ${intensity})`;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, radius, 0, TWO_PI);
        ctx.fill();
      }

      ctx.restore();
    }

    drawOpenOceanWaveCrests(elapsed, moon) {
      const activeLayer = this.state.activeLayer;

      if (activeLayer !== "tides" && activeLayer !== "wind") return;

      const ctx = this.ctx;
      const moonUnit = moon.unit;

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < this.openOceanWaveCrests.length; i += 1) {
        const crest = this.openOceanWaveCrests[i];
        const propagation = elapsed * 2.8 + crest.phase;

        const shiftedLon = wrapLon(
          crest.lon +
            Math.sin(propagation * 0.22) * 8 +
            elapsed * 3.4
        );

        const shiftedLat = crest.lat + Math.cos(propagation * 0.2) * 1.1;
        const geoUnit = latLonToVector(shiftedLon, shiftedLat);
        const tideBoost = Math.pow(Math.abs(dot(geoUnit, moonUnit)), 3);

        const alpha =
          activeLayer === "tides"
            ? clamp(0.16 + tideBoost * 0.36 + Math.sin(propagation) * 0.05, 0.08, 0.56)
            : clamp(0.08 + Math.max(0, Math.sin(propagation)) * 0.16, 0.04, 0.28);

        for (let band = 0; band < 3; band += 1) {
          const bandOffset = band * 1.65;
          const bandAlpha = alpha * (1 - band * 0.24);

          const p1 = this.project(
            shiftedLon - crest.length * 0.28,
            shiftedLat + bandOffset,
            0.018 + tideBoost * 0.014
          );

          const p2 = this.project(
            shiftedLon,
            shiftedLat + Math.sin(propagation + band) * 1.5 + bandOffset,
            0.02 + tideBoost * 0.014
          );

          const p3 = this.project(
            shiftedLon + crest.length * 0.38,
            shiftedLat + Math.cos(propagation * 0.9 + band) * 1.7 + bandOffset,
            0.018 + tideBoost * 0.014
          );

          if (!p1.front || !p2.front || !p3.front) continue;

          ctx.strokeStyle = `rgba(240, 249, 255, ${bandAlpha})`;
          ctx.lineWidth = activeLayer === "tides" ? 1.4 + tideBoost * 1.1 : 0.9;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(p2.x, p2.y, p3.x, p3.y);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    drawTideBulges(elapsed, moon) {
      if (this.state.activeLayer !== "tides") return;

      const ctx = this.ctx;
      const moonUnit = moon.unit;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < this.oceanSamples.length; i += 1) {
        const sample = this.oceanSamples[i];

        if (sample.lat < -66) continue;

        const geoUnit = latLonToVector(sample.lon, sample.lat);
        const alignment = Math.abs(dot(geoUnit, moonUnit));
        const potential = Math.pow(alignment, 7);
        const projected = this.project(sample.lon, sample.lat, 0.006 + potential * 0.034);

        if (!projected.front) continue;

        const pulse = 0.72 + Math.sin(elapsed * 2.2 + sample.seed * 0.19) * 0.28;
        const alpha = clamp(potential * 0.68 * pulse, 0, 0.78);

        if (alpha < 0.025) continue;

        ctx.fillStyle = `rgba(125, 249, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, 1.5 + potential * 5.4, 0, TWO_PI);
        ctx.fill();
      }

      this.drawTideAxis(moon);

      ctx.restore();
    }

    drawTideAxis(moon) {
      const ctx = this.ctx;
      const p1 = this.project(moon.lon, moon.lat, 0.038);
      const p2 = this.project(wrapLon(moon.lon + 180), -moon.lat, 0.038);

      if (!p1.front && !p2.front) return;

      ctx.save();
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 9]);
      ctx.strokeStyle = "rgba(186, 230, 253, 0.42)";

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.restore();
    }

    drawTemperatureLayer(elapsed) {
      if (this.state.activeLayer !== "temperature") return;

      const ctx = this.ctx;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let lat = -80; lat <= 80; lat += 4) {
        const normalized = 1 - Math.abs(lat) / 88;
        const alpha = 0.05 + normalized * 0.18;
        const isWarm = Math.abs(lat) < 28;

        ctx.strokeStyle = isWarm
          ? `rgba(251, 191, 36, ${alpha})`
          : `rgba(147, 197, 253, ${0.08 + (1 - normalized) * 0.18})`;
        ctx.lineWidth = isWarm ? 2.2 : 1.4;

        this.drawLatitudeLine(lat, elapsed * 0.15);
      }

      ctx.restore();
    }

    drawSalinityLayer(elapsed) {
      if (this.state.activeLayer !== "salinity") return;

      const ctx = this.ctx;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < this.oceanSamples.length; i += 1) {
        const sample = this.oceanSamples[i];
        const projected = this.project(sample.lon, sample.lat, 0.004);

        if (!projected.front) continue;

        const subtropical = Math.exp(-Math.pow((Math.abs(sample.lat) - 25) / 16, 2));
        const polarFreshening = Math.max(0, (Math.abs(sample.lat) - 54) / 32);
        const salinitySignal = clamp(subtropical - polarFreshening * 0.42, 0, 1);

        const alpha = 0.08 + salinitySignal * 0.28;
        const radius = 1.2 + salinitySignal * 1.4;

        ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, radius, 0, TWO_PI);
        ctx.fill();
      }

      for (let i = 0; i < RIVER_PLUMES.length; i += 1) {
        const plume = RIVER_PLUMES[i];

        for (let j = 0; j < 34; j += 1) {
          const angle = j * 0.72 + elapsed * 0.18;
          const distance = (j / 34) * plume.spread;
          const lon = wrapLon(plume.lon + Math.cos(angle) * distance * 0.9);
          const lat = plume.lat + Math.sin(angle) * distance * 0.45;
          const projected = this.project(lon, lat, 0.012);

          if (!projected.front) continue;

          const alpha = plume.strength * (1 - j / 40) * 0.42;

          ctx.fillStyle = `rgba(167, 243, 208, ${alpha})`;
          ctx.beginPath();
          ctx.arc(projected.x, projected.y, 2.4 - j * 0.03, 0, TWO_PI);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    drawWindLayer(elapsed) {
      if (this.state.activeLayer !== "wind") return;

      const ctx = this.ctx;

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.lineCap = "round";

      for (let i = 0; i < this.windSamples.length; i += 1) {
        const sample = this.windSamples[i];

        const phase = elapsed * 0.48 + sample.seed * 0.17;
        const jet = Math.sin(sample.lat * DEG * 3.0);
        const u = 3.3 + Math.cos(phase) * 1.2 + jet * 2.8;
        const v = Math.sin(sample.lon * DEG + phase) * 1.4;

        const p1 = this.project(sample.lon, sample.lat, 0.018);
        const p2 = this.project(sample.lon + u, sample.lat + v, 0.018);

        if (!p1.front || !p2.front) continue;

        const speed = Math.sqrt(u * u + v * v);
        const alpha = clamp(0.1 + speed * 0.028 + p1.shade * 0.12, 0.1, 0.42);

        ctx.strokeStyle = `rgba(186, 230, 253, ${alpha})`;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(
          (p1.x + p2.x) * 0.5 + Math.sin(phase) * 5,
          (p1.y + p2.y) * 0.5 + Math.cos(phase) * 5,
          p2.x,
          p2.y
        );
        ctx.stroke();

        ctx.fillStyle = `rgba(125, 211, 252, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p2.x, p2.y, 1.1, 0, TWO_PI);
        ctx.fill();
      }

      ctx.restore();
    }

    drawLandMasses(elapsed) {
      const ctx = this.ctx;

      ctx.save();

      for (let i = 0; i < CONTINENTS.length; i += 1) {
        const continent = CONTINENTS[i];

        for (let j = 0; j < continent.paths.length; j += 1) {
          this.drawLandPath(continent, continent.paths[j], elapsed);
        }
      }

      this.drawLandTextureDots();

      ctx.restore();
    }

    getLandColor(group, shade) {
      const dark = this.state.theme === "dark";

      const palettes = {
        tropical: dark
          ? ["rgba(20, 83, 45, 0.76)", "rgba(74, 222, 128, 0.55)"]
          : ["rgba(22, 101, 52, 0.72)", "rgba(132, 204, 22, 0.5)"],
        temperate: dark
          ? ["rgba(21, 94, 117, 0.74)", "rgba(134, 239, 172, 0.5)"]
          : ["rgba(13, 148, 136, 0.65)", "rgba(190, 242, 100, 0.44)"],
        arid: dark
          ? ["rgba(120, 113, 108, 0.72)", "rgba(250, 204, 21, 0.38)"]
          : ["rgba(180, 83, 9, 0.5)", "rgba(250, 204, 21, 0.34)"],
        dry: dark
          ? ["rgba(100, 116, 139, 0.68)", "rgba(251, 191, 36, 0.36)"]
          : ["rgba(146, 64, 14, 0.46)", "rgba(251, 191, 36, 0.3)"],
        mixed: dark
          ? ["rgba(15, 118, 110, 0.72)", "rgba(163, 230, 53, 0.44)"]
          : ["rgba(22, 163, 74, 0.55)", "rgba(250, 204, 21, 0.28)"],
        ice: dark
          ? ["rgba(226, 232, 240, 0.64)", "rgba(186, 230, 253, 0.44)"]
          : ["rgba(241, 245, 249, 0.78)", "rgba(125, 211, 252, 0.42)"],
      };

      const palette = palettes[group] || palettes.mixed;
      return shade > 0.55 ? palette[1] : palette[0];
    }

    drawLandPath(continent, path, elapsed) {
      const ctx = this.ctx;
      const points = [];

      for (let i = 0; i < path.length; i += 1) {
        const lon = path[i][0];
        const lat = path[i][1];
        const projected = this.project(lon, lat, 0.011);

        points.push(projected);
      }

      let visibleCount = 0;

      for (let i = 0; i < points.length; i += 1) {
        if (points[i].front) visibleCount += 1;
      }

      if (visibleCount < 2) return;

      ctx.save();

      ctx.beginPath();

      let started = false;

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];

        if (!p.visible) {
          started = false;
          continue;
        }

        if (!started) {
          ctx.moveTo(p.x, p.y);
          started = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }

      ctx.closePath();

      const shade = visibleCount / points.length;
      ctx.fillStyle = this.getLandColor(continent.group, shade);
      ctx.fill();

      ctx.lineWidth = 1.1;
      ctx.strokeStyle = "rgba(191, 219, 254, 0.42)";
      ctx.stroke();

      ctx.globalCompositeOperation = "screen";
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";

      const wave = Math.sin(elapsed * 0.5 + visibleCount) * 0.5 + 0.5;
      if (wave > 0.42) {
        ctx.stroke();
      }

      ctx.restore();
    }

    drawLandTextureDots() {
      const ctx = this.ctx;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      let seed = 0;

      for (let i = 0; i < CONTINENTS.length; i += 1) {
        const continent = CONTINENTS[i];

        for (let j = 0; j < continent.paths.length; j += 1) {
          const path = continent.paths[j];

          for (let k = 0; k < path.length; k += 1) {
            const lon = path[k][0];
            const lat = path[k][1];
            const projected = this.project(lon, lat, 0.018);

            if (!projected.front) continue;

            const alpha = 0.16 + randomFromSeed(seed + 999) * 0.2;

            ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`;
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, 0.7, 0, TWO_PI);
            ctx.fill();

            seed += 1;
          }
        }
      }

      ctx.restore();
    }

    drawCoastalWaves(elapsed, moon) {
      const activeLayer = this.state.activeLayer;

      if (activeLayer !== "tides" && activeLayer !== "salinity") return;

      const ctx = this.ctx;
      const moonUnit = moon.unit;

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < this.coastalWaveSamples.length; i += 1) {
        const sample = this.coastalWaveSamples[i];
        const geoUnit = latLonToVector(sample.lon, sample.lat);
        const tidalAlignment = Math.abs(dot(geoUnit, moonUnit));
        const phase = elapsed * 3.8 + sample.seed * 0.73;
        const pulse = 0.5 + Math.max(0, Math.sin(phase)) * 0.5;

        const alpha =
          activeLayer === "tides"
            ? 0.14 + tidalAlignment * 0.52 * pulse
            : 0.08 + tidalAlignment * 0.18;

        for (let crest = 0; crest < 2; crest += 1) {
          const offset = crest * 0.9;

          const p1 = this.project(
            sample.lon + Math.sin(phase + crest) * 0.42,
            sample.lat + Math.cos(phase * 0.8 + crest) * 0.22 + offset,
            0.026
          );

          const p2 = this.project(
            sample.lon + Math.cos(phase) * 1.1,
            sample.lat + Math.sin(phase) * 0.55 + offset,
            0.03
          );

          const p3 = this.project(
            sample.lon + Math.cos(phase) * 2.2,
            sample.lat + Math.sin(phase + 0.7) * 0.72 + offset,
            0.03
          );

          if (!p1.front || !p2.front || !p3.front) continue;

          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * (1 - crest * 0.25)})`;
          ctx.lineWidth = 1.1 + tidalAlignment * 1.4;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(p2.x, p2.y, p3.x, p3.y);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    drawGraticule() {
      const ctx = this.ctx;
      const dark = this.state.theme === "dark";

      ctx.save();

      ctx.strokeStyle = dark ? "rgba(186, 230, 253, 0.16)" : "rgba(15, 23, 42, 0.14)";
      ctx.lineWidth = 0.8;

      for (let lat = -60; lat <= 60; lat += 30) {
        this.drawLatitudeLine(lat, 0);
      }

      for (let lon = -180; lon < 180; lon += 30) {
        this.drawLongitudeLine(lon);
      }

      ctx.restore();
    }

    drawLatitudeLine(lat, phase) {
      const ctx = this.ctx;

      ctx.beginPath();

      let started = false;

      for (let lon = -180; lon <= 180; lon += 4) {
        const projected = this.project(wrapLon(lon + phase), lat, 0.021);

        if (!projected.front) {
          started = false;
          continue;
        }

        if (!started) {
          ctx.moveTo(projected.x, projected.y);
          started = true;
        } else {
          ctx.lineTo(projected.x, projected.y);
        }
      }

      ctx.stroke();
    }

    drawLongitudeLine(lon) {
      const ctx = this.ctx;

      ctx.beginPath();

      let started = false;

      for (let lat = -80; lat <= 80; lat += 3) {
        const projected = this.project(lon, lat, 0.021);

        if (!projected.front) {
          started = false;
          continue;
        }

        if (!started) {
          ctx.moveTo(projected.x, projected.y);
          started = true;
        } else {
          ctx.lineTo(projected.x, projected.y);
        }
      }

      ctx.stroke();
    }

    drawDayNightTerminator(elapsed) {
      const ctx = this.ctx;
      const layout = this.getLayout();

      ctx.save();
      ctx.globalCompositeOperation = "multiply";

      const angle = elapsed * 0.06 - 0.9;
      const gradient = ctx.createLinearGradient(
        layout.centerX + Math.cos(angle) * layout.radius,
        layout.centerY + Math.sin(angle) * layout.radius,
        layout.centerX - Math.cos(angle) * layout.radius,
        layout.centerY - Math.sin(angle) * layout.radius
      );

      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(0.48, "rgba(15, 23, 42, 0.04)");
      gradient.addColorStop(0.78, "rgba(2, 6, 23, 0.46)");
      gradient.addColorStop(1, "rgba(2, 6, 23, 0.82)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(layout.centerX, layout.centerY, layout.radius, 0, TWO_PI);
      ctx.fill();

      ctx.restore();
    }

    drawEarthGloss() {
      const ctx = this.ctx;
      const layout = this.getLayout();

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      const gloss = ctx.createRadialGradient(
        layout.centerX - layout.radius * 0.35,
        layout.centerY - layout.radius * 0.42,
        layout.radius * 0.08,
        layout.centerX - layout.radius * 0.3,
        layout.centerY - layout.radius * 0.4,
        layout.radius * 1.1
      );

      gloss.addColorStop(0, "rgba(255, 255, 255, 0.28)");
      gloss.addColorStop(0.35, "rgba(125, 211, 252, 0.12)");
      gloss.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gloss;
      ctx.beginPath();
      ctx.arc(layout.centerX, layout.centerY, layout.radius, 0, TWO_PI);
      ctx.fill();

      ctx.restore();
    }

    drawEarthRim() {
      const ctx = this.ctx;
      const layout = this.getLayout();
      const dark = this.state.theme === "dark";

      ctx.save();

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = dark ? "rgba(186, 230, 253, 0.44)" : "rgba(2, 132, 199, 0.35)";
      ctx.beginPath();
      ctx.arc(layout.centerX, layout.centerY, layout.radius, 0, TWO_PI);
      ctx.stroke();

      ctx.lineWidth = 11;
      ctx.strokeStyle = dark ? "rgba(14, 165, 233, 0.1)" : "rgba(14, 165, 233, 0.13)";
      ctx.beginPath();
      ctx.arc(layout.centerX, layout.centerY, layout.radius + 5, 0, TWO_PI);
      ctx.stroke();

      ctx.restore();
    }

    drawSpinAxis(layout) {
      const ctx = this.ctx;
      const dark = this.state.theme === "dark";
      const length = layout.radius * 1.24;
      const angle = -Math.PI / 2 + EARTH_OBLIQUITY;
      const x1 = layout.centerX - Math.cos(angle) * length;
      const y1 = layout.centerY - Math.sin(angle) * length;
      const x2 = layout.centerX + Math.cos(angle) * length;
      const y2 = layout.centerY + Math.sin(angle) * length;

      ctx.save();
      ctx.setLineDash([6, 8]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = dark ? "rgba(226, 232, 240, 0.32)" : "rgba(15, 23, 42, 0.22)";

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = dark ? "rgba(226, 232, 240, 0.62)" : "rgba(15, 23, 42, 0.5)";
      ctx.font = "700 10px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("23.4° axial tilt", x2, y2 - 12);

      ctx.restore();
    }

    drawEarthLabels() {
      const ctx = this.ctx;
      const dark = this.state.theme === "dark";

      ctx.save();

      ctx.font = "600 11px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const labelPoints = [
        { label: "Pacific", lon: -155, lat: 2 },
        { label: "Atlantic", lon: -32, lat: 8 },
        { label: "Indian", lon: 78, lat: -18 },
        { label: "Arctic", lon: 35, lat: 72 },
        { label: "Southern", lon: 20, lat: -58 },
      ];

      for (let i = 0; i < labelPoints.length; i += 1) {
        const item = labelPoints[i];
        const projected = this.project(item.lon, item.lat, 0.025);

        if (!projected.front) continue;

        ctx.fillStyle = dark ? "rgba(226, 232, 240, 0.42)" : "rgba(15, 23, 42, 0.36)";
        ctx.fillText(item.label, projected.x, projected.y);
      }

      ctx.restore();
    }

    drawOverlayPanel(elapsed, moon) {
      /*
        v17: no extra layer chip. The right-side layer panel already tells the
        user which field is active. Keep only the compact Low/High scale bar.
      */
      const layer = this.state.activeLayer;
      const scaleWidth = Math.min(250, this.width * 0.3);
      const scaleX = this.width - scaleWidth - 48;
      const scaleY = this.height - 44;

      this.drawScaleBar(scaleX, scaleY, scaleWidth, layer);
    }

    drawSingleLineText(text, x, y, maxWidth) {
      const ctx = this.ctx;
      const value = String(text);

      if (ctx.measureText(value).width <= maxWidth) {
        ctx.fillText(value, x, y);
        return;
      }

      let clipped = value;

      while (clipped.length > 8 && ctx.measureText(`${clipped}…`).width > maxWidth) {
        clipped = clipped.slice(0, -1);
      }

      ctx.fillText(`${clipped}…`, x, y);
    }

    drawScaleBar(x, y, width, layer) {
      const ctx = this.ctx;
      const height = 7;

      const gradient = ctx.createLinearGradient(x, y, x + width, y);

      if (layer === "temperature") {
        gradient.addColorStop(0, "#60a5fa");
        gradient.addColorStop(0.45, "#22d3ee");
        gradient.addColorStop(0.68, "#facc15");
        gradient.addColorStop(1, "#fb7185");
      } else if (layer === "salinity") {
        gradient.addColorStop(0, "#a7f3d0");
        gradient.addColorStop(0.45, "#22d3ee");
        gradient.addColorStop(1, "#1d4ed8");
      } else if (layer === "tides") {
        gradient.addColorStop(0, "#075985");
        gradient.addColorStop(0.5, "#22d3ee");
        gradient.addColorStop(1, "#f8fafc");
      } else {
        gradient.addColorStop(0, "#1e3a8a");
        gradient.addColorStop(0.5, "#06b6d4");
        gradient.addColorStop(1, "#a3e635");
      }

      ctx.save();

      this.roundedRect(ctx, x, y, width, height, height / 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.font = "700 10px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(15, 23, 42, 0.72)";

      ctx.textAlign = "right";
      ctx.fillText("Low", x - 8, y + height / 2);

      ctx.textAlign = "left";
      ctx.fillText("High", x + width + 8, y + height / 2);

      ctx.restore();
    }

    roundedRect(ctx, x, y, width, height, radius) {
      const r = Math.min(radius, width / 2, height / 2);

      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }
  }

  function start() {
    const canvas = findCanvas();

    if (!canvas) {
      return;
    }

    if (canvas.__knOriginEarthRenderer) {
      return;
    }

    canvas.__knOriginEarthRenderer = new EarthSystemRenderer(canvas);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();