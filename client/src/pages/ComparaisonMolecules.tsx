// @ts-nocheck
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { Beaker, X } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ['oklch(0.60 0.15 270)', 'oklch(0.55 0.18 25)', 'oklch(0.55 0.12 160)', 'oklch(0.68 0.20 330)'];

export default function ComparaisonMolecules() {
  const { data: molecules, isLoading } = trpc.molecules.list.useQuery();
  const { data: synergies } = trpc.synergies.list.useQuery();
  const { data: recettes } = trpc.recettes.list.useQuery();
  
  const [selectedMolecules, setSelectedMolecules] = useState<number[]>([]);

  const addMolecule = (moleculeId: string) => {
    const id = parseInt(moleculeId);
    if (!selectedMolecules.includes(id) && selectedMolecules.length < 4) {
      setSelectedMolecules([...selectedMolecules, id]);
    }
  };

  const removeMolecule = (moleculeId: number) => {
    setSelectedMolecules(selectedMolecules.filter(id => id !== moleculeId));
  };

  const selectedMoleculesData = molecules?.filter(m => selectedMolecules.includes(m.id)) || [];

  // Calculate characteristics for radar chart
  const getCharacteristics = (moleculeId: number) => {
    const molecule = molecules?.find(m => m.id === moleculeId);
    if (!molecule) return [];

    const synergiesCount = synergies?.filter(s => s.moleculeId === moleculeId).length || 0;
    const recettesCount = recettes?.filter(r => {
      if (typeof r.ingredients === 'string') {
        return r.ingredients.toLowerCase().includes(molecule.name.toLowerCase());
      }
      return false;
    }).length || 0;

    // Normalize values to 0-100 scale for radar
    const maxSynergies = 10; // Assumed max
    const maxRecettes = 20;   // Assumed max

    return [
      { characteristic: 'Synergies', value: Math.min((synergiesCount / maxSynergies) * 100, 100) },
      { characteristic: 'Recettes', value: Math.min((recettesCount / maxRecettes) * 100, 100) },
      { characteristic: 'Intensité', value: molecule.intensity || 50 }, // Real data from DB
      { characteristic: 'Volatilité', value: molecule.volatility || 50 }, // Real data from DB
      { characteristic: 'Complexité', value: molecule.complexity || 50 }, // Real data from DB
    ];
  };

  // Prepare radar chart data
  const radarData = selectedMoleculesData.length > 0 
    ? ['Synergies', 'Recettes', 'Intensité', 'Volatilité', 'Complexité'].map(char => {
        const dataPoint: any = { characteristic: char };
        selectedMoleculesData.forEach((mol, index) => {
          const chars = getCharacteristics(mol.id);
          const charData = chars.find(c => c.characteristic === char);
          dataPoint[`mol${index}`] = charData?.value || 0;
        });
        return dataPoint;
      })
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 section-spacing">
          <div className="container">
            <p className="text-center text-muted-foreground">Chargement des molécules...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 section-spacing">
        <div className="container">
          <Breadcrumbs />
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Comparaison de Molécules</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Sélectionnez 2 à 4 molécules pour comparer leurs caractéristiques, familles chimiques, 
              profils olfactifs, synergies documentées et présence dans les recettes PERFUMUM.
            </p>
          </div>

          {/* Molecule Selector */}
          <Card className="brutal-border mb-8">
            <CardHeader>
              <CardTitle>Sélection des Molécules</CardTitle>
              <CardDescription>
                Choisissez jusqu'à 4 molécules à comparer ({selectedMolecules.length}/4 sélectionnées)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Select onValueChange={addMolecule} disabled={selectedMolecules.length >= 4}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une molécule..." />
                  </SelectTrigger>
                  <SelectContent>
                    {molecules
                      ?.filter(m => !selectedMolecules.includes(m.id))
                      .map(molecule => (
                        <SelectItem key={molecule.id} value={molecule.id.toString()}>
                          {molecule.name} ({molecule.family})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {selectedMoleculesData.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedMoleculesData.map((molecule, index) => (
                      <Badge 
                        key={molecule.id} 
                        variant="secondary" 
                        className="text-sm px-3 py-2 flex items-center gap-2"
                        style={{ backgroundColor: COLORS[index] + '20', color: COLORS[index] }}
                      >
                        <Beaker className="h-3 w-3" />
                        {molecule.name}
                        <button
                          onClick={() => removeMolecule(molecule.id)}
                          className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedMoleculesData.length >= 2 ? (
            <>
              {/* Radar Chart Comparison */}
              <Card className="brutal-border mb-8">
                <CardHeader>
                  <CardTitle>Diagramme Radar des Caractéristiques</CardTitle>
                  <CardDescription>
                    Comparaison visuelle des profils moléculaires sur 5 dimensions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="characteristic" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      {selectedMoleculesData.map((molecule, index) => (
                        <Radar
                          key={molecule.id}
                          name={molecule.name}
                          dataKey={`mol${index}`}
                          stroke={COLORS[index]}
                          fill={COLORS[index]}
                          fillOpacity={0.3}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Comparison Table */}
              <Card className="brutal-border">
                <CardHeader>
                  <CardTitle>Tableau Comparatif</CardTitle>
                  <CardDescription>
                    Détails complets des {selectedMoleculesData.length} molécules sélectionnées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-border">
                          <th className="text-left py-3 px-4 font-semibold">Caractéristique</th>
                          {selectedMoleculesData.map((molecule, index) => (
                            <th 
                              key={molecule.id} 
                              className="text-left py-3 px-4 font-semibold"
                              style={{ color: COLORS[index] }}
                            >
                              {molecule.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Famille Chimique</td>
                          {selectedMoleculesData.map(molecule => (
                            <td key={molecule.id} className="py-3 px-4">
                              <Badge variant="outline">{molecule.family || 'N/A'}</Badge>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Profil Olfactif</td>
                          {selectedMoleculesData.map(molecule => (
                            <td key={molecule.id} className="py-3 px-4 text-sm">
                              {molecule.olfactiveProfile || 'Non documenté'}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Synergies Documentées</td>
                          {selectedMoleculesData.map(molecule => (
                            <td key={molecule.id} className="py-3 px-4">
                              <Badge variant="secondary">
                                {synergies?.filter(s => s.moleculeId === molecule.id).length || 0}
                              </Badge>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Recettes Associées</td>
                          {selectedMoleculesData.map(molecule => (
                            <td key={molecule.id} className="py-3 px-4">
                              <Badge variant="secondary">
                                {recettes?.filter(r => {
                                  if (typeof r.ingredients === 'string') {
                                    return r.ingredients.toLowerCase().includes(molecule.name.toLowerCase());
                                  }
                                  return false;
                                }).length || 0}
                              </Badge>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Types de Synergies</td>
                          {selectedMoleculesData.map(molecule => {
                            const molSynergies = synergies?.filter(s => s.moleculeId === molecule.id) || [];
                            const types = Array.from(new Set(molSynergies.map(s => s.type)));
                            return (
                              <td key={molecule.id} className="py-3 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {types.length > 0 ? (
                                    types.map(type => (
                                      <Badge key={type} variant="outline" className="text-xs">
                                        {type}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-sm text-muted-foreground">Aucune</span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                        <tr className="border-b border-border bg-muted/30">
                          <td className="py-3 px-4 font-medium" colSpan={selectedMoleculesData.length + 1}>
                            <strong>Données Scientifiques</strong>
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Poids Moléculaire</td>
                          {selectedMoleculesData.map(molecule => (
                            <td key={molecule.id} className="py-3 px-4">
                              {molecule.molecularWeight ? `${molecule.molecularWeight} g/mol` : 'N/A'}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Point d'Ébullition</td>
                          {selectedMoleculesData.map(molecule => (
                            <td key={molecule.id} className="py-3 px-4">
                              {molecule.boilingPoint ? `${molecule.boilingPoint}°C` : 'N/A'}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">LogP (Partition)</td>
                          {selectedMoleculesData.mapsafeToFixed(molecule => (
                            <td key={molecule.id} className="py-3 px-4">
                              {molecule.logP ? (molecule.logP / 100, 1) : 'N/A'}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Volatilité (0-100)</td>
                          {selectedMoleculesData.map(molecule => (
                            <td key={molecule.id} className="py-3 px-4">
                              <Badge variant="secondary">{molecule.volatility || 'N/A'}</Badge>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Intensité Olfactive (0-100)</td>
                          {selectedMoleculesData.map(molecule => (
                            <td key={molecule.id} className="py-3 px-4">
                              <Badge variant="secondary">{molecule.intensity || 'N/A'}</Badge>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Complexité Moléculaire (0-100)</td>
                          {selectedMoleculesData.map(molecule => (
                            <td key={molecule.id} className="py-3 px-4">
                              <Badge variant="secondary">{molecule.complexity || 'N/A'}</Badge>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="brutal-border">
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <Beaker className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Sélectionnez au moins 2 molécules</p>
                  <p className="text-sm">
                    Utilisez le sélecteur ci-dessus pour choisir les molécules à comparer
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    <Footer />

    </div>
  );
}
