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
ALTER TABLE `plants` ADD `latitude` decimal(10,7);--> statement-breakpoint
ALTER TABLE `plants` ADD `longitude` decimal(10,7);--> statement-breakpoint
ALTER TABLE `plant_geographic_zones` ADD CONSTRAINT `plant_geographic_zones_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plant_geographic_zones` ADD CONSTRAINT `plant_geographic_zones_zone_id_geographic_zones_id_fk` FOREIGN KEY (`zone_id`) REFERENCES `geographic_zones`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `geographic_zones_zone_type_idx` ON `geographic_zones` (`zone_type`);--> statement-breakpoint
CREATE INDEX `geographic_zones_threat_level_idx` ON `geographic_zones` (`threat_level`);--> statement-breakpoint
CREATE INDEX `plant_geographic_zones_plant_zone_idx` ON `plant_geographic_zones` (`plant_id`,`zone_id`);