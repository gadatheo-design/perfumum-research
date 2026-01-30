CREATE TABLE `genomic_molecule_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`link_type` enum('biosynthesis','characterization','quantification','pathway','gene_association','regulation','evolution','application','other') DEFAULT 'characterization',
	`genomic_axis` enum('G1','G2','G3') NOT NULL,
	`relevance_score` int DEFAULT 50,
	`confidence` enum('high','medium','low') DEFAULT 'medium',
	`gene_names` json,
	`pathway_name` varchar(255),
	`enzyme_names` json,
	`notes` text,
	`excerpt` text,
	`page_numbers` varchar(50),
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `genomic_molecule_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_genomic_ref_mol` UNIQUE(`reference_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `genomic_plant_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference_id` int NOT NULL,
	`plant_id` int NOT NULL,
	`link_type` enum('genome_sequencing','transcriptomics','metabolomics','phylogenetics','breeding','gene_editing','marker_development','comparative','other') DEFAULT 'genome_sequencing',
	`genomic_axis` enum('G1','G2','G3') NOT NULL,
	`relevance_score` int DEFAULT 50,
	`confidence` enum('high','medium','low') DEFAULT 'medium',
	`genome_version` varchar(100),
	`assembly_accession` varchar(100),
	`sequencing_method` varchar(255),
	`notes` text,
	`excerpt` text,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `genomic_plant_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_genomic_ref_plant` UNIQUE(`reference_id`,`plant_id`)
);
--> statement-breakpoint
CREATE TABLE `ghost_varieties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`scientific_name` varchar(255),
	`common_names` json,
	`plant_family` varchar(255),
	`genus` varchar(255),
	`species` varchar(255),
	`cultivar` varchar(255),
	`variety_type` enum('rose','jasmine','tobacco','cannabis','lavender','citrus','aromatic_herb','resin_tree','other') NOT NULL,
	`conservation_status` enum('extinct','extinct_wild','critically_endangered','endangered','vulnerable','near_threatened','reconstructed','unknown') NOT NULL,
	`last_documented_year` int,
	`last_documented_location` varchar(255),
	`peak_cultivation_period` varchar(255),
	`disappearance_causes` json,
	`olfactive_profile` text,
	`molecular_profile` json,
	`reconstruction_attempts` json,
	`historical_sources` json,
	`description` text,
	`historical_significance` text,
	`notes` text,
	`image_url` varchar(500),
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ghost_varieties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `genomic_mol_link_ref_idx` ON `genomic_molecule_links` (`reference_id`);--> statement-breakpoint
CREATE INDEX `genomic_mol_link_mol_idx` ON `genomic_molecule_links` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `genomic_mol_link_axis_idx` ON `genomic_molecule_links` (`genomic_axis`);--> statement-breakpoint
CREATE INDEX `genomic_plant_link_ref_idx` ON `genomic_plant_links` (`reference_id`);--> statement-breakpoint
CREATE INDEX `genomic_plant_link_plant_idx` ON `genomic_plant_links` (`plant_id`);--> statement-breakpoint
CREATE INDEX `genomic_plant_link_axis_idx` ON `genomic_plant_links` (`genomic_axis`);--> statement-breakpoint
CREATE INDEX `ghost_variety_name_idx` ON `ghost_varieties` (`name`);--> statement-breakpoint
CREATE INDEX `ghost_varieties_type_idx` ON `ghost_varieties` (`variety_type`);--> statement-breakpoint
CREATE INDEX `ghost_varieties_status_idx` ON `ghost_varieties` (`conservation_status`);