import { safeJsonParse } from "@/lib/utils";
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Leaf, MapPin, Thermometer, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TabacWithTerroir {
  id: number;
  name: string;
  type: string;
  origin: string | null;
  intensity: number | null;
  idealTemperature: string | null;
  internalNotes: string | null;
  aromaticProfile: string | null;
  terroirName: string | null;
  terroirCountry: string | null;
  terroirClimate: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  blond: "Blond / Virginia",
  brun: "Brun / Burley",
  oriental: "Oriental",
  experimental: "Expérimental",
};

const TYPE_COLORS: Record<string, string> = {
  blond: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  brun: "bg-orange-700/20 text-orange-400 border-orange-700/30",
  oriental: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  experimental: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

interface AromaticProfile {
  famille?: string;
  notes_dominantes?: string;
  notes_secondaires?: string;
  caractere?: string;
  descripteurs?: string[];
  [key: string]: unknown;
}

function parseProfile(raw: string | null): AromaticProfile | null {
  if (!raw) return null;
  try {
    const p = safeJsonParse(raw, null) as AromaticProfile | null;
    if (p && typeof p === "object" && p.famille) return p;
    return null;
  } catch {
    return null;
  }
}

function IntensityBar({ value }: { value: number | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-16">Intensité</span>
      <div className="flex gap-0.5">
        {[...Array(10)].map((_, i) => (
          <div
            key={`intensity-${i}`}
            className={"h-2 w-2 rounded-sm " + (i < value ? "bg-amber-500" : "bg-muted")}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{value}/10</span>
    </div>
  );
}

function TabacCard({ tabac }: { tabac: TabacWithTerroir }) {
  const [expanded, setExpanded] = useState(false);
  const profile = parseProfile(tabac.aromaticProfile);

  return (
    <Card className="group hover:border-amber-500/40 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-500 shrink-0" />
              <span className="truncate">{tabac.name}</span>
            </CardTitle>
            {tabac.origin && (
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {tabac.origin}
              </CardDescription>
            )}
          </div>
          <Badge variant="outline" className={TYPE_COLORS[tabac.type] || ""}>
            {TYPE_LABELS[tabac.type] || tabac.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <IntensityBar value={tabac.intensity} />

        {tabac.terroirName && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">
              {tabac.terroirName}
              {tabac.terroirCountry ? ` — ${tabac.terroirCountry}` : ""}
            </span>
          </div>
        )}

        {profile && (
          <div className="space-y-2">
            {profile.notes_dominantes && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes dominantes</span>
                <p className="text-sm mt-0.5">{profile.notes_dominantes}</p>
              </div>
            )}
            {profile.notes_secondaires && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes secondaires</span>
                <p className="text-sm mt-0.5 text-muted-foreground">{profile.notes_secondaires}</p>
              </div>
            )}
            {profile.descripteurs && Array.isArray(profile.descripteurs) && profile.descripteurs.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.descripteurs.map((d: string, i: number) => (
                  <Badge key={`${tabac.id}-desc-${i}`} variant="secondary" className="text-xs">{d}</Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {tabac.idealTemperature && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Thermometer className="h-3.5 w-3.5 shrink-0" />
            <span>Température idéale : {tabac.idealTemperature}</span>
          </div>
        )}

        {tabac.internalNotes && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-7 text-xs text-muted-foreground"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <><ChevronUp className="h-3 w-3 mr-1" />Réduire</>
              ) : (
                <><ChevronDown className="h-3 w-3 mr-1" />Notes de recherche</>
              )}
            </Button>
            {expanded && (
              <div className="text-sm text-muted-foreground bg-muted/30 rounded-md p-3 border border-border/50">
                {tabac.internalNotes}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function TabacsNaturels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");

  const { data: tabacs, isLoading, error } = trpc.tabacs.listWithTerroir.useQuery();

  const countries = useMemo(() => {
    if (!tabacs) return [];
    const unique = Array.from(new Set((tabacs as TabacWithTerroir[])
      .map(t => t.terroirCountry)
      .filter(Boolean) as string[]));
    return unique.sort();
  }, [tabacs]);

  const filtered = useMemo(() => {
    if (!tabacs) return [];
    return (tabacs as TabacWithTerroir[]).filter(t => {
      const matchSearch = !searchTerm ||
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.origin && t.origin.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.terroirName && t.terroirName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchType = typeFilter === "all" || t.type === typeFilter;
      const matchCountry = countryFilter === "all" || t.terroirCountry === countryFilter;
      return matchSearch && matchType && matchCountry;
    });
  }, [tabacs, searchTerm, typeFilter, countryFilter]);

  const stats = useMemo(() => {
    if (!tabacs) return {};
    const t = tabacs as TabacWithTerroir[];
    return {
      total: t.length,
      blond: t.filter(x => x.type === "blond").length,
      brun: t.filter(x => x.type === "brun").length,
      oriental: t.filter(x => x.type === "oriental").length,
      experimental: t.filter(x => x.type === "experimental").length,
    };
  }, [tabacs]);

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="border-destructive">
            <CardContent className="p-6">
              <p className="text-destructive">Erreur : {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Leaf className="h-8 w-8 text-green-500" />
            Tabacs Naturels
          </h1>
          <p className="text-muted-foreground mt-2">
            Atlas des tabacs naturels non transformés — Virginia, Burley, Oriental et variétés expérimentales
          </p>
        </div>

        {/* Statistiques */}
        {!isLoading && tabacs && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Virginia / Blond", count: stats.blond, color: "text-amber-400", id: "blond" },
              { label: "Brun / Burley", count: stats.brun, color: "text-orange-400", id: "brun" },
              { label: "Oriental", count: stats.oriental, color: "text-purple-400", id: "oriental" },
              { label: "Expérimental", count: stats.experimental, color: "text-cyan-400", id: "exp" },
            ].map(s => (
              <Card key={s.id} className="text-center p-3">
                <div className={"text-2xl font-bold " + s.color}>{s.count}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </Card>
            ))}
          </div>
        )}

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, origine, terroir..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Type de tabac" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="blond">Blond / Virginia</SelectItem>
              <SelectItem value="brun">Brun / Burley</SelectItem>
              <SelectItem value="oriental">Oriental</SelectItem>
              <SelectItem value="experimental">Expérimental</SelectItem>
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Pays d'origine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les pays</SelectItem>
              {countries.map((c, idx) => (
                <SelectItem key={`country-${idx}-${c}`} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Résultats */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={`skeleton-${i}`}>
                <CardHeader><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                <CardContent><Skeleton className="h-24 w-full" /></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {filtered.length} tabac{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
              {tabacs && ` sur ${(tabacs as TabacWithTerroir[]).length}`}
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map(t => <TabacCard key={t.id} tabac={t} />)}
            </div>
            {filtered.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Leaf className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                  <p className="text-muted-foreground">Aucun tabac ne correspond à vos critères</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
