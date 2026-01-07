CREATE TABLE `evidence_bibliography_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evidence_id` int NOT NULL,
	`bibliography_id` int NOT NULL,
	`link_type` enum('primary','secondary','methodology','context') DEFAULT 'primary',
	`match_method` enum('doi','title','manual','auto') DEFAULT 'manual',
	`match_score` int,
	`notes` text,
	`verified` boolean DEFAULT false,
	`verified_by` int,
	`verified_at` timestamp,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evidence_bibliography_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_evidence_bibliography` UNIQUE(`evidence_id`,`bibliography_id`)
);
--> statement-breakpoint
CREATE TABLE `heritage_chemotypes_timeline` (
	`id` int AUTO_INCREMENT NOT NULL,
	`period_code` varchar(50) NOT NULL,
	`period_name` varchar(255) NOT NULL,
	`start_year` int,
	`end_year` int,
	`region_code` varchar(50),
	`region_name` varchar(255),
	`chemotype_class` enum('alkaloid','cannabinoid','terpene','sesquiterpene','monoterpene','phenolic','flavonoid','other'),
	`description` text,
	`historical_context` text,
	`evidence_count` int DEFAULT 0,
	`primary_sources` json,
	`linked_molecule_ids` json,
	`linked_main_molecule_ids` json,
	`analytical_methods` json,
	`color` varchar(20) DEFAULT '#6366f1',
	`display_order` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `heritage_chemotypes_timeline_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `evidence_bibliography_links` ADD CONSTRAINT `evidence_bibliography_links_evidence_id_molecule_evidence_id_fk` FOREIGN KEY (`evidence_id`) REFERENCES `molecule_evidence`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evidence_bibliography_links` ADD CONSTRAINT `evidence_bibliography_links_bibliography_id_bibliography_entries_id_fk` FOREIGN KEY (`bibliography_id`) REFERENCES `bibliography_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evidence_bibliography_links` ADD CONSTRAINT `evidence_bibliography_links_verified_by_users_id_fk` FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evidence_bibliography_links` ADD CONSTRAINT `evidence_bibliography_links_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `evidence_bibliography_evidence_idx` ON `evidence_bibliography_links` (`evidence_id`);--> statement-breakpoint
CREATE INDEX `evidence_bibliography_bibliography_idx` ON `evidence_bibliography_links` (`bibliography_id`);--> statement-breakpoint
CREATE INDEX `heritage_timeline_period_idx` ON `heritage_chemotypes_timeline` (`period_code`);--> statement-breakpoint
CREATE INDEX `heritage_timeline_region_idx` ON `heritage_chemotypes_timeline` (`region_code`);--> statement-breakpoint
CREATE INDEX `heritage_timeline_chemotype_idx` ON `heritage_chemotypes_timeline` (`chemotype_class`);--> statement-breakpoint
CREATE INDEX `heritage_timeline_year_idx` ON `heritage_chemotypes_timeline` (`start_year`,`end_year`);