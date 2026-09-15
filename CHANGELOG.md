# Changelog

## 1.1.0 — 2026-09-15

- New components: `footer.site`, `nav a.right` (right-aligned tab), methodology-page set (`dl.spec`, `.formula`, `.cell`, `.src`, `figure.shot` with `.cap`, `.metric`, `.band`).
- Templates: footer and right-aligned tab in `report.html`.

## 1.0.6 — 2026-09-15

- `ratioColor`: 0.05 % tolerance so a value exactly at the goal/cap (rounding) stays green.

## 1.0.5 — 2026-09-15

- Status bands set as the fixed rule: met green-800 · within 3 % teal-800 · within 10 % amber-800 · beyond red-800 (all Geist tokens). `lime`/`orange` stay as optional accents.

## 1.0.4 — 2026-09-15

- New `lime` scale. Status bands restored to the original rule: met green-800 · within 3 % lime-800 (yellow-green) · within 10 % orange-800 · beyond red-800. Documented as a fixed rule.

## 1.0.3 — 2026-09-15

- New `orange` scale (100–1000, light + dark). Status band "within 10 %" is `orange-800` instead of the brown `amber-900`; warm text uses `orange-900`.

## 1.0.2 — 2026-09-15

- Chart/badge labels are English by default; `MarsUI.setLabels({...})` overrides them once per page (Fabulo KPI uses Slovak).
- CommonJS entry `dist/ds.cjs` (package is `type: module`); `require('@mareksulik/mars-ui')` works.
- English templates (`report.html` shows green / amber / red goal rows), English source comments, repo description and package metadata.
- Screenshots regenerated.

## 1.0.1 — 2026-09-15

- README and DESIGN_SYSTEM.md in English, screenshots (light + dark) in `docs/`.

## 1.0.0 — 2026-09-15

- Tokens (light + dark): gray, blue, red, amber, green, teal, purple, pink × 100–1000, gray-alpha, backgrounds, shadows, focus, radii, spacing, fonts. Values visually follow Geist (Vercel).
- `dist/ds.css`: base, type scale, components (topbar, tabs, card, stat, table with grouped headers, badge, button, input, legend, note), brand layer.
- `dist/ds.js` / `ds.esm.js`: `lineChart`, `bulletChart`, `table`, `badge`, `yoyChip`, `paceChip`, `ratioColor`, `formatters`, `token`.
- Tailwind v4 `@theme inline` and v3 preset, React components (`Badge`, `Button`, `Input`, `Field`, `Card`, `Stat`, `SectionHeader`, `Topbar`, `Tabs`, `Table`, `Td`, `Legend`, `Note`, `setTheme`).
- Templates `templates/report.html`, `templates/auth.html`; Geist Sans/Mono variable woff2 (OFL).
- First consumer: fabulo-performance/kpi (Fabulo KPI).
