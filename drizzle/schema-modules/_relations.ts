/**
 * PERFUMUM Schema Relations
 * 
 * All Drizzle relations() definitions are centralized here to avoid
 * circular dependency issues between table modules.
 */
import { relations } from "drizzle-orm";

import { bibliographyAxisLinks, bibliographyEntries, referenceCitations, referenceEntityLinks, referenceNotes, referenceTags, thematicAxes, v3ReferenceTagLinks, v3References } from "./bibliography";
import { users } from "./core";
import { extractionMethods } from "./extraction-methods";
import { climateStudies, extractionTests, fieldArchives, molecularProtocols, situatedSmells } from "./field-archives";
import { ghostVarietyImages, ghostVarietyMoleculeLinks, ghostVarietyPlantLinks } from "./ghost-varieties";
import { leafEconomies, leafEconomyMolecules } from "./leaf-economies";
import { classificationReviews, classificationSnapshots, genomicMoleculeLinks, genomicPlantLinks, ghostVarieties, notifications } from "./misc";
import { molecularTransformations } from "./molecular-transformations";
import { geographicOrigins, ifraRestrictions, moleculeAnalyticalMethods, moleculeOrigins, moleculePerfumes, molecules } from "./molecules";
import { botanicalStates, chemotypes, plantAnalyses, plantContributions, plantExtractions, plantMolecules, plantSamples, plantTerroirs, plantVarieties, plants, sampleImages, terroirSpecialties, terroirs } from "./plants";
import { moleculePlantSources, rawMaterialMolecules, rawMaterials, sustainableAlternatives } from "./raw-materials";
import { finalRecipes, formulationSuggestions } from "./recettes";
import { axisConnections, axisReferenceLinks, curatedJourneys, journeyItems, researchAxes, researchEntries } from "./research-axes";
import { analyticalMethods, publicationExtractionMethods, publicationMethods, publicationMolecules, publicationResearchers, publicationTransformations, researchInstitutions, researchPublications, researcherInstitutions, researchers } from "./research-publications";
import { extendedSupplierMaterials, extendedSuppliers, inventoryEntries, supplierMaterials, suppliers } from "./suppliers";
import { finalRecipeTerpProfiles, terpProfileMolecules, terpProfilePlants, terpProfiles } from "./terp-profiles";
import { molecularInteractions } from "./tobacco-cannabis";
import { tpsGeneMolecules, tpsGenes } from "./tps-genes";
import { olfactoryTraditions } from "./traditions";


export const bibliographyEntriesRelations = relations(bibliographyEntries, ({ one }) => ({
  addedByUser: one(users, {
    fields: [bibliographyEntries.addedBy],
    references: [users.id],
  }),
}));

export const bibliographyAxisLinksRelations = relations(bibliographyAxisLinks, ({ one }) => ({
  bibliography: one(bibliographyEntries, {
    fields: [bibliographyAxisLinks.bibliographyId],
    references: [bibliographyEntries.id],
  }),
  axis: one(researchAxes, {
    fields: [bibliographyAxisLinks.axisId],
    references: [researchAxes.id],
  }),
}));

export const referenceCitationsRelations = relations(referenceCitations, ({ one }) => ({
  citing: one(bibliographyEntries, {
    fields: [referenceCitations.citingId],
    references: [bibliographyEntries.id],
    relationName: "citingReference",
  }),
  cited: one(bibliographyEntries, {
    fields: [referenceCitations.citedId],
    references: [bibliographyEntries.id],
    relationName: "citedReference",
  }),
  addedByUser: one(users, {
    fields: [referenceCitations.addedBy],
    references: [users.id],
  }),
  verifiedByUser: one(users, {
    fields: [referenceCitations.verifiedBy],
    references: [users.id],
  }),
}));

export const v3ReferencesRelations = relations(v3References, ({ one }) => ({
  axisPrimary: one(thematicAxes, {
    fields: [v3References.axisPrimaryId],
    references: [thematicAxes.id],
  }),
}));

