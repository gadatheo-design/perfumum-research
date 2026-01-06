CREATE TABLE `bibliography_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_type` enum('scientific_paper','book','book_chapter','thesis','conference','patent','report','article','website','database','podcast','video','interview','archive','dataset','software','other') NOT NULL,
	`title` varchar(1000) NOT NULL,
	`authors` text,
	`publication_year` int,
	`publication_month` int,
	`access_date` timestamp,
	`journal` varchar(500),
	`volume` varchar(50),
	`issue` varchar(50),
	`pages` varchar(100),
	`publisher` varchar(500),
	`edition` varchar(50),
	`language` varchar(50) DEFAULT 'fr',
	`doi` varchar(255),
	`isbn` varchar(20),
	`issn` varchar(20),
	`pmid` varchar(20),
	`arxiv_id` varchar(50),
	`url` varchar(2000),
	`abstract` text,
	`keywords` text,
	`notes` text,
	`quotes` text,
	`relevance_score` int,
	`relevant_axes` text,
	`file_url` varchar(2000),
	`file_name` varchar(255),
	`citation_apa` text,
	`citation_bibtex` text,
	`is_verified` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bibliography_sources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `research_axes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`short_name` varchar(50) NOT NULL,
	`emoji` varchar(10) NOT NULL,
	`description` text NOT NULL,
	`key_topics` text,
	`color` varchar(20) NOT NULL,
	`icon_name` varchar(50),
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_axes_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_axes_code_unique` UNIQUE(`code`),
	CONSTRAINT `research_axis_code_idx` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `research_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`summary` text,
	`content` text NOT NULL,
	`entry_type` enum('note','synthesis','experiment','observation','hypothesis','discovery','review','methodology','protocol','analysis') NOT NULL DEFAULT 'note',
	`status` enum('draft','in_progress','completed','archived') NOT NULL DEFAULT 'draft',
	`primary_axis_id` int NOT NULL,
	`importance` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`is_public` boolean NOT NULL DEFAULT false,
	`is_pinned` boolean NOT NULL DEFAULT false,
	`research_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_entries_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `research_entry_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `research_entry_axes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entry_id` int NOT NULL,
	`axis_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `research_entry_axes_id` PRIMARY KEY(`id`),
	CONSTRAINT `entry_axes_unique` UNIQUE(`entry_id`,`axis_id`)
);
--> statement-breakpoint
CREATE TABLE `research_entry_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entry_id` int NOT NULL,
	`source_id` int NOT NULL,
	`citation_context` text,
	`page_reference` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `research_entry_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `entry_sources_unique` UNIQUE(`entry_id`,`source_id`)
);
--> statement-breakpoint
CREATE TABLE `research_entry_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entry_id` int NOT NULL,
	`tag_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `research_entry_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `entry_tags_unique` UNIQUE(`entry_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `research_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`color` varchar(20),
	`category` enum('topic','method','material','region','period','emotion','molecule','plant','technology','other') NOT NULL DEFAULT 'topic',
	`usage_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_tags_name_unique` UNIQUE(`name`),
	CONSTRAINT `research_tags_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `research_tag_name_idx` UNIQUE(`name`),
	CONSTRAINT `research_tag_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `bibliography_source_type_idx` ON `bibliography_sources` (`source_type`);--> statement-breakpoint
CREATE INDEX `bibliography_year_idx` ON `bibliography_sources` (`publication_year`);--> statement-breakpoint
CREATE INDEX `bibliography_doi_idx` ON `bibliography_sources` (`doi`);--> statement-breakpoint
CREATE INDEX `bibliography_isbn_idx` ON `bibliography_sources` (`isbn`);--> statement-breakpoint
CREATE INDEX `research_axis_sort_idx` ON `research_axes` (`sort_order`);--> statement-breakpoint
CREATE INDEX `research_entry_axis_idx` ON `research_entries` (`primary_axis_id`);--> statement-breakpoint
CREATE INDEX `research_entry_type_idx` ON `research_entries` (`entry_type`);--> statement-breakpoint
CREATE INDEX `research_entry_status_idx` ON `research_entries` (`status`);--> statement-breakpoint
CREATE INDEX `research_entry_date_idx` ON `research_entries` (`research_date`);--> statement-breakpoint
CREATE INDEX `entry_axes_entry_idx` ON `research_entry_axes` (`entry_id`);--> statement-breakpoint
CREATE INDEX `entry_axes_axis_idx` ON `research_entry_axes` (`axis_id`);--> statement-breakpoint
CREATE INDEX `entry_sources_entry_idx` ON `research_entry_sources` (`entry_id`);--> statement-breakpoint
CREATE INDEX `entry_sources_source_idx` ON `research_entry_sources` (`source_id`);--> statement-breakpoint
CREATE INDEX `entry_tags_entry_idx` ON `research_entry_tags` (`entry_id`);--> statement-breakpoint
CREATE INDEX `entry_tags_tag_idx` ON `research_entry_tags` (`tag_id`);--> statement-breakpoint
CREATE INDEX `research_tag_category_idx` ON `research_tags` (`category`);