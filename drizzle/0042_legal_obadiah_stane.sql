CREATE TABLE `recette_raw_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recette_id` int NOT NULL,
	`raw_material_id` int NOT NULL,
	`role` enum('base','coeur','tete','fixateur','modificateur','autre') DEFAULT 'autre',
	`dosage` decimal(8,3),
	`dosage_unit` varchar(20) DEFAULT 'g',
	`percentage` decimal(5,2),
	`notes` text,
	`sort_order` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recette_raw_materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `rrm_unique_link` UNIQUE(`recette_id`,`raw_material_id`)
);
--> statement-breakpoint
CREATE INDEX `rrm_recette_idx` ON `recette_raw_materials` (`recette_id`);--> statement-breakpoint
CREATE INDEX `rrm_raw_material_idx` ON `recette_raw_materials` (`raw_material_id`);