CREATE TABLE `sparql_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`query_hash` varchar(64) NOT NULL,
	`query_text` text NOT NULL,
	`query_type` varchar(20) NOT NULL DEFAULT 'SELECT',
	`results_json` text NOT NULL,
	`result_count` int NOT NULL DEFAULT 0,
	`execution_time_ms` int,
	`hit_count` int NOT NULL DEFAULT 0,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`last_accessed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sparql_cache_id` PRIMARY KEY(`id`),
	CONSTRAINT `sparql_cache_query_hash_unique` UNIQUE(`query_hash`),
	CONSTRAINT `sparql_cache_hash_idx` UNIQUE(`query_hash`)
);
--> statement-breakpoint
CREATE INDEX `sparql_cache_expires_idx` ON `sparql_cache` (`expires_at`);--> statement-breakpoint
CREATE INDEX `sparql_cache_created_idx` ON `sparql_cache` (`created_at`);