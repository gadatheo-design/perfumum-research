import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { trpc } from "../lib/trpc";
import { EnhancedHeatmap } from "@/components/charts/EnhancedHeatmap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Grid3X3, Zap, Shield, Sparkles, EyeOff, ArrowRight, Info, XCircle, Filter, RotateCcw } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Link } from "wouter";

const SYNERGY_TYPES = [
  {
    code: "P",
    key: "potentialisation",
    name: "Potentialisation",
    description: "Une molécule amplifie l'intensité ou la perception d'une autre",
    icon: Zap,
    color: "bg-green-500",
    textColor: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    code: "S",
    key: "stabilisation",
    name: "Stabilisation",
    description: "Une molécule aide à fixer ou prolonger la présence d'une autre",
    icon: Shield,
    color: "bg-blue-500",
    textColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    code: "T",
    key: "transformation",
    name: "Transformation",
    description: "L'association crée une nouvelle perception olfactive distincte",
    icon: Sparkles,
    color: "bg-purple-500",
    textColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    code: "M",
    key: "masquage",
    name: "Masquage",
    description: "Une molécule atténue ou cache certaines facettes d'une autre",
    icon: EyeOff,
    color: "bg-orange-500",
    textColor: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    code: "N",
    key: "neutralisation",
    name: "Neutralisation",
    description: "Deux molécules s'annulent mutuellement, équilibrant leurs effets olfactifs",
    icon: XCircle,
    color: "bg-red-500",
    textColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
] as const;

export function SynergiesHeatmap() {
  const { data: synergies, isLoading, error } = trpc.synergies?.getAllMoleculeSynergies.useQuery();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedFamily, setSelectedFamily] = useState<string>("all");

  // Familles chimiques uniques extraites des données
  const families = useMemo(() => {
    if (!synergies) return [];
    const fams = new Set<string>();
    synergies?.forEach((s: any) => {
      if (s.molecule1Family) fams.add(s.molecule1Family);
      if (s.molecule2Family) fams.add(s.molecule2Family);
    });
    return Array.from(fams).sort();
  }, [synergies]);

  // Synergies filtrées selon les sélections
  const filteredSynergies = useMemo(() => {
    if (!synergies) return [];
    return synergies?.filter((s: any) => {
      const typeMatch = selectedType === "all" || s.type === selectedType;
      const familyMatch =
        selectedFamily === "all" ||
        s.molecule1Family === selectedFamily ||
        s.molecule2Family === selectedFamily;
      return typeMatch && familyMatch;
    });
  }, [synergies, selectedType, selectedFamily]);

  // Statistiques par type
  const stats = synergies
    ? {
        total: synergies?.length,
        potentialisation: synergies?.filter((s: any) => s.type === "potentialisation").length,
        stabilisation: synergies?.filter((s: any) => s.type === "stabilisation").length,
        transformation: synergies?.filter((s: any) => s.type === "transformation").length,
        masquage: synergies?.filter((s: any) => s.type === "masquage").length,
        neutralisation: synergies?.filter((s: any) => s.type === "neutralisation").length,
      }
    : null;

  const hasFilters = selectedType !== "all" || selectedFamily !== "all";

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[600px] w-full" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Erreur de chargement
              </CardTitle>
              <CardDescription>Impossible de charger les synergies moléculaires</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge
                variant="outline"
                className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Analyse Moléculaire
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Heatmap des Synergies
              </h1>
              <p className="text-lg text-muted-foreground">
                Matrice interactive visualisant les interactions entre molécules olfactives.
                {stats && ` ${stats.total} synergies documentées.`}
              </p>
            </motion.div>

            {/* Légende des types — cliquable pour filtrer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 mt-8"
            >
              <button
                onClick={() => setSelectedType("all")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                  selectedType === "all"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border/50 hover:border-primary/40"
                }`}
              >
                <span className="text-xs font-medium">Tous</span>
              </button>
              {SYNERGY_TYPES.map((type) => (
                <button
                  key={type.code}
                  onClick={() => setSelectedType(selectedType === type.key ? "all" : type.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                    selectedType === type.key
                      ? "bg-primary/10 border-primary/50 text-primary"
                      : "bg-muted/50 border-border/50 hover:border-primary/40"
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${type.color}`} />
                  <span className="text-xs font-medium text-muted-foreground">
                    {type.code} — {type.name}
                    {stats && (
                      <span className="ml-1 opacity-60">({stats[type.key] || 0})</span>
                    )}
                  </span>
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container space-y-8">
            {/* Heatmap Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="overflow-hidden border-border/50">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Grid3X3 className="w-5 h-5 text-primary" />
                          Matrice des Synergies
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Survolez les cellules colorées pour voir les détails des interactions
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Info className="w-4 h-4" />
                        {hasFilters
                          ? `${filteredSynergies.length} / ${synergies?.length || 0} synergies`
                          : `${synergies?.length || 0} synergies`}
                      </div>
                    </div>

                    {/* Filtres interactifs */}
                    <div className="flex flex-wrap items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Filtres :</span>
                      </div>

                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-52 h-8 text-xs">
                          <SelectValue placeholder="Type de synergie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les types</SelectItem>
                          {SYNERGY_TYPES.map((t) => (
                            <SelectItem key={t.key} value={t.key}>
                              {t.code} — {t.name} {stats ? `(${stats[t.key] || 0})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                        <SelectTrigger className="w-56 h-8 text-xs">
                          <SelectValue placeholder="Famille chimique" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les familles</SelectItem>
                          {families.map((f: string) => (
                            <SelectItem key={f} value={f}>
                              {f}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {hasFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs gap-1"
                          onClick={() => {
                            setSelectedType("all");
                            setSelectedFamily("all");
                          }}
                        >
                          <RotateCcw className="w-3 h-3" />
                          Réinitialiser
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {filteredSynergies.length > 0 ? (
                    <div className="p-6">
                      <EnhancedHeatmap
                        synergies={filteredSynergies}
                        maxMolecules={30}
                        cellSize={26}
                        animate={true}
                        showLabels={true}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Grid3X3 className="w-12 h-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">
                        {hasFilters
                          ? "Aucune synergie ne correspond aux filtres sélectionnés."
                          : "Aucune synergie moléculaire enregistrée pour le moment."}
                      </p>
                      {hasFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => {
                            setSelectedType("all");
                            setSelectedFamily("all");
                          }}
                        >
                          Effacer les filtres
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Types de Synergies Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6">Types de Synergies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {SYNERGY_TYPES.map((type, index) => {
                  const Icon = type.icon;
                  const count = stats ? stats[type.key] || 0 : 0;
                  const isActive = selectedType === type.key;

                  return (
                    <motion.div
                      key={type.code}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.08 }}
                    >
                      <Card
                        className={`h-full border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer ${
                          isActive ? "border-primary/60 bg-primary/5" : ""
                        }`}
                        onClick={() => setSelectedType(isActive ? "all" : type.key)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl ${type.bgColor} flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className={`w-5 h-5 ${type.textColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className={`text-base font-bold ${type.textColor}`}>{type.code}</span>
                                <span className="font-semibold text-sm">{type.name}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {type.description}
                              </p>
                              <Badge variant="secondary" className="mt-2 text-xs">
                                {count} interaction{count !== 1 ? "s" : ""}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Info & Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">À propos</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-3">
                  <p>
                    Les synergies moléculaires représentent les interactions complexes entre différentes
                    molécules olfactives. Ces interactions peuvent modifier significativement le profil
                    olfactif final d'une composition.
                  </p>
                  <p>
                    Cette heatmap permet d'identifier rapidement les paires de molécules présentant
                    des interactions documentées, facilitant ainsi la formulation de compositions
                    olfactives harmonieuses et équilibrées.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Explorer plus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/molecules">
                    <Button variant="outline" className="w-full justify-between">
                      Base de données molécules
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/sankey-flow">
                    <Button variant="outline" className="w-full justify-between">
                      Flux des recettes (Sankey)
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/outils/generateur-formules">
                    <Button variant="outline" className="w-full justify-between">
                      Générateur de formules IA
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
