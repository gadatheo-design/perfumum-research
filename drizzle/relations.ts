import { relations } from "drizzle-orm/relations";
import { families, accords, researchAxisNez, axisSourceNez, sourceArticleNez, plants, botanicalStates, experimentalAccords, experimentalAccordCivilisations, traditionsOlfactives, finalRecipes, finalRecipeTerpProfiles, terpProfiles, molecules, ifraRestrictions, installations, installationFamilies, installationRecettes, recettes, laboratoire, laboratoireMolecules, laboratoireRecettes, leafEconomies, leafEconomyMolecules, moleculeAccords, moleculeChemicalFamilies, chemicalFamilies, moleculeFamilies, users, moleculeNotes, moleculeOrigins, geographicOrigins, moleculePlantSources, moleculeRecettes, moleculeSynergies, petrichor, petrichorExperimentalAccords, petrichorMolecules, petrichorRecettes, petrichorTabacs, tabacs, plantGeographicZones, geographicZones, plantMolecules, prototypes, prototypeChemicalFamilies, prototypeLaboratoire, prototypeMolecules, rawMaterials, rawMaterialMolecules, terroirs, extractionMethods, recetteMolecules, recetteTabacAssociations, recettesFormulesReference, recipeVersions, sharedCollections, synergies, tabacAccords, tabacCivilisations, tabacMolecules, tastingNotes, terpProfileMolecules, terpProfilePlants, terpeneSynergies, terroirSpecialties, tobaccoFormulas, tobaccoFormulaInstallations, volcanique, volcaniqueExperimentalAccords, volcaniqueMolecules, volcaniqueRecettes, volcaniqueTabacs } from "./schema";

export const accordsRelations = relations(accords, ({one, many}) => ({
	family: one(families, {
		fields: [accords.familyId],
		references: [families.id]
	}),
	moleculeAccords: many(moleculeAccords),
	recettes: many(recettes),
	tabacAccords: many(tabacAccords),
	traditionsOlfactives: many(traditionsOlfactives),
}));

export const familiesRelations = relations(families, ({many}) => ({
	accords: many(accords),
	installationFamilies: many(installationFamilies),
	moleculeFamilies: many(moleculeFamilies),
	recettes: many(recettes),
}));

export const axisSourceNezRelations = relations(axisSourceNez, ({one}) => ({
	researchAxisNez: one(researchAxisNez, {
		fields: [axisSourceNez.axisId],
		references: [researchAxisNez.axisId]
	}),
	sourceArticleNez: one(sourceArticleNez, {
		fields: [axisSourceNez.sourceId],
		references: [sourceArticleNez.sourceId]
	}),
}));

export const researchAxisNezRelations = relations(researchAxisNez, ({many}) => ({
	axisSourceNezs: many(axisSourceNez),
}));

export const sourceArticleNezRelations = relations(sourceArticleNez, ({many}) => ({
	axisSourceNezs: many(axisSourceNez),
}));

export const botanicalStatesRelations = relations(botanicalStates, ({one}) => ({
	plant: one(plants, {
		fields: [botanicalStates.plantId],
		references: [plants.id]
	}),
}));

export const plantsRelations = relations(plants, ({many}) => ({
	botanicalStates: many(botanicalStates),
	moleculePlantSources: many(moleculePlantSources),
	plantGeographicZones: many(plantGeographicZones),
	plantMolecules: many(plantMolecules),
	rawMaterials: many(rawMaterials),
	terpProfilePlants: many(terpProfilePlants),
	terroirSpecialties: many(terroirSpecialties),
}));

export const experimentalAccordCivilisationsRelations = relations(experimentalAccordCivilisations, ({one}) => ({
	experimentalAccord: one(experimentalAccords, {
		fields: [experimentalAccordCivilisations.experimentalAccordId],
		references: [experimentalAccords.id]
	}),
	traditionsOlfactive: one(traditionsOlfactives, {
		fields: [experimentalAccordCivilisations.civilisationId],
		references: [traditionsOlfactives.id]
	}),
}));

