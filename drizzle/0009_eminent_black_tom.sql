CREATE TABLE `molecule_synergies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule1_id` int NOT NULL,
	`molecule2_id` int NOT NULL,
	`type` enum('potentialisation','stabilisation','transformation','masquage') NOT NULL,
	`description` text NOT NULL,
	`applications` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `molecule_synergies_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_molecule_pair` UNIQUE(`molecule1_id`,`molecule2_id`)
);
--> statement-breakpoint
ALTER TABLE `molecule_synergies` ADD CONSTRAINT `molecule_synergies_molecule1_id_molecules_id_fk` FOREIGN KEY (`molecule1_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `molecule_synergies` ADD CONSTRAINT `molecule_synergies_molecule2_id_molecules_id_fk` FOREIGN KEY (`molecule2_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;