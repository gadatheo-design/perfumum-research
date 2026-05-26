CREATE TABLE `europeana_bookmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`europeana_id` varchar(500) NOT NULL,
	`theme` varchar(100),
	`title` varchar(500) NOT NULL,
	`creator` varchar(500),
	`date` varchar(100),
	`institution` varchar(500),
	`country` varchar(100),
	`europeana_url` varchar(1000),
	`thumbnail_url` varchar(1000),
	`thumbnail_url_large` varchar(1000),
	`iiif_manifest_url` varchar(1000),
	`rights` varchar(500),
	`rights_label` varchar(200),
	`media_type` varchar(50),
	`linked_plant_id` int,
	`linked_molecule_id` int,
	`research_notes` text,
	`tags` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `europeana_bookmarks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_europeana_id` ON `europeana_bookmarks` (`europeana_id`);--> statement-breakpoint
CREATE INDEX `idx_theme` ON `europeana_bookmarks` (`theme`);--> statement-breakpoint
CREATE INDEX `idx_linked_plant` ON `europeana_bookmarks` (`linked_plant_id`);--> statement-breakpoint
CREATE INDEX `idx_linked_molecule` ON `europeana_bookmarks` (`linked_molecule_id`);