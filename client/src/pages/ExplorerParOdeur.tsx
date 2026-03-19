import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ArrowRight, Leaf, FlaskConical, BookOpen } from "lucide-react";

// Descripteurs olfactifs principaux avec métadonnées narratives
const OLFACTIVE_DESCRIPTORS = [
  {
    key: "boise",
    label: "Boisé",
    emoji: "🌲",
    description: "Cèdre, santal, vétiver, gaïac — la mémoire des forêts anciennes",
    color: "from-amber-900/40 to-stone-800/40",
    border: "border-amber-700/30",
    textColor: "text-amber-200",
    families: ["boise", "Boisé", "boisé"],
  },
  {
    key: "floral",
    label: "Floral",
    emoji: "🌸",
    description: "Rose, jasmin, iris, ylang — l'alphabet des jardins",
    color: "from-rose-900/40 to-pink-800/40",
    border: "border-rose-600/30",
    textColor: "text-rose-200",
    families: ["floral", "Floral", "florale"],
  },
  {
    key: "epice",
    label: "Épicé",
    emoji: "🌶️",
    description: "Poivre, cardamome, clou de girofle — les routes des caravanes",
    color: "from-orange-900/40 to-red-800/40",
    border: "border-orange-600/30",
    textColor: "text-orange-200",
    families: ["epice", "Épicé", "épicé"],
  },
  {
    key: "fruite",
    label: "Fruité",
    emoji: "🍑",
    description: "Pêche, figue, agrumes, baies — la douceur des vergers",
    color: "from-yellow-900/40 to-orange-800/40",
    border: "border-yellow-600/30",
    textColor: "text-yellow-200",
    families: ["fruite", "Fruité", "fruité"],
  },
  {
    key: "herbace",
    label: "Herbacé",
    emoji: "🌿",
    description: "Lavande, basilic, fougère, menthe — les herbes de garrigue",
    color: "from-green-900/40 to-emerald-800/40",
    border: "border-green-600/30",
    textColor: "text-green-200",
    families: ["herbace", "Herbacé", "herbacé"],
  },
  {
    key: "aromatique",
    label: "Aromatique",
    emoji: "🫚",
    description: "Camphre, eucalyptus, romarin — les huiles essentielles médicinales",
    color: "from-teal-900/40 to-cyan-800/40",
    border: "border-teal-600/30",
    textColor: "text-teal-200",
    families: ["aromatique", "Aromatique"],
  },
  {
    key: "Sesquiterpène",
    label: "Sesquiterpènes",
    emoji: "🔬",
    description: "Bisabolol, caryophyllène, guaiol — la chimie des profondeurs",
    color: "from-violet-900/40 to-purple-800/40",
    border: "border-violet-600/30",
    textColor: "text-violet-200",
    families: ["Sesquiterpène", "sesquiterpene"],
  },
  {
    key: "Monoterpène",
    label: "Monoterpènes",
    emoji: "⚗️",
    description: "Limonène, myrcène, linalol — les briques élémentaires du parfum",
    color: "from-blue-900/40 to-indigo-800/40",
    border: "border-blue-600/30",
    textColor: "text-blue-200",
    families: ["Monoterpène", "terpene"],
  },
  {
    key: "Aldéhyde",
    label: "Aldéhydes",
    emoji: "✨",
    description: "Vanilline, héliotropine, aldéhydes C — la modernité en flacon",
    color: "from-yellow-900/40 to-amber-800/40",
    border: "border-yellow-500/30",
    textColor: "text-yellow-100",
    families: ["Aldéhyde", "aldehyde"],
  },
  {
    key: "Ester",
    label: "Esters",
    emoji: "🍬",
    description: "Acétates, lactones, benzoates — la douceur synthétique",
    color: "from-pink-900/40 to-rose-800/40",
    border: "border-pink-500/30",
    textColor: "text-pink-200",
    families: ["Ester", "ester"],
  },
  {
    key: "Phénol",
    label: "Phénols",
    emoji: "🔥",
    description: "Gaïacol, eugénol, crésols — les notes fumées et animales",
    color: "from-stone-900/40 to-zinc-800/40",
    border: "border-stone-500/30",
    textColor: "text-stone-200",
    families: ["Phénol", "phenol", "Phénylpropanoïde"],
  },
  {
    key: "Lactone",
    label: "Lactones",
    emoji: "🥛",
    description: "Coumarine, γ-décalactone, macrolides — les notes lactées et crémeuses",
    color: "from-slate-900/40 to-gray-800/40",
    border: "border-slate-500/30",
    textColor: "text-slate-200",
    families: ["Lactone", "lactone"],
  },
];

