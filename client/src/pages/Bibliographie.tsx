// @ts-nocheck
/**
 * Page Bibliographie — Version améliorée et connectée
 * Hub central des références bibliographiques avec connexions vers les autres entités
 */

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";
import { 
  Search, 
  BookOpen, 
  ExternalLink, 
  Tag, 
  Calendar,
  Network,
  List,
  Grid,
  FileText,
  Database,
  Beaker,
  Leaf,
  Dna,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Globe,
  FlaskConical,
  BookMarked,
  GraduationCap,
  Layers,
  ChevronRight,
  Star,
  Eye,
  Clock
} from "lucide-react";

// Types
interface Reference {
  id: number;
  entryKey: string;
  entryType: string;
  title: string;
  authors: string | null;
  year: number | null;
  containerTitle: string | null;
  doi: string | null;
  url: string | null;
  notes: string | null;
  tags: string[] | string | null;
  axisPrimaryCode: string | null;
  axisPrimaryId: number | null;
  axesSecondary: string[] | string | null;
  readStatus: string;
  relevanceScore: number | null;
  packVersion?: string | null;
}

interface ThematicAxis {
  id: number;
  axisCode: string;
  name: string;
  description: string | null;
  metaAxis: string;
  color: string | null;
}

// Couleurs par méta-axe
const META_AXIS_COLORS: Record<string, string> = {
  meta_a: "#F59E0B",
  meta_b: "#EC4899",
  meta_c: "#06B6D4",
  other: "#22C55E",
};

const META_AXIS_LABELS: Record<string, string> = {
  meta_a: "Heritage & Archives",
  meta_b: "Arts & Chimie",
  meta_c: "Digital & Datasets",
  other: "Génomique",
};

const META_AXIS_DESCRIPTIONS: Record<string, string> = {
  meta_a: "Patrimoine olfactif, traditions, archives historiques",
  meta_b: "Création artistique, chimie des parfums, formulation",
  meta_c: "Données numériques, bases de données, analyses computationnelles",
  other: "Génomique, biotechnologie, études moléculaires",
};

// Icônes par type de référence
const TYPE_ICONS: Record<string, React.ReactNode> = {
  article: <FileText className="w-4 h-4" />,
  book: <BookOpen className="w-4 h-4" />,
  website: <Database className="w-4 h-4" />,
  thesis: <GraduationCap className="w-4 h-4" />,
  chapter: <BookMarked className="w-4 h-4" />,
  report: <FileText className="w-4 h-4" />,
};

const TYPE_LABELS: Record<string, string> = {
  article: "Article scientifique",
  book: "Livre",
  website: "Site web / Base de données",
  thesis: "Thèse / Mémoire",
  chapter: "Chapitre de livre",
  report: "Rapport",
};

// Statuts de lecture
const READ_STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  unread: { label: "Non lu", color: "bg-slate-500", icon: <Clock className="w-3 h-3" /> },
  reading: { label: "En cours", color: "bg-amber-500", icon: <Eye className="w-3 h-3" /> },
  read: { label: "Lu", color: "bg-green-500", icon: <Star className="w-3 h-3" /> },
  reference: { label: "Référence", color: "bg-purple-500", icon: <BookMarked className="w-3 h-3" /> },
};

// Liens connexes suggérés
const RELATED_LINKS = [
  { title: "Graphe Références-Axes", path: "/graphe-references-axes", icon: <Network className="w-4 h-4" />, description: "Visualiser les connexions" },
  { title: "Axes Thématiques", path: "/axes-thematiques", icon: <Layers className="w-4 h-4" />, description: "Explorer les axes" },
  { title: "Export BibTeX", path: "/outils/export-bibliographique", icon: <FileText className="w-4 h-4" />, description: "Exporter les références" },
  { title: "Recherche Avancée", path: "/recherche-avancee", icon: <Search className="w-4 h-4" />, description: "Recherche multi-critères" },
];

function parseTags(tags: string[] | string | null): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return tags.split(",").map(t => t.trim()).filter(Boolean);
  }
}

