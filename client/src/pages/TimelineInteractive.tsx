import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { 
  Calendar, CheckCircle2, Circle, Clock, AlertCircle, 
  Target, TrendingUp, Layers, ArrowRight, Sparkles,
  Filter, Search, ChevronDown, ChevronUp, Play, Pause,
  ZoomIn, ZoomOut, RotateCcw, Download, Share2,
  FlaskConical, Beaker, BookOpen, Leaf, Globe, Users
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { cn } from "@/lib/utils";

// Types
interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  status: string;
  year: number;
  quarter: string;
  phase: string;
  priority?: number;
  linkedMolecules?: number[];
  linkedRecipes?: number[];
}

// Données simulées pour la timeline du projet PERFUMUM (2025-2035)
const PERFUMUM_TIMELINE: TimelineEvent[] = [
  // 2025 - Fondation
  { id: 1, title: "Lancement du projet PERFUMUM", description: "Création de la base de données moléculaire initiale", date: "2025-01-15", category: "infrastructure", status: "completed", year: 2025, quarter: "2025-Q1", phase: "foundation", priority: 1 },
  { id: 2, title: "Documentation des terpènes primaires", description: "Catalogage des 50 premiers terpènes", date: "2025-02-20", category: "documentation", status: "completed", year: 2025, quarter: "2025-Q1", phase: "foundation", priority: 2 },
  { id: 3, title: "Méthodologie ABSORBE v1", description: "Première version du protocole d'analyse sensorielle", date: "2025-04-10", category: "research", status: "completed", year: 2025, quarter: "2025-Q2", phase: "foundation", priority: 1 },
  { id: 4, title: "Partenariat laboratoire Berne", description: "Collaboration avec ABSORBE Lab", date: "2025-05-15", category: "collaboration", status: "completed", year: 2025, quarter: "2025-Q2", phase: "foundation", priority: 2 },
  { id: 5, title: "Premiers prototypes C1-C4", description: "Développement des 4 prototypes fondamentaux", date: "2025-07-01", category: "formulation", status: "completed", year: 2025, quarter: "2025-Q3", phase: "foundation", priority: 1 },
  { id: 6, title: "Base de données 100 molécules", description: "Atteinte du premier objectif de documentation", date: "2025-09-30", category: "documentation", status: "completed", year: 2025, quarter: "2025-Q3", phase: "foundation", priority: 2 },
  { id: 7, title: "Plateforme web v1.0", description: "Lancement de la première version du site", date: "2025-11-15", category: "infrastructure", status: "completed", year: 2025, quarter: "2025-Q4", phase: "foundation", priority: 1 },
  
  // 2026 - Développement
  { id: 8, title: "Expansion base moléculaire", description: "Objectif 300 molécules documentées", date: "2026-03-01", category: "documentation", status: "in_progress", year: 2026, quarter: "2026-Q1", phase: "development", priority: 1 },
  { id: 9, title: "Gamme Pétrichor", description: "Développement de la ligne olfactive minérale", date: "2026-04-15", category: "formulation", status: "in_progress", year: 2026, quarter: "2026-Q2", phase: "development", priority: 2 },
  { id: 10, title: "Intégration GC-MS", description: "Protocoles d'analyse chromatographique", date: "2026-06-01", category: "research", status: "planned", year: 2026, quarter: "2026-Q2", phase: "development", priority: 1 },
  { id: 11, title: "Gamme Volcanique", description: "Accords fumés et pyrolitiques", date: "2026-08-01", category: "formulation", status: "planned", year: 2026, quarter: "2026-Q3", phase: "development", priority: 2 },
  { id: 12, title: "Dashboard analytique v2", description: "Visualisations avancées et KPI", date: "2026-10-01", category: "infrastructure", status: "planned", year: 2026, quarter: "2026-Q4", phase: "development", priority: 1 },
  
  // 2027 - Expansion
  { id: 13, title: "Base 500 molécules", description: "Expansion majeure de la documentation", date: "2027-03-01", category: "documentation", status: "planned", year: 2027, quarter: "2027-Q1", phase: "expansion", priority: 1 },
  { id: 14, title: "Réseau fournisseurs international", description: "Partenariats sourcing global", date: "2027-06-01", category: "collaboration", status: "planned", year: 2027, quarter: "2027-Q2", phase: "expansion", priority: 2 },
  { id: 15, title: "Gamme Glaciaire", description: "Accords frais et cristallins", date: "2027-09-01", category: "formulation", status: "planned", year: 2027, quarter: "2027-Q3", phase: "expansion", priority: 2 },
  { id: 16, title: "API publique v1", description: "Ouverture des données pour la recherche", date: "2027-12-01", category: "infrastructure", status: "planned", year: 2027, quarter: "2027-Q4", phase: "expansion", priority: 1 },
  
  // 2028-2030 - Consolidation
  { id: 17, title: "Publication scientifique majeure", description: "Article sur les synergies terpéniques", date: "2028-06-01", category: "research", status: "planned", year: 2028, quarter: "2028-Q2", phase: "consolidation", priority: 1 },
  { id: 18, title: "Base 1000 molécules", description: "Objectif millénaire atteint", date: "2029-01-01", category: "documentation", status: "planned", year: 2029, quarter: "2029-Q1", phase: "consolidation", priority: 1 },
  { id: 19, title: "Réseau collaboratif international", description: "10 laboratoires partenaires", date: "2030-06-01", category: "collaboration", status: "planned", year: 2030, quarter: "2030-Q2", phase: "consolidation", priority: 2 },
  
  // 2031-2035 - Maturité
  { id: 20, title: "Encyclopédie olfactive complète", description: "Documentation exhaustive des familles", date: "2032-01-01", category: "documentation", status: "planned", year: 2032, quarter: "2032-Q1", phase: "maturity", priority: 1 },
  { id: 21, title: "IA prédictive olfactive", description: "Modèle de prédiction des accords", date: "2033-06-01", category: "research", status: "planned", year: 2033, quarter: "2033-Q2", phase: "maturity", priority: 1 },
  { id: 22, title: "Clôture projet décennal", description: "Bilan et transmission des connaissances", date: "2035-12-31", category: "documentation", status: "planned", year: 2035, quarter: "2035-Q4", phase: "maturity", priority: 1 },
];

