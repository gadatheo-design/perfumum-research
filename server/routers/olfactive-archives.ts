import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const olfactiveArchivesRouter = router({
  // Liste des archives avec filtres
  list: publicProcedure
    .input(z.object({
      civilization: z.string().optional(),
      type: z.enum(['manuscript', 'formula', 'archaeological', 'botanical_illustration']).optional(),
      q: z.string().optional(),
      limit: z.number().default(25),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      return db.listOlfactiveArchives(input || {});
    }),
  
  // Récupérer une archive par ID
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getOlfactiveArchiveById(input);
    }),
  
  // Recherche full-text
  search: publicProcedure
    .input(z.object({
      q: z.string(),
      limit: z.number().default(25),
    }))
    .query(async ({ input }) => {
      return db.searchOlfactiveArchives(input.q, input.limit);
    }),
  
  // Créer une archive (protégé)
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      type: z.enum(['manuscript', 'formula', 'archaeological', 'botanical_illustration']),
      dateCreated: z.string().optional(),
      civilization: z.string().optional(),
      plantIds: z.array(z.number()).optional(),
      moleculeIds: z.array(z.number()).optional(),
      description: z.string().optional(),
      provenance: z.string().optional(),
      authenticityLevel: z.enum(['confirmed', 'probable', 'hypothetical']).default('probable'),
      references: z.array(z.object({
        author: z.string().optional(),
        year: z.number().optional(),
        title: z.string(),
        type: z.string(),
        url: z.string().optional(),
      })).optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createOlfactiveArchive(input);
    }),
  
  // Mettre à jour une archive (protégé)
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      type: z.enum(['manuscript', 'formula', 'archaeological', 'botanical_illustration']).optional(),
      dateCreated: z.string().optional(),
      civilization: z.string().optional(),
      plantIds: z.array(z.number()).optional(),
      moleculeIds: z.array(z.number()).optional(),
      description: z.string().optional(),
      provenance: z.string().optional(),
      authenticityLevel: z.enum(['confirmed', 'probable', 'hypothetical']).optional(),
      references: z.array(z.object({
        author: z.string().optional(),
        year: z.number().optional(),
        title: z.string(),
        type: z.string(),
        url: z.string().optional(),
      })).optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateOlfactiveArchive(id, data);
    }),
  
  // Supprimer une archive (protégé)
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.deleteOlfactiveArchive(input);
    }),
  
  // Obtenir les civilisations distinctes
  getCivilizations: publicProcedure.query(async () => {
    const archives = await db.listOlfactiveArchives({ limit: 1000 });
    const civilizationsSet = new Set(archives.map((a) => a.civilization).filter(Boolean));
    const civilizations = Array.from(civilizationsSet) as string[];
    return civilizations.sort();
  }),
  
  // Statistiques
  getStats: publicProcedure.query(async () => {
    const archives = await db.listOlfactiveArchives({ limit: 1000 });
    const byType: Record<string, number> = {};
    const byCivilization: Record<string, number> = {};
    const byAuthenticity: Record<string, number> = {};
    
    archives.forEach((a) => {
      byType[a.type] = (byType[a.type] || 0) + 1;
      if (a.civilization) {
        byCivilization[a.civilization] = (byCivilization[a.civilization] || 0) + 1;
      }
      byAuthenticity[a.authenticityLevel] = (byAuthenticity[a.authenticityLevel] || 0) + 1;
    });
    
    return {
      total: archives.length,
      byType,
      byCivilization,
      byAuthenticity,
    };
  }),
  // Lister les traditions olfactives avec données Getty AAT
  listTraditions: publicProcedure
    .input(z.object({
      withGettyOnly: z.boolean().optional(),
      search: z.string().optional(),
      limit: z.number().default(100),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      const mysql2 = await import('mysql2/promise');
      const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
      const { withGettyOnly = false, search = '', limit = 100, offset = 0 } = input || {};
      let where = '1=1';
      if (withGettyOnly) where += " AND getty_aat_id IS NOT NULL";
      if (search) where += ` AND (name LIKE ${conn.escape('%' + search + '%')} OR longDescription LIKE ${conn.escape('%' + search + '%')})`;
      const [rows] = await conn.query(
        `SELECT id, name, longDescription as description, region, temporality as period,
                getty_aat_id, getty_aat_label, getty_enriched_at,
                wikidata_qid, europeana_entity_id
         FROM traditions_olfactives
         WHERE ${where}
         ORDER BY name
         LIMIT ${limit} OFFSET ${offset}`
      );
      await conn.end();
      return (rows as Record<string,unknown>[]) || [];
    }),

  // Statistiques traditions olfactives
  traditionStats: publicProcedure.query(async () => {
    const mysql2 = await import('mysql2/promise');
    const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.query(
      `SELECT COUNT(*) as total,
              SUM(CASE WHEN getty_aat_id IS NOT NULL THEN 1 ELSE 0 END) as withGetty,
              SUM(CASE WHEN wikidata_qid IS NOT NULL THEN 1 ELSE 0 END) as withWikidata
       FROM traditions_olfactives`
    );
    await conn.end();
    return (rows as Record<string,unknown>[])[0] || { total: 0, withGetty: 0, withWikidata: 0 };
  }),
});
