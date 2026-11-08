import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  QUESTIONS, Q1_OPTIONS, Q1_DISQUALIFY, Q2_OPTIONS, Q3_SCALE, Q4_OPTIONS, IMP_SCALE, HELP_SCALE, Q9_OPTIONS,
} from "@/lib/survey";

const TITLE = "استبيان تقييم فكرة CPF™";
const DESC = "استبيان لأخصائيي التحصيل لتقييم إطار Collection Persona Framework™.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Survey,
});

type Answers = {
  q1?: string; q2?: string[]; q3?: number; q4?: string; q5?: number;
  q6?: number; q7?: number; q8?: number; q9?: string; q10?: string;
};
type Key = keyof Answers;
type Step =
  | { key: Key; kind: "single"; options: string[]; hint?: string }
  | { key: Key; kind: "multi"; options: string[]; hint?: string }
  | { key: Key; kind: "scale"; scale: string[] }
  | { key: Key; kind: "text" };

const STEPS: Step[] = [
  { key: "q1", kind: "single", options: Q1_OPTIONS },
  { key: "q2", kind: "multi", options: Q2_OPTIONS, hint: "يمكن اختيار أكثر من إجابة" },
  { key: "q3", kind: "scale", scale: Q3_SCALE },
  { key: "q4", kind: "single", options: Q4_OPTIONS },
  { key: "q5", kind: "scale", scale: IMP_SCALE },
  { key: "q6", kind: "scale", scale: HELP_SCALE },
  { key: "q7", kind: "scale", scale: IMP_SCALE },
  { key: "q8", kind: "scale", scale: HELP_SCALE },
  { key: "q9", kind: "single", options: Q9_OPTIONS, hint: "اختر إجابة واحدة" },
  { key: "q10", kind: "text" },
];