// Couleurs par catégorie
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; fill: string }> = {
  research: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-800 dark:text-purple-300", border: "border-purple-200", fill: "oklch(0.65 0.2 280)" },
  formulation: { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-800 dark:text-pink-300", border: "border-pink-200", fill: "oklch(0.65 0.2 340)" },
  testing: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-800 dark:text-yellow-300", border: "border-yellow-200", fill: "oklch(0.65 0.2 80)" },
  documentation: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-300", border: "border-blue-200", fill: "oklch(0.65 0.2 220)" },
  infrastructure: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-800 dark:text-green-300", border: "border-green-200", fill: "oklch(0.65 0.2 140)" },
  collaboration: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-800 dark:text-orange-300", border: "border-orange-200", fill: "oklch(0.65 0.2 40)" },
};

// Labels
const CATEGORY_LABELS: Record<string, string> = {
  research: "Recherche",
  formulation: "Formulation",
  testing: "Tests",
  documentation: "Documentation",
  infrastructure: "Infrastructure",
  collaboration: "Collaboration",
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Terminé",
  in_progress: "En cours",
  planned: "Planifié",
  delayed: "Retardé",
};

const PHASE_LABELS: Record<string, string> = {
  foundation: "Fondation (2025)",
  development: "Développement (2026)",
  expansion: "Expansion (2027)",
  consolidation: "Consolidation (2028-2030)",
  maturity: "Maturité (2031-2035)",
};

// Icônes par catégorie
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "research": return <FlaskConical className="h-4 w-4" />;
    case "formulation": return <Beaker className="h-4 w-4" />;
    case "documentation": return <BookOpen className="h-4 w-4" />;
    case "infrastructure": return <Layers className="h-4 w-4" />;
    case "collaboration": return <Users className="h-4 w-4" />;
    default: return <Circle className="h-4 w-4" />;
  }
};

