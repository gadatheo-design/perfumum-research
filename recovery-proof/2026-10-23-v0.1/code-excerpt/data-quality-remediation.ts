import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, router } from "../_core/trpc";
import { getMysqlConnection } from "../db/mysqlPool";
import { plantMoleculeEvidenceLot1, withheldPlantMoleculeEvidenceLot1 } from "../data/plant-molecule-evidence-lot-1";

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

type MoleculeIdentityRecord = {
  id: number;
  name: string;
  cas_number: string;
  formula: string | null;
  inchi_key: string | null;
  pubchem_cid: string | null;
  wikidata_qid: string | null;
};

function normalized(value: unknown) {
  return String(value ?? "").trim();
}

function isValidCasNumber(value: string) {
  const match = value.match(/^(\d{2,7})-(\d{2})-(\d)$/);
  if (!match) return false;
  const digits = `${match[1]}${match[2]}`.split("").reverse();
  const checksum = digits.reduce((sum, digit, index) => sum + Number(digit) * (index + 1), 0) % 10;
  return checksum === Number(match[3]);
}

/**
 * Qualification strictement conservatrice : les synonymes de nom sont admis,
 * mais chaque identifiant structurel doit être présent et identique.
 */
export function qualifyHighConfidenceCas(records: MoleculeIdentityRecord[]) {
  const distinctValues = (field: keyof MoleculeIdentityRecord) => new Set(records.map((record) => normalized(record[field])).filter(Boolean));
  const casNumbers = distinctValues("cas_number");
  const inchiKeys = distinctValues("inchi_key");
  const pubchemCids = distinctValues("pubchem_cid");
  const formulas = distinctValues("formula");
  const wikidataQids = distinctValues("wikidata_qid");
  const allComplete = records.every((record) => [record.inchi_key, record.pubchem_cid, record.formula, record.wikidata_qid].every((value) => Boolean(normalized(value))));
  const casNumber = [...casNumbers][0] ?? "";
  const eligible = records.length > 1 && casNumbers.size === 1 && isValidCasNumber(casNumber) && allComplete
    && inchiKeys.size === 1 && pubchemCids.size === 1 && formulas.size === 1 && wikidataQids.size === 1;
  return {
    eligible,
    casNumber,
    criteria: {
      validCasChecksum: casNumbers.size === 1 && isValidCasNumber(casNumber),
      completeStructuralIdentifiers: allComplete,
      sameInchiKey: inchiKeys.size === 1,
      samePubchemCid: pubchemCids.size === 1,
      sameFormula: formulas.size === 1,
      sameWikidataQid: wikidataQids.size === 1,
    },
  };
}

/**
 * Niveau intermédiaire, réservé à la revue humaine : l'InChIKey est complet
 * et converge, au moins un second identifiant converge, et aucun identifiant
 * renseigné ne diverge. Les lacunes interdisent toute acceptation automatique.
 */
export function qualifyIntermediateConfidenceCas(records: MoleculeIdentityRecord[]) {
  const distinctValues = (field: keyof MoleculeIdentityRecord) => new Set(records.map((record) => normalized(record[field])).filter(Boolean));
  const completeAndSame = (field: keyof MoleculeIdentityRecord) => records.every((record) => Boolean(normalized(record[field]))) && distinctValues(field).size === 1;
  const casNumbers = distinctValues("cas_number");
  const casNumber = [...casNumbers][0] ?? "";
  const identifiers: Array<keyof MoleculeIdentityRecord> = ["inchi_key", "pubchem_cid", "formula", "wikidata_qid"];
  const conflicts = identifiers.filter((field) => distinctValues(field).size > 1);
  const missingFields = identifiers.filter((field) => !records.every((record) => Boolean(normalized(record[field]))));
  const sameInchiKey = completeAndSame("inchi_key");
  const corroborators = ["pubchem_cid", "formula", "wikidata_qid"]
    .filter((field) => completeAndSame(field as keyof MoleculeIdentityRecord));
  const highConfidence = qualifyHighConfidenceCas(records).eligible;
  const eligible = records.length > 1
    && casNumbers.size === 1
    && isValidCasNumber(casNumber)
    && sameInchiKey
    && corroborators.length >= 1
    && conflicts.length === 0
    && !highConfidence;
  return {
    eligible,
    casNumber,
    criteria: {
      validCasChecksum: casNumbers.size === 1 && isValidCasNumber(casNumber),
      sameInchiKey,
      corroborators,
      noConflictingPopulatedIdentifiers: conflicts.length === 0,
      missingFields,
      highConfidence,
    },
  };
}

async function listHighConfidenceCasCandidates(conn: any) {
  const [caseRows] = await conn.execute(
    `SELECT * FROM data_quality_remediation_cases
     WHERE case_type='cas_conflict' AND status IN ('open','reviewed')
     ORDER BY id`
  );
  const candidates: Array<{ qualityCase: any; records: MoleculeIdentityRecord[]; qualification: ReturnType<typeof qualifyHighConfidenceCas> }> = [];
  for (const qualityCase of caseRows as any[]) {
    const casNumber = String(qualityCase.group_key).replace(/^cas:/, "");
    const [records] = await conn.execute(
      `SELECT id, name, cas_number, formula, inchi_key, pubchem_cid, wikidata_qid
       FROM molecules WHERE cas_number=? ORDER BY id`,
      [casNumber]
    );
    const typedRecords = records as MoleculeIdentityRecord[];
    const qualification = qualifyHighConfidenceCas(typedRecords);
    if (qualification.eligible) candidates.push({ qualityCase, records: typedRecords, qualification });
  }
