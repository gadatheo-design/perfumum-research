import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

export const cigarilloMoleculeLinksRouter = router({
  // Lister toutes les liaisons avec détails recette + molécule
  list: publicProcedure
    .input(z.object({
      cigarilloRecipeId: z.number().optional(),
      moleculeId: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions: string[] = ["1=1"];
      if (input?.cigarilloRecipeId) conditions.push(`cml.cigarillo_recipe_id = ${input.cigarilloRecipeId}`);
      if (input?.moleculeId) conditions.push(`cml.molecule_id = ${input.moleculeId}`);
      const where = conditions.join(" AND ");

      const result = await db.execute(sql.raw(`
        SELECT
          cml.id,
          cml.cigarillo_recipe_id,
          cml.molecule_id,
          cml.role,
          cml.percentage,
          cml.notes,
          cml.created_at,
          cr.name as recipe_name,
          cr.collection as recipe_collection,
          m.name as molecule_name,
          m.family as molecule_family
        FROM cigarillo_molecule_links cml
        LEFT JOIN cigarillo_recipes cr ON cr.id = cml.cigarillo_recipe_id
        LEFT JOIN molecules m ON m.id = cml.molecule_id
        WHERE ${where}
        ORDER BY cr.name, m.name
      `));

      return (result as any)[0] || [];
    }),

  // Créer une liaison
  create: protectedProcedure
    .input(z.object({
      cigarilloRecipeId: z.number(),
      moleculeId: z.number(),
      role: z.string().max(100).optional(),
      percentage: z.number().min(0).max(100).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const role = input.role ? `'${input.role.replace(/'/g, "''")}'` : "NULL";
      const pct = input.percentage != null ? input.percentage : "NULL";
      const notes = input.notes ? `'${input.notes.replace(/'/g, "''")}'` : "NULL";

      try {
        await db.execute(sql.raw(`
          INSERT INTO cigarillo_molecule_links (cigarillo_recipe_id, molecule_id, role, percentage, notes)
          VALUES (${input.cigarilloRecipeId}, ${input.moleculeId}, ${role}, ${pct}, ${notes})
        `));
        return { success: true };
      } catch (e: any) {
        if (e.code === "ER_DUP_ENTRY") {
          throw new TRPCError({ code: "CONFLICT", message: "Cette liaison existe déjà" });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: e.message });
      }
    }),

  // Supprimer une liaison
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(sql.raw(`DELETE FROM cigarillo_molecule_links WHERE id = ${input.id}`));
      return { success: true };
    }),

  // Statistiques
  stats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalLinks: 0, recipesWithLinks: 0, moleculesLinked: 0 };

    const result = await db.execute(sql.raw(`
      SELECT
        COUNT(*) as total_links,
        COUNT(DISTINCT cigarillo_recipe_id) as recipes_with_links,
        COUNT(DISTINCT molecule_id) as molecules_linked
      FROM cigarillo_molecule_links
    `));

    const row = ((result as any)[0] || [])[0] || {};
    return {
      totalLinks: Number(row.total_links || 0),
      recipesWithLinks: Number(row.recipes_with_links || 0),
      moleculesLinked: Number(row.molecules_linked || 0),
    };
  }),
});
