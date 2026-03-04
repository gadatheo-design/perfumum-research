// @ts-nocheck
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Droplets, Mountain, Crown, ArrowRight, Sparkles, Heart, Gem, Beaker, FileText, FlaskConical, 
  Layers, ChevronRight, BarChart3, Grid3X3, List, TrendingUp, Leaf, Atom, Users, Globe,
  ChevronDown, ChevronUp
} from "lucide-react";
import { VoirAussi, suggestionsGammes } from "@/components/VoirAussi";
import { useState, useMemo } from "react";
import { AnimatedCard, HoverScale, FadeInSection, StaggeredContent, StaggeredItem } from "@/components/PageTransition";
import { trpc } from "@/lib/trpc";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 18
    }
  }
};

// Types pour les gammes
interface Gamme {
  name: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBorder: string;
  gradientFrom: string;
  gradientTo: string;
  accentGradient: string;
  variations: number;
  families: string[];
  href: string;
  keywords: string[];
}

// Skeleton pour les cartes de gammes
function GammeCardSkeleton() {
  return (
    <Card className="h-full border border-border/50 bg-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-6 md:h-7 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="pt-3 border-t border-border/50 space-y-3">
          <Skeleton className="h-3 w-28" />
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-18" />
            <Skeleton className="h-5 w-14" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Liste des skeletons pour le chargement
function GammesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-7xl mx-auto">
      {Array.from({ length: 6 }).map((_, i) => (
        <GammeCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Composant de statistiques par gamme
function GammeStats({ gamme, recettes, molecules, plants }: { 
  gamme: Gamme; 
  recettes: any[]; 
  molecules: any[];
  plants: any[];
}) {
  // Calculer les statistiques basées sur les keywords de la gamme
  const stats = useMemo(() => {
    const matchingRecettes = recettes.filter(r => 
      gamme.keywords.some(kw => 
        r.name?.toLowerCase().includes(kw.toLowerCase()) ||
        r.description?.toLowerCase().includes(kw.toLowerCase()) ||
        r.category?.toLowerCase().includes(kw.toLowerCase())
      )
    );
    
    const matchingMolecules = molecules.filter(m =>
      gamme.keywords.some(kw =>
        m.name?.toLowerCase().includes(kw.toLowerCase()) ||
        m.olfactiveProfile?.toLowerCase().includes(kw.toLowerCase()) ||
        m.family?.toLowerCase().includes(kw.toLowerCase())
      )
    );
    
    const matchingPlants = plants.filter(p =>
      gamme.keywords.some(kw =>
        p.name?.toLowerCase().includes(kw.toLowerCase()) ||
        p.description?.toLowerCase().includes(kw.toLowerCase()) ||
        p.family?.toLowerCase().includes(kw.toLowerCase())
      )
    );
    
    return {
      recettes: matchingRecettes.length,
      molecules: matchingMolecules.length,
      plants: matchingPlants.length,
      total: matchingRecettes.length + matchingMolecules.length + matchingPlants.length
    };
  }, [gamme, recettes, molecules, plants]);
  
  return (
    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/30">
      <div className="text-center">
        <div className={`text-lg font-bold ${gamme.color}`}>{stats.recettes}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Recettes</div>
      </div>
      <div className="text-center border-x border-border/30">
        <div className={`text-lg font-bold ${gamme.color}`}>{stats.molecules}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Molécules</div>
      </div>
      <div className="text-center">
        <div className={`text-lg font-bold ${gamme.color}`}>{stats.plants}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Plantes</div>
      </div>
    </div>
  );
}

// Composant de vue comparative
function ComparativeView({ gammes, recettes, molecules, plants }: {
  gammes: Gamme[];
  recettes: any[];
  molecules: any[];
  plants: any[];
}) {
  const [sortBy, setSortBy] = useState<'variations' | 'recettes' | 'molecules' | 'plants'>('variations');
  const [expandedGamme, setExpandedGamme] = useState<string | null>(null);
  
  const gammeStats = useMemo(() => {
    return gammes.map(gamme => {
      const matchingRecettes = recettes.filter(r => 
        gamme.keywords.some(kw => 
          r.name?.toLowerCase().includes(kw.toLowerCase()) ||
          r.description?.toLowerCase().includes(kw.toLowerCase())
        )
      );
      
      const matchingMolecules = molecules.filter(m =>
        gamme.keywords.some(kw =>
          m.name?.toLowerCase().includes(kw.toLowerCase()) ||
          m.olfactiveProfile?.toLowerCase().includes(kw.toLowerCase())
        )
      );
      
      const matchingPlants = plants.filter(p =>
        gamme.keywords.some(kw =>
          p.name?.toLowerCase().includes(kw.toLowerCase()) ||
          p.description?.toLowerCase().includes(kw.toLowerCase())
        )
      );
      
      return {
        ...gamme,
        stats: {
          recettes: matchingRecettes.length,
          molecules: matchingMolecules.length,
          plants: matchingPlants.length,
          total: matchingRecettes.length + matchingMolecules.length + matchingPlants.length
        }
      };
    });
  }, [gammes, recettes, molecules, plants]);
  
  const sortedGammes = useMemo(() => {
    return [...gammeStats].sort((a, b) => {
      switch (sortBy) {
        case 'variations':
          return b.variations - a.variations;
        case 'recettes':
          return b.stats.recettes - a.stats.recettes;
        case 'molecules':
          return b.stats.molecules - a.stats.molecules;
        case 'plants':
          return b.stats.plants - a.stats.plants;
        default:
          return 0;
      }
    });
  }, [gammeStats, sortBy]);
  
  const maxValues = useMemo(() => ({
    variations: Math.max(...gammeStats.map(g => g.variations)),
    recettes: Math.max(...gammeStats.map(g => g.stats.recettes), 1),
    molecules: Math.max(...gammeStats.map(g => g.stats.molecules), 1),
    plants: Math.max(...gammeStats.map(g => g.stats.plants), 1),
  }), [gammeStats]);
  
  return (
    <div className="space-y-6">
      {/* Contrôles de tri */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        <span className="text-sm text-muted-foreground mr-2">Trier par :</span>
        {[
          { key: 'variations', label: 'Variations', icon: FileText },
          { key: 'recettes', label: 'Recettes', icon: FlaskConical },
          { key: 'molecules', label: 'Molécules', icon: Atom },
          { key: 'plants', label: 'Plantes', icon: Leaf },
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={sortBy === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy(key as typeof sortBy)}
            className="gap-1.5"
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Button>
        ))}
      </div>
      
      {/* Tableau comparatif */}
      <div className="space-y-3">
        {sortedGammes.map((gamme, index) => {
          const Icon = gamme.icon;
          const isExpanded = expandedGamme === gamme.name;
          
          return (
            <motion.div
              key={gamme.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`border ${gamme.borderColor} ${gamme.hoverBorder} transition-all duration-300 overflow-hidden`}>
                <div 
                  className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedGamme(isExpanded ? null : gamme.name)}
                >
                  <div className="flex items-center gap-4">
                    {/* Rang */}
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                    </div>
                    
                    {/* Icône et nom */}
                    <div className={`w-10 h-10 rounded-lg ${gamme.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${gamme.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{gamme.name}</h3>
                        <Badge variant="secondary" className={`${gamme.bgColor} ${gamme.color} border-0 text-xs`}>
                          {gamme.variations} var.
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{gamme.subtitle}</p>
                    </div>
                    
                    {/* Statistiques rapides */}
                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm font-bold text-foreground">{gamme.stats.recettes}</div>
                        <div className="text-[10px] text-muted-foreground">Recettes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-foreground">{gamme.stats.molecules}</div>
                        <div className="text-[10px] text-muted-foreground">Molécules</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-foreground">{gamme.stats.plants}</div>
                        <div className="text-[10px] text-muted-foreground">Plantes</div>
                      </div>
                    </div>
                    
                    {/* Chevron */}
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  
                  {/* Barres de progression */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Variations</span>
                        <span className="font-medium">{gamme.variations}</span>
                      </div>
                      <Progress 
                        value={(gamme.variations / maxValues.variations) * 100} 
                        className="h-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Recettes</span>
                        <span className="font-medium">{gamme.stats.recettes}</span>
                      </div>
                      <Progress 
                        value={(gamme.stats.recettes / maxValues.recettes) * 100} 
                        className="h-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Molécules</span>
                        <span className="font-medium">{gamme.stats.molecules}</span>
                      </div>
                      <Progress 
                        value={(gamme.stats.molecules / maxValues.molecules) * 100} 
                        className="h-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Plantes</span>
                        <span className="font-medium">{gamme.stats.plants}</span>
                      </div>
                      <Progress 
                        value={(gamme.stats.plants / maxValues.plants) * 100} 
                        className="h-1.5"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Détails étendus */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-border/50 bg-muted/20">
                        <p className="text-sm text-muted-foreground mb-4">{gamme.description}</p>
                        
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {gamme.families.map((family, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="text-xs font-normal bg-background/50"
                            >
                              {family}
                            </Badge>
                          ))}
                        </div>
                        
                        <Link href={gamme.href}>
                          <Button size="sm" className="gap-2">
                            Explorer la gamme
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Résumé global */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">
                {gammeStats.reduce((sum, g) => sum + g.variations, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Variations totales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {gammeStats.reduce((sum, g) => sum + g.stats.recettes, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Recettes liées</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {gammeStats.reduce((sum, g) => sum + g.stats.molecules, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Molécules associées</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {gammeStats.reduce((sum, g) => sum + g.stats.plants, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Plantes référencées</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Gammes() {
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');
  
  // Récupérer les données pour les statistiques
  const { data: recettes = [], isLoading: loadingRecettes } = trpc.recettes.list.useQuery();
  const { data: molecules = [], isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: plants = [], isLoading: loadingPlants } = trpc.plants.list.useQuery();
  
  const isLoading = loadingRecettes || loadingMolecules || loadingPlants;
  
  const gammes: Gamme[] = [
    {
      name: "Pétrichor",
      subtitle: "L'odeur de la pluie sur la terre",
      description: "60 variations explorant le phénomène du pétrichor : terre humide, minéral, végétal, cendre, métal. De l'accord Prima (terre vive + pluie chaude) aux variations radicales.",
      icon: Droplets,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      borderColor: "border-emerald-200/60 dark:border-emerald-800/40",
      hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-600",
      gradientFrom: "from-emerald-500/5",
      gradientTo: "to-teal-500/5",
      accentGradient: "from-emerald-500 to-teal-500",
      variations: 60,
      families: ["Hash Prima", "Tabac Fermenté", "Minéral Hash", "Floral Salé", "Animal Fumé", "Métallique Humide"],
      href: "/gammes/petrichor",
      keywords: ["pétrichor", "petrichor", "terre", "pluie", "minéral", "géosmine", "humide", "mousse"],
    },
    {
      name: "Volcanique",
      subtitle: "Géologie incandescente",
      description: "36 variations autour de la matière volcanique : soufre, cendre, pierre chaude, fumée noire, minéral brûlé. Exploration des transformations thermiques.",
      icon: Mountain,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/40",
      borderColor: "border-orange-200/60 dark:border-orange-800/40",
      hoverBorder: "hover:border-orange-400 dark:hover:border-orange-600",
      gradientFrom: "from-orange-500/5",
      gradientTo: "to-red-500/5",
      accentGradient: "from-orange-500 to-red-500",
      variations: 36,
      families: ["Soufre Pur", "Cendre Chaude", "Pierre Calcinée", "Fumée Noire", "Minéral Brûlé", "Lave Refroidie"],
      href: "/gammes/volcanique",
      keywords: ["volcanique", "soufre", "cendre", "fumée", "pyrolyse", "brûlé", "lave", "basalte"],
    },
    {
      name: "Royal Mossi",
      subtitle: "Identité olfactive du Sahel",
      description: "Architecture moléculaire inspirée des traditions Mossi : cuir tanné, fumigations rituelles, peaux tannées. Recherche anthropologique sur les pratiques olfactives.",
      icon: Crown,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
      borderColor: "border-amber-200/60 dark:border-amber-800/40",
      hoverBorder: "hover:border-amber-400 dark:hover:border-amber-600",
      gradientFrom: "from-amber-500/5",
      gradientTo: "to-yellow-500/5",
      accentGradient: "from-amber-500 to-yellow-500",
      variations: 12,
      families: ["Cuir Mossi", "Fumigations", "Peaux Tannées", "Bois Sahel"],
      href: "/gammes/mossi",
      keywords: ["mossi", "sahel", "cuir", "fumigation", "afrique", "burkina", "rituel", "encens"],
    },
    {
      name: "Signatures",
      subtitle: "Profils d'exception",
      description: "Collection premium de 3 profils d'exception : Cuir Marin (océan × cuir × minéral), Forêt de Cacao (jungle tropicale), Fleur Fantôme (floral éthéré).",
      icon: Sparkles,
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-50 dark:bg-violet-950/40",
      borderColor: "border-violet-200/60 dark:border-violet-800/40",
      hoverBorder: "hover:border-violet-400 dark:hover:border-violet-600",
      gradientFrom: "from-violet-500/5",
      gradientTo: "to-purple-500/5",
      accentGradient: "from-violet-500 to-purple-500",
      variations: 3,
      families: ["Cuir Marin", "Forêt de Cacao", "Fleur Fantôme"],
      href: "/gammes/signatures",
      keywords: ["signature", "premium", "cuir marin", "cacao", "fleur", "fantôme", "exception"],
    },
    {
      name: "Phéromones",
      subtitle: "Communication chimique humaine",
      description: "Exploration des molécules de communication chimique : Androsténol, Androsténone, Androstadiénone. Doses infinitésimales pour effets subliminaux.",
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-950/40",
      borderColor: "border-rose-200/60 dark:border-rose-800/40",
      hoverBorder: "hover:border-rose-400 dark:hover:border-rose-600",
      gradientFrom: "from-rose-500/5",
      gradientTo: "to-pink-500/5",
      accentGradient: "from-rose-500 to-pink-500",
      variations: 4,
      families: ["Pheromona Truffle", "Pheromona Skin", "Pheromona Alpha", "Pheromona Cascade"],
      href: "/gammes/pheromones",
      keywords: ["phéromone", "pheromone", "androsténol", "androsténone", "musc", "skin", "alpha"],
    },
    {
      name: "Raretés",
      subtitle: "Molécules précieuses de la parfumerie",
      description: "Les 10 molécules essentielles : Oud, Iris, Ambre Gris, Iso E Super, Ambrox, Coumarine, Calone, Galaxolide, Cashmeran, Javanol.",
      icon: Gem,
      color: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-50 dark:bg-sky-950/40",
      borderColor: "border-sky-200/60 dark:border-sky-800/40",
      hoverBorder: "hover:border-sky-400 dark:hover:border-sky-600",
      gradientFrom: "from-sky-500/5",
      gradientTo: "to-cyan-500/5",
      accentGradient: "from-sky-500 to-cyan-500",
      variations: 10,
      families: ["Trésor d'Orient", "Iris Royal", "Santal Sacré", "Musc Précieux", "Océan Profond"],
      href: "/gammes/raretes",
      keywords: ["oud", "iris", "ambre", "ambrox", "iso e super", "galaxolide", "cashmeran", "javanol", "rare", "précieux"],
    },
  ];

  const totalVariations = gammes.reduce((sum, g) => sum + g.variations, 0);
  const totalFamilies = gammes.reduce((sum, g) => sum + g.families.length, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Optimisé responsive */}
        <section className="relative py-16 sm:py-20 md:py-28 lg:py-32 overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
          <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="container relative px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Badge variant="outline" className="mb-6 sm:mb-8 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                  <FlaskConical className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Recherche Olfactive Expérimentale
                </Badge>
              </motion.div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 md:mb-8 text-foreground">
                Gammes de Recherche
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10 md:mb-12 px-2">
                Six familles olfactives développées sur plusieurs années, explorant des territoires sensoriels inédits à travers{" "}
                <span className="text-foreground font-semibold">{totalVariations} variations</span> documentées.
              </p>

              {/* Stats Pills - Responsive */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4"
              >
                {[
                  { icon: Layers, label: `${gammes.length} gammes`, color: "text-primary" },
                  { icon: FileText, label: `${totalVariations} variations`, color: "text-primary" },
                  { icon: FlaskConical, label: `${totalFamilies} familles`, color: "text-primary" },
                ].map((stat, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full bg-card border border-border/50 shadow-sm"
                  >
                    <stat.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.color}`} />
                    <span className="text-xs sm:text-sm font-medium text-foreground">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Introduction - Responsive */}
        <section className="py-8 sm:py-10 md:py-12 border-y border-border/50 bg-muted/20">
          <div className="container px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Les gammes constituent le <strong className="text-foreground font-medium">cœur de la recherche PERFUMUM</strong>. 
                Chaque gamme explore un phénomène olfactif spécifique à travers des dizaines de variations, 
                formant un <strong className="text-foreground font-medium">corpus systématique</strong> qui documente 
                les transformations de la matière, les effets thermiques, et les pratiques culturelles.
              </p>
            </div>
          </div>
        </section>

        {/* Sélecteur de vue */}
        <section className="py-6 sm:py-8 border-b border-border/50">
          <div className="container px-4 sm:px-6">
            <div className="flex justify-center">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'compare')} className="w-auto">
                <TabsList className="grid grid-cols-2 w-[280px]">
                  <TabsTrigger value="grid" className="gap-2">
                    <Grid3X3 className="w-4 h-4" />
                    Grille
                  </TabsTrigger>
                  <TabsTrigger value="compare" className="gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Comparatif
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-28">
          <div className="container px-4 sm:px-6">
            {isLoading ? (
              <GammesGridSkeleton />
            ) : viewMode === 'grid' ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-7xl mx-auto"
              >
                {gammes.map((gamme) => {
                  const Icon = gamme.icon;
                  return (
                    <motion.div key={gamme.name} variants={itemVariants}>
                      <Link href={gamme.href}>
                        <AnimatedCard hoverScale={1.015} hoverY={-6} className="h-full">
                        <Card className={`group h-full border ${gamme.borderColor} ${gamme.hoverBorder} bg-card hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 cursor-pointer overflow-hidden relative`}>
                          {/* Subtle gradient overlay on hover */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${gamme.gradientFrom} ${gamme.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                          
                          {/* Top accent line on hover */}
                          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gamme.accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                          
                          <CardHeader className="relative pb-3 sm:pb-4">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${gamme.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                                <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${gamme.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 sm:gap-4">
                                  <CardTitle className="text-xl sm:text-2xl md:text-3xl font-semibold group-hover:text-primary transition-colors duration-200 truncate">
                                    {gamme.name}
                                  </CardTitle>
                                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                                </div>
                                <CardDescription className="text-sm sm:text-base mt-1 sm:mt-1.5 text-muted-foreground line-clamp-1">
                                  {gamme.subtitle}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="relative space-y-3 sm:space-y-4">
                            <Badge variant="secondary" className={`${gamme.bgColor} ${gamme.color} border-0 font-medium text-xs sm:text-sm`}>
                              {gamme.variations} variations
                            </Badge>
                            
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
                              {gamme.description}
                            </p>
                            
                            {/* Statistiques par gamme */}
                            <GammeStats 
                              gamme={gamme} 
                              recettes={recettes} 
                              molecules={molecules}
                              plants={plants}
                            />
                            
                            <div className="pt-2 sm:pt-3 border-t border-border/50">
                              <h4 className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">
                                Familles principales
                              </h4>
                              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {gamme.families.slice(0, 4).map((family, idx) => (
                                  <Badge 
                                    key={idx} 
                                    variant="outline" 
                                    className="text-[10px] sm:text-xs font-normal bg-background/50 hover:bg-muted/50 transition-colors px-2 py-0.5"
                                  >
                                    {family}
                                  </Badge>
                                ))}
                                {gamme.families.length > 4 && (
                                  <Badge variant="outline" className="text-[10px] sm:text-xs font-normal bg-background/50 px-2 py-0.5">
                                    +{gamme.families.length - 4}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        </AnimatedCard>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="max-w-5xl mx-auto">
                <ComparativeView 
                  gammes={gammes}
                  recettes={recettes}
                  molecules={molecules}
                  plants={plants}
                />
              </div>
            )}
          </div>
        </section>

        {/* Methodology - Responsive */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-muted/20 border-y border-border/50">
          <div className="container px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10 sm:mb-12 md:mb-16"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
                  Méthodologie des Gammes
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Une approche rigoureuse combinant art et science pour explorer les territoires olfactifs
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {[
                  {
                    title: "Variations Systématiques",
                    description: "Chaque gamme est développée selon un protocole de variations systématiques : une formule mère est déclinée en ajoutant, retirant ou modifiant des molécules clés.",
                    icon: Beaker,
                  },
                  {
                    title: "Documentation Rigoureuse",
                    description: "Chaque variation est documentée avec sa formule précise, son profil olfactif, ses caractéristiques techniques et ses usages recommandés.",
                    icon: FileText,
                  },
                  {
                    title: "Recherche-Création",
                    description: "Les gammes interrogent des phénomènes sensoriels, des transformations matérielles ou des pratiques culturelles. Chaque accord est outil d'analyse et œuvre autonome.",
                    icon: FlaskConical,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <HoverScale scale={1.02} className="h-full">
                    <Card className="h-full border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 bg-card">
                      <CardHeader className="pb-3 sm:pb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                          <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg sm:text-xl font-semibold">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                    </HoverScale>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <VoirAussi items={suggestionsGammes} />
      <Footer />
    </div>
  );
}
