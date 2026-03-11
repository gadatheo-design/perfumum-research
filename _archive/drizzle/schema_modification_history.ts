import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, json } from "drizzle-orm/mysql-core";

/**
 * MODIFICATION HISTORY TABLE
 * 
 * Tracks all modifications made to entities in the system for audit and undo functionality.
 * Stores the complete state before and after each modification.
 */

export const modificationHistory = mysqlTable("modification_history", {
  id: int("id").autoincrement().primaryKey(),
  
  // User who made the modification
  userId: int("user_id").notNull(),
  
  // Type of entity modified
  entityType: mysqlEnum("entity_type", [
    "molecule",
    "recette",
    "accord",
    "famille",
    "matiere",
    "prototype",
    "synergie",
    "tradition"
  ]).notNull(),
  
  // ID of the entity that was modified
  entityId: int("entity_id").notNull(),
  
  // Type of operation
  operation: mysqlEnum("operation", ["create", "update", "delete"]).notNull(),
  
  // State before modification (JSON) - null for create operations
  stateBefore: json("state_before"),
  
  // State after modification (JSON) - null for delete operations
  stateAfter: json("state_after"),
  
  // Optional description of the change
  description: text("description"),
  
  // Whether this modification has been undone
  isUndone: int("is_undone").default(0).notNull(), // 0 = not undone, 1 = undone
  
  // Timestamp when the modification was made
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  // Timestamp when the modification was undone (if applicable)
  undoneAt: timestamp("undone_at"),
});

export type ModificationHistory = typeof modificationHistory.$inferSelect;
export type InsertModificationHistory = typeof modificationHistory.$inferInsert;
