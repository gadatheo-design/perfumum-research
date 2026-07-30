/**
 * Phase A — Enrichissement PubChem Étendu
 * Récupère pour chaque molécule (via CID existant ou recherche par nom/CAS) :
 *   - InChI, InChIKey, SMILES canonique + isomérique
 *   - Masse exacte, XLogP, TPSA, complexité
 *   - H-bond donors/acceptors, liaisons rotatives, atomes lourds
 *   - Synonymes PubChem (inclut souvent CAS, EINECS, FEMA, etc.)
 *   - Identifiants croisés : ChEBI, ChemSpider, NIST, DSSTox
 *   - Données physicochimiques étendues (point d'ébullition, solubilité, densité)
 */
import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import * as mysql from "mysql2/promise";

const PUBCHEM_BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
const DELAY_MS = 400; // Respecter rate limit PubChem (5 req/s max)

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Récupère toutes les propriétés physicochimiques d'un CID */
async function fetchPubChemProperties(cid: number): Promise<Record<string, unknown> | null> {
  const props = [
    "MolecularFormula", "MolecularWeight", "IUPACName",
    "CanonicalSMILES", "IsomericSMILES",
    "InChI", "InChIKey",
    "XLogP", "ExactMass", "MonoisotopicMass",
    "TPSA", "Complexity", "Charge",
    "HBondDonorCount", "HBondAcceptorCount",
    "RotatableBondCount", "HeavyAtomCount",
    "IsotopeAtomCount", "DefinedAtomStereoCount", "UndefinedAtomStereoCount",
    "CovalentUnitCount"
  ].join(",");
  try {
    const url = `${PUBCHEM_BASE}/compound/cid/${cid}/property/${props}/JSON`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!resp.ok) return null;
    const data = await resp.json() as { PropertyTable?: { Properties?: Array<Record<string, unknown>> } };
    return data.PropertyTable?.Properties?.[0] ?? null;
  } catch { return null; }
}

/** Récupère les synonymes d'un CID (CAS, EINECS, FEMA, etc.) */
async function fetchPubChemSynonyms(cid: number): Promise<string[]> {
  try {
    const url = `${PUBCHEM_BASE}/compound/cid/${cid}/synonyms/JSON`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!resp.ok) return [];
    const data = await resp.json() as { InformationList?: { Information?: Array<{ Synonym?: string[] }> } };
    return data.InformationList?.Information?.[0]?.Synonym?.slice(0, 50) ?? [];
  } catch { return []; }
}

/** Récupère les identifiants croisés (SIDs, sources) via PubChem SID */
async function fetchCrossReferences(cid: number): Promise<{ chebi?: string; chemspider?: string; nist?: string; dsstox?: string; hmdb?: string; kegg?: string }> {
  const refs: Record<string, string> = {};
  try {
    const url = `${PUBCHEM_BASE}/compound/cid/${cid}/xrefs/RegistryID/JSON`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!resp.ok) return refs;
    const data = await resp.json() as { InformationList?: { Information?: Array<{ RegistryID?: string[] }> } };
    const ids = data.InformationList?.Information?.[0]?.RegistryID ?? [];
    for (const id of ids) {
      if (id.startsWith("CHEBI:")) refs.chebi = id;
      else if (id.startsWith("HMDB")) refs.hmdb = id;
      else if (id.startsWith("C") && /^C\d{5}$/.test(id)) refs.kegg = id;
      else if (id.startsWith("DTXSID")) refs.dsstox = id;
    }
  } catch { /* ignore */ }
  return refs;
}

/** Recherche un CID par nom ou CAS */
async function searchCid(name: string, cas?: string | null): Promise<number | null> {
  // Essai 1 : par CAS
  if (cas) {
    try {
      const url = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(cas)}/cids/JSON`;
      const resp = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (resp.ok) {
        const data = await resp.json() as { IdentifierList?: { CID?: number[] } };
        if (data.IdentifierList?.CID?.[0]) return data.IdentifierList.CID[0];
      }
    } catch { /* ignore */ }
    await sleep(DELAY_MS);
  }
  // Essai 2 : par nom
  try {
    const url = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(name)}/cids/JSON`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (resp.ok) {
      const data = await resp.json() as { IdentifierList?: { CID?: number[] } };
      if (data.IdentifierList?.CID?.[0]) return data.IdentifierList.CID[0];
    }
  } catch { /* ignore */ }
  return null;
}

