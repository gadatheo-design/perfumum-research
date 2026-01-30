CREATE TABLE `curated_journeys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`name_en` varchar(255),
	`description` text,
	`short_description` varchar(500),
	`theme` enum('geographic','olfactive','botanical','historical','seasonal','therapeutic','culinary','sacred','luxury','sustainable','custom') NOT NULL,
	`emoji` varchar(10),
	`cover_image_url` varchar(500),
	`color` varchar(20),
	`difficulty` enum('beginner','intermediate','advanced','expert') DEFAULT 'beginner',
	`estimated_duration` int,
	`terroir_count` int DEFAULT 0,
	`plant_count` int DEFAULT 0,
	`molecule_count` int DEFAULT 0,
	`is_published` boolean DEFAULT false,
	`is_featured` boolean DEFAULT false,
	`sort_order` int DEFAULT 0,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `curated_journeys_id` PRIMARY KEY(`id`),
	CONSTRAINT `curated_journeys_code_unique` UNIQUE(`code`),
	CONSTRAINT `journey_code_idx` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `journey_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`journey_id` int NOT NULL,
	`item_type` enum('terroir','plant','molecule') NOT NULL,
	`terroir_id` int,
	`plant_id` int,
	`molecule_id` int,
	`sort_order` int DEFAULT 0,
	`step_number` int,
	`group_name` varchar(100),
	`context_description` text,
	`is_highlight` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `journey_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `curated_journeys` ADD CONSTRAINT `curated_journeys_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `journey_items` ADD CONSTRAINT `journey_items_journey_id_curated_journeys_id_fk` FOREIGN KEY (`journey_id`) REFERENCES `curated_journeys`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `journey_items` ADD CONSTRAINT `journey_items_terroir_id_terroirs_id_fk` FOREIGN KEY (`terroir_id`) REFERENCES `terroirs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `journey_items` ADD CONSTRAINT `journey_items_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `journey_items` ADD CONSTRAINT `journey_items_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `journey_theme_idx` ON `curated_journeys` (`theme`);--> statement-breakpoint
CREATE INDEX `journey_published_idx` ON `curated_journeys` (`is_published`);--> statement-breakpoint
CREATE INDEX `journey_featured_idx` ON `curated_journeys` (`is_featured`);--> statement-breakpoint
CREATE INDEX `journey_item_journey_idx` ON `journey_items` (`journey_id`);--> statement-breakpoint
CREATE INDEX `journey_item_type_idx` ON `journey_items` (`item_type`);--> statement-breakpoint
CREATE INDEX `journey_item_order_idx` ON `journey_items` (`journey_id`,`sort_order`);