import { date, int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

// ============================================================================
// CORE USER TABLE
// ============================================================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;


// ============================================================================
// USER FAVORITES
// ============================================================================

export const userFavorites = mysqlTable("user_favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  moleculeId: int("molecule_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Unique constraint: one user can favorite a molecule only once
  uniqueUserMolecule: uniqueIndex("unique_user_molecule").on(table.userId, table.moleculeId),
}));

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = typeof userFavorites.$inferInsert;


// ============================================================================
// RESEARCH MILESTONES
// ============================================================================

export const milestones = mysqlTable("milestones", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["prototype", "discovery", "collaboration", "publication", "other"]).default("other").notNull(),
  moleculeId: int("molecule_id"), // Optional: link to a specific molecule
  userId: int("user_id").notNull(), // Creator of the milestone
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = typeof milestones.$inferInsert;

