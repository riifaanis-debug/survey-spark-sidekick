import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

export const PAGES = [
  { to: "/", label: "الفكرة والشريحة المستهدفة" },
  { to: "/hypothesis", label: "الفرضية" },
  { to: "/kpi", label: "المؤشر الرئيسي والهدف" },
  { to: "/kpi-1", label: "المؤشر الداعم الأول" },
  { to: "/kpi-2", label: "المؤشر الداعم الثاني" },
  { to: "/validation", label: "التحقق من المؤشرات" },
  { to: "/survey", label: "الاستبيان" },
  { to: "/results", label: "النتائج" },
] as const;

export function TopNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector('[data-status="active"]')?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [path]);
  return (
    <nav className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
      <div ref={ref} className="mx-auto flex max-w-4xl gap-2 overflow-x-auto px-3 py-2 [scrollbar-width:none]">
        {PAGES.map((p, i) => (
          <Link key={p.to} to={p.to} activeOptions={{ exact: true }}
            className="shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-muted data-[status=active]:border-primary data-[status=active]:bg-primary data-[status=active]:text-primary-foreground">
            {i + 1}. {p.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function PageNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const i = PAGES.findIndex((p) => p.to === path);
  const prev = PAGES[i - 1];
  const next = PAGES[i + 1];
  return (
    <div className="mt-5 flex justify-between gap-3">
      {prev ? <Link to={prev.to} className="rounded-lg border bg-card px-3 py-2 text-xs hover:bg-muted">→ {prev.label}</Link> : <span />}
      {next ? <Link to={next.to} className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">{next.label} ←</Link> : <span />}
    </div>
  );
}

export function ContentPage({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <main className="bg-hero min-h-screen px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <p className="mb-1 text-xs font-medium text-muted-foreground">Collection Persona Framework™ · {step} من {PAGES.length}</p>
        <h1 className="mb-4 flex items-center gap-2 text-xl font-bold text-primary">
          <span className="h-6 w-1.5 rounded-full bg-gold" />{title}
        </h1>
        <section className="space-y-4 rounded-2xl border bg-card p-5 leading-loose shadow-card">{children}</section>
        <PageNav />
      </div>
    </main>
  );
}

export function KpiBlock({ name, en, target, note }: { name: string; en: string; target: string; note: string }) {
  return (
    <>
      <div>
        <p className="text-xs text-muted-foreground">اسم المؤشر</p>
        <p className="font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground" dir="ltr">{en}</p>
      </div>
      <div className="rounded-xl bg-secondary p-4">
        <p className="text-xs text-muted-foreground">الهدف الرقمي</p>
        <p className="text-2xl font-bold text-primary">{target}</p>
        <p className="text-sm text-secondary-foreground">{note}</p>
      </div>
    </>
  );
}

export const meta = (title: string, description: string) => ({
  meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
