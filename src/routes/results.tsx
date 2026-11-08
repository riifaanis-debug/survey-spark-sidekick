import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { getResults } from "@/lib/results.functions";
import {
  Q2_OPTIONS, Q3_OPTIONS, Q5_A, Q5_B, Q1_OPTIONS, Q4_SCALE, Q6_SCALE, Q7_SCALE,
  TARGET_RESPONSES, hypothesisResult,
} from "@/lib/survey";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "نتائج الاستبيان — قرارات التحصيل المصرفي" },
      { name: "description", content: "لوحة نتائج استبيان التحقق." },
      { property: "og:title", content: "نتائج الاستبيان" },
      { property: "og:description", content: "لوحة نتائج استبيان التحقق." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Results,
});

type Row = {
  id: string; q1: string; q2: string | null; q2_other: string | null; q3: string | null;
  q4: number | null; q5: string | null; q6: number | null; q7: number | null; q8: string | null;
  disqualified: boolean; created_at: string;
};

function Bars({ title, options, values, labels }: { title: string; options: (string | number)[]; values: (string | number | null)[]; labels?: string[] }) {
  const total = values.filter((v) => v !== null).length;
  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="space-y-2.5">
        {options.map((o, idx) => {
          const c = values.filter((v) => v === o).length;
          const pct = total ? Math.round((c / total) * 100) : 0;
          return (
            <div key={String(o)}>
              <div className="mb-1 flex justify-between gap-3 text-xs"><span className="text-muted-foreground">{labels?.[idx] ?? o}</span><span className="font-medium">{c} ({pct}%)</span></div>
              <div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function avg(v: (number | null)[]) {
  const n = v.filter((x): x is number => x !== null);
  return n.length ? (n.reduce((s, x) => s + x, 0) / n.length).toFixed(2) : "—";
}

function Results() {
  const fetchResults = useServerFn(getResults);
  const [pw, setPw] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(e?: React.FormEvent) {
    e?.preventDefault(); setLoading(true); setErr(null);
    const r = await fetchResults({ data: { password: pw } });
    setLoading(false);
    if (r.ok) setRows(r.rows as Row[]); else setErr(r.error);
  }

  const q = useMemo(() => (rows ?? []).filter((r) => !r.disqualified), [rows]);
  const out = (rows?.length ?? 0) - q.length;
  const bCount = q.filter((r) => r.q5 === Q5_B).length;
  const answeredQ5 = q.filter((r) => r.q5).length;
  const h = hypothesisResult(bCount, answeredQ5);

  function exportCsv() {
    const head = ["التاريخ", "س1", "س2", "س2 أخرى", "س3", "س4", "س5", "س6", "س7", "س8", "مستبعد"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = (rows ?? []).map((r) => [r.created_at, r.q1, r.q2, r.q2_other, r.q3, r.q4, r.q5 === Q5_B ? "ب" : r.q5 === Q5_A ? "أ" : "", r.q6, r.q7, r.q8, r.disqualified ? "نعم" : "لا"].map(esc).join(","));
    const blob = new Blob(["\uFEFF" + [head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "survey-results.csv"; a.click();
  }

  if (!rows) {
    return (
      <main className="bg-hero grid min-h-screen place-items-center px-4">
        <form onSubmit={load} className="w-full max-w-sm space-y-4 rounded-2xl border bg-card p-6 shadow-card">
          <h1 className="text-lg font-bold text-primary">نتائج الاستبيان</h1>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="كلمة المرور"
            className="w-full rounded-xl border bg-background p-3 outline-none focus:ring-2 focus:ring-ring" />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button disabled={loading || !pw} className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-40">
            {loading ? "جارٍ التحميل..." : "عرض النتائج"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="bg-hero min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-primary">نتائج الاستبيان</h1>
          <div className="flex gap-2">
            <button onClick={() => load()} className="rounded-xl border bg-card px-4 py-2 text-sm hover:bg-muted">تحديث</button>
            <button onClick={exportCsv} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">تصدير CSV</button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5"><p className="text-xs text-muted-foreground">إجابات مؤهلة</p><p className="mt-1 text-3xl font-bold">{q.length}<span className="text-base text-muted-foreground"> / {TARGET_RESPONSES}</span></p></div>
          <div className="rounded-2xl border bg-card p-5"><p className="text-xs text-muted-foreground">مستبعدون (مجال آخر)</p><p className="mt-1 text-3xl font-bold">{out}</p></div>
          <div className={`rounded-2xl border p-5 ${h.met ? "border-success bg-secondary" : "bg-card"}`}>
            <p className="text-xs text-muted-foreground">اختاروا أسلوب (ب) — الهدف 73%</p>
            <p className="mt-1 text-3xl font-bold">{Math.round(h.ratio * 100)}%</p>
            <p className={`mt-1 text-sm font-semibold ${h.met ? "text-success" : "text-muted-foreground"}`}>{bCount} من {answeredQ5} · {h.met ? "الفرضية تحققت" : "لم تتحقق بعد"}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {([["س4 الأهمية", "q4"], ["س6 تقليل المحاولات", "q6"], ["س7 الوضوح", "q7"]] as const).map(([t, k]) => (
            <div key={k} className="rounded-2xl border bg-card p-5"><p className="text-xs text-muted-foreground">متوسط {t}</p><p className="mt-1 text-2xl font-bold">{avg(q.map((r) => r[k]))}<span className="text-sm text-muted-foreground"> / 5</span></p></div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Bars title="س1: مجال العمل" options={Q1_OPTIONS} values={(rows ?? []).map((r) => r.q1)} />
          <Bars title="س2: آلية تحديد التواصل" options={Q2_OPTIONS} values={q.map((r) => r.q2)} />
          <Bars title="س3: أكبر صعوبة تشغيلية" options={Q3_OPTIONS} values={q.map((r) => r.q3)} />
          <Bars title="س5: التفضيل" options={[Q5_A, Q5_B]} labels={["أسلوب (أ) — خطة ثابتة", "أسلوب (ب) — حزمة قرار مخصصة NBCA"]} values={q.map((r) => r.q5)} />
          <Bars title="س4: أهمية المنظومة" options={[1, 2, 3, 4, 5]} labels={Q4_SCALE.map((l, i) => `${i + 1} — ${l}`)} values={q.map((r) => r.q4)} />
          <Bars title="س6: أثر التوقيت والقناة" options={[1, 2, 3, 4, 5]} labels={Q6_SCALE.map((l, i) => `${i + 1} — ${l}`)} values={q.map((r) => r.q6)} />
          <Bars title="س7: وضوح الهيكلية" options={[1, 2, 3, 4, 5]} labels={Q7_SCALE.map((l, i) => `${i + 1} — ${l}`)} values={q.map((r) => r.q7)} />
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold">س2 "أخرى" و س8 الملاحظات</h3>
          <ul className="space-y-2 text-sm">
            {q.flatMap((r) => [r.q2_other && `(س2) ${r.q2_other}`, r.q8].filter(Boolean)).map((t, i) => (
              <li key={i} className="rounded-xl bg-muted p-3 leading-relaxed">{t}</li>
            ))}
            {!q.some((r) => r.q8 || r.q2_other) && <li className="text-muted-foreground">لا توجد ملاحظات بعد.</li>}
          </ul>
        </div>
      </div>
    </main>
  );
}
