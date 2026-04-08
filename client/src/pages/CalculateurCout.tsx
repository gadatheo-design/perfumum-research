import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VoirAussi } from "@/components/VoirAussi";
import { trpc } from "@/lib/trpc";
import { 
  Calculator, Plus, Trash2, DollarSign, FlaskConical, 
  Info, AlertTriangle, TrendingUp, Package, Search,
  Save, History, FileDown, Copy, RotateCcw, Sparkles,
  ChevronDown, ChevronUp, Beaker, Scale, Percent,
  BarChart3, PieChart, Layers, ArrowRight, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Link } from "wouter";
import { moleculesPrix, moleculesListe } from "@/lib/moleculePrices";

interface Ingredient {
  id: string;
  molecule: string;
  proportion: number; // en %
  customPrice?: number; // Prix personnalisé optionnel
}

interface SavedFormulation {
  id: string;
  name: string;
  date: Date;
  ingredients: Ingredient[];
  quantiteTotale: number;
  concentration: number;
  coutTotal: number;
}

// Concentrations prédéfinies
const concentrations = [
  { value: 5, label: "Eau de Cologne", description: "5% - Fraîcheur légère" },
  { value: 8, label: "Eau Fraîche", description: "8% - Légèrement parfumé" },
  { value: 12, label: "Eau de Toilette", description: "12% - Usage quotidien" },
  { value: 15, label: "Eau de Parfum", description: "15% - Intensité modérée" },
  { value: 20, label: "Parfum", description: "20% - Haute concentration" },
  { value: 25, label: "Extrait", description: "25% - Très concentré" },
  { value: 30, label: "Extrait Intense", description: "30% - Maximum" },
];

