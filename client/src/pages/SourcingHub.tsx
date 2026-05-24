// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { useState, useMemo, useRef, useCallback } from "react";
import { Link } from "wouter";
import { MapView } from "@/components/Map";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Truck,
  Package,
  Globe,
  Star,
  Search,
  Filter,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Award,
  Clock,
  ShoppingCart,
  Leaf,
  Cigarette,
  FlaskConical,
  Building2,
  ChevronRight,
  Map as MapIcon,
  List,
} from "lucide-react";

const SUPPLIER_TYPE_LABELS: Record<string, string> = {
  trader: "Négociant",
  producer: "Producteur",
  broker: "Courtier",
  distributor: "Distributeur",
  manufacturer: "Fabricant",
  cooperative: "Coopérative",
  laboratory: "Laboratoire",
  distiller: "Distillateur",
  other: "Fabricant / Autre",
};

const SUPPLIER_TYPE_COLORS: Record<string, string> = {
  trader: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  producer: "bg-green-500/15 text-green-600 dark:text-green-400",
  broker: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  distributor: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  manufacturer: "bg-red-500/15 text-red-600 dark:text-red-400",
  cooperative: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
  laboratory: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  tabac: <Cigarette className="h-4 w-4" />,
  cannabis: <Leaf className="h-4 w-4" />,
  parfum: <FlaskConical className="h-4 w-4" />,
  botanique: <Package className="h-4 w-4" />,
};

