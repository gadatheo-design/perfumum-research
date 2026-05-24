import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const pubchemIupacRouter = router({
  getIupacStats: publicProcedure.query(async () => {
    const mysql2 = await import('mysql2/promise');
    const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN (iupac_name IS NULL OR iupac_name = '') AND (cas_number IS NOT NULL AND cas_number != '') THEN 1 ELSE 0 END) as missingIupacHasCas,
        SUM(CASE WHEN (iupac_name IS NULL OR iupac_name = '') AND (cas_number IS NULL OR cas_number = '') THEN 1 ELSE 0 END) as missingIupacNoCas,
        SUM(CASE WHEN iupac_name IS NOT NULL AND iupac_name != '' THEN 1 ELSE 0 END) as hasIupac
      FROM molecules
    `);
    await conn.end();
    const r = (rows as Record<string, unknown>[])[0];
    return {
      total: Number(r.total),
      missingIupacHasCas: Number(r.missingIupacHasCas),
      missingIupacNoCas: Number(r.missingIupacNoCas),
      hasIupac: Number(r.hasIupac),
    };
  }),
  getMissingIupac: publicProcedure
    .input(z.object({
      mode: z.enum(['hasCas', 'noCas', 'all']).default('hasCas'),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const mysql2 = await import('mysql2/promise');
      const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
      let where = "(iupac_name IS NULL OR iupac_name = '')";
      if (input.mode === 'hasCas') where += " AND (cas_number IS NOT NULL AND cas_number != '')";
      if (input.mode === 'noCas') where += " AND (cas_number IS NULL OR cas_number = '')";
      const limit = Number(input.limit);
      const offset = Number(input.offset);
      const [rows] = await conn.query(`SELECT id, name, cas_number, formula, family, iupac_name FROM molecules WHERE ${where} ORDER BY name LIMIT ${limit} OFFSET ${offset}`);
      const [countRows] = await conn.query(`SELECT COUNT(*) as total FROM molecules WHERE ${where}`);
      await conn.end();
      return {
        molecules: rows as Array<{ id: number; name: string; cas_number: string; formula: string; family: string; iupac_name: string }>,
        total: Number((countRows as Record<string, unknown>[])[0]?.total ?? 0),
      };
    }),
  fetchAndUpdateIupac: protectedProcedure
    .input(z.object({
      moleculeId: z.number(),
      casNumber: z.string().optional(),
      moleculeName: z.string(),
    }))
    .mutation(async ({ input }) => {
      const searchTerm = input.casNumber || input.moleculeName;
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(searchTerm)}/property/IUPACName,MolecularFormula,MolecularWeight,InChIKey/JSON`;
      let iupacName: string | null = null;
      let formula: string | null = null;
      let inchiKey: string | null = null;
      try {
        const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (resp.ok) {
          const data = await resp.json() as Record<string, unknown>;
          const propsArr = (data?.PropertyTable as Record<string,unknown>)?.Properties as Record<string,unknown>[] | undefined;
          const props = propsArr?.[0];
          if (props) {
            iupacName = (props.IUPACName as string) || null;
            formula = (props.MolecularFormula as string) || null;
            inchiKey = (props.InChIKey as string) || null;
          }
        }
      } catch (e) {
        throw new Error(`PubChem API error: ${(e as Error).message}`);
      }
      if (!iupacName) {
        return { success: false, moleculeId: input.moleculeId, message: 'Not found in PubChem' };
      }
      const mysql2 = await import('mysql2/promise');
      const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
      const updates: string[] = ['iupac_name = ?'];
      const values: (string | number | null)[] = [iupacName];
      if (formula && formula.trim()) { updates.push('formula = ?'); values.push(formula); }
      values.push(input.moleculeId);
      await conn.query(`UPDATE molecules SET ${updates.join(', ')} WHERE id = ?`, values);
      await conn.end();
      return {
        success: true,
        moleculeId: input.moleculeId,
        iupacName,
        formula,
        inchiKey,
        message: `IUPAC: ${iupacName}`,
      };
    }),
});
