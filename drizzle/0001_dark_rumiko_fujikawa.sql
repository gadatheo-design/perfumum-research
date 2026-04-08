CREATE TABLE `variety_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`genus` varchar(100) NOT NULL,
	`species` varchar(100) NOT NULL,
	`cultivar` varchar(255),
	`imageType` enum('leaf','flower','fruit','whole_plant','other') NOT NULL,
	`file_key` varchar(500) NOT NULL,
	`file_url` text NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`mime_type` varchar(50) NOT NULL,
	`file_size` int NOT NULL,
	`description` text,
	`source` varchar(255),
	`source_url` text,
	`attribution` varchar(255),
	`quality` enum('low','medium','high','excellent') DEFAULT 'medium',
	`is_verified` boolean DEFAULT false,
	`uploaded_by` int,
	`verified_by` int,
	`verified_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `variety_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `variety_images_genus_species_idx` ON `variety_images` (`genus`,`species`);--> statement-breakpoint
CREATE INDEX `variety_images_type_idx` ON `variety_images` (`imageType`);--> statement-breakpoint
CREATE INDEX `variety_images_verified_idx` ON `variety_images` (`is_verified`);