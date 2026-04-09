/**
 * GbifEnrichment.tsx
 * Page admin pour l'enrichissement GBIF (Global Biodiversity Information Facility)
 * Permet de rechercher des espèces, voir leur distribution géographique et importer les données
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import {
  Globe,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MapPin,
  Languages,
  Download,
  Info,
  Leaf,
  Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface GbifSpeciesResult {
  found: boolean;
  scientificName: string;
  species: {
    usageKey: number;
    scientificName: string;
    rank: string;
    status: string;
    confidence: number;
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    genus?: string;
    canonicalName?: string;
    authorship?: string;
  } | null;
  distributions: Array<{
    country?: string;
    locality?: string;
    status?: string;
    establishmentMeans?: string;
  }>;
  vernacularNames: Record<string, string[]>;
  countries: string[];
  gbifUrl?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COUNTRY CODE → NAME MAP (subset)
// ─────────────────────────────────────────────────────────────────────────────

const COUNTRY_NAMES: Record<string, string> = {
  FR: "France", DE: "Allemagne", ES: "Espagne", IT: "Italie", GB: "Royaume-Uni",
  MA: "Maroc", DZ: "Algérie", TN: "Tunisie", EG: "Égypte", TR: "Turquie",
  IR: "Iran", IN: "Inde", CN: "Chine", JP: "Japon", US: "États-Unis",
  BR: "Brésil", MX: "Mexique", ZA: "Afrique du Sud", AU: "Australie",
  RU: "Russie", PK: "Pakistan", BD: "Bangladesh", TH: "Thaïlande",
  ID: "Indonésie", MY: "Malaisie", ET: "Éthiopie", KE: "Kenya",
  MG: "Madagascar", MU: "Maurice", RE: "La Réunion", CM: "Cameroun",
  SN: "Sénégal", CI: "Côte d'Ivoire", GH: "Ghana", NG: "Nigéria",
  LY: "Libye", EH: "Sahara occidental", NO: "Norvège", FI: "Finlande",
  SE: "Suède", PL: "Pologne", PT: "Portugal", GR: "Grèce",
};

function countryName(code: string): string {
  return COUNTRY_NAMES[code] || code;
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPORT RESULT DISPLAY
// ─────────────────────────────────────────────────────────────────────────────

function ImportResult({ result }: { result: any }) {
  if (!result) return null;
  if (result.success) {
    return (
      <Alert className="border-green-500/30 bg-green-500/10 mt-3">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-700 dark:text-green-300">
          <strong>{result.message}</strong>
          {result.fieldsUpdated && result.fieldsUpdated.length > 0 && (
            <div className="mt-1 text-xs opacity-80">
              Champs mis à jour : {result.fieldsUpdated.join(", ")}
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert className="border-red-500/30 bg-red-500/10 mt-3">
      <XCircle className="h-4 w-4 text-red-500" />
      <AlertDescription className="text-red-700 dark:text-red-300">
        {result.message}
        {result.matches && result.matches.length > 0 && (
          <ul className="mt-1 text-xs list-disc list-inside">
            {result.matches.map((m: any) => (
              <li key={m.id}>{m.name} — {m.latinName}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function GbifEnrichment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [speciesResult, setSpeciesResult] = useState<GbifSpeciesResult | null>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [importingFor, setImportingFor] = useState<string | null>(null);

  // API status
  const { data: stats } = trpc.gbifEnrichment.getStats.useQuery(undefined, {
    staleTime: 60_000,
  });

  // Species details mutation
  const getDetails = trpc.gbifEnrichment.getSpeciesDetails.useMutation({
    onSuccess: (data) => {
      setSpeciesResult(data as GbifSpeciesResult);
      setImportResult(null);
    },
  });

  // Import mutation
  const importData = trpc.gbifEnrichment.importGbifData.useMutation({
    onSuccess: (data) => {
      setImportResult(data);
      setImportingFor(null);
    },
    onError: (err) => {
      setImportResult({ success: false, message: err.message });
      setImportingFor(null);
    },
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setActiveQuery(searchQuery.trim());
    setSpeciesResult(null);
    setImportResult(null);
    getDetails.mutate({ scientificName: searchQuery.trim() });
  };

  const handleImport = () => {
    if (!speciesResult?.species || !speciesResult.found) return;
    const sp = speciesResult.species;
    setImportingFor(speciesResult.scientificName);
    importData.mutate({
      latinName: speciesResult.scientificName,
      gbifKey: sp.usageKey,
      scientificName: sp.scientificName,
      family: sp.family,
      order: sp.order,
      kingdom: sp.kingdom,
      countries: speciesResult.countries.slice(0, 10),
      vernacularFr: speciesResult.vernacularNames["fr"]?.[0],
      vernacularEn: speciesResult.vernacularNames["en"]?.[0],
    });
  };

  const sp = speciesResult?.species;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-emerald-500" />
            Enrichissement GBIF
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Global Biodiversity Information Facility — distribution géographique et nomenclature botanique
          </p>
        </div>
        <div className="flex items-center gap-2">
          {stats?.status === "ok" ? (
            <Badge variant="outline" className="border-green-500/50 text-green-600 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" /> GBIF en ligne
            </Badge>
          ) : (
            <Badge variant="outline" className="border-red-500/50 text-red-600 text-xs">
              <XCircle className="h-3 w-3 mr-1" /> GBIF hors ligne
            </Badge>
          )}
          <Link href="/admin/gbif-batch">
            <Button variant="outline" size="sm" className="gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50">
              <Zap className="h-3 w-3" /> Enrichissement en masse
            </Button>
          </Link>
          <a
            href="https://www.gbif.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            gbif.org <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Info banner */}
      <Alert className="border-emerald-500/20 bg-emerald-500/5">
        <Info className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-sm">
          GBIF agrège plus de <strong>2 milliards d'occurrences</strong> de 2 millions d'espèces.
          Recherchez un nom scientifique pour obtenir la taxonomie complète, la distribution géographique
          et les noms vernaculaires, puis importez ces données dans la fiche de la plante.
        </AlertDescription>
      </Alert>

      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Rechercher une espèce</CardTitle>
          <CardDescription>Entrez le nom scientifique latin (ex : Rosa damascena, Nicotiana tabacum)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nom scientifique latin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={getDetails.isPending || !searchQuery.trim()}>
              {getDetails.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Rechercher
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {getDetails.isPending && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-3" />
          Interrogation de GBIF pour <em className="ml-1">{activeQuery}</em>…
        </div>
      )}

      {/* Results */}
      {speciesResult && !getDetails.isPending && (
        <div className="space-y-4">
          {!speciesResult.found ? (
            <Alert className="border-yellow-500/30 bg-yellow-500/10">
              <XCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <strong>"{activeQuery}"</strong> n'a pas été trouvé dans GBIF.
                Vérifiez l'orthographe du nom scientifique.
              </AlertDescription>
            </Alert>
          ) : (
            <Tabs defaultValue="taxonomy">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold italic">{sp?.canonicalName || sp?.scientificName}</h2>
                  <p className="text-xs text-muted-foreground">
                    GBIF key: {sp?.usageKey} · Confiance: {sp?.confidence}% · Statut: {sp?.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  {speciesResult.gbifUrl && (
                    <a href={speciesResult.gbifUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" /> GBIF
                      </Button>
                    </a>
                  )}
                  <Button
                    size="sm"
                    onClick={handleImport}
                    disabled={importData.isPending || !!importingFor}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {importData.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Download className="h-3 w-3 mr-1" />
                    )}
                    Importer dans la base
                  </Button>
                </div>
              </div>

              <TabsList className="mb-4">
                <TabsTrigger value="taxonomy">
                  <Leaf className="h-3 w-3 mr-1" /> Taxonomie
                </TabsTrigger>
                <TabsTrigger value="distribution">
                  <MapPin className="h-3 w-3 mr-1" /> Distribution ({speciesResult.countries.length} pays)
                </TabsTrigger>
                <TabsTrigger value="names">
                  <Languages className="h-3 w-3 mr-1" /> Noms vernaculaires
                </TabsTrigger>
              </TabsList>

              {/* Taxonomy tab */}
              <TabsContent value="taxonomy">
                <Card>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { label: "Règne", value: sp?.kingdom },
                        { label: "Embranchement", value: sp?.phylum },
                        { label: "Classe", value: sp?.class },
                        { label: "Ordre", value: sp?.order },
                        { label: "Famille", value: sp?.family },
                        { label: "Genre", value: sp?.genus },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-muted/30 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
                          <div className="font-medium italic mt-0.5">{value || "—"}</div>
                        </div>
                      ))}
                    </div>
                    {sp?.authorship && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        <span className="font-medium">Auteur :</span> {sp.authorship}
                      </div>
                    )}
                    <Separator className="my-3" />
                    <div className="text-xs text-muted-foreground">
                      Rang : <Badge variant="secondary" className="text-xs">{sp?.rank}</Badge>
                      {" · "}
                      Statut : <Badge variant="secondary" className="text-xs">{sp?.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Distribution tab */}
              <TabsContent value="distribution">
                <Card>
                  <CardContent className="pt-4">
                    {speciesResult.countries.length > 0 ? (
                      <>
                        <p className="text-sm text-muted-foreground mb-3">
                          {speciesResult.countries.length} pays répertoriés dans GBIF
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {speciesResult.countries.map((code) => (
                            <Badge key={code} variant="outline" className="text-xs">
                              <MapPin className="h-2.5 w-2.5 mr-1" />
                              {countryName(code)} ({code})
                            </Badge>
                          ))}
                        </div>
                        {speciesResult.distributions.length > 0 && (
                          <>
                            <Separator className="my-4" />
                            <p className="text-xs text-muted-foreground mb-2 font-medium">Détails des distributions :</p>
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                              {speciesResult.distributions
                                .filter((d) => d.locality || d.country)
                                .slice(0, 20)
                                .map((d, i) => (
                                  <div key={i} className="text-xs flex items-start gap-2 py-1 border-b border-border/30 last:border-0">
                                    <span className="text-muted-foreground min-w-[60px]">
                                      {d.country ? countryName(d.country) : "—"}
                                    </span>
                                    <span className="flex-1 text-foreground/70 truncate">{d.locality?.slice(0, 80)}</span>
                                    {d.status && (
                                      <Badge variant="secondary" className="text-[10px] shrink-0">{d.status}</Badge>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        Aucune donnée de distribution disponible dans GBIF pour cette espèce.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vernacular names tab */}
              <TabsContent value="names">
                <Card>
                  <CardContent className="pt-4">
                    {Object.keys(speciesResult.vernacularNames).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(speciesResult.vernacularNames).map(([lang, names]) => (
                          <div key={lang} className="flex items-start gap-3">
                            <Badge variant="outline" className="text-xs shrink-0 mt-0.5 w-8 justify-center">
                              {lang.toUpperCase()}
                            </Badge>
                            <div className="flex flex-wrap gap-1">
                              {names.map((name) => (
                                <span key={name} className="text-sm bg-muted/40 rounded px-2 py-0.5">
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        Aucun nom vernaculaire disponible dans GBIF pour cette espèce.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Import result */}
          <ImportResult result={importResult} />
        </div>
      )}
    </div>
  );
}
