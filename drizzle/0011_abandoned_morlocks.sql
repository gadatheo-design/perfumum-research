CREATE TABLE `supplier_alternative_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplier_id` int NOT NULL,
	`alternative_id` int NOT NULL,
	`product_name` varchar(255),
	`product_code` varchar(100),
	`price_range` varchar(100),
	`availability_status` enum('in_stock','limited_stock','on_demand','seasonal','out_of_stock') DEFAULT 'in_stock',
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supplier_alternative_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `supplier_alt_link_unique` UNIQUE(`supplier_id`,`alternative_id`)
);
--> statement-breakpoint
CREATE TABLE `verified_suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`company_type` enum('producer','cooperative','distributor','laboratory','biotechnology','artisan','other') NOT NULL,
	`country` varchar(100) NOT NULL,
	`region` varchar(255),
	`address` text,
	`website` varchar(500),
	`email` varchar(255),
	`phone` varchar(50),
	`contact_person` varchar(255),
	`certifications` json DEFAULT ('[]'),
	`specialties` json DEFAULT ('[]'),
	`sustainable_practices` text,
	`sustainability_rating` int,
	`quality_rating` int,
	`reliability_rating` int,
	`minimum_order_quantity` varchar(100),
	`lead_time` varchar(100),
	`payment_terms` varchar(255),
	`ships_to` json DEFAULT ('[]'),
	`verified` boolean DEFAULT false,
	`verified_by` varchar(255),
	`verified_at` timestamp,
	`last_contact_date` timestamp,
	`notes` text,
	`references` json DEFAULT ('[]'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verified_suppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `supplier_alternative_links` ADD CONSTRAINT `supplier_alternative_links_supplier_id_verified_suppliers_id_fk` FOREIGN KEY (`supplier_id`) REFERENCES `verified_suppliers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplier_alternative_links` ADD CONSTRAINT `supplier_alternative_links_alternative_id_sustainable_alternatives_id_fk` FOREIGN KEY (`alternative_id`) REFERENCES `sustainable_alternatives`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `supplier_alt_link_supplier_idx` ON `supplier_alternative_links` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `supplier_alt_link_alternative_idx` ON `supplier_alternative_links` (`alternative_id`);--> statement-breakpoint
CREATE INDEX `verified_suppliers_country_idx` ON `verified_suppliers` (`country`);--> statement-breakpoint
CREATE INDEX `verified_suppliers_type_idx` ON `verified_suppliers` (`company_type`);--> statement-breakpoint
CREATE INDEX `verified_suppliers_verified_idx` ON `verified_suppliers` (`verified`);