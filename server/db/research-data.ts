/**
 * Extracted from server/db/misc.ts
 * Module: Research Data
 */
import { db } from "../_core/db";
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

const { analyticalMethods, moleculeAnalyticalMethods, researchInstitutions, researchPublications, researchers } = schema;



// ====================================================================
// RESEARCH DATA (Publications, Méthodes analytiques, Chercheurs, Institutions)
// ====================================================================
// ============================================================================
// RESEARCH DATA (Publications, Méthodes analytiques, Chercheurs, Institutions)
// ============================================================================


// --- Research Publications ---

export async function getAllResearchPublications() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchPublications).orderBy(desc(researchPublications.year));
}

export async function getResearchPublicationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(researchPublications).where(eq(researchPublications.id, id));
  return result[0] || null;
}

export async function getResearchPublicationByRefCode(refCode: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(researchPublications).where(eq(researchPublications.refCode, refCode));
  return result[0] || null;
}

export async function getResearchPublicationsByFocus(focus: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchPublications)
    .where(sql`${researchPublications.researchFocus} = ${focus}`)
    .orderBy(desc(researchPublications.citations));
}

export async function getResearchPublicationsBySubject(subject: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchPublications)
    .where(sql`${researchPublications.subjectMatter} = ${subject}`)
    .orderBy(desc(researchPublications.citations));
}

export async function searchResearchPublications(query: string) {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return await db.select().from(researchPublications)
    .where(or(
      like(researchPublications.title, searchTerm),
      like(researchPublications.authors, searchTerm),
      like(researchPublications.keyFindings, searchTerm)
    ))
    .orderBy(desc(researchPublications.citations));
}

// --- Analytical Methods ---

export async function getAllAnalyticalMethods() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(analyticalMethods).orderBy(desc(analyticalMethods.performanceScore));
}

export async function getAnalyticalMethodById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(analyticalMethods).where(eq(analyticalMethods.id, id));
  return result[0] || null;
}

export async function getAnalyticalMethodByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(analyticalMethods).where(eq(analyticalMethods.id, Number(code)));
  return result[0] || null;
}

export async function getAnalyticalMethodsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(analyticalMethods)
    .where(sql`${analyticalMethods.category} = ${category}`)
    .orderBy(desc(analyticalMethods.performanceScore));
}

export async function searchAnalyticalMethods(query: string) {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return await db.select().from(analyticalMethods)
    .where(
      or(
        like(analyticalMethods.name, searchTerm),
        like(analyticalMethods.code, searchTerm),
        like(analyticalMethods.fullName, searchTerm),
        like(analyticalMethods.description, searchTerm)
      )
    )
    .orderBy(desc(analyticalMethods.performanceScore));
}

// Get analytical methods used for a specific molecule
export async function getAnalyticalMethodsByMoleculeId(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select({
    id: analyticalMethods.id,
    code: analyticalMethods.code,
    name: analyticalMethods.name,
    fullName: analyticalMethods.fullName,
    category: analyticalMethods.category,
    description: analyticalMethods.description,
    performanceScore: analyticalMethods.performanceScore,
    resolutionScore: analyticalMethods.resolutionScore,
    sensitivityScore: analyticalMethods.sensitivityScore,
    detectionLimit: analyticalMethods.detectionLimit,
    // Liaison details
    isPrimary: moleculeAnalyticalMethods.isPrimary,
    analysisDetectionLimit: moleculeAnalyticalMethods.detectionLimit,
    detectionUnit: moleculeAnalyticalMethods.detectionUnit,
    accuracy: moleculeAnalyticalMethods.accuracy,
    analysisDate: moleculeAnalyticalMethods.analysisDate,
    laboratoryName: moleculeAnalyticalMethods.laboratoryName,
    liaisonNotes: moleculeAnalyticalMethods.notes,
  })
  .from(moleculeAnalyticalMethods)
  .innerJoin(analyticalMethods, eq(moleculeAnalyticalMethods.methodId, analyticalMethods.id))
  .where(eq(moleculeAnalyticalMethods.moleculeId, moleculeId))
  .orderBy(desc(moleculeAnalyticalMethods.isPrimary), desc(analyticalMethods.performanceScore));
}

