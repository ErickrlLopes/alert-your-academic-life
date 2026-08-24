import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACTIVITY_TYPES, PRIORITIES, type ActivityType, type Priority } from "@/lib/activities";

export type ActivityDraft = {
  title: string;
  description: string;
  subject: string;
  type: ActivityType;
  priority: Priority;
  due_date: string;
  due_time: string;
};

const empty: ActivityDraft = {
  title: "",
  description: "",
  subject: "",
  type: "trabalho",
  priority: "media",
  due_date: "",
  due_time: "23:59",
};

export function ActivityDialog({
  open,
  onOpenChange,
  onSubmit,
  saving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: ActivityDraft) => Promise<void>;
  saving: boolean;
}) {
  const [draft, setDraft] = useState<ActivityDraft>(empty);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setDraft({ ...empty, due_date: new Date().toISOString().slice(0, 10) });
      setError("");
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) return setError("Informe o título da atividade.");
    if (draft.title.length > 120) return setError("O título é muito longo.");
    if (!draft.due_date) return setError("Informe a data de entrega.");
    setError("");
    await onSubmit({ ...draft, title: draft.title.trim(), subject: draft.subject.trim() });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova atividade</DialogTitle>
          <DialogDescription>
            Cadastre uma obrigação acadêmica e o AlertCampus cuida da ordem de prioridade.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              maxLength={120}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Trabalho de Modelagem"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">Disciplina</Label>
            <Input
              id="subject"
              maxLength={80}
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              placeholder="Banco de Dados"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select
                value={draft.type}
                onValueChange={(value) => setDraft({ ...draft, type: value as ActivityType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Prioridade</Label>
              <Select
                value={draft.priority}
                onValueChange={(value) => setDraft({ ...draft, priority: value as Priority })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="due_date">Data de entrega</Label>
              <Input
                id="due_date"
                type="date"
                value={draft.due_date}
                onChange={(e) => setDraft({ ...draft, due_date: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="due_time">Horário</Label>
              <Input
                id="due_time"
                type="time"
                value={draft.due_time}
                onChange={(e) => setDraft({ ...draft, due_time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              maxLength={500}
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Detalhes, requisitos, links..."
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar atividade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
