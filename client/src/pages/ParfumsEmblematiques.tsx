import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, FlaskConical, Building2, User, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// ─── Couleurs par rôle ────────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, string> = {
  signature: "bg-amber-100 text-amber-800 border-amber-300",
  accord_principal: "bg-blue-100 text-blue-800 border-blue-300",
  note_coeur: "bg-rose-100 text-rose-800 border-rose-300",
  note_fond: "bg-purple-100 text-purple-800 border-purple-300",
  note_tete: "bg-green-100 text-green-800 border-green-300",
  ingredient_cle: "bg-slate-100 text-slate-700 border-slate-300",
};

const ROLE_LABELS: Record<string, string> = {
  signature: "Molécule signature",
  accord_principal: "Accord principal",
  note_coeur: "Note de cœur",
  note_fond: "Note de fond",
  note_tete: "Note de tête",
  ingredient_cle: "Ingrédient clé",
};

// ─── Couleurs par maison ──────────────────────────────────────────────────────
const HOUSE_COLORS: Record<string, string> = {
  "Chanel": "border-l-black",
  "Dior": "border-l-gray-600",
  "Guerlain": "border-l-amber-600",
  "Hermès": "border-l-orange-500",
  "Yves Saint Laurent": "border-l-red-600",
  "Serge Lutens": "border-l-purple-700",
  "Le Labo": "border-l-stone-500",
  "Escentric Molecules": "border-l-cyan-600",
  "Issey Miyake": "border-l-sky-500",
  "Giorgio Armani": "border-l-slate-600",
  "Davidoff": "border-l-blue-600",
  "Narciso Rodriguez": "border-l-pink-500",
  "Mugler": "border-l-violet-600",
  "Calvin Klein": "border-l-zinc-500",
  "Ralph Lauren": "border-l-green-700",
};

function getBorderColor(house: string): string {
  return HOUSE_COLORS[house] || "border-l-indigo-400";
}

