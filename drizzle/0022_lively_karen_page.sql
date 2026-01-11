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
CREATE INDEX `gv_image_variety_idx` ON `ghost_variety_images` (`ghost_variety_id`);--> statement-breakpoint
CREATE INDEX `gv_image_sort_idx` ON `ghost_variety_images` (`ghost_variety_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX `gv_mol_link_variety_idx` ON `ghost_variety_molecule_links` (`ghost_variety_id`);--> statement-breakpoint
CREATE INDEX `gv_mol_link_molecule_idx` ON `ghost_variety_molecule_links` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `gv_plant_link_variety_idx` ON `ghost_variety_plant_links` (`ghost_variety_id`);--> statement-breakpoint
CREATE INDEX `gv_plant_link_plant_idx` ON `ghost_variety_plant_links` (`plant_id`);