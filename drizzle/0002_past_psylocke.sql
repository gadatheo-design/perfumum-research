CREATE INDEX `sample_images_sort_idx` ON `sample_images` (`plant_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX `variety_images_sort_idx` ON `variety_images` (`genus`,`species`,`sort_order`);