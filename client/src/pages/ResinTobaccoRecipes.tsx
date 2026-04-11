import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Mapping des recettes vers leurs sources documentées
const RECIPE_METADATA: Record<number, {
  chemicalAxis: string;
  processLinks: Array<{ label: string; url: string }>;
  resinLinks: Array<{ label: string; url: string }>;
  plantIds: number[];
  moleculeIds: number[];
  color: string;
}> = {
  900001: {
    chemicalAxis: 'Pyrolyse phénolique (Latakia) + Oxydation terpénique (Boswellia)',
    processLinks: [
      { label: 'Pyrolyse', url: '/extraction-procedes?focus=pyrolyse' },
      { label: 'Combustion directe', url: '/extraction-procedes?focus=combustion' },
    ],
    resinLinks: [
      { label: 'Oliban de Somalie', url: '/resines-encens' },
      { label: 'Oliban Boswellia carterii', url: '/resines-encens' },
      { label: 'Labdanum', url: '/resines-encens' },
    ],
    plantIds: [150002, 270002, 30014, 150010],
    moleculeIds: [],
    color: 'from-amber-900/30 to-orange-900/20',
  },
  900002: {
    chemicalAxis: 'Fermentation anaérobie (Périque) + Hydrolyse enzymatique (Myrrhe)',
    processLinks: [
      { label: 'Fermentation', url: '/extraction-procedes?focus=fermentation' },
      { label: 'Hydrolyse', url: '/extraction-procedes?focus=hydrolyse' },
    ],
    resinLinks: [
      { label: 'Myrrhe', url: '/resines-encens' },
      { label: 'Opoponax', url: '/resines-encens' },
      { label: 'Benjoin Siam', url: '/resines-encens' },
    ],
    plantIds: [150001, 150011, 270010, 600016],
    moleculeIds: [],
    color: 'from-red-900/30 to-rose-900/20',
  },
  900003: {
    chemicalAxis: 'Isomérisation photo-induite (Cannabis) + Oxydation labdane (Cistus)',
    processLinks: [
      { label: 'Isomérisation', url: '/resines-encens' },
    ],
    resinLinks: [
      { label: 'Labdanum (Cistus)', url: '/resines-encens' },
      { label: 'Galbanum', url: '/resines-encens' },
    ],
    plantIds: [150003, 150010, 480029, 480022],
    moleculeIds: [2143313],
    color: 'from-green-900/30 to-emerald-900/20',
  },
  900004: {
    chemicalAxis: 'Accumulation fongique chromones (Kyara) + Cure solaire cembranoides (Katerini)',
    processLinks: [
      { label: 'Macération', url: '/extraction-procedes?focus=maceration' },
    ],
    resinLinks: [
      { label: 'Kyara (Aquilaria sinensis)', url: '/resines-encens' },
      { label: 'Oud (Aquilaria malaccensis)', url: '/resines-encens' },
      { label: 'Benjoin Siam', url: '/resines-encens' },
    ],
    plantIds: [150004, 210038, 240002, 600016],
    moleculeIds: [],
    color: 'from-purple-900/30 to-violet-900/20',
  },
  900005: {
    chemicalAxis: 'Oxydation terpénique in situ (Palo Santo) + Alcaloïdes cérémonials (Mapacho)',
    processLinks: [
      { label: 'Combustion directe', url: '/extraction-procedes?focus=combustion' },
    ],
    resinLinks: [
      { label: 'Palo Santo (Bursera graveolens)', url: '/resines-encens' },
      { label: 'Copal Blanco', url: '/resines-encens' },
    ],
    plantIds: [150003, 210004, 480005],
    moleculeIds: [],
    color: 'from-yellow-900/30 to-amber-900/20',
  },
  900006: {
    chemicalAxis: 'Hydrolyse estérique (Benjoin) + Cure solaire ionique (Samsun)',
    processLinks: [
      { label: 'Teinture / Macération', url: '/extraction-procedes?focus=maceration' },
      { label: 'Hydrolyse', url: '/extraction-procedes?focus=hydrolyse' },
    ],
    resinLinks: [
      { label: 'Benjoin Siam (Styrax tonkinensis)', url: '/resines-encens' },
      { label: 'Benjoin (Styrax benzoin)', url: '/resines-encens' },
      { label: 'Labdanum', url: '/resines-encens' },
    ],
    plantIds: [840001, 600016, 660194, 150010],
    moleculeIds: [],
    color: 'from-stone-800/30 to-zinc-800/20',
  },
};

