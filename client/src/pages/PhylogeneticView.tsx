import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TreePine, Leaf, FlaskConical, Search, ChevronDown, ChevronRight, Dna, Network, AlertCircle, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Link } from "wouter";

// ─── Famille → Super-famille ──────────────────────────────────────────────────
const SF_COLORS: Record<string, string> = {
  'Asterids': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Rosids': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'Monocots': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Magnoliids': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Gymnosperms': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Other': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};
const FAM_CLASS: Record<string, string> = {
  'Lamiaceae': 'Asterids', 'Solanaceae': 'Asterids', 'Oleaceae': 'Asterids', 'Apocynaceae': 'Asterids',
  'Rubiaceae': 'Asterids', 'Asteraceae': 'Asterids', 'Verbenaceae': 'Asterids', 'Convolvulaceae': 'Asterids',
  'Fabaceae': 'Rosids', 'Rosaceae': 'Rosids', 'Cannabaceae': 'Rosids', 'Moraceae': 'Rosids',
  'Rutaceae': 'Rosids', 'Anacardiaceae': 'Rosids', 'Burseraceae': 'Rosids', 'Meliaceae': 'Rosids',
  'Sapindaceae': 'Rosids', 'Malvaceae': 'Rosids', 'Myrtaceae': 'Rosids', 'Geraniaceae': 'Rosids',
  'Euphorbiaceae': 'Rosids', 'Salicaceae': 'Rosids',
  'Poaceae': 'Monocots', 'Orchidaceae': 'Monocots', 'Zingiberaceae': 'Monocots', 'Asparagaceae': 'Monocots',
  'Amaryllidaceae': 'Monocots', 'Arecaceae': 'Monocots', 'Iridaceae': 'Monocots',
  'Lauraceae': 'Magnoliids', 'Myristicaceae': 'Magnoliids', 'Annonaceae': 'Magnoliids',
  'Piperaceae': 'Magnoliids', 'Magnoliaceae': 'Magnoliids', 'Aristolochiaceae': 'Magnoliids',
  'Pinaceae': 'Gymnosperms', 'Cupressaceae': 'Gymnosperms', 'Taxaceae': 'Gymnosperms', 'Podocarpaceae': 'Gymnosperms',
  'Apiaceae': 'Other', 'Ranunculaceae': 'Other', 'Papaveraceae': 'Other', 'Santalaceae': 'Other',
  'Dipterocarpaceae': 'Other', 'Styracaceae': 'Other', 'Thymelaeaceae': 'Other', 'Cistaceae': 'Other',
};
const FAM_MOLS: Record<string, string[]> = {
  'Lamiaceae': ['Linalool', 'Thymol', 'Carvacrol', 'Menthol'],
  'Solanaceae': ['Nicotine', 'Solanesol', 'Capsaicin'],
  'Cannabaceae': ['THC', 'CBD', 'Myrcene', 'β-Caryophyllene'],
  'Burseraceae': ['α-Pinene', 'Limonene', 'Incensole'],
  'Rutaceae': ['Limonene', 'Citral', 'Bergamottin'],
  'Lauraceae': ['Cinnamaldehyde', 'Eugenol', 'Camphor'],
  'Myristicaceae': ['Myristicin', 'Elemicin', 'Safrole'],
  'Pinaceae': ['α-Pinene', 'β-Pinene', 'Limonene'],
  'Cupressaceae': ['α-Cedrene', 'Cedrol', 'Thujone'],
  'Zingiberaceae': ['Zingiberene', 'Curcumin', 'Gingerol'],
  'Asteraceae': ['Chamazulene', 'α-Bisabolol', 'Artemisinin'],
  'Apiaceae': ['Anethole', 'Fenchone', 'Apiole'],
  'Fabaceae': ['Coumarin', 'Isoflavones'],
  'Santalaceae': ['α-Santalol', 'β-Santalol'],
  'Poaceae': ['Citronellol', 'Geraniol', 'Vetiverol'],
  'Rosaceae': ['Benzaldehyde', 'Citronellol', 'Geraniol'],
  'Orchidaceae': ['Vanillin', 'Vanillic acid'],
  'Oleaceae': ['Oleuropein', 'Jasmine lactone'],
  'Styracaceae': ['Benzoin', 'Cinnamic acid'],
  'Cistaceae': ['Labdanum', 'Sclareol', 'Ambroxide'],
};

