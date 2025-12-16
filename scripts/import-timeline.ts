import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import { readFileSync } from "fs";
import { join } from "path";

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection, { schema, mode: "default" });

console.log("=== Import des jalons de recherche (18 mois) ===\n");

// Lire le fichier JSON des jalons
const timelinePath = join(process.cwd(), "data", "research-timeline-18months.json");
const timelineData = JSON.parse(readFileSync(timelinePath, "utf-8"));

console.log(`📅 ${timelineData.length} jalons à importer\n`);

let successCount = 0;
let errorCount = 0;

for (const milestone of timelineData) {
  try {
    await db.insert(schema.researchTimeline).values({
      title: milestone.title,
      description: milestone.description,
      quarter: milestone.quarter,
      year: milestone.year,
      quarterNumber: milestone.quarterNumber,
      phase: milestone.phase,
      category: milestone.category,
      status: milestone.status,
      priority: milestone.priority,
      deliverables: milestone.deliverables,
      dependencies: milestone.dependencies,
      progress: milestone.progress,
      startDate: milestone.startDate,
      endDate: milestone.endDate,
      completedDate: milestone.completedDate,
      notes: milestone.notes || null,
    });

    const statusIcon = {
      completed: "✅",
      in_progress: "🔄",
      planned: "📋",
      delayed: "⏰",
    }[milestone.status] || "📋";

    console.log(`${statusIcon} ${milestone.quarter} - ${milestone.title} (${milestone.category})`);
    successCount++;
  } catch (error: any) {
    console.error(`❌ Erreur pour "${milestone.title}": ${error.message}`);
    errorCount++;
  }
}

console.log(`\n=== Résumé ===`);
console.log(`✅ ${successCount} jalons importés avec succès`);
console.log(`❌ ${errorCount} erreurs`);

// Statistiques
const stats = await db
  .select({ 
    phase: schema.researchTimeline.phase,
    category: schema.researchTimeline.category,
    status: schema.researchTimeline.status
  })
  .from(schema.researchTimeline);

console.log(`\n📊 Statistiques:`);

// Par phase
const byPhase = stats.reduce((acc, s) => {
  acc[s.phase] = (acc[s.phase] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log(`\n  Phases:`);
Object.entries(byPhase).forEach(([phase, count]) => {
  console.log(`    - ${phase}: ${count}`);
});

// Par catégorie
const byCategory = stats.reduce((acc, s) => {
  acc[s.category] = (acc[s.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log(`\n  Catégories:`);
Object.entries(byCategory).forEach(([category, count]) => {
  console.log(`    - ${category}: ${count}`);
});

// Par statut
const byStatus = stats.reduce((acc, s) => {
  acc[s.status] = (acc[s.status] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log(`\n  Statuts:`);
Object.entries(byStatus).forEach(([status, count]) => {
  console.log(`    - ${status}: ${count}`);
});

await connection.end();
