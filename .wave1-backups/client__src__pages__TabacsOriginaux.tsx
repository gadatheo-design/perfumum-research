// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Sparkles, MapPin, Thermometer, ChevronDown, ChevronUp, Globe2, FlaskConical } from "lucide-react";
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

function parseProfile(raw: string | null) {
  if (!raw) return null;
  try {
    const p = safeJsonParse(raw, null);
    if (p && typeof p === "object" && p.famille) return p;
    return null;
  } catch {
    return null;
  }
}

function IntensityDots({ value }: { value: number | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">Intensité</span>
      <div className="flex gap-0.5">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={"h-2 w-2 rounded-full " + (i < value ? "bg-purple-500" : "bg-muted")}
          />
        ))}
      </div>
      <span className="text-xs font-medium">{value}/10</span>
    </div>
  );
}

// Détermine si un tabac est "original/exotique" : oriental ou experimental
function isOriginal(tabac: TabacWithTerroir) {
  return tabac.type === "oriental" || tabac.type === "experimental";
}

function TabacOriginalCard({ tabac }: { tabac: TabacWithTerroir }) {
  const [expanded, setExpanded] = useState(false);
  const profile = parseProfile(tabac.aromaticProfile);

  const typeColor = tabac.type === "oriental"
    ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
    : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";

  const typeLabel = tabac.type === "oriental" ? "Oriental" : "Expérimental";
  const TypeIcon = tabac.type === "oriental" ? Globe2 : FlaskConical;

  return (
    <Card className="group hover:border-purple-500/40 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base flex items-center gap-2">
              <TypeIcon className={"h-4 w-4 shrink-0 " + (tabac.type === "oriental" ? "text-purple-400" : "text-cyan-400")} />
              <span className="truncate">{tabac.name}</span>
            </CardTitle>
            {tabac.origin && (
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {tabac.origin}
              </CardDescription>
            )}
          </div>
          <Badge variant="outline" className={typeColor}>
            {typeLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <IntensityDots value={tabac.intensity} />

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
          <div className="space-y-2 border-t border-border/50 pt-2">
            {profile.famille && (
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span className="text-sm font-medium">{profile.famille}</span>
              </div>
            )}
            {profile.notes_dominantes && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes dominantes</span>
                <p className="text-sm mt-0.5">{profile.notes_dominantes}</p>
              </div>
            )}
            {profile.notes_secondaires && (
              <p className="text-sm text-muted-foreground">{profile.notes_secondaires}</p>
            )}
            {profile.caractere && (
              <p className="text-xs italic text-muted-foreground border-l-2 border-purple-500/30 pl-2">
                {profile.caractere}
              </p>
            )}
            {profile.descripteurs && Array.isArray(profile.descripteurs) && (
              <div className="flex flex-wrap gap-1">
                {profile.descripteurs.map((d: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs bg-purple-500/10 text-purple-300">{d}</Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {tabac.idealTemperature && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Thermometer className="h-3.5 w-3.5 shrink-0" />
            <span>{tabac.idealTemperature}</span>
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

export default function TabacsOriginaux() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");

  const { data: allTabacs, isLoading, error } = trpc.tabacs.listWithTerroir.useQuery();

  // Filtrer uniquement les tabacs "originaux" (oriental + experimental)
  const tabacs = useMemo(() => {
    if (!allTabacs) return [];
    return (allTabacs as TabacWithTerroir[]).filter(isOriginal);
  }, [allTabacs]);

  const countries = useMemo(() => {
    const unique = [...new Set(tabacs.map(t => t.terroirCountry).filter(Boolean) as string[])];
    return unique.sort();
  }, [tabacs]);

  const filtered = useMemo(() => {
    return tabacs.filter(t => {
      const matchSearch = !searchTerm ||
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.origin && t.origin.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.terroirName && t.terroirName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchType = typeFilter === "all" || t.type === typeFilter;
      const matchCountry = countryFilter === "all" || t.terroirCountry === countryFilter;
      return matchSearch && matchType && matchCountry;
    });
  }, [tabacs, searchTerm, typeFilter, countryFilter]);

  const stats = useMemo(() => ({
    total: tabacs.length,
    oriental: tabacs.filter(t => t.type === "oriental").length,
    experimental: tabacs.filter(t => t.type === "experimental").length,
    countries: [...new Set(tabacs.map(t => t.terroirCountry).filter(Boolean))].length,
  }), [tabacs]);

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
            <Sparkles className="h-8 w-8 text-purple-400" />
            Tabacs Originaux
          </h1>
          <p className="text-muted-foreground mt-2">
            Variétés orientales rares et tabacs expérimentaux — profils aromatiques complexes et terroirs d'exception
          </p>
        </div>

        {/* Statistiques */}
        {!isLoading && tabacs.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Card className="text-center p-3">
              <div className="text-2xl font-bold text-purple-400">{stats.oriental}</div>
              <div className="text-xs text-muted-foreground mt-1">Orientaux</div>
            </Card>
            <Card className="text-center p-3">
              <div className="text-2xl font-bold text-cyan-400">{stats.experimental}</div>
              <div className="text-xs text-muted-foreground mt-1">Expérimentaux</div>
            </Card>
            <Card className="text-center p-3 col-span-2 sm:col-span-1">
              <div className="text-2xl font-bold text-green-400">{stats.countries}</div>
              <div className="text-xs text-muted-foreground mt-1">Pays d'origine</div>
            </Card>
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
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="oriental">Oriental</SelectItem>
              <SelectItem value="experimental">Expérimental</SelectItem>
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les pays</SelectItem>
              {countries.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Résultats */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                <CardContent><Skeleton className="h-24 w-full" /></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {filtered.length} tabac{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
              {` sur ${tabacs.length} variétés originales`}
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map(t => <TabacOriginalCard key={t.id} tabac={t} />)}
            </div>
            {filtered.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
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
