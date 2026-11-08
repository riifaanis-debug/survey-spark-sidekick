import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, meta } from "@/components/SiteNav";

const KPIS = ["المؤشر الرئيسي (نسبة التفضيل)", "المؤشر الداعم 1 (نجاح الإتمام)", "المؤشر الداعم 2 (درجة السهولة SEQ)"];
const ROWS: [string, string, string[]][] = [
  ["محدد", "Specific", ["يركز على سلوك وتفضيل شريحة العملاء المتعثرين.", "يقيس إتمام تجربة الحل الرقمي بدقة.", "يقيس سهولة الفهم والوصول للحل."]],
  ["قابل للقياس الآن", "Measurable Now", ["يُقاس فوراً عبر استبيان لـ 15 مشاركاً.", "يُقاس عبر اختبار استخدام موجه لـ 3 أشخاص.", "يُسجل عقب اختبار المهمة مباشرة."]],
  ["مرتبط بالمسار", "Linked to Track", ["يرتبط بخفض الجهد المالي والوصول لنسبة استجابة أعلى.", "يرتبط بتفعيل الخدمة الذاتية وتسهيل السداد.", "يضمن وضوح خطة السداد وتفادي التعقيد."]],
  ["له هدف مسبق", "Has a Target", ["محدد بـ 70%+ (11 من 15) قبل جمع البيانات.", "محدد بـ 3 من 3 (100%).", "محدد بـ 5.5 من 7 أو أعلى."]],
];

export const Route = createFileRoute("/validation")({
  head: () => meta("التحقق من المؤشرات — CPF™", "التحقق من المؤشرات وفق المعايير الأربعة للمؤشر الفعّال."),
  component: () => (
    <ContentPage step={6} title="التحقق من المؤشرات وفق المعايير الأربعة">
      {KPIS.map((k, ki) => (
        <div key={k} className="rounded-xl border p-4">
          <p className="mb-2 font-semibold text-primary">{k}</p>
          <ul className="space-y-2 text-sm">
            {ROWS.map(([ar, en, v]) => (
              <li key={en} className="flex gap-2">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success text-[10px] text-primary-foreground">✓</span>
                <span><b>{ar}</b> <span className="text-xs text-muted-foreground" dir="ltr">({en})</span>: نعم؛ {v[ki]}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </ContentPage>
  ),
});
