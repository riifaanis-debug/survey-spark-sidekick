import { createServerFn } from "@tanstack/react-start";

export const getResults = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => ({ password: String(d?.password ?? "").slice(0, 200) }))
  .handler(async ({ data }) => {
    const { createHash, timingSafeEqual } = await import("node:crypto");
    const expected = process.env["RESULTS_PASSWORD"];
    if (!expected) return { ok: false as const, error: "لم يتم ضبط كلمة المرور بعد" };
    const a = createHash("sha256").update(data.password).digest();
    const b = createHash("sha256").update(expected).digest();
    if (!timingSafeEqual(a, b)) return { ok: false as const, error: "كلمة المرور غير صحيحة" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return { ok: false as const, error: "تعذر جلب النتائج" };
    return { ok: true as const, rows: rows ?? [] };
  });
