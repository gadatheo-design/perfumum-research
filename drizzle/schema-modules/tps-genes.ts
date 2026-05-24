import { index, int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { or} from "drizzle-orm";

import { molecules } from "./molecules";

// ============================================================================
// TPS GENES (Terpene Synthase Genes)
// ============================================================================

export const tpsGenes = mysqlTable("tps_genes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  subfamily: varchar("subfamily", { length: 20 }).notNull(), // TPS-a, TPS-b, TPS-c, TPS-e/f, TPS-g
  productClass: varchar("product_class", { length: 50 }).notNull(), // monoterpene, sesquiterpene, diterpene
  mainProduct: varchar("main_product", { length: 100 }).notNull(),
  olfactoryNotes: text("olfactory_notes"),
  pathway: varchar("pathway", { length: 10 }).notNull(), // MEP or MVA
  regulationFactors: text("regulation_factors"),
  expressionConditions: text("expression_conditions"),
  sourceReference: varchar("source_reference", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("tps_genes_name_idx").on(table.name),
  subfamilyIdx: index("tps_genes_subfamily_idx").on(table.subfamily),
  productClassIdx: index("tps_genes_product_class_idx").on(table.productClass),
}));

export type TpsGene = typeof tpsGenes.$inferSelect;
export type InsertTpsGene = typeof tpsGenes.$inferInsert;

// ============================================================================
// TPS GENE - MOLECULE LINKS
// ============================================================================

export const tpsGeneMolecules = mysqlTable("tps_gene_molecules", {
  id: int("id").autoincrement().primaryKey(),
  tpsGeneId: int("tps_gene_id").notNull().references(() => tpsGenes.id, { onDelete: "cascade" }),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id, { onDelete: "cascade" }),
  relationshipType: mysqlEnum("relationship_type", ["produces", "catalyzes", "regulates", "precursor"]).notNull().default("produces"),
  confidenceLevel: mysqlEnum("confidence_level", ["confirmed", "predicted", "inferred"]).notNull().default("inferred"),
  evidenceSource: varchar("evidence_source", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqueGeneMolecule: uniqueIndex("unique_tps_gene_molecule").on(table.tpsGeneId, table.moleculeId),
  geneIdx: index("tps_gene_molecules_gene_idx").on(table.tpsGeneId),
  moleculeIdx: index("tps_gene_molecules_molecule_idx").on(table.moleculeId),
}));

export type TpsGeneMolecule = typeof tpsGeneMolecules.$inferSelect;
export type InsertTpsGeneMolecule = typeof tpsGeneMolecules.$inferInsert;

// Relations for TPS Genes