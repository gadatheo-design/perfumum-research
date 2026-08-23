import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { getMysqlConnection } from "../db/mysqlPool";

const caseStatus = z.enum(["open", "reviewed", "accepted", "rejected"]);
const caseType = z.enum([
  "cas_conflict",
  "descriptor_orphan",
  "terroir_orphan",
  "olfactive_profile",
  "plant_molecule",
  "bibliography_duplicate",
  "bibliography_metadata",
]);

type CaseSeed = {
  caseType: z.infer<typeof caseType>;
  entityType: string;
  entityId?: number | null;
  groupKey: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  currentValue?: string | null;
  proposedValue?: string | null;
  evidence?: string | null;
};

function json(value: unknown) {
  return JSON.stringify(value);
}

async function upsertCase(conn: any, item: CaseSeed) {
  await conn.execute(
    `INSERT INTO data_quality_remediation_cases
      (case_type, entity_type, entity_id, group_key, severity, status, title, current_value, proposed_value, evidence)
     VALUES (?, ?, ?, ?, ?, 'open', ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       severity = VALUES(severity), title = VALUES(title), current_value = VALUES(current_value),
       proposed_value = VALUES(proposed_value), evidence = VALUES(evidence), updated_at = CURRENT_TIMESTAMP`,
    [
      item.caseType,
      item.entityType,
      item.entityId ?? null,
      item.groupKey,
      item.severity,
      item.title,
      item.currentValue ?? null,
      item.proposedValue ?? null,
      item.evidence ?? null,
    ]
  );
}

