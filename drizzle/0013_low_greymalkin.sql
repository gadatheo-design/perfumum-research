CREATE TABLE `reference_citations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`citing_id` int NOT NULL,
	`cited_id` int NOT NULL,
	`citation_type` enum('direct','indirect','methodological','theoretical','data','critique','support','comparison') DEFAULT 'direct',
	`context` text,
	`page_number` varchar(50),
	`notes` text,
	`weight` int DEFAULT 1,
	`verified` boolean DEFAULT false,
	`verified_by` int,
	`verified_at` timestamp,
	`added_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reference_citations_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_reference_citation` UNIQUE(`citing_id`,`cited_id`)
);
--> statement-breakpoint
ALTER TABLE `reference_citations` ADD CONSTRAINT `reference_citations_citing_id_bibliography_entries_id_fk` FOREIGN KEY (`citing_id`) REFERENCES `bibliography_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_citations` ADD CONSTRAINT `reference_citations_cited_id_bibliography_entries_id_fk` FOREIGN KEY (`cited_id`) REFERENCES `bibliography_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_citations` ADD CONSTRAINT `reference_citations_verified_by_users_id_fk` FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_citations` ADD CONSTRAINT `reference_citations_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `reference_citations_citing_idx` ON `reference_citations` (`citing_id`);--> statement-breakpoint
CREATE INDEX `reference_citations_cited_idx` ON `reference_citations` (`cited_id`);--> statement-breakpoint
CREATE INDEX `reference_citations_type_idx` ON `reference_citations` (`citation_type`);