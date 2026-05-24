import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { getDb } from '../db/core';
import mysql from 'mysql2/promise';

async function getRawConn() {
  return mysql.createConnection(process.env.DATABASE_URL!);
}

export const resinTobaccoRecipesRouter = router({
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    const [rows] = await (db as any).execute(`
      SELECT id, name, category, gamme, description, 
             notes_tete, notes_coeur, notes_fond,
             formula, protocol, intensity, maturationTime, 
             combustionTemperature, notes, status
      FROM recettes
      WHERE gamme = 'résines'
      ORDER BY id ASC
    `);
    
    return (rows as any[]).map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      gamme: r.gamme,
      description: r.description || '',
      notesTete: r.notes_tete || '',
      notesCoeur: r.notes_coeur || '',
      notesFond: r.notes_fond || '',
      formula: r.formula || '',
      protocol: r.protocol || '',
      intensity: r.intensity || 5,
      maturationTime: r.maturationTime || null,
      combustionTemperature: r.combustionTemperature || null,
      notes: r.notes || '',
      status: r.status || 'experimental',
    }));
  }),

  getPlantsByIds: publicProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .query(async ({ input }) => {
      if (!input.ids.length) return [];
      const conn = await getRawConn();
      try {
        const placeholders = input.ids.map(() => '?').join(',');
        const [rows] = await conn.execute(
          `SELECT id, name, latin_name, family FROM plants WHERE id IN (${placeholders})`,
          input.ids
        );
        return (rows as any[]).map((r: Record<string, unknown>) => ({
          id: r.id as number,
          name: (r.name || '') as string,
          latinName: (r.latin_name || '') as string,
          family: (r.family || '') as string,
        }));
      } finally {
        await conn.end();
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const [rows] = await (db as any).execute(`
        SELECT id, name, category, gamme, description, 
               notes_tete, notes_coeur, notes_fond,
               formula, protocol, intensity, maturationTime, 
               combustionTemperature, notes, status
        FROM recettes
        WHERE id = ?
      `, [input.id]);
      
      const r = (rows as any[])[0];
      if (!r) return null;
      
      return {
        id: r.id,
        name: r.name,
        category: r.category,
        gamme: r.gamme,
        description: r.description || '',
        notesTete: r.notes_tete || '',
        notesCoeur: r.notes_coeur || '',
        notesFond: r.notes_fond || '',
        formula: r.formula || '',
        protocol: r.protocol || '',
        intensity: r.intensity || 5,
        maturationTime: r.maturationTime || null,
        combustionTemperature: r.combustionTemperature || null,
        notes: r.notes || '',
        status: r.status || 'experimental',
      };
    }),
});
