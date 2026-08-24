import { Check, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type Activity,
  formatDue,
  priorityLabel,
  statusOf,
  typeLabel,
} from "@/lib/activities";
import { cn } from "@/lib/utils";

const priorityBar: Record<string, string> = {
  alta: "bg-destructive",
  media: "bg-warning",
  baixa: "bg-accent",
};

export function ActivityCard({
  activity,
  onToggle,
  onDelete,
}: {
  activity: Activity;
  onToggle: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}) {
  const status = statusOf(activity);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-4 pl-5 transition-colors",
        status === "atrasada" && "border-destructive/50",
        activity.completed && "opacity-60",
      )}
    >
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-1.5",
          priorityBar[activity.priority] ?? "bg-accent",
        )}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {activity.subject || "Sem disciplina"}
          </p>
          <h4
            className={cn(
              "mt-1 font-bold leading-tight",
              activity.completed && "line-through",
            )}
          >
            {activity.title}
          </h4>
        </div>
        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
          {typeLabel(activity.type)}
        </span>
      </div>

      {activity.description ? (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {activity.description}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span
          className={cn(
            "font-semibold",
            status === "atrasada"
              ? "text-destructive"
              : status === "concluida"
                ? "text-success"
                : "text-warning",
          )}
        >
          {status === "concluida" ? "Concluída" : formatDue(activity)}
        </span>
        <span className="text-muted-foreground">
          Prioridade {priorityLabel(activity.priority).toLowerCase()}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          variant={activity.completed ? "secondary" : "default"}
          className="flex-1"
          onClick={() => onToggle(activity)}
        >
          {activity.completed ? (
            <>
              <RotateCcw /> Reabrir
            </>
          ) : (
            <>
              <Check /> Concluir
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(activity)}
          aria-label={`Excluir ${activity.title}`}
        >
          <Trash2 />
        </Button>
      </div>
    </article>
  );
}
