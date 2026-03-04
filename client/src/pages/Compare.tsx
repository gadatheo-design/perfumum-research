// @ts-nocheck
import { useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, GitCompare, Star } from "lucide-react";
import { GammeBadge } from "@/components/GammeBadge";
import { getGammeFromOlfactiveProfile } from "@/lib/gammeMapping";
import { useMemo } from "react";
import { ConcentrationBarChart } from "@/components/charts/ConcentrationBarChart";
import { FamilyPieChart } from "@/components/charts/FamilyPieChart";
import { OlfactiveRadarChart } from "@/components/charts/OlfactiveRadarChart";

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
    // Import dependencies
    const { default: jsPDF } = await import('jspdf');
    await import('jspdf-autotable');
    const html2canvas = (await import('html2canvas')).default;
    
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('PERFUMUM — Comparaison de Molécules', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`${selectedMolecules.length} molécules comparées`, 14, 28);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 34);
    
    let currentY = 40;
    
    // Capture and add charts if they exist
    const chartsSection = document.getElementById('charts-section');
    if (chartsSection) {
      try {
        const canvas = await html2canvas(chartsSection, {
          scale: 2,
          backgroundColor: '#ffffff',
        });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        doc.addImage(imgData, 'PNG', 15, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 10;
        
        // Add new page if needed
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
      } catch (error) {
        console.error('Failed to capture charts:', error);
      }
    }
    
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
      startY: currentY,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [139, 92, 246], fontStyle: 'bold' },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [243, 244, 246] }
      },
      margin: { top: currentY }
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

        {/* Charts Section */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-6xl mx-auto" id="charts-section">
              <h2 className="text-2xl font-bold mb-8">Visualisations Comparatives</h2>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {/* Concentration Bar Chart */}
                  <div className="bg-background rounded-lg p-6 border border-border">
                    <h3 className="text-lg font-semibold mb-4">Concentrations Recommandées</h3>
                    <ConcentrationBarChart molecules={selectedMolecules} />
                  </div>
                  
                  {/* Family Pie Chart */}
                  <div className="bg-background rounded-lg p-6 border border-border">
                    <h3 className="text-lg font-semibold mb-4">Répartition Familles Chimiques</h3>
                    <FamilyPieChart molecules={selectedMolecules} />
                  </div>
                  
                  {/* Olfactive Radar Chart */}
                  <div className="bg-background rounded-lg p-6 border border-border lg:col-span-2 xl:col-span-1">
                    <h3 className="text-lg font-semibold mb-4">Profils Olfactifs</h3>
                    <OlfactiveRadarChart molecules={selectedMolecules} />
                  </div>
                </div>
              )}
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
    <Footer />

    </div>
  );
}
