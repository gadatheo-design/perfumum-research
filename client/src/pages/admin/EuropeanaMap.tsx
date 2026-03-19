/**
 * PERFUMUM — Carte de distribution géographique Europeana
 * =========================================================
 * Visualise la répartition géographique des collections muséales
 * européennes par thème PERFUMUM, basée sur les facettes COUNTRY.
 *
 * Sprint 2 — Fonctionnalités :
 * - Carte Google Maps avec marqueurs proportionnels par pays
 * - Sélecteur de thème (12 thèmes disponibles)
 * - Classement des pays par nombre d'items
 * - Info-bulles avec détail institution
 * - Liens croisés vers l'Explorateur Europeana
 * - Mode dégradé si clé API manquante (données de démonstration)
 */

import { useState, useRef, useCallback, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { MapView } from "@/components/Map";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Globe, MapPin, Building2, Loader2, Info, ArrowLeft,
  BarChart2, ExternalLink, Layers, Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CountryData {
  code: string;
  count: number;
  lat?: number;
  lng?: number;
  institutions?: string[];
}

// ─── Palette de couleurs par thème ────────────────────────────────────────────

const THEME_COLORS: Record<string, string> = {
  rose_damas:            "#e11d48",
  encens:                "#d97706",
  tabac_ottoman:         "#7c3aed",
  houblon:               "#16a34a",
  nard:                  "#0891b2",
  myrrhe:                "#b45309",
  flacons_parfum:        "#8b5cf6",
  illustrations_botaniques: "#059669",
  routes_epices:         "#f59e0b",
  distillation_alchimie: "#6366f1",
  jardins_botaniques:    "#10b981",
  rituels_olfactifs:     "#dc2626",
};

const THEME_ICONS: Record<string, string> = {
  rose_damas: "🌹", encens: "🕯️", tabac_ottoman: "🪄", houblon: "🌿",
  nard: "🏺", myrrhe: "🌿", flacons_parfum: "🫙", illustrations_botaniques: "🌱",
  routes_epices: "🗺️", distillation_alchimie: "⚗️", jardins_botaniques: "🌳",
  rituels_olfactifs: "🔥",
};

const NEW_THEMES = ["flacons_parfum", "illustrations_botaniques", "routes_epices", "distillation_alchimie", "jardins_botaniques", "rituels_olfactifs"];

// ─── Composant principal ──────────────────────────────────────────────────────

export default function EuropeanaMap() {
  const [selectedTheme, setSelectedTheme] = useState("rose_damas");
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Charger la configuration des thèmes
  const { data: themeConfig } = trpc.europeana.thematicConfig.useQuery();

  // Charger la distribution géographique pour le thème sélectionné
  const { data: distribution, isLoading } = trpc.europeana.countryDistribution.useQuery(
    { theme: selectedTheme, limit: 30 },
    { enabled: true }
  );

  // Calculer le max pour la normalisation des tailles de marqueurs
  const maxCount = useMemo(() => {
    if (!distribution?.countries?.length) return 1;
    return Math.max(...distribution.countries.map((c) => c.count));
  }, [distribution]);

  // Placer les marqueurs sur la carte quand les données arrivent
  const updateMarkers = useCallback((map: google.maps.Map, countries: CountryData[]) => {
    // Supprimer les anciens marqueurs
    markersRef.current.forEach((m) => { m.map = null; });
    markersRef.current = [];
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    const themeColor = THEME_COLORS[selectedTheme] || "#6366f1";
    const localMax = Math.max(...countries.map((c) => c.count), 1);

    countries.forEach((country) => {
      if (!country.lat || !country.lng) return;

      // Taille proportionnelle au nombre d'items (min 20px, max 60px)
      const ratio = country.count / localMax;
      const size = Math.round(20 + ratio * 40);

      // Créer un marqueur SVG coloré avec taille proportionnelle
      const markerEl = document.createElement("div");
      markerEl.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${themeColor};
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.15s ease;
        font-size: ${Math.max(9, Math.round(size * 0.3))}px;
        font-weight: 700;
        color: white;
        font-family: sans-serif;
      `;
      markerEl.textContent = country.count >= 1000
        ? `${Math.round(country.count / 1000)}k`
        : String(country.count);
      markerEl.title = `${country.code} — ${country.count.toLocaleString()} items`;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: country.lat, lng: country.lng },
        title: country.code,
        content: markerEl,
      });

      // Info-bulle au clic
      marker.addListener("click", () => {
        if (!infoWindowRef.current) {
          infoWindowRef.current = new google.maps.InfoWindow();
        }

        const institutionsHtml = country.institutions && country.institutions.length > 0
          ? `<div style="margin-top:6px;font-size:11px;color:#666;">
              <strong>Institutions :</strong><br>
              ${country.institutions.slice(0, 3).map((i) => `• ${i}`).join("<br>")}
            </div>`
          : "";

        infoWindowRef.current.setContent(`
          <div style="font-family:sans-serif;padding:4px;max-width:220px;">
            <div style="font-size:14px;font-weight:700;color:#1f2937;">${country.code}</div>
            <div style="font-size:13px;color:${themeColor};margin-top:2px;">
              <strong>${country.count.toLocaleString()}</strong> items dans les collections
            </div>
            ${institutionsHtml}
            <div style="margin-top:8px;">
              <a href="/europeana" style="font-size:11px;color:#6366f1;text-decoration:none;">
                → Voir dans l'Explorateur
              </a>
            </div>
          </div>
        `);
        infoWindowRef.current.open({ anchor: marker, map });
      });

      // Hover effect
      markerEl.addEventListener("mouseenter", () => {
        markerEl.style.transform = "scale(1.2)";
        markerEl.style.zIndex = "100";
      });
      markerEl.addEventListener("mouseleave", () => {
        markerEl.style.transform = "scale(1)";
        markerEl.style.zIndex = "1";
      });

      markersRef.current.push(marker);
    });
  }, [selectedTheme]);

  // Callback quand la carte est prête
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);

    // Centrer sur l'Europe
    map.setCenter({ lat: 50.0, lng: 10.0 });
    map.setZoom(4);

    // Placer les marqueurs si les données sont déjà disponibles
    if (distribution?.countries?.length) {
      updateMarkers(map, distribution.countries);
    }
  }, [distribution, updateMarkers]);

  // Mettre à jour les marqueurs quand les données changent
  const prevThemeRef = useRef(selectedTheme);
  if (mapRef.current && distribution?.countries && (
    prevThemeRef.current !== selectedTheme || mapReady
  )) {
    prevThemeRef.current = selectedTheme;
    updateMarkers(mapRef.current, distribution.countries);
  }

  const currentThemeConfig = themeConfig?.find((t) => t.key === selectedTheme);
  const themeColor = THEME_COLORS[selectedTheme] || "#6366f1";
  const themeIcon = THEME_ICONS[selectedTheme] || "🔍";

  return (
    <div className="container py-6 space-y-6">
      {/* En-tête */}
      <div>
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <Link href="/europeana">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground h-7 px-2">
              <ArrowLeft className="h-3.5 w-3.5" />
              Explorateur
            </Button>
          </Link>
          <Globe className="h-6 w-6 text-cyan-600 shrink-0" />
          <h1 className="text-xl md:text-2xl font-bold">Distribution géographique</h1>
          <Badge variant="secondary" className="text-xs">Europeana × PERFUMUM</Badge>
          <Badge className="text-xs bg-indigo-600 text-white">Sprint 2</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Répartition géographique des collections muséales européennes par thème PERFUMUM.
          Basée sur les facettes COUNTRY de l'API Europeana.
        </p>
      </div>

      {/* Sélecteur de thème */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Thème :</span>
        </div>
        <Select value={selectedTheme} onValueChange={setSelectedTheme}>
          <SelectTrigger className="w-64">
            <SelectValue>
              <span className="flex items-center gap-2">
                <span>{themeIcon}</span>
                <span>{currentThemeConfig?.label || selectedTheme}</span>
                {NEW_THEMES.includes(selectedTheme) && (
                  <Badge className="text-[10px] bg-indigo-600 text-white h-3.5 px-1 ml-1">N</Badge>
                )}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1 text-xs text-muted-foreground font-semibold uppercase tracking-wide">
              Thèmes existants
            </div>
            {["rose_damas", "encens", "tabac_ottoman", "houblon", "nard", "myrrhe"].map((key) => {
              const t = themeConfig?.find((c) => c.key === key);
              return (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <span>{THEME_ICONS[key]}</span>
                    <span>{t?.label || key}</span>
                  </span>
                </SelectItem>
              );
            })}
            <div className="px-2 py-1 text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-1 border-t">
              Nouveaux thèmes — Sprint 1
            </div>
            {NEW_THEMES.map((key) => {
              const t = themeConfig?.find((c) => c.key === key);
              return (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <span>{THEME_ICONS[key]}</span>
                    <span>{t?.label || key}</span>
                    <Badge className="text-[10px] bg-indigo-600 text-white h-3.5 px-1">N</Badge>
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Statistiques rapides */}
        {distribution && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BarChart2 className="h-3.5 w-3.5" />
              {distribution.total.toLocaleString()} items
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {distribution.countries.length} pays
            </span>
            {!distribution.apiAvailable && (
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-400">
                Mode démo
              </Badge>
            )}
            {distribution.apiAvailable && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-400">
                API active
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Bannière démo */}
      {distribution && !distribution.apiAvailable && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="p-3 flex items-start gap-3">
            <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <strong>Mode démonstration</strong> — données géographiques d'exemple.
              Ajoutez <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">EUROPEANA_API_KEY</code> dans les secrets pour voir les vraies distributions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Carte + classement côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Carte */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <span>{themeIcon}</span>
                {currentThemeConfig?.label || selectedTheme}
                {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
              </CardTitle>
              <Link href="/europeana">
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <ExternalLink className="h-3 w-3" />
                  Voir les œuvres
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 mt-2">
              <MapView
                className="h-[420px] w-full"
                initialCenter={{ lat: 50.0, lng: 10.0 }}
                initialZoom={4}
                onMapReady={handleMapReady}
              />
            </CardContent>
          </Card>
          {/* Légende */}
          <div className="flex items-center gap-4 mt-2 px-1 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div
                className="w-3 h-3 rounded-full border border-white shadow"
                style={{ background: themeColor, opacity: 0.5 }}
              />
              <span>Peu de collections</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div
                className="w-5 h-5 rounded-full border border-white shadow"
                style={{ background: themeColor }}
              />
              <span>Beaucoup de collections</span>
            </div>
            <p className="text-xs text-muted-foreground ml-auto">
              Cliquez sur un marqueur pour les détails
            </p>
          </div>
        </div>

        {/* Classement des pays */}
        <div className="space-y-3">
          <Card>
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart2 className="h-4 w-4" style={{ color: themeColor }} />
                Top pays
              </CardTitle>
              <CardDescription className="text-xs">
                Collections par pays pour ce thème
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2 max-h-[360px] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : distribution?.countries.length ? (
                distribution.countries
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 20)
                  .map((country, idx) => {
                    const barWidth = Math.round((country.count / maxCount) * 100);
                    return (
                      <div key={country.code} className="space-y-0.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5">
                            <span className="text-muted-foreground w-4 text-right shrink-0">
                              {idx + 1}.
                            </span>
                            <span className="font-medium truncate max-w-[120px]">
                              {country.code}
                            </span>
                          </span>
                          <span className="font-mono text-xs text-muted-foreground shrink-0">
                            {country.count.toLocaleString()}
                          </span>
                        </div>
                        {/* Barre de progression */}
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden ml-6">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${barWidth}%`,
                              background: themeColor,
                              opacity: 0.7 + (barWidth / 100) * 0.3,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Aucune donnée disponible
                </p>
              )}
            </CardContent>
          </Card>

          {/* Lien vers l'explorateur */}
          <Card className="border-dashed">
            <CardContent className="p-3 space-y-2">
              <p className="text-xs font-medium flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                Explorer les collections
              </p>
              <p className="text-xs text-muted-foreground">
                Cliquez sur un marqueur puis "Voir dans l'Explorateur" pour accéder aux œuvres du pays sélectionné.
              </p>
              <Link href="/europeana">
                <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-1">
                  <Globe className="h-3.5 w-3.5" />
                  Ouvrir l'Explorateur Europeana
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Description du thème */}
      {currentThemeConfig && (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{themeIcon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">{currentThemeConfig.label}</p>
                <p className="text-xs text-muted-foreground mb-2">{currentThemeConfig.description}</p>
                <div className="flex flex-wrap gap-1">
                  {currentThemeConfig.relatedPlants.map((p) => (
                    <Badge key={p} variant="outline" className="text-xs">
                      🌿 {p}
                    </Badge>
                  ))}
                  {currentThemeConfig.relatedMolecules.map((m) => (
                    <Badge key={m} variant="outline" className="text-xs">
                      ⚗️ {m}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
