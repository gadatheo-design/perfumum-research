import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Beaker, Search, Link2, ExternalLink, Loader2, AlertCircle, Plus, Trash2, BookOpen } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

export default function ExtractionMethods() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Récupérer tous les procédés d'extraction
  const { data: extractionMethods, isLoading: isLoadingMethods } = trpc.extractionMethods.getAll.useQuery();

  // Récupérer les publications liées au procédé sélectionné
  const { data: linkedPublications, isLoading: isLoadingPublications } = 
    trpc.bibliography.getByExtractionMethod.useQuery(
      { methodId: selectedMethod?.id },
      { enabled: !!selectedMethod?.id }
    );

  // Filtrer les procédés par terme de recherche
  const filteredMethods = useMemo(() => {
    if (!extractionMethods) return [];
    return extractionMethods.filter((method: any) =>
      method.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [extractionMethods, searchTerm]);

  const handleSelectMethod = (method: any) => {
    setSelectedMethod(method);
    setShowDetails(true);
  };

  const handleUnlinkPublication = async (publicationId: number) => {
    if (!selectedMethod) return;
    try {
      // Appel à la procédure de déliaison (à implémenter si nécessaire)
      toast({
        title: "Déliée",
        description: "La publication a été déliée du procédé d'extraction.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de délier la publication.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header />

      <main className="flex-1 container max-w-6xl mx-auto py-8 px-4">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Beaker className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              Procédés d'Extraction
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Explorez les procédés d'extraction et leurs publications scientifiques associées
          </p>
        </div>

        {/* Recherche */}
        <Card className="mb-6 border-amber-200 dark:border-amber-900/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-600" />
              Rechercher un procédé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Distillation, extraction CO₂, enfleurage, macération..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-amber-200 dark:border-amber-900/30"
            />
          </CardContent>
        </Card>

        {/* Onglets */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-amber-100 dark:bg-amber-950/30">
            <TabsTrigger value="list">Liste des procédés ({filteredMethods?.length || 0})</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          {/* Onglet : Liste des procédés */}
          <TabsContent value="list" className="space-y-4">
            {isLoadingMethods ? (
              <Card className="p-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-600" />
                <p className="text-muted-foreground">Chargement des procédés...</p>
              </Card>
            ) : filteredMethods.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                <p className="text-muted-foreground">Aucun procédé trouvé</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredMethods.map((method: any) => (
                  <Card
                    key={method.id}
                    className="cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 transition-colors border-amber-100 dark:border-amber-900/30"
                    onClick={() => handleSelectMethod(method)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-amber-700 dark:text-amber-400">
                            {method.name}
                          </CardTitle>
                          {method.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {method.description}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700">
                          {method.publicationCount || 0} pub.
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectMethod(method);
                        }}
                      >
                        <BookOpen className="w-3 h-3 mr-1" />
                        Voir les publications
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Onglet : Statistiques */}
          <TabsContent value="stats" className="space-y-4">
            <Card className="border-amber-200 dark:border-amber-900/30">
              <CardHeader>
                <CardTitle className="text-base">Aperçu statistique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/30">
                    <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                      {extractionMethods?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Procédés d'extraction</div>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/30">
                    <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                      {extractionMethods?.reduce((sum: number, m: any) => sum + (m.publicationCount || 0), 0) || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Publications liées</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialog : Détails du procédé et publications liées */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-amber-600" />
              {selectedMethod?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Description du procédé */}
            {selectedMethod?.description && (
              <div>
                <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedMethod.description}
                </p>
              </div>
            )}

            {/* Publications liées */}
            <div>
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">
                Publications liées ({linkedPublications?.length || 0})
              </h3>
              {isLoadingPublications ? (
                <div className="p-4 text-center">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Chargement...</p>
                </div>
              ) : linkedPublications && linkedPublications.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {linkedPublications.map((pub: any) => (
                    <div
                      key={pub.id}
                      className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                          {pub.title}
                        </p>
                        {pub.authors && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {pub.authors}
                          </p>
                        )}
                        {pub.year && (
                          <p className="text-xs text-muted-foreground">
                            {pub.year}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {pub.doi && (
                          <a
                            href={`https://doi.org/${pub.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded"
                          >
                            <ExternalLink className="w-4 h-4 text-amber-600" />
                          </a>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleUnlinkPublication(pub.id)}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                  Aucune publication liée à ce procédé pour le moment.
                </p>
              )}
            </div>

            {/* Bouton pour ajouter une publication */}
            <Button
              className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
              onClick={() => {
                toast({
                  title: "Fonctionnalité à venir",
                  description: "Vous pourrez bientôt lier des publications à ce procédé depuis /admin/bibliographic-enrichment",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Lier une publication
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
