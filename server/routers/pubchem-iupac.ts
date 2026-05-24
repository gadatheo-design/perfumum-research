import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

// Pool de connexions partagé — évite d'ouvrir/fermer une connexion par molécule
let _pool: import('mysql2/promise').Pool | null = null;
async function getPool() {
  if (!_pool) {
    const mysql2 = await import('mysql2/promise');
    _pool = mysql2.createPool({
      uri: process.env.DATABASE_URL!,
      connectionLimit: 5,
      waitForConnections: true,
      queueLimit: 0,
    });
  }
  return _pool;
}

export const pubchemIupacRouter = router({
  getIupacStats: publicProcedure.query(async () => {
    const pool = await getPool();
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN (iupac_name IS NULL OR iupac_name = '') AND (cas_number IS NOT NULL AND cas_number != '') THEN 1 ELSE 0 END) as missingIupacHasCas,
        SUM(CASE WHEN (iupac_name IS NULL OR iupac_name = '') AND (cas_number IS NULL OR cas_number = '') THEN 1 ELSE 0 END) as missingIupacNoCas,
        SUM(CASE WHEN iupac_name IS NOT NULL AND iupac_name != '' THEN 1 ELSE 0 END) as hasIupac
      FROM molecules
    `);
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
      // Augmenté à 5000 pour permettre les grands lots
      limit: z.number().min(1).max(5000).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const pool = await getPool();
      let where = "(iupac_name IS NULL OR iupac_name = '')";
      if (input.mode === 'hasCas') where += " AND (cas_number IS NOT NULL AND cas_number != '')";
      if (input.mode === 'noCas') where += " AND (cas_number IS NULL OR cas_number = '')";
      const limit = Number(input.limit);
      const offset = Number(input.offset);
      const [rows] = await pool.query(`SELECT id, name, cas_number, formula, family, iupac_name FROM molecules WHERE ${where} ORDER BY name LIMIT ${limit} OFFSET ${offset}`);
      const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM molecules WHERE ${where}`);
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
      // Utiliser le pool partagé au lieu d'une connexion individuelle
      const pool = await getPool();
      const updates: string[] = ['iupac_name = ?'];
      const values: (string | number | null)[] = [iupacName];
      if (formula && formula.trim()) { updates.push('formula = ?'); values.push(formula); }
      values.push(input.moleculeId);
      await pool.query(`UPDATE molecules SET ${updates.join(', ')} WHERE id = ?`, values);
      return {
        success: true,
        moleculeId: input.moleculeId,
        iupacName,
        formula,
        inchiKey,
        message: `IUPAC: ${iupacName}`,
      };
    }),

  // Procédure batch côté serveur pour les très grands lots (>100)
  // Traite tout côté serveur sans timeouts réseau côté client
  fetchBatchServer: protectedProcedure
    .input(z.object({
      mode: z.enum(['hasCas', 'noCas', 'all']).default('hasCas'),
      limit: z.number().min(1).max(5000).default(100),
      delayMs: z.number().min(0).max(5000).default(300),
    }))
    .mutation(async ({ input }) => {
      const pool = await getPool();
      let where = "(iupac_name IS NULL OR iupac_name = '')";
      if (input.mode === 'hasCas') where += " AND (cas_number IS NOT NULL AND cas_number != '')";
      if (input.mode === 'noCas') where += " AND (cas_number IS NULL OR cas_number = '')";

      const [rows] = await pool.query(
        `SELECT id, name, cas_number FROM molecules WHERE ${where} ORDER BY name LIMIT ${input.limit}`
      );
      const molecules = rows as Array<{ id: number; name: string; cas_number: string }>;

      let succeeded = 0;
      let notFound = 0;
      let failed = 0;
      const results: Array<{ id: number; name: string; status: string; message: string }> = [];

      const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

      for (const mol of molecules) {
        const searchTerm = mol.cas_number || mol.name;
        const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(searchTerm)}/property/IUPACName,MolecularFormula,InChIKey/JSON`;
        try {
          const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
          if (resp.ok) {
            const data = await resp.json() as Record<string, unknown>;
            const propsArr = (data?.PropertyTable as Record<string, unknown>)?.Properties as Record<string, unknown>[] | undefined;
            const props = propsArr?.[0];
            if (props?.IUPACName) {
              const iupacName = props.IUPACName as string;
              const formula = (props.MolecularFormula as string) || null;
              const updates: string[] = ['iupac_name = ?'];
              const values: (string | number | null)[] = [iupacName];
              if (formula) { updates.push('formula = ?'); values.push(formula); }
              values.push(mol.id);
              await pool.query(`UPDATE molecules SET ${updates.join(', ')} WHERE id = ?`, values);
              succeeded++;
              results.push({ id: mol.id, name: mol.name, status: 'success', message: `IUPAC: ${iupacName}` });
            } else {
              notFound++;
              results.push({ id: mol.id, name: mol.name, status: 'notFound', message: 'Non trouvé dans PubChem' });
            }
          } else {
            notFound++;
            results.push({ id: mol.id, name: mol.name, status: 'notFound', message: `HTTP ${resp.status}` });
          }
        } catch (e) {
          failed++;
          results.push({ id: mol.id, name: mol.name, status: 'error', message: (e as Error).message });
        }
        if (input.delayMs > 0) await sleep(input.delayMs);
      }

      return {
        total: molecules.length,
        succeeded,
        notFound,
        failed,
        results: results.slice(-200), // Retourner les 200 derniers pour le journal
      };
    }),
});
