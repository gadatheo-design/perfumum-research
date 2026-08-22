/**
 * Props partagées par les six onglets de la fiche molécule.
 *
 * Ces types étaient auparavant écrits à la main et ne correspondaient à
 * aucune procédure réelle : `IfraRestriction` déclarait `category` et
 * `maxConcentration` alors que la table a des colonnes `category1`…`category11`,
 * `TpsGene` inventait `accession` / `substrate` / `product`, et
 * `ResearchTransformation` ne ressemblait pas au retour de
 * `research.getTransformationsByMolecule`. Résultat : trente et une erreurs
 * aux six points de passage des props, et aucune vérification utile à
 * l'intérieur des onglets.
 *
 * On les dérive maintenant du routeur. Si une procédure change de forme, ce
 * sont les onglets qui échouent à la compilation — ce qu'on veut — au lieu de
 * lire des champs absents en silence.
 */
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../server/routers";
import type { MoleculeExtended, MoleculeReference } from "../../../../shared/domain-types";

type RouterOutput = inferRouterOutputs<AppRouter>;

/** Restriction IFRA telle que `ifraRestrictions.getByMolecule` la renvoie. */
export type IfraRestriction = RouterOutput["ifraRestrictions"]["getByMolecule"][number];

/** Origine géographique, depuis `moleculeOrigins.getByMolecule`. */
export type MoleculeOrigin = RouterOutput["moleculeOrigins"]["getByMolecule"][number];

/** Gène TPS, depuis `molecules.getTpsGenes`. */
export type TpsGene = RouterOutput["molecules"]["getTpsGenes"][number];

/** Retour complet de `research.getTransformationsByMolecule`. */
export type TransformationsResult = RouterOutput["research"]["getTransformationsByMolecule"];

/** Une transformation isolée, extraite du retour ci-dessus. */
export type ResearchTransformation = TransformationsResult extends { asSource: (infer T)[] }
  ? T
  : never;

/** Point du diagramme radar, construit côté page. */
export interface RadarDataPoint {
  axis: string;
  value: number;
}

export interface MoleculeTabProps {
  mol: MoleculeExtended;
  /** Vient de `molecules.getById` : peut être absent le temps du chargement. */
  molecule: RouterOutput["molecules"]["getById"];
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
