import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import Papa from "papaparse";

export default function AdminImportExport() {
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [importing, setImporting] = useState(false);
  
  const { data: molecules } = trpc.molecules.list.useQuery();
  const { data: recettes } = trpc.recettes.list.useQuery();
  
  // Export molécules en CSV
  const handleExportMolecules = () => {
    if (!molecules || molecules.length === 0) {
      setImportStatus({ type: "error", message: "Aucune molécule à exporter" });
      return;
    }
    
    const csvData = molecules.map(m => ({
      id: m.id,
      name: m.name,
      family: m.family || "",
      chemicalFormula: m.chemicalFormula || "",
      molecularWeight: m.molecularWeight || "",
      boilingPoint: m.boilingPoint || "",
      olfactiveProfile: m.olfactiveProfile || "",
      emotionalResonance: m.emotionalResonance || "",
      functionalEffect: m.functionalEffect || "",
      sourceOrigin: m.sourceOrigin || "",
      botanicalSources: m.botanicalSources || "",
      extractionMethod: m.extractionMethod || "",
      therapeuticProperties: m.therapeuticProperties || "",
      radarIntensity: m.radarIntensity || "",
      radarFreshness: m.radarFreshness || "",
      radarWarmth: m.radarWarmth || "",
      radarSweetness: m.radarSweetness || "",
      radarSpiciness: m.radarSpiciness || "",
      radarEarthiness: m.radarEarthiness || "",
      notes: m.notes || "",
    }));
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `perfumum_molecules_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    setImportStatus({ 
      type: "success", 
      message: `${molecules.length} molécules exportées avec succès` 
    });
  };
  
  // Export recettes en CSV
  const handleExportRecettes = () => {
    if (!recettes || recettes.length === 0) {
      setImportStatus({ type: "error", message: "Aucune recette à exporter" });
      return;
    }
    
    const csvData = recettes.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      description: r.description || "",
      ingredients: r.ingredients || "",
      formula: r.formula || "",
      protocol: r.protocol || "",
      notes: r.notes || "",
      texture: r.texture || "",
      intensity: r.intensity || "",
      stability: r.stability || "",
      combustionTemperature: r.combustionTemperature || "",
      maturationTime: r.maturationTime || "",
      costEstimate: r.costEstimate || "",
      productionTime: r.productionTime || "",
      status: r.status || "",
      notesTete: r.notesTete || "",
      notesCoeur: r.notesCoeur || "",
      notesFond: r.notesFond || "",
      dureeTeteMin: r.dureeTeteMin || "",
      dureeCoeurMin: r.dureeCoeurMin || "",
      dureeFondMin: r.dureeFondMin || "",
    }));
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `perfumum_recettes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    setImportStatus({ 
      type: "success", 
      message: `${recettes.length} recettes exportées avec succès` 
    });
  };
  
  // Import CSV (placeholder - nécessite backend)
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>, type: "molecules" | "recettes") => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setImporting(true);
    setImportStatus({ type: "info", message: `Analyse du fichier ${file.name}...` });
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data;
        const errors = results.errors;
        
        if (errors.length > 0) {
          setImportStatus({ 
            type: "error", 
            message: `Erreurs de parsing : ${errors.map(e => e.message).join(", ")}` 
          });
          setImporting(false);
          return;
        }
        
        // Validation basique
        if (data.length === 0) {
          setImportStatus({ type: "error", message: "Fichier CSV vide" });
          setImporting(false);
          return;
        }
        
        // Vérifier colonnes requises
        const firstRow = data[0] as any;
        const requiredFields = type === "molecules" 
          ? ["name", "family"] 
          : ["name", "category"];
        
        const missingFields = requiredFields.filter(field => !(field in firstRow));
        if (missingFields.length > 0) {
          setImportStatus({ 
            type: "error", 
            message: `Colonnes manquantes : ${missingFields.join(", ")}` 
          });
          setImporting(false);
          return;
        }
        
        // Succès parsing
        setImportStatus({ 
          type: "success", 
          message: `${data.length} lignes détectées. Import backend non implémenté (nécessite procédure tRPC)` 
        });
        setImporting(false);
        
        // Reset input
        event.target.value = "";
      },
      error: (error) => {
        setImportStatus({ type: "error", message: `Erreur : ${error.message}` });
        setImporting(false);
      }
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Import / Export CSV</h1>
          <p className="text-muted-foreground">
            Gestion en masse des données molécules et recettes
          </p>
        </div>
        
        {/* Status messages */}
        {importStatus && (
          <Alert variant={importStatus.type === "error" ? "destructive" : "default"}>
            {importStatus.type === "success" && <CheckCircle2 className="h-4 w-4" />}
            {importStatus.type === "error" && <AlertCircle className="h-4 w-4" />}
            {importStatus.type === "info" && <FileSpreadsheet className="h-4 w-4" />}
            <AlertDescription>{importStatus.message}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Molécules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Molécules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Exporter toutes les molécules en format CSV avec :</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Données chimiques (formule, poids moléculaire, densité)</li>
                  <li>Profils olfactifs et émotionnels</li>
                  <li>Profils radar (6 axes)</li>
                  <li>Sources botaniques et extraction</li>
                  <li>Propriétés thérapeutiques</li>
                </ul>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div>
                  <div className="font-semibold">{molecules?.length || 0} molécules</div>
                  <div className="text-xs text-muted-foreground">dans la base de données</div>
                </div>
                <Badge variant="secondary">
                  {molecules?.filter(m => m.family?.toLowerCase().includes('terpène')).length || 0} terpènes
                </Badge>
              </div>
              
              <Button 
                onClick={handleExportMolecules}
                disabled={!molecules || molecules.length === 0}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger CSV Molécules
              </Button>
            </CardContent>
          </Card>
          
          {/* Export Recettes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Recettes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Exporter toutes les recettes en format CSV avec :</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Informations générales (nom, catégorie, description)</li>
                  <li>Formule et protocole de fabrication</li>
                  <li>Paramètres techniques (combustion, maturation)</li>
                  <li>Évolution aromatique (notes tête/cœur/fond)</li>
                  <li>Coûts et temps de production</li>
                </ul>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div>
                  <div className="font-semibold">{recettes?.length || 0} recettes</div>
                  <div className="text-xs text-muted-foreground">dans la base de données</div>
                </div>
                <Badge variant="secondary">
                  {recettes?.filter(r => r.category === 'resine_cbd').length || 0} CBD
                </Badge>
              </div>
              
              <Button 
                onClick={handleExportRecettes}
                disabled={!recettes || recettes.length === 0}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger CSV Recettes
              </Button>
            </CardContent>
          </Card>
          
          {/* Import Molécules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Import Molécules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Importer des molécules depuis un fichier CSV :</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Colonnes requises :</strong> name, family</li>
                  <li><strong>Colonnes optionnelles :</strong> formula, molecularWeight, olfactiveProfile, etc.</li>
                  <li>Format : UTF-8, séparateur virgule</li>
                </ul>
              </div>
              
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <p className="text-xs text-yellow-700">
                    Import backend non implémenté. Nécessite procédure tRPC pour validation et insertion en base.
                  </p>
                </div>
              </div>
              
              <label className="block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleImportFile(e, "molecules")}
                  disabled={importing}
                  className="hidden"
                  id="import-molecules"
                />
                <Button 
                  asChild
                  variant="outline"
                  disabled={importing}
                  className="w-full cursor-pointer"
                >
                  <label htmlFor="import-molecules" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    {importing ? "Analyse en cours..." : "Sélectionner CSV Molécules"}
                  </label>
                </Button>
              </label>
            </CardContent>
          </Card>
          
          {/* Import Recettes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Import Recettes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Importer des recettes depuis un fichier CSV :</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Colonnes requises :</strong> name, category</li>
                  <li><strong>Colonnes optionnelles :</strong> description, formula, protocol, notes, etc.</li>
                  <li>Format : UTF-8, séparateur virgule</li>
                </ul>
              </div>
              
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <p className="text-xs text-yellow-700">
                    Import backend non implémenté. Nécessite procédure tRPC pour validation et insertion en base.
                  </p>
                </div>
              </div>
              
              <label className="block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleImportFile(e, "recettes")}
                  disabled={importing}
                  className="hidden"
                  id="import-recettes"
                />
                <Button 
                  asChild
                  variant="outline"
                  disabled={importing}
                  className="w-full cursor-pointer"
                >
                  <label htmlFor="import-recettes" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    {importing ? "Analyse en cours..." : "Sélectionner CSV Recettes"}
                  </label>
                </Button>
              </label>
            </CardContent>
          </Card>
        </div>
        
        {/* Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>Documentation Format CSV</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Exemple CSV Molécules</h3>
              <pre className="p-4 bg-muted/50 rounded text-xs overflow-x-auto">
{`name,family,formula,molecularWeight,olfactiveProfile,radarIntensity,radarFreshness
Myrcène,Terpène,C10H16,136.23,Terreux et herbacé,65,40
Limonène,Terpène,C10H16,136.23,Agrume frais et pétillant,70,95`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Exemple CSV Recettes</h3>
              <pre className="p-4 bg-muted/50 rounded text-xs overflow-x-auto">
{`name,category,description,intensity,notesTete,notesCoeur,notesFond
Résine Alpine,resine_cbd,Résine CBD aux notes de pin,7,Pin frais,Résine de sapin,Boisé profond
Résine Méditerranée,resine_cbd,Résine CBD aux notes d'agrumes,6,Citron,Lavande,Terre chaude`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
