import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Q1_OPTIONS, Q1_DISQUALIFY, Q2_OPTIONS, Q2_OTHER, Q3_OPTIONS, Q5_OPTIONS,
  Q4_SCALE, Q6_SCALE, Q7_SCALE,
} from "@/lib/survey";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "استبيان دراسة كفاءة قرارات التحصيل المصرفي" },
      { name: "description", content: "شاركنا خبرتك في قرارات التحصيل المصرفي — أقل من 3 دقائق." },
      { property: "og:title", content: "استبيان دراسة كفاءة قرارات التحصيل المصرفي" },
      { property: "og:description", content: "شاركنا خبرتك في قرارات التحصيل المصرفي — أقل من 3 دقائق." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Survey,
});

type Answers = {
  q1?: string; q2?: string; q2_other?: string; q3?: string;
  q4?: number; q5?: string; q6?: number; q7?: number; q8?: string;
};

type Step =
  | { key: "q1" | "q2" | "q3" | "q5"; section: string; title: string; options: string[] }
  | { key: "q4" | "q6" | "q7"; section: string; title: string; scale: string[] }
  | { key: "q8"; section: string; title: string };

const S1 = "الفرز والسلوك الحالي";
const S2 = "تقييم مفهوم المنظومة والتفضيل";
const S3 = "وضوح الهيكلية والانطباعات";

