CREATE TABLE `sustainable_alternatives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`threatened_plant_id` int NOT NULL,
	`threatened_plant_name` varchar(255) NOT NULL,
	`alternative_plant_id` int,
	`alternative_name` varchar(255) NOT NULL,
	`alternative_type` enum('natural_plant','cultivated','synthetic','biotechnology','blend','other') NOT NULL,
	`olfactive_similarity` enum('identical','very_similar','similar','partial','inspired','different') DEFAULT 'similar',
	`olfactive_notes` text,
	`availability` enum('widely_available','available','limited','rare','research_only') DEFAULT 'available',
	`sustainability_score` int,
	`certifications` json,
	`price_comparison` enum('much_cheaper','cheaper','similar','more_expensive','much_more_expensive') DEFAULT 'similar',
	`suppliers` json,
	`usage_recommendations` text,
	`key_molecules` json,
	`references` json,
	`notes` text,
	`verified` boolean DEFAULT false,
	`verified_by` varchar(255),
	`verified_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sustainable_alternatives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `sustainable_alt_threatened_idx` ON `sustainable_alternatives` (`threatened_plant_id`);--> statement-breakpoint
CREATE INDEX `sustainable_alt_type_idx` ON `sustainable_alternatives` (`alternative_type`);--> statement-breakpoint
CREATE INDEX `sustainable_alt_availability_idx` ON `sustainable_alternatives` (`availability`);