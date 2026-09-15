# Changelog

## 1.0.1 — 2026-09-15

- README and DESIGN_SYSTEM.md in English, screenshots (light + dark) in `docs/`.

## 1.0.0 — 2026-09-15

- Tokens (light + dark): gray, blue, red, amber, green, teal, purple, pink × 100–1000, gray-alpha, backgrounds, shadows, focus, radii, spacing, fonts. Values visually follow Geist (Vercel).
- `dist/ds.css`: base, type scale, components (topbar, tabs, card, stat, table with grouped headers, badge, button, input, legend, note), brand layer.
- `dist/ds.js` / `ds.esm.js`: `lineChart`, `bulletChart`, `table`, `badge`, `yoyChip`, `paceChip`, `ratioColor`, `formatters`, `token`.
- Tailwind v4 `@theme inline` and v3 preset, React components (`Badge`, `Button`, `Input`, `Field`, `Card`, `Stat`, `SectionHeader`, `Topbar`, `Tabs`, `Table`, `Td`, `Legend`, `Note`, `setTheme`).
- Templates `templates/report.html`, `templates/auth.html`; Geist Sans/Mono variable woff2 (OFL).
- First consumer: fabulo-performance/kpi (Fabulo KPI).
