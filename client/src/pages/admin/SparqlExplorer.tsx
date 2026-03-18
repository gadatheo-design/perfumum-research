/**
 * NOSE Phase 5 — SPARQL Explorer
 * Interface de requêtes croisées PERFUMUM ↔ Wikidata ↔ Europeana
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Globe, BookOpen, Palette, FlaskConical, Leaf,
  ExternalLink, Image, AlertCircle, Loader2, Sparkles, Code
} from "lucide-react";

// ─── Composant carte œuvre d'art ─────────────────────────────────────────────
function ArtworkCard({ artwork }: { artwork: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {artwork.image && (
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={artwork.image}
            alt={artwork.label}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
      {!artwork.image && (
        <div className="aspect-[4/3] bg-muted flex items-center justify-center">
          <Image className="h-12 w-12 text-muted-foreground/30" />
        </div>
      )}
      <CardContent className="p-3 space-y-1">
        <p className="font-medium text-sm line-clamp-2">{artwork.label}</p>
        {artwork.creator && (
          <p className="text-xs text-muted-foreground">{artwork.creator}</p>
        )}
        {artwork.date && (
          <p className="text-xs text-muted-foreground">{artwork.date.substring(0, 4)}</p>
        )}
        {artwork.collection && (
          <p className="text-xs text-muted-foreground truncate">{artwork.collection}</p>
        )}
        <div className="flex gap-1 pt-1 flex-wrap">
          {artwork.moleculeName && (
            <Badge variant="secondary" className="text-xs">
              <FlaskConical className="h-2.5 w-2.5 mr-1" />
              {artwork.moleculeName}
            </Badge>
          )}
          {artwork.europeanaUrl && (
            <a href={artwork.europeanaUrl} target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
                Europeana
                <ExternalLink className="h-2.5 w-2.5 ml-1" />
              </Badge>
            </a>
          )}
          {artwork.wikidataUrl && (
            <a href={artwork.wikidataUrl} target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
                Wikidata
                <ExternalLink className="h-2.5 w-2.5 ml-1" />
              </Badge>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Composant carte publication ─────────────────────────────────────────────
function PaperCard({ paper }: { paper: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-2">
        <p className="font-medium text-sm line-clamp-3">{paper.title}</p>
        <div className="flex flex-wrap gap-1">
          {paper.journal && (
            <Badge variant="secondary" className="text-xs">{paper.journal}</Badge>
          )}
          {paper.date && (
            <Badge variant="outline" className="text-xs">{paper.date.substring(0, 4)}</Badge>
          )}
        </div>
        {paper.authors && (
          <p className="text-xs text-muted-foreground">{paper.authors}</p>
        )}
        <div className="flex gap-1 flex-wrap">
          {paper.doi && (
            <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
                DOI
                <ExternalLink className="h-2.5 w-2.5 ml-1" />
              </Badge>
            </a>
          )}
          {paper.wikidataUrl && (
            <a href={paper.wikidataUrl} target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
                Wikidata
                <ExternalLink className="h-2.5 w-2.5 ml-1" />
              </Badge>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Onglet Statistiques NOSE ─────────────────────────────────────────────────
function NoseStatsTab() {
  const { data: stats, isLoading } = trpc.sparql.noseStats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métriques globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats?.molecules.withQid ?? 0}</p>
            <p className="text-sm text-muted-foreground">Molécules avec QID</p>
            <p className="text-xs text-muted-foreground">{stats?.molecules.percent ?? 0}% du total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{stats?.plants.withQid ?? 0}</p>
            <p className="text-sm text-muted-foreground">Plantes avec QID</p>
            <p className="text-xs text-muted-foreground">{stats?.plants.percent ?? 0}% du total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{stats?.sparql.totalWithArtworks ?? 0}</p>
            <p className="text-sm text-muted-foreground">Molécules dans l'art</p>
            <p className="text-xs text-muted-foreground">sur 50 testées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-violet-600">{stats?.sparql.totalWithPapers ?? 0}</p>
            <p className="text-sm text-muted-foreground">Molécules publiées</p>
            <p className="text-xs text-muted-foreground">sur 50 testées</p>
          </CardContent>
        </Card>
      </div>

      {/* Exemples d'œuvres d'art */}
      {stats?.sparql.sampleArtworks && stats.sparql.sampleArtworks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Palette className="h-4 w-4 text-amber-600" />
            Exemples d'œuvres d'art liées aux molécules PERFUMUM
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {stats.sparql.sampleArtworks.map((artwork, i) => (
              <ArtworkCard key={i} artwork={artwork} />
            ))}
          </div>
        </div>
      )}

      {(!stats?.sparql.sampleArtworks || stats.sparql.sampleArtworks.length === 0) && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Enrichissez d'abord les molécules avec des QIDs Wikidata</p>
            <p className="text-xs mt-1">Utilisez l'outil Wikidata Batch dans la section Admin</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Onglet Recherche par molécule ────────────────────────────────────────────
function MoleculeSearchTab() {
  const [moleculeId, setMoleculeId] = useState<string>("");
  const [searchType, setSearchType] = useState<"artworks" | "papers">("artworks");
  const [submitted, setSubmitted] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const artworksQuery = trpc.sparql.artworksForMolecule.useQuery(
    { moleculeId: currentId!, limit: 20 },
    { enabled: submitted && searchType === "artworks" && currentId !== null }
  );

  const papersQuery = trpc.sparql.papersForMolecule.useQuery(
    { moleculeId: currentId!, limit: 20 },
    { enabled: submitted && searchType === "papers" && currentId !== null }
  );

  const handleSearch = () => {
    const id = parseInt(moleculeId);
    if (!isNaN(id) && id > 0) {
      setCurrentId(id);
      setSubmitted(true);
    }
  };

  const isLoading = searchType === "artworks" ? artworksQuery.isLoading : papersQuery.isLoading;
  const artworks = artworksQuery.data?.artworks ?? [];
  const papers = papersQuery.data?.papers ?? [];
  const error = artworksQuery.data?.error || papersQuery.data?.error;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Label htmlFor="molecule-id">ID Molécule PERFUMUM</Label>
          <Input
            id="molecule-id"
            placeholder="ex: 90021"
            value={moleculeId}
            onChange={(e) => setMoleculeId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div>
          <Label>Type de recherche</Label>
          <Select value={searchType} onValueChange={(v) => setSearchType(v as any)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="artworks">
                <span className="flex items-center gap-2">
                  <Palette className="h-4 w-4" /> Œuvres d'art
                </span>
              </SelectItem>
              <SelectItem value="papers">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Publications
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSearch} disabled={!moleculeId}>
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Requête SPARQL en cours...</span>
        </div>
      )}

      {error && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-4 flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {submitted && !isLoading && !error && searchType === "artworks" && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            {artworks.length} œuvre(s) trouvée(s)
            {artworksQuery.data?.moleculeName && ` pour ${artworksQuery.data.moleculeName}`}
            {artworksQuery.data?.qid && (
              <a
                href={`https://www.wikidata.org/wiki/${artworksQuery.data.qid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-primary hover:underline"
              >
                {artworksQuery.data.qid} ↗
              </a>
            )}
          </p>
          {artworks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {artworks.map((artwork, i) => (
                <ArtworkCard key={i} artwork={artwork} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <p className="text-sm">Aucune œuvre d'art trouvée sur Wikidata pour cette molécule</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {submitted && !isLoading && !error && searchType === "papers" && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            {papers.length} publication(s) trouvée(s)
            {papersQuery.data?.moleculeName && ` pour ${papersQuery.data.moleculeName}`}
          </p>
          {papers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {papers.map((paper, i) => (
                <PaperCard key={i} paper={paper} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <p className="text-sm">Aucune publication trouvée sur Wikidata pour cette molécule</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Onglet Vue globale (batch) ───────────────────────────────────────────────
function BatchArtworksTab() {
  const [familyFilter, setFamilyFilter] = useState<string>("");
  const [enabled, setEnabled] = useState(false);

  const { data, isLoading } = trpc.sparql.artworksBatch.useQuery(
    { limit: 50, familyFilter: familyFilter || undefined },
    { enabled }
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Label>Filtrer par famille chimique (optionnel)</Label>
          <Input
            placeholder="ex: Terpène, Ester, Aldéhyde..."
            value={familyFilter}
            onChange={(e) => setFamilyFilter(e.target.value)}
          />
        </div>
        <Button onClick={() => setEnabled(true)} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Globe className="h-4 w-4 mr-2" />
          )}
          Explorer
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Requête SPARQL batch en cours (peut prendre 10-30s)...</span>
        </div>
      )}

      {data && !isLoading && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            {data.total} œuvre(s) trouvée(s) sur {data.moleculesChecked} molécules avec QID
          </p>
          {data.artworks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {data.artworks.map((artwork, i) => (
                <ArtworkCard key={i} artwork={artwork} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune œuvre d'art trouvée pour les molécules avec QID</p>
                <p className="text-xs mt-1">Enrichissez d'abord les QIDs Wikidata via l'outil Wikidata Batch</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Onglet Requête libre (mode expert) ──────────────────────────────────────
function FreeSparqlTab() {
  const [sparql, setSparql] = useState(`# Exemple : molécules PERFUMUM dans des œuvres d'art
SELECT DISTINCT ?molecule ?moleculeLabel ?artwork ?artworkLabel ?image WHERE {
  VALUES ?molecule { wd:Q407418 wd:Q163939 wd:Q207414 }
  { ?artwork wdt:P180 ?molecule . } UNION { ?artwork wdt:P921 ?molecule . }
  OPTIONAL { ?artwork wdt:P18 ?image . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 10`);
  const [results, setResults] = useState<any>(null);

  const mutation = trpc.sparql.freeQuery.useMutation({
    onSuccess: (data) => setResults(data),
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Requête SPARQL (Wikidata)</Label>
        <Textarea
          value={sparql}
          onChange={(e) => setSparql(e.target.value)}
          className="font-mono text-xs min-h-[200px]"
          placeholder="SELECT ... WHERE { ... }"
        />
        <p className="text-xs text-muted-foreground">
          Seules les requêtes SELECT sont autorisées. Endpoint : query.wikidata.org
        </p>
      </div>

      <Button
        onClick={() => mutation.mutate({ sparql })}
        disabled={mutation.isPending || !sparql.trim()}
      >
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Code className="h-4 w-4 mr-2" />
        )}
        Exécuter
      </Button>

      {results?.error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4 flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm font-mono">{results.error}</p>
          </CardContent>
        </Card>
      )}

      {results && !results.error && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            {results.bindings.length} résultat(s) — Variables : {results.vars.join(", ")}
          </p>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-xs">
              <thead className="bg-muted">
                <tr>
                  {results.vars.map((v: string) => (
                    <th key={v} className="px-3 py-2 text-left font-medium">{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.bindings.slice(0, 50).map((row: any, i: number) => (
                  <tr key={i} className="border-t hover:bg-muted/50">
                    {results.vars.map((v: string) => (
                      <td key={v} className="px-3 py-2 max-w-xs truncate">
                        {row[v]?.type === "uri" ? (
                          <a
                            href={row[v].value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {row[v].value.split("/").pop()}
                          </a>
                        ) : (
                          row[v]?.value ?? "—"
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {results.bindings.length > 50 && (
            <p className="text-xs text-muted-foreground mt-1">
              Affichage limité à 50 résultats sur {results.bindings.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Onglet Templates ─────────────────────────────────────────────────────────
function TemplatesTab() {
  const { data: templates } = trpc.sparql.queryTemplates.useQuery();

  const categoryIcons: Record<string, any> = {
    art: Palette,
    science: BookOpen,
    botanique: Leaf,
    usage: FlaskConical,
    parfumerie: Sparkles,
    europeana: Globe,
  };

  const categoryColors: Record<string, string> = {
    art: "text-amber-600",
    science: "text-blue-600",
    botanique: "text-emerald-600",
    usage: "text-violet-600",
    parfumerie: "text-pink-600",
    europeana: "text-cyan-600",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates?.map((template) => {
        const Icon = categoryIcons[template.category] || Globe;
        const colorClass = categoryColors[template.category] || "text-primary";
        return (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Icon className={`h-4 w-4 ${colorClass}`} />
                {template.name}
              </CardTitle>
              <CardDescription className="text-xs">{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted rounded p-2 overflow-x-auto max-h-32 font-mono">
                {template.sparql}
              </pre>
              <p className="text-xs text-muted-foreground mt-2">
                Remplacez <code className="bg-muted px-1 rounded">{"{{QID}}"}</code> par le QID Wikidata de la molécule/plante
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function SparqlExplorer() {
  return (
    <div className="container py-6 space-y-6">
      {/* En-tête */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">NOSE Phase 5 — SPARQL Explorer</h1>
          <Badge variant="secondary" className="text-xs">Wikidata · Europeana</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Requêtes croisées entre PERFUMUM et les bases de données culturelles mondiales.
          Découvrez les œuvres d'art, publications scientifiques et collections muséales
          liées aux molécules et plantes de votre recherche.
        </p>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="stats">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="stats" className="text-xs">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="molecule" className="text-xs">
            <FlaskConical className="h-3.5 w-3.5 mr-1" />
            Par molécule
          </TabsTrigger>
          <TabsTrigger value="batch" className="text-xs">
            <Globe className="h-3.5 w-3.5 mr-1" />
            Vue globale
          </TabsTrigger>
          <TabsTrigger value="free" className="text-xs">
            <Code className="h-3.5 w-3.5 mr-1" />
            SPARQL libre
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-4">
          <NoseStatsTab />
        </TabsContent>

        <TabsContent value="molecule" className="mt-4">
          <MoleculeSearchTab />
        </TabsContent>

        <TabsContent value="batch" className="mt-4">
          <BatchArtworksTab />
        </TabsContent>

        <TabsContent value="free" className="mt-4">
          <FreeSparqlTab />
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <TemplatesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
