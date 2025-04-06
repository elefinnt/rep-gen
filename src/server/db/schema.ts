// Schema for the report comment generator

import {
  mysqlTableCreator,
  serial,
  varchar,
  int,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `rep-gen_${name}`);

// Students table to store student information
export const students = createTable("student", {
  id: serial("id").primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  gender: varchar({ length: 50 }).notNull().default("other"), // Options: "male", "female", "other"
});

// Attributes table to store positive and improvement attributes
export const attributes = createTable("attribute", {
  id: serial("id").primaryKey().autoincrement(),
  text: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
});

// Student-Attributes junction table to store the many-to-many relationship
export const studentAttributes = createTable("student_attribute", {
  id: serial("id").primaryKey().autoincrement(),
  studentId: int("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  attributeId: int("attribute_id")
    .notNull()
    .references(() => attributes.id, { onDelete: "cascade" }),
});
