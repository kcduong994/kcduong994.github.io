# Duong Kim Cuong Portfolio

Personal academic, engineering, and software portfolio of **Duong Kim Cuong**.

The website presents my work and interests across coastal engineering, hydrodynamic modeling, scientific computing, software development, and artificial intelligence.

## Live Website

https://kcduong994.github.io/

## Overview

This portfolio serves as a central professional website for presenting:

- academic and engineering interests;
- coastal and environmental research;
- hydrodynamic and salinity modeling;
- scientific computing and data analysis;
- software development projects;
- artificial intelligence and educational technology;
- professional profiles and contact information.

The portfolio is the main personal website of Duong Kim Cuong.

Projects such as **KN Origin Lab** are presented as independent projects within this broader portfolio.

## Professional Profile

**Duong Kim Cuong**

Coastal Engineer · Researcher · Developer

Primary areas of work and development include:

- coastal and environmental engineering;
- hydrodynamic modeling;
- salinity intrusion analysis;
- numerical modeling;
- scientific computing;
- environmental data analysis;
- software engineering;
- artificial intelligence;
- structured educational systems.

## Research and Development Areas

### Coastal and Environmental Engineering

Research and engineering interests include:

- hydrodynamic processes;
- salinity intrusion;
- estuarine and coastal systems;
- numerical model calibration;
- model validation;
- environmental engineering applications;
- interpretation of observed and simulated data.

### Scientific Computing

Computational interests include:

- Python programming;
- numerical methods;
- engineering data processing;
- model validation workflows;
- data structures and algorithms;
- graph traversal and shortest-path methods;
- dynamic programming;
- scientific visualization;
- automation;
- reproducible computational analysis.

### Software and Artificial Intelligence

Development interests include:

- JavaScript and TypeScript applications;
- C# and .NET learning;
- multilingual educational systems;
- AI-assisted learning;
- knowledge visualization;
- structured data systems;
- interactive technical tools;
- computational thinking.

## Selected Projects

### KN Origin Lab

KN Origin Lab is a multilingual learning, assessment, and knowledge-engineering platform designed for structured education and evidence-based skill development.

Current and planned learning systems include:

- Korean language learning;
- English foundations;
- IELTS assessment and preparation;
- coastal engineering education;
- scientific and engineering learning systems;
- structured learner progress and evidence workflows;
- local-first learning tools;
- AI-assisted explanation and feedback;
- multilingual knowledge visualization.

Live project:

https://kn-origin-lab.pages.dev/

The production frontend is publicly accessible, while the source repository is maintained separately as a private project.

### Hydrodynamic and Salinity Analysis

Research workflows involving:

- hydrodynamic simulation;
- salinity intrusion modeling;
- environmental observations;
- model calibration;
- model validation;
- performance evaluation;
- engineering interpretation.

### Python Developer Portfolio

A structured collection of Python workshops, laboratories, certification projects, and technical review notes focused on programming fundamentals, software design, algorithms, numerical thinking, and engineering-oriented problem solving.

The repository covers:

- Python fundamentals;
- object-oriented programming;
- data validation;
- linked lists and hash tables;
- searching and sorting algorithms;
- graph representations;
- breadth-first and depth-first search;
- shortest-path algorithms;
- recursion and backtracking;
- dynamic programming;
- numerical methods;
- engineering-oriented problem solving.

Repository:

https://github.com/kcduong994/freecodecamp-python

### C# and .NET Learning Portfolio

A developing collection of workshops, exercises, study notes, and certification work from the freeCodeCamp Foundational C# with Microsoft Certification.

The repository is focused on:

- foundational C# syntax;
- static typing;
- .NET console applications;
- Visual Studio solution and project workflows;
- structured programming;
- object-oriented programming;
- debugging and software development fundamentals.

Repository:

https://github.com/kcduong994/freecodecamp-csharp

## Website Features

The portfolio currently includes:

- responsive desktop, tablet, and mobile layouts;
- light and dark themes;
- persistent theme preferences;
- professional research and project sections;
- selected project cards;
- live international clocks;
- a Personal Note typewriter section;
- an accessible contact dialog;
- keyboard navigation and focus handling;
- reduced-motion support;
- an interactive environmental globe;
- simulated wind, temperature, wave, and salinity layers;
- animated environmental vector particles;
- globe rotation and zoom controls;
- real-time coordinate display.

