import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlarmClock,
  BookOpen,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { BrandMark } from "@/components/BrandMark";
import { ActivityDialog, type ActivityDraft } from "@/components/ActivityDialog";
import { Button } from "@/components/ui/button";
import {
  type Activity,
  formatDue,
  isLate,
  isToday,
  sortByDue,
  statusOf,
} from "@/lib/activities";

export const Route = createFileRoute("/inicio")({
  head: () => ({
    meta: [
      { title: "Início — AlertCampus" },
      {
        name: "description",
        content:
          "Tela inicial do AlertCampus após o login: resumo de atividades, prazos do dia e próximas entregas do estudante.",
      },
      { property: "og:title", content: "Início — AlertCampus" },
      {
        property: "og:description",
        content: "Resumo visual das atividades acadêmicas, prazos e alertas do estudante.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InicioPage,
});

const estilos: Record<string, { rotulo: string; classe: string }> = {
  hoje: { rotulo: "Hoje", classe: "bg-primary/15 text-primary" },
  atrasada: { rotulo: "Atrasada", classe: "bg-destructive/15 text-destructive" },
  proxima: { rotulo: "Próxima", classe: "bg-accent/15 text-accent" },
  concluida: { rotulo: "Concluída", classe: "bg-muted text-muted-foreground" },
};

function badgeOf(activity: Activity) {
  if (activity.completed) return estilos["concluida"]!;
  if (isLate(activity)) return estilos["atrasada"]!;
  if (isToday(activity)) return estilos["hoje"]!;
  return estilos["proxima"]!;
}

function InicioPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session, user, loading } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/entrar", replace: true });
  }, [loading, session, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("due_date", { ascending: true });
      if (error) throw error;
      return data as Activity[];
    },
  });

  const createActivity = useMutation({
    mutationFn: async (draft: ActivityDraft) => {
      const { error } = await supabase
        .from("activities")
        .insert({ ...draft, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", user?.id] });
      setDialogOpen(false);
      toast.success("Atividade cadastrada.");
    },
    onError: () => toast.error("Não foi possível salvar a atividade."),
  });

  const toggleActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const { error } = await supabase
        .from("activities")
        .update({
          completed: !activity.completed,
          completed_at: activity.completed ? null : new Date().toISOString(),
        })
        .eq("id", activity.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities", user?.id] }),
    onError: () => toast.error("Não foi possível alterar o status."),
  });

  const { hoje, atrasadas, concluidas, lista, proximo } = useMemo(() => {
    const sorted = [...activities].sort(sortByDue);
    const pendentes = sorted.filter((a) => !a.completed);
    return {
      hoje: sorted.filter(isToday).length,
      atrasadas: sorted.filter(isLate).length,
      concluidas: sorted.filter((a) => a.completed).length,
      lista: [...pendentes, ...sorted.filter((a) => a.completed)].slice(0, 6),
      proximo: pendentes[0] ?? null,
    };
  }, [activities]);

  const firstName = (profile?.full_name || user?.email?.split("@")[0] || "estudante").split(" ")[0];

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/entrar", replace: true });
  }

  if (loading || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-4">
          <BrandMark size={40} />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Bem-vindo de volta</p>
            <h1 className="truncate text-lg font-semibold">Olá, {firstName}</h1>
          </div>
          <Button variant="ghost" size="icon" aria-label="Notificações">
            <Bell className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Sair" onClick={handleSignOut}>
            <LogOut className="size-5" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-8 pb-28">
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { icone: CalendarDays, valor: hoje, rotulo: "Para hoje" },
            { icone: AlarmClock, valor: atrasadas, rotulo: "Atrasadas" },
            { icone: CheckCircle2, valor: concluidas, rotulo: "Concluídas" },
          ].map((c) => (
            <div
              key={c.rotulo}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
            >
              <c.icone className="mb-3 size-5 text-primary" />
              <p className="text-3xl font-semibold leading-none">{c.valor}</p>
              <p className="mt-2 text-sm text-muted-foreground">{c.rotulo}</p>
            </div>
          ))}
        </section>

        {proximo && (
          <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground shadow-brand">
            <p className="text-sm/relaxed opacity-90">Próximo prazo</p>
            <h2 className="mt-1 text-2xl font-semibold">{proximo.title}</h2>
            <p className="mt-2 text-sm opacity-90">
              {proximo.subject ? `${proximo.subject} · ` : ""}
              {formatDue(proximo)}
            </p>
          </section>
        )}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Suas atividades</h2>
            <Link to="/painel" className="flex items-center gap-1 text-sm text-primary">
              Ver todas <ChevronRight className="size-4" />
            </Link>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando atividades...</p>
          ) : lista.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma atividade cadastrada ainda.
              </p>
              <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                <Plus className="size-4" /> Cadastrar atividade
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {lista.map((item) => {
                const estilo = badgeOf(item);
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
                  >
                    <button
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted"
                      onClick={() => toggleActivity.mutate(item)}
                      aria-label={item.completed ? "Reabrir atividade" : "Concluir atividade"}
                    >
                      {statusOf(item) === "concluida" ? (
                        <CheckCircle2 className="size-5 text-success" />
                      ) : (
                        <BookOpen className="size-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate font-medium ${
                          item.completed ? "text-muted-foreground line-through" : ""
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {item.subject ? `${item.subject} · ` : ""}
                        {formatDue(item)}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${estilo.classe}`}>
                      {estilo.rotulo}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center">
        <Button
          size="lg"
          className="pointer-events-auto rounded-full shadow-brand"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="size-5" /> Nova atividade
        </Button>
      </div>

      <ActivityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        saving={createActivity.isPending}
        onSubmit={async (draft) => {
          await createActivity.mutateAsync(draft);
        }}
      />
    </div>
  );
}
