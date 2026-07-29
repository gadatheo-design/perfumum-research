import { mysqlTable, varchar, int, timestamp, index, foreignKey } from "drizzle-orm/mysql-core";

/**
 * Liaison entre descripteurs olfactifs Pred-O3 et plantes
 */
export const descriptorPlantLinks = mysqlTable(
  "descriptor_plant_links",
  {
    id: int().primaryKey().autoincrement(),
    descriptorId: varchar("descriptor_id", { length: 100 }).notNull(),
    plantId: int().notNull(),
    strength: int().default(1), // 1-5 : force de l'association
    notes: varchar("notes", { length: 500 }),
    source: varchar("source", { length: 100 }), // "manual", "pred-o3", "user", etc.
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow().onUpdateNow(),
  },
  (table) => ({
    descriptorIdx: index("idx_descriptor_id").on(table.descriptorId),
    plantIdx: index("idx_plant_id").on(table.plantId),
    uniqueLink: index("unique_descriptor_plant").on(table.descriptorId, table.plantId),
  })
);

/**
 * Liaison entre descripteurs olfactifs Pred-O3 et molécules
 */
export const descriptorMoleculeLinks = mysqlTable(
  "descriptor_molecule_links",
  {
    id: int().primaryKey().autoincrement(),
    descriptorId: varchar("descriptor_id", { length: 100 }).notNull(),
    moleculeId: int().notNull(),
    strength: int().default(1), // 1-5 : force de l'association
    notes: varchar("notes", { length: 500 }),
    source: varchar("source", { length: 100 }), // "manual", "pred-o3", "user", etc.
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow().onUpdateNow(),
  },
  (table) => ({
    descriptorIdx: index("idx_descriptor_id").on(table.descriptorId),
    moleculeIdx: index("idx_molecule_id").on(table.moleculeId),
    uniqueLink: index("unique_descriptor_molecule").on(table.descriptorId, table.moleculeId),
  })
);

/**
 * Occurrences de descripteurs olfactifs (cache pour performance)
 */
export const descriptorOccurrences = mysqlTable(
  "descriptor_occurrences",
  {
    id: int().primaryKey().autoincrement(),
    descriptorId: varchar("descriptor_id", { length: 100 }).notNull(),
    totalPlants: int().default(0),
    totalMolecules: int().default(0),
    lastUpdated: timestamp().defaultNow().onUpdateNow(),
  },
  (table) => ({
    descriptorIdx: index("idx_descriptor_id").on(table.descriptorId),
  })
);
