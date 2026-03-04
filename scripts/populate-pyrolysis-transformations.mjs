/**
 * Script : Enrichir la table pyrolysis_transformations
 * Ajoute les transformations moléculaires lors de la pyrolyse du tabac et du cannabis
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Transformations du TABAC
const tobaccoTransformations = [
  // Nicotine
  { source: 'Nicotine', product: 'Pyrrole', temperature: '600-700°C', mechanism: 'fragmentation', toxicity: 'moderate', notes: 'Décomposition partielle de la nicotine lors de la combustion du tabac' },
  { source: 'Nicotine', product: 'Ammonia', temperature: '600-700°C', mechanism: 'fragmentation', toxicity: 'moderate', notes: 'Libération d\'ammoniaque lors de la pyrolyse' },
  
  // Solanone
  { source: 'Solanone', product: 'Volatile aldehydes', temperature: '650-750°C', mechanism: 'oxidation', toxicity: 'moderate', notes: 'Oxydation en aldéhydes volatiles' },
  
  // Damascenones
  { source: 'Damascenone', product: 'Degradation products', temperature: '700-800°C', mechanism: 'degradation', toxicity: 'low', notes: 'Dégradation thermique des damascenones' },
  
  // Sucres
  { source: 'Glucose', product: 'Formaldehyde', temperature: '500-600°C', mechanism: 'oxidation', toxicity: 'high', notes: 'Oxydation des sucres du tabac' },
  { source: 'Glucose', product: 'Acetaldehyde', temperature: '550-650°C', mechanism: 'oxidation', toxicity: 'moderate', notes: 'Oxydation des sucres du tabac' },
  { source: 'Fructose', product: 'Organic acids', temperature: '600-700°C', mechanism: 'oxidation', toxicity: 'low', notes: 'Oxydation des sucres du tabac' },
  
  // Protéines
  { source: 'Proteins', product: 'Ammonia', temperature: '550-650°C', mechanism: 'fragmentation', toxicity: 'moderate', notes: 'Décomposition des protéines du tabac' },
  { source: 'Proteins', product: 'HCN', temperature: '700-800°C', mechanism: 'fragmentation', toxicity: 'very_high', notes: 'Cyanure d\'hydrogène produit lors de la pyrolyse' },
];

// Transformations du CANNABIS
const cannabisTransformations = [
  // Cannabinoïdes
  { source: 'THCA', product: 'THC', temperature: '150-200°C', mechanism: 'decarboxylation', toxicity: 'moderate', notes: 'Décarboxylation thermique de l\'acide THCA lors du chauffage' },
  { source: 'CBDA', product: 'CBD', temperature: '150-200°C', mechanism: 'decarboxylation', toxicity: 'low', notes: 'Décarboxylation thermique de l\'acide CBDA' },
  { source: 'THC', product: '11-OH-THC', temperature: '400-500°C', mechanism: 'hydroxylation', toxicity: 'high', notes: 'Hydroxylation métabolique du THC lors de la combustion' },
  { source: 'THC', product: 'THCCOOH', temperature: '450-550°C', mechanism: 'oxidation', toxicity: 'low', notes: 'Oxydation en composé inactif' },
  { source: 'CBD', product: 'THC', temperature: '300-400°C', mechanism: 'isomerization', toxicity: 'moderate', notes: 'Isomérisation thermique du CBD en THC' },
  
  // Terpènes
  { source: 'Myrcène', product: 'Terpinol', temperature: '200-300°C', mechanism: 'rearrangement', toxicity: 'low', notes: 'Réarrangement thermique du myrcène' },
  { source: 'Myrcène', product: 'Linalool', temperature: '250-350°C', mechanism: 'rearrangement', toxicity: 'low', notes: 'Réarrangement thermique du myrcène' },
  
  { source: 'Limonène', product: 'Limonene oxide', temperature: '200-300°C', mechanism: 'oxidation', toxicity: 'low', notes: 'Oxydation du limonène' },
  { source: 'Limonène', product: 'Carvone', temperature: '250-350°C', mechanism: 'oxidation', toxicity: 'low', notes: 'Oxydation du limonène' },
  
  { source: 'β-Caryophyllène', product: 'Caryophyllène oxide', temperature: '200-300°C', mechanism: 'oxidation', toxicity: 'low', notes: 'Oxydation du β-caryophyllène lors de la combustion' },
  
  { source: 'Linalool', product: 'Linalol oxide', temperature: '180-280°C', mechanism: 'oxidation', toxicity: 'low', notes: 'Oxydation du linalol' },
  
  { source: 'α-Pinène', product: 'Pinene oxide', temperature: '200-300°C', mechanism: 'oxidation', toxicity: 'low', notes: 'Oxydation du pinène' },
  { source: 'α-Pinène', product: 'Pinocarveol', temperature: '250-350°C', mechanism: 'rearrangement', toxicity: 'low', notes: 'Réarrangement du pinène' },
  
  { source: 'Humulène', product: 'Humulene oxide', temperature: '200-300°C', mechanism: 'oxidation', toxicity: 'low', notes: 'Oxydation de l\'humulène' },
];

try {
  console.log('🔬 Enrichissement de la table pyrolysis_transformations...\n');

  let addedCount = 0;
  let skippedCount = 0;

  // Insérer les transformations du tabac
  for (const t of tobaccoTransformations) {
    try {
      await conn.execute(
        `INSERT INTO pyrolysis_transformations 
        (source_molecule, product_molecule, temperature_range, mechanism, toxicity_level, notes) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [t.source, t.product, t.temperature, t.mechanism, t.toxicity, t.notes]
      );
      console.log(`✅ Added: ${t.source} → ${t.product} (${t.temperature})`);
      addedCount++;
    } catch (err) {
      if (err.code !== 'ER_DUP_ENTRY') {
        console.error(`❌ Error: ${t.source} → ${t.product}`, err.message);
      }
      skippedCount++;
    }
  }

  // Insérer les transformations du cannabis
  for (const t of cannabisTransformations) {
    try {
      await conn.execute(
        `INSERT INTO pyrolysis_transformations 
        (source_molecule, product_molecule, temperature_range, mechanism, toxicity_level, notes) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [t.source, t.product, t.temperature, t.mechanism, t.toxicity, t.notes]
      );
      console.log(`✅ Added: ${t.source} → ${t.product} (${t.temperature})`);
      addedCount++;
    } catch (err) {
      if (err.code !== 'ER_DUP_ENTRY') {
        console.error(`❌ Error: ${t.source} → ${t.product}`, err.message);
      }
      skippedCount++;
    }
  }

  // Statistiques finales
  const [stats] = await conn.execute('SELECT COUNT(*) as count FROM pyrolysis_transformations');
  const totalCount = stats[0].count;

  console.log(`\n📊 Résultats :`);
  console.log(`   Ajoutées : ${addedCount}`);
  console.log(`   Ignorées : ${skippedCount}`);
  console.log(`   Total dans la base : ${totalCount}`);

} catch (err) {
  console.error('❌ Erreur :', err.message);
} finally {
  await conn.end();
}
