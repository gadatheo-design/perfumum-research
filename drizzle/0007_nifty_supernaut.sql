CREATE TABLE `supplier_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplier_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`price_per_unit` decimal(10,2),
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`minimum_order_quantity` int,
	`unit` varchar(50),
	`lead_time_days` int,
	`quality_grade` enum('standard','premium','extra_premium') NOT NULL DEFAULT 'standard',
	`is_available` int NOT NULL DEFAULT 1,
	`last_order_date` timestamp,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supplier_materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_supplier_material` UNIQUE(`supplier_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`company_name` varchar(255),
	`country` varchar(100) NOT NULL,
	`region` varchar(100),
	`email` varchar(320),
	`phone` varchar(20),
	`website` varchar(255),
	`specialties` json,
	`description` text,
	`rating` int,
	`certifications` json,
	`is_preferred` int NOT NULL DEFAULT 0,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `supplier_materials` ADD CONSTRAINT `supplier_materials_supplier_id_suppliers_id_fk` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplier_materials` ADD CONSTRAINT `supplier_materials_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `supplier_material_supplier_idx` ON `supplier_materials` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `supplier_material_molecule_idx` ON `supplier_materials` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `supplier_name_idx` ON `suppliers` (`name`);--> statement-breakpoint
CREATE INDEX `supplier_country_idx` ON `suppliers` (`country`);--> statement-breakpoint
CREATE INDEX `supplier_region_idx` ON `suppliers` (`region`);