// @ts-nocheck
import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Beaker, Flame, Sparkles } from "lucide-react";

export function ExperimentalAccords() {
  const [selectedType, setSelectedType] = useState<"all" | "standard" | "extreme">("all");
  const { data: allAccords = [], isLoading } = trpc.experimentalAccords.list.useQuery();

  // Filter accords by type
  const filteredAccords = selectedType === "all" 
    ? allAccords 
    : allAccords.filter(a => selectedType === "extreme" ? a.isExtreme === 1 : a.isExtreme === 0);

  const standardCount = allAccords.filter(a => a.isExtreme === 0).length;
  const extremeCount = allAccords.filter(a => a.isExtreme === 1).length;

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
          <Beaker className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Accords Expérimentaux</h1>
        </div>
        <p className="text-lg text-gray-600">
          Compositions olfactives exploratoires : accords standards et territoires extrêmes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-3xl">{allAccords.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Accords standards</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{standardCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Accords extrêmes</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{extremeCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedType("all")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedType === "all"
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Tous les accords
        </button>
        <button
          onClick={() => setSelectedType("standard")}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            selectedType === "standard"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Standards ({standardCount})
        </button>
        <button
          onClick={() => setSelectedType("extreme")}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            selectedType === "extreme"
              ? "bg-orange-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Flame className="h-4 w-4" />
          Extrêmes ({extremeCount})
        </button>
      </div>

      {/* Description based on selected type */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          {selectedType === "standard" && (
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Accords Standards
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Les accords standards explorent des territoires olfactifs accessibles et harmonieux. 
                Ils servent de base pour les variations Pétrichor et constituent des points de référence 
                pour la recherche. Chaque accord combine des axes olfactifs spécifiques avec des intentions 
                conceptuelles claires (Cendres de mer, Peau d'encre, Forêt méditerranéenne, etc.).
              </p>
            </div>
          )}
          {selectedType === "extreme" && (
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-600" />
                Accords Extrêmes
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Les accords extrêmes poussent les limites de l'acceptable olfactif. Ils explorent 
                l'animalité brute, la fermentation extrême, les cratères actifs et les territoires 
                sulfureux. Ces compositions servent de base aux variations Volcanique et testent 
                les frontières de la perception sensorielle et de la résonance émotionnelle.
              </p>
            </div>
          )}
          {selectedType === "all" && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Vue d'ensemble</h3>
              <p className="text-gray-700 leading-relaxed">
                Les 20 accords expérimentaux se divisent en deux catégories : 10 accords standards 
                qui explorent des territoires harmonieux et accessibles, et 10 accords extrêmes qui 
                repoussent les limites de l'acceptable olfactif. Chaque accord est construit autour 
                d'un axe olfactif (Minéral, Végétal, Animal, etc.) et d'une intention conceptuelle 
                précise.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accords grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAccords.map((accord) => (
          <Card 
            key={accord.id} 
            className={`hover:shadow-md transition-shadow ${
              accord.isExtreme === 1 ? "border-l-4 border-l-orange-500" : "border-l-4 border-l-blue-500"
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-gray-50">
                      #{accord.number}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={
                        accord.isExtreme === 1 
                          ? "bg-orange-100 text-orange-800 border-orange-200" 
                          : "bg-blue-100 text-blue-800 border-blue-200"
                      }
                    >
                      {accord.isExtreme === 1 ? "Extrême" : "Standard"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{accord.intention}</CardTitle>
                  <CardDescription className="mt-1">
                    Axe : {accord.olfactiveAxis}
                  </CardDescription>
                </div>
                {accord.isExtreme === 1 ? (
                  <Flame className="h-6 w-6 text-orange-500" />
                ) : (
                  <Sparkles className="h-6 w-6 text-blue-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {accord.baseTabac && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-1">
                    Base Tabac
                  </h4>
                  <p className="text-gray-700">{accord.baseTabac}</p>
                </div>
              )}
              {accord.resinExtract && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-1">
                    Extrait de Résine
                  </h4>
                  <p className="text-gray-700">{accord.resinExtract}</p>
                </div>
              )}
              {accord.sensoryModifier && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-1">
                    Modificateur Sensoriel
                  </h4>
                  <p className="text-gray-700">{accord.sensoryModifier}</p>
                </div>
              )}
              {accord.conceptualNote && (
                <div className="pt-2 border-t">
                  <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-1">
                    Note Conceptuelle
                  </h4>
                  <p className="text-gray-600 italic text-sm">{accord.conceptualNote}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAccords.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Beaker className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun accord trouvé</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
