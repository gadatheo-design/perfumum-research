/**
 * Extracted from server/db/misc.ts
 * Module: Scientific Data
 */
import { db } from "../_core/db";
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

const { molecules } = schema;


// ====================================================================
// PHASE 4: COLLABORATION & PARTAGE - Database Functions
// ====================================================================
// ============================================================================
// PHASE 4: COLLABORATION & PARTAGE - Database Functions

// ====================================================================
// Dictionnaire de données scientifiques connues
// ====================================================================
// ============================================================================

// Dictionnaire de données scientifiques connues
const knownMoleculeData: Record<string, { molecularWeight?: number; boilingPoint?: number; family?: string }> = {
  'limonène': { molecularWeight: 136, boilingPoint: 176, family: 'Monoterpène' },
  'limonene': { molecularWeight: 136, boilingPoint: 176, family: 'Monoterpène' },
  'α-pinène': { molecularWeight: 136, boilingPoint: 155, family: 'Monoterpène' },
  'pinène': { molecularWeight: 136, boilingPoint: 155, family: 'Monoterpène' },
  'β-pinène': { molecularWeight: 136, boilingPoint: 166, family: 'Monoterpène' },
  'myrcène': { molecularWeight: 136, boilingPoint: 167, family: 'Monoterpène' },
  'linalol': { molecularWeight: 154, boilingPoint: 198, family: 'Monoterpénol' },
  'linalool': { molecularWeight: 154, boilingPoint: 198, family: 'Monoterpénol' },
  'géraniol': { molecularWeight: 154, boilingPoint: 230, family: 'Monoterpénol' },
  'terpinéol': { molecularWeight: 154, boilingPoint: 219, family: 'Monoterpénol' },
  'menthol': { molecularWeight: 156, boilingPoint: 212, family: 'Monoterpénol' },
  'eucalyptol': { molecularWeight: 154, boilingPoint: 176, family: 'Oxyde terpénique' },
  'camphre': { molecularWeight: 152, boilingPoint: 204, family: 'Cétone terpénique' },
  'caryophyllène': { molecularWeight: 204, boilingPoint: 262, family: 'Sesquiterpène' },
  'β-caryophyllène': { molecularWeight: 204, boilingPoint: 262, family: 'Sesquiterpène' },
  'humulène': { molecularWeight: 204, boilingPoint: 166, family: 'Sesquiterpène' },
  'bisabolol': { molecularWeight: 222, boilingPoint: 153, family: 'Sesquiterpénol' },
  'farnesol': { molecularWeight: 222, boilingPoint: 283, family: 'Sesquiterpénol' },
  'vétiver': { molecularWeight: 218, boilingPoint: 290, family: 'Sesquiterpène' },
  'patchouli': { molecularWeight: 222, boilingPoint: 287, family: 'Sesquiterpénol' },
  'citral': { molecularWeight: 152, boilingPoint: 229, family: 'Aldéhyde terpénique' },
  'vanilline': { molecularWeight: 152, boilingPoint: 285, family: 'Aldéhyde aromatique' },
  'cinnamaldéhyde': { molecularWeight: 132, boilingPoint: 248, family: 'Aldéhyde aromatique' },
  'eugénol': { molecularWeight: 164, boilingPoint: 254, family: 'Phénol' },
  'thymol': { molecularWeight: 150, boilingPoint: 232, family: 'Phénol' },
  'coumarine': { molecularWeight: 146, boilingPoint: 301, family: 'Lactone' },
  'géosmine': { molecularWeight: 182, boilingPoint: 270, family: 'Alcool bicyclique' },
  'ambroxan': { molecularWeight: 236, boilingPoint: 320, family: 'Ambre synthétique' },
  'indole': { molecularWeight: 117, boilingPoint: 254, family: 'Hétérocycle azoté' },
  'skatole': { molecularWeight: 131, boilingPoint: 265, family: 'Hétérocycle azoté' },
  'acide hexanoïque': { molecularWeight: 116, boilingPoint: 205, family: 'Acide gras' },
  'acide butyrique': { molecularWeight: 88, boilingPoint: 164, family: 'Acide gras' },
  'pyrazine': { molecularWeight: 80, boilingPoint: 115, family: 'Pyrazine' },
  'furfural': { molecularWeight: 96, boilingPoint: 162, family: 'Furane' },
};

