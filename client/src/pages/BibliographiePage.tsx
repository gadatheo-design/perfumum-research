// @ts-nocheck
import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  Search,
  Filter,
  Download,
  FileText,
  ExternalLink,
  Copy,
  BookMarked,
  GraduationCap,
  FileCode,
  Globe,
  Calendar,
  User,
  Tag,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Network,
  Sparkles,
  TrendingUp,
  Library,
  Layers,
  ChevronRight,
  ArrowUpRight,
  Quote,
  Atom,
  Leaf,
  FlaskConical,
  Beaker,
  Cpu,
  Home as HomeIcon,
} from "lucide-react";
import { toast } from "sonner";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

// Types
type EntryType = 'article' | 'book' | 'inbook' | 'incollection' | 'inproceedings' | 'conference' | 'thesis' | 'mastersthesis' | 'phdthesis' | 'techreport' | 'manual' | 'unpublished' | 'misc' | 'online' | 'patent' | 'standard' | 'dataset' | 'software';
type ResearchDomain = 'chimie_olfactive' | 'botanique' | 'ethnobotanique' | 'histoire_parfumerie' | 'neurologie_olfactive' | 'extraction' | 'formulation' | 'reglementation' | 'durabilite' | 'tabac_cannabis' | 'methodologie' | 'autre';
type ReadStatus = 'unread' | 'reading' | 'read' | 'to_review';

const entryTypeLabels: Record<EntryType, string> = {
  article: "Article",
  book: "Livre",
  inbook: "Chapitre",
  incollection: "Collection",
  inproceedings: "Conférence",
  conference: "Conférence",
  thesis: "Thèse",
  mastersthesis: "Master",
  phdthesis: "Doctorat",
  techreport: "Rapport",
  manual: "Manuel",
  unpublished: "Non publié",
  misc: "Divers",
  online: "En ligne",
  patent: "Brevet",
  standard: "Norme",
  dataset: "Dataset",
  software: "Logiciel",
};

const domainLabels: Record<ResearchDomain, string> = {
  chimie_olfactive: "Chimie olfactive",
  botanique: "Botanique",
  ethnobotanique: "Ethnobotanique",
  histoire_parfumerie: "Histoire",
  neurologie_olfactive: "Neurologie",
  extraction: "Extraction",
  formulation: "Formulation",
  reglementation: "Réglementation",
  durabilite: "Durabilité",
  tabac_cannabis: "Tabac & Cannabis",
  methodologie: "Méthodologie",
  autre: "Autre",
};

const domainColors: Record<ResearchDomain, string> = {
  chimie_olfactive: "bg-purple-500",
  botanique: "bg-green-500",
  ethnobotanique: "bg-amber-600",
  histoire_parfumerie: "bg-rose-500",
  neurologie_olfactive: "bg-blue-500",
  extraction: "bg-orange-500",
  formulation: "bg-cyan-500",
  reglementation: "bg-slate-500",
  durabilite: "bg-emerald-500",
  tabac_cannabis: "bg-yellow-600",
  methodologie: "bg-indigo-500",
  autre: "bg-gray-500",
};

const domainIcons: Record<ResearchDomain, React.ReactNode> = {
  chimie_olfactive: <Atom className="h-4 w-4" />,
  botanique: <Leaf className="h-4 w-4" />,
  ethnobotanique: <Globe className="h-4 w-4" />,
  histoire_parfumerie: <BookMarked className="h-4 w-4" />,
  neurologie_olfactive: <Sparkles className="h-4 w-4" />,
  extraction: <FlaskConical className="h-4 w-4" />,
  formulation: <Layers className="h-4 w-4" />,
  reglementation: <FileCode className="h-4 w-4" />,
  durabilite: <TrendingUp className="h-4 w-4" />,
  tabac_cannabis: <Leaf className="h-4 w-4" />,
  methodologie: <BarChart3 className="h-4 w-4" />,
  autre: <FileText className="h-4 w-4" />,
};

