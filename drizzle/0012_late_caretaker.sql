CREATE TABLE `genealogy_extended` (
	`id` int AUTO_INCREMENT NOT NULL,
	`genealogy_id` int NOT NULL,
	`genetic_similarity` int,
	`shared_markers` json DEFAULT ('[]'),
	`inherited_molecules` json DEFAULT ('[]'),
	`inherited_traits` json DEFAULT ('[]'),
	`crossing_method` enum('natural','controlled','backcross','selfing','mutation_induced','tissue_culture','unknown'),
	`crossing_location` varchar(255),
	`crossing_documentation` text,
	`validation_status` enum('confirmed','documented','inferred','hypothetical') NOT NULL DEFAULT 'documented',
	`validation_method` varchar(255),
	`validation_references` json DEFAULT ('[]'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `genealogy_extended_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lost_varieties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lost_variety_id` varchar(30) NOT NULL,
	`plant_id` int,
	`name` varchar(255) NOT NULL,
	`latin_name` varchar(255),
	`historical_names` json DEFAULT ('[]'),
	`extinction_status` enum('extinct','extinct_in_wild','presumed_extinct','possibly_extinct','rediscovered') NOT NULL,
	`last_known_date` int,
	`extinction_date` int,
	`extinction_cause` enum('overexploitation','habitat_loss','climate_change','disease','hybridization','war_conflict','unknown'),
	`extinction_details` text,
	`historical_range` json DEFAULT ('[]'),
	`morphological_description` text,
	`olfactive_description` text,
	`therapeutic_uses` text,
	`cultural_significance` text,
	`hypothetical_molecular_profile` json DEFAULT ('[]'),
	`reconstruction_possibility` enum('possible','partial','unlikely','impossible') DEFAULT 'partial',
	`reconstruction_notes` text,
	`closest_living_relatives` json DEFAULT ('[]'),
	`primary_sources` json DEFAULT ('[]'),
	`image_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lost_varieties_id` PRIMARY KEY(`id`),
	CONSTRAINT `lost_varieties_lost_variety_id_unique` UNIQUE(`lost_variety_id`)
);
--> statement-breakpoint
CREATE TABLE `molecular_comparisons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`comparison_id` varchar(30) NOT NULL,
	`ancient_profile_id` int NOT NULL,
	`modern_variety_id` int NOT NULL,
	`lost_variety_id` int,
	`overall_similarity` int,
	`terpene_profile_similarity` int,
	`olfactive_profile_similarity` int,
	`molecular_differences` json DEFAULT ('[]'),
	`lost_molecules` json DEFAULT ('[]'),
	`gained_molecules` json DEFAULT ('[]'),
	`analysis_notes` text,
	`evolution_hypothesis` text,
	`selection_pressures` json DEFAULT ('[]'),
	`reconstruction_relevance` enum('critical','important','useful','marginal') DEFAULT 'useful',
	`reconstruction_notes` text,
	`comparison_date` timestamp NOT NULL DEFAULT (now()),
	`analyst` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `molecular_comparisons_id` PRIMARY KEY(`id`),
	CONSTRAINT `molecular_comparisons_comparison_id_unique` UNIQUE(`comparison_id`)
);
--> statement-breakpoint
CREATE TABLE `variety_historical_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`record_id` varchar(30) NOT NULL,
	`variety_id` int NOT NULL,
	`record_type` enum('botanical_description','trade_record','agricultural_manual','pharmacopoeia','herbarium_specimen','artistic_depiction','travel_account','scientific_paper','patent','oral_tradition','other') NOT NULL,
	`date_created` varchar(100),
	`year_estimate` int,
	`location` varchar(255),
	`country` varchar(100),
	`region` varchar(255),
	`title` varchar(500) NOT NULL,
	`author` varchar(255),
	`content` text,
	`original_language` varchar(50),
	`historical_name` varchar(255),
	`synonyms` json DEFAULT ('[]'),
	`description_excerpt` text,
	`mentioned_characteristics` json,
	`authenticity_level` enum('original','copy','transcription','reconstruction') NOT NULL DEFAULT 'transcription',
	`reliability_score` int,
	`source_url` varchar(500),
	`archive_location` varchar(255),
	`catalog_number` varchar(100),
	`image_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `variety_historical_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `variety_historical_records_record_id_unique` UNIQUE(`record_id`)
);
--> statement-breakpoint
CREATE TABLE `variety_molecular_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profile_id` varchar(30) NOT NULL,
	`variety_id` int NOT NULL,
	`historical_period` enum('prehistoric','ancient','medieval','renaissance','enlightenment','industrial','modern','contemporary') NOT NULL,
	`year_estimate` int,
	`year_range_start` int,
	`year_range_end` int,
	`source_type` enum('archaeological','historical_text','herbarium','genetic_analysis','reconstruction','contemporary_sample') NOT NULL,
	`source_description` text,
	`source_references` json DEFAULT ('[]'),
	`molecular_composition` json DEFAULT ('[]'),
	`terpene_profile` json,
	`olfactive_description` text,
	`olfactive_notes` json,
	`confidence_level` enum('confirmed','probable','hypothetical','speculative') NOT NULL DEFAULT 'probable',
	`modern_comparison_notes` text,
	`divergence_score` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `variety_molecular_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `variety_molecular_profiles_profile_id_unique` UNIQUE(`profile_id`)
);
--> statement-breakpoint
CREATE INDEX `ge_genealogy_idx` ON `genealogy_extended` (`genealogy_id`);--> statement-breakpoint
CREATE INDEX `lv_plant_idx` ON `lost_varieties` (`plant_id`);--> statement-breakpoint
CREATE INDEX `lv_status_idx` ON `lost_varieties` (`extinction_status`);--> statement-breakpoint
CREATE INDEX `mc_ancient_profile_idx` ON `molecular_comparisons` (`ancient_profile_id`);--> statement-breakpoint
CREATE INDEX `mc_modern_variety_idx` ON `molecular_comparisons` (`modern_variety_id`);--> statement-breakpoint
CREATE INDEX `mc_lost_variety_idx` ON `molecular_comparisons` (`lost_variety_id`);--> statement-breakpoint
CREATE INDEX `vhr_variety_idx` ON `variety_historical_records` (`variety_id`);--> statement-breakpoint
CREATE INDEX `vhr_type_idx` ON `variety_historical_records` (`record_type`);--> statement-breakpoint
CREATE INDEX `vhr_year_idx` ON `variety_historical_records` (`year_estimate`);--> statement-breakpoint
CREATE INDEX `vmp_variety_idx` ON `variety_molecular_profiles` (`variety_id`);--> statement-breakpoint
CREATE INDEX `vmp_period_idx` ON `variety_molecular_profiles` (`historical_period`);