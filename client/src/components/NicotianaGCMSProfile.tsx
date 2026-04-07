import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Beaker, TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface GCMSCompound {
  name: string;
  retentionTime: number; // minutes
  concentration: number; // percentage
  category: 'alkaloid' | 'terpene' | 'phenolic' | 'volatile' | 'other';
}

interface SpeciesGCMSData {
  speciesId: string;
  latinName: string;
  compounds: GCMSCompound[];
  totalAlkaloids: number;
  totalTerpenes: number;
  totalPhenolics: number;
  analysisDate?: string;
  analysisMethod?: string;
  notes?: string;
}

// Données GC-MS simulées pour les espèces Nicotiana
export const nicotianaGCMSData: Record<string, SpeciesGCMSData> = {
  'n-rupicola': {
    speciesId: 'n-rupicola',
    latinName: 'Nicotiana rupicola',
    compounds: [
      { name: 'Nicotine', retentionTime: 12.5, concentration: 0.8, category: 'alkaloid' },
      { name: 'Nornicotine', retentionTime: 11.2, concentration: 0.15, category: 'alkaloid' },
      { name: 'Limonene', retentionTime: 8.3, concentration: 2.1, category: 'terpene' },
      { name: 'α-Pinene', retentionTime: 7.1, concentration: 1.8, category: 'terpene' },
      { name: 'β-Myrcene', retentionTime: 8.9, concentration: 1.2, category: 'terpene' },
      { name: 'Linalool', retentionTime: 10.2, concentration: 0.9, category: 'volatile' },
      { name: 'Chlorogenic acid', retentionTime: 18.5, concentration: 0.6, category: 'phenolic' },
    ],
    totalAlkaloids: 0.95,
    totalTerpenes: 5.1,
    totalPhenolics: 0.6,
    analysisMethod: 'GC-FID with flame ionization detector',
    notes: 'Terpene-rich profile with low nicotine content'
  },

  'n-knightiana': {
    speciesId: 'n-knightiana',
    latinName: 'Nicotiana knightiana',
    compounds: [
      { name: 'Nicotine', retentionTime: 12.5, concentration: 1.2, category: 'alkaloid' },
      { name: 'Nornicotine', retentionTime: 11.2, concentration: 0.2, category: 'alkaloid' },
      { name: 'Geraniol', retentionTime: 11.8, concentration: 2.5, category: 'volatile' },
      { name: 'Limonene', retentionTime: 8.3, concentration: 1.8, category: 'terpene' },
      { name: 'α-Pinene', retentionTime: 7.1, concentration: 1.5, category: 'terpene' },
      { name: 'Linalool', retentionTime: 10.2, concentration: 1.3, category: 'volatile' },
      { name: 'Chlorogenic acid', retentionTime: 18.5, concentration: 0.7, category: 'phenolic' },
      { name: 'Ferulic acid', retentionTime: 19.2, concentration: 0.4, category: 'phenolic' },
    ],
    totalAlkaloids: 1.4,
    totalTerpenes: 3.3,
    totalPhenolics: 1.1,
    analysisMethod: 'GC-MS with electron impact ionization',
    notes: 'Geraniol-rich aromatic profile'
  },

  'n-cordifolia': {
    speciesId: 'n-cordifolia',
    latinName: 'Nicotiana cordifolia',
    compounds: [
      { name: 'Nicotine', retentionTime: 12.5, concentration: 0.9, category: 'alkaloid' },
      { name: 'Nornicotine', retentionTime: 11.2, concentration: 0.18, category: 'alkaloid' },
      { name: 'β-Caryophyllene', retentionTime: 13.5, concentration: 2.2, category: 'terpene' },
      { name: 'α-Humulene', retentionTime: 14.1, concentration: 1.1, category: 'terpene' },
      { name: 'Limonene', retentionTime: 8.3, concentration: 1.5, category: 'terpene' },
      { name: 'Myrcene', retentionTime: 8.9, concentration: 1.3, category: 'terpene' },
      { name: 'Chlorogenic acid', retentionTime: 18.5, concentration: 0.8, category: 'phenolic' },
      { name: 'Quercetin', retentionTime: 21.3, concentration: 0.5, category: 'phenolic' },
    ],
    totalAlkaloids: 1.08,
    totalTerpenes: 6.1,
    totalPhenolics: 1.3,
    analysisMethod: 'GC-FID with temperature programming',
    notes: 'Sesquiterpene-rich island endemic profile'
  },

  'n-solanifolia': {
    speciesId: 'n-solanifolia',
    latinName: 'Nicotiana solanifolia',
    compounds: [
      { name: 'Nicotine', retentionTime: 12.5, concentration: 1.4, category: 'alkaloid' },
      { name: 'Nornicotine', retentionTime: 11.2, concentration: 0.25, category: 'alkaloid' },
      { name: 'Linalool', retentionTime: 10.2, concentration: 2.8, category: 'volatile' },
      { name: 'Geraniol', retentionTime: 11.8, concentration: 1.6, category: 'volatile' },
      { name: 'Limonene', retentionTime: 8.3, concentration: 1.9, category: 'terpene' },
      { name: 'α-Pinene', retentionTime: 7.1, concentration: 1.4, category: 'terpene' },
      { name: 'Chlorogenic acid', retentionTime: 18.5, concentration: 0.9, category: 'phenolic' },
      { name: 'Ferulic acid', retentionTime: 19.2, concentration: 0.6, category: 'phenolic' },
    ],
    totalAlkaloids: 1.65,
    totalTerpenes: 4.3,
    totalPhenolics: 1.5,
    analysisMethod: 'GC-MS with selective ion monitoring',
    notes: 'Linalool-rich aromatic profile with moderate nicotine'
  },

  'n-tabacum': {
    speciesId: 'n-tabacum',
    latinName: 'Nicotiana tabacum',
    compounds: [
      { name: 'Nicotine', retentionTime: 12.5, concentration: 2.5, category: 'alkaloid' },
      { name: 'Nornicotine', retentionTime: 11.2, concentration: 0.4, category: 'alkaloid' },
      { name: 'Solanone', retentionTime: 15.8, concentration: 0.8, category: 'volatile' },
      { name: 'Limonene', retentionTime: 8.3, concentration: 1.2, category: 'terpene' },
      { name: 'α-Pinene', retentionTime: 7.1, concentration: 1.0, category: 'terpene' },
      { name: 'β-Myrcene', retentionTime: 8.9, concentration: 0.8, category: 'terpene' },
      { name: 'Linalool', retentionTime: 10.2, concentration: 0.7, category: 'volatile' },
      { name: 'Geraniol', retentionTime: 11.8, concentration: 0.5, category: 'volatile' },
      { name: 'Chlorogenic acid', retentionTime: 18.5, concentration: 1.1, category: 'phenolic' },
      { name: 'Caffeic acid', retentionTime: 17.9, concentration: 0.8, category: 'phenolic' },
    ],
    totalAlkaloids: 2.9,
    totalTerpenes: 3.0,
    totalPhenolics: 1.9,
    analysisMethod: 'GC-FID with curing simulation',
    notes: 'Complex profile reflecting cultivation and curing conditions'
  },

  'n-rustica': {
    speciesId: 'n-rustica',
    latinName: 'Nicotiana rustica',
    compounds: [
      { name: 'Nicotine', retentionTime: 12.5, concentration: 8.5, category: 'alkaloid' },
      { name: 'Nornicotine', retentionTime: 11.2, concentration: 0.8, category: 'alkaloid' },
      { name: 'Solanone', retentionTime: 15.8, concentration: 1.2, category: 'volatile' },
      { name: 'Limonene', retentionTime: 8.3, concentration: 0.9, category: 'terpene' },
      { name: 'α-Pinene', retentionTime: 7.1, concentration: 0.7, category: 'terpene' },
      { name: 'Linalool', retentionTime: 10.2, concentration: 0.6, category: 'volatile' },
      { name: 'Chlorogenic acid', retentionTime: 18.5, concentration: 0.7, category: 'phenolic' },
    ],
    totalAlkaloids: 9.3,
    totalTerpenes: 1.6,
    totalPhenolics: 0.7,
    analysisMethod: 'GC-FID with high nicotine reference',
    notes: 'Extremely high nicotine content, lowest terpene profile'
  },

  'n-glauca': {
    speciesId: 'n-glauca',
    latinName: 'Nicotiana glauca',
    compounds: [
      { name: 'Nicotine', retentionTime: 12.5, concentration: 0.2, category: 'alkaloid' },
      { name: 'Nornicotine', retentionTime: 11.2, concentration: 0.05, category: 'alkaloid' },
      { name: 'Anabasine', retentionTime: 13.2, concentration: 3.5, category: 'alkaloid' },
      { name: 'Limonene', retentionTime: 8.3, concentration: 1.4, category: 'terpene' },
      { name: 'α-Pinene', retentionTime: 7.1, concentration: 1.2, category: 'terpene' },
      { name: 'β-Myrcene', retentionTime: 8.9, concentration: 0.9, category: 'terpene' },
      { name: 'Chlorogenic acid', retentionTime: 18.5, concentration: 0.5, category: 'phenolic' },
    ],
    totalAlkaloids: 3.75,
    totalTerpenes: 3.5,
    totalPhenolics: 0.5,
    analysisMethod: 'GC-MS with anabasine standard',
    notes: 'High anabasine, low nicotine - toxic profile'
  },

  'n-alata': {
    speciesId: 'n-alata',
    latinName: 'Nicotiana alata',
    compounds: [
      { name: 'Nicotine', retentionTime: 12.5, concentration: 0.5, category: 'alkaloid' },
      { name: 'Nornicotine', retentionTime: 11.2, concentration: 0.1, category: 'alkaloid' },
      { name: 'Linalool', retentionTime: 10.2, concentration: 3.2, category: 'volatile' },
      { name: 'Geraniol', retentionTime: 11.8, concentration: 2.1, category: 'volatile' },
      { name: 'Nerolidol', retentionTime: 14.5, concentration: 1.5, category: 'volatile' },
      { name: 'Limonene', retentionTime: 8.3, concentration: 1.1, category: 'terpene' },
      { name: 'α-Pinene', retentionTime: 7.1, concentration: 0.8, category: 'terpene' },
      { name: 'Chlorogenic acid', retentionTime: 18.5, concentration: 0.6, category: 'phenolic' },
    ],
    totalAlkaloids: 0.6,
    totalTerpenes: 1.9,
    totalPhenolics: 0.6,
    analysisMethod: 'GC-FID with fragrance standard',
    notes: 'Highly fragrant profile, ornamental variety'
  }
};

