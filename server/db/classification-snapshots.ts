/**
 * Extracted from server/db/misc.ts
 * Module: Classification Snapshots
 */
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";
import { getOrphanMoleculeStats } from './molecules-orphans';
import { getLinkingCoverageStats } from './recettes';
import { createNotification } from './users';
import { type ClassificationSnapshot, type InsertClassificationSnapshot } from "../../drizzle/schema";

const { accords, classificationSnapshots, notifications, plants, recettes, terroirs } = schema;



// ====================================================================
// CLASSIFICATION SNAPSHOTS (Progress Tracking)
// ====================================================================
// ============================================================================
// CLASSIFICATION SNAPSHOTS (Progress Tracking)
// ============================================================================

export async function createClassificationSnapshot(notes?: string, createdBy?: number): Promise<ClassificationSnapshot | null> {
  const db = await getDb();
  if (!db) return null;

  // Récupérer les statistiques actuelles
  const stats = await getOrphanMoleculeStats();
  if (!stats) return null;

  // Récupérer les statistiques de liaison
  const linkingStats = await getLinkingCoverageStats();
  
  // Compter les entités
  const allRecettes = await db.select().from(recettes);
  const allPlants = await db.select().from(plants);
  const allTerroirs = await db.select().from(terroirs);
  const allAccords = await db.select().from(accords);

  // Calculer les taux
  const classificationFields = [
    stats.withFamily / stats.totalMolecules,
    stats.withChemicalClass / stats.totalMolecules,
    stats.withCasNumber / stats.totalMolecules,
    stats.withIupacName / stats.totalMolecules,
    stats.withFormula / stats.totalMolecules,
    stats.withOlfactiveProfile / stats.totalMolecules,
  ];
  const overallClassificationRate = Math.round(
    (classificationFields.reduce((a, b) => a + b, 0) / classificationFields.length) * 10000
  );

  const linkingFields = linkingStats ? [
    linkingStats.moleculeRecette.coverageMolecules / 100,
    linkingStats.plantMolecule.coverageMolecules / 100,
    linkingStats.plantTerroir.coveragePlants / 100,
  ] : [0, 0, 0];
  const overallLinkingRate = Math.round(
    (linkingFields.reduce((a, b) => a + b, 0) / linkingFields.length) * 10000
  );

  const snapshotData: InsertClassificationSnapshot = {
    snapshotDate: new Date(),
    totalMolecules: stats.totalMolecules,
    moleculesWithFamily: stats.withFamily,
    moleculesWithChemicalClass: stats.withChemicalClass,
    moleculesWithCasNumber: stats.withCasNumber,
    moleculesWithIupacName: stats.withIupacName,
    moleculesWithFormula: stats.withFormula,
    moleculesWithOlfactiveProfile: stats.withOlfactiveProfile,
    moleculesWithRadar: stats.withRadarComplete,
    moleculesLinkedToRecettes: linkingStats?.moleculeRecette.moleculesWithRecette || 0,
    moleculesLinkedToPlants: linkingStats?.plantMolecule.moleculesWithPlant || 0,
    plantsLinkedToTerroirs: linkingStats?.plantTerroir.plantsWithTerroir || 0,
    overallClassificationRate,
    overallLinkingRate,
    totalRecettes: allRecettes.length,
    totalPlants: allPlants.length,
    totalTerroirs: allTerroirs.length,
    totalAccords: allAccords.length,
    notes,
    createdBy,
  };

  const [result] = await db.insert(classificationSnapshots).values(snapshotData);
  const [snapshot] = await db.select().from(classificationSnapshots).where(eq(classificationSnapshots.id, result.insertId));
  
  // Créer une notification si un jalon est atteint
  const milestones = [25, 50, 75, 90, 95, 100];
  const currentRate = overallClassificationRate / 100;
  for (const milestone of milestones) {
    if (currentRate >= milestone) {
      // Vérifier si ce jalon a déjà été notifié
      const existingNotification = await db.select().from(notifications)
        .where(and(
          eq(notifications.type, 'classification_milestone'),
          sql`JSON_EXTRACT(metadata, '$.milestone') = ${milestone}`
        ))
        .limit(1);
      
      if (existingNotification.length === 0) {
        await createNotification({
          type: 'classification_milestone',
          title: `Jalon de classification atteint: ${milestone}%`,
          message: `Le taux de classification global a atteint ${milestone}%. Félicitations pour cette progression!`,
          severity: 'success',
          metadata: { milestone, rate: currentRate },
        });
      }
    }
  }

  return snapshot || null;
}

export async function getClassificationSnapshots(options: {
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
} = {}) {
  const db = await getDb();
  if (!db) return { snapshots: [], total: 0 };

  const { limit = 100, offset = 0, startDate, endDate } = options;

  let allSnapshots = await db.select().from(classificationSnapshots)
    .orderBy(desc(classificationSnapshots.snapshotDate));

  // Filtrer par date si spécifié
  if (startDate) {
    allSnapshots = allSnapshots.filter(s => new Date(s.snapshotDate) >= startDate);
  }
  if (endDate) {
    allSnapshots = allSnapshots.filter(s => new Date(s.snapshotDate) <= endDate);
  }

  const total = allSnapshots.length;
  const paginatedSnapshots = allSnapshots.slice(offset, offset + limit);

  return {
    snapshots: paginatedSnapshots,
    total,
  };
}

