import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIEnrichButtonProps {
  entityType: "plant" | "rawMaterial";
  entityId: number;
  entityName: string;
  onEnrichSuccess?: () => void;
  size?: "sm" | "default";
  variant?: "default" | "outline" | "ghost";
}

export function AIEnrichButton({ entityType, entityId, entityName, onEnrichSuccess, size = "sm", variant = "outline" }: AIEnrichButtonProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const plantPreview = trpc.aiEnrichPlant.preview.useMutation({
    onSuccess: (data: any) => setPreview(data.enriched),
    onError: (err: any) => toast({ title: "Erreur IA", description: err.message, variant: "destructive" }),
  });
  const rawMaterialPreview = trpc.aiEnrichRawMaterial.preview.useMutation({
    onSuccess: (data: any) => setPreview(data.enriched),
    onError: (err: any) => toast({ title: "Erreur IA", description: err.message, variant: "destructive" }),
  });
  const plantEnrich = trpc.aiEnrichPlant.enrich.useMutation({
    onSuccess: (data: any) => {
      toast({ title: "Enrichissement appliqué", description: `${data.updatedFields?.length ?? 0} champ(s) mis à jour pour ${entityName}.` });
      setOpen(false); setPreview(null); onEnrichSuccess?.();
    },
    onError: (err: any) => toast({ title: "Erreur", description: err.message, variant: "destructive" }),
  });
  const rawMaterialEnrich = trpc.aiEnrichRawMaterial.enrich.useMutation({
    onSuccess: (data: any) => {
      toast({ title: "Enrichissement appliqué", description: `Fiche de ${data.materialName} enrichie.` });
      setOpen(false); setPreview(null); onEnrichSuccess?.();
    },
    onError: (err: any) => toast({ title: "Erreur", description: err.message, variant: "destructive" }),
  });

  const isLoadingPreview = plantPreview.isPending || rawMaterialPreview.isPending;
  const isApplying = plantEnrich.isPending || rawMaterialEnrich.isPending;

  const handleOpen = () => {
    setOpen(true); setPreview(null);
    if (entityType === "plant") plantPreview.mutate({ plantId: entityId });
    else rawMaterialPreview.mutate({ rawMaterialId: entityId });
  };
  const handleApply = () => {
    if (entityType === "plant") plantEnrich.mutate({ plantId: entityId });
    else rawMaterialEnrich.mutate({ rawMaterialId: entityId });
  };
  const toggle = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <Button variant={variant} size={size} onClick={handleOpen}
        className="gap-1.5 text-amber-600 border-amber-400/50 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-950/30">
        <Sparkles className="h-3.5 w-3.5" />
        Enrichir avec l'IA
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Enrichissement IA — {entityName}
            </DialogTitle>
            <DialogDescription>
              L'IA analyse les données existantes et propose un enrichissement scientifique. Vérifiez avant d'appliquer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {isLoadingPreview && (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                <p className="text-sm">Analyse en cours par l'IA…</p>
                <p className="text-xs opacity-60">Cela peut prendre 5 à 15 secondes</p>
              </div>
            )}
            {!isLoadingPreview && preview && (
              <PreviewPanel data={preview} entityType={entityType} expandedSections={expandedSections} onToggle={toggle} />
            )}
            {!isLoadingPreview && !preview && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                Impossible de générer un aperçu. Réessayez.
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={isApplying}>Annuler</Button>
            <Button onClick={handleApply} disabled={!preview || isApplying || isLoadingPreview}
              className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white">
              {isApplying
                ? <><Loader2 className="h-4 w-4 animate-spin" />Application…</>
                : <><CheckCircle2 className="h-4 w-4" />Appliquer l'enrichissement</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Section({ label, expanded, onToggle, children }: any) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-3 py-2 bg-muted/40 hover:bg-muted/60 transition-colors text-left">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
        {expanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      {expanded && <div className="px-3 py-2.5">{children}</div>}
    </div>
  );
}

function PreviewPanel({ data, entityType, expandedSections, onToggle }: any) {
  const isPlant = entityType === "plant";
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
        <CheckCircle2 className="h-4 w-4" />
        Enrichissement généré — vérifiez avant d'appliquer
      </div>
      {data.description && (
        <Section label="Description scientifique" expanded={expandedSections["desc"] ?? true} onToggle={() => onToggle("desc")}>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.description}</p>
        </Section>
      )}
      {(isPlant ? data.olfactiveProfile : data.olfactiveNotes)?.length > 0 && (
        <Section label="Profil olfactif" expanded={expandedSections["olf"] ?? true} onToggle={() => onToggle("olf")}>
          <div className="flex flex-wrap gap-1.5">
            {(isPlant ? data.olfactiveProfile : data.olfactiveNotes).map((n: string, i: number) => (
              <Badge key={i} variant="secondary" className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300">{n}</Badge>
            ))}
          </div>
        </Section>
      )}
      {isPlant && data.therapeuticProperties?.length > 0 && (
        <Section label="Propriétés thérapeutiques" expanded={expandedSections["ther"] ?? true} onToggle={() => onToggle("ther")}>
          <div className="flex flex-wrap gap-1.5">
            {data.therapeuticProperties.map((p: string, i: number) => (
              <Badge key={i} variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300">{p}</Badge>
            ))}
          </div>
        </Section>
      )}
      {(isPlant ? data.dominantMolecules : data.keyMolecules)?.length > 0 && (
        <Section label="Molécules clés" expanded={expandedSections["mol"] ?? true} onToggle={() => onToggle("mol")}>
          <div className="flex flex-wrap gap-1.5">
            {(isPlant ? data.dominantMolecules : data.keyMolecules).map((m: string, i: number) => (
              <Badge key={i} variant="outline" className="font-mono text-xs">{m}</Badge>
            ))}
          </div>
        </Section>
      )}
      {isPlant && data.traditionalUse && (
        <Section label="Usage traditionnel" expanded={expandedSections["trad"] ?? false} onToggle={() => onToggle("trad")}>
          <p className="text-sm text-muted-foreground">{data.traditionalUse}</p>
        </Section>
      )}
      {isPlant && data.habitat && (
        <Section label="Habitat naturel" expanded={expandedSections["hab"] ?? false} onToggle={() => onToggle("hab")}>
          <p className="text-sm text-muted-foreground">{data.habitat}</p>
        </Section>
      )}
      {!isPlant && data.usagesInPerfumery && (
        <Section label="Usages en parfumerie" expanded={expandedSections["use"] ?? true} onToggle={() => onToggle("use")}>
          <p className="text-sm text-muted-foreground">{data.usagesInPerfumery}</p>
        </Section>
      )}
      {!isPlant && data.extractionDetails && (
        <Section label="Détails d'extraction" expanded={expandedSections["ext"] ?? false} onToggle={() => onToggle("ext")}>
          <p className="text-sm text-muted-foreground">{data.extractionDetails}</p>
        </Section>
      )}
      {!isPlant && data.qualityMarkers?.length > 0 && (
        <Section label="Marqueurs de qualité" expanded={expandedSections["qual"] ?? false} onToggle={() => onToggle("qual")}>
          <div className="flex flex-wrap gap-1.5">
            {data.qualityMarkers.map((m: string, i: number) => (
              <Badge key={i} variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300">{m}</Badge>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
