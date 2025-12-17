import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Loader2, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type EntityType = "molecules" | "recettes" | "accords" | "familles" | "matieres";
type ImportMode = "create" | "update" | "upsert";

interface ImportCSVDialogProps {
  entityType: EntityType;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onSuccess?: () => void;
}

const entityLabels: Record<EntityType, string> = {
  molecules: "Molécules",
  recettes: "Recettes",
  accords: "Accords",
  familles: "Familles",
  matieres: "Matières Premières",
};

const modeLabels: Record<ImportMode, { label: string; description: string }> = {
  create: {
    label: "Créer uniquement",
    description: "Créer de nouvelles entrées (erreur si existe déjà)",
  },
  update: {
    label: "Mettre à jour uniquement",
    description: "Mettre à jour les entrées existantes (erreur si n'existe pas)",
  },
  upsert: {
    label: "Créer ou mettre à jour",
    description: "Créer si n'existe pas, mettre à jour sinon (recommandé)",
  },
};

export function ImportCSVDialog({
  entityType,
  label,
  variant = "outline",
  size = "default",
  className = "",
  onSuccess,
}: ImportCSVDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string>("");
  const [mode, setMode] = useState<ImportMode>("upsert");
  const [step, setStep] = useState<"upload" | "preview" | "importing">("upload");
  const [previewData, setPreviewData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateMutation = trpc.import.validateCSV.useMutation();
  const importMoleculesMutation = trpc.import.molecules.useMutation();
  const importRecettesMutation = trpc.import.recettes.useMutation();
  const importAccordsMutation = trpc.import.accords.useMutation();
  const importFamillesMutation = trpc.import.familles.useMutation();
  const importMatieresMutation = trpc.import.matieres.useMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error("Veuillez sélectionner un fichier CSV");
      return;
    }

    setFile(selectedFile);

    // Read file content
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      setCsvData(content);

      // Validate and preview
      try {
        const result = await validateMutation.mutateAsync({
          entityType,
          csvData: content,
        });

        setPreviewData(result);
        setStep("preview");

        if (!result.success) {
          toast.error(`Erreurs de validation : ${result.errors.length} erreur(s)`);
        } else {
          toast.success(`Fichier validé : ${result.rowCount} ligne(s)`);
        }
      } catch (error) {
        toast.error(`Erreur lors de la validation : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (!csvData) {
      toast.error("Aucun fichier sélectionné");
      return;
    }

    setStep("importing");

    try {
      let result: any;

      switch (entityType) {
        case "molecules":
          result = await importMoleculesMutation.mutateAsync({ csvData, mode });
          break;
        case "recettes":
          result = await importRecettesMutation.mutateAsync({ csvData, mode });
          break;
        case "accords":
          result = await importAccordsMutation.mutateAsync({ csvData, mode });
          break;
        case "familles":
          result = await importFamillesMutation.mutateAsync({ csvData, mode });
          break;
        case "matieres":
          result = await importMatieresMutation.mutateAsync({ csvData, mode });
          break;
      }

      if (result.success) {
        toast.success(
          `Import réussi : ${result.created} créé(s), ${result.updated} mis à jour`
        );
        setOpen(false);
        resetDialog();
        onSuccess?.();
      } else {
        toast.error(
          `Import terminé avec ${result.errors.length} erreur(s). ${result.created} créé(s), ${result.updated} mis à jour.`
        );
        console.error("Import errors:", result.errors);
      }
    } catch (error) {
      toast.error(`Erreur lors de l'import : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setStep("preview");
    }
  };

  const resetDialog = () => {
    setFile(null);
    setCsvData("");
    setMode("upsert");
    setStep("upload");
    setPreviewData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Upload className="w-4 h-4 mr-2" />
          {label || `Importer ${entityLabels[entityType]}`}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importer {entityLabels[entityType]}</DialogTitle>
          <DialogDescription>
            Importez des données au format CSV. Le fichier doit contenir les colonnes appropriées.
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file">Fichier CSV</Label>
              <input
                ref={fileInputRef}
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90
                  cursor-pointer"
              />
            </div>

            <div>
              <Label>Mode d'import</Label>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as ImportMode)} className="mt-2 space-y-2">
                {Object.entries(modeLabels).map(([key, { label: modeLabel, description }]) => (
                  <div key={key} className="flex items-start space-x-2">
                    <RadioGroupItem value={key} id={key} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={key} className="font-medium cursor-pointer">
                        {modeLabel}
                      </Label>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}

        {step === "preview" && previewData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted">
              <FileText className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{file?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {previewData.rowCount} ligne(s) détectée(s)
                </p>
              </div>
            </div>

            {previewData.success ? (
              <div className="flex items-start gap-2 p-3 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Validation réussie
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Toutes les données sont valides et prêtes à être importées.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-900 dark:text-red-100">
                    {previewData.errors.length} erreur(s) détectée(s)
                  </p>
                  <ul className="mt-2 text-sm text-red-700 dark:text-red-300 space-y-1 max-h-40 overflow-y-auto">
                    {previewData.errors.slice(0, 10).map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {previewData.errors.length > 10 && (
                      <li className="italic">... et {previewData.errors.length - 10} autre(s)</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            <div>
              <Label>Mode d'import sélectionné</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {modeLabels[mode].label} - {modeLabels[mode].description}
              </p>
            </div>
          </div>
        )}

        {step === "importing" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Import en cours...</p>
            <p className="text-sm text-muted-foreground">
              Veuillez patienter pendant l'import des données.
            </p>
          </div>
        )}

        <DialogFooter>
          {step === "upload" && (
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
          )}
          {step === "preview" && (
            <>
              <Button variant="outline" onClick={() => setStep("upload")}>
                Retour
              </Button>
              <Button
                onClick={handleImport}
                disabled={!previewData?.success}
              >
                Importer {previewData?.rowCount} ligne(s)
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
