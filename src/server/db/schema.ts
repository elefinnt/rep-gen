// Schema for the report comment generator

import { sql } from "drizzle-orm";
import {
  index,
  mysqlTableCreator,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `rep-gen_${name}`);

// Students table to store student names
export const students = createTable("student", {
  id: serial("id").primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
});

// Attributes table to store positive and improvement attributes
export const attributes = createTable("attribute", {
  id: serial("id").primaryKey().autoincrement(),
  text: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
});
