import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen, Search, Link2, Zap, Database, FlaskConical, Leaf, MapPin,
  GitBranch, ExternalLink, Download, Plus, CheckCircle2,
  AlertCircle, RefreshCw, ChevronRight, Globe, BookMarked, Beaker, BookCopy
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// ─── Types locaux ─────────────────────────────────────────────────────────────
interface SearchResult {
  title: string;
  authors: string;
  year: number | null;
  journal: string | null;
  doi: string | null;
  pmid?: string | null;
  pdfUrl: string | null;
  citationsCount?: number;
  abstract: string | null;
  url: string | null;
  source: "crossref" | "openalex" | "semanticscholar" | "europepmc";
}

interface BibEntry {
  id: number;
  entryKey: string;
  title: string;
  authors?: string | null;
  year?: number | null;
  journal?: string | null;
  doi?: string | null;
  researchDomain?: string | null;
  relevanceScore?: number | null;
}

// ─── Badges source ────────────────────────────────────────────────────────────
const SOURCE_COLORS: Record<string, string> = {
  crossref: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  openalex: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  semanticscholar: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  europepmc: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};
const SOURCE_LABELS: Record<string, string> = {
  crossref: "CrossRef",
  openalex: "OpenAlex",
  semanticscholar: "Semantic Scholar",
  europepmc: "Europe PMC",
};