interface FD { family: string; count: number; categories: { category: string; count: number }[]; }

// ─── FamilyCard ───────────────────────────────────────────────────────────────
function FamilyCard({ family, data, isExpanded, onToggle }: { family: string; data: FD; isExpanded: boolean; onToggle: () => void; }) {
  const sf = FAM_CLASS[family] || 'Other', cc = SF_COLORS[sf], mols = FAM_MOLS[family] || [];
  return (
    <Card className={`border ${cc} bg-card/50 backdrop-blur transition-all hover:bg-card/70`}>
      <CardHeader className="pb-2 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <div>
              <CardTitle className="text-lg flex items-center gap-2"><Leaf className="h-4 w-4" />{family}</CardTitle>
              <CardDescription className="text-xs mt-1">{sf} · {data.count} plantes</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={cc}>{data.count}</Badge>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Catégories</h4>
            <div className="flex flex-wrap gap-1">{data.categories.map(cat => <Badge key={cat.category} variant="secondary" className="text-xs">{cat.category}: {cat.count}</Badge>)}</div>
          </div>
          {mols.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1"><FlaskConical className="h-3 w-3" />Molécules caractéristiques</h4>
              <div className="flex flex-wrap gap-1">{mols.map(mol => <Badge key={mol} variant="outline" className="text-xs bg-primary/10">{mol}</Badge>)}</div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ─── PhylogeneticTree (familles) ──────────────────────────────────────────────
function PhylogeneticTree({ families }: { families: FD[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const grouped = useMemo(() => {
    const g: Record<string, FD[]> = {};
    families.forEach(f => { const sf = FAM_CLASS[f.family] || 'Other'; if (!g[sf]) g[sf] = []; g[sf].push(f); });
    Object.values(g).forEach(arr => arr.sort((a, b) => b.count - a.count));
    return g;
  }, [families]);
  const toggle = (f: string) => setExpanded(prev => { const n = new Set(prev); if (n.has(f)) n.delete(f); else n.add(f); return n; });
  return (
    <div className="space-y-6">
      {['Rosids', 'Asterids', 'Magnoliids', 'Monocots', 'Gymnosperms', 'Other'].map(sf => {
        const fams = grouped[sf];
        if (!fams || fams.length === 0) return null;
        const total = fams.reduce((s, f) => s + f.count, 0), cc = SF_COLORS[sf];
        return (
          <div key={sf} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${cc.split(' ')[0]}`} />
              <h3 className="text-lg font-semibold">{sf}</h3>
              <Badge variant="outline" className="text-xs">{fams.length} familles · {total} plantes</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pl-6 border-l-2 border-border/50">
              {fams.map(f => <FamilyCard key={f.family} family={f.family} data={f} isExpanded={expanded.has(f.family)} onToggle={() => toggle(f.family)} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MoleculeDistribution ─────────────────────────────────────────────────────
function MoleculeDistribution({ families }: { families: FD[] }) {
  const data = useMemo(() => {
    const d: Record<string, { families: string[]; count: number }> = {};
    families.forEach(f => { (FAM_MOLS[f.family] || []).forEach(m => { if (!d[m]) d[m] = { families: [], count: 0 }; d[m].families.push(f.family); d[m].count += f.count; }); });
    return Object.entries(d).map(([n, i]) => ({ name: n, ...i })).sort((a, b) => b.families.length - a.families.length);
  }, [families]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.slice(0, 18).map(m => (
        <Card key={m.name} className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><FlaskConical className="h-4 w-4 text-primary" />{m.name}</CardTitle>
            <CardDescription className="text-xs">Présent dans {m.families.length} familles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {m.families.slice(0, 5).map(fam => <Badge key={fam} variant="outline" className={`text-xs ${SF_COLORS[FAM_CLASS[fam] || 'Other']}`}>{fam}</Badge>)}
              {m.families.length > 5 && <Badge variant="secondary" className="text-xs">+{m.families.length - 5}</Badge>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats({ families }: { families: FD[] }) {
  const s = useMemo(() => {
    const total = families.reduce((s, f) => s + f.count, 0);
    const bySF: Record<string, { families: number; plants: number }> = {};
    families.forEach(f => { const sf = FAM_CLASS[f.family] || 'Other'; if (!bySF[sf]) bySF[sf] = { families: 0, plants: 0 }; bySF[sf].families++; bySF[sf].plants += f.count; });
    const top = [...families].sort((a, b) => b.count - a.count).slice(0, 5);
    return { total, count: families.length, bySF, top };
  }, [families]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-primary/20 to-primary/5"><CardHeader className="pb-2"><CardDescription>Total Plantes</CardDescription><CardTitle className="text-3xl">{s.total}</CardTitle></CardHeader></Card>
      <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5"><CardHeader className="pb-2"><CardDescription>Familles Botaniques</CardDescription><CardTitle className="text-3xl">{s.count}</CardTitle></CardHeader></Card>
      <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5"><CardHeader className="pb-2"><CardDescription>Super-Familles</CardDescription><CardTitle className="text-3xl">{Object.keys(s.bySF).length}</CardTitle></CardHeader></Card>
      <Card className="bg-gradient-to-br from-amber-500/20 to-amber-500/5"><CardHeader className="pb-2"><CardDescription>Top Famille</CardDescription><CardTitle className="text-xl">{s.top[0]?.family || '-'}</CardTitle><p className="text-xs text-muted-foreground">{s.top[0]?.count || 0} plantes</p></CardHeader></Card>
    </div>
  );
}

// ─── Conservation color helper ────────────────────────────────────────────────
const CONSERVATION_COLORS: Record<string, string> = {
  'CR': 'bg-red-500/20 text-red-300 border-red-500/40',
  'EN': 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  'VU': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  'NT': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  'LC': 'bg-green-500/20 text-green-300 border-green-500/40',
  'DD': 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  'NE': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

// ─── VarietyTreeNode ──────────────────────────────────────────────────────────
function VarietyTreeNode({ node, depth = 0 }: { node: any; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const cc = CONSERVATION_COLORS[node.conservationStatus] || 'bg-card/50 border-border';
  return (
    <div style={{ marginLeft: depth * 20 }}>
      <div className={`flex items-start gap-2 p-2 rounded-md border mb-1 ${cc} transition-colors hover:opacity-90`}>
        {hasChildren ? (
          <button onClick={() => setOpen(o => !o)} className="mt-0.5 shrink-0">
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <div className="w-4 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {node.id ? (
              <Link href={`/varietes/${node.id}`} className="font-semibold text-sm hover:text-primary hover:underline transition-colors flex items-center gap-1 group">
                {node.name}
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
              </Link>
            ) : (
              <span className="font-semibold text-sm">{node.name}</span>
            )}
            {node.latinName && <span className="text-xs italic text-muted-foreground">{node.latinName}</span>}
            {node.type && <Badge variant="outline" className="text-xs">{node.type}</Badge>}
            {node.conservationStatus && (
              <Badge variant="outline" className={`text-xs ${cc}`}>{node.conservationStatus}</Badge>
            )}
            {node.yearRegistered && <span className="text-xs text-muted-foreground">{node.yearRegistered}</span>}
          </div>
          {node.breeder && <p className="text-xs text-muted-foreground mt-0.5">Obtenteur : {node.breeder}</p>}
          {node.relationshipType && depth > 0 && (
            <span className="text-xs text-primary/70">↳ {node.relationshipType}</span>
          )}
          {node.dominantMolecules && node.dominantMolecules.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {node.dominantMolecules.slice(0, 3).map((m: any) => (
                <span key={m.molecule} className="text-xs bg-primary/10 text-primary/80 px-1.5 py-0.5 rounded-full">
                  {m.molecule}{m.percentage ? ` ${m.percentage}%` : ''}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {hasChildren && open && (
        <div className="border-l border-border/40 ml-4 pl-2">
          {node.children.map((child: any) => (
            <VarietyTreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── GenreTreeView ────────────────────────────────────────────────────────────
function GenreTreeView() {
  const { data: generaData, isLoading: generaLoading } = trpc.phylogeny.getAvailableGenera.useQuery();

  // Build unique genus list from available data
  const genusList = useMemo(() => {
    if (!generaData) return [];
    const seen = new Set<string>();
    const result: { genus: string; species: string | null; latinName: string | null; varietyCount: number }[] = [];
    for (const g of generaData) {
      if (g.genus && !seen.has(g.genus)) {
        seen.add(g.genus);
        result.push(g as any);
      }
    }
    return result.sort((a, b) => (b.varietyCount ?? 0) - (a.varietyCount ?? 0));
  }, [generaData]);

  const [selectedGenus, setSelectedGenus] = useState<string>("");
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");

  // Species list for selected genus
  const speciesList = useMemo(() => {
    if (!generaData || !selectedGenus) return [];
    return generaData
      .filter((g: any) => g.genus === selectedGenus && g.species)
      .sort((a: any, b: any) => (b.varietyCount ?? 0) - (a.varietyCount ?? 0));
  }, [generaData, selectedGenus]);

  const validGenus = genusList.map(g => g.genus) as ("Nicotiana" | "Cannabis" | "Rosa" | "Lavandula")[];
  const isValidGenus = (g: string): g is "Nicotiana" | "Cannabis" | "Rosa" | "Lavandula" =>
    ["Nicotiana", "Cannabis", "Rosa", "Lavandula"].includes(g);

  const { data: treeData, isLoading: treeLoading, error: treeError } = trpc.phylogeny.getPhylogeneticTree.useQuery(
    {
      genus: (selectedGenus || "Nicotiana") as "Nicotiana" | "Cannabis" | "Rosa" | "Lavandula",
      species: selectedSpecies || undefined,
      layout: "tree",
    },
    { enabled: !!selectedGenus && isValidGenus(selectedGenus) }
  );

  if (generaLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!generaData || generaData.length === 0) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Aucun genre avec variétés documentées.</p>
        <p className="text-xs text-muted-foreground mt-1">Ajoutez des variétés via <strong>/admin/plant-varieties</strong>.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sélecteur genre + espèce */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Genre</label>
          <Select value={selectedGenus} onValueChange={v => { setSelectedGenus(v); setSelectedSpecies(""); }}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un genre…" />
            </SelectTrigger>
            <SelectContent>
              {genusList.map(g => (
                <SelectItem key={g.genus} value={g.genus!}>
                  <span className="font-medium italic">{g.genus}</span>
                  <span className="text-muted-foreground ml-2 text-xs">({g.varietyCount} variétés)</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {speciesList.length > 1 && (
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Espèce (optionnel)</label>
            <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les espèces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les espèces</SelectItem>
                {speciesList.map((s: any) => (
                  <SelectItem key={s.latinName} value={s.species ?? ""}>
                    <span className="italic">{s.latinName}</span>
                    <span className="text-muted-foreground ml-2 text-xs">({s.varietyCount} variétés)</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Résumé des genres disponibles */}
      {!selectedGenus && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {genusList.map(g => (
            <Card
              key={g.genus}
              className="p-3 cursor-pointer hover:bg-accent/50 transition-colors border-border/60"
              onClick={() => setSelectedGenus(g.genus!)}
            >
              <p className="font-semibold italic text-sm">{g.genus}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{g.varietyCount} variétés</p>
            </Card>
          ))}
        </div>
      )}

      {/* Arbre */}
      {selectedGenus && (
        <>
          {treeLoading && (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          )}

          {treeError && (
            <Card className="p-6 border-destructive/40 bg-destructive/10">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Erreur de chargement</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{treeError.message}</p>
            </Card>
          )}

          {treeData && !treeLoading && (
            <div className="space-y-4">
              {/* Stats du genre */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="p-3 bg-primary/10">
                  <p className="text-xs text-muted-foreground">Variétés</p>
                  <p className="text-2xl font-bold">{treeData.totalVarieties}</p>
                </Card>
                <Card className="p-3 bg-green-500/10">
                  <p className="text-xs text-muted-foreground">Cultivars</p>
                  <p className="text-2xl font-bold">{treeData.stats.cultivars}</p>
                </Card>
                <Card className="p-3 bg-blue-500/10">
                  <p className="text-xs text-muted-foreground">Hybrides</p>
                  <p className="text-2xl font-bold">{treeData.stats.hybrids}</p>
                </Card>
                <Card className="p-3 bg-red-500/10">
                  <p className="text-xs text-muted-foreground">Critiques</p>
                  <p className="text-2xl font-bold">{treeData.stats.conservationCritical}</p>
                </Card>
              </div>

              {/* Arbre des variétés */}
              {treeData.rootNodes.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">Aucune variété trouvée pour <em>{selectedGenus} {selectedSpecies}</em>.</p>
                </Card>
              ) : (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Network className="h-4 w-4 text-primary" />
                    Arbre des variétés — <em className="font-normal">{selectedGenus} {selectedSpecies}</em>
                  </h3>
                  <div className="space-y-1">
                    {treeData.rootNodes.map((node: any) => (
                      <VarietyTreeNode key={node.id} node={node} depth={0} />
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PhylogeneticView() {
  const [search, setSearch] = useState(""), [sf, setSf] = useState<string>("all");
  const { data, isLoading } = trpc.plants.getFamiliesWithCategories.useQuery();
  const filtered = useMemo(() => {
    if (!data) return [];
    let f = data;
    if (search) { const q = search.toLowerCase(); f = f.filter(x => x.family.toLowerCase().includes(q) || (FAM_MOLS[x.family] || []).some(m => m.toLowerCase().includes(q))); }
    if (sf !== "all") f = f.filter(x => (FAM_CLASS[x.family] || 'Other') === sf);
    return f;
  }, [data, search, sf]);

  if (isLoading) return (
    <div className="container py-8">
      <Breadcrumbs />
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      </div>
    </div>
  );

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Dna className="h-8 w-8 text-primary" />Classification Phylogénétique
        </h1>
        <p className="text-muted-foreground">
          Exploration des relations évolutives entre familles botaniques, genres et variétés
        </p>
      </div>

      <Tabs defaultValue="tree" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="tree" className="flex items-center gap-2">
            <TreePine className="h-4 w-4" />Arbre par Familles
          </TabsTrigger>
          <TabsTrigger value="molecules" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />Distribution Moléculaire
          </TabsTrigger>
          <TabsTrigger value="genus" className="flex items-center gap-2">
            <Network className="h-4 w-4" />Arbre par Genre
          </TabsTrigger>
        </TabsList>

        {/* Onglet Familles */}
        <TabsContent value="tree" className="space-y-6">
          <Stats families={filtered} />
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher une famille ou molécule..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={sf} onValueChange={setSf}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Super-famille" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les super-familles</SelectItem>
                <SelectItem value="Rosids">Rosids</SelectItem>
                <SelectItem value="Asterids">Asterids</SelectItem>
                <SelectItem value="Magnoliids">Magnoliids</SelectItem>
                <SelectItem value="Monocots">Monocots</SelectItem>
                <SelectItem value="Gymnosperms">Gymnosperms</SelectItem>
                <SelectItem value="Other">Autres</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <PhylogeneticTree families={filtered} />
        </TabsContent>

        {/* Onglet Molécules */}
        <TabsContent value="molecules">
          <MoleculeDistribution families={filtered} />
        </TabsContent>

        {/* Onglet Genre */}
        <TabsContent value="genus">
          <GenreTreeView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
