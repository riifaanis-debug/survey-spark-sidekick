CREATE TABLE public.survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  q1 text NOT NULL,
  q2 text,
  q2_other text,
  q3 text,
  q4 smallint,
  q5 text,
  q6 smallint,
  q7 smallint,
  q8 text,
  disqualified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.survey_responses TO anon, authenticated;
GRANT ALL ON public.survey_responses TO service_role;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a response" ON public.survey_responses
  FOR INSERT TO anon, authenticated WITH CHECK (
    char_length(q1) <= 200 AND coalesce(char_length(q2_other),0) <= 500 AND coalesce(char_length(q8),0) <= 3000
    AND (q4 IS NULL OR q4 BETWEEN 1 AND 5) AND (q6 IS NULL OR q6 BETWEEN 1 AND 5) AND (q7 IS NULL OR q7 BETWEEN 1 AND 5)
  );