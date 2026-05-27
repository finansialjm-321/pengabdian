
-- News table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  news_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news"
  ON public.news FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert news"
  ON public.news FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update news"
  ON public.news FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete news"
  ON public.news FOR DELETE
  TO authenticated
  USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER news_set_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage bucket for news images
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view news images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

CREATE POLICY "Authenticated can upload news images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'news-images');

CREATE POLICY "Authenticated can update news images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'news-images');

CREATE POLICY "Authenticated can delete news images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'news-images');
