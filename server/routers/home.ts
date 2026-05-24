import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { molecules, recettes } from "../../drizzle/schema";

export const homeRouter = router({
  getMoleculeOfTheDay: publicProcedure.query(async () => {
    // Sélection aléatoire basée sur la date du jour
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').join(''); // YYYYMMDD
    const molecules = await db.getAllMolecules();
    if (molecules.length === 0) return null;
    const index = parseInt(seed) % molecules.length;
    return molecules[index];
  }),
  getRecentActivity: publicProcedure.query(async () => {
    // Récupérer les 10 derniers ajouts (molécules, recettes, prototypes)
    const molecules = await db.getAllMolecules();
    const recettes = await db.getAllRecettes();
    
    const activity = [
      ...molecules.slice(0, 5).map(m => ({ type: 'molecule' as const, item: m, date: new Date() })),
      ...recettes.slice(0, 5).map(r => ({ type: 'recette' as const, item: r, date: new Date() })),
    ];
    
    return activity.slice(0, 10);
  }),
})

