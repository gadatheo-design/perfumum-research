// @ts-nocheck
/**
 * Module: misc
 * Généré automatiquement depuis server/db.ts
 * Sections: Récupérer toutes les familles chimiques de la table dédiée, PHASE 4: COLLABORATION & PARTAGE - Database Functions, Dictionnaire de données scientifiques connues (+19 autres)
 */

import { eq, and, or, isNull, isNotNull, not, desc, asc, sql, like, gte, lte, inArray, notInArray, count, type SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  userFavorites,
  milestones,
  prototypes,
  families,
  tabacs,
  molecules,
  accords,
  recettes,
  civilisations,
  petrichor,
  volcanique,
  installations,
  laboratoire,
  glossary,
  absorbeProfiles,
  prototypeChemicalFamilies,
  chemicalFamilies,
  moleculeChemicalFamilies,
  accordCivilisations,
  researchTimeline,
  experimentalAccords,
  moleculesRecettes,
  recettesFormulesReference,
  Prototype,
  Family,
  Tabac,
  Molecule,
  Accord,
  Recette,
  InsertRecette,
  Civilisation,
  Petrichor,
  Volcanique,
  Installation,
  Laboratoire,
  GlossaryTerm,
  ResearchMilestone,
  ExperimentalAccord,
  synergies,
  Synergie,
  terpeneSynergies,
  userNotes,
  TerpeneSynergy,
  sharedCollections,
  moleculeNotes,
  citations,
  analyticsEvents,
  suppliers,
  supplierMaterials,
  Supplier,
  InsertSupplier,
  SupplierMaterial,
  InsertSupplierMaterial,
  rechercheRadicale,
  modificationHistory,
  moleculeSynergies,
  MoleculeSynergie,
  savedFormulas,
  SavedFormula,
  InsertSavedFormula,
  climateStudies,
  ClimateStudy,
  InsertClimateStudy,
  molecularProtocols,
  MolecularProtocol,
  InsertMolecularProtocol,
  fieldArchives,
  FieldArchive,
  InsertFieldArchive,
  extractionTests,
  ExtractionTest,
  InsertExtractionTest,
  situatedSmells,
  SituatedSmell,
  InsertSituatedSmell,
  leafEconomies,
  LeafEconomy,
  InsertLeafEconomy,
  leafEconomyMolecules,
  geographicOrigins,
  GeographicOrigin,
  InsertGeographicOrigin,
  moleculeOrigins,
  MoleculeOrigin,
  InsertMoleculeOrigin,
  ifraRestrictions,
  IfraRestriction,
  InsertIfraRestriction,
  plants,
  Plant,
  InsertPlant,
  geographicZones,
  plantGeographicZones,
  terpProfiles,
  TerpProfile,
  InsertTerpProfile,
  finalRecipes,
  FinalRecipe,
  InsertFinalRecipe,
  terpProfilePlants,
  terpProfileMolecules,
  plantMolecules,
  finalRecipeTerpProfiles,
  // Point 3 étendu
  plantVarieties,
  PlantVariety,
  InsertPlantVariety,
  terroirs,
  Terroir,
  InsertTerroir,
  extractionMethods,
  ExtractionMethod,
  InsertExtractionMethod,
  plantAnalyses,
  PlantAnalysis,
  InsertPlantAnalysis,
  plantSamples,
  PlantSample,
  InsertPlantSample,
  extendedSuppliers,
  ExtendedSupplier,
  InsertExtendedSupplier,
  plantTerroirs,
  PlantTerroir,
  InsertPlantTerroir,
  plantExtractions,
  PlantExtraction,
  InsertPlantExtraction,
  extendedSupplierMaterials,
  ExtendedSupplierMaterial,
  InsertExtendedSupplierMaterial,
  // Nouvelles tables pour les relations molécule-plante-terroir
  rawMaterials,
  RawMaterial,
  InsertRawMaterial,
  rawMaterialMolecules,
  RawMaterialMolecule,
  InsertRawMaterialMolecule,
  moleculePlantSources,
  MoleculePlantSource,
  InsertMoleculePlantSource,
  terroirSpecialties,
  TerroirSpecialty,
  InsertTerroirSpecialty,
  // Chémotypes
  chemotypes,
  Chemotype,
  // Conservation & Archives (Jour 1-2)
  olfactiveArchives,
  OlfactiveArchive,
  InsertOlfactiveArchive,
  civilizationalMarkers,
  CivilizationalMarker,
  InsertCivilizationalMarker,
  varietyGenealogy,
  VarietyGenealogy,
  InsertVarietyGenealogy,
  InsertChemotype,
  // Catégories IFRA
  ifraCategories,
  IfraCategory,
  InsertIfraCategory,
  // Sample Images (Galerie)
  sampleImages,
  SampleImage,
  InsertSampleImage,
  // Sustainable Alternatives
  sustainableAlternatives,
  SustainableAlternative,
  InsertSustainableAlternative,
  // Bibliography & Research Axes
  bibliographyEntries,
  BibliographyEntry,
  InsertBibliographyEntry,
  researchAxes,
  ResearchAxis,
  InsertResearchAxis,
  researchEntries,
  ResearchEntry,
  InsertResearchEntry,
  bibliographyAxisLinks,
  BibliographyAxisLink,
  InsertBibliographyAxisLink,
  // Reference Citations
  referenceCitations,
  ReferenceCitation,
  InsertReferenceCitation,
  // V3 References (Pack Niche Innovations)
  thematicAxes,
  ThematicAxis,
  InsertThematicAxis,
  v3References,
  V3Reference,
  InsertV3Reference,
  referenceTags,
  ReferenceTag,
  InsertReferenceTag,
  v3ReferenceTagLinks,
  V3ReferenceTagLink,
  InsertV3ReferenceTagLink,
  referenceNotes,
  ReferenceNote,
  InsertReferenceNote,
  axisConnections,
  AxisConnection,
  InsertAxisConnection,
  // Reference Entity Links & Olfactory Traditions
  referenceEntityLinks,
  ReferenceEntityLink,
  InsertReferenceEntityLink,
  olfactoryTraditions,
  OlfactoryTradition,
  InsertOlfactoryTradition,
  // Curated Journeys
  curatedJourneys,
  CuratedJourney,
  InsertCuratedJourney,
  journeyItems,
  JourneyItem,
  InsertJourneyItem,
  // Axis Reference Links
  axisReferenceLinks,
  AxisReferenceLink,
  InsertAxisReferenceLink,
  // Recette <-> Molecule (table recette_molecules)
  recetteMolecules,
  RecetteMolecule,
  InsertRecetteMolecule,
  // Recette <-> Raw Materials (liaison directe)
  recetteRawMaterials,
  RecetteRawMaterial,
  InsertRecetteRawMaterial,
} from "../../drizzle/schema";
import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';
import { expandWithScientificNames, getScientificDictionaryStats } from '../../shared/botanicalLatinNames';


// ====================================================================
// Récupérer toutes les familles chimiques de la table dédiée
// ====================================================================
// ============================================================================

// Récupérer toutes les familles chimiques de la table dédiée
export async function getAllChemicalFamilies() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(chemicalFamilies)
    .orderBy(chemicalFamilies.name);
}

// Récupérer une famille chimique par ID
export async function getChemicalFamilyById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select()
    .from(chemicalFamilies)
    .where(eq(chemicalFamilies.id, id));
  return results[0] || null;
}

// Récupérer une famille chimique par type
export async function getChemicalFamilyByType(type: string) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select()
    .from(chemicalFamilies)
    .where(sql`${chemicalFamilies.type} = ${type}`);
  return results[0] || null;
}

// Récupérer les familles chimiques avec le nombre de molécules liées
export async function getChemicalFamiliesWithMoleculeCount() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: chemicalFamilies.id,
      name: chemicalFamilies.name,
      type: chemicalFamilies.type,
      subcategory: chemicalFamilies.subcategory,
      description: chemicalFamilies.description,
      olfactiveRole: chemicalFamilies.olfactiveRole,
      volatility: chemicalFamilies.volatility,
      polarity: chemicalFamilies.polarity,
      molecularWeightRange: chemicalFamilies.molecularWeightRange,
      typicalNotes: chemicalFamilies.typicalNotes,
      exampleMolecules: chemicalFamilies.exampleMolecules,
      moleculeCount: sql<number>`(
        SELECT COUNT(*) FROM molecule_chemical_families mcf 
        WHERE mcf.chemicalFamilyId = ${chemicalFamilies.id}
      )`.as('moleculeCount'),
    })
    .from(chemicalFamilies)
    .orderBy(chemicalFamilies.name);
  
  return result;
}

// Ancienne fonction pour compatibilité - récupère les familles depuis le champ molecules.family
export async function getChemicalFamilies() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      family: molecules.family,
      count: sql<number>`count(*)`.as('count'),
    })
    .from(molecules)
    .where(sql`${molecules.family} IS NOT NULL`)
    .groupBy(molecules.family)
    .orderBy(molecules.family);
  
  return result;
}

