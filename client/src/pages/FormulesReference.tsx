import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Beaker, BookOpen, Filter } from "lucide-react";
import formulesData from "../../../data/FORMULES_REFERENCE_16.json";

interface Molecule {
  name: string;
  proportion: number;
  role: "tête" | "cœur" | "fond";
}

interface FormuleReference {
  name: string;
  family: string;
  description: string;
  notes_tete: string;
  notes_coeur: string;
  notes_fond: string;
  molecules: Molecule[];
}

const FAMILIES = [
  "Toutes",
  "Fougère",
  "Chypré",
  "Oriental",
  "Floral",
  "Boisé",
  "Hespéridé",
  "Aromatique",
  "Cuir"
];

const FAMILY_COLORS: Record<string, string> = {
  "Fougère": "bg-green-500/10 text-green-600 border-green-500/20",
  "Chypré": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Oriental": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  "Floral": "bg-pink-500/10 text-pink-600 border-pink-500/20",
  "Boisé": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "Hespéridé": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  "Aromatique": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Cuir": "bg-stone-500/10 text-stone-600 border-stone-500/20"
};

const ROLE_COLORS: Record<string, string> = {
  "tête": "bg-sky-500/10 text-sky-700 border-sky-500/30",
  "cœur": "bg-rose-500/10 text-rose-700 border-rose-500/30",
  "fond": "bg-amber-500/10 text-amber-700 border-amber-500/30"
};

// Calcul du profil radar basé sur les molécules (simulation)
const calculateRadarProfile = (molecules: Molecule[]): any[] => {
  // Simulation basée sur les rôles et proportions
  const teteTotal = molecules.filter(m => m.role === "tête").reduce((sum, m) => sum + m.proportion, 0);
  const coeurTotal = molecules.filter(m => m.role === "cœur").reduce((sum, m) => sum + m.proportion, 0);
  const fondTotal = molecules.filter(m => m.role === "fond").reduce((sum, m) => sum + m.proportion, 0);

  return [
    { axis: "Intensité", value: Math.min(100, (fondTotal + coeurTotal) * 1.2) },
    { axis: "Fraîcheur", value: Math.min(100, teteTotal * 2) },
    { axis: "Chaleur", value: Math.min(100, fondTotal * 1.8) },
    { axis: "Douceur", value: Math.min(100, coeurTotal * 1.5) },
    { axis: "Épices", value: Math.min(100, (coeurTotal + fondTotal) * 0.8) },
    { axis: "Terreux", value: Math.min(100, fondTotal * 1.3) }
  ];
};

