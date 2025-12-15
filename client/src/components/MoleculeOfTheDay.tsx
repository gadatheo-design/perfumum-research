import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Beaker } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { MiniRadarChart } from "./MiniRadarChart";

export function MoleculeOfTheDay() {
  const { data: molecule, isLoading } = trpc.home.getMoleculeOfTheDay.useQuery();

  if (isLoading) {
    return (
      <Card className="brutal-border animate-fadeInUp">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse-glow" />
            <CardTitle>Molécule du jour</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted animate-pulse rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  if (!molecule) {
    return null;
  }

  const radarData = molecule.radarIntensity || molecule.radarFreshness || molecule.radarWarmth || molecule.radarSweetness || molecule.radarSpiciness || molecule.radarEarthiness
    ? {
        intensity: molecule.radarIntensity || 0,
        freshness: molecule.radarFreshness || 0,
        warmth: molecule.radarWarmth || 0,
        sweetness: molecule.radarSweetness || 0,
        spiciness: molecule.radarSpiciness || 0,
        earthiness: molecule.radarEarthiness || 0,
      }
    : null;

  return (
    <Link href={`/molecule/${molecule.id}`}>
      <Card className="brutal-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fadeInUp group">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse-glow" />
              <CardTitle className="group-hover:text-primary transition-colors">Molécule du jour</CardTitle>
            </div>
            <Badge variant="outline" className="bg-primary/10">
              <Beaker className="h-3 w-3 mr-1" />
              Molécule
            </Badge>
          </div>
          <CardDescription>Découvrez une molécule chaque jour</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">{molecule.name}</h3>

          </div>

          {radarData && (
            <div className="flex justify-center">
              <MiniRadarChart data={radarData} />
            </div>
          )}

          {molecule.olfactiveProfile && (
            <div>
              <p className="text-sm font-semibold mb-1">Profil olfactif</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{molecule.olfactiveProfile}</p>
            </div>
          )}

          <div className="pt-2 border-t">
            <p className="text-xs text-primary font-medium group-hover:underline">
              Voir la fiche complète →
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
