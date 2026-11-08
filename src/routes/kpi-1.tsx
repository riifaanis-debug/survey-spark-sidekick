import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, KpiBlock, meta } from "@/components/SiteNav";

export const Route = createFileRoute("/kpi-1")({
  head: () => meta("المؤشر الداعم الأول — CPF™", "نسبة نجاح إتمام التجربة الرقمية للحل دون مساعدة: الهدف 3 من 3."),
  component: () => (
    <ContentPage step={4} title="المؤشر الداعم الأول والهدف">
      <KpiBlock name="نسبة نجاح إتمام التجربة الرقمية للحل دون مساعدة" en="Unaided Digital Journey Completion Rate"
        target="3 من 3 (100%)" note="يكملون تجربة استعراض وقبول التسوية/الجدولة على النموذج التفاعلي دون مساعدة." />
    </ContentPage>
  ),
});
