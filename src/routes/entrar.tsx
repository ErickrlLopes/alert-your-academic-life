import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar no AlertCampus — Painel acadêmico do estudante" },
      {
        name: "description",
        content:
          "Acesse o AlertCampus para acompanhar prazos, atividades pendentes e entregas atrasadas da sua vida acadêmica.",
      },
      { property: "og:title", content: "Entrar no AlertCampus" },
      {
        property: "og:description",
        content: "Organize. Planeje. Receba alertas. Conquiste.",
      },
    ],
  }),
  component: LoginPage,
});

type Mode = "login" | "signup" | "reset";

function LoginPage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/painel", replace: true });
  }, [loading, session, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Informe um e-mail válido.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "reset") {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/redefinir-senha`,
        });
        if (err) throw err;
        toast.success("Enviamos um link de recuperação para o seu e-mail.");
        setMode("login");
        return;
      }

      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        return;
      }

      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name.trim() },
          },
        });
        if (err) throw err;
        if (!data.session) {
          toast.success("Conta criada! Confirme o e-mail para entrar.");
          setMode("login");
        }
        return;
      }

      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (err) throw err;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível continuar.";
      setError(
        message.includes("Invalid login credentials")
          ? "E-mail ou senha inválidos. Tente novamente."
          : message,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <header className="mb-8 flex flex-col items-center text-center">
          <BrandMark size={76} />
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight">
            <span className="text-gradient-brand">Alert</span>Campus
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Organize. Planeje. Receba alertas. Conquiste.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-brand"
        >
          <h2 className="text-lg font-bold">
            {mode === "login"
              ? "Entrar"
              : mode === "signup"
                ? "Criar conta"
                : "Recuperar senha"}
          </h2>

          {mode === "signup" ? (
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="estudante@email.com"
            />
          </div>

          {mode !== "reset" ? (
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy
              ? "Aguarde..."
              : mode === "login"
                ? "Entrar"
                : mode === "signup"
                  ? "Criar conta"
                  : "Enviar link de recuperação"}
          </Button>

          <div className="flex flex-col items-center gap-2 pt-1 text-sm">
            {mode === "login" ? (
              <>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setMode("reset")}
                >
                  Esqueci minha senha
                </button>
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={() => setMode("signup")}
                >
                  Criar conta
                </button>
              </>
            ) : (
              <button
                type="button"
                className="font-semibold text-primary hover:underline"
                onClick={() => setMode("login")}
              >
                Voltar para o login
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
