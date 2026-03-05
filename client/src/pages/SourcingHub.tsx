// @ts-nocheck
import { useState, useMemo } from "react";
import { Link } from "wouter";
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
} from "lucide-react";

const SUPPLIER_TYPE_LABELS: Record<string, string> = {
  trader: "Négociant",
  producer: "Producteur",
  broker: "Courtier",
  distributor: "Distributeur",
  manufacturer: "Fabricant",
  cooperative: "Coopérative",
  laboratory: "Laboratoire",
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

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-muted-foreground text-xs">N/A</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}/5</span>
    </div>
  );
}

function SupplierCard({ supplier }: { supplier: any }) {
  const [expanded, setExpanded] = useState(false);
  const category = supplier.supplierId?.startsWith("TABAC")
    ? "tabac"
    : supplier.supplierId?.startsWith("CANNA")
    ? "cannabis"
    : "autre";

  const specialties = Array.isArray(supplier.specialties)
    ? supplier.specialties
    : typeof supplier.specialties === "string"
    ? JSON.parse(supplier.specialties || "[]")
    : [];

  const mainProducts = Array.isArray(supplier.mainProducts)
    ? supplier.mainProducts
    : typeof supplier.mainProducts === "string"
    ? JSON.parse(supplier.mainProducts || "[]")
    : [];

  const certifications = Array.isArray(supplier.certifications)
    ? supplier.certifications
    : typeof supplier.certifications === "string"
    ? JSON.parse(supplier.certifications || "[]")
    : [];

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={`p-2 rounded-lg shrink-0 ${
                category === "tabac"
                  ? "bg-amber-500/10 text-amber-600"
                  : category === "cannabis"
                  ? "bg-green-500/10 text-green-600"
                  : "bg-primary/10 text-primary"
              }`}
            >
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
            {supplier.supplierType && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
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
    const set = new Set(suppliers.map((s: any) => s.country).filter(Boolean));
    return Array.from(set).sort();
  }, [suppliers]);

  const supplierTypes = useMemo(() => {
    const set = new Set(suppliers.map((s: any) => s.supplierType).filter(Boolean));
    return Array.from(set).sort();
  }, [suppliers]);

  const filtered = useMemo(() => {
    let result = [...suppliers];

    if (filterCategory !== "all") {
      if (filterCategory === "tabac") result = result.filter((s: any) => s.supplierId?.startsWith("TABAC"));
      else if (filterCategory === "cannabis") result = result.filter((s: any) => s.supplierId?.startsWith("CANNA"));
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
      if (sortBy === "quality") return (b.qualityRating || 0) - (a.qualityRating || 0);
      if (sortBy === "reliability") return (b.reliabilityRating || 0) - (a.reliabilityRating || 0);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "country") return (a.country || "").localeCompare(b.country || "");
      return 0;
    });

    return result;
  }, [suppliers, filterCategory, filterType, filterCountry, search, sortBy]);

  const stats = useMemo(() => ({
    total: suppliers.length,
    tabac: suppliers.filter((s: any) => s.supplierId?.startsWith("TABAC")).length,
    cannabis: suppliers.filter((s: any) => s.supplierId?.startsWith("CANNA")).length,
    countries: new Set(suppliers.map((s: any) => s.country).filter(Boolean)).size,
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
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { label: "Fournisseurs", value: stats.total, icon: <Building2 className="h-4 w-4" /> },
              { label: "Spécialistes tabac", value: stats.tabac, icon: <Cigarette className="h-4 w-4" /> },
              { label: "Spécialistes cannabis", value: stats.cannabis, icon: <Leaf className="h-4 w-4" /> },
              { label: "Pays couverts", value: stats.countries, icon: <Globe className="h-4 w-4" /> },
            ].map((stat, i) => (
              <div key={i} className="bg-muted/30 rounded-lg p-4 border border-border/30">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  {stat.icon}
                  <span className="text-xs uppercase tracking-wide">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
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
                <SelectItem value="all">Toutes catégories</SelectItem>
                <SelectItem value="tabac">Tabac</SelectItem>
                <SelectItem value="cannabis">Cannabis</SelectItem>
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
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
            {filterCategory === "all" && (
              <div className="space-y-8">
                {["tabac", "cannabis"].map((cat) => {
                  const catSuppliers = filtered.filter((s: any) =>
                    cat === "tabac"
                      ? s.supplierId?.startsWith("TABAC")
                      : s.supplierId?.startsWith("CANNA")
                  );
                  if (catSuppliers.length === 0) return null;
                  return (
                    <div key={cat}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-1.5 rounded-lg ${cat === "tabac" ? "bg-amber-500/10 text-amber-600" : "bg-green-500/10 text-green-600"}`}>
                          {CATEGORY_ICONS[cat]}
                        </div>
                        <h2 className="text-lg font-semibold capitalize">
                          Fournisseurs {cat === "tabac" ? "Tabac" : "Cannabis"}
                        </h2>
                        <Badge variant="secondary">{catSuppliers.length}</Badge>
                        <Link
                          href={`/sourcing/${cat}`}
                          className="ml-auto text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          Page dédiée
                          <ChevronRight className="h-3 w-3" />
                        </Link>
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
            )}

            {filterCategory !== "all" && (
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