function ReferenceCard({ 
  reference, 
  axes, 
  onClick,
  compact = false 
}: { 
  reference: Reference; 
  axes: ThematicAxis[] | undefined;
  onClick: () => void;
  compact?: boolean;
}) {
  const axisInfo = axes?.find(a => a.axisCode === reference.axisPrimaryCode);
  const tags = parseTags(reference.tags);
  const readStatus = READ_STATUS_CONFIG[reference.readStatus] || READ_STATUS_CONFIG.unread;
  
  if (compact) {
    return (
      <Card 
        className="group cursor-pointer hover:border-primary/30 transition-all"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors shrink-0">
              {TYPE_ICONS[reference.entryType] || <FileText className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {reference.title}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {reference.authors} {reference.year && `(${reference.year})`}
              </p>
            </div>
            {reference.axisPrimaryCode && (
              <Badge 
                variant="outline" 
                className="text-xs shrink-0"
                style={{ 
                  borderColor: axisInfo?.color || META_AXIS_COLORS[axisInfo?.metaAxis || "other"],
                  color: axisInfo?.color || META_AXIS_COLORS[axisInfo?.metaAxis || "other"]
                }}
              >
                {reference.axisPrimaryCode}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors shrink-0">
            {TYPE_ICONS[reference.entryType] || <FileText className="w-5 h-5" />}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title & Meta */}
            <div>
              <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
                {reference.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {reference.authors}
                {reference.year && <span className="ml-2">({reference.year})</span>}
              </p>
              {reference.containerTitle && (
                <p className="text-xs text-muted-foreground/70 mt-0.5 italic truncate">
                  {reference.containerTitle}
                </p>
              )}
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {reference.axisPrimaryCode && (
                <Link href={`/axes-thematiques?axis=${reference.axisPrimaryCode}`} onClick={e => e.stopPropagation()}>
                  <Badge 
                    variant="outline" 
                    className="text-xs hover:bg-primary/10 transition-colors cursor-pointer"
                    style={{ 
                      borderColor: axisInfo?.color || META_AXIS_COLORS[axisInfo?.metaAxis || "other"],
                      color: axisInfo?.color || META_AXIS_COLORS[axisInfo?.metaAxis || "other"]
                    }}
                  >
                    <Layers className="w-3 h-3 mr-1" />
                    {reference.axisPrimaryCode}
                  </Badge>
                </Link>
              )}
              
              <Badge variant="secondary" className="text-xs">
                {TYPE_LABELS[reference.entryType] || reference.entryType}
              </Badge>
              
              <Badge 
                variant="outline" 
                className={`text-xs ${readStatus.color} text-white border-0`}
              >
                {readStatus.icon}
                <span className="ml-1">{readStatus.label}</span>
              </Badge>
              
              {reference.relevanceScore && reference.relevanceScore >= 80 && (
                <Badge variant="default" className="text-xs bg-amber-500">
                  <Star className="w-3 h-3 mr-1" />
                  Important
                </Badge>
              )}
            </div>
            
            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 4).map((tag, i) => (
                  <span 
                    key={i} 
                    className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 4 && (
                  <span className="text-xs text-muted-foreground">+{tags.length - 4}</span>
                )}
              </div>
            )}
            
            {/* Notes preview */}
            {reference.notes && (
              <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/50 p-2 rounded-lg">
                {reference.notes}
              </p>
            )}
          </div>
          
          {/* Arrow */}
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

function MetaAxisSection({ 
  metaAxis, 
  references, 
  axes,
  onReferenceClick 
}: { 
  metaAxis: string;
  references: Reference[];
  axes: ThematicAxis[] | undefined;
  onReferenceClick: (ref: Reference) => void;
}) {
  const color = META_AXIS_COLORS[metaAxis];
  const label = META_AXIS_LABELS[metaAxis];
  const description = META_AXIS_DESCRIPTIONS[metaAxis];
  const axesInMeta = axes?.filter(a => a.metaAxis === metaAxis) || [];
  
  return (
    <div className="space-y-4">
      <div 
        className="p-4 rounded-xl border"
        style={{ 
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          borderColor: `${color}30`
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${color}20` }}
            >
              <Layers className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color }}>{label}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{references.length} références</Badge>
            <Badge variant="outline">{axesInMeta.length} axes</Badge>
          </div>
        </div>
        
        {/* Axes dans ce méta-axe */}
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t" style={{ borderColor: `${color}20` }}>
          {axesInMeta.map(axis => (
            <Link key={axis.axisCode} href={`/axes-thematiques?axis=${axis.axisCode}`}>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-background/80 transition-colors"
                style={{ borderColor: axis.color || color, color: axis.color || color }}
              >
                {axis.axisCode}: {axis.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {references.slice(0, 6).map(ref => (
          <ReferenceCard 
            key={ref.id} 
            reference={ref} 
            axes={axes}
            onClick={() => onReferenceClick(ref)}
            compact
          />
        ))}
      </div>
      
      {references.length > 6 && (
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/references-v3?metaAxis=${metaAxis}`}>
            Voir les {references.length - 6} autres références
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );
}

export default function Bibliographie() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMetaAxis, setSelectedMetaAxis] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "compact" | "byAxis">("cards");
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  
  // Fetch data
  const { data: references, isLoading: loadingRefs } = trpc.v3References.getAll.useQuery();
  const { data: axes, isLoading: loadingAxes } = trpc.thematicAxes.getAll.useQuery();
  
  // Filter references
  const filteredReferences = useMemo(() => {
    return (references as Reference[] | undefined)?.filter(ref => {
      const matchesSearch = searchQuery === "" || 
        ref.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.authors?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.entryKey?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const axisInfo = (axes as ThematicAxis[] | undefined)?.find(a => a.axisCode === ref.axisPrimaryCode);
      const matchesMetaAxis = selectedMetaAxis === "all" || axisInfo?.metaAxis === selectedMetaAxis;
      const matchesType = selectedType === "all" || ref.entryType === selectedType;
      
      return matchesSearch && matchesMetaAxis && matchesType;
    }) || [];
  }, [references, axes, searchQuery, selectedMetaAxis, selectedType]);
  
  // Group by meta-axis
  const referencesByMetaAxis = useMemo(() => {
    const groups: Record<string, Reference[]> = {
      meta_a: [],
      meta_b: [],
      meta_c: [],
      other: [],
    };
    
    filteredReferences.forEach(ref => {
      const axisInfo = (axes as ThematicAxis[] | undefined)?.find(a => a.axisCode === ref.axisPrimaryCode);
      const metaAxis = axisInfo?.metaAxis || "other";
      if (groups[metaAxis]) {
        groups[metaAxis].push(ref);
      }
    });
    
    return groups;
  }, [filteredReferences, axes]);
  
  // Stats
  const stats = useMemo(() => ({
    total: references?.length || 0,
    articles: references?.filter((r: any) => r.entryType === "article").length || 0,
    books: references?.filter((r: any) => r.entryType === "book").length || 0,
    read: references?.filter((r: any) => r.readStatus === "read").length || 0,
    axes: axes?.length || 0,
  }), [references, axes]);
  
  const getAxisInfo = (code: string | null) => {
    if (!code || !axes) return null;
    return (axes as ThematicAxis[]).find(a => a.axisCode === code);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <Breadcrumbs />
          
          {/* Hero Section */}
          <section className="py-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Bibliographie PERFUMUM</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold">
                  Références{" "}
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    scientifiques
                  </span>
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {stats.total} références organisées par axes thématiques, 
                  connectées aux molécules, plantes et recettes du projet
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3">
                <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <FileText className="w-8 h-8 text-amber-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.articles}</p>
                      <p className="text-xs text-muted-foreground">Articles</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.books}</p>
                      <p className="text-xs text-muted-foreground">Livres</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Star className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.read}</p>
                      <p className="text-xs text-muted-foreground">Lues</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Layers className="w-8 h-8 text-cyan-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.axes}</p>
                      <p className="text-xs text-muted-foreground">Axes</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Related Links */}
            <div className="flex flex-wrap gap-2">
              {RELATED_LINKS.map(link => (
                <Link key={link.path} href={link.path}>
                  <Button variant="outline" size="sm" className="gap-2">
                    {link.icon}
                    {link.title}
                  </Button>
                </Link>
              ))}
            </div>
          </section>
          
          {/* Filters */}
          <section className="py-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre, auteur, clé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={selectedMetaAxis} onValueChange={setSelectedMetaAxis}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Méta-axe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les axes</SelectItem>
                    {Object.entries(META_AXIS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: META_AXIS_COLORS[key] }}
                          />
                          {label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    {Object.entries(TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* View Toggle */}
                <div className="flex gap-1 bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === "cards" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "compact" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("compact")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "byAxis" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("byAxis")}
                  >
                    <Layers className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-3">
              {filteredReferences.length} référence{filteredReferences.length > 1 ? "s" : ""} trouvée{filteredReferences.length > 1 ? "s" : ""}
            </p>
          </section>
          
          {/* Content */}
          {loadingRefs || loadingAxes ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : viewMode === "byAxis" ? (
            /* View by Meta-Axis */
            <div className="space-y-8">
              {Object.entries(referencesByMetaAxis).map(([metaAxis, refs]) => (
                refs.length > 0 && (
                  <MetaAxisSection
                    key={metaAxis}
                    metaAxis={metaAxis}
                    references={refs}
                    axes={axes as ThematicAxis[]}
                    onReferenceClick={setSelectedReference}
                  />
                )
              ))}
            </div>
          ) : viewMode === "compact" ? (
            /* Compact List View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredReferences.map(ref => (
                <ReferenceCard
                  key={ref.id}
                  reference={ref}
                  axes={axes as ThematicAxis[]}
                  onClick={() => setSelectedReference(ref)}
                  compact
                />
              ))}
            </div>
          ) : (
            /* Cards View */
            <div className="space-y-4">
              {filteredReferences.map(ref => (
                <ReferenceCard
                  key={ref.id}
                  reference={ref}
                  axes={axes as ThematicAxis[]}
                  onClick={() => setSelectedReference(ref)}
                />
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {!loadingRefs && filteredReferences.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune référence trouvée</h3>
              <p className="text-muted-foreground mb-4">
                Essayez de modifier vos critères de recherche
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSelectedMetaAxis("all");
                setSelectedType("all");
              }}>
                Réinitialiser les filtres
              </Button>
            </Card>
          )}
        </div>
      </main>
      
      {/* Reference Detail Dialog */}
      <Dialog open={!!selectedReference} onOpenChange={() => setSelectedReference(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedReference && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-primary/10">
                    {TYPE_ICONS[selectedReference.entryType] || <FileText className="w-6 h-6" />}
                  </div>
                  <div>
                    <DialogTitle className="text-xl leading-tight">
                      {selectedReference.title}
                    </DialogTitle>
                    <DialogDescription className="mt-2">
                      {selectedReference.authors}
                      {selectedReference.year && ` (${selectedReference.year})`}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedReference.containerTitle && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Publication</p>
                      <p className="font-medium">{selectedReference.containerTitle}</p>
                    </div>
                  )}
                  {selectedReference.year && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Année</p>
                      <p className="font-medium">{selectedReference.year}</p>
                    </div>
                  )}
                  {selectedReference.entryType && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Type</p>
                      <p className="font-medium">{TYPE_LABELS[selectedReference.entryType] || selectedReference.entryType}</p>
                    </div>
                  )}
                  {selectedReference.doi && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">DOI</p>
                      <a 
                        href={`https://doi.org/${selectedReference.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center gap-1"
                      >
                        {selectedReference.doi}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
                
                {/* Axis Connection */}
                {selectedReference.axisPrimaryCode && (
                  <div className="p-4 rounded-xl bg-muted/50 border">
                    <p className="text-sm text-muted-foreground mb-2">Axe thématique principal</p>
                    <Link href={`/axes-thematiques?axis=${selectedReference.axisPrimaryCode}`}>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-primary/5 transition-colors cursor-pointer">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ 
                            backgroundColor: `${getAxisInfo(selectedReference.axisPrimaryCode)?.color || META_AXIS_COLORS.other}20`
                          }}
                        >
                          <Layers 
                            className="w-5 h-5" 
                            style={{ color: getAxisInfo(selectedReference.axisPrimaryCode)?.color || META_AXIS_COLORS.other }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{selectedReference.axisPrimaryCode}</p>
                          <p className="text-sm text-muted-foreground">
                            {getAxisInfo(selectedReference.axisPrimaryCode)?.name}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </Link>
                  </div>
                )}
                
                {/* Notes */}
                {selectedReference.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="bg-muted/50 p-4 rounded-lg text-sm">
                      {selectedReference.notes}
                    </p>
                  </div>
                )}
                
                {/* Tags */}
                {selectedReference.tags && parseTags(selectedReference.tags).length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {parseTags(selectedReference.tags).map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Related Links */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">Explorer les connexions</p>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/graphe-references-axes`}>
                      <Button variant="outline" size="sm">
                        <Network className="w-4 h-4 mr-2" />
                        Voir dans le graphe
                      </Button>
                    </Link>
                    {selectedReference.axisPrimaryCode && (
                      <Link href={`/axes-thematiques?axis=${selectedReference.axisPrimaryCode}`}>
                        <Button variant="outline" size="sm">
                          <Layers className="w-4 h-4 mr-2" />
                          Explorer l'axe
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {selectedReference.url && (
                    <Button asChild variant="default">
                      <a href={selectedReference.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ouvrir la source
                      </a>
                    </Button>
                  )}
                  {selectedReference.doi && (
                    <Button asChild variant="outline">
                      <a href={`https://doi.org/${selectedReference.doi}`} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" />
                        Voir sur DOI
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
