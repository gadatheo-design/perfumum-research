/**
 * shared/domain-types.ts
 * Types de domaine étendus pour PERFUMUM.
 * Ces interfaces couvrent les retours enrichis des routeurs tRPC (avec relations)
 * et remplacent les casts `as any` dans les composants React.
 */

export interface OlfactiveProfile {
  note?: string;
  intensity?: number;
  descriptors?: string[];
}

export interface TherapeuticProperty {
  name: string;
  description?: string;
  source?: string;
}

export interface IFRAData {
  status: string;
  reason?: string;
  maxPercent?: number;
  category?: string;
  specification?: string;
  name?: string;
  casNumber?: string;
}

export interface MoleculeReference {
  author?: string;
  year?: number;
  title: string;
  journal?: string;
  doi?: string;
  url?: string;
  type: 'pubchem' | 'academic' | 'book' | 'database' | 'other';
}

export interface CoconutOrganism {
  name: string;
  rank?: string;
}

export interface CoconutCitation {
  doi?: string;
  title?: string;
}

// ─── MoleculeExtended ────────────────────────────────────────────────────────

export interface MoleculeExtended {
  id: number;
  name: string;
  iupacName?: string | null;
  casNumber?: string | null;
  formula?: string | null;
  molecularWeight?: number | null;
  smiles?: string | null;
  inchi?: string | null;
  inchiKey?: string | null;
  familyId?: number | null;
  chemicalClass?: string | null;
  odorProfile?: string | null;
  olfactiveFamily?: string | null;
  olfactiveProfile?: string | null;
  olfactiveProfileJson?: OlfactiveProfile | null;
  boilingPoint?: number | null;
  meltingPoint?: number | null;
  flashPoint?: number | null;
  density?: number | null;
  solubility?: string | null;
  vaporPressure?: number | null;
  logP?: number | null;
  refractiveIndex?: number | null;
  opticalRotation?: string | null;
  retentionIndex?: number | null;
  radarIntensity?: number | null;
  radarFreshness?: number | null;
  radarWarmth?: number | null;
  radarSweetness?: number | null;
  radarSpiciness?: number | null;
  radarEarthiness?: number | null;
  // Les colonnes SQL s'appellent `pubchem_cid` et `chebi_id`, mais Drizzle
  // expose les propriétés en camelCase (drizzle/schema-modules/molecules.ts).
  // Ce type déclarait les noms SQL : toute lecture renvoyait `undefined` en
  // silence, et les badges PubChem/ChEBI ne s'affichaient jamais.
  pubchemCid?: number | null;
  pubchemSynonyms?: string[] | null;
  pubchemEnrichedAt?: Date | null;
  chebiId?: string | null;
  chebiEnrichedAt?: Date | null;
  coconutId?: string | null;
  npLikenessScore?: string | null;
  coconutOrganisms?: CoconutOrganism[] | null;
  coconutCitations?: CoconutCitation[] | null;
  coconutEnrichedAt?: Date | null;
  wikidataQid?: string | null;
  wikidataEnrichedAt?: Date | null;
  ifraStatus?: 'not_regulated' | 'banned' | 'restricted' | 'specification_required' | null;
  ifraData?: IFRAData | null;
  ifraEnrichedAt?: Date | null;
  therapeuticProperties?: string | null;
  therapeuticPropertiesJson?: TherapeuticProperty[] | null;
  botanicalSources?: string | null;
  references?: MoleculeReference[] | null;
  validationStatus?: 'brouillon' | 'en_revision' | 'valide' | 'rejete' | null;
  validatedBy?: number | null;
  validatedAt?: Date | null;
  contributorId?: number | null;
  description?: string | null;
  notes?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Champs olfactifs étendus (enrichis ou calculés, non stockés directement en DB)
  volatility?: number | null;
  intensity?: number | null;
  complexity?: number | null;
  emotionalResonance?: string | null;
  functionalEffect?: string | null;
  sourceOrigin?: string | null;
  extractionMethod?: string | null;
  concentration?: string | null;
  chemicalFormula?: string | null;
  family?: string | null;
}

// ─── PlantExtended ───────────────────────────────────────────────────────────

export interface PlantCertification {
  name?: string;
  type?: string;
  body?: string;
  year?: number;
  scope?: string;
}

export interface PlantThreatFactors {
  overharvesting?: boolean;
  habitat_loss?: boolean;
  climate_change?: boolean;
  illegal_trade?: boolean;
}