// Récupérer les molécules par famille chimique (via table de liaison)
export async function getMoleculesByChemicalFamilyId(familyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: molecules.id,
      name: molecules.name,
      iupacName: molecules.iupacName,
      casNumber: molecules.casNumber,
      chemicalClass: molecules.chemicalClass,
      family: molecules.family,
      chemicalFormula: molecules.chemicalFormula,
      olfactiveProfile: molecules.olfactiveProfile,
      molecularWeight: molecules.molecularWeight,
      boilingPoint: molecules.boilingPoint,
      volatility: molecules.volatility,
      intensity: molecules.intensity,
      radarIntensity: molecules.radarIntensity,
      radarFreshness: molecules.radarFreshness,
      radarWarmth: molecules.radarWarmth,
      radarSweetness: molecules.radarSweetness,
      radarSpiciness: molecules.radarSpiciness,
      radarEarthiness: molecules.radarEarthiness,
    })
    .from(moleculeChemicalFamilies)
    .innerJoin(molecules, eq(moleculeChemicalFamilies.moleculeId, molecules.id))
    .where(eq(moleculeChemicalFamilies.chemicalFamilyId, familyId))
    .orderBy(molecules.name);
}

// Ancienne fonction pour compatibilité - récupère par le champ molecules.family
export async function getMoleculesByFamily(family: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(molecules)
    .where(eq(molecules.family, family))
    .orderBy(molecules.name);
}

// Lier une molécule à une famille chimique
export async function linkMoleculeToChemicalFamily(moleculeId: number, chemicalFamilyId: number) {
  const db = await getDb();
  if (!db) return null;
  
  // Vérifier si la liaison existe déjà
  const existing = await db
    .select()
    .from(moleculeChemicalFamilies)
    .where(
      and(
        eq(moleculeChemicalFamilies.moleculeId, moleculeId),
        eq(moleculeChemicalFamilies.chemicalFamilyId, chemicalFamilyId)
      )
    );
  
  if (existing.length > 0) {
    return { success: true, message: 'Liaison déjà existante' };
  }
  
  await db.insert(moleculeChemicalFamilies).values({
    moleculeId,
    chemicalFamilyId,
  });
  
  return { success: true, message: 'Liaison créée' };
}

// Supprimer la liaison entre une molécule et une famille chimique
export async function unlinkMoleculeFromChemicalFamily(moleculeId: number, chemicalFamilyId: number) {
  const db = await getDb();
  if (!db) return null;
  
  await db
    .delete(moleculeChemicalFamilies)
    .where(
      and(
        eq(moleculeChemicalFamilies.moleculeId, moleculeId),
        eq(moleculeChemicalFamilies.chemicalFamilyId, chemicalFamilyId)
      )
    );
  
  return { success: true, message: 'Liaison supprimée' };
}

// Récupérer les familles chimiques d'une molécule
export async function getChemicalFamiliesForMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: chemicalFamilies.id,
      name: chemicalFamilies.name,
      type: chemicalFamilies.type,
      subcategory: chemicalFamilies.subcategory,
      description: chemicalFamilies.description,
      olfactiveRole: chemicalFamilies.olfactiveRole,
      volatility: chemicalFamilies.volatility,
      typicalNotes: chemicalFamilies.typicalNotes,
    })
    .from(moleculeChemicalFamilies)
    .innerJoin(chemicalFamilies, eq(moleculeChemicalFamilies.chemicalFamilyId, chemicalFamilies.id))
    .where(eq(moleculeChemicalFamilies.moleculeId, moleculeId))
    .orderBy(chemicalFamilies.name);
}

// Créer une nouvelle famille chimique
export async function createChemicalFamily(data: {
  name: string;
  type: string;
  subcategory?: string;
  description?: string;
  olfactiveRole?: string;
  volatility?: string;
  polarity?: string;
  molecularWeightRange?: string;
  typicalNotes?: string;
  exampleMolecules?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(chemicalFamilies).values({
    name: data.name,
    type: data.type as any,
    subcategory: data.subcategory || null,
    description: data.description || null,
    olfactiveRole: data.olfactiveRole || null,
    volatility: data.volatility || null,
    polarity: data.polarity || null,
    molecularWeightRange: data.molecularWeightRange || null,
    typicalNotes: data.typicalNotes || null,
    exampleMolecules: data.exampleMolecules || null,
  });
  
  return { id: Number((result as any).insertId || (result as any)[0]?.insertId || 0), ...data };
}

// Mettre à jour une famille chimique
export async function updateChemicalFamily(id: number, data: {
  name?: string;
  type?: string;
  subcategory?: string;
  description?: string;
  olfactiveRole?: string;
  volatility?: string;
  polarity?: string;
  molecularWeightRange?: string;
  typicalNotes?: string;
  exampleMolecules?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.subcategory !== undefined) updateData.subcategory = data.subcategory;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.olfactiveRole !== undefined) updateData.olfactiveRole = data.olfactiveRole;
  if (data.volatility !== undefined) updateData.volatility = data.volatility;
  if (data.polarity !== undefined) updateData.polarity = data.polarity;
  if (data.molecularWeightRange !== undefined) updateData.molecularWeightRange = data.molecularWeightRange;
  if (data.typicalNotes !== undefined) updateData.typicalNotes = data.typicalNotes;
  if (data.exampleMolecules !== undefined) updateData.exampleMolecules = data.exampleMolecules;
  
  await db
    .update(chemicalFamilies)
    .set(updateData)
    .where(eq(chemicalFamilies.id, id));
  
  return await getChemicalFamilyById(id);
}

// Supprimer une famille chimique
export async function deleteChemicalFamily(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  // D'abord supprimer les liaisons
  await db
    .delete(moleculeChemicalFamilies)
    .where(eq(moleculeChemicalFamilies.chemicalFamilyId, id));
  
  // Puis supprimer la famille
  await db
    .delete(chemicalFamilies)
    .where(eq(chemicalFamilies.id, id));
  
  return { success: true, message: 'Famille chimique supprimée' };
}



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



// ====================================================================
// HISTORIQUE DES MODIFICATIONS
// ====================================================================
// ============================================================================
// HISTORIQUE DES MODIFICATIONS
// ============================================================================

export async function getModificationHistory(
  entityType: "prototype" | "molecule" | "accord" | "recette" | "famille" | "matiere" | "synergie" | "tradition",
  entityId: number,
  limit: number = 50
) {
  const db = await getDb();
  if (!db) return [];
  return await db.select()
    .from(modificationHistory)
    .where(and(
      eq(modificationHistory.entityType, entityType),
      eq(modificationHistory.entityId, entityId)
    ))
    .orderBy(desc(modificationHistory.createdAt))
    .limit(limit);
}

export async function getRecentModifications(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return await db.select()
    .from(modificationHistory)
    .orderBy(desc(modificationHistory.createdAt))
    .limit(limit);
}

export async function getModificationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select()
    .from(modificationHistory)
    .where(eq(modificationHistory.id, id))
    .limit(1);
  return results[0] || null;
}

export async function markModificationAsUndone(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(modificationHistory)
    .set({ 
      undoneAt: new Date(),
    })
    .where(eq(modificationHistory.id, id));
}

export async function recordModification(
  entityType: "prototype" | "molecule" | "accord" | "recette" | "famille" | "matiere" | "synergie" | "tradition",
  entityId: number,
  operation: "create" | "update" | "delete",
  stateBefore: any,
  stateAfter: any,
  userId: number = 1
) {
  const db = await getDb();
  if (!db) return;
  await db.insert(modificationHistory).values({
    userId,
    entityType,
    entityId,
    operation,
    stateBefore: stateBefore ? JSON.stringify(stateBefore) : null,
    stateAfter: stateAfter ? JSON.stringify(stateAfter) : null,
    createdAt: new Date(),
  });
}



// ====================================================================
// FONCTIONS CREATE MANQUANTES (pour undo history)
// ====================================================================
// ============================================================================
// FONCTIONS CREATE MANQUANTES (pour undo history)
// ============================================================================

export async function createAccord(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(accords).values({
    name: data.nom || data.name,
    familyId: data.familleId || data.familyId || null,
    olfactiveProfile: data.olfactiveProfile || data.description || null,
    notes: data.notes || null,
  });
  
  return result;
}

export async function createFamily(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(families).values({
    name: data.nom || data.name,
    type: data.type || "other",
    description: data.description || null,
  });
  
  return result;
}



// ====================================================================
// RECHERCHE RADICALE
// ====================================================================
// ============================================================================
// RECHERCHE RADICALE
// ============================================================================

export async function getAllRechercheRadicale() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(rechercheRadicale);
}

export async function getRechercheRadicaleById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(rechercheRadicale).where(eq(rechercheRadicale.id, id)).limit(1);
  return result[0] || null;
}

export async function getRechercheRadicaleBySerie(serie: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(rechercheRadicale).where(eq(rechercheRadicale.serie, serie));
}



// ====================================================================
// CLIMATE STUDIES (Études climatiques)
// ====================================================================
// ============================================================================
// CLIMATE STUDIES (Études climatiques)
// ============================================================================

export async function getAllClimateStudies() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(climateStudies);
}

export async function getClimateStudyById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(climateStudies).where(eq(climateStudies.id, id));
  return results[0] || null;
}


// ====================================================================
// MOLECULAR PROTOCOLS (Protocoles moléculaires)
// ====================================================================
// ============================================================================
// MOLECULAR PROTOCOLS (Protocoles moléculaires)
// ============================================================================

export async function getAllMolecularProtocols() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(molecularProtocols);
}

export async function getMolecularProtocolById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(molecularProtocols).where(eq(molecularProtocols.id, id));
  return results[0] || null;
}

export async function getMolecularProtocolsByStudyId(studyId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(molecularProtocols).where(eq(molecularProtocols.linkedStudyId, studyId));
}