export const v3ReferenceTagLinksRelations = relations(v3ReferenceTagLinks, ({ one }) => ({
  reference: one(v3References, {
    fields: [v3ReferenceTagLinks.referenceId],
    references: [v3References.id],
  }),
  tag: one(referenceTags, {
    fields: [v3ReferenceTagLinks.tagId],
    references: [referenceTags.id],
  }),
}));

export const referenceNotesRelations = relations(referenceNotes, ({ one }) => ({
  reference: one(v3References, {
    fields: [referenceNotes.referenceId],
    references: [v3References.id],
  }),
  createdByUser: one(users, {
    fields: [referenceNotes.createdBy],
    references: [users.id],
  }),
}));

export const referenceEntityLinksRelations = relations(referenceEntityLinks, ({ one }) => ({
  reference: one(v3References, {
    fields: [referenceEntityLinks.referenceId],
    references: [v3References.id],
  }),
  createdByUser: one(users, {
    fields: [referenceEntityLinks.createdBy],
    references: [users.id],
  }),
}));

export const fieldArchivesRelations = relations(fieldArchives, ({ many }) => ({
  extractionTests: many(extractionTests),
  situatedSmells: many(situatedSmells),
}));

export const extractionTestsRelations = relations(extractionTests, ({ one }) => ({
  fieldArchive: one(fieldArchives, {
    fields: [extractionTests.fieldArchiveId],
    references: [fieldArchives.id],
  }),
}));

export const situatedSmellsRelations = relations(situatedSmells, ({ one }) => ({
  fieldArchive: one(fieldArchives, {
    fields: [situatedSmells.linkedFieldArchiveId],
    references: [fieldArchives.id],
  }),
}));

export const climateStudiesRelations = relations(climateStudies, ({ many }) => ({
  molecularProtocols: many(molecularProtocols),
}));

export const molecularProtocolsRelations = relations(molecularProtocols, ({ one }) => ({
  climateStudy: one(climateStudies, {
    fields: [molecularProtocols.linkedStudyId],
    references: [climateStudies.id],
  }),
}));

export const ghostVarietyMoleculeLinksRelations = relations(ghostVarietyMoleculeLinks, ({ one }) => ({
  ghostVariety: one(ghostVarieties, {
    fields: [ghostVarietyMoleculeLinks.ghostVarietyId],
    references: [ghostVarieties.id],
  }),
  molecule: one(molecules, {
    fields: [ghostVarietyMoleculeLinks.moleculeId],
    references: [molecules.id],
  }),
  creator: one(users, {
    fields: [ghostVarietyMoleculeLinks.createdBy],
    references: [users.id],
  }),
}));

export const ghostVarietyPlantLinksRelations = relations(ghostVarietyPlantLinks, ({ one }) => ({
  ghostVariety: one(ghostVarieties, {
    fields: [ghostVarietyPlantLinks.ghostVarietyId],
    references: [ghostVarieties.id],
  }),
  plant: one(plants, {
    fields: [ghostVarietyPlantLinks.plantId],
    references: [plants.id],
  }),
  creator: one(users, {
    fields: [ghostVarietyPlantLinks.createdBy],
    references: [users.id],
  }),
}));

export const ghostVarietyImagesRelations = relations(ghostVarietyImages, ({ one }) => ({
  ghostVariety: one(ghostVarieties, {
    fields: [ghostVarietyImages.ghostVarietyId],
    references: [ghostVarieties.id],
  }),
  uploader: one(users, {
    fields: [ghostVarietyImages.uploadedBy],
    references: [users.id],
  }),
}));

export const leafEconomiesRelations = relations(leafEconomies, ({ many }) => ({
  molecules: many(leafEconomyMolecules),
}));

