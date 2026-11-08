import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, meta } from "@/components/SiteNav";

const H = ({ children }: { children: string }) => <mark className="rounded bg-accent px-1 font-semibold text-accent-foreground">{children}</mark>;

export const Route = createFileRoute("/hypothesis")({
  head: () => meta("الفرضية — CPF™", "فرضية تجاوب العملاء المتعثرين مع مسارات التسوية الرقمية الموجهة."),
  component: () => (
    <ContentPage step={2} title="الفرضية">
      <blockquote className="border-s-4 border-gold ps-4 text-base leading-[2.2]">
        "نعتقد أن <H>العملاء المتعثرين</H> سيتجاوبون بنسبة أعلى مع <H>مسارات التسوية والجدولة الرقمية الموجهة</H> لأن <H>التواصل يتم وفقاً لشخصية العميل والقناة والأوقات المفضلة لديه دون تكرار أو إرهاق اتصالي</H>، وسنعرف أننا على صواب عندما تصل <H>نسبة نية الاستجابة والتفضيل للحلول المخصصة</H> إلى <H>70% أو أكثر من المشاركين في الاستبيان (11 من 15)</H>."
      </blockquote>
    </ContentPage>
  ),
});
