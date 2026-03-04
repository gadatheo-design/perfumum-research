// @ts-nocheck
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Wind, Thermometer, TrendingUp, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Données de volatilité par tabac
const VOLATILITY_DATA = {
  burley: {
    name: "Burley",
    color: "bg-amber-100 border-amber-300",
    textColor: "text-amber-900",
    profile: "Pyrazines dominantes (chocolat, fumé, grillé)",
    data: [
      { temp: 80, terpenes: 20, aldehydes: 30, lactones: 10, pyrazines: 5, phenols: 5 },
      { temp: 100, terpenes: 15, aldehydes: 25, lactones: 15, pyrazines: 15, phenols: 10 },
      { temp: 120, terpenes: 10, aldehydes: 20, lactones: 20, pyrazines: 40, phenols: 15 },
      { temp: 140, terpenes: 5, aldehydes: 15, lactones: 15, pyrazines: 70, phenols: 25 },
      { temp: 160, terpenes: 2, aldehydes: 10, lactones: 10, pyrazines: 85, phenols: 35 },
      { temp: 180, terpenes: 1, aldehydes: 5, lactones: 5, pyrazines: 90, phenols: 40 },
    ],
  },
  virginiaGold: {
    name: "Virginia Gold",
    color: "bg-yellow-100 border-yellow-300",
    textColor: "text-yellow-900",
    profile: "Lactones stables (miel, caramel, vanille)",
    data: [
      { temp: 80, terpenes: 25, aldehydes: 40, lactones: 30, pyrazines: 2, phenols: 3 },
      { temp: 100, terpenes: 20, aldehydes: 35, lactones: 60, pyrazines: 5, phenols: 5 },
      { temp: 120, terpenes: 15, aldehydes: 30, lactones: 80, pyrazines: 10, phenols: 8 },
      { temp: 140, terpenes: 10, aldehydes: 25, lactones: 85, pyrazines: 15, phenols: 12 },
      { temp: 160, terpenes: 5, aldehydes: 15, lactones: 60, pyrazines: 25, phenols: 20 },
      { temp: 180, terpenes: 2, aldehydes: 10, lactones: 30, pyrazines: 35, phenols: 30 },
    ],
  },
  samsoun: {
    name: "Samsoun",
    color: "bg-purple-100 border-purple-300",
    textColor: "text-purple-900",
    profile: "Phénols + Terpènes (résine, encens, baume)",
    data: [
      { temp: 80, terpenes: 40, aldehydes: 20, lactones: 10, pyrazines: 5, phenols: 15 },
      { temp: 100, terpenes: 50, aldehydes: 18, lactones: 12, pyrazines: 8, phenols: 25 },
      { temp: 120, terpenes: 55, aldehydes: 15, lactones: 15, pyrazines: 12, phenols: 45 },
      { temp: 140, terpenes: 50, aldehydes: 12, lactones: 18, pyrazines: 18, phenols: 65 },
      { temp: 160, terpenes: 40, aldehydes: 10, lactones: 15, pyrazines: 25, phenols: 80 },
      { temp: 180, terpenes: 30, aldehydes: 8, lactones: 10, pyrazines: 30, phenols: 85 },
    ],
  },
  krumovgrad: {
    name: "Krumovgrad",
    color: "bg-pink-100 border-pink-300",
    textColor: "text-pink-900",
    profile: "Aldéhydes + Lactones (floral, miel, fruité)",
    data: [
      { temp: 80, terpenes: 30, aldehydes: 50, lactones: 40, pyrazines: 3, phenols: 5 },
      { temp: 100, terpenes: 25, aldehydes: 60, lactones: 65, pyrazines: 5, phenols: 7 },
      { temp: 120, terpenes: 20, aldehydes: 70, lactones: 80, pyrazines: 8, phenols: 10 },
      { temp: 140, terpenes: 15, aldehydes: 65, lactones: 75, pyrazines: 12, phenols: 15 },
      { temp: 160, terpenes: 10, aldehydes: 40, lactones: 50, pyrazines: 20, phenols: 25 },
      { temp: 180, terpenes: 5, aldehydes: 25, lactones: 30, pyrazines: 30, phenols: 35 },
    ],
  },
  virginiaBright: {
    name: "Virginia Bright",
    color: "bg-green-100 border-green-300",
    textColor: "text-green-900",
    profile: "Aldéhydes dominantes (foin, herbacé lumineux)",
    data: [
      { temp: 80, terpenes: 35, aldehydes: 70, lactones: 25, pyrazines: 2, phenols: 3 },
      { temp: 100, terpenes: 30, aldehydes: 85, lactones: 40, pyrazines: 4, phenols: 5 },
      { temp: 120, terpenes: 25, aldehydes: 80, lactones: 50, pyrazines: 7, phenols: 8 },
      { temp: 140, terpenes: 20, aldehydes: 60, lactones: 45, pyrazines: 12, phenols: 12 },
      { temp: 160, terpenes: 10, aldehydes: 35, lactones: 30, pyrazines: 20, phenols: 20 },
      { temp: 180, terpenes: 5, aldehydes: 20, lactones: 15, pyrazines: 30, phenols: 30 },
    ],
  },
  virginiaDeutscher: {
    name: "Virginia Deutscher",
    color: "bg-emerald-100 border-emerald-300",
    textColor: "text-emerald-900",
    profile: "Terpènes persistants (pin, boisé sec)",
    data: [
      { temp: 80, terpenes: 60, aldehydes: 40, lactones: 15, pyrazines: 3, phenols: 5 },
      { temp: 100, terpenes: 75, aldehydes: 45, lactones: 20, pyrazines: 5, phenols: 8 },
      { temp: 120, terpenes: 80, aldehydes: 40, lactones: 25, pyrazines: 8, phenols: 12 },
      { temp: 140, terpenes: 70, aldehydes: 30, lactones: 20, pyrazines: 12, phenols: 18 },
      { temp: 160, terpenes: 50, aldehydes: 20, lactones: 15, pyrazines: 18, phenols: 25 },
      { temp: 180, terpenes: 30, aldehydes: 15, lactones: 10, pyrazines: 25, phenols: 35 },
    ],
  },
  virginiaItalia: {
    name: "Virginia Italia",
    color: "bg-lime-100 border-lime-300",
    textColor: "text-lime-900",
    profile: "Aldéhydes + Lactones (herbacé méditerranéen)",
    data: [
      { temp: 80, terpenes: 30, aldehydes: 60, lactones: 30, pyrazines: 3, phenols: 5 },
      { temp: 100, terpenes: 28, aldehydes: 75, lactones: 45, pyrazines: 5, phenols: 7 },
      { temp: 120, terpenes: 25, aldehydes: 80, lactones: 60, pyrazines: 8, phenols: 10 },
      { temp: 140, terpenes: 20, aldehydes: 70, lactones: 65, pyrazines: 12, phenols: 15 },
      { temp: 160, terpenes: 12, aldehydes: 45, lactones: 40, pyrazines: 20, phenols: 22 },
      { temp: 180, terpenes: 8, aldehydes: 30, lactones: 25, pyrazines: 30, phenols: 30 },
    ],
  },
  virginiaOrange: {
    name: "Virginia Orange",
    color: "bg-orange-100 border-orange-300",
    textColor: "text-orange-900",
    profile: "Aldéhydes + Terpènes (agrumes, miel)",
    data: [
      { temp: 80, terpenes: 45, aldehydes: 75, lactones: 30, pyrazines: 2, phenols: 3 },
      { temp: 100, terpenes: 50, aldehydes: 85, lactones: 40, pyrazines: 4, phenols: 5 },
      { temp: 120, terpenes: 45, aldehydes: 80, lactones: 45, pyrazines: 7, phenols: 8 },
      { temp: 140, terpenes: 35, aldehydes: 60, lactones: 40, pyrazines: 12, phenols: 12 },
      { temp: 160, terpenes: 20, aldehydes: 35, lactones: 25, pyrazines: 20, phenols: 20 },
      { temp: 180, terpenes: 10, aldehydes: 20, lactones: 15, pyrazines: 30, phenols: 30 },
    ],
  },
};

