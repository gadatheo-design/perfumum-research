/**
 * client/src/lib/varietyGenealogy.ts
 * Réexporte les types de généalogie des variétés depuis server/varietyGenealogy.ts
 * pour les rendre accessibles depuis le client sans modifier les tsconfigs.
 */

export type {
  VarietyGenealogy,
  VarietyNode,
  RelationType,
} from "../../../server/varietyGenealogy";

import type { VarietyGenealogy } from "../../../server/varietyGenealogy";
// GenealogyData n'existe pas dans server/varietyGenealogy.ts - définition locale
export type GenealogyData = VarietyGenealogy;
