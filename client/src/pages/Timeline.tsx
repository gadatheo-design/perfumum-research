import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  Calendar, CheckCircle2, Circle, Clock, AlertCircle, 
  Target, TrendingUp, Layers, ArrowRight, Sparkles 
} from "lucide-react";

export function Timeline() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { data: milestones = [], isLoading } = trpc.timeline.list.useQuery();
  const { data: stats } = trpc.timeline.stats.useQuery();

  // Group milestones by quarter
  const groupedByQuarter = milestones.reduce((acc, milestone) => {
    if (!acc[milestone.quarter]) {
      acc[milestone.quarter] = [];
    }
    acc[milestone.quarter].push(milestone);
    return acc;
  }, {} as Record<string, typeof milestones>);

  // Get unique years
  const years = Array.from(new Set(milestones.map((m) => m.year))).sort();

  // Filter by year if selected
  const filteredQuarters = selectedYear
    ? Object.keys(groupedByQuarter).filter((q) => q.startsWith(String(selectedYear)))
    : Object.keys(groupedByQuarter);

  // Status icons and colors
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "delayed":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: "Terminé",
      in_progress: "En cours",
      planned: "Planifié",
      delayed: "Retardé",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
      in_progress: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
      planned: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
      delayed: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      research: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300",
      formulation: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300",
      testing: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300",
      documentation: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
      infrastructure: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
      collaboration: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      research: "Recherche",
      formulation: "Formulation",
      testing: "Tests",
      documentation: "Documentation",
      infrastructure: "Infrastructure",
      collaboration: "Collaboration",
    };
    return labels[category] || category;
  };

  const getPhaseLabel = (phase: string) => {
    const labels: Record<string, string> = {
      foundation: "Fondation",
      development: "Développement",
      expansion: "Expansion",
      consolidation: "Consolidation",
      innovation: "Innovation",
    };
    return labels[phase] || phase;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "text-red-600 font-bold",
      high: "text-orange-600 font-semibold",
      medium: "text-foreground",
      low: "text-muted-foreground",
    };
    return colors[priority] || "text-foreground";
  };

  // Calculate progress percentage
  const progressPercentage = stats 
    ? Math.round(((stats.byStatus.completed || 0) / stats.total) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-4 gap-4 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-blue-50/30 dark:to-blue-950/10">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white py-16"
        >
          <div className="container">
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-12 h-12" />
              <h1 className="text-5xl font-bold">Calendrier de Recherche</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mb-8">
              Planification progressive sur 18 mois (extensible à 2-3 ans). 
              Suivez l'avancement du projet PERFUMUM et ses jalons clés.
            </p>
            
            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-200" />
                    <span className="text-blue-200 text-sm">Total</span>
                  </div>
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <div className="text-blue-200 text-xs">jalons planifiés</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-300" />
                    <span className="text-blue-200 text-sm">Terminés</span>
                  </div>
                  <div className="text-3xl font-bold text-green-300">
                    {stats.byStatus.completed || 0}
                  </div>
                  <div className="text-blue-200 text-xs">{progressPercentage}% complété</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-300" />
                    <span className="text-blue-200 text-sm">En cours</span>
                  </div>
                  <div className="text-3xl font-bold text-yellow-300">
                    {stats.byStatus.in_progress || 0}
                  </div>
                  <div className="text-blue-200 text-xs">jalons actifs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-5 h-5 text-blue-200" />
                    <span className="text-blue-200 text-sm">Planifiés</span>
                  </div>
                  <div className="text-3xl font-bold">
                    {stats.byStatus.planned || 0}
                  </div>
                  <div className="text-blue-200 text-xs">à venir</div>
                </div>
              </div>
            )}

            {/* Progress bar */}
            {stats && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-blue-200 mb-2">
                  <span>Progression globale</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.section>

        <div className="container py-8">
          {/* Year filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            <button
              onClick={() => setSelectedYear(null)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedYear === null
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Toutes les années
            </button>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedYear === year
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {year}
              </button>
            ))}
          </motion.div>

          {/* Timeline */}
          <div className="space-y-8">
            {filteredQuarters.sort().map((quarter, qIndex) => {
              const quarterMilestones = groupedByQuarter[quarter];
              return (
                <motion.div 
                  key={quarter} 
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: qIndex * 0.1 }}
                >
                  {/* Quarter header */}
                  <div className="sticky top-16 z-10 bg-background/95 backdrop-blur py-3 mb-4 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-primary">{quarter}</h2>
                      <Badge variant="outline" className="text-sm">
                        {quarterMilestones.length}{" "}
                        {quarterMilestones.length === 1 ? "jalon" : "jalons"}
                      </Badge>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-4 pl-6 border-l-2 border-primary/30">
                    {quarterMilestones.map((milestone, idx) => (
                      <motion.div 
                        key={milestone.id} 
                        className="relative"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (qIndex * 0.1) + (idx * 0.05) }}
                      >
                        {/* Timeline dot */}
                        <div className="absolute -left-[29px] top-6">
                          {getStatusIcon(milestone.status)}
                        </div>

                        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className={getPriorityColor(milestone.priority)}>
                                    {milestone.title}
                                  </CardTitle>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge
                                    variant="outline"
                                    className={getStatusColor(milestone.status)}
                                  >
                                    {getStatusLabel(milestone.status)}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={getCategoryColor(milestone.category)}
                                  >
                                    {getCategoryLabel(milestone.category)}
                                  </Badge>
                                  <Badge variant="outline" className="bg-muted">
                                    {getPhaseLabel(milestone.phase)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {milestone.description && (
                              <p className="text-muted-foreground leading-relaxed">
                                {milestone.description}
                              </p>
                            )}

                            {milestone.progress > 0 && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Progression</span>
                                  <span className="font-semibold">{milestone.progress}%</span>
                                </div>
                                <Progress value={milestone.progress} className="h-2" />
                              </div>
                            )}

                            {milestone.deliverables && (
                              <div className="bg-muted/50 rounded-lg p-4">
                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                                  <Sparkles className="w-4 h-4" />
                                  Livrables
                                </h4>
                                <ul className="space-y-1 text-sm">
                                  {JSON.parse(milestone.deliverables).map(
                                    (deliverable: string, i: number) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <ArrowRight className="w-3 h-3 mt-1 text-primary flex-shrink-0" />
                                        <span>{deliverable}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                            <div className="flex gap-4 text-sm text-muted-foreground pt-2 border-t">
                              {milestone.startDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Début : {milestone.startDate}
                                </span>
                              )}
                              {milestone.endDate && (
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4" />
                                  Fin : {milestone.endDate}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation vers pages connexes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-6 bg-muted/30 rounded-lg"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Pages connexes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/projets" className="block p-4 bg-background rounded-lg border hover:border-blue-500/50 transition-colors">
                <div className="font-medium">Projets</div>
                <div className="text-sm text-muted-foreground">Découvrir les projets de recherche</div>
              </a>
              <a href="/methodologie/absorbe" className="block p-4 bg-background rounded-lg border hover:border-blue-500/50 transition-colors">
                <div className="font-medium">Méthode ABSORBE</div>
                <div className="text-sm text-muted-foreground">Comprendre la méthodologie</div>
              </a>
              <a href="/gestion" className="block p-4 bg-background rounded-lg border hover:border-blue-500/50 transition-colors">
                <div className="font-medium">Gestion</div>
                <div className="text-sm text-muted-foreground">Dashboard de gestion du projet</div>
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
