import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Leaf, Shield, MapPin } from 'lucide-react';

export default function PatrimoineMenace() {
  const [iucnFilter, setIucnFilter] = useState<string | undefined>(undefined);
  const [citesFilter, setCitesFilter] = useState<string | undefined>(undefined);

  const { data: threatenedPlants, isLoading } = trpc.plantsConservation.listThreatened.useQuery({
    iucn: iucnFilter,
    cites: citesFilter,
  });

  const iucnLabels: Record<string, { label: string; color: string; description: string }> = {
    EX: { label: 'Éteint', color: 'bg-black text-white', description: 'Espèce disparue' },
    EW: { label: 'Éteint à l\'état sauvage', color: 'bg-gray-900 text-white', description: 'Ne survit qu\'en captivité' },
    CR: { label: 'En danger critique', color: 'bg-red-600 text-white', description: 'Risque extrêmement élevé' },
    EN: { label: 'En danger', color: 'bg-orange-600 text-white', description: 'Risque très élevé' },
    VU: { label: 'Vulnérable', color: 'bg-yellow-600 text-white', description: 'Risque élevé' },
    NT: { label: 'Quasi menacé', color: 'bg-yellow-400 text-black', description: 'Proche du seuil de menace' },
    LC: { label: 'Préoccupation mineure', color: 'bg-green-600 text-white', description: 'Faible risque' },
    DD: { label: 'Données insuffisantes', color: 'bg-gray-500 text-white', description: 'Manque d\'information' },
    NE: { label: 'Non évalué', color: 'bg-gray-400 text-white', description: 'Pas encore évalué' },
  };

  const citesLabels: Record<string, { label: string; description: string }> = {
    I: { label: 'Annexe I', description: 'Commerce généralement interdit' },
    II: { label: 'Annexe II', description: 'Commerce strictement régulé' },
    III: { label: 'Annexe III', description: 'Commerce régulé à la demande d\'un pays' },
    NONE: { label: 'Non listé', description: 'Pas de restriction CITES' },
    UNKNOWN: { label: 'Inconnu', description: 'Statut CITES à vérifier' },
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* En-tête */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="h-10 w-10 text-orange-600" />
          <div>
            <h1 className="text-4xl font-bold">Patrimoine Olfactif Menacé</h1>
            <p className="text-muted-foreground text-lg">
              Espèces aromatiques en danger et alternatives durables
            </p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres de conservation</CardTitle>
          <CardDescription>
            Filtrez les plantes par statut IUCN (Union Internationale pour la Conservation de la Nature) et CITES (Convention sur le commerce international)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Statut IUCN</label>
            <Select value={iucnFilter} onValueChange={(v) => setIucnFilter(v === 'all' ? undefined : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts IUCN" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="CR">En danger critique (CR)</SelectItem>
                <SelectItem value="EN">En danger (EN)</SelectItem>
                <SelectItem value="VU">Vulnérable (VU)</SelectItem>
                <SelectItem value="NT">Quasi menacé (NT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Annexe CITES</label>
            <Select value={citesFilter} onValueChange={(v) => setCitesFilter(v === 'all' ? undefined : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les annexes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les annexes</SelectItem>
                <SelectItem value="I">Annexe I (Commerce interdit)</SelectItem>
                <SelectItem value="II">Annexe II (Commerce régulé)</SelectItem>
                <SelectItem value="III">Annexe III (Régulé par pays)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(iucnFilter || citesFilter) && (
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIucnFilter(undefined);
                  setCitesFilter(undefined);
                }}
              >
                Réinitialiser
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des plantes menacées */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement des espèces menacées...</p>
        </div>
      ) : threatenedPlants && threatenedPlants.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {threatenedPlants.map((plant) => {
            const iucnInfo = plant.conservationStatus ? iucnLabels[plant.conservationStatus] : null;
            const citesInfo = plant.citesAppendix ? citesLabels[plant.citesAppendix] : null;
            const threats = plant.threatFactors as Record<string, boolean> | null;

            return (
              <Card key={plant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-600" />
                        {plant.name}
                      </CardTitle>
                      <CardDescription className="italic">{plant.latinName}</CardDescription>
                    </div>
                    {iucnInfo && (
                      <Badge className={iucnInfo.color}>
                        {iucnInfo.label}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Origine */}
                  {plant.origin && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Origine</p>
                        <p className="text-sm text-muted-foreground">{plant.origin}</p>
                      </div>
                    </div>
                  )}

                  {/* Statuts de conservation */}
                  <div className="space-y-2">
                    {iucnInfo && (
                      <div>
                        <p className="text-sm font-medium">Statut IUCN</p>
                        <p className="text-sm text-muted-foreground">{iucnInfo.description}</p>
                      </div>
                    )}
                    {citesInfo && citesInfo.label !== 'Non listé' && (
                      <div>
                        <p className="text-sm font-medium">CITES</p>
                        <p className="text-sm text-muted-foreground">{citesInfo.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Facteurs de menace */}
                  {threats && Object.keys(threats).length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        Facteurs de menace
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {threats.overharvesting && (
                          <Badge variant="outline">Surexploitation</Badge>
                        )}
                        {threats.habitat_loss && (
                          <Badge variant="outline">Perte d'habitat</Badge>
                        )}
                        {threats.climate_change && (
                          <Badge variant="outline">Changement climatique</Badge>
                        )}
                        {threats.illegal_trade && (
                          <Badge variant="outline">Commerce illégal</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes de conservation */}
                  {plant.conservationNotes && (
                    <div>
                      <p className="text-sm font-medium">Notes</p>
                      <p className="text-sm text-muted-foreground">{plant.conservationNotes}</p>
                    </div>
                  )}

                  {/* Alternatives durables */}
                  {plant.sustainableAlternatives && (
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                        Alternatives durables
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {plant.sustainableAlternatives}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aucune espèce menacée trouvée avec ces filtres.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