export const leafEconomyMoleculesRelations = relations(leafEconomyMolecules, ({ one }) => ({
  leafEconomy: one(leafEconomies, {
    fields: [leafEconomyMolecules.leafEconomyId],
    references: [leafEconomies.id],
  }),
  molecule: one(molecules, {
    fields: [leafEconomyMolecules.moleculeId],
    references: [molecules.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  reader: one(users, {
    fields: [notifications.readBy],
    references: [users.id],
  }),
}));

export const classificationSnapshotsRelations = relations(classificationSnapshots, ({ one }) => ({
  creator: one(users, {
    fields: [classificationSnapshots.createdBy],
    references: [users.id],
  }),
}));

export const classificationReviewsRelations = relations(classificationReviews, ({ one }) => ({
  molecule: one(molecules, {
    fields: [classificationReviews.moleculeId],
    references: [molecules.id],
  }),
  reviewer: one(users, {
    fields: [classificationReviews.reviewedBy],
    references: [users.id],
  }),
}));

export const ghostVarietiesRelations = relations(ghostVarieties, ({ one }) => ({
  creator: one(users, {
    fields: [ghostVarieties.createdBy],
    references: [users.id],
  }),
}));

export const genomicMoleculeLinksRelations = relations(genomicMoleculeLinks, ({ one }) => ({
  molecule: one(molecules, {
    fields: [genomicMoleculeLinks.moleculeId],
    references: [molecules.id],
  }),
  reference: one(v3References, {
    fields: [genomicMoleculeLinks.referenceId],
    references: [v3References.id],
  }),
  creator: one(users, {
    fields: [genomicMoleculeLinks.createdBy],
    references: [users.id],
  }),
}));

export const genomicPlantLinksRelations = relations(genomicPlantLinks, ({ one }) => ({
  plant: one(plants, {
    fields: [genomicPlantLinks.plantId],
    references: [plants.id],
  }),
  reference: one(v3References, {
    fields: [genomicPlantLinks.referenceId],
    references: [v3References.id],
  }),
  creator: one(users, {
    fields: [genomicPlantLinks.createdBy],
    references: [users.id],
  }),
}));

export const molecularTransformationsRelations = relations(molecularTransformations, ({ one }) => ({
  sourceMolecule: one(molecules, {
    fields: [molecularTransformations.sourceMoleculeId],
    references: [molecules.id],
    relationName: "transformationSource",
  }),
  productMolecule: one(molecules, {
    fields: [molecularTransformations.productMoleculeId],
    references: [molecules.id],
    relationName: "transformationProduct",
  }),
}));

export const geographicOriginsRelations = relations(geographicOrigins, ({ many }) => ({
  moleculeOrigins: many(moleculeOrigins),
}));

export const moleculeOriginsRelations = relations(moleculeOrigins, ({ one }) => ({
  molecule: one(molecules, {
    fields: [moleculeOrigins.moleculeId],
    references: [molecules.id],
  }),
  origin: one(geographicOrigins, {
    fields: [moleculeOrigins.originId],
    references: [geographicOrigins.id],
  }),
}));

export const ifraRestrictionsRelations = relations(ifraRestrictions, ({ one }) => ({
  molecule: one(molecules, {
    fields: [ifraRestrictions.moleculeId],
    references: [molecules.id],
  }),
}));

export const moleculeAnalyticalMethodsRelations = relations(moleculeAnalyticalMethods, ({ one }) => ({
  molecule: one(molecules, {
    fields: [moleculeAnalyticalMethods.moleculeId],
    references: [molecules.id],
  }),
  method: one(analyticalMethods, {
    fields: [moleculeAnalyticalMethods.methodId],
    references: [analyticalMethods.id],
  }),
}));

export const moleculePerfumesRelations = relations(moleculePerfumes, ({ one }) => ({
  molecule: one(molecules, {
    fields: [moleculePerfumes.moleculeId],
    references: [molecules.id],
  }),
}));

export const plantsRelations = relations(plants, ({ many }) => ({
  terpProfiles: many(terpProfilePlants),
  molecules: many(plantMolecules),
}));

export const terpProfilesRelations = relations(terpProfiles, ({ many }) => ({
  plants: many(terpProfilePlants),
  molecules: many(terpProfileMolecules),
  finalRecipes: many(finalRecipeTerpProfiles),
}));

export const finalRecipesRelations = relations(finalRecipes, ({ many }) => ({
  terpProfiles: many(finalRecipeTerpProfiles),
}));

export const terpProfilePlantsRelations = relations(terpProfilePlants, ({ one }) => ({
  terpProfile: one(terpProfiles, {
    fields: [terpProfilePlants.terpProfileId],
    references: [terpProfiles.id],
  }),
  plant: one(plants, {
    fields: [terpProfilePlants.plantId],
    references: [plants.id],
  }),
}));

export const terpProfileMoleculesRelations = relations(terpProfileMolecules, ({ one }) => ({
  terpProfile: one(terpProfiles, {
    fields: [terpProfileMolecules.terpProfileId],
    references: [terpProfiles.id],
  }),
  molecule: one(molecules, {
    fields: [terpProfileMolecules.moleculeId],
    references: [molecules.id],
  }),
}));

export const plantMoleculesRelations = relations(plantMolecules, ({ one }) => ({
  plant: one(plants, {
    fields: [plantMolecules.plantId],
    references: [plants.id],
  }),
  molecule: one(molecules, {
    fields: [plantMolecules.moleculeId],
    references: [molecules.id],
  }),
}));

export const finalRecipeTerpProfilesRelations = relations(finalRecipeTerpProfiles, ({ one }) => ({
  finalRecipe: one(finalRecipes, {
    fields: [finalRecipeTerpProfiles.finalRecipeId],
    references: [finalRecipes.id],
  }),
  terpProfile: one(terpProfiles, {
    fields: [finalRecipeTerpProfiles.terpProfileId],
    references: [terpProfiles.id],
  }),
}));

export const plantVarietiesRelations = relations(plantVarieties, ({ one, many }) => ({
  plant: one(plants, {
    fields: [plantVarieties.plantId],
    references: [plants.id],
  }),
  samples: many(plantSamples),
  analyses: many(plantAnalyses),
}));

export const terroirsRelations = relations(terroirs, ({ many }) => ({
  plantTerroirs: many(plantTerroirs),
  samples: many(plantSamples),
}));

export const extractionMethodsRelations = relations(extractionMethods, ({ many }) => ({
  plantExtractions: many(plantExtractions),
  samples: many(plantSamples),
}));

export const plantAnalysesRelations = relations(plantAnalyses, ({ one }) => ({
  plant: one(plants, {
    fields: [plantAnalyses.plantId],
    references: [plants.id],
  }),
  variety: one(plantVarieties, {
    fields: [plantAnalyses.varietyId],
    references: [plantVarieties.id],
  }),
  sample: one(plantSamples, {
    fields: [plantAnalyses.sampleId],
    references: [plantSamples.id],
  }),
}));

export const plantSamplesRelations = relations(plantSamples, ({ one, many }) => ({
  plant: one(plants, {
    fields: [plantSamples.plantId],
    references: [plants.id],
  }),
  variety: one(plantVarieties, {
    fields: [plantSamples.varietyId],
    references: [plantVarieties.id],
  }),
  terroir: one(terroirs, {
    fields: [plantSamples.terroirId],
    references: [terroirs.id],
  }),
  supplier: one(extendedSuppliers, {
    fields: [plantSamples.supplierId],
    references: [extendedSuppliers.id],
  }),
  extractionMethod: one(extractionMethods, {
    fields: [plantSamples.extractionMethodId],
    references: [extractionMethods.id],
  }),
  analyses: many(plantAnalyses),
}));

export const extendedSuppliersRelations = relations(extendedSuppliers, ({ many }) => ({
  samples: many(plantSamples),
  materials: many(extendedSupplierMaterials),
}));

export const plantTerroirsRelations = relations(plantTerroirs, ({ one }) => ({
  plant: one(plants, {
    fields: [plantTerroirs.plantId],
    references: [plants.id],
  }),
  terroir: one(terroirs, {
    fields: [plantTerroirs.terroirId],
    references: [terroirs.id],
  }),
}));

export const plantExtractionsRelations = relations(plantExtractions, ({ one }) => ({
  plant: one(plants, {
    fields: [plantExtractions.plantId],
    references: [plants.id],
  }),
  extractionMethod: one(extractionMethods, {
    fields: [plantExtractions.extractionMethodId],
    references: [extractionMethods.id],
  }),
}));

export const extendedSupplierMaterialsRelations = relations(extendedSupplierMaterials, ({ one }) => ({
  supplier: one(extendedSuppliers, {
    fields: [extendedSupplierMaterials.supplierId],
    references: [extendedSuppliers.id],
  }),
  plant: one(plants, {
    fields: [extendedSupplierMaterials.plantId],
    references: [plants.id],
  }),
  variety: one(plantVarieties, {
    fields: [extendedSupplierMaterials.varietyId],
    references: [plantVarieties.id],
  }),
  terroir: one(terroirs, {
    fields: [extendedSupplierMaterials.terroirId],
    references: [terroirs.id],
  }),
}));

export const botanicalStatesRelations = relations(botanicalStates, ({ one }) => ({
  plant: one(plants, {
    fields: [botanicalStates.plantId],
    references: [plants.id],
  }),
}));

export const chemotypesRelations = relations(chemotypes, ({ one }) => ({
  plant: one(plants, {
    fields: [chemotypes.plantId],
    references: [plants.id],
  }),
  dominantMolecule: one(molecules, {
    fields: [chemotypes.dominantMoleculeId],
    references: [molecules.id],
  }),
}));

export const sampleImagesRelations = relations(sampleImages, ({ one }) => ({
  leafEconomy: one(leafEconomies, {
    fields: [sampleImages.leafEconomyId],
    references: [leafEconomies.id],
  }),
  plant: one(plants, {
    fields: [sampleImages.plantId],
    references: [plants.id],
  }),
  uploadedByUser: one(users, {
    fields: [sampleImages.uploadedBy],
    references: [users.id],
  }),
}));

export const plantContributionsRelations = relations(plantContributions, ({ one }) => ({
  plant: one(plants, {
    fields: [plantContributions.plantId],
    references: [plants.id],
  }),
}));

export const rawMaterialsRelations = relations(rawMaterials, ({ one, many }) => ({
  plant: one(plants, {
    fields: [rawMaterials.plantId],
    references: [plants.id],
  }),
  terroir: one(terroirs, {
    fields: [rawMaterials.terroirId],
    references: [terroirs.id],
  }),
  extractionMethod: one(extractionMethods, {
    fields: [rawMaterials.extractionMethodId],
    references: [extractionMethods.id],
  }),
  molecules: many(rawMaterialMolecules),
}));

export const rawMaterialMoleculesRelations = relations(rawMaterialMolecules, ({ one }) => ({
  rawMaterial: one(rawMaterials, {
    fields: [rawMaterialMolecules.rawMaterialId],
    references: [rawMaterials.id],
  }),
  molecule: one(molecules, {
    fields: [rawMaterialMolecules.moleculeId],
    references: [molecules.id],
  }),
}));

export const moleculePlantSourcesRelations = relations(moleculePlantSources, ({ one }) => ({
  molecule: one(molecules, {
    fields: [moleculePlantSources.moleculeId],
    references: [molecules.id],
  }),
  plant: one(plants, {
    fields: [moleculePlantSources.plantId],
    references: [plants.id],
  }),
}));

export const terroirSpecialtiesRelations = relations(terroirSpecialties, ({ one }) => ({
  terroir: one(terroirs, {
    fields: [terroirSpecialties.terroirId],
    references: [terroirs.id],
  }),
  plant: one(plants, {
    fields: [terroirSpecialties.plantId],
    references: [plants.id],
  }),
  rawMaterial: one(rawMaterials, {
    fields: [terroirSpecialties.rawMaterialId],
    references: [rawMaterials.id],
  }),
}));

export const sustainableAlternativesRelations = relations(sustainableAlternatives, ({ one }) => ({
  threatenedPlant: one(plants, {
    fields: [sustainableAlternatives.threatenedPlantId],
    references: [plants.id],
  }),
  alternativePlant: one(plants, {
    fields: [sustainableAlternatives.alternativePlantId],
    references: [plants.id],
  }),
}));

export const formulationSuggestionsRelations = relations(formulationSuggestions, ({ one }) => ({
  baseMolecule: one(molecules, {
    fields: [formulationSuggestions.baseMoleculeId],
    references: [molecules.id],
  }),
}));

export const researchAxesRelations = relations(researchAxes, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [researchAxes.createdBy],
    references: [users.id],
  }),
  parentAxis: one(researchAxes, {
    fields: [researchAxes.parentAxisId],
    references: [researchAxes.id],
  }),
  entries: many(researchEntries),
}));