interface NicotianaGCMSProfileProps {
  speciesId: string;
  showComparison?: boolean;
  comparisonSpeciesIds?: string[];
}

export function NicotianaGCMSProfile({ 
  speciesId, 
  showComparison = false, 
  comparisonSpeciesIds = [] 
}: NicotianaGCMSProfileProps) {
  const data = nicotianaGCMSData[speciesId];
  const comparisonData = comparisonSpeciesIds
    .map(id => nicotianaGCMSData[id])
    .filter(Boolean);

  if (!data) {
    return (
      <div className="text-center text-muted-foreground">
        Données GC-MS non disponibles pour cette espèce
      </div>
    );
  }

  // Données pour le graphique chromatographique
  const chromatogramData = data.compounds.map(compound => ({
    name: compound.name,
    retentionTime: compound.retentionTime,
    concentration: compound.concentration,
    category: compound.category
  }));

  // Données pour le graphique radar de composition
  const compositionData = [
    { category: 'Alcaloïdes', value: data.totalAlkaloids },
    { category: 'Terpenoïdes', value: data.totalTerpenes },
    { category: 'Phénoliques', value: data.totalPhenolics }
  ];

  // Données pour la comparaison
  const comparisonChartData = [
    {
      name: 'Alcaloïdes',
      [data.latinName]: data.totalAlkaloids,
      ...Object.fromEntries(comparisonData.map(d => [d.latinName, d.totalAlkaloids]))
    },
    {
      name: 'Terpenoïdes',
      [data.latinName]: data.totalTerpenes,
      ...Object.fromEntries(comparisonData.map(d => [d.latinName, d.totalTerpenes]))
    },
    {
      name: 'Phénoliques',
      [data.latinName]: data.totalPhenolics,
      ...Object.fromEntries(comparisonData.map(d => [d.latinName, d.totalPhenolics]))
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'alkaloid': '#ef4444',
      'terpene': '#3b82f6',
      'phenolic': '#8b5cf6',
      'volatile': '#ec4899',
      'other': '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'alkaloid': 'Alcaloïde',
      'terpene': 'Terpenoïde',
      'phenolic': 'Phénolique',
      'volatile': 'Volatil',
      'other': 'Autre'
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="chromatogram" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chromatogram">Chromatogramme</TabsTrigger>
          <TabsTrigger value="composition">Composition</TabsTrigger>
          <TabsTrigger value="compounds">Composés</TabsTrigger>
          {showComparison && <TabsTrigger value="comparison">Comparaison</TabsTrigger>}
        </TabsList>

        {/* Chromatogram Tab */}
        <TabsContent value="chromatogram" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Chromatogramme GC-MS
              </CardTitle>
              <CardDescription>
                Profil chromatographique de {data.latinName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chromatogramData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="retentionTime" 
                    label={{ value: 'Temps de rétention (min)', position: 'insideBottomRight', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Concentration (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(2)}%`}
                    labelFormatter={(label: number) => `${label.toFixed(2)} min`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="concentration" 
                    stroke="#3b82f6" 
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Concentration"
                  />
                </LineChart>
              </ResponsiveContainer>
              {data.analysisMethod && (
                <p className="text-sm text-muted-foreground mt-4">
                  <strong>Méthode :</strong> {data.analysisMethod}
                </p>
              )}
              {data.notes && (
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Notes :</strong> {data.notes}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Composition Tab */}
        <TabsContent value="composition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Composition Chimique
              </CardTitle>
              <CardDescription>
                Distribution des classes chimiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={compositionData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis />
                  <Radar 
                    name={data.latinName} 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compounds Tab */}
        <TabsContent value="compounds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Composés Détectés</CardTitle>
              <CardDescription>
                Liste complète des composés identifiés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.compounds.map((compound, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge style={{ backgroundColor: getCategoryColor(compound.category) }}>
                          {getCategoryLabel(compound.category)}
                        </Badge>
                        <span className="font-medium">{compound.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Temps de rétention: {compound.retentionTime} min
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">{compound.concentration.toFixed(2)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        {showComparison && comparisonData.length > 0 && (
          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Comparaison Chimique
                </CardTitle>
                <CardDescription>
                  Comparaison des profils chimiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={comparisonChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Concentration (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                    <Legend />
                    <Bar dataKey={data.latinName} fill="#3b82f6" />
                    {comparisonData.map((comp, idx) => (
                      <Bar key={idx} dataKey={comp.latinName} fill={['#ef4444', '#8b5cf6', '#ec4899', '#f59e0b'][idx % 4]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
