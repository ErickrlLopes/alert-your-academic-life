import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({
    meta: [
      { title: "Redefinir senha — AlertCampus" },
      {
        name: "description",
        content:
          "Crie uma nova senha para voltar a acompanhar suas atividades acadêmicas no AlertCampus.",
      },
      { property: "og:title", content: "Redefinir senha — AlertCampus" },
      {
        property: "og:description",
        content: "Defina uma nova senha e retome o controle da sua agenda acadêmica.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setBusy(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      toast.success("Senha atualizada com sucesso!");
      navigate({ to: "/painel", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar a senha.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <header className="mb-8 flex flex-col items-center text-center">
          <BrandMark size={68} />
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight">
            Redefinir <span className="text-gradient-brand">senha</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Escolha uma nova senha para sua conta.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-brand"
        >
          {!ready ? (
            <p className="text-sm text-muted-foreground">
              Abra esta página pelo link enviado no seu e-mail para redefinir a senha.
            </p>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirmar senha</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={busy || !ready}>
            {busy ? "Salvando..." : "Salvar nova senha"}
          </Button>

          <button
            type="button"
            className="w-full pt-1 text-sm font-semibold text-primary hover:underline"
            onClick={() => navigate({ to: "/" })}
          >
            Voltar para o login
          </button>
        </form>
      </div>
    </main>
  );
}
