DROP INDEX `categories_parent_id_idx`;--> statement-breakpoint
CREATE INDEX `recipe_categories_category_id_idx` ON `kent-cook-this_recipe_categories` (`categoryId`);--> statement-breakpoint
ALTER TABLE `kent-cook-this_recipes` DROP COLUMN `category_id`;--> statement-breakpoint
ALTER TABLE `kent-cook-this_recipes` DROP COLUMN `subcategory_id`;