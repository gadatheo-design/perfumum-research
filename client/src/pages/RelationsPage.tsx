import DashboardLayout from "@/components/DashboardLayout";
import { RelationGraph } from "@/components/RelationGraph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  Network,
  Leaf,
  FlaskConical,
  BookOpen,
  Dna,
  Link2,
  TrendingUp,
  Loader2,
} from "lucide-react";

export default function RelationsPage() {
  // Statistiques
  const { data: plants } = trpc.plants.list.useQuery();
  const { data: molecules } = trpc.molecules.list.useQuery();
  const { data: references } = trpc.bibliography.list.useQuery({});
  const { data: chemotypes } = trpc.chemotypes.getAll.useQuery();
  const { data: plantMoleculeLinks } = trpc.plantMoleculeLinks.getAll.useQuery();
  
  const stats = {
    plants: plants?.length || 0,
    molecules: molecules?.length || 0,
    references: Array.isArray(references) ? references.length : (references as any)?.entries?.length || 0,
    chemotypes: chemotypes?.length || 0,
    links: plantMoleculeLinks?.length || 0,
  };
  
  const isLoading = !plants || !molecules;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Network className="h-8 w-8 text-primary" />
            Graphe de Relations
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualisation interactive des connexions entre plantes, molécules, références bibliographiques et chémotypes.
          </p>
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? "..." : stats.plants}</p>
                  <p className="text-sm text-muted-foreground">Plantes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <FlaskConical className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? "..." : stats.molecules}</p>
                  <p className="text-sm text-muted-foreground">Molécules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? "..." : stats.references}</p>
                  <p className="text-sm text-muted-foreground">Références</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Dna className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? "..." : stats.chemotypes}</p>
                  <p className="text-sm text-muted-foreground">Chémotypes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-500/10">
                  <Link2 className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? "..." : stats.links}</p>
                  <p className="text-sm text-muted-foreground">Liaisons</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Graphe principal */}
        <RelationGraph height={650} />
        
        {/* Guide d'utilisation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Guide d'utilisation
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Navigation</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>Zoom:</strong> Utilisez la molette de la souris</li>
                  <li><strong>Pan:</strong> Cliquez et glissez sur le fond</li>
                  <li><strong>Déplacer un nœud:</strong> Cliquez et glissez sur le nœud</li>
                  <li><strong>Détails:</strong> Cliquez sur un nœud pour voir ses informations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Filtres</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>Types d'entités:</strong> Activez/désactivez les catégories</li>
                  <li><strong>Min. connexions:</strong> Filtrez les nœuds isolés</li>
                  <li>Les références sont limitées à 50 pour la performance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
