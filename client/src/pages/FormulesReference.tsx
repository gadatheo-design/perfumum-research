import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Beaker, BookOpen, Filter, X, ChevronRight, Layers, FlaskConical, Droplets, Wind } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ViewToggle, type ViewMode } from "@/components/ViewToggle";
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

const FAMILY_STYLES: Record<string, { 
  bg: string; 
  text: string; 
  border: string;
  gradient: string;
  hoverBorder: string;
  iconBg: string;
}> = {
  "Fougère": { 
    bg: "bg-emerald-500/10", 
    text: "text-emerald-700 dark:text-emerald-400", 
    border: "border-emerald-500/20",
    gradient: "from-emerald-500/5 to-teal-500/5",
    hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-600",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50"
  },
  "Chypré": { 
    bg: "bg-amber-500/10", 
    text: "text-amber-700 dark:text-amber-400", 
    border: "border-amber-500/20",
    gradient: "from-amber-500/5 to-yellow-500/5",
    hoverBorder: "hover:border-amber-400 dark:hover:border-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-900/50"
  },
  "Oriental": { 
    bg: "bg-purple-500/10", 
    text: "text-purple-700 dark:text-purple-400", 
    border: "border-purple-500/20",
    gradient: "from-purple-500/5 to-violet-500/5",
    hoverBorder: "hover:border-purple-400 dark:hover:border-purple-600",
    iconBg: "bg-purple-100 dark:bg-purple-900/50"
  },
  "Floral": { 
    bg: "bg-pink-500/10", 
    text: "text-pink-700 dark:text-pink-400", 
    border: "border-pink-500/20",
    gradient: "from-pink-500/5 to-rose-500/5",
    hoverBorder: "hover:border-pink-400 dark:hover:border-pink-600",
    iconBg: "bg-pink-100 dark:bg-pink-900/50"
  },
  "Boisé": { 
    bg: "bg-orange-500/10", 
    text: "text-orange-700 dark:text-orange-400", 
    border: "border-orange-500/20",
    gradient: "from-orange-500/5 to-amber-500/5",
    hoverBorder: "hover:border-orange-400 dark:hover:border-orange-600",
    iconBg: "bg-orange-100 dark:bg-orange-900/50"
  },
  "Hespéridé": { 
    bg: "bg-yellow-500/10", 
    text: "text-yellow-700 dark:text-yellow-400", 
    border: "border-yellow-500/20",
    gradient: "from-yellow-500/5 to-lime-500/5",
    hoverBorder: "hover:border-yellow-400 dark:hover:border-yellow-600",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/50"
  },
  "Aromatique": { 
    bg: "bg-blue-500/10", 
    text: "text-blue-700 dark:text-blue-400", 
    border: "border-blue-500/20",
    gradient: "from-blue-500/5 to-cyan-500/5",
    hoverBorder: "hover:border-blue-400 dark:hover:border-blue-600",
    iconBg: "bg-blue-100 dark:bg-blue-900/50"
  },
  "Cuir": { 
    bg: "bg-stone-500/10", 
    text: "text-stone-700 dark:text-stone-400", 
    border: "border-stone-500/20",
    gradient: "from-stone-500/5 to-neutral-500/5",
    hoverBorder: "hover:border-stone-400 dark:hover:border-stone-600",
    iconBg: "bg-stone-100 dark:bg-stone-900/50"
  }
};

const ROLE_STYLES: Record<string, { 
  bg: string; 
  text: string; 
  border: string; 
  accent: string;
  icon: typeof Wind;
  label: string;
}> = {
  "tête": { 
    bg: "bg-sky-500/10", 
    text: "text-sky-700 dark:text-sky-400", 
    border: "border-sky-500/30", 
    accent: "text-sky-600 dark:text-sky-400",
    icon: Wind,
    label: "Tête"
  },
  "cœur": { 
    bg: "bg-rose-500/10", 
    text: "text-rose-700 dark:text-rose-400", 
    border: "border-rose-500/30", 
    accent: "text-rose-600 dark:text-rose-400",
    icon: Droplets,
    label: "Cœur"
  },
  "fond": { 
    bg: "bg-amber-500/10", 
    text: "text-amber-700 dark:text-amber-400", 
    border: "border-amber-500/30", 
    accent: "text-amber-600 dark:text-amber-400",
    icon: Layers,
    label: "Fond"
  }
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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 120, damping: 18 } 
  }
};

