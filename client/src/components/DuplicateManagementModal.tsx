// @ts-nocheck
/**
 * Modal de gestion des doublons
 * Permet de comparer, sélectionner et fusionner les entrées dupliquées
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Merge,
  Info,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface Molecule {
  id: number;
  nom: string | null;
  cas_number: string | null;
  smiles: string | null;
  description: string | null;
}

interface Plant {
  id: number;
  scientific_name: string | null;
  common_name: string | null;
  family: string | null;
  description: string | null;
}

interface DuplicateManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "molecule" | "plant";
  duplicateType: "name" | "cas" | "smiles" | "scientific" | "common";
  value: string;
  onMergeComplete: () => void;
}

export function DuplicateManagementModal({
  open,
  onOpenChange,
  type,
  duplicateType,
  value,
  onMergeComplete,
}: DuplicateManagementModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [step, setStep] = useState<"select" | "confirm" | "merging" | "success">("select");

  // Requêtes pour récupérer les détails des doublons
  const { data: moleculeData, isLoading: moleculeLoading } = 
    trpc.duplicates.getMoleculeDuplicateDetails.useQuery(
      { type: duplicateType as "name" | "cas" | "smiles", value },
      { enabled: open && type === "molecule" }
    );

  const { data: plantData, isLoading: plantLoading } = 
    trpc.duplicates.getPlantDuplicateDetails.useQuery(
      { type: duplicateType as "scientific" | "common", value },
      { enabled: open && type === "plant" }
    );

  // Mutations pour fusionner
  const mergeMoleculesMutation = trpc.duplicates.mergeMolecules.useMutation({
    onSuccess: () => {
      setStep("success");
      toast.success("Molécules fusionnées avec succès !");
      setTimeout(() => {
        onMergeComplete();
        onOpenChange(false);
        resetModal();
      }, 2000);
    },
    onError: (error) => {
      toast.error(`Erreur lors de la fusion : ${error.message}`);
      setStep("select");
    },
  });

  const mergePlantsMutation = trpc.duplicates.mergePlants.useMutation({
    onSuccess: () => {
      setStep("success");
      toast.success("Plantes fusionnées avec succès !");
      setTimeout(() => {
        onMergeComplete();
        onOpenChange(false);
        resetModal();
      }, 2000);
    },
    onError: (error) => {
      toast.error(`Erreur lors de la fusion : ${error.message}`);
      setStep("select");
    },
  });

  const resetModal = () => {
    setSelectedId(null);
    setStep("select");
  };

  const handleMerge = () => {
    if (!selectedId) {
      toast.error("Veuillez sélectionner une entrée principale");
      return;
    }

    setStep("merging");

    const duplicates = type === "molecule" ? moleculeData : plantData;
    if (!duplicates) return;

    const idsToMerge = duplicates
      .filter((d: any) => d.id !== selectedId)
      .map((d: any) => d.id);

    if (type === "molecule") {
      // Fusionner les molécules une par une
      idsToMerge.forEach((mergeId: number) => {
        mergeMoleculesMutation.mutate({ keepId: selectedId, mergeId });
      });
    } else {
      // Fusionner les plantes une par une
      idsToMerge.forEach((mergeId: number) => {
        mergePlantsMutation.mutate({ keepId: selectedId, mergeId });
      });
    }
  };

  const renderMoleculeComparison = (molecules: Molecule[]) => {
    return (
      <div className="space-y-4">
        <RadioGroup value={selectedId?.toString()} onValueChange={(v) => setSelectedId(parseInt(v))}>
          {molecules.map((molecule) => (
            <div key={molecule.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={molecule.id.toString()} id={`mol-${molecule.id}`} />
                <Label htmlFor={`mol-${molecule.id}`} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">ID: {molecule.id}</span>
                    {selectedId === molecule.id && (
                      <Badge variant="default">Entrée principale</Badge>
                    )}
                  </div>
                </Label>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Nom:</span>
                  <p className="font-medium">{molecule.nom || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">CAS:</span>
                  <p className="font-medium">{molecule.cas_number || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">SMILES:</span>
                  <p className="font-mono text-xs break-all">{molecule.smiles || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Description:</span>
                  <p className="text-xs">{molecule.description || "N/A"}</p>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  const renderPlantComparison = (plants: Plant[]) => {
    return (
      <div className="space-y-4">
        <RadioGroup value={selectedId?.toString()} onValueChange={(v) => setSelectedId(parseInt(v))}>
          {plants.map((plant) => (
            <div key={plant.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={plant.id.toString()} id={`plant-${plant.id}`} />
                <Label htmlFor={`plant-${plant.id}`} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">ID: {plant.id}</span>
                    {selectedId === plant.id && (
                      <Badge variant="default">Entrée principale</Badge>
                    )}
                  </div>
                </Label>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Nom scientifique:</span>
                  <p className="font-medium italic">{plant.scientific_name || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nom commun:</span>
                  <p className="font-medium">{plant.common_name || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Famille:</span>
                  <p className="font-medium">{plant.family || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Description:</span>
                  <p className="text-xs">{plant.description || "N/A"}</p>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  const renderSelectStep = () => {
    const isLoading = moleculeLoading || plantLoading;
    const data = type === "molecule" ? moleculeData : plantData;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Chargement des doublons...</span>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Aucun doublon trouvé</AlertTitle>
          <AlertDescription>
            Impossible de trouver les entrées dupliquées pour cette valeur.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Sélectionnez l'entrée principale</AlertTitle>
          <AlertDescription>
            Choisissez l'entrée que vous souhaitez conserver. Les autres entrées seront fusionnées dans celle-ci,
            et leurs données manquantes seront ajoutées.
          </AlertDescription>
        </Alert>

        <div className="max-h-[400px] overflow-y-auto">
          {type === "molecule" 
            ? renderMoleculeComparison(data as Molecule[])
            : renderPlantComparison(data as Plant[])
          }
        </div>
      </>
    );
  };

  const renderConfirmStep = () => {
    const data = type === "molecule" ? moleculeData : plantData;
    if (!data || !selectedId) return null;

    const selectedEntry = data.find((d: any) => d.id === selectedId);
    // `find` peut ne rien trouver si la liste a été rechargée depuis la
    // sélection — une autre fusion ayant supprimé la ligne, par exemple.
    // Sans ce garde, l'étape de confirmation d'une opération irréversible
    // plantait sur `selectedEntry.id`.
    if (!selectedEntry) return null;
    const otherEntries = data.filter((d: any) => d.id !== selectedId);

    return (
      <>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention : Opération irréversible</AlertTitle>
          <AlertDescription>
            Cette action va fusionner {otherEntries.length} entrée(s) dans l'entrée principale.
            Les entrées fusionnées seront supprimées de la base de données.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Entrée principale (conservée) :</h4>
            <div className="border rounded-lg p-3 bg-green-50 dark:bg-green-950">
              <p className="font-medium">ID: {selectedEntry.id}</p>
              <p className="text-sm text-muted-foreground">
                {type === "molecule" 
                  ? (selectedEntry as Molecule).nom
                  : (selectedEntry as Plant).scientific_name
                }
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Entrées à fusionner (supprimées) :</h4>
            <div className="space-y-2">
              {otherEntries.map((entry: any) => (
                <div key={entry.id} className="border rounded-lg p-3 bg-red-50 dark:bg-red-950">
                  <p className="font-medium">ID: {entry.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {type === "molecule" ? entry.nom : entry.scientific_name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderMergingStep = () => {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Fusion en cours...</p>
        <p className="text-sm text-muted-foreground">
          Mise à jour des relations et fusion des données
        </p>
      </div>
    );
  };

  const renderSuccessStep = () => {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
        <p className="text-lg font-medium">Fusion réussie !</p>
        <p className="text-sm text-muted-foreground">
          Les doublons ont été fusionnés avec succès
        </p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Merge className="w-5 h-5 mr-2" />
            Gestion des Doublons
          </DialogTitle>
          <DialogDescription>
            {type === "molecule" ? "Molécules" : "Plantes"} dupliquées pour : <strong>{value}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === "select" && renderSelectStep()}
          {step === "confirm" && renderConfirmStep()}
          {step === "merging" && renderMergingStep()}
          {step === "success" && renderSuccessStep()}
        </div>

        <DialogFooter>
          {step === "select" && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => setStep("confirm")} 
                disabled={!selectedId}
              >
                Continuer
              </Button>
            </>
          )}
          {step === "confirm" && (
            <>
              <Button variant="outline" onClick={() => setStep("select")}>
                Retour
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleMerge}
              >
                <Merge className="w-4 h-4 mr-2" />
                Fusionner
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