function estimatePropertiesFromProfile(name: string, profile: string | null): { molecularWeight: number; boilingPoint: number; family: string } {
  const nameLower = name.toLowerCase();
  const profileLower = (profile || '').toLowerCase();
  
  // Chercher dans le dictionnaire
  for (const [key, data] of Object.entries(knownMoleculeData)) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return {
        molecularWeight: data.molecularWeight || 150,
        boilingPoint: data.boilingPoint || 200,
        family: data.family || 'Non classé',
      };
    }
  }
  
  // Estimation basée sur les mots-clés
  let molecularWeight = 150;
  let boilingPoint = 200;
  let family = 'Non classé';
  
  if (profileLower.includes('citron') || profileLower.includes('agrume')) {
    molecularWeight = 136; boilingPoint = 176; family = 'Monoterpène';
  } else if (profileLower.includes('bois') || profileLower.includes('cèdre')) {
    molecularWeight = 204; boilingPoint = 260; family = 'Sesquiterpène';
  } else if (profileLower.includes('floral') || profileLower.includes('rose')) {
    molecularWeight = 154; boilingPoint = 220; family = 'Monoterpénol';
  } else if (profileLower.includes('vanille') || profileLower.includes('sucré')) {
    molecularWeight = 152; boilingPoint = 250; family = 'Aldéhyde';
  } else if (profileLower.includes('épic') || profileLower.includes('clou')) {
    molecularWeight = 164; boilingPoint = 245; family = 'Phénol';
  } else if (profileLower.includes('terre') || profileLower.includes('mousse')) {
    molecularWeight = 182; boilingPoint = 270; family = 'Alcool bicyclique';
  } else if (profileLower.includes('musc') || profileLower.includes('ambre')) {
    molecularWeight = 250; boilingPoint = 310; family = 'Musc synthétique';
  } else if (profileLower.includes('menthe') || profileLower.includes('frais')) {
    molecularWeight = 156; boilingPoint = 212; family = 'Monoterpénol';
  }
  
  // Variation basée sur le nom
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  molecularWeight += (hash % 30) - 15;
  boilingPoint += (hash % 40) - 20;
  
  return { molecularWeight, boilingPoint, family };
}

export async function enrichMoleculeData() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Récupérer les molécules avec données manquantes
  const moleculesWithMissingData = await db.select().from(molecules).where(
    or(
      eq(molecules.molecularWeight, 0),
      isNull(molecules.molecularWeight),
      eq(molecules.boilingPoint, 0),
      isNull(molecules.boilingPoint),
      eq(molecules.family, ''),
      isNull(molecules.family)
    )
  );
  
  let updated = 0;
  const results: { name: string; molecularWeight: number; boilingPoint: number; family: string }[] = [];
  
  for (const mol of moleculesWithMissingData) {
    const estimated = estimatePropertiesFromProfile(mol.name, mol.olfactiveProfile);
    
    const updateData: Partial<typeof molecules.$inferInsert> = {};
    
    if (!mol.molecularWeight || mol.molecularWeight === 0) {
      updateData.molecularWeight = estimated.molecularWeight;
    }
    
    if (!mol.boilingPoint || mol.boilingPoint === 0) {
      updateData.boilingPoint = estimated.boilingPoint;
    }
    
    if (!mol.family || mol.family === '') {
      updateData.family = estimated.family;
    }
    
    // Calculer volatilité
    if (!mol.volatility || mol.volatility === 0) {
      const bp = mol.boilingPoint || estimated.boilingPoint;
      updateData.volatility = Math.round(Math.max(20, Math.min(95, 100 - (bp - 100) * 0.35)));
    }
    
    // Calculer intensité
    if (!mol.intensity || mol.intensity === 0) {
      let intensity = 50;
      const family = (mol.family || estimated.family).toLowerCase();
      if (family.includes('aldéhyde') || family.includes('phénol')) intensity = 75;
      else if (family.includes('musc') || family.includes('ambre')) intensity = 85;
      else if (family.includes('monoterpène')) intensity = 55;
      else if (family.includes('sesquiterpène')) intensity = 65;
      
      const hash = mol.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      intensity += (hash % 20) - 10;
      updateData.intensity = Math.round(Math.max(30, Math.min(95, intensity)));
    }
    
    if (Object.keys(updateData).length > 0) {
      await db.update(molecules).set(updateData).where(eq(molecules.id, mol.id));
      updated++;
      results.push({
        name: mol.name,
        molecularWeight: updateData.molecularWeight || mol.molecularWeight || 0,
        boilingPoint: updateData.boilingPoint || mol.boilingPoint || 0,
        family: updateData.family || mol.family || 'Non classé',
      });
    }
  }
  
  return { updated, results };
}



