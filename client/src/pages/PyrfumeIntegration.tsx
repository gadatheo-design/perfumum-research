import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Database,
  Download,
  Search,
  BarChart3,
  Link2,
  BookOpen,
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function PyrfumeIntegration() {
  const { toast } = useToast();
  const [searchDescriptor, setSearchDescriptor] = useState("");

  // Queries
  const stats = trpc.pyrfume.getStats.useQuery();
  const datasets = trpc.pyrfume.getDatasets.useQuery();
  const knownDatasets = trpc.pyrfume.getKnownDatasets.useQuery();
  const unmapped = trpc.pyrfume.getUnmappedMolecules.useQuery({ limit: 20 });

  // Mutations
  const runCidMatching = trpc.pyrfume.runCidMatching.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Matching CID terminé",
        description: `${data.newlyMapped} nouvelles molécules mappées (${data.moleculesWithCid} avec CID sur ${data.totalMolecules} total)`,
      });
      stats.refetch();
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const seedDatasets = trpc.pyrfume.seedDatasets.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Datasets initialisés",
        description: `${data.seeded} nouveaux datasets ajoutés sur ${data.total} connus`,
      });
      datasets.refetch();
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  // Search results
  const searchResults = trpc.pyrfume.searchByDescriptor.useQuery(
    { descriptor: searchDescriptor },
    { enabled: searchDescriptor.length >= 3 }
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Importé</Badge>;
      case "importing":
        return <Badge className="bg-yellow-600"><Clock className="w-3 h-3 mr-1" /> En cours</Badge>;
      case "error":
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" /> Erreur</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> En attente</Badge>;
    }
  };

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FlaskConical className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Intégration Pyrfume</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Enrichissement olfactif via la base de données open-source{" "}
          <a href="https://pyrfume.org" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">
            Pyrfume <ExternalLink className="w-3 h-3 inline" />
          </a>
          {" "}— 10 300+ molécules, 60+ datasets de perception olfactive (MIT License)
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.data?.totalMapped || 0}</p>
                <p className="text-sm text-muted-foreground">Molécules mappées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.data?.coverage || 0}%</p>
                <p className="text-sm text-muted-foreground">Couverture PERFUMUM</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.data?.totalDescriptors || 0}</p>
                <p className="text-sm text-muted-foreground">Descripteurs importés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.data?.datasets?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Datasets actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" /> Matching CID PubChem
            </CardTitle>
            <CardDescription>
              Associer les molécules PERFUMUM aux entrées Pyrfume via leur identifiant PubChem (CID).
              Méthode la plus fiable (confiance 100%).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => runCidMatching.mutate()}
              disabled={runCidMatching.isPending}
              className="w-full"
            >
              {runCidMatching.isPending ? "Matching en cours..." : "Lancer le matching CID"}
            </Button>
            {unmapped.data && unmapped.data.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {unmapped.data.length}+ molécules non encore mappées
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" /> Initialiser les datasets
            </CardTitle>
            <CardDescription>
              Enregistrer les métadonnées des 7 datasets Pyrfume connus (Dravnieks, Leffingwell, Good Scents, Keller, IFRA, Arctander, Sigma).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => seedDatasets.mutate()}
              disabled={seedDatasets.isPending}
              variant="outline"
              className="w-full"
            >
              {seedDatasets.isPending ? "Initialisation..." : "Seed des datasets"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Datasets Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Datasets Pyrfume</CardTitle>
          <CardDescription>
            État d'importation des datasets de descripteurs olfactifs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {datasets.data && datasets.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Dataset</th>
                    <th className="text-left py-2 px-3">Auteur</th>
                    <th className="text-center py-2 px-3">Année</th>
                    <th className="text-center py-2 px-3">Molécules</th>
                    <th className="text-center py-2 px-3">Matchées</th>
                    <th className="text-center py-2 px-3">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {datasets.data.map((ds) => (
                    <tr key={ds.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3 font-medium">{ds.displayName}</td>
                      <td className="py-2 px-3 text-muted-foreground">{ds.author || "—"}</td>
                      <td className="py-2 px-3 text-center">{ds.year || "—"}</td>
                      <td className="py-2 px-3 text-center">{ds.moleculeCount || 0}</td>
                      <td className="py-2 px-3 text-center">{ds.matchedCount || 0}</td>
                      <td className="py-2 px-3 text-center">{statusBadge(ds.importStatus || "pending")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun dataset enregistré. Cliquez "Seed des datasets" pour initialiser.</p>
            </div>
          )}

          {/* Known datasets (if no DB datasets yet) */}
          {(!datasets.data || datasets.data.length === 0) && knownDatasets.data && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Datasets disponibles pour import :</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {knownDatasets.data.map((ds) => (
                  <div key={ds.name} className="border rounded-lg p-3">
                    <p className="font-medium">{ds.displayName}</p>
                    <p className="text-xs text-muted-foreground">{ds.author} ({ds.year})</p>
                    <p className="text-sm mt-1">{ds.description?.slice(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search by Descriptor */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" /> Recherche par descripteur olfactif
          </CardTitle>
          <CardDescription>
            Trouver des molécules par leur profil olfactif Pyrfume (ex: "woody", "floral", "musky")
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Entrez un descripteur (min. 3 caractères)..."
            value={searchDescriptor}
            onChange={(e) => setSearchDescriptor(e.target.value)}
            className="mb-4"
          />
          {searchResults.data && searchResults.data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Molécule</th>
                    <th className="text-left py-2 px-3">Descripteur</th>
                    <th className="text-center py-2 px-3">Valeur</th>
                    <th className="text-left py-2 px-3">Dataset</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.data.map((r, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3">
                        <a href={`/molecules/${r.moleculeId}`} className="text-purple-500 hover:underline">
                          {r.moleculeName}
                        </a>
                      </td>
                      <td className="py-2 px-3">{r.descriptor}</td>
                      <td className="py-2 px-3 text-center">{r.value?.toFixed(2) || "—"}</td>
                      <td className="py-2 px-3 text-muted-foreground">{r.dataset}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {searchDescriptor.length >= 3 && searchResults.data?.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Aucun résultat pour "{searchDescriptor}". Importez d'abord des datasets.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Bibliographic References */}
      <Card>
        <CardHeader>
          <CardTitle>Références bibliographiques</CardTitle>
          <CardDescription>Sources académiques intégrées via Pyrfume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="border-l-2 border-purple-500 pl-3">
              <p className="font-medium">Pyrfume — Open-source olfactory data</p>
              <p className="text-muted-foreground">
                Mainland, J.D. et al. Pyrfume: A window into the world's olfactory data.
                <a href="https://github.com/pyrfume/pyrfume-data" target="_blank" rel="noopener noreferrer" className="text-purple-500 ml-1">
                  GitHub <ExternalLink className="w-3 h-3 inline" />
                </a>
              </p>
            </div>
            <div className="border-l-2 border-blue-500 pl-3">
              <p className="font-medium">Dravnieks Atlas (1985)</p>
              <p className="text-muted-foreground">
                Dravnieks, A. Atlas of Odor Character Profiles. ASTM Data Series DS 61.
              </p>
            </div>
            <div className="border-l-2 border-green-500 pl-3">
              <p className="font-medium">Keller & Vosshall DREAM Challenge (2016)</p>
              <p className="text-muted-foreground">
                Keller, A. et al. Predicting human olfactory perception from chemical features of odor molecules. Science, 355(6327), 820-826.
              </p>
            </div>
            <div className="border-l-2 border-orange-500 pl-3">
              <p className="font-medium">Arctander (1969)</p>
              <p className="text-muted-foreground">
                Arctander, S. Perfume and Flavor Chemicals (Aroma Chemicals). Montclair, NJ.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
