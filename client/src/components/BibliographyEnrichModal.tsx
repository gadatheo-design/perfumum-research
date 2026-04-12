import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, BookOpen, ExternalLink, CheckCircle2, AlertCircle, FileText, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnrichedData {
  title: string;
  authors: string;
  year: number | null;
  journal: string | null;
  publisher?: string | null;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  doi: string | null;
  issn?: string | null;
  abstract?: string | null;
  url: string | null;
  pdfUrl?: string | null;
  citationsCount?: number;
  source: "crossref" | "openalex";
}

interface BibliographyEnrichModalProps {
  open: boolean;
  onClose: () => void;
  /** ID de la référence bibliographique à enrichir (si fourni, sauvegarde directement en base) */
  entryId?: number;
  /** Données pré-remplies depuis la fiche existante */
  initialDoi?: string | null;
  initialTitle?: string;
  /** Callback après application (pour rafraîchir l'UI parente) */
  onApply?: (data: Partial<EnrichedData>) => void;
}

export function BibliographyEnrichModal({
  open,
  onClose,
  entryId,
  initialDoi,
  initialTitle,
  onApply,
}: BibliographyEnrichModalProps) {
  const { toast } = useToast();
  const [doi, setDoi] = useState(initialDoi ?? "");
  const [title, setTitle] = useState(initialTitle ?? "");
  const [tab, setTab] = useState<"doi" | "title">(initialDoi ? "doi" : "title");
  const [crossrefResult, setCrossrefResult] = useState<EnrichedData | null>(null);
  const [openAlexResults, setOpenAlexResults] = useState<EnrichedData[]>([]);
  const [selectedResult, setSelectedResult] = useState<EnrichedData | null>(null);
  const [isSearchingCrossref, setIsSearchingCrossref] = useState(false);
  const [isSearchingOpenAlex, setIsSearchingOpenAlex] = useState(false);
  const [crossrefError, setCrossrefError] = useState<string | null>(null);
  const [openAlexError, setOpenAlexError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const utils = trpc.useUtils();

  const applyEnrichmentMutation = trpc.bibliography.applyEnrichment.useMutation({
    onSuccess: () => {
      utils.bibliography.list.invalidate();
      utils.bibliography.getById.invalidate();
    },
  });

  const searchCrossref = async () => {
    if (!doi.trim()) return;
    setIsSearchingCrossref(true);
    setCrossrefError(null);
    setCrossrefResult(null);
    setSelectedResult(null);
    try {
      const result = await utils.bibliography.enrichFromDOI.fetch({ doi: doi.trim() });
      setCrossrefResult(result as EnrichedData);
      setSelectedResult(result as EnrichedData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setCrossrefError(msg);
      toast({ title: "CrossRef introuvable", description: msg, variant: "destructive" });
    } finally {
      setIsSearchingCrossref(false);
    }
  };

  const searchOpenAlex = async () => {
    const q = tab === "doi" ? doi.trim() : title.trim();
    if (!q) return;
    setIsSearchingOpenAlex(true);
    setOpenAlexError(null);
    setOpenAlexResults([]);
    setSelectedResult(null);
    try {
      const results = await utils.bibliography.enrichFromTitle.fetch(
        tab === "doi" ? { title: "", doi: doi.trim() } : { title: title.trim() }
      );
      setOpenAlexResults((results as EnrichedData[]) || []);
      if (results && results.length > 0) setSelectedResult(results[0] as EnrichedData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setOpenAlexError(msg);
      toast({ title: "OpenAlex introuvable", description: msg, variant: "destructive" });
    } finally {
      setIsSearchingOpenAlex(false);
    }
  };

  const handleApply = async () => {
    if (!selectedResult) return;

    // Si un entryId est fourni → sauvegarder directement en base
    if (entryId) {
      setIsSaving(true);
      try {
        await applyEnrichmentMutation.mutateAsync({
          id: entryId,
          title: selectedResult.title,
          authors: selectedResult.authors,
          year: selectedResult.year,
          journal: selectedResult.journal,
          doi: selectedResult.doi,
          url: selectedResult.url,
          pdfUrl: selectedResult.pdfUrl,
          abstract: selectedResult.abstract,
          citationsCount: selectedResult.citationsCount,
          publisher: selectedResult.publisher,
          volume: selectedResult.volume,
          issue: selectedResult.issue,
          pages: selectedResult.pages,
          source: selectedResult.source,
        });
        toast({
          title: "Référence enrichie",
          description: `Métadonnées sauvegardées depuis ${selectedResult.source === "crossref" ? "CrossRef" : "OpenAlex"}`,
        });
        onApply?.(selectedResult);
        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur inconnue";
        toast({ title: "Erreur de sauvegarde", description: msg, variant: "destructive" });
      } finally {
        setIsSaving(false);
      }
    } else {
      // Mode sans entryId : retourner les données au parent pour qu'il les applique
      onApply?.(selectedResult);
      onClose();
      toast({ title: "Données transmises", description: `Métadonnées importées depuis ${selectedResult.source === "crossref" ? "CrossRef" : "OpenAlex"}` });
    }
  };

  const ResultCard = ({ result, isSelected, onClick }: { result: EnrichedData; isSelected: boolean; onClick: () => void }) => (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all ${isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm line-clamp-2">{result.title}</p>
          {result.authors && (
            <p className="text-xs text-muted-foreground mt-1 truncate">{result.authors.split(" and ")[0]}{result.authors.includes(" and ") ? " et al." : ""}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {result.year && <Badge variant="outline" className="text-xs">{result.year}</Badge>}
            {result.journal && <Badge variant="secondary" className="text-xs truncate max-w-[160px]">{result.journal}</Badge>}
            {result.doi && <Badge variant="outline" className="text-xs font-mono">DOI</Badge>}
            {result.pdfUrl && <Badge className="text-xs bg-green-600 text-white">PDF OA</Badge>}
            {result.citationsCount !== undefined && result.citationsCount > 0 && (
              <Badge variant="outline" className="text-xs">{result.citationsCount} citations</Badge>
            )}
          </div>
        </div>
        {isSelected && <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />}
      </div>
      {result.abstract && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2 italic">{result.abstract}</p>
      )}
      <div className="flex items-center gap-2 mt-2">
        {result.url && (
          <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline" onClick={e => e.stopPropagation()}>
            <ExternalLink className="w-3 h-3" /> Voir
          </a>
        )}
        {result.pdfUrl && (
          <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 flex items-center gap-1 hover:underline" onClick={e => e.stopPropagation()}>
            <FileText className="w-3 h-3" /> PDF gratuit
          </a>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Enrichissement bibliographique automatique
          </DialogTitle>
          <DialogDescription>
            Recherchez les métadonnées via CrossRef (par DOI) ou OpenAlex (par titre ou DOI).
            {entryId && <span className="text-primary font-medium"> Les données seront sauvegardées directement en base.</span>}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={v => setTab(v as "doi" | "title")}>
          <TabsList className="w-full">
            <TabsTrigger value="doi" className="flex-1">Par DOI</TabsTrigger>
            <TabsTrigger value="title" className="flex-1">Par titre</TabsTrigger>
          </TabsList>

          <TabsContent value="doi" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="doi-input">DOI (ex: 10.1021/acs.jnatprod.1c00123)</Label>
              <div className="flex gap-2">
                <Input
                  id="doi-input"
                  placeholder="10.xxxx/..."
                  value={doi}
                  onChange={e => setDoi(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && searchCrossref()}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={searchCrossref} disabled={!doi.trim() || isSearchingCrossref} className="flex-1">
                {isSearchingCrossref ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                CrossRef
              </Button>
              <Button variant="outline" onClick={searchOpenAlex} disabled={!doi.trim() || isSearchingOpenAlex} className="flex-1">
                {isSearchingOpenAlex ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                OpenAlex
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="title" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title-input">Titre de l'article ou de l'ouvrage</Label>
              <Input
                id="title-input"
                placeholder="Essential oil composition of..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && searchOpenAlex()}
              />
            </div>
            <Button onClick={searchOpenAlex} disabled={!title.trim() || isSearchingOpenAlex} className="w-full">
              {isSearchingOpenAlex ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Rechercher via OpenAlex
            </Button>
          </TabsContent>
        </Tabs>

        {/* Résultats CrossRef */}
        {crossrefError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{crossrefError}</span>
          </div>
        )}
        {crossrefResult && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Résultat CrossRef</p>
            <ResultCard result={crossrefResult} isSelected={selectedResult === crossrefResult} onClick={() => setSelectedResult(crossrefResult)} />
          </div>
        )}

        {/* Résultats OpenAlex */}
        {openAlexError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{openAlexError}</span>
          </div>
        )}
        {openAlexResults.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Résultats OpenAlex ({openAlexResults.length})</p>
            <div className="space-y-2">
              {openAlexResults.map((r, i) => (
                <ResultCard key={i} result={r} isSelected={selectedResult === r} onClick={() => setSelectedResult(r)} />
              ))}
            </div>
          </div>
        )}

        {/* Bouton d'application */}
        {selectedResult && (
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>Annuler</Button>
            <Button onClick={handleApply} disabled={isSaving} className="gap-2">
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : entryId ? (
                <Save className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {entryId ? "Sauvegarder en base" : "Appliquer ces métadonnées"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
