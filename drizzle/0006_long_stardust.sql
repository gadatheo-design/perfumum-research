ALTER TABLE `plant_varieties` ADD `conservation_status` enum('critical','endangered','vulnerable','near_threatened','stable','data_deficient','unknown') DEFAULT 'unknown';--> statement-breakpoint
ALTER TABLE `plant_varieties` ADD `conservation_notes` text;--> statement-breakpoint
ALTER TABLE `plant_varieties` ADD `threat_factors` json;--> statement-breakpoint
ALTER TABLE `plant_varieties` ADD `conservation_efforts` text;--> statement-breakpoint
ALTER TABLE `plant_varieties` ADD `last_assessment_date` timestamp;