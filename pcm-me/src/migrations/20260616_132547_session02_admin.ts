import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_roles\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text(36) NOT NULL,
  	\`value\` text,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_roles_order_idx\` ON \`users_roles\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`users_roles_parent_idx\` ON \`users_roles\` (\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`articles\` ADD \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`articles\` ADD \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`articles\` ADD \`og_image_id\` text(36) REFERENCES images(id);`)
  await db.run(sql`ALTER TABLE \`articles\` ADD \`featured\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`articles\` ADD \`featured_order\` numeric;`)
  await db.run(sql`CREATE INDEX \`articles_og_image_idx\` ON \`articles\` (\`og_image_id\`);`)
  await db.run(sql`ALTER TABLE \`companies\` ADD \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`companies\` ADD \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`companies\` ADD \`og_image_id\` text(36) REFERENCES images(id);`)
  await db.run(sql`ALTER TABLE \`companies\` ADD \`featured\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`companies\` ADD \`featured_order\` numeric;`)
  await db.run(sql`CREATE INDEX \`companies_og_image_idx\` ON \`companies\` (\`og_image_id\`);`)
  await db.run(sql`ALTER TABLE \`vacancies\` ADD \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`vacancies\` ADD \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`vacancies\` ADD \`og_image_id\` text(36) REFERENCES images(id);`)
  await db.run(sql`ALTER TABLE \`vacancies\` ADD \`featured\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`vacancies\` ADD \`featured_order\` numeric;`)
  await db.run(sql`CREATE INDEX \`vacancies_og_image_idx\` ON \`vacancies\` (\`og_image_id\`);`)
  await db.run(sql`ALTER TABLE \`categories\` ADD \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`categories\` ADD \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`categories\` ADD \`og_image_id\` text(36) REFERENCES images(id);`)
  await db.run(sql`ALTER TABLE \`categories\` ADD \`featured\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`categories\` ADD \`featured_order\` numeric;`)
  await db.run(sql`CREATE INDEX \`categories_og_image_idx\` ON \`categories\` (\`og_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_roles\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_articles\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`kind\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`excerpt\` text,
  	\`body\` text,
  	\`hero_image_id\` text(36),
  	\`author_id\` text(36),
  	\`category_id\` text(36),
  	\`published_at\` text,
  	\`reading_time_minutes\` numeric,
  	\`locale\` text DEFAULT 'ar' NOT NULL,
  	\`translation_group_id\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`legacy_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`images\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`authors\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_articles\`("id", "kind", "title", "excerpt", "body", "hero_image_id", "author_id", "category_id", "published_at", "reading_time_minutes", "locale", "translation_group_id", "slug", "status", "legacy_url", "updated_at", "created_at") SELECT "id", "kind", "title", "excerpt", "body", "hero_image_id", "author_id", "category_id", "published_at", "reading_time_minutes", "locale", "translation_group_id", "slug", "status", "legacy_url", "updated_at", "created_at" FROM \`articles\`;`)
  await db.run(sql`DROP TABLE \`articles\`;`)
  await db.run(sql`ALTER TABLE \`__new_articles\` RENAME TO \`articles\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`articles_hero_image_idx\` ON \`articles\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_author_idx\` ON \`articles\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_category_idx\` ON \`articles\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_translation_group_id_idx\` ON \`articles\` (\`translation_group_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_slug_idx\` ON \`articles\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`articles_updated_at_idx\` ON \`articles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`articles_created_at_idx\` ON \`articles\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`slug_locale_idx\` ON \`articles\` (\`slug\`,\`locale\`);`)
  await db.run(sql`CREATE TABLE \`__new_companies\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`logo_id\` text(36),
  	\`body\` text,
  	\`external_url\` text,
  	\`founded\` text,
  	\`headquarters\` text,
  	\`locale\` text DEFAULT 'ar' NOT NULL,
  	\`translation_group_id\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`legacy_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`images\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_companies\`("id", "name", "logo_id", "body", "external_url", "founded", "headquarters", "locale", "translation_group_id", "slug", "status", "legacy_url", "updated_at", "created_at") SELECT "id", "name", "logo_id", "body", "external_url", "founded", "headquarters", "locale", "translation_group_id", "slug", "status", "legacy_url", "updated_at", "created_at" FROM \`companies\`;`)
  await db.run(sql`DROP TABLE \`companies\`;`)
  await db.run(sql`ALTER TABLE \`__new_companies\` RENAME TO \`companies\`;`)
  await db.run(sql`CREATE INDEX \`companies_logo_idx\` ON \`companies\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`companies_translation_group_id_idx\` ON \`companies\` (\`translation_group_id\`);`)
  await db.run(sql`CREATE INDEX \`companies_slug_idx\` ON \`companies\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`companies_updated_at_idx\` ON \`companies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`companies_created_at_idx\` ON \`companies\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`slug_locale_1_idx\` ON \`companies\` (\`slug\`,\`locale\`);`)
  await db.run(sql`CREATE TABLE \`__new_vacancies\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`employer\` text,
  	\`country\` text NOT NULL,
  	\`role_type\` text NOT NULL,
  	\`description\` text,
  	\`requirements\` text,
  	\`location\` text,
  	\`apply_email\` text,
  	\`apply_whatsapp\` text,
  	\`posted_at\` text NOT NULL,
  	\`expires_at\` text,
  	\`locale\` text DEFAULT 'ar' NOT NULL,
  	\`translation_group_id\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`legacy_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_vacancies\`("id", "title", "employer", "country", "role_type", "description", "requirements", "location", "apply_email", "apply_whatsapp", "posted_at", "expires_at", "locale", "translation_group_id", "slug", "status", "legacy_url", "updated_at", "created_at") SELECT "id", "title", "employer", "country", "role_type", "description", "requirements", "location", "apply_email", "apply_whatsapp", "posted_at", "expires_at", "locale", "translation_group_id", "slug", "status", "legacy_url", "updated_at", "created_at" FROM \`vacancies\`;`)
  await db.run(sql`DROP TABLE \`vacancies\`;`)
  await db.run(sql`ALTER TABLE \`__new_vacancies\` RENAME TO \`vacancies\`;`)
  await db.run(sql`CREATE INDEX \`vacancies_translation_group_id_idx\` ON \`vacancies\` (\`translation_group_id\`);`)
  await db.run(sql`CREATE INDEX \`vacancies_slug_idx\` ON \`vacancies\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`vacancies_updated_at_idx\` ON \`vacancies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`vacancies_created_at_idx\` ON \`vacancies\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`slug_locale_2_idx\` ON \`vacancies\` (\`slug\`,\`locale\`);`)
  await db.run(sql`CREATE TABLE \`__new_categories\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`parent_id\` text(36),
  	\`locale\` text DEFAULT 'ar' NOT NULL,
  	\`translation_group_id\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`legacy_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_categories\`("id", "name", "parent_id", "locale", "translation_group_id", "slug", "status", "legacy_url", "updated_at", "created_at") SELECT "id", "name", "parent_id", "locale", "translation_group_id", "slug", "status", "legacy_url", "updated_at", "created_at" FROM \`categories\`;`)
  await db.run(sql`DROP TABLE \`categories\`;`)
  await db.run(sql`ALTER TABLE \`__new_categories\` RENAME TO \`categories\`;`)
  await db.run(sql`CREATE INDEX \`categories_parent_idx\` ON \`categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`categories_translation_group_id_idx\` ON \`categories\` (\`translation_group_id\`);`)
  await db.run(sql`CREATE INDEX \`categories_slug_idx\` ON \`categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`categories_updated_at_idx\` ON \`categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`categories_created_at_idx\` ON \`categories\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`slug_locale_3_idx\` ON \`categories\` (\`slug\`,\`locale\`);`)
}
