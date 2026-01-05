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
ALTER TABLE `plants` ADD `conservation_status` enum('EX','EW','CR','EN','VU','NT','LC','DD','NE');--> statement-breakpoint
ALTER TABLE `plants` ADD `cites_appendix` enum('I','II','III','NONE','UNKNOWN');--> statement-breakpoint
ALTER TABLE `plants` ADD `conservation_notes` text;--> statement-breakpoint
ALTER TABLE `plants` ADD `threat_factors` json;--> statement-breakpoint
ALTER TABLE `plants` ADD `sustainable_alternatives` text;--> statement-breakpoint
ALTER TABLE `plants` ADD `last_assessment_year` int;--> statement-breakpoint
ALTER TABLE `plants` ADD `historical_status` varchar(32);--> statement-breakpoint
CREATE INDEX `civilizational_markers_plant_idx` ON `civilizational_markers` (`plant_id`);--> statement-breakpoint
CREATE INDEX `civilizational_markers_civilization_idx` ON `civilizational_markers` (`civilization`);--> statement-breakpoint
CREATE INDEX `civilizational_markers_period_idx` ON `civilizational_markers` (`period`);--> statement-breakpoint
CREATE INDEX `civilizational_markers_usage_idx` ON `civilizational_markers` (`usage_type`);--> statement-breakpoint
CREATE INDEX `olfactive_archives_type_idx` ON `olfactive_archives` (`type`);--> statement-breakpoint
CREATE INDEX `olfactive_archives_civilization_idx` ON `olfactive_archives` (`civilization`);--> statement-breakpoint
CREATE INDEX `variety_genealogy_variety_idx` ON `variety_genealogy` (`variety_id`);--> statement-breakpoint
CREATE INDEX `variety_genealogy_parent_idx` ON `variety_genealogy` (`parent_variety_id`);