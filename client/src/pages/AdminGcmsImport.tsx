import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  FlaskConical, Upload, Download, Plus, Trash2, CheckCircle2,
  AlertCircle, Search, ArrowLeft, FileText, Loader2, Info
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type MolRow = {
  id: string;
  moleculeId?: number;
  moleculeName: string;
  percentageMin?: number;
  percentageMax?: number;
  percentageTypical?: number;
  role: "majeur" | "secondaire" | "trace" | "variable";
  isSignature: boolean;
  source: string;
  notes: string;
};

type PlantResult = { id: number; name: string; latin_name: string; category: string };
type MolResult = { id: number; name: string; cas_number: string; olfactive_family: string };

const ROLE_LABELS: Record<string, string> = {
  majeur: "Majeur",
  secondaire: "Secondaire",
  trace: "Trace",
  variable: "Variable",
};

const CSV_TEMPLATE = `plant_name,molecule_name,percentage_min,percentage_max,percentage_typical,role,is_signature,source,notes
Virginia (flue-cured),Nicotine,1.0,2.5,1.8,majeur,false,GC-MS Rodgman 2013,Alcaloïde principal
Virginia (flue-cured),Solanone,0.1,0.5,0.3,secondaire,true,GC-MS Tobacco Chemistry,Cétone signature du Virginia
Latakia,Gaïacol,0.5,2.0,1.2,majeur,true,GC-MS Pyrolysis,Phénol de fumage laurier
`;

const JSON_TEMPLATE = JSON.stringify([
  {
    plantName: "Virginia (flue-cured)",
    moleculeName: "Nicotine",
    percentageMin: 1.0,
    percentageMax: 2.5,
    percentageTypical: 1.8,
    role: "majeur",
    isSignature: false,
    source: "GC-MS Rodgman 2013",
    notes: "Alcaloïde principal"
  },
  {
    plantName: "Latakia",
    moleculeName: "Gaïacol",
    percentageMin: 0.5,
    percentageMax: 2.0,
    percentageTypical: 1.2,
    role: "majeur",
    isSignature: true,
    source: "GC-MS Pyrolysis",
    notes: "Phénol de fumage laurier"
  }
], null, 2);

// ─── Composant principal ──────────────────────────────────────────────────────

