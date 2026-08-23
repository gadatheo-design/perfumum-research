import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Search, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ReassociationTarget = {
  kind: "plant" | "molecule";
  linkId: number;
  descriptorId: string;
  descriptorName: string | null;
  archivedName: string;
};

type SelectionMetadata = {
  reason?: string;
  confidence?: "high" | "medium" | "low";
  name: string;
  secondary: string;
};

interface OrphanReassociationDialogProps {
  target: ReassociationTarget | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function OrphanReassociationDialog({ target, onClose, onSuccess }: OrphanReassociationDialogProps) {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selection, setSelection] = useState<SelectionMetadata | null>(null);
  const isPlant = target?.kind === "plant";

  const plantsQuery = trpc.apiEnrichments.searchPlants.useQuery(
    { query },
    { enabled: target?.kind === "plant" && query.trim().length >= 2 }
  );
  const moleculesQuery = trpc.molecules.search.useQuery(
    { query, limit: 20 },
    { enabled: target?.kind === "molecule" && query.trim().length >= 2 }
  );
  const suggestionsQuery = trpc.descriptorLinks.getReassociationSuggestions.useQuery(
    { kind: target?.kind ?? "plant", linkId: target?.linkId ?? 0 },
    { enabled: Boolean(target) }
  );
  const reassignPlant = trpc.descriptorLinks.reassignOrphanPlantLink.useMutation();
  const reassignMolecule = trpc.descriptorLinks.reassignOrphanMoleculeLink.useMutation();

  const plants = useMemo(() => plantsQuery.data ?? [], [plantsQuery.data]);
  const molecules = useMemo(() => moleculesQuery.data?.molecules ?? [], [moleculesQuery.data]);
  const isSaving = reassignPlant.isPending || reassignMolecule.isPending;
  const suggestions = suggestionsQuery.data?.suggestions ?? [];

  useEffect(() => {
    setQuery("");
    setSelectedId(null);
    setSelection(null);
  }, [target?.kind, target?.linkId]);

  const resetAndClose = () => {
    setQuery("");
    setSelectedId(null);
    setSelection(null);
    onClose();
  };

  const chooseManualPlant = (plant: any) => {
    setSelectedId(plant.id);
    setSelection({ name: plant.name, secondary: plant.latinName || "Nom latin non renseigné" });
  };

  const chooseManualMolecule = (molecule: any) => {
    setSelectedId(molecule.id);
    setSelection({ name: molecule.name, secondary: molecule.casNumber || molecule.iupacName || "Identifiant non renseigné" });
  };

  const chooseSuggestion = (suggestion: any) => {
    setSelectedId(suggestion.id);
    setSelection({
      name: suggestion.name,
      secondary: isPlant ? suggestion.latinName || "Nom latin non renseigné" : suggestion.casNumber || suggestion.iupacName || "Identifiant non renseigné",
      reason: suggestion.reason,
      confidence: suggestion.confidence,
    });
  };

