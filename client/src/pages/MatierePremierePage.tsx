import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Leaf, MapPin, FlaskConical, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";

// ── Labels ──────────────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  huile_essentielle: { label: "Huile essentielle", color: "bg-emerald-900/40 text-emerald-300 border-emerald-700" },
  absolue: { label: "Absolue", color: "bg-rose-900/40 text-rose-300 border-rose-700" },
  concrete: { label: "Concrète", color: "bg-amber-900/40 text-amber-300 border-amber-700" },
  resinoid: { label: "Résinoïde", color: "bg-orange-900/40 text-orange-300 border-orange-700" },
  teinture: { label: "Teinture", color: "bg-purple-900/40 text-purple-300 border-purple-700" },
  co2_extract: { label: "Extrait CO₂", color: "bg-cyan-900/40 text-cyan-300 border-cyan-700" },
  hydrolat: { label: "Hydrolat", color: "bg-sky-900/40 text-sky-300 border-sky-700" },
  beurre: { label: "Beurre", color: "bg-yellow-900/40 text-yellow-300 border-yellow-700" },
  cire: { label: "Cire", color: "bg-yellow-900/40 text-yellow-200 border-yellow-600" },
  oleoresine: { label: "Oléorésine", color: "bg-orange-900/40 text-orange-200 border-orange-600" },
  infusion: { label: "Infusion / Macération", color: "bg-teal-900/40 text-teal-300 border-teal-700" },
  maceration: { label: "Macération", color: "bg-teal-900/40 text-teal-200 border-teal-600" },
  distillat: { label: "Distillat", color: "bg-blue-900/40 text-blue-300 border-blue-700" },
  accord_olfactif: { label: "Accord olfactif", color: "bg-violet-900/40 text-violet-300 border-violet-700" },
  molecule_isolee: { label: "Molécule isolée", color: "bg-indigo-900/40 text-indigo-300 border-indigo-700" },
  matiere_animale: { label: "Matière animale", color: "bg-stone-800/60 text-stone-300 border-stone-600" },
  autre: { label: "Autre", color: "bg-zinc-800/60 text-zinc-300 border-zinc-600" },
};

const QUALITY_LABELS: Record<string, string> = {
  bio: "Biologique",
  conventionnel: "Conventionnel",
  sauvage: "Sauvage",
  biodynamique: "Biodynamique",
  patrimonial: "Patrimonial",
  synthetique: "Synthétique",
};

const AVAILABILITY_LABELS: Record<string, { label: string; color: string }> = {
  disponible: { label: "Disponible", color: "text-emerald-400" },
  sur_commande: { label: "Sur commande", color: "text-amber-400" },
  rare: { label: "Rare", color: "text-orange-400" },
  epuise: { label: "Épuisé", color: "text-red-400" },
  discontinue: { label: "Discontinué", color: "text-red-500" },
};

