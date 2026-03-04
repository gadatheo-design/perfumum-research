// @ts-nocheck
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Link2,
  Plus,
  Search,
  Trash2,
  Leaf,
  FlaskConical,
  BookOpen,
  Beaker,
  MapPin,
  Sparkles,
  Building,
  ScrollText,
  X,
} from "lucide-react";

type EntityType = 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier';
type LinkType = 'documents' | 'mentions' | 'analyzes' | 'conserves' | 'reconstructs' | 'sources' | 'validates' | 'contextualizes';

const entityTypeLabels: Record<EntityType, { label: string; icon: React.ReactNode }> = {
  leaf_economy: { label: "Échantillon botanique", icon: <Leaf className="h-4 w-4" /> },
  molecule: { label: "Molécule", icon: <FlaskConical className="h-4 w-4" /> },
  recette: { label: "Recette", icon: <BookOpen className="h-4 w-4" /> },
  plant: { label: "Plante", icon: <Leaf className="h-4 w-4" /> },
  prototype: { label: "Prototype", icon: <Beaker className="h-4 w-4" /> },
  tradition: { label: "Tradition olfactive", icon: <ScrollText className="h-4 w-4" /> },
  terroir: { label: "Terroir", icon: <MapPin className="h-4 w-4" /> },
  supplier: { label: "Fournisseur", icon: <Building className="h-4 w-4" /> },
};

const linkTypeLabels: Record<LinkType, string> = {
  documents: "Documente",
  mentions: "Mentionne",
  analyzes: "Analyse",
  conserves: "Conservation",
  reconstructs: "Reconstruction",
  sources: "Source pour",
  validates: "Valide",
  contextualizes: "Contextualise",
};

interface EntityLinkerProps {
  referenceId: number;
  referenceTitle: string;
  onUpdate?: () => void;
}

