# mars-ui — dizajn systém

Jeden vizuálny jazyk pre všetky reporty, dashboardy a weby Mareka Šulika. Vizuálne vychádza z **Geist** (dizajn systém Vercelu, vercel.com/geist): neutrálna biela/sivá, fonty Geist Sans + Geist Mono, tesné nadpisy, 1 px hranice, radius 6/12 px, žiadne tiene, štítky ako pilulky, tabuľky s tenkými linkami. mars-ui je nezávislý projekt (MIT), nie produkt Vercelu; fonty sú pod SIL OFL 1.1.

Tento dokument je **spec pre ľudí aj pre agentov** (Claude): ak staviaš HTML report, dashboard alebo stránku, drž sa ho a použij `dist/ds.css` + `dist/ds.js` (alebo React vrstvu). Nevymýšľaj nové farby, fonty ani komponenty.

## 1. Ako použiť

**Statický HTML report (default pre klientske reporty):**
```html
<link rel="stylesheet" href="ds.css">   <!-- vendorované: cp node_modules/@mareksulik/mars-ui/dist/{ds.css,ds.js,fonts} . -->
<script src="ds.js"></script>             <!-- window.MarsUI: lineChart, bulletChart, table, badge, yoyChip, paceChip, formatters, token -->
```
Šablóna: `templates/report.html` (topbar + tabs + sekcie + ukážka grafov), PIN stránka `templates/auth.html`. CDN alternatíva: `https://cdn.jsdelivr.net/npm/@mareksulik/mars-ui@1/dist/ds.css` — pre PIN chránené reporty radšej vendoruj (žiadna externá závislosť).

**Next.js / React:** `npm i @mareksulik/mars-ui` → `import '@mareksulik/mars-ui/css'` v root layoute, komponenty z `@mareksulik/mars-ui/react`. Tailwind v4: `@import '@mareksulik/mars-ui/tailwind';` v globals.css (utility `bg-gray-100`, `text-blue-900`, `rounded-md`, `font-mono` čítajú --mu-* tokeny, dark cez `data-theme`). Tailwind v3: `presets: [require('@mareksulik/mars-ui/tailwind/preset')]` + import `tokens.css`.

**Tmavý režim:** `<html data-theme="dark">`. Default je svetlý; nikdy nepoužívaj `prefers-color-scheme` automaticky v reportoch (klient ich číta aj tlačí).

## 2. Tokeny (`--mu-*`)

| Skupina | Tokeny | Sémantika (Geist) |
|---|---|---|
| pozadia | `--mu-background-100` (karty, topbar), `--mu-background-200` (stránka) | 100 = povrch, 200 = plocha |
| sivá | `--mu-gray-100…1000`, `--mu-gray-alpha-100…1000` | 100–300 pozadia komponentov (default/hover/active), 400–600 hranice (`gray-alpha-400` = štandardná 1 px hranica), 700–800 kontrastné plochy a osi grafov, 900 sekundárny text, 1000 primárny text |
| akcenty | `blue`, `red`, `amber`, `green`, `teal`, `purple`, `pink` × 100–1000 | 100 pozadie štítku, 700–800 čiary/pásy/tlačidlá, 900 text štítku a čísel |
| efekty | `--mu-shadow-small/medium/large/tooltip/menu/modal`, `--mu-focus-ring` | tiene len pre plávajúce prvky (menu, modal); karty bez tieňa |
| radius | `--mu-radius-sm` 6 px (tlačidlá, inputy, štítky s textom), `--mu-radius-md` 12 px (karty, tabuľky), `--mu-radius-lg` 16 px, `--mu-radius-full` (pilulky) | |
| fonty | `--mu-font-sans` Geist, `--mu-font-mono` Geist Mono | mono = čísla v tabuľkách, osi grafov, meta údaje, štítky, kód |
| medzery | `--mu-space-1…16` (4 px krok) | |

Zdroj pravdy je `tokens/tokens.json`; `python3 scripts/build.py` generuje CSS, JS aj Tailwind. Hodnoty needituj v `dist/`.

## 3. Typografia

Triedy zo škály (`dist/typography.css`): `.heading-72 … .heading-14` (weight 600, tracking −0,04 až −0,01 em), `.copy-16/14/13` (400), `.label-14/13/12` (500), `.button-14/12`. Pridaj `.mono` pre Geist Mono. Základné `h1` 32/40, `h2` 28/36, `h3` 22/30, `body` 15/1.5.

