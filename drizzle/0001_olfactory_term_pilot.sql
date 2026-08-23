CREATE TABLE `olfactory_term_pilot_proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`external_term_id` varchar(80) NOT NULL,
	`source_batch_id` varchar(80) NOT NULL,
	`term_original` varchar(500) NOT NULL,
	`language_code` varchar(32) NOT NULL,
	`english_gloss_source` varchar(500),
	`pinyin` varchar(500),
	`french_gloss_proposed` varchar(500),
	`source_category` varchar(80) NOT NULL,
	`oai` varchar(40),
	`osi` varchar(40),
	`canonical_descriptor_candidate` varchar(100),
	`candidate_relation_type` varchar(40),
	`candidate_entity_type` varchar(40),
	`candidate_entity_id` int,
	`llm_rationale` text,
	`confidence` varchar(20),
	`source_doi` varchar(255) NOT NULL,
	`source_url` varchar(1000) NOT NULL,
	`license` varchar(80) NOT NULL,
	`raw_source` json,
	`llm_proposal` json,
	`status` varchar(40) NOT NULL DEFAULT 'proposed',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `olfactory_term_pilot_proposals_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_olfactory_term_pilot_external` UNIQUE(`external_term_id`)
);
--> statement-breakpoint
CREATE TABLE `olfactory_term_pilot_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposal_id` int NOT NULL,
	`reviewer_user_id` int,
	`reviewer_name` varchar(255),
	`reviewer_role` varchar(40) NOT NULL,
	`decision` varchar(40) NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `olfactory_term_pilot_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_olfactory_term_pilot_batch` ON `olfactory_term_pilot_proposals` (`source_batch_id`);--> statement-breakpoint
CREATE INDEX `idx_olfactory_term_pilot_status` ON `olfactory_term_pilot_proposals` (`status`);--> statement-breakpoint
CREATE INDEX `idx_olfactory_term_pilot_category` ON `olfactory_term_pilot_proposals` (`source_category`);--> statement-breakpoint
CREATE INDEX `idx_olfactory_term_review_proposal` ON `olfactory_term_pilot_reviews` (`proposal_id`);--> statement-breakpoint
CREATE INDEX `idx_olfactory_term_review_reviewer` ON `olfactory_term_pilot_reviews` (`reviewer_user_id`);--> statement-breakpoint
CREATE INDEX `idx_olfactory_term_review_decision` ON `olfactory_term_pilot_reviews` (`decision`);