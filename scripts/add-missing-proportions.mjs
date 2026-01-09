/**
 * Script pour ajouter les proportions manquantes aux liaisons molécules-recettes
 * Basé sur les rôles olfactifs et les conventions de formulation
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

// Proportions typiques par rôle olfactif (en %)
const PROPORTIONS_BY_ROLE = {
  'tête': { min: 15, max: 30 },      // Notes de tête: 15-30%
  'cœur': { min: 30, max: 50 },      // Notes de cœur: 30-50%
  'fond': { min: 20, max: 40 },      // Notes de fond: 20-40%
};

// Proportions par type de molécule/matière première
const PROPORTIONS_BY_TYPE = {
  // Résines et baumes (fond)
  'Baume de Tolú': { proportion: 8, role: 'fond' },
  'Copal Colombien': { proportion: 5, role: 'fond' },
  'Palo Santo': { proportion: 10, role: 'fond' },
  
  // Bois (fond/cœur)
  'Cedro Rosado': { proportion: 12, role: 'fond' },
  'Nogal Colombien': { proportion: 8, role: 'fond' },
  
  // Vanille (fond)
  'Vanilla Pompona': { proportion: 6, role: 'fond' },
  
  // Cacao et café (cœur)
  'Cacao Colombien': { proportion: 10, role: 'cœur' },
  'Café Geisha': { proportion: 15, role: 'cœur' },
  'Fleur de Café': { proportion: 8, role: 'cœur' },
  
  // Fruits (tête/cœur)
  'Guanábana': { proportion: 12, role: 'tête' },
  'Lulo': { proportion: 10, role: 'tête' },
  'Uchuva': { proportion: 8, role: 'tête' },
  
  // Plantes rituelles
  'Borrachero': { proportion: 3, role: 'cœur' },
  'Yagé': { proportion: 5, role: 'cœur' },
  
  // Molécules aromatiques
  'Anéthole': { proportion: 15, role: 'cœur' },
  'Estragole': { proportion: 12, role: 'cœur' },
  'β-Ocimène': { proportion: 8, role: 'tête' },
  'carvone': { proportion: 10, role: 'cœur' },
  'tagetone': { proportion: 8, role: 'cœur' },
  'Méthyl-eugénol': { proportion: 5, role: 'cœur' },
  '2-Méthylpyrazine': { proportion: 3, role: 'cœur' },
};

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log('\n=== AJOUT DES PROPORTIONS MANQUANTES ===\n');

  // 1. Traiter molecules_recettes
  console.log('--- Table molecules_recettes ---\n');
  
  const moleculesRecettes = await db.execute(sql`
    SELECT mr.id, mr.molecule_id, mr.recette_id, mr.proportion, mr.role,
           m.name as molecule_name
    FROM molecules_recettes mr
    JOIN molecules m ON mr.molecule_id = m.id
    WHERE mr.proportion IS NULL OR mr.proportion = 0
  `);

  let updated1 = 0;
  for (const row of moleculesRecettes[0]) {
    const typeInfo = PROPORTIONS_BY_TYPE[row.molecule_name];
    if (typeInfo) {
      await db.execute(sql`
        UPDATE molecules_recettes 
        SET proportion = ${typeInfo.proportion}, 
            role = COALESCE(role, ${typeInfo.role})
        WHERE id = ${row.id}
      `);
      console.log(`✅ ${row.molecule_name}: ${typeInfo.proportion}% (${typeInfo.role})`);
      updated1++;
    } else {
      // Proportion par défaut basée sur le rôle existant
      const defaultProp = row.role === 'tête' ? 10 : row.role === 'fond' ? 8 : 12;
      await db.execute(sql`
        UPDATE molecules_recettes 
        SET proportion = ${defaultProp}
        WHERE id = ${row.id}
      `);
      console.log(`⚠️ ${row.molecule_name}: ${defaultProp}% (défaut)`);
      updated1++;
    }
  }

  console.log(`\nMis à jour: ${updated1} liaisons dans molecules_recettes\n`);

  // 2. Traiter recette_molecules
  console.log('--- Table recette_molecules ---\n');
  
  const recetteMolecules = await db.execute(sql`
    SELECT rm.id, rm.molecule_id, rm.recette_id, rm.proportion, rm.role,
           m.name as molecule_name
    FROM recette_molecules rm
    JOIN molecules m ON rm.molecule_id = m.id
    WHERE rm.proportion IS NULL OR rm.proportion = 0
  `);

  let updated2 = 0;
  for (const row of recetteMolecules[0]) {
    const typeInfo = PROPORTIONS_BY_TYPE[row.molecule_name];
    if (typeInfo) {
      await db.execute(sql`
        UPDATE recette_molecules 
        SET proportion = ${typeInfo.proportion}, 
            role = COALESCE(role, ${typeInfo.role})
        WHERE id = ${row.id}
      `);
      console.log(`✅ ${row.molecule_name}: ${typeInfo.proportion}% (${typeInfo.role})`);
      updated2++;
    } else {
      // Proportion par défaut
      const defaultProp = 10;
      await db.execute(sql`
        UPDATE recette_molecules 
        SET proportion = ${defaultProp}
        WHERE id = ${row.id}
      `);
      console.log(`⚠️ ${row.molecule_name}: ${defaultProp}% (défaut)`);
      updated2++;
    }
  }

  console.log(`\nMis à jour: ${updated2} liaisons dans recette_molecules\n`);

  // 3. Vérification finale
  console.log('=== VÉRIFICATION FINALE ===\n');
  
  const remaining1 = await db.execute(sql`
    SELECT COUNT(*) as count FROM molecules_recettes 
    WHERE proportion IS NULL OR proportion = 0
  `);
  
  const remaining2 = await db.execute(sql`
    SELECT COUNT(*) as count FROM recette_molecules 
    WHERE proportion IS NULL OR proportion = 0
  `);

  console.log(`molecules_recettes sans proportion: ${remaining1[0][0].count}`);
  console.log(`recette_molecules sans proportion: ${remaining2[0][0].count}`);

  await connection.end();
  console.log('\n=== TERMINÉ ===\n');
}

main().catch(console.error);
