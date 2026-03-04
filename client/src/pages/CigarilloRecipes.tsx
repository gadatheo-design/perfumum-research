// @ts-nocheck
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Cigarette, Clock, Leaf, FlaskConical } from "lucide-react";

export default function CigarilloRecipes() {
  const [search, setSearch] = useState("");
  const [collection, setCollection] = useState<string | undefined>();
  const [difficulty, setDifficulty] = useState<string | undefined>();

  const { data, isLoading } = trpc.recipes.getAll.useQuery({
    search: search || undefined,
    collection: collection === "all" ? undefined : collection,
    difficultyLevel: difficulty === "all" ? undefined : difficulty as any,
    limit: 50,
  });

  const { data: stats } = trpc.recipes.getStats.useQuery();
  const { data: collections } = trpc.recipes.getCollections.useQuery();

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "débutant": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "intermédiaire": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "avancé": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "expert": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCollectionColor = (coll: string) => {
    if (coll?.includes("Archives")) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    if (coll?.includes("Haute")) return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    if (coll?.includes("Expérimental")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Recettes de Cigarillos</h1>
        <p className="text-muted-foreground">
          Collection de formulations artisanales alliant tabac, cannabis et parfumerie
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Recettes</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{stats.byCollection?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Collections</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{stats.avgMaturationDays || 0}</div>
              <div className="text-sm text-muted-foreground">Jours moy. maturation</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">
                {stats.byDifficulty?.find((d: any) => d.difficulty_level === "expert")?.count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Recettes Expert</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une recette..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={collection || "all"} onValueChange={(v) => setCollection(v === "all" ? undefined : v)}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Collection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes collections</SelectItem>
            {collections?.map((c: any) => (
              <SelectItem key={c.collection} value={c.collection}>
                {c.collection} ({c.count})
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
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.recipes.map((recipe: any) => (
            <Link key={recipe.id} href={`/recettes/${recipe.slug}`}>
              <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Cigarette className="h-5 w-5 text-amber-500" />
                      <CardTitle className="text-lg">{recipe.name}</CardTitle>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recipe.collection && (
                      <Badge variant="outline" className={getCollectionColor(recipe.collection)}>
                        {recipe.collection}
                      </Badge>
                    )}
                    {recipe.difficulty_level && (
                      <Badge variant="outline" className={getDifficultyColor(recipe.difficulty_level)}>
                        {recipe.difficulty_level}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recipe.concept && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {recipe.concept}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    {recipe.cannabis_component && (
                      <div className="flex items-center gap-1 text-green-400">
                        <Leaf className="h-3 w-3" />
                        <span>{recipe.cannabis_percentage}% Cannabis</span>
                      </div>
                    )}
                    {recipe.tobacco_component && (
                      <div className="flex items-center gap-1 text-amber-400">
                        <Cigarette className="h-3 w-3" />
                        <span>{recipe.tobacco_percentage}% Tabac</span>
                      </div>
                    )}
                    {recipe.perfume_component && (
                      <div className="flex items-center gap-1 text-purple-400">
                        <FlaskConical className="h-3 w-3" />
                        <span>{recipe.perfume_percentage}% Parfum</span>
                      </div>
                    )}
                  </div>

                  {recipe.maturation_days && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border/50">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.maturation_days} jours de maturation</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && data?.recipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune recette trouvée</p>
        </div>
      )}
    </div>
  );
}
