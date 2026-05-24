import { useState } from "react";
import { safeJsonParse } from "@/lib/utils";
import { Link } from "wouter";
import { Cigarette, Leaf, FlaskConical, Droplets, Flame, Globe2, ChevronRight, ExternalLink, Loader2, MapPin, Thermometer, Wind } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { GammeBadge } from "../components/GammeBadge";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

// Mapping type tabac → gamme PERFUMUM
const typeToGamme: Record<string, "volcanique" | "civilisations" | "petrichor" | "glaciaire" | "biolab"> = {
  oriental: "volcanique",
  brun: "volcanique",
  blond: "civilisations",
  experimental: "biolab",
};

// Couleurs par type
const typeColors: Record<string, string> = {
  oriental: "border-amber-500/40 hover:border-amber-500/70",
  brun: "border-stone-500/40 hover:border-stone-500/70",
  blond: "border-yellow-500/40 hover:border-yellow-500/70",
  experimental: "border-purple-500/40 hover:border-purple-500/70",
};

const typeBadgeColors: Record<string, string> = {
  oriental: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  brun: "bg-stone-500/20 text-stone-300 border-stone-500/30",
  blond: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  experimental: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const climateLabels: Record<string, string> = {
  mediterranean: "Méditerranéen",
  continental: "Continental",
  oceanic: "Océanique",
  tropical: "Tropical",
  subtropical: "Subtropical",
  arid: "Aride",
  semi_arid: "Semi-aride",
  alpine: "Alpin",
  equatorial: "Équatorial",
  other: "Autre",
};

const resinesStatic = [
  {
    name: "Résine CBD Premium",
    type: "Extraction CO₂ supercritique",
    gamme: "biolab" as const,
    profile: "Terpènes préservés (myrcène, limonène, β-caryophyllène), profil floral/fruité",
    concentration: "85-95% cannabinoïdes totaux",
    usage: "Formulations Bio-Lab, accords expérimentaux, synergies terpéniques",
    notes: "7 profils premium développés (voir page Résines CBD)"
  },
  {
    name: "Absolue de Tabac",
    type: "Extraction éthanol",
    gamme: "volcanique" as const,
    profile: "Concentré aromatique intense, notes cuir/miel/fumé amplifiées",
    concentration: "Extraction 1:10 (10kg tabac → 1kg absolue)",
    usage: "Formulations concentrées, installations olfactives, accords signature",
    notes: "Disponible pour toutes variétés de tabacs (sur commande)"
  },
  {
    name: "Résinoïde de Tabac",
    type: "Extraction solvant (hexane)",
    gamme: "volcanique" as const,
    profile: "Texture cireuse, profil fumé/résineux, fixateur naturel",
    concentration: "Extraction 1:15 (15kg tabac → 1kg résinoïde)",
    usage: "Fixation accords, formulations longue durée, installations permanentes",
    notes: "Stabilité exceptionnelle (5-10 ans), idéal pour archivage olfactif"
  }
];

const methodologies = [
  {
    icon: Leaf,
    title: "Sélection Terroir",
    description: "Sourcing direct producteurs, traçabilité complète, certification biologique privilégiée"
  },
  {
    icon: FlaskConical,
    title: "Extraction Verte",
    description: "CO₂ supercritique, hydrodistillation, enfleurage (sans solvants pétroliers)"
  },
  {
    icon: Droplets,
    title: "Maturation Contrôlée",
    description: "Vieillissement 3-24 mois selon variété, hygrométrie 65-70%, température 18-22°C"
  },
  {
    icon: Flame,
    title: "Pyrolyse Analytique",
    description: "Caractérisation profils de combustion, optimisation températures, analyse GC-MS"
  }
];

export default function TabacsResines() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const { data: tabacs, isLoading } = trpc.tabacs?.listWithTerroir.useQuery();

  const types = ["all", "blond", "brun", "oriental", "experimental"];
  const typeLabels: Record<string, string> = {
    all: "Tous",
    blond: "Blond",
    brun: "Brun",
    oriental: "Oriental",
    experimental: "Expérimental"
  };

  const filtered = tabacs
    ? (selectedType === "all" ? tabacs : tabacs?.filter((t: any) => t.type === selectedType))
    : [];

  const parseAromaticProfile = (raw: any): string[] => {
    if (!raw) return [];
    try {
      const parsed = safeJsonParse(raw, null);
      return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      return [String(raw)];
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs />

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Cigarette className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Tabacs & Résines
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl">
            Catalogue complet des {tabacs?.length ?? "42"} variétés de tabacs et résines utilisées dans le projet PERFUMUM.
            Chaque matière première est sélectionnée pour son profil moléculaire unique et
            son potentiel de synergies avec les 5 gammes atmosphériques.
          </p>
        </div>

        {/* Méthodologies */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold uppercase mb-6 text-amber-400">
            Méthodologies de Travail
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {methodologies.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-lg font-bold mb-2 text-white uppercase tracking-wide">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-400">{method.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabacs — données DB */}
        <div className="mb-16">
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <Cigarette className="w-8 h-8 text-amber-400" />
              <h2 className="text-3xl font-bold uppercase tracking-tight">
                {tabacs ? tabacs?.length : "42"} Variétés de Tabacs
              </h2>
            </div>
            {/* Filtres par type */}
            <div className="flex flex-wrap gap-2">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1 text-sm border transition-all ${
                    selectedType === t
                      ? "bg-amber-500 text-black border-amber-500 font-bold"
                      : "bg-white/5 text-gray-400 border-white/20 hover:bg-white/10"
                  }`}
                >
                  {typeLabels[t]}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              <span className="ml-3 text-gray-400">Chargement des tabacs?...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filtered.map((tabac: any, index: number) => {
                const profile = parseAromaticProfile(tabac.aromaticProfile);
                const gamme = typeToGamme[tabac.type] ?? "civilisations";
                const borderColor = typeColors[tabac.type] ?? "border-white/20";

                return (
                  <div
                    key={tabac.id ?? index}
                    className={`bg-white/5 border-2 ${borderColor} p-6 hover:bg-white/10 hover:scale-[1.01] transition-all duration-300`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                            {tabac.name}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 border rounded ${typeBadgeColors[tabac.type] ?? ""}`}>
                            {tabac.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          <Globe2 className="w-4 h-4" />
                          {tabac.origin}
                        </p>
                      </div>
                      <GammeBadge gamme={gamme} size="sm" />
                    </div>

                    <div className="space-y-4">
                      {/* Profil aromatique */}
                      {profile.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                            Profil Aromatique
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {profile.map((note: string, i: number) => (
                              <span key={i} className="text-xs px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono">
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Intensité */}
                      {tabac.intensity && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                            Intensité
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-400 h-full"
                                style={{ width: `${(tabac.intensity / 10) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-mono text-gray-400">
                              {tabac.intensity}/10
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Terroir */}
                      {tabac.terroir_name && (
                        <div className="flex items-start gap-2 pt-2 border-t border-white/10">
                          <MapPin className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500 mb-0.5">Terroir</p>
                            <p className="text-sm text-green-300 font-medium">{tabac.terroir_name}</p>
                            {tabac.terroir_region && (
                              <p className="text-xs text-gray-500">{tabac.terroir_region}, {tabac.terroir_country}</p>
                            )}
                            {tabac.terroir_climate && (
                              <p className="text-xs text-gray-600 mt-0.5">
                                <Wind className="w-3 h-3 inline mr-1" />
                                {climateLabels[tabac.terroir_climate] ?? tabac.terroir_climate}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Notes internes */}
                      {tabac.internalNotes && (
                        <div className="pt-2 border-t border-white/10">
                          <p className="text-xs italic text-gray-500 line-clamp-3">{tabac.internalNotes}</p>
                        </div>
                      )}

                      {/* Lien fiche détail */}
                      <div className="pt-2">
                        <Link href={`/tabac/${tabac.id}`}>
                          <span className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer">
                            <ExternalLink className="w-3 h-3" />
                            Voir la fiche complète
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Résines */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Droplets className="w-8 h-8 text-pink-400" />
            <h2 className="text-3xl font-bold uppercase tracking-tight">
              Résines & Extraits
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {resinesStatic.map((resine, index) => (
              <div
                key={index}
                className="bg-white/5 border-2 border-pink-500/30 p-6 hover:bg-pink-950/20 hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                    {resine.name}
                  </h3>
                  <GammeBadge gamme={resine.gamme} size="sm" />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Type d'Extraction
                    </p>
                    <p className="text-sm font-medium text-pink-400">{resine.type}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Profil
                    </p>
                    <p className="text-sm text-gray-300">{resine.profile}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Concentration
                    </p>
                    <p className="text-sm font-mono text-gray-400">{resine.concentration}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Usage
                    </p>
                    <p className="text-sm text-gray-300">{resine.usage}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs italic text-gray-500">{resine.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer stats */}
        <div className="pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-amber-400">{tabacs?.length ?? 42}</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Variétés Tabacs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-400">3</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Types Résines</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">5</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Gammes PERFUMUM</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-400">100</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Synergies Documentées</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
