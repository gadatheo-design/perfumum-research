// @ts-nocheck
import { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { trpc } from '../lib/trpc';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

import { X, Download, GitCompare } from 'lucide-react';

// Composant Radar SVG personnalisé
function RadarChart({ data }: { data: { labels: string[]; datasets: any[] } }) {
  const size = 400;
  const center = size / 2;
  const radius = size / 2 - 60;
  const numAxes = data.labels.length;

  // Calculer les points pour chaque axe
  const getPoint = (value: number, axisIndex: number) => {
    const angle = (Math.PI * 2 * axisIndex) / numAxes - Math.PI / 2;
    const distance = (value / 100) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle)
    };
  };

  // Points des labels
  const labelPoints = data.labels.map((_, i) => {
    const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
    const distance = radius + 40;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle)
    };
  });

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grilles concentriques */}
      {[20, 40, 60, 80, 100].map(level => (
        <polygon
          key={level}
          points={Array.from({ length: numAxes }).map((_, i) => {
            const p = getPoint(level, i);
            return `${p.x},${p.y}`;
          }).join(' ')}
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
        />
      ))}

      {/* Axes */}
      {data.labels.map((_, i) => {
        const end = getPoint(100, i);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={end.x}
            y2={end.y}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="1"
          />
        );
      })}

      {/* Datasets (molécules) */}
      {data.datasets.map((dataset, datasetIndex) => {
        const points = dataset.data.map((value: number, i: number) => {
          const p = getPoint(value, i);
          return `${p.x},${p.y}`;
        }).join(' ');

        return (
          <g key={datasetIndex}>
            <polygon
              points={points}
              fill={dataset.backgroundColor}
              stroke={dataset.borderColor}
              strokeWidth="2"
            />
            {dataset.data.map((value: number, i: number) => {
              const p = getPoint(value, i);
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill={dataset.borderColor}
                  stroke="#fff"
                  strokeWidth="2"
                />
              );
            })}
          </g>
        );
      })}

      {/* Labels */}
      {data.labels.map((label, i) => {
        const p = labelPoints[i];
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-bold fill-foreground"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export default function CompareMoleculesAdvanced() {
  const [selectedMoleculeIds, setSelectedMoleculeIds] = useState<number[]>([]);
  const { data: allMolecules } = trpc.molecules.list.useQuery();

  // Filtrer les molécules sélectionnées
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
  const radarData = useMemo(() => ({
    labels: ['Intensité', 'Fraîcheur', 'Chaleur', 'Douceur', 'Épices', 'Terreux'],
    datasets: selectedMolecules.map((mol, index) => {
      const colors = [
        'rgba(139, 92, 246, 0.3)',   // violet
        'rgba(34, 197, 94, 0.3)',    // vert
        'rgba(249, 115, 22, 0.3)',   // orange
        'rgba(59, 130, 246, 0.3)'    // bleu
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
        borderColor: borderColors[index]
      };
    })
  }), [selectedMolecules]);

  // Calculer la similarité olfactive
  const calculateSimilarity = (mol1: any, mol2: any) => {
    const axes = ['radarIntensity', 'radarFreshness', 'radarWarmth', 'radarSweetness', 'radarSpiciness', 'radarEarthiness'];
    const distance = Math.sqrt(
      axes.reduce((sum, axis) => {
        const diff = (mol1[axis] || 50) - (mol2[axis] || 50);
        return sum + diff * diff;
      }, 0)
    );
    return Math.max(0, 100 - (distance / Math.sqrt(6 * 100 * 100)) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Breadcrumbs />
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GitCompare className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">COMPARATEUR MOLÉCULES AVANCÉ</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comparez jusqu'à 4 molécules simultanément : profils radar superposés, propriétés chimiques, synergies et similarité olfactive calculée.
          </p>
        </div>

        {/* Sélection des molécules */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">SÉLECTIONNER DES MOLÉCULES (2-4)</h2>
            {selectedMoleculeIds.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAll}>
                Tout effacer
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            {selectedMolecules.map((mol, index) => {
              const colors = ['bg-violet-500', 'bg-green-500', 'bg-orange-500', 'bg-blue-500'];
              return (
                <div key={mol.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors[index]} text-white`}>
                  <span className="font-medium">{mol.name}</span>
                  <button onClick={() => removeMolecule(mol.id)} className="hover:bg-white/20 rounded-full p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {selectedMoleculeIds.length < 4 && (
            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
              <p className="text-sm text-muted-foreground mb-3">Cliquez pour ajouter (max 4) :</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allMolecules?.filter(m => !selectedMoleculeIds.includes(m.id)).map(mol => (
                  <button
                    key={mol.id}
                    onClick={() => addMolecule(mol.id.toString())}
                    className="text-left px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                  >
                    {mol.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Affichage des résultats */}
        {selectedMolecules.length >= 2 ? (
          <div className="space-y-8">
            {/* Radar Chart */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6 text-center">PROFILS RADAR SUPERPOSÉS</h2>
              <RadarChart data={radarData} />
              
              {/* Légende */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {radarData.datasets.map((dataset, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: dataset.borderColor }}></div>
                    <span className="text-sm font-medium">{dataset.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tableau comparatif */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">TABLEAU COMPARATIF DÉTAILLÉ</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left p-3 font-bold">Propriété</th>
                      {selectedMolecules.map((mol, index) => {
                        const colors = ['text-violet-500', 'text-green-500', 'text-orange-500', 'text-blue-500'];
                        return (
                          <th key={mol.id} className={`text-left p-3 font-bold ${colors[index]}`}>
                            {mol.name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="p-3 font-medium">Profil Olfactif</td>
                      {selectedMolecules.map(mol => (
                        <td key={mol.id} className="p-3 text-sm">{mol.olfactiveProfile || 'N/A'}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-3 font-medium">Intensité</td>
                      {selectedMolecules.map(mol => (
                        <td key={mol.id} className="p-3">{mol.radarIntensity || 50}/100</td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-3 font-medium">Fraîcheur</td>
                      {selectedMolecules.map(mol => (
                        <td key={mol.id} className="p-3">{mol.radarFreshness || 50}/100</td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-3 font-medium">Chaleur</td>
                      {selectedMolecules.map(mol => (
                        <td key={mol.id} className="p-3">{mol.radarWarmth || 50}/100</td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-3 font-medium">Douceur</td>
                      {selectedMolecules.map(mol => (
                        <td key={mol.id} className="p-3">{mol.radarSweetness || 50}/100</td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-3 font-medium">Épices</td>
                      {selectedMolecules.map(mol => (
                        <td key={mol.id} className="p-3">{mol.radarSpiciness || 50}/100</td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-3 font-medium">Terreux</td>
                      {selectedMolecules.map(mol => (
                        <td key={mol.id} className="p-3">{mol.radarEarthiness || 50}/100</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Similarité olfactive */}
            {selectedMolecules.length === 2 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">SIMILARITÉ OLFACTIVE</h2>
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {calculateSimilarity(selectedMolecules[0], selectedMolecules[1])}%
                  </div>
                  <p className="text-muted-foreground">
                    {calculateSimilarity(selectedMolecules[0], selectedMolecules[1]) > 80 ? '🟢 Très similaires' :
                     calculateSimilarity(selectedMolecules[0], selectedMolecules[1]) > 60 ? '🟡 Complémentaires' :
                     '🔴 Profils distincts'}
                  </p>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <GitCompare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
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