export async function getLatestSnapshot(): Promise<ClassificationSnapshot | null> {
  const db = await getDb();
  if (!db) return null;

  const [snapshot] = await db.select().from(classificationSnapshots)
    .orderBy(desc(classificationSnapshots.snapshotDate))
    .limit(1);

  return snapshot || null;
}

export async function getProgressReport(startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return null;

  const { snapshots } = await getClassificationSnapshots({ 
    startDate, 
    endDate,
    limit: 1000,
  });

  if (snapshots.length === 0) return null;

  const firstSnapshot = snapshots[snapshots.length - 1];
  const lastSnapshot = snapshots[0];

  // Calculer les progressions
  const calculateProgress = (first: number, last: number) => ({
    start: first,
    end: last,
    change: last - first,
    changePercent: first > 0 ? Math.round(((last - first) / first) * 100) : 0,
  });

  // Projection sur 10 ans basée sur la tendance actuelle
  const daysBetween = snapshots.length > 1 
    ? (new Date(lastSnapshot.snapshotDate).getTime() - new Date(firstSnapshot.snapshotDate).getTime()) / (1000 * 60 * 60 * 24)
    : 1;
  
  const dailyClassificationProgress = daysBetween > 0 
    ? (lastSnapshot.overallClassificationRate - firstSnapshot.overallClassificationRate) / daysBetween
    : 0;
  
  const daysToComplete = dailyClassificationProgress > 0 
    ? Math.ceil((10000 - lastSnapshot.overallClassificationRate) / dailyClassificationProgress)
    : Infinity;

  const projectedCompletionDate = daysToComplete !== Infinity && daysToComplete > 0
    ? new Date(Date.now() + daysToComplete * 24 * 60 * 60 * 1000)
    : null;

  return {
    period: {
      start: firstSnapshot.snapshotDate,
      end: lastSnapshot.snapshotDate,
      snapshotCount: snapshots.length,
    },
    classification: {
      overall: calculateProgress(firstSnapshot.overallClassificationRate / 100, lastSnapshot.overallClassificationRate / 100),
      family: calculateProgress(
        (firstSnapshot.moleculesWithFamily / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesWithFamily / lastSnapshot.totalMolecules) * 100
      ),
      chemicalClass: calculateProgress(
        (firstSnapshot.moleculesWithChemicalClass / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesWithChemicalClass / lastSnapshot.totalMolecules) * 100
      ),
      casNumber: calculateProgress(
        (firstSnapshot.moleculesWithCasNumber / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesWithCasNumber / lastSnapshot.totalMolecules) * 100
      ),
      iupacName: calculateProgress(
        (firstSnapshot.moleculesWithIupacName / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesWithIupacName / lastSnapshot.totalMolecules) * 100
      ),
      formula: calculateProgress(
        (firstSnapshot.moleculesWithFormula / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesWithFormula / lastSnapshot.totalMolecules) * 100
      ),
      olfactiveProfile: calculateProgress(
        (firstSnapshot.moleculesWithOlfactiveProfile / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesWithOlfactiveProfile / lastSnapshot.totalMolecules) * 100
      ),
    },
    linking: {
      overall: calculateProgress(firstSnapshot.overallLinkingRate / 100, lastSnapshot.overallLinkingRate / 100),
      moleculeRecette: calculateProgress(
        (firstSnapshot.moleculesLinkedToRecettes / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesLinkedToRecettes / lastSnapshot.totalMolecules) * 100
      ),
      moleculePlant: calculateProgress(
        (firstSnapshot.moleculesLinkedToPlants / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesLinkedToPlants / lastSnapshot.totalMolecules) * 100
      ),
      plantTerroir: calculateProgress(
        (firstSnapshot.plantsLinkedToTerroirs / firstSnapshot.totalPlants) * 100,
        (lastSnapshot.plantsLinkedToTerroirs / lastSnapshot.totalPlants) * 100
      ),
    },
    entities: {
      molecules: calculateProgress(firstSnapshot.totalMolecules, lastSnapshot.totalMolecules),
      recettes: calculateProgress(firstSnapshot.totalRecettes, lastSnapshot.totalRecettes),
      plants: calculateProgress(firstSnapshot.totalPlants, lastSnapshot.totalPlants),
      terroirs: calculateProgress(firstSnapshot.totalTerroirs, lastSnapshot.totalTerroirs),
      accords: calculateProgress(firstSnapshot.totalAccords, lastSnapshot.totalAccords),
    },
    projection: {
      dailyProgress: dailyClassificationProgress / 100, // En pourcentage
      daysToComplete,
      projectedCompletionDate,
      tenYearProjection: {
        date: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
        estimatedClassificationRate: Math.min(100, (lastSnapshot.overallClassificationRate / 100) + (dailyClassificationProgress * 10 * 365 / 100)),
      },
    },
    snapshots: snapshots.map(s => ({
      date: s.snapshotDate,
      classificationRate: s.overallClassificationRate / 100,
      linkingRate: s.overallLinkingRate / 100,
      totalMolecules: s.totalMolecules,
    })),
  };
}



