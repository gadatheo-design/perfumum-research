CREATE TABLE `tps_gene_molecules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tps_gene_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`relationship_type` enum('produces','catalyzes','regulates','precursor') NOT NULL DEFAULT 'produces',
	`confidence_level` enum('confirmed','predicted','inferred') NOT NULL DEFAULT 'inferred',
	`evidence_source` varchar(500),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tps_gene_molecules_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_tps_gene_molecule` UNIQUE(`tps_gene_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `tps_genes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`subfamily` varchar(20) NOT NULL,
	`product_class` varchar(50) NOT NULL,
	`main_product` varchar(100) NOT NULL,
	`olfactory_notes` text,
	`pathway` varchar(10) NOT NULL,
	`regulation_factors` text,
	`expression_conditions` text,
	`source_reference` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tps_genes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `tps_gene_molecules` ADD CONSTRAINT `tps_gene_molecules_tps_gene_id_tps_genes_id_fk` FOREIGN KEY (`tps_gene_id`) REFERENCES `tps_genes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tps_gene_molecules` ADD CONSTRAINT `tps_gene_molecules_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `tps_gene_molecules_gene_idx` ON `tps_gene_molecules` (`tps_gene_id`);--> statement-breakpoint
CREATE INDEX `tps_gene_molecules_molecule_idx` ON `tps_gene_molecules` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `tps_genes_name_idx` ON `tps_genes` (`name`);--> statement-breakpoint
CREATE INDEX `tps_genes_subfamily_idx` ON `tps_genes` (`subfamily`);--> statement-breakpoint
CREATE INDEX `tps_genes_product_class_idx` ON `tps_genes` (`product_class`);