CREATE TABLE `axis_reference_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`axis_id` int NOT NULL,
	`reference_id` int NOT NULL,
	`link_type` enum('primary_source','secondary_source','methodology','theoretical_basis','case_study','data_source','comparative','historical','review','other') DEFAULT 'secondary_source',
	`relevance_score` int DEFAULT 50,
	`confidence` enum('high','medium','low') DEFAULT 'medium',
	`notes` text,
	`excerpt` text,
	`page_numbers` varchar(100),
	`display_weight` int DEFAULT 1,
	`is_highlighted` boolean DEFAULT false,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `axis_reference_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_axis_reference` UNIQUE(`axis_id`,`reference_id`)
);
--> statement-breakpoint
ALTER TABLE `axis_reference_links` ADD CONSTRAINT `axis_reference_links_axis_id_research_axes_id_fk` FOREIGN KEY (`axis_id`) REFERENCES `research_axes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `axis_reference_links` ADD CONSTRAINT `axis_reference_links_reference_id_v3_references_id_fk` FOREIGN KEY (`reference_id`) REFERENCES `v3_references`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `axis_ref_link_axis_idx` ON `axis_reference_links` (`axis_id`);--> statement-breakpoint
CREATE INDEX `axis_ref_link_ref_idx` ON `axis_reference_links` (`reference_id`);--> statement-breakpoint
CREATE INDEX `axis_ref_link_type_idx` ON `axis_reference_links` (`link_type`);