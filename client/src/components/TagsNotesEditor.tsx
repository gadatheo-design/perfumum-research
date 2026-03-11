/**
 * Éditeur de tags et notes amélioré avec auto-complétion et suggestions
 * Permet d'ajouter des tags et notes personnelles sur les entités PERFUMUM
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, 
  Save, 
  Check, 
  AlertCircle, 
  FileText, 
  Tag, 
  X, 
  Plus,
  Hash,
  Sparkles,
  Clock,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { cn , safeJsonParse} from "@/lib/utils";

interface TagsNotesEditorProps {
  entityType: 'molecule' | 'recette' | 'accord' | 'prototype' | 'plant' | 'terroir';
  entityId: number;
  entityName?: string;
  title?: string;
  placeholder?: string;
  showTags?: boolean;
  showNotes?: boolean;
  compact?: boolean;
}

// Tags suggérés par catégorie
const SUGGESTED_TAGS: Record<string, string[]> = {
  molecule: [
    "favori", "à étudier", "rare", "synthétique", "naturel", 
    "tête", "cœur", "fond", "fixateur", "modulateur",
    "boisé", "floral", "agrume", "épicé", "musqué"
  ],
  recette: [
    "favori", "en cours", "terminée", "à améliorer", "archive",
    "été", "hiver", "unisexe", "féminin", "masculin",
    "frais", "chaud", "oriental", "occidental"
  ],
  accord: [
    "classique", "moderne", "expérimental", "signature",
    "léger", "puissant", "équilibré"
  ],
  prototype: [
    "C1", "C2", "C3", "C4", "en développement", "finalisé",
    "concept", "production"
  ],
  plant: [
    "cultivée", "sauvage", "endémique", "menacée",
    "méditerranéen", "tropical", "tempéré"
  ],
  terroir: [
    "visité", "à visiter", "partenaire", "source principale",
    "bio", "conventionnel", "sauvage"
  ],
};

// Couleurs pour les tags
const TAG_COLORS = [
  "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
  "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
];

function getTagColor(tag: string): string {
  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TAG_COLORS[hash % TAG_COLORS.length];
}

export function TagsNotesEditor({
  entityType,
  entityId,
  entityName,
  title,
  placeholder,
  showTags = true,
  showNotes = true,
  compact = false,
}: TagsNotesEditorProps) {
  const [activeTab, setActiveTab] = useState<string>(showTags ? "tags" : "notes");
  const [noteContent, setNoteContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Charger les données existantes (pour les molécules avec le système moleculeNotes)
  const { data: existingMoleculeNote, isLoading: isLoadingMolecule } = trpc.moleculeNotes.get.useQuery(
    entityId,
    { enabled: entityType === 'molecule' }
  );

  // Charger les notes génériques (pour les autres entités)
  const { data: existingNote, isLoading: isLoadingNote } = trpc.notes.getByEntity.useQuery(
    { entityType, entityId },
    { enabled: entityType !== 'molecule' }
  );

  const isLoading = entityType === 'molecule' ? isLoadingMolecule : isLoadingNote;

  // Initialiser les données
  useEffect(() => {
    if (entityType === 'molecule' && existingMoleculeNote) {
      setNoteContent(existingMoleculeNote.note || "");
      if (existingMoleculeNote.tags) {
        try {
          const parsedTags = typeof existingMoleculeNote.tags === 'string' 
            ? safeJsonParse(existingMoleculeNote.tags, []) 
            : existingMoleculeNote.tags;
          setTags(Array.isArray(parsedTags) ? parsedTags : []);
        } catch {
          setTags([]);
        }
      }
      if (existingMoleculeNote.updatedAt) {
        setLastSaved(new Date(existingMoleculeNote.updatedAt));
      }
    } else if (entityType !== 'molecule' && existingNote) {
      setNoteContent(existingNote.content || "");
      if (existingNote.updatedAt) {
        setLastSaved(new Date(existingNote.updatedAt));
      }
    }
  }, [existingMoleculeNote, existingNote, entityType]);

  // Mutations pour moleculeNotes
  const upsertMoleculeNote = trpc.moleculeNotes.upsert.useMutation({
    onSuccess: () => {
      setSaveStatus("saved");
      setLastSaved(new Date());
    },
    onError: () => {
      setSaveStatus("error");
      toast.error("Erreur lors de la sauvegarde");
    },
  });

  // Mutations pour notes génériques
  const createNote = trpc.notes.create.useMutation({
    onSuccess: () => {
      setSaveStatus("saved");
      setLastSaved(new Date());
    },
    onError: () => {
      setSaveStatus("error");
      toast.error("Erreur lors de la création");
    },
  });

  const updateNote = trpc.notes.update.useMutation({
    onSuccess: () => {
      setSaveStatus("saved");
      setLastSaved(new Date());
    },
    onError: () => {
      setSaveStatus("error");
      toast.error("Erreur lors de la mise à jour");
    },
  });

  // Sauvegarder les changements
  const saveChanges = useCallback(() => {
    setSaveStatus("saving");
    
    if (entityType === 'molecule') {
      upsertMoleculeNote.mutate({
        moleculeId: entityId,
        note: noteContent,
        tags: tags,
      });
    } else {
      if (existingNote?.id) {
        updateNote.mutate({
          id: existingNote.id,
          content: noteContent,
        });
      } else if (noteContent.trim()) {
        createNote.mutate({
          entityType,
          entityId,
          content: noteContent,
        });
      }
    }
  }, [entityType, entityId, noteContent, tags, existingNote, upsertMoleculeNote, updateNote, createNote]);

  // Autosave avec debounce
  useEffect(() => {
    if (noteContent.trim().length === 0 && tags.length === 0) return;

    setSaveStatus("saving");
    const timer = setTimeout(saveChanges, 2000);

    return () => clearTimeout(timer);
  }, [noteContent, tags, saveChanges]);

  // Réinitialiser status après 2s
  useEffect(() => {
    if (saveStatus === "saved") {
      const timer = setTimeout(() => setSaveStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // Ajouter un tag
  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags([...tags, normalizedTag]);
      setNewTag("");
      setTagSearch("");
    }
  };

  // Supprimer un tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Tags suggérés filtrés
  const filteredSuggestions = useMemo(() => {
    const suggestions = SUGGESTED_TAGS[entityType] || [];
    const search = tagSearch.toLowerCase();
    return suggestions
      .filter(s => !tags.includes(s.toLowerCase()))
      .filter(s => !search || s.toLowerCase().includes(search))
      .slice(0, 8);
  }, [entityType, tags, tagSearch]);

  const charCount = noteContent.length;
  const maxChars = 5000;

  if (isLoading) {
    return (
      <Card className={compact ? "border-0 shadow-none" : ""}>
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Chargement...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={compact ? "border-0 shadow-none" : ""}>
      {!compact && (
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {title || `Notes & Tags${entityName ? ` — ${entityName}` : ""}`}
              </CardTitle>
              <CardDescription>
                Organisez vos observations avec des tags et notes personnelles
              </CardDescription>
            </div>
            <AnimatePresence mode="wait">
              {saveStatus === "saving" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Badge variant="secondary" className="gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Sauvegarde...
                  </Badge>
                </motion.div>
              )}
              {saveStatus === "saved" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Badge variant="default" className="gap-1.5 bg-green-600">
                    <Check className="h-3 w-3" />
                    Sauvegardé
                  </Badge>
                </motion.div>
              )}
              {saveStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Badge variant="destructive" className="gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    Erreur
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardHeader>
      )}
      
      <CardContent className={compact ? "p-0" : ""}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            {showTags && (
              <TabsTrigger value="tags" className="gap-2">
                <Tag className="h-4 w-4" />
                Tags ({tags.length})
              </TabsTrigger>
            )}
            {showNotes && (
              <TabsTrigger value="notes" className="gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </TabsTrigger>
            )}
          </TabsList>

          {showTags && (
            <TabsContent value="tags" className="space-y-4">
              {/* Tags actuels */}
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {tags.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge 
                        variant="outline"
                        className={cn("gap-1.5 pr-1", getTagColor(tag))}
                      >
                        <Hash className="h-3 w-3" />
                        {tag}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 hover:bg-destructive/20"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {tags.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    Aucun tag ajouté
                  </span>
                )}
              </div>

              {/* Ajouter un tag */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={newTag}
                      onChange={(e) => {
                        setNewTag(e.target.value);
                        setTagSearch(e.target.value);
                      }}
                      placeholder="Ajouter un tag..."
                      className="pl-9"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newTag.trim()) {
                          e.preventDefault();
                          addTag(newTag);
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => addTag(newTag)}
                    disabled={!newTag.trim()}
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Suggestions */}
                {filteredSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Suggestions :</span>
                    <div className="flex flex-wrap gap-1.5">
                      {filteredSuggestions.map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => addTag(suggestion)}
                        >
                          <Plus className="h-3 w-3" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          {showNotes && (
            <TabsContent value="notes" className="space-y-4">
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder={placeholder || "Écrivez vos observations, idées, remarques..."}
                className="min-h-[180px] resize-y"
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
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lastSaved.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveChanges}
                  disabled={saveStatus === "saving"}
                  className="gap-1.5"
                >
                  {saveStatus === "saving" ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Composant compact pour afficher uniquement les tags
export function TagsDisplay({ tags, onRemove }: { tags: string[]; onRemove?: (tag: string) => void }) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge 
          key={tag}
          variant="outline"
          className={cn("gap-1", getTagColor(tag), onRemove && "pr-1")}
        >
          <Hash className="h-3 w-3" />
          {tag}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-0.5 hover:bg-destructive/20"
              onClick={() => onRemove(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Badge>
      ))}
    </div>
  );
}
