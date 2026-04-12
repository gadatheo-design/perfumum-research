/**
 * PhylogeneticView.tsx — Swiss Modern redesign
 * Améliorations : hero avec sunburst radial SVG, FamilyCards enrichies avec liens,
 * StatsBar avec icônes, MoleculeDistribution avec recherche, bouton Tout développer
 */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  TreePine, Leaf, FlaskConical, Search, ChevronDown, ChevronRight,
  Dna, Network, AlertCircle, ExternalLink, ArrowRight, Microscope,
  Globe, Layers, ScanLine
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Link } from "wouter";

// ─── Couleurs super-familles ──────────────────────────────────────────────────
const SF_COLORS: Record<string, { badge: string; dot: string; bg: string; border: string; text: string }> = {
  'Asterids':    { badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30', dot: 'bg-purple-400',  bg: 'from-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-300' },
  'Rosids':      { badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',       dot: 'bg-rose-400',    bg: 'from-rose-500/10',   border: 'border-rose-500/20',   text: 'text-rose-300' },
  'Monocots':    { badge: 'bg-green-500/20 text-green-300 border-green-500/30',    dot: 'bg-green-400',   bg: 'from-green-500/10',  border: 'border-green-500/20',  text: 'text-green-300' },
  'Magnoliids':  { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',    dot: 'bg-amber-400',   bg: 'from-amber-500/10',  border: 'border-amber-500/20',  text: 'text-amber-300' },
  'Gymnosperms': { badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',       dot: 'bg-cyan-400',    bg: 'from-cyan-500/10',   border: 'border-cyan-500/20',   text: 'text-cyan-300' },
  'Other':       { badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30',    dot: 'bg-slate-400',   bg: 'from-slate-500/10',  border: 'border-slate-500/20',  text: 'text-slate-300' },
};
const SF_ORDER = ['Rosids', 'Asterids', 'Magnoliids', 'Monocots', 'Gymnosperms', 'Other'];

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
  'Lamiaceae': ['Linalool', 'Thymol', 'Carvacrol', 'Menthol', 'Rosmarinic acid'],
  'Solanaceae': ['Nicotine', 'Solanesol', 'Capsaicin', 'Solanine'],
  'Cannabaceae': ['THC', 'CBD', 'Myrcene', 'β-Caryophyllene', 'Linalool'],
  'Burseraceae': ['α-Pinene', 'Limonene', 'Incensole', 'Boswellic acid'],
  'Rutaceae': ['Limonene', 'Citral', 'Bergamottin', 'Bergapten', 'Linalool'],
  'Lauraceae': ['Cinnamaldehyde', 'Eugenol', 'Camphor', 'Linalool'],
  'Myristicaceae': ['Myristicin', 'Elemicin', 'Safrole', 'Eugenol'],
  'Pinaceae': ['α-Pinene', 'β-Pinene', 'Limonene', 'Bornyl acetate'],
  'Cupressaceae': ['α-Cedrene', 'Cedrol', 'Thujone', 'Sabinene'],
  'Zingiberaceae': ['Zingiberene', 'Curcumin', 'Gingerol', '6-Shogaol'],
  'Asteraceae': ['Chamazulene', 'α-Bisabolol', 'Artemisinin', 'Parthenolide'],
  'Apiaceae': ['Anethole', 'Fenchone', 'Apiole', 'Carvone'],
  'Fabaceae': ['Coumarin', 'Isoflavones', 'Genistein'],
  'Santalaceae': ['α-Santalol', 'β-Santalol', 'Santalene'],
  'Poaceae': ['Citronellol', 'Geraniol', 'Vetiverol', 'Khusimol'],
  'Rosaceae': ['Benzaldehyde', 'Citronellol', 'Geraniol', 'Rose oxide'],
  'Orchidaceae': ['Vanillin', 'Vanillic acid', 'Glucovanillin'],
  'Oleaceae': ['Oleuropein', 'Jasmine lactone', 'Benzyl acetate'],
  'Styracaceae': ['Benzoin', 'Cinnamic acid', 'Styrene'],
  'Cistaceae': ['Labdanum', 'Sclareol', 'Ambroxide', 'Ledol'],
};

interface FD { family: string; count: number; categories: { category: string; count: number }[]; }

// ─── Radial Sunburst SVG ──────────────────────────────────────────────────────
function RadialSunburst({ families }: { families: FD[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const grouped = useMemo(() => {
    const g: Record<string, FD[]> = {};
    families.forEach(f => { const sf = FAM_CLASS[f.family] || 'Other'; if (!g[sf]) g[sf] = []; g[sf].push(f); });
    return g;
  }, [families]);
  const total = families.reduce((s, f) => s + f.count, 0);
  if (total === 0) return null;
  const cx = 200, cy = 200, r1 = 60, r2 = 120, r3 = 175;
  const sfColors: Record<string, string> = {
    'Rosids': '#f87171', 'Asterids': '#a78bfa', 'Magnoliids': '#fbbf24',
    'Monocots': '#4ade80', 'Gymnosperms': '#22d3ee', 'Other': '#94a3b8',
  };
  const arcs: { path: string; sf: string; family?: string; count: number; label: string }[] = [];
  let sfAngle = -Math.PI / 2;
  const sfTotals = SF_ORDER.map(sf => ({
    sf, fams: grouped[sf] || [],
    total: (grouped[sf] || []).reduce((s, f) => s + f.count, 0),
  })).filter(x => x.total > 0);
  sfTotals.forEach(({ sf, fams, total: sfTotal }) => {
    const sfSpan = (sfTotal / total) * 2 * Math.PI;
    const sfStart = sfAngle, sfEnd = sfAngle + sfSpan;
    const x1 = cx + r1 * Math.cos(sfStart), y1 = cy + r1 * Math.sin(sfStart);
    const x2 = cx + r1 * Math.cos(sfEnd),   y2 = cy + r1 * Math.sin(sfEnd);
    const x3 = cx + r2 * Math.cos(sfEnd),   y3 = cy + r2 * Math.sin(sfEnd);
    const x4 = cx + r2 * Math.cos(sfStart), y4 = cy + r2 * Math.sin(sfStart);
    const lg = sfSpan > Math.PI ? 1 : 0;
    arcs.push({ path: `M ${x1} ${y1} A ${r1} ${r1} 0 ${lg} 1 ${x2} ${y2} L ${x3} ${y3} A ${r2} ${r2} 0 ${lg} 0 ${x4} ${y4} Z`, sf, count: sfTotal, label: sf });
    let famAngle = sfStart;
    fams.sort((a, b) => b.count - a.count).forEach(fam => {
      const famSpan = (fam.count / total) * 2 * Math.PI;
      const famStart = famAngle, famEnd = famAngle + famSpan;
      const fx1 = cx + r2 * Math.cos(famStart), fy1 = cy + r2 * Math.sin(famStart);
      const fx2 = cx + r2 * Math.cos(famEnd),   fy2 = cy + r2 * Math.sin(famEnd);
      const fx3 = cx + r3 * Math.cos(famEnd),   fy3 = cy + r3 * Math.sin(famEnd);
      const fx4 = cx + r3 * Math.cos(famStart), fy4 = cy + r3 * Math.sin(famStart);
      const flg = famSpan > Math.PI ? 1 : 0;
      arcs.push({ path: `M ${fx1} ${fy1} A ${r2} ${r2} 0 ${flg} 1 ${fx2} ${fy2} L ${fx3} ${fy3} A ${r3} ${r3} 0 ${flg} 0 ${fx4} ${fy4} Z`, sf, family: fam.family, count: fam.count, label: fam.family });
      famAngle += famSpan;
    });
    sfAngle += sfSpan;
  });
  const hoveredArc = arcs.find(a => a.label === hovered);
  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 400 400" className="w-full max-w-sm" style={{ filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.4))' }}>
        {arcs.map((arc, i) => {
          const color = sfColors[arc.sf] || '#94a3b8';
          const isHov = hovered === arc.label;
          const opacity = hovered ? (isHov ? 1 : 0.3) : (arc.family ? 0.55 : 0.85);
          return (
            <path key={i} d={arc.path} fill={color} fillOpacity={opacity}
              stroke="rgba(0,0,0,0.25)" strokeWidth={0.5}
              style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s' }}
              onMouseEnter={() => setHovered(arc.label)}
              onMouseLeave={() => setHovered(null)} />
          );
        })}
        <circle cx={cx} cy={cy} r={r1 - 2} fill="hsl(var(--card))" />
        <text x={cx} y={cy - 8} textAnchor="middle" fill="hsl(var(--foreground))" fontSize={13} fontWeight={700}>
          {hoveredArc ? hoveredArc.count : total}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={8}>
          {hoveredArc ? hoveredArc.label.slice(0, 12) : 'plantes'}
        </text>
      </svg>
      <div className="flex flex-wrap gap-2 justify-center">
        {SF_ORDER.filter(sf => grouped[sf]?.length > 0).map(sf => {
          const c = SF_COLORS[sf];
          return (
            <span key={sf} className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border ${c.badge}`}>
              <span className={`w-2 h-2 rounded-full ${c.dot}`} />{sf}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── FamilyCard ───────────────────────────────────────────────────────────────
function FamilyCard({ family, data, isExpanded, onToggle }: { family: string; data: FD; isExpanded: boolean; onToggle: () => void; }) {
  const sf = FAM_CLASS[family] || 'Other';
  const c = SF_COLORS[sf];
  const mols = FAM_MOLS[family] || [];
  return (
    <Card className={`border ${c.border} bg-card/60 backdrop-blur transition-all hover:bg-card/80 hover:shadow-lg hover:shadow-black/20`}>
      <CardHeader className="pb-2 cursor-pointer select-none" onClick={onToggle}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold truncate">{family}</CardTitle>
              <CardDescription className="text-[10px] mt-0.5">{sf} · {data.count} plante{data.count > 1 ? 's' : ''}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant="outline" className={`text-xs ${c.badge}`}>{data.count}</Badge>
            {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 space-y-3">
          {data.categories.length > 0 && (
            <div>
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Layers className="h-3 w-3" /> Catégories
              </h4>
              <div className="flex flex-wrap gap-1">
                {data.categories.map(cat => (
                  <Badge key={cat.category} variant="secondary" className="text-[10px] px-1.5 py-0">
                    {cat.category} <span className="opacity-60 ml-0.5">({cat.count})</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {mols.length > 0 && (
            <div>
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <FlaskConical className="h-3 w-3" /> Molécules caractéristiques
              </h4>
              <div className="flex flex-wrap gap-1">
                {mols.map(mol => (
                  <Link key={mol} href={`/molecules?search=${encodeURIComponent(mol)}`}>
                    <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded border ${c.border} ${c.text} bg-primary/5 hover:bg-primary/15 cursor-pointer transition-colors`}>
                      {mol}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="pt-1 border-t border-border/40">
            <Link href={`/plantes?family=${encodeURIComponent(family)}`}>
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <ArrowRight className="h-3 w-3" /> Voir les {data.count} plante{data.count > 1 ? 's' : ''} de cette famille
              </span>
            </Link>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ─── PhylogeneticTree ─────────────────────────────────────────────────────────
function PhylogeneticTree({ families }: { families: FD[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [expandAll, setExpandAll] = useState(false);
  const grouped = useMemo(() => {
    const g: Record<string, FD[]> = {};
    families.forEach(f => { const sf = FAM_CLASS[f.family] || 'Other'; if (!g[sf]) g[sf] = []; g[sf].push(f); });
    Object.values(g).forEach(arr => arr.sort((a, b) => b.count - a.count));
    return g;
  }, [families]);
  const toggle = (f: string) => setExpanded(prev => { const n = new Set(prev); if (n.has(f)) n.delete(f); else n.add(f); return n; });
  const toggleAll = () => {
    if (expandAll) { setExpanded(new Set()); setExpandAll(false); }
    else { setExpanded(new Set(families.map(f => f.family))); setExpandAll(true); }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={toggleAll} className="text-xs gap-1.5">
          {expandAll ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          {expandAll ? 'Tout réduire' : 'Tout développer'}
        </Button>
      </div>
      {SF_ORDER.map(sf => {
        const fams = grouped[sf];
        if (!fams || fams.length === 0) return null;
        const total = fams.reduce((s, f) => s + f.count, 0);
        const c = SF_COLORS[sf];
        return (
          <div key={sf} className="space-y-3">
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r ${c.bg} to-transparent border ${c.border}`}>
              <div className={`w-3 h-3 rounded-full shrink-0 ${c.dot}`} />
              <h3 className={`text-base font-bold ${c.text}`}>{sf}</h3>
              <Badge variant="outline" className={`text-xs ml-auto ${c.badge}`}>{fams.length} familles · {total} plantes</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pl-5 border-l-2 border-border/30">
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
  const [search, setSearch] = useState('');
  const data = useMemo(() => {
    const d: Record<string, { families: string[]; count: number }> = {};
    families.forEach(f => { (FAM_MOLS[f.family] || []).forEach(m => { if (!d[m]) d[m] = { families: [], count: 0 }; d[m].families.push(f.family); d[m].count += f.count; }); });
    return Object.entries(d).map(([n, i]) => ({ name: n, ...i })).sort((a, b) => b.families.length - a.families.length);
  }, [families]);
  const filtered = search ? data.filter(m => m.name.toLowerCase().includes(search.toLowerCase())) : data;
  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Filtrer les molécules…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.slice(0, 24).map(m => (
          <Card key={m.name} className="bg-card/60 hover:bg-card/80 transition-all hover:shadow-md hover:shadow-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary shrink-0" />
                <Link href={`/molecules?search=${encodeURIComponent(m.name)}`}>
                  <span className="hover:text-primary transition-colors cursor-pointer">{m.name}</span>
                </Link>
              </CardTitle>
              <CardDescription className="text-xs">
                Présent dans <strong>{m.families.length}</strong> famille{m.families.length > 1 ? 's' : ''} · <strong>{m.count}</strong> plantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {m.families.slice(0, 5).map(fam => {
                  const sf = FAM_CLASS[fam] || 'Other';
                  return <Badge key={fam} variant="outline" className={`text-[10px] ${SF_COLORS[sf].badge}`}>{fam}</Badge>;
                })}
                {m.families.length > 5 && <Badge variant="secondary" className="text-[10px]">+{m.families.length - 5}</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground text-sm">Aucune molécule trouvée pour « {search} »</p>
        </Card>
      )}
    </div>
  );
}

// ─── StatsBar ─────────────────────────────────────────────────────────────────
function StatsBar({ families }: { families: FD[] }) {
  const s = useMemo(() => {
    const total = families.reduce((s, f) => s + f.count, 0);
    const bySF: Record<string, { families: number; plants: number }> = {};
    families.forEach(f => { const sf = FAM_CLASS[f.family] || 'Other'; if (!bySF[sf]) bySF[sf] = { families: 0, plants: 0 }; bySF[sf].families++; bySF[sf].plants += f.count; });
    const molCount = new Set(families.flatMap(f => FAM_MOLS[f.family] || [])).size;
    return { total, count: families.length, bySF, molCount };
  }, [families]);
  const stats = [
    { label: 'Plantes', value: s.total, icon: <Leaf className="h-4 w-4" />, color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20' },
    { label: 'Familles', value: s.count, icon: <TreePine className="h-4 w-4" />, color: 'from-blue-500/20 to-blue-500/5 border-blue-500/20' },
    { label: 'Super-familles', value: Object.keys(s.bySF).length, icon: <Globe className="h-4 w-4" />, color: 'from-purple-500/20 to-purple-500/5 border-purple-500/20' },
    { label: 'Molécules clés', value: s.molCount, icon: <Microscope className="h-4 w-4" />, color: 'from-amber-500/20 to-amber-500/5 border-amber-500/20' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {stats.map(st => (
        <Card key={st.label} className={`bg-gradient-to-br ${st.color} border`}>
          <CardHeader className="pb-1 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs">{st.label}</CardDescription>
              <span className="text-muted-foreground">{st.icon}</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">{st.value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

// ─── Conservation colors ──────────────────────────────────────────────────────
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
    <div style={{ marginLeft: depth * 18 }}>
      <div className={`flex items-start gap-2 p-2 rounded-md border mb-1 ${cc} transition-colors hover:opacity-90`}>
        {hasChildren ? (
          <button onClick={() => setOpen(o => !o)} className="mt-0.5 shrink-0">
            {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        ) : (
          <span className="w-3.5 h-3.5 mt-0.5 shrink-0 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {node.id ? (
              <Link href={`/varietes/${node.id}`}>
                <span className="font-semibold text-sm italic hover:text-primary transition-colors cursor-pointer flex items-center gap-1 group">
                  {node.name}
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                </span>
              </Link>
            ) : (
              <span className="font-semibold text-sm italic">{node.name}</span>
            )}
            {node.latinName && node.latinName !== node.name && (
              <span className="text-xs text-muted-foreground italic">{node.latinName}</span>
            )}
            {node.conservationStatus && node.conservationStatus !== 'NE' && (
              <Badge variant="outline" className={`text-[10px] px-1 py-0 ${cc}`}>{node.conservationStatus}</Badge>
            )}
            {node.origin && <Badge variant="secondary" className="text-[10px] px-1 py-0">{node.origin}</Badge>}
          </div>
          {node.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{node.description}</p>
          )}
          {node.dominantMolecules && node.dominantMolecules.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {node.dominantMolecules.slice(0, 3).map((m: any) => (
                <span key={m.molecule} className="text-[10px] bg-primary/10 text-primary/80 px-1.5 py-0.5 rounded-full">
                  {m.molecule}{m.percentage ? ` ${m.percentage}%` : ''}
                </span>
              ))}
            </div>
          )}
        </div>
        {node.plantId && (
          <Link href={`/plantes/${node.plantId}`}>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5" />
          </Link>
        )}
      </div>
      {open && hasChildren && (
        <div className="border-l border-border/40 ml-4 pl-2">
          {node.children.map((child: any) => <VarietyTreeNode key={child.id} node={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

// ─── GenreTreeView ────────────────────────────────────────────────────────────
function GenreTreeView({ initialGenus = "" }: { initialGenus?: string }) {
  const { data: generaData, isLoading: generaLoading } = trpc.phylogeny.getAvailableGenera.useQuery();
  const genusList = useMemo(() => {
    if (!generaData) return [];
    const seen = new Set<string>();
    const result: any[] = [];
    for (const g of generaData) { if (g.genus && !seen.has(g.genus)) { seen.add(g.genus); result.push(g); } }
    return result.sort((a, b) => (b.varietyCount ?? 0) - (a.varietyCount ?? 0));
  }, [generaData]);
  const [selectedGenus, setSelectedGenus] = useState<string>(initialGenus);
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const speciesList = useMemo(() => {
    if (!generaData || !selectedGenus) return [];
    return generaData.filter((g: any) => g.genus === selectedGenus && g.species)
      .sort((a: any, b: any) => (b.varietyCount ?? 0) - (a.varietyCount ?? 0));
  }, [generaData, selectedGenus]);
  const isValidGenus = (g: string): g is "Nicotiana" | "Cannabis" | "Rosa" | "Lavandula" =>
    ["Nicotiana", "Cannabis", "Rosa", "Lavandula"].includes(g);
  const { data: treeData, isLoading: treeLoading, error: treeError } = trpc.phylogeny.getPhylogeneticTree.useQuery(
    { genus: (selectedGenus || "Nicotiana") as "Nicotiana" | "Cannabis" | "Rosa" | "Lavandula", species: selectedSpecies || undefined, layout: "tree" },
    { enabled: !!selectedGenus && isValidGenus(selectedGenus) }
  );
  if (generaLoading) return <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (!generaData || generaData.length === 0) return (
    <Card className="p-8 text-center">
      <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-muted-foreground">Aucun genre avec variétés documentées.</p>
    </Card>
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Genre</label>
          <Select value={selectedGenus} onValueChange={v => { setSelectedGenus(v); setSelectedSpecies(""); }}>
            <SelectTrigger><SelectValue placeholder="Sélectionner un genre…" /></SelectTrigger>
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
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Espèce (optionnel)</label>
            <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
              <SelectTrigger><SelectValue placeholder="Toutes les espèces" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all_species__">Toutes les espèces</SelectItem>
                {speciesList.map((s: any) => (
                  <SelectItem key={s.latinName} value={s.species || s.latinName || `__sp_${s.varietyCount}__`}>
                    <span className="italic">{s.latinName}</span>
                    <span className="text-muted-foreground ml-2 text-xs">({s.varietyCount} variétés)</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      {!selectedGenus && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {genusList.map(g => (
            <Card key={g.genus} className="p-3 cursor-pointer hover:bg-accent/50 transition-colors border-border/60" onClick={() => setSelectedGenus(g.genus!)}>
              <p className="font-semibold italic text-sm">{g.genus}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{g.varietyCount} variétés</p>
            </Card>
          ))}
        </div>
      )}
      {selectedGenus && (
        <>
          {treeLoading && <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>}
          {treeError && (
            <Card className="p-6 border-destructive/40 bg-destructive/10">
              <div className="flex items-center gap-2 text-destructive"><AlertCircle className="h-5 w-5" /><span className="font-medium">Erreur de chargement</span></div>
              <p className="text-sm text-muted-foreground mt-1">{treeError.message}</p>
            </Card>
          )}
          {treeData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="p-3 bg-primary/10 border-primary/20"><p className="text-xs text-muted-foreground">Variétés</p><p className="text-2xl font-bold">{treeData.stats.totalVarieties}</p></Card>
                <Card className="p-3 bg-blue-500/10 border-blue-500/20"><p className="text-xs text-muted-foreground">Espèces</p><p className="text-2xl font-bold">{treeData.stats.totalSpecies}</p></Card>
                <Card className="p-3 bg-amber-500/10 border-amber-500/20"><p className="text-xs text-muted-foreground">Profondeur max</p><p className="text-2xl font-bold">{treeData.stats.maxDepth}</p></Card>
                <Card className="p-3 bg-red-500/10 border-red-500/20"><p className="text-xs text-muted-foreground">Critiques</p><p className="text-2xl font-bold">{treeData.stats.conservationCritical}</p></Card>
              </div>
              {treeData.rootNodes.length === 0 ? (
                <Card className="p-6 text-center"><p className="text-muted-foreground">Aucune variété trouvée pour <em>{selectedGenus} {selectedSpecies}</em>.</p></Card>
              ) : (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                    <Network className="h-4 w-4 text-primary" />
                    Arbre des variétés — <em className="font-normal italic">{selectedGenus} {selectedSpecies}</em>
                  </h3>
                  <div className="space-y-1">
                    {treeData.rootNodes.map((node: any) => <VarietyTreeNode key={node.id} node={node} depth={0} />)}
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

// ─── Main ─────────────────────────────────────────────────────────────────────
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
  return (
    <div className="container py-8">
      <Breadcrumbs />
      {/* Hero */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
              <ScanLine className="h-3 w-3" /> Phylogénie moléculaire
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Classification<br />
            <span className="text-primary">Phylogénétique</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            Exploration des relations évolutives entre familles botaniques, genres et variétés.
            Chaque famille est une porte vers un réseau de molécules odorantes partagées.
          </p>
        </div>
        <div className="hidden lg:block">
          {data && <RadialSunburst families={data} />}
        </div>
      </div>
      <StatsBar families={filtered} />
      <Tabs defaultValue="tree" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="tree" className="flex items-center gap-2 text-xs">
            <TreePine className="h-3.5 w-3.5" /> Arbre par Familles
          </TabsTrigger>
          <TabsTrigger value="molecules" className="flex items-center gap-2 text-xs">
            <FlaskConical className="h-3.5 w-3.5" /> Distribution Moléculaire
          </TabsTrigger>
          <TabsTrigger value="genus" className="flex items-center gap-2 text-xs">
            <Network className="h-3.5 w-3.5" /> Arbre par Genre
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tree" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher une famille ou molécule…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={sf} onValueChange={setSf}>
              <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Super-famille" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les super-familles</SelectItem>
                {SF_ORDER.map(s => (
                  <SelectItem key={s} value={s}>
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${SF_COLORS[s].dot}`} />{s}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {filtered.length === 0 ? (
            <Card className="p-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Aucune famille trouvée pour « {search} »</p>
            </Card>
          ) : (
            <PhylogeneticTree families={filtered} />
          )}
        </TabsContent>
        <TabsContent value="molecules">
          <MoleculeDistribution families={filtered} />
        </TabsContent>
        <TabsContent value="genus">
          <GenreTreeView initialGenus="Nicotiana" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
