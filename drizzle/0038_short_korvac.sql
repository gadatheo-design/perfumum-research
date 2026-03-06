CREATE TABLE `cigarillo_molecule_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cigarillo_recipe_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`role` varchar(100),
	`percentage` decimal(5,2),
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `cigarillo_molecule_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `cml_unique_link` UNIQUE(`cigarillo_recipe_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE INDEX `cml_cigarillo_idx` ON `cigarillo_molecule_links` (`cigarillo_recipe_id`);--> statement-breakpoint
CREATE INDEX `cml_molecule_idx` ON `cigarillo_molecule_links` (`molecule_id`);