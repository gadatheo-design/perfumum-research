ALTER TABLE `molecules` ADD `coconut_id` varchar(100);--> statement-breakpoint
ALTER TABLE `molecules` ADD `np_likeness_score` decimal(10,4);--> statement-breakpoint
ALTER TABLE `molecules` ADD `coconut_organisms` json;--> statement-breakpoint
ALTER TABLE `molecules` ADD `coconut_citations` json;--> statement-breakpoint
ALTER TABLE `molecules` ADD `coconut_enriched_at` timestamp;--> statement-breakpoint
ALTER TABLE `molecules` ADD `ifra_status` enum('not_regulated','banned','restricted','specification_required') DEFAULT 'not_regulated';--> statement-breakpoint
ALTER TABLE `molecules` ADD `ifra_data` json;--> statement-breakpoint
ALTER TABLE `molecules` ADD `ifra_enriched_at` timestamp;