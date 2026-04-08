/**
 * varietyGenealogy.ts (Router)
 * ─────────────────────────────────────────────────────────────────────────────
 * Procédures tRPC pour gérer les généalogies de variétés
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { z } from 'zod';
import { publicProcedure, router } from '@/server/_core/trpc';
import {
  nicotianaVarietyGenealogy,
  cannabisVarietyGenealogy,
  citrusVarietyGenealogy,
  getAncestors,
  getDescendants,
  getHybrids,
  getSiblings,
  type VarietyGenealogy,
  type VarietyNode,
  type RelationType,
} from '@/server/varietyGenealogy';

// ── Schémas Zod ──────────────────────────────────────────────────────────────

const RelationTypeSchema = z.enum(['parent', 'sibling', 'hybrid', 'cultivar', 'cross', 'mutation']);

const VarietyNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  species: z.string(),
  year: z.number().optional(),
  origin: z.string().optional(),
  conservationStatus: z.enum(['extinct', 'endangered', 'vulnerable', 'stable', 'cultivated']).optional(),
  description: z.string().optional(),
  molecularProfile: z.record(z.number()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

const VarietyRelationSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string(),
  type: RelationTypeSchema,
  year: z.number().optional(),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const VarietyGenealogySchema = z.object({
  rootVariety: VarietyNodeSchema,
  nodes: z.array(VarietyNodeSchema),
  relations: z.array(VarietyRelationSchema),
  depth: z.number(),
  totalVarieties: z.number(),
});

// ── Mapping des généalogies par genre ────────────────────────────────────────

const genealogies: Record<string, VarietyGenealogy> = {
  nicotiana: nicotianaVarietyGenealogy,
  cannabis: cannabisVarietyGenealogy,
  citrus: citrusVarietyGenealogy,
};

// ── Router ───────────────────────────────────────────────────────────────────

export const varietyGenealogyRouter = router({
  /**
   * Récupère la généalogie complète d'un genre
   */
  getGenealogy: publicProcedure
    .input(z.object({ genus: z.string() }))
    .output(VarietyGenealogySchema.optional())
    .query(({ input }) => {
      return genealogies[input.genus.toLowerCase()];
    }),

  /**
   * Récupère tous les genres disponibles
   */
  listGenera: publicProcedure
    .output(z.array(z.object({ id: z.string(), name: z.string(), totalVarieties: z.number() })))
    .query(() => {
      return Object.entries(genealogies).map(([id, genealogy]) => ({
        id,
        name: genealogy.rootVariety.species.split(' ')[0],
        totalVarieties: genealogy.totalVarieties,
      }));
    }),

  /**
   * Récupère les détails d'une variété
   */
  getVariety: publicProcedure
    .input(z.object({ genus: z.string(), varietyId: z.string() }))
    .output(VarietyNodeSchema.optional())
    .query(({ input }) => {
      const genealogy = genealogies[input.genus.toLowerCase()];
      if (!genealogy) return undefined;
      return genealogy.nodes.find((n) => n.id === input.varietyId);
    }),

  /**
   * Récupère les ancêtres d'une variété
   */
  getAncestors: publicProcedure
    .input(z.object({ genus: z.string(), varietyId: z.string() }))
    .output(z.array(VarietyNodeSchema))
    .query(({ input }) => {
      const genealogy = genealogies[input.genus.toLowerCase()];
      if (!genealogy) return [];
      return getAncestors(input.varietyId, genealogy);
    }),

  /**
   * Récupère les descendants d'une variété
   */
  getDescendants: publicProcedure
    .input(z.object({ genus: z.string(), varietyId: z.string() }))
    .output(z.array(VarietyNodeSchema))
    .query(({ input }) => {
      const genealogy = genealogies[input.genus.toLowerCase()];
      if (!genealogy) return [];
      return getDescendants(input.varietyId, genealogy);
    }),

  /**
   * Récupère les hybrides d'une variété
   */
  getHybrids: publicProcedure
    .input(z.object({ genus: z.string(), varietyId: z.string() }))
    .output(z.array(VarietyNodeSchema))
    .query(({ input }) => {
      const genealogy = genealogies[input.genus.toLowerCase()];
      if (!genealogy) return [];
      return getHybrids(input.varietyId, genealogy);
    }),

  /**
   * Récupère les frères et sœurs d'une variété
   */
  getSiblings: publicProcedure
    .input(z.object({ genus: z.string(), varietyId: z.string() }))
    .output(z.array(VarietyNodeSchema))
    .query(({ input }) => {
      const genealogy = genealogies[input.genus.toLowerCase()];
      if (!genealogy) return [];
      return getSiblings(input.varietyId, genealogy);
    }),

  /**
   * Recherche des variétés par nom ou espèce
   */
  search: publicProcedure
    .input(z.object({ genus: z.string(), query: z.string() }))
    .output(z.array(VarietyNodeSchema))
    .query(({ input }) => {
      const genealogy = genealogies[input.genus.toLowerCase()];
      if (!genealogy) return [];

      const lowerQuery = input.query.toLowerCase();
      return genealogy.nodes.filter(
        (n) =>
          n.name.toLowerCase().includes(lowerQuery) ||
          n.species.toLowerCase().includes(lowerQuery) ||
          (n.description && n.description.toLowerCase().includes(lowerQuery))
      );
    }),

  /**
   * Récupère les statistiques d'une généalogie
   */
  getStats: publicProcedure
    .input(z.object({ genus: z.string() }))
    .output(
      z.object({
        totalVarieties: z.number(),
        depth: z.number(),
        extinct: z.number(),
        endangered: z.number(),
        vulnerable: z.number(),
        stable: z.number(),
        cultivated: z.number(),
        relationTypes: z.record(z.number()),
      }).optional()
    )
    .query(({ input }) => {
      const genealogy = genealogies[input.genus.toLowerCase()];
      if (!genealogy) return undefined;

      const stats = {
        totalVarieties: genealogy.totalVarieties,
        depth: genealogy.depth,
        extinct: genealogy.nodes.filter((n) => n.conservationStatus === 'extinct').length,
        endangered: genealogy.nodes.filter((n) => n.conservationStatus === 'endangered').length,
        vulnerable: genealogy.nodes.filter((n) => n.conservationStatus === 'vulnerable').length,
        stable: genealogy.nodes.filter((n) => n.conservationStatus === 'stable').length,
        cultivated: genealogy.nodes.filter((n) => n.conservationStatus === 'cultivated').length,
        relationTypes: {
          parent: genealogy.relations.filter((r) => r.type === 'parent').length,
          sibling: genealogy.relations.filter((r) => r.type === 'sibling').length,
          hybrid: genealogy.relations.filter((r) => r.type === 'hybrid').length,
          cultivar: genealogy.relations.filter((r) => r.type === 'cultivar').length,
          cross: genealogy.relations.filter((r) => r.type === 'cross').length,
          mutation: genealogy.relations.filter((r) => r.type === 'mutation').length,
        },
      };

      return stats;
    }),
});
