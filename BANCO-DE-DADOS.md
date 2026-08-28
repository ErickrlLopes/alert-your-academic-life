# AlertCampus — Guia do banco de dados

Este documento reúne tudo que você precisa para montar/entender o banco por fora.

## 1. Estrutura atual

Duas tabelas no schema `public`:

### `profiles`

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid (PK) | mesmo id do usuário autenticado |
| `full_name` | text | nome exibido no painel |
| `created_at` | timestamptz | criado automaticamente |

### `activities`

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid (PK) | gerado automaticamente |
| `user_id` | uuid | dono da atividade |
| `title` | text | obrigatório |
| `description` | text | opcional |
| `subject` | text | disciplina |
| `type` | enum `activity_type` | trabalho, prova, seminario, exercicio, projeto, apresentacao, outro |
| `priority` | enum `activity_priority` | baixa, media, alta |
| `due_date` | date | data de entrega |
| `due_time` | time | horário limite (padrão 23:59) |
| `completed` | boolean | status de conclusão |
| `completed_at` | timestamptz | preenchido ao concluir |
| `created_at` | timestamptz | criado automaticamente |

Regras de acesso: cada usuário só enxerga e altera as próprias linhas
(`auth.uid() = user_id`). Ao criar uma conta, um perfil é gerado automaticamente
por um gatilho.

## 2. Script completo

O SQL pronto para rodar está em [`supabase/schema.sql`](supabase/schema.sql).
Basta executá-lo inteiro no editor SQL do seu banco.

O histórico versionado fica em `supabase/migrations/` — cada arquivo é uma
alteração aplicada em ordem cronológica.

## 3. Onde o app fala com o banco

| Arquivo | Papel |
| --- | --- |
| `src/integrations/supabase/client.ts` | conexão (gerado automaticamente, não editar) |
| `src/integrations/supabase/types.ts` | tipos das tabelas (gerado automaticamente) |
| `src/lib/activities.ts` | tipos e regras de status/prazo usados na interface |
| `src/routes/painel.tsx` | todas as leituras e escritas de atividades |
| `src/hooks/useSession.ts` | sessão do usuário logado |

As credenciais ficam em `.env` (`VITE_SUPABASE_URL` e
`VITE_SUPABASE_PUBLISHABLE_KEY`). Trocando esses valores, o app aponta para
outro banco sem mudar código.

## 4. Próximos passos sugeridos

1. Notificações: tabela `notifications` (`user_id`, `activity_id`, `send_at`, `read_at`).
2. Disciplinas fixas: tabela `subjects` para reaproveitar nomes em vez de texto livre.
3. Anexos: bucket de arquivos ligado a `activities.id`.
