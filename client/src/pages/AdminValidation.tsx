import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  FileEdit,
  Beaker,
  Leaf,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Bell,
  Send
} from "lucide-react";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

export default function AdminValidation() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("molecules");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<{ type: 'molecule' | 'plant'; id: number; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Queries
  const { data: stats, isLoading: loadingStats, refetch: refetchStats } = trpc.validation.getStats.useQuery();
  const { data: pendingMolecules, isLoading: loadingMolecules, refetch: refetchMolecules } = trpc.validation.getPendingMolecules.useQuery(undefined, { enabled: !!user });
  const { data: pendingPlants, isLoading: loadingPlants, refetch: refetchPlants } = trpc.validation.getPendingPlants.useQuery(undefined, { enabled: !!user });

  // Mutations
  const validateMolecule = trpc.validation.validateMolecule.useMutation({
    onSuccess: () => {
      toast.success("Molécule validée avec succès");
      refetchMolecules();
      refetchStats();
    },
    onError: (error) => toast.error(`Erreur: ${error.message}`),
  });

  const rejectMolecule = trpc.validation.rejectMolecule.useMutation({
    onSuccess: () => {
      toast.success("Molécule rejetée");
      refetchMolecules();
      refetchStats();
      setRejectDialogOpen(false);
      setRejectReason("");
    },
    onError: (error) => toast.error(`Erreur: ${error.message}`),
  });

  const validatePlant = trpc.validation.validatePlant.useMutation({
    onSuccess: () => {
      toast.success("Plante validée avec succès");
      refetchPlants();
      refetchStats();
    },
    onError: (error) => toast.error(`Erreur: ${error.message}`),
  });

  const rejectPlant = trpc.validation.rejectPlant.useMutation({
    onSuccess: () => {
      toast.success("Plante rejetée");
      refetchPlants();
      refetchStats();
      setRejectDialogOpen(false);
      setRejectReason("");
    },
    onError: (error) => toast.error(`Erreur: ${error.message}`),
  });

  const handleValidate = (type: 'molecule' | 'plant', id: number) => {
    if (type === 'molecule') {
      validateMolecule.mutate({ moleculeId: id });
    } else {
      validatePlant.mutate({ plantId: id });
    }
  };

  const handleRejectClick = (type: 'molecule' | 'plant', id: number, name: string) => {
    setRejectTarget({ type, id, name });
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectTarget) return;
    if (rejectTarget.type === 'molecule') {
      rejectMolecule.mutate({ moleculeId: rejectTarget.id, reason: rejectReason });
    } else {
      rejectPlant.mutate({ plantId: rejectTarget.id, reason: rejectReason });
    }
  };

  const isAdmin = user?.role === 'admin';

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Accès refusé</AlertTitle>
            <AlertDescription>
              Vous devez être connecté pour accéder à cette page.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <Shield className="h-4 w-4" />
            <AlertTitle>Accès administrateur requis</AlertTitle>
            <AlertDescription>
              Seuls les administrateurs peuvent accéder à cette page de validation.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Validation des Contributions</h1>
                  <p className="text-muted-foreground">
                    Gérez les brouillons et validez les nouvelles contributions
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { refetchStats(); refetchMolecules(); refetchPlants(); }} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Actualiser
                </Button>
                <NotifyAdminButton />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Statistiques */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        En attente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-3xl font-bold text-amber-500">{stats?.pendingTotal}</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <FileEdit className="h-4 w-4" />
                        Brouillons
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-3xl font-bold">{stats?.molecules.brouillon + stats?.plants.brouillon}</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        En révision
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-3xl font-bold text-blue-500">{stats?.molecules.en_revision + stats?.plants.en_revision}</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Validés
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-3xl font-bold text-green-500">{stats?.molecules.valide + stats?.plants.valide}</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Rejetés
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-3xl font-bold text-red-500">{stats?.molecules.rejete + stats?.plants.rejete}</span>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Lien vers les contributions plantes */}
              <div className="flex items-center justify-between p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Leaf className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-sm">Contributions utilisateurs (fiches plantes)</p>
                    <p className="text-xs text-muted-foreground">Images, molécules, terroirs et notes soumis par les utilisateurs</p>
                  </div>
                </div>
                <a href="/admin/contributions">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Leaf className="h-4 w-4" />
                    Gérer les contributions
                  </Button>
                </a>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="molecules" className="flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    Molécules ({pendingMolecules?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="plants" className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Plantes ({pendingPlants?.length || 0})
                  </TabsTrigger>
                </TabsList>

                <TabErrorBoundary>
                <TabsContent value="molecules">
                  <Card>
                    <CardHeader>
                      <CardTitle>Molécules en attente de validation</CardTitle>
                      <CardDescription>
                        Validez ou rejetez les molécules soumises par les contributeurs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingMolecules ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : pendingMolecules && pendingMolecules?.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Famille</TableHead>
                              <TableHead>Statut</TableHead>
                              <TableHead>Mise à jour</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingMolecules?.map((molecule) => (
                              <TableRow key={molecule.id}>
                                <TableCell className="font-medium">{molecule.name}</TableCell>
                                <TableCell>{molecule.family || '-'}</TableCell>
                                <TableCell>
                                  <Badge variant={molecule.validationStatus === 'en_revision' ? 'default' : 'outline'}>
                                    {molecule.validationStatus === 'en_revision' ? 'En révision' : 'Brouillon'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {new Date(molecule.updatedAt).toLocaleDateString('fr-FR')}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-green-600 hover:text-green-700"
                                      onClick={() => handleValidate('molecule', molecule.id)}
                                      disabled={validateMolecule.isPending}
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-1" />
                                      Valider
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => handleRejectClick('molecule', molecule.id, molecule.name)}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Rejeter
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                          <p>Aucune molécule en attente de validation</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                </TabErrorBoundary>

                <TabErrorBoundary>
                <TabsContent value="plants">
                  <Card>
                    <CardHeader>
                      <CardTitle>Plantes en attente de validation</CardTitle>
                      <CardDescription>
                        Validez ou rejetez les plantes soumises par les contributeurs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingPlants ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : pendingPlants && pendingPlants?.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Catégorie</TableHead>
                              <TableHead>Statut</TableHead>
                              <TableHead>Mise à jour</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingPlants?.map((plant) => (
                              <TableRow key={plant.id}>
                                <TableCell className="font-medium">{plant.name}</TableCell>
                                <TableCell>{plant.category}</TableCell>
                                <TableCell>
                                  <Badge variant={plant.validationStatus === 'en_revision' ? 'default' : 'outline'}>
                                    {plant.validationStatus === 'en_revision' ? 'En révision' : 'Brouillon'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {new Date(plant.updatedAt).toLocaleDateString('fr-FR')}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-green-600 hover:text-green-700"
                                      onClick={() => handleValidate('plant', plant.id)}
                                      disabled={validatePlant.isPending}
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-1" />
                                      Valider
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => handleRejectClick('plant', plant.id, plant.name)}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Rejeter
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                          <p>Aucune plante en attente de validation</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                </TabErrorBoundary>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      {/* Dialog de rejet */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter {rejectTarget?.type === 'molecule' ? 'la molécule' : 'la plante'}</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de rejeter "{rejectTarget?.name}". Veuillez indiquer la raison du rejet.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Raison du rejet (optionnel)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={rejectMolecule.isPending || rejectPlant.isPending}
            >
              {(rejectMolecule.isPending || rejectPlant.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

// Composant pour le bouton de notification admin
function NotifyAdminButton() {
  const notifyAdmin = trpc.validation.notifyAdminPendingContributions.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message, {
          description: data.stats ? `${data.stats?.molecules} molécule(s), ${data.stats?.plants} plante(s)` : undefined,
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => toast.error(`Erreur: ${error.message}`),
  });

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => notifyAdmin.mutate()}
      disabled={notifyAdmin.isPending}
      className="gap-2"
    >
      {notifyAdmin.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bell className="h-4 w-4" />
      )}
      Envoyer notification
    </Button>
  );
}
