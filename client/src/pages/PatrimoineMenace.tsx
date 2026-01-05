import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Leaf, Shield, MapPin, Map as MapIcon } from 'lucide-react';
import { MapView } from '@/components/Map';
import { ZoneSpeciesPanel } from '@/components/ZoneSpeciesPanel';

export default function PatrimoineMenace() {
  const [iucnFilter, setIucnFilter] = useState<string | undefined>(undefined);
  const [citesFilter, setCitesFilter] = useState<string | undefined>(undefined);
  const [showMap, setShowMap] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [overlays, setOverlays] = useState<google.maps.Polygon[]>([]);
  const [showOverlays, setShowOverlays] = useState(true);
  const [overlayFilter, setOverlayFilter] = useState<string | undefined>(undefined);
  const [selectedZone, setSelectedZone] = useState<{ id: number; name: string; color: string } | null>(null);

  const { data: geographicZones } = trpc.plantsConservation.listGeographicZones.useQuery();

  // Mettre à jour les overlays quand les filtres changent
  useEffect(() => {
    if (!mapInstance || !geographicZones) return;
    
    // Nettoyer les anciens overlays
    overlays.forEach(overlay => overlay.setMap(null));
    
    if (!showOverlays) {
      setOverlays([]);
      return;
    }
    
    const newOverlays: google.maps.Polygon[] = [];
    
    geographicZones
      .filter(zone => !overlayFilter || zone.zoneType === overlayFilter)
      .forEach((zone) => {
        const polygon = new google.maps.Polygon({
          paths: zone.coordinates,
          strokeColor: zone.overlayColor,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: zone.overlayColor,
          fillOpacity: parseFloat(zone.overlayOpacity || '0.3'),
          map: mapInstance,
        });
        
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 350px;">
              <h3 style="font-weight: bold; margin-bottom: 8px; color: ${zone.overlayColor};">${zone.name}</h3>
              <p style="margin-bottom: 8px;">${zone.description}</p>
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px; font-size: 0.9em;">
                <strong>Région:</strong><span>${zone.region}</span>
                <strong>Niveau de menace:</strong><span>${zone.threatLevel}</span>
                <strong>Espèces:</strong><span>${zone.speciesCount}</span>
                <strong>Priorité:</strong><span>${zone.conservationPriority}</span>
              </div>
              ${zone.sustainableAlternatives ? `<p style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd; font-size: 0.9em;"><strong>Alternatives:</strong> ${zone.sustainableAlternatives}</p>` : ''}
              ${zone.conservationEfforts ? `<p style="margin-top: 4px; font-size: 0.9em;"><strong>Efforts:</strong> ${zone.conservationEfforts}</p>` : ''}
            </div>
          `,
        });
        
        polygon.addListener('click', (event: google.maps.PolyMouseEvent) => {
          infoWindow.setPosition(event.latLng);
          infoWindow.open(mapInstance);
        });
        
        newOverlays.push(polygon);
      });
    
    setOverlays(newOverlays);
  }, [mapInstance, geographicZones, showOverlays, overlayFilter]);

  const { data: threatenedPlants, isLoading } = trpc.plantsConservation.listThreatened.useQuery({
    iucn: iucnFilter as any,
    cites: citesFilter as any,
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

      {/* Bouton pour afficher/masquer la carte */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {showMap && (
            <>
              <Button
                variant={showOverlays ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOverlays(!showOverlays)}
              >
                {showOverlays ? 'Masquer les zones' : 'Afficher les zones'}
              </Button>
              <Select value={overlayFilter} onValueChange={(v) => setOverlayFilter(v === 'all' ? undefined : v)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Toutes les zones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les zones</SelectItem>
                  <SelectItem value="threatened_concentration">Zones menacées</SelectItem>
                  <SelectItem value="sustainable_alternatives">Alternatives durables</SelectItem>
                  <SelectItem value="biodiversity_hotspot">Points chauds</SelectItem>
                  <SelectItem value="conservation_area">Zones de conservation</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        <Button
          variant={showMap ? "default" : "outline"}
          onClick={() => setShowMap(!showMap)}
        >
          <MapIcon className="h-4 w-4 mr-2" />
          {showMap ? 'Masquer la carte' : 'Afficher la carte'}
        </Button>
      </div>

      {/* Carte interactive */}
      {showMap && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapIcon className="h-5 w-5" />
              Carte des espèces menacées
            </CardTitle>
            <CardDescription>
              Visualisation géographique des espèces aromatiques menacées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Légende de la carte */}
            <div className="mb-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-semibold mb-3">Légende de la carte</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
                  <div className="text-xs">
                    <div className="font-medium">Zone menacée</div>
                    <div className="text-muted-foreground">Forte concentration d'espèces en danger</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
                  <div className="text-xs">
                    <div className="font-medium">Zone de conservation</div>
                    <div className="text-muted-foreground">Aires protégées et efforts actifs</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
                  <div className="text-xs">
                    <div className="font-medium">Zone durable</div>
                    <div className="text-muted-foreground">Alternatives durables disponibles</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#eab308' }}></div>
                  <div className="text-xs">
                    <div className="font-medium">Zone de biodiversité</div>
                    <div className="text-muted-foreground">Point chaud de diversité olfactive</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[600px] rounded-lg overflow-hidden border relative">
              {selectedZone && (
                <ZoneSpeciesPanel
                  zoneId={selectedZone.id}
                  zoneName={selectedZone.name}
                  zoneColor={selectedZone.color}
                  onClose={() => setSelectedZone(null)}
                />
              )}
              <MapView
                onMapReady={(map) => {
                  setMapInstance(map);
                  
                  // Nettoyer les anciens marqueurs et overlays
                  markers.forEach(marker => marker.setMap(null));
                  overlays.forEach(overlay => overlay.setMap(null));
                  const newMarkers: google.maps.Marker[] = [];
                  const newOverlays: google.maps.Polygon[] = [];
                  
                  const bounds = new google.maps.LatLngBounds();
                  
                  // Ajouter les overlays de zones géographiques
                  if (geographicZones && showOverlays) {
                    geographicZones
                      .filter(zone => !overlayFilter || zone.zoneType === overlayFilter)
                      .forEach((zone) => {
                        const polygon = new google.maps.Polygon({
                          paths: zone.coordinates,
                          strokeColor: zone.overlayColor,
                          strokeOpacity: 0.8,
                          strokeWeight: 2,
                          fillColor: zone.overlayColor,
                          fillOpacity: parseFloat(zone.overlayOpacity || '0.3'),
                          map: map,
                        });
                        
                        const infoWindow = new google.maps.InfoWindow({
                          content: `
                            <div style="padding: 12px; max-width: 350px;">
                              <h3 style="font-weight: bold; margin-bottom: 8px; color: ${zone.overlayColor};">${zone.name}</h3>
                              <p style="margin-bottom: 8px;">${zone.description}</p>
                              <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px; font-size: 0.9em;">
                                <strong>Région:</strong><span>${zone.region}</span>
                                <strong>Niveau de menace:</strong><span>${zone.threatLevel}</span>
                                <strong>Espèces:</strong><span>${zone.speciesCount}</span>
                                <strong>Priorité:</strong><span>${zone.conservationPriority}</span>
                              </div>
                              ${zone.sustainableAlternatives ? `<p style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd; font-size: 0.9em;"><strong>Alternatives:</strong> ${zone.sustainableAlternatives}</p>` : ''}
                              ${zone.conservationEfforts ? `<p style="margin-top: 4px; font-size: 0.9em;"><strong>Efforts:</strong> ${zone.conservationEfforts}</p>` : ''}
                            </div>
                          `,
                        });
                        
                        polygon.addListener('click', () => {
                          setSelectedZone({
                            id: zone.id,
                            name: zone.name,
                            color: zone.overlayColor || '#3b82f6'
                          });
                        });
                        
                        newOverlays.push(polygon);
                        
                        // Étendre les bounds pour inclure la zone
                        zone.coordinates.forEach((coord: {lat: number, lng: number}) => {
                          bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
                        });
                      });
                  }
                  
                  // Ajouter un marqueur pour chaque plante avec coordonnées GPS
                  if (threatenedPlants) {
                    threatenedPlants.forEach((plant) => {
                      // Utiliser les vraies coordonnées GPS si disponibles
                      const lat = plant.latitude ? parseFloat(plant.latitude) : null;
                      const lng = plant.longitude ? parseFloat(plant.longitude) : null;
                      
                      if (lat && lng) {
                        const coords = { lat, lng };
                        
                        const marker = new google.maps.Marker({
                          position: coords,
                          map: map,
                          title: plant.name,
                          icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: getColorForStatus(plant.conservationStatus || ''),
                            fillOpacity: 0.9,
                            strokeColor: '#fff',
                            strokeWeight: 2,
                          },
                        });
                        
                        const iucnInfo = plant.conservationStatus ? iucnLabels[plant.conservationStatus] : null;
                        const infoWindow = new google.maps.InfoWindow({
                          content: `
                            <div style="padding: 8px; max-width: 300px;">
                              <h3 style="font-weight: bold; margin-bottom: 4px;">${plant.name}</h3>
                              <p style="font-style: italic; color: #666; margin-bottom: 8px;">${plant.latinName || ''}</p>
                              ${iucnInfo ? `<p style="margin-bottom: 4px;"><strong>Statut IUCN:</strong> ${iucnInfo.label}</p>` : ''}
                              ${plant.origin ? `<p style="margin-bottom: 4px;"><strong>Origine:</strong> ${plant.origin}</p>` : ''}
                              ${plant.conservationNotes ? `<p style="margin-top: 8px; font-size: 0.9em; color: #666;">${plant.conservationNotes}</p>` : ''}
                            </div>
                          `,
                        });
                        
                        marker.addListener('click', () => {
                          infoWindow.open(map, marker);
                        });
                        
                        newMarkers.push(marker);
                        bounds.extend(coords);
                      }
                    });
                  }
                  
                  setMarkers(newMarkers);
                  setOverlays(newOverlays);
                  
                  // Ajuster la vue pour inclure tous les éléments
                  if (newMarkers.length > 0 || newOverlays.length > 0) {
                    map.fitBounds(bounds);
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

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


// Fonction helper pour obtenir les coordonnées basées sur l'origine
function getCoordinatesForOrigin(origin: string): { lat: number; lng: number } | null {
  // Mapping simple des origines vers des coordonnées approximatives
  const originCoords: Record<string, { lat: number; lng: number }> = {
    'Oman': { lat: 21.4735, lng: 55.9754 },
    'Inde': { lat: 20.5937, lng: 78.9629 },
    'Himalaya': { lat: 28.5983, lng: 83.9956 },
    'Indonésie': { lat: -0.7893, lng: 113.9213 },
    'Brésil': { lat: -14.2350, lng: -51.9253 },
    'Arabie': { lat: 23.8859, lng: 45.0792 },
    'Moyen-Orient': { lat: 29.2985, lng: 42.5510 },
    'Asie': { lat: 34.0479, lng: 100.6197 },
    'Afrique': { lat: -8.7832, lng: 34.5085 },
  };
  
  // Chercher une correspondance partielle
  for (const [key, coords] of Object.entries(originCoords)) {
    if (origin.includes(key)) {
      return coords;
    }
  }
  
  return null;
}

// Fonction helper pour obtenir la couleur selon le statut IUCN
function getColorForStatus(status: string): string {
  const colors: Record<string, string> = {
    'EX': '#000000',
    'EW': '#1a1a1a',
    'CR': '#dc2626',
    'EN': '#ea580c',
    'VU': '#ca8a04',
    'NT': '#eab308',
    'LC': '#16a34a',
    'DD': '#6b7280',
    'NE': '#9ca3af',
  };
  
  return colors[status] || '#6b7280';
}
