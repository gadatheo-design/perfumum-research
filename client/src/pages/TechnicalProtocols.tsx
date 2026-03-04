// @ts-nocheck
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Beaker, Clock, Target } from "lucide-react";

export default function TechnicalProtocols() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [difficulty, setDifficulty] = useState<string | undefined>();

  const { data, isLoading } = trpc.protocols.getAll.useQuery({
    search: search || undefined,
    category: category === "all" ? undefined : category,
    difficultyLevel: difficulty === "all" ? undefined : difficulty as any,
    limit: 50,
  });

  const { data: stats } = trpc.protocols.getStats.useQuery();
  const { data: categories } = trpc.protocols.getCategories.useQuery();

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "débutant": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "intermédiaire": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "avancé": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "expert": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Protocoles Techniques</h1>
        <p className="text-muted-foreground">
          Méthodes et procédures pour la préparation des matières premières
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Protocoles</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{stats.byCategory?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Catégories</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">
                {stats.byDifficulty?.find((d: any) => d.difficulty_level === "expert")?.count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Protocoles Expert</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un protocole..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category || "all"} onValueChange={(v) => setCategory(v === "all" ? undefined : v)}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {categories?.map((c: any) => (
              <SelectItem key={c.category} value={c.category}>
                {c.category} ({c.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty || "all"} onValueChange={(v) => setDifficulty(v === "all" ? undefined : v)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Difficulté" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes difficultés</SelectItem>
            <SelectItem value="débutant">Débutant</SelectItem>
            <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
            <SelectItem value="avancé">Avancé</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-card/50">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.protocols.map((protocol: any) => (
            <Link key={protocol.id} href={`/protocoles/${protocol.slug}`}>
              <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{protocol.name}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {protocol.category && (
                      <Badge variant="outline">{protocol.category}</Badge>
                    )}
                    {protocol.difficulty_level && (
                      <Badge variant="outline" className={getDifficultyColor(protocol.difficulty_level)}>
                        {protocol.difficulty_level}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {protocol.objective && (
                    <div className="flex items-start gap-2 text-sm">
                      <Target className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-muted-foreground line-clamp-2">{protocol.objective}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
                    {protocol.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{protocol.duration}</span>
                      </div>
                    )}
                    {protocol.estimated_cost && (
                      <span>€{protocol.estimated_cost}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && data?.protocols.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun protocole trouvé</p>
        </div>
      )}
    </div>
  );
}
