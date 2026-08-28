import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BellRing, CalendarClock, CheckCircle2 } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AlertCampus — Organize sua vida acadêmica" },
      {
        name: "description",
        content:
          "AlertCampus reúne trabalhos, provas e seminários em um painel único, com alertas de prazos e controle de entregas atrasadas.",
      },
      { property: "og:title", content: "AlertCampus — Organize sua vida acadêmica" },
      {
        property: "og:description",
        content: "Organize. Planeje. Receba alertas. Conquiste.",
      },
    ],
  }),
  component: WelcomePage,
});

const highlights = [
  {
    icon: CalendarClock,
    title: "Prazos sob controle",
    text: "Trabalhos, provas e seminários organizados por data de entrega.",
  },
  {
    icon: BellRing,
    title: "Alertas do que importa",
    text: "Veja o que vence hoje e o que já ficou atrasado logo na abertura.",
  },
  {
    icon: CheckCircle2,
    title: "Conclusão rápida",
    text: "Marque como concluída e acompanhe sua evolução no semestre.",
  },
];

function WelcomePage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();

  useEffect(() => {
    if (!loading && session) navigate({ to: "/painel", replace: true });
  }, [loading, session, navigate]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-between px-6 py-12">
      <section className="flex flex-1 flex-col items-center justify-center text-center">
        <BrandMark size={104} />
        <h1 className="mt-7 text-4xl font-extrabold tracking-tight">
          <span className="text-gradient-brand">Alert</span>Campus
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Organize. Planeje. Receba alertas. Conquiste.
        </p>

        <ul className="mt-10 w-full space-y-3 text-left">
          {highlights.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="flex gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-bold">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-10 space-y-3">
        <Button asChild className="h-12 w-full bg-gradient-brand text-base font-bold text-primary-foreground shadow-brand">
          <Link to="/entrar">Começar agora</Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/entrar" className="font-semibold text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </footer>
    </main>
  );
}
