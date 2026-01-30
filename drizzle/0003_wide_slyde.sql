CREATE TABLE `botanical_states` (
	`id` int AUTO_INCREMENT NOT NULL,
	`state_id` varchar(30) NOT NULL,
	`plant_id` int NOT NULL,
	`stage_name` varchar(100) NOT NULL,
	`stage_code` varchar(10),
	`stage_order` int NOT NULL,
	`stage_type` enum('germination','vegetatif','floraison','fructification','senescence','dormance','autre') NOT NULL,
	`description` text,
	`visual_characteristics` text,
	`duration` varchar(100),
	`transition_conditions` json,
	`olfactive_profile` text,
	`dominant_notes` json,
	`molecular_profile` json,
	`recommended_use` json,
	`harvest_recommendation` text,
	`image_url` varchar(500),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `botanical_states_id` PRIMARY KEY(`id`),
	CONSTRAINT `botanical_states_state_id_unique` UNIQUE(`state_id`)
);
--> statement-breakpoint
ALTER TABLE `botanical_states` ADD CONSTRAINT `botanical_states_plant_id_plants_id_fk` FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON DELETE no action ON UPDATE no action;