CREATE TABLE `analytical_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`full_name` varchar(500),
	`category` enum('chromatography','spectrometry','thermal_analysis','particle_analysis','spectroscopy','other') DEFAULT 'other',
	`performance_score` int,
	`resolution_score` int,
	`sensitivity_score` int,
	`detection_limit` varchar(100),
	`detection_limit_unit` varchar(50),
	`capabilities` json,
	`limitations` json,
	`best_suited_for` json,
	`description` text,
	`technical_details` text,
	`publication_count` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analytical_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `analytical_methods_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `publication_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publication_id` int NOT NULL,
	`method_id` int NOT NULL,
	`is_primary` boolean DEFAULT false,
	`notes` text,
	CONSTRAINT `publication_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_pub_method` UNIQUE(`publication_id`,`method_id`)
);
--> statement-breakpoint
CREATE TABLE `publication_molecules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publication_id` int NOT NULL,
	`molecule_id` int NOT NULL,
	`study_type` enum('source','product','analyte','reference') DEFAULT 'analyte',
	`notes` text,
	CONSTRAINT `publication_molecules_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_pub_molecule` UNIQUE(`publication_id`,`molecule_id`)
);
--> statement-breakpoint
CREATE TABLE `publication_researchers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publication_id` int NOT NULL,
	`researcher_id` int NOT NULL,
	`role` enum('lead','corresponding','co-author') DEFAULT 'co-author',
	`author_order` int,
	CONSTRAINT `publication_researchers_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_pub_researcher` UNIQUE(`publication_id`,`researcher_id`)
);
--> statement-breakpoint
CREATE TABLE `publication_transformations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publication_id` int NOT NULL,
	`transformation_id` int NOT NULL,
	`is_key_finding` boolean DEFAULT false,
	`notes` text,
	CONSTRAINT `publication_transformations_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_pub_transformation` UNIQUE(`publication_id`,`transformation_id`)
);
--> statement-breakpoint
CREATE TABLE `research_institutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`short_name` varchar(100),
	`city` varchar(100),
	`state` varchar(100),
	`country` varchar(100) NOT NULL,
	`institution_type` enum('university','national_lab','research_institute','government','industry','independent','other') DEFAULT 'other',
	`department` varchar(255),
	`research_group` varchar(255),
	`research_focus` json,
	`total_citations` int DEFAULT 0,
	`publication_count` int DEFAULT 0,
	`website` varchar(500),
	`description` text,
	`key_contributions` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_institutions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `research_publications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ref_code` varchar(50) NOT NULL,
	`title` varchar(500) NOT NULL,
	`authors` text NOT NULL,
	`lead_author` varchar(255),
	`year` int NOT NULL,
	`journal` varchar(255),
	`volume` varchar(50),
	`pages` varchar(50),
	`doi` varchar(255),
	`pmc_id` varchar(50),
	`citations` int DEFAULT 0,
	`citations_date` timestamp,
	`research_focus` enum('pyrolysis','combustion','vaporization','terpene_degradation','cannabinoid_degradation','smoke_characterization','analytical_methods','taxonomy','other') DEFAULT 'other',
	`subject_matter` enum('cannabis','tobacco','both','terpenes','general') DEFAULT 'general',
	`temperature_min` int,
	`temperature_max` int,
	`temperature_range` varchar(100),
	`analytes` json,
	`sample_types` json,
	`key_findings` text,
	`advantages` json,
	`limitations` json,
	`abstract` text,
	`url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_publications_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_publications_ref_code_unique` UNIQUE(`ref_code`)
);
--> statement-breakpoint
CREATE TABLE `researcher_institutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`researcher_id` int NOT NULL,
	`institution_id` int NOT NULL,
	`is_primary` boolean DEFAULT true,
	`start_year` int,
	`end_year` int,
	`position` varchar(255),
	CONSTRAINT `researcher_institutions_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_researcher_institution` UNIQUE(`researcher_id`,`institution_id`)
);
--> statement-breakpoint
CREATE TABLE `researchers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`first_name` varchar(100),
	`last_name` varchar(100),
	`status` enum('active','inactive','retired','industry','unknown') DEFAULT 'unknown',
	`status_details` varchar(255),
	`research_focus` json,
	`expertise_domains` json,
	`total_citations` int DEFAULT 0,
	`publication_count` int DEFAULT 0,
	`h_index` int,
	`awards` json,
	`email` varchar(255),
	`orcid` varchar(50),
	`google_scholar` varchar(255),
	`research_gate` varchar(255),
	`bio` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `researchers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `publication_methods` ADD CONSTRAINT `publication_methods_publication_id_research_publications_id_fk` FOREIGN KEY (`publication_id`) REFERENCES `research_publications`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_methods` ADD CONSTRAINT `publication_methods_method_id_analytical_methods_id_fk` FOREIGN KEY (`method_id`) REFERENCES `analytical_methods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_molecules` ADD CONSTRAINT `publication_molecules_publication_id_research_publications_id_fk` FOREIGN KEY (`publication_id`) REFERENCES `research_publications`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_molecules` ADD CONSTRAINT `publication_molecules_molecule_id_molecules_id_fk` FOREIGN KEY (`molecule_id`) REFERENCES `molecules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_researchers` ADD CONSTRAINT `publication_researchers_publication_id_research_publications_id_fk` FOREIGN KEY (`publication_id`) REFERENCES `research_publications`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_researchers` ADD CONSTRAINT `publication_researchers_researcher_id_researchers_id_fk` FOREIGN KEY (`researcher_id`) REFERENCES `researchers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_transformations` ADD CONSTRAINT `publication_transformations_publication_id_research_publications_id_fk` FOREIGN KEY (`publication_id`) REFERENCES `research_publications`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_transformations` ADD CONSTRAINT `publication_transformations_transformation_id_molecular_transformations_id_fk` FOREIGN KEY (`transformation_id`) REFERENCES `molecular_transformations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `researcher_institutions` ADD CONSTRAINT `researcher_institutions_researcher_id_researchers_id_fk` FOREIGN KEY (`researcher_id`) REFERENCES `researchers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `researcher_institutions` ADD CONSTRAINT `researcher_institutions_institution_id_research_institutions_id_fk` FOREIGN KEY (`institution_id`) REFERENCES `research_institutions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `analytical_method_category_idx` ON `analytical_methods` (`category`);--> statement-breakpoint
CREATE INDEX `analytical_method_performance_idx` ON `analytical_methods` (`performance_score`);--> statement-breakpoint
CREATE INDEX `institution_name_idx` ON `research_institutions` (`name`);--> statement-breakpoint
CREATE INDEX `institution_country_idx` ON `research_institutions` (`country`);--> statement-breakpoint
CREATE INDEX `institution_type_idx` ON `research_institutions` (`institution_type`);--> statement-breakpoint
CREATE INDEX `research_pub_year_idx` ON `research_publications` (`year`);--> statement-breakpoint
CREATE INDEX `research_pub_focus_idx` ON `research_publications` (`research_focus`);--> statement-breakpoint
CREATE INDEX `research_pub_subject_idx` ON `research_publications` (`subject_matter`);--> statement-breakpoint
CREATE INDEX `researcher_name_idx` ON `researchers` (`name`);--> statement-breakpoint
CREATE INDEX `researcher_status_idx` ON `researchers` (`status`);