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
  ExternalLink, Image, AlertCircle, Loader2, Sparkles, Code,
  Building2, Calendar, Layers, Clock, GitBranch, Copy, Atom,
  Save, Star, StarOff, Library, Trash2, Play, Download, History, Pin
} from "lucide-react";
import { EuropeanaWidget } from "@/components/EuropeanaWidget";
import { EntityQidPicker, QidBadge } from "@/components/EntityQidPicker";
import { EntityAutocomplete } from "@/components/ui/EntityAutocomplete";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LibrarySparqlTab } from "./LibrarySparqlTab";

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
      {stats?.sparql.sampleArtworks && stats?.sparql.sampleArtworks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Palette className="h-4 w-4 text-amber-600" />
            Exemples d'œuvres d'art liées aux molécules PERFUMUM
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {stats?.sparql.sampleArtworks.map((artwork, i) => (
              <ArtworkCard key={i} artwork={artwork} />
            ))}
          </div>
        </div>
      )}

      {(!stats?.sparql.sampleArtworks || stats?.sparql.sampleArtworks.length === 0) && (
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
  const [searchType, setSearchType] = useState<"artworks" | "papers" | "properties">("properties");
  const [submitted, setSubmitted] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const artworksQuery = trpc.sparql.artworksForMolecule.useQuery(
    { moleculeId: currentId!, limit: 20 },
    { enabled: submitted && searchType === "artworks" && currentId !== null }
  );

  // Utilise le fallback OpenAlex si Wikidata retourne 0 résultats
  const papersQuery = trpc.sparql.papersForMoleculeWithFallback.useQuery(
    { moleculeId: currentId!, limit: 20 },
    { enabled: submitted && searchType === "papers" && currentId !== null }
  );

  // Propriétés chimiques Wikidata (formule, CAS, SMILES, usages)
  const wikidataInfoQuery = trpc.sparql.moleculeWikidataInfo.useQuery(
    { moleculeId: currentId! },
    { enabled: submitted && searchType === "properties" && currentId !== null }
  );

  const handleSearch = () => {
    const id = parseInt(moleculeId);
    if (!isNaN(id) && id > 0) {
      setCurrentId(id);
      setSubmitted(true);
    }
  };

  const handleMoleculeSelect = (id: number | null) => {
    if (id) {
      setMoleculeId(String(id));
      setCurrentId(id);
      setSubmitted(true);
    } else {
      setMoleculeId("");
      setCurrentId(null);
      setSubmitted(false);
    }
  };

  const isLoading = searchType === "artworks" ? artworksQuery.isLoading
    : searchType === "papers" ? papersQuery.isLoading
    : wikidataInfoQuery.isLoading;
  const artworks = artworksQuery.data?.artworks ?? [];
  const papers = papersQuery.data?.papers ?? [];
  const paperSource = papersQuery.data?.source;
  const error = artworksQuery.data?.error || papersQuery.data?.error;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Label htmlFor="molecule-id">Molécule PERFUMUM</Label>
          <EntityAutocomplete
            entityType="molecule"
            value={currentId}
            onChange={handleMoleculeSelect}
            placeholder="Rechercher une molécule..."
            className="mt-1"
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
              <SelectItem value="properties">
                <span className="flex items-center gap-2">
                  <Atom className="h-4 w-4" /> Propriétés Wikidata
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
          <div className="flex items-center gap-3 mb-3">
            <p className="text-sm text-muted-foreground">
              {papers.length} publication(s) trouvée(s)
              {papersQuery.data?.moleculeName && ` pour ${papersQuery.data.moleculeName}`}
            </p>
            {paperSource === "openalex" && (
              <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                via OpenAlex (fallback Wikidata vide)
              </span>
            )}
            {paperSource === "wikidata" && (
              <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                via Wikidata SPARQL
              </span>
            )}
          </div>
          {papers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {papers.map((paper, i) => (
                <PaperCard key={i} paper={paper} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune publication trouvée sur Wikidata ni OpenAlex pour cette molécule</p>
                {papersQuery.data?.qid && (
                  <a href={`https://www.wikidata.org/wiki/${papersQuery.data.qid}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-2 block">
                    Voir {papersQuery.data.qid} sur Wikidata ↗
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {submitted && !isLoading && searchType === "properties" && (
        <div className="space-y-4">
          {!wikidataInfoQuery.data?.found ? (
            <Card className="border-dashed"><CardContent className="p-8 text-center text-muted-foreground"><p className="text-sm">Molécule introuvable</p></CardContent></Card>
          ) : !wikidataInfoQuery.data.hasQid ? (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-300">{wikidataInfoQuery.data.moleculeName} — pas de QID Wikidata</p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">Enrichissez d'abord le QID Wikidata via l'outil d'enrichissement phylogénique ou l'admin molécules.</p>
                    {wikidataInfoQuery.data.perfumumData?.casNumber && (
                      <p className="text-xs mt-2 text-muted-foreground">CAS PERFUMUM : {wikidataInfoQuery.data.perfumumData.casNumber}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Identité Wikidata */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Atom className="h-4 w-4 text-primary" />
                    {wikidataInfoQuery.data.moleculeName}
                    <a href={wikidataInfoQuery.data.wikidataUrl!} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline font-normal">
                      {wikidataInfoQuery.data.qid} ↗
                    </a>
                  </CardTitle>
                  {wikidataInfoQuery.data.wikidataInfo?.description && (
                    <p className="text-sm text-muted-foreground">{wikidataInfoQuery.data.wikidataInfo.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Formule", value: wikidataInfoQuery.data.wikidataInfo?.molecularFormula },
                    { label: "Masse mol.", value: wikidataInfoQuery.data.wikidataInfo?.molecularMass ? `${wikidataInfoQuery.data.wikidataInfo.molecularMass} g/mol` : undefined },
                    { label: "CAS", value: wikidataInfoQuery.data.wikidataInfo?.casNumber || wikidataInfoQuery.data.perfumumData?.casNumber },
                    { label: "IUPAC", value: wikidataInfoQuery.data.wikidataInfo?.iupacName || wikidataInfoQuery.data.perfumumData?.iupacName },
                    { label: "SMILES", value: wikidataInfoQuery.data.wikidataInfo?.smiles },
                    { label: "InChI", value: wikidataInfoQuery.data.wikidataInfo?.inchi },
                    { label: "Pt. ébullition", value: wikidataInfoQuery.data.wikidataInfo?.boilingPoint ? `${wikidataInfoQuery.data.wikidataInfo.boilingPoint}°C` : undefined },
                    { label: "Pt. fusion", value: wikidataInfoQuery.data.wikidataInfo?.meltingPoint ? `${wikidataInfoQuery.data.wikidataInfo.meltingPoint}°C` : undefined },
                  ].filter(p => p.value).map(p => (
                    <div key={p.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{p.label}</span>
                      <span className="font-mono text-xs max-w-[60%] text-right break-all">{p.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              {/* Usages & Sources naturelles */}
              <div className="space-y-4">
                {wikidataInfoQuery.data.wikidataInfo?.usedIn && wikidataInfoQuery.data.wikidataInfo.usedIn.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Usages documentés</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        {wikidataInfoQuery.data.wikidataInfo.usedIn.map((u, i) => (
                          <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{u}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {wikidataInfoQuery.data.wikidataInfo?.foundIn && wikidataInfoQuery.data.wikidataInfo.foundIn.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Sources naturelles</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        {wikidataInfoQuery.data.wikidataInfo.foundIn.map((f, i) => (
                          <span key={i} className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">{f}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {wikidataInfoQuery.data.wikidataInfo?.image && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Structure moléculaire</CardTitle></CardHeader>
                    <CardContent>
                      <img src={wikidataInfoQuery.data.wikidataInfo.image} alt={wikidataInfoQuery.data.moleculeName}
                        className="max-h-40 object-contain mx-auto" />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
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

// ─── Dialog de sauvegarde d'une requête SPARQL ───────────────────────────────
function SaveQueryDialog({
  open, onClose, sparqlQuery, defaultCategory = "free", defaultEndpoint = "wikidata"
}: {
  open: boolean;
  onClose: () => void;
  sparqlQuery: string;
  defaultCategory?: string;
  defaultEndpoint?: string;
}) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState(defaultCategory);

  const saveMutation = trpc.sparqlSaved.save.useMutation({
    onSuccess: () => {
      toast({ title: "Requête sauvegardée", description: `"${title}" ajoutée à votre bibliothèque SPARQL.` });
      utils.sparqlSaved.list.invalidate();
      utils.sparqlSaved.stats.invalidate();
      setTitle(""); setNotes(""); setTags("");
      onClose();
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-4 w-4 text-primary" />
            Sauvegarder la requête SPARQL
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label className="text-xs">Titre <span className="text-red-500">*</span></Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Molécules PERFUMUM dans l'art Wikidata"
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Catégorie</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Libre</SelectItem>
                <SelectItem value="molecule">Molécule</SelectItem>
                <SelectItem value="plant">Plante</SelectItem>
                <SelectItem value="artwork">Œuvre d'art</SelectItem>
                <SelectItem value="temporal">Temporel</SelectItem>
                <SelectItem value="genealogy">Généalogie</SelectItem>
                <SelectItem value="europeana">Europeana</SelectItem>
                <SelectItem value="internal">Interne PERFUMUM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tags (séparés par virgule)</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ex: wikidata, rose, iconographie"
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Notes de recherche</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contexte, résultats attendus, observations..."
              className="text-sm min-h-[80px]"
            />
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-xs font-mono text-muted-foreground line-clamp-3">{sparqlQuery}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} size="sm">Annuler</Button>
          <Button
            onClick={() => saveMutation.mutate({
              title,
              notes: notes || undefined,
              tags: tags || undefined,
              category: category as any,
              sparqlQuery,
              endpoint: (defaultEndpoint === "europeana" ? "europeana-edm" : defaultEndpoint) as any,
            })}
            disabled={!title.trim() || saveMutation.isPending}
            size="sm"
          >
            {saveMutation.isPending ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />}
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  const [injectedQid, setInjectedQid] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [execTime, setExecTime] = useState<number | null>(null);

  const mutation = trpc.sparql.freeQuery.useMutation({
    onSuccess: (data) => {
      setResults(data);
      setExecTime(Date.now());
    },
  });

  const handleQidInject = (qid: string, entityName: string) => {
    if (sparql.includes("{{QID}}")) {
      setSparql(sparql.replace(/\{\{QID\}\}/g, qid));
    } else {
      setSparql(sparql.replace(
        /(VALUES \?(?:molecule|plant|entity) \{)([^}]*)(\})/,
        `$1$2 wd:${qid}$3`
      ));
    }
    setInjectedQid(qid);
    setTimeout(() => setInjectedQid(null), 3000);
  };

  const handleExportCSV = () => {
    if (!results?.bindings?.length) return;
    const header = results.vars.join(",");
    const rows = results.bindings.map((row: any) =>
      results.vars.map((v: string) => `"${(row[v]?.value ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "sparql_results.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!results?.bindings?.length) return;
    const flat = results.bindings.map((row: any) =>
      Object.fromEntries(results.vars.map((v: string) => [v, row[v]?.value ?? null]))
    );
    const blob = new Blob([JSON.stringify(flat, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "sparql_results.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {showSaveDialog && (
        <SaveQueryDialog
          open={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          sparqlQuery={sparql}
          defaultCategory="free"
          defaultEndpoint="wikidata"
        />
      )}

      {/* Sélecteur QID intégré */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Sélecteur d'entité PERFUMUM — Injection de QID
        </p>
        <EntityQidPicker
          onQidSelect={handleQidInject}
          injectLabel="Injecter wd:QID"
          onlyWithQid={true}
        />
        {injectedQid && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
            <span>✓</span> QID <QidBadge qid={injectedQid} size="xs" /> injecté dans la requête
          </p>
        )}
      </div>

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

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          onClick={() => mutation.mutate({ sparql })}
          disabled={mutation.isPending || !sparql.trim()}
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          Exécuter
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowSaveDialog(true)}
          disabled={!sparql.trim()}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Sauvegarder
        </Button>
        {results?.bindings?.length > 0 && (
          <>
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportJSON} className="gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" /> JSON
            </Button>
          </>
        )}
      </div>

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
                {results.bindings.slice(0, 100).map((row: any, i: number) => (
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
          {results.bindings.length > 100 && (
            <p className="text-xs text-muted-foreground mt-1">
              Affichage limité à 100 résultats sur {results.bindings.length}
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
  const [selectedQid, setSelectedQid] = useState<string>("");
  const [selectedEntityName, setSelectedEntityName] = useState<string>("");
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [saveDialogQuery, setSaveDialogQuery] = useState<string | null>(null);
  const [saveDialogCategory, setSaveDialogCategory] = useState<string>("free");

  const categoryIcons: Record<string, any> = {
    art: Palette,
    science: BookOpen,
    botanique: Leaf,
    usage: FlaskConical,
    parfumerie: Sparkles,
    europeana: Globe,
    "europeana-federated": Globe,
    temporal: Clock,
    genealogy: GitBranch,
  };

  const categoryColors: Record<string, string> = {
    art: "text-amber-600",
    science: "text-blue-600",
    botanique: "text-emerald-600",
    usage: "text-violet-600",
    parfumerie: "text-pink-600",
    europeana: "text-cyan-600",
    "europeana-federated": "text-cyan-700",
    temporal: "text-orange-600",
    genealogy: "text-teal-600",
  };

  const getResolvedSparql = (sparql: string) => {
    if (!selectedQid) return sparql;
    return sparql.replace(/\{\{QID\}\}/g, selectedQid);
  };

  const handleCopyTemplate = (templateId: string, sparql: string) => {
    navigator.clipboard.writeText(getResolvedSparql(sparql)).then(() => {
      setCopiedTemplate(templateId);
      setTimeout(() => setCopiedTemplate(null), 2000);
    });
  };

  return (
    <div className="space-y-4">
      {saveDialogQuery && (
        <SaveQueryDialog
          open={!!saveDialogQuery}
          onClose={() => setSaveDialogQuery(null)}
          sparqlQuery={saveDialogQuery}
          defaultCategory={saveDialogCategory}
          defaultEndpoint="wikidata"
        />
      )}
      {/* Sélecteur QID global pour les templates */}
      <div className="rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 p-4">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Search className="h-3.5 w-3.5" />
          Sélectionner une entité pour pré-remplir les templates
        </p>
        <EntityQidPicker
          onQidSelect={(qid, name) => { setSelectedQid(qid); setSelectedEntityName(name); }}
          injectLabel="Utiliser ce QID"
          onlyWithQid={true}
        />
        {selectedQid && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Templates pré-remplis avec <QidBadge qid={selectedQid} size="xs" /> ({selectedEntityName}) — les <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">{"{{QID}}"}</code> sont remplacés automatiquement.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates?.map((template) => {
          const Icon = categoryIcons[template.category] || Globe;
          const colorClass = categoryColors[template.category] || "text-primary";
          const resolvedSparql = getResolvedSparql(template.sparql);
          const isExpanded = expandedTemplate === template.id;
          const hasQidPlaceholder = template.sparql.includes("{{QID}}");
          const isResolved = hasQidPlaceholder && !!selectedQid;

          return (
            <Card key={template.id} className={`hover:shadow-md transition-shadow ${isResolved ? "border-blue-300 dark:border-blue-700" : ""}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${colorClass}`} />
                  {template.name}
                  {hasQidPlaceholder && (
                    <Badge variant="outline" className={`text-[10px] px-1 py-0 ml-auto ${isResolved ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/30 dark:border-blue-700 dark:text-blue-300" : "text-muted-foreground"}`}>
                      {isResolved ? `QID: ${selectedQid}` : "{{QID}} requis"}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-xs">{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <pre className={`text-xs bg-muted rounded p-2 overflow-x-auto font-mono transition-all ${isExpanded ? "" : "max-h-24"}`}>
                  {resolvedSparql}
                </pre>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 flex-1"
                    onClick={() => setExpandedTemplate(isExpanded ? null : template.id)}
                  >
                    {isExpanded ? "Réduire" : "Voir tout"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 flex-1"
                    onClick={() => handleCopyTemplate(template.id, template.sparql)}
                    disabled={hasQidPlaceholder && !selectedQid}
                    title={hasQidPlaceholder && !selectedQid ? "Sélectionnez d'abord une entité avec QID" : "Copier la requête"}
                  >
                    {copiedTemplate === template.id ? (
                      <><span className="text-green-600">✓</span> Copié</>
                    ) : (
                      <><Copy className="h-3 w-3 mr-1" />Copier</>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => {
                      setSaveDialogCategory(template.category || "free");
                      setSaveDialogQuery(resolvedSparql);
                    }}
                    disabled={hasQidPlaceholder && !selectedQid}
                    title="Sauvegarder dans la bibliothèque"
                  >
                    <Save className="h-3 w-3" />
                  </Button>
                </div>
                {hasQidPlaceholder && !selectedQid && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Sélectionnez une entité ci-dessus pour pré-remplir ce template
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page principale ────────────────────────────────────────────────
export default function SparqlExplorer() {
  // Lecture des paramètres d'URL pour pré-remplir l'onglet et le QID
  // Exemple : /admin/sparql-explorer?tab=europeana-sparql&qid=Q12321
  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get('tab') || 'stats';
  const initialQid = urlParams.get('qid') || '';
  const initialPlantName = urlParams.get('plant') || '';

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
      <Tabs defaultValue={defaultTab}>
        <TabsList className="grid grid-cols-8 w-full">
          <TabsTrigger value="stats" className="text-xs">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="molecule" className="text-xs">
            <FlaskConical className="h-3.5 w-3.5 mr-1" />
            Molécule
          </TabsTrigger>
          <TabsTrigger value="batch" className="text-xs">
            <Globe className="h-3.5 w-3.5 mr-1" />
            Global
          </TabsTrigger>
          <TabsTrigger value="free" className="text-xs">
            <Code className="h-3.5 w-3.5 mr-1" />
            Libre
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="europeana" className="text-xs">
            <Layers className="h-3.5 w-3.5 mr-1 text-cyan-600" />
            <span className="text-cyan-600 font-medium">Europeana</span>
          </TabsTrigger>
          <TabsTrigger value="europeana-sparql" className="text-xs">
            <Layers className="h-3.5 w-3.5 mr-1 text-violet-600" />
            <span className="text-violet-600 font-medium">EDM SPARQL</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="text-xs">
            <Library className="h-3.5 w-3.5 mr-1 text-emerald-600" />
            <span className="text-emerald-600 font-medium">Bibliothèque</span>
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

        <TabsContent value="europeana" className="mt-4">
          <EuropeanaUnifiedTab />
        </TabsContent>
        <TabsContent value="europeana-sparql" className="mt-4">
          <EuropeanaSparqlTab initialQid={initialQid} initialPlantName={initialPlantName} />
        </TabsContent>
        <TabsContent value="library" className="mt-4">
          <LibrarySparqlTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Onglet Europeana Unifié ──────────────────────────────────────────────────
/**
 * Vue unifiée Wikidata + Europeana dans le SPARQL Explorer.
 * Permet de croiser les QIDs Wikidata avec les collections muséales européennes
 * pour les 4 thèmes thématiques de PERFUMUM.
 */
function EuropeanaUnifiedTab() {
  const [activeTheme, setActiveTheme] = useState<string>("rose_damas");
  const [sparqlQuery, setSparqlQuery] = useState<string>("");
  const [sparqlResults, setSparqlResults] = useState<any[] | null>(null);
  const [sparqlLoading, setSparqlLoading] = useState(false);

  // Requêtes thématiques Europeana
  const { data: thematicData, isLoading: thematicLoading } = trpc.europeana.thematicSearch.useQuery(
    { theme: activeTheme as "rose_damas" | "encens" | "tabac_ottoman" | "houblon", limit: 12 },
    { enabled: true }
  );

  // Stats Europeana
  const { data: europeanaStats } = trpc.europeana.stats?.useQuery();

  // Requête SPARQL Wikidata libre
  const freeSparqlMutation = trpc.sparql.freeQuery.useMutation();

  const themes = [
    { id: "rose_damas", label: "Rose de Damas", icon: "🌹", color: "text-rose-600" },
    { id: "encens", label: "Encens & Oliban", icon: "🔥", color: "text-amber-600" },
    { id: "tabac_ottoman", label: "Tabac ottoman", icon: "🌿", color: "text-emerald-600" },
    { id: "houblon", label: "Houblon & Bière", icon: "🌾", color: "text-yellow-600" },
  ];

  const sparqlTemplates = [
    {
      label: "Rose de Damas — Wikidata",
      query: `SELECT ?item ?itemLabel ?image ?date WHERE {
  ?item wdt:P31 wd:Q3305213.
  ?item wdt:P180 wd:Q102231.
  OPTIONAL { ?item wdt:P18 ?image. }
  OPTIONAL { ?item wdt:P571 ?date. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
} LIMIT 20`,
    },
    {
      label: "Encens dans les collections",
      query: `SELECT ?item ?itemLabel ?image ?collection ?collectionLabel WHERE {
  ?item wdt:P31 wd:Q3305213.
  ?item wdt:P180 wd:Q131395.
  OPTIONAL { ?item wdt:P18 ?image. }
  OPTIONAL { ?item wdt:P195 ?collection. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
} LIMIT 20`,
    },
    {
      label: "Iconographie tabac ottoman",
      query: `SELECT ?item ?itemLabel ?image ?creator ?creatorLabel WHERE {
  ?item wdt:P31 wd:Q3305213.
  ?item wdt:P180 wd:Q42308.
  ?item wdt:P276 ?place.
  ?place wdt:P17 wd:Q43.
  OPTIONAL { ?item wdt:P18 ?image. }
  OPTIONAL { ?item wdt:P170 ?creator. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
} LIMIT 20`,
    },
  ];

  const handleSparqlRun = async () => {
    if (!sparqlQuery.trim()) return;
    setSparqlLoading(true);
    try {
      const result = await freeSparqlMutation.mutateAsync({ sparql: sparqlQuery });
      setSparqlResults((result as any).results || result.bindings || []);
    } catch (e) {
      setSparqlResults([]);
    } finally {
      setSparqlLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-600" />
            Vue unifiée PERFUMUM ↔ Europeana
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Croisez les QIDs Wikidata avec les 50 millions d'objets des collections muséales européennes.
          </p>
        </div>
        {europeanaStats && (
          <div className="flex gap-2 shrink-0">
            <div className="text-center px-3 py-1.5 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <p className="text-lg font-bold text-cyan-700 dark:text-cyan-400">
                {(europeanaStats as any).apiAvailable ? "✓" : "○"}
              </p>
              <p className="text-xs text-muted-foreground">API</p>
            </div>
            <div className="text-center px-3 py-1.5 bg-muted rounded-lg border">
              <p className="text-lg font-bold">{(europeanaStats as any).themesCount ?? (europeanaStats as any).newThemesCount ?? 0}</p>
              <p className="text-xs text-muted-foreground">Thèmes</p>
            </div>
          </div>
        )}
      </div>

      {/* Sélecteur de thème */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setActiveTheme(theme.id)}
            className={`p-3 rounded-lg border text-left transition-all ${
              activeTheme === theme.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <div className="text-xl mb-1">{theme.icon}</div>
            <p className={`text-xs font-medium ${activeTheme === theme.id ? "text-primary" : ""}`}>
              {theme.label}
            </p>
          </button>
        ))}
      </div>

      {/* Résultats Europeana pour le thème sélectionné */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 text-cyan-600" />
            Collections Europeana — {themes.find(t => t.id === activeTheme)?.label}
          </h4>
          {thematicData && (
            <Badge variant="outline" className="text-xs">
              {(thematicData as any).apiAvailable
                ? `${thematicData?.total.toLocaleString()} œuvres`
                : "Démo"}
            </Badge>
          )}
        </div>

        {thematicLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Interrogation des collections…</span>
          </div>
        )}

        {thematicData && !thematicLoading && (
          <>
            {!(thematicData as any).apiAvailable && (
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 rounded p-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                Mode démonstration — configurez EUROPEANA_API_KEY pour accéder aux vraies collections.
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {thematicData?.items.map((item: any, i: number) => (
                <a
                  key={`${item.id}-${i}`}
                  href={item.europeanaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg overflow-hidden border hover:border-primary/50 transition-all hover:shadow-md"
                >
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Palette className="h-8 w-8 text-muted-foreground/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                      <div className="p-2 w-full translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-white text-xs font-medium line-clamp-2">{item.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium line-clamp-1">{item.title}</p>
                    {item.creator && <p className="text-xs text-muted-foreground line-clamp-1">{item.creator}</p>}
                    {item.institution && (
                      <p className="text-xs text-muted-foreground/60 line-clamp-1 flex items-center gap-0.5 mt-0.5">
                        <Building2 className="h-2.5 w-2.5 shrink-0" />
                        {item.institution}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Séparateur */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
          <Code className="h-3.5 w-3.5" />
          Requêtes SPARQL Wikidata croisées
        </h4>

        {/* Templates SPARQL */}
        <div className="flex flex-wrap gap-2 mb-3">
          {sparqlTemplates.map((tpl) => (
            <Button
              key={tpl.label}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => setSparqlQuery(tpl.query)}
            >
              {tpl.label}
            </Button>
          ))}
        </div>

        <Textarea
          value={sparqlQuery}
          onChange={(e) => setSparqlQuery(e.target.value)}
          placeholder="Saisissez une requête SPARQL Wikidata ou utilisez un template ci-dessus…"
          className="font-mono text-xs min-h-[120px]"
        />

        <div className="flex justify-end mt-2">
          <Button
            size="sm"
            onClick={handleSparqlRun}
            disabled={sparqlLoading || !sparqlQuery.trim()}
            className="gap-2"
          >
            {sparqlLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            Exécuter
          </Button>
        </div>

        {/* Résultats SPARQL */}
        {sparqlResults !== null && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">{sparqlResults.length} résultat(s)</p>
            {sparqlResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {sparqlResults.map((r: any, i: number) => (
                  <ArtworkCard key={i} artwork={r} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun résultat</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Onglet SPARQL Europeana natif (Sprint 3.1) ────────────────────────────────────────────────
function EuropeanaSparqlTab({ initialQid = '', initialPlantName = '' }: { initialQid?: string; initialPlantName?: string }) {
  // Si un QID est passé en paramètre d'URL, pré-remplir la requête avec le template fédéré plante
  const initialQuery = initialQid
    ? `SELECT DISTINCT ?plant ?plantLabel ?europeanaId ?image WHERE {\n  VALUES ?plant { wd:${initialQid} }\n  ?plant wdt:P727 ?europeanaId .\n  OPTIONAL { ?plant wdt:P18 ?image . }\n  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }\n}\nLIMIT 20`
    : '';
  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<any[] | null>(null);
  const [vars, setVars] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { data: templates } = trpc.sparql.europeanaTemplates.useQuery();
  const europeanaQueryMutation = trpc.sparql.europeanaQuery.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setResults(data.results);
        setVars(data.vars);
        setError(null);
      } else {
        setError(data.error || "Erreur SPARQL Europeana");
        setResults([]);
      }
    },
    onError: (e) => {
      setError(e.message);
      setResults([]);
    },
  });

  const handleRun = () => {
    if (!query.trim()) return;
    setError(null);
    europeanaQueryMutation.mutate({ sparql: query });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold flex items-center gap-2">
          <Layers className="h-4 w-4 text-violet-600" />
          SPARQL Europeana natif — Endpoint EDM
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Requêtes directes sur{" "}
          <a href="https://sparql.europeana.eu/" target="_blank" rel="noopener noreferrer" className="text-violet-600 underline">
            sparql.europeana.eu
          </a>{" "}
          via le modèle EDM. Préfixes :{" "}
          <code className="font-mono text-xs bg-muted px-1 rounded">edm:</code>,{" "}
          <code className="font-mono text-xs bg-muted px-1 rounded">dc:</code>,{" "}
          <code className="font-mono text-xs bg-muted px-1 rounded">dcterms:</code>.
        </p>
      </div>

      {templates && templates?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Templates EDM</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {templates?.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setQuery(tpl.sparql)}
                className="text-left p-3 rounded-lg border hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all"
              >
                <p className="text-xs font-medium">{tpl.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{tpl.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-xs font-medium">Requête SPARQL (EDM Europeana)</Label>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>

SELECT ?item ?title ?provider WHERE {
  ?item a edm:ProvidedCHO .
  ?item dc:subject ?subject .
  FILTER(REGEX(STR(?subject), "rose|jasmine", "i"))
  OPTIONAL { ?item dc:title ?title . }
  OPTIONAL { ?item edm:dataProvider ?provider . }
}
LIMIT 10`}
          className="font-mono text-xs min-h-[180px]"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Endpoint : <code className="font-mono">https://sparql.europeana.eu/</code>
          </p>
          <Button
            size="sm"
            onClick={handleRun}
            disabled={europeanaQueryMutation.isPending || !query.trim()}
            className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {europeanaQueryMutation.isPending
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Search className="h-3.5 w-3.5" />}
            Exécuter sur Europeana
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-red-800 dark:text-red-200">Erreur SPARQL Europeana</p>
            <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {results !== null && !error && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{results.length} résultat(s)</p>
            {vars.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {vars.map((v) => (
                  <Badge key={v} variant="outline" className="text-xs font-mono">?{v}</Badge>
                ))}
              </div>
            )}
          </div>
          {results.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    {vars.map((v) => (
                      <th key={v} className="px-3 py-2 text-left font-medium text-muted-foreground">?{v}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr key={i} className="border-t hover:bg-muted/30 transition-colors">
                      {vars.map((v) => (
                        <td key={v} className="px-3 py-2 max-w-[200px]">
                          {row[v] ? (
                            row[v].startsWith("http") ? (
                              <a href={row[v]} target="_blank" rel="noopener noreferrer"
                                className="text-violet-600 hover:underline truncate block" title={row[v]}>
                                {row[v].length > 40 ? `${row[v].slice(0, 40)}…` : row[v]}
                              </a>
                            ) : (
                              <span className="truncate block" title={row[v]}>{row[v]}</span>
                            )
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">Aucun résultat pour cette requête.</p>
          )}
        </div>
      )}
    </div>
  );
}
