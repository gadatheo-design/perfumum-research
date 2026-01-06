CREATE TABLE `memory_olfaction_concepts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`type` enum('phenomenon','brain_structure','memory_type','mechanism','disorder','therapy','ritual') NOT NULL,
	`definition` text,
	`description` text,
	`scientific_basis` text,
	`historical_context` text,
	`key_researchers` text,
	`seminal_papers` text,
	`illustration` varchar(1000),
	`diagrams` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `memory_olfaction_concepts_id` PRIMARY KEY(`id`),
	CONSTRAINT `memory_olfaction_concepts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `olfaction_memory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`category` enum('neurological','historical','psychological','cultural','scientific_study','artistic','therapeutic') NOT NULL,
	`summary` text,
	`content` text,
	`key_findings` text,
	`authors` text,
	`institutions` text,
	`publication_date` timestamp,
	`source_url` varchar(1000),
	`doi` varchar(255),
	`historical_period` varchar(255),
	`start_year` int,
	`end_year` int,
	`brain_regions` text,
	`civilizations` text,
	`tags` text,
	`images` text,
	`diagrams` text,
	`videos` text,
	`related_molecule_ids` text,
	`related_plant_ids` text,
	`related_archive_ids` text,
	`status` enum('draft','review','published','archived') DEFAULT 'draft',
	`featured` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`created_by` int,
	CONSTRAINT `olfaction_memory_id` PRIMARY KEY(`id`),
	CONSTRAINT `olfaction_memory_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `olfaction_memory_article_concepts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`article_id` int NOT NULL,
	`concept_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `olfaction_memory_article_concepts_id` PRIMARY KEY(`id`),
	CONSTRAINT `article_concept_unique` UNIQUE(`article_id`,`concept_id`)
);
--> statement-breakpoint
CREATE TABLE `olfaction_memory_article_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`article_id` int NOT NULL,
	`source_id` int NOT NULL,
	`citation_context` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `olfaction_memory_article_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `article_source_unique` UNIQUE(`article_id`,`source_id`)
);
--> statement-breakpoint
CREATE TABLE `olfaction_memory_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_type` enum('scientific_paper','book','book_chapter','thesis','conference','podcast','article','documentary','website') NOT NULL,
	`title` varchar(500) NOT NULL,
	`authors` text,
	`publication_year` int,
	`journal` varchar(255),
	`volume` varchar(50),
	`issue` varchar(50),
	`pages` varchar(50),
	`publisher` varchar(255),
	`doi` varchar(255),
	`isbn` varchar(20),
	`url` varchar(1000),
	`abstract` text,
	`notes` text,
	`relevance_score` int,
	`key_topics` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `olfaction_memory_sources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `verified_suppliers` ADD `supplier_references` json;--> statement-breakpoint
ALTER TABLE `olfaction_memory_article_concepts` ADD CONSTRAINT `olfaction_memory_article_concepts_article_id_olfaction_memory_id_fk` FOREIGN KEY (`article_id`) REFERENCES `olfaction_memory`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `olfaction_memory_article_concepts` ADD CONSTRAINT `olfaction_memory_article_concepts_concept_id_memory_olfaction_concepts_id_fk` FOREIGN KEY (`concept_id`) REFERENCES `memory_olfaction_concepts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `olfaction_memory_article_sources` ADD CONSTRAINT `olfaction_memory_article_sources_article_id_olfaction_memory_id_fk` FOREIGN KEY (`article_id`) REFERENCES `olfaction_memory`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `olfaction_memory_article_sources` ADD CONSTRAINT `olfaction_memory_article_sources_source_id_olfaction_memory_sources_id_fk` FOREIGN KEY (`source_id`) REFERENCES `olfaction_memory_sources`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `memory_concept_type_idx` ON `memory_olfaction_concepts` (`type`);--> statement-breakpoint
CREATE INDEX `olfaction_memory_category_idx` ON `olfaction_memory` (`category`);--> statement-breakpoint
CREATE INDEX `olfaction_memory_status_idx` ON `olfaction_memory` (`status`);--> statement-breakpoint
CREATE INDEX `olfaction_memory_featured_idx` ON `olfaction_memory` (`featured`);--> statement-breakpoint
CREATE INDEX `article_concept_article_idx` ON `olfaction_memory_article_concepts` (`article_id`);--> statement-breakpoint
CREATE INDEX `article_concept_concept_idx` ON `olfaction_memory_article_concepts` (`concept_id`);--> statement-breakpoint
CREATE INDEX `article_source_article_idx` ON `olfaction_memory_article_sources` (`article_id`);--> statement-breakpoint
CREATE INDEX `article_source_source_idx` ON `olfaction_memory_article_sources` (`source_id`);--> statement-breakpoint
CREATE INDEX `olfaction_source_type_idx` ON `olfaction_memory_sources` (`source_type`);--> statement-breakpoint
CREATE INDEX `olfaction_source_year_idx` ON `olfaction_memory_sources` (`publication_year`);--> statement-breakpoint
ALTER TABLE `verified_suppliers` DROP COLUMN `references`;