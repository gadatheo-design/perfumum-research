import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Leaf, MapPin, Sparkles } from "lucide-react";

export default function CannabisLandraces() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string | undefined>();
  const [conservation, setConservation] = useState<string | undefined>();

  const { data, isLoading } = trpc.landraces.getAll.useQuery({
    search: search || undefined,
    type: type === "all" ? undefined : type as any,
    conservationStatus: conservation === "all" ? undefined : conservation,
    limit: 50,
  });

  const { data: stats } = trpc.landraces.getStats.useQuery();

  const getTypeColor = (t: string) => {
    switch (t) {
      case "indica": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "sativa": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "hybrid": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getConservationColor = (status: string) => {
    switch (status) {
      case "commun": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rare": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "menacé": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "en danger": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Landraces Cannabis</h1>
        <p className="text-muted-foreground">
          Variétés ancestrales de cannabis avec leurs profils terpéniques uniques
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Landraces</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{stats.byCountry?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Pays d'origine</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">
                {stats.byConservation?.find((c: any) => c.conservation_status === "rare")?.count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Variétés rares</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">
                {stats.byConservation?.find((c: any) => c.conservation_status === "menacé")?.count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Variétés menacées</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une landrace..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={type || "all"} onValueChange={(v) => setType(v === "all" ? undefined : v)}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            <SelectItem value="indica">Indica</SelectItem>
            <SelectItem value="sativa">Sativa</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={conservation || "all"} onValueChange={(v) => setConservation(v === "all" ? undefined : v)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Conservation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="commun">Commun</SelectItem>
            <SelectItem value="rare">Rare</SelectItem>
            <SelectItem value="menacé">Menacé</SelectItem>
            <SelectItem value="en danger">En danger</SelectItem>
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
          {data?.landraces.map((landrace: any) => (
            <Link key={landrace.id} href={`/landraces/${landrace.slug}`}>
              <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-lg">{landrace.name}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {landrace.type && (
                      <Badge variant="outline" className={getTypeColor(landrace.type)}>
                        {landrace.type}
                      </Badge>
                    )}
                    {landrace.conservation_status && (
                      <Badge variant="outline" className={getConservationColor(landrace.conservation_status)}>
                        {landrace.conservation_status}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {landrace.origin && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{landrace.origin}</span>
                    </div>
                  )}
                  
                  {landrace.aromatic_profile && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {landrace.aromatic_profile}
                    </p>
                  )}

                  {landrace.dominant_terpenes && (
                    <div className="flex items-center gap-2 text-sm pt-2 border-t border-border/50">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span className="text-muted-foreground line-clamp-1">{landrace.dominant_terpenes}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && data?.landraces.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune landrace trouvée</p>
        </div>
      )}
    </div>
  );
}