export function EntityLinker({ referenceId, referenceTitle, onUpdate }: EntityLinkerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType>("molecule");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const [selectedEntityName, setSelectedEntityName] = useState("");
  const [linkType, setLinkType] = useState<LinkType>("documents");
  const [relevanceScore, setRelevanceScore] = useState(50);
  const [notes, setNotes] = useState("");
  const [context, setContext] = useState("");

  // Fetch existing links for this reference
  const { data: existingLinks, refetch: refetchLinks } = trpc.referenceEntityLinks.getForReference.useQuery(referenceId);

  // Search entities based on type
  const { data: molecules } = trpc.molecules.list.useQuery(undefined, { enabled: selectedEntityType === "molecule" });
  const { data: plants } = trpc.plants.list.useQuery(undefined, { enabled: selectedEntityType === "plant" });
  const { data: recettes } = trpc.recettes.list.useQuery(undefined, { enabled: selectedEntityType === "recette" });
  const { data: terroirsData } = trpc.terroirs.getAll.useQuery(undefined, { enabled: selectedEntityType === "terroir" });
  const { data: prototypes } = trpc.prototypes.list.useQuery(undefined, { enabled: selectedEntityType === "prototype" });

  // Create link mutation
  const createLinkMutation = trpc.referenceEntityLinks.create.useMutation({
    onSuccess: () => {
      toast.success("Liaison créée avec succès");
      refetchLinks();
      resetForm();
      onUpdate?.();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Delete link mutation
  const deleteLinkMutation = trpc.referenceEntityLinks.delete.useMutation({
    onSuccess: () => {
      toast.success("Liaison supprimée");
      refetchLinks();
      onUpdate?.();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Filter entities based on search
  const filteredEntities = useMemo(() => {
    const query = searchQuery.toLowerCase();
    let entities: { id: number; name: string }[] = [];

    switch (selectedEntityType) {
      case "molecule":
        entities = (molecules || []).map(m => ({ id: m.id, name: m.name }));
        break;
      case "plant":
        entities = (plants || []).map(p => ({ id: p.id, name: p.name }));
        break;
      case "recette":
        entities = (recettes || []).map(r => ({ id: r.id, name: r.name }));
        break;
      case "terroir":
        entities = (terroirsData || []).map((t: any) => ({ id: t.id, name: t.name }));
        break;
      case "prototype":
        entities = (prototypes || []).map(p => ({ id: p.id, name: p.name }));
        break;
      default:
        entities = [];
    }

    if (!query) return entities.slice(0, 20);
    return entities.filter(e => e.name.toLowerCase().includes(query)).slice(0, 20);
  }, [selectedEntityType, searchQuery, molecules, plants, recettes, terroirsData, prototypes]);

  const resetForm = () => {
    setSelectedEntityId(null);
    setSelectedEntityName("");
    setSearchQuery("");
    setLinkType("documents");
    setRelevanceScore(50);
    setNotes("");
    setContext("");
  };

  const handleCreateLink = () => {
    if (!selectedEntityId) {
      toast.error("Veuillez sélectionner une entité");
      return;
    }

    createLinkMutation.mutate({
      referenceId,
      entityType: selectedEntityType,
      entityId: selectedEntityId,
      linkType,
      relevanceScore,
      notes: notes || undefined,
      context: context || undefined,
    });
  };

  const selectEntity = (id: number, name: string) => {
    setSelectedEntityId(id);
    setSelectedEntityName(name);
    setSearchQuery("");
  };

  return (
    <div className="space-y-4">
      {/* Header with add button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Entités liées</span>
          <Badge variant="secondary">{existingLinks?.length || 0}</Badge>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Lier une entité
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Associer une entité</DialogTitle>
              <DialogDescription>
                Liez cette référence à une plante, molécule ou autre entité du projet
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Entity type selection */}
              <div className="space-y-2">
                <Label>Type d'entité</Label>
                <Select
                  value={selectedEntityType}
                  onValueChange={(v) => {
                    setSelectedEntityType(v as EntityType);
                    setSelectedEntityId(null);
                    setSelectedEntityName("");
                    setSearchQuery("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(entityTypeLabels).map(([key, { label, icon }]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          {icon}
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Entity search/selection */}
              <div className="space-y-2">
                <Label>Entité</Label>
                {selectedEntityId ? (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    {entityTypeLabels[selectedEntityType].icon}
                    <span className="flex-1 font-medium">{selectedEntityName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEntityId(null);
                        setSelectedEntityName("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {filteredEntities.length > 0 && (
                      <div className="max-h-48 overflow-y-auto border rounded-md divide-y">
                        {filteredEntities.map((entity) => (
                          <button
                            key={entity.id}
                            className="w-full px-3 py-2 text-left hover:bg-muted/50 transition-colors flex items-center gap-2"
                            onClick={() => selectEntity(entity.id, entity.name)}
                          >
                            {entityTypeLabels[selectedEntityType].icon}
                            <span className="truncate">{entity.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Link type */}
              <div className="space-y-2">
                <Label>Type de liaison</Label>
                <Select value={linkType} onValueChange={(v) => setLinkType(v as LinkType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(linkTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Relevance score */}
              <div className="space-y-2">
                <Label>Score de pertinence: {relevanceScore}%</Label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={relevanceScore}
                  onChange={(e) => setRelevanceScore(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Context */}
              <div className="space-y-2">
                <Label>Contexte (extrait pertinent)</Label>
                <Textarea
                  placeholder="Extrait de la référence mentionnant cette entité..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Notes additionnelles..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleCreateLink}
                disabled={!selectedEntityId || createLinkMutation.isPending}
              >
                {createLinkMutation.isPending ? "Création..." : "Créer la liaison"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing links list */}
      {existingLinks && existingLinks.length > 0 ? (
        <div className="space-y-2">
          {existingLinks.map((link: any) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-muted">
                  {entityTypeLabels[link.entityType as EntityType]?.icon || <Sparkles className="h-4 w-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{link.entityName || `ID: ${link.entityId}`}</span>
                    <Badge variant="outline" className="text-xs">
                      {entityTypeLabels[link.entityType as EntityType]?.label || link.entityType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{linkTypeLabels[link.linkType as LinkType] || link.linkType}</span>
                    <span>•</span>
                    <span>Pertinence: {link.relevanceScore}%</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  if (confirm("Supprimer cette liaison ?")) {
                    deleteLinkMutation.mutate(link.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <Link2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucune entité liée</p>
          <p className="text-xs">Cliquez sur "Lier une entité" pour associer cette référence</p>
        </div>
      )}
    </div>
  );
}
