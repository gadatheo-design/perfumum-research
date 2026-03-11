import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { BarChart3, X } from 'lucide-react';

interface RadarData {
  intensity: number;
  freshness: number;
  warmth: number;
  sweetness: number;
  spiciness: number;
  earthiness: number;
}

interface Accord {
  id: string;
  nom: string;
  radarData: RadarData;
  famille: string;
  profil: string;
  color: string; // Couleur pour le radar
}

interface ComparateurAccordsMossiProps {
  accords: Accord[];
  maxSelection?: number;
}

const RADAR_COLORS = [
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Green
];

const AXES_LABELS = [
  { key: 'intensity', label: 'Intensité' },
  { key: 'freshness', label: 'Fraîcheur' },
  { key: 'warmth', label: 'Chaleur' },
  { key: 'sweetness', label: 'Douceur' },
  { key: 'spiciness', label: 'Épices' },
  { key: 'earthiness', label: 'Terreux' },
];

export function ComparateurAccordsMossi({ accords, maxSelection = 3 }: ComparateurAccordsMossiProps) {
  const [selectedAccords, setSelectedAccords] = useState<string[]>([]);

  const handleToggleAccord = (accordId: string) => {
    if (selectedAccords.includes(accordId)) {
      setSelectedAccords(selectedAccords.filter(id => id !== accordId));
    } else if (selectedAccords.length < maxSelection) {
      setSelectedAccords([...selectedAccords, accordId]);
    }
  };

  const handleClearSelection = () => {
    setSelectedAccords([]);
  };

  const selectedAccordsData = accords.filter(a => selectedAccords.includes(a.id));

  return (
    <div className="space-y-6">
      <Card className="border-2 border-amber-300">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Comparateur d'Accords Mossi
              </CardTitle>
              <CardDescription className="mt-2">
                Sélectionnez 2 à {maxSelection} accords pour comparer leurs profils olfactifs
              </CardDescription>
            </div>
            {selectedAccords.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearSelection}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Réinitialiser
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Sélection des accords */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {accords.map((accord) => {
              const isSelected = selectedAccords.includes(accord.id);
              const isDisabled = !isSelected && selectedAccords.length >= maxSelection;
              
              return (
                <div
                  key={accord.id}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${isSelected ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-stone-200 hover:border-amber-300'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => !isDisabled && handleToggleAccord(accord.id)}
                >
                  <div className="flex items-start gap-2">
                    <Checkbox 
                      checked={isSelected}
                      disabled={isDisabled}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-stone-900 truncate">
                        {accord.nom}
                      </p>
                      <p className="text-xs text-stone-600 mt-1 truncate">
                        {accord.famille}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message si pas assez de sélection */}
          {selectedAccords.length < 2 && (
            <div className="text-center py-8 text-stone-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Sélectionnez au moins 2 accords pour commencer la comparaison</p>
            </div>
          )}

          {/* Radar superposé */}
          {selectedAccords.length >= 2 && (
            <>
              <Separator className="my-6" />
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Radar SVG */}
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">
                    Profils Radar Superposés
                  </h3>
                  <HexagonalRadarComparison 
                    accordsData={selectedAccordsData}
                    colors={RADAR_COLORS}
                    size={320}
                  />
                  
                  {/* Légende */}
                  <div className="flex flex-wrap gap-3 mt-6 justify-center">
                    {selectedAccordsData.map((accord, idx) => (
                      <Badge 
                        key={accord.id}
                        className="text-sm px-3 py-1"
                        style={{ 
                          backgroundColor: RADAR_COLORS[idx],
                          color: 'white'
                        }}
                      >
                        {accord.nom}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tableau comparatif */}
                <div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">
                    Tableau Comparatif
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-stone-300">
                          <th className="text-left py-2 px-3 font-semibold text-stone-700">
                            Axe
                          </th>
                          {selectedAccordsData.map((accord, idx) => (
                            <th 
                              key={accord.id}
                              className="text-center py-2 px-3 font-semibold"
                              style={{ color: RADAR_COLORS[idx] }}
                            >
                              {accord.nom}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {AXES_LABELS.map((axis) => (
                          <tr key={axis.key} className="border-b border-stone-200">
                            <td className="py-2 px-3 font-medium text-stone-700">
                              {axis.label}
                            </td>
                            {selectedAccordsData.map((accord) => {
                              const value = accord.radarData[axis.key as keyof RadarData];
                              return (
                                <td key={accord.id} className="text-center py-2 px-3">
                                  <span className="font-mono font-semibold text-stone-900">
                                    {value}
                                  </span>
                                  <span className="text-stone-500 text-xs ml-1">/100</span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Profils olfactifs */}
                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold text-stone-900">Profils Olfactifs</h4>
                    {selectedAccordsData.map((accord, idx) => (
                      <div 
                        key={accord.id}
                        className="p-3 rounded-lg border"
                        style={{ borderColor: RADAR_COLORS[idx] }}
                      >
                        <p className="font-medium text-sm" style={{ color: RADAR_COLORS[idx] }}>
                          {accord.nom}
                        </p>
                        <p className="text-sm text-stone-600 italic mt-1">
                          "{accord.profil}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Composant radar hexagonal avec plusieurs accords superposés
 */
interface HexagonalRadarComparisonProps {
  accordsData: Accord[];
  colors: string[];
  size?: number;
}

function HexagonalRadarComparison({ 
  accordsData, 
  colors,
  size = 300 
}: HexagonalRadarComparisonProps) {
  const center = size / 2;
  const radius = size / 2 - 40;
  const angleStep = (Math.PI * 2) / 6;

  // Calculer les points du polygone pour chaque accord
  const getPolygonPoints = (radarData: RadarData) => {
    const values = [
      radarData.intensity,
      radarData.freshness,
      radarData.warmth,
      radarData.sweetness,
      radarData.spiciness,
      radarData.earthiness,
    ];

    return values.map((value, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const r = (value / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  // Points pour les axes
  const axisPoints = AXES_LABELS.map((_, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const labelX = center + (radius + 25) * Math.cos(angle);
    const labelY = center + (radius + 25) * Math.sin(angle);
    return { x, y, labelX, labelY, label: AXES_LABELS[i].label };
  });

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Grille hexagonale de fond */}
      {[20, 40, 60, 80, 100].map((level) => {
        const points = Array.from({ length: 6 }, (_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const r = (level / 100) * radius;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ');

        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        );
      })}

      {/* Axes */}
      {axisPoints.map((point, i) => (
        <g key={i}>
          <line
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="#d1d5db"
            strokeWidth="1"
          />
          <text
            x={point.labelX}
            y={point.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-medium fill-stone-700"
          >
            {point.label}
          </text>
        </g>
      ))}

      {/* Polygones des accords superposés */}
      {accordsData.map((accord, idx) => (
        <g key={accord.id}>
          <polygon
            points={getPolygonPoints(accord.radarData)}
            fill={colors[idx]}
            fillOpacity="0.2"
            stroke={colors[idx]}
            strokeWidth="2.5"
          />
          {/* Points sur les sommets */}
          {Object.values(accord.radarData).map((value, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const r = (value / 100) * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill={colors[idx]}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}
