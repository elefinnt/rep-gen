// Schema for the report comment generator

import {
  mysqlTableCreator,
  varchar,
  text,
  boolean,
  int,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `repgen_${name}`);

// Users table to store authentication information
export const users = createTable("user", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
});

// User profiles table to store additional user information
export const userProfiles = createTable("user_profile", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  teacherName: varchar({ length: 255 }).notNull(),
  gradeLevel: varchar({ length: 50 }).notNull(),
  reportRequirements: text("report_requirements"),
  hasCompletedOnboarding: boolean("has_completed_onboarding")
    .default(false)
    .notNull(),
});

// Students table to store student information
export const students = createTable("student", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar({ length: 255 }).notNull(),
  gender: varchar({ length: 50 }).notNull().default("other"), // Options: "male", "female", "other"
});

// Global attributes table to store positive and improvement attributes visible to all users
export const attributes = createTable("attribute", {
  id: int("id").primaryKey().autoincrement(),
  text: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  isGlobal: boolean("is_global").default(true).notNull(),
});

// Personal attributes table to store user-specific attributes
export const personalAttributes = createTable("personal_attr", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  text: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
});

// Student-Attributes junction table to store the many-to-many relationship for global attributes
export const studentAttributes = createTable("student_attr", {
  id: int("id").primaryKey().autoincrement(),
  studentId: int("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  attributeId: int("attribute_id")
    .notNull()
    .references(() => attributes.id, { onDelete: "cascade" }),
});

// Student-Personal Attributes junction table for user-specific attributes
export const studentUserAttributes = createTable("student_user_attr", {
  id: int("id").primaryKey().autoincrement(),
  studentId: int("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  attrId: int("attr_id")
    .notNull()
    .references(() => personalAttributes.id, { onDelete: "cascade" }),
});
