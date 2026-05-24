/**
 * Extracted from server/db/misc.ts
 * Module: Research Studies
 */
import { db } from "../_core/db";
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

const { climateStudies, extractionTests, fieldArchives, molecularProtocols, rechercheRadicale } = schema;



// ====================================================================
// RECHERCHE RADICALE
// ====================================================================
// ============================================================================
// RECHERCHE RADICALE
// ============================================================================

export async function getAllRechercheRadicale() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(rechercheRadicale);
}

export async function getRechercheRadicaleById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(rechercheRadicale).where(eq(rechercheRadicale.id, id)).limit(1);
  return result[0] || null;
}

export async function getRechercheRadicaleBySerie(serie: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(rechercheRadicale).where(eq(rechercheRadicale.serie, serie));
}



// ====================================================================
// CLIMATE STUDIES (Études climatiques)
// ====================================================================
// ============================================================================
// CLIMATE STUDIES (Études climatiques)
// ============================================================================

export async function getAllClimateStudies() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(climateStudies);
}

export async function getClimateStudyById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(climateStudies).where(eq(climateStudies.id, id));
  return results[0] || null;
}


// ====================================================================
// MOLECULAR PROTOCOLS (Protocoles moléculaires)
// ====================================================================
// ============================================================================
// MOLECULAR PROTOCOLS (Protocoles moléculaires)
// ============================================================================

export async function getAllMolecularProtocols() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(molecularProtocols);
}

export async function getMolecularProtocolById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(molecularProtocols).where(eq(molecularProtocols.id, id));
  return results[0] || null;
}

export async function getMolecularProtocolsByStudyId(studyId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(molecularProtocols).where(eq(molecularProtocols.linkedStudyId, studyId));
}


// ====================================================================
// FIELD ARCHIVES (Archives terrain)
// ====================================================================
// ============================================================================
// FIELD ARCHIVES (Archives terrain)
// ============================================================================

export async function getAllFieldArchives() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(fieldArchives);
}

export async function getFieldArchiveById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(fieldArchives).where(eq(fieldArchives.id, id));
  return results[0] || null;
}


// ====================================================================
// EXTRACTION TESTS (Tests d'extraction)
// ====================================================================
// ============================================================================
// EXTRACTION TESTS (Tests d'extraction)
// ============================================================================

export async function getAllExtractionTests() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(extractionTests);
}

export async function getExtractionTestById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(extractionTests).where(eq(extractionTests.id, id));
  return results[0] || null;
}

export async function getExtractionTestsByArchiveId(archiveId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(extractionTests).where(eq(extractionTests.fieldArchiveId, archiveId));
}


