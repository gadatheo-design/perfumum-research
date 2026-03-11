// @ts-nocheck
/**
 * Module: materials
 * Généré automatiquement depuis server/db.ts
 * Sections: LABORATOIRE (Matières Premières), SUPPLIERS (Fournisseurs), RAW MATERIALS (Matières premières) (+2 autres)
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
// LABORATOIRE (Matières Premières)
// ====================================================================
// ============================================================================
// LABORATOIRE (Matières Premières)
// ============================================================================

export async function getAllMatieres(): Promise<Laboratoire[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(laboratoire);
}

export async function getMatiereById(id: number): Promise<Laboratoire | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(laboratoire).where(eq(laboratoire.id, id)).limit(1);
  return result[0];
}

export async function createMatiere(data: {
  name: string;
  botanicalName?: string;
  type: "huile_essentielle" | "absolu" | "resinoid" | "concrete" | "co2" | "teinture" | "poudre" | "alcoolat" | "autre";
  olfactiveFamily?: string;
  note?: "tete" | "coeur" | "fond" | "tete_coeur" | "coeur_fond";
  origin?: string;
  extractionMethod?: "distillation" | "extraction_solvant" | "co2_supercritique" | "expression" | "teinture" | "autre";
  olfactiveProfile?: string;
  character?: string;
  supplier?: string;
  pricePerMl?: number;
  stock?: number;
  status?: "en_stock" | "a_commander" | "epuise";
  technicalNotes?: string;
  manipulationNotes?: string;
  maxTemperature?: number;
}): Promise<{ id: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(laboratoire).values({
    name: data.name,
    botanicalName: data.botanicalName || null,
    type: data.type,
    olfactiveFamily: (data as any).olfactiveFamily || (data as any).family || null,
    note: data.note || null,
    origin: data.origin || null,
    extractionMethod: data.extractionMethod || null,
    olfactiveProfile: data.olfactiveProfile || null,
    character: data.character || null,
    supplier: data.supplier || null,
    pricePerMl: data.pricePerMl || null,
    stock: data.stock || null,
    status: data.status || "a_commander",
    technicalNotes: data.technicalNotes || null,
    manipulationNotes: data.manipulationNotes || null,
    maxTemperature: data.maxTemperature || null,
  });
  
  return { id: Number(result[0].insertId) };
}

export async function updateMatiereStock(id: number, stock: number, status?: "en_stock" | "a_commander" | "epuise"): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const updateData: any = { stock };
  if (status) updateData.status = status;
  
  await db.update(laboratoire).set(updateData).where(eq(laboratoire.id, id));
}


// ====================================================================
// SUPPLIERS (Fournisseurs)
// ====================================================================
// ============================================================================
// SUPPLIERS (Fournisseurs)
// ============================================================================

/**
 * Get all suppliers
 */
export async function getAllSuppliers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(suppliers);
}

/**
 * Get supplier by ID
 */
export async function getSupplierById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select()
    .from(suppliers)
    .where(eq(suppliers.id, id))
    .limit(1);
  return results[0] || null;
}

/**
 * Get suppliers by country
 */
export async function getSuppliersByCountry(country: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select()
    .from(suppliers)
    .where(eq(suppliers.country, country));
}

/**
 * Get suppliers by region
 */
export async function getSuppliersByRegion(region: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select()
    .from(suppliers)
    .where(eq(suppliers.region, region));
}

/**
 * Create a new supplier
 */
export async function createSupplier(data: {
  name: string;
  companyName?: string;
  country: string;
  region?: string;
  email?: string;
  phone?: string;
  website?: string;
  specialties?: string[];
  description?: string;
  rating?: number;
  certifications?: string[];
  isPreferred?: boolean;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(suppliers).values({
    name: data.name,
    companyName: data.companyName,
    country: data.country,
    region: data.region,
    email: data.email,
    phone: data.phone,
    website: data.website,
    specialties: data.specialties ? JSON.stringify(data.specialties) : null,
    description: data.description,
    rating: data.rating,
    certifications: data.certifications ? JSON.stringify(data.certifications) : null,
    isPreferred: data.isPreferred ? 1 : 0,
    notes: data.notes,
  });
  return result;
}

/**
 * Update a supplier
 */
export async function updateSupplier(id: number, data: Partial<{
  name: string;
  companyName: string;
  country: string;
  region: string;
  email: string;
  phone: string;
  website: string;
  specialties: string[];
  description: string;
  rating: number;
  certifications: string[];
  isPreferred: boolean;
  notes: string;
}>) {
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.companyName !== undefined) updateData.companyName = data.companyName;
  if (data.country !== undefined) updateData.country = data.country;
  if (data.region !== undefined) updateData.region = data.region;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.website !== undefined) updateData.website = data.website;
  if (data.specialties !== undefined) updateData.specialties = JSON.stringify(data.specialties);
  if (data.description !== undefined) updateData.description = data.description;
  if (data.rating !== undefined) updateData.rating = data.rating;
  if (data.certifications !== undefined) updateData.certifications = JSON.stringify(data.certifications);
  if (data.isPreferred !== undefined) updateData.isPreferred = data.isPreferred ? 1 : 0;
  if (data.notes !== undefined) updateData.notes = data.notes;

  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .update(suppliers)
    .set(updateData)
    .where(eq(suppliers.id, id));
}