// ====================================================================
// FIELD ARCHIVES (Archives terrain)
// ====================================================================
// ============================================================================
// FIELD ARCHIVES (Archives terrain)
// ============================================================================

export async function getAllFieldArchives() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(fieldArchives);
}

export async function getFieldArchiveById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(fieldArchives).where(eq(fieldArchives.id, id));
  return results[0] || null;
}


// ====================================================================
// EXTRACTION TESTS (Tests d'extraction)
// ====================================================================
// ============================================================================
// EXTRACTION TESTS (Tests d'extraction)
// ============================================================================

export async function getAllExtractionTests() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(extractionTests);
}

export async function getExtractionTestById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(extractionTests).where(eq(extractionTests.id, id));
  return results[0] || null;
}

export async function getExtractionTestsByArchiveId(archiveId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(extractionTests).where(eq(extractionTests.fieldArchiveId, archiveId));
}


// ====================================================================
// LEAF ECONOMIES (San Andrés / Seaflower Research)
// ====================================================================
// ============================================================================
// LEAF ECONOMIES (San Andrés / Seaflower Research)
// ============================================================================

export async function getAllLeafEconomies() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies).orderBy(desc(leafEconomies.createdAt));
}

export async function getLeafEconomyById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(leafEconomies).where(eq(leafEconomies.id, id));
  return results[0] || null;
}

export async function getLeafEconomyBySampleId(sampleId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(leafEconomies).where(eq(leafEconomies.sampleId, sampleId));
  return results[0] || null;
}

export async function getLeafEconomiesByCategory(category: 'aromatique' | 'tabac' | 'cannabis') {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies).where(eq(leafEconomies.category, category)).orderBy(desc(leafEconomies.createdAt));
}

export async function getLeafEconomiesByIsland(island: 'san_andres' | 'providencia' | 'autre') {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies).where(eq(leafEconomies.island, island)).orderBy(desc(leafEconomies.createdAt));
}

export async function getLeafEconomiesByStatus(status: 'brut' | 'a_analyser' | 'analyse' | 'traduction' | 'archive') {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies).where(eq(leafEconomies.status, status)).orderBy(desc(leafEconomies.createdAt));
}

export async function createLeafEconomy(data: InsertLeafEconomy) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(leafEconomies).values(data);
  const insertId = Number(result[0].insertId);
  return await getLeafEconomyById(insertId);
}

export async function updateLeafEconomy(id: number, data: Partial<InsertLeafEconomy>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(leafEconomies).set(data).where(eq(leafEconomies.id, id));
  return await getLeafEconomyById(id);
}

export async function deleteLeafEconomy(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(leafEconomies).where(eq(leafEconomies.id, id));
}

// Search leaf economies by species or variety
export async function searchLeafEconomies(searchTerm: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies)
    .where(
      or(
        like(leafEconomies.species, `%${searchTerm}%`),
        like(leafEconomies.claimedVariety, `%${searchTerm}%`),
        like(leafEconomies.sampleId, `%${searchTerm}%`)
      )
    )
    .orderBy(desc(leafEconomies.createdAt));
}

// Get leaf economies with analysis available
export async function getLeafEconomiesWithAnalysis() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies).where(eq(leafEconomies.analysisAvailable, 1)).orderBy(desc(leafEconomies.createdAt));
}

// Get leaf economies without analysis
export async function getLeafEconomiesWithoutAnalysis() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies).where(eq(leafEconomies.analysisAvailable, 0)).orderBy(desc(leafEconomies.createdAt));
}



// ====================================================================
// SAMPLE IMAGES FUNCTIONS (Galerie d'images)
// ====================================================================
// ============================================================================
// SAMPLE IMAGES FUNCTIONS (Galerie d'images)
// ============================================================================

/**
 * Récupère toutes les images de la galerie
 */
export async function getAllSampleImages() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(sampleImages)
    .orderBy(desc(sampleImages.createdAt));
}

/**
 * Récupère les images par catégorie
 */
export async function getSampleImagesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(sampleImages)
    .where(eq(sampleImages.category, category as any))
    .orderBy(desc(sampleImages.createdAt));
}

/**
 * Récupère les images d'un échantillon leaf_economy
 */
export async function getSampleImagesByLeafEconomy(leafEconomyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(sampleImages)
    .where(eq(sampleImages.leafEconomyId, leafEconomyId))
    .orderBy(desc(sampleImages.createdAt));
}

/**
 * Récupère les images d'une plante
 */
export async function getSampleImagesByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(sampleImages)
    .where(eq(sampleImages.plantId, plantId))
    .orderBy(desc(sampleImages.createdAt));
}

/**
 * Récupère une image par son ID
 */
export async function getSampleImageById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db.select()
    .from(sampleImages)
    .where(eq(sampleImages.id, id))
    .limit(1);
  
  return results[0] || null;
}

/**
 * Crée une nouvelle image dans la galerie
 */
export async function createSampleImage(data: InsertSampleImage) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const result = await db.insert(sampleImages).values(data);
  const insertId = Number(result[0].insertId);
  return await getSampleImageById(insertId);
}

/**
 * Met à jour une image
 */
export async function updateSampleImage(id: number, data: Partial<InsertSampleImage>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.update(sampleImages).set(data).where(eq(sampleImages.id, id));
  return await getSampleImageById(id);
}

/**
 * Supprime une image
 */
export async function deleteSampleImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.delete(sampleImages).where(eq(sampleImages.id, id));
}

/**
 * Recherche des images par tags
 */
export async function searchSampleImagesByTags(tags: string[]) {
  const db = await getDb();
  if (!db) return [];
  
  // Recherche les images qui contiennent au moins un des tags
  const results = await db.select()
    .from(sampleImages)
    .orderBy(desc(sampleImages.createdAt));
  
  // Filtrage côté application car JSON search est complexe en MySQL
  return results.filter(img => {
    if (!img.tags) return false;
    const imgTags = img.tags as string[];
    return tags.some(tag => imgTags.includes(tag));
  });
}

/**
 * Récupère les statistiques de la galerie
 */
export async function getSampleImagesStats() {
  const db = await getDb();
  if (!db) return { total: 0, byCategory: {} };
  
  const allImages = await db.select().from(sampleImages);
  
  const byCategory: Record<string, number> = {};
  allImages.forEach(img => {
    const cat = img.category || 'autre';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });
  
  return {
    total: allImages.length,
    byCategory,
  };
}



// ====================================================================
// SUSTAINABLE ALTERNATIVES HELPERS
// ====================================================================
// ============================================================================
// SUSTAINABLE ALTERNATIVES HELPERS
// ============================================================================

export async function getAllSustainableAlternatives() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(sustainableAlternatives).orderBy(sustainableAlternatives.threatenedPlantName);
}

export async function getSustainableAlternativeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.select().from(sustainableAlternatives).where(eq(sustainableAlternatives.id, id));
  return result || null;
}

export async function getAlternativesByThreatenedPlant(threatenedPlantId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(sustainableAlternatives)
    .where(eq(sustainableAlternatives.threatenedPlantId, threatenedPlantId))
    .orderBy(sustainableAlternatives.olfactiveSimilarity);
}

export async function getAlternativesByType(alternativeType: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(sustainableAlternatives)
    .where(eq(sustainableAlternatives.alternativeType, alternativeType as any))
    .orderBy(sustainableAlternatives.threatenedPlantName);
}

