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
	`category` enum('huile_essentielle','absolue','concrete','resinoid','teinture','co2_extract','hydrolat','beurre','cire','oleoresine','infusion','maceration','distillat','autre') NOT NULL,
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
ALTER TABLE `molecule_plant_sources` ADD CONSTRAINT `molecule_plant_sources_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_plant_sources` ADD CONSTRAINT `molecule_plant_sources_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `raw_material_molecules` ADD CONSTRAINT `raw_material_molecules_raw_material_id_raw_materials_id_fk` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `raw_material_molecules` ADD CONSTRAINT `raw_material_molecules_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `raw_materials` ADD CONSTRAINT `raw_materials_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `raw_materials` ADD CONSTRAINT `raw_materials_terroir_id_terroirs_id_fk` FOREIGN KEY (`terroir_id`) REFERENCES `terroirs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `raw_materials` ADD CONSTRAINT `raw_materials_extraction_method_id_extraction_methods_id_fk` FOREIGN KEY (`extraction_method_id`) REFERENCES `extraction_methods`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terroir_specialties` ADD CONSTRAINT `terroir_specialties_terroir_id_terroirs_id_fk` FOREIGN KEY (`terroir_id`) REFERENCES `terroirs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terroir_specialties` ADD CONSTRAINT `terroir_specialties_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `terroir_specialties` ADD CONSTRAINT `terroir_specialties_raw_material_id_raw_materials_id_fk` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials`(`id`) ON DELETE no action ON UPDATE no action;