CREATE TABLE `molecule_analytical_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule_id` int NOT NULL,
	`method_id` int NOT NULL,
	`is_primary` boolean DEFAULT false,
	`detection_limit` decimal(10,6),
	`detection_unit` varchar(20),
	`accuracy` decimal(5,2),
	`analysis_date` timestamp,
	`laboratory_name` varchar(255),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `molecule_analytical_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_molecule_method` UNIQUE(`molecule_id`,`method_id`)
);
--> statement-breakpoint
ALTER TABLE `molecule_analytical_methods` ADD CONSTRAINT `molecule_analytical_methods_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_analytical_methods` ADD CONSTRAINT `molecule_analytical_methods_method_id_analytical_methods_id_fk` FOREIGN KEY (`method_id`) REFERENCES `analytical_methods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `mol_method_molecule_idx` ON `molecule_analytical_methods` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `mol_method_method_idx` ON `molecule_analytical_methods` (`method_id`);