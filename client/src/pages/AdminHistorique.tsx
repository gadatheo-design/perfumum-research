// @ts-nocheck
import { useState } from "react";
import { History, Undo2, Clock, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const entityLabels: Record<string, string> = {
  molecule: "Molécule",
  recette: "Recette",
  accord: "Accord",
  famille: "Famille",
  matiere: "Matière Première",
};

const actionLabels: Record<string, string> = {
  create: "Création",
  update: "Modification",
  delete: "Suppression",
};

const actionColors: Record<string, string> = {
  create: "bg-green-500/10 text-green-700 dark:text-green-400",
  update: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  delete: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export default function AdminHistorique() {
  const [limit, setLimit] = useState(50);
  
  const { data: modifications, isLoading, refetch } = trpc.history.getRecent.useQuery({ limit });
  const undoMutation = trpc.history.undo.useMutation({
    onSuccess: () => {
      toast.success("Modification annulée avec succès");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'annulation : ${error.message}`);
    },
  });

  const handleUndo = (modificationId: number) => {
    if (confirm("Êtes-vous sûr de vouloir annuler cette modification ?")) {
      undoMutation.mutate({ modificationId });
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold">Historique des Modifications</h1>
              <p className="text-sm text-muted-foreground">
                Consultez et annulez les modifications récentes
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total modifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {modifications?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Créations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {modifications?.filter((m: any) => m.action === "create").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Suppressions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {modifications?.filter((m: any) => m.action === "delete").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contrôles */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Affichage des {limit} dernières modifications
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLimit(50)}
              disabled={limit === 50}
            >
              50
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLimit(100)}
              disabled={limit === 100}
            >
              100
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLimit(200)}
              disabled={limit === 200}
            >
              200
            </Button>
          </div>
        </div>

        {/* Liste des modifications */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement de l'historique...</p>
          </div>
        ) : !modifications || modifications?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Aucune modification enregistrée</p>
              <p className="text-sm text-muted-foreground">
                Les modifications futures apparaîtront ici
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {modifications?.map((modification: any) => (
              <Card key={modification.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={actionColors[modification.action]}>
                          {actionLabels[modification.action]}
                        </Badge>
                        <Badge variant="outline">
                          {entityLabels[modification.entityType]}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ID: {modification.entityId}
                        </span>
                      </div>

                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDate(modification.createdAt)}
                      </div>

                      {modification.undoneAt && (
                        <Badge variant="secondary" className="text-xs">
                          Annulée le {formatDate(modification.undoneAt)}
                        </Badge>
                      )}
                    </div>

                    {!modification.undoneAt && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUndo(modification.id)}
                        disabled={undoMutation.isPending}
                      >
                        <Undo2 className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
