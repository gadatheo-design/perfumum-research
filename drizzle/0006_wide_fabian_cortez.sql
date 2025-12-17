CREATE TABLE `modification_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`entity_type` enum('molecule','recette','accord','famille','matiere','prototype','synergie','tradition') NOT NULL,
	`entity_id` int NOT NULL,
	`operation` enum('create','update','delete') NOT NULL,
	`state_before` json,
	`state_after` json,
	`description` text,
	`is_undone` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`undone_at` timestamp,
	CONSTRAINT `modification_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `modification_history` (`user_id`);--> statement-breakpoint
CREATE INDEX `entity_type_idx` ON `modification_history` (`entity_type`);--> statement-breakpoint
CREATE INDEX `entity_id_idx` ON `modification_history` (`entity_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `modification_history` (`created_at`);