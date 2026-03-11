// @ts-nocheck
/**
 * Module: molecules
 * Généré automatiquement depuis server/db.ts
 * Sections: MOLECULES, MOLECULE DETAILS WITH RELATIONS, GET ALL MOLECULE-RECETTE RELATIONSHIPS FOR CORRELATION ANALYSIS (+25 autres)
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
// MOLECULES
// ====================================================================
// ============================================================================
// MOLECULES
// ============================================================================

/**
 * Parse tous les champs JSON d'une molécule qui peuvent être stockés comme strings
 * par MySQL/TiDB (comportement natif : les colonnes json() reviennent parfois en string).
 *
 * SOURCE UNIQUE DE VÉRITÉ pour le parsing JSON des molécules.
 * AJOUTER ICI tout nouveau champ JSON ajouté au schema molecules.
 *
 * Champs couverts :
 *   - json() dans Drizzle : references, pubchemSynonyms, coconutOrganisms, coconutCitations, ifraData
 *   - text() contenant parfois du JSON : therapeuticProperties, olfactiveProfile
 */
export function parseMoleculeJsonFields(mol: Record<string, any>): Record<string, any> {
  const jsonArrayFields = ['references', 'pubchemSynonyms', 'coconutOrganisms', 'coconutCitations'];
  const jsonObjectFields = ['ifraData'];
  const textJsonArrayFields = ['therapeuticProperties', 'olfactiveProfile'];

  for (const field of jsonArrayFields) {
    const val = mol[field];
    if (val !== null && val !== undefined && typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try { mol[field] = JSON.parse(trimmed); } catch { mol[field] = []; }
      }
    }
  }

  for (const field of jsonObjectFields) {
    const val = mol[field];
    if (val !== null && val !== undefined && typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try { mol[field] = JSON.parse(trimmed); } catch { mol[field] = null; }
      }
    }
  }

  for (const field of textJsonArrayFields) {
    const val = mol[field];
    if (val !== null && val !== undefined && typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) mol[field] = parsed;
        } catch { /* garder la string originale */ }
      }
    }
  }

  return mol;
}

export async function getAllMolecules(): Promise<Molecule[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(molecules);
  return rows.map(r => parseMoleculeJsonFields(r as any)) as Molecule[];
}

export async function getMoleculeById(id: number): Promise<Molecule | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(molecules).where(eq(molecules.id, id)).limit(1);
  const mol = result[0];
  if (!mol) return undefined;
  return parseMoleculeJsonFields(mol as any) as Molecule;
}


// ====================================================================
// MOLECULE DETAILS WITH RELATIONS
// ====================================================================
// ============================================================================
// MOLECULE DETAILS WITH RELATIONS
// ============================================================================

export async function getMoleculeWithRelations(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Get molecule
  const moleculesList = await db.select().from(molecules).where(eq(molecules.id, id));
  if (moleculesList.length === 0) return null;
  
  const mol = parseMoleculeJsonFields(moleculesList[0] as any);
  
  // Get related recettes via molecule_recettes
  const relatedRecettes = await db
    .select({
      id: recettes.id,
      name: recettes.name,
      formula: recettes.formula,
    })
    .from(moleculesRecettes)
    .innerJoin(recettes, eq(moleculesRecettes.recetteId, recettes.id))
    .where(eq(moleculesRecettes.moleculeId, id));
  
  return {
    molecule: mol,
    recettes: relatedRecettes,
  };
}



// ====================================================================
// GET ALL MOLECULE-RECETTE RELATIONSHIPS FOR CORRELATION ANALYSIS
// ====================================================================
// ============================================================================
// GET ALL MOLECULE-RECETTE RELATIONSHIPS FOR CORRELATION ANALYSIS
// ============================================================================

export async function getAllMoleculeRecetteRelationships() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const relationships = await db
    .select({
      moleculeId: moleculesRecettes.moleculeId,
      recetteId: moleculesRecettes.recetteId,
      proportion: moleculesRecettes.proportion,
    })
    .from(moleculesRecettes);
  
  return relationships;
}




// ====================================================================
// MOLECULES RADAR UPDATE
// ====================================================================
// ============================================================================
// MOLECULES RADAR UPDATE
// ============================================================================

export async function updateMoleculeRadar(data: {
  id: number;
  radarIntensity: number;
  radarFreshness: number;
  radarWarmth: number;
  radarSweetness: number;
  radarSpiciness: number;
  radarEarthiness: number;
}): Promise<Molecule> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.update(molecules).set({
    radarIntensity: data.radarIntensity,
    radarFreshness: data.radarFreshness,
    radarWarmth: data.radarWarmth,
    radarSweetness: data.radarSweetness,
    radarSpiciness: data.radarSpiciness,
    radarEarthiness: data.radarEarthiness,
  }).where(eq(molecules.id, data.id));
  
  const updated = await getMoleculeById(data.id);
  if (!updated) throw new Error('Molecule not found after update');
  
  return updated;
}


// ====================================================================
// MOLECULES REFERENCES UPDATE
// ====================================================================
// ============================================================================
// MOLECULES REFERENCES UPDATE
// ============================================================================

export async function updateMoleculeReferences(id: number, referencesJson: string): Promise<Molecule> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Parse JSON string to array
  const referencesArray = JSON.parse(referencesJson);
  
  await db.update(molecules).set({
    references: referencesArray,
  }).where(eq(molecules.id, id));
  
  const updated = await getMoleculeById(id);
  if (!updated) throw new Error('Molecule not found after update');
  
  return updated;
}



// ====================================================================
// ENRICHISSEMENT DES DONNÉES MOLÉCULES
// ====================================================================
// ============================================================================
// ENRICHISSEMENT DES DONNÉES MOLÉCULES

// ====================================================================
// BATCH INSERT MOLECULES-RECETTES ASSOCIATIONS
// ====================================================================
// ============================================================================
// BATCH INSERT MOLECULES-RECETTES ASSOCIATIONS
// ============================================================================

export async function insertMoleculeRecetteAssociation(
  recetteId: number,
  moleculeId: number,
  proportion: number,
  notes?: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.insert(moleculesRecettes).values({
      recetteId,
      moleculeId,
      proportion: proportion.toString(),
      notes: notes || 'Auto-généré',
    }).onDuplicateKeyUpdate({
      set: {
        proportion: proportion.toString(),
        notes: notes || 'Auto-généré',
      }
    });
    return true;
  } catch (error) {
    console.error(`Error inserting association ${recetteId}-${moleculeId}:`, error);
    return false;
  }
}

export async function batchInsertMoleculeRecetteAssociations(
  associations: Array<{ recetteId: number; moleculeId: number; proportion: number; notes?: string }>
): Promise<{ success: number; failed: number }> {
  const db = await getDb();
  if (!db) return { success: 0, failed: associations.length };
  
  let success = 0;
  let failed = 0;
  
  for (const assoc of associations) {
    const result = await insertMoleculeRecetteAssociation(
      assoc.recetteId,
      assoc.moleculeId,
      assoc.proportion,
      assoc.notes
    );
    if (result) success++;
    else failed++;
  }
  
  return { success, failed };
}

// Récupérer les recettes sans associations pour une gamme
export async function getRecettesWithoutMoleculesByGamme(gamme: 'volcanique' | 'glaciaire' | 'biolab' | 'petrichor'): Promise<Recette[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Conditions par gamme
  const conditions: Record<string, ReturnType<typeof or>> = {
    volcanique: or(
      like(recettes.name, '%Volcanique%'),
      like(recettes.name, '%Fumé%'),
      like(recettes.name, '%Pyrolyse%'),
      eq(recettes.category, 'tabac')
    ),
    glaciaire: or(
      like(recettes.name, '%Glaciaire%'),
      like(recettes.name, '%Frais%'),
      like(recettes.name, '%Ozone%'),
      like(recettes.name, '%Menthe%')
    ),
    biolab: or(
      like(recettes.name, '%Bio%'),
      like(recettes.name, '%CBD%'),
      like(recettes.name, '%Résine%'),
      eq(recettes.category, 'resine_cbd')
    ),
    petrichor: or(
      like(recettes.name, '%Pétrichor%'),
      like(recettes.name, '%Terre%'),
      like(recettes.name, '%Minéral%')
    ),
  };
  
  const condition = conditions[gamme];
  if (!condition) return [];
  
  // Récupérer les recettes qui n'ont pas d'associations
  const allRecettes = await db.select().from(recettes).where(condition);
  
  const recettesWithoutMolecules: Recette[] = [];
  
  for (const recette of allRecettes) {
    const associations = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(moleculesRecettes)
      .where(eq(moleculesRecettes.recetteId, recette.id));
    
    if (associations[0]?.count === 0) {
      recettesWithoutMolecules.push(recette);
    }
  }
  
  return recettesWithoutMolecules;
}

// Récupérer les molécules par profil olfactif pour une gamme
export async function getMoleculesForGamme(gamme: 'volcanique' | 'glaciaire' | 'biolab' | 'petrichor'): Promise<Molecule[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Mots-clés par gamme
  const keywords: Record<string, string[]> = {
    volcanique: ['fumé', 'boisé', 'torréfié', 'grillé', 'cuir', 'goudron', 'brûlé', 'caramel'],
    glaciaire: ['frais', 'marin', 'ozone', 'menthe', 'agrume', 'citron', 'pin', 'conifère'],
    biolab: ['herbacé', 'terreux', 'houblon', 'épicé', 'poivre', 'boisé', 'lavande', 'floral'],
    petrichor: ['terre', 'pluie', 'minéral', 'racine', 'ambre', 'cèdre', 'mousse', 'humide'],
  };
  
  const gammeKeywords = keywords[gamme] || [];
  if (gammeKeywords.length === 0) return [];
  
  // Construire les conditions LIKE pour chaque mot-clé
  const allMolecules = await db.select().from(molecules);
  
  return allMolecules.filter(mol => {
    const profile = (mol.olfactiveProfile || '').toLowerCase();
    const name = mol.name.toLowerCase();
    return gammeKeywords.some(kw => profile.includes(kw) || name.includes(kw));
  });
}

