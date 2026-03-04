// @ts-nocheck
/**
 * Composant de carte Leaflet/OpenStreetMap
 * Alternative à Google Maps pour les visualisations géographiques
 */

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

// Fix pour les icônes Leaflet avec Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configuration des icônes par défaut
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LeafletMapProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  onMapReady?: (map: L.Map) => void;
}

export function LeafletMap({
  className,
  initialCenter = [20, 10],
  initialZoom = 2,
  onMapReady,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Créer la carte
    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      attributionControl: true,
    });

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Callback quand la carte est prête
    if (onMapReady) {
      onMapReady(map);
    }

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [initialCenter, initialZoom, onMapReady]);

  return (
    <div 
      ref={containerRef} 
      className={cn("w-full h-[500px]", className)} 
    />
  );
}

// Couleurs par type de climat
export const CLIMATE_COLORS: Record<string, string> = {
  tropical: "#22c55e",
  subtropical: "#84cc16",
  mediterranean: "#f59e0b",
  oceanic: "#3b82f6",
  continental: "#8b5cf6",
  arid: "#ef4444",
  semi_arid: "#f97316",
  alpine: "#06b6d4",
  equatorial: "#10b981",
  default: "#6b7280",
};

// Créer un marqueur circulaire personnalisé
export function createCircleMarker(
  map: L.Map,
  lat: number,
  lng: number,
  options: {
    color?: string;
    radius?: number;
    label?: string;
    popup?: string;
    onClick?: () => void;
  }
): L.CircleMarker {
  const marker = L.circleMarker([lat, lng], {
    radius: options.radius || 10,
    fillColor: options.color || CLIMATE_COLORS.default,
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8,
  }).addTo(map);

  if (options.popup) {
    marker.bindPopup(options.popup);
  }

  if (options.label) {
    marker.bindTooltip(options.label, {
      permanent: false,
      direction: "top",
      offset: [0, -10],
    });
  }

  if (options.onClick) {
    marker.on("click", options.onClick);
  }

  return marker;
}

// Créer un groupe de marqueurs pour les clusters
export function createMarkerClusterGroup(): L.LayerGroup {
  return L.layerGroup();
}

export default LeafletMap;
