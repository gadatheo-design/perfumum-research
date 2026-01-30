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
CREATE INDEX `aromatic_molecules_tabac_name_idx` ON `aromatic_molecules_tabac` (`name`);--> statement-breakpoint
CREATE INDEX `aromatic_molecules_tabac_formula_idx` ON `aromatic_molecules_tabac` (`chemical_formula`);--> statement-breakpoint
CREATE INDEX `cannabis_strains_name_idx` ON `cannabis_strains` (`name`);--> statement-breakpoint
CREATE INDEX `comparative_analyses_type_idx` ON `comparative_analyses` (`type`);--> statement-breakpoint
CREATE INDEX `landraces_name_idx` ON `landraces` (`name`);--> statement-breakpoint
CREATE INDEX `landraces_country_idx` ON `landraces` (`origin_country`);--> statement-breakpoint
CREATE INDEX `pyrazines_name_idx` ON `pyrazines` (`name`);--> statement-breakpoint
CREATE INDEX `pyrazines_formula_idx` ON `pyrazines` (`chemical_formula`);--> statement-breakpoint
CREATE INDEX `pyrolysis_transformations_molecule_idx` ON `pyrolysis_transformations` (`original_molecule_id`);--> statement-breakpoint
CREATE INDEX `research_claims_claim_id_idx` ON `research_claims` (`claim_id`);--> statement-breakpoint
CREATE INDEX `research_claims_status_idx` ON `research_claims` (`status`);--> statement-breakpoint
CREATE INDEX `research_sources_source_id_idx` ON `research_sources` (`source_id`);--> statement-breakpoint
CREATE INDEX `tobacco_additives_name_idx` ON `tobacco_additives` (`name`);--> statement-breakpoint
CREATE INDEX `tobacco_additives_type_idx` ON `tobacco_additives` (`type`);--> statement-breakpoint
CREATE INDEX `tobacco_cannabis_accords_name_idx` ON `tobacco_cannabis_accords` (`name`);--> statement-breakpoint
CREATE INDEX `tobacco_cannabis_accords_region_idx` ON `tobacco_cannabis_accords` (`region`);--> statement-breakpoint
CREATE INDEX `tobacco_cannabis_accords_type_idx` ON `tobacco_cannabis_accords` (`type`);--> statement-breakpoint
CREATE INDEX `tobacco_terroirs_region_idx` ON `tobacco_terroirs` (`region`);--> statement-breakpoint
CREATE INDEX `tobacco_terroirs_country_idx` ON `tobacco_terroirs` (`country`);--> statement-breakpoint
CREATE INDEX `tobacco_varieties_name_idx` ON `tobacco_varieties` (`name`);--> statement-breakpoint
CREATE INDEX `tobacco_varieties_origin_idx` ON `tobacco_varieties` (`origin`);--> statement-breakpoint
CREATE INDEX `tobacco_varieties_category_idx` ON `tobacco_varieties` (`category`);