// Enrichir automatiquement les associations pour une gamme
export async function enrichGammeAssociations(gamme: 'volcanique' | 'glaciaire' | 'biolab' | 'petrichor'): Promise<{
  recettesProcessed: number;
  associationsCreated: number;
  moleculesUsed: string[];
}> {
  const db = await getDb();
  if (!db) return { recettesProcessed: 0, associationsCreated: 0, moleculesUsed: [] };
  
  // Récupérer les recettes sans associations
  const recettesToEnrich = await getRecettesWithoutMoleculesByGamme(gamme);
  
  // Récupérer les molécules appropriées pour cette gamme
  const gammeMolecules = await getMoleculesForGamme(gamme);
  
  if (gammeMolecules.length === 0) {
    console.log(`Aucune molécule trouvée pour la gamme ${gamme}`);
    return { recettesProcessed: 0, associationsCreated: 0, moleculesUsed: [] };
  }
  
  let associationsCreated = 0;
  const moleculesUsed = new Set<string>();
  
  for (const recette of recettesToEnrich) {
    // Sélectionner 3-5 molécules aléatoires pour cette recette
    const shuffled = [...gammeMolecules].sort(() => Math.random() - 0.5);
    const numMolecules = Math.min(shuffled.length, 3 + Math.floor(Math.random() * 3));
    
    for (let i = 0; i < numMolecules; i++) {
      const mol = shuffled[i];
      const proportion = 15 + Math.floor(Math.random() * 30); // 15-45%
      
      const success = await insertMoleculeRecetteAssociation(
        recette.id,
        mol.id,
        proportion,
        `Association ${gamme} auto-générée`
      );
      
      if (success) {
        associationsCreated++;
        moleculesUsed.add(mol.name);
      }
    }
  }
  
  return {
    recettesProcessed: recettesToEnrich.length,
    associationsCreated,
    moleculesUsed: Array.from(moleculesUsed),
  };
}



// ====================================================================
// SYNERGIES MOLÉCULAIRES (molecule_synergies)
// ====================================================================
// ============================================================================
// SYNERGIES MOLÉCULAIRES (molecule_synergies)
// ============================================================================

/**
 * Récupère toutes les synergies moléculaires avec les noms et familles chimiques des molécules
 */
export async function getAllMoleculeSynergies() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: moleculeSynergies.id,
      molecule1Id: moleculeSynergies.molecule1Id,
      molecule2Id: moleculeSynergies.molecule2Id,
      type: moleculeSynergies.type,
      description: moleculeSynergies.description,
      chemicalMechanism: moleculeSynergies.chemicalMechanism,
      applications: moleculeSynergies.applications,
      molecule1Name: molecules.name,
      molecule1Family: molecules.family,
      molecule2Name: sql<string>`m2.name`,
      molecule2Family: sql<string>`m2.family`,
    })
    .from(moleculeSynergies)
    .leftJoin(molecules, eq(moleculeSynergies.molecule1Id, molecules.id))
    .leftJoin(sql`molecules m2`, sql`${moleculeSynergies.molecule2Id} = m2.id`)
    .orderBy(desc(moleculeSynergies.id));
  
  return result;
}

/**
 * Récupère les données pour le graphe D3.js des synergies moléculaires
 */
export async function getMoleculeSynergiesGraphData() {
  const db = await getDb();
  if (!db) return [];
  
  const synergies = await getAllMoleculeSynergies();
  
  return synergies.map((s) => ({
    id: s.id,
    molecule1Name: s.molecule1Name || `Molécule ${s.molecule1Id}`,
    molecule2Name: s.molecule2Name || `Molécule ${s.molecule2Id}`,
    molecule1Family: s.molecule1Family || null,
    molecule2Family: s.molecule2Family || null,
    effectType: s.type,
    description: s.description,
    applications: s.applications,
    intensity: 70, // Valeur par défaut pour l'épaisseur des liens
  }));
}



// ====================================================================
// MOLECULE ORIGINS FUNCTIONS
// ====================================================================
// ============================================================================
// MOLECULE ORIGINS FUNCTIONS
// ============================================================================

export async function getMoleculeOrigins(moleculeId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select({
    id: moleculeOrigins.id,
    moleculeId: moleculeOrigins.moleculeId,
    originId: moleculeOrigins.originId,
    isPrimaryOrigin: moleculeOrigins.isPrimaryOrigin,
    qualityRating: moleculeOrigins.qualityRating,
    productionVolume: moleculeOrigins.productionVolume,
    priceRange: moleculeOrigins.priceRange,
    specificCharacteristics: moleculeOrigins.specificCharacteristics,
    notes: moleculeOrigins.notes,
    origin: geographicOrigins,
  })
    .from(moleculeOrigins)
    .innerJoin(geographicOrigins, eq(moleculeOrigins.originId, geographicOrigins.id))
    .where(eq(moleculeOrigins.moleculeId, moleculeId));
}

export async function getOriginMolecules(originId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select({
    id: moleculeOrigins.id,
    moleculeId: moleculeOrigins.moleculeId,
    originId: moleculeOrigins.originId,
    isPrimaryOrigin: moleculeOrigins.isPrimaryOrigin,
    qualityRating: moleculeOrigins.qualityRating,
    molecule: molecules,
  })
    .from(moleculeOrigins)
    .innerJoin(molecules, eq(moleculeOrigins.moleculeId, molecules.id))
    .where(eq(moleculeOrigins.originId, originId));
}

export async function addMoleculeOrigin(data: InsertMoleculeOrigin) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(moleculeOrigins).values(data);
  return { id: Number(result[0].insertId), ...data };
}

export async function updateMoleculeOrigin(id: number, data: Partial<InsertMoleculeOrigin>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(moleculeOrigins).set(data).where(eq(moleculeOrigins.id, id));
}

export async function removeMoleculeOrigin(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(moleculeOrigins).where(eq(moleculeOrigins.id, id));
}


// ====================================================================
// MOLECULE SCIENTIFIC DATA UPDATE
// ====================================================================
// ============================================================================
// MOLECULE SCIENTIFIC DATA UPDATE
// ============================================================================

export async function updateMoleculeScientificData(id: number, data: {
  iupacName?: string;
  casNumber?: string;
  chemicalClass?: "terpene" | "sesquiterpene" | "diterpene" | "monoterpene" | "aldehyde" | "ketone" | "alcohol" | "ester" | "ether" | "phenol" | "lactone" | "coumarin" | "musk" | "nitrile" | "sulfur_compound" | "heterocyclic" | "aromatic" | "aliphatic" | "other";
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(molecules).set(data).where(eq(molecules.id, id));
  return await getMoleculeById(id);
}

export async function getMoleculesWithoutCas() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(molecules).where(isNull(molecules.casNumber)).orderBy(molecules.name);
}

export async function getMoleculesWithCas() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(molecules).where(isNotNull(molecules.casNumber)).orderBy(molecules.name);
}



// ====================================================================
// RELATIONS: TerpProfiles <-> Molecules
// ====================================================================
// ============================================================================
// RELATIONS: TerpProfiles <-> Molecules
// ============================================================================

export async function getTerpProfileMolecules(terpProfileId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      molecule: molecules,
      percentage: terpProfileMolecules.percentage,
      notes: terpProfileMolecules.notes,
    })
    .from(terpProfileMolecules)
    .innerJoin(molecules, eq(terpProfileMolecules.moleculeId, molecules.id))
    .where(eq(terpProfileMolecules.terpProfileId, terpProfileId));
}

export async function addMoleculeToTerpProfile(terpProfileId: number, moleculeId: number, percentage?: string, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.insert(terpProfileMolecules).values({ terpProfileId, moleculeId, percentage, notes });
}


// ====================================================================
// RELATIONS: Plants <-> Molecules
// ====================================================================
// ============================================================================
// RELATIONS: Plants <-> Molecules
// ============================================================================

export async function getPlantMolecules(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      molecule: molecules,
      percentageMin: plantMolecules.percentageMin,
      percentageMax: plantMolecules.percentageMax,
      percentageTypical: plantMolecules.percentageTypical,
      isSignature: plantMolecules.isSignature,
      role: plantMolecules.role,
      notes: plantMolecules.notes,
    })
    .from(plantMolecules)
    .innerJoin(molecules, eq(plantMolecules.moleculeId, molecules.id))
    .where(eq(plantMolecules.plantId, plantId));
}

export async function addMoleculeToPlant(
  plantId: number, 
  moleculeId: number, 
  options?: {
    percentageMin?: string;
    percentageMax?: string;
    percentageTypical?: string;
    isSignature?: number;
    role?: "majeur" | "secondaire" | "trace" | "variable";
    notes?: string;
    source?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.insert(plantMolecules).values({ 
    plantId, 
    moleculeId, 
    percentageMin: options?.percentageMin,
    percentageMax: options?.percentageMax,
    percentageTypical: options?.percentageTypical,
    isSignature: options?.isSignature, 
    role: options?.role,
    notes: options?.notes,
    source: options?.source,
  });
}



// ====================================================================
// RAW MATERIAL MOLECULES (Liaison matière première <-> molécule)
// ====================================================================
// ============================================================================
// RAW MATERIAL MOLECULES (Liaison matière première <-> molécule)
// ============================================================================

export async function getRawMaterialMolecules(rawMaterialId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      molecule: molecules,
      percentage: rawMaterialMolecules.percentage,
      isSignature: rawMaterialMolecules.isSignature,
      variability: rawMaterialMolecules.variability,
      notes: rawMaterialMolecules.notes,
    })
    .from(rawMaterialMolecules)
    .innerJoin(molecules, eq(rawMaterialMolecules.moleculeId, molecules.id))
    .where(eq(rawMaterialMolecules.rawMaterialId, rawMaterialId))
    .orderBy(desc(rawMaterialMolecules.percentage));
}

export async function getMoleculeRawMaterials(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      rawMaterial: rawMaterials,
      percentage: rawMaterialMolecules.percentage,
      isSignature: rawMaterialMolecules.isSignature,
      variability: rawMaterialMolecules.variability,
    })
    .from(rawMaterialMolecules)
    .innerJoin(rawMaterials, eq(rawMaterialMolecules.rawMaterialId, rawMaterials.id))
    .where(eq(rawMaterialMolecules.moleculeId, moleculeId))
    .orderBy(desc(rawMaterialMolecules.percentage));
}

export async function addMoleculeToRawMaterial(data: InsertRawMaterialMolecule) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return db.insert(rawMaterialMolecules).values(data);
}

