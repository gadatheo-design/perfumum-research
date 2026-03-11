// @ts-nocheck
/**
 * Module: users
 * Généré automatiquement depuis server/db.ts
 * Sections: USER FAVORITES, Shared Collections, USER NOTES (+3 autres)
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
// USER FAVORITES
// ====================================================================
// ============================================================================
// USER FAVORITES
// ============================================================================

export async function addFavorite(userId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(userFavorites).values({
    userId,
    moleculeId,
  }).onDuplicateKeyUpdate({ set: { userId } }); // Ignore if already exists (unique constraint)
  
  return { success: true, favoriteId: result[0].insertId };
}

export async function removeFavorite(userId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(userFavorites)
    .where(and(
      eq(userFavorites.userId, userId),
      eq(userFavorites.moleculeId, moleculeId)
    ));
  
  return { success: true };
}

export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const favorites = await db
    .select({
      id: userFavorites.id,
      moleculeId: userFavorites.moleculeId,
      createdAt: userFavorites.createdAt,
      molecule: molecules,
    })
    .from(userFavorites)
    .leftJoin(molecules, eq(userFavorites.moleculeId, molecules.id))
    .where(eq(userFavorites.userId, userId))
    .orderBy(desc(userFavorites.createdAt));
  
  return favorites;
}

export async function isFavorite(userId: number, moleculeId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db
    .select({ id: userFavorites.id })
    .from(userFavorites)
    .where(and(
      eq(userFavorites.userId, userId),
      eq(userFavorites.moleculeId, moleculeId)
    ))
    .limit(1);
  
  return result.length > 0;
}


// ====================================================================
// Shared Collections
// ====================================================================
// ============================================================================

// Shared Collections
export async function createSharedCollection(data: {
  token: string;
  title: string;
  description?: string;
  moleculeIds: number[];
  creatorId: number;
  expiresAt: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(sharedCollections).values({
    token: data.token,
    title: data.title,
    description: data.description,
    moleculeIds: JSON.stringify(data.moleculeIds),
    creatorId: data.creatorId,
    expiresAt: data.expiresAt,
    viewCount: 0,
  }).$returningId();
  
  return result;
}

export async function getSharedCollectionByToken(token: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [collection] = await db
    .select()
    .from(sharedCollections)
    .where(eq(sharedCollections.token, token));
  
  if (!collection) return null;
  
  // Check if expired
  if (new Date() > new Date(collection.expiresAt)) {
    return null;
  }
  
  // Increment view count
  await db
    .update(sharedCollections)
    .set({ viewCount: collection.viewCount + 1 })
    .where(eq(sharedCollections.id, collection.id));
  
  return {
    ...collection,
    viewCount: collection.viewCount + 1, // Return incremented value
    moleculeIds: JSON.parse(collection.moleculeIds) as number[],
  };
}

export async function getUserSharedCollections(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const collections = await db
    .select()
    .from(sharedCollections)
    .where(eq(sharedCollections.creatorId, userId))
    .orderBy(desc(sharedCollections.createdAt));
  
  return collections.map(c => ({
    ...c,
    moleculeIds: JSON.parse(c.moleculeIds) as number[],
  }));
}

// Molecule Notes
export async function getMoleculeNote(userId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [note] = await db
    .select()
    .from(moleculeNotes)
    .where(
      and(
        eq(moleculeNotes.userId, userId),
        eq(moleculeNotes.moleculeId, moleculeId)
      )
    );
  
  if (!note) return null;
  
  return {
    ...note,
    tags: note.tags ? JSON.parse(note.tags) as string[] : [],
  };
}

export async function upsertMoleculeNote(data: {
  userId: number;
  moleculeId: number;
  note: string;
  tags?: string[];
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getMoleculeNote(data.userId, data.moleculeId);
  
  if (existing) {
    // Update
    await db
      .update(moleculeNotes)
      .set({
        note: data.note,
        tags: data.tags ? JSON.stringify(data.tags) : null,
      })
      .where(eq(moleculeNotes.id, existing.id));
    
    return getMoleculeNote(data.userId, data.moleculeId);
  } else {
    // Insert
    const [result] = await db.insert(moleculeNotes).values({
      userId: data.userId,
      moleculeId: data.moleculeId,
      note: data.note,
      tags: data.tags ? JSON.stringify(data.tags) : null,
    }).$returningId();
    
    return getMoleculeNote(data.userId, data.moleculeId);
  }
}

export async function getUserMoleculeNotes(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const notes = await db
    .select()
    .from(moleculeNotes)
    .where(eq(moleculeNotes.userId, userId))
    .orderBy(desc(moleculeNotes.updatedAt));
  
  return notes.map(n => ({
    ...n,
    tags: n.tags ? JSON.parse(n.tags) as string[] : [],
  }));
}

export async function deleteMoleculeNote(userId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(moleculeNotes)
    .where(
      and(
        eq(moleculeNotes.userId, userId),
        eq(moleculeNotes.moleculeId, moleculeId)
      )
    );
  
  return { success: true };
}

// Citations
export async function generateCitation(
  entityType: 'molecule' | 'recipe' | 'prototype' | 'accord',
  entityId: number,
  format: 'apa' | 'mla' | 'chicago' | 'bibtex' = 'apa'
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get entity data
  let entityData: any = null;
  let citationText = '';
  
  if (entityType === 'molecule') {
    const [molecule] = await db.select().from(molecules).where(eq(molecules.id, entityId));
    if (!molecule) throw new Error("Molecule not found");
    entityData = molecule;
    
    // Generate citation based on format
    const year = new Date(molecule.createdAt).getFullYear();
    
    if (format === 'apa') {
      citationText = `PERFUMUM Research. (${year}). ${molecule.name}${molecule.chemicalFormula ? ` [${molecule.chemicalFormula}]` : ''}. PERFUMUM Molecular Database. https://perfumum.manus.space/molecule/${entityId}`;
    } else if (format === 'mla') {
      citationText = `"${molecule.name}." PERFUMUM Molecular Database, PERFUMUM Research, ${year}, perfumum.manus.space/molecule/${entityId}.`;
    } else if (format === 'chicago') {
      citationText = `PERFUMUM Research. "${molecule.name}." PERFUMUM Molecular Database. Accessed ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. https://perfumum.manus.space/molecule/${entityId}.`;
    } else if (format === 'bibtex') {
      citationText = `@misc{perfumum_molecule_${entityId},
  title={${molecule.name}${molecule.chemicalFormula ? ` [${molecule.chemicalFormula}]` : ''}},
  author={PERFUMUM Research},
  year={${year}},
  howpublished={\\url{https://perfumum.manus.space/molecule/${entityId}}},
  note={PERFUMUM Molecular Database}
}`;
    }
  } else if (entityType === 'recipe') {
    const [recipe] = await db.select().from(recettes).where(eq(recettes.id, entityId));
    if (!recipe) throw new Error("Recipe not found");
    entityData = recipe;
    
    const year = new Date(recipe.createdAt).getFullYear();
    
    if (format === 'apa') {
      citationText = `PERFUMUM Research. (${year}). ${recipe.name}. PERFUMUM Recipe Database. https://perfumum.manus.space/recette/${entityId}`;
    } else if (format === 'mla') {
      citationText = `"${recipe.name}." PERFUMUM Recipe Database, PERFUMUM Research, ${year}, perfumum.manus.space/recette/${entityId}.`;
    } else if (format === 'chicago') {
      citationText = `PERFUMUM Research. "${recipe.name}." PERFUMUM Recipe Database. Accessed ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. https://perfumum.manus.space/recette/${entityId}.`;
    } else if (format === 'bibtex') {
      citationText = `@misc{perfumum_recipe_${entityId},
  title={${recipe.name}},
  author={PERFUMUM Research},
  year={${year}},
  howpublished={\\url{https://perfumum.manus.space/recette/${entityId}}},
  note={PERFUMUM Recipe Database}
}`;
    }
  }
  
  // Save citation
  const [result] = await db.insert(citations).values({
    entityType,
    entityId,
    format,
    citationText,
    url: `https://perfumum.manus.space/${entityType}/${entityId}`,
  }).$returningId();
  
  return {
    id: result.id,
    citationText,
    format,
  };
}

export async function getCitation(entityType: string, entityId: number, format: string = 'apa') {
  const db = await getDb();
  if (!db) return null;
  
  const [citation] = await db
    .select()
    .from(citations)
    .where(
      and(
        eq(citations.entityType, entityType as any),
        eq(citations.entityId, entityId),
        eq(citations.format, format as any)
      )
    );
  
  return citation;
}

export async function getRecetteMolecules(recetteId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select({
      molecule: molecules,
      proportion: moleculesRecettes.proportion,
    })
    .from(moleculesRecettes)
    .innerJoin(molecules, eq(moleculesRecettes.moleculeId, molecules.id))
    .where(eq(moleculesRecettes.recetteId, recetteId));
  
  return results;
}


export async function getAllRecettesWithMolecules() {
  const db = await getDb();
  if (!db) return [];
  
  const recettesCBD = await db
    .select()
    .from(recettes)
    .where(eq(recettes.category, "resine_cbd" as any));
  
  const result = await Promise.all(
    recettesCBD.map(async (recette: any) => {
      const mols = await db
        .select({
          molecule: molecules,
          proportion: moleculesRecettes.proportion,
        })
        .from(moleculesRecettes)
        .innerJoin(molecules, eq(moleculesRecettes.moleculeId, molecules.id))
        .where(eq(moleculesRecettes.recetteId, recette.id));
      
      return {
        recette,
        molecules: mols,
      };
    })
  );
  
  return result;
}



// ====================================================================
// USER NOTES
// ====================================================================
// ============================================================================
// USER NOTES
// ============================================================================

export async function createUserNote(entityType: string, entityId: number, content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(userNotes).values({
    entityType,
    entityId,
    content,
  });
  
  return { id: Number((result as any).insertId) };
}

export async function updateUserNote(id: number, content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(userNotes)
    .set({ content, updatedAt: new Date() })
    .where(eq(userNotes.id, id));
  
  return { success: true };
}

export async function deleteUserNote(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(userNotes).where(eq(userNotes.id, id));
  
  return { success: true };
}

export async function getUserNoteByEntity(entityType: string, entityId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(userNotes)
    .where(
      and(
        eq(userNotes.entityType, entityType),
        eq(userNotes.entityId, entityId)
      )
    )
    .limit(1);
  
  return result[0] || null;
}

export async function searchUserNotes(query: string) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(userNotes)
    .where(like(userNotes.content, `%${query}%`))
    .orderBy(desc(userNotes.updatedAt))
    .limit(20);
  
  return result;
}



// ====================================================================
// SAVED FORMULAS (Historique des formules générées)
// ====================================================================
// ============================================================================
// SAVED FORMULAS (Historique des formules générées)
// ============================================================================

export async function saveFormula(data: InsertSavedFormula): Promise<SavedFormula> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.insert(savedFormulas).values(data);
  const insertedId = Number(result[0].insertId);
  
  const saved = await getFormulaById(insertedId);
  
  if (!saved) throw new Error('Failed to retrieve saved formula');
  return saved;
}

export async function getFormulaHistory(userId: number): Promise<SavedFormula[]> {
  const db = await getDb();
  if (!db) return [];
  
  const formulas = await db.select().from(savedFormulas)
    .where(eq(savedFormulas.userId, userId))
    .orderBy(desc(savedFormulas.createdAt));
  
  return formulas;
}

export async function getFormulaById(id: number): Promise<SavedFormula | null> {
  const db = await getDb();
  if (!db) return null;
  
  const formulas = await db.select().from(savedFormulas)
    .where(eq(savedFormulas.id, id))
    .limit(1);
  
  return formulas[0] || null;
}

export async function deleteFormula(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.delete(savedFormulas).where(eq(savedFormulas.id, id));
}

export async function updateFormulaNotes(id: number, notes: string): Promise<SavedFormula> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.update(savedFormulas).set({ notes }).where(eq(savedFormulas.id, id));
  
  const updated = await getFormulaById(id);
  if (!updated) throw new Error('Formula not found after update');
  
  return updated;
}


// ====================================================================
// CONTRIBUTOR INTERFACE - DUPLICATE DETECTION
// ====================================================================
// ============================================================================
// CONTRIBUTOR INTERFACE - DUPLICATE DETECTION
// ============================================================================

/**
 * Recherche de doublons potentiels pour une molécule
 * Vérifie par nom (similarité), CAS number et IUPAC name
 */
