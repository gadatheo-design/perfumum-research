/**
 * phylogeny.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * tRPC router for phylogenetic tree visualization
 * Handles retrieval of genealogy data for D3.js visualization
 * Supports Nicotiana, Cannabis, and other genera
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { plantVarieties, varietyGenealogy, plants } from "../../drizzle/schema";
import { eq, and, or, isNull, isNotNull, like, sql } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

interface TreeNode {
  id: number;
  varietyId: string;
  name: string;
  latinName?: string;
  type: "cultivar" | "chemotype" | "landrace" | "hybrid" | "clone" | "wild" | "other";
  yearRegistered?: number;
  breeder?: string;
  conservationStatus?: string;
  dominantMolecules?: Array<{ molecule: string; percentage: number }>;
  children?: TreeNode[];
  parent?: number;
  relationshipType?: "parent" | "hybrid" | "clone" | "mutation";
}

interface PhylogeneticData {
  genus: string;
  species: string;
  totalVarieties: number;
  rootNodes: TreeNode[];
  allNodes: Map<number, TreeNode>;
  stats: {
    cultivars: number;
    hybrids: number;
    clones: number;
    landraces: number;
    wild: number;
    conservationCritical: number;
    conservationEndangered: number;
  };
}

const GenusSchema = z.enum(["Nicotiana", "Cannabis", "Rosa", "Lavandula"]);
const LayoutSchema = z.enum(["tree", "radial", "timeline"]);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build tree structure from flat genealogy data
 */
function buildTreeStructure(varieties: any[], genealogies: any[]): TreeNode[] {
  const nodeMap = new Map<number, TreeNode>();
  const childrenMap = new Map<number, number[]>();

  // Create nodes
  varieties.forEach((v) => {
    nodeMap.set(v.id, {
      id: v.id,
      varietyId: v.varietyId,
      name: v.name,
      latinName: v.latinName,
      type: v.varietyType,
      yearRegistered: v.yearRegistered,
      breeder: v.breeder,
      conservationStatus: v.conservationStatus,
      dominantMolecules: v.dominantMolecules || [],
      children: [],
    });
  });

  // Build parent-child relationships
  genealogies.forEach((g) => {
    if (!childrenMap.has(g.parentVarietyId)) {
      childrenMap.set(g.parentVarietyId, []);
    }
    childrenMap.get(g.parentVarietyId)!.push(g.varietyId);
  });

  // Assign children to nodes
  genealogies.forEach((g) => {
    const child = nodeMap.get(g.varietyId);
    const parent = nodeMap.get(g.parentVarietyId);
    if (child && parent) {
      child.parent = g.parentVarietyId;
      child.relationshipType = g.relationshipType;
      if (!parent.children) parent.children = [];
      parent.children.push(child);
    }
  });

  // Find root nodes (varieties without parents in genealogy)
  const rootNodes: TreeNode[] = [];
  nodeMap.forEach((node) => {
    if (!node.parent) {
      rootNodes.push(node);
    }
  });

  return rootNodes.length > 0 ? rootNodes : Array.from(nodeMap.values()).slice(0, 5);
}

/**
 * Calculate statistics from varieties
 */
