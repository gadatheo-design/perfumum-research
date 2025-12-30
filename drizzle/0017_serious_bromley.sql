CREATE TABLE `absorbe_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`prototype_id` int NOT NULL,
	`animalite` int NOT NULL DEFAULT 0,
	`boise` int NOT NULL DEFAULT 0,
	`soufre` int NOT NULL DEFAULT 0,
	`oxyde` int NOT NULL DEFAULT 0,
	`resineux` int NOT NULL DEFAULT 0,
	`balsamique` int NOT NULL DEFAULT 0,
	`epice` int NOT NULL DEFAULT 0,
	`terreux` int NOT NULL DEFAULT 0,
	`notes` text,
	`created_at` varchar(255) NOT NULL,
	CONSTRAINT `absorbe_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `accord_civilisations` (
	`accordId` int NOT NULL,
	`civilisationId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `accords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`familyId` int,
	`olfactiveProfile` text,
	`emotionalResonance` text,
	`texture` enum('sec','humide','lactone','resine','pierre','air'),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`event_type` enum('molecule_view','recipe_view','terpene_view','pdf_export','favorite_add','favorite_remove','search_query') NOT NULL,
	`entity_type` varchar(50),
	`entity_id` int,
	`metadata` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chemical_families` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('acides_gras','acides_aromatiques','esters','indoles') NOT NULL,
	`description` text,
	`olfactiveRole` text,
	`volatility` varchar(50),
	`polarity` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chemical_families_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `citations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_type` enum('molecule','recipe','prototype','accord') NOT NULL,
	`entity_id` int NOT NULL,
	`format` enum('apa','mla','chicago','bibtex') NOT NULL DEFAULT 'apa',
	`citation_text` text NOT NULL,
	`doi` varchar(255),
	`url` varchar(512),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `citations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `traditions_olfactives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`region` varchar(255),
	`symbolicMaterials` text,
	`signatureAccordId` int,
	`longDescription` text,
	`temporality` enum('archaic','antique','medieval','abyssal','futuristic'),
	`bibliographicReferences` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `traditions_olfactives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `climate_studies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`collection` varchar(255),
	`axis` varchar(255),
	`concept` text,
	`zone` varchar(255),
	`altitude` varchar(100),
	`climate` text,
	`key_moment` text,
	`attack_description` text,
	`heart_description` text,
	`base_description` text,
	`observed_supports` text,
	`absorbe_reading` text,
	`threshold_odor` enum('yes','no') DEFAULT 'no',
	`recommended_tests` text,
	`head_translation` text,
	`heart_translation` text,
	`base_translation` text,
	`ethical_position` text,
	`status` enum('field_observation','lab_translation','completed') DEFAULT 'field_observation',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `climate_studies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `experimental_accord_civilisations` (
	`experimentalAccordId` int NOT NULL,
	`civilisationId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `experimental_accords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`number` int NOT NULL,
	`olfactiveAxis` varchar(255) NOT NULL,
	`intention` varchar(255) NOT NULL,
	`baseTabac` text,
	`resinExtract` text,
	`sensoryModifier` text,
	`conceptualNote` text,
	`isExtreme` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `experimental_accords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `extraction_tests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`test_name` varchar(255) NOT NULL,
	`date` timestamp NOT NULL,
	`field_archive_id` int,
	`material` text,
	`solvent` enum('mct','alcohol_95','alcohol_70','water','other') NOT NULL,
	`ratio` varchar(100),
	`duration` int,
	`result_smell` text,
	`viable` enum('yes','no','maybe') DEFAULT 'maybe',
	`notes` text,
	`observation_day_1` text,
	`observation_day_7` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `extraction_tests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `families` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('perfumeum12','biomineralis','petrichor','volcanique','solarmineralis','necrogeo','other') NOT NULL,
	`description` text,
	`variationCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `families_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `field_archives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`provisional_name` varchar(255) NOT NULL,
	`zone` varchar(255),
	`precise_location` varchar(255),
	`altitude` int,
	`date` timestamp,
	`climate` text,
	`material` text,
	`dominant_smell` text,
	`local_usage` text,
	`personal_feeling` text,
	`olfactive_hypothesis` text,
	`test_performed` enum('yes','no','planned') DEFAULT 'no',
	`test_type` varchar(100),
	`status` enum('draft','in_progress','completed','archived') DEFAULT 'draft',
	`linked_collection_id` int,
	`encounter_context` text,
	`first_impression` text,
	`evolution` text,
	`persistence` text,
	`material_origin` text,
	`material_state` varchar(100),
	`symbolic_quantity` text,
	`translation_hypothesis` text,
	`what_to_keep` text,
	`what_to_leave` text,
	`personal_note` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `field_archives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `glossary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`term` varchar(255) NOT NULL,
	`definition` text NOT NULL,
	`category` enum('chimie','interaction','reaction','extraction','technique','molecule','concept','propriete','methodologie','formulation','protocole','dispositif','support','application','structure') NOT NULL,
	`context` text,
	`examples` text,
	`relatedTerms` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `glossary_id` PRIMARY KEY(`id`),
	CONSTRAINT `glossary_term_unique` UNIQUE(`term`)
);
--> statement-breakpoint
CREATE TABLE `installation_families` (
	`installationId` int NOT NULL,
	`familyId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `installation_recettes` (
	`installationId` int NOT NULL,
	`recetteId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `installations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`concept` text,
	`materials` text,
	`diffusionMode` text,
	`location` varchar(255),
	`date` timestamp,
	`documentation` text,
	`visitorExperience` text,
	`theoreticalScope` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `installations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `laboratoire` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`botanicalName` varchar(255),
	`type` enum('huile_essentielle','absolu','resinoid','concrete','co2','teinture','poudre','alcoolat','autre') NOT NULL,
	`olfactiveFamily` text,
	`note` enum('tete','coeur','fond','tete_coeur','coeur_fond'),
	`origin` varchar(255),
	`extractionMethod` enum('distillation','extraction_solvant','co2_supercritique','expression','teinture','autre'),
	`olfactiveProfile` text,
	`character` text,
	`supplier` varchar(255),
	`pricePerMl` int,
	`stock` int,
	`purchaseDate` timestamp,
	`status` enum('en_stock','a_commander','epuise') DEFAULT 'en_stock',
	`technicalNotes` text,
	`manipulationNotes` text,
	`maxTemperature` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `laboratoire_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `laboratoire_molecules` (
	`laboratoireId` int NOT NULL,
	`moleculeId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `laboratoire_recettes` (
	`laboratoireId` int NOT NULL,
	`recetteId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` enum('prototype','discovery','collaboration','publication','other') NOT NULL DEFAULT 'other',
	`molecule_id` int,
	`user_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modification_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`entity_type` enum('molecule','recette','accord','famille','matiere','prototype','synergie','tradition') NOT NULL,
	`entity_id` int NOT NULL,
	`operation` enum('create','update','delete') NOT NULL,
	`state_before` json,
	`state_after` json,
	`description` text,
	`is_undone` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`undone_at` timestamp,
	CONSTRAINT `modification_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `molecular_protocols` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`linked_study_id` int,
	`objective` text,
	`olfactive_architecture` text,
	`function` text,
	`head_palette` json,
	`heart_palette` json,
	`base_palette` json,
	`head_ratio` int DEFAULT 25,
	`heart_ratio` int DEFAULT 45,
	`base_ratio` int DEFAULT 30,
	`formulation_protocol` text,
	`sensory_tests` text,
	`typical_failures` text,
	`status` enum('conceptual','testing','validated') DEFAULT 'conceptual',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `molecular_protocols_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `molecule_accords` (
	`moleculeId` int NOT NULL,
	`accordId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `molecule_chemical_families` (
	`moleculeId` int NOT NULL,
	`chemicalFamilyId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `molecule_families` (
	`moleculeId` int NOT NULL,
	`familyId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `molecule_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`note` text NOT NULL,
	`tags` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `molecule_notes_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_user_molecule_note` UNIQUE(`user_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `molecule_synergies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule1_id` int NOT NULL,
	`molecule2_id` int NOT NULL,
	`type` enum('potentialisation','stabilisation','transformation','masquage') NOT NULL,
	`description` text NOT NULL,
	`applications` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `molecule_synergies_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_molecule_pair` UNIQUE(`molecule1_id`,`molecule2_id`)
);
--> statement-breakpoint
CREATE TABLE `molecules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`family` text,
	`chemicalFormula` varchar(100),
	`olfactiveProfile` text,
	`emotionalResonance` text,
	`functionalEffect` text,
	`sourceOrigin` text,
	`concentration` varchar(100),
	`notes` text,
	`molecularWeight` int,
	`boilingPoint` int,
	`logP` int,
	`volatility` int,
	`intensity` int,
	`complexity` int,
	`botanicalSources` text,
	`extractionMethod` text,
	`therapeuticProperties` text,
	`radar_intensity` int DEFAULT 50,
	`radar_freshness` int DEFAULT 50,
	`radar_warmth` int DEFAULT 50,
	`radar_sweetness` int DEFAULT 50,
	`radar_spiciness` int DEFAULT 50,
	`radar_earthiness` int DEFAULT 50,
	`references` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `molecules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `molecules_recettes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule_id` int NOT NULL,
	`recette_id` int NOT NULL,
	`proportion` decimal(5,2),
	`role` enum('tête','cœur','fond'),
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `molecules_recettes_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_molecule_recette` UNIQUE(`molecule_id`,`recette_id`)
);
--> statement-breakpoint
CREATE TABLE `petrichor` (
	`id` int AUTO_INCREMENT NOT NULL,
	`variation` varchar(255) NOT NULL,
	`subfamily` enum('clair','noir','argile','bois_humide','racine','mousse','desert','marin','glaciaire','urbain','sacre') NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `petrichor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `petrichor_experimental_accords` (
	`petrichorId` int NOT NULL,
	`experimentalAccordId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `petrichor_molecules` (
	`petrichorId` int NOT NULL,
	`moleculeId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `petrichor_recettes` (
	`petrichorId` int NOT NULL,
	`recetteId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `petrichor_tabacs` (
	`petrichorId` int NOT NULL,
	`tabacId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `prototype_chemical_families` (
	`prototypeId` int NOT NULL,
	`chemicalFamilyId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `prototype_laboratoire` (
	`prototypeId` int NOT NULL,
	`laboratoireId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `prototype_molecules` (
	`prototypeId` int NOT NULL,
	`moleculeId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `prototypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`emoji` varchar(10),
	`conceptualAxis` text,
	`sensoryForm` text,
	`olfactiveFamily` text,
	`preferredSupport` varchar(100),
	`keyEmotion` text,
	`overview` text,
	`composition` text,
	`conceptualReflection` text,
	`installation` text,
	`technicalDevelopment` text,
	`theoreticalScope` text,
	`color` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prototypes_id` PRIMARY KEY(`id`),
	CONSTRAINT `prototypes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `recette_molecules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recette_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`proportion` int,
	`role` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recette_molecules_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_recette_molecule` UNIQUE(`recette_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `recette_tabac_associations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recette_id` int NOT NULL,
	`tabac_id` int NOT NULL,
	`compatibility` int NOT NULL,
	`proportion` varchar(50),
	`synergies` text,
	`notes` text,
	`recommended` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recette_tabac_associations_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_recette_tabac` UNIQUE(`recette_id`,`tabac_id`)
);
--> statement-breakpoint
CREATE TABLE `recettes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('tabac','resine','resine_cbd','cone','parfum','encens','extrait') NOT NULL,
	`familyId` int,
	`accordId` int,
	`tabacId` int,
	`civilisationId` int,
	`description` text,
	`ingredients` text,
	`formula` text,
	`protocol` text,
	`notes` text,
	`texture` varchar(100),
	`intensity` int,
	`stability` enum('low','medium','high'),
	`combustionTemperature` int,
	`maturationTime` int,
	`costEstimate` int,
	`productionTime` int,
	`status` enum('experimental','testing','validated','production') DEFAULT 'experimental',
	`notes_tete` text,
	`notes_coeur` text,
	`notes_fond` text,
	`duree_tete_min` int DEFAULT 15,
	`duree_coeur_min` int DEFAULT 45,
	`duree_fond_min` int DEFAULT 120,
	`parent_recette_id` int,
	`gamme` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recettes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recettes_formules_reference` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recette_id` int NOT NULL,
	`formule_reference_name` varchar(255) NOT NULL,
	`formule_reference_family` varchar(100) NOT NULL,
	`similarity_score` int NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recettes_formules_reference_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_recette_formule` UNIQUE(`recette_id`,`formule_reference_name`)
);
--> statement-breakpoint
CREATE TABLE `recherche_radicale` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nom` varchar(255) NOT NULL,
	`symbole` varchar(10),
	`serie` varchar(255) NOT NULL,
	`concept` text NOT NULL,
	`note_speciale` text,
	`architecture` text NOT NULL,
	`effet` text NOT NULL,
	`usage_artistique` text NOT NULL,
	`themes_conceptuels` text,
	`avertissement` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recherche_radicale_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recipe_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recette_id` int NOT NULL,
	`version` varchar(50) NOT NULL,
	`changes` text,
	`formula` text,
	`protocol` text,
	`author` varchar(255),
	`status` enum('draft','testing','validated','production','archived') DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recipe_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `research_timeline` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`quarter` varchar(10) NOT NULL,
	`year` int NOT NULL,
	`quarterNumber` int NOT NULL,
	`phase` enum('foundation','development','expansion','consolidation','innovation') NOT NULL,
	`category` enum('research','formulation','testing','documentation','infrastructure','collaboration') NOT NULL,
	`status` enum('planned','in_progress','completed','delayed') NOT NULL DEFAULT 'planned',
	`priority` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`deliverables` text,
	`dependencies` text,
	`progress` int NOT NULL DEFAULT 0,
	`startDate` varchar(10),
	`endDate` varchar(10),
	`completedDate` varchar(10),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_timeline_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_formulas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`radar_profile` json NOT NULL,
	`suggestions` json NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `saved_formulas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sensory_scales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('axis','family') NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`scale` varchar(50),
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sensory_scales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shared_collections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`molecule_ids` text NOT NULL,
	`creator_id` int NOT NULL,
	`expires_at` timestamp NOT NULL,
	`view_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shared_collections_id` PRIMARY KEY(`id`),
	CONSTRAINT `shared_collections_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `situated_smells` (
	`id` int AUTO_INCREMENT NOT NULL,
	`poetic_name` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`date` timestamp NOT NULL,
	`weather` varchar(255),
	`support` text,
	`immediate_impression` text,
	`triggered_memory` text,
	`recreatable` enum('yes','no','maybe') DEFAULT 'maybe',
	`linked_field_archive_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `situated_smells_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplier_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplier_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`price_per_unit` decimal(10,2),
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`minimum_order_quantity` int,
	`unit` varchar(50),
	`lead_time_days` int,
	`quality_grade` enum('standard','premium','extra_premium') NOT NULL DEFAULT 'standard',
	`is_available` int NOT NULL DEFAULT 1,
	`last_order_date` timestamp,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supplier_materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_supplier_material` UNIQUE(`supplier_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`company_name` varchar(255),
	`country` varchar(100) NOT NULL,
	`region` varchar(100),
	`email` varchar(320),
	`phone` varchar(20),
	`website` varchar(255),
	`specialties` json,
	`description` text,
	`rating` int,
	`certifications` json,
	`is_preferred` int NOT NULL DEFAULT 0,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `synergies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`tabac_id` int,
	`molecule_id` int,
	`famille_id` int,
	`type` enum('potentialisation','stabilisation','transformation','masquage') NOT NULL,
	`effet` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `synergies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tabac_accords` (
	`tabacId` int NOT NULL,
	`accordId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tabac_civilisations` (
	`tabacId` int NOT NULL,
	`civilisationId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tabac_molecules` (
	`tabacId` int NOT NULL,
	`moleculeId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tabacs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('blond','brun','oriental','experimental') NOT NULL,
	`origin` varchar(255),
	`aromaticProfile` text,
	`intensity` int,
	`idealTemperature` int,
	`internalNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tabacs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasting_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recette_id` int NOT NULL,
	`version_id` int,
	`taster` varchar(255),
	`date` timestamp NOT NULL DEFAULT (now()),
	`freshness` int,
	`depth` int,
	`complexity` int,
	`balance` int,
	`persistence` int,
	`originality` int,
	`top_notes` text,
	`heart_notes` text,
	`base_notes` text,
	`texture` varchar(100),
	`combustion_quality` int,
	`impressions` text,
	`improvements` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tasting_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `terpene_synergies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`terpene1_id` int NOT NULL,
	`terpene2_id` int NOT NULL,
	`compatibility_score` int NOT NULL DEFAULT 50,
	`synergy_notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `terpene_synergies_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_pair` UNIQUE(`terpene1_id`,`terpene2_id`)
);
--> statement-breakpoint
CREATE TABLE `tobacco_formula_installations` (
	`tobaccoFormulaId` int NOT NULL,
	`installationId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tobacco_formulas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(20) NOT NULL,
	`name` varchar(255) NOT NULL,
	`olfactiveFamily` varchar(255),
	`inspiration` text,
	`composition` text,
	`procedure` text,
	`cureConditions` text,
	`observations` text,
	`suggestedUse` text,
	`effect` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tobacco_formulas_id` PRIMARY KEY(`id`),
	CONSTRAINT `tobacco_formulas_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `user_favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_favorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_user_molecule` UNIQUE(`user_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `user_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_type` varchar(50) NOT NULL,
	`entity_id` int NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `volcanique` (
	`id` int AUTO_INCREMENT NOT NULL,
	`variation` varchar(255) NOT NULL,
	`type` enum('basalte_chaud','basalte_froid','vapeur','soufre','poussiere_tectonique','magma_blanc','pierre_poreuse') NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `volcanique_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `volcanique_experimental_accords` (
	`volcaniqueId` int NOT NULL,
	`experimentalAccordId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `volcanique_molecules` (
	`volcaniqueId` int NOT NULL,
	`moleculeId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `volcanique_recettes` (
	`volcaniqueId` int NOT NULL,
	`recetteId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `volcanique_tabacs` (
	`volcaniqueId` int NOT NULL,
	`tabacId` int NOT NULL
);
--> statement-breakpoint
ALTER TABLE `accord_civilisations` ADD CONSTRAINT `accord_civilisations_accordId_accords_id_fk` FOREIGN KEY (`accordId`) REFERENCES `accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `accord_civilisations` ADD CONSTRAINT `accord_civilisations_civilisationId_traditions_olfactives_id_fk` FOREIGN KEY (`civilisationId`) REFERENCES `traditions_olfactives`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `accords` ADD CONSTRAINT `accords_familyId_families_id_fk` FOREIGN KEY (`familyId`) REFERENCES `families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `traditions_olfactives` ADD CONSTRAINT `traditions_olfactives_signatureAccordId_accords_id_fk` FOREIGN KEY (`signatureAccordId`) REFERENCES `accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `experimental_accord_civilisations` ADD CONSTRAINT `experimental_accord_civilisations_experimentalAccordId_experimental_accords_id_fk` FOREIGN KEY (`experimentalAccordId`) REFERENCES `experimental_accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `experimental_accord_civilisations` ADD CONSTRAINT `experimental_accord_civilisations_civilisationId_traditions_olfactives_id_fk` FOREIGN KEY (`civilisationId`) REFERENCES `traditions_olfactives`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `extraction_tests` ADD CONSTRAINT `extraction_tests_field_archive_id_field_archives_id_fk` FOREIGN KEY (`field_archive_id`) REFERENCES `field_archives`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `installation_families` ADD CONSTRAINT `installation_families_installationId_installations_id_fk` FOREIGN KEY (`installationId`) REFERENCES `installations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `installation_families` ADD CONSTRAINT `installation_families_familyId_families_id_fk` FOREIGN KEY (`familyId`) REFERENCES `families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `installation_recettes` ADD CONSTRAINT `installation_recettes_installationId_installations_id_fk` FOREIGN KEY (`installationId`) REFERENCES `installations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `installation_recettes` ADD CONSTRAINT `installation_recettes_recetteId_recettes_id_fk` FOREIGN KEY (`recetteId`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratoire_molecules` ADD CONSTRAINT `laboratoire_molecules_laboratoireId_laboratoire_id_fk` FOREIGN KEY (`laboratoireId`) REFERENCES `laboratoire`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratoire_molecules` ADD CONSTRAINT `laboratoire_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratoire_recettes` ADD CONSTRAINT `laboratoire_recettes_laboratoireId_laboratoire_id_fk` FOREIGN KEY (`laboratoireId`) REFERENCES `laboratoire`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratoire_recettes` ADD CONSTRAINT `laboratoire_recettes_recetteId_recettes_id_fk` FOREIGN KEY (`recetteId`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecular_protocols` ADD CONSTRAINT `molecular_protocols_linked_study_id_climate_studies_id_fk` FOREIGN KEY (`linked_study_id`) REFERENCES `climate_studies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_accords` ADD CONSTRAINT `molecule_accords_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_accords` ADD CONSTRAINT `molecule_accords_accordId_accords_id_fk` FOREIGN KEY (`accordId`) REFERENCES `accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_chemical_families` ADD CONSTRAINT `molecule_chemical_families_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_chemical_families` ADD CONSTRAINT `molecule_chemical_families_chemicalFamilyId_chemical_families_id_fk` FOREIGN KEY (`chemicalFamilyId`) REFERENCES `chemical_families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_families` ADD CONSTRAINT `molecule_families_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_families` ADD CONSTRAINT `molecule_families_familyId_families_id_fk` FOREIGN KEY (`familyId`) REFERENCES `families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_notes` ADD CONSTRAINT `molecule_notes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_notes` ADD CONSTRAINT `molecule_notes_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_synergies` ADD CONSTRAINT `molecule_synergies_molecule1_id_molecules_id_fk` FOREIGN KEY (`molecule1_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_synergies` ADD CONSTRAINT `molecule_synergies_molecule2_id_molecules_id_fk` FOREIGN KEY (`molecule2_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_experimental_accords` ADD CONSTRAINT `petrichor_experimental_accords_petrichorId_petrichor_id_fk` FOREIGN KEY (`petrichorId`) REFERENCES `petrichor`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_experimental_accords` ADD CONSTRAINT `petrichor_experimental_accords_experimentalAccordId_experimental_accords_id_fk` FOREIGN KEY (`experimentalAccordId`) REFERENCES `experimental_accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_molecules` ADD CONSTRAINT `petrichor_molecules_petrichorId_petrichor_id_fk` FOREIGN KEY (`petrichorId`) REFERENCES `petrichor`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_molecules` ADD CONSTRAINT `petrichor_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_recettes` ADD CONSTRAINT `petrichor_recettes_petrichorId_petrichor_id_fk` FOREIGN KEY (`petrichorId`) REFERENCES `petrichor`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_recettes` ADD CONSTRAINT `petrichor_recettes_recetteId_recettes_id_fk` FOREIGN KEY (`recetteId`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_tabacs` ADD CONSTRAINT `petrichor_tabacs_petrichorId_petrichor_id_fk` FOREIGN KEY (`petrichorId`) REFERENCES `petrichor`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_tabacs` ADD CONSTRAINT `petrichor_tabacs_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_chemical_families` ADD CONSTRAINT `prototype_chemical_families_prototypeId_prototypes_id_fk` FOREIGN KEY (`prototypeId`) REFERENCES `prototypes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_chemical_families` ADD CONSTRAINT `prototype_chemical_families_chemicalFamilyId_chemical_families_id_fk` FOREIGN KEY (`chemicalFamilyId`) REFERENCES `chemical_families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_laboratoire` ADD CONSTRAINT `prototype_laboratoire_prototypeId_prototypes_id_fk` FOREIGN KEY (`prototypeId`) REFERENCES `prototypes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_laboratoire` ADD CONSTRAINT `prototype_laboratoire_laboratoireId_laboratoire_id_fk` FOREIGN KEY (`laboratoireId`) REFERENCES `laboratoire`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_molecules` ADD CONSTRAINT `prototype_molecules_prototypeId_prototypes_id_fk` FOREIGN KEY (`prototypeId`) REFERENCES `prototypes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_molecules` ADD CONSTRAINT `prototype_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recette_molecules` ADD CONSTRAINT `recette_molecules_recette_id_recettes_id_fk` FOREIGN KEY (`recette_id`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recette_molecules` ADD CONSTRAINT `recette_molecules_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recette_tabac_associations` ADD CONSTRAINT `recette_tabac_associations_recette_id_recettes_id_fk` FOREIGN KEY (`recette_id`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recette_tabac_associations` ADD CONSTRAINT `recette_tabac_associations_tabac_id_tabacs_id_fk` FOREIGN KEY (`tabac_id`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recettes` ADD CONSTRAINT `recettes_familyId_families_id_fk` FOREIGN KEY (`familyId`) REFERENCES `families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recettes` ADD CONSTRAINT `recettes_accordId_accords_id_fk` FOREIGN KEY (`accordId`) REFERENCES `accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recettes` ADD CONSTRAINT `recettes_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recettes` ADD CONSTRAINT `recettes_civilisationId_traditions_olfactives_id_fk` FOREIGN KEY (`civilisationId`) REFERENCES `traditions_olfactives`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recettes_formules_reference` ADD CONSTRAINT `recettes_formules_reference_recette_id_recettes_id_fk` FOREIGN KEY (`recette_id`) REFERENCES `recettes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recipe_versions` ADD CONSTRAINT `recipe_versions_recette_id_recettes_id_fk` FOREIGN KEY (`recette_id`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shared_collections` ADD CONSTRAINT `shared_collections_creator_id_users_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `situated_smells` ADD CONSTRAINT `situated_smells_linked_field_archive_id_field_archives_id_fk` FOREIGN KEY (`linked_field_archive_id`) REFERENCES `field_archives`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplier_materials` ADD CONSTRAINT `supplier_materials_supplier_id_suppliers_id_fk` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplier_materials` ADD CONSTRAINT `supplier_materials_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `synergies` ADD CONSTRAINT `synergies_tabac_id_tabacs_id_fk` FOREIGN KEY (`tabac_id`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `synergies` ADD CONSTRAINT `synergies_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `synergies` ADD CONSTRAINT `synergies_famille_id_families_id_fk` FOREIGN KEY (`famille_id`) REFERENCES `families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tabac_accords` ADD CONSTRAINT `tabac_accords_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tabac_accords` ADD CONSTRAINT `tabac_accords_accordId_accords_id_fk` FOREIGN KEY (`accordId`) REFERENCES `accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tabac_civilisations` ADD CONSTRAINT `tabac_civilisations_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tabac_civilisations` ADD CONSTRAINT `tabac_civilisations_civilisationId_traditions_olfactives_id_fk` FOREIGN KEY (`civilisationId`) REFERENCES `traditions_olfactives`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tabac_molecules` ADD CONSTRAINT `tabac_molecules_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tabac_molecules` ADD CONSTRAINT `tabac_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasting_notes` ADD CONSTRAINT `tasting_notes_recette_id_recettes_id_fk` FOREIGN KEY (`recette_id`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasting_notes` ADD CONSTRAINT `tasting_notes_version_id_recipe_versions_id_fk` FOREIGN KEY (`version_id`) REFERENCES `recipe_versions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terpene_synergies` ADD CONSTRAINT `terpene_synergies_terpene1_id_molecules_id_fk` FOREIGN KEY (`terpene1_id`) REFERENCES `molecules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terpene_synergies` ADD CONSTRAINT `terpene_synergies_terpene2_id_molecules_id_fk` FOREIGN KEY (`terpene2_id`) REFERENCES `molecules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tobacco_formula_installations` ADD CONSTRAINT `tobacco_formula_installations_tobaccoFormulaId_tobacco_formulas_id_fk` FOREIGN KEY (`tobaccoFormulaId`) REFERENCES `tobacco_formulas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tobacco_formula_installations` ADD CONSTRAINT `tobacco_formula_installations_installationId_installations_id_fk` FOREIGN KEY (`installationId`) REFERENCES `installations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_experimental_accords` ADD CONSTRAINT `volcanique_experimental_accords_volcaniqueId_volcanique_id_fk` FOREIGN KEY (`volcaniqueId`) REFERENCES `volcanique`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_experimental_accords` ADD CONSTRAINT `volcanique_experimental_accords_experimentalAccordId_experimental_accords_id_fk` FOREIGN KEY (`experimentalAccordId`) REFERENCES `experimental_accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_molecules` ADD CONSTRAINT `volcanique_molecules_volcaniqueId_volcanique_id_fk` FOREIGN KEY (`volcaniqueId`) REFERENCES `volcanique`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_molecules` ADD CONSTRAINT `volcanique_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_recettes` ADD CONSTRAINT `volcanique_recettes_volcaniqueId_volcanique_id_fk` FOREIGN KEY (`volcaniqueId`) REFERENCES `volcanique`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_recettes` ADD CONSTRAINT `volcanique_recettes_recetteId_recettes_id_fk` FOREIGN KEY (`recetteId`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_tabacs` ADD CONSTRAINT `volcanique_tabacs_volcaniqueId_volcanique_id_fk` FOREIGN KEY (`volcaniqueId`) REFERENCES `volcanique`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_tabacs` ADD CONSTRAINT `volcanique_tabacs_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `event_type_idx` ON `analytics_events` (`event_type`);--> statement-breakpoint
CREATE INDEX `entity_type_idx` ON `analytics_events` (`entity_type`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `analytics_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `modification_history` (`user_id`);--> statement-breakpoint
CREATE INDEX `entity_type_idx` ON `modification_history` (`entity_type`);--> statement-breakpoint
CREATE INDEX `entity_id_idx` ON `modification_history` (`entity_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `modification_history` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_molecule` ON `molecules_recettes` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `idx_recette` ON `molecules_recettes` (`recette_id`);--> statement-breakpoint
CREATE INDEX `idx_recette_formule` ON `recettes_formules_reference` (`recette_id`);--> statement-breakpoint
CREATE INDEX `saved_formulas_user_idx` ON `saved_formulas` (`user_id`);--> statement-breakpoint
CREATE INDEX `supplier_material_supplier_idx` ON `supplier_materials` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `supplier_material_molecule_idx` ON `supplier_materials` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `supplier_name_idx` ON `suppliers` (`name`);--> statement-breakpoint
CREATE INDEX `supplier_country_idx` ON `suppliers` (`country`);--> statement-breakpoint
CREATE INDEX `supplier_region_idx` ON `suppliers` (`region`);