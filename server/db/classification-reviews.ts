/**
 * Extracted from server/db/misc.ts
 * Module: Classification Reviews
 */
import { db } from "../_core/db";
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

const { classificationReviews, molecules } = schema;



// ====================================================================
// CLASSIFICATION REVIEWS (Low Confidence Review Queue)
// ====================================================================
// ============================================================================
// CLASSIFICATION REVIEWS (Low Confidence Review Queue)
// ============================================================================


/**
 * Créer une nouvelle révision de classification
 */
export async function createClassificationReview(data: InsertClassificationReview): Promise<ClassificationReview | null> {
  const db = await getDb();
  if (!db) return null;

  // Vérifier si une révision existe déjà pour cette molécule en attente
  const existing = await db.select().from(classificationReviews)
    .where(and(
      eq(classificationReviews.moleculeId, data.moleculeId),
      eq(classificationReviews.status, 'pending')
    ))
    .limit(1);

  if (existing.length > 0) {
    // Mettre à jour la révision existante
    await db.update(classificationReviews)
      .set({
        aiChemicalClass: data.aiChemicalClass,
        aiChemicalClassConfidence: data.aiChemicalClassConfidence,
        aiChemicalClassReasoning: data.aiChemicalClassReasoning,
        aiOlfactiveFamily: data.aiOlfactiveFamily,
        aiOlfactiveFamilyConfidence: data.aiOlfactiveFamilyConfidence,
        aiOlfactiveFamilyReasoning: data.aiOlfactiveFamilyReasoning,
        aiSuggestedOlfactiveProfile: data.aiSuggestedOlfactiveProfile,
        aiBotanicalContextUsed: data.aiBotanicalContextUsed,
        priority: data.priority,
      })
      .where(eq(classificationReviews.id, existing[0].id));
    
    const [updated] = await db.select().from(classificationReviews)
      .where(eq(classificationReviews.id, existing[0].id));
    return updated || null;
  }

  const [result] = await db.insert(classificationReviews).values(data);
  const [review] = await db.select().from(classificationReviews)
    .where(eq(classificationReviews.id, result.insertId));
  return review || null;
}

/**
 * Récupérer les révisions en attente
 */
export async function getPendingReviews(options: {
  limit?: number;
  offset?: number;
  priority?: 'low' | 'medium' | 'high';
  maxConfidence?: number;
} = {}) {
  const db = await getDb();
  if (!db) return { reviews: [], total: 0 };

  const { limit = 50, offset = 0, priority, maxConfidence } = options;

  let allReviews = await db.select({
    review: classificationReviews,
    molecule: molecules,
  })
    .from(classificationReviews)
    .leftJoin(molecules, eq(classificationReviews.moleculeId, molecules.id))
    .where(eq(classificationReviews.status, 'pending'))
    .orderBy(
      desc(sql`CASE WHEN ${classificationReviews.priority} = 'high' THEN 3 WHEN ${classificationReviews.priority} = 'medium' THEN 2 ELSE 1 END`),
      classificationReviews.aiChemicalClassConfidence
    );

  // Filtrer par priorité
  if (priority) {
    allReviews = allReviews.filter(r => r.review.priority === priority);
  }

  // Filtrer par confiance max
  if (maxConfidence !== undefined) {
    allReviews = allReviews.filter(r => (r.review.aiChemicalClassConfidence || 0) <= maxConfidence);
  }

  const total = allReviews.length;
  const paginatedReviews = allReviews.slice(offset, offset + limit);

  return {
    reviews: paginatedReviews,
    total,
  };
}

/**
 * Récupérer les statistiques des révisions
 */
