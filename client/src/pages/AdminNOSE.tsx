/**
 * Page Admin NOSE — Dashboard des émissions olfactives et expériences
 * NOSE Phase 1 (od:L12 Smell Emission) + Phase 2 (od:L13 Smell Experience)
 */

import { useState, useCallback } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  FlaskConical, Leaf, Microscope, Plus, BarChart3, Globe, BookOpen,
  TrendingUp, Database, AlertCircle, CheckCircle2, Clock,
  Upload, Download, Eye, CheckCircle, XCircle
} from "lucide-react";

const METHOD_LABELS: Record<string, string> = {
  gc_ms: "GC-MS", gc_fid: "GC-FID", hplc: "HPLC", rnm: "RMN",
  headspace_gcms: "Headspace GC-MS", spme_gcms: "SPME GC-MS", autre: "Autre"
};

const ROLE_LABELS: Record<string, string> = {
  majeur: "Majeur", secondaire: "Secondaire", trace: "Trace",
  variable: "Variable", signature: "Signature"
};

const ROLE_COLORS: Record<string, string> = {
  signature: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
  majeur: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
  secondaire: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
  trace: "bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30",
  variable: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
};

const CONTEXT_LABELS: Record<string, string> = {
  rituel: "Rituel", médical: "Médical", culinaire: "Culinaire",
  cosmétique: "Cosmétique", industriel: "Industriel", artistique: "Artistique",
  quotidien: "Quotidien", funéraire: "Funéraire", autre: "Autre"
};

const VALENCE_COLORS: Record<string, string> = {
  positive: "bg-green-500/20 text-green-700 dark:text-green-300",
  negative: "bg-red-500/20 text-red-700 dark:text-red-300",
  neutral: "bg-gray-500/20 text-gray-600 dark:text-gray-400",
  ambivalent: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
};

