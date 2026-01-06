import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  Brain, 
  Leaf, 
  Heart, 
  Archive, 
  Bot, 
  ChevronRight, 
  Search,
  BookOpen,
  Beaker,
  Lightbulb,
  FileText,
  Clock
} from "lucide-react";

// Mapping des icônes par code d'axe
const axisIcons: Record<string, React.ReactNode> = {
  AX1: <Brain className="h-8 w-8" />,
  AX2: <Leaf className="h-8 w-8" />,
  AX3: <Heart className="h-8 w-8" />,
  AX4: <Archive className="h-8 w-8" />,
  AX5: <Bot className="h-8 w-8" />,
};

// Couleurs de fond par axe
const axisBackgrounds: Record<string, string> = {
  AX1: "from-violet-500/20 to-purple-600/20",
  AX2: "from-emerald-500/20 to-green-600/20",
  AX3: "from-amber-500/20 to-yellow-600/20",
  AX4: "from-red-500/20 to-rose-600/20",
  AX5: "from-blue-500/20 to-indigo-600/20",
};

export default function ResearchAxes() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: axes, isLoading: axesLoading } = trpc.researchAxes.list.useQuery();
  const { data: entriesData, isLoading: entriesLoading } = trpc.researchEntries.list.useQuery({});
  
  // Compter les entrées par axe
  const entriesByAxis = entriesData?.reduce((acc, item) => {
    const axisId = item.entry.primaryAxisId;
    acc[axisId] = (acc[axisId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>) || {};
  
  // Filtrer les axes par recherche
  const filteredAxes = axes?.filter(axis => 
    axis.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    axis.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    axis.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Récupérer les dernières entrées
  const recentEntries = entriesData?.slice(0, 5) || [];

  return (
    <div className="container py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20">
            <Beaker className="h-8 w-8 text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Axes de Recherche</h1>
            <p className="text-muted-foreground">
              Les 5 axes fondamentaux du projet PERFUMUM
            </p>
          </div>
        </div>
        
        {/* Barre de recherche */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un axe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Grille des axes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {axesLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-3/4 mt-4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          filteredAxes?.map((axis) => {
            const keyTopics = axis.keyTopics ? JSON.parse(axis.keyTopics) : [];
            const entryCount = entriesByAxis[axis.id] || 0;
            
            return (
              <Link key={axis.id} href={`/axes-recherche/${axis.code.toLowerCase()}`}>
                <Card className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br ${axisBackgrounds[axis.code] || "from-gray-500/20 to-gray-600/20"}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div 
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: `${axis.color}20` }}
                      >
                        <span style={{ color: axis.color }}>
                          {axisIcons[axis.code] || <Lightbulb className="h-8 w-8" />}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {entryCount} entrée{entryCount !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 flex items-center gap-2">
                      <span>{axis.emoji}</span>
                      <span>{axis.shortName}</span>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {axis.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {axis.description}
                    </p>
                    
                    {/* Tags des sujets clés */}
                    <div className="flex flex-wrap gap-1.5">
                      {keyTopics.slice(0, 4).map((topic: string, i: number) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className="text-xs"
                          style={{ borderColor: `${axis.color}40`, color: axis.color }}
                        >
                          {topic}
                        </Badge>
                      ))}
                      {keyTopics.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{keyTopics.length - 4}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-end mt-4 text-sm text-muted-foreground">
                      <span>Explorer</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
      
      {/* Section des entrées récentes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Entrées récentes
          </h2>
          <Link href="/axes-recherche/entries">
            <Button variant="ghost" size="sm">
              Voir tout
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        {entriesLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : recentEntries.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Aucune entrée de recherche pour le moment.
            </p>
            <Link href="/axes-recherche/new">
              <Button className="mt-4">
                Créer une première entrée
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentEntries.map((item) => (
              <Link key={item.entry.id} href={`/axes-recherche/entry/${item.entry.id}`}>
                <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-2 rounded-lg shrink-0"
                      style={{ backgroundColor: `${item.axis?.color || '#666'}20` }}
                    >
                      <span style={{ color: item.axis?.color }}>
                        {axisIcons[item.axis?.code || ''] || <FileText className="h-5 w-5" />}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{item.entry.title}</h3>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {item.entry.entryType}
                        </Badge>
                      </div>
                      {item.entry.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.entry.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{item.axis?.emoji} {item.axis?.shortName}</span>
                        <span>•</span>
                        <span>
                          {new Date(item.entry.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
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
      
      {/* Liens rapides */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/bibliographie-globale">
          <Card className="p-6 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/20">
                <BookOpen className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold">Bibliographie</h3>
                <p className="text-sm text-muted-foreground">
                  Toutes les sources du projet PERFUMUM
                </p>
              </div>
              <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
            </div>
          </Card>
        </Link>
        
        <Link href="/axes-recherche/new">
          <Card className="p-6 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Lightbulb className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold">Nouvelle entrée</h3>
                <p className="text-sm text-muted-foreground">
                  Ajouter une note de recherche
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