export async function findMoleculeDuplicates(data: {
  name?: string;
  casNumber?: string;
  iupacName?: string;
}) {
  const db = await getDb();
  if (!db) return { exact: [], similar: [] };
  
  const exact: Molecule[] = [];
  const similar: Molecule[] = [];
  
  // Recherche exacte par CAS number (identifiant unique)
  if (data.casNumber) {
    const casMatches = await db.select().from(molecules)
      .where(eq(molecules.casNumber, data.casNumber));
    exact.push(...casMatches);
  }
  
  // Recherche exacte par nom
  if (data.name) {
    const nameMatches = await db.select().from(molecules)
      .where(eq(molecules.name, data.name));
    // Éviter les doublons si déjà trouvé par CAS
    for (const m of nameMatches) {
      if (!exact.find(e => e.id === m.id)) {
        exact.push(m);
      }
    }
  }
  
  // Recherche similaire par nom (LIKE)
  if (data.name && data.name.length >= 3) {
    const similarMatches = await db.select().from(molecules)
      .where(like(molecules.name, `%${data.name}%`))
      .limit(10);
    for (const m of similarMatches) {
      if (!exact.find(e => e.id === m.id) && !similar.find(s => s.id === m.id)) {
        similar.push(m);
      }
    }
  }
  
  // Recherche par IUPAC name
  if (data.iupacName) {
    const iupacMatches = await db.select().from(molecules)
      .where(like(molecules.iupacName, `%${data.iupacName}%`))
      .limit(5);
    for (const m of iupacMatches) {
      if (!exact.find(e => e.id === m.id) && !similar.find(s => s.id === m.id)) {
        similar.push(m);
      }
    }
  }
  
  return { exact, similar };
}

