/* mars-ui React vrstva — tenké komponenty nad CSS triedami z dist/ds.css (žiadny Radix, žiadny runtime CSS-in-JS).
   Použitie: import '@mareksulik/mars-ui/css'; import { Badge, Card, Table } from '@mareksulik/mars-ui/react'; */
import * as React from "react";

type Div = React.HTMLAttributes<HTMLDivElement>;
const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(" ");

export type Tone = "ok" | "warn" | "crit" | "info" | "neutral" | "purple" | "teal" | "pink" | "brand" | "inverted";

export function Badge({ tone = "neutral", sans, className, children, ...rest }: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone; sans?: boolean }) {
  return <span className={cx("chip", `chip-${tone}`, sans && "chip-sans", className)} {...rest}>{children}</span>;
}

export function Button({ variant = "secondary", size, block, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "tertiary" | "error" | "brand"; size?: "sm" | "lg"; block?: boolean }) {
  return <button className={cx("btn", `btn-${variant}`, size && `btn-${size}`, block && "btn-block", className)} {...rest} />;
}

export function Input({ mono, className, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }) {
  return <input className={cx("input", mono && "input-mono", className)} {...rest} />;
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {error ? <div className="error">{error}</div> : hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

export function Card({ title, sub, elevated, className, children, ...rest }: Div & { title?: React.ReactNode; sub?: React.ReactNode; elevated?: boolean }) {
  return (
    <div className={cx("card", elevated && "card-elevated", className)} {...rest}>
      {title != null && <div className="card-title">{title}</div>}
      {sub != null && <div className="card-sub">{sub}</div>}
      {children}
    </div>
  );
}

export function Stat({ label, value, delta, tone }: { label: string; value: React.ReactNode; delta?: React.ReactNode; tone?: "pos" | "neg" }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta != null && <div className={cx("delta", tone)}>{delta}</div>}
    </div>
  );
}

export function SectionHeader({ num, title, children }: { num?: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <>
      {num && <div className="sec-num">{num}</div>}
      <h2>{title}</h2>
      {children}
    </>
  );
}

export function Topbar({ logo, app, meta, className, ...rest }: Div & { logo: React.ReactNode; app?: string; meta?: React.ReactNode }) {
  return (
    <header className={cx("topbar", className)} {...rest}>
      <div className="wrap">
        <div className="brand">
          {logo}
          {app && (<><span className="slash" /><span className="app">{app}</span></>)}
        </div>
        {meta != null && <div className="meta-row">{meta}</div>}
      </div>
    </header>
  );
}

export type Tab = { href: string; label: React.ReactNode; active?: boolean };
export function Tabs({ items, className, ...rest }: React.HTMLAttributes<HTMLElement> & { items: Tab[] }) {
  return (
    <nav className={cx("tabs", className)} {...rest}>
      <div className="wrap">
        {items.map((t, i) => <a key={i} href={t.href} className={t.active ? "active" : undefined}>{t.label}</a>)}
      </div>
    </nav>
  );
}

export type Column = { h: React.ReactNode; num?: boolean; gs?: boolean; key?: string };
export type Group = { h: React.ReactNode; span: number };
export function Table({ columns, groups, compact, children, className, ...rest }: React.TableHTMLAttributes<HTMLTableElement> & { columns: Column[]; groups?: Group[]; compact?: boolean }) {
  return (
    <div className="tbl-scroll">
      <table className={cx(groups && "grouped", compact && "tbl-compact", className)} {...rest}>
        <thead>
          {groups && <tr className="grp">{groups.map((g, i) => <th key={i} colSpan={g.span}>{g.h}</th>)}</tr>}
          <tr>{columns.map((c, i) => <th key={c.key ?? i} className={cx(c.num && "num", c.gs && "gs")}>{c.h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
export function Td({ num, gs, tone, className, ...rest }: React.TdHTMLAttributes<HTMLTableCellElement> & { num?: boolean; gs?: boolean; tone?: "pos" | "neg" }) {
  return <td className={cx(num && "num", gs && "gs", tone, className)} {...rest} />;
}

export function Legend({ items }: { items: Array<{ label: React.ReactNode; color?: string; style?: "dashed" | "dotted" | "goal" }> }) {
  return (
    <div className="legend">
      {items.map((it, i) => (
        <span key={i}>
          <span className={cx("sw", it.style && `sw-${it.style}`)} style={it.color ? { background: it.color } : undefined} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

export function Note({ tone, className, ...rest }: Div & { tone?: "warn" | "error" | "ok" }) {
  return <div className={cx("note", tone && `note-${tone}`, className)} {...rest} />;
}

/** Prepínač témy: nastaví data-theme na <html>. */
export function setTheme(theme: "light" | "dark" | null) {
  if (typeof document === "undefined") return;
  if (theme) document.documentElement.setAttribute("data-theme", theme);
  else document.documentElement.removeAttribute("data-theme");
}
