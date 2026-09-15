import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const cx = (...a) => a.filter(Boolean).join(" ");
export function Badge({ tone = "neutral", sans, className, children, ...rest }) {
    return _jsx("span", { className: cx("chip", `chip-${tone}`, sans && "chip-sans", className), ...rest, children: children });
}
export function Button({ variant = "secondary", size, block, className, ...rest }) {
    return _jsx("button", { className: cx("btn", `btn-${variant}`, size && `btn-${size}`, block && "btn-block", className), ...rest });
}
export function Input({ mono, className, ...rest }) {
    return _jsx("input", { className: cx("input", mono && "input-mono", className), ...rest });
}
export function Field({ label, hint, error, children }) {
    return (_jsxs("div", { className: "field", children: [_jsx("label", { children: label }), children, error ? _jsx("div", { className: "error", children: error }) : hint ? _jsx("div", { className: "hint", children: hint }) : null] }));
}
export function Card({ title, sub, elevated, className, children, ...rest }) {
    return (_jsxs("div", { className: cx("card", elevated && "card-elevated", className), ...rest, children: [title != null && _jsx("div", { className: "card-title", children: title }), sub != null && _jsx("div", { className: "card-sub", children: sub }), children] }));
}
export function Stat({ label, value, delta, tone }) {
    return (_jsxs("div", { className: "stat", children: [_jsx("div", { className: "label", children: label }), _jsx("div", { className: "value", children: value }), delta != null && _jsx("div", { className: cx("delta", tone), children: delta })] }));
}
export function SectionHeader({ num, title, children }) {
    return (_jsxs(_Fragment, { children: [num && _jsx("div", { className: "sec-num", children: num }), _jsx("h2", { children: title }), children] }));
}
export function Topbar({ logo, app, meta, className, ...rest }) {
    return (_jsx("header", { className: cx("topbar", className), ...rest, children: _jsxs("div", { className: "wrap", children: [_jsxs("div", { className: "brand", children: [logo, app && (_jsxs(_Fragment, { children: [_jsx("span", { className: "slash" }), _jsx("span", { className: "app", children: app })] }))] }), meta != null && _jsx("div", { className: "meta-row", children: meta })] }) }));
}
export function Tabs({ items, className, ...rest }) {
    return (_jsx("nav", { className: cx("tabs", className), ...rest, children: _jsx("div", { className: "wrap", children: items.map((t, i) => _jsx("a", { href: t.href, className: t.active ? "active" : undefined, children: t.label }, i)) }) }));
}
export function Table({ columns, groups, compact, children, className, ...rest }) {
    return (_jsx("div", { className: "tbl-scroll", children: _jsxs("table", { className: cx(groups && "grouped", compact && "tbl-compact", className), ...rest, children: [_jsxs("thead", { children: [groups && _jsx("tr", { className: "grp", children: groups.map((g, i) => _jsx("th", { colSpan: g.span, children: g.h }, i)) }), _jsx("tr", { children: columns.map((c, i) => _jsx("th", { className: cx(c.num && "num", c.gs && "gs"), children: c.h }, c.key ?? i)) })] }), _jsx("tbody", { children: children })] }) }));
}
export function Td({ num, gs, tone, className, ...rest }) {
    return _jsx("td", { className: cx(num && "num", gs && "gs", tone, className), ...rest });
}
export function Legend({ items }) {
    return (_jsx("div", { className: "legend", children: items.map((it, i) => (_jsxs("span", { children: [_jsx("span", { className: cx("sw", it.style && `sw-${it.style}`), style: it.color ? { background: it.color } : undefined }), it.label] }, i))) }));
}
export function Note({ tone, className, ...rest }) {
    return _jsx("div", { className: cx("note", tone && `note-${tone}`, className), ...rest });
}
/** Prepínač témy: nastaví data-theme na <html>. */
export function setTheme(theme) {
    if (typeof document === "undefined")
        return;
    if (theme)
        document.documentElement.setAttribute("data-theme", theme);
    else
        document.documentElement.removeAttribute("data-theme");
}
