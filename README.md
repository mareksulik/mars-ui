# mars-ui

Dizajn systém pre reporty, dashboardy a weby — tokeny, CSS komponenty, vanilla SVG grafy, Tailwind (v3/v4) a React vrstva. Vizuálne vychádza z [Geist](https://vercel.com/geist), dizajn systému Vercelu; fonty Geist Sans a Geist Mono (SIL OFL 1.1) sú priložené. mars-ui je nezávislý projekt, nie produkt Vercelu.

## Použitie

**Statický HTML** — skopíruj `dist/ds.css`, `dist/ds.js` a `dist/fonts/` k reportu (šablóny v `templates/`):

```html
<link rel="stylesheet" href="ds.css">
<script src="ds.js"></script>
<script>
  MarsUI.lineChart(document.getElementById('chart'), labels, [{label:'2026', color:MarsUI.token('blue-700'), values}], {goal:1000});
</script>
```

CDN: `https://cdn.jsdelivr.net/npm/@mareksulik/mars-ui@1/dist/ds.css` (a `ds.js`).

**React / Next.js:**

```bash
npm i @mareksulik/mars-ui
```
```tsx
import '@mareksulik/mars-ui/css';
import { Topbar, Tabs, Card, Table, Td, Badge } from '@mareksulik/mars-ui/react';
```

**Tailwind v4:** `@import '@mareksulik/mars-ui/tailwind';` · **Tailwind v3:** `presets: [require('@mareksulik/mars-ui/tailwind/preset')]`.

**Tmavý režim:** `<html data-theme="dark">` (default svetlý).

Kompletná špecifikácia pre ľudí aj agentov: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

## Vývoj

```bash
python3 scripts/build.py      # tokens/tokens.json → dist/ + tailwind/ + kontrastný test
npm run build:react           # src/react → dist/react
npm run check
```

## Licencia

MIT (kód). Fonty Geist: SIL Open Font License 1.1 (`dist/fonts/LICENSE-OFL.txt`).