// ─── Composant carte parfum ───────────────────────────────────────────────────
function PerfumeCard({ perfume }: { perfume: PerfumeGroup }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={`border-l-4 ${getBorderColor(perfume.perfumeHouse)} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold leading-tight">{perfume.perfumeName}</CardTitle>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span>{perfume.perfumeHouse}</span>
              {perfume.perfumer && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <User className="h-3.5 w-3.5 shrink-0" />
                  <span>{perfume.perfumer}</span>
                </>
              )}
              {perfume.year && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>{perfume.year}</span>
                </>
              )}
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {perfume.molecules.length} molécule{perfume.molecules.length > 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Molécules signature en avant */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {perfume.molecules
            .sort((a, b) => {
              const order = ["signature", "accord_principal", "note_coeur", "note_fond", "note_tete", "ingredient_cle"];
              return order.indexOf(a.role) - order.indexOf(b.role);
            })
            .slice(0, expanded ? undefined : 4)
            .map((mol) => (
              <Link key={mol.moleculeId} href={`/molecule/${mol.moleculeId}`}>
                <Badge
                  variant="outline"
                  className={`cursor-pointer hover:opacity-80 transition-opacity text-xs ${ROLE_COLORS[mol.role] || "bg-gray-100 text-gray-700"}`}
                >
                  <FlaskConical className="h-3 w-3 mr-1" />
                  {mol.moleculeName}
                  <span className="ml-1 opacity-60">— {ROLE_LABELS[mol.role] || mol.role}</span>
                </Badge>
              </Link>
            ))}
          {!expanded && perfume.molecules.length > 4 && (
            <button
              onClick={() => setExpanded(true)}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              +{perfume.molecules.length - 4} de plus
            </button>
          )}
        </div>

        {/* Description de la première molécule signature */}
        {perfume.molecules[0]?.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {perfume.molecules[0].description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface PerfumeMolecule {
  moleculeId: number;
  moleculeName: string;
  role: string;
  concentration: string | null;
  description: string | null;
}

interface PerfumeGroup {
  perfumeName: string;
  perfumeHouse: string;
  perfumer: string | null;
  year: number | null;
  molecules: PerfumeMolecule[];
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function ParfumsEmblematiques() {
  const [search, setSearch] = useState("");
  const [filterHouse, setFilterHouse] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");

  // Récupérer toutes les liaisons molecule_perfumes
  const { data, isLoading } = trpc.molecules.getAllPerfumeLinks.useQuery();

  // Grouper par parfum
  const perfumeGroups = useMemo<PerfumeGroup[]>(() => {
    if (!data) return [];
    const map = new Map<string, PerfumeGroup>();
    for (const link of data) {
      const key = `${link.perfumeName}||${link.perfumeHouse}`;
      if (!map.has(key)) {
        map.set(key, {
          perfumeName: link.perfumeName,
          perfumeHouse: link.perfumeHouse,
          perfumer: link.perfumer,
          year: link.year,
          molecules: [],
        });
      }
      map.get(key)!.molecules.push({
        moleculeId: link.moleculeId,
        moleculeName: link.moleculeName,
        role: link.roleInPerfume,
        concentration: link.concentration,
        description: link.description,
      });
    }
    return Array.from(map.values()).sort((a, b) => b.molecules.length - a.molecules.length || a.perfumeName.localeCompare(b.perfumeName));
  }, [data]);

  // Maisons distinctes
  const houses = useMemo(() => {
    const set = new Set(perfumeGroups.map((p) => p.perfumeHouse));
    return Array.from(set).sort();
  }, [perfumeGroups]);

  // Filtrage
  const filtered = useMemo(() => {
    return perfumeGroups.filter((p) => {
      const matchSearch =
        !search ||
        p.perfumeName.toLowerCase().includes(search.toLowerCase()) ||
        p.perfumeHouse.toLowerCase().includes(search.toLowerCase()) ||
        (p.perfumer || "").toLowerCase().includes(search.toLowerCase()) ||
        p.molecules.some((m) => m.moleculeName.toLowerCase().includes(search.toLowerCase()));
      const matchHouse = filterHouse === "all" || p.perfumeHouse === filterHouse;
      const matchRole = filterRole === "all" || p.molecules.some((m) => m.role === filterRole);
      return matchSearch && matchHouse && matchRole;
    });
  }, [perfumeGroups, search, filterHouse, filterRole]);

  // Statistiques
  const stats = useMemo(() => {
    const totalMolecules = new Set(data?.map((d) => d.moleculeId) || []).size;
    return { totalPerfumes: perfumeGroups.length, totalMolecules };
  }, [perfumeGroups, data]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 max-w-6xl">
        <Breadcrumbs />

        {/* En-tête */}
        <div className="mb-8 mt-4">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-7 w-7 text-amber-500" />
            <h1 className="text-3xl font-bold tracking-tight">Parfums emblématiques</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Navigation inverse : explorez les grands parfums de référence et découvrez les molécules qui les composent.
            Chaque parfum est lié aux molécules documentées dans la base PERFUMUM.
          </p>
          <div className="flex gap-6 mt-4 text-sm text-muted-foreground">
            <span><strong className="text-foreground">{stats.totalPerfumes}</strong> parfums référencés</span>
            <span><strong className="text-foreground">{stats.totalMolecules}</strong> molécules documentées</span>
            <Link href="/molecules" className="flex items-center gap-1 text-primary hover:underline">
              Voir toutes les molécules <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un parfum, une maison, un parfumeur ou une molécule…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={filterHouse}
            onChange={(e) => setFilterHouse(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Toutes les maisons</option>
            {houses.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Tous les rôles</option>
            {Object.entries(ROLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {/* Légende des rôles */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(ROLE_LABELS).map(([k, v]) => (
            <Badge
              key={k}
              variant="outline"
              className={`text-xs cursor-pointer ${filterRole === k ? "ring-2 ring-ring" : ""} ${ROLE_COLORS[k]}`}
              onClick={() => setFilterRole(filterRole === k ? "all" : k)}
            >
              {v}
            </Badge>
          ))}
        </div>

        {/* Résultats */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Aucun parfum trouvé</p>
            <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
            {(search || filterHouse !== "all" || filterRole !== "all") && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => { setSearch(""); setFilterHouse("all"); setFilterRole("all"); }}
              >
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {filtered.length} parfum{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
              {(search || filterHouse !== "all" || filterRole !== "all") && ` (filtrés sur ${stats.totalPerfumes})`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <PerfumeCard key={`${p.perfumeName}||${p.perfumeHouse}`} perfume={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
