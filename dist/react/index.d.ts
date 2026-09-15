import * as React from "react";
type Div = React.HTMLAttributes<HTMLDivElement>;
export type Tone = "ok" | "warn" | "crit" | "info" | "neutral" | "purple" | "teal" | "pink" | "brand" | "inverted";
export declare function Badge({ tone, sans, className, children, ...rest }: React.HTMLAttributes<HTMLSpanElement> & {
    tone?: Tone;
    sans?: boolean;
}): React.JSX.Element;
export declare function Button({ variant, size, block, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "tertiary" | "error" | "brand";
    size?: "sm" | "lg";
    block?: boolean;
}): React.JSX.Element;
export declare function Input({ mono, className, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & {
    mono?: boolean;
}): React.JSX.Element;
export declare function Field({ label, hint, error, children }: {
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}): React.JSX.Element;
export declare function Card({ title, sub, elevated, className, children, ...rest }: Div & {
    title?: React.ReactNode;
    sub?: React.ReactNode;
    elevated?: boolean;
}): React.JSX.Element;
export declare function Stat({ label, value, delta, tone }: {
    label: string;
    value: React.ReactNode;
    delta?: React.ReactNode;
    tone?: "pos" | "neg";
}): React.JSX.Element;
export declare function SectionHeader({ num, title, children }: {
    num?: string;
    title: React.ReactNode;
    children?: React.ReactNode;
}): React.JSX.Element;
export declare function Topbar({ logo, app, meta, className, ...rest }: Div & {
    logo: React.ReactNode;
    app?: string;
    meta?: React.ReactNode;
}): React.JSX.Element;
export type Tab = {
    href: string;
    label: React.ReactNode;
    active?: boolean;
};
export declare function Tabs({ items, className, ...rest }: React.HTMLAttributes<HTMLElement> & {
    items: Tab[];
}): React.JSX.Element;
export type Column = {
    h: React.ReactNode;
    num?: boolean;
    gs?: boolean;
    key?: string;
};
export type Group = {
    h: React.ReactNode;
    span: number;
};
export declare function Table({ columns, groups, compact, children, className, ...rest }: React.TableHTMLAttributes<HTMLTableElement> & {
    columns: Column[];
    groups?: Group[];
    compact?: boolean;
}): React.JSX.Element;
export declare function Td({ num, gs, tone, className, ...rest }: React.TdHTMLAttributes<HTMLTableCellElement> & {
    num?: boolean;
    gs?: boolean;
    tone?: "pos" | "neg";
}): React.JSX.Element;
export declare function Legend({ items }: {
    items: Array<{
        label: React.ReactNode;
        color?: string;
        style?: "dashed" | "dotted" | "goal";
    }>;
}): React.JSX.Element;
export declare function Note({ tone, className, ...rest }: Div & {
    tone?: "warn" | "error" | "ok";
}): React.JSX.Element;
/** Prepínač témy: nastaví data-theme na <html>. */
export declare function setTheme(theme: "light" | "dark" | null): void;
export {};