export const researchEntriesRelations = relations(researchEntries, ({ one }) => ({
  axis: one(researchAxes, {
    fields: [researchEntries.axisId],
    references: [researchAxes.id],
  }),
  createdByUser: one(users, {
    fields: [researchEntries.createdBy],
    references: [users.id],
  }),
}));

export const axisConnectionsRelations = relations(axisConnections, ({ one }) => ({
  sourceAxis: one(thematicAxes, {
    fields: [axisConnections.sourceAxisId],
    references: [thematicAxes.id],
    relationName: "sourceAxis",
  }),
  targetAxis: one(thematicAxes, {
    fields: [axisConnections.targetAxisId],
    references: [thematicAxes.id],
    relationName: "targetAxis",
  }),
}));

export const curatedJourneysRelations = relations(curatedJourneys, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [curatedJourneys.createdBy],
    references: [users.id],
  }),
  items: many(journeyItems),
}));

export const journeyItemsRelations = relations(journeyItems, ({ one }) => ({
  journey: one(curatedJourneys, {
    fields: [journeyItems.journeyId],
    references: [curatedJourneys.id],
  }),
  terroir: one(terroirs, {
    fields: [journeyItems.terroirId],
    references: [terroirs.id],
  }),
  plant: one(plants, {
    fields: [journeyItems.plantId],
    references: [plants.id],
  }),
  molecule: one(molecules, {
    fields: [journeyItems.moleculeId],
    references: [molecules.id],
  }),
}));

