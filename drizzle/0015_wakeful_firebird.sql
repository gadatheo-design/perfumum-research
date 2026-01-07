CREATE TABLE `analytical_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`method_id` varchar(30) NOT NULL,
	`name` varchar(255) NOT NULL,
	`modality` varchar(255),
	`sample_types` text,
	`output` text,
	`strengths` text,
	`limitations` text,
	`typical_markers` text,
	`sop_outline` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analytical_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `analytical_methods_method_id_unique` UNIQUE(`method_id`)
);
--> statement-breakpoint
CREATE TABLE `lost_molecules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule_id` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`molecule_class` varchar(100),
	`formula` varchar(100),
	`notes` text,
	`linked_molecule_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lost_molecules_id` PRIMARY KEY(`id`),
	CONSTRAINT `lost_molecules_molecule_id_unique` UNIQUE(`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `molecule_evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evidence_id` varchar(100) NOT NULL,
	`lost_molecule_id` int NOT NULL,
	`molecule_name` varchar(255),
	`marker_type` varchar(100),
	`process_context` varchar(255),
	`method` varchar(255),
	`time_context` varchar(500),
	`region_context` varchar(255),
	`entity_type` enum('plant','animal','material','reference'),
	`entity_name` varchar(255),
	`entity_id` varchar(100),
	`claim_summary` text,
	`confidence` enum('low','medium','high') DEFAULT 'medium',
	`reference_id` varchar(100),
	`reference_title` text,
	`doi` varchar(255),
	`url` text,
	`tags` text,
	`evidence_notes` text,
	`method_id` varchar(30),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `molecule_evidence_id` PRIMARY KEY(`id`),
	CONSTRAINT `molecule_evidence_evidence_id_unique` UNIQUE(`evidence_id`)
);
--> statement-breakpoint
ALTER TABLE `lost_molecules` ADD CONSTRAINT `lost_molecules_linked_molecule_id_molecules_id_fk` FOREIGN KEY (`linked_molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_evidence` ADD CONSTRAINT `molecule_evidence_lost_molecule_id_lost_molecules_id_fk` FOREIGN KEY (`lost_molecule_id`) REFERENCES `lost_molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `lost_molecules_class_idx` ON `lost_molecules` (`molecule_class`);--> statement-breakpoint
CREATE INDEX `lost_molecules_linked_idx` ON `lost_molecules` (`linked_molecule_id`);--> statement-breakpoint
CREATE INDEX `molecule_evidence_molecule_idx` ON `molecule_evidence` (`lost_molecule_id`);--> statement-breakpoint
CREATE INDEX `molecule_evidence_marker_type_idx` ON `molecule_evidence` (`marker_type`);--> statement-breakpoint
CREATE INDEX `molecule_evidence_confidence_idx` ON `molecule_evidence` (`confidence`);--> statement-breakpoint
CREATE INDEX `molecule_evidence_entity_type_idx` ON `molecule_evidence` (`entity_type`);--> statement-breakpoint
CREATE INDEX `molecule_evidence_method_idx` ON `molecule_evidence` (`method_id`);--> statement-breakpoint
CREATE INDEX `molecule_evidence_reference_idx` ON `molecule_evidence` (`reference_id`);