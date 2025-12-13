import { useState, useMemo } from 'react';
import { trpc } from '../lib/trpc';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { X, Download, GitCompare } from 'lucide-react';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function CompareMoleculesAdvanced() {
  const [selectedMoleculeIds, setSelectedMoleculeIds] = useState<number[]>([]);
  const { data: allMolecules } = trpc.molecules.list.useQuery();

  // Filtrer les molécules sélectionnées à partir de la liste complète
  const selectedMolecules = useMemo(() => {
    if (!allMolecules) return [];
    return allMolecules.filter(m => selectedMoleculeIds.includes(m.id));
  }, [allMolecules, selectedMoleculeIds]);

  const addMolecule = (id: string) => {
    const moleculeId = parseInt(id);
    if (selectedMoleculeIds.length < 4 && !selectedMoleculeIds.includes(moleculeId)) {
      setSelectedMoleculeIds([...selectedMoleculeIds, moleculeId]);
    }
  };

  const removeMolecule = (id: number) => {
    setSelectedMoleculeIds(selectedMoleculeIds.filter(mid => mid !== id));
  };

  const clearAll = () => {
    setSelectedMoleculeIds([]);
  };

  // Préparer les données pour le radar
  const radarData = {
    labels: ['Intensité', 'Fraîcheur', 'Chaleur', 'Douceur', 'Épices', 'Terreux'],
    datasets: selectedMolecules.map((mol, index) => {
      const colors = [
        'rgba(139, 92, 246, 0.6)',   // violet
        'rgba(34, 197, 94, 0.6)',    // vert
        'rgba(249, 115, 22, 0.6)',   // orange
        'rgba(59, 130, 246, 0.6)'    // bleu
      ];
      const borderColors = [
        'rgb(139, 92, 246)',
        'rgb(34, 197, 94)',
        'rgb(249, 115, 22)',
        'rgb(59, 130, 246)'
      ];
      
      return {
        label: mol.name,
        data: [
          mol.radarIntensity || 50,
          mol.radarFreshness || 50,
          mol.radarWarmth || 50,
          mol.radarSweetness || 50,
          mol.radarSpiciness || 50,
          mol.radarEarthiness || 50
        ],
        backgroundColor: colors[index],
        borderColor: borderColors[index],
        borderWidth: 2,
        pointBackgroundColor: borderColors[index],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: borderColors[index]
      };
    })
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          font: { size: 11 }
        },
        pointLabels: {
          font: { size: 13, weight: 'bold' as const }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { size: 12 },
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.r}/100`;
          }
        }
      }
    }
  };

  // Calculer la similarité olfactive (distance euclidienne)
  const calculateSimilarity = (mol1: any, mol2: any) => {
    const axes = ['radarIntensity', 'radarFreshness', 'radarWarmth', 'radarSweetness', 'radarSpiciness', 'radarEarthiness'];
    const distance = Math.sqrt(
      axes.reduce((sum, axis) => {
        const diff = (mol1[axis] || 50) - (mol2[axis] || 50);
        return sum + diff * diff;
      }, 0)
    );
    // Normaliser sur 100 (distance max = sqrt(6 * 100^2) = 244.95)
    const similarity = Math.max(0, 100 - (distance / 244.95) * 100);
    return Math.round(similarity);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GitCompare className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold uppercase tracking-tight">
              Comparateur Molécules Avancé
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comparez jusqu'à 4 molécules simultanément : profils radar superposés, propriétés chimiques, synergies et similarité olfactive calculée.
          </p>
        </div>

        {/* Sélection molécules */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Sélectionner des molécules (2-4)</h2>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <Select onValueChange={addMolecule} disabled={selectedMoleculeIds.length >= 4}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Ajouter une molécule..." />
              </SelectTrigger>
              <SelectContent>
                {allMolecules?.filter(m => !selectedMoleculeIds.includes(m.id)).map(mol => (
                  <SelectItem key={mol.id} value={mol.id.toString()}>
                    {mol.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedMoleculeIds.length > 0 && (
              <Button variant="outline" onClick={clearAll}>
                Effacer tout ({selectedMoleculeIds.length})
              </Button>
            )}
          </div>

          {/* Badges molécules sélectionnées */}
          <div className="flex flex-wrap gap-2">
            {selectedMolecules.map((mol, index) => {
              const colors = ['bg-violet-100 text-violet-800', 'bg-green-100 text-green-800', 'bg-orange-100 text-orange-800', 'bg-blue-100 text-blue-800'];
              return (
                <div key={mol.id} className={`flex items-center gap-2 px-3 py-2 rounded-md ${colors[index]}`}>
                  <span className="font-medium">{mol.name}</span>
                  <button onClick={() => removeMolecule(mol.id)} className="hover:opacity-70">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        {selectedMolecules.length >= 2 ? (
          <>
            {/* Radar Chart */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Profils Radar Superposés</h2>
              <div style={{ height: '500px' }}>
                <Radar data={radarData} options={radarOptions} />
              </div>
            </Card>

            {/* Tableau comparatif */}
            <Card className="p-6 mb-8 overflow-x-auto">
              <h2 className="text-xl font-bold mb-4">Tableau Comparatif Détaillé</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-bold">Propriété</th>
                    {selectedMolecules.map(mol => (
                      <th key={mol.id} className="text-left p-3 font-bold">{mol.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-muted/20">
                    <td className="p-3 font-medium">Formule chimique</td>
                    {selectedMolecules.map(mol => (
                      <td key={mol.id} className="p-3">{mol.chemicalFormula || 'N/A'}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Famille chimique</td>
                    {selectedMolecules.map(mol => (
                      <td key={mol.id} className="p-3">{mol.chemicalFamily || 'N/A'}</td>
                    ))}
                  </tr>
                  <tr className="border-b bg-muted/20">
                    <td className="p-3 font-medium">Profil olfactif</td>
                    {selectedMolecules.map(mol => (
                      <td key={mol.id} className="p-3 text-sm">{mol.olfactiveProfile?.substring(0, 60)}...</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Intensité</td>
                    {selectedMolecules.map(mol => (
                      <td key={mol.id} className="p-3">{mol.radarIntensity || 50}/100</td>
                    ))}
                  </tr>
                  <tr className="border-b bg-muted/20">
                    <td className="p-3 font-medium">Fraîcheur</td>
                    {selectedMolecules.map(mol => (
                      <td key={mol.id} className="p-3">{mol.radarFreshness || 50}/100</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Chaleur</td>
                    {selectedMolecules.map(mol => (
                      <td key={mol.id} className="p-3">{mol.radarWarmth || 50}/100</td>
                    ))}
                  </tr>
                  <tr className="border-b bg-muted/20">
                    <td className="p-3 font-medium">Douceur</td>
                    {selectedMolecules.map(mol => (
                      <td key={mol.id} className="p-3">{mol.radarSweetness || 50}/100</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Épices</td>
                    {selectedMolecules.map(mol => (
                      <td key={mol.id} className="p-3">{mol.radarSpiciness || 50}/100</td>
                    ))}
                  </tr>
                  <tr className="border-b bg-muted/20">
                    <td className="p-3 font-medium">Terreux</td>
                    {selectedMolecules.map(mol => (
                      <td key={mol.id} className="p-3">{mol.radarEarthiness || 50}/100</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Concentration recommandée</td>
                    {selectedMolecules.map(mol => (
                      <td key={mol.id} className="p-3">{mol.concentration || 'N/A'}</td>
                    ))}
                  </tr>
                  <tr className="border-b bg-muted/20">
                    <td className="p-3 font-medium">Origine</td>
                    {selectedMolecules.map(mol => (
                      <td key={mol.id} className="p-3">{mol.origin || 'N/A'}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </Card>

            {/* Similarité olfactive */}
            {selectedMolecules.length === 2 && (
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Similarité Olfactive</h2>
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {calculateSimilarity(selectedMolecules[0], selectedMolecules[1])}%
                  </div>
                  <p className="text-muted-foreground">
                    Distance euclidienne calculée sur les 6 axes radar
                  </p>
                  <div className="mt-4 text-sm text-muted-foreground">
                    {calculateSimilarity(selectedMolecules[0], selectedMolecules[1]) > 80 && '🟢 Profils très similaires - Substitution possible'}
                    {calculateSimilarity(selectedMolecules[0], selectedMolecules[1]) >= 60 && calculateSimilarity(selectedMolecules[0], selectedMolecules[1]) <= 80 && '🟡 Profils modérément similaires - Complémentarité intéressante'}
                    {calculateSimilarity(selectedMolecules[0], selectedMolecules[1]) < 60 && '🔴 Profils distincts - Contraste marqué'}
                  </div>
                </div>
              </Card>
            )}

            {/* Export */}
            <div className="flex justify-center">
              <Button className="btn-enhanced" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Exporter en PDF
              </Button>
            </div>
          </>
        ) : (
          <Card className="p-12 text-center">
            <GitCompare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Sélectionnez au moins 2 molécules</h3>
            <p className="text-muted-foreground">
              Choisissez 2 à 4 molécules dans le menu déroulant ci-dessus pour commencer la comparaison.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
