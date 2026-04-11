/**
 * Réexportation des types VarietyGenealogy depuis server/varietyGenealogy.ts
 * pour usage côté client sans traverser la frontière server/.
 */
export type {
  VarietyGenealogy,
  VarietyNode,
  RelationType,
} from "../../../server/varietyGenealogy";