export const experimentalAccordsRelations = relations(experimentalAccords, ({many}) => ({
	experimentalAccordCivilisations: many(experimentalAccordCivilisations),
	petrichorExperimentalAccords: many(petrichorExperimentalAccords),
	volcaniqueExperimentalAccords: many(volcaniqueExperimentalAccords),
}));

export const traditionsOlfactivesRelations = relations(traditionsOlfactives, ({one, many}) => ({
	experimentalAccordCivilisations: many(experimentalAccordCivilisations),
	recettes: many(recettes),
	tabacCivilisations: many(tabacCivilisations),
	accord: one(accords, {
		fields: [traditionsOlfactives.signatureAccordId],
		references: [accords.id]
	}),
}));

export const finalRecipeTerpProfilesRelations = relations(finalRecipeTerpProfiles, ({one}) => ({
	finalRecipe: one(finalRecipes, {
		fields: [finalRecipeTerpProfiles.finalRecipeId],
		references: [finalRecipes.id]
	}),
	terpProfile: one(terpProfiles, {
		fields: [finalRecipeTerpProfiles.terpProfileId],
		references: [terpProfiles.id]
	}),
}));

export const finalRecipesRelations = relations(finalRecipes, ({many}) => ({
	finalRecipeTerpProfiles: many(finalRecipeTerpProfiles),
}));

export const terpProfilesRelations = relations(terpProfiles, ({many}) => ({
	finalRecipeTerpProfiles: many(finalRecipeTerpProfiles),
	terpProfileMolecules: many(terpProfileMolecules),
	terpProfilePlants: many(terpProfilePlants),
}));

export const ifraRestrictionsRelations = relations(ifraRestrictions, ({one}) => ({
	molecule: one(molecules, {
		fields: [ifraRestrictions.moleculeId],
		references: [molecules.id]
	}),
}));

export const moleculesRelations = relations(molecules, ({many}) => ({
	ifraRestrictions: many(ifraRestrictions),
	laboratoireMolecules: many(laboratoireMolecules),
	leafEconomyMolecules: many(leafEconomyMolecules),
	moleculeAccords: many(moleculeAccords),
	moleculeChemicalFamilies: many(moleculeChemicalFamilies),
	moleculeFamilies: many(moleculeFamilies),
	moleculeNotes: many(moleculeNotes),
	moleculeOrigins: many(moleculeOrigins),
	moleculePlantSources: many(moleculePlantSources),
	moleculeRecettes: many(moleculeRecettes),
	moleculeSynergies_molecule1Id: many(moleculeSynergies, {
		relationName: "moleculeSynergies_molecule1Id_molecules_id"
	}),
	moleculeSynergies_molecule2Id: many(moleculeSynergies, {
		relationName: "moleculeSynergies_molecule2Id_molecules_id"
	}),
	petrichorMolecules: many(petrichorMolecules),
	plantMolecules: many(plantMolecules),
	prototypeMolecules: many(prototypeMolecules),
	rawMaterialMolecules: many(rawMaterialMolecules),
	recetteMolecules: many(recetteMolecules),
	synergies: many(synergies),
	tabacMolecules: many(tabacMolecules),
	terpProfileMolecules: many(terpProfileMolecules),
	terpeneSynergies_terpene1Id: many(terpeneSynergies, {
		relationName: "terpeneSynergies_terpene1Id_molecules_id"
	}),
	terpeneSynergies_terpene2Id: many(terpeneSynergies, {
		relationName: "terpeneSynergies_terpene2Id_molecules_id"
	}),
	volcaniqueMolecules: many(volcaniqueMolecules),
}));

export const installationFamiliesRelations = relations(installationFamilies, ({one}) => ({
	installation: one(installations, {
		fields: [installationFamilies.installationId],
		references: [installations.id]
	}),
	family: one(families, {
		fields: [installationFamilies.familyId],
		references: [families.id]
	}),
}));