const STEPS: Step[] = [
  { key: "q1", section: S1, title: "ما هو مجال عملك الحالي؟", options: Q1_OPTIONS },
  { key: "q2", section: S1, title: "كيف يتم تحديد \"إجراء وتوقيت التواصل\" مع العميل المتعثر في آلية عملك الحالية عادةً؟", options: Q2_OPTIONS },
  { key: "q3", section: S1, title: "ما هي أكبر صعوبة تشغيلية تلاحظها أثناء عمليات التواصل والتحصيل؟", options: Q3_OPTIONS },
  { key: "q4", section: S2, title: "عند تقديم منظومة تحليلية تُحلل \"أبعاد العميل السلوكية والمالية\" وتَفصل بين مستوى الثقة وجاهزية القرار وتُعطي كود سبب (Reason Code) يوضح تبرير كل قرار، ما مدى أهمية ذلك لك؟", scale: Q4_SCALE },
  { key: "q5", section: S2, title: "أي الأسلوبين تفضل اعتماده أثناء العمل الميداني؟", options: Q5_OPTIONS },
  { key: "q6", section: S2, title: "إلى أي مدى تعتقد أن تحديد \"التوقيت الأنسب للرد\" (المستخرج من سجلات الاتصال التاريخية) و\"القناة المفضلة\" يساعد في تقليل المحاولات غير المنتجة؟", scale: Q6_SCALE },
  { key: "q7", section: S3, title: "ما مدى وضوح وفهم التسلسل المنطقي للمراحل الـ 12 (استلام البيانات ← التحليل والأبعاد ← فحص الجاهزية ← محرك القرار والتوصية ← القياس والتحديث)؟", scale: Q7_SCALE },
  { key: "q8", section: S3, title: "ما هي مقترحاتك أو ملاحظاتك لتطوير هذه المنظومة لترفع من كفاءة القرار في التحصيل المصرفي؟" },
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
    step.key === "q8" ? true :
    step.key === "q2" && value === Q2_OTHER ? !!a.q2_other?.trim() :
    value !== undefined && value !== "";

  async function submit(final: Answers, disqualified: boolean) {
    setSending(true); setErr(null);
    const { error } = await supabase.from("survey_responses").insert({
      q1: final.q1!, q2: final.q2 ?? null,
      q2_other: final.q2 === Q2_OTHER ? final.q2_other?.trim().slice(0, 500) ?? null : null,
      q3: final.q3 ?? null, q4: final.q4 ?? null, q5: final.q5 ?? null,
      q6: final.q6 ?? null, q7: final.q7 ?? null,
      q8: final.q8?.trim().slice(0, 3000) || null, disqualified,
    });
    setSending(false);
    if (error) { setErr("تعذر إرسال الإجابة، حاول مرة أخرى."); return; }
    setStage(disqualified ? "out" : "done");
  }

  function next() {
    if (step.key === "q1" && a.q1 === Q1_DISQUALIFY) void submit(a, true);
    else if (i === STEPS.length - 1) void submit(a, false);
    else setI(i + 1);
  }

  return (
    <main className="bg-hero min-h-screen px-4 py-8 sm:py-14">
      <div className="mx-auto max-w-xl">
        <header className="mb-6 flex items-center gap-3">
          <div className="h-10 w-1.5 rounded-full bg-gold" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">استبيان تحقق</p>
            <h1 className="text-lg font-bold leading-snug text-primary sm:text-xl">
              دراسة كفاءة قرارات التحصيل المصرفي والتحليل السلوكي
            </h1>
          </div>
        </header>

        <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-8">
          {stage === "intro" && (
            <div className="space-y-6">
              <p className="leading-loose text-card-foreground">
                أهلاً بك. نهدف من خلال هذا الاستبيان القصير (يستغرق أقل من 3 دقائق) إلى استطلاع الآراء والخبرات التشغيلية حول آليات اتخاذ القرار في التحصيل المصرفي وتحديد أفضل القنوات والأوقات للتواصل مع العملاء. مشاركتك تطوعية وستعامل جميع الإجابات بسرية تامة لأغراض البحث والتطوير فقط. شكراً لوقتك ومساهمتك.
              </p>
              <button onClick={() => setStage("q")} className="w-full rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground transition hover:opacity-90">
                أوافق وأبدأ
              </button>
            </div>
          )}

          {stage === "q" && (
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                  <span>{step.section}</span>
                  <span>سؤال {i + 1} من {STEPS.length}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${((i + 1) / STEPS.length) * 100}%` }} />
                </div>
              </div>

              <h2 className="text-base font-semibold leading-relaxed sm:text-lg">{step.title}</h2>

              {"options" in step && (
                <div className="space-y-2.5">
                  {step.options.map((o) => {
                    const sel = value === o;
                    return (
                      <button key={o} onClick={() => setA({ ...a, [step.key]: o })}
                        className={`w-full rounded-xl border p-3.5 text-start text-sm leading-relaxed transition ${sel ? "border-primary bg-secondary text-secondary-foreground ring-2 ring-primary/30" : "bg-card hover:bg-muted"}`}>
                        {o === Q2_OTHER && step.key === "q2" ? "أخرى (يرجى التحديد)" : o}
                      </button>
                    );
                  })}
                  {step.key === "q2" && a.q2 === Q2_OTHER && (
                    <input autoFocus maxLength={500} value={a.q2_other ?? ""} onChange={(e) => setA({ ...a, q2_other: e.target.value })}
                      placeholder="يرجى التحديد" className="w-full rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  )}
                </div>
              )}

              {"scale" in step && (
                <div className="space-y-2">
                  {step.scale.map((label, idx) => {
                    const n = idx + 1; const sel = value === n;
                    return (
                      <button key={n} onClick={() => setA({ ...a, [step.key]: n })}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-start text-sm transition ${sel ? "border-primary bg-secondary ring-2 ring-primary/30" : "bg-card hover:bg-muted"}`}>
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg font-bold ${sel ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{n}</span>
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {step.key === "q8" && (
                <textarea rows={5} maxLength={3000} value={a.q8 ?? ""} onChange={(e) => setA({ ...a, q8: e.target.value })}
                  placeholder="اكتب ملاحظاتك هنا (اختياري)" className="w-full rounded-xl border bg-background p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring" />
              )}

              {err && <p className="text-sm text-destructive">{err}</p>}

              <div className="flex gap-3 pt-2">
                {i > 0 && (
                  <button onClick={() => setI(i - 1)} className="rounded-xl border px-5 py-3 text-sm font-medium hover:bg-muted">السابق</button>
                )}
                <button disabled={!canNext || sending} onClick={next}
                  className="flex-1 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-40">
                  {sending ? "جارٍ الإرسال..." : i === STEPS.length - 1 ? "إرسال" : "التالي"}
                </button>
              </div>
            </div>
          )}

          {(stage === "done" || stage === "out") && (
            <div className="space-y-3 py-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-2xl text-primary">✓</div>
              <h2 className="text-xl font-bold text-primary">شكراً لك</h2>
              <p className="leading-loose text-muted-foreground">
                {stage === "done"
                  ? "نشكرك جزيلاً على وقتك ومشاركتك القيمة، إجاباتك ستساهم بشكل مباشر في تطوير وتحديث أدلة التحقق الخاصة بالمشروع."
                  : "نشكرك على وقتك. هذا الاستبيان مخصص للعاملين في مجالات التحصيل والمخاطر والاستشارات المالية."}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
