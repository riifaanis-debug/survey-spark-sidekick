import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, KpiBlock, meta } from "@/components/SiteNav";

export const Route = createFileRoute("/kpi-2")({
  head: () => meta("المؤشر الداعم الثاني — CPF™", "متوسط درجة سهولة ووضوح الحل SEQ: الهدف 5.5 من 7 أو أعلى."),
  component: () => (
    <ContentPage step={5} title="المؤشر الداعم الثاني والهدف">
      <KpiBlock name="متوسط درجة سهولة ووضوح الحل المباشر" en="Single Ease Question - SEQ"
        target="5.5 من 7 أو أعلى" note="متوسط الدرجة عقب تجربة النموذج." />
    </ContentPage>
  ),
});
