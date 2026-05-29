CREATE TABLE `sparql_saved_queries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`sparql_query` text NOT NULL,
	`notes` text,
	`tags` varchar(500),
	`category` varchar(50) NOT NULL DEFAULT 'free',
	`endpoint` varchar(50) NOT NULL DEFAULT 'wikidata',
	`linked_entity_type` varchar(20),
	`linked_entity_id` int,
	`linked_entity_name` varchar(255),
	`injected_qid` varchar(20),
	`last_result_count` int,
	`last_execution_ms` int,
	`execution_count` int NOT NULL DEFAULT 0,
	`is_favorite` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`last_executed_at` timestamp,
	CONSTRAINT `sparql_saved_queries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_sparql_saved_category` ON `sparql_saved_queries` (`category`);--> statement-breakpoint
CREATE INDEX `idx_sparql_saved_endpoint` ON `sparql_saved_queries` (`endpoint`);--> statement-breakpoint
CREATE INDEX `idx_sparql_saved_favorite` ON `sparql_saved_queries` (`is_favorite`);--> statement-breakpoint
CREATE INDEX `idx_sparql_saved_entity` ON `sparql_saved_queries` (`linked_entity_type`,`linked_entity_id`);