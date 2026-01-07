CREATE TABLE `axis_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_axis_id` int NOT NULL,
	`target_axis_id` int NOT NULL,
	`strength` int DEFAULT 1,
	`connection_type` enum('related','complementary','dependent','overlap') DEFAULT 'related',
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `axis_connections_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_axis_connection` UNIQUE(`source_axis_id`,`target_axis_id`)
);
--> statement-breakpoint
CREATE TABLE `reference_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference_id` int NOT NULL,
	`note_type` enum('summary','critique','quote','methodology','connection','idea','question','todo','general') DEFAULT 'general',
	`title` varchar(255),
	`content` text NOT NULL,
	`page_number` varchar(50),
	`importance` enum('low','medium','high','critical') DEFAULT 'medium',
	`is_resolved` boolean DEFAULT false,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reference_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reference_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`category` enum('theme','method','source_type','region','period','material','discipline','project','custom') DEFAULT 'custom',
	`description` text,
	`color` varchar(20) DEFAULT '#6b7280',
	`parent_id` int,
	`usage_count` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reference_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `reference_tags_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `ref_tag_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `thematic_axes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`axis_code` varchar(20) NOT NULL,
	`name` varchar(255) NOT NULL,
	`meta_axis` enum('meta_a','meta_b','meta_c','other') NOT NULL,
	`description` text,
	`output_types` text,
	`color` varchar(20) DEFAULT '#6366f1',
	`icon` varchar(50),
	`display_order` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `thematic_axes_id` PRIMARY KEY(`id`),
	CONSTRAINT `thematic_axes_axis_code_unique` UNIQUE(`axis_code`),
	CONSTRAINT `thematic_axis_code_idx` UNIQUE(`axis_code`)
);
--> statement-breakpoint
CREATE TABLE `v3_reference_tag_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference_id` int NOT NULL,
	`tag_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `v3_reference_tag_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_v3_ref_tag` UNIQUE(`reference_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `v3_references` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entry_key` varchar(100) NOT NULL,
	`entry_type` enum('article','book','chapter','thesis','conference_paper','report','website','web_entry','news','preprint','dataset','software','misc') NOT NULL DEFAULT 'article',
	`title` varchar(500) NOT NULL,
	`authors` text,
	`year` int,
	`container_title` varchar(255),
	`publisher` varchar(255),
	`doi` varchar(100),
	`isbn` varchar(20),
	`url` varchar(500),
	`axis_primary_id` int,
	`axis_primary_code` varchar(50),
	`axes_secondary` json,
	`notes` text,
	`user_notes` text,
	`tags` json,
	`read_status` enum('unread','reading','read','to_review') DEFAULT 'unread',
	`relevance_score` int DEFAULT 50,
	`imported_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `v3_references_id` PRIMARY KEY(`id`),
	CONSTRAINT `v3_references_entry_key_unique` UNIQUE(`entry_key`),
	CONSTRAINT `v3_ref_entry_key_idx` UNIQUE(`entry_key`)
);
--> statement-breakpoint
ALTER TABLE `axis_connections` ADD CONSTRAINT `axis_connections_source_axis_id_thematic_axes_id_fk` FOREIGN KEY (`source_axis_id`) REFERENCES `thematic_axes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `axis_connections` ADD CONSTRAINT `axis_connections_target_axis_id_thematic_axes_id_fk` FOREIGN KEY (`target_axis_id`) REFERENCES `thematic_axes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_notes` ADD CONSTRAINT `reference_notes_reference_id_v3_references_id_fk` FOREIGN KEY (`reference_id`) REFERENCES `v3_references`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reference_notes` ADD CONSTRAINT `reference_notes_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `v3_reference_tag_links` ADD CONSTRAINT `v3_reference_tag_links_reference_id_v3_references_id_fk` FOREIGN KEY (`reference_id`) REFERENCES `v3_references`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `v3_reference_tag_links` ADD CONSTRAINT `v3_reference_tag_links_tag_id_reference_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `reference_tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `v3_references` ADD CONSTRAINT `v3_references_axis_primary_id_thematic_axes_id_fk` FOREIGN KEY (`axis_primary_id`) REFERENCES `thematic_axes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `axis_conn_source_idx` ON `axis_connections` (`source_axis_id`);--> statement-breakpoint
CREATE INDEX `axis_conn_target_idx` ON `axis_connections` (`target_axis_id`);--> statement-breakpoint
CREATE INDEX `ref_notes_ref_idx` ON `reference_notes` (`reference_id`);--> statement-breakpoint
CREATE INDEX `ref_notes_type_idx` ON `reference_notes` (`note_type`);--> statement-breakpoint
CREATE INDEX `ref_notes_importance_idx` ON `reference_notes` (`importance`);--> statement-breakpoint
CREATE INDEX `ref_tag_category_idx` ON `reference_tags` (`category`);--> statement-breakpoint
CREATE INDEX `ref_tag_parent_idx` ON `reference_tags` (`parent_id`);--> statement-breakpoint
CREATE INDEX `thematic_axis_meta_idx` ON `thematic_axes` (`meta_axis`);--> statement-breakpoint
CREATE INDEX `v3_ref_tag_ref_idx` ON `v3_reference_tag_links` (`reference_id`);--> statement-breakpoint
CREATE INDEX `v3_ref_tag_tag_idx` ON `v3_reference_tag_links` (`tag_id`);--> statement-breakpoint
CREATE INDEX `v3_ref_year_idx` ON `v3_references` (`year`);--> statement-breakpoint
CREATE INDEX `v3_ref_type_idx` ON `v3_references` (`entry_type`);--> statement-breakpoint
CREATE INDEX `v3_ref_axis_primary_idx` ON `v3_references` (`axis_primary_id`);