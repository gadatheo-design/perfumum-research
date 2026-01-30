ALTER TABLE `plant_molecules` DROP INDEX `unique_plant_molecule`;--> statement-breakpoint
ALTER TABLE `plant_molecules` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD `percentage` decimal(5,2);--> statement-breakpoint
ALTER TABLE `plants` ADD `latitude_min` decimal(10,7);--> statement-breakpoint
ALTER TABLE `plants` ADD `latitude_max` decimal(10,7);--> statement-breakpoint
ALTER TABLE `plants` ADD `altitude_min` int;--> statement-breakpoint
ALTER TABLE `plants` ADD `altitude_max` int;--> statement-breakpoint
ALTER TABLE `plants` ADD `koppen_zone` varchar(10);--> statement-breakpoint
ALTER TABLE `plants` ADD `koppen_description` varchar(100);--> statement-breakpoint
ALTER TABLE `plants` ADD `precipitation_min` int;--> statement-breakpoint
ALTER TABLE `plants` ADD `precipitation_max` int;--> statement-breakpoint
ALTER TABLE `plants` ADD `temperature_min` int;--> statement-breakpoint
ALTER TABLE `plants` ADD `temperature_max` int;--> statement-breakpoint
ALTER TABLE `plant_molecules` ADD CONSTRAINT `plant_molecules_pk` UNIQUE(`plant_id`,`molecule_id`);--> statement-breakpoint
ALTER TABLE `plant_molecules` DROP COLUMN `id`;