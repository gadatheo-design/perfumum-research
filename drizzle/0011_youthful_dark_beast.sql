CREATE TABLE `bibliography_axis_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bibliography_id` int NOT NULL,
	`axis_id` int NOT NULL,
	`relevance` enum('primaire','secondaire','contextuelle') DEFAULT 'secondaire',
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bibliography_axis_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_bibliography_axis` UNIQUE(`bibliography_id`,`axis_id`)
);
--> statement-breakpoint
CREATE TABLE `bibliography_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entry_key` varchar(100) NOT NULL,
	`entry_type` enum('article','book','inbook','incollection','inproceedings','conference','thesis','mastersthesis','phdthesis','techreport','manual','unpublished','misc','online','patent','standard','dataset','software') NOT NULL DEFAULT 'article',
	`title` varchar(500) NOT NULL,
	`authors` text,
	`year` int,
	`journal` varchar(255),
	`booktitle` varchar(255),
	`publisher` varchar(255),
	`volume` varchar(50),
	`number` varchar(50),
	`pages` varchar(50),
	`edition` varchar(50),
	`chapter` varchar(100),
	`doi` varchar(100),
	`isbn` varchar(20),
	`issn` varchar(20),
	`pmid` varchar(20),
	`arxiv_id` varchar(50),
	`url` varchar(500),
	`abstract` text,
	`keywords` json,
	`language` varchar(50) DEFAULT 'en',
	`research_domain` enum('chimie_olfactive','botanique','ethnobotanique','histoire_parfumerie','neurologie_olfactive','extraction','formulation','reglementation','durabilite','tabac_cannabis','methodologie','autre'),
	`relevance_score` int DEFAULT 50,
	`tags` json,
	`notes` text,
	`annotation` text,
	`pdf_url` varchar(500),
	`read_status` enum('unread','reading','read','to_review') DEFAULT 'unread',
	`linked_molecule_ids` json,
	`linked_plant_ids` json,
	`linked_recette_ids` json,
	`added_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bibliography_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `bibliography_entries_entry_key_unique` UNIQUE(`entry_key`),
	CONSTRAINT `bibliography_entry_key_idx` UNIQUE(`entry_key`)
);
--> statement-breakpoint
CREATE TABLE `research_axes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`axis_code` varchar(20) NOT NULL,
	`name` varchar(255) NOT NULL,
	`subtitle` varchar(255),
	`description` text,
	`objectives` text,
	`methodology` text,
	`category` enum('fondamental','applique','experimental','theorique','historique','ethnographique','technique') DEFAULT 'fondamental',
	`status` enum('planifie','en_cours','pause','termine','archive') DEFAULT 'planifie',
	`priority` enum('haute','moyenne','basse') DEFAULT 'moyenne',
	`start_date` timestamp,
	`target_end_date` timestamp,
	`actual_end_date` timestamp,
	`progress_percent` int DEFAULT 0,
	`color` varchar(20) DEFAULT '#6366f1',
	`icon` varchar(50),
	`parent_axis_id` int,
	`tags` json,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_axes_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_axes_axis_code_unique` UNIQUE(`axis_code`),
	CONSTRAINT `research_axis_code_idx` UNIQUE(`axis_code`)
);
--> statement-breakpoint
CREATE TABLE `research_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entry_code` varchar(50) NOT NULL,
	`axis_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`summary` text,
	`entry_type` enum('note','observation','hypothese','resultat','conclusion','question','idee','protocole','donnees','analyse','reference','citation','media','lien','autre') DEFAULT 'note',
	`status` enum('brouillon','en_revision','valide','archive') DEFAULT 'brouillon',
	`importance` enum('critique','haute','moyenne','basse','reference') DEFAULT 'moyenne',
	`entry_date` timestamp,
	`attachments` json,
	`bibliography_ids` json,
	`linked_molecule_ids` json,
	`linked_plant_ids` json,
	`linked_recette_ids` json,
	`linked_prototype_ids` json,
	`tags` json,
	`sort_order` int DEFAULT 0,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_entries_entry_code_unique` UNIQUE(`entry_code`),
	CONSTRAINT `research_entry_code_idx` UNIQUE(`entry_code`)
);
--> statement-breakpoint
ALTER TABLE `bibliography_axis_links` ADD CONSTRAINT `bibliography_axis_links_bibliography_id_bibliography_entries_id_fk` FOREIGN KEY (`bibliography_id`) REFERENCES `bibliography_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bibliography_axis_links` ADD CONSTRAINT `bibliography_axis_links_axis_id_research_axes_id_fk` FOREIGN KEY (`axis_id`) REFERENCES `research_axes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bibliography_entries` ADD CONSTRAINT `bibliography_entries_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `research_axes` ADD CONSTRAINT `research_axes_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `research_entries` ADD CONSTRAINT `research_entries_axis_id_research_axes_id_fk` FOREIGN KEY (`axis_id`) REFERENCES `research_axes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `research_entries` ADD CONSTRAINT `research_entries_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `bibliography_year_idx` ON `bibliography_entries` (`year`);--> statement-breakpoint
CREATE INDEX `bibliography_type_idx` ON `bibliography_entries` (`entry_type`);--> statement-breakpoint
CREATE INDEX `bibliography_domain_idx` ON `bibliography_entries` (`research_domain`);--> statement-breakpoint
CREATE INDEX `research_axis_status_idx` ON `research_axes` (`status`);--> statement-breakpoint
CREATE INDEX `research_axis_category_idx` ON `research_axes` (`category`);--> statement-breakpoint
CREATE INDEX `research_entry_axis_idx` ON `research_entries` (`axis_id`);--> statement-breakpoint
CREATE INDEX `research_entry_type_idx` ON `research_entries` (`entry_type`);--> statement-breakpoint
CREATE INDEX `research_entry_status_idx` ON `research_entries` (`status`);