export const installationsRelations = relations(installations, ({many}) => ({
	installationFamilies: many(installationFamilies),
	installationRecettes: many(installationRecettes),
	tobaccoFormulaInstallations: many(tobaccoFormulaInstallations),
}));

export const installationRecettesRelations = relations(installationRecettes, ({one}) => ({
	installation: one(installations, {
		fields: [installationRecettes.installationId],
		references: [installations.id]
	}),
	recette: one(recettes, {
		fields: [installationRecettes.recetteId],
		references: [recettes.id]
	}),
}));

export const recettesRelations = relations(recettes, ({one, many}) => ({
	installationRecettes: many(installationRecettes),
	laboratoireRecettes: many(laboratoireRecettes),
	moleculeRecettes: many(moleculeRecettes),
	petrichorRecettes: many(petrichorRecettes),
	recetteMolecules: many(recetteMolecules),
	recetteTabacAssociations: many(recetteTabacAssociations),
	family: one(families, {
		fields: [recettes.familyId],
		references: [families.id]
	}),
	accord: one(accords, {
		fields: [recettes.accordId],
		references: [accords.id]
	}),
	tabac: one(tabacs, {
		fields: [recettes.tabacId],
		references: [tabacs.id]
	}),
	traditionsOlfactive: one(traditionsOlfactives, {
		fields: [recettes.civilisationId],
		references: [traditionsOlfactives.id]
	}),
	recettesFormulesReferences: many(recettesFormulesReference),
	recipeVersions: many(recipeVersions),
	tastingNotes: many(tastingNotes),
	volcaniqueRecettes: many(volcaniqueRecettes),
}));

export const laboratoireMoleculesRelations = relations(laboratoireMolecules, ({one}) => ({
	laboratoire: one(laboratoire, {
		fields: [laboratoireMolecules.laboratoireId],
		references: [laboratoire.id]
	}),
	molecule: one(molecules, {
		fields: [laboratoireMolecules.moleculeId],
		references: [molecules.id]
	}),
}));

export const laboratoireRelations = relations(laboratoire, ({many}) => ({
	laboratoireMolecules: many(laboratoireMolecules),
	laboratoireRecettes: many(laboratoireRecettes),
	prototypeLaboratoires: many(prototypeLaboratoire),
}));

export const laboratoireRecettesRelations = relations(laboratoireRecettes, ({one}) => ({
	laboratoire: one(laboratoire, {
		fields: [laboratoireRecettes.laboratoireId],
		references: [laboratoire.id]
	}),
	recette: one(recettes, {
		fields: [laboratoireRecettes.recetteId],
		references: [recettes.id]
	}),
}));

export const leafEconomyMoleculesRelations = relations(leafEconomyMolecules, ({one}) => ({
	leafEconomy: one(leafEconomies, {
		fields: [leafEconomyMolecules.leafEconomyId],
		references: [leafEconomies.id]
	}),
	molecule: one(molecules, {
		fields: [leafEconomyMolecules.moleculeId],
		references: [molecules.id]
	}),
}));

export const leafEconomiesRelations = relations(leafEconomies, ({many}) => ({
	leafEconomyMolecules: many(leafEconomyMolecules),
}));

export const moleculeAccordsRelations = relations(moleculeAccords, ({one}) => ({
	molecule: one(molecules, {
		fields: [moleculeAccords.moleculeId],
		references: [molecules.id]
	}),
	accord: one(accords, {
		fields: [moleculeAccords.accordId],
		references: [accords.id]
	}),
}));

export const moleculeChemicalFamiliesRelations = relations(moleculeChemicalFamilies, ({one}) => ({
	molecule: one(molecules, {
		fields: [moleculeChemicalFamilies.moleculeId],
		references: [molecules.id]
	}),
	chemicalFamily: one(chemicalFamilies, {
		fields: [moleculeChemicalFamilies.chemicalFamilyId],
		references: [chemicalFamilies.id]
	}),
}));

