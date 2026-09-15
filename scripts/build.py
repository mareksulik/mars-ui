#!/usr/bin/env python3
"""mars-ui build: tokens/tokens.json → dist/ (CSS, JS, Tailwind), no Node dependencies.

    python3 scripts/build.py

Outputs:
  dist/tokens.css      :root (light) + [data-theme="dark"] — --mu-* custom properties
  dist/typography.css  .heading-72 … .button-12 classes from the type scale in tokens.json
  dist/ds.css          tokens + typography + src/base.css + components.css + brand.css (single file for static pages)
  dist/tokens.js       ESM export of the tokens (React/Node)
  dist/ds.js           UMD bundle (window.MarsUI) of src/charts.js
  dist/ds.esm.js       ESM build of charts.js
  tailwind/theme.css   Tailwind v4 @theme inline (utilities mapped to --mu-*)
  tailwind/preset.cjs  Tailwind v3 preset (same mapping)
Check: WCAG contrast of text steps (900/1000) on backgrounds 100/200 in both modes.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
T = json.loads((ROOT / "tokens/tokens.json").read_text(encoding="utf-8"))
P = T["prefix"]
DIST = ROOT / "dist"
DIST.mkdir(exist_ok=True)
(ROOT / "tailwind").mkdir(exist_ok=True)


def var(name: str) -> str:
    return f"--{P}-{name}"


# ---------------------------------------------------------------- tokens.css
def block(selector: str, mode: str) -> str:
    lines = [f"{selector}{{"]
    for k, v in T["color"][mode].items():
        lines.append(f"  {var(k)}:{v};")
    for k, v in T["effect"][mode].items():
        lines.append(f"  {var(k)}:{v};")
    if mode == "light":
        for k, v in T["radius"].items():
            lines.append(f"  {var('radius-' + k)}:{v};")
        for k, v in T["space"].items():
            lines.append(f"  {var('space-' + k)}:{v};")
        lines.append(f"  {var('font-sans')}:{T['fonts']['sans']};")
        lines.append(f"  {var('font-mono')}:{T['fonts']['mono']};")
    lines.append("}")
    return "\n".join(lines)


tokens_css = (
    f"/* mars-ui tokens — generated from tokens/tokens.json, do not edit by hand. {T['note']} */\n"
    + block(":root", "light") + "\n" + block('[data-theme="dark"]', "dark") + "\n"
)
(DIST / "tokens.css").write_text(tokens_css, encoding="utf-8")

# ---------------------------------------------------------------- typography.css
typo = ["/* mars-ui type scale — generated from tokens.json */"]
for name, t in T["typography"].items():
    fam = var("font-sans")
    typo.append(f".{name}{{font-family:var({fam});font-size:{t['size']};line-height:{t['line']};letter-spacing:{t['tracking']};font-weight:{t['weight']}}}")
    typo.append(f".{name}.mono{{font-family:var({var('font-mono')})}}")
(DIST / "typography.css").write_text("\n".join(typo) + "\n", encoding="utf-8")

# ---------------------------------------------------------------- ds.css
parts = [tokens_css, (DIST / "typography.css").read_text(encoding="utf-8")]
for f in ("base.css", "components.css", "brand.css"):
    parts.append(f"\n/* ==== src/{f} ==== */\n" + (ROOT / "src" / f).read_text(encoding="utf-8"))
(DIST / "ds.css").write_text("\n".join(parts), encoding="utf-8")

# ---------------------------------------------------------------- tokens.js
(DIST / "tokens.js").write_text(
    "// mars-ui tokens — generated from tokens/tokens.json\n"
    f"export const tokens = {json.dumps(T, ensure_ascii=False, indent=1)};\n"
    "export const light = tokens.color.light;\nexport const dark = tokens.color.dark;\n"
    "export default tokens;\n", encoding="utf-8")

# ---------------------------------------------------------------- ds.js (UMD) + ds.esm.js
charts = (ROOT / "src/charts.js").read_text(encoding="utf-8")
umd = ("/* mars-ui charts — UMD. window.MarsUI */\n"
       "(function(root,factory){if(typeof module==='object'&&module.exports){module.exports=factory();}else{root.MarsUI=factory();}})"
       "(typeof self!=='undefined'?self:this,function(){\n" + charts + "\nreturn createMarsUI();\n});\n")
(DIST / "ds.js").write_text(umd, encoding="utf-8")
(DIST / "ds.cjs").write_text(umd, encoding="utf-8")  # package.json has type=module → CommonJS consumers need .cjs
esm = ("/* mars-ui charts — ESM */\n" + charts +
       "\nconst MarsUI=createMarsUI();\nexport const {token,status,labels,setLabels,ratioColor,formatters,lineChart,bulletChart,table,badge,yoyChip,paceChip}=MarsUI;\nexport default MarsUI;\n")
(DIST / "ds.esm.js").write_text(esm, encoding="utf-8")

# ---------------------------------------------------------------- Tailwind v4 theme (inline → utilities read --mu-*, dark mode via data-theme)
tw = ['@import "../dist/tokens.css";', "",
      "/* dark variant driven by data-theme (mars-ui defaults to light) */",
      '@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));', "",
      "@theme inline {"]
for k in T["color"]["light"]:
    tw.append(f"  --color-{k}: var({var(k)});")
tw += [f"  --font-sans: var({var('font-sans')});", f"  --font-mono: var({var('font-mono')});"]
for k in T["radius"]:
    tw.append(f"  --radius-{k}: var({var('radius-' + k)});")
for k in T["effect"]["light"]:
    if k.startswith("shadow"):
        tw.append(f"  --shadow-{k.replace('shadow-', '')}: var({var(k)});")
tw.append("}")
(ROOT / "tailwind/theme.css").write_text("\n".join(tw) + "\n", encoding="utf-8")

# ---------------------------------------------------------------- Tailwind v3 preset
colors = {}
for k in T["color"]["light"]:
    scale, _, step = k.rpartition("-")
    colors.setdefault(scale, {})[step] = f"var({var(k)})"
preset = {
    "theme": {"extend": {
        "colors": colors,
        "fontFamily": {"sans": [f"var({var('font-sans')})"], "mono": [f"var({var('font-mono')})"]},
        "borderRadius": {k: f"var({var('radius-' + k)})" for k in T["radius"]},
        "boxShadow": {k.replace("shadow-", ""): f"var({var(k)})" for k in T["effect"]["light"] if k.startswith("shadow")},
    }},
    "darkMode": ["selector", '[data-theme="dark"]'],
}
(ROOT / "tailwind/preset.cjs").write_text(
    "// mars-ui Tailwind v3 preset — generated; import @mareksulik/mars-ui/css or dist/tokens.css in your app CSS\n"
    f"module.exports = {json.dumps(preset, indent=2)};\n", encoding="utf-8")


# ---------------------------------------------------------------- contrast (WCAG 2.x)
def parse(c: str):
    c = c.strip()
    m = re.match(r"hsl\((\d+),(\d+)%,(\d+)%\)", c)
    if m:
        h, s, l = int(m[1]), int(m[2]) / 100, int(m[3]) / 100
        C = (1 - abs(2 * l - 1)) * s
        X = C * (1 - abs((h / 60) % 2 - 1))
        mm = l - C / 2
        r, g, b = [(C, X, 0), (X, C, 0), (0, C, X), (0, X, C), (X, 0, C), (C, 0, X)][int(h // 60) % 6]
        return (r + mm, g + mm, b + mm)
    m = re.match(r"#([0-9a-f]{6})", c, re.I)
    if m:
        v = int(m[1], 16)
        return ((v >> 16) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255)
    return None


def lum(rgb):
    def ch(x):
        return x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)


def contrast(a, b):
    la, lb = lum(parse(a)), lum(parse(b))
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


fails = []
for mode in ("light", "dark"):
    col = T["color"][mode]
    for bg in ("background-100", "background-200"):
        for scale in ("gray", "blue", "red", "amber", "orange", "green", "teal", "purple", "pink"):
            for step, need in (("1000", 7.0), ("900", 4.5)):
                key = f"{scale}-{step}"
                cr = contrast(col[key], col[bg])
                if cr < need:
                    fails.append(f"{mode} {key} on {bg}: {cr:.2f} < {need}")
    # badge: text 900 on background 100 of the same scale
    for scale in ("blue", "red", "amber", "orange", "green", "teal", "purple", "pink"):
        cr = contrast(col[f"{scale}-900"], col[f"{scale}-100"])
        if cr < 4.5:
            fails.append(f"{mode} badge {scale}-900 on {scale}-100: {cr:.2f} < 4.5")

print(f"dist: tokens.css, typography.css, ds.css ({(DIST / 'ds.css').stat().st_size // 1024} kB), tokens.js, ds.js, ds.esm.js; tailwind/theme.css, preset.cjs")
if fails:
    print("Contrast (WCAG AA) — failures:")
    for f in fails:
        print("  ⚠", f)
    sys.exit(0 if "--strict" not in sys.argv else 1)
print("WCAG AA contrast: text 900/1000 and badge 900/100 OK in both modes")
