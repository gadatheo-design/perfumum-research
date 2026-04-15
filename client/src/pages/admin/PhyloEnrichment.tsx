import React from "react";
import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import type {
  PhyloBatchPlantResult,
  GbifSpeciesResult,
  PowoSearchResult,
  NcbiLineageItem,
  TropicosSearchResult,
  PhyloBatchGenus,
} from "../../../../shared/domain-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Database, Dna, Globe, Leaf, FlaskConical,
  ExternalLink, RefreshCw, CheckCircle2, XCircle,
  ChevronRight, Network, TreePine, Microscope, BookOpen,
  AlertTriangle, Info, Loader2, ArrowRight
} from "lucide-react";
import { Link } from "wouter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiStatusBadge {
  label: string;
  status: "online" | "offline" | "unknown";
  color: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ status }: { status: "online" | "offline" | "unknown" }) {
  const colors = {
    online: "bg-emerald-400",
    offline: "bg-red-400",
    unknown: "bg-zinc-400",
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${colors[status]} animate-pulse`} />
  );
}

function IdentifierBadge({ label, value, href }: { label: string; value: string | null; href?: string | null }) {
  if (!value) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-500">
      {label}: —
    </span>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-violet-900/40 text-violet-300 hover:bg-violet-900/70 transition-colors">
      {label}: {value} <ExternalLink className="w-2.5 h-2.5" />
    </a>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-300">
      {label}: {value}
    </span>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="p-2 rounded-lg bg-violet-900/30 border border-violet-800/30">
        <Icon className="w-4 h-4 text-violet-400" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Tab: Profil Wikidata Phylo ───────────────────────────────────────────────

type ChildTaxon = { qid: string; name: string; rank: string; rankName: string; wikidataUrl: string };
type ImportStatus = 'idle' | 'pending' | 'created' | 'skipped' | 'error';

function WikidataPhyloTab({ scientificName }: { scientificName: string }) {
  const { toast } = useToast();
  const { data, isLoading, error } = trpc.wikidataPhylo.getFullPhyloProfile.useQuery(
    { scientificName },
    { enabled: scientificName.length > 2, retry: 1 }
  );
  const { data: childData, isLoading: childLoading } = trpc.wikidataPhylo.getChildTaxa.useQuery(
    { scientificName, limit: 50 },
    { enabled: scientificName.length > 2, retry: 1 }
  );
  const { data: hybridData } = trpc.wikidataPhylo.getHybridParents.useQuery(
    { scientificName },
    { enabled: scientificName.length > 2, retry: 1 }
  );
  const { data: chromoData } = trpc.wikidataPhylo.getChromosomeData.useQuery(
    { scientificName },
    { enabled: scientificName.length > 2, retry: 1 }
  );

  const [importStatuses, setImportStatuses] = useState<Record<string, ImportStatus>>({});
  const [importMessages, setImportMessages] = useState<Record<string, string>>({});
  const [isImportingAll, setIsImportingAll] = useState(false);

  const importMutation = trpc.wikidataPhylo.importChildTaxaToPlants.useMutation({
    onSuccess: (result) => {
      const newStatuses: Record<string, ImportStatus> = {};
      const newMessages: Record<string, string> = {};
      for (const r of result.results) {
        newStatuses[r.wikidataId] = r.status;
        if (r.message) newMessages[r.wikidataId] = r.message;
      }
      setImportStatuses((prev) => ({ ...prev, ...newStatuses }));
      setImportMessages((prev) => ({ ...prev, ...newMessages }));
      toast({
        title: 'Import terminé',
        description: `${result.created} créé(s), ${result.skipped} déjà présent(s)${result.errors.length > 0 ? `, ${result.errors.length} erreur(s)` : ''}`,
        variant: result.errors.length > 0 ? 'destructive' : 'default',
      });
      setIsImportingAll(false);
    },
    onError: (err) => {
      toast({ title: 'Erreur import', description: err.message, variant: 'destructive' });
      setIsImportingAll(false);
    },
  });

  const handleImportOne = (child: ChildTaxon) => {
    const nameParts = child.name.trim().split(/\s+/);
    setImportStatuses((prev) => ({ ...prev, [child.qid]: 'pending' }));
    importMutation.mutate({ taxa: [{ wikidataId: child.qid, scientificName: child.name, genus: nameParts[0], species: nameParts[1], rankName: child.rankName }] });
  };

  const handleImportAll = () => {
    if (!childData?.children?.length) return;
    setIsImportingAll(true);
    const taxa = (childData.children as ChildTaxon[])
      .filter((c) => importStatuses[c.qid] !== 'created')
      .map((c) => { const p = c.name.trim().split(/\s+/); return { wikidataId: c.qid, scientificName: c.name, genus: p[0], species: p[1], rankName: c.rankName }; });
    if (!taxa.length) { setIsImportingAll(false); return; }
    importMutation.mutate({ taxa });
  };

  if (isLoading) return <div className="flex items-center gap-2 text-zinc-400 py-8"><Loader2 className="w-4 h-4 animate-spin" /> Interrogation de Wikidata...</div>;
  if (error || !data?.found) return <div className="text-zinc-500 py-8 text-sm">Aucun résultat Wikidata pour <em>{scientificName}</em>.</div>;

  const p = data.profile!

  return (
    <div className="space-y-6">
      {/* Header taxon */}
      <div className="p-4 rounded-xl border border-violet-800/30 bg-violet-950/20">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-violet-400 uppercase tracking-widest mb-1">Wikidata</p>
            <h3 className="text-lg font-semibold text-zinc-100 italic">{p.name}</h3>
            {p.rank && <Badge variant="outline" className="mt-1 text-xs border-violet-700 text-violet-300">{p.rank}</Badge>}
          </div>
          <a href={p.wikidataUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-200 transition-colors">
            {p.qid} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        {p.image && (
          <img src={p.image} alt={p.name} className="mt-3 h-32 w-auto rounded-lg object-cover opacity-80" />
        )}
      </div>

      {/* Identifiants croisés */}
      <div>
        <SectionTitle icon={Database} title="Identifiants croisés" subtitle="Liens vers les bases de données externes" />
        <div className="flex flex-wrap gap-2">
          <IdentifierBadge label="Wikidata" value={p.identifiers.wikidata} href={p.wikidataUrl} />
          <IdentifierBadge label="NCBI" value={p.identifiers.ncbi} href={p.identifiers.ncbi ? `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${p.identifiers.ncbi}` : null} />
          <IdentifierBadge label="GBIF" value={p.identifiers.gbif} href={p.identifiers.gbif ? `https://www.gbif.org/species/${p.identifiers.gbif}` : null} />
          <IdentifierBadge label="POWO" value={p.identifiers.powo} href={p.identifiers.powo ? `https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:${p.identifiers.powo}` : null} />
          <IdentifierBadge label="Tropicos" value={p.identifiers.tropicos} href={p.identifiers.tropicos ? `https://www.tropicos.org/name/${p.identifiers.tropicos}` : null} />
        </div>
      </div>

      {/* Phylogénie */}
      {p.parent?.name && (
        <div>
          <SectionTitle icon={Network} title="Taxon parent" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-400">Parent :</span>
            <span className="text-zinc-200 italic">{p.parent.scientificName ?? p.parent.name}</span>
            {p.parent.qid && (
              <a href={`https://www.wikidata.org/wiki/${p.parent.qid}`} target="_blank" rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-200">
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Chromosomes */}
      {chromoData?.found && (
        <div>
          <SectionTitle icon={Dna} title="Données chromosomiques" />
          <div className="flex gap-4 text-sm">
            {chromoData.chromosomeCount && (
              <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-center">
                <p className="text-2xl font-bold text-violet-300">{chromoData.chromosomeCount}</p>
                <p className="text-xs text-zinc-500 mt-1">Chromosomes (2n)</p>
              </div>
            )}
            {chromoData.ploidy && (
              <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-center">
                <p className="text-lg font-semibold text-violet-300">{chromoData.ploidy}</p>
                <p className="text-xs text-zinc-500 mt-1">Ploïdie</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hybrides */}
      {hybridData?.isHybrid && hybridData.parents.length > 0 && (
        <div>
          <SectionTitle icon={Dna} title="Espèces parentales (hybride)" subtitle="Ce taxon est un hybride issu de ces espèces" />
          <div className="space-y-2">
            {hybridData.parents.map((parent, i) => (
              <div key={i} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-zinc-800/30">
                <ChevronRight className="w-3 h-3 text-violet-400" />
                <span className="italic text-zinc-200">{parent.scientificName ?? parent.name}</span>
                <a href={parent.wikidataUrl} target="_blank" rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-200 ml-auto">
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Taxons enfants */}
      {childData?.found && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle icon={TreePine} title={`Taxons enfants (${childData.total})`} subtitle="Sous-espèces, variétés, cultivars" />
            <Button size="sm" variant="outline"
              className="border-violet-700/50 text-violet-300 hover:bg-violet-900/20 text-xs h-7 px-3 flex-shrink-0"
              onClick={handleImportAll} disabled={isImportingAll || importMutation.isPending}>
              {isImportingAll ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Database className="w-3 h-3 mr-1.5" />}
              Tout importer ({(childData.children as ChildTaxon[]).filter((c) => importStatuses[c.qid] !== 'created').length})
            </Button>
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {(childData.children as ChildTaxon[]).map((child, i) => {
              const status = importStatuses[child.qid] ?? 'idle';
              const msg = importMessages[child.qid];
              return (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded text-xs bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors">
                  <span className="text-zinc-500 text-[10px] w-16 flex-shrink-0">{child.rankName}</span>
                  <a href={child.wikidataUrl} target="_blank" rel="noopener noreferrer"
                    className="italic text-zinc-300 hover:text-violet-300 transition-colors flex-1 truncate">{child.name}</a>
                  {status === 'created' && <span className="flex items-center gap-1 text-emerald-400 flex-shrink-0"><CheckCircle2 className="w-3 h-3" /> Importé</span>}
                  {status === 'skipped' && <span className="flex items-center gap-1 text-zinc-500 flex-shrink-0" title={msg}><Info className="w-3 h-3" /> Existant</span>}
                  {status === 'error' && <span className="flex items-center gap-1 text-red-400 flex-shrink-0" title={msg}><XCircle className="w-3 h-3" /> Erreur</span>}
                  {status === 'pending' && <Loader2 className="w-3 h-3 animate-spin text-violet-400 flex-shrink-0" />}
                  {status === 'idle' && (
                    <Button size="sm" variant="ghost"
                      className="h-5 px-2 text-[10px] text-violet-400 hover:text-violet-200 hover:bg-violet-900/30 flex-shrink-0"
                      onClick={() => handleImportOne(child)} disabled={importMutation.isPending}>
                      + Importer
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Conservation */}
      {p.iucnStatus && (
        <div>
          <SectionTitle icon={AlertTriangle} title="Statut de conservation IUCN" />
          <Badge className={`text-sm ${
            p.iucnStatus.includes("Endangered") || p.iucnStatus.includes("Critical") ? "bg-red-900/50 text-red-300 border-red-700" :
            p.iucnStatus.includes("Vulnerable") ? "bg-orange-900/50 text-orange-300 border-orange-700" :
            "bg-emerald-900/50 text-emerald-300 border-emerald-700"
          }`}>
            {p.iucnStatus}
          </Badge>
        </div>
      )}
    </div>
  );
}

// ─── Tab: GBIF ────────────────────────────────────────────────────────────────

function GbifTab({ scientificName }: { scientificName: string }) {
  const { data, isLoading } = trpc.gbifEnrichment.searchSpecies.useQuery(
    { query: scientificName, limit: 3 },
    { enabled: scientificName.length > 2, retry: 1 }
  );

  if (isLoading) return <div className="flex items-center gap-2 text-zinc-400 py-8"><Loader2 className="w-4 h-4 animate-spin" /> Interrogation de GBIF...</div>;
  if (!data?.results?.length) return <div className="text-zinc-500 py-8 text-sm">Aucun résultat GBIF pour <em>{scientificName}</em>.</div>;

  const best = data.results[0]; // { key, scientificName, canonicalName, rank, family, kingdom, confidence }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-emerald-800/30 bg-emerald-950/20">
        <p className="text-xs text-emerald-400 uppercase tracking-widest mb-1">GBIF</p>
        <h3 className="text-lg font-semibold text-zinc-100 italic">{best.scientificName}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          <IdentifierBadge label="GBIF Key" value={String(best.key)} href={`https://www.gbif.org/species/${best.key}`} />
          {best.family && <Badge variant="outline" className="text-xs border-emerald-700 text-emerald-300">{best.family}</Badge>}
          {best.order && <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-300">{best.order}</Badge>}
          {best.status && <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">{best.status}</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {best.kingdom && <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
          <p className="text-xs text-zinc-500">Règne</p>
          <p className="text-sm text-zinc-200 mt-0.5">{best.kingdom}</p>
        </div>}
        {best.phylum && <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
          <p className="text-xs text-zinc-500">Embranchement</p>
          <p className="text-sm text-zinc-200 mt-0.5">{best.phylum}</p>
        </div>}
        {best.class && <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
          <p className="text-xs text-zinc-500">Classe</p>
          <p className="text-sm text-zinc-200 mt-0.5">{best.class}</p>
        </div>}
        {best.genus && <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
          <p className="text-xs text-zinc-500">Genre</p>
          <p className="text-sm text-zinc-200 mt-0.5 italic">{best.genus}</p>
        </div>}
      </div>

      {best.synonyms?.length > 0 && (
        <div>
          <SectionTitle icon={BookOpen} title={`Synonymes GBIF (${best.synonyms.length})`} />
          <div className="flex flex-wrap gap-1.5">
            {best.synonyms.slice(0, 8).map((s: string, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-400 italic">{s}</span>
            ))}
          </div>
        </div>
      )}

      <a href={`https://www.gbif.org/species/${best.key}`} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-200 transition-colors">
        Voir sur GBIF <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

// ─── Tab: POWO/Kew ────────────────────────────────────────────────────────────

function PowoTab({ scientificName }: { scientificName: string }) {
  const { data, isLoading } = trpc.powoKew.searchByName.useQuery(
    { name: scientificName, limit: 3 },
    { enabled: scientificName.length > 2, retry: 1 }
  );

  if (isLoading) return <div className="flex items-center gap-2 text-zinc-400 py-8"><Loader2 className="w-4 h-4 animate-spin" /> Interrogation de POWO/Kew...</div>;
  if (!data?.results?.length) return <div className="text-zinc-500 py-8 text-sm">Aucun résultat POWO pour <em>{scientificName}</em>.</div>;

  const best = data.results.find((r: any) => (r as { taxonomicStatus?: string }).taxonomicStatus === "Accepted") ?? data.results[0];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-amber-800/30 bg-amber-950/20">
        <p className="text-xs text-amber-400 uppercase tracking-widest mb-1">POWO — Kew Gardens</p>
        <h3 className="text-lg font-semibold text-zinc-100 italic">{best.name}</h3>
        {best.author && <p className="text-xs text-zinc-400 mt-1">{best.author}</p>}
        <div className="flex flex-wrap gap-2 mt-2">
          {best.taxonomicStatus && (
            <Badge className={`text-xs ${best.taxonomicStatus === "Accepted" ? "bg-emerald-900/50 text-emerald-300 border-emerald-700" : "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
              {best.taxonomicStatus}
            </Badge>
          )}
          {best.family && <Badge variant="outline" className="text-xs border-amber-700 text-amber-300">{best.family}</Badge>}
        </div>
      </div>

      {best.synonymOf && (
        <div className="p-3 rounded-lg border border-orange-800/30 bg-orange-950/20">
          <p className="text-xs text-orange-400 mb-1">Synonyme de :</p>
          <p className="text-sm text-zinc-200 italic">{best.synonymOf}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <IdentifierBadge label="POWO ID" value={best.fqId} href={best.powoUrl} />
      </div>

      {data.results.length > 1 && (
        <div>
          <SectionTitle icon={BookOpen} title="Autres résultats POWO" />
          <div className="space-y-1.5">
            {data.results.slice(1).map((r: any, i: number) => (
              <a key={i} href={r.powoUrl || r.fqId} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/30 hover:bg-zinc-800 text-sm text-zinc-300 transition-colors">
                <span className="italic">{r.name || r.canonicalName || r.scientificName}</span>
                <span className="text-xs text-zinc-500 ml-auto">{r.taxonomicStatus || r.status}</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            ))}
          </div>
        </div>
      )}

      <a href={best.powoUrl} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-200 transition-colors">
        Voir sur POWO/Kew <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

// ─── Tab: NCBI Taxonomy ───────────────────────────────────────────────────────

function NcbiTab({ scientificName }: { scientificName: string }) {
  const { data, isLoading } = trpc.ncbiTaxonomy.searchByName.useQuery(
    { name: scientificName, limit: 3 },
    { enabled: scientificName.length > 2, retry: 1 }
  );
  const { data: lineageData, isLoading: lineageLoading } = trpc.ncbiTaxonomy.getLineage.useQuery(
    { scientificName },
    { enabled: scientificName.length > 2, retry: 1 }
  );

  if (isLoading) return <div className="flex items-center gap-2 text-zinc-400 py-8"><Loader2 className="w-4 h-4 animate-spin" /> Interrogation de NCBI Taxonomy...</div>;
  if (!data?.found || !data.results.length) return <div className="text-zinc-500 py-8 text-sm">Aucun résultat NCBI pour <em>{scientificName}</em>.</div>;

  const best = data.results[0];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-sky-800/30 bg-sky-950/20">
        <p className="text-xs text-sky-400 uppercase tracking-widest mb-1">NCBI Taxonomy</p>
        <h3 className="text-lg font-semibold text-zinc-100 italic">{best.scientificName}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          <IdentifierBadge label="Tax ID" value={best.taxId} href={best.ncbiUrl} />
          {best.rank && <Badge variant="outline" className="text-xs border-sky-700 text-sky-300">{best.rank}</Badge>}
          {best.division && <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-300">{best.division}</Badge>}
        </div>
      </div>

      {/* Lignée phylogénétique */}
      {lineageData?.found && lineageData.lineage.length > 0 && (
        <div>
          <SectionTitle icon={Network} title="Lignée phylogénétique NCBI" subtitle="De la racine jusqu'à l'espèce" />
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {lineageData.lineage.map((item: NcbiLineageItem, i: number) => (
              <span key={i} className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-zinc-800/50 text-zinc-300">{item.name}</span>
                {i < lineageData.lineage.length - 1 && <ChevronRight className="w-3 h-3 text-zinc-600" />}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Autres noms */}
      {best.otherNames?.length > 0 && (
        <div>
          <SectionTitle icon={BookOpen} title="Autres noms NCBI" />
          <div className="space-y-1">
            {best.otherNames.slice(0, 6).map((name: string, i: number) => (
              <p key={i} className="text-xs text-zinc-400">{name}</p>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {best.ncbiUrl && (
          <a href={best.ncbiUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-200 transition-colors">
            NCBI Taxonomy <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {best.genbankUrl && (
          <a href={best.genbankUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-200 transition-colors">
            GenBank <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Tropicos ────────────────────────────────────────────────────────────

function TropicosTab({ scientificName }: { scientificName: string }) {
  const { data, isLoading } = trpc.tropicosEnrichment.searchName.useQuery(
    { name: scientificName, limit: 3 },
    { enabled: scientificName.length > 2, retry: 1 }
  );

  if (isLoading) return <div className="flex items-center gap-2 text-zinc-400 py-8"><Loader2 className="w-4 h-4 animate-spin" /> Interrogation de Tropicos...</div>;
  if (!data?.results?.length) return <div className="text-zinc-500 py-8 text-sm">Aucun résultat Tropicos pour <em>{scientificName}</em>.</div>;

  const bestRaw = data.results[0];
  const best = bestRaw as any;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-rose-800/30 bg-rose-950/20">
        <p className="text-xs text-rose-400 uppercase tracking-widest mb-1">Tropicos — Missouri Botanical Garden</p>
        <h3 className="text-lg font-semibold text-zinc-100 italic">{String(best.scientificName ?? '')}</h3>
        {best.author && <p className="text-xs text-zinc-400 mt-1">{String(best.author)}</p>}
        <div className="flex flex-wrap gap-2 mt-2">
          <IdentifierBadge label="Tropicos ID" value={String(best.nameId ?? '')} href={best.url ? String(best.url) : undefined} />
          {best.family && <Badge variant="outline" className="text-xs border-rose-700 text-rose-300">{String(best.family)}</Badge>}
          {best.nomenclatureStatus && <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-300">{String(best.nomenclatureStatus)}</Badge>}
        </div>
      </div>

      {best.year && (
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Info className="w-3.5 h-3.5" />
          Année de publication : <span className="text-zinc-200">{String(best.year)}</span>
        </div>
      )}

      {data.results.length > 1 && (
        <div>
          <SectionTitle icon={BookOpen} title="Autres résultats Tropicos" />
          <div className="space-y-1.5">
            {data.results.slice(1).map((r: any, i: number) => (
              <a key={i} href={r.url ? String(r.url) : '#'} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/30 hover:bg-zinc-800 text-sm text-zinc-300 transition-colors">
                <span className="italic">{String(r.scientificName ?? '')}</span>
                <span className="text-xs text-zinc-500 ml-auto">{String(r.nomenclatureStatus ?? '')}</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            ))}
          </div>
        </div>
      )}

      {best.url && (
        <a href={String(best.url)} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-rose-400 hover:text-rose-200 transition-colors">
          Voir sur Tropicos <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

// ─── Batch Enrichment Panel ───────────────────────────────────────────────────

function BatchEnrichmentPanel() {
  const { toast } = useToast();
  const [dryRun, setDryRun] = useState(true);
  const [limit, setLimit] = useState(10);

  const powoMutation = trpc.powoKew.batchEnrichPlants.useMutation({
    onSuccess: (data) => {
      toast({
        title: `POWO Batch ${data.dryRun ? "(Dry Run)" : ""}`,
        description: `${data.found}/${data.total} plantes trouvées, ${data.enriched} enrichies`,
      });
    },
  });

  const wikidataMutation = trpc.wikidataPhylo.batchEnrichCrossIds.useMutation({
    onSuccess: (data) => {
      toast({
        title: `Wikidata Cross-IDs ${data.dryRun ? "(Dry Run)" : ""}`,
        description: `${data.found}/${data.total} plantes trouvées, ${data.enriched} enrichies`,
      });
    },
  });

  const ncbiMutation = trpc.ncbiTaxonomy.batchEnrichPlants.useMutation({
    onSuccess: (data) => {
      toast({
        title: `NCBI Batch ${data.dryRun ? "(Dry Run)" : ""}`,
        description: `${data.found}/${data.total} plantes trouvées, ${data.enriched} enrichies`,
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-700/50 bg-zinc-800/20">
        <div className="flex items-center gap-3">
          <label className="text-sm text-zinc-400">Limite :</label>
          <Input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-20 h-8 text-sm bg-zinc-900 border-zinc-700"
            min={1}
            max={100}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="dryrun"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
            className="rounded border-zinc-600"
          />
          <label htmlFor="dryrun" className="text-sm text-zinc-400">Mode Dry Run (aperçu sans écriture)</label>
        </div>
      </div>

      {!dryRun && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-orange-800/50 bg-orange-950/20 text-sm text-orange-300">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          Mode écriture activé — les données seront modifiées en base de données.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* POWO Batch */}
        <Card className="bg-zinc-900/50 border-zinc-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Leaf className="w-4 h-4 text-amber-400" />
              POWO / Kew
            </CardTitle>
            <CardDescription className="text-xs">Enrichit powId, authorCitation, synonymes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-amber-700/50 text-amber-300 hover:bg-amber-900/20"
              onClick={() => powoMutation.mutate({ limit, dryRun })}
              disabled={powoMutation.isPending}
            >
              {powoMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <RefreshCw className="w-3 h-3 mr-2" />}
              {dryRun ? "Prévisualiser" : "Enrichir"}
            </Button>
            {powoMutation.data && (
              <div className="mt-3 text-xs space-y-1">
                <p className="text-zinc-400">{powoMutation.data.found}/{powoMutation.data.total} trouvées</p>
                {!dryRun && <p className="text-emerald-400">{powoMutation.data.enriched} enrichies</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wikidata Cross-IDs */}
        <Card className="bg-zinc-900/50 border-zinc-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-violet-400" />
              Wikidata Cross-IDs
            </CardTitle>
            <CardDescription className="text-xs">Enrichit wikidataQid, gbifId, powId</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-violet-700/50 text-violet-300 hover:bg-violet-900/20"
              onClick={() => wikidataMutation.mutate({ limit, dryRun })}
              disabled={wikidataMutation.isPending}
            >
              {wikidataMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <RefreshCw className="w-3 h-3 mr-2" />}
              {dryRun ? "Prévisualiser" : "Enrichir"}
            </Button>
            {wikidataMutation.data && (
              <div className="mt-3 text-xs space-y-1">
                <p className="text-zinc-400">{wikidataMutation.data.found}/{wikidataMutation.data.total} trouvées</p>
                {!dryRun && <p className="text-emerald-400">{wikidataMutation.data.enriched} enrichies</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* NCBI Batch */}
        <Card className="bg-zinc-900/50 border-zinc-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Microscope className="w-4 h-4 text-sky-400" />
              NCBI Taxonomy
            </CardTitle>
            <CardDescription className="text-xs">Stocke le taxon ID NCBI dans les notes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-sky-700/50 text-sky-300 hover:bg-sky-900/20"
              onClick={() => ncbiMutation.mutate({ limit, dryRun })}
              disabled={ncbiMutation.isPending}
            >
              {ncbiMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <RefreshCw className="w-3 h-3 mr-2" />}
              {dryRun ? "Prévisualiser" : "Enrichir"}
            </Button>
            {ncbiMutation.data && (
              <div className="mt-3 text-xs space-y-1">
                <p className="text-zinc-400">{ncbiMutation.data.found}/{ncbiMutation.data.total} trouvées</p>
                {!dryRun && <p className="text-emerald-400">{ncbiMutation.data.enriched} enrichies</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Résultats batch */}
      {(powoMutation.data?.results || wikidataMutation.data?.results || ncbiMutation.data?.results) && (
        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-3">Résultats de l'enrichissement</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-2 px-3 text-zinc-500 font-medium">Plante</th>
                  <th className="text-left py-2 px-3 text-zinc-500 font-medium">Nom latin</th>
                  <th className="text-left py-2 px-3 text-zinc-500 font-medium">Trouvée</th>
                  <th className="text-left py-2 px-3 text-zinc-500 font-medium">Données</th>
                </tr>
              </thead>
              <tbody>
                {(powoMutation.data?.results ?? wikidataMutation.data?.results ?? ncbiMutation.data?.results ?? [] as any[]).map((r: PhyloBatchPlantResult, i: number) => (
                  <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/20">
                    <td className="py-2 px-3 text-zinc-300">{r.name}</td>
                    <td className="py-2 px-3 text-zinc-400 italic">{r.latinName}</td>
                    <td className="py-2 px-3">
                      {r.found
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                    </td>
                    <td className="py-2 px-3 text-zinc-500">
                      {(r as any).fqId ?? (r as any).wikidataQid ?? (r as any).taxId ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── BatchByGenusPanel ────────────────────────────────────────────────────────
function BatchByGenusPanel() {
  const { toast } = useToast();
  const [genusSearch, setGenusSearch] = useState("");
  const [selectedGenus, setSelectedGenus] = useState("");
  const [dryRun, setDryRun] = useState(true);
  const [selectedApis, setSelectedApis] = useState<string[]>(["gbif", "powo", "ncbi", "wikidata"]);

  // Fetch genera list
  const { data: generaData, isLoading: generaLoading } = trpc.phyloBatch.getGenera.useQuery(
    { search: genusSearch.length >= 2 ? genusSearch : undefined },
    { enabled: true }
  );

  // Coverage report for selected genus
  const { data: coverageData, isLoading: coverageLoading, refetch: refetchCoverage } = trpc.phyloBatch.getCoverageReport.useQuery(
    { genus: selectedGenus },
    { enabled: selectedGenus.length >= 2 }
  );

  // Batch mutation
  const batchMutation = trpc.phyloBatch.batchByGenus.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: data.dryRun ? "Prévisualisation terminée" : "Enrichissement appliqué",
          description: data.dryRun
            ? `${data.results.filter((r: PhyloBatchPlantResult) => r.fieldsToUpdate > 0).length}/${data.total} plantes à enrichir`
            : `${data.enriched}/${data.total} plantes enrichies`,
        });
        if (!data.dryRun) refetchCoverage();
      }
    },
    onError: (err) => toast({ title: "Erreur", description: err.message, variant: "destructive" }),
  });

  // Sync batch results mutation
  const syncMutation = trpc.phyloBatch.syncBatchResults.useMutation({
    onSuccess: (data) => {
      toast({
        title: data.dryRun ? "Simulation appliquée" : "Synchronisation réussie",
        description: data.message,
      });
      if (!data.dryRun) refetchCoverage();
    },
    onError: (err) => toast({ title: "Erreur", description: err.message, variant: "destructive" }),
  });

  const toggleApi = (api: string) => {
    setSelectedApis((prev) =>
      prev.includes(api) ? prev.filter((a) => a !== api) : [...prev, api]
    );
  };

  const handleApplyResults = () => {
    if (!batchMutation.data?.results) return;
    const updates = batchMutation.data.results
      .filter((r: PhyloBatchPlantResult) => r.fieldsToUpdate > 0)
      .map((r: PhyloBatchPlantResult) => ({
        plantId: r.id,
        gbifId: r.newIds?.gbif ?? null,
        powId: r.newIds?.powo ?? null,
        ncbiTaxId: r.newIds?.ncbi ?? null,
        wikidataQid: r.newIds?.wikidata ?? null,
      }));
    syncMutation.mutate({ updates, dryRun: false });
  };

  const apiColors: Record<string, string> = {
    gbif: "emerald",
    powo: "amber",
    ncbi: "sky",
    wikidata: "violet",
    tropicos: "rose",
  };

  return (
    <div className="space-y-6">
      {/* Genre selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-zinc-300">1. Sélectionner un genre</h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <Input
              placeholder="Rechercher un genre (ex: Rosa, Nicotiana...)"
              value={genusSearch}
              onChange={(e) => setGenusSearch(e.target.value)}
              className="pl-8 bg-zinc-900 border-zinc-700 text-zinc-200 text-sm h-9"
            />
          </div>
          {/* Genera list */}
          <div className="max-h-48 overflow-y-auto rounded-lg border border-zinc-700/50 bg-zinc-900/50 divide-y divide-zinc-800/50">
            {generaLoading ? (
              <div className="p-3 flex items-center gap-2 text-xs text-zinc-500">
                <Loader2 className="w-3 h-3 animate-spin" /> Chargement...
              </div>
            ) : (generaData?.genera ?? []).length === 0 ? (
              <div className="p-3 text-xs text-zinc-500">Aucun genre trouvé</div>
            ) : (
              (generaData?.genera ?? []).slice(0, 30).map((g: PhyloBatchGenus) => (
                <button
                  key={g.genus}
                  onClick={() => setSelectedGenus(g.genus)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-zinc-800/50 transition-colors ${
                    selectedGenus === g.genus ? "bg-violet-900/30 text-violet-300" : "text-zinc-300"
                  }`}
                >
                  <span className="font-medium italic">{g.genus}</span>
                  <Badge variant="outline" className="text-[10px] border-zinc-600 text-zinc-500 h-4 px-1.5">
                    {g.count} plante{g.count > 1 ? "s" : ""}
                  </Badge>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Coverage report */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-zinc-300">
            2. Couverture actuelle
            {selectedGenus && <span className="ml-2 text-violet-400 italic">{selectedGenus}</span>}
          </h4>
          {!selectedGenus ? (
            <div className="h-48 rounded-lg border border-zinc-700/30 bg-zinc-900/30 flex items-center justify-center text-xs text-zinc-600">
              Sélectionnez un genre pour voir sa couverture
            </div>
          ) : coverageLoading ? (
            <div className="h-48 rounded-lg border border-zinc-700/30 bg-zinc-900/30 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
            </div>
          ) : coverageData ? (
            <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/50 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Total", value: coverageData.summary.total, color: "zinc" },
                  { label: "GBIF", value: `${coverageData.summary.withGbif}/${coverageData.summary.total}`, color: "emerald" },
                  { label: "POWO", value: `${coverageData.summary.withPowo}/${coverageData.summary.total}`, color: "amber" },
                  { label: "NCBI", value: `${coverageData.summary.withNcbi}/${coverageData.summary.total}`, color: "sky" },
                  { label: "Wikidata", value: `${coverageData.summary.withWikidata}/${coverageData.summary.total}`, color: "violet" },
                  { label: "Complet", value: `${coverageData.summary.fullyEnriched}/${coverageData.summary.total}`, color: "emerald" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-2 py-1.5 rounded bg-zinc-800/40">
                    <span className="text-xs text-zinc-500">{item.label}</span>
                    <span className={`text-xs font-mono font-medium text-${item.color}-400`}>{item.value}</span>
                  </div>
                ))}
              </div>
              {/* Progress bars */}
              <div className="space-y-1.5">
                {[
                  { label: "GBIF", count: coverageData.summary.withGbif, color: "bg-emerald-500" },
                  { label: "POWO", count: coverageData.summary.withPowo, color: "bg-amber-500" },
                  { label: "NCBI", count: coverageData.summary.withNcbi, color: "bg-sky-500" },
                  { label: "Wikidata", count: coverageData.summary.withWikidata, color: "bg-violet-500" },
                ].map((bar) => (
                  <div key={bar.label} className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 w-14 text-right">{bar.label}</span>
                    <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${bar.color} rounded-full transition-all duration-500`}
                        style={{ width: coverageData.summary.total > 0 ? `${(bar.count / coverageData.summary.total) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500 w-8">
                      {coverageData.summary.total > 0 ? Math.round((bar.count / coverageData.summary.total) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* API selection + options */}
      {selectedGenus && (
        <div className="space-y-4 p-4 rounded-xl border border-zinc-700/50 bg-zinc-900/30">
          <h4 className="text-sm font-medium text-zinc-300">3. Configurer l'enrichissement</h4>
          <div className="flex flex-wrap gap-2">
            {(["gbif", "powo", "ncbi", "wikidata", "tropicos"] as const).map((api) => (
              <button
                key={api}
                onClick={() => toggleApi(api)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  selectedApis.includes(api)
                    ? `bg-${apiColors[api]}-900/40 border-${apiColors[api]}-700/50 text-${apiColors[api]}-300`
                    : "bg-zinc-800/40 border-zinc-700/30 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {api.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setDryRun(!dryRun)}
                className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${dryRun ? "bg-amber-600" : "bg-emerald-600"}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${dryRun ? "left-0.5" : "left-4.5"}`} />
              </div>
              <span className="text-xs text-zinc-400">
                {dryRun ? <span className="text-amber-400">Prévisualisation (dry run)</span> : <span className="text-emerald-400">Appliquer en base</span>}
              </span>
            </label>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => batchMutation.mutate({ genus: selectedGenus, dryRun, apis: selectedApis as ("gbif" | "wikidata" | "powo" | "ncbi" | "tropicos")[] })}
              disabled={batchMutation.isPending || selectedApis.length === 0}
              className="bg-violet-700 hover:bg-violet-600 text-white"
            >
              {batchMutation.isPending ? (
                <><Loader2 className="w-3 h-3 animate-spin mr-2" /> En cours...</>
              ) : (
                <><RefreshCw className="w-3 h-3 mr-2" /> {dryRun ? "Prévisualiser" : "Enrichir"} {selectedGenus}</>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      {batchMutation.data && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Plantes analysées", value: batchMutation.data.total, color: "zinc" },
              { label: "À enrichir", value: batchMutation.data.results.filter((r: PhyloBatchPlantResult) => r.fieldsToUpdate > 0).length, color: "violet" },
              { label: "Gain GBIF", value: `+${batchMutation.data.summary.gain?.gbif ?? 0}`, color: "emerald" },
              { label: "Gain POWO", value: `+${batchMutation.data.summary.gain?.powo ?? 0}`, color: "amber" },
            ].map((stat) => (
              <div key={stat.label} className={`p-3 rounded-lg border border-${stat.color}-800/30 bg-${stat.color}-950/20`}>
                <p className="text-xs text-zinc-500">{stat.label}</p>
                <p className={`text-xl font-bold text-${stat.color}-400 mt-0.5`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Apply button (only for dry run results) */}
          {batchMutation.data.dryRun && batchMutation.data.results.filter((r: PhyloBatchPlantResult) => r.fieldsToUpdate > 0).length > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-800/30 bg-emerald-950/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-300">
                  {batchMutation.data.results.filter((r: PhyloBatchPlantResult) => r.fieldsToUpdate > 0).length} plante(s) prêtes à être enrichies
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Cliquez sur "Appliquer en base" pour écrire les identifiants dans la table plants
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleApplyResults}
                disabled={syncMutation.isPending}
                className="bg-emerald-700 hover:bg-emerald-600 text-white flex-shrink-0"
              >
                {syncMutation.isPending ? (
                  <><Loader2 className="w-3 h-3 animate-spin mr-2" /> Synchronisation...</>
                ) : (
                  <><Database className="w-3 h-3 mr-2" /> Appliquer en base</>
                )}
              </Button>
            </div>
          )}

          {/* Results table */}
          <div className="overflow-x-auto rounded-xl border border-zinc-700/50">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-700 bg-zinc-900/80">
                  <th className="text-left py-2.5 px-3 text-zinc-500 font-medium">Plante</th>
                  <th className="text-left py-2.5 px-3 text-zinc-500 font-medium">Nom latin</th>
                  <th className="text-center py-2.5 px-3 text-zinc-500 font-medium">GBIF</th>
                  <th className="text-center py-2.5 px-3 text-zinc-500 font-medium">POWO</th>
                  <th className="text-center py-2.5 px-3 text-zinc-500 font-medium">NCBI</th>
                  <th className="text-center py-2.5 px-3 text-zinc-500 font-medium">Wikidata</th>
                  <th className="text-center py-2.5 px-3 text-zinc-500 font-medium">Champs</th>
                </tr>
              </thead>
              <tbody>
                {batchMutation.data.results.map((r: PhyloBatchPlantResult, i: number) => (
                  <tr key={i} className={`border-b border-zinc-800/50 hover:bg-zinc-800/20 ${r.fieldsToUpdate > 0 ? "bg-violet-950/10" : ""}`}>
                    <td className="py-2 px-3 text-zinc-300 font-medium">{r.name}</td>
                    <td className="py-2 px-3 text-zinc-400 italic">{r.latinName}</td>
                    <td className="py-2 px-3 text-center">
                      {r.apis?.gbif?.id
                        ? <span className="text-emerald-400 font-mono">{r.apis.gbif.id}</span>
                        : r.existing?.gbif
                          ? <span className="text-zinc-500">✓</span>
                          : <XCircle className="w-3 h-3 text-zinc-700 mx-auto" />}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {r.apis?.powo?.fqId
                        ? <span className="text-amber-400 font-mono text-[10px]">{r.apis.powo.fqId.split(":").pop()}</span>
                        : r.existing?.powo
                          ? <span className="text-zinc-500">✓</span>
                          : <XCircle className="w-3 h-3 text-zinc-700 mx-auto" />}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {r.apis?.ncbi?.taxId
                        ? <span className="text-sky-400 font-mono">{r.apis.ncbi.taxId}</span>
                        : r.existing?.ncbi
                          ? <span className="text-zinc-500">✓</span>
                          : <XCircle className="w-3 h-3 text-zinc-700 mx-auto" />}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {r.apis?.wikidata?.qid
                        ? <span className="text-violet-400 font-mono">{r.apis.wikidata.qid}</span>
                        : r.existing?.wikidata
                          ? <span className="text-zinc-500">✓</span>
                          : <XCircle className="w-3 h-3 text-zinc-700 mx-auto" />}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {r.fieldsToUpdate > 0
                        ? <Badge className="bg-violet-900/40 text-violet-300 border-violet-700/30 text-[10px] h-4 px-1.5">+{r.fieldsToUpdate}</Badge>
                        : <span className="text-zinc-600">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PhyloEnrichment() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const handleSearch = useCallback(() => {
    if (searchInput.trim().length > 2) {
      setActiveSearch(searchInput.trim());
    }
  }, [searchInput]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  }, [handleSearch]);

  // API status checks
  const { data: gbifStatus } = trpc.gbif.getStats.useQuery(undefined, { retry: 0 });
  const { data: powoStatus } = trpc.powoKew.getStatus.useQuery(undefined, { retry: 0 });
  const { data: ncbiStatus } = trpc.ncbiTaxonomy.getStatus.useQuery(undefined, { retry: 0 });

  const apiSources = [
    { label: "GBIF", color: "emerald", status: (gbifStatus?.total != null ? "online" : "unknown") as "online" | "offline" | "unknown", coverage: "1.9B occurrences" },
    { label: "POWO/Kew", color: "amber", status: powoStatus?.status ?? "unknown", coverage: "1.4M noms" },
    { label: "NCBI", color: "sky", status: ncbiStatus?.status ?? "unknown", coverage: "2M+ espèces" },
    { label: "Tropicos", color: "rose", status: "unknown", coverage: "1.3M noms" },
    { label: "Wikidata", color: "violet", status: "online", coverage: "SPARQL live" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800/50 bg-zinc-900/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-900/40 border border-violet-700/30">
                <Dna className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-zinc-100">Enrichissement Phylogénétique</h1>
                <p className="text-xs text-zinc-500">5 sources taxonomiques · GBIF · POWO · NCBI · Tropicos · Wikidata</p>
              </div>
            </div>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200">
                ← Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* API Status Bar */}
        <div className="flex flex-wrap gap-3">
          {apiSources.map((api) => (
            <div key={api.label} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-700/50 bg-zinc-800/30 text-xs">
              <StatusDot status={api.status as "online" | "offline" | "unknown"} />
              <span className="text-zinc-300 font-medium">{api.label}</span>
              <span className="text-zinc-500">{api.coverage}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="p-6 rounded-2xl border border-zinc-700/50 bg-zinc-900/30">
          <h2 className="text-sm font-medium text-zinc-300 mb-4">Recherche par nom scientifique</h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ex: Nicotiana tabacum, Rosa damascena, Lavandula angustifolia..."
                className="pl-9 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 h-10"
              />
            </div>
            <Button onClick={handleSearch} className="bg-violet-700 hover:bg-violet-600 text-white px-6">
              Interroger les 5 sources
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Quick examples */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-zinc-600">Exemples :</span>
            {["Nicotiana tabacum", "Rosa damascena", "Cannabis sativa", "Lavandula angustifolia", "Citrus aurantium"].map((name) => (
              <button
                key={name}
                onClick={() => { setSearchInput(name); setActiveSearch(name); }}
                className="text-xs text-violet-400 hover:text-violet-200 italic transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {activeSearch && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-zinc-100">
                Résultats pour <em className="text-violet-300">{activeSearch}</em>
              </h2>
              <Separator className="flex-1 bg-zinc-800" />
            </div>

            <Tabs defaultValue="wikidata" className="space-y-4">
              <TabsList className="bg-zinc-900 border border-zinc-700/50 p-1 h-auto flex-wrap gap-1">
                <TabsTrigger value="wikidata" className="text-xs data-[state=active]:bg-violet-900/50 data-[state=active]:text-violet-200">
                  <Globe className="w-3 h-3 mr-1.5" /> Wikidata Phylo
                </TabsTrigger>
                <TabsTrigger value="gbif" className="text-xs data-[state=active]:bg-emerald-900/50 data-[state=active]:text-emerald-200">
                  <Leaf className="w-3 h-3 mr-1.5" /> GBIF
                </TabsTrigger>
                <TabsTrigger value="powo" className="text-xs data-[state=active]:bg-amber-900/50 data-[state=active]:text-amber-200">
                  <TreePine className="w-3 h-3 mr-1.5" /> POWO/Kew
                </TabsTrigger>
                <TabsTrigger value="ncbi" className="text-xs data-[state=active]:bg-sky-900/50 data-[state=active]:text-sky-200">
                  <Microscope className="w-3 h-3 mr-1.5" /> NCBI
                </TabsTrigger>
                <TabsTrigger value="tropicos" className="text-xs data-[state=active]:bg-rose-900/50 data-[state=active]:text-rose-200">
                  <FlaskConical className="w-3 h-3 mr-1.5" /> Tropicos
                </TabsTrigger>
              </TabsList>

              <div className="p-6 rounded-xl border border-zinc-700/50 bg-zinc-900/30 min-h-64">
                <TabsContent value="wikidata" className="mt-0">
                  <WikidataPhyloTab scientificName={activeSearch} />
                </TabsContent>
                <TabsContent value="gbif" className="mt-0">
                  <GbifTab scientificName={activeSearch} />
                </TabsContent>
                <TabsContent value="powo" className="mt-0">
                  <PowoTab scientificName={activeSearch} />
                </TabsContent>
                <TabsContent value="ncbi" className="mt-0">
                  <NcbiTab scientificName={activeSearch} />
                </TabsContent>
                <TabsContent value="tropicos" className="mt-0">
                  <TropicosTab scientificName={activeSearch} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}

        {/* Batch Enrichment */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-zinc-100">Enrichissement en lot</h2>
            <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-400">Beta</Badge>
            <Separator className="flex-1 bg-zinc-800" />
          </div>
          <Tabs defaultValue="batch-genus" className="space-y-4">
            <TabsList className="bg-zinc-900 border border-zinc-700/50 p-1 h-auto gap-1">
              <TabsTrigger value="batch-genus" className="text-xs data-[state=active]:bg-violet-900/50 data-[state=active]:text-violet-200">
                <TreePine className="w-3 h-3 mr-1.5" /> Batch par Genre
              </TabsTrigger>
              <TabsTrigger value="batch-global" className="text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-200">
                <Database className="w-3 h-3 mr-1.5" /> Enrichissement global
              </TabsTrigger>
            </TabsList>
            <TabsContent value="batch-genus" className="mt-0">
              <div className="p-6 rounded-xl border border-zinc-700/50 bg-zinc-900/30">
                <BatchByGenusPanel />
              </div>
            </TabsContent>
            <TabsContent value="batch-global" className="mt-0">
              <div className="p-6 rounded-xl border border-zinc-700/50 bg-zinc-900/30">
                <BatchEnrichmentPanel />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Links to individual enrichment pages */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-zinc-100">Pages d'enrichissement spécialisées</h2>
            <Separator className="flex-1 bg-zinc-800" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: "/admin/gbif-enrichment", label: "GBIF + Climat", desc: "Distribution, Köppen, IUCN", color: "emerald" },
              { href: "/admin/tropicos-enrichment", label: "Tropicos", desc: "Synonymes, images, distribution", color: "rose" },
              { href: "/admin/lotus-batch-genus", label: "LOTUS / Wikidata", desc: "Molécules par genre", color: "violet" },
              { href: "/admin/variety-images", label: "Images morpho.", desc: "Galerie variétale", color: "amber" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <div className={`p-4 rounded-xl border border-${link.color}-800/30 bg-${link.color}-950/20 hover:bg-${link.color}-950/40 transition-colors cursor-pointer group`}>
                  <p className={`text-sm font-medium text-${link.color}-300 group-hover:text-${link.color}-100`}>{link.label}</p>
                  <p className="text-xs text-zinc-500 mt-1">{link.desc}</p>
                  <ArrowRight className={`w-3.5 h-3.5 text-${link.color}-500 mt-2 group-hover:translate-x-1 transition-transform`} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