export async function searchSustainableAlternatives(filters: {
  threatenedPlantId?: number;
  alternativeType?: string;
  availability?: string;
  olfactiveSimilarity?: string;
  searchQuery?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  
  if (filters.threatenedPlantId) {
    conditions.push(eq(sustainableAlternatives.threatenedPlantId, filters.threatenedPlantId));
  }
  if (filters.alternativeType) {
    conditions.push(eq(sustainableAlternatives.alternativeType, filters.alternativeType as any));
  }
  if (filters.availability) {
    conditions.push(eq(sustainableAlternatives.availability, filters.availability as any));
  }
  if (filters.olfactiveSimilarity) {
    conditions.push(eq(sustainableAlternatives.olfactiveSimilarity, filters.olfactiveSimilarity as any));
  }
  if (filters.searchQuery) {
    conditions.push(
      or(
        like(sustainableAlternatives.threatenedPlantName, `%${filters.searchQuery}%`),
        like(sustainableAlternatives.alternativeName, `%${filters.searchQuery}%`),
        like(sustainableAlternatives.notes, `%${filters.searchQuery}%`)
      )
    );
  }
  
  let query = db.select().from(sustainableAlternatives);
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return await query.orderBy(sustainableAlternatives.threatenedPlantName);
}

export async function getThreatenedPlantsWithAlternatives() {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer toutes les plantes menacées (CR, EN, VU, NT)
  const threatenedPlants = await db
    .select()
    .from(plants)
    .where(
      or(
        eq(plants.conservationStatus, 'CR'),
        eq(plants.conservationStatus, 'EN'),
        eq(plants.conservationStatus, 'VU'),
        eq(plants.conservationStatus, 'NT'),
        eq(plants.citesAppendix, 'I'),
        eq(plants.citesAppendix, 'II')
      )
    )
    .orderBy(plants.name);
  
  // Pour chaque plante menacée, récupérer ses alternatives
  const result = await Promise.all(
    threatenedPlants.map(async (plant) => {
      const alternatives = await db
        .select()
        .from(sustainableAlternatives)
        .where(eq(sustainableAlternatives.threatenedPlantId, plant.id));
      
      return {
        ...plant,
        alternatives,
        alternativeCount: alternatives.length,
      };
    })
  );
  
  return result;
}

export async function getAlternativesGroupedBySpecies() {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer toutes les alternatives
  const allAlternatives = await db
    .select()
    .from(sustainableAlternatives)
    .orderBy(sustainableAlternatives.threatenedPlantName);
  
  // Grouper par espèce menacée
  const grouped: Record<string, {
    threatenedPlantId: number;
    threatenedPlantName: string;
    alternatives: typeof allAlternatives;
  }> = {};
  
  for (const alt of allAlternatives) {
    const key = `${alt.threatenedPlantId}`;
    if (!grouped[key]) {
      grouped[key] = {
        threatenedPlantId: alt.threatenedPlantId,
        threatenedPlantName: alt.threatenedPlantName,
        alternatives: [],
      };
    }
    grouped[key].alternatives.push(alt);
  }
  
  return Object.values(grouped);
}

export async function createSustainableAlternative(data: {
  threatenedPlantId: number;
  threatenedPlantName: string;
  alternativePlantId?: number;
  alternativeName: string;
  alternativeType: string;
  olfactiveSimilarity?: string;
  olfactiveNotes?: string;
  availability?: string;
  sustainabilityScore?: number;
  certifications?: string[];
  priceComparison?: string;
  suppliers?: string[];
  usageRecommendations?: string;
  keyMolecules?: { name: string; percentage?: number; note?: string }[];
  references?: { title: string; author?: string; year?: number; url?: string; type: string }[];
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(sustainableAlternatives).values(data as any);
  return getSustainableAlternativeById(result.insertId);
}

export async function updateSustainableAlternative(id: number, data: {
  threatenedPlantId?: number;
  threatenedPlantName?: string;
  alternativePlantId?: number;
  alternativeName?: string;
  alternativeType?: string;
  olfactiveSimilarity?: string;
  olfactiveNotes?: string;
  availability?: string;
  sustainabilityScore?: number;
  certifications?: string[];
  priceComparison?: string;
  suppliers?: string[];
  usageRecommendations?: string;
  keyMolecules?: { name: string; percentage?: number; note?: string }[];
  references?: { title: string; author?: string; year?: number; url?: string; type: string }[];
  notes?: string;
  verified?: boolean;
  verifiedBy?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  await db
    .update(sustainableAlternatives)
    .set(data as any)
    .where(eq(sustainableAlternatives.id, id));
  
  return getSustainableAlternativeById(id);
}

export async function deleteSustainableAlternative(id: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(sustainableAlternatives).where(eq(sustainableAlternatives.id, id));
  return true;
}

export async function getAlternativesStats() {
  const db = await getDb();
  if (!db) return null;
  
  const [totalCount] = await db.select({ count: count() }).from(sustainableAlternatives);
  
  // Compter par type
  const byType = await db
    .select({
      type: sustainableAlternatives.alternativeType,
      count: count(),
    })
    .from(sustainableAlternatives)
    .groupBy(sustainableAlternatives.alternativeType);
  
  // Compter par disponibilité
  const byAvailability = await db
    .select({
      availability: sustainableAlternatives.availability,
      count: count(),
    })
    .from(sustainableAlternatives)
    .groupBy(sustainableAlternatives.availability);
  
  // Compter par similarité olfactive
  const bySimilarity = await db
    .select({
      similarity: sustainableAlternatives.olfactiveSimilarity,
      count: count(),
    })
    .from(sustainableAlternatives)
    .groupBy(sustainableAlternatives.olfactiveSimilarity);
  
  // Nombre d'espèces menacées avec alternatives
  const speciesWithAlternatives = await db
    .selectDistinct({ id: sustainableAlternatives.threatenedPlantId })
    .from(sustainableAlternatives);
  
  return {
    totalAlternatives: totalCount.count,
    speciesWithAlternatives: speciesWithAlternatives.length,
    byType,
    byAvailability,
    bySimilarity,
  };
}



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
    latinName: plants.latinName,
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
    latinName: plants.latinName,
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

  const plantsList = pending.plants.slice(0, 5).map((p: any) => 
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



// ====================================================================
// LEAF ECONOMY IMAGE MANAGEMENT
// ====================================================================
// ============================================================================
// LEAF ECONOMY IMAGE MANAGEMENT
// ============================================================================

/**
 * Met à jour l'URL de l'image principale d'un échantillon LeafEconomy
 */
export async function updateLeafEconomyImage(leafEconomyId: number, imageUrl: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.update(leafEconomies)
    .set({ imageUrl })
    .where(eq(leafEconomies.id, leafEconomyId));
  
  return await getLeafEconomyById(leafEconomyId);
}

/**
 * Supprime l'image principale d'un échantillon LeafEconomy
 */
export async function deleteLeafEconomyImage(leafEconomyId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.update(leafEconomies)
    .set({ imageUrl: null })
    .where(eq(leafEconomies.id, leafEconomyId));
  
  return await getLeafEconomyById(leafEconomyId);
}

/**
 * Récupère les échantillons LeafEconomy avec images
 */
export async function getLeafEconomiesWithImages() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  return await db.select()
    .from(leafEconomies)
    .where(sql`${leafEconomies.imageUrl} IS NOT NULL AND ${leafEconomies.imageUrl} != ''`)
    .orderBy(desc(leafEconomies.updatedAt));
}

/**
 * Récupère les échantillons LeafEconomy sans images
 */
export async function getLeafEconomiesWithoutImages() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  return await db.select()
    .from(leafEconomies)
    .where(sql`${leafEconomies.imageUrl} IS NULL OR ${leafEconomies.imageUrl} = ''`)
    .orderBy(desc(leafEconomies.updatedAt));
}



// ====================================================================
// FONCTIONS DE LIENS CROISÉS (CROSS-LINKS)
// ====================================================================
// ============================================
// FONCTIONS DE LIENS CROISÉS (CROSS-LINKS)
// ============================================

/**
 * Récupère les recettes qui utilisent une molécule spécifique
 */
export async function getRecettesByMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: recettes.id,
      name: recettes.name,
      category: recettes.category,
      description: recettes.description,
      proportion: moleculesRecettes.proportion,
      role: moleculesRecettes.role,
      notes: moleculesRecettes.notes,
    })
    .from(moleculesRecettes)
    .innerJoin(recettes, eq(moleculesRecettes.recetteId, recettes.id))
    .where(eq(moleculesRecettes.moleculeId, moleculeId));
  
  return result;
}

/**
 * Récupère les molécules similaires (même famille chimique ou profil olfactif proche)
 */
