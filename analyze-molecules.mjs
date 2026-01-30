import { getDb } from "./server/db.ts";
import { molecules } from "./drizzle/schema.ts";

const db = await getDb();
const allMolecules = await db.select().from(molecules);

const families = new Set();
const profiles = new Set();
const concentrations = [];

allMolecules.forEach(m => {
  if (m.family) families.add(m.family);
  if (m.olfactiveProfile) {
    // Split by comma or semicolon
    m.olfactiveProfile.split(/[,;]/).forEach(p => profiles.add(p.trim()));
  }
  if (m.concentration) {
    const match = m.concentration.match(/[\d.]+/);
    if (match) concentrations.push(parseFloat(match[0]));
  }
});

console.log("=== FAMILLES CHIMIQUES ===");
console.log(Array.from(families).sort().join("\n"));

console.log("\n=== PROFILS OLFACTIFS ===");
console.log(Array.from(profiles).sort().join("\n"));

console.log("\n=== CONCENTRATIONS ===");
console.log(`Min: ${Math.min(...concentrations)}%`);
console.log(`Max: ${Math.max(...concentrations)}%`);
console.log(`Total molecules: ${allMolecules.length}`);

process.exit(0);
