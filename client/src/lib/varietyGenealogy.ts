/**
 * client/src/lib/varietyGenealogy.ts
 * Réexporte les types de généalogie des variétés depuis server/varietyGenealogy.ts
 * pour les rendre accessibles depuis le client sans modifier les tsconfigs.
 */

export type {
  VarietyGenealogy,
  VarietyNode,
  RelationType,
  GenealogyData,
} from "../../../server/varietyGenealogy";
