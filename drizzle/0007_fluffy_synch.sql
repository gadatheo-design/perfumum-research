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
ALTER TABLE `formulation_suggestions` ADD CONSTRAINT `formulation_suggestions_base_molecule_id_molecules_id_fk` FOREIGN KEY (`base_molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecular_interactions` ADD CONSTRAINT `molecular_interactions_molecule1_id_molecules_id_fk` FOREIGN KEY (`molecule1_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecular_interactions` ADD CONSTRAINT `molecular_interactions_molecule2_id_molecules_id_fk` FOREIGN KEY (`molecule2_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecular_interactions` ADD CONSTRAINT `molecular_interactions_molecule3_id_molecules_id_fk` FOREIGN KEY (`molecule3_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `aromatic_accords_category_idx` ON `aromatic_accords` (`category`);--> statement-breakpoint
CREATE INDEX `entourage_rules_type_idx` ON `entourage_rules` (`rule_type`);--> statement-breakpoint
CREATE INDEX `formulation_suggestions_type_idx` ON `formulation_suggestions` (`formulation_type`);--> statement-breakpoint
CREATE INDEX `formulation_suggestions_base_idx` ON `formulation_suggestions` (`base_molecule_id`);--> statement-breakpoint
CREATE INDEX `molecular_interactions_source_idx` ON `molecular_interactions` (`source_category`);--> statement-breakpoint
CREATE INDEX `molecular_interactions_synergy_idx` ON `molecular_interactions` (`synergy_type`);--> statement-breakpoint
CREATE INDEX `terpene_comparison_source_idx` ON `terpene_comparison_profiles` (`source_type`);