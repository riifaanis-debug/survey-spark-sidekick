import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, KpiBlock, meta } from "@/components/SiteNav";

export const Route = createFileRoute("/kpi")({
  head: () => meta("المؤشر الرئيسي والهدف — CPF™", "نسبة نية الاستجابة وتفضيل الحلول السلوكية المخصصة: الهدف 70% أو أكثر."),
  component: () => (
    <ContentPage step={3} title="المؤشر الرئيسي والهدف">
      <KpiBlock name="نسبة نية الاستجابة وتفضيل الحلول السلوكية المخصصة" en="Intent & Preference Rate"
        target="70% أو أكثر" note="11 من أصل 15 مشاركاً في استبيان التحقق يفضلون خيار حزمة القرار المخصصة." />
    </ContentPage>
  ),
});
