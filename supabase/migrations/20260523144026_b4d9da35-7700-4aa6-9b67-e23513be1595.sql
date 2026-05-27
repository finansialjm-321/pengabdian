
-- Role infrastructure
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-grant admin to the first user (bootstrap)
CREATE OR REPLACE FUNCTION public.bootstrap_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_bootstrap_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.bootstrap_admin();

-- Tighten news write policies to admins only
DROP POLICY "Authenticated users can insert news" ON public.news;
DROP POLICY "Authenticated users can update news" ON public.news;
DROP POLICY "Authenticated users can delete news" ON public.news;

CREATE POLICY "Admins can insert news"
  ON public.news FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update news"
  ON public.news FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete news"
  ON public.news FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Tighten storage policies for news-images
DROP POLICY "Public can view news images" ON storage.objects;
DROP POLICY "Authenticated can upload news images" ON storage.objects;
DROP POLICY "Authenticated can update news images" ON storage.objects;
DROP POLICY "Authenticated can delete news images" ON storage.objects;

CREATE POLICY "Public can read news images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

CREATE POLICY "Admins can upload news images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update news images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete news images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'));
