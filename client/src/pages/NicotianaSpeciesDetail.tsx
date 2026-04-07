import React, { useMemo } from 'react';
import { useRoute } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, MapPin, Leaf, Beaker, BookOpen, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getSpeciesDetail } from '@/lib/nicotianaSpeciesDetails';
import { nicotianaPhylogeny } from '@/lib/nicotianaPhylogeny';
import { NicotianaGCMSProfile } from '@/components/NicotianaGCMSProfile';

export default function NicotianaSpeciesDetail() {
  const [, params] = useRoute('/nicotiana-species/:speciesId');
  const speciesId = params?.speciesId;

  const species = useMemo(() => {
    if (!speciesId) return null;
    return getSpeciesDetail(speciesId);
  }, [speciesId]);

  if (!species) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Espèce non trouvée. Veuillez vérifier l'identifiant.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getConservationColor = (status: string) => {
    const colors: Record<string, string> = {
      'CR': 'bg-red-900 text-white',
      'EN': 'bg-red-700 text-white',
      'VU': 'bg-orange-600 text-white',
      'NT': 'bg-yellow-600 text-white',
      'LC': 'bg-green-600 text-white',
      'DD': 'bg-gray-500 text-white',
      'EX': 'bg-black text-white'
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const getConservationLabel = (status: string) => {
    const labels: Record<string, string> = {
      'CR': 'En Danger Critique',
      'EN': 'En Danger',
      'VU': 'Vulnérable',
      'NT': 'Quasi Menacée',
      'LC': 'Préoccupation Mineure',
      'DD': 'Données Insuffisantes',
      'EX': 'Éteinte'
    };
    return labels[status] || status;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-foreground">{species.latinName}</h1>
            {species.commonNames && species.commonNames.length > 0 && (
              <p className="text-lg text-muted-foreground mt-2">
                {species.commonNames.join(' • ')}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className="text-base">
              Section {species.section}
            </Badge>
            {species.conservation && (
              <Badge className={`text-base ${getConservationColor(species.conservation.status)}`}>
                {getConservationLabel(species.conservation.status)}
              </Badge>
            )}
          </div>
        </div>

        {species.notes && (
          <Alert>
            <BookOpen className="h-4 w-4" />
            <AlertDescription>{species.notes}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="morphology" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="morphology">Morphologie</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="molecules">Molécules</TabsTrigger>
          <TabsTrigger value="conservation">Conservation</TabsTrigger>
          <TabsTrigger value="ethnobotany">Ethnobotanique</TabsTrigger>
        </TabsList>

        {/* Morphology Tab */}
        <TabsContent value="morphology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Caractéristiques Morphologiques
              </CardTitle>
              <CardDescription>
                Description détaillée de la morphologie de {species.latinName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {species.morphology.height && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground">Hauteur</h4>
                    <p className="text-muted-foreground">{species.morphology.height}</p>
                  </div>
                </div>
              )}

              {species.morphology.stems && (
                <div>
                  <h4 className="font-semibold text-foreground">Tiges</h4>
                  <p className="text-muted-foreground">{species.morphology.stems}</p>
                </div>
              )}

              {species.morphology.leaves && (
                <div>
                  <h4 className="font-semibold text-foreground">Feuilles</h4>
                  <p className="text-muted-foreground">{species.morphology.leaves}</p>
                </div>
              )}

              {species.morphology.flowers && (
                <div>
                  <h4 className="font-semibold text-foreground">Fleurs</h4>
                  <p className="text-muted-foreground">{species.morphology.flowers}</p>
                </div>
              )}

              {species.morphology.fruits && (
                <div>
                  <h4 className="font-semibold text-foreground">Fruits</h4>
                  <p className="text-muted-foreground">{species.morphology.fruits}</p>
                </div>
              )}

              {species.morphology.otherFeatures && (
                <div>
                  <h4 className="font-semibold text-foreground">Caractéristiques Distinctives</h4>
                  <p className="text-muted-foreground">{species.morphology.otherFeatures}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Distribution Géographique
              </CardTitle>
              <CardDescription>
                Habitat et répartition de {species.latinName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {species.distribution.countries && (
                <div>
                  <h4 className="font-semibold text-foreground">Pays</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {species.distribution.countries.map((country) => (
                      <Badge key={country} variant="secondary">{country}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {species.distribution.regions && species.distribution.regions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground">Régions</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {species.distribution.regions.map((region) => (
                      <li key={region}>{region}</li>
                    ))}
                  </ul>
                </div>
              )}

              {species.distribution.habitat && (
                <div>
                  <h4 className="font-semibold text-foreground">Habitat</h4>
                  <p className="text-muted-foreground">{species.distribution.habitat}</p>
                </div>
              )}

              {species.distribution.altitude && (
                <div>
                  <h4 className="font-semibold text-foreground">Altitude</h4>
                  <p className="text-muted-foreground">{species.distribution.altitude}</p>
                </div>
              )}

              {species.distribution.climate && (
                <div>
                  <h4 className="font-semibold text-foreground">Climat</h4>
                  <p className="text-muted-foreground">{species.distribution.climate}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Molecules Tab */}
        <TabsContent value="molecules" className="space-y-4">
          <NicotianaGCMSProfile speciesId={speciesId} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Profil Moléculaire Détaillé
              </CardTitle>
              <CardDescription>
                Composition chimique générale de {species.latinName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {species.molecularProfile.primaryAlkaloids && species.molecularProfile.primaryAlkaloids.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground">Alcaloïdes Primaires</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {species.molecularProfile.primaryAlkaloids.map((alkaloid) => (
                      <li key={alkaloid}>{alkaloid}</li>
                    ))}
                  </ul>
                </div>
              )}

              {species.molecularProfile.secondaryAlkaloids && species.molecularProfile.secondaryAlkaloids.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground">Alcaloïdes Secondaires</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {species.molecularProfile.secondaryAlkaloids.map((alkaloid) => (
                      <li key={alkaloid}>{alkaloid}</li>
                    ))}
                  </ul>
                </div>
              )}

              {species.molecularProfile.volatileCompounds && species.molecularProfile.volatileCompounds.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground">Composés Volatiles</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {species.molecularProfile.volatileCompounds.map((compound) => (
                      <li key={compound}>{compound}</li>
                    ))}
                  </ul>
                </div>
              )}

              {species.molecularProfile.terpenoids && species.molecularProfile.terpenoids.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground">Terpenoïdes</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {species.molecularProfile.terpenoids.map((terpene) => (
                      <li key={terpene}>{terpene}</li>
                    ))}
                  </ul>
                </div>
              )}

              {species.molecularProfile.phenolics && species.molecularProfile.phenolics.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground">Composés Phénoliques</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {species.molecularProfile.phenolics.map((phenolic) => (
                      <li key={phenolic}>{phenolic}</li>
                    ))}
                  </ul>
                </div>
              )}

              {species.molecularProfile.gcmsSignature && (
                <div>
                  <h4 className="font-semibold text-foreground">Signature GC-MS</h4>
                  <p className="text-muted-foreground">{species.molecularProfile.gcmsSignature}</p>
                </div>
              )}

              {species.molecularProfile.notes && (
                <Alert>
                  <AlertDescription>{species.molecularProfile.notes}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conservation Tab */}
        <TabsContent value="conservation" className="space-y-4">
          {species.conservation ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Statut de Conservation
                </CardTitle>
                <CardDescription>
                  Informations de conservation pour {species.latinName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge className={`text-base ${getConservationColor(species.conservation.status)}`}>
                    {getConservationLabel(species.conservation.status)}
                  </Badge>
                </div>

                {species.conservation.threats && species.conservation.threats.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground">Menaces</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {species.conservation.threats.map((threat) => (
                        <li key={threat}>{threat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {species.conservation.conservationActions && species.conservation.conservationActions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground">Actions de Conservation</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {species.conservation.conservationActions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {species.conservation.populationTrend && (
                  <div>
                    <h4 className="font-semibold text-foreground">Tendance de la Population</h4>
                    <p className="text-muted-foreground capitalize">
                      {species.conservation.populationTrend === 'increasing' && '📈 En augmentation'}
                      {species.conservation.populationTrend === 'stable' && '➡️ Stable'}
                      {species.conservation.populationTrend === 'decreasing' && '📉 En déclin'}
                      {species.conservation.populationTrend === 'unknown' && '❓ Inconnue'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertDescription>
                Aucune information de conservation disponible pour cette espèce.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Ethnobotany Tab */}
        <TabsContent value="ethnobotany" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Ethnobotanique et Usages
              </CardTitle>
              <CardDescription>
                Utilisation traditionnelle et contemporaine de {species.latinName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {species.uses && species.uses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground">Usages</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {species.uses.map((use) => (
                      <li key={use}>{use}</li>
                    ))}
                  </ul>
                </div>
              )}

              {species.ethnobotany && (
                <div>
                  <h4 className="font-semibold text-foreground">Ethnobotanique</h4>
                  <p className="text-muted-foreground">{species.ethnobotany}</p>
                </div>
              )}

              {species.references && species.references.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground">Références</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {species.references.map((ref) => (
                      <li key={ref}>{ref}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