export default function AdminGcmsImport() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Recherche plante
  const [plantQuery, setPlantQuery] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<PlantResult | null>(null);
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [bibliography, setBibliography] = useState("");

  // Recherche molécule (formulaire manuel)
  const [molQuery, setMolQuery] = useState("");
  const [molResults, setMolResults] = useState<MolResult[]>([]);
  const [rows, setRows] = useState<MolRow[]>([]);

  // Import CSV/JSON
  const [csvText, setCsvText] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [importMode, setImportMode] = useState<"csv" | "json">("csv");

  // Résultats
  const [previewData, setPreviewData] = useState<any>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // tRPC
  const plantSearch = trpc.gcmsImport.searchPlant.useQuery(
    { query: plantQuery },
    { enabled: plantQuery.length >= 2 }
  );
  const molSearch = trpc.gcmsImport.searchMolecule.useQuery(
    { query: molQuery },
    { enabled: molQuery.length >= 2 }
  );
  const previewMutation = trpc.gcmsImport.preview.useMutation();
  const importBatchMutation = trpc.gcmsImport.importBatch.useMutation();
  const importCsvMutation = trpc.gcmsImport.importFromCsv.useMutation();

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-semibold">Accès réservé aux administrateurs</p>
        </Card>
      </div>
    );
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const addRow = () => {
    setRows(prev => [...prev, {
      id: crypto.randomUUID(),
      moleculeName: "",
      role: "secondaire",
      isSignature: false,
      source: "",
      notes: "",
    }]);
  };

  const updateRow = (id: string, field: keyof MolRow, value: any) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const selectMoleculeForRow = (rowId: string, mol: MolResult) => {
    setRows(prev => prev.map(r =>
      r.id === rowId ? { ...r, moleculeId: mol.id, moleculeName: mol.name } : r
    ));
    setMolQuery("");
    setMolResults([]);
  };

  const downloadTemplate = (type: "csv" | "json") => {
    const content = type === "csv" ? CSV_TEMPLATE : JSON_TEMPLATE;
    const mime = type === "csv" ? "text/csv" : "application/json";
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gcms_template.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Preview (dry-run) ────────────────────────────────────────────────────

  const handlePreview = async () => {
    if (!selectedPlant) return toast({ title: "Sélectionnez une plante", variant: "destructive" });
    if (rows.length === 0) return toast({ title: "Ajoutez au moins une molécule", variant: "destructive" });
    setIsLoading(true);
    try {
      const result = await previewMutation.mutateAsync({
        plantId: selectedPlant.id,
        molecules: rows.map(r => ({
          moleculeId: r.moleculeId,
          moleculeName: r.moleculeName,
          percentageMin: r.percentageMin,
          percentageMax: r.percentageMax,
          percentageTypical: r.percentageTypical,
          role: r.role,
          isSignature: r.isSignature,
          source: r.source || undefined,
          notes: r.notes || undefined,
        })),
        overwriteExisting,
      });
      setPreviewData(result);
      setImportResult(null);
    } catch (e: any) {
      toast({ title: "Erreur de prévisualisation", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Import batch (formulaire manuel) ────────────────────────────────────

  const handleImportBatch = async () => {
    if (!selectedPlant) return toast({ title: "Sélectionnez une plante", variant: "destructive" });
    if (rows.length === 0) return toast({ title: "Ajoutez au moins une molécule", variant: "destructive" });
    setIsLoading(true);
    try {
      const result = await importBatchMutation.mutateAsync({
        plantId: selectedPlant.id,
        molecules: rows.map(r => ({
          moleculeId: r.moleculeId,
          moleculeName: r.moleculeName,
          percentageMin: r.percentageMin,
          percentageMax: r.percentageMax,
          percentageTypical: r.percentageTypical,
          role: r.role,
          isSignature: r.isSignature,
          source: r.source || undefined,
          notes: r.notes || undefined,
        })),
        overwriteExisting,
        bibliography: bibliography ? bibliography.split("\n").filter(Boolean) : undefined,
      });
      setImportResult(result);
      setPreviewData(null);
      toast({ title: `Import terminé : ${result.created} créés, ${result.updated} mis à jour` });
    } catch (e: any) {
      toast({ title: "Erreur d'import", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Import CSV/JSON ──────────────────────────────────────────────────────

  const parseCsvRows = (csv: string) => {
    const lines = csv.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map(line => {
      const vals = line.split(",").map(v => v.trim());
      const obj: any = {};
      headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
      return {
        plantName: obj.plant_name || "",
        moleculeName: obj.molecule_name || "",
        percentageMin: obj.percentage_min ? parseFloat(obj.percentage_min) : undefined,
        percentageMax: obj.percentage_max ? parseFloat(obj.percentage_max) : undefined,
        percentageTypical: obj.percentage_typical ? parseFloat(obj.percentage_typical) : undefined,
        role: obj.role || undefined,
        isSignature: obj.is_signature === "true",
        source: obj.source || undefined,
        notes: obj.notes || undefined,
      };
    }).filter(r => r.plantName && r.moleculeName);
  };

  const handleBulkImport = async () => {
    setIsLoading(true);
    try {
      let parsedRows: any[] = [];
      if (importMode === "csv") {
        parsedRows = parseCsvRows(csvText);
        if (parsedRows.length === 0) {
          toast({ title: "CSV vide ou invalide", variant: "destructive" });
          return;
        }
      } else {
        try { parsedRows = JSON.parse(jsonText); }
        catch { toast({ title: "JSON invalide", variant: "destructive" }); return; }
      }

      const result = await importCsvMutation.mutateAsync({ rows: parsedRows, overwriteExisting });
      setImportResult(result);
      toast({ title: `Import terminé : ${result.created} créés, ${result.updated} mis à jour, ${result.notFound} non trouvés` });
    } catch (e: any) {
      toast({ title: "Erreur d'import", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/admin/validation">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Retour admin</Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-emerald-500" />
              Import GC-MS
            </h1>
            <p className="text-sm text-muted-foreground">
              Intégrez des profils moléculaires issus de données GC-MS dans la base PERFUMUM
            </p>
          </div>
        </div>

        {/* Info */}
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
          <CardContent className="pt-4 pb-3">
            <div className="flex gap-3 text-sm text-blue-800 dark:text-blue-300">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <strong>Format attendu :</strong> chaque ligne associe une plante à une molécule avec ses pourcentages GC-MS.
                Les molécules doivent exister dans la base. Si une molécule n'est pas trouvée, elle sera signalée dans le rapport.
                Utilisez le <strong>mode prévisualisation</strong> avant d'importer pour vérifier les correspondances.
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="manual">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="manual">Saisie manuelle</TabsTrigger>
            <TabsTrigger value="bulk">Import CSV / JSON</TabsTrigger>
          </TabsList>

          {/* ─── ONGLET SAISIE MANUELLE ─────────────────────────────────── */}
          <TabsContent value="manual" className="space-y-5 mt-5">

            {/* Sélection plante */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">1. Sélectionner la plante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Rechercher une plante (ex: Virginia, Latakia, Cannabis...)"
                    value={plantQuery}
                    onChange={e => { setPlantQuery(e.target.value); setSelectedPlant(null); }}
                  />
                </div>
                {plantSearch.data && plantSearch.data.length > 0 && !selectedPlant && (
                  <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
                    {plantSearch.data.map((p: PlantResult) => (
                      <button
                        key={p.id}
                        className="w-full text-left px-3 py-2 hover:bg-muted text-sm flex items-center justify-between"
                        onClick={() => { setSelectedPlant(p); setPlantQuery(p.name); }}
                      >
                        <span className="font-medium">{p.name}</span>
                        <span className="text-muted-foreground text-xs italic">{p.latin_name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {selectedPlant && (
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-md border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium">{selectedPlant.name}</span>
                    <span className="text-xs text-muted-foreground italic">{selectedPlant.latin_name}</span>
                    <Badge variant="outline" className="ml-auto text-xs">{selectedPlant.category}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tableau des molécules */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">2. Molécules GC-MS</CardTitle>
                  <Button size="sm" onClick={addRow} variant="outline">
                    <Plus className="w-3 h-3 mr-1" /> Ajouter une ligne
                  </Button>
                </div>
                <CardDescription>
                  Saisissez les molécules identifiées par GC-MS avec leurs concentrations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {rows.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                    Cliquez sur "Ajouter une ligne" pour commencer la saisie
                  </div>
                )}
                {rows.map((row, idx) => (
                  <div key={row.id} className="border rounded-lg p-3 space-y-3 bg-card">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">Molécule #{idx + 1}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeRow(row.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Nom molécule avec recherche */}
                    <div className="space-y-1">
                      <Label className="text-xs">Nom de la molécule *</Label>
                      <div className="relative">
                        <Input
                          placeholder="Rechercher ou saisir un nom..."
                          value={row.moleculeName}
                          onChange={e => {
                            updateRow(row.id, "moleculeName", e.target.value);
                            updateRow(row.id, "moleculeId", undefined);
                            setMolQuery(e.target.value);
                          }}
                          onFocus={() => setMolQuery(row.moleculeName)}
                          className="text-sm"
                        />
                        {row.moleculeId && (
                          <CheckCircle2 className="absolute right-2 top-2.5 w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      {molSearch.data && molSearch.data.length > 0 && molQuery === row.moleculeName && !row.moleculeId && (
                        <div className="border rounded-md divide-y max-h-36 overflow-y-auto z-10 bg-popover shadow-md">
                          {molSearch.data.map((m: MolResult) => (
                            <button
                              key={m.id}
                              className="w-full text-left px-3 py-1.5 hover:bg-muted text-xs flex items-center justify-between"
                              onClick={() => selectMoleculeForRow(row.id, m)}
                            >
                              <span className="font-medium">{m.name}</span>
                              <span className="text-muted-foreground">{m.cas_number}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pourcentages */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">% Min</Label>
                        <Input
                          type="number" min="0" max="100" step="0.01"
                          placeholder="0.0"
                          value={row.percentageMin ?? ""}
                          onChange={e => updateRow(row.id, "percentageMin", e.target.value ? parseFloat(e.target.value) : undefined)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">% Typique</Label>
                        <Input
                          type="number" min="0" max="100" step="0.01"
                          placeholder="0.0"
                          value={row.percentageTypical ?? ""}
                          onChange={e => updateRow(row.id, "percentageTypical", e.target.value ? parseFloat(e.target.value) : undefined)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">% Max</Label>
                        <Input
                          type="number" min="0" max="100" step="0.01"
                          placeholder="0.0"
                          value={row.percentageMax ?? ""}
                          onChange={e => updateRow(row.id, "percentageMax", e.target.value ? parseFloat(e.target.value) : undefined)}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* Rôle + Signature */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Rôle</Label>
                        <Select value={row.role} onValueChange={v => updateRow(row.id, "role", v)}>
                          <SelectTrigger className="text-sm h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ROLE_LABELS).map(([v, l]) => (
                              <SelectItem key={v} value={v}>{l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Molécule signature</Label>
                        <div className="flex items-center gap-2 pt-1">
                          <Switch
                            checked={row.isSignature}
                            onCheckedChange={v => updateRow(row.id, "isSignature", v)}
                          />
                          <span className="text-xs text-muted-foreground">{row.isSignature ? "Oui" : "Non"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Source + Notes */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Source bibliographique</Label>
                        <Input
                          placeholder="ex: Rodgman & Perfetti 2013"
                          value={row.source}
                          onChange={e => updateRow(row.id, "source", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Notes</Label>
                        <Input
                          placeholder="ex: Phénol de fumage laurier"
                          value={row.notes}
                          onChange={e => updateRow(row.id, "notes", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">3. Options d'import</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Switch checked={overwriteExisting} onCheckedChange={setOverwriteExisting} />
                  <div>
                    <Label className="text-sm font-medium">Écraser les liaisons existantes</Label>
                    <p className="text-xs text-muted-foreground">Si désactivé, les molécules déjà liées à cette plante seront ignorées.</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Bibliographie (une référence par ligne)</Label>
                  <Textarea
                    placeholder={"Rodgman A. & Perfetti T.A. (2013). The Chemical Components of Tobacco and Tobacco Smoke.\nTobacco Chemistry, 2nd ed., CRC Press."}
                    value={bibliography}
                    onChange={e => setBibliography(e.target.value)}
                    rows={3}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={handlePreview} disabled={isLoading || !selectedPlant || rows.length === 0}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Prévisualiser
              </Button>
              <Button onClick={handleImportBatch} disabled={isLoading || !selectedPlant || rows.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Importer en base
              </Button>
            </div>

            {/* Résultats prévisualisation */}
            {previewData && (
              <>
                <ImportReport data={previewData} mode="preview" />
                {/* Bouton de confirmation après dry-run */}
                <div className="flex items-center justify-between p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-emerald-400">Prévisualisation terminée</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {previewData.summary?.newLinks ?? 0} nouveau(x) lien(s) à créer,{' '}
                      {previewData.summary?.skipped ?? 0} doublon(s) ignoré(s)
                    </p>
                  </div>
                  <Button
                    onClick={handleImportBatch}
                    disabled={isLoading || (previewData.summary?.newLinks ?? 0) === 0}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    Confirmer l'import
                  </Button>
                </div>
              </>
            )}
            {importResult && <ImportReport data={importResult} mode="result" />}
          </TabsContent>

          {/* ─── ONGLET IMPORT CSV/JSON ─────────────────────────────────── */}
          <TabsContent value="bulk" className="space-y-5 mt-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Import par lot</CardTitle>
                <CardDescription>
                  Importez plusieurs plantes et molécules en une seule opération via un fichier CSV ou JSON.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Télécharger template */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => downloadTemplate("csv")}>
                    <Download className="w-3 h-3 mr-1" /> Template CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadTemplate("json")}>
                    <Download className="w-3 h-3 mr-1" /> Template JSON
                  </Button>
                </div>

                {/* Sélection format */}
                <div className="flex gap-2">
                  <Button
                    variant={importMode === "csv" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setImportMode("csv")}
                  >
                    <FileText className="w-3 h-3 mr-1" /> CSV
                  </Button>
                  <Button
                    variant={importMode === "json" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setImportMode("json")}
                  >
                    <FileText className="w-3 h-3 mr-1" /> JSON
                  </Button>
                </div>

                {importMode === "csv" ? (
                  <div className="space-y-1">
                    <Label className="text-sm">Contenu CSV</Label>
                    <p className="text-xs text-muted-foreground">
                      Colonnes attendues : <code className="bg-muted px-1 rounded">plant_name, molecule_name, percentage_min, percentage_max, percentage_typical, role, is_signature, source, notes</code>
                    </p>
                    <Textarea
                      placeholder={CSV_TEMPLATE}
                      value={csvText}
                      onChange={e => setCsvText(e.target.value)}
                      rows={10}
                      className="text-xs font-mono"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Label className="text-sm">Contenu JSON</Label>
                    <p className="text-xs text-muted-foreground">
                      Tableau d'objets avec les champs : <code className="bg-muted px-1 rounded">plantName, moleculeName, percentageMin, percentageMax, percentageTypical, role, isSignature, source, notes</code>
                    </p>
                    <Textarea
                      placeholder={JSON_TEMPLATE}
                      value={jsonText}
                      onChange={e => setJsonText(e.target.value)}
                      rows={12}
                      className="text-xs font-mono"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Switch checked={overwriteExisting} onCheckedChange={setOverwriteExisting} />
                  <Label className="text-sm">Écraser les liaisons existantes</Label>
                </div>

                <Button
                  onClick={handleBulkImport}
                  disabled={isLoading || (importMode === "csv" ? !csvText.trim() : !jsonText.trim())}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  Importer
                </Button>

                {importResult && <ImportReport data={importResult} mode="result" />}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Composant rapport d'import ───────────────────────────────────────────────

function ImportReport({ data, mode }: { data: any; mode: "preview" | "result" }) {
  const isPreview = mode === "preview";
  return (
    <Card className={isPreview ? "border-blue-200 bg-blue-50/30 dark:bg-blue-950/10" : "border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/10"}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {isPreview ? <Search className="w-4 h-4 text-blue-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          {isPreview ? "Prévisualisation (aucune donnée écrite)" : "Rapport d'import"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="bg-background rounded p-2 text-center">
            <div className="text-2xl font-bold text-emerald-600">{isPreview ? data.newLinks : data.created}</div>
            <div className="text-xs text-muted-foreground">{isPreview ? "À créer" : "Créés"}</div>
          </div>
          <div className="bg-background rounded p-2 text-center">
            <div className="text-2xl font-bold text-blue-600">{isPreview ? data.updates : data.updated}</div>
            <div className="text-xs text-muted-foreground">{isPreview ? "À mettre à jour" : "Mis à jour"}</div>
          </div>
          <div className="bg-background rounded p-2 text-center">
            <div className="text-2xl font-bold text-amber-600">{data.skipped}</div>
            <div className="text-xs text-muted-foreground">Ignorés</div>
          </div>
          <div className="bg-background rounded p-2 text-center">
            <div className="text-2xl font-bold text-destructive">{data.notFound}</div>
            <div className="text-xs text-muted-foreground">Non trouvés</div>
          </div>
        </div>

        {/* Détail des lignes (preview) */}
        {isPreview && data.rows && data.rows.length > 0 && (
          <div className="max-h-64 overflow-y-auto border rounded-md divide-y text-xs">
            {data.rows.map((r: any, i: number) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5">
                <StatusBadge status={r.status} />
                <span className="font-medium flex-1">{r.moleculeName}</span>
                {r.percentageTypical && <span className="text-muted-foreground">{r.percentageTypical}%</span>}
                <span className="text-muted-foreground">{r.role}</span>
              </div>
            ))}
          </div>
        )}

        {/* Erreurs */}
        {data.errors && data.errors.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-destructive">Erreurs ({data.errors.length}) :</p>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {data.errors.map((e: string, i: number) => (
                <div key={i} className="text-xs text-destructive bg-destructive/10 rounded px-2 py-1 flex gap-1">
                  <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                  {e}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    new_link: { label: "Nouveau", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
    will_update: { label: "Mise à jour", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    already_exists_skip: { label: "Ignoré", className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
    molecule_not_found: { label: "Introuvable", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  };
  const s = map[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${s.className}`}>{s.label}</span>;
}
