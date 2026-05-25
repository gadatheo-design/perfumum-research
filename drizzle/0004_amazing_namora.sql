CREATE TABLE `bibliography_cross_citations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` int NOT NULL,
	`target_doi` varchar(255) NOT NULL,
	`target_id` int,
	`target_title` varchar(500),
	`target_authors` text,
	`target_year` int,
	`target_journal` varchar(255),
	`cited_by_count` int DEFAULT 0,
	`relation_type` enum('cites','is_cited_by','co_cited') NOT NULL DEFAULT 'cites',
	`data_source` varchar(50) NOT NULL DEFAULT 'crossref',
	`fetched_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bibliography_cross_citations_id` PRIMARY KEY(`id`),
	CONSTRAINT `bcc_unique_citation_idx` UNIQUE(`source_id`,`target_doi`,`relation_type`)
);
--> statement-breakpoint
ALTER TABLE `bibliography_cross_citations` ADD CONSTRAINT `bibliography_cross_citations_source_id_bibliography_entries_id_fk` FOREIGN KEY (`source_id`) REFERENCES `bibliography_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bibliography_cross_citations` ADD CONSTRAINT `bibliography_cross_citations_target_id_bibliography_entries_id_fk` FOREIGN KEY (`target_id`) REFERENCES `bibliography_entries`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `bcc_source_idx` ON `bibliography_cross_citations` (`source_id`);--> statement-breakpoint
CREATE INDEX `bcc_target_doi_idx` ON `bibliography_cross_citations` (`target_doi`);--> statement-breakpoint
CREATE INDEX `bcc_target_id_idx` ON `bibliography_cross_citations` (`target_id`);