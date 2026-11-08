CREATE TABLE public.cpf_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  disqualified boolean NOT NULL DEFAULT false,
  q1 text NOT NULL CHECK (char_length(q1) <= 50),
  q2 text[],
  q3 smallint CHECK (q3 BETWEEN 1 AND 5),
  q4 text CHECK (char_length(q4) <= 100),
  q5 smallint CHECK (q5 BETWEEN 1 AND 5),
  q6 smallint CHECK (q6 BETWEEN 1 AND 5),
  q7 smallint CHECK (q7 BETWEEN 1 AND 5),
  q8 smallint CHECK (q8 BETWEEN 1 AND 5),
  q9 text CHECK (char_length(q9) <= 200),
  q10 text CHECK (char_length(q10) <= 3000),
  CHECK (q2 IS NULL OR array_length(q2, 1) <= 8)
);
GRANT INSERT ON public.cpf_responses TO anon, authenticated;
GRANT ALL ON public.cpf_responses TO service_role;
ALTER TABLE public.cpf_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON public.cpf_responses FOR INSERT TO anon, authenticated WITH CHECK (true);
COMMENT ON TABLE public.survey_responses IS 'DEPRECATED: replaced by cpf_responses';