import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Droplets, Mountain, Crown, ArrowRight, Sparkles, Heart, Gem, 
  FlaskConical, Layers, Leaf, Atom
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

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
  tabId: string;
  keywords: string[];
}

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

export default function GammesOverviewContent() {
  const { data: recettes = [] } = trpc.recettes.list.useQuery();
  const { data: molecules = [] } = trpc.molecules.list.useQuery();
  const { data: plants = [] } = trpc.plants.list.useQuery();

  const gammes: Gamme[] = [
    {
      name: "Pétrichor",
      subtitle: "L'odeur de la pluie sur la terre",
      description: "60 variations explorant le phénomène du pétrichor : terre humide, minéral, végétal, cendre, métal.",
      icon: Droplets,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      borderColor: "border-emerald-200/60 dark:border-emerald-800/40",
      hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-600",
      gradientFrom: "from-emerald-500/5",
      gradientTo: "to-teal-500/5",
      accentGradient: "from-emerald-500 to-teal-500",
      variations: 60,
      families: ["Hash Prima", "Tabac Fermenté", "Minéral Hash", "Floral Salé"],
      tabId: "petrichor",
      keywords: ["pétrichor", "petrichor", "terre", "pluie", "minéral", "géosmine"],
    },
    {
      name: "Volcanique",
      subtitle: "Géologie incandescente",
      description: "36 variations autour de la matière volcanique : soufre, cendre, pierre chaude, fumée noire.",
      icon: Mountain,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/40",
      borderColor: "border-orange-200/60 dark:border-orange-800/40",
      hoverBorder: "hover:border-orange-400 dark:hover:border-orange-600",
      gradientFrom: "from-orange-500/5",
      gradientTo: "to-red-500/5",
      accentGradient: "from-orange-500 to-red-500",
      variations: 36,
      families: ["Soufre Pur", "Cendre Chaude", "Pierre Calcinée", "Fumée Noire"],
      tabId: "volcanique",
      keywords: ["volcanique", "soufre", "cendre", "fumée", "pyrolyse", "brûlé"],
    },
    {
      name: "Glaciaire",
      subtitle: "Fragrances du froid extrême",
      description: "Exploration des odeurs du froid : glace, neige, air arctique et minéralité gelée.",
      icon: Sparkles,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/40",
      borderColor: "border-cyan-200/60 dark:border-cyan-800/40",
      hoverBorder: "hover:border-cyan-400 dark:hover:border-cyan-600",
      gradientFrom: "from-cyan-500/5",
      gradientTo: "to-blue-500/5",
      accentGradient: "from-cyan-500 to-blue-500",
      variations: 24,
      families: ["Arctique", "Alpin", "Océanique", "Minéral"],
      tabId: "glaciaire",
      keywords: ["glaciaire", "glace", "neige", "froid", "arctique", "alpin"],
    },
    {
      name: "Bio-Lab",
      subtitle: "Vie microscopique",
      description: "Les odeurs de la vie microscopique : fermentation, mycélium, chlorophylle et microbiome.",
      icon: FlaskConical,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/40",
      borderColor: "border-green-200/60 dark:border-green-800/40",
      hoverBorder: "hover:border-green-400 dark:hover:border-green-600",
      gradientFrom: "from-green-500/5",
      gradientTo: "to-lime-500/5",
      accentGradient: "from-green-500 to-lime-500",
      variations: 20,
      families: ["Fermentation", "Mycélium", "Chlorophylle", "Microbiome"],
      tabId: "bio-lab",
      keywords: ["bio", "fermentation", "mycélium", "chlorophylle", "microbiome"],
    },
    {
      name: "Royal Mossi",
      subtitle: "Identité olfactive du Sahel",
      description: "Architecture moléculaire inspirée des traditions Mossi : cuir tanné, fumigations rituelles.",
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
      tabId: "mossi",
      keywords: ["mossi", "sahel", "cuir", "fumigation", "afrique", "burkina"],
    },
    {
      name: "Phéromones",
      subtitle: "Communication chimique humaine",
      description: "Exploration des molécules de communication chimique : Androsténol, Androsténone.",
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-950/40",
      borderColor: "border-rose-200/60 dark:border-rose-800/40",
      hoverBorder: "hover:border-rose-400 dark:hover:border-rose-600",
      gradientFrom: "from-rose-500/5",
      gradientTo: "to-pink-500/5",
      accentGradient: "from-rose-500 to-pink-500",
      variations: 4,
      families: ["Pheromona Truffle", "Pheromona Skin", "Pheromona Alpha"],
      tabId: "pheromones",
      keywords: ["phéromone", "pheromone", "androsténol", "musc", "skin"],
    },
  ];

  // Calculate stats for each gamme
  const gammeStats = useMemo(() => {
    return gammes.map(gamme => {
      const matchingRecettes = recettes.filter((r: any) => 
        gamme.keywords.some(kw => 
          r.name?.toLowerCase().includes(kw.toLowerCase()) ||
          r.description?.toLowerCase().includes(kw.toLowerCase())
        )
      );
      
      const matchingMolecules = molecules.filter((m: any) => {
        const profileStr = Array.isArray(m.olfactiveProfile)
          ? m.olfactiveProfile.join(' ')
          : (m.olfactiveProfile || '');
        return gamme.keywords.some(kw =>
          m.name?.toLowerCase().includes(kw.toLowerCase()) ||
          profileStr.toLowerCase().includes(kw.toLowerCase())
        );
      });
      
      const matchingPlants = plants.filter((p: any) =>
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
        }
      };
    });
  }, [gammes, recettes, molecules, plants]);

  const totalVariations = gammes.reduce((sum, g) => sum + g.variations, 0);

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
          <FlaskConical className="w-4 h-4 mr-2" />
          {totalVariations} variations • {gammes.length} gammes
        </Badge>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Les gammes PERFUMUM explorent des territoires olfactifs uniques, 
          de la terre après la pluie aux traditions ancestrales du Sahel.
        </p>
      </div>

      {/* Gammes Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {gammeStats.map((gamme) => {
          const Icon = gamme.icon;
          return (
            <motion.div key={gamme.name} variants={itemVariants}>
              <Card className={`h-full ${gamme.borderColor} ${gamme.hoverBorder} ${gamme.bgColor} transition-all duration-300 hover:shadow-lg`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${gamme.gradientFrom} ${gamme.gradientTo}`}>
                      <Icon className={`h-6 w-6 ${gamme.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl">{gamme.name}</CardTitle>
                      <CardDescription className="text-sm">{gamme.subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge variant="secondary" className="text-xs">
                    {gamme.variations} variations
                  </Badge>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {gamme.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/30">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${gamme.color}`}>{gamme.stats.recettes}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Recettes</div>
                    </div>
                    <div className="text-center border-x border-border/30">
                      <div className={`text-lg font-bold ${gamme.color}`}>{gamme.stats.molecules}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Molécules</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${gamme.color}`}>{gamme.stats.plants}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Plantes</div>
                    </div>
                  </div>
                  
                  {/* Families */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {gamme.families.slice(0, 3).map((family) => (
                      <Badge key={family} variant="outline" className="text-xs">
                        {family}
                      </Badge>
                    ))}
                    {gamme.families.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{gamme.families.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  {/* CTA */}
                  <Link href={`/gammes-hub?tab=${gamme.tabId}`}>
                    <Button variant="ghost" className="w-full mt-2 group">
                      Explorer
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Global Stats */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{totalVariations}</div>
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