export const axisReferenceLinksRelations = relations(axisReferenceLinks, ({ one }) => ({
  axis: one(researchAxes, {
    fields: [axisReferenceLinks.axisId],
    references: [researchAxes.id],
  }),
  reference: one(v3References, {
    fields: [axisReferenceLinks.referenceId],
    references: [v3References.id],
  }),
  creator: one(users, {
    fields: [axisReferenceLinks.createdBy],
    references: [users.id],
  }),
}));

export const researchPublicationsRelations = relations(researchPublications, ({ many }) => ({
  methods: many(publicationMethods),
  researchers: many(publicationResearchers),
  molecules: many(publicationMolecules),
  transformations: many(publicationTransformations),
}));

export const analyticalMethodsRelations = relations(analyticalMethods, ({ many }) => ({
  publications: many(publicationMethods),
}));

export const researchersRelations = relations(researchers, ({ many }) => ({
  publications: many(publicationResearchers),
  institutions: many(researcherInstitutions),
}));

export const researchInstitutionsRelations = relations(researchInstitutions, ({ many }) => ({
  researchers: many(researcherInstitutions),
}));

export const publicationMethodsRelations = relations(publicationMethods, ({ one }) => ({
  publication: one(researchPublications, {
    fields: [publicationMethods.publicationId],
    references: [researchPublications.id],
  }),
  method: one(analyticalMethods, {
    fields: [publicationMethods.methodId],
    references: [analyticalMethods.id],
  }),
}));

