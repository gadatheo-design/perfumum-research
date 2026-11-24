import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ExternalLink,
  Phone,
  Mail,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Leaf,
  Cigarette,
  FlaskConical,
  Package,
} from "lucide-react";

const CATEGORY_CONFIG: Record<string, { label: string; bg: string; badge: string; icon: React.ReactNode }> = {
  tabac: {
    label: "Tabac",
    bg: "bg-amber-500/10 text-amber-600",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: <Cigarette className="h-3.5 w-3.5" />,
  },
  cannabis: {
    label: "Cannabis",
    bg: "bg-green-500/10 text-green-600",
    badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: <Leaf className="h-3.5 w-3.5" />,
  },
  parfum: {
    label: "Parfumerie",
    bg: "bg-rose-500/10 text-rose-600",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    icon: <FlaskConical className="h-3.5 w-3.5" />,
  },
  botanique: {
    label: "Botanique",
    bg: "bg-violet-500/10 text-violet-600",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    icon: <Package className="h-3.5 w-3.5" />,
  },
  autre: {
    label: "Autre",
    bg: "bg-muted text-muted-foreground",
    badge: "bg-muted text-muted-foreground",
    icon: <Building2 className="h-3.5 w-3.5" />,
  },
};

const TYPE_LABELS: Record<string, string> = {
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

const RATING_SCORE: Record<string, number> = {
  excellent: 5, good: 4, acceptable: 3, poor: 2, not_rated: 0,
  premium: 5, competitive: 4, standard: 3, budget: 2,
};

function getCategory(supplierId: string): string {
  if (supplierId?.startsWith("TABAC")) return "tabac";
  if (supplierId?.startsWith("CANNA")) return "cannabis";
  if (supplierId?.startsWith("PARF")) return "parfum";
  if (supplierId?.startsWith("BOTA")) return "botanique";
  return "autre";
}

function StarRating({ rating }: { rating: string | null }) {
  const num = RATING_SCORE[rating || ""] || 0;
  if (!num) return <span className="text-muted-foreground text-xs">N/A</span>;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-xs ${s <= num ? "text-amber-400" : "text-muted"}`}>★</span>
      ))}
    </div>
  );
}

function SupplierMiniCard({ supplier }: { supplier: any }) {
  const [open, setOpen] = useState(false);
  const cat = getCategory(supplier.supplierId);
  const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.autre;

  const specialties = Array.isArray(supplier.specialties)
    ? supplier.specialties
    : typeof supplier.specialties === "string"
    ? (() => { try { return JSON.parse(supplier.specialties); } catch { return [supplier.specialties]; } })()
    : [];

  const certifications = Array.isArray(supplier.certifications)
    ? supplier.certifications
    : typeof supplier.certifications === "string"
    ? (() => { try { return JSON.parse(supplier.certifications); } catch { return []; } })()
    : [];

  return (
    <div className="border border-border/50 rounded-lg p-3 hover:border-primary/30 transition-colors bg-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${cfg.bg}`}>
            {cfg.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{supplier.name}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${cfg.badge}`}>
                {cfg.label}
              </span>
            </div>
            {supplier.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{supplier.description}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 shrink-0"
          onClick={() => setOpen(!open)}
        >
          {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {open && (
        <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
          {/* Type + Rating */}
          <div className="flex items-center justify-between gap-2">
            {supplier.supplierType && (
              <span className="text-xs text-muted-foreground">
                {TYPE_LABELS[supplier.supplierType] || supplier.supplierType}
              </span>
            )}
            <StarRating rating={supplier.qualityRating} />
          </div>

          {/* Spécialités */}
          {specialties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {specialties.slice(0, 6).map((s: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {s}
                </Badge>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              <Award className="h-3 w-3 text-muted-foreground shrink-0" />
              {certifications.map((c: string, i: number) => (
                <span key={i} className="text-[10px] text-muted-foreground">{c}{i < certifications.length - 1 ? " ·" : ""}</span>
              ))}
            </div>
          )}

          {/* Contact */}
          <div className="flex flex-wrap gap-2 pt-1">
            {supplier.email && (
              <a
                href={`mailto:${supplier.email}`}
                className="flex items-center gap-1 text-[10px] text-primary hover:underline"
              >
                <Mail className="h-3 w-3" />
                {supplier.email}
              </a>
            )}
            {supplier.phone && (
              <a
                href={`tel:${supplier.phone}`}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
              >
                <Phone className="h-3 w-3" />
                {supplier.phone}
              </a>
            )}
            {supplier.website && (
              <a
                href={supplier.website.startsWith("http") ? supplier.website : `https://${supplier.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Site web
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface VerifiedSuppliersPanelProps {
  country: string;
  className?: string;
}

export function VerifiedSuppliersPanel({ country, className = "" }: VerifiedSuppliersPanelProps) {
  const { data: suppliers = [], isLoading } = trpc.extendedSuppliers.getByCountry.useQuery(
    { country },
    { staleTime: 5 * 60 * 1000 }
  );

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {[1, 2].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!suppliers.length) return null;

  return (
    <Card className={`border-primary/20 bg-primary/5 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Fournisseurs vérifiés — {country}
          <Badge variant="secondary" className="ml-auto text-xs">{suppliers.length}</Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Données issues de la base PERFUMUM. Cliquez sur ▼ pour les détails.
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {suppliers.map((s: any) => (
          <SupplierMiniCard key={s.id} supplier={s} />
        ))}
      </CardContent>
    </Card>
  );
}
