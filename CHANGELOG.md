# Changelog

## 1.0.0 — 2026-09-15

- Tokeny (svetlý + tmavý režim): sivá, blue, red, amber, green, teal, purple, pink × 100–1000, gray-alpha, pozadia, tiene, focus, radiusy, medzery, fonty. Hodnoty vizuálne podľa Geist (Vercel).
- `dist/ds.css`: base, typografická škála, komponenty (topbar, tabs, card, stat, table so skupinovými hlavičkami, badge, button, input, legend, note), brand vrstva.
- `dist/ds.js` / `ds.esm.js`: `lineChart`, `bulletChart`, `table`, `badge`, `yoyChip`, `paceChip`, `ratioColor`, `formatters`, `token`.
- Tailwind v4 `@theme inline` a v3 preset, React komponenty (`Badge`, `Button`, `Input`, `Field`, `Card`, `Stat`, `SectionHeader`, `Topbar`, `Tabs`, `Table`, `Td`, `Legend`, `Note`, `setTheme`).
- Šablóny `templates/report.html`, `templates/auth.html`; fonty Geist Sans/Mono (variabilné woff2, OFL).
- Prvý konzument: fabulo-performance/kpi (Fabulo KPI).
