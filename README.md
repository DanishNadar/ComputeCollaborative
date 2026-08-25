# The Compute Collaborative — Illinois Tech

A static pitch site for a governed, student-administered GPU suite hosted in the Illinois Tech Smart Lab.
Built to replace the slide deck when presenting to funders, university leadership, and corporate partners.

## Run it

No build step, no dependencies. Open `index.html` directly, or serve it:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
index.html            All page content (15 sections, 102 external references)
assets/core.css       Design tokens, background layers, nav, shared primitives
assets/sections.css   Section-specific components
assets/app.js         Particle field, scroll reveals, counters, workload explorer, economics model
```

## Audiences the page is written for

| Audience | Sections that carry the argument |
|---|---|
| University leadership / Finance Board | Purpose, Proposal, Architecture, Pipeline, Economics, The Ask |
| NVIDIA & corporate sponsors | For Partners (tiers, NVIDIA program fit, reporting commitments) |
| Prospective computing majors | Potential (workload explorer), Impact |
| Business / entrepreneurship majors | The Venture Case |

## Interactive components

- **Workload explorer** (`#workloads`) — eight real workloads showing what 24 / 48 / 96 GB VRAM
  unlocks, each linked to its primary source document.
- **Build-vs-rent model** (`#economics`) — break-even calculator against live cloud market rates.
  Assumptions: 4-year service life, $0.12/kWh with a 15% host/cooling overhead, staff time excluded
  (contributed by the student administration model).

## Editing the data

- **Workload definitions** — the `WORKLOADS` array in `assets/app.js`.
- **Hardware cost configs** — the `CONFIGS` object in `assets/app.js` (`capex`, `watts`, `rate`, `gpus`).
- **Price matrix** — the `<table class="px">` in `index.html`, section `#hardware`.
- **Colour system** — CSS custom properties at the top of `assets/core.css`.

## Pricing note

All GPU prices were researched **August 2026** across NVIDIA's marketplace, CDW, Newegg, B&H, and Amazon,
and are volatile — NVIDIA raised RTX PRO 6000 Blackwell list pricing roughly 55–87% within sixteen months
of launch due to the GDDR7 shortage. Re-verify before any formal budget submission, and request education
pricing through CDW-G, Insight Public Sector, SHI, or Connection.

## Accessibility & compatibility

Respects `prefers-reduced-motion` (disables the particle field, reveal animations, and count-ups).
Responsive to 360px. No external JS dependencies; Google Fonts is the only external request.
