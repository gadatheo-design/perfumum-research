import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimelinePhase {
  label: string;
  startMonth: number;
  endMonth: number;
  color: string;
  bgColor: string;
  description: string;
}

interface TimelineEvent {
  month: number;
  process: string;
  processLabel: string;
  processColor: string;
  processIcon: string;
  precursor: string;
  product: string;
  olfactoryImpact: string;
}

// ─── Données de timeline par résine ──────────────────────────────────────────
// Chaque résine a des phases olfactives et des événements de transformation
// Les données sont basées sur la littérature scientifique

const TIMELINE_DATA: Record<string, { phases: TimelinePhase[]; events: TimelineEvent[] }> = {
  oliban: {
    phases: [
      { label: "Frais", startMonth: 0, endMonth: 3, color: "text-green-300", bgColor: "bg-green-600", description: "Citronné, camphré, résineux vif" },
      { label: "Développement", startMonth: 3, endMonth: 9, color: "text-amber-300", bgColor: "bg-amber-600", description: "Balsamique, boisé, notes d'incensole" },
      { label: "Maturité", startMonth: 9, endMonth: 18, color: "text-orange-300", bgColor: "bg-orange-600", description: "Encensé profond, boisé, légèrement sucré" },
      { label: "Vieilli", startMonth: 18, endMonth: 36, color: "text-rose-300", bgColor: "bg-rose-700", description: "Profond, complexe, notes de miel et de bois" },
    ],
    events: [
      { month: 2, process: "oxidation", processLabel: "Oxydation", processColor: "text-amber-300", processIcon: "O₂", precursor: "α-Pinène", product: "Myrtenol", olfactoryImpact: "Atténuation du camphré, gain floral" },
      { month: 4, process: "isomerization", processLabel: "Isomérisation", processColor: "text-violet-300", processIcon: "⇌", precursor: "α-Pinène", product: "Camphène", olfactoryImpact: "Notes camphrées plus douces" },
      { month: 6, process: "hydrolysis", processLabel: "Hydrolyse", processColor: "text-blue-300", processIcon: "H₂O", precursor: "Incensole acétate", product: "Incensole", olfactoryImpact: "Réduction des notes camphrées" },
      { month: 12, process: "decarboxylation", processLabel: "Décarboxylation", processColor: "text-yellow-300", processIcon: "CO₂", precursor: "Acide boswellique", product: "β-Boswellène", olfactoryImpact: "Gain de profondeur boisée" },
      { month: 18, process: "polymerization", processLabel: "Polymérisation", processColor: "text-stone-300", processIcon: "⛓", precursor: "Monoterpènes", product: "Polymères résineux", olfactoryImpact: "Fixation des notes, réduction volatilité" },
    ],
  },
  myrrhe: {
    phases: [
      { label: "Frais", startMonth: 0, endMonth: 4, color: "text-green-300", bgColor: "bg-green-600", description: "Amer, terreux, légèrement fumé" },
      { label: "Développement", startMonth: 4, endMonth: 10, color: "text-amber-300", bgColor: "bg-amber-600", description: "Balsamique, boisé, notes de cuir" },
      { label: "Maturité", startMonth: 10, endMonth: 24, color: "text-orange-300", bgColor: "bg-orange-600", description: "Profond, animal, encensé" },
    ],
    events: [
      { month: 3, process: "oxidation", processLabel: "Oxydation", processColor: "text-amber-300", processIcon: "O₂", precursor: "β-Caryophyllène", product: "Oxyde de caryophyllène", olfactoryImpact: "Gain de notes épicées et boisées" },
      { month: 6, process: "cyclization", processLabel: "Cyclisation", processColor: "text-teal-300", processIcon: "○", precursor: "Sesquiterpènes ouverts", product: "Furanoïdes", olfactoryImpact: "Développement des notes animales" },
      { month: 12, process: "fermentation", processLabel: "Fermentation", processColor: "text-green-300", processIcon: "🦠", precursor: "Glucosides", product: "Alcools terpéniques", olfactoryImpact: "Enrichissement floral-herbacé" },
    ],
  },
  benjoin: {
    phases: [
      { label: "Frais", startMonth: 0, endMonth: 6, color: "text-green-300", bgColor: "bg-green-600", description: "Vanillé frais, légèrement balsamique" },
      { label: "Développement", startMonth: 6, endMonth: 18, color: "text-amber-300", bgColor: "bg-amber-600", description: "Vanillé profond, boisé, notes de caramel" },
      { label: "Maturité", startMonth: 18, endMonth: 36, color: "text-orange-300", bgColor: "bg-orange-600", description: "Vanillé intense, balsamique, légèrement fumé" },
    ],
    events: [
      { month: 4, process: "hydrolysis", processLabel: "Hydrolyse", processColor: "text-blue-300", processIcon: "H₂O", precursor: "Coniferyl benzoate", product: "Vanilline", olfactoryImpact: "Intensification de la note vanillée" },
      { month: 8, process: "hydrolysis", processLabel: "Hydrolyse", processColor: "text-blue-300", processIcon: "H₂O", precursor: "Benzyl cinnamate", product: "Acide cinnamique", olfactoryImpact: "Gain de notes balsamiques-épicées" },
      { month: 18, process: "oxidation", processLabel: "Oxydation", processColor: "text-amber-300", processIcon: "O₂", precursor: "Acide benzoïque", product: "Benzaldéhyde", olfactoryImpact: "Notes d'amande amère" },
    ],
  },
  labdanum: {
    phases: [
      { label: "Frais", startMonth: 0, endMonth: 3, color: "text-green-300", bgColor: "bg-green-600", description: "Herbacé, légèrement camphré, résineux" },
      { label: "Développement", startMonth: 3, endMonth: 12, color: "text-amber-300", bgColor: "bg-amber-600", description: "Ambré, boisé, légèrement animal" },
      { label: "Maturité", startMonth: 12, endMonth: 24, color: "text-orange-300", bgColor: "bg-orange-600", description: "Ambre profond, cuiré, notes de miel" },
    ],
    events: [
      { month: 3, process: "oxidation", processLabel: "Oxydation", processColor: "text-amber-300", processIcon: "O₂", precursor: "Sclareol", product: "Sclareolide", olfactoryImpact: "Gain de notes ambrées et musquées" },
      { month: 6, process: "cyclization", processLabel: "Cyclisation", processColor: "text-teal-300", processIcon: "○", precursor: "Sclareol", product: "Labdanol", olfactoryImpact: "Développement de l'accord ambré" },
      { month: 12, process: "polymerization", processLabel: "Polymérisation", processColor: "text-stone-300", processIcon: "⛓", precursor: "Diterpènes", product: "Polymères labdaniques", olfactoryImpact: "Fixation et profondeur de l'ambre" },
    ],
  },
  cannabis: {
    phases: [
      { label: "Frais", startMonth: 0, endMonth: 1, color: "text-green-300", bgColor: "bg-green-600", description: "Herbacé vif, citronné, légèrement épicé" },
      { label: "Curing", startMonth: 1, endMonth: 3, color: "text-lime-300", bgColor: "bg-lime-600", description: "Floral, fruité, terpènes développés" },
      { label: "Vieillissement", startMonth: 3, endMonth: 12, color: "text-amber-300", bgColor: "bg-amber-600", description: "Terreux, épicé, notes de hashish" },
      { label: "Hash vieilli", startMonth: 12, endMonth: 36, color: "text-orange-300", bgColor: "bg-orange-600", description: "Hashishène dominant, terreux profond" },
    ],
    events: [
      { month: 1, process: "fermentation", processLabel: "Curing", processColor: "text-green-300", processIcon: "🦠", precursor: "Chlorophylle", product: "Composés dégradés", olfactoryImpact: "Disparition de l'herbacé vert" },
      { month: 2, process: "decarboxylation", processLabel: "Décarboxylation", processColor: "text-yellow-300", processIcon: "CO₂", precursor: "THCA / CBDA", product: "THC / CBD", olfactoryImpact: "Activation des cannabinoïdes" },
      { month: 4, process: "isomerization", processLabel: "Isomérisation photo-induite", processColor: "text-violet-300", processIcon: "⇌", precursor: "β-Myrcène", product: "Hashishène", olfactoryImpact: "Apparition des notes terreuses profondes" },
      { month: 8, process: "oxidation", processLabel: "Oxydation", processColor: "text-amber-300", processIcon: "O₂", precursor: "β-Caryophyllène", product: "Oxyde de caryophyllène", olfactoryImpact: "Notes épicées-boisées" },
      { month: 18, process: "oxidation", processLabel: "Oxydation THC", processColor: "text-amber-300", processIcon: "O₂", precursor: "THC", product: "CBN", olfactoryImpact: "Réduction de l'activité, gain de sédation" },
    ],
  },
  oud: {
    phases: [
      { label: "Formation initiale", startMonth: 0, endMonth: 24, color: "text-amber-300", bgColor: "bg-amber-600", description: "Boisé vert, légèrement terreux" },
      { label: "Développement", startMonth: 24, endMonth: 60, color: "text-orange-300", bgColor: "bg-orange-600", description: "Animal, cuiré, boisé profond" },
      { label: "Maturité", startMonth: 60, endMonth: 120, color: "text-rose-300", bgColor: "bg-rose-700", description: "Oud complexe, notes de cuir et d'ambre" },
    ],
    events: [
      { month: 12, process: "cyclization", processLabel: "Cyclisation", processColor: "text-teal-300", processIcon: "○", precursor: "Sesquiterpène linéaire", product: "Agarofuran", olfactoryImpact: "Apparition des notes animales caractéristiques" },
      { month: 24, process: "oxidation", processLabel: "Oxydation", processColor: "text-amber-300", processIcon: "O₂", precursor: "Guaiol", product: "Bulnesol", olfactoryImpact: "Transition vers les notes cuirées" },
      { month: 48, process: "oxidation", processLabel: "Accumulation chromones", processColor: "text-amber-300", processIcon: "O₂", precursor: "Phénylpropanoïde", product: "2-(2-Phényléthyl)chromone", olfactoryImpact: "Développement de la douceur du oud" },
    ],
  },
  mastic: {
    phases: [
      { label: "Frais", startMonth: 0, endMonth: 3, color: "text-green-300", bgColor: "bg-green-600", description: "Frais, citronné, légèrement résineux" },
      { label: "Développement", startMonth: 3, endMonth: 12, color: "text-amber-300", bgColor: "bg-amber-600", description: "Balsamique, boisé" },
      { label: "Maturité", startMonth: 12, endMonth: 24, color: "text-orange-300", bgColor: "bg-orange-600", description: "Balsamique profond, notes de cèdre" },
    ],
    events: [
      { month: 4, process: "oxidation", processLabel: "Oxydation triterpénique", processColor: "text-amber-300", processIcon: "O₂", precursor: "Acide masticadiènoïque", product: "Acide masticadiènoïque oxydé", olfactoryImpact: "Gain de notes balsamiques" },
      { month: 12, process: "polymerization", processLabel: "Polymérisation", processColor: "text-stone-300", processIcon: "⛓", precursor: "Poly-β-myrcène", product: "Polymère réticulé", olfactoryImpact: "Durcissement, fixation des notes" },
    ],
  },
  pin: {
    phases: [
      { label: "Frais", startMonth: 0, endMonth: 3, color: "text-green-300", bgColor: "bg-green-600", description: "Pin frais, térébenthine, camphré" },
      { label: "Vieillissement", startMonth: 3, endMonth: 12, color: "text-amber-300", bgColor: "bg-amber-600", description: "Boisé sec, légèrement rance" },
      { label: "Vieilli", startMonth: 12, endMonth: 18, color: "text-orange-300", bgColor: "bg-orange-600", description: "Résine sèche, notes de goudron" },
    ],
    events: [
      { month: 2, process: "isomerization", processLabel: "Isomérisation", processColor: "text-violet-300", processIcon: "⇌", precursor: "α-Pinène", product: "Limonène", olfactoryImpact: "Apparition de notes citronnées" },
      { month: 6, process: "oxidation", processLabel: "Oxydation", processColor: "text-amber-300", processIcon: "O₂", precursor: "Acide abiétique", product: "Acide déhydroabiétique", olfactoryImpact: "Perte de fraîcheur, gain de sécheresse" },
    ],
  },
  sandaraque: {
    phases: [
      { label: "Frais", startMonth: 0, endMonth: 4, color: "text-green-300", bgColor: "bg-green-600", description: "Citronné, résineux frais" },
      { label: "Développement", startMonth: 4, endMonth: 12, color: "text-amber-300", bgColor: "bg-amber-600", description: "Balsamique, boisé" },
      { label: "Maturité", startMonth: 12, endMonth: 24, color: "text-orange-300", bgColor: "bg-orange-600", description: "Balsamique profond, légèrement phénolique" },
    ],
    events: [
      { month: 4, process: "oxidation", processLabel: "Oxydation", processColor: "text-amber-300", processIcon: "O₂", precursor: "Acide sandaracopimarique", product: "Acide hydroxylé", olfactoryImpact: "Gain de notes balsamiques" },
      { month: 12, process: "decarboxylation", processLabel: "Décarboxylation", processColor: "text-yellow-300", processIcon: "CO₂", precursor: "Acide communique", product: "Communol", olfactoryImpact: "Notes boisées plus sèches" },
    ],
  },
};

