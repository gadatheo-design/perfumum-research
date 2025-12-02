import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Atom, Beaker, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export function ChemicalFamilies() {
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const { data: families = [], isLoading } = trpc.chemicalFamilies.list.useQuery();
  const { data: molecules = [] } = trpc.chemicalFamilies.getMolecules.useQuery(
    selectedFamily || "",
    { enabled: !!selectedFamily }
  );

  // Family descriptions
  const familyDescriptions: Record<string, { description: string; color: string }> = {
    "Acides gras": {
      description: "Molécules organiques avec groupe carboxyle, apportent des notes grasses, cireuses et parfois rances. Essentielles pour la profondeur et la ténacité.",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200"
    },
    "Aldéhydes": {
      description: "Composés carbonylés aux notes fraîches, métalliques et savonneuses. Apportent de la brillance et de l'éclat aux compositions.",
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    "Alcools": {
      description: "Groupe hydroxyle (-OH) conférant des notes florales, fraîches et parfois mentholées. Volatils et légers.",
      color: "bg-cyan-100 text-cyan-800 border-cyan-200"
    },
    "Esters": {
      description: "Résultant de la réaction entre acide et alcool, notes fruitées, florales et sucrées. Très présents dans les fruits.",
      color: "bg-pink-100 text-pink-800 border-pink-200"
    },
    "Indoles": {
      description: "Composés hétérocycliques azotés aux notes animales, fécales à faible concentration, florales (jasmin) à haute dilution.",
      color: "bg-purple-100 text-purple-800 border-purple-200"
    },
    "Lactones": {
      description: "Esters cycliques aux notes crémeuses, lactées, coco et pêche. Apportent rondeur et gourmandise.",
      color: "bg-orange-100 text-orange-800 border-orange-200"
    },
    "Phénols": {
      description: "Composés aromatiques avec groupe hydroxyle, notes fumées, médicinales, cuir et goudron. Puissants et tenaces.",
      color: "bg-red-100 text-red-800 border-red-200"
    },
    "Pyrazines": {
      description: "Hétérocycles azotés aux notes grillées, torréfiées, terreuses et végétales. Caractéristiques du cacao et du café.",
      color: "bg-amber-100 text-amber-800 border-amber-200"
    },
    "Soufrés": {
      description: "Contiennent du soufre, notes alliacées, sulfureuses, animales et parfois putrides. Très puissants même à faible dose.",
      color: "bg-green-100 text-green-800 border-green-200"
    },
    "Terpènes": {
      description: "Hydrocarbures naturels issus des plantes, notes résineuses, citronnées, boisées et camphrées. Base de nombreuses huiles essentielles.",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },
    "Cétones": {
      description: "Groupe carbonyle entre deux carbones, notes fruitées, mentholées et parfois cireuses. Volatilité moyenne.",
      color: "bg-violet-100 text-violet-800 border-violet-200"
    },
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Beaker className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Familles Chimiques</h1>
        </div>
        <p className="text-lg text-gray-600">
          Classification des molécules olfactives par structure chimique et profil sensoriel
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Familles</CardDescription>
            <CardTitle className="text-3xl">{families.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Molécules totales</CardDescription>
            <CardTitle className="text-3xl">
              {families.reduce((sum, f) => sum + Number(f.count), 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Famille sélectionnée</CardDescription>
            <CardTitle className="text-2xl truncate">
              {selectedFamily || "Aucune"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Families list */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xl font-semibold mb-4">Sélectionner une famille</h2>
          {families.map((family) => {
            const info = familyDescriptions[family.family || ""] || {
              color: "bg-gray-100 text-gray-800 border-gray-200",
              description: ""
            };
            return (
              <Card
                key={family.family}
                className={`shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer ${
                  selectedFamily === family.family ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedFamily(family.family || null)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{family.family}</CardTitle>
                      <CardDescription className="mt-1">
                        {family.count} {Number(family.count) === 1 ? "molécule" : "molécules"}
                      </CardDescription>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Family details */}
        <div className="lg:col-span-2">
          {selectedFamily ? (
            <div className="space-y-6">
              {/* Family info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Atom className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">{selectedFamily}</CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className={familyDescriptions[selectedFamily]?.color || ""}
                  >
                    {molecules.length} {molecules.length === 1 ? "molécule" : "molécules"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {familyDescriptions[selectedFamily]?.description ||
                      "Description non disponible"}
                  </p>
                </CardContent>
              </Card>

              {/* Molecules list */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Molécules de cette famille</h3>
                <div className="grid grid-cols-1 gap-3">
                  {molecules.map((molecule) => (
                    <Link key={molecule.id} href={`/molecule/${molecule.id}`}>
                      <Card className="shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{molecule.name}</CardTitle>
                            {molecule.chemicalFormula && (
                              <CardDescription className="font-mono text-sm mt-1">
                                {molecule.chemicalFormula}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {molecule.olfactiveProfile && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-1">
                              Profil olfactif
                            </h4>
                            <p className="text-gray-700">{molecule.olfactiveProfile}</p>
                          </div>
                        )}
                        {molecule.functionalEffect && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-1">
                              Effet fonctionnel
                            </h4>
                            <p className="text-gray-700">{molecule.functionalEffect}</p>
                          </div>
                        )}
                        {molecule.emotionalResonance && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-1">
                              Résonance émotionnelle
                            </h4>
                            <p className="text-gray-700">{molecule.emotionalResonance}</p>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {molecule.sourceOrigin && (
                            <Badge variant="outline" className="bg-green-50">
                              Source : {molecule.sourceOrigin}
                            </Badge>
                          )}
                          {molecule.concentration && (
                            <Badge variant="outline" className="bg-blue-50">
                              {molecule.concentration}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Atom className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Sélectionnez une famille chimique pour voir ses molécules
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
