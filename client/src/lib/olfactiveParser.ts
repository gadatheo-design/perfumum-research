// Sensory dimensions with associated keywords
export const SENSORY_DIMENSIONS = {
  terreux: ['terreux', 'terre', 'sol', 'humide', 'mousse', 'champignon', 'géosmine', 'pétrichor', 'minéral', 'pierre'],
  fruité: ['fruité', 'fruit', 'pomme', 'poire', 'agrume', 'citron', 'orange', 'pêche', 'abricot', 'frais', 'juteux'],
  floral: ['floral', 'fleur', 'rose', 'jasmin', 'lavande', 'violette', 'muguet', 'ylang', 'parfumé', 'délicat'],
  épicé: ['épicé', 'épice', 'poivre', 'cannelle', 'clou', 'girofle', 'muscade', 'piquant', 'chaud', 'aromatique'],
  boisé: ['boisé', 'bois', 'cèdre', 'santal', 'pin', 'sapin', 'résine', 'écorce', 'sec', 'ligneux'],
  animal: ['animal', 'cuir', 'musc', 'ambre', 'castoreum', 'civette', 'charnel', 'sensuel', 'fauve'],
  chimique: ['chimique', 'synthétique', 'aldéhyde', 'ozonic', 'métallique', 'plastique', 'industriel'],
  aquatique: ['aquatique', 'marin', 'océan', 'mer', 'eau', 'algue', 'iodé', 'frais', 'humide', 'calone'],
} as const;

export type SensoryDimension = keyof typeof SENSORY_DIMENSIONS;

export interface OlfactiveScore {
  dimension: SensoryDimension;
  score: number; // 0-5
}

/**
 * Parse olfactive profile text and extract sensory dimension scores
 */
export function parseOlfactiveProfile(profile: string | null): OlfactiveScore[] {
  if (!profile) {
    return Object.keys(SENSORY_DIMENSIONS).map(dim => ({
      dimension: dim as SensoryDimension,
      score: 0,
    }));
  }

  const profileLower = profile.toLowerCase();
  const scores: OlfactiveScore[] = [];

  for (const [dimension, keywords] of Object.entries(SENSORY_DIMENSIONS)) {
    let score = 0;
    
    // Count keyword matches
    for (const keyword of keywords) {
      if (profileLower.includes(keyword)) {
        score += 1;
      }
    }
    
    // Normalize score to 0-5 range
    // If multiple keywords found, cap at 5
    const normalizedScore = Math.min(score, 5);
    
    scores.push({
      dimension: dimension as SensoryDimension,
      score: normalizedScore,
    });
  }

  return scores;
}

/**
 * Get French label for sensory dimension
 */
export function getDimensionLabel(dimension: SensoryDimension): string {
  const labels: Record<SensoryDimension, string> = {
    terreux: 'Terreux',
    fruité: 'Fruité',
    floral: 'Floral',
    épicé: 'Épicé',
    boisé: 'Boisé',
    animal: 'Animal',
    chimique: 'Chimique',
    aquatique: 'Aquatique',
  };
  return labels[dimension];
}
