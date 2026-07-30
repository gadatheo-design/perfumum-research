/**
 * Phase B — Knowledge Graph Wikidata Étendu (PERFUMUM)
 *
 * Pour chaque molécule avec un QID Wikidata, récupère en une seule requête SPARQL :
 *   - Classe chimique (P31), sous-classe (P279)
 *   - Squelette terpénique (P31/P279*)
 *   - Voie de biosynthèse (P2868)
 *   - Chiralité (P2360)
 *   - Molécules parentes (P3776) et dérivées (P3777)
 *   - Isomères (P3070)
 *   - Organismes producteurs (P703)
 *   - Huiles essentielles contenant la molécule (P361 → Q2832148)
 *   - Résines et matières premières (P361 → Q207977)
 *   - Identifiants croisés : CAS (P231), InChI (P234), InChIKey (P235), SMILES (P233),
 *     ChEBI (P683), PubChem (P662), ChemSpider (P661)
 *   - Odeurs et usages (P2283 → Q21014462, P366)
 *   - Propriétés physicochimiques (masse molaire P2067, formule P274)
 *
 * Les données sont stockées dans la colonne JSON `wikidata_kg_data` de la table molecules.
 */
import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import * as mysql from "mysql2/promise";

const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";
const DELAY_MS = 600;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Exécute une requête SPARQL Wikidata et retourne les bindings */
async function sparqlQuery(query: string): Promise<Array<Record<string, { value: string; type: string }>>> {
  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`;
  const resp = await fetch(url, {
    headers: { "Accept": "application/json", "User-Agent": "PERFUMUM-KnowledgeGraph/1.0" },
    signal: AbortSignal.timeout(20000),
  });
  if (!resp.ok) throw new Error(`SPARQL error ${resp.status}`);
  const data = await resp.json() as { results?: { bindings?: Array<Record<string, { value: string; type: string }>> } };
  return data.results?.bindings ?? [];
}

/** Extrait la dernière partie d'une URI Wikidata (QID) */
const qid = (uri: string) => uri.split("/").pop() ?? uri;

/** Construit le Knowledge Graph complet d'une molécule à partir de son QID */
async function buildMoleculeKG(wikidataQid: string): Promise<{
  classes: Array<{ qid: string; label: string }>;
  subclasses: Array<{ qid: string; label: string }>;
  skeletons: Array<{ qid: string; label: string }>;
  biosynthesisPathways: Array<{ qid: string; label: string }>;
  chirality: Array<{ qid: string; label: string }>;
  parentMolecules: Array<{ qid: string; label: string }>;
  derivedMolecules: Array<{ qid: string; label: string }>;
  isomers: Array<{ qid: string; label: string }>;
  producingOrganisms: Array<{ qid: string; label: string }>;
  essentialOils: Array<{ qid: string; label: string }>;
  resins: Array<{ qid: string; label: string }>;
  odors: Array<{ qid: string; label: string }>;
  uses: Array<{ qid: string; label: string }>;
  identifiers: {
    cas?: string; inchi?: string; inchikey?: string; smiles?: string;
    chebi?: string; pubchem?: string; chemspider?: string;
    mw?: string; formula?: string;
  };
  retrievedAt: string;
}> {
  // Requête principale : propriétés scalaires + listes
  const mainQuery = `
SELECT DISTINCT
  ?class ?classLabel
  ?subclass ?subclassLabel
  ?skeleton ?skeletonLabel
  ?biosynthesis ?biosynthesisLabel
  ?chirality ?chiralityLabel
  ?parentMol ?parentMolLabel
  ?derivedMol ?derivedMolLabel
  ?isomer ?isomerLabel
  ?organism ?organismLabel
  ?eo ?eoLabel
  ?resin ?resinLabel
  ?odor ?odorLabel
  ?use ?useLabel
  ?cas ?inchi ?inchikey ?smiles
  ?chebi ?pubchem ?chemspider
  ?mw ?formula
WHERE {
  BIND(wd:${wikidataQid} AS ?item)
  OPTIONAL { ?item wdt:P31 ?class }
  OPTIONAL { ?item wdt:P279 ?subclass }
  OPTIONAL {
    ?item wdt:P31 ?skeleton .
    ?skeleton wdt:P279+ wd:Q59199015 .
  }
  OPTIONAL { ?item wdt:P2868 ?biosynthesis }
  OPTIONAL { ?item wdt:P2360 ?chirality }
  OPTIONAL { ?item wdt:P3776 ?parentMol }
  OPTIONAL { ?item wdt:P3777 ?derivedMol }
  OPTIONAL { ?item wdt:P3070 ?isomer }
  OPTIONAL { ?item wdt:P703 ?organism }
  OPTIONAL {
    ?item wdt:P361 ?eo .
    ?eo wdt:P31/wdt:P279* wd:Q2832148 .
  }
  OPTIONAL {
    ?item wdt:P361 ?resin .
    ?resin wdt:P31/wdt:P279* wd:Q207977 .
  }
  OPTIONAL {
    ?item wdt:P2283 ?odorUse .
    ?odorUse wdt:P31/wdt:P279* wd:Q21014462 .
    BIND(?odorUse AS ?odor)
  }
  OPTIONAL { ?item wdt:P366 ?use }
  OPTIONAL { ?item wdt:P231 ?cas }
  OPTIONAL { ?item wdt:P234 ?inchi }
  OPTIONAL { ?item wdt:P235 ?inchikey }
  OPTIONAL { ?item wdt:P233 ?smiles }
  OPTIONAL { ?item wdt:P683 ?chebi }
  OPTIONAL { ?item wdt:P662 ?pubchem }
  OPTIONAL { ?item wdt:P661 ?chemspider }
  OPTIONAL { ?item wdt:P2067 ?mw }
  OPTIONAL { ?item wdt:P274 ?formula }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" }
}
LIMIT 100
`;

  const bindings = await sparqlQuery(mainQuery);

  // Agrégation des résultats (dédupliqués par QID)
  const collect = (key: string, labelKey: string) => {
    const seen = new Set<string>();
    const result: Array<{ qid: string; label: string }> = [];
    for (const b of bindings) {
      if (b[key]) {
        const id = qid(b[key].value);
        if (!seen.has(id)) {
          seen.add(id);
          result.push({ qid: id, label: b[labelKey]?.value ?? id });
        }
      }
    }
    return result;
  };

  const first = (key: string) => bindings.find(b => b[key])?.[key]?.value;

  return {
    classes: collect("class", "classLabel"),
    subclasses: collect("subclass", "subclassLabel"),
    skeletons: collect("skeleton", "skeletonLabel"),
    biosynthesisPathways: collect("biosynthesis", "biosynthesisLabel"),
    chirality: collect("chirality", "chiralityLabel"),
    parentMolecules: collect("parentMol", "parentMolLabel"),
    derivedMolecules: collect("derivedMol", "derivedMolLabel"),
    isomers: collect("isomer", "isomerLabel"),
    producingOrganisms: collect("organism", "organismLabel"),
    essentialOils: collect("eo", "eoLabel"),
    resins: collect("resin", "resinLabel"),
    odors: collect("odor", "odorLabel"),
    uses: collect("use", "useLabel"),
    identifiers: {
      cas: first("cas"),
      inchi: first("inchi"),
      inchikey: first("inchikey"),
      smiles: first("smiles"),
      chebi: first("chebi"),
      pubchem: first("pubchem"),
      chemspider: first("chemspider"),
      mw: first("mw"),
      formula: first("formula"),
    },
    retrievedAt: new Date().toISOString(),
  };
}

export const wikidataKgRouter = router({

  /**
   * Récupère le Knowledge Graph Wikidata complet d'une molécule
   * (lecture seule, sans écriture en base)
   */
  getMoleculeKG: publicProcedure
    .input(z.object({
      moleculeId: z.number().int().positive().optional(),
      wikidataQid: z.string().optional(),
    }))
    .query(async ({ input }) => {
      let qidToUse = input.wikidataQid;

      if (!qidToUse && input.moleculeId) {
        const conn = await mysql.createConnection(process.env.DATABASE_URL!);
        try {
          const [rows] = await conn.execute<mysql.RowDataPacket[]>(
            "SELECT id, name, wikidata_qid, cas_number FROM molecules WHERE id = ? LIMIT 1",
            [input.moleculeId]
          );
          if (!rows[0]) throw new Error("Molécule introuvable");
          const mol = rows[0] as Record<string, unknown>;
          qidToUse = mol.wikidata_qid as string | undefined;

          // Fallback : résolution via CAS si QID absent
          if (!qidToUse && mol.cas_number) {
            const casQuery = `SELECT ?item WHERE { ?item wdt:P231 "${mol.cas_number}" } LIMIT 1`;
            const r = await sparqlQuery(casQuery);
            if (r[0]?.item) qidToUse = qid(r[0].item.value);
          }
        } finally {
          await conn.end();
        }
      }

      if (!qidToUse) throw new Error("QID Wikidata introuvable pour cette molécule");

      const kg = await buildMoleculeKG(qidToUse);
      return { qid: qidToUse, ...kg };
    }),

  /**
   * Enrichit une molécule en base avec son KG Wikidata
   * (stocke le résultat dans wikidata_kg_data + met à jour les colonnes directes)
   */
  enrichSingleWithKG: publicProcedure
    .input(z.object({ moleculeId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      try {
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(
          "SELECT id, name, wikidata_qid, cas_number, chebi_id, inchi, inchi_key FROM molecules WHERE id = ? LIMIT 1",
          [input.moleculeId]
        );
        if (!rows[0]) throw new Error("Molécule introuvable");
        const mol = rows[0] as Record<string, unknown>;
        let qidToUse = mol.wikidata_qid as string | null;

        // Fallback CAS
        if (!qidToUse && mol.cas_number) {
          const casQuery = `SELECT ?item WHERE { ?item wdt:P231 "${mol.cas_number}" } LIMIT 1`;
          const r = await sparqlQuery(casQuery);
          if (r[0]?.item) qidToUse = qid(r[0].item.value);
          await sleep(DELAY_MS);
        }
        if (!qidToUse) return { success: false, error: "QID introuvable", moleculeId: input.moleculeId };

        const kg = await buildMoleculeKG(qidToUse);

        // Mettre à jour les colonnes directes si manquantes
        const updates: string[] = [];
        const params: unknown[] = [];
        const set = (col: string, val: unknown) => {
          if (val !== null && val !== undefined && val !== "") { updates.push(`${col} = ?`); params.push(val); }
        };

        if (!mol.wikidata_qid) set("wikidata_qid", qidToUse);
        if (!mol.chebi_id && kg.identifiers.chebi) set("chebi_id", kg.identifiers.chebi);
        if (!mol.inchi && kg.identifiers.inchi) set("inchi", kg.identifiers.inchi);
        if (!mol.inchi_key && kg.identifiers.inchikey) set("inchi_key", kg.identifiers.inchikey);

        // Stocker le KG complet en JSON
        set("wikidata_kg_data", JSON.stringify(kg));
        set("wikidata_enriched_at", new Date());

        if (updates.length > 0) {
          params.push(input.moleculeId);
          await conn.execute(`UPDATE molecules SET ${updates.join(", ")} WHERE id = ?`, params);
        }

        return {
          success: true,
          moleculeId: input.moleculeId,
          qid: qidToUse,
          classesCount: kg.classes.length,
          organismsCount: kg.producingOrganisms.length,
          essentialOilsCount: kg.essentialOils.length,
          hasIdentifiers: Object.values(kg.identifiers).filter(Boolean).length,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Enrichissement KG en batch pour N molécules avec QID
   */
  enrichBatchWithKG: publicProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(50).default(20),
      onlyMissingKg: z.boolean().default(true),
      familyFilter: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      let molecules: Array<{ id: number; name: string; wikidata_qid: string | null; cas_number: string | null }> = [];
      try {
        let where = "(wikidata_qid IS NOT NULL AND wikidata_qid != '') OR (cas_number IS NOT NULL AND cas_number != '')";
        if (input.onlyMissingKg) where = `(${where}) AND (wikidata_kg_data IS NULL)`;
        if (input.familyFilter) where += ` AND family = ${mysql.escape(input.familyFilter)}`;
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(
          `SELECT id, name, wikidata_qid, cas_number FROM molecules WHERE ${where} ORDER BY RAND() LIMIT ${Math.floor(input.limit)}`
        );
        molecules = rows as typeof molecules;
      } finally {
        await conn.end();
      }

      const results: Array<{
        moleculeId: number; name: string; success: boolean;
        qid?: string; classesCount?: number; organismsCount?: number; error?: string;
      }> = [];

      for (const mol of molecules) {
        const conn2 = await mysql.createConnection(process.env.DATABASE_URL!);
        try {
          let qidToUse = mol.wikidata_qid;
          if (!qidToUse && mol.cas_number) {
            const casQuery = `SELECT ?item WHERE { ?item wdt:P231 "${mol.cas_number}" } LIMIT 1`;
            const r = await sparqlQuery(casQuery);
            if (r[0]?.item) qidToUse = qid(r[0].item.value);
            await sleep(DELAY_MS);
          }
          if (!qidToUse) { results.push({ moleculeId: mol.id, name: mol.name, success: false, error: "QID introuvable" }); continue; }

          const kg = await buildMoleculeKG(qidToUse);

          const updates: string[] = [];
          const params: unknown[] = [];
          const set = (col: string, val: unknown) => {
            if (val !== null && val !== undefined && val !== "") { updates.push(`${col} = ?`); params.push(val); }
          };
          if (!mol.wikidata_qid) set("wikidata_qid", qidToUse);
          if (kg.identifiers.chebi) set("chebi_id", kg.identifiers.chebi);
          if (kg.identifiers.inchi) set("inchi", kg.identifiers.inchi);
          if (kg.identifiers.inchikey) set("inchi_key", kg.identifiers.inchikey);
          set("wikidata_kg_data", JSON.stringify(kg));
          set("wikidata_enriched_at", new Date());

          if (updates.length > 0) {
            params.push(mol.id);
            await conn2.execute(`UPDATE molecules SET ${updates.join(", ")} WHERE id = ?`, params);
          }

          results.push({ moleculeId: mol.id, name: mol.name, success: true, qid: qidToUse, classesCount: kg.classes.length, organismsCount: kg.producingOrganisms.length });
          await sleep(DELAY_MS);
        } catch (e) {
          results.push({ moleculeId: mol.id, name: mol.name, success: false, error: e instanceof Error ? e.message : "Erreur" });
        } finally {
          await conn2.end();
        }
      }

      return {
        total: results.length,
        success: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
      };
    }),

  /**
   * Récupère le KG stocké en base pour une molécule
   */
  getStoredKG: publicProcedure
    .input(z.object({ moleculeId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      try {
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(
          "SELECT id, name, wikidata_qid, wikidata_kg_data, wikidata_enriched_at FROM molecules WHERE id = ? LIMIT 1",
          [input.moleculeId]
        );
        if (!rows[0]) throw new Error("Molécule introuvable");
        const mol = rows[0] as Record<string, unknown>;
        const kgData = mol.wikidata_kg_data ? JSON.parse(mol.wikidata_kg_data as string) : null;
        return {
          moleculeId: input.moleculeId,
          name: mol.name as string,
          wikidataQid: mol.wikidata_qid as string | null,
          kg: kgData,
          enrichedAt: mol.wikidata_enriched_at,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Statistiques de couverture KG
   */
  getKGCoverageStats: publicProcedure.query(async () => {
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    try {
      const [rows] = await conn.execute<mysql.RowDataPacket[]>(`
        SELECT
          COUNT(*) AS total,
          SUM(wikidata_qid IS NOT NULL AND wikidata_qid != '') AS has_qid,
          SUM(wikidata_kg_data IS NOT NULL) AS has_kg,
          SUM(cas_number IS NOT NULL AND cas_number != '') AS has_cas
        FROM molecules
      `);
      const r = rows[0] as Record<string, unknown>;
      return {
        total: Number(r.total),
        hasQid: Number(r.has_qid),
        hasKg: Number(r.has_kg),
        hasCas: Number(r.has_cas),
        missingKg: Number(r.has_qid) - Number(r.has_kg),
        coveragePercent: r.has_qid ? Math.round((Number(r.has_kg) / Number(r.has_qid)) * 100) : 0,
      };
    } finally {
      await conn.end();
    }
  }),
});
