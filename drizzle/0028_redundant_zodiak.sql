CREATE TABLE `molecular_transformations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_molecule_id` int,
	`source_molecule_name` varchar(255) NOT NULL,
	`product_molecule_id` int,
	`product_molecule_name` varchar(255) NOT NULL,
	`transformation_type` enum('pyrolysis','oxidation','isomerization','dehydration','cyclization','ring_opening','polymerization','degradation','maillard','caramelization','other') NOT NULL DEFAULT 'pyrolysis',
	`temperature_min` int,
	`temperature_max` int,
	`temperature_optimal` int,
	`time_seconds` int,
	`atmosphere` enum('air','nitrogen','vacuum','oxygen','mixed') DEFAULT 'air',
	`yield_percent` decimal(5,2),
	`reaction_order` varchar(50),
	`activation_energy` decimal(10,2),
	`olfactory_change_description` text,
	`source_olfactory_notes` varchar(500),
	`product_olfactory_notes` varchar(500),
	`relevance_context` enum('tobacco_combustion','tobacco_heating','incense_burning','essential_oil_distillation','perfume_aging','food_cooking','industrial_process','natural_degradation','other') DEFAULT 'tobacco_combustion',
	`source_reference` text,
	`doi` varchar(255),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `molecular_transformations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `molecular_transformations` ADD CONSTRAINT `molecular_transformations_source_molecule_id_molecules_id_fk` FOREIGN KEY (`source_molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecular_transformations` ADD CONSTRAINT `molecular_transformations_product_molecule_id_molecules_id_fk` FOREIGN KEY (`product_molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;