export function CourbesVolatilite() {
  const [selectedTobacco, setSelectedTobacco] = useState<keyof typeof VOLATILITY_DATA>("burley");
  
  const currentData = VOLATILITY_DATA[selectedTobacco];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8 space-y-8">
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-cyan-600 border-2 border-cyan-700">
              <Wind className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-cyan-900">
                COURBES DE VOLATILITÉ
              </h1>
              <p className="text-muted-foreground mt-1">
                Profils de volatilité des terpènes en fonction de la température
              </p>
            </div>
          </div>
        </div>

        {/* Introduction Card */}
        <Card className="bg-cyan-50 border-2 border-cyan-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-bold text-cyan-900">Analyse de la Volatilité Thermique</h3>
                <p className="text-sm text-cyan-800 leading-relaxed">
                  Les courbes de volatilité montrent l'évolution de l'intensité des composés aromatiques en fonction 
                  de la température (80-180°C). Chaque famille de composés (terpènes, aldéhydes, lactones, pyrazines, phénols) 
                  présente un profil thermique caractéristique qui détermine les notes olfactives dominantes à chaque palier 
                  de température. Cette analyse permet d'optimiser les températures de travail pour obtenir les profils 
                  olfactifs souhaités.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tobacco Selector */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle>Sélection du Tabac</CardTitle>
                <CardDescription>
                  Choisissez une variété pour visualiser son profil de volatilité thermique
                </CardDescription>
              </div>
              <Select value={selectedTobacco} onValueChange={(value) => setSelectedTobacco(value as keyof typeof VOLATILITY_DATA)}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="burley">Burley</SelectItem>
                  <SelectItem value="virginiaGold">Virginia Gold</SelectItem>
                  <SelectItem value="samsoun">Samsoun</SelectItem>
                  <SelectItem value="krumovgrad">Krumovgrad</SelectItem>
                  <SelectItem value="virginiaBright">Virginia Bright</SelectItem>
                  <SelectItem value="virginiaDeutscher">Virginia Deutscher</SelectItem>
                  <SelectItem value="virginiaItalia">Virginia Italia</SelectItem>
                  <SelectItem value="virginiaOrange">Virginia Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Current Tobacco Profile */}
        <Card className={`border-2 ${currentData.color}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className={`text-2xl ${currentData.textColor}`}>
                  {currentData.name}
                </CardTitle>
                <CardDescription className={`${currentData.textColor} font-medium`}>
                  {currentData.profile}
                </CardDescription>
              </div>
              <Wind className={`h-8 w-8 ${currentData.textColor}`} />
            </div>
          </CardHeader>
        </Card>

        {/* Volatility Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-600" />
              Courbe de Volatilité : {currentData.name}
            </CardTitle>
            <CardDescription>
              Évolution de l'intensité des composés aromatiques en fonction de la température (80-180°C)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="temp" 
                    label={{ value: 'Température (°C)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Intensité', angle: -90, position: 'insideLeft' }}
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="terpenes" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Terpènes"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="aldehydes" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Aldéhydes"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lactones" 
                    stroke="#eab308" 
                    strokeWidth={2}
                    name="Lactones"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pyrazines" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    name="Pyrazines"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="phenols" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Phénols"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Legend Card */}
        <Card>
          <CardHeader>
            <CardTitle>Légende des Familles de Composés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="font-medium">Terpènes</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Composés légers, volatils à basse température. Notes vertes, pin, résine légère.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="font-medium">Aldéhydes</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Composés frais, herbacés. Notes foin, agrumes, floral.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="font-medium">Lactones</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Composés lactés, gourmands. Notes miel, caramel, vanille, coco.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="font-medium">Pyrazines</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Composés grillés, chocolatés. Notes fumé, caramel brûlé.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="font-medium">Phénols</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Composés fumés, résineux. Notes encens, baume, guaiacol.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperature Zones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg text-blue-900">Zone Basse</CardTitle>
              </div>
              <Badge variant="outline" className="bg-white w-fit">80-110°C</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-blue-800">
                <strong>Composés dominants :</strong> Terpènes, aldéhydes
              </p>
              <p className="text-sm text-blue-800">
                <strong>Profil olfactif :</strong> Frais, herbacé, fruité, lumineux
              </p>
              <p className="text-sm text-blue-800">
                <strong>Applications :</strong> Compositions hespéridées, notes vertes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-2 border-amber-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg text-amber-900">Zone Moyenne</CardTitle>
              </div>
              <Badge variant="outline" className="bg-white w-fit">110-140°C</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-amber-800">
                <strong>Composés dominants :</strong> Lactones, ionones
              </p>
              <p className="text-sm text-amber-800">
                <strong>Profil olfactif :</strong> Gourmand, floral, lacté, caramel
              </p>
              <p className="text-sm text-amber-800">
                <strong>Applications :</strong> Compositions florales, notes miellées
              </p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-2 border-red-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-600" />
                <CardTitle className="text-lg text-red-900">Zone Haute</CardTitle>
              </div>
              <Badge variant="outline" className="bg-white w-fit">140-180°C</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-red-800">
                <strong>Composés dominants :</strong> Pyrazines, phénols
              </p>
              <p className="text-sm text-red-800">
                <strong>Profil olfactif :</strong> Fumé, grillé, résineux, intense
              </p>
              <p className="text-sm text-red-800">
                <strong>Applications :</strong> Compositions fumées, notes balsamiques
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <Card className="bg-slate-50 border-2 border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Wind className="h-6 w-6 text-slate-600 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900">Méthodologie</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Les courbes de volatilité sont établies par analyse TGA-FTIR (Thermogravimetric Analysis couplée 
                  à Fourier Transform Infrared Spectroscopy) avec rampe de température contrôlée de 5°C/min. 
                  Les intensités sont mesurées par détection FTIR en temps réel et normalisées sur une échelle 0-100. 
                  Les données sont corrélées avec des analyses GC-MS et validées par panel sensoriel selon ISO 5496.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
