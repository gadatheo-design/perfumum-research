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
CREATE TABLE `plant_molecules` (
	`plant_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`percentage` decimal(5,2),
	`is_signature` int DEFAULT 0,
	`notes` text
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
	`olfactive_signature` text,
	`dominant_molecules` text,
	`chemotypes` text,
	`climatic_axis` enum('vent','bois','disparition','vent_bois','bois_disparition','vent_disparition'),
	`traditional_use` text,
	`absorbe_use` text,
	`botanical_states` json,
	`notes` text,
	`image_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plants_id` PRIMARY KEY(`id`)
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
ALTER TABLE `final_recipe_terp_profiles` ADD CONSTRAINT `final_recipe_terp_profiles_final_recipe_id_final_recipes_id_fk` FOREIGN KEY (`final_recipe_id`) REFERENCES `final_recipes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `final_recipe_terp_profiles` ADD CONSTRAINT `final_recipe_terp_profiles_terp_profile_id_terp_profiles_id_fk` FOREIGN KEY (`terp_profile_id`) REFERENCES `terp_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD CONSTRAINT `plant_molecules_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD CONSTRAINT `plant_molecules_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terp_profile_molecules` ADD CONSTRAINT `terp_profile_molecules_terp_profile_id_terp_profiles_id_fk` FOREIGN KEY (`terp_profile_id`) REFERENCES `terp_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terp_profile_molecules` ADD CONSTRAINT `terp_profile_molecules_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terp_profile_plants` ADD CONSTRAINT `terp_profile_plants_terp_profile_id_terp_profiles_id_fk` FOREIGN KEY (`terp_profile_id`) REFERENCES `terp_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terp_profile_plants` ADD CONSTRAINT `terp_profile_plants_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;