// Composant de carte d'événement
function EventCard({ event, isExpanded, onToggle }: { event: TimelineEvent; isExpanded: boolean; onToggle: () => void }) {
  const colors = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.documentation;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in_progress": return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      case "delayed": return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default: return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "relative p-4 rounded-lg border-l-4 cursor-pointer transition-all",
        colors.bg,
        colors.border,
        isExpanded ? "shadow-lg" : "hover:shadow-md"
      )}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {getStatusIcon(event.status)}
          <div>
            <h4 className="font-semibold">{event.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3"
                >
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={cn(colors.text, colors.border)}>
                      {getCategoryIcon(event.category)}
                      <span className="ml-1">{CATEGORY_LABELS[event.category]}</span>
                    </Badge>
                    <Badge variant="outline">
                      {PHASE_LABELS[event.phase]}
                    </Badge>
                  </div>
                  
                  {event.linkedMolecules && event.linkedMolecules.length > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Molécules liées: </span>
                      <span className="font-medium">{event.linkedMolecules.length}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Badge variant="secondary" className="text-xs">
            {new Date(event.date).toLocaleDateString("fr-FR", { 
              day: "numeric", 
              month: "short", 
              year: "numeric" 
            })}
          </Badge>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Composant de visualisation Gantt simplifiée
function GanttView({ events, selectedYear }: { events: TimelineEvent[]; selectedYear: number | null }) {
  const filteredEvents = selectedYear 
    ? events.filter(e => e.year === selectedYear)
    : events;

  const years = Array.from(new Set(events.map(e => e.year))).sort();
  const displayYears = selectedYear ? [selectedYear] : years;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* En-tête des années */}
        <div className="flex border-b pb-2 mb-4">
          <div className="w-48 shrink-0 font-medium">Événement</div>
          <div className="flex-1 flex">
            {displayYears.map(year => (
              <div key={year} className="flex-1 text-center font-medium text-sm">
                {year}
              </div>
            ))}
          </div>
        </div>

        {/* Événements */}
        <div className="space-y-2">
          {filteredEvents.map(event => {
            const colors = CATEGORY_COLORS[event.category];
            const yearIndex = displayYears.indexOf(event.year);
            const totalYears = displayYears.length;
            
            return (
              <div key={event.id} className="flex items-center">
                <div className="w-48 shrink-0 text-sm truncate pr-4">
                  {event.title}
                </div>
                <div className="flex-1 flex relative h-8">
                  {displayYears.map((_, i) => (
                    <div key={i} className="flex-1 border-l border-dashed border-muted" />
                  ))}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 / totalYears}%` }}
                    transition={{ duration: 0.5, delay: event.id * 0.05 }}
                    className={cn(
                      "absolute h-6 top-1 rounded-full",
                      colors.bg,
                      event.status === "completed" ? "opacity-100" : "opacity-60"
                    )}
                    style={{ 
                      left: `${(yearIndex / totalYears) * 100}%`,
                    }}
                  >
                    <div className="h-full flex items-center justify-center">
                      {event.status === "completed" && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                      {event.status === "in_progress" && <Clock className="h-3 w-3 text-blue-600" />}
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Composant de statistiques par phase
function PhaseStats({ events }: { events: TimelineEvent[] }) {
  const phaseData = useMemo(() => {
    const phases = ["foundation", "development", "expansion", "consolidation", "maturity"];
    return phases.map(phase => {
      const phaseEvents = events.filter(e => e.phase === phase);
      const completed = phaseEvents.filter(e => e.status === "completed").length;
      const total = phaseEvents.length;
      
      return {
        phase,
        label: PHASE_LABELS[phase],
        total,
        completed,
        inProgress: phaseEvents.filter(e => e.status === "in_progress").length,
        planned: phaseEvents.filter(e => e.status === "planned").length,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  }, [events]);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {phaseData.map(phase => (
        <Card key={phase.phase} className="card-interactive">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{phase.label}</CardTitle>
            <CardDescription>{phase.total} jalons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={phase.progress} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-green-600">{phase.completed} terminés</span>
                <span className="text-blue-600">{phase.inProgress} en cours</span>
                <span className="text-muted-foreground">{phase.planned} planifiés</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Composant de graphique d'évolution
function EvolutionChart({ events }: { events: TimelineEvent[] }) {
  const chartData = useMemo(() => {
    const years = Array.from(new Set(events.map(e => e.year))).sort();
    return years.map(year => {
      const yearEvents = events.filter(e => e.year === year);
      return {
        year,
        total: yearEvents.length,
        research: yearEvents.filter(e => e.category === "research").length,
        formulation: yearEvents.filter(e => e.category === "formulation").length,
        documentation: yearEvents.filter(e => e.category === "documentation").length,
        infrastructure: yearEvents.filter(e => e.category === "infrastructure").length,
        collaboration: yearEvents.filter(e => e.category === "collaboration").length,
      };
    });
  }, [events]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <defs>
          {Object.entries(CATEGORY_COLORS).map(([key, colors]) => (
            <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.fill} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors.fill} stopOpacity={0.1}/>
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.01 280)" />
        <XAxis dataKey="year" tick={{ fill: "oklch(0.5 0.02 280)", fontSize: 12 }} />
        <YAxis tick={{ fill: "oklch(0.5 0.02 280)", fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "oklch(0.98 0 0)", 
            border: "1px solid oklch(0.85 0.01 280)",
            borderRadius: "8px"
          }}
        />
        <Legend />
        <Area type="monotone" dataKey="research" name="Recherche" stackId="1" stroke={CATEGORY_COLORS.research.fill} fill={`url(#colorresearch)`} />
        <Area type="monotone" dataKey="formulation" name="Formulation" stackId="1" stroke={CATEGORY_COLORS.formulation.fill} fill={`url(#colorformulation)`} />
        <Area type="monotone" dataKey="documentation" name="Documentation" stackId="1" stroke={CATEGORY_COLORS.documentation.fill} fill={`url(#colordocumentation)`} />
        <Area type="monotone" dataKey="infrastructure" name="Infrastructure" stackId="1" stroke={CATEGORY_COLORS.infrastructure.fill} fill={`url(#colorinfrastructure)`} />
        <Area type="monotone" dataKey="collaboration" name="Collaboration" stackId="1" stroke={CATEGORY_COLORS.collaboration.fill} fill={`url(#colorcollaboration)`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Page principale
export default function TimelineInteractive() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "gantt" | "stats">("list");

  // Utiliser les données simulées
  const events = PERFUMUM_TIMELINE;
  const isLoading = false;

  // Années disponibles
  const years = useMemo(() => 
    Array.from(new Set(events.map(e => e.year))).sort(),
    [events]
  );

  // Catégories disponibles
  const categories = useMemo(() => 
    Array.from(new Set(events.map(e => e.category))),
    [events]
  );

  // Filtrage des événements
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesYear = !selectedYear || event.year === selectedYear;
      const matchesCategory = !selectedCategory || event.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesYear && matchesCategory && matchesSearch;
    });
  }, [events, selectedYear, selectedCategory, searchQuery]);

  // Grouper par trimestre pour la vue liste
  const groupedByQuarter = useMemo(() => {
    return filteredEvents.reduce((acc, event) => {
      if (!acc[event.quarter]) {
        acc[event.quarter] = [];
      }
      acc[event.quarter].push(event);
      return acc;
    }, {} as Record<string, TimelineEvent[]>);
  }, [filteredEvents]);

  // Statistiques globales
  const stats = useMemo(() => ({
    total: events.length,
    completed: events.filter(e => e.status === "completed").length,
    inProgress: events.filter(e => e.status === "in_progress").length,
    planned: events.filter(e => e.status === "planned").length,
    progress: Math.round((events.filter(e => e.status === "completed").length / events.length) * 100),
  }), [events]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        <div className="container py-8">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Calendar className="h-3 w-3 mr-1" />
                Timeline
              </Badge>
              <Badge variant="outline">
                {stats.progress}% complété
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Feuille de Route PERFUMUM
            </h1>
            <p className="text-muted-foreground mt-1">
              Programme de recherche décennal 2025-2035 — {events.length} jalons planifiés
            </p>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.completed}</div>
                    <div className="text-sm text-muted-foreground">Terminés</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.inProgress}</div>
                    <div className="text-sm text-muted-foreground">En cours</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Circle className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.planned}</div>
                    <div className="text-sm text-muted-foreground">Planifiés</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.progress}%</div>
                    <div className="text-sm text-muted-foreground">Progression</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un jalon..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select 
                  value={selectedYear?.toString() || "all"} 
                  onValueChange={(v) => setSelectedYear(v === "all" ? null : parseInt(v))}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les années</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={selectedCategory || "all"} 
                  onValueChange={(v) => setSelectedCategory(v === "all" ? null : v)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{CATEGORY_LABELS[cat]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedYear(null);
                    setSelectedCategory(null);
                    setSearchQuery("");
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Onglets de vue */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="space-y-6">
            <TabsList>
              <TabsTrigger value="list">
                <Layers className="h-4 w-4 mr-2" />
                Liste
              </TabsTrigger>
              <TabsTrigger value="gantt">
                <BarChart className="h-4 w-4 mr-2" />
                Gantt
              </TabsTrigger>
              <TabsTrigger value="stats">
                <TrendingUp className="h-4 w-4 mr-2" />
                Statistiques
              </TabsTrigger>
            </TabsList>

            {/* Vue Liste */}
            <TabsContent value="list" className="space-y-8">
              {Object.entries(groupedByQuarter)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([quarter, quarterEvents]) => (
                  <div key={quarter}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px flex-1 bg-border" />
                      <Badge variant="outline" className="text-sm font-medium">
                        {quarter.replace("-Q", " T")}
                      </Badge>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    
                    <div className="space-y-3">
                      {quarterEvents.map(event => (
                        <EventCard
                          key={event.id}
                          event={event}
                          isExpanded={expandedEvent === event.id}
                          onToggle={() => setExpandedEvent(
                            expandedEvent === event.id ? null : event.id
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </TabsContent>

            {/* Vue Gantt */}
            <TabsContent value="gantt">
              <Card>
                <CardHeader>
                  <CardTitle>Vue Gantt</CardTitle>
                  <CardDescription>
                    Visualisation temporelle des jalons du projet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GanttView events={filteredEvents} selectedYear={selectedYear} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Vue Statistiques */}
            <TabsContent value="stats" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution par Catégorie</CardTitle>
                  <CardDescription>
                    Répartition des jalons par année et catégorie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EvolutionChart events={events} />
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-semibold mb-4">Progression par Phase</h3>
                <PhaseStats events={events} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