export async function getReviewStats() {
  const db = await getDb();
  if (!db) return {
    pending: 0,
    approved: 0,
    rejected: 0,
    modified: 0,
    skipped: 0,
    total: 0,
    byPriority: { low: 0, medium: 0, high: 0 },
    avgConfidence: 0,
    lowConfidenceCount: 0,
  };

  const allReviews = await db.select().from(classificationReviews);

  const pending = allReviews.filter(r => r.status === 'pending').length;
  const approved = allReviews.filter(r => r.status === 'approved').length;
  const rejected = allReviews.filter(r => r.status === 'rejected').length;
  const modified = allReviews.filter(r => r.status === 'modified').length;
  const skipped = allReviews.filter(r => r.status === 'skipped').length;

  const pendingReviews = allReviews.filter(r => r.status === 'pending');
  const byPriority = {
    low: pendingReviews.filter(r => r.priority === 'low').length,
    medium: pendingReviews.filter(r => r.priority === 'medium').length,
    high: pendingReviews.filter(r => r.priority === 'high').length,
  };

  const confidences = pendingReviews
    .map(r => r.aiChemicalClassConfidence)
    .filter((c): c is number => c !== null);
  const avgConfidence = confidences.length > 0 
    ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
    : 0;

  const lowConfidenceCount = pendingReviews.filter(r => (r.aiChemicalClassConfidence || 0) < 50).length;

  return {
    pending,
    approved,
    rejected,
    modified,
    skipped,
    total: allReviews.length,
    byPriority,
    avgConfidence,
    lowConfidenceCount,
  };
}

/**
 * Approuver une révision et appliquer la classification
 */
export async function approveReview(reviewId: number, userId?: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const [review] = await db.select().from(classificationReviews)
    .where(eq(classificationReviews.id, reviewId));

  if (!review || review.status !== 'pending') return false;

  // Appliquer la classification à la molécule
  const updateData: Record<string, unknown> = {};
  if (review.aiChemicalClass) updateData.chemicalClass = review.aiChemicalClass;
  if (review.aiOlfactiveFamily) updateData.family = review.aiOlfactiveFamily;
  if (review.aiSuggestedOlfactiveProfile) {
    updateData.olfactiveProfile = review.aiSuggestedOlfactiveProfile;
    // Synchroniser avec la colonne JSON standardisée
    try {
      const parsed = JSON.parse(review.aiSuggestedOlfactiveProfile);
      updateData.olfactiveProfileJson = Array.isArray(parsed)
        ? JSON.stringify(parsed)
        : JSON.stringify([String(parsed)]);
    } catch {
      const arr = review.aiSuggestedOlfactiveProfile.split(',').map((s: string) => s.trim()).filter(Boolean);
      updateData.olfactiveProfileJson = JSON.stringify(arr);
    }
  }

  if (Object.keys(updateData).length > 0) {
    await db.update(molecules).set(updateData).where(eq(molecules.id, review.moleculeId));
  }

  // Marquer la révision comme approuvée
  await db.update(classificationReviews)
    .set({
      status: 'approved',
      reviewedAt: new Date(),
      reviewedBy: userId,
    })
    .where(eq(classificationReviews.id, reviewId));

  return true;
}

/**
 * Rejeter une révision
 */
export async function rejectReview(reviewId: number, userId?: number, notes?: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.update(classificationReviews)
    .set({
      status: 'rejected',
      reviewedAt: new Date(),
      reviewedBy: userId,
      reviewNotes: notes,
    })
    .where(eq(classificationReviews.id, reviewId));

  return true;
}

/**
 * Modifier et appliquer une révision avec des valeurs manuelles
 */
