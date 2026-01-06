import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  BookOpen, 
  Search,
  Plus,
  FileText,
  Filter,
  Download,
  ExternalLink,
  Copy,
  Calendar,
  User,
  Building,
  Globe,
  Hash,
  Star,
  BarChart3,
  ChevronRight
} from "lucide-react";

// Types de sources avec labels
const sourceTypeLabels: Record<string, string> = {
  scientific_paper: "Article scientifique",
  book: "Livre",
  book_chapter: "Chapitre de livre",
  thesis: "Thèse",
  conference: "Conférence",
  patent: "Brevet",
  report: "Rapport",
  article: "Article de presse",
  website: "Site web",
  database: "Base de données",
  podcast: "Podcast",
  video: "Vidéo",
  interview: "Interview",
  archive: "Archive",
  dataset: "Jeu de données",
  software: "Logiciel",
  other: "Autre",
};

const sourceTypeIcons: Record<string, React.ReactNode> = {
  scientific_paper: <FileText className="h-4 w-4" />,
  book: <BookOpen className="h-4 w-4" />,
  book_chapter: <BookOpen className="h-4 w-4" />,
  thesis: <FileText className="h-4 w-4" />,
  conference: <User className="h-4 w-4" />,
  patent: <Hash className="h-4 w-4" />,
  report: <FileText className="h-4 w-4" />,
  article: <FileText className="h-4 w-4" />,
  website: <Globe className="h-4 w-4" />,
  database: <BarChart3 className="h-4 w-4" />,
  podcast: <FileText className="h-4 w-4" />,
  video: <FileText className="h-4 w-4" />,
  interview: <User className="h-4 w-4" />,
  archive: <FileText className="h-4 w-4" />,
  dataset: <BarChart3 className="h-4 w-4" />,
  software: <Hash className="h-4 w-4" />,
  other: <FileText className="h-4 w-4" />,
};

export default function BibliographyGlobal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  
  const { data: sources, isLoading } = trpc.bibliography.list.useQuery({
    sourceType: typeFilter !== "all" ? typeFilter : undefined,
    year: yearFilter !== "all" ? parseInt(yearFilter) : undefined,
    search: searchQuery || undefined,
  });
  
  const { data: stats } = trpc.bibliography.stats.useQuery();
  const { data: bibtexExport } = trpc.bibliography.exportBibtex.useQuery(
    { sourceIds: selectedSources.length > 0 ? selectedSources : undefined },
    { enabled: false }
  );
  
  // Années uniques pour le filtre
  const years = stats?.byYear?.map(y => y.year).filter(Boolean).sort((a, b) => (b || 0) - (a || 0)) || [];
  
  // Copier le BibTeX
  const copyBibtex = async (bibtex: string) => {
    await navigator.clipboard.writeText(bibtex);
    toast.success("Citation BibTeX copiée !");
  };
  
  // Toggle sélection
  const toggleSelection = (id: number) => {
    setSelectedSources(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="container py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
            <BookOpen className="h-8 w-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Bibliographie</h1>
            <p className="text-muted-foreground">
              Toutes les sources du projet PERFUMUM
            </p>
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/20">
                <FileText className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
                <p className="text-xs text-muted-foreground">Sources totales</p>
              </div>
            </div>
          </Card>
          
          {stats?.byType?.slice(0, 3).map((item, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  {sourceTypeIcons[item.type] || <FileText className="h-5 w-5 text-blue-400" />}
                </div>
                <div>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {sourceTypeLabels[item.type] || item.type}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Barre d'outils */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre, auteur, résumé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {Object.entries(sourceTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[120px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedSources.length > 0 && (
            <Button variant="outline" onClick={() => {
              // Export BibTeX des sources sélectionnées
              toast.info("Export en cours...");
            }}>
              <Download className="h-4 w-4 mr-2" />
              Exporter ({selectedSources.length})
            </Button>
          )}
          
          <Link href="/bibliographie-globale/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Liste des sources */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : !sources || sources.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucune source</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || typeFilter !== "all" || yearFilter !== "all"
              ? "Aucune source ne correspond à vos critères."
              : "La bibliographie est vide pour le moment."}
          </p>
          <Link href="/bibliographie-globale/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une première source
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {sources.map((source) => {
            const authors = source.authors ? 
              (typeof source.authors === 'string' ? JSON.parse(source.authors) : source.authors) : [];
            const authorStr = Array.isArray(authors) 
              ? authors.map((a: any) => typeof a === 'string' ? a : a.name).join(', ')
              : authors;
            
            return (
              <Card 
                key={source.id} 
                className={`p-6 transition-colors ${selectedSources.includes(source.id) ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox de sélection */}
                  <div 
                    className="mt-1 cursor-pointer"
                    onClick={() => toggleSelection(source.id)}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedSources.includes(source.id) 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground/30 hover:border-primary'
                    }`}>
                      {selectedSources.includes(source.id) && (
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  {/* Icône du type */}
                  <div className="p-3 rounded-xl bg-amber-500/10 shrink-0">
                    <span className="text-amber-500">
                      {sourceTypeIcons[source.sourceType] || <FileText className="h-5 w-5" />}
                    </span>
                  </div>
                  
                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-lg leading-tight">
                        {source.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {source.isVerified && (
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                            <Star className="h-3 w-3 mr-1" />
                            Vérifié
                          </Badge>
                        )}
                        {source.relevanceScore && (
                          <Badge variant="outline" className="text-xs">
                            Score: {source.relevanceScore}/10
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Métadonnées */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                      {authorStr && (
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {authorStr}
                        </span>
                      )}
                      {source.publicationYear && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {source.publicationYear}
                        </span>
                      )}
                      {source.journal && (
                        <span className="flex items-center gap-1">
                          <Building className="h-3.5 w-3.5" />
                          {source.journal}
                        </span>
                      )}
                    </div>
                    
                    {/* Résumé */}
                    {source.abstract && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {source.abstract}
                      </p>
                    )}
                    
                    {/* Actions et identifiants */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {sourceTypeLabels[source.sourceType] || source.sourceType}
                      </Badge>
                      
                      {source.doi && (
                        <a 
                          href={`https://doi.org/${source.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                        >
                          DOI: {source.doi}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      
                      {source.url && !source.doi && (
                        <a 
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                        >
                          Lien
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      
                      {source.citationBibtex && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => copyBibtex(source.citationBibtex!)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          BibTeX
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Liens rapides */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/axes-recherche">
          <Card className="p-6 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-500/20">
                <FileText className="h-6 w-6 text-violet-500" />
              </div>
              <div>
                <h3 className="font-semibold">Axes de recherche</h3>
                <p className="text-sm text-muted-foreground">
                  Explorer les 5 axes du projet
                </p>
              </div>
              <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
            </div>
          </Card>
        </Link>
        
        <Link href="/outils/export-bibliographique">
          <Card className="p-6 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Download className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold">Export avancé</h3>
                <p className="text-sm text-muted-foreground">
                  Exporter en BibTeX, APA, etc.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
