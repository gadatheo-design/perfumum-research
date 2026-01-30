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
ALTER TABLE `plant_molecules` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `leaf_economies` ADD `image_url` varchar(500);--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD `percentage_min` decimal(5,2);--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD `percentage_max` decimal(5,2);--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD `percentage_typical` decimal(5,2);--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD `role` enum('majeur','secondaire','trace','variable');--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD `variability_factor` enum('stable','saisonnier','geographique','chemotype','extraction');--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD `source` varchar(255);--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD CONSTRAINT `unique_plant_molecule` UNIQUE(`plant_id`,`molecule_id`);--> statement-breakpoint
ALTER TABLE `sample_images` ADD CONSTRAINT `sample_images_leaf_economy_id_leaf_economies_id_fk` FOREIGN KEY (`leaf_economy_id`) REFERENCES `leaf_economies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sample_images` ADD CONSTRAINT `sample_images_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sample_images` ADD CONSTRAINT `sample_images_uploaded_by_users_id_fk` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `sample_images_leaf_economy_idx` ON `sample_images` (`leaf_economy_id`);--> statement-breakpoint
CREATE INDEX `sample_images_plant_idx` ON `sample_images` (`plant_id`);--> statement-breakpoint
CREATE INDEX `sample_images_category_idx` ON `sample_images` (`category`);--> statement-breakpoint
ALTER TABLE `plant_molecules` DROP COLUMN `percentage`;