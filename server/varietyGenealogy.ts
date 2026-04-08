/**
 * varietyGenealogy.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Système de gestion des généalogies de variétés (parents, soeurs, hybrides)
 * pour Nicotiana, Cannabis, Citrus et autres plantes.
 *
 * Structure de données :
 * - VarietyNode : Nœud dans l'arbre généalogique (variété)
 * - VarietyRelation : Relation entre deux variétés (parent, soeur, hybride)
 * - VarietyGenealogy : Arbre généalogique complet d'une variété
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type RelationType = 'parent' | 'sibling' | 'hybrid' | 'cultivar' | 'cross' | 'mutation';

export interface VarietyNode {
  /** ID unique de la variété */
  id: string;
  /** Nom de la variété */
  name: string;
  /** Espèce parente (ex: Nicotiana tabacum, Cannabis sativa) */
  species: string;
  /** Année de création/découverte */
  year?: number;
  /** Région/terroir d'origine */
  origin?: string;
  /** Statut de conservation */
  conservationStatus?: 'extinct' | 'endangered' | 'vulnerable' | 'stable' | 'cultivated';
  /** Description courte */
  description?: string;
  /** Profil moléculaire (terpènes, alcaloïdes) */
  molecularProfile?: Record<string, number>;
  /** Métadonnées supplémentaires */
  metadata?: Record<string, unknown>;
}

export interface VarietyRelation {
  /** ID unique de la relation */
  id: string;
  /** Variété source */
  sourceId: string;
  /** Variété cible */
  targetId: string;
  /** Type de relation */
  type: RelationType;
  /** Année de la relation (croisement, mutation, etc.) */
  year?: number;
  /** Description de la relation */
  description?: string;
  /** Métadonnées supplémentaires */
  metadata?: Record<string, unknown>;
}

export interface VarietyGenealogy {
  /** Variété racine */
  rootVariety: VarietyNode;
  /** Tous les nœuds de l'arbre */
  nodes: VarietyNode[];
  /** Toutes les relations */
  relations: VarietyRelation[];
  /** Profondeur de l'arbre (générations) */
  depth: number;
  /** Nombre total de variétés */
  totalVarieties: number;
}

// ── Données d'exemple pour Nicotiana ──────────────────────────────────────────

export const nicotianaVarietyGenealogy: VarietyGenealogy = {
  rootVariety: {
    id: 'nicotiana-tabacum-virginia',
    name: 'Virginia',
    species: 'Nicotiana tabacum',
    year: 1612,
    origin: 'Virginie, États-Unis',
    conservationStatus: 'cultivated',
    description: 'Variété classique de tabac Virginia, légère et sucrée',
    molecularProfile: {
      'Limonène': 2.5,
      'Myrcène': 1.8,
      'Pinène': 1.2,
      'Nicotine': 1.5,
    },
  },
  nodes: [
    {
      id: 'nicotiana-tabacum-virginia',
      name: 'Virginia',
      species: 'Nicotiana tabacum',
      year: 1612,
      origin: 'Virginie, États-Unis',
      conservationStatus: 'cultivated',
      description: 'Variété classique de tabac Virginia',
      molecularProfile: {
        'Limonène': 2.5,
        'Myrcène': 1.8,
        'Pinène': 1.2,
        'Nicotine': 1.5,
      },
    },
    {
      id: 'nicotiana-tabacum-burley',
      name: 'Burley',
      species: 'Nicotiana tabacum',
      year: 1864,
      origin: 'Kentucky, États-Unis',
      conservationStatus: 'cultivated',
      description: 'Tabac Burley, léger et neutre',
      molecularProfile: {
        'Limonène': 1.2,
        'Myrcène': 0.8,
        'Pinène': 0.5,
        'Nicotine': 1.8,
      },
    },
    {
      id: 'nicotiana-tabacum-oriental',
      name: 'Oriental',
      species: 'Nicotiana tabacum',
      year: 1800,
      origin: 'Turquie, Balkans',
      conservationStatus: 'cultivated',
      description: 'Tabac Oriental, aromatique et épicé',
      molecularProfile: {
        'Limonène': 3.5,
        'Myrcène': 2.5,
        'Pinène': 2.0,
        'Nicotine': 1.2,
      },
    },
    {
      id: 'nicotiana-tabacum-perique',
      name: 'Perique',
      species: 'Nicotiana tabacum',
      year: 1750,
      origin: 'Louisiane, États-Unis',
      conservationStatus: 'vulnerable',
      description: 'Tabac Perique, rare et très aromatique',
      molecularProfile: {
        'Limonène': 4.2,
        'Myrcène': 3.1,
        'Pinène': 2.8,
        'Nicotine': 1.0,
      },
    },
    {
      id: 'nicotiana-rustica',
      name: 'Rustica',
      species: 'Nicotiana rustica',
      year: 1500,
      origin: 'Amérique du Sud',
      conservationStatus: 'cultivated',
      description: 'Tabac Rustica, forte teneur en nicotine',
      molecularProfile: {
        'Limonène': 1.0,
        'Myrcène': 0.6,
        'Pinène': 0.4,
        'Nicotine': 3.5,
      },
    },
  ],
  relations: [
    {
      id: 'rel-virginia-burley',
      sourceId: 'nicotiana-tabacum-virginia',
      targetId: 'nicotiana-tabacum-burley',
      type: 'cultivar',
      year: 1864,
      description: 'Burley dérivé de Virginia',
    },
    {
      id: 'rel-virginia-oriental',
      sourceId: 'nicotiana-tabacum-virginia',
      targetId: 'nicotiana-tabacum-oriental',
      type: 'sibling',
      year: 1800,
      description: 'Oriental et Virginia coexistent',
    },
    {
      id: 'rel-virginia-perique',
      sourceId: 'nicotiana-tabacum-virginia',
      targetId: 'nicotiana-tabacum-perique',
      type: 'cultivar',
      year: 1750,
      description: 'Perique dérivé de Virginia',
    },
    {
      id: 'rel-burley-oriental',
      sourceId: 'nicotiana-tabacum-burley',
      targetId: 'nicotiana-tabacum-oriental',
      type: 'hybrid',
      year: 1950,
      description: 'Croisement Burley × Oriental',
    },
  ],
  depth: 3,
  totalVarieties: 5,
};

