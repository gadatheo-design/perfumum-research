/**
 * Suggestions de synergies : paires de molécules aux profils radar proches.
 *
 * Calcul pur, sans base de données, pour être testable sur des données
 * synthétiques. L'ancienne version comparait toutes les molécules deux à
 * deux et gardait en mémoire CHAQUE paire assez proche avant de trier. Or
 * 7 245 des 7 473 molécules portent le profil par défaut (50 sur les six
 * axes) : elles sont toutes à distance nulle les unes des autres, soit
 * 27,7 millions de paires retenues — 2 Go de mémoire épuisés, et le serveur
 * tombait pour un seul visiteur de /suggestions-synergies.
 *
 * Trois garde-fous :
 *   1. le profil 50 × 6 est la valeur par défaut de la colonne, pas une
 *      mesure : il est traité comme « non renseigné » et exclu ;
 *   2. le nombre de molécules comparées est plafonné (MAX_COMPARED) ;
 *   3. seules les `limit` meilleures paires sont gardées, dans un tas de
 *      taille fixe : la mémoire ne dépend plus du nombre de paires.
 */

export const RADAR_DEFAULT_VALUE = 50;
/** Au-delà, les molécules ne sont pas comparées (2 000 → 2 millions de paires). */
export const MAX_COMPARED = 2000;
export const MAX_SUGGESTIONS = 50;

const MAX_DISTANCE = Math.sqrt(6 * 100 * 100); // ≈ 245 : profils opposés

export interface RadarMolecule {
  id: number;
  name: string;
  radarIntensity: number | null;
  radarFreshness: number | null;
  radarWarmth: number | null;
  radarSweetness: number | null;
  radarSpiciness: number | null;
  radarEarthiness: number | null;
}

export interface RadarProfile {
  intensity: number | null;
  freshness: number | null;
  warmth: number | null;
  sweetness: number | null;
  spiciness: number | null;
  earthiness: number | null;
}

export interface SynergySuggestion {
  molecule1Id: number;
  molecule1Name: string;
  molecule2Id: number;
  molecule2Name: string;
  similarity: number;
  distance: number;
  radarProfile1: RadarProfile;
  radarProfile2: RadarProfile;
  explanation: string;
}

export interface SynergySuggestionResult {
  suggestions: SynergySuggestion[];
  /** Explication à afficher quand il n'y a rien à suggérer, ou un plafond atteint. */
  message: string | null;
  /** Molécules dont le profil radar est réellement renseigné. */
  moleculesWithProfile: number;
  /** Molécules effectivement comparées (plafonnées à MAX_COMPARED). */
  moleculesCompared: number;
}

const AXES = [
  ["radarIntensity", "Intensité"],
  ["radarFreshness", "Fraîcheur"],
  ["radarWarmth", "Chaleur"],
  ["radarSweetness", "Douceur"],
  ["radarSpiciness", "Épices"],
  ["radarEarthiness", "Terreux"],
] as const;

/** Vrai si les six axes sont renseignés et ne sont pas tous à la valeur par défaut. */
export function hasInformedRadarProfile(molecule: RadarMolecule): boolean {
  let allDefault = true;
  for (const [key] of AXES) {
    const value = molecule[key];
    if (value === null || value === undefined || !Number.isFinite(value)) return false;
    if (value !== RADAR_DEFAULT_VALUE) allDefault = false;
  }
  return !allDefault;
}

function toProfile(molecule: RadarMolecule): RadarProfile {
  return {
    intensity: molecule.radarIntensity,
    freshness: molecule.radarFreshness,
    warmth: molecule.radarWarmth,
    sweetness: molecule.radarSweetness,
    spiciness: molecule.radarSpiciness,
    earthiness: molecule.radarEarthiness,
  };
}

/** Une paire candidate : deux indices et le carré de leur distance. */
interface Candidate {
  i: number;
  j: number;
  d2: number;
}

/** `a` est-elle moins bonne que `b` ? (plus lointaine, puis indices plus grands) */
function worse(a: Candidate, b: Candidate): boolean {
  if (a.d2 !== b.d2) return a.d2 > b.d2;
  if (a.i !== b.i) return a.i > b.i;
  return a.j > b.j;
}

/**
 * Tas de taille fixe qui garde les `capacity` meilleures paires. La racine
 * est la MOINS bonne des paires gardées : une nouvelle paire n'entre que si
 * elle fait mieux, et prend alors sa place.
 */
class BestPairs {
  private readonly heap: Candidate[] = [];
  constructor(private readonly capacity: number) {}

  offer(i: number, j: number, d2: number): void {
    const heap = this.heap;
    if (heap.length < this.capacity) {
      heap.push({ i, j, d2 });
      this.siftUp(heap.length - 1);
      return;
    }
    const root = heap[0];
    // Comparaison sans allocation : c'est le chemin emprunté des millions de fois.
    if (d2 > root.d2 || (d2 === root.d2 && (i > root.i || (i === root.i && j >= root.j)))) return;
    root.i = i;
    root.j = j;
    root.d2 = d2;
    this.siftDown(0);
  }

