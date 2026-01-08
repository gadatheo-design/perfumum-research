ALTER TABLE `molecules` ADD `validation_status` enum('brouillon','en_revision','valide','rejete') DEFAULT 'valide';--> statement-breakpoint
ALTER TABLE `molecules` ADD `validated_by` int;--> statement-breakpoint
ALTER TABLE `molecules` ADD `validated_at` timestamp;--> statement-breakpoint
ALTER TABLE `molecules` ADD `contributor_id` int;--> statement-breakpoint
ALTER TABLE `plants` ADD `validation_status` enum('brouillon','en_revision','valide','rejete') DEFAULT 'valide';--> statement-breakpoint
ALTER TABLE `plants` ADD `validated_by` int;--> statement-breakpoint
ALTER TABLE `plants` ADD `validated_at` timestamp;--> statement-breakpoint
ALTER TABLE `plants` ADD `contributor_id` int;