/**
 * Delete a supplier
 */
export async function deleteSupplier(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .delete(suppliers)
    .where(eq(suppliers.id, id));
}

/**
 * Get supplier materials (link between supplier and molecules)
 */
export async function getSupplierMaterials(supplierId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select()
    .from(supplierMaterials)
    .where(eq(supplierMaterials.supplierId, supplierId));
}

/**
 * Add a material to a supplier
 */
export async function addSupplierMaterial(data: {
  supplierId: number;
  moleculeId: number;
  pricePerUnit?: number;
  currency?: string;
  minimumOrderQuantity?: number;
  unit?: string;
  leadTimeDays?: number;
  qualityGrade?: "standard" | "premium" | "extra_premium";
  isAvailable?: boolean;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(supplierMaterials).values({
    supplierId: data.supplierId,
    moleculeId: data.moleculeId,
    pricePerUnit: data.pricePerUnit ? String(data.pricePerUnit) : null,
    currency: data.currency || "USD",
    minimumOrderQuantity: data.minimumOrderQuantity,
    unit: data.unit,
    leadTimeDays: data.leadTimeDays,
    qualityGrade: data.qualityGrade || "standard",
    isAvailable: data.isAvailable !== false ? 1 : 0,
    notes: data.notes,
  });
  return result;
}



// ====================================================================
// RAW MATERIALS (Matières premières)
// ====================================================================
// ============================================================================
// RAW MATERIALS (Matières premières)
// ============================================================================

export async function getAllRawMaterials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rawMaterials).orderBy(rawMaterials.name);
}

export async function getRawMaterialById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(rawMaterials).where(eq(rawMaterials.id, id));
  return results[0] || null;
}

export async function getRawMaterialByMaterialId(materialId: string) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(rawMaterials).where(eq(rawMaterials.materialId, materialId));
  return results[0] || null;
}

export async function getRawMaterialsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rawMaterials).where(eq(rawMaterials.category, category as any)).orderBy(rawMaterials.name);
}

export async function getRawMaterialsByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rawMaterials).where(eq(rawMaterials.plantId, plantId)).orderBy(rawMaterials.name);
}

export async function getRawMaterialsByTerroir(terroirId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rawMaterials).where(eq(rawMaterials.terroirId, terroirId)).orderBy(rawMaterials.name);
}

export async function createRawMaterial(data: InsertRawMaterial) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(rawMaterials).values(data);
  const insertId = Number(result[0].insertId);
  return { id: insertId };
}

export async function updateRawMaterial(id: number, data: Partial<InsertRawMaterial>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(rawMaterials).set(data).where(eq(rawMaterials.id, id));
  return await getRawMaterialById(id);
}

export async function deleteRawMaterial(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(rawMaterials).where(eq(rawMaterials.id, id));
}


// ====================================================================
// RAW MATERIALS — Filtrage et statistiques
// ====================================================================
// ============================================================================
// RAW MATERIALS — Filtrage et statistiques
// ============================================================================

