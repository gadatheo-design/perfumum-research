import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Leaf, FlaskConical, BookOpen, ArrowLeft, Wind, Flame, Mountain, Users } from "lucide-react";

// ─── Axes moléculaires du corpus Burkina Faso ──────────────────────────────
const AXES_MOLECULAIRES = [
  {
    id: "sec-mineral",
    label: "Sec / Minéral",
    icon: <Mountain className="w-4 h-4" />,
    color: "bg-amber-100 text-amber-800 border-amber-300",
    molecules: ["Phénols secs", "Accords cendre", "Argile / poussière minérale"],
    description: "Terre sahélienne, sol dur, poussière ocre",
  },
  {
    id: "animalite",
    label: "Animalité contrôlée",
    icon: <Wind className="w-4 h-4" />,
    color: "bg-orange-100 text-orange-800 border-orange-300",
    molecules: ["Acides gras volatils", "Cuir sec", "Lactones grasses (karité)"],
    description: "Retenue, sobriété, présence animale discrète",
  },
  {
    id: "bois-pouvoir",
    label: "Bois / Pouvoir",
    icon: <Flame className="w-4 h-4" />,
    color: "bg-stone-100 text-stone-800 border-stone-300",
    molecules: ["Sesquiterpènes", "Bois secs africains", "Résines sobres"],
    description: "Autorité, combustion lente, signal rituel",
  },
  {
    id: "rituel",
    label: "Rituel / Social",
    icon: <Users className="w-4 h-4" />,
    color: "bg-red-100 text-red-800 border-red-300",
    molecules: ["Fumée", "Encens africain", "Résines végétales"],
    description: "Fumée comme langage social et politique",
  },
];

// ─── Recettes typologiques ──────────────────────────────────────────────────
const RECETTES_TYPOLOGIQUES = [
  "Terre sahélienne",
  "Fumée des ancêtres",
  "Bois sec rituel",
  "Karité cendré",
  "Cendres vivantes",
  "Tabac ancestral",
  "Animalité retenue",
  "Silence minéral",
  "Nuit sahélienne",
  "Mémoire de poussière",
];

