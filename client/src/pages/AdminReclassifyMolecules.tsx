import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ArrowRight, Trash2, Search, RefreshCw, PackageOpen, AlertTriangle, CheckCircle2, Filter } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  huile_essentielle: "Huile essentielle",
  absolue: "Absolue",
  concrete: "Concrète",
  resinoid: "Résinoïde",
  teinture: "Teinture",
  co2_extract: "Extrait CO2",
  hydrolat: "Hydrolat",
  beurre: "Beurre végétal",
  cire: "Cire",
  oleoresine: "Oléorésine",
  infusion: "Infusion",
  maceration: "Macération",
  distillat: "Distillat",
  accord_olfactif: "Accord olfactif",
  molecule_isolee: "Molécule isolée",
  matiere_animale: "Matière animale",
  autre: "Autre",
};

// Deviner la catégorie à partir du nom
function guessCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("huile") || n.includes("he ") || n.includes(" he)") || n.includes("oil")) return "huile_essentielle";
  if (n.includes("absolu") || n.includes("absolute")) return "absolue";
  if (n.includes("résine") || n.includes("resin") || n.includes("résinoïde") || n.includes("resinoid")) return "resinoid";
  if (n.includes("oléorésine") || n.includes("oleoresin")) return "oleoresine";
  if (n.includes("accord")) return "accord_olfactif";
  if (n.includes("beurre")) return "beurre";
  if (n.includes("teinture")) return "teinture";
  if (n.includes("infusion")) return "infusion";
  if (n.includes("hydrolat")) return "hydrolat";
  if (n.includes("kaolin") || n.includes("mousse") || n.includes("ambre") || n.includes("ambergris")) return "matiere_animale";
  if (n.includes("attar") || n.includes("extrait") || n.includes("extract") || n.includes("concrete")) return "absolue";
  return "autre";
}

type MoleculeItem = {
  id: number;
  name: string | null;
  family: string | null;
  chemicalFamily: string | null;
  casNumber: string | null;
  pubchemCid: string | null;
  notes: string | null;
  sourceOrigin: string | null;
};

export default function AdminReclassifyMolecules() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Record<number, string>>({});
  const [processing, setProcessing] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState<Set<number>>(new Set());

  const { data: misclassified = [], isLoading, refetch } = trpc.dataCleanup.getMisclassifiedMolecules.useQuery();

  const reclassify = trpc.dataCleanup.reclassifyToRawMaterial.useMutation({
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success(`"${result.molecule?.name}" déplacée vers Matières Premières`);
        setDone(prev => new Set([...prev, variables.moleculeId]));
      } else {
        toast.error("Erreur : " + (result as any).error);
      }
      setProcessing(prev => ({ ...prev, [variables.moleculeId]: false }));
    },
    onError: (err) => {
      toast.error("Erreur : " + err.message);
    }
  });

  const deleteMol = trpc.dataCleanup.deleteMisclassified.useMutation({
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success("Entrée supprimée");
        setDone(prev => new Set([...prev, variables.id]));
      }
    },
    onError: (err) => toast.error("Erreur : " + err.message),
  });

  const filtered = (misclassified as MoleculeItem[]).filter(m => {
    if (done.has(m.id)) return false;
    if (!search) return true;
    return (m.name || "").toLowerCase().includes(search.toLowerCase());
  });

  const handleReclassify = (mol: MoleculeItem) => {
    const category = selectedCategories[mol.id] || guessCategory(mol.name || "");
    setProcessing(prev => ({ ...prev, [mol.id]: true }));
    reclassify.mutate({ moleculeId: mol.id, category: category as any, dryRun: false });
  };

  const reclassifyAllBatch = trpc.dataCleanup.reclassifyAllBatch.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success(`${result.processed} matières premières reclassifiées avec succès !`);
        if (result.errors && result.errors.length > 0) {
          toast.warning(`${result.errors.length} erreur(s) : ${result.errors.slice(0, 3).join(', ')}`);
        }
        refetch();
        setDone(new Set());
      }
    },
    onError: (err) => toast.error("Erreur batch : " + err.message),
  });

  const handleReclassifyAll = () => {
    reclassifyAllBatch.mutate();
  };

  const remaining = filtered.length;
  const totalProcessed = done.size;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <PackageOpen className="w-6 h-6 text-amber-500" />
              Reclassification des Matières Premières
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Ces entrées sont dans la table <code className="bg-muted px-1 rounded">molecules</code> mais correspondent à des matières premières (extraits, résines, accords…). Déplacez-les vers <code className="bg-muted px-1 rounded">raw_materials</code>.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-amber-600">{(misclassified as MoleculeItem[]).length}</div>
              <div className="text-sm text-muted-foreground">Entrées détectées</div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{totalProcessed}</div>
              <div className="text-sm text-muted-foreground">Traitées cette session</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{remaining}</div>
              <div className="text-sm text-muted-foreground">Restantes à traiter</div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche + action globale */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {remaining > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default" className="gap-2 bg-amber-600 hover:bg-amber-700">
                  <ArrowRight className="w-4 h-4" />
                  Tout reclassifier ({Math.min(remaining, 50)})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Confirmer la reclassification en lot
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {Math.min(remaining, 50)} entrées seront déplacées de <strong>molecules</strong> vers <strong>raw_materials</strong> avec les catégories détectées automatiquement. Cette action est irréversible depuis cette interface.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReclassifyAll} className="bg-amber-600 hover:bg-amber-700">
                    Confirmer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Liste des molécules mal classées */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Analyse en cours…</div>
        ) : filtered.length === 0 ? (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 dark:text-green-300 font-medium">
                {totalProcessed > 0
                  ? `Toutes les entrées ont été traitées (${totalProcessed} reclassifiées).`
                  : "Aucune matière première détectée dans la table molecules."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map(mol => {
              const guessed = guessCategory(mol.name || "");
              const selected = selectedCategories[mol.id] || guessed;
              const isProcessing = processing[mol.id];

              return (
                <Card key={mol.id} className="border border-border">
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Nom */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{mol.name}</div>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {mol.family && (
                            <Badge variant="outline" className="text-xs">{mol.family}</Badge>
                          )}
                          {mol.casNumber && (
                            <Badge variant="secondary" className="text-xs font-mono">CAS {mol.casNumber}</Badge>
                          )}
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                            Sans PubChem
                          </Badge>
                        </div>
                      </div>

                      {/* Sélecteur de catégorie */}
                      <div className="w-48 shrink-0">
                        <Select
                          value={selected}
                          onValueChange={val => setSelectedCategories(prev => ({ ...prev, [mol.id]: val }))}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                              <SelectItem key={val} value={val} className="text-xs">{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="default"
                          className="h-8 gap-1 bg-amber-600 hover:bg-amber-700 text-xs"
                          onClick={() => handleReclassify(mol)}
                          disabled={isProcessing}
                        >
                          <ArrowRight className="w-3 h-3" />
                          {isProcessing ? "…" : "Déplacer"}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 gap-1 text-red-500 hover:text-red-700 text-xs">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer "{mol.name}" ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette entrée sera supprimée définitivement de la table molecules sans être déplacée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMol.mutate({ id: mol.id })}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