export default function FormulesReference() {
  const [selectedFamily, setSelectedFamily] = useState<string>("Toutes");
  const [selectedFormule, setSelectedFormule] = useState<FormuleReference | null>(null);

  const formules = formulesData as FormuleReference[];

  const filteredFormules = useMemo(() => {
    if (selectedFamily === "Toutes") return formules;
    return formules.filter(f => f.family === selectedFamily);
  }, [selectedFamily, formules]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white py-16"
      >
        <div className="container">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Formules de Référence</h1>
          </div>
          <p className="text-xl text-amber-50 max-w-3xl">
            16 archétypes olfactifs classiques issus de la parfumerie traditionnelle. 
            Chaque formule représente une famille olfactive avec ses proportions caractéristiques.
          </p>
        </div>
      </motion.div>

      <div className="container py-12">
        {/* Filtres par famille */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-700">Filtrer par famille</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {FAMILIES.map((family) => (
              <Button
                key={family}
                variant={selectedFamily === family ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFamily(family)}
                className="transition-all"
              >
                {family}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Grille des formules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredFormules.map((formule, index) => (
            <motion.div
              key={formule.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="h-full hover:shadow-lg transition-all cursor-pointer border-2 hover:border-amber-500/50"
                onClick={() => setSelectedFormule(formule)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{formule.name}</CardTitle>
                    <Badge className={FAMILY_COLORS[formule.family]}>
                      {formule.family}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm line-clamp-3">
                    {formule.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Notes olfactives */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={ROLE_COLORS["tête"]} variant="outline">Tête</Badge>
                        <span className="text-xs text-slate-600">{formule.notes_tete}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={ROLE_COLORS["cœur"]} variant="outline">Cœur</Badge>
                        <span className="text-xs text-slate-600">{formule.notes_coeur}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={ROLE_COLORS["fond"]} variant="outline">Fond</Badge>
                        <span className="text-xs text-slate-600">{formule.notes_fond}</span>
                      </div>
                    </div>

                    {/* Nombre de molécules */}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Beaker className="w-4 h-4" />
                      <span>{formule.molecules.length} molécules</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Détail de la formule sélectionnée */}
        {selectedFormule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card className="border-2 border-amber-500/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{selectedFormule.name}</CardTitle>
                    <Badge className={FAMILY_COLORS[selectedFormule.family]} variant="outline">
                      {selectedFormule.family}
                    </Badge>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedFormule(null)}>
                    Fermer
                  </Button>
                </div>
                <CardDescription className="text-base mt-4">
                  {selectedFormule.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="composition" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="composition">Composition</TabsTrigger>
                    <TabsTrigger value="molecules">Molécules</TabsTrigger>
                    <TabsTrigger value="radar">Profil Radar</TabsTrigger>
                  </TabsList>

                  <TabsContent value="composition" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Badge className={ROLE_COLORS["tête"]}>Notes de Tête</Badge>
                        </h3>
                        <p className="text-slate-700">{selectedFormule.notes_tete}</p>
                        <div className="mt-3 space-y-1">
                          {selectedFormule.molecules
                            .filter(m => m.role === "tête")
                            .map(m => (
                              <div key={m.name} className="flex justify-between text-sm">
                                <span className="text-slate-600">{m.name}</span>
                                <span className="font-medium text-sky-600">{m.proportion}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Badge className={ROLE_COLORS["cœur"]}>Notes de Cœur</Badge>
                        </h3>
                        <p className="text-slate-700">{selectedFormule.notes_coeur}</p>
                        <div className="mt-3 space-y-1">
                          {selectedFormule.molecules
                            .filter(m => m.role === "cœur")
                            .map(m => (
                              <div key={m.name} className="flex justify-between text-sm">
                                <span className="text-slate-600">{m.name}</span>
                                <span className="font-medium text-rose-600">{m.proportion}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Badge className={ROLE_COLORS["fond"]}>Notes de Fond</Badge>
                        </h3>
                        <p className="text-slate-700">{selectedFormule.notes_fond}</p>
                        <div className="mt-3 space-y-1">
                          {selectedFormule.molecules
                            .filter(m => m.role === "fond")
                            .map(m => (
                              <div key={m.name} className="flex justify-between text-sm">
                                <span className="text-slate-600">{m.name}</span>
                                <span className="font-medium text-amber-600">{m.proportion}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="molecules">
                    <div className="space-y-3">
                      {selectedFormule.molecules
                        .sort((a, b) => b.proportion - a.proportion)
                        .map((molecule) => (
                          <div 
                            key={molecule.name}
                            className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                          >
                            <Badge className={ROLE_COLORS[molecule.role]} variant="outline">
                              {molecule.role}
                            </Badge>
                            <span className="flex-1 font-medium text-slate-700">{molecule.name}</span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                                  style={{ width: `${molecule.proportion}%` }}
                                />
                              </div>
                              <span className="font-semibold text-amber-600 w-12 text-right">
                                {molecule.proportion}%
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="radar">
                    <div className="flex flex-col items-center">
                      <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={calculateRadarProfile(selectedFormule.molecules)}>
                          <PolarGrid stroke="#cbd5e1" />
                          <PolarAngleAxis dataKey="axis" tick={{ fill: "#475569", fontSize: 14 }} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94a3b8" }} />
                          <Radar
                            name={selectedFormule.name}
                            dataKey="value"
                            stroke="#f59e0b"
                            fill="#f59e0b"
                            fillOpacity={0.6}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                      <p className="text-sm text-slate-600 mt-4 text-center max-w-2xl">
                        Ce profil radar est calculé automatiquement en fonction des proportions et rôles des molécules.
                        Il représente les caractéristiques olfactives dominantes de la formule.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Guide d'utilisation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-amber-600" />
                <CardTitle className="text-2xl">Guide d'utilisation</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-slate-700">À propos des formules de référence</h3>
                <p className="text-slate-600">
                  Ces 16 formules représentent les archétypes classiques de la parfumerie occidentale. 
                  Elles sont organisées en 8 familles olfactives, chacune avec deux variations (classique et moderne).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-slate-700">Structure des formules</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>Notes de tête</strong> (15-30%) : Premières impressions, volatiles, fraîches</li>
                  <li><strong>Notes de cœur</strong> (30-50%) : Corps du parfum, florales, épicées</li>
                  <li><strong>Notes de fond</strong> (20-40%) : Base tenace, boisées, ambrées, musquées</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-slate-700">Utilisation dans vos recherches</h3>
                <p className="text-slate-600">
                  Utilisez ces formules comme points de départ pour vos propres créations. 
                  Vous pouvez les adapter en modifiant les proportions ou en substituant certaines molécules 
                  pour créer des variations personnalisées.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