export const chemicalFamiliesRelations = relations(chemicalFamilies, ({many}) => ({
	moleculeChemicalFamilies: many(moleculeChemicalFamilies),
	prototypeChemicalFamilies: many(prototypeChemicalFamilies),
}));

export const moleculeFamiliesRelations = relations(moleculeFamilies, ({one}) => ({
	molecule: one(molecules, {
		fields: [moleculeFamilies.moleculeId],
		references: [molecules.id]
	}),
	family: one(families, {
		fields: [moleculeFamilies.familyId],
		references: [families.id]
	}),
}));

export const moleculeNotesRelations = relations(moleculeNotes, ({one}) => ({
	user: one(users, {
		fields: [moleculeNotes.userId],
		references: [users.id]
	}),
	molecule: one(molecules, {
		fields: [moleculeNotes.moleculeId],
		references: [molecules.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	moleculeNotes: many(moleculeNotes),
	sharedCollections: many(sharedCollections),
}));

export const moleculeOriginsRelations = relations(moleculeOrigins, ({one}) => ({
	molecule: one(molecules, {
		fields: [moleculeOrigins.moleculeId],
		references: [molecules.id]
	}),
	geographicOrigin: one(geographicOrigins, {
		fields: [moleculeOrigins.originId],
		references: [geographicOrigins.id]
	}),
}));

export const geographicOriginsRelations = relations(geographicOrigins, ({many}) => ({
	moleculeOrigins: many(moleculeOrigins),
}));

export const moleculePlantSourcesRelations = relations(moleculePlantSources, ({one}) => ({
	molecule: one(molecules, {
		fields: [moleculePlantSources.moleculeId],
		references: [molecules.id]
	}),
	plant: one(plants, {
		fields: [moleculePlantSources.plantId],
		references: [plants.id]
	}),
}));

export const moleculeRecettesRelations = relations(moleculeRecettes, ({one}) => ({
	molecule: one(molecules, {
		fields: [moleculeRecettes.moleculeId],
		references: [molecules.id]
	}),
	recette: one(recettes, {
		fields: [moleculeRecettes.recetteId],
		references: [recettes.id]
	}),
}));

export const moleculeSynergiesRelations = relations(moleculeSynergies, ({one}) => ({
	molecule_molecule1Id: one(molecules, {
		fields: [moleculeSynergies.molecule1Id],
		references: [molecules.id],
		relationName: "moleculeSynergies_molecule1Id_molecules_id"
	}),
	molecule_molecule2Id: one(molecules, {
		fields: [moleculeSynergies.molecule2Id],
		references: [molecules.id],
		relationName: "moleculeSynergies_molecule2Id_molecules_id"
	}),
}));

export const petrichorExperimentalAccordsRelations = relations(petrichorExperimentalAccords, ({one}) => ({
	petrichor: one(petrichor, {
		fields: [petrichorExperimentalAccords.petrichorId],
		references: [petrichor.id]
	}),
	experimentalAccord: one(experimentalAccords, {
		fields: [petrichorExperimentalAccords.experimentalAccordId],
		references: [experimentalAccords.id]
	}),
}));

export const petrichorRelations = relations(petrichor, ({many}) => ({
	petrichorExperimentalAccords: many(petrichorExperimentalAccords),
	petrichorMolecules: many(petrichorMolecules),
	petrichorRecettes: many(petrichorRecettes),
	petrichorTabacs: many(petrichorTabacs),
}));

export const petrichorMoleculesRelations = relations(petrichorMolecules, ({one}) => ({
	petrichor: one(petrichor, {
		fields: [petrichorMolecules.petrichorId],
		references: [petrichor.id]
	}),
	molecule: one(molecules, {
		fields: [petrichorMolecules.moleculeId],
		references: [molecules.id]
	}),
}));

export const petrichorRecettesRelations = relations(petrichorRecettes, ({one}) => ({
	petrichor: one(petrichor, {
		fields: [petrichorRecettes.petrichorId],
		references: [petrichor.id]
	}),
	recette: one(recettes, {
		fields: [petrichorRecettes.recetteId],
		references: [recettes.id]
	}),
}));

export const petrichorTabacsRelations = relations(petrichorTabacs, ({one}) => ({
	petrichor: one(petrichor, {
		fields: [petrichorTabacs.petrichorId],
		references: [petrichor.id]
	}),
	tabac: one(tabacs, {
		fields: [petrichorTabacs.tabacId],
		references: [tabacs.id]
	}),
}));

export const tabacsRelations = relations(tabacs, ({many}) => ({
	petrichorTabacs: many(petrichorTabacs),
	recetteTabacAssociations: many(recetteTabacAssociations),
	recettes: many(recettes),
	synergies: many(synergies),
	tabacAccords: many(tabacAccords),
	tabacCivilisations: many(tabacCivilisations),
	tabacMolecules: many(tabacMolecules),
	volcaniqueTabacs: many(volcaniqueTabacs),
}));

export const plantGeographicZonesRelations = relations(plantGeographicZones, ({one}) => ({
	plant: one(plants, {
		fields: [plantGeographicZones.plantId],
		references: [plants.id]
	}),
	geographicZone: one(geographicZones, {
		fields: [plantGeographicZones.zoneId],
		references: [geographicZones.id]
	}),
}));

export const geographicZonesRelations = relations(geographicZones, ({many}) => ({
	plantGeographicZones: many(plantGeographicZones),
}));

export const plantMoleculesRelations = relations(plantMolecules, ({one}) => ({
	plant: one(plants, {
		fields: [plantMolecules.plantId],
		references: [plants.id]
	}),
	molecule: one(molecules, {
		fields: [plantMolecules.moleculeId],
		references: [molecules.id]
	}),
}));

export const prototypeChemicalFamiliesRelations = relations(prototypeChemicalFamilies, ({one}) => ({
	prototype: one(prototypes, {
		fields: [prototypeChemicalFamilies.prototypeId],
		references: [prototypes.id]
	}),
	chemicalFamily: one(chemicalFamilies, {
		fields: [prototypeChemicalFamilies.chemicalFamilyId],
		references: [chemicalFamilies.id]
	}),
}));

export const prototypesRelations = relations(prototypes, ({many}) => ({
	prototypeChemicalFamilies: many(prototypeChemicalFamilies),
	prototypeLaboratoires: many(prototypeLaboratoire),
	prototypeMolecules: many(prototypeMolecules),
}));

export const prototypeLaboratoireRelations = relations(prototypeLaboratoire, ({one}) => ({
	prototype: one(prototypes, {
		fields: [prototypeLaboratoire.prototypeId],
		references: [prototypes.id]
	}),
	laboratoire: one(laboratoire, {
		fields: [prototypeLaboratoire.laboratoireId],
		references: [laboratoire.id]
	}),
}));

export const prototypeMoleculesRelations = relations(prototypeMolecules, ({one}) => ({
	prototype: one(prototypes, {
		fields: [prototypeMolecules.prototypeId],
		references: [prototypes.id]
	}),
	molecule: one(molecules, {
		fields: [prototypeMolecules.moleculeId],
		references: [molecules.id]
	}),
}));

export const rawMaterialMoleculesRelations = relations(rawMaterialMolecules, ({one}) => ({
	rawMaterial: one(rawMaterials, {
		fields: [rawMaterialMolecules.rawMaterialId],
		references: [rawMaterials.id]
	}),
	molecule: one(molecules, {
		fields: [rawMaterialMolecules.moleculeId],
		references: [molecules.id]
	}),
}));

export const rawMaterialsRelations = relations(rawMaterials, ({one, many}) => ({
	rawMaterialMolecules: many(rawMaterialMolecules),
	plant: one(plants, {
		fields: [rawMaterials.plantId],
		references: [plants.id]
	}),
	terroir: one(terroirs, {
		fields: [rawMaterials.terroirId],
		references: [terroirs.id]
	}),
	extractionMethod: one(extractionMethods, {
		fields: [rawMaterials.extractionMethodId],
		references: [extractionMethods.id]
	}),
	terroirSpecialties: many(terroirSpecialties),
}));

export const terroirsRelations = relations(terroirs, ({many}) => ({
	rawMaterials: many(rawMaterials),
	terroirSpecialties: many(terroirSpecialties),
}));

export const extractionMethodsRelations = relations(extractionMethods, ({many}) => ({
	rawMaterials: many(rawMaterials),
}));

export const recetteMoleculesRelations = relations(recetteMolecules, ({one}) => ({
	recette: one(recettes, {
		fields: [recetteMolecules.recetteId],
		references: [recettes.id]
	}),
	molecule: one(molecules, {
		fields: [recetteMolecules.moleculeId],
		references: [molecules.id]
	}),
}));

export const recetteTabacAssociationsRelations = relations(recetteTabacAssociations, ({one}) => ({
	recette: one(recettes, {
		fields: [recetteTabacAssociations.recetteId],
		references: [recettes.id]
	}),
	tabac: one(tabacs, {
		fields: [recetteTabacAssociations.tabacId],
		references: [tabacs.id]
	}),
}));

export const recettesFormulesReferenceRelations = relations(recettesFormulesReference, ({one}) => ({
	recette: one(recettes, {
		fields: [recettesFormulesReference.recetteId],
		references: [recettes.id]
	}),
}));

export const recipeVersionsRelations = relations(recipeVersions, ({one, many}) => ({
	recette: one(recettes, {
		fields: [recipeVersions.recetteId],
		references: [recettes.id]
	}),
	tastingNotes: many(tastingNotes),
}));

export const sharedCollectionsRelations = relations(sharedCollections, ({one}) => ({
	user: one(users, {
		fields: [sharedCollections.creatorId],
		references: [users.id]
	}),
}));

export const synergiesRelations = relations(synergies, ({one}) => ({
	tabac: one(tabacs, {
		fields: [synergies.tabacId],
		references: [tabacs.id]
	}),
	molecule: one(molecules, {
		fields: [synergies.moleculeId],
		references: [molecules.id]
	}),
}));

export const tabacAccordsRelations = relations(tabacAccords, ({one}) => ({
	tabac: one(tabacs, {
		fields: [tabacAccords.tabacId],
		references: [tabacs.id]
	}),
	accord: one(accords, {
		fields: [tabacAccords.accordId],
		references: [accords.id]
	}),
}));

export const tabacCivilisationsRelations = relations(tabacCivilisations, ({one}) => ({
	tabac: one(tabacs, {
		fields: [tabacCivilisations.tabacId],
		references: [tabacs.id]
	}),
	traditionsOlfactive: one(traditionsOlfactives, {
		fields: [tabacCivilisations.civilisationId],
		references: [traditionsOlfactives.id]
	}),
}));

export const tabacMoleculesRelations = relations(tabacMolecules, ({one}) => ({
	tabac: one(tabacs, {
		fields: [tabacMolecules.tabacId],
		references: [tabacs.id]
	}),
	molecule: one(molecules, {
		fields: [tabacMolecules.moleculeId],
		references: [molecules.id]
	}),
}));

export const tastingNotesRelations = relations(tastingNotes, ({one}) => ({
	recette: one(recettes, {
		fields: [tastingNotes.recetteId],
		references: [recettes.id]
	}),
	recipeVersion: one(recipeVersions, {
		fields: [tastingNotes.versionId],
		references: [recipeVersions.id]
	}),
}));

export const terpProfileMoleculesRelations = relations(terpProfileMolecules, ({one}) => ({
	terpProfile: one(terpProfiles, {
		fields: [terpProfileMolecules.terpProfileId],
		references: [terpProfiles.id]
	}),
	molecule: one(molecules, {
		fields: [terpProfileMolecules.moleculeId],
		references: [molecules.id]
	}),
}));

export const terpProfilePlantsRelations = relations(terpProfilePlants, ({one}) => ({
	terpProfile: one(terpProfiles, {
		fields: [terpProfilePlants.terpProfileId],
		references: [terpProfiles.id]
	}),
	plant: one(plants, {
		fields: [terpProfilePlants.plantId],
		references: [plants.id]
	}),
}));

export const terpeneSynergiesRelations = relations(terpeneSynergies, ({one}) => ({
	molecule_terpene1Id: one(molecules, {
		fields: [terpeneSynergies.terpene1Id],
		references: [molecules.id],
		relationName: "terpeneSynergies_terpene1Id_molecules_id"
	}),
	molecule_terpene2Id: one(molecules, {
		fields: [terpeneSynergies.terpene2Id],
		references: [molecules.id],
		relationName: "terpeneSynergies_terpene2Id_molecules_id"
	}),
}));

export const terroirSpecialtiesRelations = relations(terroirSpecialties, ({one}) => ({
	terroir: one(terroirs, {
		fields: [terroirSpecialties.terroirId],
		references: [terroirs.id]
	}),
	plant: one(plants, {
		fields: [terroirSpecialties.plantId],
		references: [plants.id]
	}),
	rawMaterial: one(rawMaterials, {
		fields: [terroirSpecialties.rawMaterialId],
		references: [rawMaterials.id]
	}),
}));

export const tobaccoFormulaInstallationsRelations = relations(tobaccoFormulaInstallations, ({one}) => ({
	tobaccoFormula: one(tobaccoFormulas, {
		fields: [tobaccoFormulaInstallations.tobaccoFormulaId],
		references: [tobaccoFormulas.id]
	}),
	installation: one(installations, {
		fields: [tobaccoFormulaInstallations.installationId],
		references: [installations.id]
	}),
}));

export const tobaccoFormulasRelations = relations(tobaccoFormulas, ({many}) => ({
	tobaccoFormulaInstallations: many(tobaccoFormulaInstallations),
}));

export const volcaniqueExperimentalAccordsRelations = relations(volcaniqueExperimentalAccords, ({one}) => ({
	volcanique: one(volcanique, {
		fields: [volcaniqueExperimentalAccords.volcaniqueId],
		references: [volcanique.id]
	}),
	experimentalAccord: one(experimentalAccords, {
		fields: [volcaniqueExperimentalAccords.experimentalAccordId],
		references: [experimentalAccords.id]
	}),
}));

export const volcaniqueRelations = relations(volcanique, ({many}) => ({
	volcaniqueExperimentalAccords: many(volcaniqueExperimentalAccords),
	volcaniqueMolecules: many(volcaniqueMolecules),
	volcaniqueRecettes: many(volcaniqueRecettes),
	volcaniqueTabacs: many(volcaniqueTabacs),
}));

export const volcaniqueMoleculesRelations = relations(volcaniqueMolecules, ({one}) => ({
	volcanique: one(volcanique, {
		fields: [volcaniqueMolecules.volcaniqueId],
		references: [volcanique.id]
	}),
	molecule: one(molecules, {
		fields: [volcaniqueMolecules.moleculeId],
		references: [molecules.id]
	}),
}));

export const volcaniqueRecettesRelations = relations(volcaniqueRecettes, ({one}) => ({
	volcanique: one(volcanique, {
		fields: [volcaniqueRecettes.volcaniqueId],
		references: [volcanique.id]
	}),
	recette: one(recettes, {
		fields: [volcaniqueRecettes.recetteId],
		references: [recettes.id]
	}),
}));

export const volcaniqueTabacsRelations = relations(volcaniqueTabacs, ({one}) => ({
	volcanique: one(volcanique, {
		fields: [volcaniqueTabacs.volcaniqueId],
		references: [volcanique.id]
	}),
	tabac: one(tabacs, {
		fields: [volcaniqueTabacs.tabacId],
		references: [tabacs.id]
	}),
}));