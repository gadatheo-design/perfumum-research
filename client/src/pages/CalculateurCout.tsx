import { useState, useMemo } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VoirAussi } from "@/components/VoirAussi";
import { 
  Calculator, Plus, Trash2, DollarSign, FlaskConical, 
  Info, AlertTriangle, TrendingUp, Package
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

// Base de données des prix des molécules (prix moyen en $/kg)
const moleculesPrix: Record<string, { prixMin: number; prixMax: number; categorie: string }> = {
  // Naturels rares
  "Oud (Aquilaria)": { prixMin: 30000, prixMax: 100000, categorie: "naturel-luxe" },
  "Absolue d'Iris": { prixMin: 40000, prixMax: 100000, categorie: "naturel-luxe" },
  "Ambre Gris": { prixMin: 20000, prixMax: 50000, categorie: "naturel-luxe" },
  "Absolue de Rose": { prixMin: 6000, prixMax: 12000, categorie: "naturel-premium" },
  "Absolue de Jasmin": { prixMin: 5000, prixMax: 10000, categorie: "naturel-premium" },
  "Tubéreuse Absolue": { prixMin: 8000, prixMax: 18000, categorie: "naturel-premium" },
  "Santal Mysore": { prixMin: 2500, prixMax: 5000, categorie: "naturel-premium" },
  "Muscone": { prixMin: 8000, prixMax: 15000, categorie: "naturel-luxe" },
  "Civettone": { prixMin: 5000, prixMax: 12000, categorie: "naturel-luxe" },
  "Safranal": { prixMin: 3000, prixMax: 8000, categorie: "naturel-premium" },
  
  // Épices et résines
  "Encens Oliban": { prixMin: 300, prixMax: 800, categorie: "naturel-standard" },
  "Myrrhe": { prixMin: 200, prixMax: 600, categorie: "naturel-standard" },
  "Cardamome": { prixMin: 80, prixMax: 200, categorie: "naturel-standard" },
  "Bergamote Calabre": { prixMin: 100, prixMax: 250, categorie: "naturel-standard" },
  "Yuzu": { prixMin: 400, prixMax: 900, categorie: "naturel-premium" },
  
  // Bois
  "Cèdre Atlas": { prixMin: 30, prixMax: 80, categorie: "naturel-budget" },
  "Gaïac": { prixMin: 200, prixMax: 500, categorie: "naturel-standard" },
  "Vétiver": { prixMin: 150, prixMax: 400, categorie: "naturel-standard" },
  "Patchouli": { prixMin: 80, prixMax: 200, categorie: "naturel-standard" },
  
  // Synthétiques courants
  "Iso E Super": { prixMin: 50, prixMax: 150, categorie: "synthetique-budget" },
  "Ambroxan": { prixMin: 150, prixMax: 400, categorie: "synthetique-standard" },
  "Hedione": { prixMin: 60, prixMax: 150, categorie: "synthetique-budget" },
  "Galaxolide": { prixMin: 50, prixMax: 120, categorie: "synthetique-budget" },
  "Cashmeran": { prixMin: 80, prixMax: 200, categorie: "synthetique-budget" },
  "Coumarine": { prixMin: 30, prixMax: 80, categorie: "synthetique-budget" },
  "Calone 1951": { prixMin: 100, prixMax: 300, categorie: "synthetique-standard" },
  "Ethylene Brassylate": { prixMin: 80, prixMax: 200, categorie: "synthetique-budget" },
  
  // Captives premium
  "Javanol": { prixMin: 500, prixMax: 1500, categorie: "synthetique-premium" },
  "Norlimbanol": { prixMin: 300, prixMax: 700, categorie: "synthetique-premium" },
  "Clearwood": { prixMin: 400, prixMax: 900, categorie: "synthetique-premium" },
  "Paradisone": { prixMin: 350, prixMax: 800, categorie: "synthetique-premium" },
  "Ambrox Super": { prixMin: 200, prixMax: 500, categorie: "synthetique-standard" },
  
  // Bases et solvants
  "Alcool éthylique (parfumerie)": { prixMin: 3, prixMax: 8, categorie: "base" },
  "DPG (Dipropylene Glycol)": { prixMin: 5, prixMax: 15, categorie: "base" },
  "IPM (Isopropyl Myristate)": { prixMin: 10, prixMax: 25, categorie: "base" },
};

// Liste des molécules pour le sélecteur
const moleculesListe = Object.keys(moleculesPrix).sort();

interface Ingredient {
  id: string;
  molecule: string;
  proportion: number; // en %
}

export default function CalculateurCout() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", molecule: "Hedione", proportion: 10 },
    { id: "2", molecule: "Ambroxan", proportion: 5 },
    { id: "3", molecule: "Iso E Super", proportion: 8 },
  ]);
  const [quantiteTotale, setQuantiteTotale] = useState(100); // en grammes
  const [concentration, setConcentration] = useState(15); // % de concentré dans le produit final
  const [usePrixMin, setUsePrixMin] = useState(false);

  // Ajouter un ingrédient
  const ajouterIngredient = () => {
    const newId = Date.now().toString();
    setIngredients([...ingredients, { id: newId, molecule: "", proportion: 0 }]);
  };

  // Supprimer un ingrédient
  const supprimerIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  // Mettre à jour un ingrédient
  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ));
  };

  // Calculs
  const calculs = useMemo(() => {
    let coutTotal = 0;
    let proportionTotale = 0;
    const details: { molecule: string; proportion: number; prixKg: number; cout: number }[] = [];

    for (const ing of ingredients) {
      if (ing.molecule && ing.proportion > 0 && moleculesPrix[ing.molecule]) {
        const prixData = moleculesPrix[ing.molecule];
        const prixKg = usePrixMin ? prixData.prixMin : (prixData.prixMin + prixData.prixMax) / 2;
        const quantiteGrammes = (ing.proportion / 100) * quantiteTotale;
        const cout = (quantiteGrammes / 1000) * prixKg;
        
        coutTotal += cout;
        proportionTotale += ing.proportion;
        details.push({
          molecule: ing.molecule,
          proportion: ing.proportion,
          prixKg,
          cout
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

    return {
      coutTotal,
      proportionTotale,
      details,
      coutSolvant,
      coutProduitFinal,
      prixParMl,
      prixPour100ml,
      volumeMl
    };
  }, [ingredients, quantiteTotale, concentration, usePrixMin]);

  const getCategorieColor = (categorie: string) => {
    if (categorie.includes("luxe")) return "text-purple-500";
    if (categorie.includes("premium")) return "text-amber-500";
    if (categorie.includes("standard")) return "text-blue-500";
    return "text-green-500";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1 container py-8 max-w-5xl">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Calculateur de Coût</h1>
          </div>
          <p className="text-muted-foreground">
            Estimez le coût de production d'une formulation parfumée en fonction des molécules utilisées et de leurs proportions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            {/* Paramètres généraux */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Paramètres de Production
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantite">Quantité totale (g)</Label>
                    <Input
                      id="quantite"
                      type="number"
                      value={quantiteTotale}
                      onChange={(e) => setQuantiteTotale(Number(e.target.value))}
                      min={1}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      ≈ {(quantiteTotale / 0.9).toFixed(0)} ml de produit final
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="concentration">Concentration (%)</Label>
                    <Select 
                      value={concentration.toString()} 
                      onValueChange={(v) => setConcentration(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5% - Eau de Cologne</SelectItem>
                        <SelectItem value="8">8% - Eau Fraîche</SelectItem>
                        <SelectItem value="12">12% - Eau de Toilette</SelectItem>
                        <SelectItem value="15">15% - Eau de Parfum</SelectItem>
                        <SelectItem value="20">20% - Parfum</SelectItem>
                        <SelectItem value="25">25% - Extrait</SelectItem>
                        <SelectItem value="30">30% - Extrait Intense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="prixMin"
                    checked={usePrixMin}
                    onChange={(e) => setUsePrixMin(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="prixMin" className="text-sm cursor-pointer">
                    Utiliser les prix minimum (estimation optimiste)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Liste des ingrédients */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FlaskConical className="w-5 h-5" />
                  Composition
                </CardTitle>
                <CardDescription>
                  Ajoutez les molécules et leurs proportions dans le concentré
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {ingredients.map((ing, index) => (
                  <div key={ing.id} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                    <Select 
                      value={ing.molecule} 
                      onValueChange={(v) => updateIngredient(ing.id, "molecule", v)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Sélectionner une molécule" />
                      </SelectTrigger>
                      <SelectContent>
                        {moleculesListe.map((mol) => (
                          <SelectItem key={mol} value={mol}>
                            <span className="flex items-center gap-2">
                              {mol}
                              <span className={`text-xs ${getCategorieColor(moleculesPrix[mol].categorie)}`}>
                                ${moleculesPrix[mol].prixMin.toLocaleString()}-{moleculesPrix[mol].prixMax.toLocaleString()}/kg
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={ing.proportion}
                        onChange={(e) => updateIngredient(ing.id, "proportion", Number(e.target.value))}
                        className="w-20"
                        min={0}
                        max={100}
                        step={0.1}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => supprimerIngredient(ing.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={ajouterIngredient}
                  className="w-full mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un ingrédient
                </Button>

                {calculs.proportionTotale > 100 && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    La somme des proportions dépasse 100% ({calculs.proportionTotale.toFixed(1)}%)
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Résultats */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Estimation des Coûts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coût du concentré */}
                <div className="p-4 rounded-lg bg-muted/50">
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
                  <div className="text-2xl font-bold">
                    ${calculs.coutTotal.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    pour {quantiteTotale * (concentration / 100)}g de concentré
                  </div>
                </div>

                {/* Coût produit final */}
                <div className="p-4 rounded-lg bg-primary/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Coût produit final</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    ${calculs.coutProduitFinal.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    pour {calculs.volumeMl.toFixed(0)}ml ({concentration}% concentration)
                  </div>
                </div>

                {/* Prix au ml */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border text-center">
                    <div className="text-lg font-bold">${calculs.prixParMl.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">par ml</div>
                  </div>
                  <div className="p-3 rounded-lg border text-center">
                    <div className="text-lg font-bold">${calculs.prixPour100ml.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">pour 100ml</div>
                  </div>
                </div>

                {/* Détail par ingrédient */}
                {calculs.details.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Détail par ingrédient
                    </h4>
                    <div className="space-y-2 text-sm">
                      {calculs.details
                        .sort((a, b) => b.cout - a.cout)
                        .map((d, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-muted-foreground truncate flex-1">
                              {d.molecule} ({d.proportion}%)
                            </span>
                            <span className="font-medium ml-2">
                              ${d.cout.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-muted-foreground">Solvant (alcool)</span>
                        <span className="font-medium">${calculs.coutSolvant.toFixed(2)}</span>
                      </div>
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
          </div>
        </div>

        {/* Guide des prix */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Guide des Catégories de Prix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 rounded-lg border">
                <Badge className="bg-purple-500/10 text-purple-500 mb-2">Luxe</Badge>
                <p className="text-muted-foreground">$5,000-100,000/kg</p>
                <p className="text-xs">Oud, Iris, Ambre gris, Muscone</p>
              </div>
              <div className="p-3 rounded-lg border">
                <Badge className="bg-amber-500/10 text-amber-500 mb-2">Premium</Badge>
                <p className="text-muted-foreground">$500-5,000/kg</p>
                <p className="text-xs">Rose, Jasmin, Santal, Javanol</p>
              </div>
              <div className="p-3 rounded-lg border">
                <Badge className="bg-blue-500/10 text-blue-500 mb-2">Standard</Badge>
                <p className="text-muted-foreground">$100-500/kg</p>
                <p className="text-xs">Encens, Ambroxan, Gaïac</p>
              </div>
              <div className="p-3 rounded-lg border">
                <Badge className="bg-green-500/10 text-green-500 mb-2">Budget</Badge>
                <p className="text-muted-foreground">$30-100/kg</p>
                <p className="text-xs">Iso E Super, Hedione, Coumarine</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voir Aussi */}
        <div className="mt-8">
          <VoirAussi 
            items={[
              { href: "/gammes/raretes", title: "Gamme Raretés", description: "30 molécules précieuses avec prix" },
              { href: "/fournisseurs", title: "Fournisseurs", description: "18 fournisseurs référencés" },
              { href: "/recettes", title: "Recettes", description: "210 formulations" },
              { href: "/molecules", title: "Molécules", description: "206 molécules dans la base" }
            ]}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