/**
 * Recherche de doublons potentiels pour une plante
 * Vérifie par nom commun et nom latin
 */
export async function findPlantDuplicates(data: {
  name?: string;
  latinName?: string;
}) {
  const db = await getDb();
  if (!db) return { exact: [], similar: [] };
  
  const exact: Plant[] = [];
  const similar: Plant[] = [];
  
  // Recherche exacte par nom latin (identifiant unique)
  if (data.latinName) {
    const latinMatches = await db.select().from(plants)
      .where(eq(plants.latinName, data.latinName));
    exact.push(...latinMatches);
  }
  
  // Recherche exacte par nom commun
  if (data.name) {
    const nameMatches = await db.select().from(plants)
      .where(eq(plants.name, data.name));
    for (const p of nameMatches) {
      if (!exact.find(e => e.id === p.id)) {
        exact.push(p);
      }
    }
  }
  
  // Recherche similaire par nom commun
  if (data.name && data.name.length >= 3) {
    const similarMatches = await db.select().from(plants)
      .where(like(plants.name, `%${data.name}%`))
      .limit(10);
    for (const p of similarMatches) {
      if (!exact.find(e => e.id === p.id) && !similar.find(s => s.id === p.id)) {
        similar.push(p);
      }
    }
  }
  
  // Recherche similaire par nom latin
  if (data.latinName && data.latinName.length >= 3) {
    const latinSimilar = await db.select().from(plants)
      .where(like(plants.latinName, `%${data.latinName}%`))
      .limit(10);
    for (const p of latinSimilar) {
      if (!exact.find(e => e.id === p.id) && !similar.find(s => s.id === p.id)) {
        similar.push(p);
      }
    }
  }
  
  return { exact, similar };
}

