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
  titulo: string;
  descricao: string;
  disciplina: string;
  tipo: ActivityType;
  prioridade: Priority;
  data_entrega: string;
  hora_entrega: string;
};

const empty: ActivityDraft = {
  titulo: "",
  descricao: "",
  disciplina: "",
  tipo: "trabalho",
  prioridade: "media",
  data_entrega: "",
  hora_entrega: "23:59",
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
      setDraft({ ...empty, data_entrega: new Date().toISOString().slice(0, 10) });
      setError("");
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.titulo.trim()) return setError("Informe o título da atividade.");
    if (draft.titulo.length > 120) return setError("O título é muito longo.");
    if (!draft.data_entrega) return setError("Informe a data de entrega.");
    setError("");
    await onSubmit({
      ...draft,
      titulo: draft.titulo.trim(),
      disciplina: draft.disciplina.trim(),
    });
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
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              maxLength={120}
              value={draft.titulo}
              onChange={(e) => setDraft({ ...draft, titulo: e.target.value })}
              placeholder="Trabalho de Modelagem"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="disciplina">Disciplina</Label>
            <Input
              id="disciplina"
              maxLength={80}
              value={draft.disciplina}
              onChange={(e) => setDraft({ ...draft, disciplina: e.target.value })}
              placeholder="Banco de Dados"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select
                value={draft.tipo}
                onValueChange={(value) => setDraft({ ...draft, tipo: value as ActivityType })}
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
                value={draft.prioridade}
                onValueChange={(value) => setDraft({ ...draft, prioridade: value as Priority })}
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
              <Label htmlFor="data_entrega">Data de entrega</Label>
              <Input
                id="data_entrega"
                type="date"
                value={draft.data_entrega}
                onChange={(e) => setDraft({ ...draft, data_entrega: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hora_entrega">Horário</Label>
              <Input
                id="hora_entrega"
                type="time"
                value={draft.hora_entrega}
                onChange={(e) => setDraft({ ...draft, hora_entrega: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              maxLength={500}
              rows={3}
              value={draft.descricao}
              onChange={(e) => setDraft({ ...draft, descricao: e.target.value })}
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