// Skeleton pour les cartes de formules
function FormuleCardSkeleton() {
  return (
    <Card className="h-full border border-border/50 bg-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-2">
            <Skeleton className="h-5 w-14 flex-shrink-0" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}

function FormulesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <FormuleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function FormulesReference() {
  const [selectedFamily, setSelectedFamily] = useState<string>("Toutes");
  const [selectedFormule, setSelectedFormule] = useState<FormuleReference | null>(null);
  const [isLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("formules-view-mode");
      if (stored === "grid" || stored === "list" || stored === "compact") {
        return stored;
      }
    }
    return "grid";
  });

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("formules-view-mode", mode);
  };

  const formules = formulesData as FormuleReference[];

  const filteredFormules = useMemo(() => {
    if (selectedFamily === "Toutes") return formules;
    return formules.filter(f => f.family === selectedFamily);
  }, [selectedFamily, formules]);

  const familyStyles = (family: string) => FAMILY_STYLES[family] || { 
    bg: "bg-muted", 
    text: "text-muted-foreground", 
    border: "border-muted",
    gradient: "from-muted/5 to-muted/5",
    hoverBorder: "hover:border-muted-foreground/30",
    iconBg: "bg-muted"
  };

  const familyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    formules.forEach(f => {
      counts[f.family] = (counts[f.family] || 0) + 1;
    });
    return counts;
  }, [formules]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Enhanced */}
        <section className="relative py-20 md:py-28 overflow-hidden border-b border-border/50">
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/3 via-transparent to-purple-500/3" />
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Archétypes Olfactifs
                </Badge>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground"
              >
                Formules de{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Référence
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              >
                16 archétypes olfactifs classiques issus de la parfumerie traditionnelle. 
                Chaque formule représente une famille olfactive avec ses proportions caractéristiques.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="flex flex-wrap justify-center gap-3 mt-8"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FlaskConical className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{formules.length} formules</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">8 familles</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Beaker className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">~150 molécules</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="container py-10 md:py-12">
          {/* Filters - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Filter className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Filtrer par famille</h2>
                  <p className="text-sm text-muted-foreground">
                    {filteredFormules.length} formule{filteredFormules.length > 1 ? 's' : ''} affichée{filteredFormules.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <ViewToggle viewMode={viewMode} onViewModeChange={handleViewChange} />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {FAMILIES.map((family) => {
                const isSelected = selectedFamily === family;
                const styles = family !== "Toutes" ? familyStyles(family) : null;
                const count = family === "Toutes" ? formules.length : (familyCounts[family] || 0);
                
                return (
                  <Button
                    key={family}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFamily(family)}
                    className={`transition-all duration-200 ${
                      isSelected 
                        ? "" 
                        : styles 
                          ? `${styles.hoverBorder} hover:${styles.bg}` 
                          : ""
                    }`}
                  >
                    {family}
                    <span className={`ml-2 text-xs ${isSelected ? "opacity-70" : "opacity-50"}`}>
                      ({count})
                    </span>
                  </Button>
                );
              })}
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && <FormulesGridSkeleton />}

          {/* Formules Grid - Enhanced */}
          {!isLoading && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12"
                : "flex flex-col gap-3 mb-12"
              }
            >
              <AnimatePresence mode="popLayout">
                {filteredFormules.map((formule) => {
                  const styles = familyStyles(formule.family);
                  return (
                    <motion.div 
                      key={formule.name} 
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card 
                        className={`h-full border border-border/60 ${styles.hoverBorder} hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer bg-card group overflow-hidden`}
                        onClick={() => setSelectedFormule(formule)}
                      >
                        {/* Subtle gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        <CardHeader className="pb-3 relative">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                <FlaskConical className={`w-5 h-5 ${styles.text}`} />
                              </div>
                              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                {formule.name}
                              </CardTitle>
                            </div>
                            <Badge className={`${styles.bg} ${styles.text} ${styles.border} border text-xs flex-shrink-0`}>
                              {formule.family}
                            </Badge>
                          </div>
                          <CardDescription className="text-sm line-clamp-2 text-muted-foreground pl-13">
                            {formule.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="pt-0 relative">
                          <div className="space-y-2.5 pl-13">
                            {(["tête", "cœur", "fond"] as const).map((role) => {
                              const roleStyles = ROLE_STYLES[role];
                              const notes = role === "tête" ? formule.notes_tete : role === "cœur" ? formule.notes_coeur : formule.notes_fond;
                              const RoleIcon = roleStyles.icon;
                              return (
                                <div key={role} className="flex items-start gap-2">
                                  <Badge className={`${roleStyles.bg} ${roleStyles.text} ${roleStyles.border} border text-xs capitalize shrink-0 gap-1`}>
                                    <RoleIcon className="w-3 h-3" />
                                    {roleStyles.label}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground line-clamp-1">{notes}</span>
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50 pl-13">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Beaker className="w-3.5 h-3.5" />
                              <span>{formule.molecules.length} molécules</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Selected Formule Detail - Enhanced */}
          <AnimatePresence>
            {selectedFormule && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="mb-12"
              >
                <Card className="border-2 border-primary/30 shadow-xl shadow-primary/5 overflow-hidden">
                  <CardHeader className="border-b border-border/50 bg-gradient-to-r from-muted/50 to-muted/30">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${familyStyles(selectedFormule.family).iconBg} flex items-center justify-center flex-shrink-0`}>
                          <FlaskConical className={`w-7 h-7 ${familyStyles(selectedFormule.family).text}`} />
                        </div>
                        <div>
                          <CardTitle className="text-2xl md:text-3xl mb-3">{selectedFormule.name}</CardTitle>
                          <Badge className={`${familyStyles(selectedFormule.family).bg} ${familyStyles(selectedFormule.family).text} ${familyStyles(selectedFormule.family).border} border`}>
                            {selectedFormule.family}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setSelectedFormule(null)}
                        className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <CardDescription className="text-base mt-4 text-muted-foreground">
                      {selectedFormule.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <Tabs defaultValue="composition" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50">
                        <TabsTrigger value="composition" className="data-[state=active]:bg-background">
                          Composition
                        </TabsTrigger>
                        <TabsTrigger value="molecules" className="data-[state=active]:bg-background">
                          Molécules
                        </TabsTrigger>
                        <TabsTrigger value="radar" className="data-[state=active]:bg-background">
                          Profil Radar
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="composition" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {(["tête", "cœur", "fond"] as const).map((role) => {
                            const roleStyles = ROLE_STYLES[role];
                            const notes = role === "tête" ? selectedFormule.notes_tete : role === "cœur" ? selectedFormule.notes_coeur : selectedFormule.notes_fond;
                            const molecules = selectedFormule.molecules.filter(m => m.role === role);
                            const RoleIcon = roleStyles.icon;
                            return (
                              <motion.div 
                                key={role} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: role === "tête" ? 0 : role === "cœur" ? 0.1 : 0.2 }}
                                className={`p-5 rounded-xl ${roleStyles.bg} border ${roleStyles.border} hover:shadow-md transition-shadow`}
                              >
                                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-lg ${roleStyles.bg} border ${roleStyles.border} flex items-center justify-center`}>
                                    <RoleIcon className={`w-4 h-4 ${roleStyles.text}`} />
                                  </div>
                                  <span className={roleStyles.text}>Notes de {roleStyles.label}</span>
                                </h3>
                                <p className="text-foreground/80 text-sm mb-4">{notes}</p>
                                <div className="space-y-1.5">
                                  {molecules.map(m => (
                                    <div key={m.name} className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">{m.name}</span>
                                      <span className={`font-medium ${roleStyles.accent}`}>{m.proportion}%</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </TabsContent>

                      <TabsContent value="molecules">
                        <div className="space-y-2">
                          {selectedFormule.molecules
                            .sort((a, b) => b.proportion - a.proportion)
                            .map((molecule, index) => {
                              const roleStyles = ROLE_STYLES[molecule.role];
                              const RoleIcon = roleStyles.icon;
                              return (
                                <motion.div 
                                  key={molecule.name}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                                >
                                  <Badge className={`${roleStyles.bg} ${roleStyles.text} ${roleStyles.border} border capitalize gap-1`}>
                                    <RoleIcon className="w-3 h-3" />
                                    {roleStyles.label}
                                  </Badge>
                                  <span className="flex-1 font-medium text-foreground">{molecule.name}</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-32 h-2.5 bg-muted rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${molecule.proportion}%` }}
                                        transition={{ delay: index * 0.03 + 0.2, duration: 0.5 }}
                                        className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full"
                                      />
                                    </div>
                                    <span className="font-semibold text-primary w-12 text-right">
                                      {molecule.proportion}%
                                    </span>
                                  </div>
                                </motion.div>
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
          </AnimatePresence>

          {/* Guide - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-border/50 overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Guide d'utilisation</CardTitle>
                    <CardDescription>Comprendre et utiliser les formules de référence</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                  <h3 className="font-semibold text-base mb-2 text-foreground flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-primary" />
                    À propos des formules
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ces 16 formules représentent les archétypes classiques de la parfumerie occidentale, 
                    organisées en 8 familles olfactives avec variations classiques et modernes.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                  <h3 className="font-semibold text-base mb-2 text-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Structure des formules
                  </h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Wind className="w-3 h-3 text-sky-500" />
                      <strong className="text-foreground">Tête</strong> (15-30%) : Volatiles, fraîches
                    </li>
                    <li className="flex items-center gap-2">
                      <Droplets className="w-3 h-3 text-rose-500" />
                      <strong className="text-foreground">Cœur</strong> (30-50%) : Florales, épicées
                    </li>
                    <li className="flex items-center gap-2">
                      <Layers className="w-3 h-3 text-amber-500" />
                      <strong className="text-foreground">Fond</strong> (20-40%) : Boisées, ambrées
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                  <h3 className="font-semibold text-base mb-2 text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Utilisation
                  </h3>
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