export default function ExplorerParOdeur() {
  const [selectedDescriptor, setSelectedDescriptor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stableSearchQuery] = useState("");

  const descriptor = OLFACTIVE_DESCRIPTORS.find(d => d.key === selectedDescriptor);

  // Charger les molécules de la famille sélectionnée via la procédure dédiée
  const { data: filteredMolecules, isLoading } = trpc.molecules.getByFamily.useQuery(
    { families: descriptor?.families ?? [], limit: 50 },
    { enabled: !!descriptor }
  );

  // Charger les plantes de la famille sélectionnée
  const { data: allPlants } = trpc.plants.list.useQuery(undefined, { enabled: !!descriptor });

  const filteredPlants = useMemo(() => {
    if (!allPlants || !descriptor) return [];
    return (allPlants as any[]).filter((p: any) => {
      const fam = (p.family || "").toLowerCase();
      const notes = (p.olfactiveNotes || p.notes || "").toLowerCase();
      return descriptor.families.some(f =>
        fam.includes(f.toLowerCase()) || notes.includes(f.toLowerCase())
      );
    }).slice(0, 12);
  }, [allPlants, descriptor]);

  // Recherche transversale (charge les molécules uniquement quand nécessaire)
  const { data: searchMolecules } = trpc.molecules.list.useQuery(undefined, {
    enabled: searchQuery.length >= 2,
  });

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2 || !searchMolecules) return [];
    const q = searchQuery.toLowerCase();
    return (searchMolecules as any[]).filter((m: any) =>
      m.name?.toLowerCase().includes(q) ||
      (m.family || "").toLowerCase().includes(q) ||
      (m.olfactiveProfile || "").toLowerCase().includes(q)
    ).slice(0, 10);
  }, [searchQuery, searchMolecules]);

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête narratif */}
      <div className="relative overflow-hidden bg-gradient-to-br from-stone-950 via-zinc-900 to-stone-900 border-b border-border">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 uppercase tracking-widest">
              <span>PERFUMUM</span>
              <ArrowRight className="h-3 w-3" />
              <span>Explorer par odeur</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Entrer dans le parfum<br />
              <span className="text-amber-300">par ce que vous ressentez</span>
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed max-w-lg">
              Chaque odeur est une porte. Choisissez un descripteur olfactif pour explorer les molécules,
              les plantes sources et les recettes qui lui correspondent dans la base PERFUMUM.
            </p>
          </div>

          {/* Barre de recherche transversale */}
          <div className="mt-8 max-w-lg relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une odeur, une molécule, un descripteur…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-amber-500/50"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg shadow-xl z-10 overflow-hidden">
                {searchResults.map((m: any) => (
                  <Link key={m.id} href={`/molecules/${m.id}`}>
                    <div className="px-4 py-2.5 hover:bg-white/5 cursor-pointer flex items-center gap-3 border-b border-white/5 last:border-0">
                      <FlaskConical className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <div>
                        <div className="text-sm text-white font-medium">{m.name}</div>
                        {m.family && <div className="text-xs text-zinc-500">{m.family}</div>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* Grille des descripteurs — portes d'entrée narratives */}
        {!selectedDescriptor && (
          <>
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-1">Choisissez votre porte d'entrée</h2>
              <p className="text-sm text-muted-foreground">
                {OLFACTIVE_DESCRIPTORS.length} familles olfactives · {allMolecules?.length || "…"} molécules dans la base
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {OLFACTIVE_DESCRIPTORS.map(desc => {
                  const count = allMolecules?.filter((m: any) =>
                    desc.families.some(f => (m.family || "").toLowerCase() === f.toLowerCase() || (m.family || "").toLowerCase().includes(f.toLowerCase()))
                  ).length || 0;

                  return (
                    <button
                      key={desc.key}
                      onClick={() => setSelectedDescriptor(desc.key)}
                      className={`group relative overflow-hidden rounded-xl border ${desc.border} bg-gradient-to-br ${desc.color} p-5 text-left transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30 active:scale-[0.98]`}
                    >
                      <div className="text-3xl mb-3">{desc.emoji}</div>
                      <div className={`font-bold text-base mb-1 ${desc.textColor}`}>{desc.label}</div>
                      <div className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-3">
                        {desc.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`text-xs border-white/10 ${desc.textColor}`}>
                          {count} molécule{count !== 1 ? "s" : ""}
                        </Badge>
                        <ArrowRight className={`h-3.5 w-3.5 ${desc.textColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Lien vers l'explorateur complet */}
            <div className="mt-10 rounded-xl border border-border bg-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Explorer autrement</h3>
                <p className="text-sm text-muted-foreground">
                  Naviguer par structure chimique, par plante source, par tradition olfactive ou par recette.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/molecules"><Button variant="outline" size="sm"><FlaskConical className="h-3.5 w-3.5 mr-1.5" />Molécules</Button></Link>
                <Link href="/plantes"><Button variant="outline" size="sm"><Leaf className="h-3.5 w-3.5 mr-1.5" />Plantes</Button></Link>
                <Link href="/archives-olfactives"><Button variant="outline" size="sm"><BookOpen className="h-3.5 w-3.5 mr-1.5" />Traditions</Button></Link>
              </div>
            </div>
          </>
        )}

        {/* Vue détaillée d'un descripteur */}
        {selectedDescriptor && descriptor && (
          <div className="space-y-8">
            {/* Fil d'Ariane + retour */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDescriptor(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Tous les descripteurs
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className={`font-medium ${descriptor.textColor}`}>{descriptor.emoji} {descriptor.label}</span>
            </div>

            {/* En-tête du descripteur */}
            <div className={`rounded-xl border ${descriptor.border} bg-gradient-to-br ${descriptor.color} p-8`}>
              <div className="text-5xl mb-4">{descriptor.emoji}</div>
              <h2 className={`text-2xl font-bold mb-2 ${descriptor.textColor}`}>{descriptor.label}</h2>
              <p className="text-zinc-300 text-base max-w-xl">{descriptor.description}</p>
              <div className="flex gap-3 mt-4">
                <Badge variant="outline" className={`border-white/20 ${descriptor.textColor}`}>
                  {filteredMolecules.length} molécules
                </Badge>
                <Badge variant="outline" className={`border-white/20 ${descriptor.textColor}`}>
                  {filteredPlants.length} plantes sources
                </Badge>
              </div>
            </div>

            {/* Molécules */}
            {filteredMolecules.length > 0 && (
              <div>
                <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-muted-foreground" />
                  Molécules {descriptor.label.toLowerCase()}s dans PERFUMUM
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredMolecules.slice(0, 24).map((mol: any) => (
                    <Link key={mol.id} href={`/molecules/${mol.id}`}>
                      <div className="group rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:bg-card/80 transition-all cursor-pointer">
                        <div className="font-medium text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {mol.name}
                        </div>
                        {mol.chemicalFamily && (
                          <div className="text-xs text-muted-foreground line-clamp-1">{mol.chemicalFamily}</div>
                        )}
                        {mol.cas_number && (
                          <div className="text-xs text-muted-foreground/60 mt-1 font-mono">CAS {mol.cas_number}</div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                {filteredMolecules.length > 24 && (
                  <div className="mt-4 text-center">
                    <Link href={`/molecules?family=${encodeURIComponent(descriptor.key)}`}>
                      <Button variant="outline" size="sm">
                        Voir les {filteredMolecules.length - 24} autres molécules →
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Plantes sources */}
            {filteredPlants.length > 0 && (
              <div>
                <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-muted-foreground" />
                  Plantes sources associées
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredPlants.map((plant: any) => (
                    <Link key={plant.id} href={`/plantes/${plant.id}`}>
                      <div className="group rounded-lg border border-border bg-card p-4 hover:border-primary/40 transition-all cursor-pointer">
                        <div className="font-medium text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {plant.name || plant.commonName}
                        </div>
                        {plant.scientificName && (
                          <div className="text-xs text-muted-foreground italic line-clamp-1">{plant.scientificName}</div>
                        )}
                        {plant.conservationStatus && plant.conservationStatus !== "LC" && (
                          <Badge variant="outline" className="text-xs mt-1 border-orange-500/30 text-orange-400">
                            IUCN {plant.conservationStatus}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredMolecules.length === 0 && filteredPlants.length === 0 && (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <div className="text-4xl mb-3">{descriptor.emoji}</div>
                <h3 className="text-lg font-medium mb-2">Aucun résultat pour ce descripteur</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Les données pour la famille <strong>{descriptor.label}</strong> seront enrichies progressivement.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