const readStatusConfig: Record<ReadStatus, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  unread: { label: "Non lu", icon: <EyeOff className="h-3 w-3" />, color: "text-gray-500", bg: "bg-gray-100" },
  reading: { label: "En cours", icon: <Clock className="h-3 w-3" />, color: "text-blue-500", bg: "bg-blue-100" },
  read: { label: "Lu", icon: <CheckCircle className="h-3 w-3" />, color: "text-green-500", bg: "bg-green-100" },
  to_review: { label: "À relire", icon: <AlertCircle className="h-3 w-3" />, color: "text-amber-500", bg: "bg-amber-100" },
};

const entryTypeIcons: Record<EntryType, React.ReactNode> = {
  article: <FileText className="h-4 w-4" />,
  book: <BookOpen className="h-4 w-4" />,
  inbook: <BookMarked className="h-4 w-4" />,
  incollection: <BookMarked className="h-4 w-4" />,
  inproceedings: <GraduationCap className="h-4 w-4" />,
  conference: <GraduationCap className="h-4 w-4" />,
  thesis: <GraduationCap className="h-4 w-4" />,
  mastersthesis: <GraduationCap className="h-4 w-4" />,
  phdthesis: <GraduationCap className="h-4 w-4" />,
  techreport: <FileCode className="h-4 w-4" />,
  manual: <FileCode className="h-4 w-4" />,
  unpublished: <FileText className="h-4 w-4" />,
  misc: <FileText className="h-4 w-4" />,
  online: <Globe className="h-4 w-4" />,
  patent: <FileCode className="h-4 w-4" />,
  standard: <FileCode className="h-4 w-4" />,
  dataset: <BarChart3 className="h-4 w-4" />,
  software: <FileCode className="h-4 w-4" />,
};

// Configuration des axes de recherche
const axisConfig: Record<string, { 
  name: string; 
  shortName: string;
  color: string; 
  bgColor: string;
  icon: React.ReactNode;
}> = {
  'AX1': {
    name: 'Génomique olfactive & conservation ex-situ',
    shortName: 'Génomique',
    color: '#4CAF50',
    bgColor: 'bg-green-500',
    icon: <Atom className="h-4 w-4" />,
  },
  'AX2': {
    name: 'Ethnobotanique computationnelle',
    shortName: 'Ethnobotanique',
    color: '#2196F3',
    bgColor: 'bg-blue-500',
    icon: <Leaf className="h-4 w-4" />,
  },
  'AX3': {
    name: 'Chimie analytique comparative trans-époques',
    shortName: 'Chimie analytique',
    color: '#FF9800',
    bgColor: 'bg-orange-500',
    icon: <FlaskConical className="h-4 w-4" />,
  },
  'AX4': {
    name: 'Biotechnologies de conservation & fermentation',
    shortName: 'Biotechnologies',
    color: '#9C27B0',
    bgColor: 'bg-purple-500',
    icon: <Beaker className="h-4 w-4" />,
  },
  'AX5': {
    name: 'Technologies immersives & démocratisation',
    shortName: 'Technologies VR',
    color: '#00BCD4',
    bgColor: 'bg-cyan-500',
    icon: <Cpu className="h-4 w-4" />,
  },
  'AX6': {
    name: 'Chimie de l\'espace (indoor) & pratiques domestiques',
    shortName: 'Chimie indoor',
    color: '#795548',
    bgColor: 'bg-amber-700',
    icon: <HomeIcon className="h-4 w-4" />,
  },
};

