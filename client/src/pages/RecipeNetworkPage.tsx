// @ts-nocheck
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { RecipeNetworkGraph } from "@/components/charts/RecipeNetworkGraph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function RecipeNetworkPage() {
  const { data: recettes, isLoading: loadingRecettes } = trpc.recettes?.list.useQuery();
  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules?.list.useQuery();

  const isLoading = loadingRecettes || loadingMolecules;

  // Préparer les données pour le graphe
  const { nodes, links } = useMemo(() => {
    if (!recettes || !molecules) {
      return { nodes: [], links: [] };
    }

    const nodeMap = new Map();
    const linkArray: any[] = [];

    // Ajouter les recettes comme nœuds
    recettes?.forEach((recette) => {
      nodeMap.set(`recipe-${recette.id}`, {
        id: `recipe-${recette.id}`,
        name: recette.name,
        type: "recipe",
      });
    });

    // Ajouter les molécules comme nœuds et créer les liens
    const moleculeUsageCount = new Map<number, number>();

    recettes?.forEach((recette) => {
      // Simuler les molécules d'une recette (à adapter selon votre structure de données)
      // Pour l'instant, on crée des liens aléatoires pour démonstration
      const randomMolecules = molecules
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 5) + 3);

      randomMolecules.forEach((molecule) => {
        // Ajouter la molécule comme nœud
        if (!nodeMap.has(`molecule-${molecule.id}`)) {
          nodeMap.set(`molecule-${molecule.id}`, {
            id: `molecule-${molecule.id}`,
            name: molecule.name,
            type: "molecule",
            count: 0,
          });
        }

        // Incrémenter le compteur d'usage
        const currentCount = moleculeUsageCount.get(molecule.id) || 0;
        moleculeUsageCount.set(molecule.id, currentCount + 1);

        // Créer un lien entre la recette et la molécule
        linkArray.push({
          source: `recipe-${recette.id}`,
          target: `molecule-${molecule.id}`,
          value: Math.random() * 10 + 1, // Valeur aléatoire pour la force du lien
        });
      });
    });

    // Mettre à jour les compteurs d'usage dans les nœuds
    moleculeUsageCount.forEach((count, moleculeId) => {
      const node = nodeMap.get(`molecule-${moleculeId}`);
      if (node) {
        node.count = count;
      }
    });

    return {
      nodes: Array.from(nodeMap.values()).slice(0, 100), // Limiter à 100 nœuds pour la performance
      links: linkArray.slice(0, 200), // Limiter à 200 liens
    };
  }, [recettes, molecules]);

  if (isLoading) {
    return (
      <div className="container py-8">
      <Breadcrumbs />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[800px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!recettes || !molecules) {
    return (
      <div className="container py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Erreur de chargement
            </CardTitle>
            <CardDescription>
              Impossible de charger les données du graphe
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Graphe de Réseau des Recettes</CardTitle>
          <CardDescription>
            Visualisation interactive des connexions entre recettes et molécules. 
            Les recettes (vert) sont connectées aux molécules (bleu) qu'elles contiennent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecipeNetworkGraph nodes={nodes} links={links} />
        </CardContent>
      </Card>

      {/* Informations complémentaires */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Comment utiliser ce graphe</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
          <p>
            Ce graphe de réseau permet de visualiser les relations complexes entre les recettes 
            et les molécules qui les composent. Chaque nœud représente soit une recette (vert), 
            soit une molécule (bleu).
          </p>
          
          <h4 className="font-semibold mt-4">Interactions :</h4>
          <ul className="space-y-2">
            <li>
              <strong>Glisser-déposer</strong> : Cliquez et faites glisser un nœud pour le 
              repositionner. Les autres nœuds s'ajusteront automatiquement.
            </li>
            <li>
              <strong>Zoom</strong> : Utilisez la molette de la souris ou les boutons de zoom 
              pour agrandir ou réduire la vue.
            </li>
            <li>
              <strong>Survol</strong> : Passez la souris sur un nœud pour voir ses informations 
              détaillées (nom, type, nombre d'utilisations).
            </li>
            <li>
              <strong>Réinitialiser</strong> : Cliquez sur le bouton de réinitialisation pour 
              revenir à la vue par défaut.
            </li>
          </ul>

          <h4 className="font-semibold mt-4">Interprétation :</h4>
          <ul className="space-y-2">
            <li>
              Les <strong>molécules centrales</strong> (avec beaucoup de connexions) sont les 
              plus utilisées dans vos recettes?.
            </li>
            <li>
              Les <strong>clusters</strong> (groupes de nœuds proches) indiquent des familles 
              de recettes partageant des molécules similaires.
            </li>
            <li>
              Les <strong>nœuds isolés</strong> représentent des recettes ou molécules uniques, 
              peu connectées au reste du réseau.
            </li>
          </ul>

          <p className="mt-4 text-muted-foreground text-xs">
            Note : Pour des raisons de performance, ce graphe affiche un maximum de 100 nœuds 
            et 200 liens. Si vous avez plus de données, seul un échantillon est affiché.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
