CREATE TABLE `inventory_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entry_id` varchar(30) NOT NULL,
	`raw_material_id` int NOT NULL,
	`purchase_date` timestamp NOT NULL,
	`supplier_id` int,
	`supplier_name` varchar(255),
	`quantity` decimal(10,2) NOT NULL,
	`unit` enum('ml','g','kg','L','oz','lb') NOT NULL DEFAULT 'ml',
	`remaining_quantity` decimal(10,2),
	`price` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'CHF',
	`price_per_unit` decimal(10,4),
	`batch_number` varchar(100),
	`expiration_date` timestamp,
	`storage_location` varchar(255),
	`storage_conditions` text,
	`notes` text,
	`quality_notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inventory_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `inventory_entries_entry_id_unique` UNIQUE(`entry_id`)
);
--> statement-breakpoint
ALTER TABLE `inventory_entries` ADD CONSTRAINT `inventory_entries_raw_material_id_raw_materials_id_fk` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_entries` ADD CONSTRAINT `inventory_entries_supplier_id_suppliers_id_fk` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `inventory_raw_material_idx` ON `inventory_entries` (`raw_material_id`);--> statement-breakpoint
CREATE INDEX `inventory_supplier_idx` ON `inventory_entries` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `inventory_purchase_date_idx` ON `inventory_entries` (`purchase_date`);