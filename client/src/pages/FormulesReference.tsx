import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Beaker, BookOpen, Filter, X, ChevronRight, Layers } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ViewToggle } from "@/components/ViewToggle";
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

const FAMILY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Fougère": { bg: "bg-green-500/10", text: "text-green-700 dark:text-green-400", border: "border-green-500/20" },
  "Chypré": { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-500/20" },
  "Oriental": { bg: "bg-purple-500/10", text: "text-purple-700 dark:text-purple-400", border: "border-purple-500/20" },
  "Floral": { bg: "bg-pink-500/10", text: "text-pink-700 dark:text-pink-400", border: "border-pink-500/20" },
  "Boisé": { bg: "bg-orange-500/10", text: "text-orange-700 dark:text-orange-400", border: "border-orange-500/20" },
  "Hespéridé": { bg: "bg-yellow-500/10", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-500/20" },
  "Aromatique": { bg: "bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", border: "border-blue-500/20" },
  "Cuir": { bg: "bg-stone-500/10", text: "text-stone-700 dark:text-stone-400", border: "border-stone-500/20" }
};

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  "tête": { bg: "bg-sky-500/10", text: "text-sky-700 dark:text-sky-400", border: "border-sky-500/30", accent: "text-sky-600" },
  "cœur": { bg: "bg-rose-500/10", text: "text-rose-700 dark:text-rose-400", border: "border-rose-500/30", accent: "text-rose-600" },
  "fond": { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-500/30", accent: "text-amber-600" }
};

const calculateRadarProfile = (molecules: Molecule[]): { axis: string; value: number }[] => {
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function FormulesReference() {
  const [selectedFamily, setSelectedFamily] = useState<string>("Toutes");
  const [selectedFormule, setSelectedFormule] = useState<FormuleReference | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("formules-view-mode") as "grid" | "list") || "grid";
    }
    return "grid";
  });

  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("formules-view-mode", mode);
  };

  const formules = formulesData as FormuleReference[];

  const filteredFormules = useMemo(() => {
    if (selectedFamily === "Toutes") return formules;
    return formules.filter(f => f.family === selectedFamily);
  }, [selectedFamily, formules]);

  const familyColors = (family: string) => FAMILY_COLORS[family] || { bg: "bg-muted", text: "text-muted-foreground", border: "border-muted" };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Refined */}
        <section className="relative py-20 md:py-28 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Archétypes Olfactifs
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
                Formules de Référence
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                16 archétypes olfactifs classiques issus de la parfumerie traditionnelle. 
                Chaque formule représente une famille olfactive avec ses proportions caractéristiques.
              </p>
              
              <div className="flex justify-center gap-4 mt-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 shadow-sm">
                  <Layers className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{formules.length} formules</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 shadow-sm">
                  <Beaker className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">8 familles</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container py-12">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-base font-semibold text-foreground">Filtrer par famille</h2>
              </div>
              <ViewToggle viewMode={viewMode} onViewModeChange={handleViewChange} />
            </div>
            <div className="flex flex-wrap gap-2">
              {FAMILIES.map((family) => (
                <Button
                  key={family}
                  variant={selectedFamily === family ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFamily(family)}
                  className="transition-all duration-200"
                >
                  {family}
                  {selectedFamily === family && family !== "Toutes" && (
                    <span className="ml-2 text-xs opacity-70">
                      ({filteredFormules.length})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Formules Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12"
              : "flex flex-col gap-3 mb-12"
            }
          >
            {filteredFormules.map((formule) => {
              const colors = familyColors(formule.family);
              return (
                <motion.div key={formule.name} variants={itemVariants}>
                  <Card 
                    className="h-full border border-border/60 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer bg-card group"
                    onClick={() => setSelectedFormule(formule)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {formule.name}
                        </CardTitle>
                        <Badge className={`${colors.bg} ${colors.text} ${colors.border} border text-xs`}>
                          {formule.family}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm line-clamp-2 text-muted-foreground">
                        {formule.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2.5">
                        {(["tête", "cœur", "fond"] as const).map((role) => {
                          const roleColors = ROLE_COLORS[role];
                          const notes = role === "tête" ? formule.notes_tete : role === "cœur" ? formule.notes_coeur : formule.notes_fond;
                          return (
                            <div key={role} className="flex items-start gap-2">
                              <Badge className={`${roleColors.bg} ${roleColors.text} ${roleColors.border} border text-xs capitalize shrink-0`}>
                                {role === "tête" ? "Tête" : role === "cœur" ? "Cœur" : "Fond"}
                              </Badge>
                              <span className="text-xs text-muted-foreground line-clamp-1">{notes}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Beaker className="w-3.5 h-3.5" />
                          <span>{formule.molecules.length} molécules</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Selected Formule Detail */}
          {selectedFormule && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <Card className="border-2 border-primary/30 shadow-lg">
                <CardHeader className="border-b border-border/50 bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl md:text-3xl mb-3">{selectedFormule.name}</CardTitle>
                      <Badge className={`${familyColors(selectedFormule.family).bg} ${familyColors(selectedFormule.family).text} ${familyColors(selectedFormule.family).border} border`}>
                        {selectedFormule.family}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedFormule(null)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <CardDescription className="text-base mt-4 text-muted-foreground">
                    {selectedFormule.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="composition" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="composition">Composition</TabsTrigger>
                      <TabsTrigger value="molecules">Molécules</TabsTrigger>
                      <TabsTrigger value="radar">Profil Radar</TabsTrigger>
                    </TabsList>

                    <TabsContent value="composition" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(["tête", "cœur", "fond"] as const).map((role) => {
                          const roleColors = ROLE_COLORS[role];
                          const notes = role === "tête" ? selectedFormule.notes_tete : role === "cœur" ? selectedFormule.notes_coeur : selectedFormule.notes_fond;
                          const molecules = selectedFormule.molecules.filter(m => m.role === role);
                          return (
                            <div key={role} className={`p-5 rounded-xl ${roleColors.bg} border ${roleColors.border}`}>
                              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <Badge className={`${roleColors.bg} ${roleColors.text} ${roleColors.border} border capitalize`}>
                                  Notes de {role === "tête" ? "Tête" : role === "cœur" ? "Cœur" : "Fond"}
                                </Badge>
                              </h3>
                              <p className="text-foreground/80 text-sm mb-4">{notes}</p>
                              <div className="space-y-1.5">
                                {molecules.map(m => (
                                  <div key={m.name} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{m.name}</span>
                                    <span className={`font-medium ${roleColors.accent}`}>{m.proportion}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="molecules">
                      <div className="space-y-2">
                        {selectedFormule.molecules
                          .sort((a, b) => b.proportion - a.proportion)
                          .map((molecule) => {
                            const roleColors = ROLE_COLORS[molecule.role];
                            return (
                              <div 
                                key={molecule.name}
                                className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50"
                              >
                                <Badge className={`${roleColors.bg} ${roleColors.text} ${roleColors.border} border capitalize`}>
                                  {molecule.role}
                                </Badge>
                                <span className="flex-1 font-medium text-foreground">{molecule.name}</span>
                                <div className="flex items-center gap-3">
                                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-primary/70 to-primary"
                                      style={{ width: `${molecule.proportion}%` }}
                                    />
                                  </div>
                                  <span className="font-semibold text-primary w-12 text-right">
                                    {molecule.proportion}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </TabsContent>

                    <TabsContent value="radar">
                      <div className="flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={400}>
                          <RadarChart data={calculateRadarProfile(selectedFormule.molecules)}>
                            <PolarGrid stroke="hsl(var(--border))" />
                            <PolarAngleAxis 
                              dataKey="axis" 
                              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13 }} 
                            />
                            <PolarRadiusAxis 
                              angle={90} 
                              domain={[0, 100]} 
                              tick={{ fill: "hsl(var(--muted-foreground))" }} 
                            />
                            <Radar
                              name={selectedFormule.name}
                              dataKey="value"
                              stroke="hsl(var(--primary))"
                              fill="hsl(var(--primary))"
                              fillOpacity={0.4}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                        <p className="text-sm text-muted-foreground mt-4 text-center max-w-2xl">
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

          {/* Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-muted/30 border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Guide d'utilisation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-base mb-2 text-foreground">À propos des formules</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ces 16 formules représentent les archétypes classiques de la parfumerie occidentale, 
                    organisées en 8 familles olfactives avec variations classiques et modernes.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-2 text-foreground">Structure des formules</h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li><strong className="text-foreground">Tête</strong> (15-30%) : Volatiles, fraîches</li>
                    <li><strong className="text-foreground">Cœur</strong> (30-50%) : Florales, épicées</li>
                    <li><strong className="text-foreground">Fond</strong> (20-40%) : Boisées, ambrées</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-2 text-foreground">Utilisation</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Utilisez ces formules comme points de départ. Adaptez les proportions ou substituez 
                    des molécules pour créer vos variations personnalisées.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
