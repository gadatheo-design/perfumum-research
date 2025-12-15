import { Link, useParams } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, Atom, Droplet, Thermometer, Zap, Sparkles, Leaf, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export default function MoleculeDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;

  const { data: molecule, isLoading } = trpc.molecules.getById.useQuery(id);
  const trackEvent = trpc.analytics.trackEvent.useMutation();
  const [isExporting, setIsExporting] = useState(false);

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
            .badge { display: inline-block; background: #f3e8ff; color: #7c3aed; padding: 6px 16px; border-radius: 20px; font-weight: 600; }
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
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>${molecule.name}</h1>
          ${molecule.chemicalFormula ? `<p class="formula">${molecule.chemicalFormula}</p>` : ''}
          ${molecule.family ? `<span class="badge">${molecule.family}</span>` : ''}
          
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
            <h1 className="text-4xl font-bold mb-2">{molecule.name}</h1>
            {molecule.chemicalFormula && (
              <p className="text-xl text-muted-foreground font-mono mb-4">
                {molecule.chemicalFormula}
              </p>
            )}
            {molecule.family && (
              <div className="inline-block bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                {molecule.family}
              </div>
            )}
          </div>

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

          {/* Propriétés Scientifiques */}
          {(molecule.molecularWeight || molecule.boilingPoint || molecule.logP || molecule.volatility || molecule.intensity || molecule.complexity) && (
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-primary" />
                Propriétés Scientifiques
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
                    <p className="text-sm text-muted-foreground mb-1">LogP</p>
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
        </div>
      </div>
    </div>
  );
}