  /** Les paires gardées, de la meilleure à la moins bonne. */
  sorted(): Candidate[] {
    return [...this.heap].sort((a, b) => (worse(a, b) ? 1 : -1));
  }

  private siftUp(index: number): void {
    const heap = this.heap;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (!worse(heap[index], heap[parent])) break;
      [heap[index], heap[parent]] = [heap[parent], heap[index]];
      index = parent;
    }
  }

  private siftDown(index: number): void {
    const heap = this.heap;
    for (;;) {
      const left = 2 * index + 1;
      const right = left + 1;
      let worst = index;
      if (left < heap.length && worse(heap[left], heap[worst])) worst = left;
      if (right < heap.length && worse(heap[right], heap[worst])) worst = right;
      if (worst === index) return;
      [heap[index], heap[worst]] = [heap[worst], heap[index]];
      index = worst;
    }
  }
}

function describe(a: RadarMolecule, b: RadarMolecule): string {
  const similarAxes = AXES.filter(([key]) => Math.abs((a[key] ?? 0) - (b[key] ?? 0)) < 20).map(
    ([, label]) => label
  );
  return similarAxes.length > 0
    ? `Profils similaires sur ${similarAxes.join(", ")}`
    : "Profils complémentaires";
}

function clampInt(value: number | undefined, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

export function computeSynergySuggestions(
  molecules: readonly RadarMolecule[],
  options: { minSimilarity?: number; limit?: number; maxCompared?: number } = {}
): SynergySuggestionResult {
  const limit = clampInt(options.limit, 10, 1, MAX_SUGGESTIONS);
  const maxCompared = clampInt(options.maxCompared, MAX_COMPARED, 2, MAX_COMPARED);
  const minSimilarity =
    typeof options.minSimilarity === "number" && Number.isFinite(options.minSimilarity)
      ? Math.min(100, Math.max(0, options.minSimilarity))
      : 70;

  const informed = molecules.filter(hasInformedRadarProfile);
  const moleculesWithProfile = informed.length;

  if (moleculesWithProfile < 2) {
    return {
      suggestions: [],
      message:
        moleculesWithProfile === 0
          ? "Aucune molécule n'a de profil radar renseigné : les suggestions ne peuvent pas être calculées. Le profil par défaut (50 sur les six axes) n'est pas pris en compte."
          : "Une seule molécule a un profil radar renseigné : il en faut au moins deux pour proposer une paire.",
      moleculesWithProfile,
      moleculesCompared: 0,
    };
  }

  // Ordre stable (par identifiant) : le plafond retient toujours les mêmes.
  const compared = [...informed].sort((a, b) => a.id - b.id).slice(0, maxCompared);
  const n = compared.length;

  // Six tableaux compacts plutôt que n objets : la double boucle ne lit que des nombres.
  const axes = AXES.map(([key]) => Float64Array.from(compared, m => m[key] as number));
  const [a0, a1, a2, a3, a4, a5] = axes;

  // similarité ≥ seuil  ⇔  distance ≤ MAX_DISTANCE × (1 − seuil/100)
  const maxAllowed = MAX_DISTANCE * (1 - minSimilarity / 100);
  const maxAllowedD2 = maxAllowed * maxAllowed + 1e-9;

  const best = new BestPairs(limit);
  for (let i = 0; i < n; i++) {
    const i0 = a0[i], i1 = a1[i], i2 = a2[i], i3 = a3[i], i4 = a4[i], i5 = a5[i];
    for (let j = i + 1; j < n; j++) {
      const d0 = i0 - a0[j], d1 = i1 - a1[j], d2 = i2 - a2[j];
      const d3 = i3 - a3[j], d4 = i4 - a4[j], d5 = i5 - a5[j];
      const squared = d0 * d0 + d1 * d1 + d2 * d2 + d3 * d3 + d4 * d4 + d5 * d5;
      if (squared <= maxAllowedD2) best.offer(i, j, squared);
    }
  }

  const suggestions = best.sorted().map(({ i, j, d2 }): SynergySuggestion => {
    const mol1 = compared[i];
    const mol2 = compared[j];
    const distance = Math.sqrt(d2);
    const similarity = Math.max(0, Math.min(100, 100 * (1 - distance / MAX_DISTANCE)));
    return {
      molecule1Id: mol1.id,
      molecule1Name: mol1.name,
      molecule2Id: mol2.id,
      molecule2Name: mol2.name,
      similarity: Math.round(similarity * 10) / 10,
      distance: Math.round(distance * 10) / 10,
      radarProfile1: toProfile(mol1),
      radarProfile2: toProfile(mol2),
      explanation: describe(mol1, mol2),
    };
  });

  let message: string | null = null;
  if (moleculesWithProfile > n) {
    message = `Calcul limité aux ${n} premières molécules sur ${moleculesWithProfile} dont le profil radar est renseigné.`;
  } else if (suggestions.length === 0) {
    message = "Aucune paire n'atteint ce seuil de similarité. Essayez de le réduire.";
  }

  return { suggestions, message, moleculesWithProfile, moleculesCompared: n };
}