/**
 * Recherche de molécules pour auto-complétion
 */
export async function searchMoleculesForAutocomplete(query: string, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  if (query.length < 2) return [];
  
  return db.select({
    id: molecules.id,
    name: molecules.name,
    casNumber: molecules.casNumber,
    chemicalFormula: molecules.chemicalFormula,
    family: molecules.family,
  }).from(molecules)
    .where(
      or(
        like(molecules.name, `%${query}%`),
        like(molecules.casNumber, `%${query}%`),
        like(molecules.iupacName, `%${query}%`)
      )
    )
    .limit(limit);
}

/**
 * Recherche de plantes pour auto-complétion
 */
export async function searchPlantsForAutocomplete(query: string, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  if (query.length < 2) return [];
  
  return db.select({
    id: plants.id,
    name: plants.name,
    latinName: plants.latinName,
    family: plants.family,
    category: plants.category,
  }).from(plants)
    .where(
      or(
        like(plants.name, `%${query}%`),
        like(plants.latinName, `%${query}%`)
      )
    )
    .limit(limit);
}


// ====================================================================
// NOTIFICATIONS SYSTEM
// ====================================================================
// ============================================================================
// NOTIFICATIONS SYSTEM
// ============================================================================


export async function createNotification(data: InsertNotification): Promise<Notification | null> {
  const db = await getDb();
  if (!db) return null;

  const [result] = await db.insert(notifications).values(data);
  const [notification] = await db.select().from(notifications).where(eq(notifications.id, result.insertId));
  return notification || null;
}

