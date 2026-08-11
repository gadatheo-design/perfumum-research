/**
 * plants-admin.ts — Rapport 18
 * Procédures admin pour les plantes :
 *   - getFullById        : données complètes d'une plante
 *   - getDeletionImpact  : compte les relations avant suppression
 *   - delete             : suppression sécurisée en cascade
 *   - updateFields       : mise à jour manuelle de n'importe quel champ
 *   - enrichFromGBIF     : enrichissement via l'API GBIF (family, genus, species, gbif_id, conservation_status…)
 *   - enrichFromWikidata : enrichissement via SPARQL Wikidata (wikidata_qid, family, genus, conservation_status…)
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import mysql from "mysql2/promise";
import { getMysqlConnection } from "../db/mysqlPool";

// ── Connexion DB ──────────────────────────────────────────────────────────────
async function getConn() {
  return getMysqlConnection();
}

// ── Schéma de mise à jour des champs ─────────────────────────────────────────
const updateFieldsSchema = z.object({
  id: z.number().int(),
  name: z.string().optional(),
  latin_name: z.string().nullable().optional(),
  family: z.string().nullable().optional(),
  genus: z.string().nullable().optional(),
  species: z.string().nullable().optional(),
  subspecies: z.string().nullable().optional(),
  order_name: z.string().nullable().optional(),
  division: z.string().nullable().optional(),
  kingdom: z.string().nullable().optional(),
  origin: z.string().nullable().optional(),
  habitat: z.string().nullable().optional(),
  olfactive_signature: z.string().nullable().optional(),
  traditional_use: z.string().nullable().optional(),
  conservation_notes: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  gbif_id: z.string().nullable().optional(),
  wikidata_qid: z.string().nullable().optional(),
  ncbi_tax_id: z.string().nullable().optional(),
  iucn_id: z.string().nullable().optional(),
  conservation_status: z.enum(["EX","EW","CR","EN","VU","NT","LC","DD","NE"]).nullable().optional(),
  historical_status: z.string().nullable().optional(),
  author_citation: z.string().nullable().optional(),
  harvest_period: z.string().nullable().optional(),
  essential_oil_yield: z.string().nullable().optional(),
});

// ── Helpers GBIF ─────────────────────────────────────────────────────────────
async function fetchGBIFByName(name: string) {
  try {
    const url = `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(name)}&verbose=false`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json() as Record<string, unknown>;
    if ((data.matchType as string) === "NONE") return null;
    return data;
  } catch {
    return null;
  }
}

async function fetchGBIFById(gbifId: string) {
  try {
    const res = await fetch(`https://api.gbif.org/v1/species/${gbifId}`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    return await res.json() as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ── Helper Wikidata SPARQL ────────────────────────────────────────────────────
async function fetchWikidataForPlant(qid: string) {
  const sparql = `
    SELECT ?family ?familyLabel ?genus ?genusLabel ?species ?speciesLabel
           ?conservation ?conservationLabel ?gbifId ?ncbiId ?iucnId ?authorCitation
    WHERE {
      BIND(wd:${qid} AS ?plant)
      OPTIONAL { ?plant wdt:P171+ ?fam . ?fam wdt:P105 wd:Q35409 . BIND(?fam AS ?family) }
      OPTIONAL { ?plant wdt:P171+ ?gen . ?gen wdt:P105 wd:Q34740 . BIND(?gen AS ?genus) }
      OPTIONAL { ?plant wdt:P225 ?species }
      OPTIONAL { ?plant wdt:P141 ?conservation }
      OPTIONAL { ?plant wdt:P846 ?gbifId }
      OPTIONAL { ?plant wdt:P685 ?ncbiId }
      OPTIONAL { ?plant wdt:P627 ?iucnId }
      OPTIONAL { ?plant wdt:P405 ?authorCitation }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" }
    } LIMIT 1
  `;
  try {
    const res = await fetch(
      `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`,
      { headers: { "Accept": "application/json", "User-Agent": "PERFUMUM-Research/1.0" }, signal: AbortSignal.timeout(12000) }
    );
    if (!res.ok) return null;
    const data = await res.json() as { results: { bindings: Record<string, { value: string }>[] } };
    return data.results.bindings[0] || null;
  } catch {
    return null;
  }
}

// ── Router ────────────────────────────────────────────────────────────────────
export const plantsAdminRouter = router({

  // ── getFullById ──────────────────────────────────────────────────────────
  getFullById: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const conn = await getConn();
      try {
        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          `SELECT id, name, latin_name, family, genus, species, subspecies, order_name, division, kingdom,
                  category, origin, habitat, olfactive_signature, traditional_use, conservation_notes, notes,
                  gbif_id, wikidata_qid, ncbi_tax_id, iucn_id, conservation_status, historical_status,
                  author_citation, harvest_period, essential_oil_yield, image_url,
                  gbif_enriched_at, wikidata_enriched_at, iucn_enriched_at
           FROM plants WHERE id = ?`,
          [input.id]
        );
        if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Plante introuvable" });
        return rows[0];
      } finally {
        await conn.end();
      }
    }),

  // ── getDeletionImpact ────────────────────────────────────────────────────
  getDeletionImpact: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const conn = await getConn();
      try {
        const [[molecules]] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT COUNT(*) as cnt FROM plant_molecules WHERE plant_id = ?", [input.id]
        );
        const [[varieties]] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT COUNT(*) as cnt FROM plant_varieties WHERE plant_id = ?", [input.id]
        );
        const [[terroirs]] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT COUNT(*) as cnt FROM plant_terroirs WHERE plant_id = ?", [input.id]
        );
        const [[analyses]] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT COUNT(*) as cnt FROM plant_analyses WHERE plant_id = ?", [input.id]
        );
        const [[samples]] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT COUNT(*) as cnt FROM plant_samples WHERE plant_id = ?", [input.id]
        );
        return {
          moleculeCount: Number(molecules.cnt),
          varietyCount: Number(varieties.cnt),
          terroirCount: Number(terroirs.cnt),
          analysisCount: Number(analyses.cnt),
          sampleCount: Number(samples.cnt),
        };
      } finally {
        await conn.end();
      }
    }),

  // ── delete ───────────────────────────────────────────────────────────────
  delete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT id, name FROM plants WHERE id = ?", [input.id]
        );
        if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Plante introuvable" });
        const name = rows[0].name as string;

        // Supprimer les relations (snake_case plant_id)
        const relTables = [
          "plant_molecules", "plant_varieties", "plant_terroirs",
          "plant_analyses", "plant_samples", "plant_geographic_zones",
          "plant_extractions", "plant_perfumes", "plant_contributions",
          "genomic_plant_links", "ghost_variety_plant_links",
          "molecule_plant_sources", "raw_material_plants", "terp_profile_plants",
        ];
        for (const tbl of relTables) {
          try {
            await conn.query(`DELETE FROM ${tbl} WHERE plant_id = ?`, [input.id]);
          } catch { /* ignore si la table n'a pas de FK plant_id */ }
        }

        await conn.query("DELETE FROM plants WHERE id = ?", [input.id]);
        return { success: true, id: input.id, name };
      } finally {
        await conn.end();
      }
    }),

  // ── updateFields ─────────────────────────────────────────────────────────
  updateFields: protectedProcedure
    .input(updateFieldsSchema)
    .mutation(async ({ input }) => {
      const { id, ...fields } = input;
      const defined = Object.entries(fields).filter(([, v]) => v !== undefined);
      if (!defined.length) throw new TRPCError({ code: "BAD_REQUEST", message: "Aucun champ à mettre à jour" });

      const conn = await getConn();
      try {
        const setClauses = defined.map(([k]) => `\`${k}\` = ?`).join(", ");
        const values = defined.map(([, v]) => v);
        await conn.query(`UPDATE plants SET ${setClauses}, updated_at = NOW() WHERE id = ?`, [...values, id]);
        return { success: true, id, fieldsUpdated: defined.map(([k]) => k) };
      } finally {
        await conn.end();
      }
    }),

  // ── enrichFromGBIF ───────────────────────────────────────────────────────
  enrichFromGBIF: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT id, name, latin_name, family, genus, gbif_id FROM plants WHERE id = ?", [input.id]
        );
        if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Plante introuvable" });
        const plant = rows[0];

        // Chercher par gbif_id existant ou par nom latin ou par nom commun
        let gbifData: Record<string, unknown> | null = null;
        if (plant.gbif_id) {
          gbifData = await fetchGBIFById(plant.gbif_id as string);
        }
        if (!gbifData && plant.latin_name) {
          gbifData = await fetchGBIFByName(plant.latin_name as string);
        }
        if (!gbifData && plant.name) {
          gbifData = await fetchGBIFByName(plant.name as string);
        }

        if (!gbifData) {
          return { success: false, message: "Aucun résultat GBIF trouvé", fieldsUpdated: [] };
        }

        // Construire les champs à mettre à jour (uniquement les champs vides)
        const updates: Record<string, string | null> = {};
        if (!plant.gbif_id && gbifData.usageKey) updates.gbif_id = String(gbifData.usageKey);
        if (!plant.family && gbifData.family) updates.family = gbifData.family as string;
        if (!plant.genus && gbifData.genus) updates.genus = gbifData.genus as string;
        if (gbifData.species && !plant.latin_name) updates.latin_name = gbifData.species as string;

        if (!Object.keys(updates).length) {
          return { success: true, message: "Tous les champs GBIF sont déjà renseignés", fieldsUpdated: [] };
        }

        const setClauses = Object.keys(updates).map(k => `\`${k}\` = ?`).join(", ");
        const values = Object.values(updates);
        await conn.query(
          `UPDATE plants SET ${setClauses}, gbif_enriched_at = NOW(), updated_at = NOW() WHERE id = ?`,
          [...values, input.id]
        );

        return {
          success: true,
          message: `GBIF : ${Object.keys(updates).join(", ")} mis à jour`,
          fieldsUpdated: Object.keys(updates),
          gbifData: {
            usageKey: gbifData.usageKey,
            family: gbifData.family,
            genus: gbifData.genus,
            species: gbifData.species,
            matchType: gbifData.matchType,
            confidence: gbifData.confidence,
          },
        };
      } finally {
        await conn.end();
      }
    }),

  // ── enrichFromWikidata ───────────────────────────────────────────────────
  enrichFromWikidata: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT id, name, wikidata_qid, family, genus, gbif_id, ncbi_tax_id, iucn_id FROM plants WHERE id = ?",
          [input.id]
        );
        if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Plante introuvable" });
        const plant = rows[0];

        if (!plant.wikidata_qid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cette plante n'a pas de QID Wikidata. Renseignez-le d'abord dans l'onglet Édition.",
          });
        }

        const wdData = await fetchWikidataForPlant(plant.wikidata_qid as string);
        if (!wdData) {
          return { success: false, message: "Aucune donnée Wikidata trouvée pour ce QID", fieldsUpdated: [] };
        }

        const updates: Record<string, string | null> = {};

        if (!plant.family && wdData.familyLabel?.value) updates.family = wdData.familyLabel.value;
        if (!plant.genus && wdData.genusLabel?.value) updates.genus = wdData.genusLabel.value;
        if (!plant.gbif_id && wdData.gbifId?.value) updates.gbif_id = wdData.gbifId.value;
        if (!plant.ncbi_tax_id && wdData.ncbiId?.value) updates.ncbi_tax_id = wdData.ncbiId.value;
        if (!plant.iucn_id && wdData.iucnId?.value) updates.iucn_id = wdData.iucnId.value;

        if (!Object.keys(updates).length) {
          return { success: true, message: "Tous les champs Wikidata sont déjà renseignés", fieldsUpdated: [] };
        }

        const setClauses = Object.keys(updates).map(k => `\`${k}\` = ?`).join(", ");
        const values = Object.values(updates);
        await conn.query(
          `UPDATE plants SET ${setClauses}, wikidata_enriched_at = NOW(), updated_at = NOW() WHERE id = ?`,
          [...values, input.id]
        );

        return {
          success: true,
          message: `Wikidata : ${Object.keys(updates).join(", ")} mis à jour`,
          fieldsUpdated: Object.keys(updates),
        };
      } finally {
        await conn.end();
      }
    }),

  // ── getCoverageStats ─────────────────────────────────────────────────────
  getCoverageStats: publicProcedure.query(async () => {
    const conn = await getConn();
    try {
      const [[total]] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) as cnt FROM plants");
      const [[withFamily]] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) as cnt FROM plants WHERE family IS NOT NULL AND family != ''");
      const [[withGenus]] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) as cnt FROM plants WHERE genus IS NOT NULL AND genus != ''");
      const [[withGbif]] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) as cnt FROM plants WHERE gbif_id IS NOT NULL");
      const [[withWikidata]] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) as cnt FROM plants WHERE wikidata_qid IS NOT NULL");
      const [[withIucn]] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) as cnt FROM plants WHERE iucn_id IS NOT NULL");
      const [[withLatin]] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) as cnt FROM plants WHERE latin_name IS NOT NULL AND latin_name != ''");
      return {
        total: Number(total.cnt),
        withFamily: Number(withFamily.cnt),
        withGenus: Number(withGenus.cnt),
        withGbif: Number(withGbif.cnt),
        withWikidata: Number(withWikidata.cnt),
        withIucn: Number(withIucn.cnt),
        withLatin: Number(withLatin.cnt),
      };
    } finally {
      await conn.end();
    }
  }),

  // ── listPaginated ────────────────────────────────────────────────────────
  listPaginated: publicProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(10).max(100).default(25),
      search: z.string().optional(),
      filterMissingFamily: z.boolean().optional(),
      filterMissingGenus: z.boolean().optional(),
      filterMissingGbif: z.boolean().optional(),
      filterMissingWikidata: z.boolean().optional(),
      category: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const conn = await getConn();
      try {
        const conditions: string[] = [];
        const params: (string | number | boolean)[] = [];

        if (input.search) {
          conditions.push("(name LIKE ? OR latin_name LIKE ? OR family LIKE ? OR genus LIKE ?)");
          const s = `%${input.search}%`;
          params.push(s, s, s, s);
        }
        if (input.filterMissingFamily) conditions.push("(family IS NULL OR family = '')");
        if (input.filterMissingGenus) conditions.push("(genus IS NULL OR genus = '')");
        if (input.filterMissingGbif) conditions.push("gbif_id IS NULL");
        if (input.filterMissingWikidata) conditions.push("wikidata_qid IS NULL");
        if (input.category) { conditions.push("category = ?"); params.push(input.category); }

        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const [[countRow]] = await conn.query<mysql.RowDataPacket[]>(
          `SELECT COUNT(*) as cnt FROM plants ${where}`, params
        );
        const total = Number(countRow.cnt);

        const offset = (input.page - 1) * input.pageSize;
        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          `SELECT id, name, latin_name, family, genus, category, wikidata_qid, gbif_id, conservation_status, image_url
           FROM plants ${where} ORDER BY name ASC LIMIT ${input.pageSize} OFFSET ${offset}`,
          params
        );

        return { plants: rows, total, page: input.page, pageSize: input.pageSize, totalPages: Math.ceil(total / input.pageSize) };
      } finally {
        await conn.end();
      }
    }),
});
