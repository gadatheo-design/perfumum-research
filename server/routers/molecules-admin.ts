/**
 * molecules-admin.ts — Rapport 17
 * Procédures admin pour la gestion complète des molécules :
 * - delete : suppression avec cascade (relations recettes/plantes)
 * - updateFields : mise à jour manuelle de tous les champs
 * - enrichFromWikidata : enrichissement CAS/SMILES/IUPAC via QID Wikidata
 * - getFullById : détails complets pour l'édition admin
 */
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { invalidateMoleculeCache } from "../cache";
import mysql from "mysql2/promise";

async function getConn() {
  return mysql.createConnection(process.env.DATABASE_URL!);
}

export const moleculesAdminRouter = router({

  /**
   * Supprimer une molécule (protégé) — supprime aussi les relations recettes/plantes
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT id, name FROM molecules WHERE id = ? LIMIT 1",
          [input.id]
        );
        if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Molécule introuvable" });
        const name = rows[0].name as string;
        // Supprimer les relations associées d'abord (FK)
        // Supprimer les relations dans les tables de liaison
        // (on ignore les erreurs si la table n'a pas de FK sur molecule_id)
        // molecule_recettes utilise 'moleculeId' (camelCase), plant_molecules utilise 'molecule_id'
        const relTablesSnake = ["plant_molecules", "molecule_plant_sources"];
        const relTablesCamel = ["molecule_recettes", "molecules_recettes", "recette_molecules"];
        for (const tbl of relTablesSnake) {
          try { await conn.query(`DELETE FROM ${tbl} WHERE molecule_id = ?`, [input.id]); } catch { /* ignore */ }
        }
        for (const tbl of relTablesCamel) {
          try { await conn.query(`DELETE FROM ${tbl} WHERE moleculeId = ?`, [input.id]); } catch { /* ignore */ }
        }
        await conn.query("DELETE FROM molecules WHERE id = ?", [input.id]);
        invalidateMoleculeCache();
        return { success: true, id: input.id, name };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Mettre à jour les champs textuels d'une molécule (protégé)
   */
  updateFields: protectedProcedure
    .input(z.object({
      id: z.number().int(),
      name: z.string().min(1).max(300).optional(),
      family: z.string().max(200).optional().nullable(),
      chemicalFamily: z.string().max(200).optional().nullable(),
      casNumber: z.string().max(30).optional().nullable(),
      iupacName: z.string().max(600).optional().nullable(),
      smiles: z.string().max(2000).optional().nullable(),
      wikidataQid: z.string().max(20).optional().nullable(),
      pubchemCid: z.number().int().optional().nullable(),
      chebiId: z.string().max(50).optional().nullable(),
      olfactiveProfile: z.string().max(1000).optional().nullable(),
      therapeuticProperties: z.string().max(1000).optional().nullable(),
      notes: z.string().max(5000).optional().nullable(),
    }))
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
        const { id, ...fields } = input;
        const setClauses: string[] = [];
        const values: unknown[] = [];
        const fieldMap: Record<string, string> = {
          name: "name",
          family: "family",
          chemicalFamily: "chemicalFamily",
          casNumber: "cas_number",
          iupacName: "iupac_name",
          smiles: "smiles",
          wikidataQid: "wikidata_qid",
          pubchemCid: "pubchem_cid",
          chebiId: "chebi_id",
          olfactiveProfile: "olfactiveProfile",
          therapeuticProperties: "therapeuticProperties",
          notes: "notes",
        };
        for (const [key, col] of Object.entries(fieldMap)) {
          if (key in fields && (fields as Record<string, unknown>)[key] !== undefined) {
            setClauses.push(`${col} = ?`);
            values.push((fields as Record<string, unknown>)[key]);
          }
        }
        if (!setClauses.length) throw new TRPCError({ code: "BAD_REQUEST", message: "Aucun champ à mettre à jour" });
        values.push(id);
        await conn.query(`UPDATE molecules SET ${setClauses.join(", ")} WHERE id = ?`, values);
        invalidateMoleculeCache();
        return { success: true, id };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Enrichir depuis Wikidata via QID (récupère CAS, SMILES, IUPAC si manquants)
   */
  enrichFromWikidata: protectedProcedure
    .input(z.object({ moleculeId: z.number().int() }))
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT id, name, wikidata_qid, cas_number, iupac_name, smiles FROM molecules WHERE id = ? LIMIT 1",
          [input.moleculeId]
        );
        const mol = rows[0];
        if (!mol) throw new TRPCError({ code: "NOT_FOUND", message: "Molécule introuvable" });
        const qid = mol.wikidata_qid as string | null;
        if (!qid || !/^Q\d+$/.test(qid)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Aucun QID Wikidata valide pour cette molécule" });
        }
        // P231 = CAS, P233 = SMILES canonique, P2566 = nom IUPAC
        const sparql = `SELECT ?casNumber ?smiles ?iupacName WHERE {
  OPTIONAL { wd:${qid} wdt:P231 ?casNumber . }
  OPTIONAL { wd:${qid} wdt:P233 ?smiles . }
  OPTIONAL { wd:${qid} wdt:P2566 ?iupacName . }
} LIMIT 1`;
        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 10000);
        const resp = await fetch(url, {
          headers: { Accept: "application/sparql-results+json", "User-Agent": "PERFUMUM-Research/1.0" },
          signal: ctrl.signal,
        });
        clearTimeout(timer);
        if (!resp.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur Wikidata SPARQL" });
        const data = await resp.json() as { results?: { bindings?: Array<Record<string, { value: string }>> } };
        const b = data.results?.bindings?.[0] || {};
        const updates: Record<string, string | null> = {};
        if (b.casNumber?.value && !mol.cas_number) updates.cas_number = b.casNumber.value;
        if (b.smiles?.value && !mol.smiles) updates.smiles = b.smiles.value;
        if (b.iupacName?.value && !mol.iupac_name) updates.iupac_name = b.iupacName.value;
        if (Object.keys(updates).length > 0) {
          const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(", ");
          await conn.query(`UPDATE molecules SET ${setClauses} WHERE id = ?`, [...Object.values(updates), input.moleculeId]);
          invalidateMoleculeCache();
        }
        return {
          success: true,
          moleculeId: input.moleculeId,
          qid,
          fieldsUpdated: Object.keys(updates),
          data: {
            casNumber: b.casNumber?.value || null,
            smiles: b.smiles?.value || null,
            iupacName: b.iupacName?.value || null,
          },
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Récupérer les détails complets d'une molécule pour l'édition admin
   */
  getFullById: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const conn = await getConn();
      try {
        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          `SELECT id, name, family, chemicalFamily, cas_number, iupac_name, smiles,
                  wikidata_qid, pubchem_cid, chebi_id, olfactiveProfile, therapeuticProperties, notes
           FROM molecules WHERE id = ? LIMIT 1`,
          [input.id]
        );
        const m = rows[0];
        if (!m) throw new TRPCError({ code: "NOT_FOUND", message: "Molécule introuvable" });
        return {
          id: Number(m.id),
          name: m.name as string,
          family: (m.family as string) || null,
          chemicalFamily: (m.chemicalFamily as string) || null,
          casNumber: (m.cas_number as string) || null,
          iupacName: (m.iupac_name as string) || null,
          smiles: (m.smiles as string) || null,
          wikidataQid: (m.wikidata_qid as string) || null,
          pubchemCid: m.pubchem_cid ? Number(m.pubchem_cid) : null,
          chebiId: (m.chebi_id as string) || null,
          olfactiveProfile: (m.olfactiveProfile as string) || null,
          therapeuticProperties: (m.therapeuticProperties as string) || null,
          notes: (m.notes as string) || null,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Vérifier si des tables de relations existent (pour sécuriser la suppression)
   */
  getDeletionImpact: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const conn = await getConn();
      try {
        const [[recettes]] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT COUNT(*) as cnt FROM molecule_recettes WHERE moleculeId = ?",
          [input.id]
        );
        const [[plants]] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT COUNT(*) as cnt FROM plant_molecules WHERE molecule_id = ?",
          [input.id]
        );
        return {
          recetteCount: Number(recettes.cnt),
          plantCount: Number(plants.cnt),
        };
      } finally {
        await conn.end();
      }
    }),
});