// --- Researchers ---

export async function getAllResearchers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchers).orderBy(desc(researchers.totalCitations));
}

export async function getResearcherById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(researchers).where(eq(researchers.id, id));
  return result[0] || null;
}

export async function getResearchersByStatus(status: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchers)
    .where(sql`${researchers.status} = ${status}`)
    .orderBy(desc(researchers.totalCitations));
}

export async function searchResearchers(query: string) {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return await db.select().from(researchers)
    .where(or(
      like(researchers.name, searchTerm),
      like(researchers.bio, searchTerm)
    ))
    .orderBy(desc(researchers.totalCitations));
}

// --- Research Institutions ---

export async function getAllResearchInstitutions() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchInstitutions).orderBy(desc(researchInstitutions.totalCitations));
}

export async function getResearchInstitutionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(researchInstitutions).where(eq(researchInstitutions.id, id));
  return result[0] || null;
}

export async function getResearchInstitutionsByCountry(country: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchInstitutions)
    .where(eq(researchInstitutions.country, country))
    .orderBy(desc(researchInstitutions.totalCitations));
}

export async function getResearchInstitutionsByType(type: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchInstitutions)
    .where(sql`${researchInstitutions.institutionType} = ${type}`)
    .orderBy(desc(researchInstitutions.totalCitations));
}

// --- Research Statistics ---

export async function getResearchStatistics() {
  const db = await getDb();
  if (!db) return null;
  
  const publications = await db.select({ count: sql<number>`COUNT(*)` }).from(researchPublications);
  const methods = await db.select({ count: sql<number>`COUNT(*)` }).from(analyticalMethods);
  const researcherCount = await db.select({ count: sql<number>`COUNT(*)` }).from(researchers);
  const institutions = await db.select({ count: sql<number>`COUNT(*)` }).from(researchInstitutions);
  
  const totalCitations = await db.select({ 
    total: sql<number>`COALESCE(SUM(citations), 0)` 
  }).from(researchPublications);
  
  const cannabisPublications = await db.select({ count: sql<number>`COUNT(*)` })
    .from(researchPublications)
    .where(or(
      eq(researchPublications.subjectMatter, 'cannabis'),
      eq(researchPublications.subjectMatter, 'both')
    ));
  
  const tobaccoPublications = await db.select({ count: sql<number>`COUNT(*)` })
    .from(researchPublications)
    .where(or(
      eq(researchPublications.subjectMatter, 'tobacco'),
      eq(researchPublications.subjectMatter, 'both')
    ));
  
  return {
    publicationCount: publications[0]?.count || 0,
    methodCount: methods[0]?.count || 0,
    researcherCount: researcherCount[0]?.count || 0,
    institutionCount: institutions[0]?.count || 0,
    totalCitations: totalCitations[0]?.total || 0,
    cannabisPublications: cannabisPublications[0]?.count || 0,
    tobaccoPublications: tobaccoPublications[0]?.count || 0
  };
}

// --- Publications by Year ---

export async function getPublicationsByYear() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    year: researchPublications.year,
    count: sql<number>`COUNT(*)`,
    totalCitations: sql<number>`COALESCE(SUM(citations), 0)`
  })
  .from(researchPublications)
  .groupBy(researchPublications.year)
  .orderBy(researchPublications.year);
  
  return result;
}

// --- Top Cited Publications ---

export async function getTopCitedPublications(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchPublications)
    .orderBy(desc(researchPublications.citations))
    .limit(limit);
}

// --- Methods Performance Comparison ---

export async function getMethodsPerformanceComparison() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select({
    id: analyticalMethods.id,
    code: analyticalMethods.id,
    name: analyticalMethods.name,
    category: analyticalMethods.category,
    performanceScore: analyticalMethods.performanceScore,
    resolutionScore: analyticalMethods.resolutionScore,
    sensitivityScore: analyticalMethods.sensitivityScore,
    detectionLimit: analyticalMethods.detectionLimit,
    publicationCount: analyticalMethods.publicationCount
  })
  .from(analyticalMethods)
  .orderBy(desc(analyticalMethods.performanceScore));
}