## Environmental Visualization

The portfolio includes an original interactive environmental visualization built with the HTML Canvas API.

The current visualization is a conceptual and educational prototype. Its wind, temperature, wave, and salinity fields are generated mathematically for interface development and demonstration.

The visualization does not currently display operational forecasts, measured observations, or validated scientific model results.

Future development may include:

- real environmental datasets;
- meteorological and oceanographic APIs;
- validated hydrodynamic model outputs;
- time-series controls;
- interactive legends;
- station observations;
- coastal and estuarine analysis layers;
- WebGL rendering for larger datasets.

## Technology Stack

- HTML5
- CSS3
- JavaScript
- Canvas 2D API
- `Intl.DateTimeFormat`
- Git
- GitHub
- GitHub Pages

The website is intentionally built without a frontend framework to keep the portfolio lightweight, transparent, and easy to maintain.

## Project Structure

```text
.
├── environment-map.js
├── index.html
├── LICENSE
├── README.md
├── theme.css
└── theme.js
```

### File Responsibilities

- `index.html` — main portfolio page and semantic website structure;
- `theme.css` — complete visual system, responsive layout, themes, and component styling;
- `theme.js` — theme preferences, world clocks, contact dialog, and typewriter behavior;
- `environment-map.js` — interactive environmental globe and simulated data layers;
- `README.md` — project documentation;
- `LICENSE` — proprietary usage and copyright terms.

## Local Development

Run a local static server from the repository root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Do not open `index.html` directly through the `file://` protocol because absolute asset paths and browser behavior may differ from the deployed website.

## Validation

Check JavaScript syntax with:

```bash
node --check theme.js
node --check environment-map.js
```

Check the source files for accidentally pasted Markdown fences:

````powershell
Select-String -Path index.html,theme.css,theme.js,environment-map.js -Pattern '```'
````

The final command should return no matches.

Markdown fences inside `README.md` are intentional and should not be removed.

Check Git formatting issues with:

```bash
git diff --check
```

## Interaction Controls

The environmental globe supports:

- pointer dragging to rotate the globe;
- mouse-wheel scrolling to zoom;
- double-clicking to reset the view;
- switching between wind, temperature, wave, and salinity layers;
- live geographic coordinate display.

The environmental fields are synthetic visualizations and are not intended for operational forecasting or engineering decision-making.

## Deployment

The website is deployed through GitHub Pages from this repository.

Production website:

https://kcduong994.github.io/

Source repository:

https://github.com/kcduong994/kcduong994.github.io

Updates pushed to the published branch are deployed through GitHub Pages.

## Source Availability and Usage

This repository is publicly accessible so that the portfolio website can be deployed and the project structure can be reviewed.

Public repository access does not mean that the project is open-source.

Permission is not granted to copy, modify, redistribute, republish, sublicense, sell, or commercially exploit the original source code, design system, written content, visualizations, personal materials, or other original project materials unless prior written authorization has been provided.

HTML, CSS, JavaScript, and other browser assets are publicly delivered as technically necessary for the website to operate. Their technical delivery does not grant reuse or redistribution rights.

## License

This project is proprietary software.

Copyright © 2026–present Duong Kim Cuong. All rights reserved.

Use, copying, modification, redistribution, publication, sublicensing, sale, or commercial exploitation of the original source code and project materials is prohibited unless prior written permission has been granted.

See the [`LICENSE`](./LICENSE) file for the complete terms.

Certain earlier versions may have been distributed under the MIT License. Those earlier copies remain governed by the license terms that accompanied them. The current and future versions are distributed under the proprietary terms contained in the current `LICENSE` file.

Third-party software, services, fonts, icons, data, and external assets remain subject to their respective licenses and terms.

## Contact

**Duong Kim Cuong**

Email:

[kcduong994@gmail.com](mailto:kcduong994@gmail.com)

GitHub:

https://github.com/kcduong994

LinkedIn:

https://www.linkedin.com/in/kim-cuong-duong-153aa4215/

KN Origin Lab:

https://kn-origin-lab.pages.dev/

---

**Coastal Engineering · Hydrodynamic Modeling · Scientific Computing · Software Engineering · Artificial Intelligence**