export async function getSimilarMoleculesByProfile(moleculeId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la molécule de référence
  const refMolecule = await db.select().from(molecules).where(eq(molecules.id, moleculeId)).limit(1);
  if (!refMolecule[0]) return [];
  
  const ref = refMolecule[0];
  
  // Récupérer toutes les autres molécules
  const allMolecules = await db.select().from(molecules).where(sql`${molecules.id} != ${moleculeId}`);
  
  // Calculer un score de similarité basé sur plusieurs critères
  const scored = allMolecules.map(m => {
    let score = 0;
    
    // Bonus si même famille olfactive
    if ((ref as any).olfactiveFamily && (m as any).olfactiveFamily === (ref as any).olfactiveFamily) {
      score += 40;
    }
    
    // Bonus si même classe chimique
    if (ref.chemicalClass && m.chemicalClass === ref.chemicalClass) {
      score += 30;
    }
    
    // Bonus si volatilité similaire
    if (ref.volatility && m.volatility === ref.volatility) {
      score += 20;
    }
    
    // Bonus si intensité similaire (±1)
    if (ref.intensity && m.intensity && Math.abs(ref.intensity - m.intensity) <= 1) {
      score += 10;
    }
    
    return { ...m, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(m => m.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Récupère les recettes similaires (même catégorie, famille, ou profil olfactif proche)
 */
export async function getSimilarRecettesByProfile(recetteId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la recette de référence
  const refRecette = await db.select().from(recettes).where(eq(recettes.id, recetteId)).limit(1);
  if (!refRecette[0]) return [];
  
  const ref = refRecette[0];
  
  // Récupérer toutes les autres recettes
  const allRecettes = await db.select().from(recettes).where(sql`${recettes.id} != ${recetteId}`);
  
  // Calculer un score de similarité
  const scored = allRecettes.map(r => {
    let score = 0;
    
    // Bonus si même catégorie
    if (ref.category && r.category === ref.category) {
      score += 40;
    }
    
    // Bonus si même famille
    if (ref.familyId && r.familyId === ref.familyId) {
      score += 30;
    }
    
    // Bonus si même statut
    if (ref.status && r.status === ref.status) {
      score += 10;
    }
    
    return { ...r, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(r => r.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Récupère les plantes similaires (même famille, catégorie ou origine)
 */
export async function getSimilarPlantsByProfile(plantId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la plante de référence
  const refPlant = await db.select().from(plants).where(eq(plants.id, plantId)).limit(1);
  if (!refPlant[0]) return [];
  
  const ref = refPlant[0];
  
  // Récupérer toutes les autres plantes
  const allPlants = await db.select().from(plants).where(sql`${plants.id} != ${plantId}`);
  
  // Calculer un score de similarité
  const scored = allPlants.map(p => {
    let score = 0;
    
    // Bonus si même famille botanique
    if (ref.family && p.family === ref.family) {
      score += 40;
    }
    
    // Bonus si même catégorie
    if (ref.category && p.category === ref.category) {
      score += 30;
    }
    
    // Bonus si même origine
    if (ref.origin && p.origin === ref.origin) {
      score += 20;
    }
    
    return { ...p, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(p => p.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Récupère les terroirs similaires (même région, climat similaire)
 */
export async function getSimilarTerroirsByProfile(terroirId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer le terroir de référence
  const refTerroir = await db.select().from(terroirs).where(eq(terroirs.id, terroirId)).limit(1);
  if (!refTerroir[0]) return [];
  
  const ref = refTerroir[0];
  
  // Récupérer tous les autres terroirs
  const allTerroirs = await db.select().from(terroirs).where(sql`${terroirs.id} != ${terroirId}`);
  
  // Calculer un score de similarité
  const scored = allTerroirs.map(t => {
    let score = 0;
    
    // Bonus si même pays
    if (ref.country && t.country === ref.country) {
      score += 30;
    }
    
    // Bonus si même type de climat
    if (ref.climateType && t.climateType === ref.climateType) {
      score += 40;
    }
    
    // Bonus si même région
    if (ref.region && t.region === ref.region) {
      score += 20;
    }
    
    return { ...t, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(t => t.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Récupère les matières premières liées à une molécule
 */
export async function getRawMaterialsByMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la molécule
  const molecule = await db.select().from(molecules).where(eq(molecules.id, moleculeId)).limit(1);
  if (!molecule[0]) return [];
  
  const mol = molecule[0];
  
  // Récupérer les matières premières qui contiennent cette molécule dans leurs molécules dominantes
  const allRawMaterials = await db.select().from(rawMaterials);
  
  // Filtrer les matières premières dont le profil olfactif ou les molécules dominantes contiennent le nom de la molécule
  return allRawMaterials.filter(rm => {
    const moleculeNameLower = mol.name.toLowerCase();
    
    // Vérifier dans le profil olfactif
    if (rm.olfactiveProfile) {
      const profileLower = rm.olfactiveProfile.toLowerCase();
      if (profileLower.includes(moleculeNameLower)) return true;
    }
    
    // Vérifier dans les molécules dominantes
    if (rm.dominantMolecules && Array.isArray(rm.dominantMolecules)) {
      const hasMolecule = rm.dominantMolecules.some(
        (dm: any) => dm.name?.toLowerCase().includes(moleculeNameLower) || dm.moleculeId === moleculeId
      );
      if (hasMolecule) return true;
    }
    
    return false;
  });
}

/**
 * Récupère les terroirs liés à une plante
 */
export async function getTerroirsByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: terroirs.id,
      name: terroirs.name,
      country: terroirs.country,
      region: terroirs.region,
      climateType: terroirs.climateType,
      localName: plantTerroirs.localName,
      qualityNotes: plantTerroirs.qualityNotes,
    })
    .from(plantTerroirs)
    .innerJoin(terroirs, eq(plantTerroirs.terroirId, terroirs.id))
    .where(eq(plantTerroirs.plantId, plantId));
  
  return result;
}

/**
 * Récupère les plantes liées à un terroir
 */
export async function getPlantsByTerroir(terroirId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: plants.id,
      name: plants.name,
      latinName: plants.latinName,
      family: plants.family,
      category: plants.category,
      localName: plantTerroirs.localName,
      qualityNotes: plantTerroirs.qualityNotes,
    })
    .from(plantTerroirs)
    .innerJoin(plants, eq(plantTerroirs.plantId, plants.id))
    .where(eq(plantTerroirs.terroirId, terroirId));
  
  return result;
}

/**
 * Récupère les matières premières similaires (même famille olfactive, catégorie ou origine)
 */
export async function getSimilarRawMaterialsByProfile(rawMaterialId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la matière première de référence
  const refMaterial = await db.select().from(rawMaterials).where(eq(rawMaterials.id, rawMaterialId)).limit(1);
  if (!refMaterial[0]) return [];
  
  const ref = refMaterial[0];
  
  // Récupérer toutes les autres matières premières
  const allMaterials = await db.select().from(rawMaterials).where(sql`${rawMaterials.id} != ${rawMaterialId}`);
  
  // Calculer un score de similarité
  const scored = allMaterials.map(m => {
    let score = 0;
    
    // Bonus si même famille olfactive
    if ((ref as any).olfactiveFamily && (m as any).olfactiveFamily === (ref as any).olfactiveFamily) {
      score += 40;
    }
    
    // Bonus si même catégorie
    if (ref.category && m.category === ref.category) {
      score += 30;
    }
    
    // Bonus si même plante source
    if (ref.plantId && m.plantId === ref.plantId) {
      score += 20;
    }
    
    // Bonus si même terroir
    if (ref.terroirId && m.terroirId === ref.terroirId) {
      score += 15;
    }
    
    // Bonus si même pays d'origine
    if (ref.originCountry && m.originCountry === ref.originCountry) {
      score += 10;
    }
    
    return { ...m, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(m => m.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}



// ====================================================================
// AUTOMATIC ENTITY LINKING (Liaisons automatiques par mots-clés)
// ====================================================================
// ============================================================================
// AUTOMATIC ENTITY LINKING (Liaisons automatiques par mots-clés)
// ============================================================================

/**
 * Keywords database for automatic linking
 * Maps common terms to entity types and specific entities
 */
const ENTITY_KEYWORDS: Record<string, { entityType: string; keywords: string[] }[]> = {
  // Molécules communes
  'linalool': [{ entityType: 'molecule', keywords: ['linalool', 'linalol', 'linalyl'] }],
  'limonene': [{ entityType: 'molecule', keywords: ['limonene', 'limonène', 'd-limonene'] }],
  'pinene': [{ entityType: 'molecule', keywords: ['pinene', 'pinène', 'alpha-pinene', 'beta-pinene'] }],
  'geraniol': [{ entityType: 'molecule', keywords: ['geraniol', 'géraniol'] }],
  'citronellol': [{ entityType: 'molecule', keywords: ['citronellol', 'citronellal'] }],
  'eugenol': [{ entityType: 'molecule', keywords: ['eugenol', 'eugénol', 'methyl eugenol'] }],
  'carvone': [{ entityType: 'molecule', keywords: ['carvone', 'carvon'] }],
  'menthol': [{ entityType: 'molecule', keywords: ['menthol', 'menthone'] }],
  'camphor': [{ entityType: 'molecule', keywords: ['camphor', 'camphre', 'camphène'] }],
  'thymol': [{ entityType: 'molecule', keywords: ['thymol', 'thym'] }],
  'caryophyllene': [{ entityType: 'molecule', keywords: ['caryophyllene', 'caryophyllène', 'beta-caryophyllene'] }],
  'myrcene': [{ entityType: 'molecule', keywords: ['myrcene', 'myrcène'] }],
  'terpinene': [{ entityType: 'molecule', keywords: ['terpinene', 'terpinène', 'gamma-terpinene'] }],
  'ocimene': [{ entityType: 'molecule', keywords: ['ocimene', 'ocimène'] }],
  'farnesene': [{ entityType: 'molecule', keywords: ['farnesene', 'farnésène'] }],
  'humulene': [{ entityType: 'molecule', keywords: ['humulene', 'humulène', 'alpha-humulene'] }],
  'bisabolol': [{ entityType: 'molecule', keywords: ['bisabolol', 'bisabolène'] }],
  'nerolidol': [{ entityType: 'molecule', keywords: ['nerolidol', 'nérolidol'] }],
  'valencene': [{ entityType: 'molecule', keywords: ['valencene', 'valencène'] }],
  'guaiol': [{ entityType: 'molecule', keywords: ['guaiol', 'guaïol'] }],
  // Plantes communes
  'lavande': [{ entityType: 'plant', keywords: ['lavande', 'lavender', 'lavandula'] }],
  'rose': [{ entityType: 'plant', keywords: ['rose', 'rosa', 'rosier'] }],
  'jasmin': [{ entityType: 'plant', keywords: ['jasmin', 'jasmine', 'jasminum'] }],
  'menthe': [{ entityType: 'plant', keywords: ['menthe', 'mint', 'mentha'] }],
  'eucalyptus': [{ entityType: 'plant', keywords: ['eucalyptus'] }],
  'citron': [{ entityType: 'plant', keywords: ['citron', 'lemon', 'citrus limon'] }],
  'orange': [{ entityType: 'plant', keywords: ['orange', 'citrus sinensis', 'oranger'] }],
  'bergamote': [{ entityType: 'plant', keywords: ['bergamote', 'bergamot', 'citrus bergamia'] }],
  'patchouli': [{ entityType: 'plant', keywords: ['patchouli', 'pogostemon'] }],
  'vetiver': [{ entityType: 'plant', keywords: ['vetiver', 'vétiver', 'chrysopogon'] }],
  'santal': [{ entityType: 'plant', keywords: ['santal', 'sandalwood', 'santalum'] }],
  'cedre': [{ entityType: 'plant', keywords: ['cèdre', 'cedar', 'cedrus'] }],
  'ylang': [{ entityType: 'plant', keywords: ['ylang', 'cananga'] }],
  'geranium': [{ entityType: 'plant', keywords: ['géranium', 'geranium', 'pelargonium'] }],
  'romarin': [{ entityType: 'plant', keywords: ['romarin', 'rosemary', 'rosmarinus'] }],
  'thym': [{ entityType: 'plant', keywords: ['thym', 'thyme', 'thymus'] }],
  'sauge': [{ entityType: 'plant', keywords: ['sauge', 'sage', 'salvia'] }],
  'basilic': [{ entityType: 'plant', keywords: ['basilic', 'basil', 'ocimum'] }],
  'cannabis': [{ entityType: 'plant', keywords: ['cannabis', 'hemp', 'chanvre', 'marijuana'] }],
  'tabac': [{ entityType: 'plant', keywords: ['tabac', 'tobacco', 'nicotiana'] }],
  // Terroirs
  'grasse': [{ entityType: 'terroir', keywords: ['grasse', 'provence'] }],
  'madagascar': [{ entityType: 'terroir', keywords: ['madagascar'] }],
  'egypte': [{ entityType: 'terroir', keywords: ['egypte', 'egypt', 'égypte'] }],
  'inde': [{ entityType: 'terroir', keywords: ['inde', 'india', 'indien'] }],
  'maroc': [{ entityType: 'terroir', keywords: ['maroc', 'morocco', 'marocain'] }],
  'bulgarie': [{ entityType: 'terroir', keywords: ['bulgarie', 'bulgaria', 'bulgare'] }],
  'turquie': [{ entityType: 'terroir', keywords: ['turquie', 'turkey', 'turc'] }],
  'iran': [{ entityType: 'terroir', keywords: ['iran', 'perse', 'persia'] }],
};

/**
 * Extract keywords from text for matching
 */
function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  // Normalize text: lowercase, remove accents, split on non-alphanumeric
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  return Array.from(new Set(normalized));
}

/**
 * Find common keywords between two sets
 */
function findCommonKeywords(keywords1: string[], keywords2: string[]): string[] {
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  return Array.from(set1).filter(k => set2.has(k));
}

/**
 * Calculate similarity score between two sets of keywords
 */
function calculateKeywordSimilarity(keywords1: string[], keywords2: string[]): number {
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  
  let matches = 0;
  const arr1 = Array.from(set1);
  const arr2 = Array.from(set2);
  for (const word of arr1) {
    if (set2.has(word)) {
      matches++;
    } else {
      // Check for partial matches (substring)
      for (const word2 of arr2) {
        if (word.includes(word2) || word2.includes(word)) {
          matches += 0.5;
          break;
        }
      }
    }
  }
  
  // Jaccard-like similarity
  const union = new Set(Array.from(set1).concat(Array.from(set2))).size;
  return Math.round((matches / union) * 100);
}

/**
 * Suggest entity links for a reference based on keywords
 */
export async function suggestEntityLinksForReference(referenceId: number): Promise<{
  referenceId: number;
  referenceTitle: string;
  suggestions: {
    entityType: 'molecule' | 'plant' | 'terroir' | 'recette' | 'tradition';
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
    reason: string;
  }[];
}> {
  const db = await getDb();
  if (!db) return { referenceId, referenceTitle: '', suggestions: [] };
  
  // Get the reference
  const [ref] = await db
    .select()
    .from(v3References)
    .where(eq(v3References.id, referenceId));
  
  if (!ref) return { referenceId, referenceTitle: '', suggestions: [] };
  
  // Extract keywords from reference
  const refText = [
    ref.title || '',
    ref.notes || '',
    ref.userNotes || '',
    ...(ref.tags || []),
  ].join(' ');
  
  const refKeywords = extractKeywords(refText);
  const suggestions: {
    entityType: 'molecule' | 'plant' | 'terroir' | 'recette' | 'tradition';
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
    reason: string;
  }[] = [];
  
  // Get existing links to exclude
  const existingLinks = await db
    .select({ entityType: referenceEntityLinks.entityType, entityId: referenceEntityLinks.entityId })
    .from(referenceEntityLinks)
    .where(eq(referenceEntityLinks.referenceId, referenceId));
  
  const existingSet = new Set(existingLinks.map(l => `${l.entityType}:${l.entityId}`));
  
  // Search molecules
  const allMolecules = await db
    .select({ id: molecules.id, name: molecules.name, olfactiveProfile: molecules.olfactiveProfile })
    .from(molecules)
    .limit(1000);
  
  for (const mol of allMolecules) {
    if (existingSet.has(`molecule:${mol.id}`)) continue;
    
    const molKeywords = extractKeywords([mol.name, mol.olfactiveProfile || ''].join(' '));
    const score = calculateKeywordSimilarity(refKeywords, molKeywords);
    
    if (score >= 20) {
      const matchedKeywords = refKeywords.filter(k => 
        molKeywords.some(mk => mk.includes(k) || k.includes(mk))
      );
      suggestions.push({
        entityType: 'molecule',
        entityId: mol.id,
        entityName: mol.name,
        score,
        matchedKeywords,
        reason: `Mots-clés communs: ${matchedKeywords.slice(0, 3).join(', ')}`,
      });
    }
  }
  
  // Search plants
  const allPlants = await db
    .select({ id: plants.id, name: plants.name, latinName: plants.latinName, olfactiveSignature: plants.olfactiveSignature })
    .from(plants)
    .limit(500);
  
  for (const plant of allPlants) {
    if (existingSet.has(`plant:${plant.id}`)) continue;
    
    const plantKeywords = extractKeywords([plant.name, plant.latinName || '', plant.olfactiveSignature || ''].join(' '));
    const score = calculateKeywordSimilarity(refKeywords, plantKeywords);
    
    if (score >= 20) {
      const matchedKeywords = refKeywords.filter(k => 
        plantKeywords.some(pk => pk.includes(k) || k.includes(pk))
      );
      suggestions.push({
        entityType: 'plant',
        entityId: plant.id,
        entityName: plant.name,
        score,
        matchedKeywords,
        reason: `Mots-clés communs: ${matchedKeywords.slice(0, 3).join(', ')}`,
      });
    }
  }
  
  // Search terroirs
  const allTerroirs = await db
    .select({ id: terroirs.id, name: terroirs.name, country: terroirs.country, region: terroirs.region })
    .from(terroirs)
    .limit(100);
  
  for (const terroir of allTerroirs) {
    if (existingSet.has(`terroir:${terroir.id}`)) continue;
    
    const terroirKeywords = extractKeywords([terroir.name, terroir.country || '', terroir.region || ''].join(' '));
    const score = calculateKeywordSimilarity(refKeywords, terroirKeywords);
    
    if (score >= 15) {
      const matchedKeywords = refKeywords.filter(k => 
        terroirKeywords.some(tk => tk.includes(k) || k.includes(tk))
      );
      suggestions.push({
        entityType: 'terroir',
        entityId: terroir.id,
        entityName: terroir.name,
        score,
        matchedKeywords,
        reason: `Mots-clés communs: ${matchedKeywords.slice(0, 3).join(', ')}`,
      });
    }
  }
  
  // Sort by score and limit
  suggestions.sort((a, b) => b.score - a.score);
  
  return {
    referenceId,
    referenceTitle: ref.title || '',
    suggestions: suggestions.slice(0, 20),
  };
}

/**
 * Bulk suggest entity links for all references
 */
export async function bulkSuggestEntityLinks(options?: {
  minScore?: number;
  limit?: number;
  entityTypes?: ('molecule' | 'plant' | 'terroir')[];
}): Promise<{
  totalReferences: number;
  referencesWithSuggestions: number;
  totalSuggestions: number;
  suggestions: {
    referenceId: number;
    referenceTitle: string;
    axisPrimaryCode: string | null;
    entityType: string;
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
  }[];
}> {
  const db = await getDb();
  if (!db) return { totalReferences: 0, referencesWithSuggestions: 0, totalSuggestions: 0, suggestions: [] };
  
  const minScore = options?.minScore || 25;
  const limit = options?.limit || 100;
  const entityTypes = options?.entityTypes || ['molecule', 'plant', 'terroir'];
  
  // Get all references
  const allRefs = await db
    .select()
    .from(v3References)
    .orderBy(desc(v3References.year));
  
  // Get all existing links
  const existingLinks = await db
    .select({ referenceId: referenceEntityLinks.referenceId, entityType: referenceEntityLinks.entityType, entityId: referenceEntityLinks.entityId })
    .from(referenceEntityLinks);
  
  const existingSet = new Set(existingLinks.map(l => `${l.referenceId}:${l.entityType}:${l.entityId}`));
  
  // Get all entities
  const allMolecules = entityTypes.includes('molecule') ? await db
    .select({ id: molecules.id, name: molecules.name, olfactiveProfile: molecules.olfactiveProfile })
    .from(molecules)
    .limit(1000) : [];
  
  const allPlants = entityTypes.includes('plant') ? await db
    .select({ id: plants.id, name: plants.name, latinName: plants.latinName, olfactiveSignature: plants.olfactiveSignature })
    .from(plants)
    .limit(500) : [];
  
  const allTerroirs = entityTypes.includes('terroir') ? await db
    .select({ id: terroirs.id, name: terroirs.name, country: terroirs.country, region: terroirs.region })
    .from(terroirs)
    .limit(100) : [];
  
  const allSuggestions: {
    referenceId: number;
    referenceTitle: string;
    axisPrimaryCode: string | null;
    entityType: string;
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
  }[] = [];
  
  let referencesWithSuggestions = 0;
  
  for (const ref of allRefs) {
    const refText = [
      ref.title || '',
      ref.notes || '',
      ref.userNotes || '',
      ...(ref.tags || []),
    ].join(' ');
    
    const refKeywords = extractKeywords(refText);
    let hasSuggestions = false;
    
    // Check molecules
    for (const mol of allMolecules) {
      if (existingSet.has(`${ref.id}:molecule:${mol.id}`)) continue;
      
      const molKeywords = extractKeywords([mol.name, mol.olfactiveProfile || ''].join(' '));
      const score = calculateKeywordSimilarity(refKeywords, molKeywords);
      
      if (score >= minScore) {
        const matchedKeywords = refKeywords.filter(k => 
          molKeywords.some(mk => mk.includes(k) || k.includes(mk))
        );
        allSuggestions.push({
          referenceId: ref.id,
          referenceTitle: ref.title || '',
          axisPrimaryCode: ref.axisPrimaryCode,
          entityType: 'molecule',
          entityId: mol.id,
          entityName: mol.name,
          score,
          matchedKeywords,
        });
        hasSuggestions = true;
      }
    }
    
    // Check plants
    for (const plant of allPlants) {
      if (existingSet.has(`${ref.id}:plant:${plant.id}`)) continue;
      
      const plantKeywords = extractKeywords([plant.name, plant.latinName || '', plant.olfactiveSignature || ''].join(' '));
      const score = calculateKeywordSimilarity(refKeywords, plantKeywords);
      
      if (score >= minScore) {
        const matchedKeywords = refKeywords.filter(k => 
          plantKeywords.some(pk => pk.includes(k) || k.includes(pk))
        );
        allSuggestions.push({
          referenceId: ref.id,
          referenceTitle: ref.title || '',
          axisPrimaryCode: ref.axisPrimaryCode,
          entityType: 'plant',
          entityId: plant.id,
          entityName: plant.name,
          score,
          matchedKeywords,
        });
        hasSuggestions = true;
      }
    }
    
    // Check terroirs
    for (const terroir of allTerroirs) {
      if (existingSet.has(`${ref.id}:terroir:${terroir.id}`)) continue;
      
      const terroirKeywords = extractKeywords([terroir.name, terroir.country || '', terroir.region || ''].join(' '));
      const score = calculateKeywordSimilarity(refKeywords, terroirKeywords);
      
      if (score >= minScore - 10) {
        const matchedKeywords = refKeywords.filter(k => 
          terroirKeywords.some(tk => tk.includes(k) || k.includes(tk))
        );
        allSuggestions.push({
          referenceId: ref.id,
          referenceTitle: ref.title || '',
          axisPrimaryCode: ref.axisPrimaryCode,
          entityType: 'terroir',
          entityId: terroir.id,
          entityName: terroir.name,
          score,
          matchedKeywords,
        });
        hasSuggestions = true;
      }
    }
    
    if (hasSuggestions) referencesWithSuggestions++;
  }
  
  // Sort by score and limit
  allSuggestions.sort((a, b) => b.score - a.score);
  
  return {
    totalReferences: allRefs.length,
    referencesWithSuggestions,
    totalSuggestions: allSuggestions.length,
    suggestions: allSuggestions.slice(0, limit),
  };
}

/**
 * Create multiple entity links at once (batch)
 */
export async function batchCreateEntityLinks(links: {
  referenceId: number;
  entityType: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier';
  entityId: number;
  linkType?: 'documents' | 'mentions' | 'analyzes' | 'conserves' | 'reconstructs' | 'sources' | 'validates' | 'contextualizes';
  relevanceScore?: number;
  notes?: string;
  createdBy?: number;
}[]): Promise<{ created: number; skipped: number; errors: string[] }> {
  const db = await getDb();
  if (!db) return { created: 0, skipped: 0, errors: ['Database not available'] };
  
  let created = 0;
  let skipped = 0;
  const errors: string[] = [];
  
  for (const link of links) {
    try {
      // Check if link already exists
      const [existing] = await db
        .select({ id: referenceEntityLinks.id })
        .from(referenceEntityLinks)
        .where(
          and(
            eq(referenceEntityLinks.referenceId, link.referenceId),
            eq(referenceEntityLinks.entityType, link.entityType),
            eq(referenceEntityLinks.entityId, link.entityId)
          )
        );
      
      if (existing) {
        skipped++;
        continue;
      }
      
      await db.insert(referenceEntityLinks).values({
        referenceId: link.referenceId,
        entityType: link.entityType,
        entityId: link.entityId,
        linkType: link.linkType || 'documents',
        relevanceScore: link.relevanceScore || 50,
        notes: link.notes,
        createdBy: link.createdBy,
      });
      
      created++;
    } catch (error) {
      errors.push(`Failed to create link ${link.referenceId}->${link.entityType}:${link.entityId}: ${error}`);
    }
  }
  
  return { created, skipped, errors };
}

/**
 * Get references grouped by thematic axis for graph visualization
 */
export async function getReferencesGroupedByAxis(): Promise<{
  axes: {
    id: number;
    code: string;
    name: string;
    metaAxis: string;
    color: string;
    referenceCount: number;
  }[];
  references: {
    id: number;
    title: string;
    year: number | null;
    entryType: string;
    axisPrimaryCode: string | null;
    axesSecondary: string[] | null;
    entityLinkCount: number;
  }[];
  links: {
    source: string; // axis code or reference id
    target: string;
    type: 'primary' | 'secondary';
  }[];
}> {
  const db = await getDb();
  if (!db) return { axes: [], references: [], links: [] };
  
  // Get all axes
  const axes = await db
    .select()
    .from(thematicAxes)
    .orderBy(thematicAxes.displayOrder, thematicAxes.axisCode);
  
  // Get all references
  const refs = await db
    .select()
    .from(v3References)
    .orderBy(desc(v3References.year));
  
  // Get entity link counts per reference
  const linkCounts = await db
    .select({
      referenceId: referenceEntityLinks.referenceId,
      count: count(),
    })
    .from(referenceEntityLinks)
    .groupBy(referenceEntityLinks.referenceId);
  
  const linkCountMap = new Map(linkCounts.map(l => [l.referenceId, l.count]));
  
  // Count references per axis
  const axisRefCounts = new Map<string, number>();
  for (const ref of refs) {
    if (ref.axisPrimaryCode) {
      axisRefCounts.set(ref.axisPrimaryCode, (axisRefCounts.get(ref.axisPrimaryCode) || 0) + 1);
    }
    for (const code of (ref.axesSecondary || [])) {
      axisRefCounts.set(code, (axisRefCounts.get(code) || 0) + 1);
    }
  }
  
  // Build links
  const links: { source: string; target: string; type: 'primary' | 'secondary' }[] = [];
  for (const ref of refs) {
    if (ref.axisPrimaryCode) {
      links.push({
        source: ref.axisPrimaryCode,
        target: `ref-${ref.id}`,
        type: 'primary',
      });
    }
    for (const code of (ref.axesSecondary || [])) {
      links.push({
        source: code,
        target: `ref-${ref.id}`,
        type: 'secondary',
      });
    }
  }
  
  return {
    axes: axes.map(a => ({
      id: a.id,
      code: a.axisCode,
      name: a.name,
      metaAxis: a.metaAxis,
      color: a.color || '#6366f1',
      referenceCount: axisRefCounts.get(a.axisCode) || 0,
    })),
    references: refs.map(r => ({
      id: r.id,
      title: r.title || '',
      year: r.year,
      entryType: r.entryType,
      axisPrimaryCode: r.axisPrimaryCode,
      axesSecondary: r.axesSecondary,
      entityLinkCount: linkCountMap.get(r.id) || 0,
    })),
    links,
  };
}

/**
 * Get reference details with all linked entities
 */
export async function getReferenceWithLinkedEntities(referenceId: number): Promise<{
  reference: typeof v3References.$inferSelect | null;
  axis: typeof thematicAxes.$inferSelect | null;
  linkedEntities: {
    entityType: string;
    entityId: number;
    entityName: string;
    linkType: string;
    relevanceScore: number;
    notes: string | null;
  }[];
}> {
  const db = await getDb();
  if (!db) return { reference: null, axis: null, linkedEntities: [] };
  
  // Get reference
  const [ref] = await db
    .select()
    .from(v3References)
    .where(eq(v3References.id, referenceId));
  
  if (!ref) return { reference: null, axis: null, linkedEntities: [] };
  
  // Get primary axis
  let axis = null;
  if (ref.axisPrimaryId) {
    const [a] = await db
      .select()
      .from(thematicAxes)
      .where(eq(thematicAxes.id, ref.axisPrimaryId));
    axis = a;
  }
  
  // Get linked entities
  const links = await getLinksForReference(referenceId);
  
  return {
    reference: ref,
    axis,
    linkedEntities: links.map(l => ({
      entityType: l.entityType,
      entityId: l.entityId,
      entityName: l.entityName || '',
      linkType: l.linkType || 'documents',
      relevanceScore: l.relevanceScore || 50,
      notes: l.notes,
    })),
  };
}

/**
 * Get statistics for graph visualization
 */
export async function getGraphVisualizationStats(): Promise<{
  totalAxes: number;
  totalReferences: number;
  totalLinks: number;
  referencesByMetaAxis: { metaAxis: string; count: number }[];
  topAxesByReferences: { code: string; name: string; count: number }[];
  referencesWithLinks: number;
  referencesWithoutLinks: number;
}> {
  const db = await getDb();
  if (!db) return {
    totalAxes: 0,
    totalReferences: 0,
    totalLinks: 0,
    referencesByMetaAxis: [],
    topAxesByReferences: [],
    referencesWithLinks: 0,
    referencesWithoutLinks: 0,
  };
  
  // Count axes
  const [axesCount] = await db.select({ count: count() }).from(thematicAxes);
  
  // Count references
  const [refsCount] = await db.select({ count: count() }).from(v3References);
  
  // Count entity links
  const [linksCount] = await db.select({ count: count() }).from(referenceEntityLinks);
  
  // Get all axes
  const axes = await db.select().from(thematicAxes);
  
  // Get all references
  const refs = await db.select().from(v3References);
  
  // Count by meta-axis
  const metaAxisCounts = new Map<string, number>();
  for (const ref of refs) {
    if (ref.axisPrimaryCode) {
      const axis = axes.find(a => a.axisCode === ref.axisPrimaryCode);
      if (axis) {
        metaAxisCounts.set(axis.metaAxis, (metaAxisCounts.get(axis.metaAxis) || 0) + 1);
      }
    }
  }
  
  // Count references per axis
  const axisRefCounts = new Map<string, number>();
  for (const ref of refs) {
    if (ref.axisPrimaryCode) {
      axisRefCounts.set(ref.axisPrimaryCode, (axisRefCounts.get(ref.axisPrimaryCode) || 0) + 1);
    }
  }
  
  // Get references with entity links
  const refsWithLinks = await db
    .selectDistinct({ referenceId: referenceEntityLinks.referenceId })
    .from(referenceEntityLinks);
  
  return {
    totalAxes: axesCount.count,
    totalReferences: refsCount.count,
    totalLinks: linksCount.count,
    referencesByMetaAxis: Array.from(metaAxisCounts.entries()).map(([metaAxis, count]) => ({
      metaAxis,
      count,
    })),
    topAxesByReferences: Array.from(axisRefCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([code, count]) => {
        const axis = axes.find(a => a.axisCode === code);
        return {
          code,
          name: axis?.name || code,
          count,
        };
      }),
    referencesWithLinks: refsWithLinks.length,
    referencesWithoutLinks: refsCount.count - refsWithLinks.length,
  };
}



// ====================================================================
// FONCTIONS UTILITAIRES SYNONYMES OLFACTIFS
// ====================================================================
// ============================================
// FONCTIONS UTILITAIRES SYNONYMES OLFACTIFS
// ============================================

/**
 * Récupère les synonymes d'un terme olfactif
 */
export function getOlfactiveSynonyms(term: string): string[] {
  return getSynonyms(term);
}

/**
 * Étend une requête de recherche avec ses synonymes olfactifs
 */
export function expandOlfactiveSearchQuery(query: string): string[] {
  return expandSearchQuery(query);
}

/**
 * Catégorise un terme selon son domaine olfactif
 */
export function categorizeOlfactiveSearchTerm(term: string): {
  category: 'family' | 'note' | 'technical' | 'sensory' | 'emotional' | 'unknown';
  confidence: number;
} {
  return categorizeOlfactiveTerm(term);
}

/**
 * Récupère les statistiques du dictionnaire de synonymes olfactifs
 */
export function getOlfactiveDictionaryStats(): {
  totalTerms: number;
  byCategory: Record<string, number>;
  totalSynonyms: number;
} {
  return getDictionaryStats();
}



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
  if ((modifications as any).olfactiveFamily) updateData.family = (modifications as any).olfactiveFamily;
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
      manualOlfactiveFamily: (modifications as any).olfactiveFamily ?? (modifications as any).family,
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
        aiOlfactiveFamily: (result.classification as any).olfactiveFamily ?? (result.classification as any).family,
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



// ====================================================================
// GHOST VARIETY IMAGES (Images des variétés fantômes)
// ====================================================================
// ============================================================================
// GHOST VARIETY IMAGES (Images des variétés fantômes)
// ============================================================================

/**
 * Get all images for a ghost variety
 */
export async function getGhostVarietyImages(ghostVarietyId: number): Promise<GhostVarietyImage[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(ghostVarietyImages)
    .where(eq(ghostVarietyImages.ghostVarietyId, ghostVarietyId))
    .orderBy(ghostVarietyImages.sortOrder);
}

/**
 * Create a ghost variety image
 */
export async function createGhostVarietyImage(data: Omit<InsertGhostVarietyImage, 'id' | 'createdAt' | 'updatedAt'>): Promise<GhostVarietyImage> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const [result] = await db.insert(ghostVarietyImages).values(data);
  const [created] = await db.select().from(ghostVarietyImages).where(eq(ghostVarietyImages.id, result.insertId));
  return created;
}

/**
 * Update a ghost variety image
 */
export async function updateGhostVarietyImage(id: number, data: Partial<InsertGhostVarietyImage>): Promise<GhostVarietyImage | null> {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(ghostVarietyImages).set(data).where(eq(ghostVarietyImages.id, id));
  const [updated] = await db.select().from(ghostVarietyImages).where(eq(ghostVarietyImages.id, id));
  return updated || null;
}

/**
 * Delete a ghost variety image
 */
export async function deleteGhostVarietyImage(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(ghostVarietyImages).where(eq(ghostVarietyImages.id, id));
  return true;
}

/**
 * Set primary image for a ghost variety
 */
export async function setGhostVarietyPrimaryImage(ghostVarietyId: number, imageId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  // Reset all images for this variety
  await db.update(ghostVarietyImages)
    .set({ isPrimary: false })
    .where(eq(ghostVarietyImages.ghostVarietyId, ghostVarietyId));
  
  // Set the new primary
  await db.update(ghostVarietyImages)
    .set({ isPrimary: true })
    .where(eq(ghostVarietyImages.id, imageId));
  
  return true;
}

/**
 * Get ghost variety with all relations (molecules, plants, images)
 */
export async function getGhostVarietyComplete(id: number): Promise<{
  variety: GhostVariety | null;
  moleculeLinks: (GhostVarietyMoleculeLink & { molecule: { id: number; name: string; casNumber: string | null; family: string | null } | null })[];
  plantLinks: (GhostVarietyPlantLink & { plant: { id: number; name: string; latinName: string | null; category: string | null } | null })[];
  images: GhostVarietyImage[];
}> {
  const variety = await getGhostVarietyById(id);
  if (!variety) {
    return { variety: null, moleculeLinks: [], plantLinks: [], images: [] };
  }
  
  const [moleculeLinks, plantLinks, images] = await Promise.all([
    getGhostVarietyMoleculeLinks(id),
    getGhostVarietyPlantLinks(id),
    getGhostVarietyImages(id),
  ]);
  
  return { variety, moleculeLinks, plantLinks, images };
}

/**
 * Get linking statistics for ghost varieties
 */
export async function getGhostVarietyLinkingStats(): Promise<{
  totalVarieties: number;
  varietiesWithMolecules: number;
  varietiesWithPlants: number;
  varietiesWithImages: number;
  totalMoleculeLinks: number;
  totalPlantLinks: number;
  totalImages: number;
}> {
  const db = await getDb();
  if (!db) return {
    totalVarieties: 0,
    varietiesWithMolecules: 0,
    varietiesWithPlants: 0,
    varietiesWithImages: 0,
    totalMoleculeLinks: 0,
    totalPlantLinks: 0,
    totalImages: 0,
  };
  
  const [totalVarietiesResult] = await db.select({ count: count() }).from(ghostVarieties);
  const [totalMolLinksResult] = await db.select({ count: count() }).from(ghostVarietyMoleculeLinks);
  const [totalPlantLinksResult] = await db.select({ count: count() }).from(ghostVarietyPlantLinks);
  const [totalImagesResult] = await db.select({ count: count() }).from(ghostVarietyImages);
  
  // Count distinct varieties with links
  const varietiesWithMolsResult = await db.selectDistinct({ ghostVarietyId: ghostVarietyMoleculeLinks.ghostVarietyId }).from(ghostVarietyMoleculeLinks);
  const varietiesWithPlantsResult = await db.selectDistinct({ ghostVarietyId: ghostVarietyPlantLinks.ghostVarietyId }).from(ghostVarietyPlantLinks);
  const varietiesWithImagesResult = await db.selectDistinct({ ghostVarietyId: ghostVarietyImages.ghostVarietyId }).from(ghostVarietyImages);
  
  return {
    totalVarieties: totalVarietiesResult.count,
    varietiesWithMolecules: varietiesWithMolsResult.length,
    varietiesWithPlants: varietiesWithPlantsResult.length,
    varietiesWithImages: varietiesWithImagesResult.length,
    totalMoleculeLinks: totalMolLinksResult.count,
    totalPlantLinks: totalPlantLinksResult.count,
    totalImages: totalImagesResult.count,
  };
}



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
    .where(eq(researchPublications.researchFocus, focus as any))
    .orderBy(desc(researchPublications.citations));
}

export async function getResearchPublicationsBySubject(subject: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchPublications)
    .where(eq(researchPublications.subjectMatter, subject as any))
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
    .where(eq(analyticalMethods.category, category as any))
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
    .where(eq(researchers.status, status as any))
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
    .where(eq(researchInstitutions.institutionType, type as any))
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


