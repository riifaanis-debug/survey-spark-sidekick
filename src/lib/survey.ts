export const Q1_OPTIONS = [
  "موظف / أخصائي تحصيل ديون",
  "أخصائي إدارة مخاطر / ائتمان",
  "مستشار مالي / مدير حالة",
  "مجال آخر",
];
export const Q1_DISQUALIFY = "مجال آخر";

export const Q2_OPTIONS = [
  "بناءً على شريحة أيام التأخير الثابتة (0-30، 31-60، ...)",
  "اجتهاد شخصي وقراءة يدوية لسجل العميل",
  "قوائم اتصال آلية موحدة لجميع العملاء",
  "أخرى",
];
export const Q2_OTHER = "أخرى";

export const Q3_OPTIONS = [
  "كثرة الاتصالات غير المنتجة وعدم الرد (إرهاق التواصل)",
  "صعوبة التمييز بين عدم القدرة الماليّة وبين ضعف الرغبة/التأجيل",
  "تكرار الاعتراضات والنزاعات الموثقة دون معالجتها أولاً",
  "اقتراح حلول مالية غير قابلة للاستدامة بالنسبة للعميل",
];

export const Q5_A = "أسلوب (أ): خطة اتصالات موحدة وثابتة تعتمد فقط على عدد أيام تأخير الدين.";
export const Q5_B =
  "أسلوب (ب): حزمة قرار مخصصة (NBCA) تحدد أفضل إجراء وقناة وتوقيت رد بناءً على تحليل سلوك العميل مع توضيح سبب الاختيار.";
export const Q5_OPTIONS = [Q5_A, Q5_B];

export const Q4_SCALE = ["غير مهم على الإطلاق", "قليل الأهمية", "محايد", "مهم", "مهم جداً"];
export const Q6_SCALE = [
  "لا يساعد إطلاقاً",
  "تأثير ضعيف",
  "تأثير متوسط",
  "يقلل المحاولات بدرجة ملحوظة",
  "يقلل المحاولات بدرجة كبيرة جداً",
];
export const Q7_SCALE = ["معقد وغير واضح", "غير واضح قليلاً", "محايد", "واضح", "واضح ومباشر جداً"];

export const TARGET_RESPONSES = 15;
export const HYPOTHESIS_THRESHOLD = 11 / 15; // ≈73%

/** Hypothesis holds when at least 11 of 15 (≈73%) qualified participants pick option B. */
export function hypothesisResult(bCount: number, total: number) {
  const ratio = total > 0 ? bCount / total : 0;
  return { ratio, met: total > 0 && ratio >= HYPOTHESIS_THRESHOLD - 1e-9 };
}
