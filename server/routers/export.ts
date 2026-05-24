import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { molecules, recettes } from "../../drizzle/schema";

export const exportRouter = router({
  molecules: publicProcedure.query(async () => {
    const molecules = await db.getAllMolecules();
    const { objectsToCSV } = await import('../csv-utils');
    return objectsToCSV(molecules);
  }),

  recettes: publicProcedure.query(async () => {
    const recettes = await db.getAllRecettes();
    const { objectsToCSV } = await import('../csv-utils');
    return objectsToCSV(recettes);
  }),

  accords: publicProcedure.query(async () => {
    const accords = await db.getAllAccords();
    const { objectsToCSV } = await import('../csv-utils');
    return objectsToCSV(accords);
  }),

  familles: publicProcedure.query(async () => {
    const familles = await db.getAllFamilies();
    const { objectsToCSV } = await import('../csv-utils');
    return objectsToCSV(familles);
  }),

  matieres: publicProcedure.query(async () => {
    const matieres = await db.getAllMatieres();
    const { objectsToCSV } = await import('../csv-utils');
    return objectsToCSV(matieres);
  }),
})

