import { useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, GitCompare, Star } from "lucide-react";
import { GammeBadge } from "@/components/GammeBadge";
import { getGammeFromOlfactiveProfile } from "@/lib/gammeMapping";
import { useMemo } from "react";

export default function Compare() {
  const [location, setLocation] = useLocation();
  
  // Parse IDs from URL query string
  const moleculeIds = useMemo(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const idsParam = params.get('ids');
    if (!idsParam) return [];
    return idsParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
  }, [location]);

  // Fetch molecules
  const { data: allMolecules, isLoading } = trpc.molecules.list.useQuery();
  
  const selectedMolecules = useMemo(() => {
    if (!allMolecules) return [];
    return allMolecules.filter(m => moleculeIds.includes(m.id));
  }, [allMolecules, moleculeIds]);

  if (moleculeIds.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <GitCompare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Aucune molécule sélectionnée</h2>
            <p className="text-muted-foreground mb-6">
              Sélectionnez au moins 2 molécules pour les comparer
            </p>
            <Button onClick={() => setLocation('/molecules')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux molécules
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Comparison rows data
  const comparisonRows = [
    { label: "Nom", key: "name" as const },
    { label: "Formule chimique", key: "chemicalFormula" as const },
    { label: "Famille", key: "family" as const },
    { label: "Gamme", key: "gamme" as const },
    { label: "Profil olfactif", key: "olfactiveProfile" as const },
    { label: "Résonance émotionnelle", key: "emotionalResonance" as const },
    { label: "Effet fonctionnel", key: "functionalEffect" as const },
    { label: "Concentration", key: "concentration" as const },
    { label: "Origine", key: "sourceOrigin" as const },
  ];

  const exportToPDF = async () => {
    // Import jsPDF dynamically
    const { default: jsPDF } = await import('jspdf');
    await import('jspdf-autotable');
    
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('PERFUMUM — Comparaison de Molécules', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`${selectedMolecules.length} molécules comparées`, 14, 28);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 34);
    
    // Prepare table data
    const headers = ['Critère', ...selectedMolecules.map(m => m.name)];
    const rows = comparisonRows.map(row => {
      return [
        row.label,
        ...selectedMolecules.map(molecule => {
          if (row.key === 'gamme') {
            const gamme = getGammeFromOlfactiveProfile(molecule.olfactiveProfile);
            return gamme || 'N/A';
          }
          return (molecule[row.key] as string) || 'N/A';
        })
      ];
    });
    
    // Add table
    (doc as any).autoTable({
      head: [headers],
      body: rows,
      startY: 40,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [139, 92, 246], fontStyle: 'bold' },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [243, 244, 246] }
      },
      margin: { top: 40 }
    });
    
    // Save
    doc.save(`perfumum-comparaison-${Date.now()}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/molecules')}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux molécules
              </Button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <GitCompare className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Comparaison de Molécules
                  </h1>
                  <p className="text-lg text-muted-foreground mt-2">
                    {selectedMolecules.length} molécule{selectedMolecules.length > 1 ? 's' : ''} sélectionnée{selectedMolecules.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={exportToPDF} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter en PDF
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  Copier le lien
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left p-4 bg-muted/50 font-bold sticky left-0 z-10">
                          Critère
                        </th>
                        {selectedMolecules.map((molecule) => (
                          <th key={molecule.id} className="text-left p-4 bg-muted/50 min-w-[250px]">
                            <div className="font-bold text-lg mb-2">{molecule.name}</div>
                            <div className="flex gap-2 flex-wrap">
                              {getGammeFromOlfactiveProfile(molecule.olfactiveProfile) && (
                                <GammeBadge 
                                  gamme={getGammeFromOlfactiveProfile(molecule.olfactiveProfile)!} 
                                  size="sm" 
                                  showIcon={false}
                                />
                              )}
                              {molecule.family && (
                                <Badge variant="outline" className="text-xs">
                                  {molecule.family}
                                </Badge>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row, rowIndex) => {
                        // Check if all values are the same for highlighting
                        const values = selectedMolecules.map(m => {
                          if (row.key === 'gamme') {
                            return getGammeFromOlfactiveProfile(m.olfactiveProfile);
                          }
                          return m[row.key];
                        });
                        const allSame = values.every(v => v === values[0]);

                        return (
                          <tr 
                            key={row.key} 
                            className={`border-b border-border ${
                              rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                            }`}
                          >
                            <td className="p-4 font-semibold text-sm sticky left-0 z-10 bg-muted/30">
                              {row.label}
                            </td>
                            {selectedMolecules.map((molecule) => {
                              let content: React.ReactNode = 'N/A';
                              
                              if (row.key === 'gamme') {
                                const gamme = getGammeFromOlfactiveProfile(molecule.olfactiveProfile);
                                content = gamme ? (
                                  <GammeBadge gamme={gamme} size="sm" />
                                ) : 'N/A';
                              } else {
                                const value = molecule[row.key];
                                content = value || 'N/A';
                              }

                              return (
                                <td 
                                  key={molecule.id} 
                                  className={`p-4 text-sm ${
                                    allSame ? 'bg-green-50/50 dark:bg-green-950/20' : ''
                                  }`}
                                >
                                  {typeof content === 'string' && content.length > 100 ? (
                                    <div className="text-muted-foreground leading-relaxed">
                                      {content}
                                    </div>
                                  ) : (
                                    <div className="text-foreground">{content}</div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