// ── Données d'exemple pour Cannabis ───────────────────────────────────────────

export const cannabisVarietyGenealogy: VarietyGenealogy = {
  rootVariety: {
    id: 'cannabis-sativa',
    name: 'Sativa',
    species: 'Cannabis sativa',
    origin: 'Asie centrale',
    conservationStatus: 'cultivated',
    description: 'Cannabis Sativa, effets énergisants',
    molecularProfile: {
      'THC': 15,
      'CBD': 1,
      'Myrcène': 2.5,
      'Limonène': 1.8,
      'Pinène': 1.2,
    },
  },
  nodes: [
    {
      id: 'cannabis-sativa',
      name: 'Sativa',
      species: 'Cannabis sativa',
      origin: 'Asie centrale',
      conservationStatus: 'cultivated',
      description: 'Cannabis Sativa',
      molecularProfile: {
        'THC': 15,
        'CBD': 1,
        'Myrcène': 2.5,
        'Limonène': 1.8,
        'Pinène': 1.2,
      },
    },
    {
      id: 'cannabis-indica',
      name: 'Indica',
      species: 'Cannabis indica',
      origin: 'Hindou Kouch',
      conservationStatus: 'cultivated',
      description: 'Cannabis Indica, effets relaxants',
      molecularProfile: {
        'THC': 18,
        'CBD': 0.5,
        'Myrcène': 3.5,
        'Limonène': 0.8,
        'Pinène': 0.5,
      },
    },
    {
      id: 'cannabis-ruderalis',
      name: 'Ruderalis',
      species: 'Cannabis ruderalis',
      origin: 'Sibérie',
      conservationStatus: 'stable',
      description: 'Cannabis Ruderalis, autofloraison',
      molecularProfile: {
        'THC': 5,
        'CBD': 3,
        'Myrcène': 1.2,
        'Limonène': 0.5,
        'Pinène': 0.3,
      },
    },
  ],
  relations: [
    {
      id: 'rel-sativa-indica',
      sourceId: 'cannabis-sativa',
      targetId: 'cannabis-indica',
      type: 'sibling',
      description: 'Sativa et Indica sont des sous-espèces',
    },
    {
      id: 'rel-sativa-ruderalis',
      sourceId: 'cannabis-sativa',
      targetId: 'cannabis-ruderalis',
      type: 'sibling',
      description: 'Ruderalis est une sous-espèce distincte',
    },
  ],
  depth: 2,
  totalVarieties: 3,
};

// ── Données d'exemple pour Citrus ─────────────────────────────────────────────

