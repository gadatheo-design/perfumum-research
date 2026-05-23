/**
 * Router tRPC pour l'enrichissement SMILES et CAS
 * Feature 4.6 — Enrichissement SMILES via PubChem CID
 */
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { 
  previewSmilesAndCasEnrichment, 
  executeSmilesAndCasEnrichment,
  MOLECULE_REFERENCE_DATA 
} from "../smiles-cas-enrichment";
import { getDb } from "../db";
import { sql, eq } from "drizzle-orm";
import { molecules } from "../../drizzle/schema";

export const smilesEnrichmentRouter = router({
  // Prévisualiser l'enrichissement (base locale)
  preview: publicProcedure.query(async () => {
    return previewSmilesAndCasEnrichment();
  }),
  
  // Exécuter l'enrichissement (base locale)
  execute: protectedProcedure.mutation(async () => {
    return executeSmilesAndCasEnrichment();
  }),
  
  // Statistiques de la base de référence locale
  getReferenceStats: publicProcedure.query(async () => {
    const entries = Object.entries(MOLECULE_REFERENCE_DATA);
    const withCas = entries.filter(([_, data]) => data.cas).length;
    const withSmiles = entries.filter(([_, data]) => data.smiles).length;
    return {
      totalEntries: entries.length,
      withCas,
      withSmiles,
      uniqueMolecules: new Set(entries.map(([name]) => name.toLowerCase()
        .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u'))).size
    };
  }),

  // ===== Feature 4.6 : Enrichissement SMILES via PubChem =====

  // Statistiques globales SMILES en base
  getSmilesStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, withSmiles: 0, withPubChem: 0, withCas: 0, recoverableViaCid: 0, recoverableViaCas: 0 };
    const [result] = await db.execute(sql`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN smiles IS NOT NULL AND smiles != '' THEN 1 ELSE 0 END) as with_smiles,
        SUM(CASE WHEN pubchem_cid IS NOT NULL THEN 1 ELSE 0 END) as with_pubchem,
        SUM(CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as with_cas,
        SUM(CASE WHEN (smiles IS NULL OR smiles = '') AND pubchem_cid IS NOT NULL THEN 1 ELSE 0 END) as recoverable_cid,
        SUM(CASE WHEN (smiles IS NULL OR smiles = '') AND pubchem_cid IS NULL AND cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as recoverable_cas
      FROM molecules
    `) as unknown as [any[]];
    const row = (result as unknown[])[0] as Record<string, unknown>;
    return {
      total: Number(row?.total || 0),
      withSmiles: Number(row?.with_smiles || 0),
      withPubChem: Number(row?.with_pubchem || 0),
      withCas: Number(row?.with_cas || 0),
      recoverableViaCid: Number(row?.recoverable_cid || 0),
      recoverableViaCas: Number(row?.recoverable_cas || 0),
    };
  }),

  // Enrichir les SMILES en batch via PubChem CID (méthode principale)
  enrichSmilesByCid: publicProcedure
    .input(z.object({
      batchSize: z.number().min(1).max(50).default(20),
      startIndex: z.number().min(0).default(0),
      dryRun: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const toEnrich = await db
        .select({ id: molecules.id, name: molecules.name, pubchemCid: molecules.pubchemCid })
        .from(molecules)
        .where(sql`(smiles IS NULL OR smiles = '') AND pubchem_cid IS NOT NULL`)
        .limit(input.batchSize)
        .offset(input.startIndex);

      const [totalResult] = await db.execute(sql`
        SELECT COUNT(*) as cnt FROM molecules WHERE (smiles IS NULL OR smiles = '') AND pubchem_cid IS NOT NULL
      `) as unknown as [any[]];
      const totalRow = ((totalResult[0] as unknown) as unknown[])[0] as Record<string, unknown>;
      const totalCount = Number(totalRow?.cnt || 0);

      const results: Array<{
        moleculeId: number;
        moleculeName: string;
        pubchemCid: number;
        status: "success" | "not_found" | "error";
        message: string;
        smiles?: string;
      }> = [];

      let successCount = 0, notFoundCount = 0, errorCount = 0;

      for (const mol of toEnrich) {
        if (!mol.pubchemCid) continue;
        try {
          const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${mol.pubchemCid}/property/IsomericSMILES,CanonicalSMILES/JSON`;
          const response = await fetch(url, { headers: { "User-Agent": "PERFUMUM-Research/1.0" } });

          if (!response.ok) {
            results.push({ moleculeId: mol.id, moleculeName: mol.name, pubchemCid: mol.pubchemCid, status: "error", message: `HTTP ${response.status}` });
            errorCount++;
          } else {
            const data = await response.json() as Record<string, unknown>;
            const propTable = ((data?.PropertyTable as Record<string, unknown>)?.Properties) as Array<Record<string, unknown>> | undefined;
            const smiles = (propTable?.[0]?.IsomericSMILES || propTable?.[0]?.CanonicalSMILES) as string | undefined;

            if (smiles) {
              if (!input.dryRun) {
                await db.update(molecules).set({ smiles }).where(eq(molecules.id, mol.id));
              }
              results.push({ moleculeId: mol.id, moleculeName: mol.name, pubchemCid: mol.pubchemCid, status: "success", message: `SMILES recupere (${smiles.length} chars)`, smiles });
              successCount++;
            } else {
              results.push({ moleculeId: mol.id, moleculeName: mol.name, pubchemCid: mol.pubchemCid, status: "not_found", message: "CID valide mais SMILES absent" });
              notFoundCount++;
            }
          }
          await new Promise(resolve => setTimeout(resolve, 220));
        } catch (err) {
          results.push({ moleculeId: mol.id, moleculeName: mol.name, pubchemCid: mol.pubchemCid ?? 0, status: "error", message: err instanceof Error ? err.message : String(err) });
          errorCount++;
        }
      }

      return {
        processed: toEnrich.length,
        success: successCount,
        notFound: notFoundCount,
        errors: errorCount,
        nextStartIndex: input.startIndex + toEnrich.length,
        hasMore: (input.startIndex + toEnrich.length) < totalCount,
        totalRemaining: totalCount,
        dryRun: input.dryRun,
        results,
      };
    }),

  // Enrichir les SMILES via CAS number (fallback pour molécules sans CID)
  enrichSmilesByCas: publicProcedure
    .input(z.object({
      batchSize: z.number().min(1).max(20).default(10),
      startIndex: z.number().min(0).default(0),
      dryRun: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const toEnrich = await db
        .select({ id: molecules.id, name: molecules.name, casNumber: molecules.casNumber })
        .from(molecules)
        .where(sql`(smiles IS NULL OR smiles = '') AND pubchem_cid IS NULL AND cas_number IS NOT NULL AND cas_number != ''`)
        .limit(input.batchSize)
        .offset(input.startIndex);

      const [totalResult] = await db.execute(sql`
        SELECT COUNT(*) as cnt FROM molecules
        WHERE (smiles IS NULL OR smiles = '') AND pubchem_cid IS NULL AND cas_number IS NOT NULL AND cas_number != ''
      `) as unknown as [any[]];
      const totalRow = ((totalResult[0] as unknown) as unknown[])[0] as Record<string, unknown>;
      const totalCount = Number(totalRow?.cnt || 0);

      const results: Array<{
        moleculeId: number;
        moleculeName: string;
        casNumber: string;
        status: "success" | "not_found" | "error";
        message: string;
        smiles?: string;
        pubchemCid?: number;
      }> = [];

      let successCount = 0, notFoundCount = 0, errorCount = 0;

      for (const mol of toEnrich) {
        if (!mol.casNumber) continue;
        try {
          const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(mol.casNumber)}/property/IsomericSMILES,CanonicalSMILES,CID/JSON`;
          const response = await fetch(searchUrl, { headers: { "User-Agent": "PERFUMUM-Research/1.0" } });

          if (response.status === 404) {
            results.push({ moleculeId: mol.id, moleculeName: mol.name, casNumber: mol.casNumber, status: "not_found", message: "CAS non trouve dans PubChem" });
            notFoundCount++;
          } else if (!response.ok) {
            results.push({ moleculeId: mol.id, moleculeName: mol.name, casNumber: mol.casNumber, status: "error", message: `HTTP ${response.status}` });
            errorCount++;
          } else {
            const data = await response.json() as Record<string, unknown>;
            const propTable = ((data?.PropertyTable as Record<string, unknown>)?.Properties) as Array<Record<string, unknown>> | undefined;
            const smiles = (propTable?.[0]?.IsomericSMILES || propTable?.[0]?.CanonicalSMILES) as string | undefined;
            const cid = propTable?.[0]?.CID as number | undefined;

            if (smiles) {
              if (!input.dryRun) {
                const updateData: { smiles: string; pubchemCid?: number } = { smiles };
                if (cid) updateData.pubchemCid = cid;
                await db.update(molecules).set(updateData).where(eq(molecules.id, mol.id));
              }
              results.push({ moleculeId: mol.id, moleculeName: mol.name, casNumber: mol.casNumber, status: "success", message: `SMILES recupere via CAS${cid ? ` (CID: ${cid})` : ""}`, smiles, pubchemCid: cid });
              successCount++;
            } else {
              results.push({ moleculeId: mol.id, moleculeName: mol.name, casNumber: mol.casNumber, status: "not_found", message: "CAS trouve mais SMILES absent" });
              notFoundCount++;
            }
          }
          await new Promise(resolve => setTimeout(resolve, 220));
        } catch (err) {
          results.push({ moleculeId: mol.id, moleculeName: mol.name, casNumber: mol.casNumber ?? "", status: "error", message: err instanceof Error ? err.message : String(err) });
          errorCount++;
        }
      }

      return {
        processed: toEnrich.length,
        success: successCount,
        notFound: notFoundCount,
        errors: errorCount,
        nextStartIndex: input.startIndex + toEnrich.length,
        hasMore: (input.startIndex + toEnrich.length) < totalCount,
        totalRemaining: totalCount,
        dryRun: input.dryRun,
        results,
      };
    }),
});
