import { mysqlTable, mysqlEnum, varchar, int, decimal, text, datetime, primaryKey, foreignKey } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { molecules } from "./schema";

/**
 * Tables pour l'intégration des données Pred-O3
 * Molécules odorants, descripteurs olfactifs, récepteurs olfactifs
 */

// Table des descripteurs olfactifs
export const odorDescriptors = mysqlTable("odor_descriptors", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  frequency: int("frequency").default(0), // Nombre de molécules avec ce descripteur
  category: varchar("category", { length: 50 }), // fruity, floral, woody, etc.
  createdAt: datetime("created_at").defaultNow(),
  updatedAt: datetime("updated_at").defaultNow(),
});

// Table de liaison molécule-descripteur olfactif
export const moleculeOdorDescriptors = mysqlTable(
  "molecule_odor_descriptors",
  {
    moleculeId: int("molecule_id").notNull(),
    descriptorId: varchar("descriptor_id", { length: 50 }).notNull(),
    confidence: decimal("confidence", { precision: 3, scale: 2 }).default("1.00"), // 0.00 à 1.00
    source: varchar("source", { length: 100 }), // pred-o3, leffingwell, etc.
    createdAt: datetime("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.moleculeId, table.descriptorId] }),
    moleculeFk: foreignKey({ columns: [table.moleculeId], foreign: () => [molecules.id] }),
    descriptorFk: foreignKey({ columns: [table.descriptorId], foreign: () => [odorDescriptors.id] }),
  })
);

// Table des récepteurs olfactifs
export const olfactoryReceptors = mysqlTable("olfactory_receptors", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  organism: mysqlEnum("organism", ["human", "mouse", "rat", "other"]).notNull(),
  geneId: varchar("gene_id", { length: 50 }),
  uniprotId: varchar("uniprot_id", { length: 50 }),
  description: text("description"),
  createdAt: datetime("created_at").defaultNow(),
  updatedAt: datetime("updated_at").defaultNow(),
});

// Table de liaison molécule-récepteur olfactif
export const moleculeReceptorInteractions = mysqlTable(
  "molecule_receptor_interactions",
  {
    moleculeId: int("molecule_id").notNull(),
    receptorId: varchar("receptor_id", { length: 50 }).notNull(),
    bindingAffinity: decimal("binding_affinity", { precision: 10, scale: 2 }), // Ki ou Kd en nM
    bindingMode: varchar("binding_mode", { length: 100 }), // agonist, antagonist, etc.
    experimentalMethod: varchar("experimental_method", { length: 100 }), // patch-clamp, fluorescence, etc.
    source: varchar("source", { length: 100 }), // pred-o3, m2or, etc.
    confidence: decimal("confidence", { precision: 3, scale: 2 }).default("1.00"),
    createdAt: datetime("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.moleculeId, table.receptorId] }),
    moleculeFk: foreignKey({ columns: [table.moleculeId], foreign: () => [molecules.id] }),
    receptorFk: foreignKey({ columns: [table.receptorId], foreign: () => [olfactoryReceptors.id] }),
  })
);

// Table pour les propriétés chimiques détaillées (Pred-O3)
export const moleculeChemicalProperties = mysqlTable("molecule_chemical_properties", {
  moleculeId: int("molecule_id").notNull().primaryKey(),
  smiles: varchar("smiles", { length: 500 }),
  inchi: varchar("inchi", { length: 500 }),
  inchiKey: varchar("inchi_key", { length: 50 }),
  molecularFormula: varchar("molecular_formula", { length: 100 }),
  molecularWeight: decimal("molecular_weight", { precision: 10, scale: 3 }),
  logP: decimal("log_p", { precision: 5, scale: 2 }), // Lipophilicity
  hbdCount: int("hbd_count"), // Hydrogen bond donors
  hbaCount: int("hba_count"), // Hydrogen bond acceptors
  rotableBonds: int("rotatable_bonds"),
  polarSurfaceArea: decimal("polar_surface_area", { precision: 6, scale: 2 }),
  createdAt: datetime("created_at").defaultNow(),
  updatedAt: datetime("updated_at").defaultNow(),
  foreignKey: foreignKey({
    columns: [moleculeChemicalProperties.moleculeId],
    foreign: () => [molecules.id],
  }),
});

// Table pour les données de chiralité
export const moleculeStereoisomers = mysqlTable("molecule_stereoisomers", {
  id: int("id").primaryKey().autoincrement(),
  parentMoleculeId: int("parent_molecule_id").notNull(),
  stereoisomerMoleculeId: int("stereoisomer_molecule_id"),
  configuration: varchar("configuration", { length: 100 }), // (R), (S), (2R,4S), etc.
  odorDifference: text("odor_difference"), // Description des différences olfactives
  source: varchar("source", { length: 100 }), // leffingwell, literature, etc.
  createdAt: datetime("created_at").defaultNow(),
  foreignKeyParent: foreignKey({
    columns: [moleculeStereoisomers.parentMoleculeId],
    foreign: () => [molecules.id],
  }),
  foreignKeyIsomer: foreignKey({
    columns: [moleculeStereoisomers.stereoisomerMoleculeId],
    foreign: () => [molecules.id],
  }),
});

// Relations pour Drizzle ORM
export const odorDescriptorsRelations = relations(odorDescriptors, ({ many }) => ({
  molecules: many(moleculeOdorDescriptors),
}));

export const moleculeOdorDescriptorsRelations = relations(
  moleculeOdorDescriptors,
  ({ one }) => ({
    molecule: one(molecules, {
      fields: [moleculeOdorDescriptors.moleculeId],
      references: [molecules.id],
    }),
    descriptor: one(odorDescriptors, {
      fields: [moleculeOdorDescriptors.descriptorId],
      references: [odorDescriptors.id],
    }),
  })
);

export const olfactoryReceptorsRelations = relations(olfactoryReceptors, ({ many }) => ({
  molecules: many(moleculeReceptorInteractions),
}));

export const moleculeReceptorInteractionsRelations = relations(
  moleculeReceptorInteractions,
  ({ one }) => ({
    molecule: one(molecules, {
      fields: [moleculeReceptorInteractions.moleculeId],
      references: [molecules.id],
    }),
    receptor: one(olfactoryReceptors, {
      fields: [moleculeReceptorInteractions.receptorId],
      references: [olfactoryReceptors.id],
    }),
  })
);

export const moleculeChemicalPropertiesRelations = relations(
  moleculeChemicalProperties,
  ({ one }) => ({
    molecule: one(molecules, {
      fields: [moleculeChemicalProperties.moleculeId],
      references: [molecules.id],
    }),
  })
);

export const moleculeStereoisomersRelations = relations(
  moleculeStereoisomers,
  ({ one }) => ({
    parentMolecule: one(molecules, {
      fields: [moleculeStereoisomers.parentMoleculeId],
      references: [molecules.id],
    }),
    stereoisomerMolecule: one(molecules, {
      fields: [moleculeStereoisomers.stereoisomerMoleculeId],
      references: [molecules.id],
    }),
  })
);
