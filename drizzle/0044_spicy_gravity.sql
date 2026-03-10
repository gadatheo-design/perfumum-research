CREATE TABLE `aromatic_rarities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rarity_id` varchar(20) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100),
	`geography` text,
	`rarity_regime` varchar(100),
	`cultural_status` varchar(100),
	`source_type` varchar(100),
	`extractability` varchar(50),
	`key_molecules` text,
	`absorbe_potential` text,
	`notes` text,
	`references` text,
	`temporal_behavior` varchar(50),
	`industrial_products` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aromatic_rarities_id` PRIMARY KEY(`id`),
	CONSTRAINT `aromatic_rarities_rarity_id_unique` UNIQUE(`rarity_id`)
);
--> statement-breakpoint
CREATE INDEX `aromatic_rarities_rarity_id_idx` ON `aromatic_rarities` (`rarity_id`);--> statement-breakpoint
CREATE INDEX `aromatic_rarities_category_idx` ON `aromatic_rarities` (`category`);