export interface PlantVariety {
  id: number;
  plantId: number;
  name: string;
  latinName?: string | null;
  description?: string | null;
  origin?: string | null;
  characteristics?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlantExtended {
  id: number;
  name: string;
  latinName?: string | null;
  family?: string | null;
  genus?: string | null;
  species?: string | null;
  commonNames?: string | null;
  description?: string | null;
  materialType?: string | null;
  plantPart?: string | null;
  gbifId?: string | null;
  itisId?: string | null;
  powId?: string | null;
  ncbiTaxId?: string | null;
  wikidataQid?: string | null;
  wikidataEnrichedAt?: Date | null;
  iucnStatus?: string | null;
  conservationNotes?: string | null;
  threatFactors?: PlantThreatFactors | null;
  sustainableAlternatives?: string | null;
  lastAssessmentYear?: number | null;
  historicalStatus?: string | null;
  synonyms?: string[] | null;
  authorCitation?: string | null;
  certifications?: PlantCertification[] | null;
  notes?: string | null;
  imageUrl?: string | null;
  validationStatus?: 'brouillon' | 'en_revision' | 'valide' | 'rejete' | null;
  validatedBy?: number | null;
  validatedAt?: Date | null;
  contributorId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── RecipeExtended ──────────────────────────────────────────────────────────

export interface RecipeMolecule {
  moleculeId: number;
  moleculeName: string;
  proportion?: number | null;
  unit?: string | null;
  role?: string | null;
  notes?: string | null;
}

export interface RecipeExtended {
  id: number;
  name: string;
  description?: string | null;
  formula?: string | null;
  category?: string | null;
  subcategory?: string | null;
  olfactiveFamily?: string | null;
  season?: string | null;
  occasion?: string | null;
  mood?: string | null;
  intensity?: number | null;
  longevity?: number | null;
  sillage?: number | null;
  complexity?: number | null;
  notes?: string | null;
  imageUrl?: string | null;
  isPublic?: boolean | null;
  validationStatus?: 'brouillon' | 'en_revision' | 'valide' | 'rejete' | null;
  createdAt: Date;
  updatedAt: Date;
  molecules?: RecipeMolecule[];
}

// ─── Types admin ─────────────────────────────────────────────────────────────

export interface TropicosSearchResult {
  nameId: unknown;
  scientificName: unknown;
  scientificNameWithAuthors: unknown;
  author: unknown;
  family: unknown;
  rank: unknown;
  nomenclatureStatus: unknown;
  year: unknown;
  symbol: unknown;
  url: unknown;
}

export interface TropicosSearchResultTyped {
  nameId: number;
  scientificName: string;
  scientificNameWithAuthors: string;
  author: string;
  family: string;
  rank: string;
  nomenclatureStatus: string;
  year: string;
  symbol: string;
  url: string;
}

export function normalizeTropicosResult(r: TropicosSearchResult): TropicosSearchResultTyped {
  return {
    nameId: typeof r.nameId === 'number' ? r.nameId : Number(r.nameId) || 0,
    scientificName: String(r.scientificName ?? ''),
    scientificNameWithAuthors: String(r.scientificNameWithAuthors ?? ''),
    author: String(r.author ?? ''),
    family: String(r.family ?? ''),
    rank: String(r.rank ?? ''),
    nomenclatureStatus: String(r.nomenclatureStatus ?? ''),
    year: String(r.year ?? ''),
    symbol: String(r.symbol ?? ''),
    url: String(r.url ?? ''),
  };
}

export function asMoleculeExtended(mol: Record<string, unknown>): MoleculeExtended {
  return mol as unknown as MoleculeExtended;
}

export function asPlantExtended(plant: Record<string, unknown>): PlantExtended {
  return plant as unknown as PlantExtended;
}

// ─── Interfaces D3 génériques ────────────────────────────────────────────────
// Ces interfaces couvrent les patterns communs des simulations D3 force-directed.

/**
 * Nœud générique pour les simulations D3 force-directed.
 * Étend les propriétés de simulation (x, y, fx, fy, vx, vy, index).
 */
export interface D3SimulationNode {
  id: string;
  name: string;
  // Propriétés injectées par D3 lors de la simulation
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
  index?: number;
}

/**
 * Lien générique pour les simulations D3 force-directed.
 * source et target peuvent être des IDs (string) ou des nœuds résolus (D3SimulationNode).
 */
export interface D3SimulationLink<TNode extends D3SimulationNode = D3SimulationNode> {
  source: string | TNode;
  target: string | TNode;
  value?: number;
}

/**
 * Type helper pour accéder à l'ID d'un nœud résolu par D3 (source/target après simulation).
 */
export type D3ResolvedNode<TNode extends D3SimulationNode = D3SimulationNode> = TNode & {
  x: number;
  y: number;
};

/**
 * Helper pour extraire l'ID d'un nœud D3 (résolu ou non).
 */
export function d3NodeId<TNode extends D3SimulationNode>(nodeOrId: string | TNode): string {
  return typeof nodeOrId === 'object' ? nodeOrId.id : nodeOrId;
}

/**
 * Helper pour extraire les coordonnées x/y d'un nœud D3 résolu.
 */
export function d3NodeCoords<TNode extends D3SimulationNode>(
  nodeOrId: string | TNode
): { x: number; y: number } {
  if (typeof nodeOrId === 'object') {
    return { x: nodeOrId.x ?? 0, y: nodeOrId.y ?? 0 };
  }
  return { x: 0, y: 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// Interfaces PhyloBatch — résultats des mutations d'enrichissement phylogénétique
// ─────────────────────────────────────────────────────────────────────────────

export interface PhyloBatchPlantResult {
  id: number;
  name: string;
  latinName: string;
  found: boolean;
  fieldsToUpdate: number;
  newIds: {
    gbif?: string | null;
    powo?: string | null;
    ncbi?: string | null;
    wikidata?: string | null;
    tropicos?: string | null;
  };
  existing: {
    gbif?: string | null;
    powo?: string | null;
    ncbi?: string | null;
    wikidata?: string | null;
  };
  apis: {
    gbif?: { id: string; confidence: number } | null;
    powo?: { fqId: string; status: string } | null;
    ncbi?: { taxId: string; rank: string | null } | null;
    wikidata?: { qid: string } | null;
    tropicos?: { nameId: string } | null;
  };
}

export interface GbifSpeciesResult {
  key: number;
  scientificName: string;
  canonicalName: string;
  rank: string;
  family: string;
  kingdom: string;
  confidence: number;
}

export interface PowoSearchResult {
  fqId: string;
  name: string;
  author?: string | null;
  rank?: string | null;
  status?: string | null;
  synonymOf?: string | null;
}

export interface NcbiLineageItem {
  taxId: string;
  name: string;
  rank: string;
}



export interface PhyloBatchGenus {
  genus: string;
  count: number;
}