export const publicationResearchersRelations = relations(publicationResearchers, ({ one }) => ({
  publication: one(researchPublications, {
    fields: [publicationResearchers.publicationId],
    references: [researchPublications.id],
  }),
  researcher: one(researchers, {
    fields: [publicationResearchers.researcherId],
    references: [researchers.id],
  }),
}));

export const researcherInstitutionsRelations = relations(researcherInstitutions, ({ one }) => ({
  researcher: one(researchers, {
    fields: [researcherInstitutions.researcherId],
    references: [researchers.id],
  }),
  institution: one(researchInstitutions, {
    fields: [researcherInstitutions.institutionId],
    references: [researchInstitutions.id],
  }),
}));

export const publicationMoleculesRelations = relations(publicationMolecules, ({ one }) => ({
  publication: one(researchPublications, {
    fields: [publicationMolecules.publicationId],
    references: [researchPublications.id],
  }),
  molecule: one(molecules, {
    fields: [publicationMolecules.moleculeId],
    references: [molecules.id],
  }),
}));

export const publicationTransformationsRelations = relations(publicationTransformations, ({ one }) => ({
  publication: one(researchPublications, {
    fields: [publicationTransformations.publicationId],
    references: [researchPublications.id],
  }),
  transformation: one(molecularTransformations, {
    fields: [publicationTransformations.transformationId],
    references: [molecularTransformations.id],
  }),
}));