const INTENSITY_LABELS: Record<number, { label: string; color: string }> = {
  2: { label: 'Doux', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  5: { label: 'Moyen', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  8: { label: 'Fort', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
};

function RecipeCard({ recipe }: { recipe: any }) {
  const [expanded, setExpanded] = useState(false);
  const meta = RECIPE_METADATA[recipe.id];
  const intensityInfo = INTENSITY_LABELS[recipe.intensity] || INTENSITY_LABELS[5];

  return (
    <Card className={`bg-gradient-to-br ${meta?.color || 'from-zinc-900/30 to-zinc-800/20'} border border-white/10 hover:border-white/20 transition-all duration-300`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold text-white leading-tight mb-1">
              {recipe.name}
            </CardTitle>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge variant="outline" className={`text-xs ${intensityInfo.color}`}>
                {intensityInfo.label}
              </Badge>
              {recipe.maturationTime && (
                <Badge variant="outline" className="text-xs bg-zinc-800/50 text-zinc-300 border-zinc-600/50">
                  {recipe.maturationTime}j maturation
                </Badge>
              )}
              {recipe.combustionTemperature && (
                <Badge variant="outline" className="text-xs bg-zinc-800/50 text-zinc-300 border-zinc-600/50">
                  {recipe.combustionTemperature}°C
                </Badge>
              )}
              <Badge variant="outline" className="text-xs bg-zinc-800/50 text-zinc-400 border-zinc-700/50 capitalize">
                {recipe.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Description */}
        <p className="text-sm text-zinc-300 leading-relaxed">
          {expanded ? recipe.description : recipe.description.substring(0, 180) + (recipe.description.length > 180 ? '…' : '')}
        </p>

        {/* Axe chimique */}
        {meta?.chemicalAxis && (
          <div className="bg-black/20 rounded-lg p-2.5 border border-white/5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Axe chimique</p>
            <p className="text-xs text-zinc-300 font-medium">{meta.chemicalAxis}</p>
          </div>
        )}

        {/* Pyramide olfactive */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Tête', value: recipe.notesTete, color: 'text-yellow-400' },
            { label: 'Cœur', value: recipe.notesCoeur, color: 'text-rose-400' },
            { label: 'Fond', value: recipe.notesFond, color: 'text-amber-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-black/20 rounded p-2 border border-white/5">
              <p className={`text-xs font-medium ${color} mb-1`}>{label}</p>
              <p className="text-xs text-zinc-400 leading-tight line-clamp-3">{value}</p>
            </div>
          ))}
        </div>

        {/* Formule */}
        {expanded && (
          <>
            <div className="bg-black/20 rounded-lg p-2.5 border border-white/5">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Formule</p>
              <p className="text-xs text-zinc-300">{recipe.formula}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-2.5 border border-white/5">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Protocole</p>
              <p className="text-xs text-zinc-300 leading-relaxed">{recipe.protocol}</p>
            </div>
          </>
        )}

        {/* Liens résines et procédés */}
        {meta && (
          <div className="flex flex-wrap gap-1.5">
            {meta.resinLinks.map((link, i) => (
              <Link key={i} href={link.url}>
                <span className="inline-flex items-center gap-1 text-xs bg-amber-900/30 text-amber-300 border border-amber-700/30 rounded px-2 py-0.5 hover:bg-amber-900/50 cursor-pointer transition-colors">
                  🌿 {link.label}
                </span>
              </Link>
            ))}
            {meta.processLinks.map((link, i) => (
              <Link key={i} href={link.url}>
                <span className="inline-flex items-center gap-1 text-xs bg-blue-900/30 text-blue-300 border border-blue-700/30 rounded px-2 py-0.5 hover:bg-blue-900/50 cursor-pointer transition-colors">
                  ⚗️ {link.label}
                </span>
              </Link>
            ))}
            {meta.moleculeIds.map(id => (
              <Link key={id} href={`/molecules/${id}`}>
                <span className="inline-flex items-center gap-1 text-xs bg-green-900/30 text-green-300 border border-green-700/30 rounded px-2 py-0.5 hover:bg-green-900/50 cursor-pointer transition-colors">
                  🔬 Hashishène
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Plantes source */}
        {meta && meta.plantIds.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {meta.plantIds.map(id => (
              <Link key={id} href={`/plantes/${id}`}>
                <span className="text-xs text-zinc-500 hover:text-zinc-300 underline cursor-pointer transition-colors">
                  #{id}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Bouton expand */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full text-xs text-zinc-500 hover:text-zinc-300 h-7"
        >
          {expanded ? '▲ Réduire' : '▼ Voir formule & protocole'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ResinTobaccoRecipes() {
  const { data: recipes, isLoading } = trpc.resinTobaccoRecipes.getAll.useQuery();
  const [activeTab, setActiveTab] = useState('all');

  const filteredRecipes = recipes?.filter(r => {
    if (activeTab === 'all') return true;
    if (activeTab === 'doux') return r.intensity <= 3;
    if (activeTab === 'moyen') return r.intensity >= 4 && r.intensity <= 6;
    if (activeTab === 'fort') return r.intensity >= 7;
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/resines-encens">
                  <span className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer">
                    ← Résines & Encens
                  </span>
                </Link>
                <span className="text-zinc-600">·</span>
                <Link href="/extraction-procedes">
                  <span className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">
                    Procédés d'Extraction
                  </span>
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Recettes Résines & Tabac
              </h1>
              <p className="text-zinc-400 text-sm max-w-2xl">
                Mélanges originaux basés sur les synergies moléculaires documentées en base PERFUMUM.
                Chaque recette est construite sur un axe de transformation chimique précis —
                pyrolyse, fermentation, isomérisation, hydrolyse — reliant les processus de maturation
                des résines aux caractéristiques des variétés de tabac.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-white">{recipes?.length || 0}</div>
              <div className="text-xs text-zinc-500">recettes</div>
            </div>
          </div>

          {/* Synergies moléculaires clés */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { molecule: 'Limonène', role: 'Pont terpénique universel', color: 'text-yellow-400' },
              { molecule: 'Eugénol', role: 'Pyrolyse lignine → phénol', color: 'text-orange-400' },
              { molecule: 'Vanilline', role: 'Pyrolyse → douceur', color: 'text-amber-400' },
              { molecule: 'Hashishène', role: 'Isomérisation photo-induite', color: 'text-green-400' },
            ].map(({ molecule, role, color }) => (
              <div key={molecule} className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className={`text-sm font-semibold ${color}`}>{molecule}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-zinc-900 border border-white/10 mb-6">
            <TabsTrigger value="all" className="text-xs">Toutes ({recipes?.length || 0})</TabsTrigger>
            <TabsTrigger value="doux" className="text-xs">Douces</TabsTrigger>
            <TabsTrigger value="moyen" className="text-xs">Moyennes</TabsTrigger>
            <TabsTrigger value="fort" className="text-xs">Fortes</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-zinc-900/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredRecipes.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                Aucune recette dans cette catégorie.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Note méthodologique */}
        <div className="mt-12 bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">
            Méthodologie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-400">
            <div>
              <div className="text-zinc-300 font-medium mb-1">Synergies moléculaires</div>
              <p>Chaque recette est fondée sur des molécules partagées entre résines et tabac documentées en base PERFUMUM — 25 molécules communes identifiées par requête SQL croisée.</p>
            </div>
            <div>
              <div className="text-zinc-300 font-medium mb-1">Transformations chimiques</div>
              <p>Les axes chimiques (pyrolyse, fermentation, isomérisation) sont documentés dans la page <Link href="/resines-encens"><span className="text-amber-400 hover:underline cursor-pointer">Résines & Encens</span></Link> et <Link href="/extraction-procedes"><span className="text-blue-400 hover:underline cursor-pointer">Procédés d'Extraction</span></Link>.</p>
            </div>
            <div>
              <div className="text-zinc-300 font-medium mb-1">Statut expérimental</div>
              <p>Ces recettes sont au stade expérimental — les proportions sont des points de départ à ajuster selon les lots de matières premières et les conditions de maturation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
