import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { getResults } from "@/lib/results.functions";
import {
  QUESTIONS, Q1_OPTIONS, Q2_OPTIONS, Q3_SCALE, Q4_OPTIONS, IMP_SCALE, HELP_SCALE, Q9_OPTIONS, YES,
  TARGET_RESPONSES, positiveShare,
} from "@/lib/survey";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "نتائج استبيان CPF™" },
      { name: "description", content: "لوحة نتائج استبيان تقييم فكرة CPF™." },
      { property: "og:title", content: "نتائج استبيان CPF™" },
      { property: "og:description", content: "لوحة نتائج استبيان تقييم فكرة CPF™." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Results,
});

type Row = {
  id: string; q1: string; q2: string[] | null; q3: number | null; q4: string | null; q5: number | null;
  q6: number | null; q7: number | null; q8: number | null; q9: string | null; q10: string | null;
  disqualified: boolean; created_at: string;
};

function Bars({ title, options, counts, total, labels }: { title: string; options: (string | number)[]; counts: number[]; total: number; labels?: string[] }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold leading-relaxed">{title}</h3>
      <div className="space-y-2.5">
        {options.map((o, idx) => {
          const c = counts[idx] ?? 0;
          const pct = total ? Math.round((c / total) * 1000) / 10 : 0;
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

const single = (opts: (string | number)[], vals: (string | number | null)[]) => {
  const c = opts.map((o) => vals.filter((v) => v === o).length);
  return { counts: c, total: vals.filter((v) => v !== null).length };
};
const scaleLabels = (s: string[]) => s.map((l, i) => `${i + 1} – ${l}`);
const pctTxt = (r: number) => `${Math.round(r * 1000) / 10}%`;

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
  const q3 = q.map((r) => r.q3).filter((x): x is number => x !== null);
  const q3avg = q3.length ? (q3.reduce((s, x) => s + x, 0) / q3.length).toFixed(2) : "—";
  const q4ans = q.filter((r) => r.q4).length;
  const q4yes = q4ans ? q.filter((r) => r.q4 === YES).length / q4ans : 0;

  function exportCsv() {
    const head = ["التاريخ", ...Object.keys(QUESTIONS).map((k) => "س" + k.slice(1)), "مستبعد"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = (rows ?? []).map((r) => [r.created_at, r.q1, (r.q2 ?? []).join(" | "), r.q3, r.q4, r.q5, r.q6, r.q7, r.q8, r.q9, r.q10, r.disqualified ? "نعم" : "لا"].map(esc).join(","));
    const blob = new Blob(["\uFEFF" + [head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "cpf-results.csv"; a.click();
  }

  if (!rows) {
    return (
      <main className="bg-hero grid min-h-screen place-items-center px-4">
        <form onSubmit={load} className="w-full max-w-sm space-y-4 rounded-2xl border bg-card p-6 shadow-card">
          <h1 className="text-lg font-bold text-primary">نتائج استبيان CPF™</h1>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="الرقم السري"
            className="w-full rounded-xl border bg-background p-3 outline-none focus:ring-2 focus:ring-ring" />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button disabled={loading || !pw} className="w-full rounded-xl bg-primary py-2.5 font-semibold text-primary-foreground disabled:opacity-40">
            {loading ? "جارٍ التحميل..." : "عرض النتائج"}
          </button>
        </form>
      </main>
    );
  }

  const n = q.length;
  const scales = [
    ["q3", Q3_SCALE], ["q5", IMP_SCALE], ["q6", HELP_SCALE], ["q7", IMP_SCALE], ["q8", HELP_SCALE],
  ] as const;

  return (
    <main className="bg-hero min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-primary">نتائج استبيان CPF™</h1>
          <div className="flex gap-2">
            <button onClick={() => load()} className="rounded-xl border bg-card px-4 py-2 text-sm hover:bg-muted">تحديث</button>
            <button onClick={exportCsv} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">تصدير CSV</button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5"><p className="text-xs text-muted-foreground">حجم العينة</p><p className="mt-1 text-3xl font-bold">{n}<span className="text-base text-muted-foreground"> / {TARGET_RESPONSES}</span></p></div>
          <div className="rounded-2xl border bg-card p-5"><p className="text-xs text-muted-foreground">مستبعدون (لا يعملون في التحصيل)</p><p className="mt-1 text-3xl font-bold">{out}</p></div>
          <div className="rounded-2xl border bg-card p-5"><p className="text-xs text-muted-foreground">متوسط صعوبة اختيار الإجراء (س3)</p><p className="mt-1 text-3xl font-bold">{q3avg}<span className="text-base text-muted-foreground"> / 5</span></p></div>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold">التحليل الإجمالي</h3>
          <table className="w-full text-sm">
            <tbody>
              {[
                ["من يرون اختلاف أساليب التحصيل بين العملاء المتشابهين (س4 = نعم)", pctTxt(q4yes)],
                ["أهمية السلوك والالتزام (س5)", pctTxt(positiveShare(q.map((r) => r.q5)))],
                ["فائدة تحليل الأبعاد السبعة (س6)", pctTxt(positiveShare(q.map((r) => r.q6)))],
                ["أهمية مبررات التصنيف والتوصية (س7)", pctTxt(positiveShare(q.map((r) => r.q7)))],
                ["توقع فائدة تصنيف الشخصيات (س8)", pctTxt(positiveShare(q.map((r) => r.q8)))],
              ].map(([k, v]) => (
                <tr key={k} className="border-b last:border-0"><td className="py-2 text-muted-foreground">{k}</td><td className="py-2 font-semibold">{v}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted-foreground">النسب الإيجابية في أسئلة المقياس تعني اختيار 4 أو 5 من 5.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Bars title={`1. ${QUESTIONS.q1}`} options={Q1_OPTIONS} {...single(Q1_OPTIONS, (rows ?? []).map((r) => r.q1))} />
          <Bars title={`2. ${QUESTIONS.q2} (نسبة من العينة)`} options={Q2_OPTIONS}
            counts={Q2_OPTIONS.map((o) => q.filter((r) => r.q2?.includes(o)).length)} total={n} />
          <Bars title={`4. ${QUESTIONS.q4}`} options={Q4_OPTIONS} {...single(Q4_OPTIONS, q.map((r) => r.q4))} />
          <Bars title={`9. ${QUESTIONS.q9}`} options={Q9_OPTIONS} {...single(Q9_OPTIONS, q.map((r) => r.q9))} />
          {scales.map(([k, s]) => (
            <Bars key={k} title={`${k.slice(1)}. ${QUESTIONS[k]}`} options={[1, 2, 3, 4, 5]} labels={scaleLabels(s)}
              {...single([1, 2, 3, 4, 5], q.map((r) => r[k]))} />
          ))}
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold leading-relaxed">10. {QUESTIONS.q10}</h3>
          <ul className="space-y-2 text-sm">
            {q.filter((r) => r.q10).map((r) => (
              <li key={r.id} className="rounded-xl bg-muted p-3 leading-relaxed">{r.q10}</li>
            ))}
            {!q.some((r) => r.q10) && <li className="text-muted-foreground">لا توجد إجابات بعد.</li>}
          </ul>
        </div>
      </div>
    </main>
  );
}
