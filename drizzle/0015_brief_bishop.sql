CREATE TABLE `olfactory_traditions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`period` varchar(100),
	`start_year` int,
	`end_year` int,
	`region` varchar(255),
	`civilization` varchar(255),
	`description` text,
	`historical_context` text,
	`known_ingredients` json,
	`techniques` json,
	`reconstruction_status` enum('documented','partial','reconstructed','speculative') DEFAULT 'documented',
	`primary_sources` text,
	`modern_sources` text,
	`tags` json,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `olfactory_traditions_id` PRIMARY KEY(`id`),
	CONSTRAINT `olfactory_traditions_code_unique` UNIQUE(`code`),
	CONSTRAINT `tradition_code_idx` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `reference_entity_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference_id` int NOT NULL,
	`entity_type` enum('leaf_economy','molecule','recette','plant','prototype','tradition','terroir','supplier') NOT NULL,
	`entity_id` int NOT NULL,
	`link_type` enum('documents','mentions','analyzes','conserves','reconstructs','sources','validates','contextualizes') DEFAULT 'documents',
	`relevance_score` int DEFAULT 50,
	`notes` text,
	`context` text,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reference_entity_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_ref_entity_link` UNIQUE(`reference_id`,`entity_type`,`entity_id`)
);
--> statement-breakpoint
ALTER TABLE `olfactory_traditions` ADD CONSTRAINT `olfactory_traditions_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_entity_links` ADD CONSTRAINT `reference_entity_links_reference_id_v3_references_id_fk` FOREIGN KEY (`reference_id`) REFERENCES `v3_references`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_entity_links` ADD CONSTRAINT `reference_entity_links_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `tradition_period_idx` ON `olfactory_traditions` (`period`);--> statement-breakpoint
CREATE INDEX `tradition_region_idx` ON `olfactory_traditions` (`region`);--> statement-breakpoint
CREATE INDEX `tradition_status_idx` ON `olfactory_traditions` (`reconstruction_status`);--> statement-breakpoint
CREATE INDEX `ref_entity_ref_idx` ON `reference_entity_links` (`reference_id`);--> statement-breakpoint
CREATE INDEX `ref_entity_entity_idx` ON `reference_entity_links` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `ref_entity_link_type_idx` ON `reference_entity_links` (`link_type`);