export async function removeMoleculeFromRawMaterial(rawMaterialId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(rawMaterialMolecules)
    .where(and(
      eq(rawMaterialMolecules.rawMaterialId, rawMaterialId),
      eq(rawMaterialMolecules.moleculeId, moleculeId)
    ));
}


// ====================================================================
// MOLECULE PLANT SOURCES (Sources botaniques des molécules)
// ====================================================================
// ============================================================================
// MOLECULE PLANT SOURCES (Sources botaniques des molécules)
// ============================================================================

export async function getMoleculePlantSources(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      plant: plants,
      plantPart: moleculePlantSources.plantPart,
      percentageInPlant: moleculePlantSources.percentageInPlant,
      percentageInOil: moleculePlantSources.percentageInOil,
      variability: moleculePlantSources.variability,
      isMainSource: moleculePlantSources.isMainSource,
      isPrimarySource: moleculePlantSources.isPrimarySource,
      bestExtractionMethod: moleculePlantSources.bestExtractionMethod,
      extractionYield: moleculePlantSources.extractionYield,
    })
    .from(moleculePlantSources)
    .innerJoin(plants, eq(moleculePlantSources.plantId, plants.id))
    .where(eq(moleculePlantSources.moleculeId, moleculeId))
    .orderBy(desc(moleculePlantSources.isMainSource), desc(moleculePlantSources.percentageInOil));
}

export async function getPlantMoleculeSources(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      molecule: molecules,
      plantPart: moleculePlantSources.plantPart,
      percentageInPlant: moleculePlantSources.percentageInPlant,
      percentageInOil: moleculePlantSources.percentageInOil,
      variability: moleculePlantSources.variability,
      isMainSource: moleculePlantSources.isMainSource,
    })
    .from(moleculePlantSources)
    .innerJoin(molecules, eq(moleculePlantSources.moleculeId, molecules.id))
    .where(eq(moleculePlantSources.plantId, plantId))
    .orderBy(desc(moleculePlantSources.percentageInOil));
}

export async function addMoleculePlantSource(data: InsertMoleculePlantSource) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return db.insert(moleculePlantSources).values(data);
}

export async function updateMoleculePlantSource(id: number, data: Partial<InsertMoleculePlantSource>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(moleculePlantSources).set(data).where(eq(moleculePlantSources.id, id));
}

export async function deleteMoleculePlantSource(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(moleculePlantSources).where(eq(moleculePlantSources.id, id));
}


// ====================================================================
// GEOGRAPHIC ORIGINS WITH MOLECULE COUNT
// ====================================================================
// ============================================================================
// GEOGRAPHIC ORIGINS WITH MOLECULE COUNT
// ============================================================================

/**
 * Récupère toutes les origines géographiques avec le nombre de molécules associées
 */
export async function getAllGeographicOriginsWithMoleculeCount() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const origins = await db.select().from(geographicOrigins).orderBy(geographicOrigins.country, geographicOrigins.name);
  
  // Récupérer le comptage des molécules pour chaque origine
  const moleculeCounts = await db.select({
    originId: moleculeOrigins.originId,
    count: sql<number>`COUNT(*)`.as('count'),
  })
    .from(moleculeOrigins)
    .groupBy(moleculeOrigins.originId);
  
  // Créer une map pour un accès rapide
  const countMap = new Map(moleculeCounts.map(mc => [mc.originId, mc.count]));
  
  // Enrichir les origines avec le comptage
  return origins.map(origin => ({
    ...origin,
    moleculeCount: countMap.get(origin.id) || 0,
  }));
}

/**
 * Récupère les molécules d'une origine avec leurs détails complets
 */
export async function getOriginMoleculesWithDetails(originId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  return await db.select({
    id: moleculeOrigins.id,
    moleculeId: moleculeOrigins.moleculeId,
    originId: moleculeOrigins.originId,
    isPrimaryOrigin: moleculeOrigins.isPrimaryOrigin,
    qualityRating: moleculeOrigins.qualityRating,
    productionVolume: moleculeOrigins.productionVolume,
    priceRange: moleculeOrigins.priceRange,
    specificCharacteristics: moleculeOrigins.specificCharacteristics,
    notes: moleculeOrigins.notes,
    molecule: {
      id: molecules.id,
      name: molecules.name,
      family: molecules.family,
      chemicalFormula: molecules.chemicalFormula,
      olfactiveProfile: molecules.olfactiveProfile,
      casNumber: molecules.casNumber,
      iupacName: molecules.iupacName,
      chemicalClass: molecules.chemicalClass,
    },
  })
    .from(moleculeOrigins)
    .innerJoin(molecules, eq(moleculeOrigins.moleculeId, molecules.id))
    .where(eq(moleculeOrigins.originId, originId))
    .orderBy(molecules.name);
}

/**
 * Recherche les origines par nom de molécule
 */
export async function searchOriginsByMoleculeName(moleculeName: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  // Trouver les molécules correspondantes
  const matchingMolecules = await db.select({ id: molecules.id })
    .from(molecules)
    .where(like(molecules.name, `%${moleculeName}%`));
  
  if (matchingMolecules.length === 0) return [];
  
  const moleculeIds = matchingMolecules.map(m => m.id);
  
  // Trouver les origines liées à ces molécules
  const originIds = await db.select({ originId: moleculeOrigins.originId })
    .from(moleculeOrigins)
    .where(inArray(moleculeOrigins.moleculeId, moleculeIds));
  
  if (originIds.length === 0) return [];
  
  const uniqueOriginIds = Array.from(new Set(originIds.map(o => o.originId)));
  
  // Récupérer les origines avec le comptage
  const origins = await db.select().from(geographicOrigins)
    .where(inArray(geographicOrigins.id, uniqueOriginIds))
    .orderBy(geographicOrigins.name);
  
  // Ajouter le comptage des molécules correspondantes
  return origins.map(origin => {
    const count = originIds.filter(o => o.originId === origin.id).length;
    return { ...origin, matchingMoleculeCount: count };
  });
}



// ====================================================================
// PLANT-MOLECULE LINKS - EXTENDED FUNCTIONS
// ====================================================================
// ============================================================================
// PLANT-MOLECULE LINKS - EXTENDED FUNCTIONS
// ============================================================================

/**
 * Récupère toutes les liaisons plantes-molécules avec détails
 */
export async function getAllPlantMoleculeLinks() {
  const db = await getDb();
  if (!db) return [];
  
  // Sélection explicite des colonnes pour éviter les conflits
  // Note: la table plant_molecules n'a pas de colonne id (clé composite plant_id + molecule_id)
  return db.select({
    // Colonnes du lien
    plantId: plantMolecules.plantId,
    moleculeId: plantMolecules.moleculeId,
    percentageMin: plantMolecules.percentageMin,
    percentageMax: plantMolecules.percentageMax,
    percentageTypical: plantMolecules.percentageTypical,
    isSignature: plantMolecules.isSignature,
    role: plantMolecules.role,
    variabilityFactor: plantMolecules.variabilityFactor,
    source: plantMolecules.source,
    linkNotes: plantMolecules.notes,
    // Colonnes de la plante
    plantName: plants.name,
    plantLatinName: plants.latinName,
    plantFamily: plants.family,
    // Colonnes de la molécule
    moleculeName: molecules.name,
    moleculeFamily: molecules.family,
    moleculeCasNumber: molecules.casNumber,
    moleculeOlfactiveProfile: molecules.olfactiveProfile,
  })
    .from(plantMolecules)
    .innerJoin(plants, eq(plantMolecules.plantId, plants.id))
    .innerJoin(molecules, eq(plantMolecules.moleculeId, molecules.id))
    .orderBy(plants.name, molecules.name);
}

/**
 * Récupère les plantes associées à une molécule
 */
export async function getPlantsByMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    plant: plants,
    percentageMin: plantMolecules.percentageMin,
    percentageMax: plantMolecules.percentageMax,
    percentageTypical: plantMolecules.percentageTypical,
    isSignature: plantMolecules.isSignature,
    role: plantMolecules.role,
  })
    .from(plantMolecules)
    .innerJoin(plants, eq(plantMolecules.plantId, plants.id))
    .where(eq(plantMolecules.moleculeId, moleculeId))
    .orderBy(desc(plantMolecules.percentageTypical));
}

/**
 * Récupère les molécules signatures d'une plante
 */
export async function getSignatureMolecules(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    molecule: molecules,
    percentageTypical: plantMolecules.percentageTypical,
    role: plantMolecules.role,
  })
    .from(plantMolecules)
    .innerJoin(molecules, eq(plantMolecules.moleculeId, molecules.id))
    .where(
      and(
        eq(plantMolecules.plantId, plantId),
        eq(plantMolecules.isSignature, 1)
      )
    )
    .orderBy(desc(plantMolecules.percentageTypical));
}

/**
 * Crée une liaison plante-molécule
 */
