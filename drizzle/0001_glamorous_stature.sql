CREATE TABLE "work_experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"location" text NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"description" text NOT NULL,
	"achievements" json NOT NULL,
	"technologies" json NOT NULL,
	"responsibilities" json NOT NULL,
	"employment_type" text NOT NULL,
	"industry" text NOT NULL,
	"company_url" text,
	"logo" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"role_translations" json,
	"company_translations" json,
	"description_translations" json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "work_experiences" ADD CONSTRAINT "work_experiences_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;