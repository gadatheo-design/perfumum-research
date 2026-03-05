/**
 * TherapeuticPropertiesTab — Onglet Propriétés thérapeutiques
 * Affiche les données thérapeutiques d'une molécule de façon structurée :
 * - Badges de propriétés détectées automatiquement
 * - Mécanismes d'action extraits du texte
 * - Profil olfactif
 * - Avertissement médical
 * - Liens vers les références bibliographiques
 */
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Beaker, Thermometer, Brain, Heart, Leaf, Wind, AlertTriangle, BookOpen, ExternalLink, Activity, Microscope } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

// ============================================================================
// TYPES
// ============================================================================

interface TherapeuticPropertiesTabProps {
  moleculeId: number;
  moleculeName: string;
  therapeuticProperties?: string | null;
  olfactiveProfile?: string | null;
}

// ============================================================================
// DÉFINITIONS DES PROPRIÉTÉS
// ============================================================================

const PROPERTY_DEFINITIONS: Array<{
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  keywords: string[];
}> = [
  {
    key: "anti-inflammatoire",
    label: "Anti-inflammatoire",
    description: "Inhibe les voies inflammatoires (NF-κB, COX-2, cytokines pro-inflammatoires) et réduit l'inflammation tissulaire.",
    icon: <Shield className="h-4 w-4" />,
    color: "text-red-700 dark:text-red-300",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    keywords: ["anti-inflammatoire", "inflammation", "NF-κB", "COX-2", "TNF-α", "cytokines"],
  },
  {
    key: "antioxydant",
    label: "Antioxydant",
    description: "Neutralise les radicaux libres et réduit le stress oxydatif cellulaire.",
    icon: <Zap className="h-4 w-4" />,
    color: "text-amber-700 dark:text-amber-300",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    keywords: ["antioxydant", "radicaux libres", "stress oxydatif", "DPPH", "ORAC"],
  },
  {
    key: "anxiolytique",
    label: "Anxiolytique",
    description: "Réduit l'anxiété en modulant les récepteurs GABA-A ou sérotoninergiques.",
    icon: <Brain className="h-4 w-4" />,
    color: "text-violet-700 dark:text-violet-300",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    borderColor: "border-violet-200 dark:border-violet-800",
    keywords: ["anxiolytique", "anxiété", "GABA", "sérotonine", "benzodiazépine"],
  },
  {
    key: "analgésique",
    label: "Analgésique",
    description: "Atténue la perception de la douleur via des mécanismes opioïdes ou non-opioïdes.",
    icon: <Thermometer className="h-4 w-4" />,
    color: "text-purple-700 dark:text-purple-300",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    keywords: ["analgésique", "douleur", "opioïde", "nociception", "antinociceptif"],
  },
  {
    key: "antimicrobien",
    label: "Antimicrobien",
    description: "Inhibe la croissance ou tue les micro-organismes pathogènes (bactéries, champignons, virus).",
    icon: <Beaker className="h-4 w-4" />,
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    keywords: ["antimicrobien", "antibactérien", "antifongique", "antiviral", "antiseptique"],
  },
  {
    key: "sédatif",
    label: "Sédatif",
    description: "Favorise la relaxation et le sommeil en déprimant le système nerveux central.",
    icon: <Wind className="h-4 w-4" />,
    color: "text-indigo-700 dark:text-indigo-300",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    keywords: ["sédatif", "sommeil", "hypnotique", "myorelaxant", "relaxant"],
  },
  {
    key: "antidépresseur",
    label: "Antidépresseur",
    description: "Module les neurotransmetteurs (sérotonine, dopamine, noradrénaline) pour améliorer l'humeur.",
    icon: <Heart className="h-4 w-4" />,
    color: "text-rose-700 dark:text-rose-300",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-800",
    keywords: ["antidépresseur", "dépression", "humeur", "dopamine", "noradrénaline"],
  },
  {
    key: "cannabinoïde",
    label: "Activité cannabinoïde",
    description: "Interagit avec les récepteurs cannabinoïdes CB1 ou CB2 du système endocannabinoïde.",
    icon: <Leaf className="h-4 w-4" />,
    color: "text-green-700 dark:text-green-300",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    keywords: ["CB1", "CB2", "cannabinoïde", "endocannabinoïde", "THC", "CBD"],
  },
  {
    key: "gastroprotecteur",
    label: "Gastroprotecteur",
    description: "Protège la muqueuse gastrique et améliore la digestion.",
    icon: <Activity className="h-4 w-4" />,
    color: "text-teal-700 dark:text-teal-300",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    borderColor: "border-teal-200 dark:border-teal-800",
    keywords: ["gastroprotecteur", "gastrique", "digestion", "ulcère", "muqueuse"],
  },
  {
    key: "neuroprotecteur",
    label: "Neuroprotecteur",
    description: "Protège les neurones contre les dommages oxydatifs ou excitotoxiques.",
    icon: <Microscope className="h-4 w-4" />,
    color: "text-cyan-700 dark:text-cyan-300",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    borderColor: "border-cyan-200 dark:border-cyan-800",
    keywords: ["neuroprotecteur", "neurone", "excitotoxicité", "Alzheimer", "Parkinson"],
  },
];

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

function detectProperties(text: string) {
  const lower = text.toLowerCase();
  return PROPERTY_DEFINITIONS.filter((prop) =>
    prop.keywords.some((kw) => lower.includes(kw.toLowerCase()))
  );
}