export default function CorpusBurkinaFaso() {
  const [search, setSearch] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");

  const { data: plants, isLoading } = trpc.plants.getByOrigin.useQuery(
    { origin: "Burkina" },
    { staleTime: 5 * 60 * 1000 }
  );

  const families = useMemo(() => {
    if (!plants) return [];
    const fam = new Map<string, number>();
    plants.forEach((p: any) => {
      if (p.family) fam.set(p.family, (fam.get(p.family) || 0) + 1);
    });
    return Array.from(fam.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [plants]);

  const filtered = useMemo(() => {
    if (!plants) return [];
    return plants.filter((p: any) => {
      const matchSearch =
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.latin_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.family?.toLowerCase().includes(search.toLowerCase());
      const matchFamily = familyFilter === "all" || p.family === familyFilter;
      return matchSearch && matchFamily;
    });
  }, [plants, search, familyFilter]);

  return (
    <div className="min-h-screen bg-[#1a1208] text-[#e8d5b0]">
      {/* Header narratif */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 50%, #8B4513 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #D2691E 0%, transparent 50%)",
          }}
        />
        <div className="relative container max-w-5xl mx-auto px-4 py-12">
          <Link href="/axes-recherche" className="inline-flex items-center gap-2 text-[#c4a882] hover:text-[#e8d5b0] text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Axes de recherche
          </Link>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-1 h-20 bg-gradient-to-b from-[#D2691E] to-transparent rounded-full mt-1" />
            <div>
              <p className="text-[#c4a882] text-sm font-mono uppercase tracking-widest mb-2">
                Axe II — Corpus régional
              </p>
              <h1 className="text-4xl font-bold text-[#e8d5b0] mb-3">
                Burkina Faso / Mossi
              </h1>
              <p className="text-xl text-[#c4a882] italic">
                Sécheresse, autorité, combustion lente
              </p>
            </div>
          </div>

          <p className="text-[#b09070] max-w-3xl leading-relaxed mb-8">
            Le Burkina est abordé comme un territoire sec et vertical — rareté de l'eau, sol dur,
            poussière, fumée comme signal social, rituel et politique. La recherche porte sur la
            retenue, la souveraineté, la combustion comme langage. Ce corpus documente les plantes
            aromatiques du Sahel et de l'Afrique de l'Ouest, issues de l'étude Ouedraogo et al. (2024).
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Plantes documentées", value: plants?.length ?? "—", icon: <Leaf className="w-4 h-4" /> },
              { label: "Familles botaniques", value: families.length || "—", icon: <BookOpen className="w-4 h-4" /> },
              { label: "Axes moléculaires", value: "4", icon: <FlaskConical className="w-4 h-4" /> },
              { label: "Recettes typologiques", value: "10", icon: <Flame className="w-4 h-4" /> },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#2a1e0e]/60 border border-[#5a3e1e]/40 rounded-lg p-4 text-center"
              >
                <div className="flex justify-center mb-2 text-[#D2691E]">{stat.icon}</div>
                <div className="text-2xl font-bold text-[#e8d5b0]">{stat.value}</div>
                <div className="text-xs text-[#8a6a4a] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Axes moléculaires */}
        <section>
          <h2 className="text-lg font-semibold text-[#c4a882] mb-4 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#D2691E]" />
            Axes moléculaires dominants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AXES_MOLECULAIRES.map((axe) => (
              <div
                key={axe.id}
                className="bg-[#2a1e0e]/60 border border-[#5a3e1e]/40 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#D2691E]">{axe.icon}</span>
                  <span className="font-semibold text-[#e8d5b0]">{axe.label}</span>
                </div>
                <p className="text-xs text-[#8a6a4a] italic mb-3">{axe.description}</p>
                <div className="flex flex-wrap gap-1">
                  {axe.molecules.map((m) => (
                    <span
                      key={m}
                      className="text-xs px-2 py-0.5 rounded-full bg-[#3a2a10]/80 text-[#c4a882] border border-[#5a3e1e]/50"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tension Colombie ↔ Burkina */}
        <section className="bg-[#2a1e0e]/40 border border-[#5a3e1e]/30 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#c4a882] mb-4">
            Axe croisé — Tension Colombie ↔ Burkina Faso
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ["Humidité", "Sécheresse"],
              ["Fermentation", "Combustion"],
              ["Accumulation", "Retenue"],
              ["Saturation", "Silence"],
              ["Pluie", "Poussière"],
            ].map(([col, bur]) => (
              <div key={col} className="contents">
                <div className="flex items-center gap-2 bg-blue-900/20 border border-blue-800/30 rounded px-3 py-2 text-blue-300">
                  <span className="text-xs text-blue-500 font-mono">CO</span> {col}
                </div>
                <div className="flex items-center gap-2 bg-amber-900/20 border border-amber-800/30 rounded px-3 py-2 text-amber-300">
                  <span className="text-xs text-amber-500 font-mono">BF</span> {bur}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#8a6a4a] mt-4 italic">
            Cette tension structure les recettes, les comparaisons et les visualisations radar du projet.
          </p>
        </section>

        {/* Recettes typologiques */}
        <section>
          <h2 className="text-lg font-semibold text-[#c4a882] mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#D2691E]" />
            Typologies de recettes (10)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {RECETTES_TYPOLOGIQUES.map((r, i) => (
              <div
                key={r}
                className="bg-[#2a1e0e]/60 border border-[#5a3e1e]/40 rounded-lg p-3 text-center"
              >
                <div className="text-xs text-[#5a3e1e] font-mono mb-1">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="text-xs text-[#c4a882]">{r}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Familles botaniques */}
        {families.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-[#c4a882] mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#D2691E]" />
              Familles botaniques représentées
            </h2>
            <div className="flex flex-wrap gap-2">
              {families.map(({ name, count }) => (
                <button
                  key={name}
                  onClick={() => setFamilyFilter(familyFilter === name ? "all" : name)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    familyFilter === name
                      ? "bg-[#D2691E] text-white border-[#D2691E]"
                      : "bg-[#2a1e0e]/60 text-[#c4a882] border-[#5a3e1e]/40 hover:border-[#D2691E]/60"
                  }`}
                >
                  {name} <span className="opacity-60 text-xs">({count})</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Catalogue des plantes */}
        <section>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a6a4a]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une plante..."
                className="pl-9 bg-[#2a1e0e]/60 border-[#5a3e1e]/40 text-[#e8d5b0] placeholder:text-[#8a6a4a] focus:border-[#D2691E]/60"
              />
            </div>
            <Select value={familyFilter} onValueChange={setFamilyFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-[#2a1e0e]/60 border-[#5a3e1e]/40 text-[#c4a882]">
                <SelectValue placeholder="Famille" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a1e0e] border-[#5a3e1e]/40">
                <SelectItem value="all" className="text-[#c4a882]">Toutes les familles</SelectItem>
                {families.map(({ name }) => (
                  <SelectItem key={name} value={name} className="text-[#c4a882]">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 bg-[#2a1e0e]/40 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <p className="text-xs text-[#8a6a4a] mb-4">
                {filtered.length} plante{filtered.length !== 1 ? "s" : ""} affichée{filtered.length !== 1 ? "s" : ""}
                {familyFilter !== "all" && ` · Famille : ${familyFilter}`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filtered.map((plant: any) => (
                  <Link key={plant.id} href={`/plante/${plant.id}`}>
                    <Card className="bg-[#2a1e0e]/60 border-[#5a3e1e]/40 hover:border-[#D2691E]/50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-medium text-[#e8d5b0] truncate">
                              {plant.name}
                            </div>
                            {plant.latin_name && (
                              <div className="text-xs text-[#8a6a4a] italic truncate">
                                {plant.latin_name}
                              </div>
                            )}
                            {plant.family && (
                              <div className="text-xs text-[#c4a882] mt-1">{plant.family}</div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {plant.conservation_status && plant.conservation_status !== "LC" && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  plant.conservation_status === "CR"
                                    ? "border-red-600 text-red-400"
                                    : plant.conservation_status === "EN"
                                    ? "border-orange-500 text-orange-400"
                                    : plant.conservation_status === "VU"
                                    ? "border-yellow-500 text-yellow-400"
                                    : "border-[#5a3e1e]/60 text-[#8a6a4a]"
                                }`}
                              >
                                {plant.conservation_status}
                              </Badge>
                            )}
                            {plant.category && (
                              <Badge
                                variant="outline"
                                className="text-xs border-[#5a3e1e]/60 text-[#8a6a4a]"
                              >
                                {plant.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {plant.olfactive_signature && (
                          <p className="text-xs text-[#8a6a4a] mt-2 line-clamp-1 italic">
                            {plant.olfactive_signature}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Dimension éthique */}
        <section className="bg-[#2a1e0e]/40 border border-[#5a3e1e]/30 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#c4a882] mb-3">Dimension éthique</h2>
          <ul className="space-y-2 text-sm text-[#b09070]">
            <li className="flex items-start gap-2">
              <span className="text-[#D2691E] mt-0.5">—</span>
              Développement en dialogue avec les communautés concernées
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D2691E] mt-0.5">—</span>
              Refus du folklore décoratif et de l'exotisme de surface
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D2691E] mt-0.5">—</span>
              Sobriété comme posture artistique et scientifique
            </li>
          </ul>
        </section>

        {/* Liens croisés */}
        <section>
          <h2 className="text-sm font-semibold text-[#8a6a4a] uppercase tracking-wider mb-3">
            Liens croisés
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/conservation">
              <button className="px-4 py-2 rounded-lg bg-[#2a1e0e]/60 border border-[#5a3e1e]/40 text-[#c4a882] hover:border-[#D2691E]/60 text-sm transition-colors">
                Conservation des espèces menacées
              </button>
            </Link>
            <Link href="/colombie">
              <button className="px-4 py-2 rounded-lg bg-[#2a1e0e]/60 border border-[#5a3e1e]/40 text-[#c4a882] hover:border-[#D2691E]/60 text-sm transition-colors">
                Axe Colombie — contrepoint humide
              </button>
            </Link>
            <Link href="/carte-terroirs">
              <button className="px-4 py-2 rounded-lg bg-[#2a1e0e]/60 border border-[#5a3e1e]/40 text-[#c4a882] hover:border-[#D2691E]/60 text-sm transition-colors">
                Carte des terroirs
              </button>
            </Link>
            <Link href="/gammes/mossi">
              <button className="px-4 py-2 rounded-lg bg-[#2a1e0e]/60 border border-[#5a3e1e]/40 text-[#c4a882] hover:border-[#D2691E]/60 text-sm transition-colors">
                Gammes Mossi
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
