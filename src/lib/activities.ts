export const ACTIVITY_TYPES = [
  { value: "trabalho", label: "Trabalho" },
  { value: "prova", label: "Prova" },
  { value: "seminario", label: "Seminário" },
  { value: "exercicio", label: "Exercício" },
  { value: "projeto", label: "Projeto" },
  { value: "apresentacao", label: "Apresentação" },
  { value: "outro", label: "Outro" },
] as const;

export const PRIORITIES = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number]["value"];
export type Priority = (typeof PRIORITIES)[number]["value"];

export type Activity = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  subject: string;
  type: ActivityType;
  priority: Priority;
  due_date: string;
  due_time: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
};

export type ActivityStatus = "pendente" | "concluida" | "atrasada";

export function typeLabel(value: string) {
  return ACTIVITY_TYPES.find((t) => t.value === value)?.label ?? "Outro";
}

export function priorityLabel(value: string) {
  return PRIORITIES.find((p) => p.value === value)?.label ?? "Média";
}

function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function statusOf(activity: Activity): ActivityStatus {
  if (activity.completed) return "concluida";
  return activity.due_date < todayISO() ? "atrasada" : "pendente";
}

export function isToday(activity: Activity) {
  return !activity.completed && activity.due_date === todayISO();
}

export function isUpcoming(activity: Activity) {
  return !activity.completed && activity.due_date > todayISO();
}

export function isLate(activity: Activity) {
  return statusOf(activity) === "atrasada";
}

export function formatDue(activity: Activity) {
  const today = todayISO();
  const [y, m, d] = activity.due_date.split("-").map(Number);
  const date = new Date(y!, (m ?? 1) - 1, d ?? 1);
  const diffDays = Math.round(
    (date.getTime() - new Date(today + "T00:00:00").getTime()) / 86400000,
  );
  const hour = activity.due_time.slice(0, 5);

  if (diffDays === 0) return `Hoje às ${hour}`;
  if (diffDays === 1) return `Amanhã às ${hour}`;
  if (diffDays === -1) return "Venceu ontem";
  if (diffDays < 0) return `Venceu há ${Math.abs(diffDays)} dias`;
  if (diffDays < 7) return `Em ${diffDays} dias · ${hour}`;
  return `Entrega: ${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")} · ${hour}`;
}

export function sortByDue(a: Activity, b: Activity) {
  return (a.due_date + a.due_time).localeCompare(b.due_date + b.due_time);
}