export async function getRawMaterialsFiltered(params: {
  search?: string;
  category?: string;
  categories?: string[];
  olfactiveFamily?: string;
  quality?: string;
  availability?: string;
  priceRange?: string;
  page?: number;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0, page: 1, totalPages: 0 };

  const { search, category, categories, olfactiveFamily, quality, availability, priceRange } = params;
  const page = params.page ?? 1;
  const limit = params.limit ?? 24;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];
  if (search) {
    const s = `%${search}%`;
    conditions.push(
      or(
        like(rawMaterials.name, s),
        like(rawMaterials.latinName, s),
        like(rawMaterials.olfactiveProfile, s)
      ) as SQL
    );
  }
  // Filtrage par liste de catégories (pour les groupes multi-catégories)
  if (categories && categories.length > 0) {
    conditions.push(inArray(rawMaterials.category, categories as any[]));
  } else if (category) {
    conditions.push(eq(rawMaterials.category, category as any));
  }
  if (olfactiveFamily) conditions.push(eq(rawMaterials.olfactiveFamily, olfactiveFamily as any));
  if (quality) conditions.push(eq(rawMaterials.quality, quality as any));
  if (availability) conditions.push(eq(rawMaterials.availability, availability as any));
  if (priceRange) conditions.push(eq(rawMaterials.priceRange, priceRange as any));

  const whereExpr = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult, items] = await Promise.all([
    db.select({ count: count() }).from(rawMaterials).where(whereExpr),
    db.select({
      id: rawMaterials.id,
      materialId: rawMaterials.materialId,
      name: rawMaterials.name,
      latinName: rawMaterials.latinName,
      category: rawMaterials.category,
      olfactiveFamily: rawMaterials.olfactiveFamily,
      olfactiveProfile: rawMaterials.olfactiveProfile,
      quality: rawMaterials.quality,
      priceRange: rawMaterials.priceRange,
      availability: rawMaterials.availability,
      originCountry: rawMaterials.originCountry,
      originRegion: rawMaterials.originRegion,
      topNotes: rawMaterials.topNotes,
      heartNotes: rawMaterials.heartNotes,
      baseNotes: rawMaterials.baseNotes,
      plantId: rawMaterials.plantId,
      terroirId: rawMaterials.terroirId,
    })
    .from(rawMaterials)
    .where(whereExpr)
    .orderBy(asc(rawMaterials.name))
    .limit(limit)
    .offset(offset),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);
  return { items, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getRawMaterialsStats() {
  const db = await getDb();
  if (!db) return { byCategory: [], byOlfFamily: [], byQuality: [], byAvailability: [] };

  const [byCategory, byOlfFamily, byQuality, byAvailability] = await Promise.all([
    db.select({ category: rawMaterials.category, count: count() })
      .from(rawMaterials)
      .groupBy(rawMaterials.category)
      .orderBy(desc(count())),
    db.select({ olfactiveFamily: rawMaterials.olfactiveFamily, count: count() })
      .from(rawMaterials)
      .where(isNotNull(rawMaterials.olfactiveFamily))
      .groupBy(rawMaterials.olfactiveFamily)
      .orderBy(desc(count())),
    db.select({ quality: rawMaterials.quality, count: count() })
      .from(rawMaterials)
      .where(isNotNull(rawMaterials.quality))
      .groupBy(rawMaterials.quality)
      .orderBy(desc(count())),
    db.select({ availability: rawMaterials.availability, count: count() })
      .from(rawMaterials)
      .where(isNotNull(rawMaterials.availability))
      .groupBy(rawMaterials.availability)
      .orderBy(desc(count())),
  ]);

  return { byCategory, byOlfFamily, byQuality, byAvailability };
}


// ====================================================================
// RAW MATERIAL DETAIL — Fiche complète avec interconnexions
// ====================================================================
// ============================================================================
// RAW MATERIAL DETAIL — Fiche complète avec interconnexions
// ============================================================================

export async function getRawMaterialDetail(id: number) {
  const db = await getDb();
  if (!db) return null;

  // 1. Matière première de base
  const [material] = await db.select().from(rawMaterials).where(eq(rawMaterials.id, id));
  if (!material) return null;

  // 2. Molécules associées
  const moleculesData = await db
    .select({
      id: molecules.id,
      name: molecules.name,
      casNumber: molecules.casNumber,
      chemicalFamily: molecules.family,
      olfactiveFamily: molecules.olfactiveProfile,
      percentage: rawMaterialMolecules.percentage,
      isSignature: rawMaterialMolecules.isSignature,
      variability: rawMaterialMolecules.variability,
      notes: rawMaterialMolecules.notes,
    })
    .from(rawMaterialMolecules)
    .innerJoin(molecules, eq(rawMaterialMolecules.moleculeId, molecules.id))
    .where(eq(rawMaterialMolecules.rawMaterialId, id))
    .orderBy(desc(rawMaterialMolecules.percentage));

  // 3. Plante source (si liée)
  let plantData = null;
  if (material.plantId) {
    const [plant] = await db.select({
      id: plants.id,
      name: plants.name,
      latinName: plants.latinName,
      family: plants.family,
      origin: plants.origin,
      conservationStatus: plants.conservationStatus,
    }).from(plants).where(eq(plants.id, material.plantId));
    plantData = plant || null;
  }

  // 4. Terroir source (si lié)
  let terroirData = null;
  if (material.terroirId) {
    const [terroir] = await db.select({
      id: terroirs.id,
      name: terroirs.name,
      country: terroirs.country,
      region: terroirs.region,
    }).from(terroirs).where(eq(terroirs.id, material.terroirId));
    terroirData = terroir || null;
  }

  // 5. Recettes qui utilisent les molécules de cette matière première (via molécules communes)
  let recipesData: Array<{ id: number; name: string; category: string }> = [];
  if (moleculesData.length > 0) {
    const moleculeIds = moleculesData.map(m => m.id);
    const recetteRows = await db
      .select({
        id: recettes.id,
        name: recettes.name,
        category: recettes.category,
      })
      .from(moleculesRecettes)
      .innerJoin(recettes, eq(moleculesRecettes.recetteId, recettes.id))
      .where(inArray(moleculesRecettes.moleculeId, moleculeIds))
      .groupBy(recettes.id, recettes.name, recettes.category)
      .orderBy(asc(recettes.name))
      .limit(20);
    recipesData = recetteRows as Array<{ id: number; name: string; category: string }>;
  }

  return {
    ...material,
    molecules: moleculesData,
    plant: plantData,
    terroir: terroirData,
    recipes: recipesData,
  };
}

