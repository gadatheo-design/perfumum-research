import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Activity, Info } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

export function AbsorbeScale() {
  const [selectedPrototypes, setSelectedPrototypes] = useState<string[]>([]);
  const { data: prototypes = [], isLoading } = trpc.prototypes.list.useQuery();
  const { data: absorbeProfiles = [] } = trpc.absorbeProfiles.list.useQuery();

  // ABSORBE axes definition
  const absorbeAxes = [
    { key: "animalite", label: "Animalité", description: "Notes animales, musquées, fécales" },
    { key: "boise", label: "Boisé", description: "Notes de bois, cèdre, santal" },
    { key: "soufre", label: "Soufré", description: "Notes sulfureuses, alliacées" },
    { key: "oxyde", label: "Oxydé", description: "Notes métalliques, rouille, fer" },
    { key: "resineux", label: "Résineux", description: "Notes de résine, pin, encens" },
    { key: "balsamique", label: "Balsamique", description: "Notes douces, vanillées, baumes" },
    { key: "epice", label: "Épicé", description: "Notes d'épices, poivre, cannelle" },
    { key: "terre", label: "Terreux", description: "Notes de terre, minéral, pétrichor" },
  ];

  // Get ABSORBE profile from database
  const getAbsorbeProfile = (code: string): Record<string, number> => {
    const proto = prototypes.find(p => p.code === code);
    if (!proto) return {};
    
    const profile = absorbeProfiles.find(p => p.prototypeId === proto.id);
    if (!profile) return {};
    
    return {
      animalite: profile.animalite,
      boise: profile.boise,
      soufre: profile.soufre,
      oxyde: profile.oxyde,
      resineux: profile.resineux,
      balsamique: profile.balsamique,
      epice: profile.epice,
      terreux: profile.terreux,
    };
  };

  // Prepare radar chart data
  const radarData = absorbeAxes.map(axis => {
    const dataPoint: any = { axis: axis.label };
    selectedPrototypes.forEach(code => {
      const profile = getAbsorbeProfile(code);
      dataPoint[code] = profile[axis.key] || 0;
    });
    return dataPoint;
  });

  const togglePrototype = (code: string) => {
    setSelectedPrototypes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const prototypeColors: Record<string, string> = {
    "C1": "#8b5cf6", // violet
    "C2": "#10b981", // green
    "C3": "#f59e0b", // amber
    "C4": "#ef4444", // red
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Breadcrumbs />
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Échelle ABSORBE</h1>
        </div>
        <p className="text-lg text-gray-600">
          Analyse sensorielle multidimensionnelle : 8 axes olfactifs pour cartographier les compositions
        </p>
      </div>

      {/* Info card */}
      <Card className="mb-8 border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">À propos de l'échelle ABSORBE</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-4">
            L'échelle ABSORBE est un système d'analyse sensorielle développé pour PERFUMUM qui évalue 
            les compositions olfactives selon 8 axes fondamentaux. Chaque axe est noté de 0 à 10, 
            permettant de créer un profil radar unique pour chaque prototype.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {absorbeAxes.map(axis => (
              <div key={axis.key} className="text-sm">
                <span className="font-semibold text-primary">{axis.label}</span>
                <p className="text-gray-600 text-xs">{axis.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prototype selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sélectionner les prototypes à comparer</CardTitle>
          <CardDescription>
            Cliquez sur les prototypes pour les ajouter au diagramme radar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {prototypes.map((proto) => (
              <button
                key={proto.id}
                onClick={() => togglePrototype(proto.code)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPrototypes.includes(proto.code)
                    ? `border-[${prototypeColors[proto.code]}] bg-opacity-10`
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{
                  borderColor: selectedPrototypes.includes(proto.code) 
                    ? prototypeColors[proto.code] 
                    : undefined,
                  backgroundColor: selectedPrototypes.includes(proto.code)
                    ? `${prototypeColors[proto.code]}15`
                    : undefined
                }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{proto.code}</div>
                  <div className="text-sm text-gray-600">{proto.name}</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Radar chart */}
      {selectedPrototypes.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Diagramme radar ABSORBE</CardTitle>
            <CardDescription>
              Comparaison des profils olfactifs sur les 8 axes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={500}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="axis" />
                <PolarRadiusAxis angle={90} domain={[0, 10]} />
                {selectedPrototypes.map(code => (
                  <Radar
                    key={code}
                    name={code}
                    dataKey={code}
                    stroke={prototypeColors[code]}
                    fill={prototypeColors[code]}
                    fillOpacity={0.3}
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>

            {/* Detailed scores */}
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-lg">Scores détaillés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPrototypes.map(code => {
                  const proto = prototypes.find(p => p.code === code);
                  const profile = getAbsorbeProfile(code);
                  return (
                    <Card key={code} className="border-l-4" style={{ borderLeftColor: prototypeColors[code] }}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{code} — {proto?.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {absorbeAxes.map(axis => (
                            <div key={axis.key} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{axis.label}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${(profile[axis.key] || 0) * 10}%`,
                                      backgroundColor: prototypeColors[code]
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-semibold w-8 text-right">
                                  {profile[axis.key] || 0}/10
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Aucun prototype sélectionné</p>
            <p className="text-gray-400 text-sm">
              Sélectionnez un ou plusieurs prototypes ci-dessus pour visualiser leurs profils ABSORBE
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
