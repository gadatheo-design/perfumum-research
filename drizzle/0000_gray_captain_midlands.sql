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
CREATE TABLE `analytical_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`full_name` varchar(500),
	`category` enum('chromatography','spectrometry','thermal_analysis','particle_analysis','spectroscopy','other') DEFAULT 'other',
	`performance_score` int,
	`resolution_score` int,
	`sensitivity_score` int,
	`detection_limit` varchar(100),
	`detection_limit_unit` varchar(50),
	`capabilities` json,
	`limitations` json,
	`best_suited_for` json,
	`description` text,
	`technical_details` text,
	`publication_count` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analytical_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `analytical_methods_code_unique` UNIQUE(`code`)
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
CREATE TABLE `aromatic_accords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accord_id` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('fumoir','hash','herbal','hybrid') NOT NULL,
	`top_notes` json,
	`heart_notes` json,
	`base_notes` json,
	`formula` text,
	`formula_json` json,
	`terpene_profile` json,
	`description` text,
	`inspiration` text,
	`target_effect` text,
	`diffusion` enum('faible','moyenne','forte') DEFAULT 'moyenne',
	`tenacity` enum('fugace','modérée','tenace') DEFAULT 'modérée',
	`sillage` enum('intime','modéré','puissant') DEFAULT 'modéré',
	`key_interactions` json,
	`usage_recommendations` text,
	`dilution_recommendation` varchar(100),
	`image_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aromatic_accords_id` PRIMARY KEY(`id`),
	CONSTRAINT `aromatic_accords_accord_id_unique` UNIQUE(`accord_id`)
);
--> statement-breakpoint
CREATE TABLE `aromatic_molecules_tabac` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`common_names` text,
	`chemical_formula` varchar(50) NOT NULL,
	`molecular_weight` decimal,
	`structure` text,
	`iupac_name` varchar(255),
	`odor_descriptors` text,
	`odor_threshold` decimal,
	`volatility` varchar(100),
	`boiling_point` decimal,
	`melting_point` decimal,
	`log_p` decimal,
	`stability` json,
	`therapeutic_properties` text,
	`tobacco_contribution` text,
	`cannabis_contribution` text,
	`perfumery_use` text,
	`pyrolysis_products` text,
	`tobacco_varieties_containing` text,
	`cannabis_strains_sources` text,
	`source_references` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aromatic_molecules_tabac_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aromatic_rarities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rarity_id` varchar(20) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100),
	`geography` text,
	`rarity_regime` varchar(100),
	`cultural_status` varchar(100),
	`source_type` varchar(100),
	`extractability` varchar(50),
	`key_molecules` text,
	`absorbe_potential` text,
	`notes` text,
	`references` text,
	`temporal_behavior` varchar(50),
	`industrial_products` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aromatic_rarities_id` PRIMARY KEY(`id`),
	CONSTRAINT `aromatic_rarities_rarity_id_unique` UNIQUE(`rarity_id`)
);
--> statement-breakpoint
CREATE TABLE `axis_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_axis_id` int NOT NULL,
	`target_axis_id` int NOT NULL,
	`strength` int DEFAULT 1,
	`connection_type` enum('related','complementary','dependent','overlap') DEFAULT 'related',
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `axis_connections_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_axis_connection` UNIQUE(`source_axis_id`,`target_axis_id`)
);
--> statement-breakpoint
CREATE TABLE `axis_reference_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`axis_id` int NOT NULL,
	`reference_id` int NOT NULL,
	`link_type` enum('primary_source','secondary_source','methodology','theoretical_basis','case_study','data_source','comparative','historical','review','other') DEFAULT 'secondary_source',
	`relevance_score` int DEFAULT 50,
	`confidence` enum('high','medium','low') DEFAULT 'medium',
	`notes` text,
	`excerpt` text,
	`page_numbers` varchar(100),
	`display_weight` int DEFAULT 1,
	`is_highlighted` boolean DEFAULT false,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `axis_reference_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_axis_reference` UNIQUE(`axis_id`,`reference_id`)
);
--> statement-breakpoint
CREATE TABLE `bibliography_axis_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bibliography_id` int NOT NULL,
	`axis_id` int NOT NULL,
	`relevance` enum('primaire','secondaire','contextuelle') DEFAULT 'secondaire',
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bibliography_axis_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_bibliography_axis` UNIQUE(`bibliography_id`,`axis_id`)
);
--> statement-breakpoint
CREATE TABLE `bibliography_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entry_key` varchar(100) NOT NULL,
	`entry_type` enum('article','book','inbook','incollection','inproceedings','conference','thesis','mastersthesis','phdthesis','techreport','manual','unpublished','misc','online','patent','standard','dataset','software') NOT NULL DEFAULT 'article',
	`title` varchar(500) NOT NULL,
	`authors` text,
	`year` int,
	`journal` varchar(255),
	`booktitle` varchar(255),
	`publisher` varchar(255),
	`volume` varchar(50),
	`number` varchar(50),
	`pages` varchar(50),
	`edition` varchar(50),
	`chapter` varchar(100),
	`doi` varchar(100),
	`isbn` varchar(20),
	`issn` varchar(20),
	`pmid` varchar(20),
	`arxiv_id` varchar(50),
	`url` varchar(500),
	`abstract` text,
	`keywords` json,
	`language` varchar(50) DEFAULT 'en',
	`research_domain` enum('chimie_olfactive','botanique','ethnobotanique','histoire_parfumerie','neurologie_olfactive','extraction','formulation','reglementation','durabilite','tabac_cannabis','methodologie','autre'),
	`relevance_score` int DEFAULT 50,
	`tags` json,
	`notes` text,
	`annotation` text,
	`pdf_url` varchar(500),
	`read_status` enum('unread','reading','read','to_review') DEFAULT 'unread',
	`linked_molecule_ids` json,
	`linked_plant_ids` json,
	`linked_recette_ids` json,
	`added_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bibliography_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `bibliography_entries_entry_key_unique` UNIQUE(`entry_key`),
	CONSTRAINT `bibliography_entry_key_idx` UNIQUE(`entry_key`)
);
--> statement-breakpoint
CREATE TABLE `botanical_states` (
	`id` int AUTO_INCREMENT NOT NULL,
	`state_id` varchar(30) NOT NULL,
	`plant_id` int NOT NULL,
	`stage_name` varchar(100) NOT NULL,
	`stage_code` varchar(10),
	`stage_order` int NOT NULL,
	`stage_type` enum('germination','vegetatif','floraison','fructification','senescence','dormance','autre') NOT NULL,
	`description` text,
	`visual_characteristics` text,
	`duration` varchar(100),
	`transition_conditions` json,
	`olfactive_profile` text,
	`dominant_notes` json,
	`molecular_profile` json,
	`recommended_use` json,
	`harvest_recommendation` text,
	`image_url` varchar(500),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `botanical_states_id` PRIMARY KEY(`id`),
	CONSTRAINT `botanical_states_state_id_unique` UNIQUE(`state_id`)
);
--> statement-breakpoint
CREATE TABLE `cannabis_strains` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`genetic_lineage` text,
	`cannabinoid_profile` json,
	`terpene_profile` json,
	`odor_profile` text,
	`effect_profile` text,
	`growth_characteristics` text,
	`harvest_time` varchar(100),
	`yield_data` json,
	`medicinal_potential` text,
	`cultural_significance` text,
	`source_references` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cannabis_strains_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chemical_families` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('monoterpene','sesquiterpene','diterpene','triterpene','monoterpenoid','sesquiterpenoid','alcohol_aliphatic','alcohol_aromatic','alcohol_terpenic','aldehyde_aliphatic','aldehyde_aromatic','aldehyde_terpenic','ketone_aliphatic','ketone_aromatic','ketone_terpenic','ketone_macrocyclic','ester_aliphatic','ester_aromatic','ester_terpenic','ether_aliphatic','ether_aromatic','phenol','phenol_ether','lactone','lactone_macrocyclic','coumarin','musk_nitro','musk_polycyclic','musk_macrocyclic','musk_linear','nitrile','indole','pyrazine','pyridine','amine','sulfur_compound','thiophene','acid_carboxylic','acid_fatty','furan','heterocyclic_oxygen','heterocyclic_nitrogen','hydrocarbon_aromatic','hydrocarbon_aliphatic','oxide','acetals','anhydride','other') NOT NULL,
	`subcategory` varchar(100),
	`description` text,
	`olfactiveRole` text,
	`volatility` varchar(50),
	`polarity` varchar(50),
	`molecular_weight_range` varchar(50),
	`typical_notes` text,
	`example_molecules` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chemical_families_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chemotypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(50),
	`plant_id` int,
	`plant_name` varchar(255) NOT NULL,
	`latin_name` varchar(255),
	`dominant_molecule_id` int,
	`dominant_molecule_name` varchar(255) NOT NULL,
	`dominant_percentage` decimal(5,2),
	`dominant_percentage_min` int,
	`dominant_percentage_max` int,
	`secondary_molecules` json,
	`origin` varchar(255),
	`terroir` text,
	`altitude` varchar(100),
	`climate` varchar(255),
	`olfactive_profile` text,
	`olfactive_notes` json,
	`intensity` int,
	`therapeutic_properties` text,
	`contraindications` text,
	`toxicity` enum('faible','modérée','élevée'),
	`perfumery_use` text,
	`blending_notes` text,
	`recommended_dilution` varchar(100),
	`climatic_axis` enum('vent','bois','disparition','vent_bois','bois_disparition','vent_disparition'),
	`image_url` varchar(500),
	`notes` text,
	`references` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chemotypes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cigarillo_molecule_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cigarillo_recipe_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`role` varchar(100),
	`percentage` decimal(5,2),
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `cigarillo_molecule_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `cml_unique_link` UNIQUE(`cigarillo_recipe_id`,`molecule_id`)
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
	`wikidata_qid` varchar(20),
	`wikidata_enriched_at` timestamp,
	`europeana_entity_id` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `traditions_olfactives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `civilizational_markers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plant_id` int NOT NULL,
	`civilization` varchar(255) NOT NULL,
	`period` varchar(255),
	`start_year` int,
	`end_year` int,
	`usage_type` enum('ritual','medical','commercial','funerary','cosmetic') NOT NULL,
	`historical_significance` text,
	`trade_routes` json DEFAULT ('[]'),
	`archaeological_evidence` text,
	`primary_sources` json DEFAULT ('[]'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `civilizational_markers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classification_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule_id` int NOT NULL,
	`ai_chemical_class` varchar(100),
	`ai_chemical_class_confidence` int,
	`ai_chemical_class_reasoning` text,
	`ai_olfactive_family` varchar(100),
	`ai_olfactive_family_confidence` int,
	`ai_olfactive_family_reasoning` text,
	`ai_suggested_olfactive_profile` text,
	`ai_botanical_context_used` boolean DEFAULT false,
	`status` enum('pending','approved','rejected','modified','skipped') NOT NULL DEFAULT 'pending',
	`manual_chemical_class` varchar(100),
	`manual_olfactive_family` varchar(100),
	`manual_olfactive_profile` text,
	`review_notes` text,
	`priority` enum('low','medium','high') DEFAULT 'medium',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`reviewed_at` timestamp,
	`reviewed_by` int,
	CONSTRAINT `classification_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classification_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`snapshot_date` timestamp NOT NULL,
	`total_molecules` int NOT NULL,
	`molecules_with_family` int NOT NULL,
	`molecules_with_chemical_class` int NOT NULL,
	`molecules_with_cas_number` int NOT NULL,
	`molecules_with_iupac_name` int NOT NULL,
	`molecules_with_formula` int NOT NULL,
	`molecules_with_olfactive_profile` int NOT NULL,
	`molecules_with_radar` int NOT NULL,
	`molecules_linked_to_recettes` int NOT NULL,
	`molecules_linked_to_plants` int NOT NULL,
	`plants_linked_to_terroirs` int NOT NULL,
	`overall_classification_rate` int NOT NULL,
	`overall_linking_rate` int NOT NULL,
	`total_recettes` int NOT NULL,
	`total_plants` int NOT NULL,
	`total_terroirs` int NOT NULL,
	`total_accords` int NOT NULL,
	`notes` text,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `classification_snapshots_id` PRIMARY KEY(`id`)
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
CREATE TABLE `comparative_analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('terroir_comparison','variety_comparison','molecular_comparison','tradition_comparison','other') NOT NULL,
	`entities` text,
	`analysis_data` json,
	`visualization_url` varchar(500),
	`conclusions` text,
	`source_references` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comparative_analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `curated_journeys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`name_en` varchar(255),
	`description` text,
	`short_description` varchar(500),
	`theme` enum('geographic','olfactive','botanical','historical','seasonal','therapeutic','culinary','sacred','luxury','sustainable','custom') NOT NULL,
	`emoji` varchar(10),
	`cover_image_url` varchar(500),
	`color` varchar(20),
	`difficulty` enum('beginner','intermediate','advanced','expert') DEFAULT 'beginner',
	`estimated_duration` int,
	`terroir_count` int DEFAULT 0,
	`plant_count` int DEFAULT 0,
	`molecule_count` int DEFAULT 0,
	`is_published` boolean DEFAULT false,
	`is_featured` boolean DEFAULT false,
	`sort_order` int DEFAULT 0,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `curated_journeys_id` PRIMARY KEY(`id`),
	CONSTRAINT `curated_journeys_code_unique` UNIQUE(`code`),
	CONSTRAINT `journey_code_idx` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `entourage_rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rule_id` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`rule_type` enum('entourage','potentiation','modulation','stabilization','enhancement','contrast') NOT NULL,
	`primary_molecules` json,
	`secondary_molecules` json,
	`description` text NOT NULL,
	`mechanism` text,
	`olfactive_result` text,
	`applicable_to` json,
	`scientific_basis` text,
	`references` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `entourage_rules_id` PRIMARY KEY(`id`),
	CONSTRAINT `entourage_rules_rule_id_unique` UNIQUE(`rule_id`)
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
CREATE TABLE `extended_supplier_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplier_id` int NOT NULL,
	`plant_id` int,
	`variety_id` int,
	`terroir_id` int,
	`product_name` varchar(255) NOT NULL,
	`product_type` varchar(100),
	`price_per_kg` decimal(10,2),
	`currency` varchar(3) DEFAULT 'EUR',
	`price_date` timestamp,
	`availability` enum('in_stock','on_order','seasonal','limited','discontinued','unknown') DEFAULT 'unknown',
	`minimum_quantity` varchar(50),
	`quality_grade` varchar(50),
	`certifications` json,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `extended_supplier_materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `extended_suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplier_id` varchar(30) NOT NULL,
	`name` varchar(255) NOT NULL,
	`legal_name` varchar(255),
	`supplier_type` enum('producer','distiller','trader','cooperative','laboratory','broker','other') NOT NULL,
	`country` varchar(100),
	`address` text,
	`phone` varchar(50),
	`email` varchar(255),
	`website` varchar(500),
	`contact_person` varchar(255),
	`specialties` json,
	`main_products` json,
	`certifications` json,
	`minimum_order` varchar(100),
	`lead_time` varchar(100),
	`payment_terms` varchar(255),
	`shipping_methods` json,
	`quality_rating` enum('excellent','good','acceptable','poor','not_rated') DEFAULT 'not_rated',
	`reliability_rating` enum('excellent','good','acceptable','poor','not_rated') DEFAULT 'not_rated',
	`price_rating` enum('premium','competitive','standard','budget','not_rated') DEFAULT 'not_rated',
	`first_order_date` timestamp,
	`last_order_date` timestamp,
	`total_orders` int DEFAULT 0,
	`status` enum('active','inactive','blacklisted','prospect') DEFAULT 'active',
	`notes` text,
	`internal_notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `extended_suppliers_id` PRIMARY KEY(`id`),
	CONSTRAINT `extended_suppliers_supplier_id_unique` UNIQUE(`supplier_id`)
);
--> statement-breakpoint
CREATE TABLE `extraction_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`method_id` varchar(30) NOT NULL,
	`name` varchar(255) NOT NULL,
	`short_name` varchar(50),
	`category` enum('distillation','expression','extraction_solvant','co2_supercritique','enfleurage','maceration','hydrodistillation','percolation','other') NOT NULL,
	`description` text,
	`principle` text,
	`parameters` json,
	`equipment` json,
	`typical_yields` json,
	`molecular_impact` text,
	`preserved_molecules` json,
	`degraded_molecules` json,
	`advantages` json,
	`disadvantages` json,
	`best_for` json,
	`not_recommended_for` json,
	`cost_level` enum('low','medium','high','very_high') DEFAULT 'medium',
	`complexity_level` enum('simple','moderate','complex','expert') DEFAULT 'moderate',
	`notes` text,
	`references` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `extraction_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `extraction_methods_method_id_unique` UNIQUE(`method_id`)
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
CREATE TABLE `final_recipe_terp_profiles` (
	`final_recipe_id` int NOT NULL,
	`terp_profile_id` int NOT NULL,
	`percentage` decimal(5,2),
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `final_recipes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipe_id` varchar(20) NOT NULL,
	`name` varchar(255) NOT NULL,
	`recipe_type` enum('parfum','encens','espace') NOT NULL,
	`function` text,
	`climatic_axis` enum('vent','bois','disparition','vent_bois','bois_disparition','vent_disparition','vent_bois_disparition') NOT NULL,
	`base` varchar(255),
	`concentrate` json,
	`dilution` varchar(100),
	`rest_period` varchar(100),
	`form` text,
	`combustion_time` varchar(100),
	`protocol` text,
	`supports` text,
	`expected_result` text,
	`success_criteria` text,
	`risks` text,
	`notes` text,
	`usage` text,
	`terp_profile_ids` json,
	`is_radical` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `final_recipes_id` PRIMARY KEY(`id`),
	CONSTRAINT `final_recipes_recipe_id_unique` UNIQUE(`recipe_id`)
);
--> statement-breakpoint
CREATE TABLE `formulation_suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`suggestion_id` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`base_molecule_id` int,
	`base_molecule_name` varchar(255),
	`suggested_molecules` json,
	`synergy_rules` json,
	`expected_olfactive_profile` text,
	`expected_effects` json,
	`formulation_type` enum('parfum','encens','tabac_blend','cannabis_blend','hybrid') NOT NULL,
	`difficulty` enum('débutant','intermédiaire','avancé') DEFAULT 'intermédiaire',
	`technical_notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `formulation_suggestions_id` PRIMARY KEY(`id`),
	CONSTRAINT `formulation_suggestions_suggestion_id_unique` UNIQUE(`suggestion_id`)
);
--> statement-breakpoint
CREATE TABLE `genomic_molecule_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`link_type` enum('biosynthesis','characterization','quantification','pathway','gene_association','regulation','evolution','application','other') DEFAULT 'characterization',
	`genomic_axis` enum('G1','G2','G3') NOT NULL,
	`relevance_score` int DEFAULT 50,
	`confidence` enum('high','medium','low') DEFAULT 'medium',
	`gene_names` json,
	`pathway_name` varchar(255),
	`enzyme_names` json,
	`notes` text,
	`excerpt` text,
	`page_numbers` varchar(50),
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `genomic_molecule_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_genomic_ref_mol` UNIQUE(`reference_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `genomic_plant_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference_id` int NOT NULL,
	`plant_id` int NOT NULL,
	`link_type` enum('genome_sequencing','transcriptomics','metabolomics','phylogenetics','breeding','gene_editing','marker_development','comparative','other') DEFAULT 'genome_sequencing',
	`genomic_axis` enum('G1','G2','G3') NOT NULL,
	`relevance_score` int DEFAULT 50,
	`confidence` enum('high','medium','low') DEFAULT 'medium',
	`genome_version` varchar(100),
	`assembly_accession` varchar(100),
	`sequencing_method` varchar(255),
	`notes` text,
	`excerpt` text,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `genomic_plant_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_genomic_ref_plant` UNIQUE(`reference_id`,`plant_id`)
);
--> statement-breakpoint
CREATE TABLE `geographic_origins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`country` varchar(100) NOT NULL,
	`region` varchar(255),
	`terroir` text,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`altitude` int,
	`climate` varchar(100),
	`soil_type` varchar(255),
	`harvest_period` varchar(255),
	`production_method` text,
	`quality_indicators` text,
	`historical_context` text,
	`economic_importance` text,
	`sustainability_notes` text,
	`image_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `geographic_origins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `geographic_zones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`region` varchar(255) NOT NULL,
	`zone_type` enum('threatened_concentration','sustainable_alternatives','biodiversity_hotspot','conservation_area') NOT NULL,
	`coordinates` json NOT NULL,
	`description` text,
	`threat_level` enum('critical','high','medium','low','stable') DEFAULT 'medium',
	`species_count` int DEFAULT 0,
	`conservation_priority` enum('urgent','high','medium','low') DEFAULT 'medium',
	`overlay_color` varchar(7) DEFAULT '#FF0000',
	`overlay_opacity` decimal(3,2) DEFAULT '0.35',
	`sustainable_alternatives` text,
	`conservation_efforts` text,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `geographic_zones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ghost_varieties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`scientific_name` varchar(255),
	`common_names` json,
	`plant_family` varchar(255),
	`genus` varchar(255),
	`species` varchar(255),
	`cultivar` varchar(255),
	`variety_type` enum('rose','jasmine','tobacco','cannabis','lavender','citrus','aromatic_herb','resin_tree','other') NOT NULL,
	`conservation_status` enum('extinct','extinct_wild','critically_endangered','endangered','vulnerable','near_threatened','reconstructed','unknown') NOT NULL,
	`last_documented_year` int,
	`last_documented_location` varchar(255),
	`peak_cultivation_period` varchar(255),
	`disappearance_causes` json,
	`olfactive_profile` text,
	`molecular_profile` json,
	`reconstruction_attempts` json,
	`historical_sources` json,
	`description` text,
	`historical_significance` text,
	`notes` text,
	`image_url` varchar(500),
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ghost_varieties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ghost_variety_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ghost_variety_id` int NOT NULL,
	`url` text NOT NULL,
	`file_key` varchar(500) NOT NULL,
	`filename` varchar(255),
	`mime_type` varchar(50),
	`file_size` int,
	`title` varchar(255),
	`description` text,
	`image_type` enum('botanical_illustration','photograph','herbarium','reconstruction','artistic','microscopy','other') DEFAULT 'botanical_illustration',
	`source` varchar(500),
	`attribution` text,
	`year` int,
	`license` varchar(100),
	`sort_order` int DEFAULT 0,
	`is_primary` boolean DEFAULT false,
	`uploaded_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ghost_variety_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ghost_variety_molecule_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ghost_variety_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`link_type` enum('dominant','characteristic','trace','reconstructed','historical','hypothetical','other') DEFAULT 'characteristic',
	`percentage` decimal(5,2),
	`min_percentage` decimal(5,2),
	`max_percentage` decimal(5,2),
	`confidence` enum('high','medium','low') DEFAULT 'medium',
	`source_type` enum('gc_ms_analysis','historical_text','reconstruction','comparative','expert_opinion','other') DEFAULT 'other',
	`notes` text,
	`source_reference` text,
	`analysis_year` int,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ghost_variety_molecule_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_gv_molecule` UNIQUE(`ghost_variety_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `ghost_variety_plant_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ghost_variety_id` int NOT NULL,
	`plant_id` int NOT NULL,
	`relationship_type` enum('parent_species','related_variety','hybrid_parent','descendant','comparison','reconstruction_base','other') DEFAULT 'parent_species',
	`confidence` enum('high','medium','low') DEFAULT 'medium',
	`genetic_similarity` int,
	`notes` text,
	`source_reference` text,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ghost_variety_plant_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_gv_plant` UNIQUE(`ghost_variety_id`,`plant_id`)
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
CREATE TABLE `ifra_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`name_fr` varchar(255),
	`description` text,
	`description_fr` text,
	`examples` text,
	`examples_fr` text,
	`exposure_level` enum('very_high','high','medium','low','very_low'),
	`skin_contact` enum('direct_prolonged','direct_brief','indirect','none'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ifra_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `ifra_categories_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `ifra_restrictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule_id` int NOT NULL,
	`ifra_amendment` varchar(20),
	`effective_date` timestamp,
	`category_1` decimal(6,4),
	`category_2` decimal(6,4),
	`category_3` decimal(6,4),
	`category_4` decimal(6,4),
	`category_5a` decimal(6,4),
	`category_5b` decimal(6,4),
	`category_5c` decimal(6,4),
	`category_5d` decimal(6,4),
	`category_6` decimal(6,4),
	`category_7a` decimal(6,4),
	`category_7b` decimal(6,4),
	`category_8` decimal(6,4),
	`category_9` decimal(6,4),
	`category_10a` decimal(6,4),
	`category_10b` decimal(6,4),
	`category_11a` decimal(6,4),
	`category_11b` decimal(6,4),
	`restriction_type` enum('prohibited','restricted','specification','no_restriction') DEFAULT 'no_restriction',
	`reason_for_restriction` text,
	`alternative_suggestions` text,
	`notes` text,
	`source_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ifra_restrictions_id` PRIMARY KEY(`id`)
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
CREATE TABLE `inventory_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entry_id` varchar(30) NOT NULL,
	`raw_material_id` int NOT NULL,
	`purchase_date` timestamp NOT NULL,
	`supplier_id` int,
	`supplier_name` varchar(255),
	`quantity` decimal(10,2) NOT NULL,
	`unit` enum('ml','g','kg','L','oz','lb') NOT NULL DEFAULT 'ml',
	`remaining_quantity` decimal(10,2),
	`price` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'CHF',
	`price_per_unit` decimal(10,4),
	`batch_number` varchar(100),
	`expiration_date` timestamp,
	`storage_location` varchar(255),
	`storage_conditions` text,
	`notes` text,
	`quality_notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inventory_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `inventory_entries_entry_id_unique` UNIQUE(`entry_id`)
);
--> statement-breakpoint
CREATE TABLE `journey_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`journey_id` int NOT NULL,
	`item_type` enum('terroir','plant','molecule') NOT NULL,
	`terroir_id` int,
	`plant_id` int,
	`molecule_id` int,
	`sort_order` int DEFAULT 0,
	`step_number` int,
	`group_name` varchar(100),
	`context_description` text,
	`is_highlight` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `journey_items_id` PRIMARY KEY(`id`)
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
CREATE TABLE `landraces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`origin_country` varchar(100) NOT NULL,
	`origin_region` varchar(255),
	`native_terroir` int,
	`historical_period` varchar(100),
	`cultural_significance` text,
	`genetic_diversity` text,
	`molecular_profile` json,
	`aroma_characteristics` text,
	`flavor_profile` text,
	`growth_characteristics` text,
	`yield_data` json,
	`disease_resistance` text,
	`climate_adaptation` text,
	`modern_availability` varchar(100),
	`seed_banks` text,
	`modern_substitutes` text,
	`conservation_status` varchar(100),
	`studies_and_research` text,
	`source_references` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `landraces_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leaf_economies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sample_id` varchar(50) NOT NULL,
	`date` timestamp,
	`island` enum('san_andres','providencia','autre'),
	`precise_location` varchar(255),
	`source_contact` text,
	`category` enum('aromatique','tabac','cannabis') NOT NULL,
	`species` varchar(255),
	`claimed_variety` varchar(255),
	`used_part` enum('feuille','fleur','resine','tige','autre'),
	`state` enum('frais','sec','rehydrate'),
	`curing_treatment` enum('aucun','air_cured','flue_cured','sun_cured','autre'),
	`extraction` enum('aucune','maceration_alcool','maceration_mct','distillation','headspace'),
	`ratio_parameters` varchar(255),
	`duration` varchar(100),
	`odor_notes` text,
	`climatic_axis` text,
	`usage` text,
	`analysis_available` int DEFAULT 0,
	`analysis_method` enum('gc_ms','hplc','autre'),
	`top_molecules_list` text,
	`top_molecule_1` varchar(255),
	`top_molecule_2` varchar(255),
	`top_molecule_3` varchar(255),
	`relative_percentages` text,
	`absorbe_interpretation` text,
	`status` enum('brut','a_analyser','analyse','traduction','archive') DEFAULT 'brut',
	`media_links` text,
	`image_url` varchar(500),
	`ethical_notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaf_economies_id` PRIMARY KEY(`id`),
	CONSTRAINT `leaf_economies_sample_id_unique` UNIQUE(`sample_id`)
);
--> statement-breakpoint
CREATE TABLE `leaf_economy_molecules` (
	`leaf_economy_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`percentage` decimal(5,2),
	`notes` text
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
CREATE TABLE `molecular_interactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`interaction_id` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`source_category` enum('tabac_cannabis','tabac_parfum','cannabis_parfum','tabac_cannabis_parfum') NOT NULL,
	`molecule1_id` int,
	`molecule2_id` int,
	`molecule3_id` int,
	`terpene_profile` json,
	`synergy_type` enum('entourage','potentiation','bridge','stabilization','transformation','masking') NOT NULL,
	`compatibility_score` int NOT NULL DEFAULT 50,
	`description` text,
	`olfactive_result` text,
	`applications` text,
	`scientific_basis` text,
	`references` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `molecular_interactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `molecular_interactions_interaction_id_unique` UNIQUE(`interaction_id`)
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
CREATE TABLE `molecular_transformations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_molecule_id` int,
	`source_molecule_name` varchar(255) NOT NULL,
	`product_molecule_id` int,
	`product_molecule_name` varchar(255) NOT NULL,
	`transformation_type` enum('pyrolysis','oxidation','isomerization','dehydration','cyclization','ring_opening','polymerization','degradation','maillard','caramelization','other') NOT NULL DEFAULT 'pyrolysis',
	`temperature_min` int,
	`temperature_max` int,
	`temperature_optimal` int,
	`time_seconds` int,
	`atmosphere` enum('air','nitrogen','vacuum','oxygen','mixed') DEFAULT 'air',
	`yield_percent` decimal(5,2),
	`reaction_order` varchar(50),
	`activation_energy` decimal(10,2),
	`olfactory_change_description` text,
	`source_olfactory_notes` varchar(500),
	`product_olfactory_notes` varchar(500),
	`relevance_context` enum('tobacco_combustion','tobacco_heating','incense_burning','essential_oil_distillation','perfume_aging','food_cooking','industrial_process','natural_degradation','other') DEFAULT 'tobacco_combustion',
	`source_reference` text,
	`doi` varchar(255),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `molecular_transformations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `molecule_accords` (
	`moleculeId` int NOT NULL,
	`accordId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `molecule_analytical_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule_id` int NOT NULL,
	`method_id` int NOT NULL,
	`is_primary` boolean DEFAULT false,
	`detection_limit` decimal(10,6),
	`detection_unit` varchar(20),
	`accuracy` decimal(5,2),
	`analysis_date` timestamp,
	`laboratory_name` varchar(255),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `molecule_analytical_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_molecule_method` UNIQUE(`molecule_id`,`method_id`)
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
CREATE TABLE `molecule_origins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule_id` int NOT NULL,
	`origin_id` int NOT NULL,
	`is_primary_origin` int DEFAULT 0,
	`quality_rating` int,
	`production_volume` varchar(100),
	`price_range` varchar(100),
	`specific_characteristics` text,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `molecule_origins_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_molecule_origin` UNIQUE(`molecule_id`,`origin_id`)
);
--> statement-breakpoint
CREATE TABLE `molecule_perfumes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule_id` int NOT NULL,
	`perfume_name` varchar(255) NOT NULL,
	`perfume_house` varchar(255) NOT NULL,
	`perfumer` varchar(255),
	`year` int,
	`role_in_perfume` enum('accord_principal','note_coeur','note_tete','note_fond','signature','ingredient_cle') NOT NULL DEFAULT 'ingredient_cle',
	`concentration` varchar(100),
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `molecule_perfumes_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_molecule_perfume` UNIQUE(`molecule_id`,`perfume_name`)
);
--> statement-breakpoint
CREATE TABLE `molecule_plant_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule_id` int NOT NULL,
	`plant_id` int NOT NULL,
	`plant_part` varchar(100),
	`percentage_in_plant` decimal(5,3),
	`percentage_in_oil` decimal(5,2),
	`variability` enum('stable','variable','tres_variable','chemotype_dependant'),
	`is_main_source` int DEFAULT 0,
	`is_primary_source` int DEFAULT 0,
	`best_extraction_method` varchar(100),
	`extraction_yield` decimal(5,3),
	`references` json,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `molecule_plant_sources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `molecule_synergies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule1_id` int NOT NULL,
	`molecule2_id` int NOT NULL,
	`type` enum('potentialisation','stabilisation','transformation','masquage','neutralisation') NOT NULL,
	`description` text NOT NULL,
	`chemical_mechanism` text,
	`applications` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `molecule_synergies_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_molecule_pair` UNIQUE(`molecule1_id`,`molecule2_id`)
);
--> statement-breakpoint
CREATE TABLE `molecules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`iupac_name` varchar(500),
	`cas_number` varchar(20),
	`chemical_class` enum('terpene','sesquiterpene','diterpene','monoterpene','aldehyde','ketone','alcohol','ester','ether','phenol','lactone','coumarin','musk','nitrile','sulfur_compound','heterocyclic','aromatic','aliphatic','other'),
	`family` text,
	`chemicalFormula` varchar(100),
	`olfactiveProfile` text,
	`olfactive_profile_json` json,
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
	`therapeutic_properties_json` json,
	`radar_intensity` int DEFAULT 50,
	`radar_freshness` int DEFAULT 50,
	`radar_warmth` int DEFAULT 50,
	`radar_sweetness` int DEFAULT 50,
	`radar_spiciness` int DEFAULT 50,
	`radar_earthiness` int DEFAULT 50,
	`pubchem_cid` int,
	`smiles` text,
	`inchi` text,
	`inchi_key` varchar(27),
	`exact_mass` decimal(12,6),
	`xlogp` decimal(6,2),
	`tpsa` decimal(8,2),
	`h_bond_donor_count` int,
	`h_bond_acceptor_count` int,
	`rotatable_bond_count` int,
	`heavy_atom_count` int,
	`pubchem_synonyms` json,
	`pubchem_enriched_at` timestamp,
	`chebi_id` varchar(50),
	`chebi_enriched_at` timestamp,
	`coconut_id` varchar(100),
	`np_likeness_score` decimal(10,4),
	`coconut_organisms` json,
	`coconut_citations` json,
	`coconut_enriched_at` timestamp,
	`wikidata_qid` varchar(20),
	`wikidata_enriched_at` timestamp,
	`ifra_status` enum('not_regulated','banned','restricted','specification_required') DEFAULT 'not_regulated',
	`ifra_data` json,
	`ifra_enriched_at` timestamp,
	`references` json,
	`validation_status` enum('brouillon','en_revision','valide','rejete') DEFAULT 'valide',
	`validated_by` int,
	`validated_at` timestamp,
	`contributor_id` int,
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
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('import_orphan_molecules','new_contribution','validation_required','classification_milestone','system_alert','data_quality','other') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`severity` enum('info','warning','error','success') NOT NULL DEFAULT 'info',
	`entity_type` varchar(50),
	`entity_id` int,
	`metadata` json,
	`is_read` boolean NOT NULL DEFAULT false,
	`read_at` timestamp,
	`read_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `olfactive_archives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`type` enum('manuscript','formula','archaeological','botanical_illustration') NOT NULL,
	`date_created` varchar(100),
	`civilization` varchar(255),
	`plant_ids` json DEFAULT ('[]'),
	`molecule_ids` json DEFAULT ('[]'),
	`description` text,
	`provenance` text,
	`authenticity_level` enum('confirmed','probable','hypothetical') NOT NULL DEFAULT 'probable',
	`references` json DEFAULT ('[]'),
	`image_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `olfactive_archives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `olfactive_emissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plant_id` int,
	`molecule_id` int,
	`tabac_id` int,
	`plant_part` enum('fleur','feuille','fruit','zeste','graine','ecorce','bois','racine','rhizome','resine','plante_entiere','autre'),
	`extraction_method` enum('hydrodistillation','entrainement_vapeur','expression_a_froid','extraction_co2','enfleurage','maceration','teinture','solvant_organique','pyrolyse','headspace','spme','autre'),
	`percentage` decimal(8,4),
	`percentage_min` decimal(8,4),
	`percentage_max` decimal(8,4),
	`concentration_ppm` decimal(12,4),
	`concentration_unit` varchar(20) DEFAULT '%',
	`analysis_method` enum('gc_ms','gc_fid','hplc','rnm','headspace_gcms','spme_gcms','autre'),
	`analysis_source` varchar(500),
	`geographic_origin` varchar(255),
	`retention_time` decimal(8,4),
	`match_quality` int,
	`period_start` int,
	`period_end` int,
	`role` enum('majeur','secondaire','trace','variable','signature'),
	`is_signature` boolean DEFAULT false,
	`source_table` varchar(100),
	`source_id` int,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `olfactive_emissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `olfactory_traditions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`period` varchar(100),
	`start_year` int,
	`end_year` int,
	`region` varchar(255),
	`civilization` varchar(255),
	`description` text,
	`historical_context` text,
	`known_ingredients` json,
	`techniques` json,
	`reconstruction_status` enum('documented','partial','reconstructed','speculative') DEFAULT 'documented',
	`primary_sources` text,
	`modern_sources` text,
	`tags` json,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `olfactory_traditions_id` PRIMARY KEY(`id`),
	CONSTRAINT `olfactory_traditions_code_unique` UNIQUE(`code`),
	CONSTRAINT `tradition_code_idx` UNIQUE(`code`)
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
CREATE TABLE `plant_analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analysis_id` varchar(30) NOT NULL,
	`plant_id` int,
	`variety_id` int,
	`sample_id` int,
	`analysis_date` timestamp,
	`laboratory` varchar(255),
	`analyst` varchar(255),
	`method` enum('gc_ms','gc_fid','hplc','nmr','ir','other') DEFAULT 'gc_ms',
	`conditions` json,
	`molecular_profile` json,
	`total_compounds_identified` int,
	`major_compounds` json,
	`olfactive_classification` json,
	`quality_score` enum('excellent','good','acceptable','poor','invalid') DEFAULT 'good',
	`quality_notes` text,
	`raw_data_url` varchar(500),
	`report_url` varchar(500),
	`chromatogram_url` varchar(500),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plant_analyses_id` PRIMARY KEY(`id`),
	CONSTRAINT `plant_analyses_analysis_id_unique` UNIQUE(`analysis_id`)
);
--> statement-breakpoint
CREATE TABLE `plant_contributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plant_id` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`user_name` varchar(255),
	`contribution_type` enum('image','molecule','terroir','note') NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`image_url` text,
	`image_caption` varchar(500),
	`image_source` varchar(500),
	`molecule_id` int,
	`molecule_name` varchar(255),
	`molecule_concentration` varchar(100),
	`molecule_source` varchar(500),
	`terroir` varchar(255),
	`region` varchar(255),
	`country` varchar(255),
	`terroir_notes` text,
	`note_content` text,
	`note_category` varchar(100),
	`description` text,
	`references` text,
	`admin_notes` text,
	`reviewed_by` varchar(255),
	`reviewed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plant_contributions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plant_extractions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plant_id` int NOT NULL,
	`extraction_method_id` int NOT NULL,
	`plant_part` varchar(100),
	`yield_percent` decimal(5,3),
	`yield_notes` text,
	`product_type` varchar(100),
	`product_quality` text,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `plant_extractions_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_plant_extraction` UNIQUE(`plant_id`,`extraction_method_id`)
);
--> statement-breakpoint
CREATE TABLE `plant_geographic_zones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plant_id` int NOT NULL,
	`zone_id` int NOT NULL,
	`is_primary_zone` boolean DEFAULT false,
	`population_status` enum('abundant','common','rare','critically_rare','extinct') DEFAULT 'common',
	`notes` text,
	CONSTRAINT `plant_geographic_zones_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_plant_zone` UNIQUE(`plant_id`,`zone_id`)
);
--> statement-breakpoint
CREATE TABLE `plant_molecules` (
	`plant_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`percentage_min` decimal(5,2),
	`percentage_max` decimal(5,2),
	`percentage_typical` decimal(5,2),
	`percentage` decimal(5,2),
	`is_signature` int DEFAULT 0,
	`role` enum('majeur','secondaire','trace','variable'),
	`variability_factor` enum('stable','saisonnier','geographique','chemotype','extraction'),
	`source` varchar(255),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plant_molecules_pk` UNIQUE(`plant_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `plant_samples` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sample_id` varchar(30) NOT NULL,
	`batch_number` varchar(50),
	`plant_id` int NOT NULL,
	`variety_id` int,
	`terroir_id` int,
	`supplier_id` int,
	`harvest_date` timestamp,
	`harvest_year` int,
	`harvest_location` varchar(255),
	`harvest_method` varchar(100),
	`plant_part` enum('feuille','fleur','fruit','graine','racine','ecorce','bois','resine','plante_entiere','autre') DEFAULT 'feuille',
	`botanical_state` varchar(50),
	`processing_method` varchar(255),
	`processing_date` timestamp,
	`extraction_method_id` int,
	`initial_quantity` varchar(50),
	`current_quantity` varchar(50),
	`unit` varchar(20),
	`storage_location` varchar(255),
	`storage_conditions` json,
	`expiration_date` timestamp,
	`quality_grade` enum('premium','standard','economy','research','expired','unknown') DEFAULT 'unknown',
	`quality_notes` text,
	`certifications` json,
	`purchase_price` decimal(10,2),
	`currency` varchar(3) DEFAULT 'EUR',
	`price_per_unit` decimal(10,2),
	`status` enum('available','reserved','in_use','depleted','expired','disposed') DEFAULT 'available',
	`notes` text,
	`image_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plant_samples_id` PRIMARY KEY(`id`),
	CONSTRAINT `plant_samples_sample_id_unique` UNIQUE(`sample_id`)
);
--> statement-breakpoint
CREATE TABLE `plant_terroirs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plant_id` int NOT NULL,
	`terroir_id` int NOT NULL,
	`local_name` varchar(255),
	`cultivation_start` int,
	`annual_production` varchar(100),
	`quality_notes` text,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `plant_terroirs_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_plant_terroir` UNIQUE(`plant_id`,`terroir_id`)
);
--> statement-breakpoint
CREATE TABLE `plant_varieties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`variety_id` varchar(30) NOT NULL,
	`plant_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`latin_name` varchar(255),
	`variety_type` enum('cultivar','chemotype','landrace','hybrid','clone','wild','other') NOT NULL,
	`breeder` varchar(255),
	`year_registered` int,
	`country_of_origin` varchar(100),
	`parent_varieties` json,
	`distinctive_features` text,
	`morphology` json,
	`dominant_molecules` json,
	`molecular_profile` json,
	`olfactive_description` text,
	`olfactive_notes` json,
	`yield_per_hectare` varchar(50),
	`essential_oil_yield` varchar(50),
	`harvest_period` varchar(100),
	`optimal_harvest_stage` varchar(100),
	`commercial_availability` enum('widely_available','limited','rare','research_only','extinct','unknown') DEFAULT 'unknown',
	`suppliers` json,
	`conservation_status` enum('critical','endangered','vulnerable','near_threatened','stable','data_deficient','unknown') DEFAULT 'unknown',
	`conservation_notes` text,
	`threat_factors` json,
	`conservation_efforts` text,
	`last_assessment_date` timestamp,
	`notes` text,
	`references` json,
	`image_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plant_varieties_id` PRIMARY KEY(`id`),
	CONSTRAINT `plant_varieties_variety_id_unique` UNIQUE(`variety_id`)
);
--> statement-breakpoint
CREATE TABLE `plants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`latin_name` varchar(255),
	`family` varchar(100),
	`category` enum('aromatique','tabac','cannabis','resine','bois','fleur','racine','autre') NOT NULL,
	`origin` varchar(255),
	`habitat` text,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`latitude_min` decimal(10,7),
	`latitude_max` decimal(10,7),
	`altitude_min` int,
	`altitude_max` int,
	`koppen_zone` varchar(50),
	`koppen_description` varchar(100),
	`precipitation_min` int,
	`precipitation_max` int,
	`temperature_min` int,
	`temperature_max` int,
	`olfactive_signature` text,
	`dominant_molecules` text,
	`chemotypes` text,
	`climatic_axis` enum('vent','bois','disparition','vent_bois','bois_disparition','vent_disparition'),
	`traditional_use` text,
	`absorbe_use` text,
	`botanical_states` json,
	`conservation_status` enum('EX','EW','CR','EN','VU','NT','LC','DD','NE'),
	`cites_appendix` enum('I','II','III','NONE','UNKNOWN'),
	`conservation_notes` text,
	`threat_factors` json,
	`sustainable_alternatives` text,
	`last_assessment_year` int,
	`historical_status` varchar(32),
	`synonyms` json,
	`author_citation` varchar(255),
	`gbif_id` varchar(50),
	`itis_id` varchar(50),
	`pow_id` varchar(50),
	`wikidata_qid` varchar(20),
	`wikidata_enriched_at` timestamp,
	`notes` text,
	`image_url` varchar(500),
	`validation_status` enum('brouillon','en_revision','valide','rejete') DEFAULT 'valide',
	`validated_by` int,
	`validated_at` timestamp,
	`contributor_id` int,
	`material_type` enum('plante_vasculaire','mousse_lichen','algue','champignon','huile_essentielle','absolue','concrete','resinoid','co2_extract','hydrolat','teinture','infusion','beurre_vegetal','cire_vegetale','resine_brute','graine_seche','fruit_sec','racine_rhizome','ecorce','bois_copeaux','secretion_animale','accord_olfactif','synthese_chimique'),
	`plant_part` enum('fleur','feuille','fruit','zeste','graine','arille','ecorce','bois','racine','rhizome','bulbe','resine','feuille_tige','plante_entiere','thalle','champignon','autre'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plants_id` PRIMARY KEY(`id`)
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
CREATE TABLE `publication_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publication_id` int NOT NULL,
	`method_id` int NOT NULL,
	`is_primary` boolean DEFAULT false,
	`notes` text,
	CONSTRAINT `publication_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_pub_method` UNIQUE(`publication_id`,`method_id`)
);
--> statement-breakpoint
CREATE TABLE `publication_molecules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publication_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`study_type` enum('source','product','analyte','reference') DEFAULT 'analyte',
	`notes` text,
	CONSTRAINT `publication_molecules_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_pub_molecule` UNIQUE(`publication_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `publication_researchers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publication_id` int NOT NULL,
	`researcher_id` int NOT NULL,
	`role` enum('lead','corresponding','co-author') DEFAULT 'co-author',
	`author_order` int,
	CONSTRAINT `publication_researchers_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_pub_researcher` UNIQUE(`publication_id`,`researcher_id`)
);
--> statement-breakpoint
CREATE TABLE `publication_transformations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publication_id` int NOT NULL,
	`transformation_id` int NOT NULL,
	`is_key_finding` boolean DEFAULT false,
	`notes` text,
	CONSTRAINT `publication_transformations_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_pub_transformation` UNIQUE(`publication_id`,`transformation_id`)
);
--> statement-breakpoint
CREATE TABLE `pyrazines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`chemical_formula` varchar(50) NOT NULL,
	`molecular_weight` decimal,
	`structure` text,
	`odor_profile` text,
	`odor_threshold` decimal,
	`volatility` varchar(100),
	`boiling_point` decimal,
	`melting_point` decimal,
	`stability` text,
	`tobacco_contribution` text,
	`volcanic_profile` text,
	`tobacco_varieties_containing` text,
	`perfumery_potential` text,
	`pyrolysis_transformations` text,
	`source_references` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pyrazines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pyrolysis_transformations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`original_molecule_id` int NOT NULL,
	`product_molecule_id` int NOT NULL,
	`temperature` int,
	`duration` int,
	`oxygen` varchar(50),
	`yield_percentage` decimal,
	`conditions` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pyrolysis_transformations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `raw_material_molecules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`raw_material_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`percentage` decimal(5,2),
	`is_signature` int DEFAULT 0,
	`variability` varchar(50),
	`notes` text,
	CONSTRAINT `raw_material_molecules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `raw_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`material_id` varchar(30) NOT NULL,
	`name` varchar(255) NOT NULL,
	`latin_name` varchar(255),
	`category` enum('huile_essentielle','absolue','concrete','resinoid','teinture','co2_extract','hydrolat','beurre','cire','oleoresine','infusion','maceration','distillat','accord_olfactif','molecule_isolee','matiere_animale','autre') NOT NULL,
	`plant_id` int,
	`plant_part` enum('fleur','feuille','tige','racine','ecorce','bois','resine','graine','fruit','zeste','plante_entiere','bourgeon','autre'),
	`terroir_id` int,
	`origin_country` varchar(100),
	`origin_region` varchar(255),
	`extraction_method_id` int,
	`extraction_yield` decimal(5,3),
	`extraction_notes` text,
	`olfactive_family` enum('floral','boise','agrume','epice','herbace','balsamique','musque','animal','vert','fruité','marin','terreux','fumé','gourmand','aromatique','autre'),
	`olfactive_profile` text,
	`top_notes` text,
	`heart_notes` text,
	`base_notes` text,
	`intensity` int,
	`tenacity` int,
	`dominant_molecules` json,
	`quality` enum('conventionnel','bio','sauvage','biodynamique','aop','igp','fair_trade'),
	`certifications` json,
	`ifra_category` varchar(50),
	`max_usage_level` decimal(5,2),
	`restrictions` text,
	`allergens` json,
	`price_range` enum('economique','standard','premium','luxe','rare'),
	`availability` enum('disponible','saisonnier','rare','en_rupture','discontinue'),
	`suppliers` json,
	`usage_notes` text,
	`blending_tips` text,
	`synergies` json,
	`image_url` varchar(500),
	`references` json,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `raw_materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `raw_materials_material_id_unique` UNIQUE(`material_id`)
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
CREATE TABLE `recette_raw_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recette_id` int NOT NULL,
	`raw_material_id` int NOT NULL,
	`role` enum('base','coeur','tete','fixateur','modificateur','autre') DEFAULT 'autre',
	`dosage` decimal(8,3),
	`dosage_unit` varchar(20) DEFAULT 'g',
	`percentage` decimal(5,2),
	`notes` text,
	`sort_order` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recette_raw_materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `rrm_unique_link` UNIQUE(`recette_id`,`raw_material_id`)
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
CREATE TABLE `reference_citations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`citing_id` int NOT NULL,
	`cited_id` int NOT NULL,
	`citation_type` enum('direct','indirect','methodological','theoretical','data','critique','support','comparison') DEFAULT 'direct',
	`context` text,
	`page_number` varchar(50),
	`notes` text,
	`weight` int DEFAULT 1,
	`verified` boolean DEFAULT false,
	`verified_by` int,
	`verified_at` timestamp,
	`added_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reference_citations_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_reference_citation` UNIQUE(`citing_id`,`cited_id`)
);
--> statement-breakpoint
CREATE TABLE `reference_entity_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference_id` int NOT NULL,
	`entity_type` enum('leaf_economy','molecule','recette','plant','prototype','tradition','terroir','supplier') NOT NULL,
	`entity_id` int NOT NULL,
	`link_type` enum('documents','mentions','analyzes','conserves','reconstructs','sources','validates','contextualizes') DEFAULT 'documents',
	`relevance_score` int DEFAULT 50,
	`notes` text,
	`context` text,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reference_entity_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_ref_entity_link` UNIQUE(`reference_id`,`entity_type`,`entity_id`)
);
--> statement-breakpoint
CREATE TABLE `reference_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference_id` int NOT NULL,
	`note_type` enum('summary','critique','quote','methodology','connection','idea','question','todo','general') DEFAULT 'general',
	`title` varchar(255),
	`content` text NOT NULL,
	`page_number` varchar(50),
	`importance` enum('low','medium','high','critical') DEFAULT 'medium',
	`is_resolved` boolean DEFAULT false,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reference_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reference_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`category` enum('theme','method','source_type','region','period','material','discipline','project','custom') DEFAULT 'custom',
	`description` text,
	`color` varchar(20) DEFAULT '#6b7280',
	`parent_id` int,
	`usage_count` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reference_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `reference_tags_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `ref_tag_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `research_axes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`axis_code` varchar(20) NOT NULL,
	`name` varchar(255) NOT NULL,
	`subtitle` varchar(255),
	`description` text,
	`objectives` text,
	`methodology` text,
	`category` enum('fondamental','applique','experimental','theorique','historique','ethnographique','technique') DEFAULT 'fondamental',
	`status` enum('planifie','en_cours','pause','termine','archive') DEFAULT 'planifie',
	`priority` enum('haute','moyenne','basse') DEFAULT 'moyenne',
	`start_date` timestamp,
	`target_end_date` timestamp,
	`actual_end_date` timestamp,
	`progress_percent` int DEFAULT 0,
	`color` varchar(20) DEFAULT '#6366f1',
	`icon` varchar(50),
	`parent_axis_id` int,
	`tags` json,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_axes_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_axes_axis_code_unique` UNIQUE(`axis_code`),
	CONSTRAINT `research_axis_code_idx` UNIQUE(`axis_code`)
);
--> statement-breakpoint
CREATE TABLE `research_claims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`claim_id` varchar(50) NOT NULL,
	`claim` text NOT NULL,
	`region` varchar(255),
	`claim_type` enum('ethnobotanical','scientific','historical','traditional','chemical','therapeutic') NOT NULL,
	`source_id` int,
	`status` enum('validated','pending','in_progress','to_source','disputed') NOT NULL DEFAULT 'pending',
	`evidence` text,
	`citation` text,
	`notes` text,
	`related_entities` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_claims_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_claims_claim_id_unique` UNIQUE(`claim_id`)
);
--> statement-breakpoint
CREATE TABLE `research_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entry_code` varchar(50) NOT NULL,
	`axis_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`summary` text,
	`entry_type` enum('note','observation','hypothese','resultat','conclusion','question','idee','protocole','donnees','analyse','reference','citation','media','lien','autre') DEFAULT 'note',
	`status` enum('brouillon','en_revision','valide','archive') DEFAULT 'brouillon',
	`importance` enum('critique','haute','moyenne','basse','reference') DEFAULT 'moyenne',
	`entry_date` timestamp,
	`attachments` json,
	`bibliography_ids` json,
	`linked_molecule_ids` json,
	`linked_plant_ids` json,
	`linked_recette_ids` json,
	`linked_prototype_ids` json,
	`tags` json,
	`sort_order` int DEFAULT 0,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_entries_entry_code_unique` UNIQUE(`entry_code`),
	CONSTRAINT `research_entry_code_idx` UNIQUE(`entry_code`)
);
--> statement-breakpoint
CREATE TABLE `research_institutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`short_name` varchar(100),
	`city` varchar(100),
	`state` varchar(100),
	`country` varchar(100) NOT NULL,
	`institution_type` enum('university','national_lab','research_institute','government','industry','independent','other') DEFAULT 'other',
	`department` varchar(255),
	`research_group` varchar(255),
	`research_focus` json,
	`total_citations` int DEFAULT 0,
	`publication_count` int DEFAULT 0,
	`website` varchar(500),
	`description` text,
	`key_contributions` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_institutions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `research_publications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ref_code` varchar(50) NOT NULL,
	`title` varchar(500) NOT NULL,
	`authors` text NOT NULL,
	`lead_author` varchar(255),
	`year` int NOT NULL,
	`journal` varchar(255),
	`volume` varchar(50),
	`pages` varchar(50),
	`doi` varchar(255),
	`pmc_id` varchar(50),
	`citations` int DEFAULT 0,
	`citations_date` timestamp,
	`research_focus` enum('pyrolysis','combustion','vaporization','terpene_degradation','cannabinoid_degradation','smoke_characterization','analytical_methods','taxonomy','other') DEFAULT 'other',
	`subject_matter` enum('cannabis','tobacco','both','terpenes','general') DEFAULT 'general',
	`temperature_min` int,
	`temperature_max` int,
	`temperature_range` varchar(100),
	`analytes` json,
	`sample_types` json,
	`key_findings` text,
	`advantages` json,
	`limitations` json,
	`abstract` text,
	`url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_publications_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_publications_ref_code_unique` UNIQUE(`ref_code`)
);
--> statement-breakpoint
CREATE TABLE `research_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` varchar(50) NOT NULL,
	`reference` text NOT NULL,
	`url` varchar(500),
	`quality` enum('high','medium','low') NOT NULL DEFAULT 'medium',
	`scope` enum('international','scientific','professional','academic','traditional','other') NOT NULL DEFAULT 'other',
	`status` enum('validated','pending','disputed') NOT NULL DEFAULT 'pending',
	`key_excerpts` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_sources_source_id_unique` UNIQUE(`source_id`)
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
CREATE TABLE `researcher_institutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`researcher_id` int NOT NULL,
	`institution_id` int NOT NULL,
	`is_primary` boolean DEFAULT true,
	`start_year` int,
	`end_year` int,
	`position` varchar(255),
	CONSTRAINT `researcher_institutions_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_researcher_institution` UNIQUE(`researcher_id`,`institution_id`)
);
--> statement-breakpoint
CREATE TABLE `researchers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`first_name` varchar(100),
	`last_name` varchar(100),
	`status` enum('active','inactive','retired','industry','unknown') DEFAULT 'unknown',
	`status_details` varchar(255),
	`research_focus` json,
	`expertise_domains` json,
	`total_citations` int DEFAULT 0,
	`publication_count` int DEFAULT 0,
	`h_index` int,
	`awards` json,
	`email` varchar(255),
	`orcid` varchar(50),
	`google_scholar` varchar(255),
	`research_gate` varchar(255),
	`bio` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `researchers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sample_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`description` text,
	`url` varchar(500) NOT NULL,
	`file_key` varchar(255) NOT NULL,
	`file_name` varchar(255),
	`mime_type` varchar(100),
	`file_size` int,
	`width` int,
	`height` int,
	`leaf_economy_id` int,
	`plant_id` int,
	`category` enum('echantillon','extraction','analyse','terrain','equipement','autre') DEFAULT 'echantillon',
	`tags` json,
	`captured_at` timestamp,
	`location` varchar(255),
	`photographer` varchar(255),
	`uploaded_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sample_images_id` PRIMARY KEY(`id`)
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
CREATE TABLE `sustainable_alternatives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`threatened_plant_id` int NOT NULL,
	`threatened_plant_name` varchar(255) NOT NULL,
	`alternative_plant_id` int,
	`alternative_name` varchar(255) NOT NULL,
	`alternative_type` enum('natural_plant','cultivated','synthetic','biotechnology','blend','other') NOT NULL,
	`olfactive_similarity` enum('identical','very_similar','similar','partial','inspired','different') DEFAULT 'similar',
	`olfactive_notes` text,
	`availability` enum('widely_available','available','limited','rare','research_only') DEFAULT 'available',
	`sustainability_score` int,
	`certifications` json,
	`price_comparison` enum('much_cheaper','cheaper','similar','more_expensive','much_more_expensive') DEFAULT 'similar',
	`suppliers` json,
	`usage_recommendations` text,
	`key_molecules` json,
	`references` json,
	`notes` text,
	`verified` boolean DEFAULT false,
	`verified_by` varchar(255),
	`verified_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sustainable_alternatives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `synergies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`tabac_id` int,
	`molecule_id` int,
	`famille_id` int,
	`type` enum('potentialisation','stabilisation','transformation','masquage','neutralisation') NOT NULL,
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
CREATE TABLE `terp_profile_molecules` (
	`terp_profile_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`percentage` decimal(5,2),
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `terp_profile_plants` (
	`terp_profile_id` int NOT NULL,
	`plant_id` int NOT NULL,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `terp_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profile_id` varchar(20) NOT NULL,
	`name` varchar(255) NOT NULL,
	`collection` varchar(100) DEFAULT 'San Andrés · Leaf Economies',
	`type` varchar(100) DEFAULT 'Formule analytique',
	`climatic_axis` enum('vent','bois','disparition','vent_bois','bois_disparition','vent_disparition','vent_bois_disparition') NOT NULL,
	`secondary_axis` enum('vent','bois','disparition','none') DEFAULT 'none',
	`function` text,
	`usage` enum('parfum','encens','espace','parfum_encens','parfum_espace','encens_espace','tous') DEFAULT 'parfum',
	`level` varchar(50) DEFAULT 'Recherche',
	`plant_sources` text,
	`key_molecules` text,
	`concentrate` json,
	`olfactive_reading` text,
	`temporality` enum('rapide','moyenne','longue','tres_courte','variable') DEFAULT 'moyenne',
	`temporality_description` text,
	`recommended_usage` text,
	`critical_notes` text,
	`connections` json,
	`intensity` enum('faible','moyenne','structurelle') DEFAULT 'moyenne',
	`readability` enum('abstrait','lisible','structure') DEFAULT 'lisible',
	`non_identifiable` int DEFAULT 0,
	`radar_vent` int DEFAULT 50,
	`radar_bois` int DEFAULT 50,
	`radar_disparition` int DEFAULT 50,
	`radar_structure` int DEFAULT 50,
	`radar_diffusion` int DEFAULT 50,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `terp_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `terp_profiles_profile_id_unique` UNIQUE(`profile_id`)
);
--> statement-breakpoint
CREATE TABLE `terpene_comparison_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profile_id` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`source_type` enum('tabac','cannabis','parfum') NOT NULL,
	`source_id` int,
	`source_name` varchar(255),
	`myrcene` int DEFAULT 0,
	`limonene` int DEFAULT 0,
	`pinene` int DEFAULT 0,
	`linalool` int DEFAULT 0,
	`caryophyllene` int DEFAULT 0,
	`humulene` int DEFAULT 0,
	`terpinolene` int DEFAULT 0,
	`ocimene` int DEFAULT 0,
	`bisabolol` int DEFAULT 0,
	`geraniol` int DEFAULT 0,
	`additional_terpenes` json,
	`dominant_note` varchar(100),
	`olfactive_description` text,
	`aromatic_bridges` json,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `terpene_comparison_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `terpene_comparison_profiles_profile_id_unique` UNIQUE(`profile_id`)
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
CREATE TABLE `terroir_specialties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`terroir_id` int NOT NULL,
	`plant_id` int,
	`raw_material_id` int,
	`is_signature` int DEFAULT 0,
	`importance` enum('majeure','significative','mineure','emergente'),
	`annual_production` varchar(100),
	`production_trend` enum('croissante','stable','decroissante','variable'),
	`quality_reputation` enum('exceptionnelle','excellente','bonne','standard'),
	`unique_characteristics` text,
	`historical_context` text,
	`tradition_since` varchar(50),
	`economic_importance` text,
	`main_buyers` json,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `terroir_specialties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `terroirs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`terroir_id` varchar(30) NOT NULL,
	`name` varchar(255) NOT NULL,
	`country` varchar(100) NOT NULL,
	`region` varchar(255),
	`sub_region` varchar(255),
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`altitude` varchar(50),
	`climate_type` enum('tropical','subtropical','mediterranean','oceanic','continental','arid','semi_arid','alpine','equatorial','other'),
	`avg_temperature` varchar(50),
	`annual_rainfall` varchar(50),
	`humidity` varchar(50),
	`soil_type` enum('clay','sandy','loamy','chalky','volcanic','alluvial','peaty','rocky','mixed','other'),
	`soil_ph` varchar(20),
	`soil_characteristics` text,
	`main_crops` json,
	`production_history` text,
	`annual_production` varchar(100),
	`certifications` json,
	`quality_rating` enum('exceptional','excellent','good','standard','variable','unknown') DEFAULT 'unknown',
	`reputation` text,
	`notes` text,
	`image_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `terroirs_id` PRIMARY KEY(`id`),
	CONSTRAINT `terroirs_terroir_id_unique` UNIQUE(`terroir_id`)
);
--> statement-breakpoint
CREATE TABLE `thematic_axes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`axis_code` varchar(20) NOT NULL,
	`name` varchar(255) NOT NULL,
	`meta_axis` enum('meta_a','meta_b','meta_c','other') NOT NULL,
	`description` text,
	`output_types` text,
	`color` varchar(20) DEFAULT '#6366f1',
	`icon` varchar(50),
	`display_order` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `thematic_axes_id` PRIMARY KEY(`id`),
	CONSTRAINT `thematic_axes_axis_code_unique` UNIQUE(`axis_code`),
	CONSTRAINT `thematic_axis_code_idx` UNIQUE(`axis_code`)
);
--> statement-breakpoint
CREATE TABLE `tobacco_additives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('alkalinizing','flavoring','humectant','preservative','coloring','other') NOT NULL,
	`chemical_formula` varchar(50),
	`source` varchar(100),
	`historical_use` text,
	`alkalinizing_power` decimal,
	`effectiveness_data` json,
	`application_methods` text,
	`dosage` text,
	`safety_profile` text,
	`modern_regulation` varchar(255),
	`tobacco_varieties_used_with` text,
	`comparisons` text,
	`source_references` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tobacco_additives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tobacco_cannabis_accords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('tobacco_only','cannabis_only','tobacco_cannabis_blend','tobacco_cannabis_layered','tobacco_cannabis_sequential') NOT NULL,
	`region` varchar(255),
	`cultural_context` varchar(100),
	`description` text,
	`components` json,
	`preparation_protocol` text,
	`consumption_method` varchar(100),
	`aroma_profile` text,
	`effect_profile` text,
	`historical_documentation` text,
	`modern_practices` text,
	`chemical_interactions` text,
	`therapeutic_claims` text,
	`legal_status` varchar(100),
	`source_references` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tobacco_cannabis_accords_id` PRIMARY KEY(`id`)
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
CREATE TABLE `tobacco_terroirs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`region` varchar(255) NOT NULL,
	`country` varchar(100) NOT NULL,
	`coordinates` json,
	`soil_type` varchar(100),
	`soil_composition` json,
	`climate` varchar(100),
	`climate_data` json,
	`elevation` int,
	`rainfall` int,
	`sun_exposure` varchar(100),
	`water_availability` varchar(100),
	`microorganisms` text,
	`mineral_content` json,
	`chemical_impact` text,
	`historical_use` text,
	`tobacco_varieties_grown` text,
	`comparisons` text,
	`source_references` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tobacco_terroirs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tobacco_varieties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`latin_name` varchar(255),
	`category` enum('landrace','cultivar','hybrid','wild','historical','extinct') NOT NULL DEFAULT 'cultivar',
	`origin` varchar(255),
	`region` varchar(255),
	`olfactive_family` varchar(100),
	`aroma_profile` text,
	`chemical_profile` json,
	`uses` text,
	`flavor` varchar(100),
	`strength` enum('mild','medium','strong','very_strong'),
	`moisture_content` decimal,
	`fermentation_time` varchar(100),
	`cure_method` varchar(100),
	`historical_significance` text,
	`modern_availability` varchar(100),
	`substitutes` text,
	`image_url` varchar(500),
	`source_references` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tobacco_varieties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tps_gene_molecules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tps_gene_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`relationship_type` enum('produces','catalyzes','regulates','precursor') NOT NULL DEFAULT 'produces',
	`confidence_level` enum('confirmed','predicted','inferred') NOT NULL DEFAULT 'inferred',
	`evidence_source` varchar(500),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tps_gene_molecules_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_tps_gene_molecule` UNIQUE(`tps_gene_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `tps_genes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`subfamily` varchar(20) NOT NULL,
	`product_class` varchar(50) NOT NULL,
	`main_product` varchar(100) NOT NULL,
	`olfactory_notes` text,
	`pathway` varchar(10) NOT NULL,
	`regulation_factors` text,
	`expression_conditions` text,
	`source_reference` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tps_genes_id` PRIMARY KEY(`id`)
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
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `v3_reference_tag_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference_id` int NOT NULL,
	`tag_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `v3_reference_tag_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_v3_ref_tag` UNIQUE(`reference_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `v3_references` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entry_key` varchar(100) NOT NULL,
	`entry_type` enum('article','book','chapter','thesis','conference_paper','report','website','web_entry','news','preprint','dataset','software','misc') NOT NULL DEFAULT 'article',
	`title` varchar(500) NOT NULL,
	`authors` text,
	`year` int,
	`container_title` varchar(255),
	`publisher` varchar(255),
	`doi` varchar(100),
	`isbn` varchar(20),
	`url` varchar(500),
	`axis_primary_id` int,
	`axis_primary_code` varchar(50),
	`axes_secondary` json,
	`notes` text,
	`user_notes` text,
	`tags` json,
	`read_status` enum('unread','reading','read','to_review') DEFAULT 'unread',
	`relevance_score` int DEFAULT 50,
	`imported_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `v3_references_id` PRIMARY KEY(`id`),
	CONSTRAINT `v3_references_entry_key_unique` UNIQUE(`entry_key`),
	CONSTRAINT `v3_ref_entry_key_idx` UNIQUE(`entry_key`)
);
--> statement-breakpoint
CREATE TABLE `variety_genealogy` (
	`id` int AUTO_INCREMENT NOT NULL,
	`variety_id` int NOT NULL,
	`parent_variety_id` int NOT NULL,
	`relationship_type` enum('parent','hybrid','clone','mutation') NOT NULL DEFAULT 'parent',
	`cross_date` int,
	`breeder` varchar(255),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `variety_genealogy_id` PRIMARY KEY(`id`)
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
ALTER TABLE `axis_connections` ADD CONSTRAINT `axis_connections_source_axis_id_thematic_axes_id_fk` FOREIGN KEY (`source_axis_id`) REFERENCES `thematic_axes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `axis_connections` ADD CONSTRAINT `axis_connections_target_axis_id_thematic_axes_id_fk` FOREIGN KEY (`target_axis_id`) REFERENCES `thematic_axes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `axis_reference_links` ADD CONSTRAINT `axis_reference_links_axis_id_research_axes_id_fk` FOREIGN KEY (`axis_id`) REFERENCES `research_axes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `axis_reference_links` ADD CONSTRAINT `axis_reference_links_reference_id_v3_references_id_fk` FOREIGN KEY (`reference_id`) REFERENCES `v3_references`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bibliography_axis_links` ADD CONSTRAINT `bibliography_axis_links_bibliography_id_bibliography_entries_id_fk` FOREIGN KEY (`bibliography_id`) REFERENCES `bibliography_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bibliography_axis_links` ADD CONSTRAINT `bibliography_axis_links_axis_id_research_axes_id_fk` FOREIGN KEY (`axis_id`) REFERENCES `research_axes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bibliography_entries` ADD CONSTRAINT `bibliography_entries_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `botanical_states` ADD CONSTRAINT `botanical_states_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `traditions_olfactives` ADD CONSTRAINT `traditions_olfactives_signatureAccordId_accords_id_fk` FOREIGN KEY (`signatureAccordId`) REFERENCES `accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `curated_journeys` ADD CONSTRAINT `curated_journeys_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `experimental_accord_civilisations` ADD CONSTRAINT `experimental_accord_civilisations_experimentalAccordId_experimental_accords_id_fk` FOREIGN KEY (`experimentalAccordId`) REFERENCES `experimental_accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `experimental_accord_civilisations` ADD CONSTRAINT `experimental_accord_civilisations_civilisationId_traditions_olfactives_id_fk` FOREIGN KEY (`civilisationId`) REFERENCES `traditions_olfactives`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `extraction_tests` ADD CONSTRAINT `extraction_tests_field_archive_id_field_archives_id_fk` FOREIGN KEY (`field_archive_id`) REFERENCES `field_archives`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `final_recipe_terp_profiles` ADD CONSTRAINT `final_recipe_terp_profiles_final_recipe_id_final_recipes_id_fk` FOREIGN KEY (`final_recipe_id`) REFERENCES `final_recipes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `final_recipe_terp_profiles` ADD CONSTRAINT `final_recipe_terp_profiles_terp_profile_id_terp_profiles_id_fk` FOREIGN KEY (`terp_profile_id`) REFERENCES `terp_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `formulation_suggestions` ADD CONSTRAINT `formulation_suggestions_base_molecule_id_molecules_id_fk` FOREIGN KEY (`base_molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ifra_restrictions` ADD CONSTRAINT `ifra_restrictions_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `installation_families` ADD CONSTRAINT `installation_families_installationId_installations_id_fk` FOREIGN KEY (`installationId`) REFERENCES `installations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `installation_families` ADD CONSTRAINT `installation_families_familyId_families_id_fk` FOREIGN KEY (`familyId`) REFERENCES `families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `installation_recettes` ADD CONSTRAINT `installation_recettes_installationId_installations_id_fk` FOREIGN KEY (`installationId`) REFERENCES `installations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `installation_recettes` ADD CONSTRAINT `installation_recettes_recetteId_recettes_id_fk` FOREIGN KEY (`recetteId`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_entries` ADD CONSTRAINT `inventory_entries_raw_material_id_raw_materials_id_fk` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_entries` ADD CONSTRAINT `inventory_entries_supplier_id_suppliers_id_fk` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `journey_items` ADD CONSTRAINT `journey_items_journey_id_curated_journeys_id_fk` FOREIGN KEY (`journey_id`) REFERENCES `curated_journeys`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `journey_items` ADD CONSTRAINT `journey_items_terroir_id_terroirs_id_fk` FOREIGN KEY (`terroir_id`) REFERENCES `terroirs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `journey_items` ADD CONSTRAINT `journey_items_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `journey_items` ADD CONSTRAINT `journey_items_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratoire_molecules` ADD CONSTRAINT `laboratoire_molecules_laboratoireId_laboratoire_id_fk` FOREIGN KEY (`laboratoireId`) REFERENCES `laboratoire`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratoire_molecules` ADD CONSTRAINT `laboratoire_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratoire_recettes` ADD CONSTRAINT `laboratoire_recettes_laboratoireId_laboratoire_id_fk` FOREIGN KEY (`laboratoireId`) REFERENCES `laboratoire`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laboratoire_recettes` ADD CONSTRAINT `laboratoire_recettes_recetteId_recettes_id_fk` FOREIGN KEY (`recetteId`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leaf_economy_molecules` ADD CONSTRAINT `leaf_economy_molecules_leaf_economy_id_leaf_economies_id_fk` FOREIGN KEY (`leaf_economy_id`) REFERENCES `leaf_economies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leaf_economy_molecules` ADD CONSTRAINT `leaf_economy_molecules_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecular_interactions` ADD CONSTRAINT `molecular_interactions_molecule1_id_molecules_id_fk` FOREIGN KEY (`molecule1_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecular_interactions` ADD CONSTRAINT `molecular_interactions_molecule2_id_molecules_id_fk` FOREIGN KEY (`molecule2_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecular_interactions` ADD CONSTRAINT `molecular_interactions_molecule3_id_molecules_id_fk` FOREIGN KEY (`molecule3_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecular_protocols` ADD CONSTRAINT `molecular_protocols_linked_study_id_climate_studies_id_fk` FOREIGN KEY (`linked_study_id`) REFERENCES `climate_studies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecular_transformations` ADD CONSTRAINT `molecular_transformations_source_molecule_id_molecules_id_fk` FOREIGN KEY (`source_molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecular_transformations` ADD CONSTRAINT `molecular_transformations_product_molecule_id_molecules_id_fk` FOREIGN KEY (`product_molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_accords` ADD CONSTRAINT `molecule_accords_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_accords` ADD CONSTRAINT `molecule_accords_accordId_accords_id_fk` FOREIGN KEY (`accordId`) REFERENCES `accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_analytical_methods` ADD CONSTRAINT `molecule_analytical_methods_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_analytical_methods` ADD CONSTRAINT `molecule_analytical_methods_method_id_analytical_methods_id_fk` FOREIGN KEY (`method_id`) REFERENCES `analytical_methods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_chemical_families` ADD CONSTRAINT `molecule_chemical_families_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_chemical_families` ADD CONSTRAINT `molecule_chemical_families_chemicalFamilyId_chemical_families_id_fk` FOREIGN KEY (`chemicalFamilyId`) REFERENCES `chemical_families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_families` ADD CONSTRAINT `molecule_families_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_families` ADD CONSTRAINT `molecule_families_familyId_families_id_fk` FOREIGN KEY (`familyId`) REFERENCES `families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_notes` ADD CONSTRAINT `molecule_notes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_notes` ADD CONSTRAINT `molecule_notes_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_origins` ADD CONSTRAINT `molecule_origins_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_origins` ADD CONSTRAINT `molecule_origins_origin_id_geographic_origins_id_fk` FOREIGN KEY (`origin_id`) REFERENCES `geographic_origins`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_plant_sources` ADD CONSTRAINT `molecule_plant_sources_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_plant_sources` ADD CONSTRAINT `molecule_plant_sources_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_synergies` ADD CONSTRAINT `molecule_synergies_molecule1_id_molecules_id_fk` FOREIGN KEY (`molecule1_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_synergies` ADD CONSTRAINT `molecule_synergies_molecule2_id_molecules_id_fk` FOREIGN KEY (`molecule2_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `olfactory_traditions` ADD CONSTRAINT `olfactory_traditions_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_experimental_accords` ADD CONSTRAINT `petrichor_experimental_accords_petrichorId_petrichor_id_fk` FOREIGN KEY (`petrichorId`) REFERENCES `petrichor`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_experimental_accords` ADD CONSTRAINT `petrichor_experimental_accords_experimentalAccordId_experimental_accords_id_fk` FOREIGN KEY (`experimentalAccordId`) REFERENCES `experimental_accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_molecules` ADD CONSTRAINT `petrichor_molecules_petrichorId_petrichor_id_fk` FOREIGN KEY (`petrichorId`) REFERENCES `petrichor`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_molecules` ADD CONSTRAINT `petrichor_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_recettes` ADD CONSTRAINT `petrichor_recettes_petrichorId_petrichor_id_fk` FOREIGN KEY (`petrichorId`) REFERENCES `petrichor`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_recettes` ADD CONSTRAINT `petrichor_recettes_recetteId_recettes_id_fk` FOREIGN KEY (`recetteId`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_tabacs` ADD CONSTRAINT `petrichor_tabacs_petrichorId_petrichor_id_fk` FOREIGN KEY (`petrichorId`) REFERENCES `petrichor`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petrichor_tabacs` ADD CONSTRAINT `petrichor_tabacs_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plant_geographic_zones` ADD CONSTRAINT `plant_geographic_zones_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plant_geographic_zones` ADD CONSTRAINT `plant_geographic_zones_zone_id_geographic_zones_id_fk` FOREIGN KEY (`zone_id`) REFERENCES `geographic_zones`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD CONSTRAINT `plant_molecules_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD CONSTRAINT `plant_molecules_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_chemical_families` ADD CONSTRAINT `prototype_chemical_families_prototypeId_prototypes_id_fk` FOREIGN KEY (`prototypeId`) REFERENCES `prototypes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_chemical_families` ADD CONSTRAINT `prototype_chemical_families_chemicalFamilyId_chemical_families_id_fk` FOREIGN KEY (`chemicalFamilyId`) REFERENCES `chemical_families`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_laboratoire` ADD CONSTRAINT `prototype_laboratoire_prototypeId_prototypes_id_fk` FOREIGN KEY (`prototypeId`) REFERENCES `prototypes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_laboratoire` ADD CONSTRAINT `prototype_laboratoire_laboratoireId_laboratoire_id_fk` FOREIGN KEY (`laboratoireId`) REFERENCES `laboratoire`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_molecules` ADD CONSTRAINT `prototype_molecules_prototypeId_prototypes_id_fk` FOREIGN KEY (`prototypeId`) REFERENCES `prototypes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prototype_molecules` ADD CONSTRAINT `prototype_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_methods` ADD CONSTRAINT `publication_methods_publication_id_research_publications_id_fk` FOREIGN KEY (`publication_id`) REFERENCES `research_publications`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_methods` ADD CONSTRAINT `publication_methods_method_id_analytical_methods_id_fk` FOREIGN KEY (`method_id`) REFERENCES `analytical_methods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_molecules` ADD CONSTRAINT `publication_molecules_publication_id_research_publications_id_fk` FOREIGN KEY (`publication_id`) REFERENCES `research_publications`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_molecules` ADD CONSTRAINT `publication_molecules_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_researchers` ADD CONSTRAINT `publication_researchers_publication_id_research_publications_id_fk` FOREIGN KEY (`publication_id`) REFERENCES `research_publications`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_researchers` ADD CONSTRAINT `publication_researchers_researcher_id_researchers_id_fk` FOREIGN KEY (`researcher_id`) REFERENCES `researchers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_transformations` ADD CONSTRAINT `publication_transformations_publication_id_research_publications_id_fk` FOREIGN KEY (`publication_id`) REFERENCES `research_publications`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_transformations` ADD CONSTRAINT `publication_transformations_transformation_id_molecular_transformations_id_fk` FOREIGN KEY (`transformation_id`) REFERENCES `molecular_transformations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `raw_material_molecules` ADD CONSTRAINT `raw_material_molecules_raw_material_id_raw_materials_id_fk` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `raw_material_molecules` ADD CONSTRAINT `raw_material_molecules_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `raw_materials` ADD CONSTRAINT `raw_materials_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `raw_materials` ADD CONSTRAINT `raw_materials_terroir_id_terroirs_id_fk` FOREIGN KEY (`terroir_id`) REFERENCES `terroirs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `raw_materials` ADD CONSTRAINT `raw_materials_extraction_method_id_extraction_methods_id_fk` FOREIGN KEY (`extraction_method_id`) REFERENCES `extraction_methods`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
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
ALTER TABLE `reference_citations` ADD CONSTRAINT `reference_citations_citing_id_bibliography_entries_id_fk` FOREIGN KEY (`citing_id`) REFERENCES `bibliography_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_citations` ADD CONSTRAINT `reference_citations_cited_id_bibliography_entries_id_fk` FOREIGN KEY (`cited_id`) REFERENCES `bibliography_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_citations` ADD CONSTRAINT `reference_citations_verified_by_users_id_fk` FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_citations` ADD CONSTRAINT `reference_citations_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_entity_links` ADD CONSTRAINT `reference_entity_links_reference_id_v3_references_id_fk` FOREIGN KEY (`reference_id`) REFERENCES `v3_references`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_entity_links` ADD CONSTRAINT `reference_entity_links_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_notes` ADD CONSTRAINT `reference_notes_reference_id_v3_references_id_fk` FOREIGN KEY (`reference_id`) REFERENCES `v3_references`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_notes` ADD CONSTRAINT `reference_notes_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `research_axes` ADD CONSTRAINT `research_axes_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `research_entries` ADD CONSTRAINT `research_entries_axis_id_research_axes_id_fk` FOREIGN KEY (`axis_id`) REFERENCES `research_axes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `research_entries` ADD CONSTRAINT `research_entries_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `researcher_institutions` ADD CONSTRAINT `researcher_institutions_researcher_id_researchers_id_fk` FOREIGN KEY (`researcher_id`) REFERENCES `researchers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `researcher_institutions` ADD CONSTRAINT `researcher_institutions_institution_id_research_institutions_id_fk` FOREIGN KEY (`institution_id`) REFERENCES `research_institutions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sample_images` ADD CONSTRAINT `sample_images_leaf_economy_id_leaf_economies_id_fk` FOREIGN KEY (`leaf_economy_id`) REFERENCES `leaf_economies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sample_images` ADD CONSTRAINT `sample_images_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sample_images` ADD CONSTRAINT `sample_images_uploaded_by_users_id_fk` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
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
ALTER TABLE `terp_profile_molecules` ADD CONSTRAINT `terp_profile_molecules_terp_profile_id_terp_profiles_id_fk` FOREIGN KEY (`terp_profile_id`) REFERENCES `terp_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terp_profile_molecules` ADD CONSTRAINT `terp_profile_molecules_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terp_profile_plants` ADD CONSTRAINT `terp_profile_plants_terp_profile_id_terp_profiles_id_fk` FOREIGN KEY (`terp_profile_id`) REFERENCES `terp_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terp_profile_plants` ADD CONSTRAINT `terp_profile_plants_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terpene_synergies` ADD CONSTRAINT `terpene_synergies_terpene1_id_molecules_id_fk` FOREIGN KEY (`terpene1_id`) REFERENCES `molecules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terpene_synergies` ADD CONSTRAINT `terpene_synergies_terpene2_id_molecules_id_fk` FOREIGN KEY (`terpene2_id`) REFERENCES `molecules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terroir_specialties` ADD CONSTRAINT `terroir_specialties_terroir_id_terroirs_id_fk` FOREIGN KEY (`terroir_id`) REFERENCES `terroirs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terroir_specialties` ADD CONSTRAINT `terroir_specialties_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terroir_specialties` ADD CONSTRAINT `terroir_specialties_raw_material_id_raw_materials_id_fk` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tobacco_formula_installations` ADD CONSTRAINT `tobacco_formula_installations_tobaccoFormulaId_tobacco_formulas_id_fk` FOREIGN KEY (`tobaccoFormulaId`) REFERENCES `tobacco_formulas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tobacco_formula_installations` ADD CONSTRAINT `tobacco_formula_installations_installationId_installations_id_fk` FOREIGN KEY (`installationId`) REFERENCES `installations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tps_gene_molecules` ADD CONSTRAINT `tps_gene_molecules_tps_gene_id_tps_genes_id_fk` FOREIGN KEY (`tps_gene_id`) REFERENCES `tps_genes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tps_gene_molecules` ADD CONSTRAINT `tps_gene_molecules_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `v3_reference_tag_links` ADD CONSTRAINT `v3_reference_tag_links_reference_id_v3_references_id_fk` FOREIGN KEY (`reference_id`) REFERENCES `v3_references`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `v3_reference_tag_links` ADD CONSTRAINT `v3_reference_tag_links_tag_id_reference_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `reference_tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `v3_references` ADD CONSTRAINT `v3_references_axis_primary_id_thematic_axes_id_fk` FOREIGN KEY (`axis_primary_id`) REFERENCES `thematic_axes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_experimental_accords` ADD CONSTRAINT `volcanique_experimental_accords_volcaniqueId_volcanique_id_fk` FOREIGN KEY (`volcaniqueId`) REFERENCES `volcanique`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_experimental_accords` ADD CONSTRAINT `volcanique_experimental_accords_experimentalAccordId_experimental_accords_id_fk` FOREIGN KEY (`experimentalAccordId`) REFERENCES `experimental_accords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_molecules` ADD CONSTRAINT `volcanique_molecules_volcaniqueId_volcanique_id_fk` FOREIGN KEY (`volcaniqueId`) REFERENCES `volcanique`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_molecules` ADD CONSTRAINT `volcanique_molecules_moleculeId_molecules_id_fk` FOREIGN KEY (`moleculeId`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_recettes` ADD CONSTRAINT `volcanique_recettes_volcaniqueId_volcanique_id_fk` FOREIGN KEY (`volcaniqueId`) REFERENCES `volcanique`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_recettes` ADD CONSTRAINT `volcanique_recettes_recetteId_recettes_id_fk` FOREIGN KEY (`recetteId`) REFERENCES `recettes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_tabacs` ADD CONSTRAINT `volcanique_tabacs_volcaniqueId_volcanique_id_fk` FOREIGN KEY (`volcaniqueId`) REFERENCES `volcanique`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `volcanique_tabacs` ADD CONSTRAINT `volcanique_tabacs_tabacId_tabacs_id_fk` FOREIGN KEY (`tabacId`) REFERENCES `tabacs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `analytical_method_category_idx` ON `analytical_methods` (`category`);--> statement-breakpoint
CREATE INDEX `analytical_method_performance_idx` ON `analytical_methods` (`performance_score`);--> statement-breakpoint
CREATE INDEX `event_type_idx` ON `analytics_events` (`event_type`);--> statement-breakpoint
CREATE INDEX `entity_type_idx` ON `analytics_events` (`entity_type`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `analytics_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `aromatic_accords_category_idx` ON `aromatic_accords` (`category`);--> statement-breakpoint
CREATE INDEX `aromatic_molecules_tabac_name_idx` ON `aromatic_molecules_tabac` (`name`);--> statement-breakpoint
CREATE INDEX `aromatic_molecules_tabac_formula_idx` ON `aromatic_molecules_tabac` (`chemical_formula`);--> statement-breakpoint
CREATE INDEX `aromatic_rarities_rarity_id_idx` ON `aromatic_rarities` (`rarity_id`);--> statement-breakpoint
CREATE INDEX `aromatic_rarities_category_idx` ON `aromatic_rarities` (`category`);--> statement-breakpoint
CREATE INDEX `axis_conn_source_idx` ON `axis_connections` (`source_axis_id`);--> statement-breakpoint
CREATE INDEX `axis_conn_target_idx` ON `axis_connections` (`target_axis_id`);--> statement-breakpoint
CREATE INDEX `axis_ref_link_axis_idx` ON `axis_reference_links` (`axis_id`);--> statement-breakpoint
CREATE INDEX `axis_ref_link_ref_idx` ON `axis_reference_links` (`reference_id`);--> statement-breakpoint
CREATE INDEX `axis_ref_link_type_idx` ON `axis_reference_links` (`link_type`);--> statement-breakpoint
CREATE INDEX `bibliography_year_idx` ON `bibliography_entries` (`year`);--> statement-breakpoint
CREATE INDEX `bibliography_type_idx` ON `bibliography_entries` (`entry_type`);--> statement-breakpoint
CREATE INDEX `bibliography_domain_idx` ON `bibliography_entries` (`research_domain`);--> statement-breakpoint
CREATE INDEX `cannabis_strains_name_idx` ON `cannabis_strains` (`name`);--> statement-breakpoint
CREATE INDEX `cml_cigarillo_idx` ON `cigarillo_molecule_links` (`cigarillo_recipe_id`);--> statement-breakpoint
CREATE INDEX `cml_molecule_idx` ON `cigarillo_molecule_links` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `civilizational_markers_plant_idx` ON `civilizational_markers` (`plant_id`);--> statement-breakpoint
CREATE INDEX `civilizational_markers_civilization_idx` ON `civilizational_markers` (`civilization`);--> statement-breakpoint
CREATE INDEX `civilizational_markers_period_idx` ON `civilizational_markers` (`period`);--> statement-breakpoint
CREATE INDEX `civilizational_markers_usage_idx` ON `civilizational_markers` (`usage_type`);--> statement-breakpoint
CREATE INDEX `review_molecule_idx` ON `classification_reviews` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `review_status_idx` ON `classification_reviews` (`status`);--> statement-breakpoint
CREATE INDEX `review_priority_idx` ON `classification_reviews` (`priority`);--> statement-breakpoint
CREATE INDEX `review_confidence_idx` ON `classification_reviews` (`ai_chemical_class_confidence`);--> statement-breakpoint
CREATE INDEX `snapshot_date_idx` ON `classification_snapshots` (`snapshot_date`);--> statement-breakpoint
CREATE INDEX `comparative_analyses_type_idx` ON `comparative_analyses` (`type`);--> statement-breakpoint
CREATE INDEX `journey_theme_idx` ON `curated_journeys` (`theme`);--> statement-breakpoint
CREATE INDEX `journey_published_idx` ON `curated_journeys` (`is_published`);--> statement-breakpoint
CREATE INDEX `journey_featured_idx` ON `curated_journeys` (`is_featured`);--> statement-breakpoint
CREATE INDEX `entourage_rules_type_idx` ON `entourage_rules` (`rule_type`);--> statement-breakpoint
CREATE INDEX `formulation_suggestions_type_idx` ON `formulation_suggestions` (`formulation_type`);--> statement-breakpoint
CREATE INDEX `formulation_suggestions_base_idx` ON `formulation_suggestions` (`base_molecule_id`);--> statement-breakpoint
CREATE INDEX `genomic_mol_link_ref_idx` ON `genomic_molecule_links` (`reference_id`);--> statement-breakpoint
CREATE INDEX `genomic_mol_link_mol_idx` ON `genomic_molecule_links` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `genomic_mol_link_axis_idx` ON `genomic_molecule_links` (`genomic_axis`);--> statement-breakpoint
CREATE INDEX `genomic_plant_link_ref_idx` ON `genomic_plant_links` (`reference_id`);--> statement-breakpoint
CREATE INDEX `genomic_plant_link_plant_idx` ON `genomic_plant_links` (`plant_id`);--> statement-breakpoint
CREATE INDEX `genomic_plant_link_axis_idx` ON `genomic_plant_links` (`genomic_axis`);--> statement-breakpoint
CREATE INDEX `geographic_zones_zone_type_idx` ON `geographic_zones` (`zone_type`);--> statement-breakpoint
CREATE INDEX `geographic_zones_threat_level_idx` ON `geographic_zones` (`threat_level`);--> statement-breakpoint
CREATE INDEX `ghost_variety_name_idx` ON `ghost_varieties` (`name`);--> statement-breakpoint
CREATE INDEX `ghost_varieties_type_idx` ON `ghost_varieties` (`variety_type`);--> statement-breakpoint
CREATE INDEX `ghost_varieties_status_idx` ON `ghost_varieties` (`conservation_status`);--> statement-breakpoint
CREATE INDEX `gv_image_variety_idx` ON `ghost_variety_images` (`ghost_variety_id`);--> statement-breakpoint
CREATE INDEX `gv_image_sort_idx` ON `ghost_variety_images` (`ghost_variety_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX `gv_mol_link_variety_idx` ON `ghost_variety_molecule_links` (`ghost_variety_id`);--> statement-breakpoint
CREATE INDEX `gv_mol_link_molecule_idx` ON `ghost_variety_molecule_links` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `gv_plant_link_variety_idx` ON `ghost_variety_plant_links` (`ghost_variety_id`);--> statement-breakpoint
CREATE INDEX `gv_plant_link_plant_idx` ON `ghost_variety_plant_links` (`plant_id`);--> statement-breakpoint
CREATE INDEX `inventory_raw_material_idx` ON `inventory_entries` (`raw_material_id`);--> statement-breakpoint
CREATE INDEX `inventory_supplier_idx` ON `inventory_entries` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `inventory_purchase_date_idx` ON `inventory_entries` (`purchase_date`);--> statement-breakpoint
CREATE INDEX `journey_item_journey_idx` ON `journey_items` (`journey_id`);--> statement-breakpoint
CREATE INDEX `journey_item_type_idx` ON `journey_items` (`item_type`);--> statement-breakpoint
CREATE INDEX `journey_item_order_idx` ON `journey_items` (`journey_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX `landraces_name_idx` ON `landraces` (`name`);--> statement-breakpoint
CREATE INDEX `landraces_country_idx` ON `landraces` (`origin_country`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `modification_history` (`user_id`);--> statement-breakpoint
CREATE INDEX `entity_type_idx` ON `modification_history` (`entity_type`);--> statement-breakpoint
CREATE INDEX `entity_id_idx` ON `modification_history` (`entity_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `modification_history` (`created_at`);--> statement-breakpoint
CREATE INDEX `molecular_interactions_source_idx` ON `molecular_interactions` (`source_category`);--> statement-breakpoint
CREATE INDEX `molecular_interactions_synergy_idx` ON `molecular_interactions` (`synergy_type`);--> statement-breakpoint
CREATE INDEX `mol_method_molecule_idx` ON `molecule_analytical_methods` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `mol_method_method_idx` ON `molecule_analytical_methods` (`method_id`);--> statement-breakpoint
CREATE INDEX `mp_molecule_idx` ON `molecule_perfumes` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `idx_molecule` ON `molecules_recettes` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `idx_recette` ON `molecules_recettes` (`recette_id`);--> statement-breakpoint
CREATE INDEX `notification_type_idx` ON `notifications` (`type`);--> statement-breakpoint
CREATE INDEX `notification_read_idx` ON `notifications` (`is_read`);--> statement-breakpoint
CREATE INDEX `notification_created_idx` ON `notifications` (`created_at`);--> statement-breakpoint
CREATE INDEX `olfactive_archives_type_idx` ON `olfactive_archives` (`type`);--> statement-breakpoint
CREATE INDEX `olfactive_archives_civilization_idx` ON `olfactive_archives` (`civilization`);--> statement-breakpoint
CREATE INDEX `oe_plant_idx` ON `olfactive_emissions` (`plant_id`);--> statement-breakpoint
CREATE INDEX `oe_molecule_idx` ON `olfactive_emissions` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `oe_tabac_idx` ON `olfactive_emissions` (`tabac_id`);--> statement-breakpoint
CREATE INDEX `oe_method_idx` ON `olfactive_emissions` (`analysis_method`);--> statement-breakpoint
CREATE INDEX `oe_role_idx` ON `olfactive_emissions` (`role`);--> statement-breakpoint
CREATE INDEX `tradition_period_idx` ON `olfactory_traditions` (`period`);--> statement-breakpoint
CREATE INDEX `tradition_region_idx` ON `olfactory_traditions` (`region`);--> statement-breakpoint
CREATE INDEX `tradition_status_idx` ON `olfactory_traditions` (`reconstruction_status`);--> statement-breakpoint
CREATE INDEX `pc_plant_idx` ON `plant_contributions` (`plant_id`);--> statement-breakpoint
CREATE INDEX `pc_user_idx` ON `plant_contributions` (`user_id`);--> statement-breakpoint
CREATE INDEX `pc_status_idx` ON `plant_contributions` (`status`);--> statement-breakpoint
CREATE INDEX `pc_type_idx` ON `plant_contributions` (`contribution_type`);--> statement-breakpoint
CREATE INDEX `plant_geographic_zones_plant_zone_idx` ON `plant_geographic_zones` (`plant_id`,`zone_id`);--> statement-breakpoint
CREATE INDEX `pyrazines_name_idx` ON `pyrazines` (`name`);--> statement-breakpoint
CREATE INDEX `pyrazines_formula_idx` ON `pyrazines` (`chemical_formula`);--> statement-breakpoint
CREATE INDEX `pyrolysis_transformations_molecule_idx` ON `pyrolysis_transformations` (`original_molecule_id`);--> statement-breakpoint
CREATE INDEX `rrm_recette_idx` ON `recette_raw_materials` (`recette_id`);--> statement-breakpoint
CREATE INDEX `rrm_raw_material_idx` ON `recette_raw_materials` (`raw_material_id`);--> statement-breakpoint
CREATE INDEX `idx_recette_formule` ON `recettes_formules_reference` (`recette_id`);--> statement-breakpoint
CREATE INDEX `reference_citations_citing_idx` ON `reference_citations` (`citing_id`);--> statement-breakpoint
CREATE INDEX `reference_citations_cited_idx` ON `reference_citations` (`cited_id`);--> statement-breakpoint
CREATE INDEX `reference_citations_type_idx` ON `reference_citations` (`citation_type`);--> statement-breakpoint
CREATE INDEX `ref_entity_ref_idx` ON `reference_entity_links` (`reference_id`);--> statement-breakpoint
CREATE INDEX `ref_entity_entity_idx` ON `reference_entity_links` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `ref_entity_link_type_idx` ON `reference_entity_links` (`link_type`);--> statement-breakpoint
CREATE INDEX `ref_notes_ref_idx` ON `reference_notes` (`reference_id`);--> statement-breakpoint
CREATE INDEX `ref_notes_type_idx` ON `reference_notes` (`note_type`);--> statement-breakpoint
CREATE INDEX `ref_notes_importance_idx` ON `reference_notes` (`importance`);--> statement-breakpoint
CREATE INDEX `ref_tag_category_idx` ON `reference_tags` (`category`);--> statement-breakpoint
CREATE INDEX `ref_tag_parent_idx` ON `reference_tags` (`parent_id`);--> statement-breakpoint
CREATE INDEX `research_axis_status_idx` ON `research_axes` (`status`);--> statement-breakpoint
CREATE INDEX `research_axis_category_idx` ON `research_axes` (`category`);--> statement-breakpoint
CREATE INDEX `research_claims_claim_id_idx` ON `research_claims` (`claim_id`);--> statement-breakpoint
CREATE INDEX `research_claims_status_idx` ON `research_claims` (`status`);--> statement-breakpoint
CREATE INDEX `research_entry_axis_idx` ON `research_entries` (`axis_id`);--> statement-breakpoint
CREATE INDEX `research_entry_type_idx` ON `research_entries` (`entry_type`);--> statement-breakpoint
CREATE INDEX `research_entry_status_idx` ON `research_entries` (`status`);--> statement-breakpoint
CREATE INDEX `institution_name_idx` ON `research_institutions` (`name`);--> statement-breakpoint
CREATE INDEX `institution_country_idx` ON `research_institutions` (`country`);--> statement-breakpoint
CREATE INDEX `institution_type_idx` ON `research_institutions` (`institution_type`);--> statement-breakpoint
CREATE INDEX `research_pub_year_idx` ON `research_publications` (`year`);--> statement-breakpoint
CREATE INDEX `research_pub_focus_idx` ON `research_publications` (`research_focus`);--> statement-breakpoint
CREATE INDEX `research_pub_subject_idx` ON `research_publications` (`subject_matter`);--> statement-breakpoint
CREATE INDEX `research_sources_source_id_idx` ON `research_sources` (`source_id`);--> statement-breakpoint
CREATE INDEX `researcher_name_idx` ON `researchers` (`name`);--> statement-breakpoint
CREATE INDEX `researcher_status_idx` ON `researchers` (`status`);--> statement-breakpoint
CREATE INDEX `sample_images_leaf_economy_idx` ON `sample_images` (`leaf_economy_id`);--> statement-breakpoint
CREATE INDEX `sample_images_plant_idx` ON `sample_images` (`plant_id`);--> statement-breakpoint
CREATE INDEX `sample_images_category_idx` ON `sample_images` (`category`);--> statement-breakpoint
CREATE INDEX `saved_formulas_user_idx` ON `saved_formulas` (`user_id`);--> statement-breakpoint
CREATE INDEX `supplier_material_supplier_idx` ON `supplier_materials` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `supplier_material_molecule_idx` ON `supplier_materials` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `supplier_name_idx` ON `suppliers` (`name`);--> statement-breakpoint
CREATE INDEX `supplier_country_idx` ON `suppliers` (`country`);--> statement-breakpoint
CREATE INDEX `supplier_region_idx` ON `suppliers` (`region`);--> statement-breakpoint
CREATE INDEX `sustainable_alt_threatened_idx` ON `sustainable_alternatives` (`threatened_plant_id`);--> statement-breakpoint
CREATE INDEX `sustainable_alt_type_idx` ON `sustainable_alternatives` (`alternative_type`);--> statement-breakpoint
CREATE INDEX `sustainable_alt_availability_idx` ON `sustainable_alternatives` (`availability`);--> statement-breakpoint
CREATE INDEX `terpene_comparison_source_idx` ON `terpene_comparison_profiles` (`source_type`);--> statement-breakpoint
CREATE INDEX `thematic_axis_meta_idx` ON `thematic_axes` (`meta_axis`);--> statement-breakpoint
CREATE INDEX `tobacco_additives_name_idx` ON `tobacco_additives` (`name`);--> statement-breakpoint
CREATE INDEX `tobacco_additives_type_idx` ON `tobacco_additives` (`type`);--> statement-breakpoint
CREATE INDEX `tobacco_cannabis_accords_name_idx` ON `tobacco_cannabis_accords` (`name`);--> statement-breakpoint
CREATE INDEX `tobacco_cannabis_accords_region_idx` ON `tobacco_cannabis_accords` (`region`);--> statement-breakpoint
CREATE INDEX `tobacco_cannabis_accords_type_idx` ON `tobacco_cannabis_accords` (`type`);--> statement-breakpoint
CREATE INDEX `tobacco_terroirs_region_idx` ON `tobacco_terroirs` (`region`);--> statement-breakpoint
CREATE INDEX `tobacco_terroirs_country_idx` ON `tobacco_terroirs` (`country`);--> statement-breakpoint
CREATE INDEX `tobacco_varieties_name_idx` ON `tobacco_varieties` (`name`);--> statement-breakpoint
CREATE INDEX `tobacco_varieties_origin_idx` ON `tobacco_varieties` (`origin`);--> statement-breakpoint
CREATE INDEX `tobacco_varieties_category_idx` ON `tobacco_varieties` (`category`);--> statement-breakpoint
CREATE INDEX `tps_gene_molecules_gene_idx` ON `tps_gene_molecules` (`tps_gene_id`);--> statement-breakpoint
CREATE INDEX `tps_gene_molecules_molecule_idx` ON `tps_gene_molecules` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `tps_genes_name_idx` ON `tps_genes` (`name`);--> statement-breakpoint
CREATE INDEX `tps_genes_subfamily_idx` ON `tps_genes` (`subfamily`);--> statement-breakpoint
CREATE INDEX `tps_genes_product_class_idx` ON `tps_genes` (`product_class`);--> statement-breakpoint
CREATE INDEX `v3_ref_tag_ref_idx` ON `v3_reference_tag_links` (`reference_id`);--> statement-breakpoint
CREATE INDEX `v3_ref_tag_tag_idx` ON `v3_reference_tag_links` (`tag_id`);--> statement-breakpoint
CREATE INDEX `v3_ref_year_idx` ON `v3_references` (`year`);--> statement-breakpoint
CREATE INDEX `v3_ref_type_idx` ON `v3_references` (`entry_type`);--> statement-breakpoint
CREATE INDEX `v3_ref_axis_primary_idx` ON `v3_references` (`axis_primary_id`);--> statement-breakpoint
CREATE INDEX `variety_genealogy_variety_idx` ON `variety_genealogy` (`variety_id`);--> statement-breakpoint
CREATE INDEX `variety_genealogy_parent_idx` ON `variety_genealogy` (`parent_variety_id`);