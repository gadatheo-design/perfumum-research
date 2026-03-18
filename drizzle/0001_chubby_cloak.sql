CREATE TABLE `olfactive_emissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plant_id` int,
	`molecule_id` int,
	`tabac_id` int,
	`plant_part` enum('fleur','feuille','fruit','zeste','graine','ecorce','bois','racine','rhizome','resine','plante_entiere','autre'),
	`extraction_method` enum('hydrodistillation','entrainement_vapeur','expression_a_froid','extraction_co2','enfleurage','maceration','teinture','solvant_organique','pyrolyse','headspace','spme','autre'),
	`percentage` decimal(8,4),
	`percentage_min` decimal(8,4),
	`percentage_max` decimal(8,4),
	`concentration_ppm` decimal(12,4),
	`concentration_unit` varchar(20) DEFAULT '%',
	`analysis_method` enum('gc_ms','gc_fid','hplc','rnm','headspace_gcms','spme_gcms','autre'),
	`analysis_source` varchar(500),
	`geographic_origin` varchar(255),
	`retention_time` decimal(8,4),
	`match_quality` int,
	`period_start` int,
	`period_end` int,
	`role` enum('majeur','secondaire','trace','variable','signature'),
	`is_signature` boolean DEFAULT false,
	`source_table` varchar(100),
	`source_id` int,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `olfactive_emissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `oe_plant_idx` ON `olfactive_emissions` (`plant_id`);--> statement-breakpoint
CREATE INDEX `oe_molecule_idx` ON `olfactive_emissions` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `oe_tabac_idx` ON `olfactive_emissions` (`tabac_id`);--> statement-breakpoint
CREATE INDEX `oe_method_idx` ON `olfactive_emissions` (`analysis_method`);--> statement-breakpoint
CREATE INDEX `oe_role_idx` ON `olfactive_emissions` (`role`);