CREATE TABLE `publication_extraction_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publication_id` int NOT NULL,
	`extraction_method_id` int NOT NULL,
	`is_key_finding` boolean DEFAULT false,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `publication_extraction_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_pub_extraction` UNIQUE(`publication_id`,`extraction_method_id`)
);
--> statement-breakpoint
ALTER TABLE `publication_extraction_methods` ADD CONSTRAINT `publication_extraction_methods_publication_id_research_publications_id_fk` FOREIGN KEY (`publication_id`) REFERENCES `research_publications`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_extraction_methods` ADD CONSTRAINT `publication_extraction_methods_extraction_method_id_extraction_methods_id_fk` FOREIGN KEY (`extraction_method_id`) REFERENCES `extraction_methods`(`id`) ON DELETE cascade ON UPDATE no action;