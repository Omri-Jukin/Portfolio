CREATE TABLE IF NOT EXISTS "business_custom_fields" (
	"id" uuid PRIMARY KEY NOT NULL,
	"business_id" uuid NOT NULL,
	"label" text NOT NULL,
	"type" text NOT NULL,
	"icon" text,
	"options" text[],
	"required" boolean NOT NULL,
	"placeholder" text,
	"description" text,
	"default_value" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "businesses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"owner" uuid NOT NULL,
	"description" text,
	"address" text,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"type" text NOT NULL,
	"category" text[] NOT NULL,
	"business_specialization" text[] NOT NULL,
	"custom_category" text,
	"custom_specialization" text,
	"customers" uuid[],
	"facebook" text,
	"instagram" text,
	"twitter" text,
	"linkedin" text,
	"tiktok" text,
	"youtube" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_inquiries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp,
	"status" text NOT NULL,
	"closed_at" timestamp,
	"closed_by" text,
	"closed_reason" text,
	"updates" text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_inquiries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"business_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text[] NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" text NOT NULL,
	"price" text,
	"created_at" timestamp NOT NULL,
	"closed_at" timestamp,
	"closed_by" text,
	"closed_reason" text,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"business_id" uuid NOT NULL,
	"customer_id" text NOT NULL,
	"full_name" text NOT NULL,
	"phone_number" text NOT NULL,
	"email" text NOT NULL,
	"address" text NOT NULL,
	"date_of_birth" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp,
	"status" text DEFAULT 'Active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"business_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"business_name" text NOT NULL,
	"customer_name" text NOT NULL,
	"invoice_number" text NOT NULL,
	"invoice_date" text NOT NULL,
	"due_date" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text NOT NULL,
	"phone_number" text,
	"password" text NOT NULL,
	"role" text DEFAULT 'Pending approval' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"business_owned" uuid,
	"verified" boolean DEFAULT false NOT NULL,
	"last_login" timestamp,
	"status" text DEFAULT 'Active' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_custom_fields" ADD CONSTRAINT "business_custom_fields_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "businesses" ADD CONSTRAINT "businesses_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_inquiries" ADD CONSTRAINT "customer_inquiries_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_inquiries" ADD CONSTRAINT "customer_inquiries_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_inquiries" ADD CONSTRAINT "customer_inquiries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "customers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_id_idx" ON "customers" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "role_idx" ON "users" USING btree ("role");