import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// 7 CBD Resin Recipes from Manual
const cbdRecipes = [
  {
    name: 'VANILLE NOIRE & ENCENS BLANC',
    category: 'resine',
    description: 'Résine CBD monastère brut. Miel brûlé, encens, fleur animale, ambre fondu.',
    ingredients: 'Vanille Bourbon, Encens olibanum, Styrax, Santal Mysore. Résine CBN ou libanais rouge.',
    protocol: 'Base résine CBD 94% + Mélange terpènes 3% (Vanille Bourbon, Olibanum, Styrax, Santal) + Huile support MCT 2% + Antioxydant 1%. Température 35-45°C max. Maturation 5-10 jours.',
    notes: 'Profil: Monastère Brut. Méditatif, ancré. Rareté: Extrême (3-5€/g actif)',
    texture: 'résine'
  },
  {
    name: 'THÉ FUMÉ & LABDANUM',
    category: 'resine',
    description: 'Or des Pyrénées. Résines 50-70% ou wax. Ancrage + sérénité.',
    ingredients: 'Labdanum, Absolu de thé noir (Lapsang), Benjoin Siam, HE Cèdre de l\'Atlas',
    protocol: 'Base résine CBD 94% + Mélange terpènes 3% (Labdanum, Thé noir, Benjoin, Cèdre) + Huile support MCT 2% + Antioxydant 1%. Température 35-45°C max. Maturation 5-10 jours.',
    notes: 'Profil: Or des Pyrénées. Absolu de thé et labdanum rares (~250€/kg)',
    texture: 'résine'
  },
  {
    name: 'ROSE DES SABLES',
    category: 'resine',
    description: 'Desert Bloom. Fleurs CBD séchées (infusion olfactive). Relax floral chaud.',
    ingredients: 'Absolu de rose de Damas, Myrrhe, Opoponax, Graine d\'ambrette, HE Ciste',
    protocol: 'Base résine CBD 94% + Mélange terpènes 3% (Rose Damas, Myrrhe, Opoponax, Ambrette, Ciste) + Huile support MCT 2% + Antioxydant 1%. Température 35-45°C max. Maturation 5-10 jours.',
    notes: 'Profil: Desert Bloom. Ambrette naturelle ultra rare (600-1200€/kg)',
    texture: 'sec'
  },
  {
    name: 'CUIR, CACAO, TABAC',
    category: 'resine',
    description: 'Club fermé. Résine ou crumble premium. Riche, masculin, addictif.',
    ingredients: 'Absolu de tabac blond, Absolu de cacao, Styrax liquide, Vanilline naturelle',
    protocol: 'Base résine CBD 94% + Mélange terpènes 3% (Tabac blond, Cacao, Styrax, Vanilline) + Huile support MCT 2% + Antioxydant 1%. Température 35-45°C max. Maturation 5-10 jours.',
    notes: 'Profil: Club fermé. Tabac et cacao naturels rares (400-800€/kg)',
    texture: 'sec'
  },
  {
    name: 'MENTHE SAUVAGE & MOUSSE DE CHÊNE',
    category: 'resine',
    description: 'Forêt froide. Résine 30-50% CBD. Énergisant sans nervosité.',
    ingredients: 'Mousse de chêne (IFRA-safe), Menthe verte sauvage, Aiguille de pin, Patchouli',
    protocol: 'Base résine CBD 94% + Mélange terpènes 3% (Mousse chêne, Menthe, Pin, Patchouli) + Huile support MCT 2% + Antioxydant 1%. Température 35-45°C max. Maturation 5-10 jours.',
    notes: 'Profil: Forêt froide. Mousse de chêne filtrée (interdite en G.P.)',
    texture: 'humide'
  },
  {
    name: 'SÉSAME GRILLÉ & AMBRE GRISE',
    category: 'resine',
    description: 'Minéral Nectar. Wax haut de gamme. Sensoriel, minéral, suave.',
    ingredients: 'Huile de sésame grillée, Ambre gris (synthèse), Ciste labdanum, Angélique',
    protocol: 'Base résine CBD 94% + Mélange terpènes 3% (Sésame grillé, Ambre gris, Ciste, Angélique) + Huile support MCT 2% + Antioxydant 1%. Température 35-45°C max. Maturation 5-10 jours.',
    notes: 'Profil: Minéral Nectar. Ambre gris naturel ≈ 15 000€/kg (doser < 0,1%)',
    texture: 'résine'
  },
  {
    name: 'FIGUIER & CUIVRE VÉGÉTAL',
    category: 'resine',
    description: 'Bois vert. Résine CBD 40-60%. Ancrage mental + clarté cognitive.',
    ingredients: 'Absolu de feuille de figuier, Galbanum vert, Feuille de violette, Accord cuivre',
    protocol: 'Base résine CBD 94% + Mélange terpènes 3% (Figuier, Galbanum, Violette, Cuivre) + Huile support MCT 2% + Antioxydant 1%. Température 35-45°C max. Maturation 5-10 jours.',
    notes: 'Profil: Bois vert. Absolu figuier rare (~1500€/kg)',
    texture: 'humide'
  }
];

console.log(`🔄 Importing ${cbdRecipes.length} CBD resin recipes...`);

let imported = 0;
let skipped = 0;

for (const recipe of cbdRecipes) {
  try {
    // Check if recipe already exists
    const existing = await db.query.recettes.findFirst({
      where: (recettes, { eq }) => eq(recettes.name, recipe.name)
    });
    
    if (existing) {
      console.log(`⏭️  Skipped: ${recipe.name} (already exists)`);
      skipped++;
    } else {
      await db.insert(schema.recettes).values(recipe);
      console.log(`✅ Imported: ${recipe.name}`);
      imported++;
    }
  } catch (error) {
    console.error(`❌ Error importing ${recipe.name}:`, error.message);
  }
}

console.log(`\n✅ Import complete!`);
console.log(`   - Imported: ${imported} CBD recipes`);
console.log(`   - Skipped: ${skipped} recipes (already in database)`);
console.log(`   - Total: ${imported + skipped} recipes processed`);

await connection.end();