export async function modifyAndApplyReview(
  reviewId: number, 
  modifications: {
    chemicalClass?: string;
    olfactiveFamily?: string;
    olfactiveProfile?: string;
  },
  userId?: number,
  notes?: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const [review] = await db.select().from(classificationReviews)
    .where(eq(classificationReviews.id, reviewId));

  if (!review || review.status !== 'pending') return false;

  // Appliquer les modifications à la molécule
  const updateData: Record<string, unknown> = {};
  if (modifications.chemicalClass) updateData.chemicalClass = modifications.chemicalClass;
  if ((modifications as Record<string, unknown>).olfactiveFamily) updateData.family = (modifications as Record<string, unknown>).olfactiveFamily;
  if (modifications.olfactiveProfile) {
    updateData.olfactiveProfile = modifications.olfactiveProfile;
    // Synchroniser avec la colonne JSON standardisée
    try {
      const parsed = JSON.parse(modifications.olfactiveProfile);
      updateData.olfactiveProfileJson = Array.isArray(parsed)
        ? JSON.stringify(parsed)
        : JSON.stringify([String(parsed)]);
    } catch {
      const arr = modifications.olfactiveProfile.split(',').map((s: string) => s.trim()).filter(Boolean);
      updateData.olfactiveProfileJson = JSON.stringify(arr);
    }
  }

  if (Object.keys(updateData).length > 0) {
    await db.update(molecules).set(updateData).where(eq(molecules.id, review.moleculeId));
  }

  // Marquer la révision comme modifiée
  await db.update(classificationReviews)
    .set({
      status: 'modified',
      manualChemicalClass: modifications.chemicalClass,
      manualOlfactiveFamily: (modifications.olfactiveFamily ?? null) as string | null,
      manualOlfactiveProfile: modifications.olfactiveProfile,
      reviewedAt: new Date(),
      reviewedBy: userId,
      reviewNotes: notes,
    })
    .where(eq(classificationReviews.id, reviewId));

  return true;
}

/**
 * Ignorer une révision temporairement
 */
export async function skipReview(reviewId: number, userId?: number, notes?: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.update(classificationReviews)
    .set({
      status: 'skipped',
      reviewedAt: new Date(),
      reviewedBy: userId,
      reviewNotes: notes,
    })
    .where(eq(classificationReviews.id, reviewId));

  return true;
}

/**
 * Créer des révisions pour toutes les classifications à faible confiance
 */
export async function createReviewsForLowConfidenceClassifications(
  results: Array<{
    moleculeId: number;
    classification: {
      chemicalClass: string;
      chemicalClassConfidence: number;
      chemicalClassReasoning: string;
      olfactiveFamily?: string;
      olfactiveFamilyConfidence?: number;
      olfactiveFamilyReasoning?: string;
      suggestedOlfactiveProfile?: string;
      botanicalContextUsed?: boolean;
    };
  }>,
  confidenceThreshold: number = 70
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  let created = 0;

  for (const result of results) {
    if (result.classification.chemicalClassConfidence < confidenceThreshold) {
      // Déterminer la priorité basée sur la confiance
      let priority: 'low' | 'medium' | 'high' = 'medium';
      if (result.classification.chemicalClassConfidence < 30) {
        priority = 'high';
      } else if (result.classification.chemicalClassConfidence >= 50) {
        priority = 'low';
      }

      await createClassificationReview({
        moleculeId: result.moleculeId,
        aiChemicalClass: result.classification.chemicalClass,
        aiChemicalClassConfidence: result.classification.chemicalClassConfidence,
        aiChemicalClassReasoning: result.classification.chemicalClassReasoning,
        aiOlfactiveFamily: (typeof (result.classification as Record<string, unknown>).olfactiveFamily === 'string' ? (result.classification as Record<string, unknown>).olfactiveFamily : null) as string | null,
        aiOlfactiveFamilyConfidence: result.classification.olfactiveFamilyConfidence,
        aiOlfactiveFamilyReasoning: result.classification.olfactiveFamilyReasoning,
        aiSuggestedOlfactiveProfile: result.classification.suggestedOlfactiveProfile,
        aiBotanicalContextUsed: result.classification.botanicalContextUsed,
        priority,
      });
      created++;
    }
  }

  return created;
}

/**
 * Récupérer une révision par ID avec les données de la molécule
 */
export async function getReviewById(reviewId: number) {
  const db = await getDb();
  if (!db) return null;

  const [result] = await db.select({
    review: classificationReviews,
    molecule: molecules,
  })
    .from(classificationReviews)
    .leftJoin(molecules, eq(classificationReviews.moleculeId, molecules.id))
    .where(eq(classificationReviews.id, reviewId));

  return result || null;
}