export default function CalculateurCout() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", molecule: "Hedione", proportion: 10 },
    { id: "2", molecule: "Ambroxan", proportion: 5 },
    { id: "3", molecule: "Iso E Super", proportion: 8 },
  ]);
  const [quantiteTotale, setQuantiteTotale] = useState(100); // en grammes
  const [concentration, setConcentration] = useState(15); // % de concentré dans le produit final
  const [usePrixMin, setUsePrixMin] = useState(false);
  const [formulationName, setFormulationName] = useState("");
  const [savedFormulations, setSavedFormulations] = useState<SavedFormulation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [marginPercent, setMarginPercent] = useState(300); // Marge commerciale en %
  const [packagingCost, setPackagingCost] = useState(5); // Coût packaging en $
  const [laborCost, setLaborCost] = useState(2); // Coût main d'œuvre en $

  // Récupérer les molécules de la base de données
  const { data: dbMolecules } = trpc.molecules.list.useQuery();

  // Filtrer les molécules pour la recherche
  const filteredMolecules = useMemo(() => {
    if (!searchQuery) return moleculesListe;
    return moleculesListe.filter(mol => 
      mol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Ajouter un ingrédient
  const ajouterIngredient = useCallback(() => {
    const newId = Date.now().toString();
    setIngredients(prev => [...prev, { id: newId, molecule: "", proportion: 0 }]);
  }, []);

  // Supprimer un ingrédient
  const supprimerIngredient = useCallback((id: string) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
  }, []);

  // Mettre à jour un ingrédient
  const updateIngredient = useCallback((id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(prev => prev.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ));
  }, []);

  // Réinitialiser la formulation
  const resetFormulation = useCallback(() => {
    setIngredients([{ id: Date.now().toString(), molecule: "", proportion: 0 }]);
    setFormulationName("");
    toast.success("Formulation réinitialisée");
  }, []);

  // Dupliquer un ingrédient
  const duplicateIngredient = useCallback((id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    if (ingredient) {
      const newId = Date.now().toString();
      setIngredients(prev => [...prev, { ...ingredient, id: newId }]);
    }
  }, [ingredients]);

  // Calculs
  const calculs = useMemo(() => {
    let coutTotal = 0;
    let proportionTotale = 0;
    const details: { molecule: string; proportion: number; prixKg: number; cout: number; categorie: string }[] = [];
    const categoriesBreakdown: Record<string, number> = {};

    for (const ing of ingredients) {
      if (ing.molecule && ing.proportion > 0 && moleculesPrix[ing.molecule]) {
        const prixData = moleculesPrix[ing.molecule];
        const prixKg = ing.customPrice || (usePrixMin ? prixData.prixMin : (prixData.prixMin + prixData.prixMax) / 2);
        const quantiteGrammes = (ing.proportion / 100) * quantiteTotale * (concentration / 100);
        const cout = (quantiteGrammes / 1000) * prixKg;
        
        coutTotal += cout;
        proportionTotale += ing.proportion;
        
        // Breakdown par catégorie
        const cat = prixData.categorie;
        categoriesBreakdown[cat] = (categoriesBreakdown[cat] || 0) + cout;
        
        details.push({
          molecule: ing.molecule,
          proportion: ing.proportion,
          prixKg,
          cout,
          categorie: cat
        });
      }
    }

    // Coût du produit final (avec alcool/solvant)
    const quantiteConcentre = quantiteTotale * (concentration / 100);
    const quantiteSolvant = quantiteTotale - quantiteConcentre;
    const coutSolvant = (quantiteSolvant / 1000) * 5; // ~5$/kg pour l'alcool parfumerie
    const coutProduitFinal = coutTotal + coutSolvant;

    // Prix au ml (densité ~0.9 pour les parfums)
    const volumeMl = quantiteTotale / 0.9;
    const prixParMl = coutProduitFinal / volumeMl;
    const prixPour100ml = prixParMl * 100;

    // Calculs avancés
    const coutTotalAvecCharges = coutProduitFinal + packagingCost + laborCost;
    const prixVenteConseille = coutTotalAvecCharges * (1 + marginPercent / 100);
    const margeNette = prixVenteConseille - coutTotalAvecCharges;

    return {
      coutTotal,
      proportionTotale,
      details,
      coutSolvant,
      coutProduitFinal,
      prixParMl,
      prixPour100ml,
      volumeMl,
      categoriesBreakdown,
      coutTotalAvecCharges,
      prixVenteConseille,
      margeNette
    };
  }, [ingredients, quantiteTotale, concentration, usePrixMin, marginPercent, packagingCost, laborCost]);

  // Sauvegarder la formulation
  const saveFormulation = useCallback(() => {
    if (!formulationName.trim()) {
      toast.error("Veuillez donner un nom à votre formulation");
      return;
    }
    
    const newFormulation: SavedFormulation = {
      id: Date.now().toString(),
      name: formulationName,
      date: new Date(),
      ingredients: [...ingredients],
      quantiteTotale,
      concentration,
      coutTotal: calculs.coutProduitFinal
    };
    
    setSavedFormulations(prev => [newFormulation, ...prev]);
    toast.success(`Formulation "${formulationName}" sauvegardée`);
    setFormulationName("");
  }, [formulationName, ingredients, quantiteTotale, concentration, calculs.coutProduitFinal]);

  // Charger une formulation
  const loadFormulation = useCallback((formulation: SavedFormulation) => {
    setIngredients(formulation.ingredients);
    setQuantiteTotale(formulation.quantiteTotale);
    setConcentration(formulation.concentration);
    setShowHistory(false);
    toast.success(`Formulation "${formulation.name}" chargée`);
  }, []);

  // Exporter en CSV
  const exportCSV = useCallback(() => {
    const headers = ["Molécule", "Proportion (%)", "Prix/kg ($)", "Coût ($)", "Catégorie"];
    const rows = calculs.details.map(d => [
      d.molecule,
      typeof d.proportion === 'number' ? (d).toFixed(1) : '0.0',
      typeof d.prixKg === 'number' ? (d).toFixed(2) : '0.00',
      typeof d.cout === 'number' ? (d).toFixed(2) : '0.00',
      d.categorie
    ]);
    
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formulation-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV téléchargé");
  }, [calculs.details]);

  // Copier le résumé
  const copyToClipboard = useCallback(() => {
    const summary = `
Formulation PERFUMUM
====================
${calculs.details.map(d => `${d.molecule}: ${d.proportion}% ($${typeof d.cout === 'number' ? (d).toFixed(2) : '0.00'})`).join("\n")}

Total: $${typeof calculs.coutProduitFinal === 'number' ? (calculs).toFixed(2) : '0.00'} pour ${typeof calculs.volumeMl === 'number' ? (calculs).toFixed(0) : '0'}ml
Prix/100ml: $${typeof calculs.prixPour100ml === 'number' ? (calculs).toFixed(2) : '0.00'}
Concentration: ${concentration}%
    `.trim();
    
    navigator.clipboard.writeText(summary);
    toast.success("Résumé copié dans le presse-papier");
  }, [calculs, concentration]);

  const getCategorieColor = (categorie: string) => {
    if (categorie.includes("luxe")) return "text-purple-500 bg-purple-500/10";
    if (categorie.includes("premium")) return "text-amber-500 bg-amber-500/10";
    if (categorie.includes("standard")) return "text-blue-500 bg-blue-500/10";
    return "text-green-500 bg-green-500/10";
  };

  const getCategorieLabel = (categorie: string) => {
    if (categorie.includes("luxe")) return "Luxe";
    if (categorie.includes("premium")) return "Premium";
    if (categorie.includes("standard")) return "Standard";
    if (categorie.includes("budget")) return "Budget";
    return "Base";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <Calculator className="w-4 h-4 mr-2" />
                Outil de Formulation
              </Badge>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                Calculateur de Coût
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                Estimez le coût de production de vos formulations parfumées. 
                Ajoutez des molécules, ajustez les proportions et visualisez les coûts en temps réel.
              </p>
              
              {/* Stats rapides */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{Object.keys(moleculesPrix).length}</div>
                  <div className="text-xs text-muted-foreground">Molécules</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">7</div>
                  <div className="text-xs text-muted-foreground">Concentrations</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{savedFormulations.length}</div>
                  <div className="text-xs text-muted-foreground">Sauvegardées</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{ingredients.length}</div>
                  <div className="text-xs text-muted-foreground">Ingrédients</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Formulaire */}
            <div className="lg:col-span-2 space-y-6">
              {/* Paramètres généraux */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      Paramètres de Production
                    </CardTitle>
                    <CardDescription>
                      Définissez la quantité et la concentration de votre formulation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantite">Quantité totale (g)</Label>
                        <Input
                          id="quantite"
                          type="number"
                          value={quantiteTotale}
                          onChange={(e) => setQuantiteTotale(Number(e.target.value))}
                          min={1}
                          className="bg-background"
                        />
                        <p className="text-xs text-muted-foreground">
                          ≈ {typeof quantiteTotale === 'number' ? (quantiteTotale / 0.9).toFixed(0) : '0'} ml de produit final
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="concentration">Concentration</Label>
                        <Select 
                          value={concentration.toString()} 
                          onValueChange={(v) => setConcentration(Number(v))}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {concentrations.map((c) => (
                              <SelectItem key={c.value} value={c.value.toString()}>
                                <span className="flex flex-col">
                                  <span>{c.label}</span>
                                  <span className="text-xs text-muted-foreground">{c.description}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="prixMin"
                          checked={usePrixMin}
                          onCheckedChange={setUsePrixMin}
                        />
                        <Label htmlFor="prixMin" className="text-sm cursor-pointer">
                          Prix minimum (estimation optimiste)
                        </Label>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="ml-auto"
                      >
                        {showAdvanced ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                        Options avancées
                      </Button>
                    </div>

                    {/* Options avancées */}
                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 pt-4 border-t border-border/50"
                        >
                          <div className="grid sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm">Marge commerciale (%)</Label>
                              <div className="flex items-center gap-2">
                                <Slider
                                  value={[marginPercent]}
                                  onValueChange={([v]) => setMarginPercent(v)}
                                  min={100}
                                  max={1000}
                                  step={50}
                                  className="flex-1"
                                />
                                <span className="text-sm font-medium w-12">{marginPercent}%</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="packaging">Packaging ($)</Label>
                              <Input
                                id="packaging"
                                type="number"
                                value={packagingCost}
                                onChange={(e) => setPackagingCost(Number(e.target.value))}
                                min={0}
                                step={0.5}
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="labor">Main d'œuvre ($)</Label>
                              <Input
                                id="labor"
                                type="number"
                                value={laborCost}
                                onChange={(e) => setLaborCost(Number(e.target.value))}
                                min={0}
                                step={0.5}
                                className="bg-background"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Liste des ingrédients */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FlaskConical className="w-5 h-5 text-primary" />
                          Composition
                        </CardTitle>
                        <CardDescription>
                          Ajoutez les molécules et leurs proportions dans le concentré
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={resetFormulation}>
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Réinitialiser</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Barre de recherche */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher une molécule..."
                        className="pl-9 bg-background"
                      />
                    </div>

                    {/* Liste des ingrédients */}
                    <div className="space-y-2">
                      <AnimatePresence mode="popLayout">
                        {ingredients.map((ing, index) => (
                          <motion.div
                            key={ing.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50"
                          >
                            <span className="text-sm text-muted-foreground w-6 font-mono">{String(index + 1).padStart(2, '0')}</span>
                            <Select 
                              value={ing.molecule} 
                              onValueChange={(v) => updateIngredient(ing.id, "molecule", v)}
                            >
                              <SelectTrigger className="flex-1 bg-background">
                                <SelectValue placeholder="Sélectionner une molécule" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                {filteredMolecules.map((mol) => (
                                  <SelectItem key={mol} value={mol}>
                                    <div className="flex items-center gap-2">
                                      <span>{mol}</span>
                                      <Badge variant="outline" className={`text-xs ${getCategorieColor(moleculesPrix[mol].categorie)}`}>
                                        ${moleculesPrix[mol].prixMin.toLocaleString()}-{moleculesPrix[mol].prixMax.toLocaleString()}/kg
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={ing.proportion}
                                onChange={(e) => updateIngredient(ing.id, "proportion", Number(e.target.value))}
                                className="w-20 bg-background"
                                min={0}
                                max={100}
                                step={0.1}
                              />
                              <span className="text-sm text-muted-foreground">%</span>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => duplicateIngredient(ing.id)}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Dupliquer</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => supprimerIngredient(ing.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={ajouterIngredient}
                      className="w-full mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un ingrédient
                    </Button>

                    {/* Alertes */}
                    {calculs.proportionTotale > 100 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                      >
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        La somme des proportions dépasse 100% ({typeof calculs.proportionTotale === 'number' ? (calculs).toFixed(1) : '0.0'}%)
                      </motion.div>
                    )}

                    {calculs.proportionTotale < 100 && calculs.proportionTotale > 0 && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm">
                        <Info className="w-4 h-4 flex-shrink-0" />
                        Proportions actuelles: {typeof calculs.proportionTotale === 'number' ? (calculs).toFixed(1) : '0.0'}% — Il reste {typeof calculs.proportionTotale === 'number' ? (100 - calculs.proportionTotale).toFixed(1) : '100.0'}% à attribuer
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex-1 min-w-[200px]">
                        <Input
                          value={formulationName}
                          onChange={(e) => setFormulationName(e.target.value)}
                          placeholder="Nom de la formulation..."
                          className="bg-background"
                        />
                      </div>
                      <Button onClick={saveFormulation} disabled={!formulationName.trim()}>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Dialog open={showHistory} onOpenChange={setShowHistory}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <History className="w-4 h-4 mr-2" />
                            Historique ({savedFormulations.length})
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Formulations sauvegardées</DialogTitle>
                            <DialogDescription>
                              Cliquez sur une formulation pour la charger
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {savedFormulations.length === 0 ? (
                              <p className="text-center text-muted-foreground py-8">
                                Aucune formulation sauvegardée
                              </p>
                            ) : (
                              savedFormulations.map((f) => (
                                <div
                                  key={f.id}
                                  onClick={() => loadFormulation(f)}
                                  className="p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-colors"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{f.name}</span>
                                    <Badge variant="outline">${typeof f.coutTotal === 'number' ? (f).toFixed(2) : '0.00'}</Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {f.ingredients.length} ingrédients • {f.concentration}% • {f.quantiteTotale}g
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {f.date.toLocaleDateString()}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" onClick={exportCSV}>
                        <FileDown className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button variant="ghost" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Résultats */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="sticky top-4 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      Estimation des Coûts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Coût du concentré */}
                    <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Coût du concentré</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Coût des matières premières seules</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        ${typeof calculs.coutTotal === 'number' ? (calculs).toFixed(2) : '0.00'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        pour {typeof quantiteTotale === 'number' ? (quantiteTotale * (concentration / 100)).toFixed(1) : '0.0'}g de concentré
                      </div>
                    </div>

                    {/* Coût produit final */}
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">Coût produit final</span>
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        ${typeof calculs.coutProduitFinal === 'number' ? (calculs).toFixed(2) : '0.00'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        pour {typeof calculs.volumeMl === 'number' ? (calculs).toFixed(0) : '0'}ml ({concentration}% concentration)
                      </div>
                    </div>

                    {/* Prix au ml */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg border border-border/50 text-center">
                        <div className="text-lg font-bold text-foreground">${typeof calculs.prixParMl === 'number' ? (calculs).toFixed(2) : '0.00'}</div>
                        <div className="text-xs text-muted-foreground">par ml</div>
                      </div>
                      <div className="p-3 rounded-lg border border-border/50 text-center">
                        <div className="text-lg font-bold text-foreground">${typeof calculs.prixPour100ml === 'number' ? (calculs).toFixed(2) : '0.00'}</div>
                        <div className="text-xs text-muted-foreground">pour 100ml</div>
                      </div>
                    </div>

                    {/* Prix de vente conseillé */}
                    {showAdvanced && (
                      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="text-sm text-muted-foreground mb-1">Prix de vente conseillé</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ${typeof calculs.prixVenteConseille === 'number' ? (calculs).toFixed(2) : '0.00'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Marge nette: ${typeof calculs.margeNette === 'number' ? (calculs).toFixed(2) : '0.00'} ({marginPercent}%)
                        </div>
                      </div>
                    )}

                    {/* Détail par ingrédient */}
                    {calculs.details.length > 0 && (
                      <div className="pt-4 border-t border-border/50">
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-foreground">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          Détail par ingrédient
                        </h4>
                        <div className="space-y-2 text-sm">
                          {calculs.details
                            .sort((a, b) => b.cout - a.cout)
                            .map((d, i) => (
                              <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <Badge variant="outline" className={`text-xs shrink-0 ${getCategorieColor(d.categorie)}`}>
                                    {getCategorieLabel(d.categorie)}
                                  </Badge>
                                  <span className="text-muted-foreground truncate">
                                    {d.molecule} ({d.proportion}%)
                                  </span>
                                </div>
                                <span className="font-medium ml-2 text-foreground">
                                  ${typeof d.cout === 'number' ? (d).toFixed(2) : '0.00'}
                                </span>
                              </div>
                            ))}
                          <div className="flex justify-between items-center pt-2 border-t border-border/50">
                            <span className="text-muted-foreground">Solvant (alcool)</span>
                            <span className="font-medium text-foreground">${typeof calculs.coutSolvant === 'number' ? (calculs).toFixed(2) : '0.00'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Répartition par catégorie */}
                    {Object.keys(calculs.categoriesBreakdown).length > 0 && (
                      <div className="pt-4 border-t border-border/50">
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-foreground">
                          <PieChart className="w-4 h-4 text-primary" />
                          Répartition par catégorie
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(calculs.categoriesBreakdown)
                            .sort(([, a], [, b]) => b - a)
                            .map(([cat, cout]) => {
                              const percent = (cout / calculs.coutTotal) * 100;
                              return (
                                <div key={cat} className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className={getCategorieColor(cat)}>{getCategorieLabel(cat)}</span>
                                    <span className="text-muted-foreground">{typeof percent === 'number' ? (percent).toFixed(0) : '0'}%</span>
                                  </div>
                                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${cat.includes("luxe") ? "bg-purple-500" : cat.includes("premium") ? "bg-amber-500" : cat.includes("standard") ? "bg-blue-500" : "bg-green-500"}`}
                                      style={{ width: `${percent}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* Note */}
                    <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
                      <strong>Note :</strong> Ces estimations sont basées sur les prix moyens du marché. 
                      Les prix réels peuvent varier selon le fournisseur, la qualité et les quantités commandées.
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Guide des prix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mt-8 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Guide des Catégories de Prix
                </CardTitle>
                <CardDescription>
                  Classification des matières premières par gamme de prix
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-500/5">
                    <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30 mb-2">Luxe</Badge>
                    <p className="text-muted-foreground font-medium">$5,000-100,000/kg</p>
                    <p className="text-xs text-muted-foreground mt-1">Oud, Iris, Ambre gris, Muscone</p>
                  </div>
                  <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 mb-2">Premium</Badge>
                    <p className="text-muted-foreground font-medium">$500-5,000/kg</p>
                    <p className="text-xs text-muted-foreground mt-1">Rose, Jasmin, Santal, Javanol</p>
                  </div>
                  <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30 mb-2">Standard</Badge>
                    <p className="text-muted-foreground font-medium">$100-500/kg</p>
                    <p className="text-xs text-muted-foreground mt-1">Encens, Ambroxan, Gaïac</p>
                  </div>
                  <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/30 mb-2">Budget</Badge>
                    <p className="text-muted-foreground font-medium">$30-100/kg</p>
                    <p className="text-xs text-muted-foreground mt-1">Iso E Super, Hedione, Coumarine</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation vers pages connexes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="border-border/50 bg-muted/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Outils complémentaires
                </CardTitle>
                <CardDescription>Explorez d'autres outils de formulation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link href="/outils/editeur-formulation">
                    <div className="group p-4 bg-background rounded-lg border border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                      <div className="font-medium flex items-center gap-2 mb-1 text-foreground">
                        <Beaker className="w-4 h-4 text-primary" />
                        Éditeur de Formulation
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                      </div>
                      <div className="text-sm text-muted-foreground">Créer des formules complètes</div>
                    </div>
                  </Link>
                  <Link href="/generateur-formules">
                    <div className="group p-4 bg-background rounded-lg border border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                      <div className="font-medium flex items-center gap-2 mb-1 text-foreground">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Générateur IA
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                      </div>
                      <div className="text-sm text-muted-foreground">Suggestions intelligentes</div>
                    </div>
                  </Link>
                  <Link href="/outils/dilution-calculator">
                    <div className="group p-4 bg-background rounded-lg border border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                      <div className="font-medium flex items-center gap-2 mb-1 text-foreground">
                        <Scale className="w-4 h-4 text-primary" />
                        Calculateur Dilution
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                      </div>
                      <div className="text-sm text-muted-foreground">Calculs de dilution</div>
                    </div>
                  </Link>
                  <Link href="/fournisseurs">
                    <div className="group p-4 bg-background rounded-lg border border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                      <div className="font-medium flex items-center gap-2 mb-1 text-foreground">
                        <Package className="w-4 h-4 text-primary" />
                        Fournisseurs
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                      </div>
                      <div className="text-sm text-muted-foreground">Annuaire des fournisseurs</div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Voir Aussi */}
          <div className="mt-8">
            <VoirAussi 
              items={[
                { href: "/gammes/raretes", title: "Gamme Raretés", description: "30 molécules précieuses avec prix" },
                { href: "/molecules", title: "Molécules", description: `${dbMolecules?.length || 556} molécules dans la base` },
                { href: "/recettes", title: "Recettes", description: "266 formulations documentées" },
                { href: "/ifra", title: "Restrictions IFRA", description: "Réglementation des ingrédients" }
              ]}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
