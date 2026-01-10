CREATE TABLE `classification_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`molecule_id` int NOT NULL,
	`ai_chemical_class` varchar(100),
	`ai_chemical_class_confidence` int,
	`ai_chemical_class_reasoning` text,
	`ai_olfactive_family` varchar(100),
	`ai_olfactive_family_confidence` int,
	`ai_olfactive_family_reasoning` text,
	`ai_suggested_olfactive_profile` text,
	`ai_botanical_context_used` boolean DEFAULT false,
	`status` enum('pending','approved','rejected','modified','skipped') NOT NULL DEFAULT 'pending',
	`manual_chemical_class` varchar(100),
	`manual_olfactive_family` varchar(100),
	`manual_olfactive_profile` text,
	`review_notes` text,
	`priority` enum('low','medium','high') DEFAULT 'medium',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`reviewed_at` timestamp,
	`reviewed_by` int,
	CONSTRAINT `classification_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `review_molecule_idx` ON `classification_reviews` (`molecule_id`);--> statement-breakpoint
CREATE INDEX `review_status_idx` ON `classification_reviews` (`status`);--> statement-breakpoint
CREATE INDEX `review_priority_idx` ON `classification_reviews` (`priority`);--> statement-breakpoint
CREATE INDEX `review_confidence_idx` ON `classification_reviews` (`ai_chemical_class_confidence`);