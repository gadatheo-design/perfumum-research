import { Link, useParams } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ReferencesList } from "@/components/ReferencesList";
import { trpc } from "@/lib/trpc";
import { useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, Atom, Droplet, Thermometer, Zap, Sparkles, Leaf, FileDown, Globe, AlertTriangle, Beaker, MapPin, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { RecommendationsCard } from "@/components/RecommendationsCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mapping des classes chimiques pour l'affichage
const chemicalClassLabels: Record<string, string> = {
  terpene: "Terpène",
  sesquiterpene: "Sesquiterpène",
  diterpene: "Diterpène",
  monoterpene: "Monoterpène",
  aldehyde: "Aldéhyde",
  ketone: "Cétone",
  alcohol: "Alcool",
  ester: "Ester",
  ether: "Éther",
  phenol: "Phénol",
  lactone: "Lactone",
  coumarin: "Coumarine",
  musk: "Musc",
  nitrile: "Nitrile",
  sulfur_compound: "Composé soufré",
  heterocyclic: "Hétérocyclique",
  aromatic: "Aromatique",
  aliphatic: "Aliphatique",
  other: "Autre",
};

// Mapping des types de restriction IFRA
const restrictionTypeLabels: Record<string, { label: string; color: string }> = {
  prohibited: { label: "Interdit", color: "bg-red-500" },
  restricted: { label: "Restreint", color: "bg-orange-500" },
  specification: { label: "Spécification", color: "bg-yellow-500" },
  no_restriction: { label: "Sans restriction", color: "bg-green-500" },
};

// Catégories IFRA avec descriptions
const ifraCategoryDescriptions: Record<string, string> = {
  category1: "Produits à appliquer sur les lèvres",
  category2: "Produits à appliquer sur les aisselles",
  category3: "Produits à appliquer sur le visage/corps (rinçables)",
  category4: "Parfums fins",
  category5a: "Produits pour le corps (non rinçables)",
  category5b: "Produits pour le visage (non rinçables)",
  category5c: "Produits pour les mains (non rinçables)",
  category5d: "Produits pour bébés",
  category6: "Produits pour la bouche",
  category7a: "Produits capillaires (rinçables)",
  category7b: "Produits capillaires (non rinçables)",
  category8: "Produits intimes",
  category9: "Produits ménagers",
  category10a: "Détergents (contact prolongé)",
  category10b: "Détergents (contact bref)",
  category11a: "Parfums d'ambiance (spray)",
  category11b: "Parfums d'ambiance (autres)",
};

// Composant pour afficher les plantes sources d'une molécule
function PlantSourcesSection({ moleculeId }: { moleculeId: number }) {
  const { data: plantSources, isLoading } = trpc.plantMoleculeLinks.getByMolecule.useQuery({ moleculeId });

  if (isLoading) {
    return (
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          Plantes Sources
        </h2>
        
        {plantSources && plantSources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plantSources.map((source: any) => (
              <Link key={source.plant.id} href={`/plants/${source.plant.id}`}>
                <div className="p-4 bg-muted/50 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-primary">{source.plant.name}</h3>
                      {source.plant.latinName && (
                        <p className="text-sm italic text-muted-foreground">{source.plant.latinName}</p>
                      )}
                    </div>
                    {source.isSignature === 1 && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        Signature
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    {source.percentageTypical && (
                      <div>
                        <p className="text-xs text-muted-foreground">Typique</p>
                        <p className="font-mono font-semibold">{source.percentageTypical}%</p>
                      </div>
                    )}
                    {source.percentageMin && source.percentageMax && (
                      <div>
                        <p className="text-xs text-muted-foreground">Plage</p>
                        <p className="font-mono">{source.percentageMin}-{source.percentageMax}%</p>
                      </div>
                    )}
                    {source.role && (
                      <div>
                        <p className="text-xs text-muted-foreground">Rôle</p>
                        <Badge variant="outline" className="text-xs">
                          {source.role === 'majeur' ? 'Majeur' : 
                           source.role === 'secondaire' ? 'Secondaire' : 
                           source.role === 'trace' ? 'Trace' : source.role}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {source.plant.category && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="capitalize">{source.plant.category}</span>
                      {source.plant.origin && (
                        <>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{source.plant.origin}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Leaf className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucune plante source documentée pour cette molécule.</p>
            <p className="text-sm mt-2">Les informations sur les sources botaniques seront ajoutées progressivement.</p>
          </div>
        )}
      </div>
      
      {/* Lien vers la page des plantes */}
      <div className="bg-muted/50 p-4 rounded-lg border">
        <p className="text-sm text-muted-foreground">
          Explorez toutes les plantes et variétés documentées dans notre base de données.
        </p>
        <div className="flex gap-2 mt-2">
          <Link href="/plants">
            <Button variant="outline">
              <Leaf className="h-4 w-4 mr-2" />
              Voir toutes les plantes
            </Button>
          </Link>
          <Link href="/varietes">
            <Button variant="outline">
              <Beaker className="h-4 w-4 mr-2" />
              Voir les variétés
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MoleculeDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;

  const { data: molecule, isLoading } = trpc.molecules.getById.useQuery(id);
  const trackEvent = trpc.analytics.trackEvent.useMutation();
  const [isExporting, setIsExporting] = useState(false);

  // Récupérer les origines géographiques de la molécule
  const { data: moleculeOrigins, isLoading: isLoadingOrigins } = trpc.moleculeOrigins.getByMolecule.useQuery(id, {
    enabled: !!molecule,
  });

  // Récupérer les restrictions IFRA de la molécule
  const { data: ifraRestrictions, isLoading: isLoadingIfra } = trpc.ifraRestrictions.getByMolecule.useQuery(id, {
    enabled: !!molecule,
  });

  // Récupérer les recommandations
  const { data: recommendations, isLoading: isLoadingRecommendations } = trpc.recommendations.similarMolecules.useQuery(
    {
      moleculeId: id,
      limit: 5,
    },
    { enabled: !!molecule }
  );

  // Export PDF function
  const exportPDF = useCallback(async () => {
    if (!molecule) return;
    setIsExporting(true);
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Veuillez autoriser les pop-ups pour exporter le PDF');
        return;
      }

      // Generate HTML content for PDF
      const radarValues = [
        { axis: 'Intensité', value: molecule.radarIntensity || 50 },
        { axis: 'Fraîcheur', value: molecule.radarFreshness || 50 },
        { axis: 'Chaleur', value: molecule.radarWarmth || 50 },
        { axis: 'Douceur', value: molecule.radarSweetness || 50 },
        { axis: 'Épices', value: molecule.radarSpiciness || 50 },
        { axis: 'Terreux', value: molecule.radarEarthiness || 50 },
      ];

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${molecule.name} - Fiche Molécule PERFUMUM</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; }
            h1 { color: #7c3aed; margin-bottom: 5px; }
            h2 { color: #5b21b6; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 30px; }
            .formula { font-family: monospace; font-size: 1.2em; color: #666; margin-bottom: 20px; }
            .badge { display: inline-block; background: #f3e8ff; color: #7c3aed; padding: 6px 16px; border-radius: 20px; font-weight: 600; margin-right: 8px; }
            .badge-cas { background: #e0f2fe; color: #0369a1; }
            .badge-iupac { background: #fef3c7; color: #92400e; font-size: 0.9em; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; }
            .card { background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
            .card-title { font-weight: 600; color: #374151; margin-bottom: 8px; }
            .card-value { font-size: 1.5em; font-weight: bold; color: #7c3aed; }
            .card-unit { font-size: 0.8em; font-weight: normal; color: #666; }
            .radar-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .radar-table th, .radar-table td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            .radar-table th { background: #f3f4f6; font-weight: 600; }
            .progress-bar { background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden; }
            .progress-fill { background: #7c3aed; height: 100%; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 0.9em; }
            .scientific-info { background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>${molecule.name}</h1>
          ${molecule.chemicalFormula ? `<p class="formula">${molecule.chemicalFormula}</p>` : ''}
          <div style="margin-bottom: 20px;">
            ${molecule.family ? `<span class="badge">${molecule.family}</span>` : ''}
            ${molecule.chemicalClass ? `<span class="badge">${chemicalClassLabels[molecule.chemicalClass] || molecule.chemicalClass}</span>` : ''}
            ${molecule.casNumber ? `<span class="badge badge-cas">CAS: ${molecule.casNumber}</span>` : ''}
          </div>
          
          ${molecule.iupacName ? `
            <div class="scientific-info">
              <strong>Nom IUPAC:</strong> ${molecule.iupacName}
            </div>
          ` : ''}
          
          ${molecule.olfactiveProfile ? `
            <h2>🌿 Profil Olfactif</h2>
            <p>${molecule.olfactiveProfile}</p>
          ` : ''}
          
          ${molecule.emotionalResonance ? `
            <h2>⚡ Résonance Émotionnelle</h2>
            <p>${molecule.emotionalResonance}</p>
          ` : ''}
          
          <h2>📊 Propriétés Scientifiques</h2>
          <div class="grid">
            ${molecule.molecularWeight ? `<div class="card"><div class="card-title">Masse Moléculaire</div><div class="card-value">${molecule.molecularWeight} <span class="card-unit">g/mol</span></div></div>` : ''}
            ${molecule.boilingPoint ? `<div class="card"><div class="card-title">Point d'Ébullition</div><div class="card-value">${molecule.boilingPoint} <span class="card-unit">°C</span></div></div>` : ''}
            ${molecule.intensity ? `<div class="card"><div class="card-title">Intensité Olfactive</div><div class="card-value">${molecule.intensity}%</div></div>` : ''}
            ${molecule.volatility ? `<div class="card"><div class="card-title">Volatilité</div><div class="card-value">${molecule.volatility}%</div></div>` : ''}
          </div>
          
          <h2>🎯 Profil Radar Olfactif</h2>
          <table class="radar-table">
            <thead><tr><th>Axe</th><th>Valeur</th><th>Visualisation</th></tr></thead>
            <tbody>
              ${radarValues.map(r => `
                <tr>
                  <td>${r.axis}</td>
                  <td><strong>${r.value}</strong>/100</td>
                  <td><div class="progress-bar"><div class="progress-fill" style="width: ${r.value}%"></div></div></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          ${molecule.sourceOrigin ? `
            <h2>🌱 Origine</h2>
            <p>${molecule.sourceOrigin}</p>
          ` : ''}
          
          ${molecule.concentration ? `
            <h2>💧 Concentration Recommandée</h2>
            <p style="font-size: 1.3em; font-weight: bold; color: #7c3aed;">${molecule.concentration}</p>
          ` : ''}
          
          ${molecule.notes ? `
            <h2>📝 Notes de Recherche</h2>
            <p>${molecule.notes}</p>
          ` : ''}
          
          <div class="footer">
            <p>PERFUMUM — Recherche Olfactive | Exporté le ${new Date().toLocaleDateString('fr-FR')}</p>
            <p>Document généré automatiquement à partir de la base de données PERFUMUM</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
    }
  }, [molecule]);

  // Track page view
  useEffect(() => {
    if (molecule) {
      trackEvent.mutate({
        eventType: "molecule_view",
        entityId: molecule.id,
        entityType: "molecule",
        metadata: JSON.stringify({
          moleculeName: molecule.name,
          family: molecule.family,
          source: "molecule_detail",
        }),
      });
    }
  }, [molecule?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!molecule) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container max-w-6xl">
          <Link href="/molecules" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4" />
            Retour aux molécules
          </Link>
          <h1 className="text-2xl font-bold mb-4">Molécule introuvable</h1>
          <p className="text-muted-foreground">
            La molécule demandée n'existe pas ou a été supprimée.
          </p>
        </div>
      </div>
    );
  }

  // Préparer les données pour le radar chart
  const radarData = [
    { axis: "Intensité", value: molecule.radarIntensity || 50 },
    { axis: "Fraîcheur", value: molecule.radarFreshness || 50 },
    { axis: "Chaleur", value: molecule.radarWarmth || 50 },
    { axis: "Douceur", value: molecule.radarSweetness || 50 },
    { axis: "Épices", value: molecule.radarSpiciness || 50 },
    { axis: "Terreux", value: molecule.radarEarthiness || 50 },
  ];

  const hasRadarData = radarData.some(d => d.value !== 50);

  // Vérifier si la molécule a des restrictions IFRA
  const hasIfraRestrictions = ifraRestrictions && ifraRestrictions.length > 0;
  const primaryRestriction = hasIfraRestrictions ? ifraRestrictions[0] : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-6xl">
        <Breadcrumbs 
          customItems={[
            { label: "Molécules", path: "/molecules" },
            { label: molecule.name }
          ]} 
        />
        <div className="flex items-center justify-between mb-6">
          <Link href="/molecules" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Retour aux molécules
          </Link>
          <Button
            onClick={exportPDF}
            disabled={isExporting}
            variant="outline"
            className="gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            Exporter PDF
          </Button>
        </div>

        <div className="space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg border">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{molecule.name}</h1>
                {molecule.chemicalFormula && (
                  <p className="text-xl text-muted-foreground font-mono mb-4">
                    {molecule.chemicalFormula}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {molecule.family && (
                    <Badge variant="secondary" className="text-sm">
                      {molecule.family}
                    </Badge>
                  )}
                  {molecule.chemicalClass && (
                    <Badge variant="outline" className="text-sm">
                      <Beaker className="h-3 w-3 mr-1" />
                      {chemicalClassLabels[molecule.chemicalClass] || molecule.chemicalClass}
                    </Badge>
                  )}
                  {molecule.casNumber && (
                    <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                      CAS: {molecule.casNumber}
                    </Badge>
                  )}
                  {hasIfraRestrictions && primaryRestriction?.restrictionType && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge 
                            className={`text-sm text-white ${restrictionTypeLabels[primaryRestriction.restrictionType]?.color || 'bg-gray-500'}`}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            IFRA: {restrictionTypeLabels[primaryRestriction.restrictionType]?.label || primaryRestriction.restrictionType}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Voir les restrictions IFRA ci-dessous</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
            
            {/* Nom IUPAC */}
            {molecule.iupacName && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">Nom IUPAC</p>
                <p className="text-sm font-mono text-amber-800 dark:text-amber-200">{molecule.iupacName}</p>
              </div>
            )}
          </div>

          {/* Tabs pour organiser le contenu */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="scientific">Données scientifiques</TabsTrigger>
              <TabsTrigger value="plants">Plantes sources</TabsTrigger>
              <TabsTrigger value="origins">Origines géographiques</TabsTrigger>
              <TabsTrigger value="ifra">Réglementation IFRA</TabsTrigger>
            </TabsList>

            {/* Onglet Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Profil Olfactif Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {molecule.olfactiveProfile && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Profil Olfactif</h2>
                    </div>
                    <p className="whitespace-pre-wrap text-muted-foreground">{molecule.olfactiveProfile}</p>
                  </div>
                )}

                {molecule.emotionalResonance && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Résonance Émotionnelle</h2>
                    </div>
                    <p className="whitespace-pre-wrap text-muted-foreground">{molecule.emotionalResonance}</p>
                  </div>
                )}

                {molecule.functionalEffect && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Atom className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Effet Fonctionnel</h2>
                    </div>
                    <p className="whitespace-pre-wrap text-muted-foreground">{molecule.functionalEffect}</p>
                  </div>
                )}

                {molecule.sourceOrigin && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Leaf className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Origine</h2>
                    </div>
                    <p className="text-muted-foreground">{molecule.sourceOrigin}</p>
                  </div>
                )}
              </div>

              {/* Profil Radar Olfactif */}
              {hasRadarData && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Profil Radar Olfactif</h2>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="axis" tick={{ fill: "hsl(var(--foreground))", fontSize: 14 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <Radar
                          name={molecule.name}
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Informations Botaniques et Extraction */}
              <div className="grid md:grid-cols-2 gap-6">
                {molecule.botanicalSources && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Sources Botaniques</h2>
                    <p className="whitespace-pre-wrap text-muted-foreground">{molecule.botanicalSources}</p>
                  </div>
                )}

                {molecule.extractionMethod && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Méthode d'Extraction</h2>
                    <p className="whitespace-pre-wrap text-muted-foreground">{molecule.extractionMethod}</p>
                  </div>
                )}

                {molecule.therapeuticProperties && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Propriétés Thérapeutiques</h2>
                    <p className="whitespace-pre-wrap text-muted-foreground">{molecule.therapeuticProperties}</p>
                  </div>
                )}

                {molecule.concentration && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Droplet className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Concentration Recommandée</h2>
                    </div>
                    <p className="text-2xl font-bold text-primary">{molecule.concentration}</p>
                  </div>
                )}
              </div>

              {/* Notes de Recherche */}
              {molecule.notes && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-lg font-semibold mb-3">Notes de Recherche</h2>
                  <p className="whitespace-pre-wrap text-muted-foreground">{molecule.notes}</p>
                </div>
              )}

              {/* Recommandations IA */}
              {recommendations && recommendations.length > 0 && (
                <RecommendationsCard
                  type="molecules"
                  recommendations={recommendations}
                  isLoading={isLoadingRecommendations}
                />
              )}

              {/* Références Bibliographiques */}
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Références Bibliographiques</h2>
                <ReferencesList references={molecule.references as any} />
              </div>
            </TabsContent>

            {/* Onglet Données scientifiques */}
            <TabsContent value="scientific" className="space-y-6 mt-6">
              {/* Nomenclature scientifique */}
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-primary" />
                  Nomenclature Scientifique
                </h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Nom commun</p>
                      <p className="text-lg font-semibold">{molecule.name}</p>
                    </div>
                    {molecule.chemicalFormula && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Formule chimique</p>
                        <p className="text-lg font-mono font-semibold">{molecule.chemicalFormula}</p>
                      </div>
                    )}
                  </div>
                  
                  {molecule.iupacName && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">Nom IUPAC (nomenclature systématique)</p>
                      <p className="font-mono text-amber-800 dark:text-amber-200">{molecule.iupacName}</p>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {molecule.casNumber && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Numéro CAS</p>
                        <p className="text-lg font-mono font-semibold text-blue-800 dark:text-blue-200">{molecule.casNumber}</p>
                        <a 
                          href={`https://commonchemistry.cas.org/detail?cas_rn=${molecule.casNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2"
                        >
                          Voir sur CAS Common Chemistry <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {molecule.chemicalClass && (
                      <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Classe chimique</p>
                        <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                          {chemicalClassLabels[molecule.chemicalClass] || molecule.chemicalClass}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Propriétés Scientifiques */}
              {(molecule.molecularWeight || molecule.boilingPoint || molecule.logP || molecule.volatility || molecule.intensity || molecule.complexity) && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    Propriétés Physico-chimiques
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {molecule.molecularWeight && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Masse Moléculaire</p>
                        <p className="text-2xl font-bold">{molecule.molecularWeight} <span className="text-sm font-normal">g/mol</span></p>
                      </div>
                    )}
                    {molecule.boilingPoint && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Point d'Ébullition</p>
                        <p className="text-2xl font-bold">{molecule.boilingPoint} <span className="text-sm font-normal">°C</span></p>
                      </div>
                    )}
                    {molecule.logP && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">LogP (lipophilie)</p>
                        <p className="text-2xl font-bold">{(molecule.logP / 100).toFixed(2)}</p>
                      </div>
                    )}
                    {molecule.volatility && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Volatilité</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-background rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${molecule.volatility}%` }}></div>
                          </div>
                          <span className="text-sm font-semibold">{molecule.volatility}%</span>
                        </div>
                      </div>
                    )}
                    {molecule.intensity && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Intensité Olfactive</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-background rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${molecule.intensity}%` }}></div>
                          </div>
                          <span className="text-sm font-semibold">{molecule.intensity}%</span>
                        </div>
                      </div>
                    )}
                    {molecule.complexity && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Complexité</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-background rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${molecule.complexity}%` }}></div>
                          </div>
                          <span className="text-sm font-semibold">{molecule.complexity}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Famille chimique */}
              {molecule.family && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Classification Olfactive</h2>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Famille olfactive</p>
                      <p className="text-xl font-semibold text-primary">{molecule.family}</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Onglet Plantes sources */}
            <TabsContent value="plants" className="space-y-6 mt-6">
              <PlantSourcesSection moleculeId={id} />
            </TabsContent>

            {/* Onglet Origines géographiques */}
            <TabsContent value="origins" className="space-y-6 mt-6">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Origines Géographiques (Terroirs de Production)
                </h2>
                
                {isLoadingOrigins ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : moleculeOrigins && moleculeOrigins.length > 0 ? (
                  <div className="space-y-4">
                    {moleculeOrigins.map((origin: any) => (
                      <div 
                        key={origin.id} 
                        className={`p-4 rounded-lg border ${origin.isPrimaryOrigin ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : 'bg-muted/50'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <h3 className="font-semibold">{origin.origin?.name || 'Origine inconnue'}</h3>
                              {origin.isPrimaryOrigin === 1 && (
                                <Badge variant="secondary" className="text-xs">Origine principale</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {origin.origin?.region && `${origin.origin.region}, `}
                              {origin.origin?.country}
                            </p>
                          </div>
                          {origin.qualityRating && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Qualité</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-lg ${i < origin.qualityRating ? 'text-yellow-500' : 'text-gray-300'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          {origin.origin?.climate && (
                            <div>
                              <p className="text-xs text-muted-foreground">Climat</p>
                              <p className="text-sm">{origin.origin.climate}</p>
                            </div>
                          )}
                          {origin.origin?.soilType && (
                            <div>
                              <p className="text-xs text-muted-foreground">Type de sol</p>
                              <p className="text-sm">{origin.origin.soilType}</p>
                            </div>
                          )}
                          {origin.productionVolume && (
                            <div>
                              <p className="text-xs text-muted-foreground">Volume de production</p>
                              <p className="text-sm">{origin.productionVolume}</p>
                            </div>
                          )}
                          {origin.priceRange && (
                            <div>
                              <p className="text-xs text-muted-foreground">Gamme de prix</p>
                              <p className="text-sm">{origin.priceRange}</p>
                            </div>
                          )}
                        </div>
                        
                        {origin.specificCharacteristics && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Caractéristiques spécifiques</p>
                            <p className="text-sm">{origin.specificCharacteristics}</p>
                          </div>
                        )}
                        
                        {origin.notes && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Notes</p>
                            <p className="text-sm italic">{origin.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune origine géographique documentée pour cette molécule.</p>
                    <p className="text-sm mt-2">Les informations sur les terroirs de production seront ajoutées progressivement.</p>
                  </div>
                )}
              </div>

              {/* Lien vers la page des terroirs */}
              <div className="bg-muted/50 p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">
                  Explorez tous les terroirs de production documentés dans notre base de données.
                </p>
                <Link href="/terroirs">
                  <Button variant="outline" className="mt-2">
                    <Globe className="h-4 w-4 mr-2" />
                    Voir tous les terroirs
                  </Button>
                </Link>
              </div>
            </TabsContent>

            {/* Onglet Réglementation IFRA */}
            <TabsContent value="ifra" className="space-y-6 mt-6">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Restrictions IFRA (International Fragrance Association)
                </h2>
                
                {isLoadingIfra ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : hasIfraRestrictions ? (
                  <div className="space-y-6">
                    {ifraRestrictions.map((restriction: any) => (
                      <div key={restriction.id} className="space-y-4">
                        {/* En-tête de la restriction */}
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              {restriction.restrictionType && (
                                <Badge 
                                  className={`text-white ${restrictionTypeLabels[restriction.restrictionType]?.color || 'bg-gray-500'}`}
                                >
                                  {restrictionTypeLabels[restriction.restrictionType]?.label || restriction.restrictionType}
                                </Badge>
                              )}
                              {restriction.ifraAmendment && (
                                <span className="text-sm text-muted-foreground">
                                  Amendement {restriction.ifraAmendment}
                                </span>
                              )}
                            </div>
                            {restriction.effectiveDate && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Date d'effet: {new Date(restriction.effectiveDate).toLocaleDateString('fr-FR')}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Raison de la restriction */}
                        {restriction.reasonForRestriction && (
                          <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                              <div>
                                <p className="font-medium text-orange-800 dark:text-orange-200">Raison de la restriction</p>
                                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">{restriction.reasonForRestriction}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Limites par catégorie */}
                        <div>
                          <h3 className="font-medium mb-3">Limites de concentration par catégorie de produit</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {Object.entries(ifraCategoryDescriptions).map(([key, description]) => {
                              const value = restriction[key];
                              if (!value) return null;
                              return (
                                <TooltipProvider key={key}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="p-2 bg-muted/50 rounded border text-sm flex justify-between items-center cursor-help">
                                        <span className="text-muted-foreground truncate mr-2">{key.replace('category', 'Cat. ')}</span>
                                        <span className="font-mono font-semibold">{value}</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">{description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}
                          </div>
                        </div>

                        {/* Alternatives suggérées */}
                        {restriction.alternativeSuggestions && (
                          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="font-medium text-green-800 dark:text-green-200">Alternatives suggérées</p>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">{restriction.alternativeSuggestions}</p>
                          </div>
                        )}

                        {/* Notes et source */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          {restriction.notes && (
                            <div className="flex-1 min-w-[200px]">
                              <p className="text-muted-foreground">Notes</p>
                              <p>{restriction.notes}</p>
                            </div>
                          )}
                          {restriction.sourceUrl && (
                            <div>
                              <a 
                                href={restriction.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                Source IFRA <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune restriction IFRA documentée pour cette molécule.</p>
                    <p className="text-sm mt-2">Cette molécule peut être utilisée sans restriction particulière selon les données disponibles.</p>
                  </div>
                )}
              </div>

              {/* Informations sur l'IFRA */}
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">À propos de l'IFRA</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  L'International Fragrance Association (IFRA) établit des normes de sécurité pour l'utilisation des ingrédients 
                  parfumants. Les restrictions sont basées sur des évaluations scientifiques et varient selon le type de produit 
                  et le niveau d'exposition cutanée.
                </p>
                <a 
                  href="https://ifrafragrance.org/standards/IFRA_Standards_Booklet.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2"
                >
                  Consulter les standards IFRA <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
