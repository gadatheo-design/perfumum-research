import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf, MapPin, Sparkles, Activity, Droplets } from "lucide-react";
import { TerpeneRadarChart } from "@/components/TerpeneRadarChart";

// Composant pour charger et afficher les terpènes
function TerpeneRadarSection({ landraceId }: { landraceId: number }) {
  const { data: terpenes, isLoading } = trpc.landraces.getTerpenes.useQuery({ landraceId });
  
  if (isLoading) {
    return (
      <div className="mb-6">
        <Skeleton className="h-[350px] w-full" />
      </div>
    );
  }
  
  if (!terpenes || terpenes.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <TerpeneRadarChart 
        terpenes={terpenes} 
        title="Profil Terpénique"
        size={320}
      />
    </div>
  );
}

export default function LandraceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: landrace, isLoading } = trpc.landraces.getById.useQuery({ slug });

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

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!landrace) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Landrace non trouvée</p>
        <Link href="/landraces">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux landraces
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Link href="/landraces">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux landraces
        </Button>
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Leaf className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold text-foreground">{landrace.name}</h1>
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
        
        {landrace.alternate_names && (
          <p className="text-sm text-muted-foreground mb-4">
            Aussi connue sous : {landrace.alternate_names}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {(landrace.origin || landrace.region || landrace.country) && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle>Origine</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {landrace.origin && <p className="text-muted-foreground">{landrace.origin}</p>}
              {landrace.region && <p className="text-sm text-muted-foreground">Région : {landrace.region}</p>}
              {landrace.country && <p className="text-sm text-muted-foreground">Pays : {landrace.country}</p>}
            </CardContent>
          </Card>
        )}
        
        {landrace.effect_type && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Effets</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{landrace.effect_type}</p>
              <div className="flex gap-4 mt-4 text-sm">
                {landrace.thc_range && <span>THC: {landrace.thc_range}</span>}
                {landrace.cbd_range && <span>CBD: {landrace.cbd_range}</span>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {landrace.aromatic_profile && (
        <Card className="bg-card/50 border-border/50 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <CardTitle>Profil Aromatique</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{landrace.aromatic_profile}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {landrace.head_notes && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Notes de Tête</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{landrace.head_notes}</p>
            </CardContent>
          </Card>
        )}
        
        {landrace.heart_notes && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Notes de Cœur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{landrace.heart_notes}</p>
            </CardContent>
          </Card>
        )}
        
        {landrace.base_notes && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Notes de Fond</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{landrace.base_notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Graphique radar des terpènes */}
      <TerpeneRadarSection landraceId={landrace.id} />

      {(landrace.dominant_terpenes || landrace.total_terpene_content) && (
        <Card className="bg-card/50 border-border/50 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              <CardTitle>Terpènes (description)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {landrace.dominant_terpenes && (
              <div>
                <p className="text-sm font-medium mb-2">Terpènes dominants</p>
                <p className="text-muted-foreground">{landrace.dominant_terpenes}</p>
              </div>
            )}
            {landrace.total_terpene_content && (
              <p className="text-sm text-muted-foreground">
                Teneur totale : {landrace.total_terpene_content}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {landrace.cigarillo_potential && (
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-400">Potentiel Cigarillo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{landrace.cigarillo_potential}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
