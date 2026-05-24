import type { MoleculeExtended, MoleculeReference } from '../../../../shared/domain-types';

// Types locaux pour les données tRPC
export interface IfraRestriction {
  id: number;
  moleculeId: number;
  category: string;
  maxConcentration?: number | null;
  notes?: string | null;
  source?: string | null;
  updatedAt?: Date | null;
}

export interface MoleculeOrigin {
  id: number;
  moleculeId: number;
  country?: string | null;
  region?: string | null;
  plantName?: string | null;
  notes?: string | null;
}

export interface TpsGene {
  id: number;
  geneName: string;
  species?: string | null;
  accession?: string | null;
  function?: string | null;
  substrate?: string | null;
  product?: string | null;
}

export interface ResearchTransformation {
  id: number;
  sourceMolecule?: string | null;
  productMolecule?: string | null;
  reactionType?: string | null;
  conditions?: string | null;
  yield?: string | null;
  notes?: string | null;
}

export interface TransformationsResult {
  success: boolean;
  asSource: ResearchTransformation[];
  asProduct: ResearchTransformation[];
  stats?: {
    total: number;
    totalAsSource: number;
    totalAsProduct: number;
  };
  error?: string;
}

export interface RadarDataPoint {
  axis: string;
  value: number;
}

export interface MoleculeTabProps {
  mol: MoleculeExtended;
  molecule: MoleculeExtended;
  id: number;
  normOlfactiveProfile: string[];
  normOlfactiveProfileStr: string;
  normTherapeuticProperties: string;
  normBotanicalSources: string;
  safeReferences: MoleculeReference[];
  radarData: RadarDataPoint[];
  hasRadarData: boolean;
  ifraRestrictions?: IfraRestriction[] | null;
  hasIfraRestrictions: boolean;
  primaryRestriction?: IfraRestriction | null;
  moleculeOrigins?: MoleculeOrigin[] | null;
  isLoadingOrigins: boolean;
  moleculeTransformations?: TransformationsResult | null;
  isLoadingTransformations: boolean;
  tpsGenes?: TpsGene[] | null;
  isLoadingTps: boolean;
}
