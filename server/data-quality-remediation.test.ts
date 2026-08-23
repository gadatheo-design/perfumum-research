import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getMysqlConnection } from "./db/mysqlPool";
import { qualifyHighConfidenceCas } from "./routers/data-quality-remediation";

function createContext(role: "admin" | null): TrpcContext {
  return {
    user: role ? { id: 1, openId: "quality-remediation-test", name: "Revue qualité", role } as TrpcContext["user"] : null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {}, cookie: () => {} } as TrpcContext["res"],
  };
}

async function productionCounts() {
  const conn = await getMysqlConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT
        (SELECT COUNT(*) FROM molecules) AS molecules,
        (SELECT COUNT(*) FROM plants) AS plants,
        (SELECT COUNT(*) FROM bibliography_entries) AS bibliography,
        (SELECT COUNT(*) FROM plant_molecules) AS plant_molecules`
    );
    return (rows as any[])[0];
  } finally {
    await conn.end();
  }
}

describe("file de remédiation de qualité", () => {
  it("réserve le scan et la lecture des cas aux administrateurs", async () => {
    const anonymous = appRouter.createCaller(createContext(null));
    await expect(anonymous.dataQualityRemediation.getDashboard()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(anonymous.dataQualityRemediation.scan()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("produit une file idempotente sans altérer les données scientifiques de production", async () => {
    const admin = appRouter.createCaller(createContext("admin"));
    const before = await productionCounts();
    const first = await admin.dataQualityRemediation.scan();
    const afterFirst = await productionCounts();
    const second = await admin.dataQualityRemediation.scan();
    const afterSecond = await productionCounts();
    const dashboard = await admin.dataQualityRemediation.getDashboard();
    const cases = await admin.dataQualityRemediation.listCases({ status: "open", limit: 500 });

    expect(first.cas_conflict).toBeGreaterThan(0);
    expect(first.olfactive_profile).toBeGreaterThan(0);
    expect(first.plant_molecule).toBeGreaterThan(0);
    expect(first.bibliography_metadata).toBe(1);
    expect(second).toEqual(first);
    expect(afterFirst).toEqual(before);
    expect(afterSecond).toEqual(before);
    expect(cases.length).toBeGreaterThan(0);
    expect(new Set(cases.map((item: any) => `${item.case_type}:${item.group_key}`)).size).toBe(cases.length);
    expect(dashboard.cases.reduce((total, item) => total + item.count, 0)).toBeGreaterThanOrEqual(cases.length);
  });

  it("expose les preuves chimiques d’un conflit CAS sans modifier les molécules", async () => {
    const admin = appRouter.createCaller(createContext("admin"));
    const [casCase] = await admin.dataQualityRemediation.listCases({ caseType: "cas_conflict", limit: 1 });
    const before = await productionCounts();
    const details = await admin.dataQualityRemediation.getCaseDetails({ caseId: casCase.id });
    const after = await productionCounts();

    expect(details.comparison).toMatchObject({ casNumber: casCase.group_key.replace("cas:", "") });
    expect(details.records.length).toBeGreaterThan(1);
    expect(details.records[0]).toHaveProperty("inchi_key");
    expect(after).toEqual(before);
  });

  it("réserve la confirmation aux groupes dont les identifiants structurels sont tous convergents", () => {
    const certain = qualifyHighConfidenceCas([
      { id: 1, name: "Synonyme A", cas_number: "7732-18-5", formula: "H2O", inchi_key: "XLYOFNOQVPJJNP-UHFFFAOYSA-N", pubchem_cid: "962", wikidata_qid: "Q283" },
      { id: 2, name: "Synonyme B", cas_number: "7732-18-5", formula: "H2O", inchi_key: "XLYOFNOQVPJJNP-UHFFFAOYSA-N", pubchem_cid: "962", wikidata_qid: "Q283" },
    ]);
    const divergent = qualifyHighConfidenceCas([
      { id: 1, name: "A", cas_number: "7732-18-5", formula: "H2O", inchi_key: "XLYOFNOQVPJJNP-UHFFFAOYSA-N", pubchem_cid: "962", wikidata_qid: "Q283" },
      { id: 2, name: "B", cas_number: "7732-18-5", formula: "H2O", inchi_key: "DIFFERENT", pubchem_cid: "962", wikidata_qid: "Q283" },
    ]);

    expect(certain.eligible).toBe(true);
    expect(divergent.eligible).toBe(false);
  });

  it("journalise une décision humaine sans appliquer de correction aux entités scientifiques", async () => {
    const admin = appRouter.createCaller(createContext("admin"));
    const conn = await getMysqlConnection();
    const testKey = `test:human-review:${Date.now()}`;
    let caseId: number | null = null;
    try {
      const [inserted] = await conn.execute(
        `INSERT INTO data_quality_remediation_cases
          (case_type, entity_type, group_key, severity, status, title)
         VALUES ('bibliography_metadata', 'test', ?, 'low', 'open', 'Cas de test isolé')`,
        [testKey]
      );
      caseId = Number((inserted as any).insertId);
    } finally {
      await conn.end();
    }
    const before = await productionCounts();
    try {
      await admin.dataQualityRemediation.decideCase({
        caseId: caseId!,
        decision: "reviewed",
        rationale: "Revue de test : aucune correction scientifique appliquée.",
      });
      const actions = await admin.dataQualityRemediation.listActions({ caseId: caseId! });
      const after = await productionCounts();

      expect(actions[0]).toMatchObject({ case_id: caseId, decision: "reviewed", action_type: "human_review" });
      expect(after).toEqual(before);
    } finally {
      const cleanup = await getMysqlConnection();
      try {
        await cleanup.execute("DELETE FROM data_quality_remediation_actions WHERE case_id=?", [caseId]);
        await cleanup.execute("DELETE FROM data_quality_remediation_cases WHERE id=?", [caseId]);
      } finally {
        await cleanup.end();
      }
    }
  });
});
