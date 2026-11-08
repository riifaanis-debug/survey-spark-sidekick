import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, meta } from "@/components/SiteNav";

export const Route = createFileRoute("/")({
  head: () => meta("الفكرة والشريحة المستهدفة — CPF™", "Collection Persona Framework™: مسارات تسوية وجدولة رقمية مخصصة للعملاء المتعثرين."),
  component: () => (
    <ContentPage step={1} title="الفكرة والشريحة المستهدفة">
      <div>
        <p className="text-xs font-semibold text-muted-foreground">الفكرة</p>
        <p><b className="text-primary">Collection Persona Framework™</b> — تقديم مسارات تسوية وإعادة جدولة رقمية مخصصة للعملاء المتعثرين بناءً على تحليل الشخصية السلوكية والقناة والتوقيت الأنسب للتواصل لمنع الإرهاق الاتصالي وتكثيف الاستجابة.</p>
      </div>
      <div className="rounded-xl bg-secondary p-4">
        <p className="text-xs font-semibold text-muted-foreground">الشريحة المستهدفة</p>
        <p className="font-semibold text-secondary-foreground">العملاء المتعثرين في سداد التسهيلات المصرفية (تمويل شخصي / بطاقات ائتمانية / تمويل تأجيري)</p>
      </div>
    </ContentPage>
  ),
});