export async function createPlantMoleculeLink(data: {
  plantId: number;
  moleculeId: number;
  percentageMin?: number;
  percentageMax?: number;
  percentageTypical?: number;
  isSignature?: number;
  role?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(plantMolecules).values({
    plantId: data.plantId,
    moleculeId: data.moleculeId,
    percentageMin: data.percentageMin?.toString(),
    percentageMax: data.percentageMax?.toString(),
    percentageTypical: data.percentageTypical?.toString(),
    isSignature: data.isSignature || 0,
    role: data.role as any,
  });
  
  return { id: Number(result[0].insertId), ...data };
}

/**
 * Supprime une liaison plante-molécule
 */
export async function deletePlantMoleculeLink(plantId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(plantMolecules).where(
    and(
      eq(plantMolecules.plantId, plantId),
      eq(plantMolecules.moleculeId, moleculeId)
    )
  );
}

/**
 * Met à jour une liaison plante-molécule (pourcentages, rôle, signature)
 */
export async function updatePlantMoleculeLink(
  plantId: number,
  moleculeId: number,
  data: {
    percentageMin?: number | null;
    percentageMax?: number | null;
    percentageTypical?: number | null;
    isSignature?: number;
    role?: string;
    source?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(plantMolecules)
    .set({
      ...(data.percentageMin !== undefined && { percentageMin: data.percentageMin?.toString() ?? null }),
      ...(data.percentageMax !== undefined && { percentageMax: data.percentageMax?.toString() ?? null }),
      ...(data.percentageTypical !== undefined && { percentageTypical: data.percentageTypical?.toString() ?? null }),
      ...(data.isSignature !== undefined && { isSignature: data.isSignature }),
      ...(data.role !== undefined && { role: data.role as any }),
      ...(data.source !== undefined && { source: data.source }),
    })
    .where(
      and(
        eq(plantMolecules.plantId, plantId),
        eq(plantMolecules.moleculeId, moleculeId)
      )
    );

  return { plantId, moleculeId, ...data };
}

/**
 * Met à jour le statut de conservation d'une variété
 */
export async function updateVarietyConservationStatus(
  varietyId: number,
  data: {
    conservationStatus?: string;
    conservationNotes?: string;
    threatFactors?: string[];
    conservationEfforts?: string;
  }
) {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(plantVarieties)
    .set({
      conservationStatus: data.conservationStatus as any,
      conservationNotes: data.conservationNotes,
      threatFactors: data.threatFactors,
      conservationEfforts: data.conservationEfforts,
      lastAssessmentDate: new Date(),
    })
    .where(eq(plantVarieties.id, varietyId));
  
  return getPlantVarietyById(varietyId);
}

/**
 * Récupère les pays d'origine uniques des variétés
 */
export async function getUniqueVarietyCountries() {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db.selectDistinct({ country: plantVarieties.countryOfOrigin })
    .from(plantVarieties)
    .where(sql`${plantVarieties.countryOfOrigin} IS NOT NULL AND ${plantVarieties.countryOfOrigin} != ''`)
    .orderBy(plantVarieties.countryOfOrigin);
  
  return results.map(r => r.country).filter(Boolean) as string[];
}



// ====================================================================
// PLANT-MOLECULE LINKS MANAGEMENT
// ====================================================================
// ============================================================================
// PLANT-MOLECULE LINKS MANAGEMENT
// ============================================================================

/**
 * Récupère toutes les liaisons plante-molécule avec statistiques
 */
export async function getPlantMoleculeLinksStats() {
  const db = await getDb();
  if (!db) return { total: 0, plantsWithLinks: 0, moleculesWithLinks: 0, orphanPlants: 0, orphanMolecules: 0 };
  
  const [totalLinks] = await db.select({ count: count() }).from(plantMolecules);
  
  // Plantes avec au moins une liaison
  const plantsWithLinksResult = await db
    .selectDistinct({ plantId: plantMolecules.plantId })
    .from(plantMolecules);
  
  // Molécules avec au moins une liaison
  const moleculesWithLinksResult = await db
    .selectDistinct({ moleculeId: plantMolecules.moleculeId })
    .from(plantMolecules);
  
  // Total plantes et molécules
  const [totalPlants] = await db.select({ count: count() }).from(plants);
  const [totalMolecules] = await db.select({ count: count() }).from(molecules);
  
  return {
    total: totalLinks?.count || 0,
    plantsWithLinks: plantsWithLinksResult.length,
    moleculesWithLinks: moleculesWithLinksResult.length,
    orphanPlants: (totalPlants?.count || 0) - plantsWithLinksResult.length,
    orphanMolecules: (totalMolecules?.count || 0) - moleculesWithLinksResult.length,
    totalPlants: totalPlants?.count || 0,
    totalMolecules: totalMolecules?.count || 0,
  };
}

/**
 * Vérifie si une liaison plante-molécule existe déjà
 */
export async function checkPlantMoleculeLinkExists(plantId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const [existing] = await db.select({ id: plantMolecules.plantId })
    .from(plantMolecules)
    .where(
      and(
        eq(plantMolecules.plantId, plantId),
        eq(plantMolecules.moleculeId, moleculeId)
      )
    )
    .limit(1);
  
  return !!existing;
}

/**
 * Récupère les plantes sans liaisons (orphelines)
 */
export async function getOrphanPlants(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const plantsWithLinks = await db
    .selectDistinct({ plantId: plantMolecules.plantId })
    .from(plantMolecules);
  
  const linkedPlantIds = plantsWithLinks.map(p => p.plantId);
  
  if (linkedPlantIds.length === 0) {
    return db.select().from(plants).limit(limit);
  }
  
  return db.select().from(plants)
    .where(notInArray(plants.id, linkedPlantIds))
    .orderBy(plants.name)
    .limit(limit);
}

/**
 * Récupère les molécules sans liaisons (orphelines)
 */
export async function getOrphanMolecules(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const moleculesWithLinks = await db
    .selectDistinct({ moleculeId: plantMolecules.moleculeId })
    .from(plantMolecules);
  
  const linkedMoleculeIds = moleculesWithLinks.map(m => m.moleculeId);
  
  if (linkedMoleculeIds.length === 0) {
    return db.select().from(molecules).limit(limit);
  }
  
  return db.select().from(molecules)
    .where(notInArray(molecules.id, linkedMoleculeIds))
    .orderBy(molecules.name)
    .limit(limit);
}


// ====================================================================
// PUBCHEM ENRICHMENT LOGGING
// ====================================================================
// ============================================================================
// PUBCHEM ENRICHMENT LOGGING
// ============================================================================

/**
 * Met à jour une molécule avec les données PubChem
 */
export async function enrichMoleculeFromPubChem(
  moleculeId: number,
  pubchemData: {
    casNumber?: string;
    iupacName?: string;
    chemicalFormula?: string;
    molecularWeight?: number;
    pubchemCid?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const updateData: any = {};
  
  if (pubchemData.casNumber) updateData.casNumber = pubchemData.casNumber;
  if (pubchemData.iupacName) updateData.iupacName = pubchemData.iupacName;
  if (pubchemData.chemicalFormula) updateData.chemicalFormula = pubchemData.chemicalFormula;
  if (pubchemData.molecularWeight) updateData.molecularWeight = pubchemData.molecularWeight;
  
  // Ajouter une référence PubChem si CID fourni
  if (pubchemData.pubchemCid) {
    const molecule = await getMoleculeById(moleculeId);
    const existingRefs = molecule?.references || [];
    const pubchemRef = {
      type: 'pubchem' as const,
      title: `PubChem CID: ${pubchemData.pubchemCid}`,
      url: `https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemData.pubchemCid}`,
    };
    
    // Éviter les doublons
    if (!existingRefs.find(r => r.url === pubchemRef.url)) {
      updateData.references = [...existingRefs, pubchemRef];
    }
  }
  
  if (Object.keys(updateData).length > 0) {
    await db.update(molecules).set(updateData).where(eq(molecules.id, moleculeId));
  }
  
  return getMoleculeById(moleculeId);
}

/**
 * Récupère les molécules candidates pour enrichissement PubChem
 * (sans CAS number ou sans IUPAC name)
 */
export async function getMoleculesForPubChemEnrichment(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(molecules)
    .where(
      or(
        isNull(molecules.casNumber),
        isNull(molecules.iupacName)
      )
    )
    .orderBy(molecules.name)
    .limit(limit);
}

/**
 * Statistiques d'enrichissement des molécules
 */
export async function getMoleculeEnrichmentStats() {
  const db = await getDb();
  if (!db) return { total: 0, withCas: 0, withIupac: 0, withBoth: 0, withNeither: 0 };
  
  const [total] = await db.select({ count: count() }).from(molecules);
  const [withCas] = await db.select({ count: count() }).from(molecules).where(isNotNull(molecules.casNumber));
  const [withIupac] = await db.select({ count: count() }).from(molecules).where(isNotNull(molecules.iupacName));
  const [withBoth] = await db.select({ count: count() }).from(molecules)
    .where(and(isNotNull(molecules.casNumber), isNotNull(molecules.iupacName)));
  const [withNeither] = await db.select({ count: count() }).from(molecules)
    .where(and(isNull(molecules.casNumber), isNull(molecules.iupacName)));
  
  return {
    total: total?.count || 0,
    withCas: withCas?.count || 0,
    withIupac: withIupac?.count || 0,
    withBoth: withBoth?.count || 0,
    withNeither: withNeither?.count || 0,
    percentageWithCas: total?.count ? Math.round((withCas?.count || 0) / total.count * 100) : 0,
    percentageWithIupac: total?.count ? Math.round((withIupac?.count || 0) / total.count * 100) : 0,
  };
}



// ====================================================================
// ORPHAN MOLECULES CLASSIFICATION
// ====================================================================
// ============================================================================
// ORPHAN MOLECULES CLASSIFICATION
// ============================================================================

export interface OrphanMoleculeStats {
  totalMolecules: number;
  withFamily: number;
  withChemicalClass: number;
  withCasNumber: number;
  withIupacName: number;
  withFormula: number;
  withOlfactiveProfile: number;
  withRadarComplete: number;
  orphanCount: number;
  classificationRate: number;
}

export async function getOrphanMoleculeStats(): Promise<OrphanMoleculeStats | null> {
  const db = await getDb();
  if (!db) return null;

  const allMolecules = await db.select().from(molecules);
  const total = allMolecules.length;

  const withFamily = allMolecules.filter(m => m.family && m.family.trim() !== '').length;
  const withChemicalClass = allMolecules.filter(m => m.chemicalClass).length;
  const withCasNumber = allMolecules.filter(m => m.casNumber && m.casNumber.trim() !== '').length;
  const withIupacName = allMolecules.filter(m => m.iupacName && m.iupacName.trim() !== '').length;
  const withFormula = allMolecules.filter(m => m.chemicalFormula && m.chemicalFormula.trim() !== '').length;
  const withOlfactiveProfile = allMolecules.filter(m => m.olfactiveProfile && m.olfactiveProfile.trim() !== '').length;
  const withRadarComplete = allMolecules.filter(m => 
    m.radarIntensity !== null && m.radarIntensity !== 50 &&
    m.radarFreshness !== null && m.radarFreshness !== 50 &&
    m.radarWarmth !== null && m.radarWarmth !== 50 &&
    m.radarSweetness !== null && m.radarSweetness !== 50 &&
    m.radarSpiciness !== null && m.radarSpiciness !== 50 &&
    m.radarEarthiness !== null && m.radarEarthiness !== 50
  ).length;

  // Une molécule est "orpheline" si elle n'a ni famille, ni classe chimique, ni profil olfactif
  const orphanCount = allMolecules.filter(m => 
    (!m.family || m.family.trim() === '') &&
    !m.chemicalClass &&
    (!m.olfactiveProfile || m.olfactiveProfile.trim() === '')
  ).length;

  // Taux de classification = moyenne des champs remplis
  const classificationRate = Math.round(
    ((withFamily + withChemicalClass + withCasNumber + withIupacName + withFormula + withOlfactiveProfile) / (total * 6)) * 100
  );

  return {
    totalMolecules: total,
    withFamily,
    withChemicalClass,
    withCasNumber,
    withIupacName,
    withFormula,
    withOlfactiveProfile,
    withRadarComplete,
    orphanCount,
    classificationRate,
  };
}

export type OrphanFilter = 'all' | 'no_family' | 'no_chemical_class' | 'no_cas' | 'no_iupac' | 'no_formula' | 'no_olfactive_profile' | 'no_radar';

export async function getOrphanMoleculesList(filter: OrphanFilter = 'all', limit: number = 100, offset: number = 0) {
  const db = await getDb();
  if (!db) return { molecules: [], total: 0 };

  let allMolecules = await db.select().from(molecules);

  // Filtrer selon le critère
  switch (filter) {
    case 'no_family':
      allMolecules = allMolecules.filter(m => !m.family || m.family.trim() === '');
      break;
    case 'no_chemical_class':
      allMolecules = allMolecules.filter(m => !m.chemicalClass);
      break;
    case 'no_cas':
      allMolecules = allMolecules.filter(m => !m.casNumber || m.casNumber.trim() === '');
      break;
    case 'no_iupac':
      allMolecules = allMolecules.filter(m => !m.iupacName || m.iupacName.trim() === '');
      break;
    case 'no_formula':
      allMolecules = allMolecules.filter(m => !m.chemicalFormula || m.chemicalFormula.trim() === '');
      break;
    case 'no_olfactive_profile':
      allMolecules = allMolecules.filter(m => !m.olfactiveProfile || m.olfactiveProfile.trim() === '');
      break;
    case 'no_radar':
      allMolecules = allMolecules.filter(m => 
        m.radarIntensity === 50 && m.radarFreshness === 50 && m.radarWarmth === 50 &&
        m.radarSweetness === 50 && m.radarSpiciness === 50 && m.radarEarthiness === 50
      );
      break;
    case 'all':
    default:
      // Molécules orphelines = sans famille ET sans classe chimique ET sans profil olfactif
      allMolecules = allMolecules.filter(m => 
        (!m.family || m.family.trim() === '') &&
        !m.chemicalClass &&
        (!m.olfactiveProfile || m.olfactiveProfile.trim() === '')
      );
      break;
  }

  const total = allMolecules.length;
  const paginatedMolecules = allMolecules.slice(offset, offset + limit);

  return {
    molecules: paginatedMolecules,
    total,
  };
}

export async function batchClassifyMolecules(updates: Array<{
  moleculeId: number;
  family?: string;
  chemicalClass?: string;
  olfactiveProfile?: string;
}>) {
  const db = await getDb();
  if (!db) return { success: false, updated: 0 };

  let updated = 0;
  for (const update of updates) {
    const updateData: Record<string, unknown> = {};
    if (update.family !== undefined) updateData.family = update.family;
    if (update.chemicalClass !== undefined) updateData.chemicalClass = update.chemicalClass;
    if (update.olfactiveProfile !== undefined) {
      // Écrire dans la colonne text legacy (rétrocompatibilité)
      updateData.olfactiveProfile = update.olfactiveProfile;
      // Écrire aussi dans la colonne JSON standardisée
      // Si la valeur est déjà un tableau JSON, on la parse ; sinon on la convertit en tableau
      try {
        const parsed = JSON.parse(update.olfactiveProfile);
        if (Array.isArray(parsed)) {
          updateData.olfactiveProfileJson = JSON.stringify(parsed);
        } else {
          // Valeur scalaire JSON : la mettre dans un tableau
          updateData.olfactiveProfileJson = JSON.stringify([String(parsed)]);
        }
      } catch {
        // Valeur texte brute (ex: "floral, boisé") : découper par virgule
        const arr = update.olfactiveProfile.split(',').map(s => s.trim()).filter(Boolean);
        updateData.olfactiveProfileJson = JSON.stringify(arr);
      }
    }

    if (Object.keys(updateData).length > 0) {
      await db.update(molecules).set(updateData).where(eq(molecules.id, update.moleculeId));
      updated++;
    }
  }

  return { success: true, updated };
}


// ====================================================================
// GENOMIC MOLECULE LINKS (Liaisons génomiques molécules - G1-G3)
// ====================================================================
// ============================================================================
// GENOMIC MOLECULE LINKS (Liaisons génomiques molécules - G1-G3)
// ============================================================================

/**
 * Get all genomic molecule links
 */
export async function getAllGenomicMoleculeLinks(): Promise<GenomicMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicMoleculeLinks).orderBy(desc(genomicMoleculeLinks.createdAt));
}

/**
 * Get genomic links for a molecule
 */
export async function getGenomicLinksForMolecule(moleculeId: number): Promise<GenomicMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicMoleculeLinks)
    .where(eq(genomicMoleculeLinks.moleculeId, moleculeId));
}

