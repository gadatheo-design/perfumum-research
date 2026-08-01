/**
 * MoleculeKGTab — Onglet Knowledge Graph
 * Affiche les données enrichies Phase A (PubChem étendu) + Phase B (Wikidata KG)
 * pour une molécule donnée.
 */
import React, { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Loader2, Network, ExternalLink, FlaskConical, Leaf, Droplets,
  Atom, BookOpen, Globe, Zap, AlertCircle, RefreshCw, Database,
  ChevronDown, ChevronUp, Copy, Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────

interface KGEntity {
  qid: string;
  label: string;
}

interface KGData {
  qid: string;
  classes: KGEntity[];
  subclasses: KGEntity[];
  skeletons: KGEntity[];
  biosynthesisPathways: KGEntity[];
  chirality: KGEntity[];
  parentMolecules: KGEntity[];
  derivedMolecules: KGEntity[];
  isomers: KGEntity[];
  producingOrganisms: KGEntity[];
  essentialOils: KGEntity[];
  resins: KGEntity[];
  odors: KGEntity[];
  uses: KGEntity[];
  identifiers: {
    cas?: string;
    inchi?: string;
    inchikey?: string;    // Wikidata P235 (lowercase)
    inchiKey?: string;   // alias camelCase
    pubchem?: string;    // Wikidata P662
    pubchemCid?: string; // alias camelCase
    chebi?: string;      // Wikidata P683
    chemspider?: string; // Wikidata P661
    smiles?: string;     // Wikidata P233
    mw?: string;         // masse moléculaire
    formula?: string;    // formule brute
    nist?: string;
    hmdb?: string;
    kegg?: string;
    dsstox?: string;
  };
  physicochemical?: {
    xlogp?: number;
    tpsa?: number;
    exactMass?: number;
    hBondDonorCount?: number;
    hBondAcceptorCount?: number;
    rotatableBondCount?: number;
    heavyAtomCount?: number;
  };
}

// ─── Sous-composants ────────────────────────────────────────────────────────

function EntityList({
  items,
  icon: Icon,
  label,
  colorClass = "bg-muted text-muted-foreground",
  wikidataBase = true,
}: {
  items: KGEntity[];
  icon: React.ElementType;
  label: string;
  colorClass?: string;
  wikidataBase?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const MAX_VISIBLE = 12;
  const visible = expanded ? items : items.slice(0, MAX_VISIBLE);

  if (!items.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
        <Badge variant="secondary" className="text-xs ml-1">{items.length}</Badge>
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {visible.map((item) => (
          <a
            key={item.qid}
            href={wikidataBase ? `https://www.wikidata.org/wiki/${item.qid}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80 ${colorClass}`}
          >
            {item.label || item.qid}
            <ExternalLink className="h-2.5 w-2.5 opacity-60" />
          </a>
        ))}
      </div>
      {items.length > MAX_VISIBLE && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
        >
          {expanded ? (
            <><ChevronUp className="h-3 w-3" /> Réduire</>
          ) : (
            <><ChevronDown className="h-3 w-3" /> Voir {items.length - MAX_VISIBLE} de plus</>
          )}
        </button>
      )}
    </div>
  );
}

function CopyableValue({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground font-medium w-32 shrink-0">{label}</span>
      <span className="text-xs font-mono text-foreground truncate flex-1">{value}</span>
      <button onClick={handleCopy} className="text-muted-foreground hover:text-primary shrink-0">
        {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      </button>
    </div>
  );
}

function IdentifierLink({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-2 py-1.5 border-b border-border/50 last:border-0 hover:bg-muted/40 rounded px-1 transition-colors group"
    >
      <span className="text-xs text-muted-foreground font-medium w-32 shrink-0">{label}</span>
      <span className="text-xs font-mono text-primary truncate flex-1 group-hover:underline">{value}</span>
      <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
    </a>
  );
}

// ─── Squelettes terpéniques — couleurs statiques ───────────────────────────

const SKELETON_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  cadinane:      { bg: "#8B5E3C20", text: "#8B5E3C", border: "#8B5E3C50" },
  eudesmane:     { bg: "#5C8A3C20", text: "#5C8A3C", border: "#5C8A3C50" },
  guaiane:       { bg: "#3C6E8A20", text: "#3C6E8A", border: "#3C6E8A50" },
  germacrane:    { bg: "#7A3C8A20", text: "#7A3C8A", border: "#7A3C8A50" },
  bisabolane:    { bg: "#8A6E3C20", text: "#8A6E3C", border: "#8A6E3C50" },
  caryophyllane: { bg: "#3C8A6E20", text: "#3C8A6E", border: "#3C8A6E50" },
  drimane:       { bg: "#8A3C3C20", text: "#8A3C3C", border: "#8A3C3C50" },
  bourbonane:    { bg: "#6E8A3C20", text: "#6E8A3C", border: "#6E8A3C50" },
  copaane:       { bg: "#3C3C8A20", text: "#3C3C8A", border: "#3C3C8A50" },
  cedrene:       { bg: "#8A7A3C20", text: "#8A7A3C", border: "#8A7A3C50" },
};

function SkeletonBadge({ skeleton }: { skeleton: { qid: string; label: string; labelFr?: string } }) {
  const colors = SKELETON_COLORS[skeleton.label] ?? { bg: "#64748b20", text: "#64748b", border: "#64748b50" };
  return (
    <a
      href={`https://www.wikidata.org/wiki/${skeleton.qid}`}
      target="_blank"
      rel="noopener noreferrer"
      title={`Squelette terpénique : ${skeleton.labelFr ?? skeleton.label} (${skeleton.qid})`}
      style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-opacity hover:opacity-80"
    >
      <span className="text-base leading-none">⬡</span>
      {skeleton.labelFr ?? skeleton.label}
      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
    </a>
  );
}

// ─── Organismes producteurs avec résolution PERFUMUM ───────────────────────

function ProducingOrganismsList({
  organisms,
}: {
  organisms: Array<{ qid: string; label: string }>;
}) {
  const [expanded, setExpanded] = useState(false);
  const MAX_VISIBLE = 15;

  const qids = organisms.map(o => o.qid).filter(Boolean);
  const { data: resolved } = trpc.wikidataKg.resolveOrganismPlant.useQuery(
    { wikidataQids: qids.slice(0, 50) },
    { enabled: qids.length > 0, staleTime: 10 * 60 * 1000, retry: false }
  );

  const qidToPlant = new Map<string, { plantId: number; name: string }>();
  resolved?.matches.forEach(m => qidToPlant.set(m.wikidataQid, { plantId: m.plantId, name: m.name }));

  const visible = expanded ? organisms : organisms.slice(0, MAX_VISIBLE);

  if (!organisms.length) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {visible.map((org) => {
          const plant = qidToPlant.get(org.qid);
          if (plant) {
            return (
              <Link
                key={org.qid}
                href={`/plants/${plant.plantId}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-300/50 hover:opacity-80 transition-opacity"
                title={`Fiche plante PERFUMUM : ${plant.name}`}
              >
                <Leaf className="h-2.5 w-2.5" />
                {org.label || org.qid}
              </Link>
            );
          }
          return (
            <a
              key={org.qid}
              href={`https://www.wikidata.org/wiki/${org.qid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:opacity-80 transition-opacity"
            >
              {org.label || org.qid}
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </a>
          );
        })}
      </div>
      {organisms.length > MAX_VISIBLE && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
        >
          {expanded ? (
            <><ChevronUp className="h-3 w-3" /> Réduire</>
          ) : (
            <><ChevronDown className="h-3 w-3" /> Voir {organisms.length - MAX_VISIBLE} de plus</>
          )}
        </button>
      )}
    </div>
  );
}

// ─── Composant principal ────────────────────────────────────────────────────

interface MoleculeKGTabProps {
  moleculeId: number;
  moleculeName: string;
  wikidataQid?: string | null;
}

export function MoleculeKGTab({ moleculeId, moleculeName, wikidataQid }: MoleculeKGTabProps) {
  // Détection du squelette terpénique local
  const { data: skeletonData } = trpc.wikidataKg.detectSkeleton.useQuery(
    { moleculeName, moleculeId },
    { staleTime: 30 * 60 * 1000, retry: false }
  );

  // Essayer d'abord les données stockées en base (getStoredKG)
  const { data: storedKG, isLoading: isLoadingStored, refetch: refetchStored } = trpc.wikidataKg.getStoredKG.useQuery(
    { moleculeId },
    { retry: false, staleTime: 5 * 60 * 1000 }
  );

  // Si pas de données stockées, interroger Wikidata en direct
  const hasStoredKG = storedKG?.kg != null;
  const { data: liveKG, isLoading: isLoadingLive, error } = trpc.wikidataKg.getMoleculeKG.useQuery(
    { moleculeId },
    { retry: false, staleTime: 5 * 60 * 1000, enabled: !hasStoredKG && !isLoadingStored }
  );

  const isLoading = isLoadingStored || (!hasStoredKG && isLoadingLive);

  const enrichMutation = trpc.wikidataKg.enrichSingleWithKG.useMutation({
    onSuccess: () => {
      toast.success("Knowledge Graph enrichi avec succès !");
      refetchStored();
    },
    onError: (err: { message: string }) => toast.error(`Erreur : ${err.message}`),
  });

  // Priorité : données stockées en base, sinon données live Wikidata
  const kg = (hasStoredKG ? storedKG.kg : liveKG) as KGData | null;

  return (
    <TabsContent value="knowledge-graph" className="space-y-6 mt-6">
      <TabErrorBoundary tabLabel="Knowledge Graph">
        {/* En-tête */}
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Network className="h-5 w-5 text-cyan-600" />
                Knowledge Graph — {moleculeName}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Données enrichies Phase A (PubChem étendu) + Phase B (Wikidata SPARQL).
                Les liens externes pointent vers les bases de données de référence.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {wikidataQid && (
                <a
                  href={`https://www.wikidata.org/wiki/${wikidataQid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-600 hover:underline flex items-center gap-1"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {wikidataQid}
                </a>
              )}
              {wikidataQid && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => enrichMutation.mutate({ moleculeId })}
                  disabled={enrichMutation.isPending}
                  className="text-xs"
                >
                  {enrichMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  )}
                  Actualiser KG
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Chargement */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
            <span className="ml-3 text-muted-foreground">Chargement du Knowledge Graph…</span>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error.message}</p>
          </div>
        )}

        {/* Pas de données KG — proposer l'enrichissement */}
        {!isLoading && !error && !kg && (
          <div className="bg-muted/30 border border-dashed border-border rounded-lg p-8 text-center space-y-4">
            <Network className="h-10 w-10 text-muted-foreground mx-auto" />
            <div>
              <p className="font-medium text-foreground">Knowledge Graph non encore enrichi</p>
              <p className="text-sm text-muted-foreground mt-1">
                {wikidataQid
                  ? `Cette molécule possède un QID Wikidata (${wikidataQid}) mais n'a pas encore été enrichie via SPARQL.`
                  : "Cette molécule n'a pas encore de QID Wikidata. Utilisez l'outil d'enrichissement QID dans l'administration."}
              </p>
            </div>
            {wikidataQid && (
              <Button
                onClick={() => enrichMutation.mutate({ moleculeId })}
                disabled={enrichMutation.isPending}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {enrichMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Network className="h-4 w-4 mr-2" />
                )}
                Enrichir via Wikidata SPARQL
              </Button>
            )}
            {!wikidataQid && (
              <Link href="/admin/molecule-qid-enrichment">
                <Button variant="outline" className="text-xs">
                  <Database className="h-3.5 w-3.5 mr-1.5" />
                  Aller à l'enrichissement QID
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Données KG disponibles */}
        {kg && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ── Colonne gauche ── */}
            <div className="space-y-6">
              {/* Classification chimique */}
              {(kg.classes?.length > 0 || kg.subclasses?.length > 0 || kg.skeletons?.length > 0 || skeletonData?.skeleton) && (
                <div className="bg-card p-5 rounded-lg border shadow-sm space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Atom className="h-4 w-4 text-violet-600" />
                    Classification chimique
                  </h3>
                  <EntityList
                    items={kg.classes || []}
                    icon={Atom}
                    label="Classes (P31)"
                    colorClass="bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
                  />
                  <EntityList
                    items={kg.subclasses || []}
                    icon={Atom}
                    label="Sous-classes (P279)"
                    colorClass="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                  />
                  {/* Squelettes terpéniques — badges colorés */}
                  {(kg.skeletons?.length > 0 || skeletonData?.skeleton) && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                        <Atom className="h-4 w-4 text-indigo-600" />
                        Squelette terpénique
                        {skeletonData?.source && (
                          <span className="text-xs text-muted-foreground font-normal">
                            ({skeletonData.source === "name" ? "détecté par nom" : skeletonData.source === "chemical_family" ? "famille chimique" : "Wikidata"})
                          </span>
                        )}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(kg.skeletons || []).map(sk => (
                          <SkeletonBadge key={sk.qid} skeleton={sk} />
                        ))}
                        {skeletonData?.skeleton && !kg.skeletons?.some(s => s.qid === skeletonData.skeleton!.qid) && (
                          <SkeletonBadge skeleton={skeletonData.skeleton} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Biosynthèse & Chiralité */}
              {(kg.biosynthesisPathways?.length > 0 || kg.chirality?.length > 0) && (
                <div className="bg-card p-5 rounded-lg border shadow-sm space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-600" />
                    Biosynthèse & Stéréochimie
                  </h3>
                  <EntityList
                    items={kg.biosynthesisPathways || []}
                    icon={Zap}
                    label="Voies de biosynthèse"
                    colorClass="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  />
                  <EntityList
                    items={kg.chirality || []}
                    icon={Atom}
                    label="Chiralité"
                    colorClass="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                  />
                </div>
              )}

              {/* Molécules parentes / dérivées / isomères */}
              {(kg.parentMolecules?.length > 0 || kg.derivedMolecules?.length > 0 || kg.isomers?.length > 0) && (
                <div className="bg-card p-5 rounded-lg border shadow-sm space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Network className="h-4 w-4 text-cyan-600" />
                    Relations moléculaires
                  </h3>
                  <EntityList
                    items={kg.parentMolecules || []}
                    icon={Network}
                    label="Molécules parentes"
                    colorClass="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300"
                  />
                  <EntityList
                    items={kg.derivedMolecules || []}
                    icon={Network}
                    label="Molécules dérivées"
                    colorClass="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
                  />
                  <EntityList
                    items={kg.isomers || []}
                    icon={Atom}
                    label="Isomères"
                    colorClass="bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300"
                  />
                </div>
              )}

              {/* Odeurs & Usages */}
              {(kg.odors?.length > 0 || kg.uses?.length > 0) && (
                <div className="bg-card p-5 rounded-lg border shadow-sm space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-rose-500" />
                    Profil olfactif & Usages
                  </h3>
                  <EntityList
                    items={kg.odors || []}
                    icon={Droplets}
                    label="Odeurs (Wikidata)"
                    colorClass="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                  />
                  <EntityList
                    items={kg.uses || []}
                    icon={FlaskConical}
                    label="Usages en parfumerie"
                    colorClass="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
                  />
                </div>
              )}
            </div>

            {/* ── Colonne droite ── */}
            <div className="space-y-6">
              {/* Organismes producteurs — avec résolution vers fiches plantes PERFUMUM */}
              {kg.producingOrganisms?.length > 0 && (
                <div className="bg-card p-5 rounded-lg border shadow-sm">
                  <h3 className="font-semibold text-base flex items-center gap-2 mb-3">
                    <Leaf className="h-4 w-4 text-emerald-600" />
                    Organismes producteurs
                    <Badge variant="secondary" className="text-xs">{kg.producingOrganisms.length}</Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Badges <span className="text-emerald-700 dark:text-emerald-400 font-medium">verts</span> = fiche plante PERFUMUM disponible.
                    Autres = lien Wikidata direct.
                  </p>
                  <ProducingOrganismsList organisms={kg.producingOrganisms} />
                </div>
              )}

              {/* Huiles essentielles & Résines */}
              {(kg.essentialOils?.length > 0 || kg.resins?.length > 0) && (
                <div className="bg-card p-5 rounded-lg border shadow-sm space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-amber-500" />
                    Huiles essentielles & Résines
                  </h3>
                  <EntityList
                    items={kg.essentialOils || []}
                    icon={Droplets}
                    label="Huiles essentielles"
                    colorClass="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  />
                  <EntityList
                    items={kg.resins || []}
                    icon={Droplets}
                    label="Résines"
                    colorClass="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                  />
                </div>
              )}

              {/* Identifiants croisés */}
              {kg.identifiers && Object.keys(kg.identifiers).length > 0 && (
                <div className="bg-card p-5 rounded-lg border shadow-sm">
                  <h3 className="font-semibold text-base flex items-center gap-2 mb-4">
                    <Database className="h-4 w-4 text-blue-600" />
                    Identifiants croisés
                  </h3>
                  <div className="space-y-0.5">
                    {kg.identifiers.cas && (
                      <IdentifierLink
                        label="CAS"
                        value={kg.identifiers.cas}
                        href={`https://commonchemistry.cas.org/detail?cas_rn=${kg.identifiers.cas}`}
                      />
                    )}
                    {(kg.identifiers.pubchem || kg.identifiers.pubchemCid) && (
                      <IdentifierLink
                        label="PubChem CID"
                        value={(kg.identifiers.pubchem || kg.identifiers.pubchemCid)!}
                        href={`https://pubchem.ncbi.nlm.nih.gov/compound/${kg.identifiers.pubchem || kg.identifiers.pubchemCid}`}
                      />
                    )}
                    {kg.identifiers.chebi && (
                      <IdentifierLink
                        label="ChEBI"
                        value={kg.identifiers.chebi}
                        href={`https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${kg.identifiers.chebi}`}
                      />
                    )}
                    {kg.identifiers.chemspider && (
                      <IdentifierLink
                        label="ChemSpider"
                        value={kg.identifiers.chemspider}
                        href={`https://www.chemspider.com/Chemical-Structure.${kg.identifiers.chemspider}.html`}
                      />
                    )}
                    {kg.identifiers.nist && (
                      <IdentifierLink
                        label="NIST"
                        value={kg.identifiers.nist}
                        href={`https://webbook.nist.gov/cgi/cbook.cgi?ID=${kg.identifiers.nist}`}
                      />
                    )}
                    {kg.identifiers.hmdb && (
                      <IdentifierLink
                        label="HMDB"
                        value={kg.identifiers.hmdb}
                        href={`https://hmdb.ca/metabolites/${kg.identifiers.hmdb}`}
                      />
                    )}
                    {kg.identifiers.kegg && (
                      <IdentifierLink
                        label="KEGG"
                        value={kg.identifiers.kegg}
                        href={`https://www.genome.jp/entry/${kg.identifiers.kegg}`}
                      />
                    )}
                    {kg.identifiers.dsstox && (
                      <IdentifierLink
                        label="DSSTox"
                        value={kg.identifiers.dsstox}
                        href={`https://comptox.epa.gov/dashboard/chemical/details/${kg.identifiers.dsstox}`}
                      />
                    )}
                    {(kg.identifiers.inchikey || kg.identifiers.inchiKey) && (
                      <CopyableValue label="InChIKey" value={(kg.identifiers.inchikey || kg.identifiers.inchiKey)!} />
                    )}
                    {kg.identifiers.inchi && (
                      <CopyableValue label="InChI" value={kg.identifiers.inchi} />
                    )}
                    {kg.identifiers.smiles && (
                      <CopyableValue label="SMILES" value={kg.identifiers.smiles} />
                    )}
                    {kg.identifiers.formula && (
                      <CopyableValue label="Formule brute" value={kg.identifiers.formula} />
                    )}
                    {kg.identifiers.mw && (
                      <CopyableValue label="Masse mol. (g/mol)" value={kg.identifiers.mw} />
                    )}
                  </div>
                </div>
              )}

              {/* Propriétés physicochimiques */}
              {kg.physicochemical && Object.values(kg.physicochemical).some(v => v !== undefined && v !== null) && (
                <div className="bg-card p-5 rounded-lg border shadow-sm">
                  <h3 className="font-semibold text-base flex items-center gap-2 mb-4">
                    <FlaskConical className="h-4 w-4 text-indigo-600" />
                    Propriétés physicochimiques
                    <span className="text-xs text-muted-foreground font-normal">(PubChem)</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {kg.physicochemical.xlogp !== undefined && kg.physicochemical.xlogp !== null && (
                      <div className="bg-muted/40 rounded-md p-3 text-center">
                        <div className="text-lg font-bold text-indigo-600">{kg.physicochemical.xlogp}</div>
                        <div className="text-xs text-muted-foreground">XLogP (lipophilie)</div>
                      </div>
                    )}
                    {kg.physicochemical.tpsa !== undefined && kg.physicochemical.tpsa !== null && (
                      <div className="bg-muted/40 rounded-md p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">{kg.physicochemical.tpsa} Å²</div>
                        <div className="text-xs text-muted-foreground">TPSA</div>
                      </div>
                    )}
                    {kg.physicochemical.exactMass !== undefined && kg.physicochemical.exactMass !== null && (
                      <div className="bg-muted/40 rounded-md p-3 text-center">
                        <div className="text-lg font-bold text-emerald-600">{kg.physicochemical.exactMass}</div>
                        <div className="text-xs text-muted-foreground">Masse exacte (g/mol)</div>
                      </div>
                    )}
                    {kg.physicochemical.heavyAtomCount !== undefined && kg.physicochemical.heavyAtomCount !== null && (
                      <div className="bg-muted/40 rounded-md p-3 text-center">
                        <div className="text-lg font-bold text-slate-600">{kg.physicochemical.heavyAtomCount}</div>
                        <div className="text-xs text-muted-foreground">Atomes lourds</div>
                      </div>
                    )}
                    {kg.physicochemical.hBondDonorCount !== undefined && kg.physicochemical.hBondDonorCount !== null && (
                      <div className="bg-muted/40 rounded-md p-3 text-center">
                        <div className="text-lg font-bold text-rose-600">{kg.physicochemical.hBondDonorCount}</div>
                        <div className="text-xs text-muted-foreground">Donneurs H</div>
                      </div>
                    )}
                    {kg.physicochemical.hBondAcceptorCount !== undefined && kg.physicochemical.hBondAcceptorCount !== null && (
                      <div className="bg-muted/40 rounded-md p-3 text-center">
                        <div className="text-lg font-bold text-cyan-600">{kg.physicochemical.hBondAcceptorCount}</div>
                        <div className="text-xs text-muted-foreground">Accepteurs H</div>
                      </div>
                    )}
                    {kg.physicochemical.rotatableBondCount !== undefined && kg.physicochemical.rotatableBondCount !== null && (
                      <div className="bg-muted/40 rounded-md p-3 text-center">
                        <div className="text-lg font-bold text-amber-600">{kg.physicochemical.rotatableBondCount}</div>
                        <div className="text-xs text-muted-foreground">Liaisons rotatives</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Liens Wikidata */}
              {wikidataQid && (
                <div className="bg-muted/20 border border-dashed border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-3 font-medium">Liens de référence</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`https://www.wikidata.org/wiki/${wikidataQid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
                    >
                      <Globe className="h-3 w-3" /> Wikidata
                    </a>
                    <a
                      href={`https://query.wikidata.org/#SELECT%20%3Fp%20%3FpLabel%20%3Fo%20%3FoLabel%20WHERE%20%7B%20wd%3A${wikidataQid}%20%3Fp%20%3Fo%20.%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22fr%2Cen%22.%20%7D%20%7D%20LIMIT%2050`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
                    >
                      <BookOpen className="h-3 w-3" /> SPARQL Explorer
                    </a>
                    {(kg.identifiers?.pubchem || kg.identifiers?.pubchemCid) && (
                      <a
                        href={`https://pubchem.ncbi.nlm.nih.gov/compound/${kg.identifiers.pubchem || kg.identifiers.pubchemCid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
                      >
                        <Database className="h-3 w-3" /> PubChem
                      </a>
                    )}
                    {kg.identifiers?.chebi && (
                      <a
                        href={`https://www.ebi.ac.uk/chebi/searchId.do?chebiId=${kg.identifiers.chebi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
                      >
                        <Database className="h-3 w-3" /> ChEBI
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </TabErrorBoundary>
    </TabsContent>
  );
}