export const publicationExtractionMethodsRelations = relations(publicationExtractionMethods, ({ one }) => ({
  publication: one(researchPublications, {
    fields: [publicationExtractionMethods.publicationId],
    references: [researchPublications.id],
  }),
  extractionMethod: one(extractionMethods, {
    fields: [publicationExtractionMethods.extractionMethodId],
    references: [extractionMethods.id],
  }),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  materials: many(supplierMaterials),
}));

export const supplierMaterialsRelations = relations(supplierMaterials, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [supplierMaterials.supplierId],
    references: [suppliers.id],
  }),
  molecule: one(molecules, {
    fields: [supplierMaterials.moleculeId],
    references: [molecules.id],
  }),
}));

export const inventoryEntriesRelations = relations(inventoryEntries, ({ one }) => ({
  rawMaterial: one(rawMaterials, {
    fields: [inventoryEntries.rawMaterialId],
    references: [rawMaterials.id],
  }),
  supplier: one(suppliers, {
    fields: [inventoryEntries.supplierId],
    references: [suppliers.id],
  }),
}));

export const molecularInteractionsRelations = relations(molecularInteractions, ({ one }) => ({
  molecule1: one(molecules, {
    fields: [molecularInteractions.molecule1Id],
    references: [molecules.id],
  }),
  molecule2: one(molecules, {
    fields: [molecularInteractions.molecule2Id],
    references: [molecules.id],
  }),
  molecule3: one(molecules, {
    fields: [molecularInteractions.molecule3Id],
    references: [molecules.id],
  }),
}));

export const tpsGenesRelations = relations(tpsGenes, ({ many }) => ({
  moleculeLinks: many(tpsGeneMolecules),
}));

export const tpsGeneMoleculesRelations = relations(tpsGeneMolecules, ({ one }) => ({
  tpsGene: one(tpsGenes, {
    fields: [tpsGeneMolecules.tpsGeneId],
    references: [tpsGenes.id],
  }),
  molecule: one(molecules, {
    fields: [tpsGeneMolecules.moleculeId],
    references: [molecules.id],
  }),
}));

export const olfactoryTraditionsRelations = relations(olfactoryTraditions, ({ one }) => ({
  createdByUser: one(users, {
    fields: [olfactoryTraditions.createdBy],
    references: [users.id],
  }),
}));