/**
 * Get genomic links by axis
 */
export async function getGenomicMoleculeLinksByAxis(axis: 'G1' | 'G2' | 'G3'): Promise<GenomicMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicMoleculeLinks)
    .where(eq(genomicMoleculeLinks.genomicAxis, axis))
    .orderBy(desc(genomicMoleculeLinks.relevanceScore));
}

/**
 * Get genomic links for a reference
 */
export async function getGenomicMoleculeLinksForReference(referenceId: number): Promise<GenomicMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicMoleculeLinks)
    .where(eq(genomicMoleculeLinks.referenceId, referenceId));
}

/**
 * Create a genomic molecule link
 */
export async function createGenomicMoleculeLink(data: Omit<InsertGenomicMoleculeLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<GenomicMoleculeLink> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const [result] = await db.insert(genomicMoleculeLinks).values(data);
  const [created] = await db.select().from(genomicMoleculeLinks).where(eq(genomicMoleculeLinks.id, result.insertId));
  return created;
}

/**
 * Delete a genomic molecule link
 */
export async function deleteGenomicMoleculeLink(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(genomicMoleculeLinks).where(eq(genomicMoleculeLinks.id, id));
  return true;
}


// ====================================================================
// GHOST VARIETY MOLECULE LINKS (Liaisons variétés fantômes ↔ molécules)
// ====================================================================
// ============================================================================
// GHOST VARIETY MOLECULE LINKS (Liaisons variétés fantômes ↔ molécules)
// ============================================================================


/**
 * Get all molecule links for a ghost variety
 */
export async function getGhostVarietyMoleculeLinks(ghostVarietyId: number): Promise<(GhostVarietyMoleculeLink & { molecule: { id: number; name: string; casNumber: string | null; family: string | null } | null })[]> {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db.select().from(ghostVarietyMoleculeLinks)
    .where(eq(ghostVarietyMoleculeLinks.ghostVarietyId, ghostVarietyId))
    .orderBy(desc(ghostVarietyMoleculeLinks.percentage));
  
  // Get molecule details for each link
  const result = await Promise.all(links.map(async (link) => {
    const [molecule] = await db.select({
      id: molecules.id,
      name: molecules.name,
      casNumber: molecules.casNumber,
      family: molecules.family,
    }).from(molecules).where(eq(molecules.id, link.moleculeId));
    return { ...link, molecule: molecule || null };
  }));
  
  return result;
}

/**
 * Create a ghost variety molecule link
 */
export async function createGhostVarietyMoleculeLink(data: Omit<InsertGhostVarietyMoleculeLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<GhostVarietyMoleculeLink> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const [result] = await db.insert(ghostVarietyMoleculeLinks).values(data);
  const [created] = await db.select().from(ghostVarietyMoleculeLinks).where(eq(ghostVarietyMoleculeLinks.id, result.insertId));
  return created;
}

/**
 * Update a ghost variety molecule link
 */
export async function updateGhostVarietyMoleculeLink(id: number, data: Partial<InsertGhostVarietyMoleculeLink>): Promise<GhostVarietyMoleculeLink | null> {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(ghostVarietyMoleculeLinks).set(data).where(eq(ghostVarietyMoleculeLinks.id, id));
  const [updated] = await db.select().from(ghostVarietyMoleculeLinks).where(eq(ghostVarietyMoleculeLinks.id, id));
  return updated || null;
}

/**
 * Delete a ghost variety molecule link
 */
export async function deleteGhostVarietyMoleculeLink(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(ghostVarietyMoleculeLinks).where(eq(ghostVarietyMoleculeLinks.id, id));
  return true;
}

/**
 * Get all molecule links (for stats)
 */
export async function getAllGhostVarietyMoleculeLinks(): Promise<GhostVarietyMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ghostVarietyMoleculeLinks).orderBy(desc(ghostVarietyMoleculeLinks.createdAt));
}


// ====================================================================
// TPS GENE - MOLECULE LINKS FUNCTIONS
// ====================================================================
// ============================================================================
// TPS GENE - MOLECULE LINKS FUNCTIONS

// ====================================================================
// Get all TPS gene-molecule links with gene and molecule details
// ====================================================================
// ============================================================================