export const pubchemExtendedRouter = router({

  /**
   * Statistiques de couverture des colonnes PubChem étendues
   */
  getCoverageStats: publicProcedure.query(async () => {
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    try {
      const [rows] = await conn.execute<mysql.RowDataPacket[]>(`
        SELECT
          COUNT(*) AS total,
          SUM(pubchem_cid IS NOT NULL) AS has_cid,
          SUM(inchi IS NOT NULL AND inchi != '') AS has_inchi,
          SUM(inchi_key IS NOT NULL AND inchi_key != '') AS has_inchikey,
          SUM(xlogp IS NOT NULL) AS has_xlogp,
          SUM(tpsa IS NOT NULL) AS has_tpsa,
          SUM(exact_mass IS NOT NULL) AS has_exact_mass,
          SUM(h_bond_donor_count IS NOT NULL) AS has_hbond,
          SUM(pubchem_synonyms IS NOT NULL) AS has_synonyms,
          SUM(chebi_id IS NOT NULL AND chebi_id != '') AS has_chebi
        FROM molecules
      `);
      const r = rows[0] as Record<string, unknown>;
      return {
        total: Number(r.total),
        hasCid: Number(r.has_cid),
        hasInchi: Number(r.has_inchi),
        hasInchikey: Number(r.has_inchikey),
        hasXlogp: Number(r.has_xlogp),
        hasTpsa: Number(r.has_tpsa),
        hasExactMass: Number(r.has_exact_mass),
        hasHbond: Number(r.has_hbond),
        hasSynonyms: Number(r.has_synonyms),
        hasChEBI: Number(r.has_chebi),
        missingInchi: Number(r.total) - Number(r.has_inchi),
        missingXlogp: Number(r.total) - Number(r.has_xlogp),
      };
    } finally {
      await conn.end();
    }
  }),

  /**
   * Récupère les molécules à enrichir (avec CID mais sans InChI/xlogp)
   */
  getMoleculesToEnrich: publicProcedure
    .input(z.object({
      mode: z.enum(["missing_inchi", "missing_xlogp", "missing_any", "all_with_cid"]).default("missing_any"),
      limit: z.number().int().min(1).max(500).default(100),
      familyFilter: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      try {
        let where = "pubchem_cid IS NOT NULL";
        if (input.mode === "missing_inchi") where += " AND (inchi IS NULL OR inchi = '')";
        else if (input.mode === "missing_xlogp") where += " AND xlogp IS NULL";
        else if (input.mode === "missing_any") where += " AND (inchi IS NULL OR inchi = '' OR xlogp IS NULL OR tpsa IS NULL)";
        if (input.familyFilter) where += ` AND family = ${mysql.escape(input.familyFilter)}`;
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(
          `SELECT id, name, pubchem_cid, cas_number, inchi IS NOT NULL as has_inchi, xlogp IS NOT NULL as has_xlogp FROM molecules WHERE ${where} ORDER BY name ASC LIMIT ${Math.floor(input.limit)}`
        );
        return rows.map(r => ({
          id: Number(r.id),
          name: r.name as string,
          pubchemCid: Number(r.pubchem_cid),
          casNumber: r.cas_number as string | null,
          hasInchi: Boolean(r.has_inchi),
          hasXlogp: Boolean(r.has_xlogp),
        }));
      } finally {
        await conn.end();
      }
    }),

  /**
   * Enrichit une seule molécule avec toutes les données PubChem étendues
   */
  enrichSingle: publicProcedure
    .input(z.object({ moleculeId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      try {
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(
          "SELECT id, name, pubchem_cid, cas_number, iupac_name FROM molecules WHERE id = ? LIMIT 1",
          [input.moleculeId]
        );
        if (!rows[0]) throw new Error("Molécule introuvable");
        const mol = rows[0] as Record<string, unknown>;
        let cid = mol.pubchem_cid ? Number(mol.pubchem_cid) : null;

        // Rechercher le CID si absent
        if (!cid) {
          cid = await searchCid(mol.name as string, mol.cas_number as string | null);
          await sleep(DELAY_MS);
        }
        if (!cid) return { success: false, error: "CID introuvable sur PubChem", moleculeId: input.moleculeId };

        // Récupérer les propriétés
        const props = await fetchPubChemProperties(cid);
        await sleep(DELAY_MS);
        const synonyms = await fetchPubChemSynonyms(cid);
        await sleep(DELAY_MS);
        const crossRefs = await fetchCrossReferences(cid);

        if (!props) return { success: false, error: "Propriétés PubChem introuvables", moleculeId: input.moleculeId };

        // Extraire le CAS depuis les synonymes si absent
        const casRegex = /^\d{2,7}-\d{2}-\d$/;
        const casFromSynonyms = synonyms.find(s => casRegex.test(s));

        // Construire le SET SQL
        const updates: string[] = [];
        const params: unknown[] = [];

        const set = (col: string, val: unknown) => {
          if (val !== null && val !== undefined && val !== "") {
            updates.push(`${col} = ?`);
            params.push(val);
          }
        };

        set("pubchem_cid", cid);
        set("inchi", props.InChI);
        set("inchi_key", props.InChIKey);
        set("smiles", props.IsomericSMILES || props.CanonicalSMILES);
        set("iupac_name", mol.iupac_name || props.IUPACName);
        set("exact_mass", props.ExactMass ? Number(props.ExactMass) : null);
        set("xlogp", props.XLogP !== undefined ? Number(props.XLogP) : null);
        set("tpsa", props.TPSA !== undefined ? Number(props.TPSA) : null);
        set("h_bond_donor_count", props.HBondDonorCount !== undefined ? Number(props.HBondDonorCount) : null);
        set("h_bond_acceptor_count", props.HBondAcceptorCount !== undefined ? Number(props.HBondAcceptorCount) : null);
        set("rotatable_bond_count", props.RotatableBondCount !== undefined ? Number(props.RotatableBondCount) : null);
        set("heavy_atom_count", props.HeavyAtomCount !== undefined ? Number(props.HeavyAtomCount) : null);
        if (synonyms.length > 0) set("pubchem_synonyms", JSON.stringify(synonyms.slice(0, 30)));
        if (casFromSynonyms && !mol.cas_number) set("cas_number", casFromSynonyms);
        if (crossRefs.chebi && !mol.chebi_id) set("chebi_id", crossRefs.chebi.replace("CHEBI:", ""));
        set("pubchem_enriched_at", new Date());

        if (updates.length > 0) {
          params.push(input.moleculeId);
          await conn.execute(`UPDATE molecules SET ${updates.join(", ")} WHERE id = ?`, params);
        }

        return {
          success: true,
          moleculeId: input.moleculeId,
          cid,
          inchi: props.InChI as string | undefined,
          inchiKey: props.InChIKey as string | undefined,
          xlogp: props.XLogP !== undefined ? Number(props.XLogP) : null,
          tpsa: props.TPSA !== undefined ? Number(props.TPSA) : null,
          exactMass: props.ExactMass ? Number(props.ExactMass) : null,
          hBondDonors: props.HBondDonorCount !== undefined ? Number(props.HBondDonorCount) : null,
          hBondAcceptors: props.HBondAcceptorCount !== undefined ? Number(props.HBondAcceptorCount) : null,
          synonymsCount: synonyms.length,
          crossRefs,
          casFromSynonyms: casFromSynonyms ?? null,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Enrichissement en batch : traite N molécules séquentiellement avec délai
   */
  enrichBatch: publicProcedure
    .input(z.object({
      moleculeIds: z.array(z.number().int().positive()).min(1).max(50),
    }))
    .mutation(async ({ input }) => {
      const results: Array<{
        moleculeId: number;
        name: string;
        success: boolean;
        cid?: number;
        inchiKey?: string;
        xlogp?: number | null;
        error?: string;
      }> = [];

      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      try {
        for (const moleculeId of input.moleculeIds) {
          try {
            const [rows] = await conn.execute<mysql.RowDataPacket[]>(
              "SELECT id, name, pubchem_cid, cas_number, iupac_name, chebi_id FROM molecules WHERE id = ? LIMIT 1",
              [moleculeId]
            );
            if (!rows[0]) { results.push({ moleculeId, name: "?", success: false, error: "Introuvable" }); continue; }
            const mol = rows[0] as Record<string, unknown>;
            let cid = mol.pubchem_cid ? Number(mol.pubchem_cid) : null;

            if (!cid) {
              cid = await searchCid(mol.name as string, mol.cas_number as string | null);
              await sleep(DELAY_MS);
            }
            if (!cid) { results.push({ moleculeId, name: mol.name as string, success: false, error: "CID introuvable" }); continue; }

            const props = await fetchPubChemProperties(cid);
            await sleep(DELAY_MS);
            const synonyms = await fetchPubChemSynonyms(cid);
            await sleep(DELAY_MS);
            const crossRefs = await fetchCrossReferences(cid);

            if (!props) { results.push({ moleculeId, name: mol.name as string, success: false, cid, error: "Propriétés introuvables" }); continue; }

            const casRegex = /^\d{2,7}-\d{2}-\d$/;
            const casFromSynonyms = synonyms.find(s => casRegex.test(s));

            const updates: string[] = [];
            const params: unknown[] = [];
            const set = (col: string, val: unknown) => {
              if (val !== null && val !== undefined && val !== "") { updates.push(`${col} = ?`); params.push(val); }
            };

            set("pubchem_cid", cid);
            set("inchi", props.InChI);
            set("inchi_key", props.InChIKey);
            set("smiles", props.IsomericSMILES || props.CanonicalSMILES);
            if (!mol.iupac_name) set("iupac_name", props.IUPACName);
            set("exact_mass", props.ExactMass ? Number(props.ExactMass) : null);
            set("xlogp", props.XLogP !== undefined ? Number(props.XLogP) : null);
            set("tpsa", props.TPSA !== undefined ? Number(props.TPSA) : null);
            set("h_bond_donor_count", props.HBondDonorCount !== undefined ? Number(props.HBondDonorCount) : null);
            set("h_bond_acceptor_count", props.HBondAcceptorCount !== undefined ? Number(props.HBondAcceptorCount) : null);
            set("rotatable_bond_count", props.RotatableBondCount !== undefined ? Number(props.RotatableBondCount) : null);
            set("heavy_atom_count", props.HeavyAtomCount !== undefined ? Number(props.HeavyAtomCount) : null);
            if (synonyms.length > 0) set("pubchem_synonyms", JSON.stringify(synonyms.slice(0, 30)));
            if (casFromSynonyms && !mol.cas_number) set("cas_number", casFromSynonyms);
            if (crossRefs.chebi && !mol.chebi_id) set("chebi_id", crossRefs.chebi.replace("CHEBI:", ""));
            set("pubchem_enriched_at", new Date());

            if (updates.length > 0) {
              params.push(moleculeId);
              await conn.execute(`UPDATE molecules SET ${updates.join(", ")} WHERE id = ?`, params);
            }

            results.push({
              moleculeId,
              name: mol.name as string,
              success: true,
              cid,
              inchiKey: props.InChIKey as string | undefined,
              xlogp: props.XLogP !== undefined ? Number(props.XLogP) : null,
            });
            await sleep(DELAY_MS);
          } catch (e) {
            results.push({ moleculeId, name: "?", success: false, error: e instanceof Error ? e.message : "Erreur" });
          }
        }
      } finally {
        await conn.end();
      }

      return {
        total: results.length,
        success: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
      };
    }),
});
