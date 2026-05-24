/**
 * Constantes partagées entre les composants molecule/
 * Centralisées ici pour éviter les duplications et les erreurs d'import.
 */

export const SYNERGY_TYPE_CONFIG: Record<string, {
  label: string;
  color: string;
  bg: string;
  icon: string;
  description: string;
}> = {
  potentialisation: {
    label: "Potentialisation",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    icon: "⚡",
    description: "Les deux molécules se renforcent mutuellement, amplifiant leur effet olfactif.",
  },
  stabilisation: {
    label: "Stabilisation",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    icon: "🔒",
    description: "L'une des molécules stabilise ou fixe l'autre, prolongeant sa tenue.",
  },
  transformation: {
    label: "Transformation",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
    icon: "🔄",
    description: "La combinaison crée un accord olfactif nouveau, différent des deux molécules seules.",
  },
  masquage: {
    label: "Masquage",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    icon: "🎭",
    description: "Une molécule atténue ou masque l'odeur de l'autre.",
  },
  neutralisation: {
    label: "Neutralisation",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    icon: "⊘",
    description: "Les deux molécules s'annulent mutuellement.",
  },
  accord: {
    label: "Accord",
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/30",
    icon: "🎵",
    description: "Les deux molécules créent un accord harmonieux.",
  },
  contraste: {
    label: "Contraste",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/30",
    icon: "↔",
    description: "Les deux molécules créent un contraste olfactif intéressant.",
  },
};

export const CHEMICAL_CLASS_LABELS: Record<string, string> = {
  terpene: "Terpène",
  sesquiterpene: "Sesquiterpène",
  diterpene: "Diterpène",
  monoterpene: "Monoterpène",
  aldehyde: "Aldéhyde",
  ketone: "Cétone",
  alcohol: "Alcool",
  ester: "Ester",
  ether: "Éther",
  phenol: "Phénol",
  lactone: "Lactone",
  coumarin: "Coumarine",
  musk: "Musc",
  nitrile: "Nitrile",
  sulfur_compound: "Composé soufré",
  heterocyclic: "Hétérocyclique",
  aromatic: "Aromatique",
  aliphatic: "Aliphatique",
  other: "Autre",
};

export const RESTRICTION_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  prohibited: { label: "Interdit", color: "bg-red-500" },
  restricted: { label: "Restreint", color: "bg-orange-500" },
  specification: { label: "Spécification", color: "bg-yellow-500" },
  no_restriction: { label: "Sans restriction", color: "bg-green-500" },
};

export const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  accord_principal: { label: "Accord principal", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
  note_coeur: { label: "Note de cœur", color: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300" },
  note_tete: { label: "Note de tête", color: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300" },
  note_fond: { label: "Note de fond", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300" },
  signature: { label: "Molécule signature", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  ingredient_cle: { label: "Ingrédient clé", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
};
