import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  Globe,
  MapPin,
  Leaf,
  FlaskConical,
  Building2,
  ExternalLink,
  Star,
  Package,
  Users,
  Filter,
  Search,
  ChevronRight,
  Award,
  Clock,
  CreditCard,
  Truck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type QualityRating = "excellent" | "good" | "acceptable" | "poor" | "not_rated";
type PriceRating = "premium" | "competitive" | "standard" | "budget" | "not_rated";
type SupplierStatus = "active" | "inactive" | "blacklisted" | "prospect";

function QualityBadge({ rating }: { rating: QualityRating | null }) {
  const map: Record<string, { label: string; color: string }> = {
    excellent: { label: "Excellent", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    good: { label: "Bon", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    acceptable: { label: "Acceptable", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
    poor: { label: "Faible", color: "bg-red-500/20 text-red-300 border-red-500/30" },
    not_rated: { label: "Non évalué", color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" },
  };
  const r = rating || "not_rated";
  const { label, color } = map[r] || map.not_rated;
  return <span className={`text-xs px-2 py-0.5 rounded-full border ${color}`}>{label}</span>;
}

function PriceBadge({ rating }: { rating: PriceRating | null }) {
  const map: Record<string, { label: string; icon: string }> = {
    premium: { label: "Premium", icon: "💎" },
    competitive: { label: "Compétitif", icon: "⚡" },
    standard: { label: "Standard", icon: "📊" },
    budget: { label: "Économique", icon: "💰" },
    not_rated: { label: "N/A", icon: "—" },
  };
  const r = rating || "not_rated";
  const { label, icon } = map[r] || map.not_rated;
  return <span className="text-xs text-zinc-400">{icon} {label}</span>;
}

function StatusBadge({ status }: { status: SupplierStatus | null }) {
  const map: Record<string, { label: string; color: string }> = {
    active: { label: "Actif", color: "bg-emerald-500/20 text-emerald-300" },
    inactive: { label: "Inactif", color: "bg-zinc-500/20 text-zinc-400" },
    blacklisted: { label: "Blacklisté", color: "bg-red-500/20 text-red-300" },
    prospect: { label: "Prospect", color: "bg-amber-500/20 text-amber-300" },
  };
  const s = status || "inactive";
  const { label, color } = map[s] || map.inactive;
  return <span className={`text-xs px-2 py-0.5 rounded-full ${color}`}>{label}</span>;
}

export default function SourcingTabac() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const { data: suppliers, isLoading } = trpc.extendedSuppliers.getTabacSuppliers.useQuery();

  const tabacTypes = [
    { id: "all", label: "Tous" },
    { id: "producer", label: "Producteurs" },
    { id: "trader", label: "Négociants" },
    { id: "cooperative", label: "Coopératives" },
    { id: "laboratory", label: "Laboratoires" },
  ];

  const filtered = (suppliers || []).filter(s => {
    const matchSearch = !search || 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.country || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.notes || "").toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || s.supplierType === filterType;
    return matchSearch && matchType;
  });

  const getSpecialties = (s: any): string[] => {
    try { return JSON.parse(s.specialties || "[]"); } catch { return []; }
  };
  const getMainProducts = (s: any): string[] => {
    try { return JSON.parse(s.mainProducts || "[]"); } catch { return []; }
  };
  const getCertifications = (s: any): string[] => {
    try { return JSON.parse(s.certifications || "[]"); } catch { return []; }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs customItems={[
          { label: "Accueil", path: "/" },
          { label: "Sourcing", path: "/sourcing" },
          { label: "Tabac" },
        ]} />

        {/* Header */}
        <div className="mb-10 mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-100">Sourcing Tabac</h1>
              <p className="text-zinc-400 text-sm">Fournisseurs et producteurs de tabacs de qualité</p>
            </div>
          </div>
          <p className="text-zinc-400 max-w-3xl leading-relaxed">
            Répertoire des fournisseurs de tabacs bruts, séchés et fermentés pour la recherche olfactive.
            Virginia, Burley, Oriental, Latakia, Perique — chaque variété est documentée avec ses profils moléculaires
            et ses terroirs d'origine.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Fournisseurs", value: suppliers?.length || 0, icon: Building2, color: "text-amber-400" },
            { label: "Actifs", value: (suppliers || []).filter(s => s.status === "active").length, icon: CheckCircle2, color: "text-emerald-400" },
            { label: "Pays couverts", value: new Set((suppliers || []).map(s => s.country)).size, icon: Globe, color: "text-blue-400" },
            { label: "Prospects", value: (suppliers || []).filter(s => s.status === "prospect").length, icon: AlertCircle, color: "text-amber-400" },
          ].map(stat => (
            <Card key={stat.label} className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
                  <div className="text-xs text-zinc-500">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un fournisseur, pays, spécialité..."
              className="pl-9 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {tabacTypes.map(t => (
              <Button
                key={t.id}
                variant={filterType === t.id ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(t.id)}
                className={filterType === t.id ? "bg-amber-600 hover:bg-amber-700 text-white" : "border-zinc-700 text-zinc-400 hover:text-zinc-100"}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Liste des fournisseurs */}
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 bg-zinc-800" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucun fournisseur trouvé</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(supplier => {
              const specialties = getSpecialties(supplier);
              const products = getMainProducts(supplier);
              const certs = getCertifications(supplier);
              return (
                <Card key={supplier.id} className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-600 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Info principale */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-zinc-100">{supplier.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-zinc-400 mt-0.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{supplier.address || supplier.country}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <StatusBadge status={supplier.status as SupplierStatus} />
                          </div>
                        </div>

                        <p className="text-sm text-zinc-400 leading-relaxed mb-3">{supplier.notes}</p>

                        {/* Spécialités */}
                        {specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {specialties.map(sp => (
                              <Badge key={sp} variant="outline" className="text-xs border-amber-500/30 text-amber-300 bg-amber-500/10">
                                {sp}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Produits */}
                        {products.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <span className="text-xs text-zinc-500 mr-1">Produits :</span>
                            {products.map(p => (
                              <span key={p} className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                                {p}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Certifications */}
                        {certs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {certs.map(c => (
                              <Badge key={c} variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                                <Award className="w-3 h-3 mr-1" />{c}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Métriques */}
                      <div className="md:w-56 space-y-2 bg-zinc-800/50 rounded-lg p-4 flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">Qualité</span>
                          <QualityBadge rating={supplier.qualityRating as QualityRating} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">Fiabilité</span>
                          <QualityBadge rating={supplier.reliabilityRating as QualityRating} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">Prix</span>
                          <PriceBadge rating={supplier.priceRating as PriceRating} />
                        </div>
                        <div className="border-t border-zinc-700 pt-2 mt-2 space-y-1">
                          {supplier.minimumOrder && (
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                              <Package className="w-3 h-3" />
                              <span>Min : {supplier.minimumOrder}</span>
                            </div>
                          )}
                          {supplier.leadTime && (
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                              <Clock className="w-3 h-3" />
                              <span>{supplier.leadTime}</span>
                            </div>
                          )}
                          {supplier.paymentTerms && (
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                              <CreditCard className="w-3 h-3" />
                              <span>{supplier.paymentTerms}</span>
                            </div>
                          )}
                        </div>
                        {supplier.website && (
                          <a
                            href={supplier.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 mt-2"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Site web
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Liens croisés */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/sourcing/cannabis">
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-emerald-500/30 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-200">Sourcing Cannabis</div>
                  <div className="text-xs text-zinc-500">Fournisseurs landraces</div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 ml-auto" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/tabacs-resines">
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-amber-500/30 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-amber-500/20 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-200">Tabacs & Résines</div>
                  <div className="text-xs text-zinc-500">Profils moléculaires</div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 ml-auto" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/sourcing">
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-blue-500/30 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-200">Sourcing Global</div>
                  <div className="text-xs text-zinc-500">Tous les fournisseurs</div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 ml-auto" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
