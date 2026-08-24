import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { BrandMark } from "@/components/BrandMark";
import { ActivityCard } from "@/components/ActivityCard";
import { ActivityDialog, type ActivityDraft } from "@/components/ActivityDialog";
import { Button } from "@/components/ui/button";
import {
  type Activity,
  isLate,
  isToday,
  isUpcoming,
  sortByDue,
} from "@/lib/activities";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel acadêmico — AlertCampus" },
      {
        name: "description",
        content:
          "Veja o que precisa da sua atenção hoje: próximas entregas, atividades atrasadas e o resumo das suas obrigações acadêmicas.",
      },
      { property: "og:title", content: "Painel acadêmico — AlertCampus" },
      {
        property: "og:description",
        content: "Atividades de hoje, próximas, atrasadas e concluídas em um só lugar.",
      },
    ],
  }),
  component: PainelPage,
});

function PainelPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session, user, loading } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/", replace: true });
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

  const deleteActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const { error } = await supabase.from("activities").delete().eq("id", activity.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", user?.id] });
      toast.success("Atividade excluída.");
    },
    onError: () => toast.error("Não foi possível excluir a atividade."),
  });

  const groups = useMemo(() => {
    const sorted = [...activities].sort(sortByDue);
    return {
      hoje: sorted.filter(isToday),
      proximas: sorted.filter(isUpcoming),
      atrasadas: sorted.filter(isLate),
      concluidas: sorted.filter((a) => a.completed),
    };
  }, [activities]);

  const summary = [
    { label: "Pendentes", value: groups.hoje.length + groups.proximas.length + groups.atrasadas.length, tone: "text-foreground" },
    { label: "Hoje", value: groups.hoje.length, tone: "text-warning" },
    { label: "Atrasadas", value: groups.atrasadas.length, tone: "text-destructive" },
    { label: "Concluídas", value: groups.concluidas.length, tone: "text-success" },
  ];

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  const firstName = (profile?.full_name || user?.email?.split("@")[0] || "estudante")
    .split(" ")[0];

  if (loading || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando seu painel...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-5 pb-28 pt-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrandMark size={44} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Painel acadêmico
            </p>
            <h1 className="text-2xl font-extrabold leading-tight">Olá, {firstName}!</h1>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sair">
          <LogOut />
        </Button>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Resumo">
        {summary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              {item.label}
            </p>
            <p className={`mt-1 text-2xl font-extrabold ${item.tone}`}>
              {String(item.value).padStart(2, "0")}
            </p>
          </div>
        ))}
      </section>

      {isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Carregando atividades...</p>
      ) : activities.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border p-8 text-center">
          <h2 className="text-lg font-bold">Nenhuma atividade ainda</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cadastre suas obrigações acadêmicas e o AlertCampus mostra o que merece atenção
            primeiro.
          </p>
          <Button className="mt-5" onClick={() => setDialogOpen(true)}>
            <Plus /> Cadastrar atividade
          </Button>
        </div>
      ) : (
        <div className="mt-9 space-y-9">
          <Section title="Para hoje" items={groups.hoje} onToggle={toggleActivity.mutate} onDelete={deleteActivity.mutate} />
          <Section title="Próximas atividades" items={groups.proximas} onToggle={toggleActivity.mutate} onDelete={deleteActivity.mutate} />
          <Section title="Atrasadas" items={groups.atrasadas} tone="destructive" onToggle={toggleActivity.mutate} onDelete={deleteActivity.mutate} />
          <Section title="Concluídas" items={groups.concluidas} onToggle={toggleActivity.mutate} onDelete={deleteActivity.mutate} />
        </div>
      )}

      <Button
        size="icon"
        className="fixed bottom-7 right-7 size-14 rounded-full bg-gradient-brand text-primary-foreground shadow-brand"
        onClick={() => setDialogOpen(true)}
        aria-label="Nova atividade"
      >
        <Plus className="size-6" />
      </Button>

      <ActivityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        saving={createActivity.isPending}
        onSubmit={async (draft) => {
          await createActivity.mutateAsync(draft);
        }}
      />
    </main>
  );
}

function Section({
  title,
  items,
  tone,
  onToggle,
  onDelete,
}: {
  title: string;
  items: Activity[];
  tone?: "destructive";
  onToggle: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <h2
          className={`text-xs font-bold uppercase tracking-[0.2em] ${
            tone === "destructive" ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {title}
        </h2>
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold text-muted-foreground">{items.length}</span>
      </div>
      <div className="space-y-3">
        {items.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