function StatCard({ title, value, subtitle, icon: Icon, color = "blue" }: {
  title: string; value: number | string; subtitle?: string;
  icon: React.ComponentType<{ className?: string }>; color?: string;
}) {
  const colors: Record<string, string> = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    green: "text-green-600 dark:text-green-400 bg-green-500/10",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
  };
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl ${colors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AddEmissionDialog({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    plantId: "", moleculeId: "", plantPart: "", extractionMethod: "",
    percentage: "", role: "", analysisMethod: "", analysisSource: "",
    geographicOrigin: "", notes: "", isSignature: false,
  });

  const createMutation = trpc.olfactiveEmissions.create.useMutation({
    onSuccess: () => {
      toast({ title: "Émission ajoutée", description: "L'émission olfactive a été créée avec succès." });
      setOpen(false);
      onSuccess();
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      plantId: form.plantId ? Number(form.plantId) : undefined,
      moleculeId: form.moleculeId ? Number(form.moleculeId) : undefined,
      plantPart: form.plantPart as any || undefined,
      extractionMethod: form.extractionMethod as any || undefined,
      percentage: form.percentage ? Number(form.percentage) : undefined,
      role: form.role as any || undefined,
      analysisMethod: form.analysisMethod as any || undefined,
      analysisSource: form.analysisSource || undefined,
      geographicOrigin: form.geographicOrigin || undefined,
      notes: form.notes || undefined,
      isSignature: form.isSignature,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter une émission
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-blue-500" />
            Nouvelle émission olfactive (od:L12)
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>ID Plante</Label>
              <Input placeholder="ex: 30010" value={form.plantId} onChange={e => setForm(f => ({ ...f, plantId: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>ID Molécule</Label>
              <Input placeholder="ex: 1290020" value={form.moleculeId} onChange={e => setForm(f => ({ ...f, moleculeId: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Partie de plante</Label>
              <Select value={form.plantPart} onValueChange={v => setForm(f => ({ ...f, plantPart: v }))}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {["fleur","feuille","fruit","zeste","graine","ecorce","bois","racine","rhizome","resine","plante_entiere","autre"].map(v =>
                    <SelectItem key={v} value={v}>{v.replace("_", " ")}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Méthode d'extraction</Label>
              <Select value={form.extractionMethod} onValueChange={v => setForm(f => ({ ...f, extractionMethod: v }))}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {["hydrodistillation","entrainement_vapeur","expression_a_froid","extraction_co2","enfleurage","maceration","teinture","solvant_organique","pyrolyse","headspace","spme","autre"].map(v =>
                    <SelectItem key={v} value={v}>{v.replace(/_/g, " ")}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Pourcentage (%)</Label>
              <Input type="number" min="0" max="100" step="0.01" placeholder="ex: 25.5" value={form.percentage} onChange={e => setForm(f => ({ ...f, percentage: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Rôle</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Méthode d'analyse</Label>
              <Select value={form.analysisMethod} onValueChange={v => setForm(f => ({ ...f, analysisMethod: v }))}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {Object.entries(METHOD_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Source de l'analyse</Label>
            <Input placeholder="ex: Baser et al. 2009, J. Essent. Oil Res." value={form.analysisSource} onChange={e => setForm(f => ({ ...f, analysisSource: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>Origine géographique</Label>
            <Input placeholder="ex: Bulgarie, Vallée des Roses" value={form.geographicOrigin} onChange={e => setForm(f => ({ ...f, geographicOrigin: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea placeholder="Contexte, conditions d'analyse, variabilité..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isSignature" checked={form.isSignature} onChange={e => setForm(f => ({ ...f, isSignature: e.target.checked }))} className="w-4 h-4" />
            <Label htmlFor="isSignature">Molécule signature (composé caractéristique)</Label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Ajout..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddExperienceDialog({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    plantId: "", moleculeId: "", experiencerType: "individual", experiencerName: "",
    periodLabel: "", yearApprox: "", placeName: "", placeCountry: "",
    perceptionLabel: "", perceptionValence: "", contextType: "",
    sourceText: "", sourceReference: "", sourceType: "",
    notes: "", confidenceLevel: "moyenne",
  });

  const createMutation = trpc.olfactiveExperiences.create.useMutation({
    onSuccess: () => {
      toast({ title: "Expérience ajoutée", description: "L'expérience olfactive a été créée avec succès." });
      setOpen(false);
      onSuccess();
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      plantId: form.plantId ? Number(form.plantId) : undefined,
      moleculeId: form.moleculeId ? Number(form.moleculeId) : undefined,
      experiencerType: form.experiencerType as any,
      experiencerName: form.experiencerName || undefined,
      periodLabel: form.periodLabel || undefined,
      yearApprox: form.yearApprox ? Number(form.yearApprox) : undefined,
      placeName: form.placeName || undefined,
      placeCountry: form.placeCountry || undefined,
      perceptionLabel: form.perceptionLabel || undefined,
      perceptionValence: form.perceptionValence as any || undefined,
      contextType: form.contextType as any || undefined,
      sourceText: form.sourceText || undefined,
      sourceReference: form.sourceReference || undefined,
      sourceType: form.sourceType as any || undefined,
      notes: form.notes || undefined,
      confidenceLevel: form.confidenceLevel as any,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter une expérience
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            Nouvelle expérience olfactive (od:L13)
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>ID Plante</Label>
              <Input placeholder="ex: 30010" value={form.plantId} onChange={e => setForm(f => ({ ...f, plantId: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>ID Molécule</Label>
              <Input placeholder="ex: 1290020" value={form.moleculeId} onChange={e => setForm(f => ({ ...f, moleculeId: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Type d'expérienceur</Label>
              <Select value={form.experiencerType} onValueChange={v => setForm(f => ({ ...f, experiencerType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individuel</SelectItem>
                  <SelectItem value="collective">Collectif</SelectItem>
                  <SelectItem value="historical">Historique</SelectItem>
                  <SelectItem value="fictional">Fictif</SelectItem>
                  <SelectItem value="scientific">Scientifique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Nom du témoin / source</Label>
              <Input placeholder="ex: Théophraste, Ibn Sina..." value={form.experiencerName} onChange={e => setForm(f => ({ ...f, experiencerName: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Période</Label>
              <Input placeholder="ex: Antiquité romaine" value={form.periodLabel} onChange={e => setForm(f => ({ ...f, periodLabel: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Année approximative</Label>
              <Input type="number" placeholder="ex: -50 (av. J.-C.)" value={form.yearApprox} onChange={e => setForm(f => ({ ...f, yearApprox: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Lieu</Label>
              <Input placeholder="ex: Rome, Forum" value={form.placeName} onChange={e => setForm(f => ({ ...f, placeName: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Pays</Label>
              <Input placeholder="ex: Italie" value={form.placeCountry} onChange={e => setForm(f => ({ ...f, placeCountry: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Perception olfactive</Label>
              <Input placeholder="ex: boisé fumé, floral sucré" value={form.perceptionLabel} onChange={e => setForm(f => ({ ...f, perceptionLabel: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Valence</Label>
              <Select value={form.perceptionValence} onValueChange={v => setForm(f => ({ ...f, perceptionValence: v }))}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Négative</SelectItem>
                  <SelectItem value="neutral">Neutre</SelectItem>
                  <SelectItem value="ambivalent">Ambivalente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Contexte</Label>
            <Select value={form.contextType} onValueChange={v => setForm(f => ({ ...f, contextType: v }))}>
              <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
              <SelectContent>
                {Object.entries(CONTEXT_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Texte source (citation)</Label>
            <Textarea placeholder="Extrait du texte source..." value={form.sourceText} onChange={e => setForm(f => ({ ...f, sourceText: e.target.value }))} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Référence bibliographique</Label>
              <Input placeholder="ex: Théophraste, De Odoribus, §12" value={form.sourceReference} onChange={e => setForm(f => ({ ...f, sourceReference: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Type de source</Label>
              <Select value={form.sourceType} onValueChange={v => setForm(f => ({ ...f, sourceType: v }))}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {["litteraire","scientifique","ethnographique","oral","iconographique","archéologique","personnel"].map(v =>
                    <SelectItem key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Niveau de confiance</Label>
            <Select value={form.confidenceLevel} onValueChange={v => setForm(f => ({ ...f, confidenceLevel: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="haute">Haute</SelectItem>
                <SelectItem value="moyenne">Moyenne</SelectItem>
                <SelectItem value="basse">Basse</SelectItem>
                <SelectItem value="hypothétique">Hypothétique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea placeholder="Contexte supplémentaire..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Ajout..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const NOSE_CSV_TEMPLATE = `plant_id,molecule_id,plant_part,extraction_method,percentage,role,analysis_method,analysis_source,geographic_origin,notes,is_signature
30010,1290020,fleur,hydrodistillation,25.5,majeur,gc_ms,Baser et al. 2009,Bulgarie,Composé principal,false
30010,1290021,fleur,hydrodistillation,12.3,secondaire,gc_ms,Baser et al. 2009,Bulgarie,,false
`;

function NoseImportTab({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [csvText, setCsvText] = useState("");
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [overwrite, setOverwrite] = useState(false);

  const importMutation = trpc.olfactiveEmissions.importFromCsv.useMutation({
    onSuccess: (data) => {
      toast({ title: `Import terminé : ${data.created} créées, ${data.skipped} ignorées` });
      setImportResult(data);
      setPreviewRows([]);
      setIsImporting(false);
      onSuccess();
    },
    onError: (e) => {
      toast({ title: "Erreur d'import", description: e.message, variant: "destructive" });
      setIsImporting(false);
    },
  });

  const parseCsv = useCallback((text: string) => {
    const lines = text.trim().split("\n").filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map((line, idx) => {
      const vals = line.split(",").map(v => v.trim());
      const obj: any = { _row: idx + 2 };
      headers.forEach((h, i) => { obj[h] = vals[i] ?? ""; });
      return obj;
    }).filter(r => r.plant_id || r.molecule_id);
  }, []);

  const handlePreview = () => {
    const rows = parseCsv(csvText);
    if (rows.length === 0) {
      toast({ title: "CSV vide ou invalide", variant: "destructive" });
      return;
    }
    setPreviewRows(rows);
    setImportResult(null);
  };

  const handleImport = () => {
    if (previewRows.length === 0) return;
    setIsImporting(true);
    importMutation.mutate({ rows: previewRows, overwrite });
  };

  const downloadTemplate = () => {
    const blob = new Blob([NOSE_CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "nose_emissions_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-500" />
            Import CSV — Émissions NOSE (od:L12)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2">
              <Download className="w-4 h-4" /> Télécharger le template CSV
            </Button>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="overwrite" checked={overwrite} onChange={e => setOverwrite(e.target.checked)} className="w-4 h-4" />
              <label htmlFor="overwrite" className="text-sm text-muted-foreground">Remplacer les doublons existants</label>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Contenu CSV</Label>
            <Textarea
              placeholder={`plant_id,molecule_id,plant_part,extraction_method,percentage,role...\n30010,1290020,fleur,hydrodistillation,25.5,majeur,...`}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              rows={8}
              className="font-mono text-xs"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreview} disabled={!csvText.trim()} className="gap-2">
              <Eye className="w-4 h-4" /> Prévisualiser (dry-run)
            </Button>
            {previewRows.length > 0 && (
              <Button onClick={handleImport} disabled={isImporting} className="gap-2">
                <CheckCircle className="w-4 h-4" /> Confirmer l'import ({previewRows.length} lignes)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dry-run preview */}
      {previewRows.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-500" />
              Prévisualisation — {previewRows.length} lignes à importer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 text-muted-foreground">#</th>
                    <th className="text-left p-2 text-muted-foreground">Plante ID</th>
                    <th className="text-left p-2 text-muted-foreground">Molécule ID</th>
                    <th className="text-left p-2 text-muted-foreground">Partie</th>
                    <th className="text-left p-2 text-muted-foreground">Extraction</th>
                    <th className="text-left p-2 text-muted-foreground">%</th>
                    <th className="text-left p-2 text-muted-foreground">Rôle</th>
                    <th className="text-left p-2 text-muted-foreground">Méthode</th>
                    <th className="text-left p-2 text-muted-foreground">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-muted/30">
                      <td className="p-2 text-muted-foreground">{row._row}</td>
                      <td className="p-2 font-mono">{row.plant_id || "—"}</td>
                      <td className="p-2 font-mono">{row.molecule_id || "—"}</td>
                      <td className="p-2">{row.plant_part || "—"}</td>
                      <td className="p-2">{row.extraction_method || "—"}</td>
                      <td className="p-2">{row.percentage ? `${row.percentage}%` : "—"}</td>
                      <td className="p-2">
                        <Badge variant="outline" className={`text-xs ${ROLE_COLORS[row.role] ?? ""}`}>
                          {(ROLE_LABELS[row.role] ?? row.role) || "—"}
                        </Badge>
                      </td>
                      <td className="p-2">{(METHOD_LABELS[row.analysis_method] ?? row.analysis_method) || "—"}</td>
                      <td className="p-2 max-w-32 truncate">{row.analysis_source || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultat import */}
      {importResult && (
        <Card className="border-green-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Import terminé</p>
                <p className="text-sm text-muted-foreground">
                  {importResult.created} émissions créées · {importResult.skipped} ignorées (doublons)
                  {importResult.errors > 0 && ` · ${importResult.errors} erreurs`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AdminNOSE() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [expSearch, setExpSearch] = useState("");

  const emissionsStats = trpc.olfactiveEmissions.getStats.useQuery();
  const experiencesStats = trpc.olfactiveExperiences.getStats.useQuery();
  const recentExperiences = trpc.olfactiveExperiences.list.useQuery({ limit: 10, offset: 0 });

  const utils = trpc.useUtils();
  const refreshAll = () => {
    utils.olfactiveEmissions.getStats.invalidate();
    utils.olfactiveExperiences.getStats.invalidate();
    utils.olfactiveExperiences.list.invalidate();
  };

  const eStats = emissionsStats.data;
  const xStats = experiencesStats.data;

  return (
    <div className="container py-8 max-w-6xl">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Microscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold">NOSE — Ontologie Olfactive</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Dashboard de gestion des données NOSE (Odeuropa). 
              <span className="font-medium text-foreground"> Phase 1</span> : Émissions GC-MS (od:L12) · 
              <span className="font-medium text-foreground"> Phase 2</span> : Expériences subjectives (od:L13)
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {user?.role === "admin" && (
              <>
                <AddEmissionDialog onSuccess={refreshAll} />
                <AddExperienceDialog onSuccess={refreshAll} />
              </>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/gcms-import">
                <Database className="w-4 h-4 mr-2" /> Import GC-MS
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="emissions" className="gap-2">
            <FlaskConical className="w-4 h-4" /> Émissions GC-MS
          </TabsTrigger>
          <TabsTrigger value="experiences" className="gap-2">
            <BookOpen className="w-4 h-4" /> Expériences
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-2">
            <Upload className="w-4 h-4" /> Import CSV
          </TabsTrigger>
        </TabsList>

        {/* === VUE D'ENSEMBLE === */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Émissions GC-MS"
              value={eStats?.total ?? "—"}
              subtitle="od:L12 Smell Emission"
              icon={FlaskConical}
              color="blue"
            />
            <StatCard
              title="Avec pourcentage"
              value={eStats ? `${Math.round((eStats.withPercentage / eStats.total) * 100)}%` : "—"}
              subtitle={`${eStats?.withPercentage ?? 0} / ${eStats?.total ?? 0}`}
              icon={TrendingUp}
              color="green"
            />
            <StatCard
              title="Liées à une molécule"
              value={eStats ? `${Math.round((eStats.withMolecule / eStats.total) * 100)}%` : "—"}
              subtitle={`${eStats?.withMolecule ?? 0} identifiées`}
              icon={Leaf}
              color="amber"
            />
            <StatCard
              title="Expériences (od:L13)"
              value={xStats?.total ?? 0}
              subtitle="Témoignages & perceptions"
              icon={BookOpen}
              color="purple"
            />
          </div>

          {/* Répartition méthodes + rôles */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Microscope className="w-4 h-4 text-blue-500" />
                  Méthodes d'analyse
                </CardTitle>
              </CardHeader>
              <CardContent>
                {emissionsStats.isLoading ? (
                  <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-6 bg-muted rounded animate-pulse" />)}</div>
                ) : (
                  <div className="space-y-2">
                    {(eStats?.byMethod ?? []).map((m: any) => (
                      <div key={m.analysis_method} className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-36 truncate">
                          {METHOD_LABELS[m.analysis_method] ?? m.analysis_method ?? "Non renseigné"}
                        </span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.round((m.n / (eStats?.total ?? 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{m.n}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                  Rôles moléculaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                {emissionsStats.isLoading ? (
                  <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-6 bg-muted rounded animate-pulse" />)}</div>
                ) : (
                  <div className="space-y-2">
                    {(eStats?.byRole ?? []).map((r: any) => (
                      <div key={r.role} className="flex items-center gap-3">
                        <Badge variant="outline" className={`text-xs w-24 justify-center ${ROLE_COLORS[r.role] ?? ""}`}>
                          {ROLE_LABELS[r.role] ?? r.role ?? "—"}
                        </Badge>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${Math.round((r.n / (eStats?.total ?? 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{r.n}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top molécules */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Top 10 molécules les plus émises
              </CardTitle>
            </CardHeader>
            <CardContent>
              {emissionsStats.isLoading ? (
                <div className="grid grid-cols-2 gap-2">{[...Array(10)].map((_, i) => <div key={i} className="h-8 bg-muted rounded animate-pulse" />)}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(eStats?.topMolecules ?? []).map((m: any, i: number) => safeToFixed(
                    <Link key={m.id} href={`/molecules/${m.id}`}>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <span className="text-xs font-mono text-muted-foreground w-5">#{i + 1}</span>
                        <span className="text-sm font-medium flex-1 truncate">{m.name}</span>
                        <span className="text-xs text-muted-foreground">{m.occurrences}×</span>
                        {m.avg_pct && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 w-14 text-right">
                            ⌀ {Number(m.avg_pct, 1)}%
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sources */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500" />
                Sources des données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(eStats?.bySource ?? []).map((s: any) => (
                  <div key={s.source_table} className="p-3 rounded-xl border bg-card text-center">
                    <p className="text-2xl font-bold">{s.n}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.source_table}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === ÉMISSIONS GC-MS === */}
        <TabsContent value="emissions" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {eStats?.total ?? 0} émissions · {eStats?.withPercentage ?? 0} avec % · {eStats?.withMolecule ?? 0} identifiées
            </p>
            {user?.role === "admin" && <AddEmissionDialog onSuccess={refreshAll} />}
          </div>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center py-8 text-muted-foreground">
                <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Consultez les émissions dans les fiches plantes et molécules</p>
                <p className="text-sm mt-1">Chaque fiche dispose d'un onglet "Émissions GC-MS" dédié</p>
                <div className="flex gap-3 justify-center mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/plantes">Voir les plantes</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/molecules">Voir les molécules</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === IMPORT CSV NOSE === */}
        <TabsContent value="import" className="space-y-4">
          <NoseImportTab onSuccess={refreshAll} />
        </TabsContent>

        {/* === EXPÉRIENCES === */}
        <TabsContent value="experiences" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Rechercher une expérience..."
                value={expSearch}
                onChange={e => setExpSearch(e.target.value)}
                className="w-64"
              />
              <p className="text-sm text-muted-foreground">{xStats?.total ?? 0} expériences</p>
            </div>
            {user?.role === "admin" && <AddExperienceDialog onSuccess={refreshAll} />}
          </div>

          {xStats && xStats.total === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Aucune expérience olfactive enregistrée</p>
                  <p className="text-sm mt-1">
                    La table <code className="text-xs bg-muted px-1 rounded">olfactive_experiences</code> est prête.
                    Commencez par ajouter des témoignages historiques ou des perceptions sensorielles.
                  </p>
                  {user?.role === "admin" && (
                    <div className="mt-4">
                      <AddExperienceDialog onSuccess={refreshAll} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentExperiences.data?.experiences.map((exp: any) => (
                <Card key={exp.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {exp.perception_label && (
                            <span className="font-medium">{exp.perception_label}</span>
                          )}
                          {exp.perception_valence && (
                            <Badge variant="outline" className={`text-xs ${VALENCE_COLORS[exp.perception_valence] ?? ""}`}>
                              {exp.perception_valence}
                            </Badge>
                          )}
                          {exp.context_type && (
                            <Badge variant="outline" className="text-xs">
                              {CONTEXT_LABELS[exp.context_type] ?? exp.context_type}
                            </Badge>
                          )}
                        </div>
                        {exp.source_text && (
                          <blockquote className="text-sm italic text-muted-foreground border-l-2 border-muted pl-3 mb-2 line-clamp-2">
                            {exp.source_text}
                          </blockquote>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          {exp.plant_name && (
                            <Link href={`/plantes/${exp.plant_id}`} className="hover:text-foreground flex items-center gap-1">
                              <Leaf className="w-3 h-3" /> {exp.plant_name}
                            </Link>
                          )}
                          {exp.period_label && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {exp.period_label}
                              {exp.year_approx && ` (${exp.year_approx > 0 ? exp.year_approx : `${Math.abs(exp.year_approx)} av. J.-C.`})`}
                            </span>
                          )}
                          {exp.place_name && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" /> {exp.place_name}{exp.place_country ? `, ${exp.place_country}` : ""}
                            </span>
                          )}
                          {exp.experiencer_name && (
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> {exp.experiencer_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {exp.confidence_level && (
                          <Badge variant="outline" className="text-xs">
                            {exp.confidence_level === "haute" ? (
                              <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                            ) : exp.confidence_level === "hypothétique" ? (
                              <AlertCircle className="w-3 h-3 mr-1 text-yellow-500" />
                            ) : null}
                            {exp.confidence_level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
