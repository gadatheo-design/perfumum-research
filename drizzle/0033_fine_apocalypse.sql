ALTER TABLE `molecules` ADD `pubchem_cid` int;--> statement-breakpoint
ALTER TABLE `molecules` ADD `smiles` text;--> statement-breakpoint
ALTER TABLE `molecules` ADD `inchi` text;--> statement-breakpoint
ALTER TABLE `molecules` ADD `inchi_key` varchar(27);--> statement-breakpoint
ALTER TABLE `molecules` ADD `exact_mass` decimal(12,6);--> statement-breakpoint
ALTER TABLE `molecules` ADD `xlogp` decimal(6,2);--> statement-breakpoint
ALTER TABLE `molecules` ADD `tpsa` decimal(8,2);--> statement-breakpoint
ALTER TABLE `molecules` ADD `h_bond_donor_count` int;--> statement-breakpoint
ALTER TABLE `molecules` ADD `h_bond_acceptor_count` int;--> statement-breakpoint
ALTER TABLE `molecules` ADD `rotatable_bond_count` int;--> statement-breakpoint
ALTER TABLE `molecules` ADD `heavy_atom_count` int;--> statement-breakpoint
ALTER TABLE `molecules` ADD `pubchem_synonyms` json;--> statement-breakpoint
ALTER TABLE `molecules` ADD `pubchem_enriched_at` timestamp;