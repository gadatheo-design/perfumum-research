/**
 * Extracted from server/db/misc.ts
 * Module: Admin Notifications
 */
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

const { molecules, plants } = schema;



// ====================================================================
// ADMIN NOTIFICATION FUNCTIONS
// ====================================================================
// ============================================================================
// ADMIN NOTIFICATION FUNCTIONS
// ============================================================================

/**
 * Récupérer les contributions en attente de validation avec détails
 */
export async function getPendingContributions() {
  const db = await getDb();
  if (!db) return { molecules: [], plants: [], total: 0 };

  // Molécules en brouillon ou en révision
  const pendingMolecules = await db.select({
    id: molecules.id,
    name: molecules.name,
    validationStatus: molecules.validationStatus,
    createdAt: molecules.createdAt,
    chemicalFormula: molecules.chemicalFormula,
    family: molecules.family,
  })
    .from(molecules)
    .where(
      or(
        eq(molecules.validationStatus, 'brouillon'),
        eq(molecules.validationStatus, 'en_revision')
      )
    )
    .orderBy(desc(molecules.createdAt))
    .limit(50);

  // Plantes en brouillon ou en révision
  const pendingPlants = await db.select({
    id: plants.id,
    name: plants.name,
    latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
    validationStatus: plants.validationStatus,
    createdAt: plants.createdAt,
    family: plants.family,
  })
    .from(plants)
    .where(
      or(
        eq(plants.validationStatus, 'brouillon'),
        eq(plants.validationStatus, 'en_revision')
      )
    )
    .orderBy(desc(plants.createdAt))
    .limit(50);

  return {
    molecules: pendingMolecules,
    plants: pendingPlants,
    total: pendingMolecules.length + pendingPlants.length,
  };
}

/**
 * Récupérer les nouvelles contributions depuis une date donnée
 */
export async function getNewContributionsSince(since: Date) {
  const db = await getDb();
  if (!db) return { molecules: [], plants: [], total: 0 };

  const newMolecules = await db.select({
    id: molecules.id,
    name: molecules.name,
    validationStatus: molecules.validationStatus,
    createdAt: molecules.createdAt,
  })
    .from(molecules)
    .where(
      and(
        gte(molecules.createdAt, since),
        or(
          eq(molecules.validationStatus, 'brouillon'),
          eq(molecules.validationStatus, 'en_revision')
        )
      )
    )
    .orderBy(desc(molecules.createdAt));

  const newPlants = await db.select({
    id: plants.id,
    name: plants.name,
    latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
    validationStatus: plants.validationStatus,
    createdAt: plants.createdAt,
  })
    .from(plants)
    .where(
      and(
        gte(plants.createdAt, since),
        or(
          eq(plants.validationStatus, 'brouillon'),
          eq(plants.validationStatus, 'en_revision')
        )
      )
    )
    .orderBy(desc(plants.createdAt));

  return {
    molecules: newMolecules,
    plants: newPlants,
    total: newMolecules.length + newPlants.length,
  };
}

/**
 * Générer un résumé des contributions en attente pour notification
 */
export async function generatePendingContributionsSummary() {
  const pending = await getPendingContributions();
  
  if (pending.total === 0) {
    return null;
  }

  const moleculesList = pending.molecules.slice(0, 5).map(m => 
    `• ${m.name} (${m.validationStatus === 'brouillon' ? 'Brouillon' : 'En révision'})`
  ).join('\n');

  const plantsList = pending.plants.slice(0, 5).map((p: Record<string, unknown>) => 
    `• ${p.name || p.latinName} (${p.validationStatus === 'brouillon' ? 'Brouillon' : 'En révision'})`
  ).join('\n');

  let content = `**Résumé des contributions en attente**\n\n`;
  content += `📊 **Total:** ${pending.total} contribution(s) en attente\n\n`;

  if (pending.molecules.length > 0) {
    content += `🧪 **Molécules (${pending.molecules.length}):**\n${moleculesList}\n`;
    if (pending.molecules.length > 5) {
      content += `... et ${pending.molecules.length - 5} autres\n`;
    }
    content += '\n';
  }

  if (pending.plants.length > 0) {
    content += `🌿 **Plantes (${pending.plants.length}):**\n${plantsList}\n`;
    if (pending.plants.length > 5) {
      content += `... et ${pending.plants.length - 5} autres\n`;
    }
  }

  content += `\n🔗 Accédez à la page de validation: /admin/validation`;

  return {
    title: `PERFUMUM: ${pending.total} contribution(s) en attente de validation`,
    content,
    stats: {
      molecules: pending.molecules.length,
      plants: pending.plants.length,
      total: pending.total,
    },
  };
}



