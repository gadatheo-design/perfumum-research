CREATE TABLE `plant_contributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plant_id` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`user_name` varchar(255),
	`contribution_type` enum('image','molecule','terroir','note') NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`image_url` text,
	`image_caption` varchar(500),
	`image_source` varchar(500),
	`molecule_id` int,
	`molecule_name` varchar(255),
	`molecule_concentration` varchar(100),
	`molecule_source` varchar(500),
	`terroir` varchar(255),
	`region` varchar(255),
	`country` varchar(255),
	`terroir_notes` text,
	`note_content` text,
	`note_category` varchar(100),
	`description` text,
	`references` text,
	`admin_notes` text,
	`reviewed_by` varchar(255),
	`reviewed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plant_contributions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `pc_plant_idx` ON `plant_contributions` (`plant_id`);--> statement-breakpoint
CREATE INDEX `pc_user_idx` ON `plant_contributions` (`user_id`);--> statement-breakpoint
CREATE INDEX `pc_status_idx` ON `plant_contributions` (`status`);--> statement-breakpoint
CREATE INDEX `pc_type_idx` ON `plant_contributions` (`contribution_type`);