import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, text, varchar, foreignKey, mysqlEnum, timestamp, index, json, decimal, date, tinyint, boolean, uniqueIndex } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const absorbeProfiles = mysqlTable("absorbe_profiles", {
	id: int().autoincrement().notNull(),
	prototypeId: int("prototype_id").notNull(),
	animalite: int().default(0).notNull(),
	boise: int().default(0).notNull(),
	soufre: int().default(0).notNull(),
	oxyde: int().default(0).notNull(),
	resineux: int().default(0).notNull(),
	balsamique: int().default(0).notNull(),
	epice: int().default(0).notNull(),
	terreux: int().default(0).notNull(),
	notes: text(),
	createdAt: varchar("created_at", { length: 255 }).notNull(),
});

export const accords = mysqlTable("accords", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	familyId: int().references(() => families.id),
	aromaticProfile: text(),
	texture: mysqlEnum(['sec','humide','lactone','resine','pierre','air']),
	description: text(),
	notes: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	olfactiveProfile: text(),
	emotionalResonance: text(),
});

export const analyticsEvents = mysqlTable("analytics_events", {
	id: int().autoincrement().notNull(),
	userId: int("user_id"),
	eventType: mysqlEnum("event_type", ['molecule_view','recipe_view','terpene_view','pdf_export','favorite_add','favorite_remove','search_query']).notNull(),
	entityType: varchar("entity_type", { length: 50 }),
	entityId: int("entity_id"),
	metadata: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("event_type_idx").on(table.eventType),
	index("entity_type_idx").on(table.entityType),
	index("created_at_idx").on(table.createdAt),
]);

