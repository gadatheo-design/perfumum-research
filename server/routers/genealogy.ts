import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL, sql } from "drizzle-orm";
import { plants } from "../../drizzle/schema";

export const genealogyRouter = router({
  getTree: publicProcedure
    .input(z.object({ varietyId: z.number().int().min(1) }))
    .query(async ({ input }) => {
      return await db.getVarietyGenealogyTree(input.varietyId);
    }),
  
  getAncestors: publicProcedure
    .input(z.object({ 
      varietyId: z.number().int().min(1), 
      depth: z.number().int().min(1).max(10).default(5) 
    }))
    .query(async ({ input }) => {
      return await db.getVarietyAncestors(input.varietyId, input.depth);
    }),
  
  getDescendants: publicProcedure
    .input(z.object({ 
      varietyId: z.number().int().min(1), 
      depth: z.number().int().min(1).max(10).default(5) 
    }))
    .query(async ({ input }) => {
      return await db.getVarietyDescendants(input.varietyId, input.depth);
    }),
  
  addRelationship: protectedProcedure
    .input(z.object({
      varietyId: z.number().int().min(1),
      parentVarietyId: z.number().int().min(1),
      relationshipType: z.enum(["parent","hybrid","clone","mutation"]).default("parent"),
      crossDate: z.number().int().optional(),
      breeder: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.addVarietyRelationship(input);
    }),
  
  updateRelationship: protectedProcedure
    .input(z.object({
      id: z.number().int().min(1),
      relationshipType: z.enum(["parent","hybrid","clone","mutation"]).optional(),
      crossDate: z.number().int().optional(),
      breeder: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateVarietyRelationship(id, data);
    }),
  
  removeRelationship: protectedProcedure
    .input(z.object({
      id: z.number().int().min(1),
    }))
    .mutation(async ({ input }) => {
      return await db.removeVarietyRelationship(input.id);
    }),
  
  // Données du graphe généalogique pour D3.js
  getGraphData: publicProcedure
    .input(z.object({
      plantType: z.enum(["cannabis", "tobacco", "aromatic", "flower", "other", "all"]).default("all"),
      includeModern: z.boolean().default(true),
      includeLandraces: z.boolean().default(true),
      relationshipTypes: z.array(z.enum(["parent", "hybrid", "clone", "mutation"])).optional(),
      region: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      return await db.getGenealogyGraphData(input ?? {});
    }),
  
  // Généalogie complète d'une variété
  getFullGenealogy: publicProcedure
    .input(z.object({
      varietyId: z.number().int().min(1),
      depth: z.number().int().min(1).max(10).default(5),
    }))
    .query(async ({ input }) => {
      return await db.getVarietyFullGenealogy(input.varietyId, input.depth);
    }),

  // Arbre généalogique enrichi avec les noms des plantes
  getTreeWithNames: publicProcedure
    .input(z.object({ varietyId: z.number().int().min(1) }))
    .query(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) return { parents: [], children: [] };
      const { sql } = await import('drizzle-orm');
      const [parents] = await (dbConn as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(
        `SELECT vg.id, vg.variety_id, vg.parent_variety_id, vg.relationship_type, vg.cross_date, vg.breeder, vg.notes,
                p.name as parent_name, p.latin_name as parent_latin_name, p.category as parent_category
         FROM variety_genealogy vg
         JOIN plants p ON vg.parent_variety_id = p.id
         WHERE vg.variety_id = ${input.varietyId}`
      ));
      const [children] = await (dbConn as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(
        `SELECT vg.id, vg.variety_id, vg.parent_variety_id, vg.relationship_type, vg.cross_date, vg.breeder, vg.notes,
                p.name as child_name, p.latin_name as child_latin_name, p.category as child_category
         FROM variety_genealogy vg
         JOIN plants p ON vg.variety_id = p.id
         WHERE vg.parent_variety_id = ${input.varietyId}`
      ));
      return {
        parents: Array.isArray(parents) ? parents : [],
        children: Array.isArray(children) ? children : [],
      };
    }),
})