function Survey() {
  const [stage, setStage] = useState<"intro" | "q" | "done" | "out">("intro");
  const [i, setI] = useState(0);
  const [a, setA] = useState<Answers>({});
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const step = STEPS[i]!;
  const value = a[step.key];
  const canNext =
    step.kind === "text" ? true :
    step.kind === "multi" ? Array.isArray(value) && value.length > 0 :
    value !== undefined;

  async function submit(f: Answers, disqualified: boolean) {
    setSending(true); setErr(null);
    const { error } = await supabase.from("cpf_responses").insert({
      q1: f.q1!, q2: f.q2 ?? null, q3: f.q3 ?? null, q4: f.q4 ?? null, q5: f.q5 ?? null,
      q6: f.q6 ?? null, q7: f.q7 ?? null, q8: f.q8 ?? null, q9: f.q9 ?? null,
      q10: f.q10?.trim().slice(0, 3000) || null, disqualified,
    });
    setSending(false);
    if (error) { setErr("تعذّر حفظ الإجابات. حاول مرة أخرى."); return; }
    setStage(disqualified ? "out" : "done");
  }

  function next() {
    if (step.key === "q1" && a.q1 === Q1_DISQUALIFY) void submit(a, true);
    else if (i === STEPS.length - 1) void submit(a, false);
    else setI(i + 1);
  }

  function toggle(o: string) {
    const cur = a.q2 ?? [];
    setA({ ...a, q2: cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o] });
  }

  const optBtn = (sel: boolean) =>
    `flex w-full items-center gap-3 rounded-xl border p-3.5 text-start text-sm leading-relaxed transition ${sel ? "border-primary bg-secondary text-secondary-foreground ring-2 ring-primary/30" : "bg-card hover:bg-muted"}`;

  return (
    <main className="bg-hero min-h-screen px-4 py-8 sm:py-14">
      <div className="mx-auto max-w-xl">
        <header className="mb-6 flex items-center gap-3">
          <div className="h-10 w-1.5 rounded-full bg-gold" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">استبيان تقييم فكرة</p>
            <h1 className="text-lg font-bold leading-snug text-primary sm:text-xl">
              Collection Persona Framework™ (CPF™)
            </h1>
          </div>
        </header>

        <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-8">
          {stage === "intro" && (
            <div className="space-y-5 leading-loose text-card-foreground">
              <p>
                عزيزي أخصائي التحصيل، يهدف هذا الاستبيان إلى التعرف على التحديات التي تواجهك في التعامل مع العملاء المتعثرين، وقياس الحاجة إلى إطار تحليلي يساعد على فهم اختلاف خصائص العملاء وتصنيفهم.
              </p>
              <div className="rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
                <p className="mb-1 font-semibold">نبذة عن الفكرة:</p>
                إطار تحليلي وتشغيلي يصنّف العملاء المتعثرين ضمن ثماني شخصيات، استنادًا إلى سبعة أبعاد: القدرة على السداد، إمكانية الوصول، التفاعل، الالتزام بوعود السداد، سلوك قنوات التواصل، العوائق التي تواجه العميل، وتعقيد الحالة. ويعرض درجة تحليلية ومبررات التصنيف والتوصية بالإجراء المناسب.
              </div>
              <p className="rounded-xl border border-gold bg-accent p-3 text-sm text-accent-foreground">
                يرجى الإجابة بناءً على خبرتك العملية، مع عدم إدراج أي بيانات تعريفية أو مصرفية تخص العملاء.
              </p>
              <button onClick={() => setStage("q")} className="w-full rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground transition hover:opacity-90">
                ابدأ الاستبيان
              </button>
            </div>
          )}

          {stage === "q" && (
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex justify-end text-xs text-muted-foreground">
                  <span>سؤال {i + 1} من {STEPS.length}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${((i + 1) / STEPS.length) * 100}%` }} />
                </div>
              </div>

              <h2 className="text-base font-semibold leading-relaxed sm:text-lg">
                {i + 1}. {QUESTIONS[step.key]}
                {"hint" in step && step.hint && <span className="block text-sm font-normal text-muted-foreground">({step.hint})</span>}
              </h2>

              {step.kind === "single" && (
                <div className="space-y-2.5">
                  {step.options.map((o) => (
                    <button key={o} onClick={() => setA({ ...a, [step.key]: o })} className={optBtn(value === o)}>{o}</button>
                  ))}
                </div>
              )}

              {step.kind === "multi" && (
                <div className="space-y-2.5">
                  {step.options.map((o) => {
                    const sel = (a.q2 ?? []).includes(o);
                    return (
                      <button key={o} onClick={() => toggle(o)} className={optBtn(sel)}>
                        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded border text-xs ${sel ? "border-primary bg-primary text-primary-foreground" : ""}`}>{sel ? "✓" : ""}</span>
                        {o}
                      </button>
                    );
                  })}
                </div>
              )}

              {step.kind === "scale" && (
                <div className="space-y-2">
                  {step.scale.map((label, idx) => {
                    const n = idx + 1; const sel = value === n;
                    return (
                      <button key={n} onClick={() => setA({ ...a, [step.key]: n })} className={optBtn(sel)}>
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg font-bold ${sel ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{n}</span>
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {step.kind === "text" && (
                <textarea rows={5} maxLength={3000} value={a.q10 ?? ""} onChange={(e) => setA({ ...a, q10: e.target.value })}
                  placeholder="اكتب إجابتك هنا (اختياري)" className="w-full rounded-xl border bg-background p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring" />
              )}

              {err && <p className="text-sm text-destructive">{err}</p>}

              <div className="flex gap-3 pt-2">
                {i > 0 && (
                  <button onClick={() => setI(i - 1)} className="rounded-xl border px-5 py-3 text-sm font-medium hover:bg-muted">السابق</button>
                )}
                <button disabled={!canNext || sending} onClick={next}
                  className="flex-1 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-40">
                  {sending ? "جارٍ الإرسال..." : i === STEPS.length - 1 ? "إرسال الإجابات" : "التالي"}
                </button>
              </div>
            </div>
          )}

          {(stage === "done" || stage === "out") && (
            <div className="space-y-3 py-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-2xl text-primary">✓</div>
              <h2 className="text-xl font-bold text-primary">شكرًا لمشاركتك</h2>
              <p className="leading-loose text-muted-foreground">
                {stage === "done"
                  ? "تم تسجيل إجابتك. نقدّر وقتك وخبرتك في تطوير Collection Persona Framework™."
                  : "نشكرك على وقتك. هذا الاستبيان مخصص للعاملين في مجال تحصيل الديون المتعثرة للأفراد."}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