// Get all TPS gene-molecule links with gene and molecule details
export async function getTpsGeneMoleculeLinks(filters?: {
  tpsGeneId?: number;
  moleculeId?: number;
  relationshipType?: string;
  confidenceLevel?: string;
}) {
  try {
    let query = `
      SELECT 
        tgm.id,
        tgm.tps_gene_id as tpsGeneId,
        tgm.molecule_id as moleculeId,
        tgm.relationship_type as relationshipType,
        tgm.confidence_level as confidenceLevel,
        tgm.evidence_source as evidenceSource,
        tgm.notes,
        tgm.created_at as createdAt,
        tg.name as geneName,
        tg.subfamily as geneSubfamily,
        tg.product_class as geneProductClass,
        tg.main_product as geneMainProduct,
        tg.olfactory_notes as geneOlfactoryNotes,
        m.name as moleculeName,
        m.formula as moleculeFormula,
        m.olfactiveProfile as moleculeOlfactiveProfile
      FROM tps_gene_molecules tgm
      JOIN tps_genes tg ON tgm.tps_gene_id = tg.id
      JOIN molecules m ON tgm.molecule_id = m.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (filters?.tpsGeneId) {
      query += ` AND tgm.tps_gene_id = ?`;
      params.push(filters.tpsGeneId);
    }
    
    if (filters?.moleculeId) {
      query += ` AND tgm.molecule_id = ?`;
      params.push(filters.moleculeId);
    }
    
    if (filters?.relationshipType) {
      query += ` AND tgm.relationship_type = ?`;
      params.push(filters.relationshipType);
    }
    
    if (filters?.confidenceLevel) {
      query += ` AND tgm.confidence_level = ?`;
      params.push(filters.confidenceLevel);
    }
    
    query += ` ORDER BY tg.name, m.name`;
    
    const db = await getDb();
    if (!db) return [];
    const result = await (db as any).execute(sql.raw(query.replace(/\?/g, (_, i) => `'${String(params[i] || '').replace(/'/g, "''")}'`)));
    return (result[0] as unknown) as any[];
  } catch (error: any) {
    console.error('Error getting TPS gene-molecule links:', error);
    return [];
  }
}

// Create a TPS gene-molecule link
export async function createTpsGeneMoleculeLink(data: {
  tpsGeneId: number;
  moleculeId: number;
  relationshipType?: string;
  confidenceLevel?: string;
  evidenceSource?: string;
  notes?: string;
}) {
  try {
    const db = await getDb();
    if (!db) return { success: false, error: 'Database connection failed' };
    const evidenceSource = data.evidenceSource ? `'${data.evidenceSource.replace(/'/g, "''")}'` : 'NULL';
    const notes = data.notes ? `'${data.notes.replace(/'/g, "''")}'` : 'NULL';
    await (db as any).execute(sql.raw(`
      INSERT INTO tps_gene_molecules 
        (tps_gene_id, molecule_id, relationship_type, confidence_level, evidence_source, notes)
       VALUES (${data.tpsGeneId}, ${data.moleculeId}, '${data.relationshipType || 'produces'}', '${data.confidenceLevel || 'inferred'}', ${evidenceSource}, ${notes})
    `));
    return { success: true, id: 0 };
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Cette liaison existe déjà' };
    }
    console.error('Error creating TPS gene-molecule link:', error);
    return { success: false, error: error.message };
  }
}

// Update a TPS gene-molecule link
export async function updateTpsGeneMoleculeLink(
  id: number,
  data: {
    relationshipType?: string;
    confidenceLevel?: string;
    evidenceSource?: string;
    notes?: string;
  }
) {
  try {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (data.relationshipType) {
      updates.push('relationship_type = ?');
      params.push(data.relationshipType);
    }
    if (data.confidenceLevel) {
      updates.push('confidence_level = ?');
      params.push(data.confidenceLevel);
    }
    if (data.evidenceSource !== undefined) {
      updates.push('evidence_source = ?');
      params.push(data.evidenceSource);
    }
    if (data.notes !== undefined) {
      updates.push('notes = ?');
      params.push(data.notes);
    }
    
    if (updates.length === 0) {
      return { success: false, error: 'Aucune mise à jour fournie' };
    }
    
    params.push(id);
    
    const db = await getDb();
    if (!db) return { success: false, error: 'Database connection failed' };
    const setClause = updates.map((u, i) => u.replace('?', `'${String(params[i]).replace(/'/g, "''")}'`)).join(', ');
    await (db as any).execute(sql.raw(`UPDATE tps_gene_molecules SET ${setClause} WHERE id = ${id}`));
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating TPS gene-molecule link:', error);
    return { success: false, error: error.message };
  }
}

// Delete a TPS gene-molecule link
export async function deleteTpsGeneMoleculeLink(id: number) {
  try {
    const db = await getDb();
    if (!db) return { success: false, error: 'Database connection failed' };
    await (db as any).execute(sql.raw(`DELETE FROM tps_gene_molecules WHERE id = ${id}`));
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting TPS gene-molecule link:', error);
    return { success: false, error: error.message };
  }
}

// Get TPS gene-molecule link statistics
export async function getTpsGeneMoleculeLinkStats() {
  try {
    const db = await getDb();
    if (!db) {
      return {
        totalLinks: 0,
        byRelationship: [],
        byConfidence: [],
        linkedGenes: 0,
        linkedMolecules: 0,
        totalGenes: 0,
        totalMolecules: 0,
        geneCoverage: 0,
        moleculeCoverage: 0,
      };
    }
    
    const totalLinksResult = await (db as any).execute(sql.raw(
      'SELECT COUNT(*) as count FROM tps_gene_molecules'
    ));
    const totalLinks = ((totalLinksResult[0] as unknown) as any[])[0]?.count || 0;
    
    const byRelationshipResult = await (db as any).execute(sql.raw(`
      SELECT relationship_type as type, COUNT(*) as count 
      FROM tps_gene_molecules 
      GROUP BY relationship_type
    `));
    const byRelationship = (byRelationshipResult[0] as unknown) as any[];
    
    const byConfidenceResult = await (db as any).execute(sql.raw(`
      SELECT confidence_level as level, COUNT(*) as count 
      FROM tps_gene_molecules 
      GROUP BY confidence_level
    `));
    const byConfidence = (byConfidenceResult[0] as unknown) as any[];
    
    const linkedGenesResult = await (db as any).execute(sql.raw(`
      SELECT COUNT(DISTINCT tps_gene_id) as count FROM tps_gene_molecules
    `));
    const linkedGenes = ((linkedGenesResult[0] as unknown) as any[])[0]?.count || 0;
    
    const linkedMoleculesResult = await (db as any).execute(sql.raw(`
      SELECT COUNT(DISTINCT molecule_id) as count FROM tps_gene_molecules
    `));
    const linkedMolecules = ((linkedMoleculesResult[0] as unknown) as any[])[0]?.count || 0;
    
    const totalGenesResult = await (db as any).execute(sql.raw(
      'SELECT COUNT(*) as count FROM tps_genes'
    ));
    const totalGenesCount = ((totalGenesResult[0] as unknown) as any[])[0]?.count || 0;
    
    const totalMoleculesResult = await (db as any).execute(sql.raw(
      'SELECT COUNT(*) as count FROM molecules'
    ));
    const totalMoleculesCount = ((totalMoleculesResult[0] as unknown) as any[])[0]?.count || 0;
    
    return {
      totalLinks,
      byRelationship,
      byConfidence,
      linkedGenes,
      linkedMolecules,
      totalGenes: totalGenesCount,
      totalMolecules: totalMoleculesCount,
      geneCoverage: linkedGenes / (totalGenesCount || 1) * 100,
      moleculeCoverage: linkedMolecules / (totalMoleculesCount || 1) * 100,
    };
  } catch (error: any) {
    console.error('Error getting TPS gene-molecule link stats:', error);
    return {
      totalLinks: 0,
      byRelationship: [],
      byConfidence: [],
      linkedGenes: 0,
      linkedMolecules: 0,
      totalGenes: 0,
      totalMolecules: 0,
      geneCoverage: 0,
      moleculeCoverage: 0,
    };
  }
}

// Auto-link TPS genes to molecules based on product name matching
export async function autoLinkTpsGenesToMolecules() {
  try {
    const db = await getDb();
    if (!db) {
      return { success: false, error: 'Database connection failed', linksCreated: 0 };
    }
    
    // Get all TPS genes with their main products
    const genesResult = await (db as any).execute(sql.raw(`
      SELECT id, name, main_product FROM tps_genes
    `));
    const genes = (genesResult[0] as unknown) as any[];
    
    // Get all molecules
    const moleculesResult = await (db as any).execute(sql.raw(`
      SELECT id, name FROM molecules
    `));
    const moleculesList = (moleculesResult[0] as unknown) as any[];
    
    let linksCreated = 0;
    
    for (const gene of genes) {
      if (!gene.main_product) continue;
      const mainProduct = gene.main_product.toLowerCase();
      
      // Find matching molecules
      for (const mol of moleculesList) {
        const molName = mol.name.toLowerCase();
        
        // Check for exact or partial match
        if (molName.includes(mainProduct) || mainProduct.includes(molName)) {
          // Try to create link (will fail silently if already exists)
          const result = await createTpsGeneMoleculeLink({
            tpsGeneId: gene.id,
            moleculeId: mol.id,
            relationshipType: 'produces',
            confidenceLevel: 'inferred',
            evidenceSource: 'Auto-link based on product name matching',
          });
          
          if (result.success) {
            linksCreated++;
          }
        }
      }
    }
    
    return { success: true, linksCreated };
  } catch (error: any) {
    console.error('Error auto-linking TPS genes to molecules:', error);
    return { success: false, error: error.message, linksCreated: 0 };
  }
}

