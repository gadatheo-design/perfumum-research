CREATE TABLE `bibliography_author_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`author_id` int NOT NULL,
	`bibliography_entry_id` int,
	`v3_reference_id` int,
	`author_order` int NOT NULL DEFAULT 1,
	`role` varchar(50) DEFAULT 'author',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bibliography_author_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `bib_author_link_unique_entry` UNIQUE(`author_id`,`bibliography_entry_id`),
	CONSTRAINT `bib_author_link_unique_v3ref` UNIQUE(`author_id`,`v3_reference_id`)
);
--> statement-breakpoint
CREATE TABLE `bibliography_authors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`first_name` varchar(100),
	`last_name` varchar(100) NOT NULL,
	`orcid` varchar(20),
	`wikidata_qid` varchar(20),
	`openalex_id` varchar(50),
	`affiliations` json,
	`research_domains` json,
	`name_variants` json,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bibliography_authors_id` PRIMARY KEY(`id`),
	CONSTRAINT `bib_author_orcid_idx` UNIQUE(`orcid`)
);
--> statement-breakpoint
ALTER TABLE `bibliography_author_links` ADD CONSTRAINT `bibliography_author_links_author_id_bibliography_authors_id_fk` FOREIGN KEY (`author_id`) REFERENCES `bibliography_authors`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bibliography_author_links` ADD CONSTRAINT `bibliography_author_links_bibliography_entry_id_bibliography_entries_id_fk` FOREIGN KEY (`bibliography_entry_id`) REFERENCES `bibliography_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bibliography_author_links` ADD CONSTRAINT `bibliography_author_links_v3_reference_id_v3_references_id_fk` FOREIGN KEY (`v3_reference_id`) REFERENCES `v3_references`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `bib_author_link_author_idx` ON `bibliography_author_links` (`author_id`);--> statement-breakpoint
CREATE INDEX `bib_author_link_entry_idx` ON `bibliography_author_links` (`bibliography_entry_id`);--> statement-breakpoint
CREATE INDEX `bib_author_link_v3ref_idx` ON `bibliography_author_links` (`v3_reference_id`);--> statement-breakpoint
CREATE INDEX `bib_author_last_name_idx` ON `bibliography_authors` (`last_name`);--> statement-breakpoint
CREATE INDEX `bib_author_wikidata_idx` ON `bibliography_authors` (`wikidata_qid`);