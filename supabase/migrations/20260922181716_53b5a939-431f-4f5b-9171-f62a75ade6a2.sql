ALTER TYPE public.activity_type RENAME TO tipo_atividade;
ALTER TYPE public.activity_priority RENAME TO prioridade_atividade;

ALTER TABLE public.profiles RENAME TO perfis;
ALTER TABLE public.perfis RENAME COLUMN full_name TO nome_completo;
ALTER TABLE public.perfis RENAME COLUMN created_at TO criado_em;

ALTER TABLE public.activities RENAME TO atividades;
ALTER TABLE public.atividades RENAME COLUMN user_id TO usuario_id;
ALTER TABLE public.atividades RENAME COLUMN title TO titulo;
ALTER TABLE public.atividades RENAME COLUMN description TO descricao;
ALTER TABLE public.atividades RENAME COLUMN subject TO disciplina;
ALTER TABLE public.atividades RENAME COLUMN type TO tipo;
ALTER TABLE public.atividades RENAME COLUMN priority TO prioridade;
ALTER TABLE public.atividades RENAME COLUMN due_date TO data_entrega;
ALTER TABLE public.atividades RENAME COLUMN due_time TO hora_entrega;
ALTER TABLE public.atividades RENAME COLUMN completed TO concluida;
ALTER TABLE public.atividades RENAME COLUMN completed_at TO concluida_em;
ALTER TABLE public.atividades RENAME COLUMN created_at TO criado_em;

DROP POLICY IF EXISTS "own profile" ON public.perfis;
DROP POLICY IF EXISTS "own activities" ON public.atividades;

CREATE POLICY "proprio perfil" ON public.perfis FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "proprias atividades" ON public.atividades FOR ALL TO authenticated USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfis TO authenticated;
GRANT ALL ON public.perfis TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.atividades TO authenticated;
GRANT ALL ON public.atividades TO service_role;

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
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;