// ─── Composant principal ──────────────────────────────────────────────────────

const PROCESS_COLORS: Record<string, string> = {
  isomerization: "bg-violet-600",
  oxidation: "bg-amber-600",
  pyrolysis: "bg-red-600",
  fermentation: "bg-green-600",
  hydrolysis: "bg-blue-600",
  distillation: "bg-cyan-600",
  polymerization: "bg-stone-500",
  decarboxylation: "bg-yellow-600",
  cyclization: "bg-teal-600",
};

function TimelineBar({
  profile,
  maxMonths,
}: {
  profile: any;
  maxMonths: number;
}) {
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);
  const [expanded, setExpanded] = useState(false);

  const timelineKey = profile.id;
  const tlData = TIMELINE_DATA[timelineKey];
  const actualMax = profile.timelineMonths ?? maxMonths;

  // Generate tick marks
  const ticks = useMemo(() => {
    const result: number[] = [0];
    if (actualMax <= 12) {
      for (let m = 3; m <= actualMax; m += 3) result.push(m);
    } else if (actualMax <= 36) {
      for (let m = 6; m <= actualMax; m += 6) result.push(m);
    } else if (actualMax <= 120) {
      for (let m = 12; m <= actualMax; m += 12) result.push(m);
    } else {
      for (let m = 24; m <= actualMax; m += 24) result.push(m);
    }
    return result;
  }, [actualMax]);

  if (!tlData) {
    // Fallback générique basé sur les transformations
    return (
      <div className="text-xs text-zinc-600 italic py-2">
        Timeline détaillée non disponible pour cette résine.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Axe temporel */}
      <div className="relative">
        {/* Phases olfactives */}
        <div className="relative h-8 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
          {tlData.phases.map((phase, i) => {
            const left = (phase.startMonth / actualMax) * 100;
            const width = ((phase.endMonth - phase.startMonth) / actualMax) * 100;
            return (
              <div
                key={i}
                className={`absolute top-0 h-full ${phase.bgColor} opacity-70 flex items-center justify-center`}
                style={{ left: `${left}%`, width: `${width}%` }}
                title={`${phase.label}: ${phase.description}`}
              >
                <span className="text-[9px] font-medium text-white truncate px-1">
                  {phase.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Événements de transformation */}
        <div className="relative h-6 mt-1">
          {tlData.events.map((event, i) => {
            const left = (event.month / actualMax) * 100;
            const bgClass = PROCESS_COLORS[event.process] ?? "bg-zinc-500";
            return (
              <div
                key={i}
                className="absolute transform -translate-x-1/2 cursor-pointer group"
                style={{ left: `${left}%` }}
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                {/* Ligne verticale */}
                <div className={`w-0.5 h-3 ${bgClass} opacity-60 mx-auto`} />
                {/* Point */}
                <div className={`w-3 h-3 rounded-full ${bgClass} border-2 border-zinc-950 mx-auto -mt-0.5 hover:scale-125 transition-transform`} />
              </div>
            );
          })}
        </div>

        {/* Ticks temporels */}
        <div className="relative h-4 mt-0.5">
          {ticks.map((tick) => {
            const left = (tick / actualMax) * 100;
            return (
              <div
                key={tick}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${left}%` }}
              >
                <div className="w-px h-1.5 bg-zinc-700 mx-auto" />
                <span className="text-[8px] text-zinc-600 block text-center">
                  {tick === 0 ? "0" : tick >= 12 ? `${tick / 12}a` : `${tick}m`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tooltip événement survolé */}
      {hoveredEvent && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-semibold ${hoveredEvent.processColor}`}>
              {hoveredEvent.processIcon} {hoveredEvent.processLabel}
            </span>
            <span className="text-zinc-500">
              ~{hoveredEvent.month >= 12 ? `${hoveredEvent.month / 12} an${hoveredEvent.month >= 24 ? "s" : ""}` : `${hoveredEvent.month} mois`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="font-mono text-zinc-300">{hoveredEvent.precursor}</span>
            <span className="text-zinc-600">→</span>
            <span className="font-mono text-zinc-300">{hoveredEvent.product}</span>
          </div>
          <p className="text-zinc-500 mt-1 italic">{hoveredEvent.olfactoryImpact}</p>
        </div>
      )}

      {/* Légende des phases */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? "Masquer les phases" : "Détail des phases olfactives"}
      </button>

      {expanded && (
        <div className="grid grid-cols-2 gap-2">
          {tlData.phases.map((phase, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className={`w-2 h-2 rounded-full ${phase.bgColor} mt-0.5 shrink-0`} />
              <div>
                <span className={`text-[10px] font-medium ${phase.color}`}>{phase.label}</span>
                <p className="text-[9px] text-zinc-600">{phase.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function ResinTimelineTab({ profiles }: { profiles: any[] }) {
  const [selectedResin, setSelectedResin] = useState<string | null>(null);

  const maxMonths = useMemo(
    () => Math.max(...profiles.map((p) => p.timelineMonths ?? 24)),
    [profiles]
  );

  const displayProfiles = selectedResin
    ? profiles.filter((p) => p.id === selectedResin)
    : profiles.filter((p) => TIMELINE_DATA[p.id]); // Only show resins with timeline data

  const availableCount = profiles.filter((p) => TIMELINE_DATA[p.id]).length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-base font-semibold text-zinc-200 mb-1 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          Timeline de maturation
        </h2>
        <p className="text-xs text-zinc-500">
          Visualisation chronologique des transformations chimiques dominantes pour chaque résine. Survolez les points pour voir les détails de chaque transformation.
          <span className="ml-2 text-zinc-600">({availableCount}/{profiles.length} résines avec données temporelles)</span>
        </p>
      </div>

      {/* Légende des processus */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(PROCESS_COLORS).map(([key, bg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${bg}`} />
            <span className="text-[10px] text-zinc-500 capitalize">
              {key === "isomerization" ? "Isomérisation"
                : key === "oxidation" ? "Oxydation"
                : key === "pyrolysis" ? "Pyrolyse"
                : key === "fermentation" ? "Fermentation"
                : key === "hydrolysis" ? "Hydrolyse"
                : key === "distillation" ? "Distillation"
                : key === "polymerization" ? "Polymérisation"
                : key === "decarboxylation" ? "Décarboxylation"
                : key === "cyclization" ? "Cyclisation"
                : key}
            </span>
          </div>
        ))}
      </div>

      {/* Filtre par résine */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedResin(null)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            !selectedResin
              ? "bg-zinc-700 border-zinc-600 text-zinc-200"
              : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
          }`}
        >
          Toutes ({availableCount})
        </button>
        {profiles
          .filter((p) => TIMELINE_DATA[p.id])
          .map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedResin(selectedResin === p.id ? null : p.id)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                selectedResin === p.id
                  ? "bg-zinc-700 border-zinc-600 text-zinc-200"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
              }`}
            >
              {p.name.split(" ")[0]}
            </button>
          ))}
      </div>

      {/* Timelines */}
      <div className="space-y-4">
        {displayProfiles.map((profile) => (
          <Card key={profile.id} className="bg-zinc-950 border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-sm text-zinc-200">{profile.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-600 italic">{profile.latinName}</span>
                  {profile.timelineMonths && (
                    <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500">
                      <Clock className="w-2.5 h-2.5 mr-1" />
                      {profile.timelineMonths >= 12
                        ? `${profile.timelineMonths / 12} an${profile.timelineMonths >= 24 ? "s" : ""}`
                        : `${profile.timelineMonths} mois`}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TimelineBar profile={profile} maxMonths={maxMonths} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Note sur les données manquantes */}
      {profiles.filter((p) => !TIMELINE_DATA[p.id]).length > 0 && (
        <div className="text-xs text-zinc-700 border border-zinc-900 rounded-lg p-3">
          <span className="text-zinc-600">Résines sans données temporelles : </span>
          {profiles.filter((p) => !TIMELINE_DATA[p.id]).map((p) => p.name).join(", ")}
        </div>
      )}
    </div>
  );
}
