CREATE TABLE `certifications` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`issuer` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`skills` text NOT NULL,
	`issue_date` integer NOT NULL,
	`expiry_date` integer,
	`credential_id` text,
	`verification_url` text,
	`icon` text,
	`color` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`is_visible` integer DEFAULT true NOT NULL,
	`name_translations` text,
	`description_translations` text,
	`issuer_translations` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`created_by` text NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `author` text NOT NULL;