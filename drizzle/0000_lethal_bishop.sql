CREATE TABLE `kent-cook-this_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`parentId` integer,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`parentId`) REFERENCES `kent-cook-this_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_idx` ON `kent-cook-this_categories` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_parent_id_idx` ON `kent-cook-this_categories` (`parentId`);--> statement-breakpoint
CREATE TABLE `kent-cook-this_comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipeId` integer NOT NULL,
	`userId` integer NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`recipeId`) REFERENCES `kent-cook-this_recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `kent-cook-this_users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `kent-cook-this_favorites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`recipeId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `kent-cook-this_users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipeId`) REFERENCES `kent-cook-this_recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `favorites_user_recipe_idx` ON `kent-cook-this_favorites` (`userId`,`recipeId`);--> statement-breakpoint
CREATE TABLE `kent-cook-this_ingredient_densities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ingredientId` integer NOT NULL,
	`densityGPerMl` real NOT NULL,
	FOREIGN KEY (`ingredientId`) REFERENCES `kent-cook-this_ingredients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ingredient_density_ingredient_idx` ON `kent-cook-this_ingredient_densities` (`ingredientId`);--> statement-breakpoint
CREATE TABLE `kent-cook-this_ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ingredients_name_unique` ON `kent-cook-this_ingredients` (`name`);--> statement-breakpoint
CREATE TABLE `kent-cook-this_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `kent-cook-this_post` (`name`);--> statement-breakpoint
CREATE TABLE `kent-cook-this_recipe_categories` (
	`recipeId` integer NOT NULL,
	`categoryId` integer NOT NULL,
	PRIMARY KEY(`recipeId`, `categoryId`),
	FOREIGN KEY (`recipeId`) REFERENCES `kent-cook-this_recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`categoryId`) REFERENCES `kent-cook-this_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `kent-cook-this_recipe_ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipeId` integer NOT NULL,
	`ingredientId` integer NOT NULL,
	`quantity` real,
	`unitId` integer,
	FOREIGN KEY (`recipeId`) REFERENCES `kent-cook-this_recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ingredientId`) REFERENCES `kent-cook-this_ingredients`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`unitId`) REFERENCES `kent-cook-this_units`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `kent-cook-this_recipe_tags` (
	`recipeId` integer NOT NULL,
	`tagId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`recipeId`, `tagId`),
	FOREIGN KEY (`recipeId`) REFERENCES `kent-cook-this_recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tagId`) REFERENCES `kent-cook-this_tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `kent-cook-this_recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`authorId` integer NOT NULL,
	`title` text(255) NOT NULL,
	`description` text,
	`prepTimeMins` integer,
	`cookTimeMins` integer,
	`servings` integer,
	`imageUrl` text,
	`category_id` integer,
	`subcategory_id` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`authorId`) REFERENCES `kent-cook-this_users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `kent-cook-this_categories`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`subcategory_id`) REFERENCES `kent-cook-this_categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `kent-cook-this_step_ingredients` (
	`stepId` integer NOT NULL,
	`ingredientId` integer NOT NULL,
	PRIMARY KEY(`stepId`, `ingredientId`),
	FOREIGN KEY (`stepId`) REFERENCES `kent-cook-this_steps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ingredientId`) REFERENCES `kent-cook-this_ingredients`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `kent-cook-this_steps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipeId` integer NOT NULL,
	`position` integer NOT NULL,
	`title` text(255),
	`description` text NOT NULL,
	`imageUrl` text,
	FOREIGN KEY (`recipeId`) REFERENCES `kent-cook-this_recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `steps_recipe_position_idx` ON `kent-cook-this_steps` (`recipeId`,`position`);--> statement-breakpoint
CREATE TABLE `kent-cook-this_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`type` text NOT NULL,
	`color` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_idx` ON `kent-cook-this_tags` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_idx` ON `kent-cook-this_tags` (`name`);--> statement-breakpoint
CREATE TABLE `kent-cook-this_units` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(50) NOT NULL,
	`abbreviation` text(10) NOT NULL,
	`type` text NOT NULL,
	`factorToBase` real NOT NULL,
	`system` text NOT NULL,
	`subUnitId` integer,
	`subUnitScale` integer,
	FOREIGN KEY (`subUnitId`) REFERENCES `kent-cook-this_units`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `units_name_abbrev_type_idx` ON `kent-cook-this_units` (`name`,`abbreviation`,`type`);--> statement-breakpoint
CREATE TABLE `kent-cook-this_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`email` text(320) NOT NULL,
	`passwordHash` text NOT NULL,
	`avatarUrl` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `kent-cook-this_users` (`email`);