CREATE TABLE `leaf_economies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sample_id` varchar(50) NOT NULL,
	`date` timestamp,
	`island` enum('san_andres','providencia','autre'),
	`precise_location` varchar(255),
	`source_contact` text,
	`category` enum('aromatique','tabac','cannabis') NOT NULL,
	`species` varchar(255),
	`claimed_variety` varchar(255),
	`used_part` enum('feuille','fleur','resine','tige','autre'),
	`state` enum('frais','sec','rehydrate'),
	`curing_treatment` enum('aucun','air_cured','flue_cured','sun_cured','autre'),
	`extraction` enum('aucune','maceration_alcool','maceration_mct','distillation','headspace'),
	`ratio_parameters` varchar(255),
	`duration` varchar(100),
	`odor_notes` text,
	`climatic_axis` text,
	`usage` text,
	`analysis_available` int DEFAULT 0,
	`analysis_method` enum('gc_ms','hplc','autre'),
	`top_molecules_list` text,
	`top_molecule_1` varchar(255),
	`top_molecule_2` varchar(255),
	`top_molecule_3` varchar(255),
	`relative_percentages` text,
	`absorbe_interpretation` text,
	`status` enum('brut','a_analyser','analyse','traduction','archive') DEFAULT 'brut',
	`media_links` text,
	`ethical_notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaf_economies_id` PRIMARY KEY(`id`),
	CONSTRAINT `leaf_economies_sample_id_unique` UNIQUE(`sample_id`)
);
--> statement-breakpoint
CREATE TABLE `leaf_economy_molecules` (
	`leaf_economy_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`percentage` decimal(5,2),
	`notes` text
);
--> statement-breakpoint
ALTER TABLE `leaf_economy_molecules` ADD CONSTRAINT `leaf_economy_molecules_leaf_economy_id_leaf_economies_id_fk` FOREIGN KEY (`leaf_economy_id`) REFERENCES `leaf_economies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leaf_economy_molecules` ADD CONSTRAINT `leaf_economy_molecules_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE no action ON UPDATE no action;