Pravidlá: nadpisy vždy Geist Sans, nikdy serif. Čísla, ktoré sa porovnávajú v stĺpci → mono. Popisky pod nadpismi grafov (`.fig-sub`) 13 px sivá 900. Sekcie majú číslo v mono uppercase (`.sec-num`, „01 — PREHĽAD") a `h2`.

## 4. Komponenty (CSS triedy = API)

- **Topbar** `header.topbar > .wrap > .brand (logo svg | .slash | .app) + .meta-row` — logo inline SVG s `fill="currentColor"`, výška 22 px.
- **Tabs** `nav > .wrap > a(.active)` — 14 px, aktívny čierna 2 px podčiarka, sticky.
- **Card / figure** `.card` alebo `<figure><figcaption>…<div class="fig-sub">…` — biela, 1 px `gray-alpha-400`, radius 12, padding 20.
- **Stat** `.stat > .label + .value(+ .delta.pos/.neg)` — mono 28 px číslo.
- **Table** `.tbl-scroll > table(.grouped)` — `th` mono uppercase 13 px na `background-200`, `td.num` mono vpravo, `tr.grp th` skupinový riadok (TRŽBY / ZISK / SPEND), `.gs` ľavá deliaca linka na začiatku skupiny, `tr.hl` zvýraznený riadok, `.pos/.neg` zelený/červený text 500. Skupiny trojíc (skutočnosť · cieľ · plnenie) preferuj pred plochými tabuľkami s 15 stĺpcami.
- **Badge** `.chip.chip-{ok|warn|crit|info|neutral|purple|teal|pink|brand|inverted}` — mono 12 px, pilulka, pozadie 100 / text 900. Stavy: ok = splnené, warn = pozor, crit = problém, info = bežiaci/aktívny, neutral = plán/neaktívny.
- **Button** `.btn.btn-{primary|secondary|tertiary|error|brand}(.btn-sm|.btn-lg|.btn-block)` — primary čierne, 40 px, radius 6.
- **Input** `.input(.input-mono)`, `.field > label + .input + .hint/.error`.
- **Legend** `.legend > span > .sw` (+ `.sw-dashed` vlani, `.sw-dotted` cesta k cieľu, `.sw-goal` cieľ).
- **Note** `.note(.note-warn|.note-error|.note-ok)`.

## 5. Grafy (`dist/ds.js` → `MarsUI`)

- `lineChart(el, labels, series, opts)` — série `{label,color,values,dash,opacity,width,nodots}`; `opts.goal` čierna čiarkovaná, `opts.yfmt/tfmt`, `opts.xstep`, `opts.wide`. Ľavý okraj sa počíta podľa šírky popiskov osi.
- Konvencie: **tento rok plná**, **vlani rovnaká farba čiarkovaná `5 4` s opacity .55** (v porovnaní krajín .35), **cieľ mesiaca čierna čiarkovaná**, **rovnomerná cesta k cieľu sivá bodkovaná `2 4`** (gray-600, width 1). Celofiremná séria = `blue-700`. Mriežka `gray-200`, osi `gray-700`.
- `bulletChart(el, rows, {progress})` — riadok = vľavo názov + hodnota, pás k cieľu (100 % = zvislá čierna), veľké % a projekcia v strede, cieľ vpravo; `progress` kreslí „DNES x %".
- Stavové farby (`ratioColor`): splnené `green-800`, do 3 % `amber-800`, do 10 % `amber-900`, nad 10 % `red-800`; bez dát `gray-700`.
- Paleta sérií pre viac entít: amber-800, teal-700, purple-700, red-700, blue-700, pink-700 (text = krok 900).

## 6. Brand vrstva

Klient nemení neutrály ani stavové farby. Dodáva logo (inline SVG, `currentColor`) a voliteľne `--brand-primary` (+ `-text`, `-bg`) v `:root` projektu. Utility: `.btn-brand`, `.chip-brand`, `.brand-accent`, `.bg-brand`.

## 7. Zákazy

Serifové písma, tiene na kartách, radius iný než 6/12/16, vlastné hexy mimo tokenov, farebné pozadia sekcií, viac než 2 akcenty na jednej obrazovke (okrem sérií grafu), ikony z Vercelu (použiť Lucide, ISC), text/obrázky z dokumentácie Vercelu, názov „Geist" pre tento systém.

## 8. Vývoj

`python3 scripts/build.py` (tokeny → dist + Tailwind + kontrastný test), `npm run build:react` (tsc → dist/react), `npm run check`. Verzia semver, `CHANGELOG.md`. Publikovanie: `npm publish --access public`; tag `vX.Y.Z` → jsDelivr `…/gh/mareksulik/mars-ui@X/dist/ds.css`.