// Composant Timeline des publications
function PublicationTimeline({ data }: { data: Array<{ year: number | null; count: number }> }) {
  const validData = data.filter(d => d.year !== null).sort((a, b) => (a.year || 0) - (b.year || 0));
  const maxCount = Math.max(...validData.map(d => d.count), 1);
  
  if (validData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune donnée temporelle disponible
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-1 h-32 overflow-x-auto pb-2">
        {validData.map((item, idx) => {
          const height = (item.count / maxCount) * 100;
          return (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center min-w-[40px]">
                    <div 
                      className="w-8 bg-gradient-to-t from-primary to-primary/60 rounded-t transition-all hover:from-primary/80 hover:to-primary/40 cursor-pointer"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground mt-1 rotate-[-45deg] origin-top-left translate-y-2">
                      {item.year}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{item.year}</p>
                  <p className="text-sm">{item.count} publication{item.count > 1 ? 's' : ''}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}

// Composant Nuage de domaines
function DomainCloud({ data }: { data: Array<{ domain: string | null; count: number }> }) {
  const validData = data.filter(d => d.domain !== null);
  const maxCount = Math.max(...validData.map(d => d.count), 1);
  
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {validData.map((item, idx) => {
        const domain = item.domain as ResearchDomain;
        const size = 0.8 + (item.count / maxCount) * 0.6;
        const color = domainColors[domain] || "bg-gray-500";
        
        return (
          <TooltipProvider key={idx}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`${color} text-white px-3 py-1.5 rounded-full cursor-pointer transition-transform hover:scale-105 flex items-center gap-1.5`}
                  style={{ fontSize: `${size}rem` }}
                >
                  {domainIcons[domain]}
                  <span>{domainLabels[domain] || domain}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.count} référence{item.count > 1 ? 's' : ''}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}

// Composant Statistiques visuelles
function StatsOverview({ stats }: { stats: any }) {
  if (!stats) return null;
  
  const readCount = stats?.byReadStatus?.find((s: any) => s.status === "read")?.count || 0;
  const readingCount = stats?.byReadStatus?.find((s: any) => s.status === "reading")?.count || 0;
  const unreadCount = stats?.byReadStatus?.find((s: any) => s.status === "unread")?.count || 0;
  const toReviewCount = stats?.byReadStatus?.find((s: any) => s.status === "to_review")?.count || 0;
  
  const readProgress = stats?.total > 0 ? Math.round((readCount / stats?.total) * 100) : 0;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-primary">{stats?.total}</p>
              <p className="text-sm text-muted-foreground">Références</p>
            </div>
            <Library className="h-8 w-8 text-primary/40" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-green-600">{readCount}</p>
              <p className="text-sm text-muted-foreground">Lues ({readProgress}%)</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500/40" />
          </div>
          <div className="mt-2 h-1.5 bg-green-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${readProgress}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-600">{readingCount}</p>
              <p className="text-sm text-muted-foreground">En cours</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500/40" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-amber-600">{unreadCount + toReviewCount}</p>
              <p className="text-sm text-muted-foreground">À lire</p>
            </div>
            <Eye className="h-8 w-8 text-amber-500/40" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Composant carte de référence moderne
function ReferenceCard({ entry, onCopyAPA }: { entry: any; onCopyAPA: (entry: any) => void }) {
  const domain = entry.researchDomain as ResearchDomain;
  const type = entry.entryType as EntryType;
  const status = entry.readStatus as ReadStatus;
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: `var(--${domain || 'primary'})` }}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Icône type */}
          <div className={`p-2.5 rounded-lg ${domainColors[domain] || 'bg-gray-500'} text-white shrink-0`}>
            {entryTypeIcons[type]}
          </div>
          
          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {entry.title}
              </h3>
              
              {/* Statut de lecture */}
              <div className={`shrink-0 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${readStatusConfig[status]?.bg} ${readStatusConfig[status]?.color}`}>
                {readStatusConfig[status]?.icon}
                <span className="hidden sm:inline">{readStatusConfig[status]?.label}</span>
              </div>
            </div>
            
            {/* Auteurs et année */}
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              {entry.authors && (
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[200px]">{entry.authors.split(' and ')[0]}{entry.authors.includes(' and ') ? ' et al.' : ''}</span>
                </span>
              )}
              {entry.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {entry.year}
                </span>
              )}
            </div>
            
            {/* Journal / Éditeur */}
            {(entry.journal || entry.publisher) && (
              <p className="text-sm text-muted-foreground mt-1 italic truncate">
                {entry.journal || entry.publisher}
              </p>
            )}
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="outline" className="text-xs">
                {entryTypeLabels[type]}
              </Badge>
              {domain && (
                <Badge className={`${domainColors[domain]} text-white text-xs`}>
                  {domainLabels[domain]}
                </Badge>
              )}
              {entry.doi && (
                <Badge variant="secondary" className="text-xs">
                  DOI
                </Badge>
              )}
            </div>
            
            {/* Abstract preview */}
            {entry.abstract && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {entry.abstract}
              </p>
            )}
            
            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={() => onCopyAPA(entry)}>
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copier APA
              </Button>
              {entry.url && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={entry.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Ouvrir
                  </a>
                </Button>
              )}
              {entry.doi && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={`https://doi.org/${entry.doi}`} target="_blank" rel="noopener noreferrer">
                    <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                    DOI
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant principal
export default function BibliographiePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedAxis, setSelectedAxis] = useState<string>("all");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("all");
  const [selectedHasLinks, setSelectedHasLinks] = useState<string>("all"); // 'all' | 'yes' | 'no'
  const [activeTab, setActiveTab] = useState("overview");
  
  // Récupérer les axes de recherche
  const { data: axes = [] } = trpc.researchAxes.list.useQuery({});
  
  // Trouver l'ID de l'axe sélectionné
  const selectedAxisId = useMemo(() => {
    if (selectedAxis === "all") return undefined;
    const axis = axes?.find((a: any) => a.axisCode === selectedAxis);
    return axis?.id;
  }, [selectedAxis, axes]);
  
  // Requêtes tRPC
  const { data: entriesData, isLoading } = trpc.bibliography.list.useQuery({
    search: searchQuery || undefined,
    entryType: selectedType !== "all" ? selectedType : undefined,
    researchDomain: selectedDomain !== "all" ? selectedDomain : undefined,
    readStatus: selectedStatus !== "all" ? selectedStatus : undefined,
    axisId: selectedAxisId,
    entityType: selectedEntityType !== "all" ? selectedEntityType : undefined,
    hasLinks: selectedHasLinks === "yes" ? true : selectedHasLinks === "no" ? false : undefined,
  });
  
  const { data: stats } = trpc.bibliography.getStats.useQuery();
  
  // Extraire les entrées du résultat
  const entries = useMemo(() => {
    if (!entriesData) return [];
    // Handle both array and object with entries property
    if (Array.isArray(entriesData)) return entriesData;
    if (entriesData?.entries) return entriesData?.entries;
    return [];
  }, [entriesData]);
  
  // Copier citation APA
  const copyAPA = useCallback(async (entry: any) => {
    try {
      // Construire citation APA simplifiée
      const authors = entry.authors?.split(' and ').map((a: string) => a.trim()).join(', ') || 'Auteur inconnu';
      const year = entry.year || 'n.d.';
      const title = entry.title;
      const source = entry.journal || entry.publisher || '';
      
      const apa = `${authors} (${year}). ${title}. ${source}`.trim();
      
      await navigator.clipboard.writeText(apa);
      toast.success("Citation APA copiée");
    } catch (error) {
      toast.error("Erreur lors de la copie");
    }
  }, []);
  
  // Liaison LLM
  const [llmOffset, setLlmOffset] = useState(0);
  const [llmResults, setLlmResults] = useState<any>(null);
  const [llmRunning, setLlmRunning] = useState(false);
  const autoLinkMutation = trpc.bibliography.autoLinkByLLM.useMutation({
    onSuccess: (data) => {
      setLlmResults(data);
      setLlmOffset(prev => prev + data.processed);
      setLlmRunning(false);
      if (data.linked > 0) {
        toast.success(`${data.linked} liaison(s) créée(s) pour ${data.processed} référence(s)`);
      } else {
        toast.info(`Batch traité : ${data.processed} référence(s), aucune liaison trouvée`);
      }
    },
    onError: (err) => {
      setLlmRunning(false);
      toast.error('Erreur LLM : ' + err.message);
    },
  });
  const handleAutoLink = () => {
    setLlmRunning(true);
    autoLinkMutation.mutate({ batchSize: 10, offset: llmOffset });
  };

  // Export BibTeX
  const utils = trpc.useUtils();
  const handleExportBibTeX = async () => {
    try {
      const result = await utils.bibliography.exportBibTeX.fetch(undefined);
      const blob = new Blob([result], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "perfumum_bibliography.bib";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export BibTeX téléchargé");
    } catch (error) {
      toast.error("Erreur lors de l'export");
    }
  };
  
  // Références récentes
  const recentEntries = useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [entries]);
  
  // Références par domaine pour la vue réseau
  const entriesByDomain = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    entries.forEach((entry: any) => {
      const domain = entry.researchDomain || 'autre';
      if (!grouped[domain]) grouped[domain] = [];
      grouped[domain].push(entry);
    });
    return grouped;
  }, [entries]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          {/* En-tête */}
          <div className="max-w-4xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <Library className="h-4 w-4" />
              Base de connaissances
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Bibliographie
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorez les sources scientifiques et académiques qui fondent la recherche PERFUMUM.
              Une collection vivante de références sur la parfumerie, la botanique et la chimie olfactive.
            </p>
          </div>
          
          {/* Onglets principaux */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="overview" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Vue d'ensemble</span>
                </TabsTrigger>
                <TabsTrigger value="browse" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Parcourir</span>
                </TabsTrigger>
                <TabsTrigger value="domains" className="gap-2">
                  <Network className="h-4 w-4" />
                  <span className="hidden sm:inline">Par domaine</span>
                </TabsTrigger>
                <TabsTrigger value="timeline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Chronologie</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Link href="/reseau-axes">
                  <Button variant="outline" size="sm">
                    <Network className="h-4 w-4 mr-2" />
                    Réseau d'axes
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleExportBibTeX}>
                  <Download className="h-4 w-4 mr-2" />
                  Export BibTeX
                </Button>
                {user && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAutoLink}
                    disabled={llmRunning}
                    className="border-violet-500/30 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/20"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {llmRunning ? 'Analyse en cours...' : `Enrichir par IA (offset: ${llmOffset})`}
                  </Button>
                )}
                <Link href="/bibliographie-globale">
                  <Button size="sm">
                    Gestion avancée
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Vue d'ensemble */}
            <TabErrorBoundary>
            <TabsContent value="overview" className="space-y-8">
              {/* Statistiques */}
              <StatsOverview stats={stats} />
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Domaines de recherche */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-primary" />
                      Domaines de recherche
                    </CardTitle>
                    <CardDescription>
                      Répartition des références par thématique
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats?.byDomain && <DomainCloud data={stats?.byDomain} />}
                  </CardContent>
                </Card>
                
                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Publications par année
                    </CardTitle>
                    <CardDescription>
                      Évolution temporelle de la bibliographie
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats?.byYear && <PublicationTimeline data={stats?.byYear} />}
                  </CardContent>
                </Card>
              </div>
              
              {/* Références récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Ajouts récents
                  </CardTitle>
                  <CardDescription>
                    Les dernières références ajoutées à la bibliothèque
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentEntries.length > 0 ? (
                    recentEntries.map((entry: any) => (
                      <ReferenceCard key={entry.id} entry={entry} onCopyAPA={copyAPA} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Library className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune référence dans la bibliothèque</p>
                      <Link href="/bibliographie-globale">
                        <Button variant="link" className="mt-2">
                          Ajouter des références
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            </TabErrorBoundary>
            
            {/* Parcourir */}
            <TabErrorBoundary>
            <TabsContent value="browse" className="space-y-6">
              {/* Filtres */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher par titre, auteur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedAxis} onValueChange={setSelectedAxis}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Axe de recherche" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les axes</SelectItem>
                        {Object.entries(axisConfig).map(([code, config]) => (
                          <SelectItem key={code} value={code}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: config.color }}
                              />
                              {code} - {config.shortName}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-full md:w-[140px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        {Object.entries(entryTypeLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                      <SelectTrigger className="w-full md:w-[140px]">
                        <SelectValue placeholder="Domaine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous domaines</SelectItem>
                        {Object.entries(domainLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full md:w-[120px]">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous statuts</SelectItem>
                        {Object.entries(readStatusConfig).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                      <SelectTrigger className="w-full md:w-[150px]">
                        <SelectValue placeholder="Entité liée" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes entités</SelectItem>
                        <SelectItem value="plant">🌿 Plantes</SelectItem>
                        <SelectItem value="molecule">🔬 Molécules</SelectItem>
                        <SelectItem value="variety">🌱 Variétés</SelectItem>
                        <SelectItem value="recette">🧪 Recettes</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedHasLinks} onValueChange={setSelectedHasLinks}>
                      <SelectTrigger className="w-full md:w-[140px]">
                        <SelectValue placeholder="Liaisons" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes refs</SelectItem>
                        <SelectItem value="yes">✅ Avec liaisons</SelectItem>
                        <SelectItem value="no">⚠️ Sans liaisons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Indicateur d'axe sélectionné */}
                  {selectedAxis !== "all" && axisConfig[selectedAxis] && (
                    <div className="mt-4 p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                      <div 
                        className={`p-2 rounded-lg text-white ${axisConfig[selectedAxis].bgColor}`}
                      >
                        {axisConfig[selectedAxis].icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{selectedAxis}: {axisConfig[selectedAxis].name}</p>
                        <p className="text-xs text-muted-foreground">
                          {entries.length} référence{entries.length > 1 ? 's' : ''} dans cet axe
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedAxis("all")}
                      >
                        Effacer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Liste des références */}
              {isLoading ? (
                <div className="grid gap-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-5">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-muted rounded-lg" />
                          <div className="flex-1 space-y-3">
                            <div className="h-5 bg-muted rounded w-3/4" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                            <div className="h-3 bg-muted rounded w-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : entries.length > 0 ? (
                <div className="grid gap-4">
                  {entries.map((entry: any) => (
                    <ReferenceCard key={entry.id} entry={entry} onCopyAPA={copyAPA} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Aucune référence trouvée</p>
                    {(searchQuery || selectedType !== "all" || selectedDomain !== "all" || selectedAxis !== "all") && (
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedType("all");
                          setSelectedDomain("all");
                          setSelectedStatus("all");
                          setSelectedAxis("all");
                        }}
                      >
                        Réinitialiser les filtres
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            </TabErrorBoundary>
            
            {/* Par domaine */}
            <TabErrorBoundary>
            <TabsContent value="domains" className="space-y-6">
              {Object.entries(entriesByDomain).map(([domain, domainEntries]) => {
                const d = domain as ResearchDomain;
                return (
                  <Card key={domain}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${domainColors[d]} text-white`}>
                          {domainIcons[d]}
                        </div>
                        <div>
                          <CardTitle>{domainLabels[d] || domain}</CardTitle>
                          <CardDescription>{domainEntries.length} référence{domainEntries.length > 1 ? 's' : ''}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {domainEntries.slice(0, 3).map((entry: any) => (
                        <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <span className="text-muted-foreground shrink-0">
                            {entryTypeIcons[entry.entryType as EntryType]}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{entry.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {entry.authors?.split(' and ')[0]} {entry.year && `(${entry.year})`}
                            </p>
                          </div>
                        </div>
                      ))}
                      {domainEntries.length > 3 && (
                        <Button 
                          variant="ghost" 
                          className="w-full" 
                          onClick={() => {
                            setSelectedDomain(domain);
                            setActiveTab("browse");
                          }}
                        >
                          Voir les {domainEntries.length - 3} autres
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              
              {Object.keys(entriesByDomain).length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Network className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Aucune référence classée par domaine</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            </TabErrorBoundary>
            
            {/* Chronologie */}
            <TabErrorBoundary>
            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Chronologie des publications</CardTitle>
                  <CardDescription>
                    Visualisez l'évolution de la littérature scientifique au fil du temps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.byYear && (
                    <div className="space-y-8">
                      <PublicationTimeline data={stats?.byYear} />
                      
                      <div className="space-y-4 mt-8">
                        {stats?.byYear
                          .filter((y: any) => y.year !== null)
                          .sort((a: any, b: any) => (b.year || 0) - (a.year || 0))
                          .slice(0, 10)
                          .map((yearData: any) => {
                            const yearEntries = entries.filter((e: any) => e.year === yearData.year);
                            return (
                              <div key={yearData.year} className="relative pl-8 pb-6 border-l-2 border-primary/20 last:pb-0">
                                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary" />
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-xl font-bold text-primary">{yearData.year}</span>
                                  <Badge variant="secondary">{yearData.count} publication{yearData.count > 1 ? 's' : ''}</Badge>
                                </div>
                                <div className="space-y-2">
                                  {yearEntries.slice(0, 3).map((entry: any) => (
                                    <div key={entry.id} className="p-3 rounded-lg bg-muted/50">
                                      <p className="font-medium line-clamp-1">{entry.title}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {entry.authors?.split(' and ')[0]}
                                        {entry.journal && ` — ${entry.journal}`}
                                      </p>
                                    </div>
                                  ))}
                                  {yearEntries.length > 3 && (
                                    <p className="text-sm text-muted-foreground pl-3">
                                      + {yearEntries.length - 3} autres publications
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            </TabErrorBoundary>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
