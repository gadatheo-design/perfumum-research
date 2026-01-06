/**
 * TradeRoutesMap - Carte interactive des routes commerciales historiques
 * Affiche les routes de commerce des aromates et parfums à travers l'histoire
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { MapView } from "./Map";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import { Route, MapPin, Calendar, Package, Eye, EyeOff, Info } from "lucide-react";

// Couleurs pour les différentes routes
const ROUTE_COLORS: Record<string, string> = {
  'TR_001': '#8B4513', // Route de l'Encens - Brun
  'TR_002': '#DAA520', // Route de la Soie - Or
  'TR_003': '#1E90FF', // Route Maritime - Bleu
  'TR_004': '#228B22', // Route du Mastic - Vert
  'TR_005': '#DC143C', // Route Transatlantique - Rouge
  'TR_006': '#9932CC', // Route des Épices Indiennes - Violet
};

// Couleurs pour les rôles des nodes
const NODE_COLORS: Record<string, string> = {
  'source': '#22c55e',      // Vert - Origine
  'hub': '#f59e0b',         // Orange - Carrefour
  'port': '#3b82f6',        // Bleu - Port
  'destination': '#ef4444', // Rouge - Destination
};

interface TradeRoute {
  id: number;
  route_id: string;
  name: string;
  time_start: number | null;
  time_end: number | null;
  nodes: Array<{
    lat: number;
    lon: number;
    place: string;
    role: string;
  }>;
  materials: string[];
  notes: string | null;
  sources: string[];
}

interface TradeRoutesMapProps {
  className?: string;
  showFilters?: boolean;
  initialRouteId?: string;
}

export function TradeRoutesMap({ 
  className, 
  showFilters = true,
  initialRouteId 
}: TradeRoutesMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  const [selectedRoute, setSelectedRoute] = useState<string | null>(initialRouteId || null);
  const [visibleRoutes, setVisibleRoutes] = useState<Set<string>>(new Set());
  const [periodFilter, setPeriodFilter] = useState<[number, number]>([-2000, 2000]);
  const [materialFilter, setMaterialFilter] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const { data: routes, isLoading } = trpc.tradeRoutes.list.useQuery({
    periodStart: periodFilter[0],
    periodEnd: periodFilter[1],
    material: materialFilter || undefined,
  });
  
  const { data: stats } = trpc.tradeRoutes.getStats.useQuery();
  
  // Initialiser les routes visibles
  useEffect(() => {
    if (routes && visibleRoutes.size === 0) {
      setVisibleRoutes(new Set(routes.map((r: TradeRoute) => r.route_id)));
    }
  }, [routes]);
  
  // Nettoyer les marqueurs et polylines
  const clearMapElements = useCallback(() => {
    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  }, []);
  
  // Créer un marqueur personnalisé
  const createMarkerContent = (node: any, routeId: string) => {
    const color = NODE_COLORS[node.role] || '#6b7280';
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
      " title="${node.place} (${node.role})"></div>
    `;
    return div;
  };
  
  // Dessiner les routes sur la carte
  const drawRoutes = useCallback(() => {
    if (!mapRef.current || !routes) return;
    
    clearMapElements();
    
    const bounds = new google.maps.LatLngBounds();
    let hasVisibleRoutes = false;
    
    routes.forEach((route: TradeRoute) => {
      if (!visibleRoutes.has(route.route_id)) return;
      if (!route.nodes || route.nodes.length === 0) return;
      
      hasVisibleRoutes = true;
      const routeColor = ROUTE_COLORS[route.route_id] || '#6b7280';
      const isSelected = selectedRoute === route.route_id;
      
      // Créer le tracé de la route
      const path = route.nodes.map(node => ({
        lat: node.lat,
        lng: node.lon,
      }));
      
      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: routeColor,
        strokeOpacity: isSelected ? 1.0 : 0.6,
        strokeWeight: isSelected ? 4 : 2,
        map: mapRef.current,
      });
      
      polylinesRef.current.push(polyline);
      
      // Ajouter les marqueurs pour chaque node
      route.nodes.forEach((node, index) => {
        const position = { lat: node.lat, lng: node.lon };
        bounds.extend(position);
        
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapRef.current,
          position,
          title: `${node.place} (${node.role})`,
          content: createMarkerContent(node, route.route_id),
        });
        
        // Événement au clic sur le marqueur
        marker.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 250px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">${node.place}</h3>
                <p style="color: #666; font-size: 12px; margin-bottom: 8px;">
                  <span style="
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 4px;
                    background-color: ${NODE_COLORS[node.role]}20;
                    color: ${NODE_COLORS[node.role]};
                    font-weight: 500;
                  ">${node.role}</span>
                </p>
                <p style="font-size: 13px; margin-bottom: 4px;">
                  <strong>Route:</strong> ${route.name}
                </p>
                <p style="font-size: 12px; color: #666;">
                  <strong>Période:</strong> ${route.time_start || '?'} — ${route.time_end || '?'}
                </p>
                ${route.materials?.length > 0 ? `
                  <p style="font-size: 12px; color: #666; margin-top: 4px;">
                    <strong>Marchandises:</strong> ${route.materials.slice(0, 4).join(', ')}${route.materials.length > 4 ? '...' : ''}
                  </p>
                ` : ''}
              </div>
            `,
          });
          
          infoWindow.open(mapRef.current, marker);
          infoWindowRef.current = infoWindow;
          setSelectedNode({ ...node, route });
        });
        
        markersRef.current.push(marker);
      });
    });
    
    // Ajuster la vue pour montrer toutes les routes visibles
    if (hasVisibleRoutes && !bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds, { padding: 50 });
    }
  }, [routes, visibleRoutes, selectedRoute, clearMapElements]);
  
  // Redessiner quand les données changent
  useEffect(() => {
    drawRoutes();
  }, [drawRoutes]);
  
  // Toggle visibilité d'une route
  const toggleRouteVisibility = (routeId: string) => {
    setVisibleRoutes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(routeId)) {
        newSet.delete(routeId);
      } else {
        newSet.add(routeId);
      }
      return newSet;
    });
  };
  
  // Centrer sur une route spécifique
  const focusOnRoute = (routeId: string) => {
    setSelectedRoute(routeId);
    const route = routes?.find((r: TradeRoute) => r.route_id === routeId);
    if (route && mapRef.current && route.nodes?.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      route.nodes.forEach((node: any) => {
        bounds.extend({ lat: node.lat, lng: node.lon });
      });
      mapRef.current.fitBounds(bounds, { padding: 80 });
    }
  };
  
  // Formater la période
  const formatPeriod = (start: number | null, end: number | null) => {
    const formatYear = (year: number | null) => {
      if (year === null) return '?';
      if (year < 0) return `${Math.abs(year)} av. J.-C.`;
      return `${year} ap. J.-C.`;
    };
    return `${formatYear(start)} — ${formatYear(end)}`;
  };
  
  return (
    <div className={className}>
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Panneau de contrôle */}
        {showFilters && (
          <div className="lg:col-span-1 space-y-4">
            {/* Filtres */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filtre par période */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Période historique
                  </label>
                  <div className="px-2">
                    <Slider
                      value={periodFilter}
                      onValueChange={(value) => setPeriodFilter(value as [number, number])}
                      min={-2000}
                      max={2000}
                      step={100}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{periodFilter[0] < 0 ? `${Math.abs(periodFilter[0])} av. J.-C.` : periodFilter[0]}</span>
                      <span>{periodFilter[1] < 0 ? `${Math.abs(periodFilter[1])} av. J.-C.` : periodFilter[1]}</span>
                    </div>
                  </div>
                </div>
                
                {/* Filtre par matériau */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Marchandise
                  </label>
                  <Select value={materialFilter} onValueChange={setMaterialFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les marchandises" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes</SelectItem>
                      {stats?.materials?.map((mat: string) => (
                        <SelectItem key={mat} value={mat}>
                          {mat.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {/* Liste des routes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Routes ({routes?.length || 0})</CardTitle>
                <CardDescription>Cliquez pour centrer, icône pour masquer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                    ))}
                  </div>
                ) : (
                  routes?.map((route: TradeRoute) => (
                    <div
                      key={route.route_id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedRoute === route.route_id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      } ${!visibleRoutes.has(route.route_id) ? 'opacity-50' : ''}`}
                      onClick={() => focusOnRoute(route.route_id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: ROUTE_COLORS[route.route_id] || '#6b7280' }}
                            />
                            <span className="font-medium text-sm truncate">{route.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatPeriod(route.time_start, route.time_end)}</span>
                          </div>
                          {route.materials?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {route.materials.slice(0, 3).map((mat, i) => (
                                <Badge key={i} variant="outline" className="text-xs py-0">
                                  {mat.replace(/_/g, ' ')}
                                </Badge>
                              ))}
                              {route.materials.length > 3 && (
                                <Badge variant="outline" className="text-xs py-0">
                                  +{route.materials.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRouteVisibility(route.route_id);
                          }}
                        >
                          {visibleRoutes.has(route.route_id) ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            
            {/* Légende */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Légende
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">Types de points</div>
                {Object.entries(NODE_COLORS).map(([role, color]) => (
                  <div key={role} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full border border-white"
                      style={{ backgroundColor: color }}
                    />
                    <span className="capitalize">{role === 'source' ? 'Origine' : role === 'hub' ? 'Carrefour' : role === 'port' ? 'Port' : 'Destination'}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Carte */}
        <div className={showFilters ? "lg:col-span-3" : "col-span-full"}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <MapView
                className="h-[600px] w-full"
                initialCenter={{ lat: 30, lng: 45 }}
                initialZoom={3}
                onMapReady={(map) => {
                  mapRef.current = map;
                  // Configurer le style de la carte pour un look historique
                  map.setOptions({
                    styles: [
                      {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{ color: "#a3ccff" }]
                      },
                      {
                        featureType: "landscape",
                        elementType: "geometry",
                        stylers: [{ color: "#f5f5dc" }]
                      },
                      {
                        featureType: "road",
                        stylers: [{ visibility: "off" }]
                      },
                      {
                        featureType: "administrative.country",
                        elementType: "geometry.stroke",
                        stylers: [{ color: "#8b7355" }, { weight: 1 }]
                      },
                      {
                        featureType: "poi",
                        stylers: [{ visibility: "off" }]
                      },
                    ]
                  });
                  drawRoutes();
                }}
              />
            </CardContent>
          </Card>
          
          {/* Détails du node sélectionné */}
          {selectedNode && (
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" style={{ color: NODE_COLORS[selectedNode.role] }} />
                    {selectedNode.place}
                  </CardTitle>
                  <Badge style={{ 
                    backgroundColor: `${NODE_COLORS[selectedNode.role]}20`,
                    color: NODE_COLORS[selectedNode.role]
                  }}>
                    {selectedNode.role === 'source' ? 'Origine' : 
                     selectedNode.role === 'hub' ? 'Carrefour' : 
                     selectedNode.role === 'port' ? 'Port' : 'Destination'}
                  </Badge>
                </div>
                <CardDescription>
                  Route: {selectedNode.route.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Période d'activité
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formatPeriod(selectedNode.route.time_start, selectedNode.route.time_end)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Marchandises transitées
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.route.materials?.map((mat: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {mat.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                {selectedNode.route.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">{selectedNode.route.notes}</p>
                  </div>
                )}
                {selectedNode.route.sources?.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Sources historiques</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedNode.route.sources.join(', ')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default TradeRoutesMap;