const CATEGORY_CONFIG: Record<string, { label: string; bg: string; badge: string }> = {
  tabac: { label: "Tabac", bg: "bg-amber-500/10 text-amber-600", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  cannabis: { label: "Cannabis", bg: "bg-green-500/10 text-green-600", badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  parfum: { label: "Parfumerie", bg: "bg-rose-500/10 text-rose-600", badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
  botanique: { label: "Botanique", bg: "bg-violet-500/10 text-violet-600", badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  autre: { label: "Autre", bg: "bg-muted text-muted-foreground", badge: "bg-muted text-muted-foreground" },
};

function getCategory(supplierId: string): string {
  if (supplierId?.startsWith("TABAC")) return "tabac";
  if (supplierId?.startsWith("CANNA")) return "cannabis";
  if (supplierId?.startsWith("PARF")) return "parfum";
  if (supplierId?.startsWith("BOTA")) return "botanique";
  return "autre";
}

function ratingScore(r: string | null): number {
  return { excellent: 5, good: 4, acceptable: 3, poor: 2, not_rated: 0, premium: 5, competitive: 4, standard: 3, budget: 2 }[r || ""] || 0;
}

function StarRating({ rating }: { rating: string | null }) {
  const num = ratingScore(rating);
  if (!num) return <span className="text-muted-foreground text-xs">N/A</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= num
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function SupplierCard({ supplier }: { supplier: any }) {
  const [expanded, setExpanded] = useState(false);
  const category = getCategory(supplier.supplierId);
  const catConfig = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.autre;

  const specialties = Array.isArray(supplier.specialties)
    ? supplier.specialties
    : typeof supplier.specialties === "string"
    ? safeJsonParse(supplier.specialties, [])
    : [];

  const mainProducts = Array.isArray(supplier.mainProducts)
    ? supplier.mainProducts
    : typeof supplier.mainProducts === "string"
    ? safeJsonParse(supplier.mainProducts, [])
    : [];

  const certifications = Array.isArray(supplier.certifications)
    ? supplier.certifications
    : typeof supplier.certifications === "string"
    ? safeJsonParse(supplier.certifications, [])
    : [];

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg shrink-0 ${catConfig.bg}`}>
              {CATEGORY_ICONS[category] || <Building2 className="h-4 w-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold leading-tight">
                {supplier.name}
              </CardTitle>
              {supplier.legalName && supplier.legalName !== supplier.name && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {supplier.legalName}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${catConfig.badge}`}>
              {catConfig.label}
            </span>
            {supplier.supplierType && (
              <span
                className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                  SUPPLIER_TYPE_COLORS[supplier.supplierType] ||
                  "bg-muted text-muted-foreground"
                }`}
              >
                {SUPPLIER_TYPE_LABELS[supplier.supplierType] ||
                  supplier.supplierType}
              </span>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{supplier.country || "—"}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Ratings */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
              Qualité
            </p>
            <StarRating rating={supplier.qualityRating} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
              Fiabilité
            </p>
            <StarRating rating={supplier.reliabilityRating} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
              Prix
            </p>
            <StarRating rating={supplier.priceRating} />
          </div>
        </div>

        {/* Specialties */}
        {specialties.length > 0 && (
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">
              Spécialités
            </p>
            <div className="flex flex-wrap gap-1">
              {specialties.slice(0, expanded ? undefined : 3).map((s: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {s}
                </Badge>
              ))}
              {!expanded && specialties.length > 3 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 cursor-pointer" onClick={() => setExpanded(true)}>
                  +{specialties.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Expanded info */}
        {expanded && (
          <div className="space-y-3 pt-2 border-t border-border/50">
            {mainProducts.length > 0 && (
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">
                  Produits principaux
                </p>
                <div className="flex flex-wrap gap-1">
                  {mainProducts.map((p: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">
                  Certifications
                </p>
                <div className="flex flex-wrap gap-1">
                  {certifications.map((c: string, i: number) => (
                    <div key={i} className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <Award className="h-3 w-3" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              {supplier.minimumOrder && (
                <div className="flex items-center gap-1">
                  <ShoppingCart className="h-3 w-3" />
                  <span>Min. {supplier.minimumOrder}</span>
                </div>
              )}
              {supplier.leadTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{supplier.leadTime}</span>
                </div>
              )}
              {supplier.contactPerson && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{supplier.contactPerson}</span>
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{supplier.email}</span>
                </div>
              )}
            </div>

            {supplier.notes && (
              <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2">
                {supplier.notes}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Réduire" : "Voir détails"}
            <ChevronRight
              className={`h-3 w-3 ml-1 transition-transform ${
                expanded ? "rotate-90" : ""
              }`}
            />
          </Button>
          {supplier.website && (
            <a
              href={supplier.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Globe className="h-3 w-3" />
              Site web
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SourcingHub() {
  const { data: suppliers = [], isLoading } = trpc.extendedSuppliers.getAll.useQuery();

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [sortBy, setSortBy] = useState("quality");

  const countries = useMemo(() => {
    const set = new Set(suppliers?.map((s: any) => s.country).filter(Boolean));
    return Array.from(set).sort();
  }, [suppliers]);

  const supplierTypes = useMemo(() => {
    const set = new Set(suppliers?.map((s: any) => s.supplierType).filter(Boolean));
    return Array.from(set).sort();
  }, [suppliers]);

  const filtered = useMemo(() => {
    let result = [...suppliers];

    if (filterCategory !== "all") {
      result = result.filter((s: any) => getCategory(s.supplierId) === filterCategory);
    }

    if (filterType !== "all") {
      result = result.filter((s: any) => s.supplierType === filterType);
    }

    if (filterCountry !== "all") {
      result = result.filter((s: any) => s.country === filterCountry);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s: any) =>
        s.name?.toLowerCase().includes(q) ||
        s.country?.toLowerCase().includes(q) ||
        JSON.stringify(s.specialties || []).toLowerCase().includes(q) ||
        JSON.stringify(s.mainProducts || []).toLowerCase().includes(q)
      );
    }

    result.sort((a: any, b: any) => {
      if (sortBy === "quality") return ratingScore(b.qualityRating) - ratingScore(a.qualityRating);
      if (sortBy === "reliability") return ratingScore(b.reliabilityRating) - ratingScore(a.reliabilityRating);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "country") return (a.country || "").localeCompare(b.country || "");
      return 0;
    });

    return result;
  }, [suppliers, filterCategory, filterType, filterCountry, search, sortBy]);

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Coordonnées par pays pour la carte
  const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
    "Suisse": { lat: 46.8182, lng: 8.2275 },
    "France": { lat: 46.2276, lng: 2.2137 },
    "Allemagne": { lat: 51.1657, lng: 10.4515 },
    "USA": { lat: 37.0902, lng: -95.7129 },
    "Belgique": { lat: 50.5039, lng: 4.4699 },
    "Royaume-Uni": { lat: 55.3781, lng: -3.4360 },
    "Pays-Bas": { lat: 52.1326, lng: 5.2913 },
    "Espagne": { lat: 40.4637, lng: -3.7492 },
    "Italie": { lat: 41.8719, lng: 12.5674 },
    "Inde": { lat: 20.5937, lng: 78.9629 },
    "Brésil": { lat: -14.2350, lng: -51.9253 },
    "Maroc": { lat: 31.7917, lng: -7.0926 },
    "Turquie": { lat: 38.9637, lng: 35.2433 },
    "Bulgarie": { lat: 42.7339, lng: 25.4858 },
    "Grèce": { lat: 39.0742, lng: 21.8243 },
    "Égypte": { lat: 26.8206, lng: 30.8025 },
    "Madagascar": { lat: -18.7669, lng: 46.8691 },
    "Indonésie": { lat: -0.7893, lng: 113.9213 },
    "Sri Lanka": { lat: 7.8731, lng: 80.7718 },
    "Chine": { lat: 35.8617, lng: 104.1954 },
    "Japon": { lat: 36.2048, lng: 138.2529 },
    "Canada": { lat: 56.1304, lng: -106.3468 },
    "Australie": { lat: -25.2744, lng: 133.7751 },
    "Afrique du Sud": { lat: -30.5595, lng: 22.9375 },
  };

  const handleMapReady = useCallback((map: any) => {
    mapRef.current = map;
    // Placer les épingles pour chaque fournisseur
    const suppliersByCountry: Record<string, any[]> = {};
    suppliers?.forEach((s: any) => {
      if (s.country) {
        if (!suppliersByCountry[s.country]) suppliersByCountry[s.country] = [];
        suppliersByCountry[s.country].push(s);
      }
    });

    Object.entries(suppliersByCountry).forEach(([country, countrySuppliers]) => {
      const coords = COUNTRY_COORDS[country];
      if (!coords) return;

      const catCounts = { tabac: 0, cannabis: 0, parfum: 0, botanique: 0 };
      countrySuppliers.forEach((s: any) => {
        const cat = getCategory(s.supplierId);
        if (cat in catCounts) catCounts[cat as keyof typeof catCounts]++;
      });

      const pinEl = document.createElement('div');
      pinEl.style.cssText = 'background:#1e293b;color:white;border-radius:8px;padding:6px 10px;font-size:11px;font-weight:600;white-space:nowrap;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);';
      pinEl.innerHTML = `<div style="font-size:12px;margin-bottom:2px;">${country}</div><div style="font-size:10px;opacity:0.8;">${countrySuppliers.length} fournisseur${countrySuppliers.length > 1 ? 's' : ''}</div>`;

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: coords,
        title: country,
        content: pinEl,
      });

      // InfoWindow au clic
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="font-family:sans-serif;min-width:180px;">
          <h3 style="margin:0 0 8px;font-size:14px;font-weight:700;">${country}</h3>
          ${countrySuppliers.map(s => `<div style="margin:4px 0;font-size:12px;"><strong>${s.name}</strong><br/><span style="color:#64748b;">${SUPPLIER_TYPE_LABELS[s.supplierType] || s.supplierType}</span></div>`).join('')}
        </div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });
  }, [suppliers]);

  const stats = useMemo(() => ({
    total: suppliers?.length,
    tabac: suppliers?.filter((s: any) => getCategory(s.supplierId) === "tabac").length,
    cannabis: suppliers?.filter((s: any) => getCategory(s.supplierId) === "cannabis").length,
    parfum: suppliers?.filter((s: any) => getCategory(s.supplierId) === "parfum").length,
    botanique: suppliers?.filter((s: any) => getCategory(s.supplierId) === "botanique").length,
    countries: new Set(suppliers?.map((s: any) => s.country).filter(Boolean)).size,
  }), [suppliers]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-background via-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-foreground">Hub Sourcing</span>
          </div>
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Hub Sourcing
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Répertoire centralisé des fournisseurs spécialisés en tabac, cannabis et matières premières olfactives.
                Filtrez par spécialité, type, pays et évaluation qualité.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/sourcing/tabac">
                <Button variant="outline" size="sm" className="gap-2">
                  <Cigarette className="h-4 w-4" />
                  Tabac
                </Button>
              </Link>
              <Link href="/sourcing/cannabis">
                <Button variant="outline" size="sm" className="gap-2">
                  <Leaf className="h-4 w-4" />
                  Cannabis
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
            {[
              { label: "Total", value: stats.total, icon: <Building2 className="h-3.5 w-3.5" />, color: "text-foreground" },
              { label: "Tabac", value: stats.tabac, icon: <Cigarette className="h-3.5 w-3.5" />, color: "text-amber-600" },
              { label: "Cannabis", value: stats.cannabis, icon: <Leaf className="h-3.5 w-3.5" />, color: "text-green-600" },
              { label: "Parfumerie", value: stats.parfum, icon: <FlaskConical className="h-3.5 w-3.5" />, color: "text-rose-600" },
              { label: "Botanique", value: stats.botanique, icon: <Package className="h-3.5 w-3.5" />, color: "text-violet-600" },
              { label: "Pays", value: stats.countries, icon: <Globe className="h-3.5 w-3.5" />, color: "text-blue-600" },
            ].map((stat, i) => (
              <div key={i} className="bg-muted/30 rounded-lg p-3 border border-border/30">
                <div className={`flex items-center gap-1.5 mb-1 ${stat.color}`}>
                  {stat.icon}
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border/50 bg-muted/10 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un fournisseur, pays, spécialité..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="tabac">Tabac</SelectItem>
                <SelectItem value="cannabis">Cannabis</SelectItem>
                <SelectItem value="parfum">Parfumerie</SelectItem>
                <SelectItem value="botanique">Botanique</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                {supplierTypes.map((t: string) => (
                  <SelectItem key={t} value={t}>
                    {SUPPLIER_TYPE_LABELS[t] || t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous pays</SelectItem>
                {countries.map((c: string) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quality">Note qualité</SelectItem>
                <SelectItem value="reliability">Fiabilité</SelectItem>
                <SelectItem value="name">Nom A-Z</SelectItem>
                <SelectItem value="country">Pays</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <span>{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-0 flex items-center justify-end gap-2">
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          className="gap-1.5 text-xs h-8"
          onClick={() => setViewMode("list")}
        >
          <List className="h-3.5 w-3.5" />
          Liste
        </Button>
        <Button
          variant={viewMode === "map" ? "default" : "outline"}
          size="sm"
          className="gap-1.5 text-xs h-8"
          onClick={() => setViewMode("map")}
        >
          <MapIcon className="h-3.5 w-3.5" />
          Carte
        </Button>
      </div>

      {/* Map View */}
      {viewMode === "map" && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="rounded-xl overflow-hidden border border-border/50 shadow-sm">
            <MapView
              initialCenter={{ lat: 30, lng: 10 }}
              initialZoom={2}
              onMapReady={handleMapReady}
              className="h-[500px]"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Cliquez sur une épingle pour voir les fournisseurs du pays. Basculez en vue liste pour filtrer.
          </p>
        </div>
      )}

      {/* Content */}
      <div className={`max-w-7xl mx-auto px-4 py-8 ${viewMode === "map" ? "hidden" : ""}`}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Truck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun fournisseur trouvé</h3>
            <p className="text-muted-foreground text-sm">
              Essayez de modifier vos filtres ou votre recherche.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setFilterCategory("all");
                setFilterType("all");
                setFilterCountry("all");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <>
            {/* Group by category */}
            {filterCategory === "all" ? (
              <div className="space-y-8">
                {["tabac", "cannabis", "parfum", "botanique"].map((cat) => {
                  const catSuppliers = filtered.filter((s: any) => getCategory(s.supplierId) === cat);
                  if (catSuppliers.length === 0) return null;
                  const cfg = CATEGORY_CONFIG[cat];
                  return (
                    <div key={cat}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-1.5 rounded-lg ${cfg.bg}`}>
                          {CATEGORY_ICONS[cat]}
                        </div>
                        <h2 className="text-lg font-semibold">
                          Fournisseurs {cfg.label}
                        </h2>
                        <Badge variant="secondary">{catSuppliers.length}</Badge>
                        {(cat === "tabac" || cat === "cannabis") && (
                          <Link
                            href={`/sourcing/${cat}`}
                            className="ml-auto text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            Page dédiée
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {catSuppliers.map((supplier: any) => (
                          <SupplierCard key={supplier.id} supplier={supplier} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((supplier: any) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
