-- AlertCampus — banco de dados (PostgreSQL / Supabase) com nomes em português

CREATE TYPE public.tipo_atividade AS ENUM ('trabalho','prova','seminario','exercicio','projeto','apresentacao','outro');
CREATE TYPE public.prioridade_atividade AS ENUM ('baixa','media','alta');

CREATE TABLE public.perfis (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT NOT NULL DEFAULT '',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfis TO authenticated;
GRANT ALL ON public.perfis TO service_role;
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "proprio perfil" ON public.perfis FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.atividades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  disciplina TEXT NOT NULL DEFAULT '',
  tipo public.tipo_atividade NOT NULL DEFAULT 'trabalho',
  prioridade public.prioridade_atividade NOT NULL DEFAULT 'media',
  data_entrega DATE NOT NULL,
  hora_entrega TIME NOT NULL DEFAULT '23:59',
  concluida BOOLEAN NOT NULL DEFAULT false,
  concluida_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.atividades TO authenticated;
GRANT ALL ON public.atividades TO service_role;
ALTER TABLE public.atividades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "proprias atividades" ON public.atividades FOR ALL TO authenticated USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);
CREATE INDEX atividades_usuario_entrega_idx ON public.atividades (usuario_id, data_entrega);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfis (id, nome_completo)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
