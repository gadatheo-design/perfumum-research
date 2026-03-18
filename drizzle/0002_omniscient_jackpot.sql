ALTER TABLE `molecules` ADD `wikidata_qid` varchar(20);--> statement-breakpoint
ALTER TABLE `molecules` ADD `wikidata_enriched_at` timestamp;--> statement-breakpoint
ALTER TABLE `plants` ADD `wikidata_qid` varchar(20);--> statement-breakpoint
ALTER TABLE `plants` ADD `wikidata_enriched_at` timestamp;