function extractMechanisms(text: string): string[] {
  // Extraire les parenthèses contenant des mécanismes
  const mechanisms: string[] = [];
  const parenRegex = /\(([^)]{10,120})\)/g;
  let match;
  while ((match = parenRegex.exec(text)) !== null) {
    const content = match[1].trim();
    // Filtrer les contenus qui ressemblent à des mécanismes (contiennent des termes scientifiques)
    if (/récepteur|inhibition|activation|modulation|enzyme|voie|canal|signal|NF-κB|GABA|COX|TNF|CB[12]|IC50|Ki|EC50/i.test(content)) {
      mechanisms.push(content);
    }
  }
  return [...new Set(mechanisms)].slice(0, 6); // Max 6 mécanismes uniques
}

function extractContraindications(text: string): string[] {
  const lower = text.toLowerCase();
  const contraindications: string[] = [];
  if (lower.includes("irritant") || lower.includes("irritation")) contraindications.push("Peut être irritant pour la peau ou les muqueuses");
  if (lower.includes("photosensibili")) contraindications.push("Photosensibilisant — éviter l'exposition solaire après application");
  if (lower.includes("allergène") || lower.includes("allergique")) contraindications.push("Potentiellement allergène — test cutané recommandé");
  if (lower.includes("grossesse") || lower.includes("enceinte")) contraindications.push("Déconseillé pendant la grossesse");
  if (lower.includes("enfant") || lower.includes("pédiatrique")) contraindications.push("Usage pédiatrique à surveiller");
  if (lower.includes("toxique") || lower.includes("toxicité")) contraindications.push("Toxique à forte concentration — respecter les dosages IFRA");
  return contraindications;
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export function TherapeuticPropertiesTab({
  moleculeId,
  moleculeName,
  therapeuticProperties,
  olfactiveProfile,
}: TherapeuticPropertiesTabProps) {
  // Références bibliographiques liées à cette molécule
  const { data: refs } = trpc.bibliography.getByMolecule.useQuery(
    { moleculeId },
    { enabled: !!moleculeId }
  );

  const hasData = therapeuticProperties &&
    therapeuticProperties !== "null" &&
    therapeuticProperties !== "Aucune propriété thérapeutique documentée" &&
    therapeuticProperties !== "Pas de propriétés thérapeutiques documentées. Utilisé comme fixateur en parfumerie.";

  if (!hasData) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Shield className="h-14 w-14 mx-auto mb-4 opacity-30" />
        <p className="text-base font-medium">Aucune propriété thérapeutique documentée</p>
        <p className="text-sm mt-2 max-w-sm mx-auto">
          Les données thérapeutiques de {moleculeName} seront enrichies progressivement à partir de la littérature scientifique.
        </p>
      </div>
    );
  }

  const detectedProps = detectProperties(therapeuticProperties!);
  const mechanisms = extractMechanisms(therapeuticProperties!);
  const contraindications = extractContraindications(therapeuticProperties!);
  const therapeuticRefs = refs?.filter(r => r.researchDomain === "chimie_olfactive" || r.researchDomain === "neurologie_olfactive" || r.researchDomain === "botanique") ?? [];

  return (
    <div className="space-y-6">
      {/* Badges de propriétés détectées */}
      {detectedProps.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Propriétés identifiées
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {detectedProps.map((prop) => (
              <Badge
                key={prop.key}
                variant="outline"
                className={`${prop.color} ${prop.bgColor} ${prop.borderColor} gap-1.5 px-3 py-1`}
              >
                {prop.icon}
                {prop.label}
              </Badge>
            ))}
          </div>

          {/* Cartes de propriétés détaillées */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {detectedProps.map((prop) => (
              <div
                key={prop.key}
                className={`p-4 rounded-lg border ${prop.bgColor} ${prop.borderColor}`}
              >
                <h4 className={`font-semibold text-sm mb-1.5 flex items-center gap-2 ${prop.color}`}>
                  {prop.icon}
                  {prop.label}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Texte complet structuré */}
      <div className="bg-muted/30 rounded-lg border p-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Description complète
        </h3>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{therapeuticProperties}</p>
      </div>

      {/* Mécanismes d'action */}
      {mechanisms.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Microscope className="h-4 w-4" />
            Mécanismes d'action identifiés
          </h3>
          <div className="space-y-2">
            {mechanisms.map((mech, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-muted-foreground">{mech}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profil olfactif */}
      {olfactiveProfile && (
        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800 p-5">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Wind className="h-4 w-4" />
            Profil olfactif
          </h3>
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">{olfactiveProfile}</p>
        </div>
      )}

      {/* Contre-indications */}
      {contraindications.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800 p-5">
          <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Précautions
          </h3>
          <ul className="space-y-1.5">
            {contraindications.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-orange-900 dark:text-orange-200">
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Références bibliographiques */}
      {therapeuticRefs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Références scientifiques
          </h3>
          <div className="space-y-2">
            {therapeuticRefs.slice(0, 5).map((ref: any) => (
              <div key={ref.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border text-sm">
                <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{ref.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {ref.authors} {ref.year && `(${ref.year})`}
                    {ref.journal && ` — ${ref.journal}`}
                  </p>
                </div>
                {ref.doi && (
                  <a
                    href={`https://doi.org/${ref.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
          <Link href="/bibliographie" className="text-xs text-primary hover:underline mt-2 inline-block">
            Voir toutes les références →
          </Link>
        </div>
      )}

      {/* Avertissement médical */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-lg border border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong>Avertissement :</strong> Les propriétés thérapeutiques présentées sont issues de la littérature scientifique (PMC, EFSA, ISO, PubChem) et des études ethnobotaniques. Ces informations sont à titre documentaire et ne constituent pas un avis médical. Consultez un professionnel de santé avant toute utilisation thérapeutique.
        </p>
      </div>
    </div>
  );
}