export async function getNotifications(options: {
  unreadOnly?: boolean;
  type?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const db = await getDb();
  if (!db) return { notifications: [], total: 0, unreadCount: 0 };

  const { unreadOnly = false, type, limit = 50, offset = 0 } = options;

  let query = db.select().from(notifications);
  
  // Récupérer toutes les notifications pour les comptes
  const allNotifications = await query.orderBy(desc(notifications.createdAt));
  
  // Filtrer
  let filtered = allNotifications;
  if (unreadOnly) {
    filtered = filtered.filter(n => !n.isRead);
  }
  if (type) {
    filtered = filtered.filter(n => n.type === type);
  }

  const total = filtered.length;
  const unreadCount = allNotifications.filter(n => !n.isRead).length;
  const paginatedNotifications = filtered.slice(offset, offset + limit);

  return {
    notifications: paginatedNotifications,
    total,
    unreadCount,
  };
}

export async function markNotificationAsRead(notificationId: number, userId?: number) {
  const db = await getDb();
  if (!db) return false;

  await db.update(notifications)
    .set({ 
      isRead: true, 
      readAt: new Date(),
      readBy: userId || null,
    })
    .where(eq(notifications.id, notificationId));

  return true;
}

export async function markAllNotificationsAsRead(userId?: number) {
  const db = await getDb();
  if (!db) return false;

  await db.update(notifications)
    .set({ 
      isRead: true, 
      readAt: new Date(),
      readBy: userId || null,
    })
    .where(eq(notifications.isRead, false));

  return true;
}

export async function deleteNotification(notificationId: number) {
  const db = await getDb();
  if (!db) return false;

  await db.delete(notifications).where(eq(notifications.id, notificationId));
  return true;
}

export async function createOrphanMoleculeNotification(moleculeIds: number[], importSource?: string) {
  const db = await getDb();
  if (!db) return null;

  const count = moleculeIds.length;
  if (count === 0) return null;

  return await createNotification({
    type: 'import_orphan_molecules',
    title: `${count} molécule${count > 1 ? 's' : ''} sans classification importée${count > 1 ? 's' : ''}`,
    message: `${count} nouvelle${count > 1 ? 's' : ''} molécule${count > 1 ? 's' : ''} ${count > 1 ? 'ont été importées' : 'a été importée'} sans classification complète. ${importSource ? `Source: ${importSource}` : ''}`,
    severity: 'warning',
    entityType: 'molecule',
    metadata: {
      count,
      moleculeIds,
      importId: importSource,
    },
  });
}