// Search for potential molecule matches for a TPS gene
export async function searchMoleculeMatchesForTpsGene(tpsGeneId: number) {
  try {
    const db = await getDb();
    if (!db) {
      return { success: false, error: 'Database connection failed', matches: [] };
    }
    
    // Get the TPS gene details
    const geneResult = await (db as any).execute(sql.raw(
      `SELECT * FROM tps_genes WHERE id = ${tpsGeneId}`
    ));
    const geneRows = (geneResult[0] as unknown) as any[];
    
    const gene = geneRows[0];
    if (!gene) {
      return { success: false, error: 'Gène TPS non trouvé', matches: [] };
    }
    
    // Search for molecules that might match
    const mainProduct = gene.main_product || '';
    const olfactoryNotes = gene.olfactory_notes || '';
    const searchTerm = mainProduct.toLowerCase().replace(/'/g, "''");
    const olfactoryTerm = (olfactoryNotes.split(',')[0] || '').replace(/'/g, "''");
    
    const matchesResult = await (db as any).execute(sql.raw(`
      SELECT 
        m.id,
        m.name,
        m.formula,
        m.olfactiveProfile,
        m.chemicalClass
      FROM molecules m
      WHERE 
        LOWER(m.name) LIKE '%${searchTerm}%'
        OR '${searchTerm}' LIKE CONCAT('%', LOWER(m.name), '%')
        OR (m.olfactiveProfile IS NOT NULL AND m.olfactiveProfile LIKE '%${olfactoryTerm}%')
      LIMIT 20
    `));
    const matches = (matchesResult[0] as unknown) as any[];
    
    return {
      success: true,
      gene: {
        id: gene.id,
        name: gene.name,
        mainProduct: gene.main_product,
        olfactoryNotes: gene.olfactory_notes,
      },
      matches,
    };
  } catch (error: any) {
    console.error('Error searching molecule matches:', error);
    return { success: false, error: error.message, matches: [] };
  }
}



// ====================================================================
// TPS GENES BY MOLECULE (Biosynthesis pathway information)
// ====================================================================
// ============================================================================
// TPS GENES BY MOLECULE (Biosynthesis pathway information)
// ============================================================================

/**
 * Get TPS genes that produce a specific molecule (terpene)
 * Returns gene information with biosynthesis pathway details
 */
export async function getTpsGenesByMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    // First get the molecule name to match with gene products
    const moleculeResult = await db.select({
      id: molecules.id,
      name: molecules.name,
      casNumber: molecules.casNumber,
    }).from(molecules).where(eq(molecules.id, moleculeId)).limit(1);
    
    if (!moleculeResult[0]) return [];
    
    const moleculeName = moleculeResult[0].name.toLowerCase();
    
    // Search for TPS genes that produce this molecule
    // Using gene_terpene_links table and matching by terpene_product field
    const result = await (db as any).execute(sql.raw(`
      SELECT 
        gtl.id,
        gtl.gene_name,
        gtl.gene_id,
        gtl.terpene_product,
        gtl.terpene_class as product_type,
        gtl.subfamily as enzyme_class,
        NULL as species,
        NULL as chromosome,
        NULL as pathway,
        gtl.olfactive_notes as expression_tissue,
        NULL as regulation_notes,
        NULL as reference_source,
        NULL as ncbi_gene_id,
        NULL as uniprot_id,
        gtl.created_at
      FROM gene_terpene_links gtl
      WHERE LOWER(gtl.terpene_product) LIKE '%${moleculeName.replace(/'/g, "''")}%'
         OR LOWER(gtl.terpene_product) LIKE '%${moleculeName.replace(/'/g, "''").replace(/[\u03b1\u03b2\u03b3\u03b4-]/g, '%')}%'
      ORDER BY gtl.gene_name
    `));
    
    const rows = (result[0] as unknown) as any[];
    
    return rows.map((row: any) => ({
      id: row.id,
      geneName: row.gene_name,
      geneId: row.gene_id,
      terpeneProduct: row.terpene_product,
      productType: row.product_type,
      enzymeClass: row.enzyme_class,
      species: row.species,
      chromosome: row.chromosome,
      pathway: row.pathway,
      expressionTissue: row.expression_tissue,
      regulationNotes: row.regulation_notes,
      referenceSource: row.reference_source,
      ncbiGeneId: row.ncbi_gene_id,
      uniprotId: row.uniprot_id,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error("Error getting TPS genes for molecule:", error);
    return [];
  }
}

/**
 * Get all TPS genes with their terpene products
 */
export async function getAllTpsGenes() {
  const db = await getDb();
  if (!db) return [];
  
  try {
    const result = await (db as any).execute(sql.raw(`
      SELECT 
        gtl.id,
        gtl.gene_name,
        gtl.gene_id,
        gtl.terpene_product,
        gtl.terpene_class as product_type,
        gtl.subfamily as enzyme_class,
        NULL as species,
        NULL as chromosome,
        NULL as pathway,
        gtl.olfactive_notes as expression_tissue,
        NULL as regulation_notes,
        NULL as reference_source,
        NULL as ncbi_gene_id,
        NULL as uniprot_id,
        gtl.created_at,
        m.id as molecule_id,
        m.name as molecule_name
      FROM gene_terpene_links gtl
      LEFT JOIN molecules m ON LOWER(m.name) LIKE CONCAT('%', LOWER(gtl.terpene_product), '%')
      ORDER BY gtl.gene_name
    `));
    
    const rows = (result[0] as unknown) as any[];
    
    return rows.map((row: any) => ({
      id: row.id,
      geneName: row.gene_name,
      geneId: row.gene_id,
      terpeneProduct: row.terpene_product,
      productType: row.product_type,
      enzymeClass: row.enzyme_class,
      species: row.species,
      chromosome: row.chromosome,
      pathway: row.pathway,
      expressionTissue: row.expression_tissue,
      regulationNotes: row.regulation_notes,
      referenceSource: row.reference_source,
      ncbiGeneId: row.ncbi_gene_id,
      uniprotId: row.uniprot_id,
      linkedMoleculeId: row.molecule_id,
      linkedMoleculeName: row.molecule_name,
    }));
  } catch (error) {
    console.error("Error getting all TPS genes:", error);
    return [];
  }
}

/**
 * Get TPS gene statistics
 */
export async function getTpsGeneStats() {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await (db as any).execute(sql.raw(`
      SELECT 
        COUNT(*) as total_genes,
        COUNT(DISTINCT plant_id) as unique_species,
        COUNT(DISTINCT subfamily) as enzyme_classes,
        COUNT(DISTINCT terpene_class) as product_types,
        COUNT(DISTINCT terpene_class) as pathways
      FROM gene_terpene_links
    `));
    
    const stats = ((result[0] as unknown) as any[])[0];
    
    // Get genes by species
    const speciesResult = await (db as any).execute(sql.raw(`
      SELECT plant_id as species, COUNT(*) as count
      FROM gene_terpene_links
      WHERE plant_id IS NOT NULL
      GROUP BY plant_id
      ORDER BY count DESC
    `));
    
    // Get genes by product type (terpene_class)
    const productTypeResult = await (db as any).execute(sql.raw(`
      SELECT terpene_class as product_type, COUNT(*) as count
      FROM gene_terpene_links
      WHERE terpene_class IS NOT NULL
      GROUP BY terpene_class
      ORDER BY count DESC
    `));
    
    return {
      totalGenes: stats?.total_genes || 0,
      uniqueSpecies: stats?.unique_species || 0,
      enzymeClasses: stats?.enzyme_classes || 0,
      productTypes: stats?.product_types || 0,
      pathways: stats?.pathways || 0,
      bySpecies: (speciesResult[0] as unknown as any[]).map((r: any) => ({
        species: r.species,
        count: r.count,
      })),
      byProductType: (productTypeResult[0] as unknown as any[]).map((r: any) => ({
        productType: r.product_type,
        count: r.count,
      })),
    };
  } catch (error) {
    console.error("Error getting TPS gene stats:", error);
    return null;
  }
}



// ====================================================================
// COCONUT Enrichment Functions
// ====================================================================
// ============================================
// COCONUT Enrichment Functions
// ============================================


/**
 * Enrichit une molécule via COCONUT avec traduction FR→EN
 */
export async function enrichMoleculeFromCOCONUTWithTranslation(moleculeId: number): Promise<{
  success: boolean;
  message: string;
  data?: {
    coconutId: string;
    npLikenessScore?: number;
    organisms?: { name: string; rank?: string }[];
  };
}> {
  const db = await getDb();
  if (!db) return { success: false, message: 'Database connection failed' };
  
  // Récupérer la molécule
  const [rows] = await (db as any).execute(
    'SELECT id, name, coconut_id FROM molecules WHERE id = ?',
    [moleculeId]
  );
  
  const molecules = rows as any[];
  if (molecules.length === 0) {
    return { success: false, message: 'Molécule non trouvée' };
  }
  
  const molecule = molecules[0];
  
  // Vérifier si déjà enrichie via COCONUT
  if (molecule.coconut_id) {
    return { success: false, message: 'Cette molécule est déjà enrichie via COCONUT' };
  }
  
  // Enrichir via COCONUT
  const result = await enrichMoleculeWithTranslationCOCONUT(molecule.name);
  
  if (!result.success || !result.coconut_id) {
    return { 
      success: false, 
      message: result.error || 'Molécule non trouvée dans COCONUT'
    };
  }
  
  // Mettre à jour la base de données
  await (db as any).execute(
    `UPDATE molecules SET 
      coconut_id = ?,
      np_likeness_score = ?,
      coconut_organisms = ?,
      coconut_citations = ?,
      coconut_enriched_at = NOW()
    WHERE id = ?`,
    [
      result.coconut_id,
      result.np_likeness_score || null,
      result.organisms ? JSON.stringify(result.organisms) : null,
      result.citations ? JSON.stringify(result.citations) : null,
      moleculeId
    ]
  );
  
  return {
    success: true,
    message: 'Molécule enrichie via COCONUT: ' + result.name,
    data: {
      coconutId: result.coconut_id,
      npLikenessScore: result.np_likeness_score,
      organisms: result.organisms,
    }
  };
}

/**
 * Récupère les molécules non enrichies pour COCONUT
 */
export async function getUnenrichedMoleculesForCOCONUT(limit: number = 50): Promise<{
  id: number;
  name: string;
  hasPubChem: boolean;
  hasChEBI: boolean;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const [rows] = await (db as any).execute(
    'SELECT id, name, pubchem_cid IS NOT NULL as hasPubChem, chebi_id IS NOT NULL as hasChEBI FROM molecules WHERE coconut_id IS NULL ORDER BY name ASC LIMIT ' + limit
  );
  
  return (rows as any[]).map(r => ({
    id: r.id,
    name: r.name,
    hasPubChem: Boolean(r.hasPubChem),
    hasChEBI: Boolean(r.hasChEBI),
  }));
}

/**
 * Statistiques d'enrichissement COCONUT
 */
export async function getCOCONUTEnrichmentStats(): Promise<{
  total: number;
  enriched: number;
  percentage: number;
  withOrganisms: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, enriched: 0, percentage: 0, withOrganisms: 0 };
  
  const [rows] = await (db as any).execute(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN coconut_id IS NOT NULL THEN 1 ELSE 0 END) as enriched,
      SUM(CASE WHEN coconut_organisms IS NOT NULL AND coconut_organisms != '[]' THEN 1 ELSE 0 END) as withOrganisms
    FROM molecules`
  );
  
  const stats = (rows as any[])[0];
  return {
    total: stats.total || 0,
    enriched: stats.enriched || 0,
    percentage: stats.total > 0 ? Math.round((stats.enriched / stats.total) * 100) : 0,
    withOrganisms: stats.withOrganisms || 0,
  };
}



// ====================================================================
// COCONUT ENRICHMENT FUNCTIONS
// ====================================================================
// ============================================================================
// COCONUT ENRICHMENT FUNCTIONS
// ============================================================================

/**
 * Update molecule with COCONUT natural product data
 */
export async function updateMoleculeCOCONUTData(moleculeId: number, data: {
  coconutId: string;
  npLikenessScore?: number;
  organisms?: { name: string; rank?: string }[];
  citations?: { doi?: string; title?: string }[];
}): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const organismsJson = data.organisms ? JSON.stringify(data.organisms).replace(/'/g, "''") : null;
  const citationsJson = data.citations ? JSON.stringify(data.citations).replace(/'/g, "''") : null;
  
  const query = "UPDATE molecules SET coconut_id = '" + data.coconutId + "'" +
    (data.npLikenessScore !== undefined ? ", np_likeness_score = " + data.npLikenessScore : "") +
    (organismsJson ? ", coconut_organisms = '" + organismsJson + "'" : "") +
    (citationsJson ? ", coconut_citations = '" + citationsJson + "'" : "") +
    ", coconut_enriched_at = NOW() WHERE id = " + moleculeId;
  
  await (db as any).execute(query);
}

/**
 * Get molecules with COCONUT organism data
 */
export async function getMoleculesWithCOCONUTOrganisms(
  limit: number = 50,
  offset: number = 0
): Promise<{
  id: number;
  name: string;
  coconutId: string;
  npLikenessScore: number | null;
  organisms: { name: string; rank?: string }[];
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const [rows] = await (db as any).execute(
    "SELECT id, name, coconut_id as coconutId, np_likeness_score as npLikenessScore, coconut_organisms as organisms FROM molecules WHERE coconut_organisms IS NOT NULL AND coconut_organisms != '[]' ORDER BY name ASC LIMIT " + limit + " OFFSET " + offset
  );
  
  return (rows as any[]).map(r => ({
    id: r.id,
    name: r.name,
    coconutId: r.coconutId,
    npLikenessScore: r.npLikenessScore,
    organisms: r.organisms ? (typeof r.organisms === 'string' ? JSON.parse(r.organisms) : r.organisms) : [],
  }));
}



// ====================================================================
// FLAVORNET ENRICHMENT FUNCTIONS
// ====================================================================
// ============================================================================
// FLAVORNET ENRICHMENT FUNCTIONS
// ============================================================================


/**
 * Update molecule with Flavornet olfactory data
 */
export async function updateMoleculeFlavornetData(moleculeId: number, data: FlavornetData): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const perceptsJson = JSON.stringify(data.percepts).replace(/'/g, "''");
  const kovatsJson = data.kovatsRI ? JSON.stringify(data.kovatsRI).replace(/'/g, "''") : null;
  
  const query = "UPDATE molecules SET flavornet_percepts = '" + perceptsJson + "'" +
    (kovatsJson ? ", flavornet_kovats_ri = '" + kovatsJson + "'" : "") +
    ", flavornet_enriched_at = NOW() WHERE id = " + moleculeId;
  
  await (db as any).execute(query);
}

/**
 * Get molecules that need Flavornet enrichment
 */
export async function getUnenrichedMoleculesForFlavornet(limit: number = 100): Promise<{
  id: number;
  name: string;
  casNumber: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const [rows] = await (db as any).execute(
    'SELECT id, name, cas_number as casNumber FROM molecules WHERE flavornet_percepts IS NULL ORDER BY name ASC LIMIT ' + limit
  );
  
  return (rows as any[]).map(r => ({
    id: r.id,
    name: r.name,
    casNumber: r.casNumber,
  }));
}

/**
 * Get molecules with Flavornet percepts
 */
export async function getMoleculesWithFlavornetPercepts(
  limit: number = 50,
  offset: number = 0
): Promise<{
  id: number;
  name: string;
  percepts: string[];
  kovatsRI: Record<string, number> | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const [rows] = await (db as any).execute(
    "SELECT id, name, flavornet_percepts as percepts, flavornet_kovats_ri as kovatsRI FROM molecules WHERE flavornet_percepts IS NOT NULL AND flavornet_percepts != '[]' ORDER BY name ASC LIMIT " + limit + " OFFSET " + offset
  );
  
  return (rows as any[]).map(r => ({
    id: r.id,
    name: r.name,
    percepts: r.percepts ? (typeof r.percepts === 'string' ? JSON.parse(r.percepts) : r.percepts) : [],
    kovatsRI: r.kovatsRI ? (typeof r.kovatsRI === 'string' ? JSON.parse(r.kovatsRI) : r.kovatsRI) : null,
  }));
}

/**
 * Flavornet enrichment statistics
 */
export async function getFlavornetEnrichmentStats(): Promise<{
  total: number;
  enriched: number;
  percentage: number;
  withPercepts: number;
  withKovatsRI: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, enriched: 0, percentage: 0, withPercepts: 0, withKovatsRI: 0 };
  
  const [totalRows] = await (db as any).execute('SELECT COUNT(*) as count FROM molecules');
  const total = (totalRows as any[])[0]?.count || 0;
  
  const [enrichedRows] = await (db as any).execute('SELECT COUNT(*) as count FROM molecules WHERE flavornet_percepts IS NOT NULL');
  const enriched = (enrichedRows as any[])[0]?.count || 0;
  
  const [perceptsRows] = await (db as any).execute("SELECT COUNT(*) as count FROM molecules WHERE flavornet_percepts IS NOT NULL AND flavornet_percepts != '[]'");
  const withPercepts = (perceptsRows as any[])[0]?.count || 0;
  
  const [kovatsRows] = await (db as any).execute('SELECT COUNT(*) as count FROM molecules WHERE flavornet_kovats_ri IS NOT NULL');
  const withKovatsRI = (kovatsRows as any[])[0]?.count || 0;
  
  return {
    total,
    enriched,
    percentage: total > 0 ? Math.round((enriched / total) * 100) : 0,
    withPercepts,
    withKovatsRI,
  };
}


/**
 * Recherche de molécules par nom (pour la page /recherche-molecule)
 */
export async function searchMoleculesByName(name: string): Promise<{
  id: number;
  name: string;
  chemicalFormula: string | null;
  olfactiveFamily: string | null;
  chemicalClass: string | null;
  casNumber: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const searchTerm = `%${name.toLowerCase()}%`;
  
  const results = await db.select()
    .from(molecules)
    .where(sql`LOWER(${molecules.name}) LIKE ${searchTerm}`)
    .orderBy(molecules.name)
    .limit(50);
  
  return results.map(m => ({
    id: m.id,
    name: m.name,
    chemicalFormula: m.chemicalFormula,
    olfactiveFamily: m.family,
    chemicalClass: m.chemicalClass,
    casNumber: m.casNumber,
  }));
}


// Note: utiliser getDb() pour obtenir l'instance drizzle


// ====================================================================
// MOLECULE PERFUMES — Parfums emblématiques
// ====================================================================
// ============================================================================
// MOLECULE PERFUMES — Parfums emblématiques
// ============================================================================

export async function getMoleculePerfumes(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await (db as any).execute(sql.raw(
    `SELECT
       mp.id,
       mp.perfume_name AS perfumeName,
       mp.perfume_house AS perfumeHouse,
       mp.perfumer,
       mp.year,
       mp.role_in_perfume AS roleInPerfume,
       mp.concentration,
       mp.description
     FROM molecule_perfumes mp
     WHERE mp.molecule_id = ${moleculeId}
     ORDER BY mp.year ASC`
  ));
  const rows: any[] = (result[0] as unknown) as any[];
  return rows.map((r: any) => ({
    id: r.id as number,
    perfumeName: r.perfumeName as string,
    perfumeHouse: r.perfumeHouse as string,
    perfumer: r.perfumer as string | null,
    year: r.year as number | null,
    roleInPerfume: r.roleInPerfume as string,
    concentration: r.concentration as string | null,
    description: r.description as string | null,
  }));
}

// Get all molecule-perfume links for the /parfums page (navigation inverse)
export async function getAllMoleculePerfumeLinks(): Promise<Array<{
  moleculeId: number;
  moleculeName: string;
  perfumeName: string;
  perfumeHouse: string;
  perfumer: string | null;
  year: number | null;
  roleInPerfume: string;
  concentration: string | null;
  description: string | null;
}>> {
  try {
    const db = await getDb();
    if (!db) return [];
    const result = await (db as any).execute(sql.raw(
      `SELECT
         mp.molecule_id       AS moleculeId,
         m.name               AS moleculeName,
         mp.perfume_name      AS perfumeName,
         mp.perfume_house     AS perfumeHouse,
         mp.perfumer          AS perfumer,
         mp.year              AS year,
         mp.role_in_perfume   AS roleInPerfume,
         mp.concentration     AS concentration,
         mp.description       AS description
       FROM molecule_perfumes mp
       JOIN molecules m ON m.id = mp.molecule_id
       ORDER BY mp.perfume_house, mp.perfume_name, mp.role_in_perfume`
    ));
    const rows: any[] = (result[0] as unknown) as any[];
    return rows.map((r: any) => ({
      moleculeId: Number(r.moleculeId),
      moleculeName: r.moleculeName as string,
      perfumeName: r.perfumeName as string,
      perfumeHouse: r.perfumeHouse as string,
      perfumer: r.perfumer as string | null,
      year: r.year ? Number(r.year) : null,
      roleInPerfume: r.roleInPerfume as string,
      concentration: r.concentration as string | null,
      description: r.description as string | null,
    }));
  } catch (error: any) {
    console.error('Error getting all molecule-perfume links:', error);
    return [];
  }
}

// ─── Parfums emblématiques d'une plante ──────────────────────────────────────
export async function getPlantPerfumes(plantId: number) {
  try {
    const dbConn = await getDb();
    if (!dbConn) return [];
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.execute(
      `SELECT id, plant_id, perfume_name, perfume_house, perfumer, year,
              role_in_perfume, ingredient_type, description, created_at
       FROM plant_perfumes
       WHERE plant_id = ?
       ORDER BY year ASC, perfume_name ASC`,
      [plantId]
    );
    await conn.end();
    return rows as any[];
  } catch (error: any) {
    console.error('Error getting plant perfumes:', error);
    return [];
  }
}