  const handleConfirm = async () => {
    if (!target || !selectedId) return;
    try {
      if (target.kind === "plant") {
        await reassignPlant.mutateAsync({
          linkId: target.linkId,
          targetPlantId: selectedId,
          suggestionReason: selection?.reason,
          confidence: selection?.confidence,
        });
      } else {
        await reassignMolecule.mutateAsync({
          linkId: target.linkId,
          targetMoleculeId: selectedId,
          suggestionReason: selection?.reason,
          confidence: selection?.confidence,
        });
      }
      toast({
        title: "Association rétablie",
        description: `Le lien du descripteur « ${target.descriptorName || target.descriptorId} » a été réassocié sans modifier sa force, ses notes ni sa source.`,
      });
      onSuccess();
      resetAndClose();
    } catch (error) {
      toast({
        title: "Réassociation impossible",
        description: error instanceof Error ? error.message : "La cible sélectionnée n’a pas pu être validée.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={Boolean(target)} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Réassocier un lien orphelin</DialogTitle>
          <DialogDescription>
            Sélectionnez une {isPlant ? "plante" : "molécule"} existante pour remplacer la cible archivée. Les métadonnées éditoriales du lien sont conservées.
          </DialogDescription>
        </DialogHeader>

        {target && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-sm dark:border-amber-900 dark:bg-amber-950/20">
            <p className="font-medium text-amber-950 dark:text-amber-100">Association à réparer</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">Descripteur : {target.descriptorName || target.descriptorId}</Badge>
              <Badge variant="outline">Cible archivée : {target.archivedName}</Badge>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Suggestions vérifiables</p>
            {suggestionsQuery.isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          {suggestionsQuery.isError ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">Les suggestions n’ont pas pu être calculées. La recherche manuelle reste disponible.</p>
          ) : suggestions.length === 0 ? (
            <p className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">Aucune correspondance automatique suffisamment explicable. Utilisez la recherche manuelle ci-dessous.</p>
          ) : (
            <div className="max-h-44 overflow-y-auto rounded-lg border">
              {suggestions.map((suggestion: any) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => chooseSuggestion(suggestion)}
                  className={`block w-full border-b p-3 text-left last:border-b-0 hover:bg-muted/50 ${selectedId === suggestion.id ? "bg-primary/5 ring-1 ring-inset ring-primary" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{suggestion.name}</p>
                      <p className="text-xs text-muted-foreground">{isPlant ? suggestion.latinName || "Nom latin non renseigné" : suggestion.casNumber || suggestion.iupacName || "Identifiant non renseigné"}</p>
                    </div>
                    <Badge variant={suggestion.confidence === "high" ? "default" : "secondary"} className="shrink-0">{suggestion.score} %</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{suggestion.reason}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="reassociation-search">Rechercher une {isPlant ? "plante" : "molécule"} existante</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="reassociation-search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setSelectedId(null); setSelection(null); }}
              placeholder={isPlant ? "Nom latin ou commun…" : "Nom, IUPAC ou CAS…"}
              className="pl-9"
              autoFocus
            />
          </div>
          <p className="text-xs text-muted-foreground">Saisissez au moins deux caractères, puis vérifiez la prévisualisation avant confirmation.</p>
        </div>

        {query.trim().length >= 2 && (
          <div className="max-h-56 overflow-y-auto rounded-lg border">
            {isPlant ? (
              plantsQuery.isLoading ? <div className="p-4 text-center text-sm text-muted-foreground"><Loader2 className="mx-auto h-4 w-4 animate-spin" /></div> :
              plants.length === 0 ? <p className="p-4 text-center text-sm text-muted-foreground">Aucune plante correspondante.</p> :
              plants.map((plant: any) => <button key={plant.id} type="button" onClick={() => chooseManualPlant(plant)} className={`block w-full border-b p-3 text-left last:border-b-0 hover:bg-muted/50 ${selectedId === plant.id ? "bg-primary/5 ring-1 ring-inset ring-primary" : ""}`}><p className="font-medium">{plant.name}</p><p className="text-xs italic text-muted-foreground">{plant.latinName || "Nom latin non renseigné"}</p></button>)
            ) : (
              moleculesQuery.isLoading ? <div className="p-4 text-center text-sm text-muted-foreground"><Loader2 className="mx-auto h-4 w-4 animate-spin" /></div> :
              molecules.length === 0 ? <p className="p-4 text-center text-sm text-muted-foreground">Aucune molécule correspondante.</p> :
              molecules.map((molecule: any) => <button key={molecule.id} type="button" onClick={() => chooseManualMolecule(molecule)} className={`block w-full border-b p-3 text-left last:border-b-0 hover:bg-muted/50 ${selectedId === molecule.id ? "bg-primary/5 ring-1 ring-inset ring-primary" : ""}`}><p className="font-medium">{molecule.name}</p><p className="text-xs text-muted-foreground">{molecule.casNumber || molecule.iupacName || "Identifiant non renseigné"}</p></button>)
            )}
          </div>
        )}

        {selectedId && selection && (
          <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-sm dark:border-emerald-900 dark:bg-emerald-950/20">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div>
              <p className="font-medium">Nouvelle cible : {selection.name}</p>
              <p className="text-xs text-muted-foreground">{selection.secondary}</p>
              {selection.reason && <p className="mt-1 text-xs text-muted-foreground">Suggestion retenue : {selection.reason} · confiance {selection.confidence}</p>}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={resetAndClose} disabled={isSaving}>Annuler</Button>
          <Button onClick={handleConfirm} disabled={!selectedId || isSaving} className="gap-1.5">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Confirmer la réassociation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
