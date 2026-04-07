// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, MapPin, Search, Globe, Navigation, 
  CheckCircle, XCircle, AlertCircle, Zap, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

export default function TerroirsGeocode() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState<any>(null);
  const [customAddress, setCustomAddress] = useState("");
  const [isGeocodeDialogOpen, setIsGeocodeDialogOpen] = useState(false);
  const [batchResults, setBatchResults] = useState<any>(null);

  // Queries
  const { data: origins, isLoading, refetch } = trpc.geographicOrigins.list.useQuery();

  // Mutations
  const geocodeMutation = trpc.geographicOrigins.geocode.useMutation({
    onSuccess: (data) => {
      toast.success(`Géocodage réussi: ${data.formattedAddress}`);
      setIsGeocodeDialogOpen(false);
      setSelectedOrigin(null);
      setCustomAddress("");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const geocodeBatchMutation = trpc.geographicOrigins.geocodeBatch.useMutation({
    onSuccess: (data) => {
      setBatchResults(data);
      toast.success(`Géocodage terminé: ${data.success}/${data.total} réussis`);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Filter origins
  const filteredOrigins = origins?.filter((origin: any) => {
    const matchesSearch = 
      origin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      origin.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (origin.region && origin.region.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Stats
  const totalOrigins = origins?.length || 0;
  const geocodedOrigins = origins?.filter((o: any) => o.latitude && o.longitude).length || 0;
  const pendingOrigins = totalOrigins - geocodedOrigins;

  const handleGeocode = (origin: any) => {
    setSelectedOrigin(origin);
    setCustomAddress("");
    setIsGeocodeDialogOpen(true);
  };

  const handleGeocodeSubmit = () => {
    if (!selectedOrigin) return;
    geocodeMutation.mutate({
      id: selectedOrigin.id,
      address: customAddress || undefined,
    });
  };

  const handleBatchGeocode = () => {
    if (pendingOrigins === 0) {
      toast.info("Tous les terroirs sont déjà géocodés");
      return;
    }
    if (confirm(`Voulez-vous géocoder les ${pendingOrigins} terroirs sans coordonnées ?`)) {
      setBatchResults(null);
      geocodeBatchMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-7xl">
        <Breadcrumbs customItems={[
          { label: "Administration", path: "/admin" },
          { label: "Géocodage des Terroirs" }
        ]} />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Navigation className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Géocodage des Terroirs</h1>
          </div>
          <p className="text-muted-foreground">
            Enrichissez automatiquement les coordonnées GPS des terroirs de production.
          </p>
        </div>

        {/* Statistiques et Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{totalOrigins}</div>
              <p className="text-sm text-muted-foreground">Terroirs total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{geocodedOrigins}</div>
              <p className="text-sm text-muted-foreground">Géocodés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-500">{pendingOrigins}</div>
              <p className="text-sm text-muted-foreground">En attente</p>
            </CardContent>
          </Card>
          <Card className="flex items-center justify-center">
            <CardContent className="p-4">
              <Button 
                onClick={handleBatchGeocode}
                disabled={geocodeBatchMutation.isPending || pendingOrigins === 0}
                className="w-full"
              >
                {geocodeBatchMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Géocodage...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Géocoder tout ({pendingOrigins})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Progression du géocodage */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progression du géocodage</span>
              <span className="text-sm text-muted-foreground">
                {geocodedOrigins}/{totalOrigins} ({Math.round((geocodedOrigins / totalOrigins) * 100)}%)
              </span>
            </div>
            <Progress value={(geocodedOrigins / totalOrigins) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Résultats du géocodage en masse */}
        {batchResults && (
          <Card className="mb-8 border-primary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Résultats du géocodage en masse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-xl font-bold">{batchResults.total}</div>
                  <div className="text-sm text-muted-foreground">Traités</div>
                </div>
                <div className="text-center p-3 bg-green-500/10 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{batchResults.success}</div>
                  <div className="text-sm text-muted-foreground">Réussis</div>
                </div>
                <div className="text-center p-3 bg-red-500/10 rounded-lg">
                  <div className="text-xl font-bold text-red-600">{batchResults.failed}</div>
                  <div className="text-sm text-muted-foreground">Échoués</div>
                </div>
              </div>
              
              {batchResults.results.filter((r: any) => !r.success).length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2 text-red-600">Échecs:</h4>
                  <ul className="space-y-1 text-sm">
                    {batchResults.results.filter((r: any) => !r.success).map((r: any) => (
                      <li key={r.id} className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        {r.name}: {r.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un terroir..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Liste des terroirs */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrigins?.map((origin: any) => (
            <Card key={origin.id} className={`hover:shadow-md transition-shadow ${
              origin.latitude && origin.longitude ? 'border-green-200' : 'border-orange-200'
            }`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{origin.name}</CardTitle>
                    <CardDescription>{origin.country}</CardDescription>
                  </div>
                  {origin.latitude && origin.longitude ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Géocodé
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      En attente
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {origin.region && (
                    <p className="text-muted-foreground">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {origin.region}
                    </p>
                  )}
                  
                  {origin.latitude && origin.longitude ? safeToFixed(
                    <div className="p-2 bg-muted rounded text-xs font-mono">
                      <Globe className="h-3 w-3 inline mr-1" />
                      {parseFloat(origin.latitude, 4)}, {parseFloatsafeToFixed(origin.longitude, 4)}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">Coordonnées non définies</p>
                  )}
                  
                  <Button
                    variant={origin.latitude && origin.longitude ? "outline" : "default"}
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => handleGeocode(origin)}
                  >
                    {origin.latitude && origin.longitude ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Re-géocoder
                      </>
                    ) : (
                      <>
                        <Navigation className="h-4 w-4 mr-2" />
                        Géocoder
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog de géocodage individuel */}
        <Dialog open={isGeocodeDialogOpen} onOpenChange={setIsGeocodeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Géocoder {selectedOrigin?.name}</DialogTitle>
              <DialogDescription>
                Entrez une adresse personnalisée ou laissez vide pour utiliser les informations existantes.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Informations actuelles</Label>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p><strong>Nom:</strong> {selectedOrigin?.name}</p>
                  <p><strong>Pays:</strong> {selectedOrigin?.country}</p>
                  {selectedOrigin?.region && <p><strong>Région:</strong> {selectedOrigin?.region}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customAddress">Adresse de recherche (optionnel)</Label>
                <Input
                  id="customAddress"
                  placeholder="Ex: Grasse, Provence-Alpes-Côte d'Azur, France"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Si vide, la recherche utilisera: {selectedOrigin?.region ? `${selectedOrigin.region}, ${selectedOrigin?.country}` : selectedOrigin?.name}
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGeocodeDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleGeocodeSubmit} disabled={geocodeMutation.isPending}>
                {geocodeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Géocodage...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" />
                    Géocoder
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