// ─── Composant carte résultat ─────────────────────────────────────────────────
function ResultCard({
  result,
  onImport,
  onEnrich,
  importing,
}: {
  result: SearchResult;
  onImport: (r: SearchResult) => void;
  onEnrich?: (r: SearchResult) => void;
  importing: boolean;
}) {
  return (
    <Card className="border border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm leading-snug line-clamp-2">{result.title}</p>
            {result.authors && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{result.authors}</p>
            )}
          </div>
          <Badge className={`text-xs shrink-0 ${SOURCE_COLORS[result.source] || ""}`}>
            {SOURCE_LABELS[result.source] || result.source}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {result.year && <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{result.year}</span>}
          {result.journal && <span className="truncate max-w-[200px]">{result.journal}</span>}
          {result.citationsCount != null && result.citationsCount > 0 && (
            <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />{result.citationsCount} citations</span>
          )}
          {result.doi && (
            <a href={`https://doi.org/${result.doi}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline">
              <ExternalLink className="w-3 h-3" />DOI
            </a>
          )}
          {result.pdfUrl && (
            <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-green-600 hover:underline">
              <Download className="w-3 h-3" />PDF
            </a>
          )}
        </div>
        {result.abstract && (
          <p className="text-xs text-muted-foreground line-clamp-2 border-t border-border/40 pt-2 mt-2">
            {result.abstract}
          </p>
        )}
        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="default" onClick={() => onImport(result)} disabled={importing}
            className="text-xs h-7">
            <Plus className="w-3 h-3 mr-1" />Importer dans PERFUMUM
          </Button>
          {onEnrich && (
            <Button size="sm" variant="outline" onClick={() => onEnrich(result)} disabled={importing}
              className="text-xs h-7">
              <Zap className="w-3 h-3 mr-1" />Enrichir une entrée
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Composant liaison entité ─────────────────────────────────────────────────
function LinkEntityPanel({ entryId, entryTitle }: { entryId: number; entryTitle: string }) {
  const { toast } = useToast();
  const [entityType, setEntityType] = useState<"molecule" | "plant" | "recette" | "terroir" | "axis" | "extraction">("molecule");
  const [entityId, setEntityId] = useState("");
  const [linkNotes, setLinkNotes] = useState("");
  const [linkScore, setLinkScore] = useState("75");

  const linkToMolecule = trpc.bibliography.linkToMolecule.useMutation();
  const linkToPlant = trpc.bibliography.linkToPlant.useMutation();
  const linkToRecette = trpc.bibliography.linkToRecette.useMutation();
  const linkToTerroir = trpc.bibliography.linkToTerroir.useMutation();
  const linkToAxis = trpc.bibliography.linkToAxis.useMutation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const linkToExtractionMethod = (trpc.bibliography as any).linkToExtractionMethod.useMutation();

  const handleLink = async () => {
    const id = parseInt(entityId);
    if (!id || isNaN(id)) { toast({ title: "ID invalide", variant: "destructive" }); return; }
    try {
      if (entityType === "molecule") await linkToMolecule.mutateAsync({ bibliographyId: entryId, moleculeId: id, notes: linkNotes, relevanceScore: parseInt(linkScore) });
      else if (entityType === "plant") await linkToPlant.mutateAsync({ bibliographyId: entryId, plantId: id, notes: linkNotes, relevanceScore: parseInt(linkScore) });
      else if (entityType === "recette") await linkToRecette.mutateAsync({ bibliographyId: entryId, recetteId: id, notes: linkNotes, relevanceScore: parseInt(linkScore) });
      else if (entityType === "terroir") await linkToTerroir.mutateAsync({ bibliographyId: entryId, terroirId: id, notes: linkNotes, relevanceScore: parseInt(linkScore) });
      else if (entityType === "axis") await linkToAxis.mutateAsync({ bibliographyId: entryId, axisId: id, notes: linkNotes });
      else if (entityType === "extraction") await linkToExtractionMethod.mutateAsync({ publicationId: entryId, extractionMethodId: id, notes: linkNotes });
      toast({ title: "Liaison créée", description: `Référence liée à ${entityType} #${id}` });
      setEntityId("");
      setLinkNotes("");
    } catch (e: unknown) {
      toast({ title: "Erreur", description: (e as Error).message, variant: "destructive" });
    }
  };

  const isLoading = linkToMolecule.isPending || linkToPlant.isPending || linkToRecette.isPending || linkToTerroir.isPending || linkToAxis.isPending || linkToExtractionMethod.isPending;

  return (
    <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border/40">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Lier à une entité PERFUMUM</p>
      <p className="text-xs text-foreground/70 line-clamp-1">Référence : <span className="font-medium">{entryTitle}</span></p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Type d'entité</Label>
          <Select value={entityType} onValueChange={(v) => setEntityType(v as typeof entityType)}>
            <SelectTrigger className="h-8 text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="molecule"><FlaskConical className="w-3 h-3 inline mr-1" />Molécule</SelectItem>
              <SelectItem value="plant"><Leaf className="w-3 h-3 inline mr-1" />Plante</SelectItem>
              <SelectItem value="recette"><BookMarked className="w-3 h-3 inline mr-1" />Recette</SelectItem>
              <SelectItem value="terroir"><MapPin className="w-3 h-3 inline mr-1" />Terroir</SelectItem>
              <SelectItem value="axis"><GitBranch className="w-3 h-3 inline mr-1" />Axe de recherche</SelectItem>
              <SelectItem value="extraction"><Beaker className="w-3 h-3 inline mr-1" />Procédé d'extraction</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">ID de l'entité</Label>
          <Input value={entityId} onChange={e => setEntityId(e.target.value)} placeholder="ex: 42" className="h-8 text-xs mt-1" type="number" />
        </div>
      </div>
      {entityType !== "axis" && (
        <div>
          <Label className="text-xs">Score de pertinence (0-100)</Label>
          <Input value={linkScore} onChange={e => setLinkScore(e.target.value)} placeholder="75" className="h-8 text-xs mt-1" type="number" min="0" max="100" />
        </div>
      )}
      <div>
        <Label className="text-xs">Notes (optionnel)</Label>
        <Input value={linkNotes} onChange={e => setLinkNotes(e.target.value)} placeholder="Contexte de la liaison..." className="h-8 text-xs mt-1" />
      </div>
      <Button size="sm" onClick={handleLink} disabled={isLoading || !entityId} className="w-full h-8 text-xs">
        <Link2 className="w-3 h-3 mr-1" />{isLoading ? "Liaison en cours..." : "Créer la liaison"}
      </Button>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function BibliographicEnrichment() {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  // ── États de recherche ──
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [doiQuery, setDoiQuery] = useState("");
  const [searchApi, setSearchApi] = useState<"openalex" | "semanticscholar" | "europepmc">("openalex");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [crossrefResult, setCrossrefResult] = useState<SearchResult | null>(null);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [showEnrichDialog, setShowEnrichDialog] = useState(false);
  const [enrichTarget, setEnrichTarget] = useState<SearchResult | null>(null);
  const [enrichEntryId, setEnrichEntryId] = useState("");
  const [showLinkPanel, setShowLinkPanel] = useState<{ id: number; title: string } | null>(null);
  const [llmBatchSize, setLlmBatchSize] = useState("5");
  const [llmOffset, setLlmOffset] = useState("0");

  // ── Onglet Recettes ──
  const [recetteSearchId, setRecetteSearchId] = useState("");
  const [recetteIdEnabled, setRecetteIdEnabled] = useState(false);
  const [recetteIdInput, setRecetteIdInput] = useState(0);
  const [linkRecetteId, setLinkRecetteId] = useState("");
  const [linkRecetteBibId, setLinkRecetteBibId] = useState("");
  const [linkRecetteNotes, setLinkRecetteNotes] = useState("");
  const [linkRecetteScore, setLinkRecetteScore] = useState("75");

  const { data: recetteBibRefs, isFetching: recetteFetching, refetch: refetchRecetteRefs } =
    trpc.bibliography.getByRecette.useQuery(
      { recetteId: recetteIdInput },
      { enabled: recetteIdEnabled && recetteIdInput > 0, retry: false }
    );
  const linkToRecetteMutation = trpc.bibliography.linkToRecette.useMutation();

  const handleRecetteSearch = () => {
    const id = parseInt(recetteSearchId);
    if (!id || isNaN(id)) return;
    setRecetteIdInput(id);
    setRecetteIdEnabled(true);
  };

  const handleLinkToRecette = async () => {
    const recId = parseInt(linkRecetteId);
    const bibId = parseInt(linkRecetteBibId);
    if (!recId || !bibId) { toast({ title: "IDs invalides", variant: "destructive" }); return; }
    try {
      await linkToRecetteMutation.mutateAsync({
        bibliographyId: bibId,
        recetteId: recId,
        notes: linkRecetteNotes,
        relevanceScore: parseInt(linkRecetteScore),
      });
      toast({ title: "Liaison créée", description: `Référence #${bibId} liée à la recette #${recId}` });
      setLinkRecetteId("");
      setLinkRecetteBibId("");
      setLinkRecetteNotes("");
      if (recetteIdInput === recId) refetchRecetteRefs();
    } catch (e: unknown) {
      toast({ title: "Erreur", description: (e as Error).message, variant: "destructive" });
    }
  };

  // ── Queries conditionnelles ──
  const [doiEnabled, setDoiEnabled] = useState(false);
  const [titleEnabled, setTitleEnabled] = useState(false);
  const [ssEnabled, setSsEnabled] = useState(false);
  const [epEnabled, setEpEnabled] = useState(false);
  const [doiInput, setDoiInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [ssInput, setSsInput] = useState("");
  const [epInput, setEpInput] = useState("");

  const { data: bibStats } = trpc.bibliography.getStats.useQuery();
  const { data: linkStats } = trpc.bibliography.getLinkStats.useQuery();
  const { data: bibList, refetch: refetchBibList } = trpc.bibliography.list.useQuery({ limit: 20, hasLinks: false });

  const createBib = trpc.bibliography.create.useMutation();
  const applyEnrichment = trpc.bibliography.applyEnrichment.useMutation();
  const autoLinkLLM = trpc.bibliography.autoLinkByLLM.useMutation();

  const { data: crossrefData, isFetching: crossrefFetching } = trpc.bibliography.enrichFromDOI.useQuery(
    { doi: doiInput }, { enabled: doiEnabled && !!doiInput, retry: false }
  );
  const { data: openalexData, isFetching: openalexFetching } = trpc.bibliography.enrichFromTitle.useQuery(
    { title: titleInput }, { enabled: titleEnabled && !!titleInput, retry: false }
  );
  const { data: ssData, isFetching: ssFetching } = trpc.bibliography.searchSemanticScholar.useQuery(
    { query: ssInput, limit: 8 }, { enabled: ssEnabled && !!ssInput, retry: false }
  );
  const { data: epData, isFetching: epFetching } = trpc.bibliography.searchEuropePMC.useQuery(
    { query: epInput, limit: 8 }, { enabled: epEnabled && !!epInput, retry: false }
  );

  // Synchroniser les résultats
  useMemo(() => { if (crossrefData) setCrossrefResult(crossrefData as SearchResult); }, [crossrefData]);
  useMemo(() => { if (openalexData) setSearchResults((openalexData as SearchResult[]) || []); }, [openalexData]);
  useMemo(() => { if (ssData) setSearchResults((ssData as SearchResult[]) || []); }, [ssData]);
  useMemo(() => { if (epData) setSearchResults((epData as SearchResult[]) || []); }, [epData]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setSearchResults([]);
    if (searchApi === "openalex") { setTitleInput(searchQuery); setTitleEnabled(true); }
    else if (searchApi === "semanticscholar") { setSsInput(searchQuery); setSsEnabled(true); }
    else if (searchApi === "europepmc") { setEpInput(searchQuery); setEpEnabled(true); }
  };

  const handleDOISearch = () => {
    if (!doiQuery.trim()) return;
    setDoiInput(doiQuery);
    setDoiEnabled(true);
    setCrossrefResult(null);
  };

  const handleImport = async (result: SearchResult) => {
    const key = result.doi || result.pmid || `import_${Date.now()}`;
    setImportingId(key);
    try {
      const entryKey = result.doi
        ? `doi_${result.doi.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 80)}`
        : result.pmid ? `pmid_${result.pmid}`
        : `import_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const created = await createBib.mutateAsync({
        entryKey, entryType: "article", title: result.title,
        authors: result.authors || undefined, year: result.year || undefined,
        journal: result.journal || undefined, doi: result.doi || undefined,
        url: result.pdfUrl || result.url || undefined, abstract: result.abstract || undefined,
        tags: [result.source, "auto-import"], readStatus: "unread",
      });
      toast({ title: "Référence importée", description: `"${result.title.slice(0, 50)}..." ajoutée à la bibliothèque` });
      setShowLinkPanel({ id: (created as { id: number }).id, title: result.title });
      utils.bibliography.list.invalidate();
      utils.bibliography.getStats.invalidate();
    } catch (e: unknown) {
      toast({ title: "Erreur d'import", description: (e as Error).message, variant: "destructive" });
    } finally { setImportingId(null); }
  };

  const handleEnrich = (result: SearchResult) => { setEnrichTarget(result); setShowEnrichDialog(true); };

  const handleApplyEnrichment = async () => {
    if (!enrichTarget || !enrichEntryId) return;
    const id = parseInt(enrichEntryId);
    if (isNaN(id)) { toast({ title: "ID invalide", variant: "destructive" }); return; }
    try {
      await applyEnrichment.mutateAsync({
        id, title: enrichTarget.title, authors: enrichTarget.authors,
        year: enrichTarget.year, journal: enrichTarget.journal, doi: enrichTarget.doi,
        url: enrichTarget.url, pdfUrl: enrichTarget.pdfUrl, abstract: enrichTarget.abstract,
        citationsCount: enrichTarget.citationsCount,
        source: enrichTarget.source === "crossref" || enrichTarget.source === "openalex" ? enrichTarget.source : "openalex",
      });
      toast({ title: "Enrichissement appliqué", description: `Entrée #${id} mise à jour` });
      setShowEnrichDialog(false); setEnrichEntryId("");
      utils.bibliography.list.invalidate();
    } catch (e: unknown) {
      toast({ title: "Erreur", description: (e as Error).message, variant: "destructive" });
    }
  };

  const handleAutoLink = async () => {
    try {
      const result = await autoLinkLLM.mutateAsync({ batchSize: parseInt(llmBatchSize) || 5, offset: parseInt(llmOffset) || 0 });
      toast({ title: "Auto-liaison terminée", description: `${result.processed} références traitées, ${result.linked} liaisons créées` });
      utils.bibliography.getLinkStats.invalidate();
    } catch (e: unknown) {
      toast({ title: "Erreur LLM", description: (e as Error).message, variant: "destructive" });
    }
  };

  const isFetching = crossrefFetching || openalexFetching || ssFetching || epFetching;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-8 max-w-6xl">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Enrichissement Bibliographique</h1>
              <p className="text-sm text-muted-foreground">CrossRef · OpenAlex · Semantic Scholar · Europe PMC — Base interconnectée PERFUMUM</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Références totales", value: (bibStats as { total?: number } | undefined)?.total ?? "—", icon: <Database className="w-4 h-4" />, color: "text-blue-500" },
              { label: "Liaisons molécules", value: (linkStats as { byType?: Record<string, number> } | undefined)?.byType?.molecule ?? 0, icon: <FlaskConical className="w-4 h-4" />, color: "text-purple-500" },
              { label: "Liaisons plantes", value: (linkStats as { byType?: Record<string, number> } | undefined)?.byType?.plant ?? 0, icon: <Leaf className="w-4 h-4" />, color: "text-green-500" },
              { label: "Liaisons totales", value: (linkStats as { total?: number } | undefined)?.total ?? 0, icon: <Link2 className="w-4 h-4" />, color: "text-orange-500" },
            ].map(stat => (
              <Card key={stat.label} className="border-border/40">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
                  <div>
                    <p className="text-lg font-bold leading-none">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="search" className="text-xs"><Search className="w-3 h-3 mr-1" />Recherche</TabsTrigger>
            <TabsTrigger value="doi" className="text-xs"><Globe className="w-3 h-3 mr-1" />DOI / CrossRef</TabsTrigger>
            <TabsTrigger value="recettes" className="text-xs"><BookCopy className="w-3 h-3 mr-1" />Recettes</TabsTrigger>
            <TabsTrigger value="autolink" className="text-xs"><Zap className="w-3 h-3 mr-1" />Auto-liaison LLM</TabsTrigger>
            <TabsTrigger value="unlinked" className="text-xs"><AlertCircle className="w-3 h-3 mr-1" />Sans liaisons</TabsTrigger>
          </TabsList>

          {/* ── Recherche multi-API ── */}
          <TabsContent value="search" className="space-y-4">
            <Card className="border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />Recherche par titre / mots-clés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                    placeholder="ex: linalool olfactory perception, rose essential oil GC-MS..."
                    className="h-9 flex-1" />
                  <Select value={searchApi} onValueChange={(v) => setSearchApi(v as typeof searchApi)}>
                    <SelectTrigger className="w-44 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openalex">OpenAlex</SelectItem>
                      <SelectItem value="semanticscholar">Semantic Scholar</SelectItem>
                      <SelectItem value="europepmc">Europe PMC</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSearch} disabled={isFetching || !searchQuery.trim()} className="h-9 px-4">
                    {isFetching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["linalool olfactory", "rose essential oil", "terpene extraction", "cannabis terpene profile", "tobacco aroma molecules"].map(s => (
                    <button key={s} onClick={() => setSearchQuery(s)}
                      className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground border border-border/40 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{searchResults.length} résultat{searchResults.length > 1 ? "s" : ""} — {SOURCE_LABELS[searchApi]}</p>
                  <Badge variant="outline" className="text-xs">{searchApi}</Badge>
                </div>
                <div className="grid gap-3">
                  {searchResults.map((r, i) => (
                    <ResultCard key={i} result={r} onImport={handleImport} onEnrich={handleEnrich}
                      importing={importingId === (r.doi || r.pmid || String(i))} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── DOI / CrossRef ── */}
          <TabsContent value="doi" className="space-y-4">
            <Card className="border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />Recherche par DOI (CrossRef)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input value={doiQuery} onChange={e => setDoiQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleDOISearch()}
                    placeholder="ex: 10.1021/acs.jnatprod.0c00890"
                    className="h-9 flex-1 font-mono text-sm" />
                  <Button onClick={handleDOISearch} disabled={crossrefFetching || !doiQuery.trim()} className="h-9 px-4">
                    {crossrefFetching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Collez un DOI complet ou une URL doi.org pour récupérer les métadonnées via CrossRef.</p>
              </CardContent>
            </Card>
            {crossrefResult && (
              <div className="space-y-3">
                <p className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />Résultat CrossRef
                </p>
                <ResultCard result={crossrefResult} onImport={handleImport} onEnrich={handleEnrich}
                  importing={importingId === (crossrefResult.doi || "")} />
              </div>
            )}
          </TabsContent>

          {/* ── Recettes ── */}
          <TabsContent value="recettes" className="space-y-4">
            {/* Recherche par ID recette */}
            <Card className="border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookCopy className="w-4 h-4 text-primary" />Références liées à une recette
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Entrez l'ID d'une recette PERFUMUM pour voir toutes les publications scientifiques qui lui sont associées.</p>
                <div className="flex gap-2">
                  <Input value={recetteSearchId} onChange={e => setRecetteSearchId(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleRecetteSearch()}
                    placeholder="ID de la recette (ex: 42)" type="number" className="h-9 flex-1" />
                  <Button onClick={handleRecetteSearch} disabled={recetteFetching || !recetteSearchId.trim()} className="h-9 px-4">
                    {recetteFetching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
                {recetteIdEnabled && !recetteFetching && (
                  <div className="space-y-2 mt-2">
                    {!recetteBibRefs || (recetteBibRefs as Record<string, unknown>[]).length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <BookOpen className="w-7 h-7 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">Aucune référence liée à la recette #{recetteIdInput}</p>
                      </div>
                    ) : (
                      (recetteBibRefs as Record<string, unknown>[]).map((ref, i) => {
                        const refTitle = String(ref.title ?? "");
                        const refAuthors = ref.authors ? String(ref.authors) : null;
                        const refYear = ref.year ? Number(ref.year) : null;
                        const refJournal = ref.journal ? String(ref.journal) : null;
                        const refDoi = ref.doi ? String(ref.doi) : null;
                        const refId = Number(ref.id ?? 0);
                        return (
                        <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">{refTitle}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {refAuthors && <span className="text-xs text-muted-foreground line-clamp-1">{refAuthors}</span>}
                              {refYear && <Badge variant="outline" className="text-xs h-4 px-1">{refYear}</Badge>}
                              {refJournal && <Badge variant="secondary" className="text-xs h-4 px-1 max-w-24 truncate">{refJournal}</Badge>}
                            </div>
                            {refDoi && (
                              <a href={`https://doi.org/${refDoi}`} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                                <ExternalLink className="w-3 h-3" />{refDoi}
                              </a>
                            )}
                          </div>
                          <Button size="sm" variant="outline" className="h-7 text-xs shrink-0"
                            onClick={() => setShowLinkPanel({ id: refId, title: refTitle })}>
                            <Link2 className="w-3 h-3 mr-1" />Lier
                          </Button>
                        </div>
                        );
                      })
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Créer une nouvelle liaison recette ↔ référence */}
            <Card className="border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" />Créer une liaison Recette ↔ Référence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">ID de la recette</Label>
                    <Input value={linkRecetteId} onChange={e => setLinkRecetteId(e.target.value)}
                      placeholder="ex: 42" type="number" className="h-8 text-xs mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">ID de la référence bibliographique</Label>
                    <Input value={linkRecetteBibId} onChange={e => setLinkRecetteBibId(e.target.value)}
                      placeholder="ex: 17" type="number" className="h-8 text-xs mt-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Score de pertinence (0-100)</Label>
                  <Input value={linkRecetteScore} onChange={e => setLinkRecetteScore(e.target.value)}
                    type="number" min="0" max="100" className="h-8 text-xs mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Notes (optionnel)</Label>
                  <Input value={linkRecetteNotes} onChange={e => setLinkRecetteNotes(e.target.value)}
                    placeholder="Contexte de la liaison..." className="h-8 text-xs mt-1" />
                </div>
                <Button size="sm" onClick={handleLinkToRecette}
                  disabled={linkToRecetteMutation.isPending || !linkRecetteId || !linkRecetteBibId}
                  className="w-full h-8 text-xs">
                  <Link2 className="w-3 h-3 mr-1" />
                  {linkToRecetteMutation.isPending ? "Liaison en cours..." : "Créer la liaison Recette ↔ Référence"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Auto-liaison LLM ── */}
          <TabsContent value="autolink" className="space-y-4">
            <Card className="border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />Auto-liaison intelligente par LLM
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Le moteur LLM analyse les titres et abstracts des références non liées et identifie automatiquement les plantes et molécules PERFUMUM correspondantes.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Taille du batch (1-20)</Label>
                    <Input value={llmBatchSize} onChange={e => setLlmBatchSize(e.target.value)} type="number" min="1" max="20" className="h-8 text-xs mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Offset (pagination)</Label>
                    <Input value={llmOffset} onChange={e => setLlmOffset(e.target.value)} type="number" min="0" className="h-8 text-xs mt-1" />
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg p-3">
                  <p className="text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    Chaque appel LLM consomme des crédits. Commencez avec un batch de 5 pour valider la qualité des liaisons.
                  </p>
                </div>
                <Button onClick={handleAutoLink} disabled={autoLinkLLM.isPending} className="w-full">
                  {autoLinkLLM.isPending ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Analyse en cours...</> : <><Zap className="w-4 h-4 mr-2" />Lancer l'auto-liaison LLM</>}
                </Button>
                {autoLinkLLM.data && (
                  <div className="bg-muted/40 rounded-lg p-3 space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {(autoLinkLLM.data as { processed: number; linked: number }).processed} références traitées · {(autoLinkLLM.data as { processed: number; linked: number }).linked} liaisons créées
                    </p>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {((autoLinkLLM.data as { results?: Array<{ id: number; title?: string; plants?: string[]; molecules?: string[]; linked?: number; error?: string }> }).results || []).map((r, i) => (
                        <div key={i} className="text-xs flex items-start gap-2 py-1 border-b border-border/30 last:border-0">
                          <ChevronRight className="w-3 h-3 mt-0.5 text-muted-foreground shrink-0" />
                          <div>
                            <span className="font-medium">{r.title}</span>
                            {r.error ? <span className="text-red-500 ml-1">— {r.error}</span> : (
                              <span className="text-muted-foreground ml-1">
                                {r.plants?.length ? `🌿 ${r.plants.join(", ")} ` : ""}
                                {r.molecules?.length ? `⚗️ ${r.molecules.join(", ")} ` : ""}
                                ({r.linked} liaisons)
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Sans liaisons ── */}
          <TabsContent value="unlinked" className="space-y-4">
            <Card className="border-border/40">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />Références sans liaisons PERFUMUM
                </CardTitle>
                <Button size="sm" variant="outline" onClick={() => refetchBibList()} className="h-7 text-xs">
                  <RefreshCw className="w-3 h-3 mr-1" />Actualiser
                </Button>
              </CardHeader>
              <CardContent>
                {!bibList || (bibList as { entries?: BibEntry[] }).entries?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm">Toutes les références sont liées !</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {((bibList as { entries?: BibEntry[] }).entries || []).map((entry) => (
                      <div key={entry.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{entry.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {entry.authors && <span className="text-xs text-muted-foreground line-clamp-1">{entry.authors}</span>}
                            {entry.year && <Badge variant="outline" className="text-xs h-4 px-1">{entry.year}</Badge>}
                            {entry.researchDomain && <Badge variant="secondary" className="text-xs h-4 px-1">{entry.researchDomain}</Badge>}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-xs shrink-0"
                          onClick={() => setShowLinkPanel({ id: entry.id, title: entry.title })}>
                          <Link2 className="w-3 h-3 mr-1" />Lier
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            {showLinkPanel && <LinkEntityPanel entryId={showLinkPanel.id} entryTitle={showLinkPanel.title} />}
          </TabsContent>
        </Tabs>

        {/* Dialog enrichissement */}
        <Dialog open={showEnrichDialog} onOpenChange={setShowEnrichDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />Enrichir une entrée existante
              </DialogTitle>
            </DialogHeader>
            {enrichTarget && (
              <div className="space-y-3">
                <div className="p-3 bg-muted/40 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Source sélectionnée</p>
                  <p className="text-sm font-medium line-clamp-2">{enrichTarget.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{enrichTarget.authors} · {enrichTarget.year}</p>
                </div>
                <div>
                  <Label className="text-sm">ID de l'entrée à enrichir</Label>
                  <Input value={enrichEntryId} onChange={e => setEnrichEntryId(e.target.value)}
                    placeholder="ID numérique de la référence PERFUMUM" type="number" className="mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">Trouvez l'ID dans l'onglet "Sans liaisons" ou la page Bibliothèque.</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEnrichDialog(false)}>Annuler</Button>
              <Button onClick={handleApplyEnrichment} disabled={applyEnrichment.isPending || !enrichEntryId}>
                {applyEnrichment.isPending ? "Application..." : "Appliquer l'enrichissement"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Panel liaison flottant (après import) */}
        {showLinkPanel && activeTab !== "unlinked" && (
          <div className="fixed bottom-6 right-6 w-80 z-50 shadow-2xl rounded-xl border border-border bg-background">
            <div className="flex items-center justify-between p-3 border-b border-border/40">
              <p className="text-sm font-medium flex items-center gap-2">
                <Link2 className="w-4 h-4 text-primary" />Lier la référence importée
              </p>
              <button onClick={() => setShowLinkPanel(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
            </div>
            <div className="p-3">
              <LinkEntityPanel entryId={showLinkPanel.id} entryTitle={showLinkPanel.title} />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
