CREATE TABLE `molecule_perfumes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule_id` int NOT NULL,
	`perfume_name` varchar(255) NOT NULL,
	`perfume_house` varchar(255) NOT NULL,
	`perfumer` varchar(255),
	`year` int,
	`role_in_perfume` enum('accord_principal','note_coeur','note_tete','note_fond','signature','ingredient_cle') NOT NULL DEFAULT 'ingredient_cle',
	`concentration` varchar(100),
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `molecule_perfumes_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_molecule_perfume` UNIQUE(`molecule_id`,`perfume_name`)
);
--> statement-breakpoint
CREATE INDEX `mp_molecule_idx` ON `molecule_perfumes` (`molecule_id`);