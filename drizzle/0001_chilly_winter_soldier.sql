ALTER TABLE `bibliography_entries` ADD `wikidata_qid` varchar(20);--> statement-breakpoint
ALTER TABLE `bibliography_entries` ADD `rdf_type` varchar(255);--> statement-breakpoint
ALTER TABLE `families` ADD `wikidata_qid` varchar(20);--> statement-breakpoint
ALTER TABLE `families` ADD `rdf_type` varchar(255);--> statement-breakpoint
ALTER TABLE `molecules` ADD `rdf_type` varchar(255);--> statement-breakpoint
ALTER TABLE `plants` ADD `rdf_type` varchar(255);--> statement-breakpoint
ALTER TABLE `plants` ADD `dwc_taxon_rank` varchar(50);--> statement-breakpoint
ALTER TABLE `raw_materials` ADD `wikidata_qid` varchar(20);--> statement-breakpoint
ALTER TABLE `raw_materials` ADD `rdf_type` varchar(255);--> statement-breakpoint
ALTER TABLE `recettes` ADD `wikidata_qid` varchar(20);--> statement-breakpoint
ALTER TABLE `recettes` ADD `rdf_type` varchar(255);--> statement-breakpoint
ALTER TABLE `research_axes` ADD `wikidata_qid` varchar(20);--> statement-breakpoint
ALTER TABLE `research_axes` ADD `rdf_type` varchar(255);--> statement-breakpoint
ALTER TABLE `research_axes` ADD `mesh_id` varchar(20);--> statement-breakpoint
ALTER TABLE `research_axes` ADD `unesco_code` varchar(20);--> statement-breakpoint
ALTER TABLE `v3_references` ADD `wikidata_qid` varchar(20);--> statement-breakpoint
ALTER TABLE `v3_references` ADD `rdf_type` varchar(255);