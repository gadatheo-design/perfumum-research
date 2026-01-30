CREATE TABLE `classification_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`snapshot_date` timestamp NOT NULL,
	`total_molecules` int NOT NULL,
	`molecules_with_family` int NOT NULL,
	`molecules_with_chemical_class` int NOT NULL,
	`molecules_with_cas_number` int NOT NULL,
	`molecules_with_iupac_name` int NOT NULL,
	`molecules_with_formula` int NOT NULL,
	`molecules_with_olfactive_profile` int NOT NULL,
	`molecules_with_radar` int NOT NULL,
	`molecules_linked_to_recettes` int NOT NULL,
	`molecules_linked_to_plants` int NOT NULL,
	`plants_linked_to_terroirs` int NOT NULL,
	`overall_classification_rate` int NOT NULL,
	`overall_linking_rate` int NOT NULL,
	`total_recettes` int NOT NULL,
	`total_plants` int NOT NULL,
	`total_terroirs` int NOT NULL,
	`total_accords` int NOT NULL,
	`notes` text,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `classification_snapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('import_orphan_molecules','new_contribution','validation_required','classification_milestone','system_alert','data_quality','other') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`severity` enum('info','warning','error','success') NOT NULL DEFAULT 'info',
	`entity_type` varchar(50),
	`entity_id` int,
	`metadata` json,
	`is_read` boolean NOT NULL DEFAULT false,
	`read_at` timestamp,
	`read_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `snapshot_date_idx` ON `classification_snapshots` (`snapshot_date`);--> statement-breakpoint
CREATE INDEX `notification_type_idx` ON `notifications` (`type`);--> statement-breakpoint
CREATE INDEX `notification_read_idx` ON `notifications` (`is_read`);--> statement-breakpoint
CREATE INDEX `notification_created_idx` ON `notifications` (`created_at`);