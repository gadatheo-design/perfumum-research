CREATE TABLE `olfactory_term_pilot_finalizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposal_id` int NOT NULL,
	`source_batch_id` varchar(80) NOT NULL,
	`linguistic_review_id` int NOT NULL,
	`domain_review_id` int NOT NULL,
	`finalized_by_user_id` int,
	`finalized_by_name` varchar(255),
	`snapshot` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `olfactory_term_pilot_finalizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_olfactory_term_finalization_proposal` UNIQUE(`proposal_id`)
);
--> statement-breakpoint
CREATE INDEX `idx_olfactory_term_finalization_batch` ON `olfactory_term_pilot_finalizations` (`source_batch_id`);--> statement-breakpoint
CREATE INDEX `idx_olfactory_term_finalization_user` ON `olfactory_term_pilot_finalizations` (`finalized_by_user_id`);