// ── Composant principal ──────────────────────────────────────────────────────
export default function MatierePremierePage() {
  const [, params] = useRoute("/matieres-premieres/:id");
  const id = params?.id ? parseInt(params.id, 10) : null;

  const { data: material, isLoading, error } = trpc.rawMaterials.getDetail.useQuery(
    id ?? 0,
    { enabled: !!id && !isNaN(id as number) }
  );

  if (!id || isNaN(id)) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center">
        <p className="text-zinc-400">Identifiant invalide.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center flex-col gap-4">
        <AlertTriangle className="h-10 w-10 text-red-400" />
        <p className="text-zinc-400">Matière première introuvable.</p>
        <Link href="/matieres-premieres">
          <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Button>
        </Link>
      </div>
    );
  }

  const catInfo = CATEGORY_LABELS[material.category] ?? CATEGORY_LABELS.autre;
  const availInfo = material.availability ? AVAILABILITY_LABELS[material.availability] : null;

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-zinc-100">
      {/* ── Header ── */}
      <div className="border-b border-zinc-800 bg-[#111113]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/matieres-premieres">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Matières premières
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── Titre & badges ── */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="text-3xl font-semibold text-zinc-50 leading-tight flex-1 min-w-0">
              {material.name}
            </h1>
            <Badge className={`border text-xs px-2 py-1 shrink-0 ${catInfo.color}`}>
              {catInfo.label}
            </Badge>
          </div>
          {material.latinName && (
            <p className="text-zinc-400 italic text-lg">{material.latinName}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {material.quality && (
              <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-xs">
                {QUALITY_LABELS[material.quality] ?? material.quality}
              </Badge>
            )}
            {availInfo && (
              <span className={`text-sm font-medium ${availInfo.color}`}>
                ● {availInfo.label}
              </span>
            )}
            {material.priceRange && (
              <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
                {material.priceRange}
              </Badge>
            )}
          </div>
        </div>

        <Separator className="border-zinc-800" />

        {/* ── Grille principale ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ── Colonne gauche : Profil olfactif ── */}
          <div className="md:col-span-2 space-y-6">

            {/* Profil olfactif */}
            {(material.olfactiveProfile || material.topNotes || material.heartNotes || material.baseNotes) && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Profil olfactif
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {material.olfactiveProfile && (
                    <p className="text-zinc-200 text-sm leading-relaxed">{material.olfactiveProfile}</p>
                  )}
                  {(material.topNotes || material.heartNotes || material.baseNotes) && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {material.topNotes && (
                        <div className="bg-zinc-900/60 rounded-lg p-3">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Notes de tête</p>
                          <p className="text-zinc-300 text-sm">{material.topNotes}</p>
                        </div>
                      )}
                      {material.heartNotes && (
                        <div className="bg-zinc-900/60 rounded-lg p-3">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Notes de cœur</p>
                          <p className="text-zinc-300 text-sm">{material.heartNotes}</p>
                        </div>
                      )}
                      {material.baseNotes && (
                        <div className="bg-zinc-900/60 rounded-lg p-3">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Notes de fond</p>
                          <p className="text-zinc-300 text-sm">{material.baseNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {material.olfactiveFamily && (
                    <p className="text-xs text-zinc-500">
                      Famille olfactive : <span className="text-zinc-300">{material.olfactiveFamily}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Molécules */}
            {material.molecules && material.molecules.length > 0 && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <FlaskConical className="h-4 w-4" />
                    Composition moléculaire
                    <span className="text-zinc-600 font-normal">({material.molecules.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {material.molecules.map((mol) => (
                      <div key={mol.id} className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <Link href={`/molecules/${mol.id}`}>
                            <span className="text-amber-400 hover:text-amber-300 text-sm font-medium cursor-pointer truncate">
                              {mol.name}
                            </span>
                          </Link>
                          {mol.isSignature === 1 && (
                            <Badge className="bg-amber-900/40 text-amber-300 border-amber-700 text-xs border">
                              Signature
                            </Badge>
                          )}
                          {mol.chemicalFamily && (
                            <span className="text-zinc-500 text-xs hidden sm:inline">{mol.chemicalFamily}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {mol.percentage && (
                            <span className="text-zinc-300 text-sm font-mono">{mol.percentage}%</span>
                          )}
                          {mol.casNumber && (
                            <span className="text-zinc-600 text-xs hidden md:inline">CAS {mol.casNumber}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recettes associées */}
            {material.recipes && material.recipes.length > 0 && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Recettes associées
                    <span className="text-zinc-600 font-normal">({material.recipes.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {material.recipes.map((r) => (
                      <Link key={r.id} href={`/recettes/${r.id}`}>
                        <Badge
                          variant="outline"
                          className="border-zinc-700 text-zinc-300 hover:border-amber-600 hover:text-amber-300 cursor-pointer transition-colors"
                        >
                          {r.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes & description */}
            {material.notes && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Notes du chercheur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{material.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Colonne droite : Origine & infos ── */}
          <div className="space-y-4">

            {/* Origine géographique */}
            {(material.originCountry || material.originRegion || material.terroir) && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Origine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {material.originCountry && (
                    <div>
                      <span className="text-zinc-500">Pays : </span>
                      <span className="text-zinc-200">{material.originCountry}</span>
                    </div>
                  )}
                  {material.originRegion && (
                    <div>
                      <span className="text-zinc-500">Région : </span>
                      <span className="text-zinc-200">{material.originRegion}</span>
                    </div>
                  )}
                  {material.terroir && (
                    <div className="mt-2 pt-2 border-t border-zinc-800">
                      <p className="text-zinc-500 text-xs mb-1">Terroir lié</p>
                      <Link href={`/terroirsmap`}>
                        <span className="text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1">
                          {material.terroir.name}
                          <ExternalLink className="h-3 w-3" />
                        </span>
                      </Link>
                      {material.terroir.country && (
                        <p className="text-zinc-500 text-xs mt-1">{material.terroir.country}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Plante source */}
            {material.plant && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Plante source
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <Link href={`/plantes/${material.plant.id}`}>
                    <p className="text-amber-400 hover:text-amber-300 cursor-pointer font-medium">
                      {material.plant.name}
                    </p>
                  </Link>
                  {material.plant.latinName && (
                    <p className="text-zinc-400 italic text-xs">{material.plant.latinName}</p>
                  )}
                  {material.plant.family && (
                    <p className="text-zinc-500 text-xs">Famille : {material.plant.family}</p>
                  )}
                  {material.plant.conservationStatus && material.plant.conservationStatus !== "non_evalue" && (
                    <Badge className="bg-red-900/40 text-red-300 border-red-700 border text-xs mt-1">
                      {material.plant.conservationStatus.toUpperCase()}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Méthode d'extraction */}
            {(material.extractionMethodId || material.extractionYield || material.plantPart) && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Extraction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {material.plantPart && (
                    <div>
                      <span className="text-zinc-500">Partie utilisée : </span>
                      <span className="text-zinc-200 capitalize">{material.plantPart.replace(/_/g, " ")}</span>
                    </div>
                  )}
                  {material.extractionYield && (
                    <div>
                      <span className="text-zinc-500">Rendement : </span>
                      <span className="text-zinc-200">{material.extractionYield}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Identifiant interne */}
            <div className="text-xs text-zinc-700 font-mono pt-2">
              ID : {material.materialId}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
