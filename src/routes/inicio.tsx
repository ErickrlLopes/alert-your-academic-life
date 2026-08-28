import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlarmClock,
  BookOpen,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";

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

type Item = {
  titulo: string;
  materia: string;
  prazo: string;
  status: "hoje" | "atrasada" | "proxima" | "concluida";
};

const itens: Item[] = [
  { titulo: "Entrega do relatório de laboratório", materia: "Física II", prazo: "Hoje, 23:59", status: "hoje" },
  { titulo: "Lista de exercícios 04", materia: "Cálculo I", prazo: "Ontem, 18:00", status: "atrasada" },
  { titulo: "Seminário sobre banco de dados", materia: "Banco de Dados", prazo: "Amanhã, 14:00", status: "proxima" },
  { titulo: "Protótipo do app em Java", materia: "Programação Mobile", prazo: "Sex, 10:00", status: "proxima" },
  { titulo: "Fichamento do artigo", materia: "Metodologia", prazo: "Concluída ontem", status: "concluida" },
];

const estilos: Record<Item["status"], { rotulo: string; classe: string }> = {
  hoje: { rotulo: "Hoje", classe: "bg-primary/15 text-primary" },
  atrasada: { rotulo: "Atrasada", classe: "bg-destructive/15 text-destructive" },
  proxima: { rotulo: "Próxima", classe: "bg-accent/15 text-accent" },
  concluida: { rotulo: "Concluída", classe: "bg-muted text-muted-foreground" },
};

function InicioPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-4">
          <BrandMark size={40} />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Bem-vindo de volta</p>
            <h1 className="truncate text-lg font-semibold">Olá, estudante</h1>
          </div>
          <Button variant="ghost" size="icon" aria-label="Buscar">
            <Search className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notificações">
            <Bell className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Configurações">
            <Settings className="size-5" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-8 pb-28">
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { icone: CalendarDays, valor: "3", rotulo: "Para hoje" },
            { icone: AlarmClock, valor: "1", rotulo: "Atrasadas" },
            { icone: CheckCircle2, valor: "12", rotulo: "Concluídas" },
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

        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground shadow-brand">
          <p className="text-sm/relaxed opacity-90">Próximo prazo</p>
          <h2 className="mt-1 text-2xl font-semibold">Relatório de Física II</h2>
          <p className="mt-2 text-sm opacity-90">Faltam 6 horas — hoje às 23:59</p>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Suas atividades</h2>
            <button className="flex items-center gap-1 text-sm text-primary">
              Ver todas <ChevronRight className="size-4" />
            </button>
          </div>

          <ul className="space-y-3">
            {itens.map((item) => {
              const estilo = estilos[item.status];
              return (
                <li
                  key={item.titulo}
                  className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <BookOpen className="size-5 text-muted-foreground" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate font-medium ${
                        item.status === "concluida" ? "text-muted-foreground line-through" : ""
                      }`}
                    >
                      {item.titulo}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {item.materia} · {item.prazo}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${estilo.classe}`}>
                    {estilo.rotulo}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          Tela apenas visual — funções ainda não conectadas.{" "}
          <Link to="/painel" className="text-primary underline underline-offset-4">
            Ver painel funcional
          </Link>
        </p>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center">
        <Button size="lg" className="pointer-events-auto rounded-full shadow-brand">
          <Plus className="size-5" /> Nova atividade
        </Button>
      </div>
    </div>
  );
}