export const citrusVarietyGenealogy: VarietyGenealogy = {
  rootVariety: {
    id: 'citrus-sinensis',
    name: 'Orange Douce',
    species: 'Citrus × sinensis',
    origin: 'Chine',
    conservationStatus: 'cultivated',
    description: 'Orange douce, hybride naturel',
    molecularProfile: {
      'Limonène': 85,
      'Myrcène': 2,
      'Pinène': 1.5,
      'Linalol': 0.5,
    },
  },
  nodes: [
    {
      id: 'citrus-sinensis',
      name: 'Orange Douce',
      species: 'Citrus × sinensis',
      origin: 'Chine',
      conservationStatus: 'cultivated',
      description: 'Orange douce',
      molecularProfile: {
        'Limonène': 85,
        'Myrcène': 2,
        'Pinène': 1.5,
        'Linalol': 0.5,
      },
    },
    {
      id: 'citrus-aurantium',
      name: 'Orange Amère',
      species: 'Citrus × aurantium',
      origin: 'Asie du Sud-Est',
      conservationStatus: 'cultivated',
      description: 'Orange amère, riche en huile essentielle',
      molecularProfile: {
        'Limonène': 70,
        'Myrcène': 3,
        'Pinène': 2.5,
        'Linalol': 1.5,
      },
    },
    {
      id: 'citrus-limon',
      name: 'Citron',
      species: 'Citrus limon',
      origin: 'Asie du Sud-Est',
      conservationStatus: 'cultivated',
      description: 'Citron, acide et frais',
      molecularProfile: {
        'Limonène': 60,
        'Myrcène': 2.5,
        'Pinène': 3,
        'Linalol': 0.8,
      },
    },
  ],
  relations: [
    {
      id: 'rel-sinensis-aurantium',
      sourceId: 'citrus-sinensis',
      targetId: 'citrus-aurantium',
      type: 'sibling',
      description: 'Oranges douce et amère',
    },
    {
      id: 'rel-sinensis-limon',
      sourceId: 'citrus-sinensis',
      targetId: 'citrus-limon',
      type: 'sibling',
      description: 'Orange et Citron, genres proches',
    },
  ],
  depth: 2,
  totalVarieties: 3,
};

// ── Utilitaires ───────────────────────────────────────────────────────────────

/**
 * Récupère tous les ancêtres d'une variété
 */
export function getAncestors(
  varietyId: string,
  genealogy: VarietyGenealogy
): VarietyNode[] {
  const ancestors: VarietyNode[] = [];
  const visited = new Set<string>();

  function traverse(id: string) {
    if (visited.has(id)) return;
    visited.add(id);

    const parentRelations = genealogy.relations.filter(
      (rel) => rel.targetId === id && (rel.type === 'parent' || rel.type === 'cultivar')
    );

    for (const rel of parentRelations) {
      const parent = genealogy.nodes.find((n) => n.id === rel.sourceId);
      if (parent) {
        ancestors.push(parent);
        traverse(rel.sourceId);
      }
    }
  }

  traverse(varietyId);
  return ancestors;
}

/**
 * Récupère tous les descendants d'une variété
 */
export function getDescendants(
  varietyId: string,
  genealogy: VarietyGenealogy
): VarietyNode[] {
  const descendants: VarietyNode[] = [];
  const visited = new Set<string>();

  function traverse(id: string) {
    if (visited.has(id)) return;
    visited.add(id);

    const childRelations = genealogy.relations.filter(
      (rel) => rel.sourceId === id && (rel.type === 'parent' || rel.type === 'cultivar')
    );

    for (const rel of childRelations) {
      const child = genealogy.nodes.find((n) => n.id === rel.targetId);
      if (child) {
        descendants.push(child);
        traverse(rel.targetId);
      }
    }
  }

  traverse(varietyId);
  return descendants;
}

/**
 * Récupère tous les hybrides d'une variété
 */
export function getHybrids(
  varietyId: string,
  genealogy: VarietyGenealogy
): VarietyNode[] {
  const hybrids: VarietyNode[] = [];

  const hybridRelations = genealogy.relations.filter(
    (rel) =>
      (rel.sourceId === varietyId || rel.targetId === varietyId) &&
      rel.type === 'hybrid'
  );

  for (const rel of hybridRelations) {
    const hybridId = rel.sourceId === varietyId ? rel.targetId : rel.sourceId;
    const hybrid = genealogy.nodes.find((n) => n.id === hybridId);
    if (hybrid) {
      hybrids.push(hybrid);
    }
  }

  return hybrids;
}

/**
 * Récupère tous les frères et sœurs d'une variété
 */
export function getSiblings(
  varietyId: string,
  genealogy: VarietyGenealogy
): VarietyNode[] {
  const siblings: VarietyNode[] = [];

  const siblingRelations = genealogy.relations.filter(
    (rel) =>
      (rel.sourceId === varietyId || rel.targetId === varietyId) &&
      rel.type === 'sibling'
  );

  for (const rel of siblingRelations) {
    const siblingId = rel.sourceId === varietyId ? rel.targetId : rel.sourceId;
    const sibling = genealogy.nodes.find((n) => n.id === siblingId);
    if (sibling) {
      siblings.push(sibling);
    }
  }

  return siblings;
}
