import { useState } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  Leaf, 
  Heart, 
  Archive, 
  Bot, 
  ChevronLeft, 
  Search,
  Plus,
  FileText,
  Filter,
  Clock,
  Star,
  Lightbulb,
  BookOpen,
  Beaker,
  Eye,
  Pencil
} from "lucide-react";

// Mapping des icônes par code d'axe
const axisIcons: Record<string, React.ReactNode> = {
  AX1: <Brain className="h-10 w-10" />,
  AX2: <Leaf className="h-10 w-10" />,
  AX3: <Heart className="h-10 w-10" />,
  AX4: <Archive className="h-10 w-10" />,
  AX5: <Bot className="h-10 w-10" />,
};

// Types d'entrées avec icônes
const entryTypeIcons: Record<string, React.ReactNode> = {
  note: <FileText className="h-4 w-4" />,
  synthesis: <BookOpen className="h-4 w-4" />,
  experiment: <Beaker className="h-4 w-4" />,
  observation: <Eye className="h-4 w-4" />,
  hypothesis: <Lightbulb className="h-4 w-4" />,
  discovery: <Star className="h-4 w-4" />,
  review: <BookOpen className="h-4 w-4" />,
  methodology: <Pencil className="h-4 w-4" />,
  protocol: <FileText className="h-4 w-4" />,
  analysis: <Beaker className="h-4 w-4" />,
};

const entryTypeLabels: Record<string, string> = {
  note: "Note",
  synthesis: "Synthèse",
  experiment: "Expérience",
  observation: "Observation",
  hypothesis: "Hypothèse",
  discovery: "Découverte",
  review: "Revue",
  methodology: "Méthodologie",
  protocol: "Protocole",
  analysis: "Analyse",
};

const statusLabels: Record<string, string> = {
  draft: "Brouillon",
  in_progress: "En cours",
  completed: "Terminé",
  archived: "Archivé",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/20 text-gray-400",
  in_progress: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  archived: "bg-amber-500/20 text-amber-400",
};

export default function ResearchAxisDetail() {
  const params = useParams<{ code: string }>();
  const axisCode = params.code?.toUpperCase() || "";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { data: axis, isLoading: axisLoading } = trpc.researchAxes.getByCode.useQuery({ code: axisCode });
  const { data: entriesData, isLoading: entriesLoading } = trpc.researchEntries.list.useQuery(
    axis ? { axisId: axis.id } : undefined,
    { enabled: !!axis }
  );
  
  // Filtrer les entrées
  const filteredEntries = entriesData?.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.entry.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.entry.entryType === typeFilter;
    const matchesStatus = statusFilter === "all" || item.entry.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  }) || [];
  
  // Statistiques
  const stats = {
    total: entriesData?.length || 0,
    completed: entriesData?.filter(e => e.entry.status === "completed").length || 0,
    inProgress: entriesData?.filter(e => e.entry.status === "in_progress").length || 0,
    pinned: entriesData?.filter(e => e.entry.isPinned).length || 0,
  };
  
  const keyTopics = axis?.keyTopics ? JSON.parse(axis.keyTopics) : [];

  if (axisLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-6 w-96 mb-8" />
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!axis) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Axe non trouvé</h1>
        <p className="text-muted-foreground mb-4">
          L'axe de recherche "{axisCode}" n'existe pas.
        </p>
        <Link href="/axes-recherche">
          <Button>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour aux axes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Navigation */}
      <Link href="/axes-recherche">
        <Button variant="ghost" size="sm" className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Axes de recherche
        </Button>
      </Link>
      
      {/* En-tête de l'axe */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div 
            className="p-4 rounded-2xl"
            style={{ backgroundColor: `${axis.color}20` }}
          >
            <span style={{ color: axis.color }}>
              {axisIcons[axis.code] || <Lightbulb className="h-10 w-10" />}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">
                {axis.emoji} {axis.name}
              </h1>
              <Badge 
                variant="outline"
                style={{ borderColor: axis.color, color: axis.color }}
              >
                {axis.code}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {axis.description}
            </p>
          </div>
        </div>
        
        {/* Tags des sujets clés */}
        <div className="flex flex-wrap gap-2 mb-6">
          {keyTopics.map((topic: string, i: number) => (
            <Badge 
              key={i} 
              variant="secondary"
              className="text-sm"
            >
              {topic}
            </Badge>
          ))}
        </div>
        
        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/20">
                <FileText className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Entrées totales</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Star className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Terminées</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">En cours</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Star className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pinned}</p>
                <p className="text-xs text-muted-foreground">Épinglées</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Barre d'outils */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une entrée..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {Object.entries(entryTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Link href={`/axes-recherche/new?axis=${axis.code}`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle entrée
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Liste des entrées */}
      {entriesLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucune entrée</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || typeFilter !== "all" || statusFilter !== "all"
              ? "Aucune entrée ne correspond à vos critères de recherche."
              : "Cet axe de recherche n'a pas encore d'entrées."}
          </p>
          <Link href={`/axes-recherche/new?axis=${axis.code}`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer la première entrée
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((item) => (
            <Link key={item.entry.id} href={`/axes-recherche/entry/${item.entry.id}`}>
              <Card className="p-6 cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-xl shrink-0"
                    style={{ backgroundColor: `${axis.color}15` }}
                  >
                    <span style={{ color: axis.color }}>
                      {entryTypeIcons[item.entry.entryType] || <FileText className="h-5 w-5" />}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {item.entry.isPinned && (
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      )}
                      <h3 className="font-semibold text-lg truncate">
                        {item.entry.title}
                      </h3>
                    </div>
                    
                    {item.entry.summary && (
                      <p className="text-muted-foreground line-clamp-2 mb-3">
                        {item.entry.summary}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 text-sm">
                      <Badge variant="outline" className="text-xs">
                        {entryTypeLabels[item.entry.entryType] || item.entry.entryType}
                      </Badge>
                      <Badge className={`text-xs ${statusColors[item.entry.status]}`}>
                        {statusLabels[item.entry.status] || item.entry.status}
                      </Badge>
                      <span className="text-muted-foreground">
                        {new Date(item.entry.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