export const aromaticAccords = mysqlTable("aromatic_accords", {
	id: int().autoincrement().notNull(),
	accordId: varchar("accord_id", { length: 50 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	category: mysqlEnum(['fumoir','hash','herbal','hybrid']).notNull(),
	topNotes: json("top_notes"),
	heartNotes: json("heart_notes"),
	baseNotes: json("base_notes"),
	formula: text(),
	formulaJson: json("formula_json"),
	terpeneProfile: json("terpene_profile"),
	description: text(),
	inspiration: text(),
	targetEffect: text("target_effect"),
	diffusion: mysqlEnum(['faible','moyenne','forte']).default('moyenne'),
	tenacity: mysqlEnum(['fugace','modérée','tenace']).default('modérée'),
	sillage: mysqlEnum(['intime','modéré','puissant']).default('modéré'),
	keyInteractions: json("key_interactions"),
	usageRecommendations: text("usage_recommendations"),
	dilutionRecommendation: varchar("dilution_recommendation", { length: 100 }),
	imageUrl: varchar("image_url", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("aromatic_accords_category_idx").on(table.category),
	index("accord_id").on(table.accordId),
]);

export const axisSourceNez = mysqlTable("axis_source_nez", {
	id: int().autoincrement().notNull(),
	axisId: varchar("axis_id", { length: 100 }).notNull().references(() => researchAxisNez.axisId, { onDelete: "cascade" } ),
	sourceId: varchar("source_id", { length: 100 }).notNull().references(() => sourceArticleNez.sourceId, { onDelete: "cascade" } ),
	confidence: decimal({ precision: 3, scale: 2 }).default('0.5').notNull(),
	evidence: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
},
(table) => [
	index("unique_axis_source").on(table.axisId, table.sourceId),
]);

export const bibliographie = mysqlTable("bibliographie", {
	id: int().autoincrement().notNull(),
	auteur: varchar({ length: 255 }).notNull(),
	titre: varchar({ length: 500 }).notNull(),
	type: mysqlEnum(['livre','article','anthologie','essai','projet_recherche','these','memoire','autre']).notNull(),
	ideeCle: text("idee_cle"),
	applicationPerfumeum: text("application_perfumeum"),
	statut: mysqlEnum(['lu','en_cours','a_lire']).default('a_lire').notNull(),
	annee: int(),
	editeur: varchar({ length: 255 }),
	isbn: varchar({ length: 50 }),
	url: text(),
	notes: text(),
	chapitreMemoire: varchar("chapitre_memoire", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const bibliographyAxisLinks = mysqlTable("bibliography_axis_links", {
	id: int().autoincrement().notNull(),
	bibliographyId: int("bibliography_id").notNull(),
	axisId: int("axis_id").notNull(),
	relevance: mysqlEnum(['primaire','secondaire','contextuelle']).default('secondaire'),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("unique_bibliography_axis").on(table.bibliographyId, table.axisId),
]);

export const bibliographyEntries = mysqlTable("bibliography_entries", {
	id: int().autoincrement().notNull(),
	entryKey: varchar("entry_key", { length: 100 }).notNull(),
	entryType: mysqlEnum("entry_type", ['article','book','inbook','incollection','inproceedings','conference','thesis','mastersthesis','phdthesis','techreport','manual','unpublished','misc','online','patent','standard','dataset','software']).default('article').notNull(),
	title: varchar({ length: 500 }).notNull(),
	authors: text(),
	year: int(),
	journal: varchar({ length: 255 }),
	booktitle: varchar({ length: 255 }),
	publisher: varchar({ length: 255 }),
	volume: varchar({ length: 50 }),
	number: varchar({ length: 50 }),
	pages: varchar({ length: 50 }),
	edition: varchar({ length: 50 }),
	chapter: varchar({ length: 100 }),
	doi: varchar({ length: 100 }),
	isbn: varchar({ length: 20 }),
	issn: varchar({ length: 20 }),
	pmid: varchar({ length: 20 }),
	arxivId: varchar("arxiv_id", { length: 50 }),
	url: varchar({ length: 500 }),
	abstract: text(),
	keywords: json(),
	language: varchar({ length: 50 }).default('en'),
	researchDomain: mysqlEnum("research_domain", ['chimie_olfactive','botanique','ethnobotanique','histoire_parfumerie','neurologie_olfactive','extraction','formulation','reglementation','durabilite','tabac_cannabis','methodologie','autre']),
	relevanceScore: int("relevance_score").default(50),
	tags: json(),
	notes: text(),
	annotation: text(),
	pdfUrl: varchar("pdf_url", { length: 500 }),
	readStatus: mysqlEnum("read_status", ['unread','reading','read','to_review']).default('unread'),
	linkedMoleculeIds: json("linked_molecule_ids"),
	linkedPlantIds: json("linked_plant_ids"),
	linkedRecetteIds: json("linked_recette_ids"),
	addedBy: int("added_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("bibliography_entries_entry_key_unique").on(table.entryKey),
	index("bibliography_year_idx").on(table.year),
	index("bibliography_type_idx").on(table.entryType),
	index("bibliography_domain_idx").on(table.researchDomain),
]);

export const bibliographySources = mysqlTable("bibliography_sources", {
	id: int().autoincrement().notNull(),
	sourceType: mysqlEnum("source_type", ['scientific_paper','book','book_chapter','thesis','conference','patent','report','article','website','database','podcast','video','interview','archive','dataset','software','other']).notNull(),
	title: varchar({ length: 1000 }).notNull(),
	authors: text(),
	publicationYear: int("publication_year"),
	publicationMonth: int("publication_month"),
	accessDate: timestamp("access_date", { mode: 'string' }),
	journal: varchar({ length: 500 }),
	volume: varchar({ length: 50 }),
	issue: varchar({ length: 50 }),
	pages: varchar({ length: 100 }),
	publisher: varchar({ length: 500 }),
	edition: varchar({ length: 50 }),
	language: varchar({ length: 50 }).default('fr'),
	doi: varchar({ length: 255 }),
	isbn: varchar({ length: 20 }),
	issn: varchar({ length: 20 }),
	pmid: varchar({ length: 20 }),
	arxivId: varchar("arxiv_id", { length: 50 }),
	url: varchar({ length: 2000 }),
	abstract: text(),
	keywords: text(),
	notes: text(),
	quotes: text(),
	relevanceScore: int("relevance_score"),
	relevantAxes: text("relevant_axes"),
	fileUrl: varchar("file_url", { length: 2000 }),
	fileName: varchar("file_name", { length: 255 }),
	citationApa: text("citation_apa"),
	citationBibtex: text("citation_bibtex"),
	isVerified: tinyint("is_verified").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("bibliography_source_type_idx").on(table.sourceType),
	index("bibliography_year_idx").on(table.publicationYear),
	index("bibliography_doi_idx").on(table.doi),
]);

export const botanicalStates = mysqlTable("botanical_states", {
	id: int().autoincrement().notNull(),
	stateId: varchar("state_id", { length: 30 }).notNull(),
	plantId: int("plant_id").notNull().references(() => plants.id),
	stageName: varchar("stage_name", { length: 100 }).notNull(),
	stageCode: varchar("stage_code", { length: 10 }),
	stageOrder: int("stage_order").notNull(),
	stageType: mysqlEnum("stage_type", ['germination','vegetatif','floraison','fructification','senescence','dormance','autre']).notNull(),
	description: text(),
	visualCharacteristics: text("visual_characteristics"),
	duration: varchar({ length: 100 }),
	transitionConditions: json("transition_conditions"),
	olfactiveProfile: text("olfactive_profile"),
	dominantNotes: json("dominant_notes"),
	molecularProfile: json("molecular_profile"),
	recommendedUse: json("recommended_use"),
	harvestRecommendation: text("harvest_recommendation"),
	imageUrl: varchar("image_url", { length: 500 }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("state_id").on(table.stateId),
]);

export const chemicalFamilies = mysqlTable("chemical_families", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['acides_gras','acides_aromatiques','esters','indoles']).notNull(),
	description: text(),
	olfactiveRole: text(),
	volatility: varchar({ length: 50 }),
	polarity: varchar({ length: 50 }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const chemotypes = mysqlTable("chemotypes", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	code: varchar({ length: 50 }),
	plantId: int("plant_id"),
	plantName: varchar("plant_name", { length: 255 }).notNull(),
	latinName: varchar("latin_name", { length: 255 }),
	dominantMoleculeId: int("dominant_molecule_id"),
	dominantMoleculeName: varchar("dominant_molecule_name", { length: 255 }).notNull(),
	dominantPercentage: decimal("dominant_percentage", { precision: 5, scale: 2 }),
	dominantPercentageMin: int("dominant_percentage_min"),
	dominantPercentageMax: int("dominant_percentage_max"),
	secondaryMolecules: json("secondary_molecules"),
	origin: varchar({ length: 255 }),
	terroir: text(),
	altitude: varchar({ length: 100 }),
	climate: varchar({ length: 255 }),
	olfactiveProfile: text("olfactive_profile"),
	olfactiveNotes: json("olfactive_notes"),
	intensity: int(),
	therapeuticProperties: text("therapeutic_properties"),
	contraindications: text(),
	toxicity: mysqlEnum(['faible','modérée','élevée']),
	perfumeryUse: text("perfumery_use"),
	blendingNotes: text("blending_notes"),
	recommendedDilution: varchar("recommended_dilution", { length: 100 }),
	climaticAxis: mysqlEnum("climatic_axis", ['vent','bois','disparition','vent_bois','bois_disparition','vent_disparition']),
	imageUrl: varchar("image_url", { length: 500 }),
	notes: text(),
	references: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const citations = mysqlTable("citations", {
	id: int().autoincrement().notNull(),
	entityType: mysqlEnum("entity_type", ['molecule','recipe','prototype','accord']).notNull(),
	entityId: int("entity_id").notNull(),
	format: mysqlEnum(['apa','mla','chicago','bibtex']).default('apa').notNull(),
	citationText: text("citation_text").notNull(),
	doi: varchar({ length: 255 }),
	url: varchar({ length: 512 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const civilizationalMarkers = mysqlTable("civilizational_markers", {
	id: int().autoincrement().notNull(),
	plantId: int("plant_id").notNull(),
	civilization: varchar({ length: 255 }).notNull(),
	period: varchar({ length: 255 }),
	startYear: int("start_year"),
	endYear: int("end_year"),
	usageType: mysqlEnum("usage_type", ['ritual','medical','commercial','funerary','cosmetic']).notNull(),
	historicalSignificance: text("historical_significance"),
	tradeRoutes: json("trade_routes"),
	archaeologicalEvidence: text("archaeological_evidence"),
	primarySources: json("primary_sources"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("civilizational_markers_plant_idx").on(table.plantId),
	index("civilizational_markers_civilization_idx").on(table.civilization),
	index("civilizational_markers_period_idx").on(table.period),
	index("civilizational_markers_usage_idx").on(table.usageType),
]);

export const climateStudies = mysqlTable("climate_studies", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	collection: varchar({ length: 255 }),
	axis: varchar({ length: 255 }),
	concept: text(),
	zone: varchar({ length: 255 }),
	altitude: varchar({ length: 100 }),
	climate: text(),
	keyMoment: text("key_moment"),
	attackDescription: text("attack_description"),
	heartDescription: text("heart_description"),
	baseDescription: text("base_description"),
	observedSupports: text("observed_supports"),
	absorbeReading: text("absorbe_reading"),
	thresholdOdor: mysqlEnum("threshold_odor", ['yes','no']).default('no'),
	recommendedTests: text("recommended_tests"),
	headTranslation: text("head_translation"),
	heartTranslation: text("heart_translation"),
	baseTranslation: text("base_translation"),
	ethicalPosition: text("ethical_position"),
	status: mysqlEnum(['field_observation','lab_translation','completed']).default('field_observation'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const entourageRules = mysqlTable("entourage_rules", {
	id: int().autoincrement().notNull(),
	ruleId: varchar("rule_id", { length: 50 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	ruleType: mysqlEnum("rule_type", ['entourage','potentiation','modulation','stabilization','enhancement','contrast']).notNull(),
	primaryMolecules: json("primary_molecules"),
	secondaryMolecules: json("secondary_molecules"),
	description: text().notNull(),
	mechanism: text(),
	olfactiveResult: text("olfactive_result"),
	applicableTo: json("applicable_to"),
	scientificBasis: text("scientific_basis"),
	references: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("entourage_rules_type_idx").on(table.ruleType),
	index("rule_id").on(table.ruleId),
]);

export const experimentalAccordCivilisations = mysqlTable("experimental_accord_civilisations", {
	experimentalAccordId: int().notNull().references(() => experimentalAccords.id, { onDelete: "cascade" } ),
	civilisationId: int().notNull().references(() => traditionsOlfactives.id, { onDelete: "cascade" } ),
});

export const experimentalAccords = mysqlTable("experimental_accords", {
	id: int().autoincrement().notNull(),
	number: int().notNull(),
	olfactiveAxis: varchar({ length: 255 }).notNull(),
	intention: varchar({ length: 255 }).notNull(),
	baseTabac: text(),
	resinExtract: text(),
	sensoryModifier: text(),
	conceptualNote: text(),
	isExtreme: int().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const extendedSupplierMaterials = mysqlTable("extended_supplier_materials", {
	id: int().autoincrement().notNull(),
	supplierId: int("supplier_id").notNull(),
	plantId: int("plant_id"),
	varietyId: int("variety_id"),
	terroirId: int("terroir_id"),
	productName: varchar("product_name", { length: 255 }).notNull(),
	productType: varchar("product_type", { length: 100 }),
	pricePerKg: decimal("price_per_kg", { precision: 10, scale: 2 }),
	currency: varchar({ length: 3 }).default('EUR'),
	priceDate: timestamp("price_date", { mode: 'string' }),
	availability: mysqlEnum(['in_stock','on_order','seasonal','limited','discontinued','unknown']).default('unknown'),
	minimumQuantity: varchar("minimum_quantity", { length: 50 }),
	qualityGrade: varchar("quality_grade", { length: 50 }),
	certifications: json(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const extendedSuppliers = mysqlTable("extended_suppliers", {
	id: int().autoincrement().notNull(),
	supplierId: varchar("supplier_id", { length: 30 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	legalName: varchar("legal_name", { length: 255 }),
	supplierType: mysqlEnum("supplier_type", ['producer','distiller','trader','cooperative','laboratory','broker','other']).notNull(),
	country: varchar({ length: 100 }),
	address: text(),
	phone: varchar({ length: 50 }),
	email: varchar({ length: 255 }),
	website: varchar({ length: 500 }),
	contactPerson: varchar("contact_person", { length: 255 }),
	specialties: json(),
	mainProducts: json("main_products"),
	certifications: json(),
	minimumOrder: varchar("minimum_order", { length: 100 }),
	leadTime: varchar("lead_time", { length: 100 }),
	paymentTerms: varchar("payment_terms", { length: 255 }),
	shippingMethods: json("shipping_methods"),
	qualityRating: mysqlEnum("quality_rating", ['excellent','good','acceptable','poor','not_rated']).default('not_rated'),
	reliabilityRating: mysqlEnum("reliability_rating", ['excellent','good','acceptable','poor','not_rated']).default('not_rated'),
	priceRating: mysqlEnum("price_rating", ['premium','competitive','standard','budget','not_rated']).default('not_rated'),
	firstOrderDate: timestamp("first_order_date", { mode: 'string' }),
	lastOrderDate: timestamp("last_order_date", { mode: 'string' }),
	totalOrders: int("total_orders").default(0),
	status: mysqlEnum(['active','inactive','blacklisted','prospect']).default('active'),
	notes: text(),
	internalNotes: text("internal_notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("supplier_id").on(table.supplierId),
]);

export const extractionMethods = mysqlTable("extraction_methods", {
	id: int().autoincrement().notNull(),
	methodId: varchar("method_id", { length: 30 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	shortName: varchar("short_name", { length: 50 }),
	category: mysqlEnum(['distillation','expression','extraction_solvant','co2_supercritique','enfleurage','maceration','hydrodistillation','percolation','other']).notNull(),
	description: text(),
	principle: text(),
	parameters: json(),
	equipment: json(),
	typicalYields: json("typical_yields"),
	molecularImpact: text("molecular_impact"),
	preservedMolecules: json("preserved_molecules"),
	degradedMolecules: json("degraded_molecules"),
	advantages: json(),
	disadvantages: json(),
	bestFor: json("best_for"),
	notRecommendedFor: json("not_recommended_for"),
	costLevel: mysqlEnum("cost_level", ['low','medium','high','very_high']).default('medium'),
	complexityLevel: mysqlEnum("complexity_level", ['simple','moderate','complex','expert']).default('moderate'),
	notes: text(),
	references: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("method_id").on(table.methodId),
]);

export const extractionTests = mysqlTable("extraction_tests", {
	id: int().autoincrement().notNull(),
	testName: varchar("test_name", { length: 255 }).notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
	fieldArchiveId: int("field_archive_id"),
	material: text(),
	solvent: mysqlEnum(['mct','alcohol_95','alcohol_70','water','other']).notNull(),
	ratio: varchar({ length: 100 }),
	duration: int(),
	resultSmell: text("result_smell"),
	viable: mysqlEnum(['yes','no','maybe']).default('maybe'),
	notes: text(),
	observationDay1: text("observation_day_1"),
	observationDay7: text("observation_day_7"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const families = mysqlTable("families", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['perfumeum12','biomineralis','petrichor','volcanique','solarmineralis','necrogeo','other']).notNull(),
	description: text(),
	variationCount: int().default(0),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const fieldArchives = mysqlTable("field_archives", {
	id: int().autoincrement().notNull(),
	provisionalName: varchar("provisional_name", { length: 255 }).notNull(),
	zone: varchar({ length: 255 }),
	preciseLocation: varchar("precise_location", { length: 255 }),
	altitude: int(),
	date: timestamp({ mode: 'string' }),
	climate: text(),
	material: text(),
	dominantSmell: text("dominant_smell"),
	localUsage: text("local_usage"),
	personalFeeling: text("personal_feeling"),
	olfactiveHypothesis: text("olfactive_hypothesis"),
	testPerformed: mysqlEnum("test_performed", ['yes','no','planned']).default('no'),
	testType: varchar("test_type", { length: 100 }),
	status: mysqlEnum(['draft','in_progress','completed','archived']).default('draft'),
	linkedCollectionId: int("linked_collection_id"),
	encounterContext: text("encounter_context"),
	firstImpression: text("first_impression"),
	evolution: text(),
	persistence: text(),
	materialOrigin: text("material_origin"),
	materialState: varchar("material_state", { length: 100 }),
	symbolicQuantity: text("symbolic_quantity"),
	translationHypothesis: text("translation_hypothesis"),
	whatToKeep: text("what_to_keep"),
	whatToLeave: text("what_to_leave"),
	personalNote: text("personal_note"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const finalRecipeTerpProfiles = mysqlTable("final_recipe_terp_profiles", {
	finalRecipeId: int("final_recipe_id").notNull().references(() => finalRecipes.id, { onDelete: "cascade" } ),
	terpProfileId: int("terp_profile_id").notNull().references(() => terpProfiles.id, { onDelete: "cascade" } ),
	percentage: decimal({ precision: 5, scale: 2 }),
	notes: text(),
});

export const finalRecipes = mysqlTable("final_recipes", {
	id: int().autoincrement().notNull(),
	recipeId: varchar("recipe_id", { length: 20 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	recipeType: mysqlEnum("recipe_type", ['parfum','encens','espace']).notNull(),
	function: text(),
	climaticAxis: mysqlEnum("climatic_axis", ['vent','bois','disparition','vent_bois','bois_disparition','vent_disparition','vent_bois_disparition']).notNull(),
	base: varchar({ length: 255 }),
	concentrate: json(),
	dilution: varchar({ length: 100 }),
	restPeriod: varchar("rest_period", { length: 100 }),
	form: text(),
	combustionTime: varchar("combustion_time", { length: 100 }),
	protocol: text(),
	supports: text(),
	expectedResult: text("expected_result"),
	successCriteria: text("success_criteria"),
	risks: text(),
	notes: text(),
	usage: text(),
	terpProfileIds: json("terp_profile_ids"),
	isRadical: int("is_radical").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("recipe_id").on(table.recipeId),
]);

export const formulationSuggestions = mysqlTable("formulation_suggestions", {
	id: int().autoincrement().notNull(),
	suggestionId: varchar("suggestion_id", { length: 50 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	baseMoleculeId: int("base_molecule_id"),
	baseMoleculeName: varchar("base_molecule_name", { length: 255 }),
	suggestedMolecules: json("suggested_molecules"),
	synergyRules: json("synergy_rules"),
	expectedOlfactiveProfile: text("expected_olfactive_profile"),
	expectedEffects: json("expected_effects"),
	formulationType: mysqlEnum("formulation_type", ['parfum','encens','tabac_blend','cannabis_blend','hybrid']).notNull(),
	difficulty: mysqlEnum(['débutant','intermédiaire','avancé']).default('intermédiaire'),
	technicalNotes: text("technical_notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("formulation_suggestions_type_idx").on(table.formulationType),
	index("formulation_suggestions_base_idx").on(table.baseMoleculeId),
	index("suggestion_id").on(table.suggestionId),
]);

export const genealogyExtended = mysqlTable("genealogy_extended", {
	id: int().autoincrement().notNull(),
	genealogyId: int("genealogy_id").notNull(),
	geneticSimilarity: int("genetic_similarity"),
	sharedMarkers: json("shared_markers"),
	inheritedMolecules: json("inherited_molecules"),
	inheritedTraits: json("inherited_traits"),
	crossingMethod: mysqlEnum("crossing_method", ['natural','controlled','backcross','selfing','mutation_induced','tissue_culture','unknown']),
	crossingLocation: varchar("crossing_location", { length: 255 }),
	crossingDocumentation: text("crossing_documentation"),
	validationStatus: mysqlEnum("validation_status", ['confirmed','documented','inferred','hypothetical']).default('documented').notNull(),
	validationMethod: varchar("validation_method", { length: 255 }),
	validationReferences: json("validation_references"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("ge_genealogy_idx").on(table.genealogyId),
]);

export const geographicOrigins = mysqlTable("geographic_origins", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	country: varchar({ length: 100 }).notNull(),
	region: varchar({ length: 255 }),
	terroir: text(),
	latitude: decimal({ precision: 10, scale: 7 }),
	longitude: decimal({ precision: 10, scale: 7 }),
	altitude: int(),
	climate: varchar({ length: 100 }),
	soilType: varchar("soil_type", { length: 255 }),
	harvestPeriod: varchar("harvest_period", { length: 255 }),
	productionMethod: text("production_method"),
	qualityIndicators: text("quality_indicators"),
	historicalContext: text("historical_context"),
	economicImportance: text("economic_importance"),
	sustainabilityNotes: text("sustainability_notes"),
	imageUrl: varchar("image_url", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
});

export const geographicZones = mysqlTable("geographic_zones", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	region: varchar({ length: 255 }).notNull(),
	zoneType: mysqlEnum("zone_type", ['threatened_concentration','sustainable_alternatives','biodiversity_hotspot','conservation_area']).notNull(),
	coordinates: json().notNull(),
	description: text(),
	threatLevel: mysqlEnum("threat_level", ['critical','high','medium','low','stable']).default('medium'),
	speciesCount: int("species_count").default(0),
	conservationPriority: mysqlEnum("conservation_priority", ['urgent','high','medium','low']).default('medium'),
	overlayColor: varchar("overlay_color", { length: 7 }).default('#FF0000'),
	overlayOpacity: decimal("overlay_opacity", { precision: 3, scale: 2 }).default('0.35'),
	sustainableAlternatives: text("sustainable_alternatives"),
	conservationEfforts: text("conservation_efforts"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("idx_zone_type").on(table.zoneType),
	index("idx_threat_level").on(table.threatLevel),
]);

export const gestionAgenda = mysqlTable("gestion_agenda", {
	id: int().autoincrement().notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
	evenement: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['rencontre','presentation','deadline','mentorat','terrain','laboratoire','autre']).default('autre').notNull(),
	lieu: varchar({ length: 255 }),
	description: text(),
	statut: mysqlEnum(['planifie','confirme','realise','annule']).default('planifie').notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const gestionBudget = mysqlTable("gestion_budget", {
	id: int().autoincrement().notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
	description: varchar({ length: 255 }).notNull(),
	montant: decimal({ precision: 10, scale: 2 }).notNull(),
	categorie: mysqlEnum(['materiel','deplacement','formation','documentation','laboratoire','autre']).default('autre').notNull(),
	type: mysqlEnum(['depense','revenu']).default('depense').notNull(),
	statut: mysqlEnum(['prevu','engage','paye']).default('prevu').notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const gestionMentorat = mysqlTable("gestion_mentorat", {
	id: int().autoincrement().notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
	duree: int().notNull(),
	mentor: varchar({ length: 255 }),
	sujet: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['technique','artistique','theorique','methodologique','administratif','autre']).default('autre').notNull(),
	notes: text(),
	actionsSuivre: text("actions_suivre"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const glossary = mysqlTable("glossary", {
	id: int().autoincrement().notNull(),
	term: varchar({ length: 255 }).notNull(),
	definition: text().notNull(),
	category: mysqlEnum(['chimie','interaction','reaction','extraction','technique','molecule','concept','propriete','methodologie','formulation','protocole','dispositif','support','application','structure']).notNull(),
	context: text(),
	examples: text(),
	relatedTerms: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("term").on(table.term),
]);

export const ifraCategories = mysqlTable("ifra_categories", {
	id: int().autoincrement().notNull(),
	code: varchar({ length: 10 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	nameFr: varchar("name_fr", { length: 255 }),
	description: text(),
	descriptionFr: text("description_fr"),
	examples: text(),
	examplesFr: text("examples_fr"),
	exposureLevel: mysqlEnum("exposure_level", ['very_high','high','medium','low','very_low']),
	skinContact: mysqlEnum("skin_contact", ['direct_prolonged','direct_brief','indirect','none']),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
(table) => [
	index("code").on(table.code),
]);

export const ifraRestrictions = mysqlTable("ifra_restrictions", {
	id: int().autoincrement().notNull(),
	moleculeId: int("molecule_id").notNull().references(() => molecules.id, { onDelete: "cascade" } ),
	ifraAmendment: varchar("ifra_amendment", { length: 20 }),
	effectiveDate: timestamp("effective_date", { mode: 'string' }),
	category1: decimal("category_1", { precision: 6, scale: 4 }),
	category2: decimal("category_2", { precision: 6, scale: 4 }),
	category3: decimal("category_3", { precision: 6, scale: 4 }),
	category4: decimal("category_4", { precision: 6, scale: 4 }),
	category5A: decimal("category_5a", { precision: 6, scale: 4 }),
	category5B: decimal("category_5b", { precision: 6, scale: 4 }),
	category5C: decimal("category_5c", { precision: 6, scale: 4 }),
	category5D: decimal("category_5d", { precision: 6, scale: 4 }),
	category6: decimal("category_6", { precision: 6, scale: 4 }),
	category7A: decimal("category_7a", { precision: 6, scale: 4 }),
	category7B: decimal("category_7b", { precision: 6, scale: 4 }),
	category8: decimal("category_8", { precision: 6, scale: 4 }),
	category9: decimal("category_9", { precision: 6, scale: 4 }),
	category10A: decimal("category_10a", { precision: 6, scale: 4 }),
	category10B: decimal("category_10b", { precision: 6, scale: 4 }),
	category11A: decimal("category_11a", { precision: 6, scale: 4 }),
	category11B: decimal("category_11b", { precision: 6, scale: 4 }),
	restrictionType: mysqlEnum("restriction_type", ['prohibited','restricted','specification','no_restriction']).default('no_restriction'),
	reasonForRestriction: text("reason_for_restriction"),
	alternativeSuggestions: text("alternative_suggestions"),
	notes: text(),
	sourceUrl: varchar("source_url", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
});

export const installationFamilies = mysqlTable("installation_families", {
	installationId: int().notNull().references(() => installations.id),
	familyId: int().notNull().references(() => families.id),
});

export const installationRecettes = mysqlTable("installation_recettes", {
	installationId: int().notNull().references(() => installations.id),
	recetteId: int().notNull().references(() => recettes.id),
});

export const installations = mysqlTable("installations", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	concept: text(),
	materials: text(),
	diffusionMode: text(),
	location: varchar({ length: 255 }),
	date: timestamp({ mode: 'string' }),
	documentation: text(),
	visitorExperience: text(),
	theoreticalScope: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const laboratoire = mysqlTable("laboratoire", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	botanicalName: varchar({ length: 255 }),
	type: mysqlEnum(['huile_essentielle','absolu','resinoid','concrete','co2','teinture','poudre','alcoolat','autre']).notNull(),
	olfactiveFamily: text(),
	note: mysqlEnum(['tete','coeur','fond','tete_coeur','coeur_fond']),
	origin: varchar({ length: 255 }),
	extractionMethod: mysqlEnum(['distillation','extraction_solvant','co2_supercritique','expression','teinture','autre']),
	olfactiveProfile: text(),
	character: text(),
	supplier: varchar({ length: 255 }),
	pricePerMl: int(),
	stock: int(),
	purchaseDate: timestamp({ mode: 'string' }),
	status: mysqlEnum(['en_stock','a_commander','epuise']).default('en_stock'),
	technicalNotes: text(),
	manipulationNotes: text(),
	maxTemperature: int(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const laboratoireMolecules = mysqlTable("laboratoire_molecules", {
	laboratoireId: int().notNull().references(() => laboratoire.id),
	moleculeId: int().notNull().references(() => molecules.id),
});

export const laboratoireRecettes = mysqlTable("laboratoire_recettes", {
	laboratoireId: int().notNull().references(() => laboratoire.id),
	recetteId: int().notNull().references(() => recettes.id),
});

export const leafEconomies = mysqlTable("leaf_economies", {
	id: int().autoincrement().notNull(),
	sampleId: varchar("sample_id", { length: 50 }).notNull(),
	date: timestamp({ mode: 'string' }),
	island: mysqlEnum(['san_andres','providencia','autre']),
	preciseLocation: varchar("precise_location", { length: 255 }),
	sourceContact: text("source_contact"),
	category: mysqlEnum(['aromatique','tabac','cannabis']).notNull(),
	species: varchar({ length: 255 }),
	claimedVariety: varchar("claimed_variety", { length: 255 }),
	usedPart: mysqlEnum("used_part", ['feuille','fleur','resine','tige','autre']),
	state: mysqlEnum(['frais','sec','rehydrate']),
	curingTreatment: mysqlEnum("curing_treatment", ['aucun','air_cured','flue_cured','sun_cured','autre']),
	extraction: mysqlEnum(['aucune','maceration_alcool','maceration_mct','distillation','headspace']),
	ratioParameters: varchar("ratio_parameters", { length: 255 }),
	duration: varchar({ length: 100 }),
	odorNotes: text("odor_notes"),
	climaticAxis: text("climatic_axis"),
	usage: text(),
	analysisAvailable: int("analysis_available").default(0),
	analysisMethod: mysqlEnum("analysis_method", ['gc_ms','hplc','autre']),
	topMoleculesList: text("top_molecules_list"),
	topMolecule1: varchar("top_molecule_1", { length: 255 }),
	topMolecule2: varchar("top_molecule_2", { length: 255 }),
	topMolecule3: varchar("top_molecule_3", { length: 255 }),
	relativePercentages: text("relative_percentages"),
	absorbeInterpretation: text("absorbe_interpretation"),
	status: mysqlEnum(['brut','a_analyser','analyse','traduction','archive']).default('brut'),
	mediaLinks: text("media_links"),
	ethicalNotes: text("ethical_notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	imageUrl: varchar("image_url", { length: 500 }),
},
(table) => [
	index("leaf_economies_sample_id_unique").on(table.sampleId),
]);

export const leafEconomyMolecules = mysqlTable("leaf_economy_molecules", {
	leafEconomyId: int("leaf_economy_id").notNull().references(() => leafEconomies.id),
	moleculeId: int("molecule_id").notNull().references(() => molecules.id),
	percentage: decimal({ precision: 5, scale: 2 }),
	notes: text(),
});

export const lostVarieties = mysqlTable("lost_varieties", {
	id: int().autoincrement().notNull(),
	lostVarietyId: varchar("lost_variety_id", { length: 30 }).notNull(),
	plantId: int("plant_id"),
	name: varchar({ length: 255 }).notNull(),
	latinName: varchar("latin_name", { length: 255 }),
	historicalNames: json("historical_names"),
	extinctionStatus: mysqlEnum("extinction_status", ['extinct','extinct_in_wild','presumed_extinct','possibly_extinct','rediscovered']).notNull(),
	lastKnownDate: int("last_known_date"),
	extinctionDate: int("extinction_date"),
	extinctionCause: mysqlEnum("extinction_cause", ['overexploitation','habitat_loss','climate_change','disease','hybridization','war_conflict','unknown']),
	extinctionDetails: text("extinction_details"),
	historicalRange: json("historical_range"),
	morphologicalDescription: text("morphological_description"),
	olfactiveDescription: text("olfactive_description"),
	therapeuticUses: text("therapeutic_uses"),
	culturalSignificance: text("cultural_significance"),
	hypotheticalMolecularProfile: json("hypothetical_molecular_profile"),
	reconstructionPossibility: mysqlEnum("reconstruction_possibility", ['possible','partial','unlikely','impossible']).default('partial'),
	reconstructionNotes: text("reconstruction_notes"),
	closestLivingRelatives: json("closest_living_relatives"),
	primarySources: json("primary_sources"),
	imageUrl: varchar("image_url", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("lv_plant_idx").on(table.plantId),
	index("lv_status_idx").on(table.extinctionStatus),
	index("lost_variety_id").on(table.lostVarietyId),
]);

export const memoryOlfactionConcepts = mysqlTable("memory_olfaction_concepts", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['phenomenon','brain_structure','memory_type','mechanism','disorder','therapy','ritual']).notNull(),
	definition: text(),
	description: text(),
	scientificBasis: text("scientific_basis"),
	historicalContext: text("historical_context"),
	keyResearchers: text("key_researchers"),
	seminalPapers: text("seminal_papers"),
	illustration: varchar({ length: 1000 }),
	diagrams: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("memory_concept_type_idx").on(table.type),
	index("slug").on(table.slug),
]);

export const milestones = mysqlTable("milestones", {
	id: int().autoincrement().notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	type: mysqlEnum(['prototype','discovery','collaboration','publication','other']).default('other').notNull(),
	moleculeId: int("molecule_id"),
	userId: int("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const modificationHistory = mysqlTable("modification_history", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	entityType: mysqlEnum("entity_type", ['molecule','recette','accord','famille','matiere','prototype','synergie','tradition']).notNull(),
	entityId: int("entity_id").notNull(),
	operation: mysqlEnum(['create','update','delete']).notNull(),
	stateBefore: json("state_before"),
	stateAfter: json("state_after"),
	description: text(),
	isUndone: int("is_undone").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	undoneAt: timestamp("undone_at", { mode: 'string' }),
},
(table) => [
	index("user_id_idx").on(table.userId),
	index("entity_type_idx").on(table.entityType),
	index("entity_id_idx").on(table.entityId),
	index("created_at_idx").on(table.createdAt),
]);

export const molecularComparisons = mysqlTable("molecular_comparisons", {
	id: int().autoincrement().notNull(),
	comparisonId: varchar("comparison_id", { length: 30 }).notNull(),
	ancientProfileId: int("ancient_profile_id").notNull(),
	modernVarietyId: int("modern_variety_id").notNull(),
	lostVarietyId: int("lost_variety_id"),
	overallSimilarity: int("overall_similarity"),
	terpeneProfileSimilarity: int("terpene_profile_similarity"),
	olfactiveProfileSimilarity: int("olfactive_profile_similarity"),
	molecularDifferences: json("molecular_differences"),
	lostMolecules: json("lost_molecules"),
	gainedMolecules: json("gained_molecules"),
	analysisNotes: text("analysis_notes"),
	evolutionHypothesis: text("evolution_hypothesis"),
	selectionPressures: json("selection_pressures"),
	reconstructionRelevance: mysqlEnum("reconstruction_relevance", ['critical','important','useful','marginal']).default('useful'),
	reconstructionNotes: text("reconstruction_notes"),
	comparisonDate: timestamp("comparison_date", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	analyst: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("mc_ancient_profile_idx").on(table.ancientProfileId),
	index("mc_modern_variety_idx").on(table.modernVarietyId),
	index("mc_lost_variety_idx").on(table.lostVarietyId),
	index("comparison_id").on(table.comparisonId),
]);

export const molecularInteractions = mysqlTable("molecular_interactions", {
	id: int().autoincrement().notNull(),
	interactionId: varchar("interaction_id", { length: 50 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	sourceCategory: mysqlEnum("source_category", ['tabac_cannabis','tabac_parfum','cannabis_parfum','tabac_cannabis_parfum']).notNull(),
	molecule1Id: int("molecule1_id"),
	molecule2Id: int("molecule2_id"),
	molecule3Id: int("molecule3_id"),
	terpeneProfile: json("terpene_profile"),
	synergyType: mysqlEnum("synergy_type", ['entourage','potentiation','bridge','stabilization','transformation','masking']).notNull(),
	compatibilityScore: int("compatibility_score").default(50).notNull(),
	description: text(),
	olfactiveResult: text("olfactive_result"),
	applications: text(),
	scientificBasis: text("scientific_basis"),
	references: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("molecular_interactions_source_idx").on(table.sourceCategory),
	index("molecular_interactions_synergy_idx").on(table.synergyType),
	index("interaction_id").on(table.interactionId),
]);

export const molecularProtocols = mysqlTable("molecular_protocols", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	linkedStudyId: int("linked_study_id"),
	objective: text(),
	olfactiveArchitecture: text("olfactive_architecture"),
	function: text(),
	headPalette: json("head_palette"),
	heartPalette: json("heart_palette"),
	basePalette: json("base_palette"),
	headRatio: int("head_ratio").default(25),
	heartRatio: int("heart_ratio").default(45),
	baseRatio: int("base_ratio").default(30),
	formulationProtocol: text("formulation_protocol"),
	sensoryTests: text("sensory_tests"),
	typicalFailures: text("typical_failures"),
	status: mysqlEnum(['conceptual','testing','validated']).default('conceptual'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const moleculeAccords = mysqlTable("molecule_accords", {
	moleculeId: int().notNull().references(() => molecules.id),
	accordId: int().notNull().references(() => accords.id),
});

export const moleculeChemicalFamilies = mysqlTable("molecule_chemical_families", {
	moleculeId: int().notNull().references(() => molecules.id, { onDelete: "cascade" } ),
	chemicalFamilyId: int().notNull().references(() => chemicalFamilies.id, { onDelete: "cascade" } ),
});

export const moleculeFamilies = mysqlTable("molecule_families", {
	moleculeId: int().notNull().references(() => molecules.id),
	familyId: int().notNull().references(() => families.id),
});

export const moleculeNotes = mysqlTable("molecule_notes", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	moleculeId: int("molecule_id").notNull().references(() => molecules.id, { onDelete: "cascade" } ),
	note: text().notNull(),
	tags: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("unique_user_molecule_note").on(table.userId, table.moleculeId),
]);

export const moleculeOrigins = mysqlTable("molecule_origins", {
	id: int().autoincrement().notNull(),
	moleculeId: int("molecule_id").notNull().references(() => molecules.id, { onDelete: "cascade" } ),
	originId: int("origin_id").notNull().references(() => geographicOrigins.id, { onDelete: "cascade" } ),
	isPrimaryOrigin: tinyint("is_primary_origin").default(0),
	qualityRating: int("quality_rating"),
	productionVolume: varchar("production_volume", { length: 100 }),
	priceRange: varchar("price_range", { length: 100 }),
	specificCharacteristics: text("specific_characteristics"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
},
(table) => [
	index("unique_molecule_origin").on(table.moleculeId, table.originId),
]);

export const moleculePlantSources = mysqlTable("molecule_plant_sources", {
	id: int().autoincrement().notNull(),
	moleculeId: int("molecule_id").notNull().references(() => molecules.id, { onDelete: "cascade" } ),
	plantId: int("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" } ),
	plantPart: varchar("plant_part", { length: 100 }),
	percentageInPlant: decimal("percentage_in_plant", { precision: 5, scale: 3 }),
	percentageInOil: decimal("percentage_in_oil", { precision: 5, scale: 2 }),
	variability: mysqlEnum(['stable','variable','tres_variable','chemotype_dependant']),
	isMainSource: int("is_main_source").default(0),
	isPrimarySource: int("is_primary_source").default(0),
	bestExtractionMethod: varchar("best_extraction_method", { length: 100 }),
	extractionYield: decimal("extraction_yield", { precision: 5, scale: 3 }),
	refs: json(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

export const moleculeRecettes = mysqlTable("molecule_recettes", {
	moleculeId: int().notNull().references(() => molecules.id),
	recetteId: int().notNull().references(() => recettes.id),
});

export const moleculeSynergies = mysqlTable("molecule_synergies", {
	id: int().autoincrement().notNull(),
	molecule1Id: int("molecule1_id").notNull().references(() => molecules.id, { onDelete: "cascade" } ),
	molecule2Id: int("molecule2_id").notNull().references(() => molecules.id, { onDelete: "cascade" } ),
	type: mysqlEnum(['potentialisation','stabilisation','transformation','masquage']).notNull(),
	description: text().notNull(),
	applications: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("unique_molecule_pair").on(table.molecule1Id, table.molecule2Id),
]);

export const molecules = mysqlTable("molecules", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	formula: varchar({ length: 100 }),
	chemicalFamily: text(),
	olfactiveProfile: text(),
	functionalEffect: text(),
	threshold: varchar({ length: 50 }),
	toxicityRemarks: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	family: text(),
	chemicalFormula: varchar({ length: 100 }),
	emotionalResonance: text(),
	sourceOrigin: text(),
	concentration: varchar({ length: 100 }),
	notes: text(),
	emotion: text(),
	molecularWeight: int(),
	boilingPoint: int(),
	logP: int(),
	volatility: int(),
	intensity: int(),
	complexity: int(),
	botanicalSources: text(),
	extractionMethod: text(),
	therapeuticProperties: text(),
	radarIntensity: int("radar_intensity").default(50),
	radarFreshness: int("radar_freshness").default(50),
	radarWarmth: int("radar_warmth").default(50),
	radarSweetness: int("radar_sweetness").default(50),
	radarSpiciness: int("radar_spiciness").default(50),
	radarEarthiness: int("radar_earthiness").default(50),
	references: json(),
	iupacName: varchar("iupac_name", { length: 500 }),
	casNumber: varchar("cas_number", { length: 20 }),
	chemicalClass: mysqlEnum("chemical_class", ['terpene','sesquiterpene','diterpene','monoterpene','aldehyde','ketone','alcohol','ester','ether','phenol','lactone','coumarin','musk','nitrile','sulfur_compound','heterocyclic','aromatic','aliphatic','other']),
});

export const moleculesRecettes = mysqlTable("molecules_recettes", {
	id: int().autoincrement().notNull(),
	moleculeId: int("molecule_id").notNull(),
	recetteId: int("recette_id").notNull(),
	proportion: decimal({ precision: 5, scale: 2 }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
	role: mysqlEnum(['tête','cœur','fond']),
},
(table) => [
	index("unique_molecule_recette").on(table.moleculeId, table.recetteId),
	index("idx_molecule").on(table.moleculeId),
	index("idx_recette").on(table.recetteId),
]);

export const olfactionMemory = mysqlTable("olfaction_memory", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 500 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	category: mysqlEnum(['neurological','historical','psychological','cultural','scientific_study','artistic','therapeutic']).notNull(),
	summary: text(),
	content: text(),
	keyFindings: text("key_findings"),
	authors: text(),
	institutions: text(),
	publicationDate: timestamp("publication_date", { mode: 'string' }),
	sourceUrl: varchar("source_url", { length: 1000 }),
	doi: varchar({ length: 255 }),
	historicalPeriod: varchar("historical_period", { length: 255 }),
	startYear: int("start_year"),
	endYear: int("end_year"),
	brainRegions: text("brain_regions"),
	civilizations: text(),
	tags: text(),
	images: text(),
	diagrams: text(),
	videos: text(),
	relatedMoleculeIds: text("related_molecule_ids"),
	relatedPlantIds: text("related_plant_ids"),
	relatedArchiveIds: text("related_archive_ids"),
	status: mysqlEnum(['draft','review','published','archived']).default('draft'),
	featured: tinyint().default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	createdBy: int("created_by"),
},
(table) => [
	index("olfaction_memory_category_idx").on(table.category),
	index("olfaction_memory_status_idx").on(table.status),
	index("olfaction_memory_featured_idx").on(table.featured),
	index("slug").on(table.slug),
]);

export const olfactionMemoryArticleConcepts = mysqlTable("olfaction_memory_article_concepts", {
	id: int().autoincrement().notNull(),
	articleId: int("article_id").notNull(),
	conceptId: int("concept_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("article_concept_article_idx").on(table.articleId),
	index("article_concept_concept_idx").on(table.conceptId),
	index("article_concept_unique").on(table.articleId, table.conceptId),
]);

export const olfactionMemoryArticleSources = mysqlTable("olfaction_memory_article_sources", {
	id: int().autoincrement().notNull(),
	articleId: int("article_id").notNull(),
	sourceId: int("source_id").notNull(),
	citationContext: text("citation_context"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("article_source_article_idx").on(table.articleId),
	index("article_source_source_idx").on(table.sourceId),
	index("article_source_unique").on(table.articleId, table.sourceId),
]);

export const olfactionMemorySources = mysqlTable("olfaction_memory_sources", {
	id: int().autoincrement().notNull(),
	sourceType: mysqlEnum("source_type", ['scientific_paper','book','book_chapter','thesis','conference','podcast','article','documentary','website']).notNull(),
	title: varchar({ length: 500 }).notNull(),
	authors: text(),
	publicationYear: int("publication_year"),
	journal: varchar({ length: 255 }),
	volume: varchar({ length: 50 }),
	issue: varchar({ length: 50 }),
	pages: varchar({ length: 50 }),
	publisher: varchar({ length: 255 }),
	doi: varchar({ length: 255 }),
	isbn: varchar({ length: 20 }),
	url: varchar({ length: 1000 }),
	abstract: text(),
	notes: text(),
	relevanceScore: int("relevance_score"),
	keyTopics: text("key_topics"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("olfaction_source_type_idx").on(table.sourceType),
	index("olfaction_source_year_idx").on(table.publicationYear),
]);

export const olfactiveArchives = mysqlTable("olfactive_archives", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 500 }).notNull(),
	type: mysqlEnum(['manuscript','formula','archaeological','botanical_illustration']).notNull(),
	dateCreated: varchar("date_created", { length: 100 }),
	civilization: varchar({ length: 255 }),
	plantIds: json("plant_ids"),
	moleculeIds: json("molecule_ids"),
	description: text(),
	provenance: text(),
	authenticityLevel: mysqlEnum("authenticity_level", ['confirmed','probable','hypothetical']).default('probable').notNull(),
	references: json(),
	imageUrl: varchar("image_url", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("olfactive_archives_type_idx").on(table.type),
	index("olfactive_archives_civilization_idx").on(table.civilization),
]);

export const petrichor = mysqlTable("petrichor", {
	id: int().autoincrement().notNull(),
	variation: varchar({ length: 255 }).notNull(),
	subfamily: mysqlEnum(['clair','noir','argile','bois_humide','racine','mousse','desert','marin','glaciaire','urbain','sacre']).notNull(),
	description: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const petrichorExperimentalAccords = mysqlTable("petrichor_experimental_accords", {
	petrichorId: int().notNull().references(() => petrichor.id, { onDelete: "cascade" } ),
	experimentalAccordId: int().notNull().references(() => experimentalAccords.id, { onDelete: "cascade" } ),
});

export const petrichorMolecules = mysqlTable("petrichor_molecules", {
	petrichorId: int().notNull().references(() => petrichor.id),
	moleculeId: int().notNull().references(() => molecules.id),
});

export const petrichorRecettes = mysqlTable("petrichor_recettes", {
	petrichorId: int().notNull().references(() => petrichor.id),
	recetteId: int().notNull().references(() => recettes.id),
});

export const petrichorTabacs = mysqlTable("petrichor_tabacs", {
	petrichorId: int().notNull().references(() => petrichor.id),
	tabacId: int().notNull().references(() => tabacs.id),
});

export const plantAnalyses = mysqlTable("plant_analyses", {
	id: int().autoincrement().notNull(),
	analysisId: varchar("analysis_id", { length: 30 }).notNull(),
	plantId: int("plant_id"),
	varietyId: int("variety_id"),
	sampleId: int("sample_id"),
	analysisDate: timestamp("analysis_date", { mode: 'string' }),
	laboratory: varchar({ length: 255 }),
	analyst: varchar({ length: 255 }),
	method: mysqlEnum(['gc_ms','gc_fid','hplc','nmr','ir','other']).default('gc_ms'),
	conditions: json(),
	molecularProfile: json("molecular_profile"),
	totalCompoundsIdentified: int("total_compounds_identified"),
	majorCompounds: json("major_compounds"),
	olfactiveClassification: json("olfactive_classification"),
	qualityScore: mysqlEnum("quality_score", ['excellent','good','acceptable','poor','invalid']).default('good'),
	qualityNotes: text("quality_notes"),
	rawDataUrl: varchar("raw_data_url", { length: 500 }),
	reportUrl: varchar("report_url", { length: 500 }),
	chromatogramUrl: varchar("chromatogram_url", { length: 500 }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("analysis_id").on(table.analysisId),
]);

export const plantExtractions = mysqlTable("plant_extractions", {
	id: int().autoincrement().notNull(),
	plantId: int("plant_id").notNull(),
	extractionMethodId: int("extraction_method_id").notNull(),
	plantPart: varchar("plant_part", { length: 100 }),
	yieldPercent: decimal("yield_percent", { precision: 5, scale: 3 }),
	yieldNotes: text("yield_notes"),
	productType: varchar("product_type", { length: 100 }),
	productQuality: text("product_quality"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("unique_plant_extraction").on(table.plantId, table.extractionMethodId),
]);

export const plantGeographicZones = mysqlTable("plant_geographic_zones", {
	id: int().autoincrement().notNull(),
	plantId: int("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" } ),
	zoneId: int("zone_id").notNull().references(() => geographicZones.id, { onDelete: "cascade" } ),
	isPrimaryZone: tinyint("is_primary_zone").default(0),
	populationStatus: mysqlEnum("population_status", ['abundant','common','rare','critically_rare','extinct']).default('common'),
	notes: text(),
},
(table) => [
	index("unique_plant_zone").on(table.plantId, table.zoneId),
	index("idx_plant_zone").on(table.plantId, table.zoneId),
]);

export const plantMolecules = mysqlTable("plant_molecules", {
	plantId: int("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" } ),
	moleculeId: int("molecule_id").notNull().references(() => molecules.id, { onDelete: "cascade" } ),
	percentageMin: decimal("percentage_min", { precision: 5, scale: 2 }),
	percentageMax: decimal("percentage_max", { precision: 5, scale: 2 }),
	percentageTypical: decimal("percentage_typical", { precision: 5, scale: 2 }),
	percentage: decimal({ precision: 5, scale: 2 }),
	isSignature: int("is_signature").default(0),
	role: mysqlEnum(['majeur','secondaire','trace','variable']),
	variabilityFactor: mysqlEnum("variability_factor", ['stable','saisonnier','geographique','chemotype','extraction']),
	source: varchar({ length: 255 }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
(table) => [
	index("unique_plant_molecule").on(table.plantId, table.moleculeId),
]);

export const plantSamples = mysqlTable("plant_samples", {
	id: int().autoincrement().notNull(),
	sampleId: varchar("sample_id", { length: 30 }).notNull(),
	batchNumber: varchar("batch_number", { length: 50 }),
	plantId: int("plant_id").notNull(),
	varietyId: int("variety_id"),
	terroirId: int("terroir_id"),
	supplierId: int("supplier_id"),
	harvestDate: timestamp("harvest_date", { mode: 'string' }),
	harvestYear: int("harvest_year"),
	harvestLocation: varchar("harvest_location", { length: 255 }),
	harvestMethod: varchar("harvest_method", { length: 100 }),
	plantPart: mysqlEnum("plant_part", ['feuille','fleur','fruit','graine','racine','ecorce','bois','resine','plante_entiere','autre']).default('feuille'),
	botanicalState: varchar("botanical_state", { length: 50 }),
	processingMethod: varchar("processing_method", { length: 255 }),
	processingDate: timestamp("processing_date", { mode: 'string' }),
	extractionMethodId: int("extraction_method_id"),
	initialQuantity: varchar("initial_quantity", { length: 50 }),
	currentQuantity: varchar("current_quantity", { length: 50 }),
	unit: varchar({ length: 20 }),
	storageLocation: varchar("storage_location", { length: 255 }),
	storageConditions: json("storage_conditions"),
	expirationDate: timestamp("expiration_date", { mode: 'string' }),
	qualityGrade: mysqlEnum("quality_grade", ['premium','standard','economy','research','expired','unknown']).default('unknown'),
	qualityNotes: text("quality_notes"),
	certifications: json(),
	purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }),
	currency: varchar({ length: 3 }).default('EUR'),
	pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }),
	status: mysqlEnum(['available','reserved','in_use','depleted','expired','disposed']).default('available'),
	notes: text(),
	imageUrl: varchar("image_url", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("sample_id").on(table.sampleId),
]);

export const plantTerroirs = mysqlTable("plant_terroirs", {
	id: int().autoincrement().notNull(),
	plantId: int("plant_id").notNull(),
	terroirId: int("terroir_id").notNull(),
	localName: varchar("local_name", { length: 255 }),
	cultivationStart: int("cultivation_start"),
	annualProduction: varchar("annual_production", { length: 100 }),
	qualityNotes: text("quality_notes"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("unique_plant_terroir").on(table.plantId, table.terroirId),
]);

export const plantVarieties = mysqlTable("plant_varieties", {
	id: int().autoincrement().notNull(),
	varietyId: varchar("variety_id", { length: 30 }).notNull(),
	plantId: int("plant_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	latinName: varchar("latin_name", { length: 255 }),
	varietyType: mysqlEnum("variety_type", ['cultivar','chemotype','landrace','hybrid','clone','wild','other']).notNull(),
	breeder: varchar({ length: 255 }),
	yearRegistered: int("year_registered"),
	countryOfOrigin: varchar("country_of_origin", { length: 100 }),
	parentVarieties: json("parent_varieties"),
	distinctiveFeatures: text("distinctive_features"),
	morphology: json(),
	dominantMolecules: json("dominant_molecules"),
	molecularProfile: json("molecular_profile"),
	olfactiveDescription: text("olfactive_description"),
	olfactiveNotes: json("olfactive_notes"),
	yieldPerHectare: varchar("yield_per_hectare", { length: 50 }),
	essentialOilYield: varchar("essential_oil_yield", { length: 50 }),
	harvestPeriod: varchar("harvest_period", { length: 100 }),
	optimalHarvestStage: varchar("optimal_harvest_stage", { length: 100 }),
	commercialAvailability: mysqlEnum("commercial_availability", ['widely_available','limited','rare','research_only','extinct','unknown']).default('unknown'),
	suppliers: json(),
	notes: text(),
	references: json(),
	imageUrl: varchar("image_url", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	conservationStatus: mysqlEnum("conservation_status", ['critical','endangered','vulnerable','near_threatened','stable','data_deficient','unknown']).default('unknown'),
	conservationNotes: text("conservation_notes"),
	threatFactors: json("threat_factors"),
	conservationEfforts: text("conservation_efforts"),
	lastAssessmentDate: timestamp("last_assessment_date", { mode: 'string' }),
},
(table) => [
	index("variety_id").on(table.varietyId),
]);

export const plants = mysqlTable("plants", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	latinName: varchar("latin_name", { length: 255 }),
	family: varchar({ length: 100 }),
	category: mysqlEnum(['aromatique','tabac','cannabis','resine','bois','fleur','racine','autre']).notNull(),
	origin: varchar({ length: 255 }),
	habitat: text(),
	olfactiveSignature: text("olfactive_signature"),
	dominantMolecules: text("dominant_molecules"),
	chemotypes: text(),
	climaticAxis: mysqlEnum("climatic_axis", ['vent','bois','disparition','vent_bois','bois_disparition','vent_disparition']),
	traditionalUse: text("traditional_use"),
	absorbeUse: text("absorbe_use"),
	botanicalStates: json("botanical_states"),
	notes: text(),
	imageUrl: varchar("image_url", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	kingdom: varchar({ length: 50 }).default('Plantae'),
	division: varchar({ length: 100 }),
	class: varchar({ length: 100 }),
	orderName: varchar("order_name", { length: 100 }),
	genus: varchar({ length: 100 }),
	species: varchar({ length: 100 }),
	subspecies: varchar({ length: 100 }),
	morphology: json(),
	lifeCycle: mysqlEnum("life_cycle", ['annual','biennial','perennial','variable']).default('perennial'),
	growthConditions: json("growth_conditions"),
	harvestPeriod: varchar("harvest_period", { length: 100 }),
	optimalHarvestStage: varchar("optimal_harvest_stage", { length: 100 }),
	yieldPerHectare: varchar("yield_per_hectare", { length: 100 }),
	essentialOilYield: varchar("essential_oil_yield", { length: 50 }),
	storageDuration: varchar("storage_duration", { length: 100 }),
	storageConditions: text("storage_conditions"),
	certifications: json(),
	citesAppendix: mysqlEnum("cites_appendix", ['I','II','III','NONE','UNKNOWN']),
	conservationNotes: text("conservation_notes"),
	threatFactors: json("threat_factors"),
	sustainableAlternatives: text("sustainable_alternatives"),
	lastAssessmentYear: int("last_assessment_year"),
	historicalStatus: varchar("historical_status", { length: 32 }),
	conservationStatus: mysqlEnum("conservation_status", ['EX','EW','CR','EN','VU','NT','LC','DD','NE']).default('NE'),
	latitude: decimal({ precision: 10, scale: 7 }),
	longitude: decimal({ precision: 10, scale: 7 }),
},
(table) => [
	index("idx_plants_cites_appendix").on(table.citesAppendix),
	index("idx_plants_last_assessment_year").on(table.lastAssessmentYear),
]);

export const projetsArtistiques = mysqlTable("projets_artistiques", {
	id: int().autoincrement().notNull(),
	nom: varchar({ length: 255 }).notNull(),
	code: varchar({ length: 50 }),
	type: mysqlEnum(['terrain','installation','performance','exposition','collaboration','recherche','autre']).notNull(),
	lieu: varchar({ length: 255 }),
	altitude: int(),
	dateDebut: timestamp("date_debut", { mode: 'string' }),
	dateFin: timestamp("date_fin", { mode: 'string' }),
	description: text(),
	contexte: text(),
	odeurDominante: text("odeur_dominante"),
	activation: text(),
	documentation: text(),
	couchesActivees: text("couches_activees"),
	statut: mysqlEnum(['planifie','en_cours','realise','archive']).default('planifie').notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const prototypeChemicalFamilies = mysqlTable("prototype_chemical_families", {
	prototypeId: int().notNull().references(() => prototypes.id, { onDelete: "cascade" } ),
	chemicalFamilyId: int().notNull().references(() => chemicalFamilies.id, { onDelete: "cascade" } ),
	dominance: mysqlEnum(['primary','secondary','tertiary']).default('secondary'),
});

export const prototypeLaboratoire = mysqlTable("prototype_laboratoire", {
	prototypeId: int().notNull().references(() => prototypes.id),
	laboratoireId: int().notNull().references(() => laboratoire.id),
});

export const prototypeMolecules = mysqlTable("prototype_molecules", {
	prototypeId: int().notNull().references(() => prototypes.id),
	moleculeId: int().notNull().references(() => molecules.id),
});

export const prototypes = mysqlTable("prototypes", {
	id: int().autoincrement().notNull(),
	code: varchar({ length: 10 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	emoji: varchar({ length: 10 }),
	conceptualAxis: text(),
	sensoryForm: text(),
	olfactiveFamily: text(),
	preferredSupport: varchar({ length: 100 }),
	keyEmotion: text(),
	overview: text(),
	composition: text(),
	conceptualReflection: text(),
	installation: text(),
	technicalDevelopment: text(),
	theoreticalScope: text(),
	color: varchar({ length: 20 }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("prototypes_code_unique").on(table.code),
]);

export const rawMaterialMolecules = mysqlTable("raw_material_molecules", {
	id: int().autoincrement().notNull(),
	rawMaterialId: int("raw_material_id").notNull().references(() => rawMaterials.id, { onDelete: "cascade" } ),
	moleculeId: int("molecule_id").notNull().references(() => molecules.id, { onDelete: "cascade" } ),
	percentage: decimal({ precision: 5, scale: 2 }),
	isSignature: int("is_signature").default(0),
	variability: varchar({ length: 50 }),
	notes: text(),
});

export const rawMaterials = mysqlTable("raw_materials", {
	id: int().autoincrement().notNull(),
	materialId: varchar("material_id", { length: 30 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	latinName: varchar("latin_name", { length: 255 }),
	category: mysqlEnum(['huile_essentielle','absolue','concrete','resinoid','teinture','co2_extract','hydrolat','beurre','cire','oleoresine','infusion','maceration','distillat','autre']).notNull(),
	plantId: int("plant_id").references(() => plants.id, { onDelete: "cascade" } ),
	plantPart: mysqlEnum("plant_part", ['fleur','feuille','tige','racine','ecorce','bois','resine','graine','fruit','zeste','plante_entiere','bourgeon','autre']),
	terroirId: int("terroir_id").references(() => terroirs.id, { onDelete: "cascade" } ),
	originCountry: varchar("origin_country", { length: 100 }),
	originRegion: varchar("origin_region", { length: 255 }),
	extractionMethodId: int("extraction_method_id").references(() => extractionMethods.id),
	extractionYield: decimal("extraction_yield", { precision: 5, scale: 3 }),
	extractionNotes: text("extraction_notes"),
	olfactiveFamily: mysqlEnum("olfactive_family", ['floral','boise','agrume','epice','herbace','balsamique','musque','animal','vert','fruité','marin','terreux','fumé','gourmand','aromatique','autre']),
	olfactiveProfile: text("olfactive_profile"),
	topNotes: text("top_notes"),
	heartNotes: text("heart_notes"),
	baseNotes: text("base_notes"),
	intensity: int(),
	tenacity: int(),
	dominantMolecules: json("dominant_molecules"),
	quality: mysqlEnum(['conventionnel','bio','sauvage','biodynamique','aop','igp','fair_trade']),
	certifications: json(),
	ifraCategory: varchar("ifra_category", { length: 50 }),
	maxUsageLevel: decimal("max_usage_level", { precision: 5, scale: 2 }),
	restrictions: text(),
	allergens: json(),
	priceRange: mysqlEnum("price_range", ['economique','standard','premium','luxe','rare']),
	availability: mysqlEnum(['disponible','saisonnier','rare','en_rupture','discontinue']),
	suppliers: json(),
	usageNotes: text("usage_notes"),
	blendingTips: text("blending_tips"),
	synergies: json(),
	imageUrl: varchar("image_url", { length: 500 }),
	refs: json(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
	references: json(),
},
(table) => [
	index("material_id").on(table.materialId),
]);

export const recetteMolecules = mysqlTable("recette_molecules", {
	id: int().autoincrement().notNull(),
	recetteId: int("recette_id").notNull().references(() => recettes.id, { onDelete: "cascade" } ),
	moleculeId: int("molecule_id").notNull().references(() => molecules.id, { onDelete: "cascade" } ),
	proportion: int(),
	role: varchar({ length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("unique_recette_molecule").on(table.recetteId, table.moleculeId),
]);

export const recetteTabacAssociations = mysqlTable("recette_tabac_associations", {
	id: int().autoincrement().notNull(),
	recetteId: int("recette_id").notNull().references(() => recettes.id, { onDelete: "cascade" } ),
	tabacId: int("tabac_id").notNull().references(() => tabacs.id, { onDelete: "cascade" } ),
	compatibility: int().notNull(),
	proportion: varchar({ length: 50 }),
	synergies: text(),
	notes: text(),
	recommended: int().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("unique_recette_tabac").on(table.recetteId, table.tabacId),
]);

export const recettes = mysqlTable("recettes", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	category: mysqlEnum(['tabac','resine','resine_cbd','cone','parfum','encens','extrait']).notNull(),
	familyId: int().references(() => families.id),
	accordId: int().references(() => accords.id),
	tabacId: int().references(() => tabacs.id),
	civilisationId: int().references(() => traditionsOlfactives.id),
	formula: text(),
	protocol: text(),
	intensity: int(),
	stability: mysqlEnum(['low','medium','high']),
	combustionTemperature: int(),
	maturationTime: int(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	description: text(),
	ingredients: text(),
	notes: text(),
	texture: varchar({ length: 100 }),
	costEstimate: int(),
	productionTime: int(),
	status: mysqlEnum(['experimental','testing','validated','production']).default('experimental'),
	notesTete: text("notes_tete"),
	notesCoeur: text("notes_coeur"),
	notesFond: text("notes_fond"),
	dureeTeteMin: int("duree_tete_min").default(15),
	dureeCoeurMin: int("duree_coeur_min").default(45),
	dureeFondMin: int("duree_fond_min").default(120),
	parentRecetteId: int("parent_recette_id"),
	gamme: varchar({ length: 100 }),
});

export const recettesFormulesReference = mysqlTable("recettes_formules_reference", {
	id: int().autoincrement().notNull(),
	recetteId: int("recette_id").notNull().references(() => recettes.id, { onDelete: "cascade" } ),
	formuleReferenceName: varchar("formule_reference_name", { length: 255 }).notNull(),
	formuleReferenceFamily: varchar("formule_reference_family", { length: 100 }).notNull(),
	similarityScore: int("similarity_score").notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("unique_recette_formule").on(table.recetteId, table.formuleReferenceName),
	index("idx_recette_formule").on(table.recetteId),
]);

export const rechercheRadicale = mysqlTable("recherche_radicale", {
	id: int().autoincrement().notNull(),
	nom: varchar({ length: 255 }).notNull(),
	symbole: varchar({ length: 10 }),
	serie: varchar({ length: 255 }).notNull(),
	concept: text().notNull(),
	noteSpeciale: text("note_speciale"),
	architecture: text().notNull(),
	effet: text().notNull(),
	usageArtistique: text("usage_artistique").notNull(),
	themesConceptuels: text("themes_conceptuels"),
	avertissement: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const recipeVersions = mysqlTable("recipe_versions", {
	id: int().autoincrement().notNull(),
	recetteId: int("recette_id").notNull().references(() => recettes.id, { onDelete: "cascade" } ),
	version: varchar({ length: 50 }).notNull(),
	changes: text(),
	formula: text(),
	protocol: text(),
	author: varchar({ length: 255 }),
	status: mysqlEnum(['draft','testing','validated','production','archived']).default('draft'),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

export const researchAxes = mysqlTable("research_axes", {
	id: int().autoincrement().notNull(),
	axisCode: varchar("axis_code", { length: 20 }).default('').notNull(),
	code: varchar({ length: 10 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	subtitle: varchar({ length: 255 }),
	shortName: varchar("short_name", { length: 50 }).notNull(),
	emoji: varchar({ length: 10 }).notNull(),
	description: text().notNull(),
	objectives: text(),
	methodology: text(),
	keyTopics: text("key_topics"),
	color: varchar({ length: 20 }).notNull(),
	iconName: varchar("icon_name", { length: 50 }),
	sortOrder: int("sort_order").default(0).notNull(),
	isActive: tinyint("is_active").default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	startDate: timestamp("start_date", { mode: 'string' }),
	targetEndDate: timestamp("target_end_date", { mode: 'string' }),
	actualEndDate: timestamp("actual_end_date", { mode: 'string' }),
	progressPercent: int("progress_percent").default(0),
	icon: varchar({ length: 50 }),
	parentAxisId: int("parent_axis_id"),
	tags: json(),
	createdBy: int("created_by"),
	category: mysqlEnum(['fondamental','applique','experimental','theorique','historique','ethnographique','technique']).default('fondamental'),
	status: mysqlEnum(['planifie','en_cours','pause','termine','archive']).default('planifie'),
	priority: mysqlEnum(['haute','moyenne','basse']).default('moyenne'),
},
(table) => [
	index("research_axis_code_idx").on(table.code),
]);

export const researchAxesInnovants = mysqlTable("research_axes_innovants", {
	id: int().autoincrement().notNull(),
	axisCode: varchar("axis_code", { length: 50 }).notNull(),
	titleFr: varchar("title_fr", { length: 300 }).notNull(),
	titleEn: varchar("title_en", { length: 300 }),
	descriptionFr: text("description_fr"),
	descriptionEn: text("description_en"),
	methodologies: json(),
	targetSpecies: json("target_species"),
	partnerships: json(),
	kpis: json(),
	priorityLevel: mysqlEnum("priority_level", ['critical','high','medium','low']).default('medium'),
	status: mysqlEnum(['active','planned','completed','paused']).default('planned'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
(table) => [
	index("axis_code").on(table.axisCode),
]);

export const researchAxisNez = mysqlTable("research_axis_nez", {
	id: int().autoincrement().notNull(),
	axisId: varchar("axis_id", { length: 100 }).notNull(),
	slug: varchar({ length: 200 }).notNull(),
	titleFr: varchar("title_fr", { length: 500 }).notNull(),
	titleEn: varchar("title_en", { length: 500 }).notNull(),
	noveltyTagline: text("novelty_tagline"),
	descriptionFr: text("description_fr"),
	descriptionEn: text("description_en"),
	uiModule: varchar("ui_module", { length: 200 }),
	coreEntities: varchar("core_entities", { length: 500 }),
	kpis: varchar({ length: 500 }),
	defaultFiltersJson: json("default_filters_json"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
(table) => [
	index("axis_id").on(table.axisId),
	index("slug").on(table.slug),
]);

export const researchEntries = mysqlTable("research_entries", {
	id: int().autoincrement().notNull(),
	entryCode: varchar("entry_code", { length: 50 }).default('').notNull(),
	title: varchar({ length: 500 }).notNull(),
	slug: varchar({ length: 500 }).notNull(),
	summary: text(),
	content: text().notNull(),
	entryType: mysqlEnum("entry_type", ['note','synthesis','experiment','observation','hypothesis','discovery','review','methodology','protocol','analysis']).default('note').notNull(),
	status: mysqlEnum(['draft','in_progress','completed','archived']).default('draft').notNull(),
	primaryAxisId: int("primary_axis_id").notNull(),
	importance: mysqlEnum(['low','medium','high','critical']).default('medium').notNull(),
	isPublic: tinyint("is_public").default(0).notNull(),
	isPinned: tinyint("is_pinned").default(0).notNull(),
	researchDate: timestamp("research_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	axisId: int("axis_id").default(0).notNull(),
	entryDate: timestamp("entry_date", { mode: 'string' }),
	attachments: json(),
	bibliographyIds: json("bibliography_ids"),
	linkedMoleculeIds: json("linked_molecule_ids"),
	linkedPlantIds: json("linked_plant_ids"),
	linkedRecetteIds: json("linked_recette_ids"),
	linkedPrototypeIds: json("linked_prototype_ids"),
	tags: json(),
	sortOrder: int("sort_order").default(0),
	createdBy: int("created_by"),
},
(table) => [
	index("research_entry_slug_idx").on(table.slug),
	index("research_entry_axis_idx").on(table.primaryAxisId),
	index("research_entry_type_idx").on(table.entryType),
	index("research_entry_status_idx").on(table.status),
	index("idx_research_entries_code").on(table.entryCode),
]);

export const researchEntryAxes = mysqlTable("research_entry_axes", {
	id: int().autoincrement().notNull(),
	entryId: int("entry_id").notNull(),
	axisId: int("axis_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("entry_axes_unique").on(table.entryId, table.axisId),
	index("entry_axes_entry_idx").on(table.entryId),
	index("entry_axes_axis_idx").on(table.axisId),
]);

export const researchEntrySources = mysqlTable("research_entry_sources", {
	id: int().autoincrement().notNull(),
	entryId: int("entry_id").notNull(),
	sourceId: int("source_id").notNull(),
	citationContext: text("citation_context"),
	pageReference: varchar("page_reference", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("entry_sources_unique").on(table.entryId, table.sourceId),
	index("entry_sources_entry_idx").on(table.entryId),
	index("entry_sources_source_idx").on(table.sourceId),
]);

export const researchEntryTags = mysqlTable("research_entry_tags", {
	id: int().autoincrement().notNull(),
	entryId: int("entry_id").notNull(),
	tagId: int("tag_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("entry_tags_unique").on(table.entryId, table.tagId),
	index("entry_tags_entry_idx").on(table.entryId),
	index("entry_tags_tag_idx").on(table.tagId),
]);

export const researchTags = mysqlTable("research_tags", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 100 }).notNull(),
	slug: varchar({ length: 100 }).notNull(),
	description: text(),
	color: varchar({ length: 20 }),
	category: mysqlEnum(['topic','method','material','region','period','emotion','molecule','plant','technology','other']).default('topic').notNull(),
	usageCount: int("usage_count").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("research_tag_name_idx").on(table.name),
	index("research_tag_slug_idx").on(table.slug),
	index("research_tag_category_idx").on(table.category),
]);

export const researchTimeline = mysqlTable("research_timeline", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	quarter: varchar({ length: 10 }).notNull(),
	year: int().notNull(),
	quarterNumber: int().notNull(),
	phase: mysqlEnum(['foundation','development','expansion','consolidation','innovation']).notNull(),
	category: mysqlEnum(['research','formulation','testing','documentation','infrastructure','collaboration']).notNull(),
	status: mysqlEnum(['planned','in_progress','completed','delayed']).default('planned').notNull(),
	priority: mysqlEnum(['low','medium','high','critical']).default('medium').notNull(),
	deliverables: text(),
	dependencies: text(),
	progress: int().default(0).notNull(),
	startDate: varchar({ length: 10 }),
	endDate: varchar({ length: 10 }),
	completedDate: varchar({ length: 10 }),
	notes: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const sampleImages = mysqlTable("sample_images", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }),
	description: text(),
	url: varchar({ length: 500 }).notNull(),
	fileKey: varchar("file_key", { length: 255 }).notNull(),
	fileName: varchar("file_name", { length: 255 }),
	mimeType: varchar("mime_type", { length: 100 }),
	fileSize: int("file_size"),
	width: int(),
	height: int(),
	leafEconomyId: int("leaf_economy_id"),
	plantId: int("plant_id"),
	category: mysqlEnum(['echantillon','extraction','analyse','terrain','equipement','autre']).default('echantillon'),
	tags: json(),
	capturedAt: timestamp("captured_at", { mode: 'string' }),
	location: varchar({ length: 255 }),
	photographer: varchar({ length: 255 }),
	uploadedBy: int("uploaded_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("sample_images_leaf_economy_idx").on(table.leafEconomyId),
	index("sample_images_plant_idx").on(table.plantId),
	index("sample_images_category_idx").on(table.category),
]);

export const savedFormulas = mysqlTable("saved_formulas", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	radarProfile: json("radar_profile").notNull(),
	suggestions: json().notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("saved_formulas_user_idx").on(table.userId),
]);

export const sensoryScales = mysqlTable("sensory_scales", {
	id: int().autoincrement().notNull(),
	type: mysqlEnum(['axis','family']).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	scale: varchar({ length: 50 }),
	order: int().default(0),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const sharedCollections = mysqlTable("shared_collections", {
	id: int().autoincrement().notNull(),
	token: varchar({ length: 64 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	moleculeIds: text("molecule_ids").notNull(),
	creatorId: int("creator_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	viewCount: int("view_count").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("token").on(table.token),
]);

export const situatedSmells = mysqlTable("situated_smells", {
	id: int().autoincrement().notNull(),
	poeticName: varchar("poetic_name", { length: 255 }).notNull(),
	location: varchar({ length: 255 }).notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
	weather: varchar({ length: 255 }),
	support: text(),
	immediateImpression: text("immediate_impression"),
	triggeredMemory: text("triggered_memory"),
	recreatable: mysqlEnum(['yes','no','maybe']).default('maybe'),
	linkedFieldArchiveId: int("linked_field_archive_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const sourceArticleNez = mysqlTable("source_article_nez", {
	id: int().autoincrement().notNull(),
	sourceId: varchar("source_id", { length: 100 }).notNull(),
	url: varchar({ length: 1000 }).notNull(),
	title: varchar({ length: 500 }).notNull(),
	lang: mysqlEnum(['fr','en']).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	publishedAt: date("published_at", { mode: 'string' }),
	author: varchar({ length: 300 }),
	categories: varchar({ length: 500 }),
	themes: varchar({ length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
(table) => [
	index("source_id").on(table.sourceId),
	index("url").on(table.url),
]);

export const supplierAlternativeLinks = mysqlTable("supplier_alternative_links", {
	id: int().autoincrement().notNull(),
	supplierId: int("supplier_id").notNull(),
	alternativeId: int("alternative_id").notNull(),
	productName: varchar("product_name", { length: 255 }),
	productCode: varchar("product_code", { length: 100 }),
	priceRange: varchar("price_range", { length: 100 }),
	availabilityStatus: mysqlEnum("availability_status", ['in_stock','limited_stock','on_demand','seasonal','out_of_stock']).default('in_stock'),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("supplier_alt_link_supplier_idx").on(table.supplierId),
	index("supplier_alt_link_alternative_idx").on(table.alternativeId),
	index("supplier_alt_link_unique").on(table.supplierId, table.alternativeId),
]);

export const sustainableAlternatives = mysqlTable("sustainable_alternatives", {
	id: int().autoincrement().notNull(),
	threatenedPlantId: int("threatened_plant_id").notNull(),
	threatenedPlantName: varchar("threatened_plant_name", { length: 255 }).notNull(),
	alternativePlantId: int("alternative_plant_id"),
	alternativeName: varchar("alternative_name", { length: 255 }).notNull(),
	alternativeType: mysqlEnum("alternative_type", ['natural_plant','cultivated','synthetic','biotechnology','blend','other']).notNull(),
	olfactiveSimilarity: mysqlEnum("olfactive_similarity", ['identical','very_similar','similar','partial','inspired','different']).default('similar'),
	olfactiveNotes: text("olfactive_notes"),
	availability: mysqlEnum(['widely_available','available','limited','rare','research_only']).default('available'),
	sustainabilityScore: int("sustainability_score"),
	certifications: json(),
	priceComparison: mysqlEnum("price_comparison", ['much_cheaper','cheaper','similar','more_expensive','much_more_expensive']).default('similar'),
	suppliers: json(),
	usageRecommendations: text("usage_recommendations"),
	keyMolecules: json("key_molecules"),
	references: json(),
	notes: text(),
	verified: tinyint().default(0),
	verifiedBy: varchar("verified_by", { length: 255 }),
	verifiedAt: timestamp("verified_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("sustainable_alt_threatened_idx").on(table.threatenedPlantId),
	index("sustainable_alt_type_idx").on(table.alternativeType),
	index("sustainable_alt_availability_idx").on(table.availability),
]);

export const synergies = mysqlTable("synergies", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	tabacId: int("tabac_id").references(() => tabacs.id, { onDelete: "cascade" } ),
	moleculeId: int("molecule_id").references(() => molecules.id, { onDelete: "cascade" } ),
	familleId: int("famille_id"),
	type: mysqlEnum(['potentialisation','stabilisation','transformation','masquage']).notNull(),
	effet: text(),
	notes: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

export const tabacAccords = mysqlTable("tabac_accords", {
	tabacId: int().notNull().references(() => tabacs.id),
	accordId: int().notNull().references(() => accords.id),
});

export const tabacCivilisations = mysqlTable("tabac_civilisations", {
	tabacId: int().notNull().references(() => tabacs.id),
	civilisationId: int().notNull().references(() => traditionsOlfactives.id),
});

export const tabacMolecules = mysqlTable("tabac_molecules", {
	tabacId: int().notNull().references(() => tabacs.id),
	moleculeId: int().notNull().references(() => molecules.id),
});

export const tabacs = mysqlTable("tabacs", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['blond','brun','oriental','experimental']).notNull(),
	origin: varchar({ length: 255 }),
	aromaticProfile: text(),
	intensity: int(),
	idealTemperature: int(),
	internalNotes: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const tastingNotes = mysqlTable("tasting_notes", {
	id: int().autoincrement().notNull(),
	recetteId: int("recette_id").notNull().references(() => recettes.id, { onDelete: "cascade" } ),
	versionId: int("version_id").references(() => recipeVersions.id, { onDelete: "cascade" } ),
	taster: varchar({ length: 255 }),
	date: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
	freshness: int(),
	depth: int(),
	complexity: int(),
	balance: int(),
	persistence: int(),
	originality: int(),
	topNotes: text("top_notes"),
	heartNotes: text("heart_notes"),
	baseNotes: text("base_notes"),
	texture: varchar({ length: 100 }),
	combustionQuality: int("combustion_quality"),
	impressions: text(),
	improvements: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

export const terpProfileMolecules = mysqlTable("terp_profile_molecules", {
	terpProfileId: int("terp_profile_id").notNull().references(() => terpProfiles.id, { onDelete: "cascade" } ),
	moleculeId: int("molecule_id").notNull().references(() => molecules.id, { onDelete: "cascade" } ),
	percentage: decimal({ precision: 5, scale: 2 }),
	notes: text(),
});

export const terpProfilePlants = mysqlTable("terp_profile_plants", {
	terpProfileId: int("terp_profile_id").notNull().references(() => terpProfiles.id, { onDelete: "cascade" } ),
	plantId: int("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" } ),
	notes: text(),
});

export const terpProfiles = mysqlTable("terp_profiles", {
	id: int().autoincrement().notNull(),
	profileId: varchar("profile_id", { length: 20 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	collection: varchar({ length: 100 }).default('San Andrés · Leaf Economies'),
	type: varchar({ length: 100 }).default('Formule analytique'),
	climaticAxis: mysqlEnum("climatic_axis", ['vent','bois','disparition','vent_bois','bois_disparition','vent_disparition','vent_bois_disparition']).notNull(),
	secondaryAxis: mysqlEnum("secondary_axis", ['vent','bois','disparition','none']).default('none'),
	function: text(),
	usage: mysqlEnum(['parfum','encens','espace','parfum_encens','parfum_espace','encens_espace','tous']).default('parfum'),
	level: varchar({ length: 50 }).default('Recherche'),
	plantSources: text("plant_sources"),
	keyMolecules: text("key_molecules"),
	concentrate: json(),
	olfactiveReading: text("olfactive_reading"),
	temporality: mysqlEnum(['rapide','moyenne','longue','tres_courte','variable']).default('moyenne'),
	temporalityDescription: text("temporality_description"),
	recommendedUsage: text("recommended_usage"),
	criticalNotes: text("critical_notes"),
	connections: json(),
	intensity: mysqlEnum(['faible','moyenne','structurelle']).default('moyenne'),
	readability: mysqlEnum(['abstrait','lisible','structure']).default('lisible'),
	nonIdentifiable: int("non_identifiable").default(0),
	radarVent: int("radar_vent").default(50),
	radarBois: int("radar_bois").default(50),
	radarDisparition: int("radar_disparition").default(50),
	radarStructure: int("radar_structure").default(50),
	radarDiffusion: int("radar_diffusion").default(50),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("profile_id").on(table.profileId),
]);

export const terpeneComparisonProfiles = mysqlTable("terpene_comparison_profiles", {
	id: int().autoincrement().notNull(),
	profileId: varchar("profile_id", { length: 50 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	sourceType: mysqlEnum("source_type", ['tabac','cannabis','parfum']).notNull(),
	sourceId: int("source_id"),
	sourceName: varchar("source_name", { length: 255 }),
	myrcene: int().default(0),
	limonene: int().default(0),
	pinene: int().default(0),
	linalool: int().default(0),
	caryophyllene: int().default(0),
	humulene: int().default(0),
	terpinolene: int().default(0),
	ocimene: int().default(0),
	bisabolol: int().default(0),
	geraniol: int().default(0),
	additionalTerpenes: json("additional_terpenes"),
	dominantNote: varchar("dominant_note", { length: 100 }),
	olfactiveDescription: text("olfactive_description"),
	aromaticBridges: json("aromatic_bridges"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("terpene_comparison_source_idx").on(table.sourceType),
	index("profile_id").on(table.profileId),
]);

export const terpeneSynergies = mysqlTable("terpene_synergies", {
	id: int().autoincrement().notNull(),
	terpene1Id: int("terpene1_id").notNull().references(() => molecules.id, { onDelete: "cascade" } ),
	terpene2Id: int("terpene2_id").notNull().references(() => molecules.id, { onDelete: "cascade" } ),
	compatibilityScore: int("compatibility_score").default(50).notNull(),
	synergyNotes: text("synergy_notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
(table) => [
	index("unique_pair").on(table.terpene1Id, table.terpene2Id),
]);

export const terroirSpecialties = mysqlTable("terroir_specialties", {
	id: int().autoincrement().notNull(),
	terroirId: int("terroir_id").notNull().references(() => terroirs.id, { onDelete: "cascade" } ),
	plantId: int("plant_id").references(() => plants.id, { onDelete: "cascade" } ),
	rawMaterialId: int("raw_material_id").references(() => rawMaterials.id),
	isSignature: int("is_signature").default(0),
	importance: mysqlEnum(['majeure','significative','mineure','emergente']),
	annualProduction: varchar("annual_production", { length: 100 }),
	productionTrend: mysqlEnum("production_trend", ['croissante','stable','decroissante','variable']),
	qualityReputation: mysqlEnum("quality_reputation", ['exceptionnelle','excellente','bonne','standard']),
	uniqueCharacteristics: text("unique_characteristics"),
	historicalContext: text("historical_context"),
	traditionSince: varchar("tradition_since", { length: 50 }),
	economicImportance: text("economic_importance"),
	mainBuyers: json("main_buyers"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

export const terroirs = mysqlTable("terroirs", {
	id: int().autoincrement().notNull(),
	terroirId: varchar("terroir_id", { length: 30 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	country: varchar({ length: 100 }).notNull(),
	region: varchar({ length: 255 }),
	subRegion: varchar("sub_region", { length: 255 }),
	latitude: decimal({ precision: 10, scale: 7 }),
	longitude: decimal({ precision: 10, scale: 7 }),
	altitude: varchar({ length: 50 }),
	climateType: mysqlEnum("climate_type", ['tropical','subtropical','mediterranean','oceanic','continental','arid','semi_arid','alpine','equatorial','other']),
	avgTemperature: varchar("avg_temperature", { length: 50 }),
	annualRainfall: varchar("annual_rainfall", { length: 50 }),
	humidity: varchar({ length: 50 }),
	soilType: mysqlEnum("soil_type", ['clay','sandy','loamy','chalky','volcanic','alluvial','peaty','rocky','mixed','other']),
	soilPh: varchar("soil_ph", { length: 20 }),
	soilCharacteristics: text("soil_characteristics"),
	mainCrops: json("main_crops"),
	productionHistory: text("production_history"),
	annualProduction: varchar("annual_production", { length: 100 }),
	certifications: json(),
	qualityRating: mysqlEnum("quality_rating", ['exceptional','excellent','good','standard','variable','unknown']).default('unknown'),
	reputation: text(),
	notes: text(),
	imageUrl: varchar("image_url", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("terroir_id").on(table.terroirId),
]);

export const tobaccoFormulaInstallations = mysqlTable("tobacco_formula_installations", {
	tobaccoFormulaId: int().notNull().references(() => tobaccoFormulas.id, { onDelete: "cascade" } ),
	installationId: int().notNull().references(() => installations.id, { onDelete: "cascade" } ),
});

export const tobaccoFormulas = mysqlTable("tobacco_formulas", {
	id: int().autoincrement().notNull(),
	code: varchar({ length: 20 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	olfactiveFamily: varchar({ length: 255 }),
	inspiration: text(),
	composition: text(),
	procedure: text(),
	cureConditions: text(),
	observations: text(),
	suggestedUse: text(),
	effect: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("code").on(table.code),
]);

export const traditionsOlfactives = mysqlTable("traditions_olfactives", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	region: varchar({ length: 255 }),
	symbolicMaterials: text(),
	signatureAccordId: int().references(() => accords.id),
	longDescription: text(),
	temporality: mysqlEnum(['archaic','antique','medieval','abyssal','futuristic']),
	bibliographicReferences: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export type TraditionOlfactive = typeof traditionsOlfactives.$inferSelect;
export type InsertTraditionOlfactive = typeof traditionsOlfactives.$inferInsert;
export const userFavorites = mysqlTable("user_favorites", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	moleculeId: int("molecule_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("unique_user_molecule").on(table.userId, table.moleculeId),
]);

export const userNotes = mysqlTable("user_notes", {
	id: int().autoincrement().notNull(),
	entityType: varchar("entity_type", { length: 50 }).notNull(),
	entityId: int("entity_id").notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
(table) => [
	index("idx_entity").on(table.entityType, table.entityId),
]);

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	openId: varchar({ length: 64 }).notNull(),
	name: text(),
	email: varchar({ length: 320 }),
	loginMethod: varchar({ length: 64 }),
	role: mysqlEnum(['user','admin']).default('user').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	lastSignedIn: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("users_openId_unique").on(table.openId),
]);

export const varietyGenealogy = mysqlTable("variety_genealogy", {
	id: int().autoincrement().notNull(),
	varietyId: int("variety_id").notNull(),
	parentVarietyId: int("parent_variety_id").notNull(),
	relationshipType: mysqlEnum("relationship_type", ['parent','hybrid','clone','mutation']).default('parent').notNull(),
	crossDate: int("cross_date"),
	breeder: varchar({ length: 255 }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("variety_genealogy_variety_idx").on(table.varietyId),
	index("variety_genealogy_parent_idx").on(table.parentVarietyId),
]);

export const varietyHistoricalRecords = mysqlTable("variety_historical_records", {
	id: int().autoincrement().notNull(),
	recordId: varchar("record_id", { length: 30 }).notNull(),
	varietyId: int("variety_id").notNull(),
	recordType: mysqlEnum("record_type", ['botanical_description','trade_record','agricultural_manual','pharmacopoeia','herbarium_specimen','artistic_depiction','travel_account','scientific_paper','patent','oral_tradition','other']).notNull(),
	dateCreated: varchar("date_created", { length: 100 }),
	yearEstimate: int("year_estimate"),
	location: varchar({ length: 255 }),
	country: varchar({ length: 100 }),
	region: varchar({ length: 255 }),
	title: varchar({ length: 500 }).notNull(),
	author: varchar({ length: 255 }),
	content: text(),
	originalLanguage: varchar("original_language", { length: 50 }),
	historicalName: varchar("historical_name", { length: 255 }),
	synonyms: json(),
	descriptionExcerpt: text("description_excerpt"),
	mentionedCharacteristics: json("mentioned_characteristics"),
	authenticityLevel: mysqlEnum("authenticity_level", ['original','copy','transcription','reconstruction']).default('transcription').notNull(),
	reliabilityScore: int("reliability_score"),
	sourceUrl: varchar("source_url", { length: 500 }),
	archiveLocation: varchar("archive_location", { length: 255 }),
	catalogNumber: varchar("catalog_number", { length: 100 }),
	imageUrl: varchar("image_url", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("vhr_variety_idx").on(table.varietyId),
	index("vhr_type_idx").on(table.recordType),
	index("vhr_year_idx").on(table.yearEstimate),
	index("record_id").on(table.recordId),
]);

export const varietyMolecularProfiles = mysqlTable("variety_molecular_profiles", {
	id: int().autoincrement().notNull(),
	profileId: varchar("profile_id", { length: 30 }).notNull(),
	varietyId: int("variety_id").notNull(),
	historicalPeriod: mysqlEnum("historical_period", ['prehistoric','ancient','medieval','renaissance','enlightenment','industrial','modern','contemporary']).notNull(),
	yearEstimate: int("year_estimate"),
	yearRangeStart: int("year_range_start"),
	yearRangeEnd: int("year_range_end"),
	sourceType: mysqlEnum("source_type", ['archaeological','historical_text','herbarium','genetic_analysis','reconstruction','contemporary_sample']).notNull(),
	sourceDescription: text("source_description"),
	sourceReferences: json("source_references"),
	molecularComposition: json("molecular_composition"),
	terpeneProfile: json("terpene_profile"),
	olfactiveDescription: text("olfactive_description"),
	olfactiveNotes: json("olfactive_notes"),
	confidenceLevel: mysqlEnum("confidence_level", ['confirmed','probable','hypothetical','speculative']).default('probable').notNull(),
	modernComparisonNotes: text("modern_comparison_notes"),
	divergenceScore: int("divergence_score"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("vmp_variety_idx").on(table.varietyId),
	index("vmp_period_idx").on(table.historicalPeriod),
	index("profile_id").on(table.profileId),
]);

export const verifiedSuppliers = mysqlTable("verified_suppliers", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	companyType: mysqlEnum("company_type", ['producer','cooperative','distributor','laboratory','biotechnology','artisan','other']).notNull(),
	country: varchar({ length: 100 }).notNull(),
	region: varchar({ length: 255 }),
	address: text(),
	website: varchar({ length: 500 }),
	email: varchar({ length: 255 }),
	phone: varchar({ length: 50 }),
	contactPerson: varchar("contact_person", { length: 255 }),
	certifications: json(),
	specialties: json(),
	sustainablePractices: text("sustainable_practices"),
	sustainabilityRating: int("sustainability_rating"),
	qualityRating: int("quality_rating"),
	reliabilityRating: int("reliability_rating"),
	minimumOrderQuantity: varchar("minimum_order_quantity", { length: 100 }),
	leadTime: varchar("lead_time", { length: 100 }),
	paymentTerms: varchar("payment_terms", { length: 255 }),
	shipsTo: json("ships_to"),
	verified: tinyint().default(0),
	verifiedBy: varchar("verified_by", { length: 255 }),
	verifiedAt: timestamp("verified_at", { mode: 'string' }),
	lastContactDate: timestamp("last_contact_date", { mode: 'string' }),
	notes: text(),
	supplierReferences: json("supplier_references"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("verified_suppliers_country_idx").on(table.country),
	index("verified_suppliers_type_idx").on(table.companyType),
	index("verified_suppliers_verified_idx").on(table.verified),
]);

export const volcanique = mysqlTable("volcanique", {
	id: int().autoincrement().notNull(),
	variation: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['basalte_chaud','basalte_froid','vapeur','soufre','poussiere_tectonique','magma_blanc','pierre_poreuse']).notNull(),
	description: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const volcaniqueExperimentalAccords = mysqlTable("volcanique_experimental_accords", {
	volcaniqueId: int().notNull().references(() => volcanique.id, { onDelete: "cascade" } ),
	experimentalAccordId: int().notNull().references(() => experimentalAccords.id, { onDelete: "cascade" } ),
});

export const volcaniqueMolecules = mysqlTable("volcanique_molecules", {
	volcaniqueId: int().notNull().references(() => volcanique.id),
	moleculeId: int().notNull().references(() => molecules.id),
});

export const volcaniqueRecettes = mysqlTable("volcanique_recettes", {
	volcaniqueId: int().notNull().references(() => volcanique.id),
	recetteId: int().notNull().references(() => recettes.id),
});

export const volcaniqueTabacs = mysqlTable("volcanique_tabacs", {
	volcaniqueId: int().notNull().references(() => volcanique.id),
	tabacId: int().notNull().references(() => tabacs.id),
});


// ============================================================================
// PERFUMUM RESEARCH AXES (6 axes de recherche PERFUMUM)
// ============================================================================
/**
 * Les 6 axes de recherche PERFUMUM:
 * AX1: Génomique olfactive et conservation ex-situ
 * AX2: Ethnobotanique computationnelle
 * AX3: Chimie analytique trans-époques
 * AX4: Biotechnologies de conservation
 * AX5: Technologies immersives et démocratisation
 * AX6: Diplomatie olfactive et soft power culturel
 */
export const perfumumResearchAxes = mysqlTable("perfumum_research_axes", {
  id: int("id").autoincrement().primaryKey(),
  axisId: varchar("axis_id", { length: 50 }).notNull().unique(), // AX1_GENOMIC_CONSERVATION, etc.
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  titleFr: varchar("title_fr", { length: 255 }).notNull(),
  titleEn: varchar("title_en", { length: 255 }),
  taglineFr: text("tagline_fr"),
  taglineEn: text("tagline_en"),
  descriptionFr: text("description_fr"),
  descriptionEn: text("description_en"),
  defaultLayout: varchar("default_layout", { length: 255 }),
  status: mysqlEnum("status", ["draft", "mvp", "active", "archived"]).default("draft"),
  color: varchar("color", { length: 20 }).default("#6366f1"),
  icon: varchar("icon", { length: 50 }),
  sortOrder: int("sort_order").default(0),
  // KPIs et métriques
  kpis: json("kpis"),
  // Modules UI associés
  uiModules: json("ui_modules").default(sql`(JSON_ARRAY())`),
  // Entités principales
  coreEntities: json("core_entities").default(sql`(JSON_ARRAY())`),
  // Filtres par défaut
  defaultFilters: json("default_filters").default(sql`(JSON_OBJECT())`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex("pra_slug_idx").on(table.slug),
  statusIdx: index("pra_status_idx").on(table.status),
}));

export type PerfumumResearchAxis = typeof perfumumResearchAxes.$inferSelect;
export type InsertPerfumumResearchAxis = typeof perfumumResearchAxes.$inferInsert;

// ============================================================================
// GENOME SAMPLES (Échantillons génomiques - AX1)
// ============================================================================
export const genomeSamples = mysqlTable("genome_samples", {
  id: int("id").autoincrement().primaryKey(),
  sampleId: varchar("sample_id", { length: 50 }).notNull().unique(),
  plantLatinName: varchar("plant_latin_name", { length: 255 }).notNull(),
  populationCode: varchar("population_code", { length: 50 }),
  region: varchar("region", { length: 100 }).notNull(),
  collectionMethod: mysqlEnum("collection_method", [
    "pollen", "fallen_leaf", "seed", "tissue", "herbarium_clip", "other"
  ]).notNull(),
  nonDestructive: boolean("non_destructive").default(true),
  dateCollected: date("date_collected"),
  storage: mysqlEnum("storage", [
    "silica_gel", "-20C", "-80C", "LN2", "room_temp", "unknown"
  ]).default("unknown"),
  permitRef: varchar("permit_ref", { length: 100 }),
  metadata: json("metadata").default(sql`(JSON_OBJECT())`),
  notes: text("notes"),
  // Liens
  axisId: varchar("axis_id", { length: 50 }).default("AX1_GENOMIC_CONSERVATION"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  sampleIdIdx: uniqueIndex("gs_sample_id_idx").on(table.sampleId),
  plantIdx: index("gs_plant_idx").on(table.plantLatinName),
  regionIdx: index("gs_region_idx").on(table.region),
}));

export type GenomeSample = typeof genomeSamples.$inferSelect;
export type InsertGenomeSample = typeof genomeSamples.$inferInsert;

// ============================================================================
// GENOME SEQUENCES (Séquences génomiques - AX1)
// ============================================================================
export const genomeSequences = mysqlTable("genome_sequences", {
  id: int("id").autoincrement().primaryKey(),
  sequenceId: varchar("sequence_id", { length: 50 }).notNull().unique(),
  sampleId: varchar("sample_id", { length: 50 }).notNull(),
  geneTarget: varchar("gene_target", { length: 100 }), // TPS, PAL, etc.
  sequenceType: mysqlEnum("sequence_type", [
    "whole_genome", "transcriptome", "amplicon", "targeted"
  ]).default("targeted"),
  platform: varchar("platform", { length: 100 }), // Illumina, Nanopore, etc.
  coverage: int("coverage"),
  qualityScore: int("quality_score"),
  accessionNumber: varchar("accession_number", { length: 50 }), // GenBank, etc.
  depositDate: date("deposit_date"),
  dataFile: varchar("data_file", { length: 500 }),
  notes: text("notes"),
  axisId: varchar("axis_id", { length: 50 }).default("AX1_GENOMIC_CONSERVATION"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  sequenceIdIdx: uniqueIndex("gseq_id_idx").on(table.sequenceId),
  sampleIdIdx: index("gseq_sample_idx").on(table.sampleId),
}));

export type GenomeSequence = typeof genomeSequences.$inferSelect;
export type InsertGenomeSequence = typeof genomeSequences.$inferInsert;

// ============================================================================
// MANUSCRIPTS (Manuscrits historiques - AX2)
// ============================================================================
export const perfumumManuscripts = mysqlTable("perfumum_manuscripts", {
  id: int("id").autoincrement().primaryKey(),
  manuscriptId: varchar("manuscript_id", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  language: varchar("language", { length: 100 }),
  dateRange: varchar("date_range", { length: 50 }), // "1600-1700"
  repository: varchar("repository", { length: 255 }),
  region: varchar("region", { length: 100 }),
  license: mysqlEnum("license", [
    "CC-BY", "CC-BY-SA", "CC0", "All-rights-reserved", "Unknown"
  ]).default("Unknown"),
  scanUrl: varchar("scan_url", { length: 500 }),
  ocrStatus: mysqlEnum("ocr_status", [
    "queued", "in_progress", "completed", "failed", "manual"
  ]).default("queued"),
  tags: json("tags").default(sql`(JSON_ARRAY())`),
  notes: text("notes"),
  axisId: varchar("axis_id", { length: 50 }).default("AX2_ETHNOBOTANY_COMP"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  manuscriptIdIdx: uniqueIndex("pm_id_idx").on(table.manuscriptId),
  regionIdx: index("pm_region_idx").on(table.region),
}));

export type PerfumumManuscript = typeof perfumumManuscripts.$inferSelect;
export type InsertPerfumumManuscript = typeof perfumumManuscripts.$inferInsert;

// ============================================================================
// TEXT FRAGMENTS (Fragments annotés - AX2)
// ============================================================================
export const textFragments = mysqlTable("text_fragments", {
  id: int("id").autoincrement().primaryKey(),
  fragmentId: varchar("fragment_id", { length: 50 }).notNull().unique(),
  manuscriptId: varchar("manuscript_id", { length: 50 }).notNull(),
  language: varchar("language", { length: 100 }),
  originalText: text("original_text"),
  translationFr: text("translation_fr"),
  translationEn: text("translation_en"),
  entities: json("entities"),
  evidenceLevel: mysqlEnum("evidence_level", [
    "confirmed", "probable", "hypothetical"
  ]).default("hypothetical"),
  notes: text("notes"),
  axisId: varchar("axis_id", { length: 50 }).default("AX2_ETHNOBOTANY_COMP"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  fragmentIdIdx: uniqueIndex("tf_id_idx").on(table.fragmentId),
  manuscriptIdx: index("tf_manuscript_idx").on(table.manuscriptId),
}));

export type TextFragment = typeof textFragments.$inferSelect;
export type InsertTextFragment = typeof textFragments.$inferInsert;

// ============================================================================
// HERBARIUM SAMPLES (Échantillons d'herbier - AX3)
// ============================================================================
export const perfumumHerbariumSamples = mysqlTable("perfumum_herbarium_samples", {
  id: int("id").autoincrement().primaryKey(),
  herbariumId: varchar("herbarium_id", { length: 50 }).notNull().unique(),
  plantLatinName: varchar("plant_latin_name", { length: 255 }).notNull(),
  year: int("year"),
  collection: varchar("collection", { length: 255 }),
  repository: varchar("repository", { length: 255 }),
  sampleType: mysqlEnum("sample_type", [
    "pressed_leaf", "flower", "seed", "bark", "root", "whole_plant"
  ]).default("pressed_leaf"),
  allowedSampling: boolean("allowed_sampling").default(false),
  notes: text("notes"),
  axisId: varchar("axis_id", { length: 50 }).default("AX3_ANALYTICAL_TRANS_EPOCH"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  herbariumIdIdx: uniqueIndex("phs_id_idx").on(table.herbariumId),
  plantIdx: index("phs_plant_idx").on(table.plantLatinName),
  yearIdx: index("phs_year_idx").on(table.year),
}));

export type PerfumumHerbariumSample = typeof perfumumHerbariumSamples.$inferSelect;
export type InsertPerfumumHerbariumSample = typeof perfumumHerbariumSamples.$inferInsert;

// ============================================================================
// GCMS RUNS (Analyses GC-MS - AX3)
// ============================================================================
export const perfumumGcmsRuns = mysqlTable("perfumum_gcms_runs", {
  id: int("id").autoincrement().primaryKey(),
  runId: varchar("run_id", { length: 50 }).notNull().unique(),
  sampleRef: varchar("sample_ref", { length: 50 }).notNull(),
  method: mysqlEnum("method", [
    "GC-MS", "GC-MS/MS", "HS-SPME-GC-MS", "LC-MS", "Other"
  ]).notNull(),
  instrument: varchar("instrument", { length: 255 }),
  runDate: date("run_date"),
  standards: json("standards").default(sql`(JSON_ARRAY())`),
  topCompounds: json("top_compounds"),
  dataFile: varchar("data_file", { length: 500 }),
  notes: text("notes"),
  axisId: varchar("axis_id", { length: 50 }).default("AX3_ANALYTICAL_TRANS_EPOCH"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  runIdIdx: uniqueIndex("pgr_id_idx").on(table.runId),
  sampleRefIdx: index("pgr_sample_idx").on(table.sampleRef),
}));

export type PerfumumGcmsRun = typeof perfumumGcmsRuns.$inferSelect;
export type InsertPerfumumGcmsRun = typeof perfumumGcmsRuns.$inferInsert;

// ============================================================================
// TISSUE CULTURE LINES (Lignées de culture - AX4)
// ============================================================================
export const tissueCultureLines = mysqlTable("tissue_culture_lines", {
  id: int("id").autoincrement().primaryKey(),
  lineId: varchar("line_id", { length: 50 }).notNull().unique(),
  plantLatinName: varchar("plant_latin_name", { length: 255 }).notNull(),
  origin: varchar("origin", { length: 255 }),
  method: mysqlEnum("method", [
    "meristem", "callus", "somatic_embryo", "protoplast", "other"
  ]).default("meristem"),
  status: mysqlEnum("status", [
    "active", "dormant", "cryopreserved", "lost", "distributed"
  ]).default("active"),
  storage: mysqlEnum("storage", [
    "in_vitro", "-20C", "-80C", "LN2", "field"
  ]).default("in_vitro"),
  notes: text("notes"),
  axisId: varchar("axis_id", { length: 50 }).default("AX4_CONSERVATION_BIOTECH"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  lineIdIdx: uniqueIndex("tcl_id_idx").on(table.lineId),
  plantIdx: index("tcl_plant_idx").on(table.plantLatinName),
  statusIdx: index("tcl_status_idx").on(table.status),
}));

export type TissueCultureLine = typeof tissueCultureLines.$inferSelect;
export type InsertTissueCultureLine = typeof tissueCultureLines.$inferInsert;

// ============================================================================
// FERMENTATION RUNS (Fermentations biotechnologiques - AX4)
// ============================================================================
export const perfumumFermentationRuns = mysqlTable("perfumum_fermentation_runs", {
  id: int("id").autoincrement().primaryKey(),
  runId: varchar("run_id", { length: 50 }).notNull().unique(),
  targetMolecule: varchar("target_molecule", { length: 255 }).notNull(),
  host: mysqlEnum("host", [
    "S_cerevisiae", "E_coli", "Y_lipolytica", "Other"
  ]).notNull(),
  geneSource: varchar("gene_source", { length: 255 }),
  bioreactorL: decimal("bioreactor_l", { precision: 10, scale: 2 }),
  yieldGL: decimal("yield_g_l", { precision: 10, scale: 4 }),
  purityPercent: decimal("purity_percent", { precision: 5, scale: 2 }),
  notes: text("notes"),
  axisId: varchar("axis_id", { length: 50 }).default("AX4_CONSERVATION_BIOTECH"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  runIdIdx: uniqueIndex("pfr_id_idx").on(table.runId),
  moleculeIdx: index("pfr_molecule_idx").on(table.targetMolecule),
}));

export type PerfumumFermentationRun = typeof perfumumFermentationRuns.$inferSelect;
export type InsertPerfumumFermentationRun = typeof perfumumFermentationRuns.$inferInsert;

// ============================================================================
// VR SCENES (Scènes VR immersives - AX5)
// ============================================================================
export const vrScenes = mysqlTable("vr_scenes", {
  id: int("id").autoincrement().primaryKey(),
  sceneId: varchar("scene_id", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  era: varchar("era", { length: 100 }),
  location: varchar("location", { length: 255 }),
  assets: json("assets").default(sql`(JSON_ARRAY())`),
  scentCues: json("scent_cues"),
  hardware: varchar("hardware", { length: 255 }),
  notes: text("notes"),
  axisId: varchar("axis_id", { length: 50 }).default("AX5_IMMERSIVE_DEMOCRAT"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  sceneIdIdx: uniqueIndex("vrs_id_idx").on(table.sceneId),
}));

export type VrScene = typeof vrScenes.$inferSelect;
export type InsertVrScene = typeof vrScenes.$inferInsert;

// ============================================================================
// CITIZEN OBSERVATIONS (Observations citoyennes - AX5)
// ============================================================================
export const citizenObservations = mysqlTable("citizen_observations", {
  id: int("id").autoincrement().primaryKey(),
  obsId: varchar("obs_id", { length: 50 }).notNull().unique(),
  userHandle: varchar("user_handle", { length: 100 }),
  plantGuess: varchar("plant_guess", { length: 255 }),
  lat: decimal("lat", { precision: 10, scale: 6 }),
  lon: decimal("lon", { precision: 10, scale: 6 }),
  obsDate: date("obs_date"),
  photoUrl: varchar("photo_url", { length: 500 }),
  confidenceAi: decimal("confidence_ai", { precision: 3, scale: 2 }),
  status: mysqlEnum("status", [
    "submitted", "pending_review", "verified", "rejected"
  ]).default("submitted"),
  notes: text("notes"),
  axisId: varchar("axis_id", { length: 50 }).default("AX5_IMMERSIVE_DEMOCRAT"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  obsIdIdx: uniqueIndex("co_id_idx").on(table.obsId),
  statusIdx: index("co_status_idx").on(table.status),
}));

export type CitizenObservation = typeof citizenObservations.$inferSelect;
export type InsertCitizenObservation = typeof citizenObservations.$inferInsert;

// ============================================================================
// PARTNER INSTITUTIONS (Partenaires institutionnels - AX6)
// ============================================================================
export const partnerInstitutions = mysqlTable("partner_institutions", {
  id: int("id").autoincrement().primaryKey(),
  partnerId: varchar("partner_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }),
  type: mysqlEnum("type", [
    "university", "research_institute", "botanic_garden", "museum",
    "industry", "ngo", "government", "other"
  ]).default("other"),
  focus: json("focus").default(sql`(JSON_ARRAY())`),
  contact: varchar("contact", { length: 255 }),
  mouStatus: mysqlEnum("mou_status", [
    "idea", "discussion", "draft", "signed", "active", "expired"
  ]).default("idea"),
  notes: text("notes"),
  axisId: varchar("axis_id", { length: 50 }).default("AX6_OLFACTIVE_DIPLOMACY"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  partnerIdIdx: uniqueIndex("pi_id_idx").on(table.partnerId),
  countryIdx: index("pi_country_idx").on(table.country),
  mouStatusIdx: index("pi_mou_idx").on(table.mouStatus),
}));

export type PartnerInstitution = typeof partnerInstitutions.$inferSelect;
export type InsertPartnerInstitution = typeof partnerInstitutions.$inferInsert;

// ============================================================================
// FELLOWSHIPS (Bourses de recherche - AX6)
// ============================================================================
export const perfumumFellowships = mysqlTable("perfumum_fellowships", {
  id: int("id").autoincrement().primaryKey(),
  fellowshipId: varchar("fellowship_id", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  regionFocus: varchar("region_focus", { length: 100 }),
  durationMonths: int("duration_months"),
  budgetChf: int("budget_chf"),
  deliverables: json("deliverables").default(sql`(JSON_ARRAY())`),
  selectionCriteria: json("selection_criteria").default(sql`(JSON_ARRAY())`),
  status: mysqlEnum("status", [
    "draft", "open", "reviewing", "awarded", "in_progress", "completed", "cancelled"
  ]).default("draft"),
  notes: text("notes"),
  axisId: varchar("axis_id", { length: 50 }).default("AX6_OLFACTIVE_DIPLOMACY"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  fellowshipIdIdx: uniqueIndex("pf_id_idx").on(table.fellowshipId),
  statusIdx: index("pf_status_idx").on(table.status),
}));

export type PerfumumFellowship = typeof perfumumFellowships.$inferSelect;
export type InsertPerfumumFellowship = typeof perfumumFellowships.$inferInsert;

// ============================================================================
// TRADE ROUTES (Routes commerciales historiques - AX2)
// ============================================================================
export const tradeRoutes = mysqlTable("trade_routes", {
  id: int("id").autoincrement().primaryKey(),
  routeId: varchar("route_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  timeStart: int("time_start"), // Année de début
  timeEnd: int("time_end"), // Année de fin
  nodes: json("nodes"),
  materials: json("materials").default(sql`(JSON_ARRAY())`),
  notes: text("notes"),
  sources: json("sources").default(sql`(JSON_ARRAY())`),
  axisId: varchar("axis_id", { length: 50 }).default("AX2_ETHNOBOTANY_COMP"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  routeIdIdx: uniqueIndex("tr_id_idx").on(table.routeId),
}));

export type TradeRoute = typeof tradeRoutes.$inferSelect;
export type InsertTradeRoute = typeof tradeRoutes.$inferInsert;

// ============================================================================
// RESEARCH EDGES (Liens entre entités - Graphe de connaissances)
// ============================================================================
export const researchEdges = mysqlTable("research_edges", {
  id: int("id").autoincrement().primaryKey(),
  fromType: varchar("from_type", { length: 50 }).notNull(),
  fromId: varchar("from_id", { length: 50 }).notNull(),
  toType: varchar("to_type", { length: 50 }).notNull(),
  toId: varchar("to_id", { length: 50 }).notNull(),
  edgeType: varchar("edge_type", { length: 50 }).notNull(), // "contains", "derived_from", "related_to", etc.
  weight: decimal("weight", { precision: 5, scale: 2 }).default("1.00"),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).default("0.50"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  fromIdx: index("re_from_idx").on(table.fromType, table.fromId),
  toIdx: index("re_to_idx").on(table.toType, table.toId),
  edgeTypeIdx: index("re_edge_type_idx").on(table.edgeType),
}));

export type ResearchEdge = typeof researchEdges.$inferSelect;
export type InsertResearchEdge = typeof researchEdges.$inferInsert;

// ============================================================================
// MOLECULAR MARKERS (Marqueurs moléculaires par famille botanique - AX3)
// ============================================================================
export const molecularMarkers = mysqlTable("molecular_markers", {
  id: int("id").autoincrement().primaryKey(),
  markerId: varchar("marker_id", { length: 50 }).notNull().unique(),
  botanicalFamily: varchar("botanical_family", { length: 100 }).notNull(), // Rosaceae, Oleaceae, Lamiaceae
  moleculeName: varchar("molecule_name", { length: 255 }).notNull(),
  casNumber: varchar("cas_number", { length: 20 }),
  typicalPercentage: decimal("typical_percentage", { precision: 5, scale: 2 }),
  isKeyMarker: boolean("is_key_marker").default(false),
  biosynthesisPathway: varchar("biosynthesis_pathway", { length: 100 }), // monoterpene, phenylpropanoid, etc.
  notes: text("notes"),
  axisId: varchar("axis_id", { length: 50 }).default("AX3_ANALYTICAL_TRANS_EPOCH"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  markerIdIdx: uniqueIndex("mm_id_idx").on(table.markerId),
  familyIdx: index("mm_family_idx").on(table.botanicalFamily),
}));

export type MolecularMarker = typeof molecularMarkers.$inferSelect;
export type InsertMolecularMarker = typeof molecularMarkers.$inferInsert;

// ============================================================================
// BIOTECH MOLECULES (Molécules produites par biotechnologie - AX4)
// ============================================================================
export const biotechMolecules = mysqlTable("biotech_molecules", {
  id: int("id").autoincrement().primaryKey(),
  moleculeId: varchar("molecule_id", { length: 50 }).notNull().unique(),
  moleculeName: varchar("molecule_name", { length: 255 }).notNull(),
  naturalSource: varchar("natural_source", { length: 255 }), // Origine naturelle
  casNumber: varchar("cas_number", { length: 20 }),
  heterologousGenes: json("heterologous_genes").default(sql`(JSON_ARRAY())`),
  hostOrganism: varchar("host_organism", { length: 100 }),
  yieldMgL: decimal("yield_mg_l", { precision: 10, scale: 2 }),
  purityPercent: decimal("purity_percent", { precision: 5, scale: 2 }),
  productionStatus: mysqlEnum("production_status", [
    "research", "pilot", "commercial", "discontinued"
  ]).default("research"),
  advantages: json("advantages").default(sql`(JSON_ARRAY())`),
  limitations: json("limitations").default(sql`(JSON_ARRAY())`),
  notes: text("notes"),
  axisId: varchar("axis_id", { length: 50 }).default("AX4_CONSERVATION_BIOTECH"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  moleculeIdIdx: uniqueIndex("bm_id_idx").on(table.moleculeId),
  nameIdx: index("bm_name_idx").on(table.moleculeName),
}));

export type BiotechMolecule = typeof biotechMolecules.$inferSelect;
export type InsertBiotechMolecule = typeof biotechMolecules.$inferInsert;


// ============================================================================
// RESEARCH CONTENT (Contenu de recherche - Notes, Protocoles, Études de cas)
// ============================================================================
export const researchContent = mysqlTable("research_content", {
  id: int("id").autoincrement().primaryKey(),
  contentId: varchar("content_id", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull(),
  axisId: varchar("axis_id", { length: 50 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  contentType: mysqlEnum("content_type", [
    "axis_overview", "research_note", "case_study", "protocol", "glossary"
  ]).notNull(),
  lang: varchar("lang", { length: 10 }).default("fr"),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft"),
  filePath: varchar("file_path", { length: 500 }),
  evidenceLevel: mysqlEnum("evidence_level", ["confirmed", "probable", "hypothetical"]).default("hypothetical"),
  tags: json("tags").default(sql`(JSON_ARRAY())`),
  regions: json("regions").default(sql`(JSON_ARRAY())`),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  contentIdIdx: uniqueIndex("rc_content_id_idx").on(table.contentId),
  slugIdx: index("rc_slug_idx").on(table.slug),
  axisIdx: index("rc_axis_idx").on(table.axisId),
  typeIdx: index("rc_type_idx").on(table.contentType),
}));

export type ResearchContent = typeof researchContent.$inferSelect;
export type InsertResearchContent = typeof researchContent.$inferInsert;

// ============================================================================
// PERFUMUM GLOSSARY (Glossaire PERFUMUM)
// ============================================================================
export const perfumumGlossary = mysqlTable("perfumum_glossary", {
  id: int("id").autoincrement().primaryKey(),
  termId: varchar("term_id", { length: 50 }).notNull().unique(),
  term: varchar("term", { length: 255 }).notNull(),
  definitionFr: text("definition_fr").notNull(),
  definitionEn: text("definition_en"),
  category: varchar("category", { length: 100 }),
  relatedTerms: json("related_terms").default(sql`(JSON_ARRAY())`),
  relatedAxes: json("related_axes").default(sql`(JSON_ARRAY())`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  termIdIdx: uniqueIndex("pg_term_id_idx").on(table.termId),
  termIdx: index("pg_term_idx").on(table.term),
}));

export type PerfumumGlossaryTerm = typeof perfumumGlossary.$inferSelect;
export type InsertPerfumumGlossaryTerm = typeof perfumumGlossary.$inferInsert;

// ============================================================================
// SCENT BLENDS (Mélanges olfactifs)
// ============================================================================
export const scentBlends = mysqlTable("scent_blends", {
  id: int("id").autoincrement().primaryKey(),
  blendId: varchar("blend_id", { length: 50 }).notNull().unique(),
  climateAxis: mysqlEnum("climate_axis", ["vent", "bois", "peau", "disparition"]).notNull(),
  intendedMedium: mysqlEnum("intended_medium", ["parfum", "encens", "espace"]).notNull(),
  concept: varchar("concept", { length: 255 }),
  materials: json("materials").default(sql`(JSON_ARRAY())`),
  safetyNotes: text("safety_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  blendIdIdx: uniqueIndex("sb_blend_id_idx").on(table.blendId),
  axisIdx: index("sb_axis_idx").on(table.climateAxis),
  mediumIdx: index("sb_medium_idx").on(table.intendedMedium),
}));

export type ScentBlend = typeof scentBlends.$inferSelect;
export type InsertScentBlend = typeof scentBlends.$inferInsert;

// ============================================================================
// CLIMATE AXIS MATRIX (Matrice axe climatique / médium)
// ============================================================================
export const climateAxisMatrix = mysqlTable("climate_axis_matrix", {
  id: int("id").autoincrement().primaryKey(),
  climateAxis: mysqlEnum("climate_axis", ["vent", "bois", "peau", "disparition"]).notNull(),
  medium: mysqlEnum("medium", ["parfum", "encens", "espace"]).notNull(),
  targetDiffusion: mysqlEnum("target_diffusion", ["low", "medium", "high"]).default("medium"),
  targetPersistence: mysqlEnum("target_persistence", ["short", "medium", "long"]).default("medium"),
  volatilityBias: mysqlEnum("volatility_bias", ["top", "heart", "base"]).default("heart"),
  carrierOrSupport: varchar("carrier_or_support", { length: 255 }),
  safetyNotes: text("safety_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  axisIdx: index("cam_axis_idx").on(table.climateAxis),
  mediumIdx: index("cam_medium_idx").on(table.medium),
}));

export type ClimateAxisMatrixEntry = typeof climateAxisMatrix.$inferSelect;
export type InsertClimateAxisMatrixEntry = typeof climateAxisMatrix.$inferInsert;

// ============================================================================
// IMPACT METRICS (Métriques d'impact par année)
// ============================================================================
export const impactMetrics = mysqlTable("impact_metrics", {
  id: int("id").autoincrement().primaryKey(),
  year: int("year").notNull(),
  genomesSequencedTarget: int("genomes_sequenced_target").default(0),
  chemicalProfilesTarget: int("chemical_profiles_target").default(0),
  documentsDigitizedTarget: int("documents_digitized_target").default(0),
  citizenContributorsTarget: int("citizen_contributors_target").default(0),
  partnersTarget: int("partners_target").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  yearIdx: uniqueIndex("im_year_idx").on(table.year),
}));

export type ImpactMetric = typeof impactMetrics.$inferSelect;
export type InsertImpactMetric = typeof impactMetrics.$inferInsert;

// ============================================================================
// PERFUMUM PLANTS (Plantes aromatiques PERFUMUM avec données du corpus)
// ============================================================================
export const perfumumPlants = mysqlTable("perfumum_plants", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  latinName: varchar("latin_name", { length: 255 }).notNull(),
  family: varchar("family", { length: 100 }),
  category: varchar("category", { length: 100 }),
  origin: text("origin"),
  habitat: text("habitat"),
  olfactiveSignature: text("olfactive_signature"),
  dominantMolecules: text("dominant_molecules"),
  climaticAxis: varchar("climatic_axis", { length: 100 }),
  traditionalUse: text("traditional_use"),
  absorbeUse: text("absorbe_use"),
  // Taxonomie complète
  kingdom: varchar("kingdom", { length: 100 }).default("Plantae"),
  division: varchar("division", { length: 100 }),
  classField: varchar("class_field", { length: 100 }),
  orderName: varchar("order_name", { length: 100 }),
  genus: varchar("genus", { length: 100 }),
  species: varchar("species", { length: 100 }),
  // Caractéristiques
  lifeCycle: varchar("life_cycle", { length: 100 }),
  harvestPeriod: varchar("harvest_period", { length: 100 }),
  essentialOilYield: varchar("essential_oil_yield", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  latinNameIdx: uniqueIndex("pp_latin_name_idx").on(table.latinName),
  familyIdx: index("pp_family_idx").on(table.family),
  axisIdx: index("pp_axis_idx").on(table.climaticAxis),
}));

export type PerfumumPlant = typeof perfumumPlants.$inferSelect;
export type InsertPerfumumPlant = typeof perfumumPlants.$inferInsert;

// ============================================================================
// PERFUMUM MOLECULES (Molécules olfactives PERFUMUM avec rôles)
// ============================================================================
export const perfumumMolecules = mysqlTable("perfumum_molecules", {
  id: int("id").autoincrement().primaryKey(),
  moleculeName: varchar("molecule_name", { length: 255 }).notNull(),
  family: varchar("family", { length: 100 }),
  odorKey: text("odor_key"),
  role: mysqlEnum("role", ["diffusion", "modulation", "structure", "fixation"]),
  climaticAxis: varchar("climatic_axis", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: uniqueIndex("pmol_name_idx").on(table.moleculeName),
  familyIdx: index("pmol_family_idx").on(table.family),
  roleIdx: index("pmol_role_idx").on(table.role),
}));

export type PerfumumMolecule = typeof perfumumMolecules.$inferSelect;
export type InsertPerfumumMolecule = typeof perfumumMolecules.$inferInsert;

// ============================================================================
// PLANT MOLECULE RELATIONS (Relations plantes-molécules PERFUMUM)
// ============================================================================
export const perfumumPlantMolecules = mysqlTable("perfumum_plant_molecules", {
  id: int("id").autoincrement().primaryKey(),
  plantId: int("plant_id").notNull(),
  moleculeId: int("molecule_id").notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  plantIdx: index("ppm_plant_idx").on(table.plantId),
  moleculeIdx: index("ppm_molecule_idx").on(table.moleculeId),
}));

export type PerfumumPlantMolecule = typeof perfumumPlantMolecules.$inferSelect;
export type InsertPerfumumPlantMolecule = typeof perfumumPlantMolecules.$inferInsert;