export const dataQualityRemediationRouter = router({
  getDashboard: adminProcedure.query(async () => {
    const conn = await getMysqlConnection();
    try {
      const [rows] = await conn.execute(
        `SELECT case_type AS caseType, status, COUNT(*) AS count
         FROM data_quality_remediation_cases
         GROUP BY case_type, status
         ORDER BY case_type, status`
      );
      const [actions] = await conn.execute(
        `SELECT COUNT(*) AS count FROM data_quality_remediation_actions`
      );
      return {
        cases: (rows as any[]).map((row) => ({ ...row, count: Number(row.count) })),
        actionCount: Number((actions as any[])?.[0]?.count ?? 0),
      };
    } finally {
      await conn.end();
    }
  }),

  scan: adminProcedure.mutation(async () => {
    const conn = await getMysqlConnection();
    const summary: Record<string, number> = {};
    try {
      const [casRows] = await conn.execute(
        `SELECT cas_number, COUNT(*) AS count,
          GROUP_CONCAT(CONCAT(id, ':', name, ':', COALESCE(inchi_key,'')) ORDER BY id SEPARATOR ' | ') AS records
         FROM molecules
         WHERE cas_number IS NOT NULL AND TRIM(cas_number) <> ''
         GROUP BY cas_number HAVING COUNT(*) > 1
         ORDER BY count DESC`
      );
      for (const row of casRows as any[]) {
        await upsertCase(conn, {
          caseType: "cas_conflict", entityType: "molecule", groupKey: `cas:${row.cas_number}`,
          severity: Number(row.count) > 2 ? "high" : "medium",
          title: `Conflit CAS ${row.cas_number} (${row.count} enregistrements)`,
          currentValue: row.records,
          proposedValue: "Comparer InChIKey, PubChem CID et stéréochimie avant toute fusion.",
          evidence: json({ cas: row.cas_number, count: Number(row.count) }),
        });
      }
      summary.cas_conflict = (casRows as any[]).length;

      const [descriptorRows] = await conn.execute(
        `SELECT 'plant' AS link_type, dpl.id, dpl.descriptor_id, dpl.descriptor_name, dpl.plant_id AS target_id, dpl.latin_name AS target_name
         FROM descriptor_plant_links dpl LEFT JOIN plants p ON p.id=dpl.plant_id WHERE p.id IS NULL
         UNION ALL
         SELECT 'molecule', dml.id, dml.descriptor_id, dml.descriptor_name, dml.molecule_id, dml.molecule_name
         FROM descriptor_molecule_links dml LEFT JOIN molecules m ON m.id=dml.molecule_id WHERE m.id IS NULL`
      );
      for (const row of descriptorRows as any[]) {
        await upsertCase(conn, {
          caseType: "descriptor_orphan", entityType: row.link_type, entityId: Number(row.id),
          groupKey: `descriptor-link:${row.link_type}:${row.id}`, severity: "high",
          title: `Lien descripteur orphelin : ${row.descriptor_name ?? row.descriptor_id}`,
          currentValue: `${row.target_name ?? "cible archivée"} (ID ${row.target_id})`,
          proposedValue: "Utiliser la réassociation guidée ; ne pas supprimer sans revue.",
          evidence: json(row),
        });
      }
      summary.descriptor_orphan = (descriptorRows as any[]).length;

      const [terroirRows] = await conn.execute(
        `SELECT pt.id, pt.plant_id, pt.terroir_id, pt.local_name,
          p.id AS existing_plant_id, t.id AS existing_terroir_id
         FROM plant_terroirs pt
         LEFT JOIN plants p ON p.id=pt.plant_id
         LEFT JOIN terroirs t ON t.id=pt.terroir_id
         WHERE p.id IS NULL OR t.id IS NULL`
      );
      for (const row of terroirRows as any[]) {
        await upsertCase(conn, {
          caseType: "terroir_orphan", entityType: "plant_terroir", entityId: Number(row.id),
          groupKey: `plant-terroir:${row.id}`, severity: "high",
          title: `Lien plante–terroir orphelin (${row.local_name ?? `ligne ${row.id}`})`,
          currentValue: `Plante ${row.plant_id}, terroir ${row.terroir_id}`,
          proposedValue: "Vérifier le terroir et la plante avant réassociation ou archivage.",
          evidence: json(row),
        });
      }
      summary.terroir_orphan = (terroirRows as any[]).length;

      const [profileRows] = await conn.execute(
        `SELECT id, name, flavornet_percepts
         FROM molecules
         WHERE (olfactiveProfile IS NULL OR TRIM(olfactiveProfile)='')
           AND flavornet_percepts IS NOT NULL AND TRIM(flavornet_percepts)<>''
         ORDER BY id LIMIT 300`
      );
      for (const row of profileRows as any[]) {
        await upsertCase(conn, {
          caseType: "olfactive_profile", entityType: "molecule", entityId: Number(row.id),
          groupKey: `olfactive-profile:${row.id}`, severity: "medium",
          title: `Profil olfactif à revoir : ${row.name}`,
          currentValue: "Profil PERFUMUM absent",
          proposedValue: String(row.flavornet_percepts),
          evidence: json({ source: "Flavornet existant", moleculeId: row.id }),
        });
      }
      summary.olfactive_profile = (profileRows as any[]).length;

      const [plantRows] = await conn.execute(
        `SELECT p.id, p.name, p.latin_name, p.dominant_molecules
         FROM plants p
         WHERE (p.dominant_molecules IS NOT NULL AND TRIM(p.dominant_molecules) <> '')
           AND NOT EXISTS (SELECT 1 FROM plant_molecules pm WHERE pm.plant_id=p.id)
           AND NOT EXISTS (SELECT 1 FROM molecule_plant_sources mps WHERE mps.plant_id=p.id)
         ORDER BY p.id LIMIT 300`
      );
      for (const row of plantRows as any[]) {
        await upsertCase(conn, {
          caseType: "plant_molecule", entityType: "plant", entityId: Number(row.id),
          groupKey: `plant-molecule:${row.id}`, severity: "medium",
          title: `Relation plante–molécule à documenter : ${row.name}`,
          currentValue: "Aucun lien structuré plante–molécule",
          proposedValue: String(row.dominant_molecules),
          evidence: json({ latinName: row.latin_name, source: "champ dominant_molecules existant" }),
        });
      }
      summary.plant_molecule = (plantRows as any[]).length;

      const [doiRows] = await conn.execute(
        `SELECT LOWER(TRIM(doi)) AS doi_key, COUNT(*) AS count,
          GROUP_CONCAT(CONCAT(id, ':', title) ORDER BY id SEPARATOR ' | ') AS records
         FROM bibliography_entries
         WHERE doi IS NOT NULL AND TRIM(doi)<>''
         GROUP BY LOWER(TRIM(doi)) HAVING COUNT(*) > 1
         ORDER BY count DESC`
      );
      for (const row of doiRows as any[]) {
        await upsertCase(conn, {
          caseType: "bibliography_duplicate", entityType: "bibliography", groupKey: `doi:${row.doi_key}`,
          severity: "medium", title: `DOI en doublon : ${row.doi_key} (${row.count} références)`,
          currentValue: row.records,
          proposedValue: "Comparer les métadonnées, conserver une notice principale et journaliser les alias.",
          evidence: json({ doi: row.doi_key, count: Number(row.count) }),
        });
      }
      summary.bibliography_duplicate = (doiRows as any[]).length;

      await upsertCase(conn, {
        caseType: "bibliography_metadata", entityType: "bibliography", groupKey: "bibliography:missing-metadata",
        severity: "medium", title: "Métadonnées bibliographiques incomplètes",
        currentValue: "DOI, auteurs, années, résumés et mots-clés sont partiellement absents.",
        proposedValue: "Normaliser puis enrichir par lot avec prévisualisation et conserver les sources anciennes sans DOI.",
        evidence: json({ auditedAt: new Date().toISOString() }),
      });
      summary.bibliography_metadata = 1;
      return summary;
    } finally {
      await conn.end();
    }
  }),

  listCases: adminProcedure.input(z.object({
    status: caseStatus.optional(), caseType: caseType.optional(), limit: z.number().int().min(1).max(500).default(150),
  }).optional()).query(async ({ input }) => {
    const conn = await getMysqlConnection();
    try {
      const clauses: string[] = [];
      const values: any[] = [];
      if (input?.status) { clauses.push("status = ?"); values.push(input.status); }
      if (input?.caseType) { clauses.push("case_type = ?"); values.push(input.caseType); }
      const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
      const safeLimit = input?.limit ?? 150;
      const [rows] = await conn.execute(
        `SELECT * FROM data_quality_remediation_cases ${where} ORDER BY FIELD(severity,'critical','high','medium','low'), updated_at DESC LIMIT ${safeLimit}`,
        values
      );
      return rows as any[];
    } finally {
      await conn.end();
    }
  }),

  decideCase: adminProcedure.input(z.object({
    caseId: z.number().int().positive(), decision: caseStatus.exclude(["open"]), rationale: z.string().max(4000).optional(),
  })).mutation(async ({ ctx, input }) => {
    const conn = await getMysqlConnection();
    try {
      const [caseRows] = await conn.execute("SELECT * FROM data_quality_remediation_cases WHERE id=?", [input.caseId]);
      const qualityCase = (caseRows as any[])[0];
      if (!qualityCase) throw new TRPCError({ code: "NOT_FOUND", message: "Cas de remédiation introuvable" });
      await conn.execute("UPDATE data_quality_remediation_cases SET status=? WHERE id=?", [input.decision, input.caseId]);
      await conn.execute(
        `INSERT INTO data_quality_remediation_actions (case_id, action_type, decision, rationale, snapshot, actor_user_id, actor_name)
         VALUES (?, 'human_review', ?, ?, ?, ?, ?)`,
        [input.caseId, input.decision, input.rationale ?? null, json(qualityCase), ctx.user.id, ctx.user.name ?? null]
      );
      return { success: true };
    } finally {
      await conn.end();
    }
  }),

  listActions: adminProcedure.input(z.object({ caseId: z.number().int().positive().optional() }).optional()).query(async ({ input }) => {
    const conn = await getMysqlConnection();
    try {
      const [rows] = await conn.execute(
        input?.caseId
          ? `SELECT * FROM data_quality_remediation_actions WHERE case_id=? ORDER BY created_at DESC, id DESC`
          : `SELECT * FROM data_quality_remediation_actions ORDER BY created_at DESC, id DESC LIMIT 100`,
        input?.caseId ? [input.caseId] : []
      );
      return rows as any[];
    } finally {
      await conn.end();
    }
  }),
});
