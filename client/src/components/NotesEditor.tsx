// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Check, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NotesEditorProps {
  entityType: string;
  entityId: number;
  title?: string;
  placeholder?: string;
}

export function NotesEditor({ entityType, entityId, title, placeholder }: NotesEditorProps) {
  const [content, setContent] = useState("");
  const [noteId, setNoteId] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Charger la note existante
  const { data: existingNote, isLoading } = trpc.notes.getByEntity.useQuery({
    entityType,
    entityId,
  });

  useEffect(() => {
    if (existingNote) {
      setContent(existingNote.content);
      setNoteId(existingNote.id);
      if (existingNote.updatedAt) {
        setLastSaved(new Date(existingNote.updatedAt));
      }
    }
  }, [existingNote]);

  // Mutations
  const createMutation = trpc.notes.create.useMutation({
    onSuccess: (data) => {
      setNoteId(data.id);
      setSaveStatus("saved");
      setLastSaved(new Date());
      toast.success("Note créée");
    },
    onError: () => {
      setSaveStatus("error");
      toast.error("Erreur lors de la création de la note");
    },
  });

  const updateMutation = trpc.notes.update.useMutation({
    onSuccess: () => {
      setSaveStatus("saved");
      setLastSaved(new Date());
      toast.success("Note mise à jour");
    },
    onError: () => {
      setSaveStatus("error");
      toast.error("Erreur lors de la mise à jour");
    },
  });

  const deleteMutation = trpc.notes.delete.useMutation({
    onSuccess: () => {
      setContent("");
      setNoteId(null);
      setLastSaved(null);
      toast.success("Note supprimée");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  // Autosave avec debounce
  useEffect(() => {
    if (content.trim().length === 0) return;

    setSaveStatus("saving");
    const timer = setTimeout(() => {
      if (noteId) {
        updateMutation.mutate({ id: noteId, content });
      } else {
        createMutation.mutate({ entityType, entityId, content });
      }
    }, 1500); // Debounce 1.5s

    return () => clearTimeout(timer);
  }, [content]);

  // Réinitialiser status après 2s
  useEffect(() => {
    if (saveStatus === "saved") {
      const timer = setTimeout(() => setSaveStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const handleDelete = () => {
    if (!noteId) return;
    if (confirm("Supprimer cette note ?")) {
      deleteMutation.mutate(noteId);
    }
  };

  const charCount = content.length;
  const maxChars = 5000;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Chargement...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {title || "Notes personnelles"}
            </CardTitle>
            <CardDescription>
              Ajoutez vos observations, remarques et idées
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {saveStatus === "saving" && (
              <Badge variant="secondary" className="gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                Sauvegarde...
              </Badge>
            )}
            {saveStatus === "saved" && (
              <Badge variant="default" className="gap-1.5 bg-green-600">
                <Check className="h-3 w-3" />
                Sauvegardé
              </Badge>
            )}
            {saveStatus === "error" && (
              <Badge variant="destructive" className="gap-1.5">
                <AlertCircle className="h-3 w-3" />
                Erreur
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder || "Commencez à écrire vos notes..."}
          className="min-h-[200px] resize-y"
          maxLength={maxChars}
        />
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className={cn(
              charCount > maxChars * 0.9 && "text-orange-600",
              charCount === maxChars && "text-red-600 font-semibold"
            )}>
              {charCount} / {maxChars} caractères
            </span>
            {lastSaved && (
              <span>
                Dernière sauvegarde : {lastSaved.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
          
          {noteId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="text-destructive hover:text-destructive"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer la note"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
