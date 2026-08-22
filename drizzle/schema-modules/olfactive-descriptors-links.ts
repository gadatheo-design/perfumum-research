import { mysqlTable, varchar, int, text, timestamp, index } from "drizzle-orm/mysql-core";

/**
 * Liaison entre descripteurs olfactifs Pred-O3 et plantes
 */
export const descriptorPlantLinks = mysqlTable(
  "descriptor_plant_links",
  {
    id: int().primaryKey().autoincrement(),
    descriptorId: varchar("descriptor_id", { length: 100 }).notNull(),
    descriptorName: varchar("descriptor_name", { length: 255 }).notNull(),
    plantId: int("plant_id"),
    latinName: varchar("latin_name", { length: 255 }),
    commonName: varchar("common_name", { length: 255 }),
    strength: int("force_level").default(3), // 1-5 : force de l'association
    notes: text("notes"),
    source: varchar("source", { length: 100 }), // "manual", "pred-o3", "user", etc.
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    descriptorIdx: index("idx_descriptor_id").on(table.descriptorId),
    plantIdx: index("idx_plant_id").on(table.plantId),
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
    descriptorName: varchar("descriptor_name", { length: 255 }).notNull(),
    moleculeId: int("molecule_id"),
    moleculeName: varchar("molecule_name", { length: 255 }),
    iupacName: varchar("iupac_name", { length: 500 }),
    casNumber: varchar("cas_number", { length: 50 }),
    strength: int("force_level").default(3), // 1-5 : force de l'association
    notes: text("notes"),
    source: varchar("source", { length: 100 }), // "manual", "pred-o3", "user", etc.
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    descriptorIdx: index("idx_descriptor_id").on(table.descriptorId),
    moleculeIdx: index("idx_molecule_id").on(table.moleculeId),
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
    totalPlants: int("total_plants").default(0),
    totalMolecules: int("total_molecules").default(0),
    lastUpdated: timestamp("last_updated").defaultNow().onUpdateNow(),
  },
  (table) => ({
    descriptorIdx: index("idx_descriptor_id").on(table.descriptorId),
  })
);
