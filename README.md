# The Compute Collaborative, Illinois Tech

A static pitch and due diligence site for a governed, student administered GPU suite hosted in the
Illinois Tech Smart Lab. Built to replace the slide deck when presenting to funders, university
leadership and corporate partners.

## Run it

No build step and no dependencies. Open `index.html` directly, or serve it:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
index.html              All page content, 19 sections
assets/logo.svg         Full circuit logo, vector, transparent
assets/logo-mark.svg    Solid hexagon mark for nav and favicon
assets/core.css         Design tokens, background layers, nav, shared primitives
assets/sections.css     Section specific components
assets/modules.css      Due diligence, spec plates, cost modal, HUD effects
assets/data.js          Sourced cost database, due diligence record, workloads, bill of materials
assets/app.js           Behaviour: modals, accordion, calculators, particle field, terminal
```

## The sourced cost system

Every approximate or estimated dollar figure on the site is a clickable citation trigger. Clicking one
opens a modal containing:

1. Whether the figure is vendor verified or modelled
2. A line by line component breakdown with individual prices
3. The assumptions behind the model
4. The full list of source links used to produce it

Cost entries live in the `COSTS` object in `assets/data.js`. Each entry has `title`, `figure`, `basis`
(`verified` or `estimate`), `intro`, `lines`, `assumptions` and `sources`. To wire a figure to a modal,
add `data-cost="key"` to any element in `index.html`.

Current cost entries: `greenfield`, `pilot`, `gpu48g6`, `gpu48g7`, `gpu96`, `cdwGap`, `power`, `opex`,
`cloud`, `warranty`, `phase2`, `savings`.

## Due diligence record

The `DILIGENCE` array in `assets/data.js` holds 25 questions and answers across four categories, each
with a status of `lock` (answered), `prog` (in progress) or `sched` (meeting scheduled). Answers that
carry a cost implication link through to their modal via the `cite` field.

## Interactive components

- **Workload explorer** at `#workloads`. Eight workloads showing what 24, 48 and 96 GB of VRAM unlock,
  each linked to its primary source document.
- **Budget builder** at `#budget`. Toggle any bill of materials line to see the effect on the capital
  request, with presets for pilot, phase two and full greenfield.
- **Own versus rent model** at `#economics`. Break even calculator against live cloud market rates.
  Assumptions: 4 year service life, $0.16 per kWh, 1.4 power usage effectiveness factor, staff time
  excluded because the student administration model contributes it.
- **Due diligence accordion** at `#diligence`, filterable by category.

## Brand

The logo is vector, not raster, so it has no background to remove and stays crisp from favicon size up.

- `assets/logo.svg` is the full circuit lockup. Used in the hero and as a large faint watermark.
- `assets/logo-mark.svg` is a solid scarlet hexagon with a knocked out C. Used in the nav, the footer
  and as the favicon, because the full lockup loses its centre below roughly 40px.

Glow is applied with layered CSS `drop-shadow` filters in `assets/modules.css` under the BRAND LOGO
section, not baked into the file, so it can be tuned without touching the artwork.

Scarlet scale in `assets/core.css`:

| Token | Value | Use |
|---|---|---|
| `--scarlet` | `#E4002B` | Primary vivid accent, borders, glow |
| `--scarlet-deep` | `#C8102E` | Illinois Tech brand anchor, gradients |
| `--scarlet-soft` | `#FF4D68` | Link and body text on dark |

Cyan, mint, amber and volt green are retained only where they carry meaning: status pills, verified
versus modelled cost badges, and the three hardware tiers.

## Editing the data

- Cost modals: the `COSTS` object in `assets/data.js`
- Questions and answers: the `DILIGENCE` array in `assets/data.js`
- Workload requirements: the `WORKLOADS` array in `assets/data.js`
- Bill of materials: the `BOM` array in `assets/data.js`
- Calculator configurations: the `CONFIGS` object in `assets/app.js`
- Vendor price table: the `<table class="px">` in `index.html`, section `#hardware`
- Colour system: CSS custom properties at the top of `assets/core.css`

## Writing conventions

The visible copy on this site contains no em dashes and no en dashes. Use periods, commas, colons or
parentheses instead. Ranges are written with the word "to" rather than a dash, for example "$3,140 to
$5,470".

To verify, scan for character codes 8212 and 8211:

```bash
node -e "const s=require('fs').readFileSync('index.html','utf8');let n=0;for(const c of s){const p=c.charCodeAt(0);if(p===8212||p===8211)n++;}console.log(n)"
```

The expected result is `0`.

## Pricing note

GPU prices were verified in August 2026 across Amazon, CDW, Newegg, B&H, Dell, Thinkmate and the NVIDIA
marketplace. They are volatile. NVIDIA raised RTX PRO 6000 Blackwell list pricing roughly 87 percent
within sixteen months of launch because of the GDDR7 shortage. Re verify before any formal budget
submission, and request education pricing through CDW-G before finalising a vendor.

## Open items tracked on the site

1. Written hosting confirmation from Professor Jeremy Hajek
2. Written asset ownership sign off from Professor Yutong Wang
3. Written vendor restriction rationale from Sarah at the Finance Board
4. Smart Lab physical constraints: power, rack space, cooling, network drops
5. Acceptable use policy formal document
6. CDW-G education pricing quote for 48 GB and 96 GB cards

## Accessibility and compatibility

Respects `prefers-reduced-motion`, which disables the particle field, reveal animations, count ups and
the terminal typing sequence. Responsive to 360px. Modal supports Escape to close and returns focus.
No external JavaScript dependencies. Google Fonts is the only external request.