function calculateStats(varieties: any[]): PhylogeneticData["stats"] {
  return {
    cultivars: varieties.filter((v) => v.varietyType === "cultivar").length,
    hybrids: varieties.filter((v) => v.varietyType === "hybrid").length,
    clones: varieties.filter((v) => v.varietyType === "clone").length,
    landraces: varieties.filter((v) => v.varietyType === "landrace").length,
    wild: varieties.filter((v) => v.varietyType === "wild").length,
    conservationCritical: varieties.filter((v) => v.conservationStatus === "critical").length,
    conservationEndangered: varieties.filter((v) => v.conservationStatus === "endangered").length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────────────────────

export const phylogenyRouter = router({
  /**
   * Get complete phylogenetic tree for a genus
   * Returns hierarchical structure optimized for D3.js visualization
   */
  getPhylogeneticTree: publicProcedure
    .input(
      z.object({
        genus: GenusSchema,
        species: z.string().optional(),
        layout: LayoutSchema.optional().default("tree"),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        // Get plant by genus and species
        // The plants table uses latinName (e.g. "Nicotiana tabacum") — no separate genus/species columns
        const latinSearch = input.species
          ? `${input.genus} ${input.species}`
          : input.genus;
        const plantQuery = await db
          .select()
          .from(plants)
          .where(
            input.species
              ? eq(plants.latinName, latinSearch)
              : like(plants.latinName, `${input.genus}%`)
          )
          .limit(1);

        if (plantQuery.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Plant not found: ${input.genus} ${input.species || ""}`,
          });
        }

        const plant = plantQuery[0];
        // Derive species from latinName (e.g. "Nicotiana tabacum" → "tabacum")
        const derivedSpecies = plant.latinName
          ? plant.latinName.split(" ").slice(1).join(" ")
          : input.species ?? "";

        // Get all varieties for this plant
        const varieties = await db
          .select()
          .from(plantVarieties)
          .where(eq(plantVarieties.plantId, plant.id));

        if (varieties.length === 0) {
          return {
            genus: input.genus,
            species: derivedSpecies,
            totalVarieties: 0,
            rootNodes: [],
            allNodes: new Map(),
            stats: {
              cultivars: 0,
              hybrids: 0,
              clones: 0,
              landraces: 0,
              wild: 0,
              conservationCritical: 0,
              conservationEndangered: 0,
            },
          };
        }

        // Get genealogy relationships
        const genealogies = await db
          .select()
          .from(varietyGenealogy)
          .where(
            or(
              ...varieties.map((v) => eq(varietyGenealogy.varietyId, v.id))
            )
          );

        // Build tree structure
        const rootNodes = buildTreeStructure(varieties, genealogies);
        const allNodes = new Map<number, TreeNode>();
        varieties.forEach((v) => {
          allNodes.set(v.id, {
            id: v.id,
            varietyId: v.varietyId,
            name: v.name,
            latinName: v.latinName ?? undefined,
            type: v.varietyType,
            yearRegistered: v.yearRegistered ?? undefined,
            breeder: v.breeder ?? undefined,
            conservationStatus: v.conservationStatus ?? undefined,
            dominantMolecules: v.dominantMolecules || [],
          });
        });

        // Calculate statistics
        const stats = calculateStats(varieties);

        return {
          genus: input.genus,
          species: derivedSpecies,
          totalVarieties: varieties.length,
          rootNodes,
          allNodes,
          stats,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch phylogenetic tree",
        });
      }
    }),

  /**
   * Get variety details with full genealogy chain
   */
  getVarietyLineage: publicProcedure
    .input(
      z.object({
        varietyId: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        const variety = await db
          .select()
          .from(plantVarieties)
          .where(eq(plantVarieties.id, input.varietyId))
          .limit(1);

        if (variety.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Variety not found",
          });
        }

        // Get genealogy chain (ancestors)
        const genealogies = await db
          .select()
          .from(varietyGenealogy)
          .where(eq(varietyGenealogy.varietyId, input.varietyId));

        return {
          variety: variety[0],
          genealogies,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch variety lineage",
        });
      }
    }),

  /**
   * Get all genera with varieties for phylogeny explorer
   */
  getAvailableGenera: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Get all plants with varieties — filter by latinName not null (no genus column)
      const plantList = await db
        .select()
        .from(plants)
        .where(isNotNull(plants.latinName));

      // Get variety counts per plant
      const generaWithCounts = await Promise.all(
        plantList.map(async (plant) => {
          const varietyCount = await db
            .select()
            .from(plantVarieties)
            .where(eq(plantVarieties.plantId, plant.id));

          // Derive genus and species from latinName (e.g. "Nicotiana tabacum" → genus="Nicotiana", species="tabacum")
          const parts = (plant.latinName ?? "").split(" ");
          const derivedGenus = parts[0] ?? null;
          const derivedSpecies = parts.slice(1).join(" ") || null;
          return {
            id: plant.id,
            genus: derivedGenus,
            species: derivedSpecies,
            latinName: plant.latinName,
            varietyCount: varietyCount.length,
          };
        })
      );

      // Filter to only genera with varieties
      return generaWithCounts.filter((g) => g.varietyCount > 0);
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to fetch genera",
      });
    }
  }),

  /**
   * Get conservation status distribution for a genus
   */
  getConservationStats: publicProcedure
    .input(
      z.object({
        genus: GenusSchema,
        species: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        // Get plant — use latinName since plants table has no separate genus/species columns
        const latinSearch2 = input.species
          ? `${input.genus} ${input.species}`
          : input.genus;
        const plantQuery = await db
          .select()
          .from(plants)
          .where(
            input.species
              ? eq(plants.latinName, latinSearch2)
              : like(plants.latinName, `${input.genus}%`)
          )
          .limit(1);

        if (plantQuery.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Plant not found",
          });
        }

        // Get varieties with conservation status
        const varieties = await db
          .select()
          .from(plantVarieties)
          .where(eq(plantVarieties.plantId, plantQuery[0].id));

        const stats = {
          critical: varieties.filter((v) => v.conservationStatus === "critical").length,
          endangered: varieties.filter((v) => v.conservationStatus === "endangered").length,
          vulnerable: varieties.filter((v) => v.conservationStatus === "vulnerable").length,
          nearThreatened: varieties.filter((v) => v.conservationStatus === "near_threatened").length,
          stable: varieties.filter((v) => v.conservationStatus === "stable").length,
          dataDeficient: varieties.filter((v) => v.conservationStatus === "data_deficient").length,
          unknown: varieties.filter((v) => v.conservationStatus === "unknown").length,
        };

        return stats;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch conservation stats",
        });
      }
    }),
});
