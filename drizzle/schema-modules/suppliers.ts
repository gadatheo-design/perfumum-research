import { date, decimal, foreignKey, index, int, json, mysqlEnum, mysqlTable, primaryKey, text, time, timestamp, unique, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { and} from "drizzle-orm";

import { molecules } from "./molecules";
import { rawMaterials } from "./raw-materials";

// ============================================================================
// SUPPLIERS (Fournisseurs de matières premières)
// ============================================================================

/**
 * Manages suppliers of raw materials (essential oils, absolutes, extracts, etc.)
 * Tracks supplier information, location, specialties, and contact details.
 */
export const suppliers = mysqlTable("suppliers", {
  id: int("id").autoincrement().primaryKey(),
  
  // Supplier name
  name: varchar("name", { length: 255 }).notNull(),
  
  // Company name (if different from supplier name)
  companyName: varchar("company_name", { length: 255 }),
  
  // Country and region
  country: varchar("country", { length: 100 }).notNull(),
  region: varchar("region", { length: 100 }),
  
  // Contact information
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 255 }),
  
  // Supplier specialties (JSON array of material types)
  specialties: json("specialties"), // e.g., ["essential_oils", "absolutes", "extracts"]
  
  // Description of the supplier
  description: text("description"),
  
  // Supplier rating (1-5 stars)
  rating: int("rating"), // 1-5
  
  // Quality certification (ISO, organic, etc.)
  certifications: json("certifications"), // e.g., ["ISO9001", "ORGANIC", "FAIR_TRADE"]
  
  // Whether this is a preferred supplier
  isPreferred: int("is_preferred").default(0).notNull(),
  
  // Notes about the supplier
  notes: text("notes"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // Indexes for fast queries
  nameIdx: index("supplier_name_idx").on(table.name),
  countryIdx: index("supplier_country_idx").on(table.country),
  regionIdx: index("supplier_region_idx").on(table.region),
}));

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = typeof suppliers.$inferInsert;

// ============================================================================
// SUPPLIER MATERIALS (Liaison entre fournisseurs et matières premières)
// ============================================================================

/**
 * Junction table linking suppliers to the materials they provide.
 * Tracks pricing, availability, and lead times.
 */
export const supplierMaterials = mysqlTable("supplier_materials", {
  id: int("id").autoincrement().primaryKey(),
  
  // Foreign keys
  supplierId: int("supplier_id").notNull(),
  moleculeId: int("molecule_id").notNull(),
  
  // Pricing information
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(), // USD, EUR, etc.
  
  // Availability
  minimumOrderQuantity: int("minimum_order_quantity"),
  unit: varchar("unit", { length: 50 }), // kg, L, ml, g, etc.
  
  // Lead time in days
  leadTimeDays: int("lead_time_days"),
  
  // Quality grade
  qualityGrade: mysqlEnum("quality_grade", ["standard", "premium", "extra_premium"]).default("standard").notNull(),
  
  // Whether this material is currently available
  isAvailable: int("is_available").default(1).notNull(),
  
  // Last order date
  lastOrderDate: timestamp("last_order_date"),
  
  // Notes specific to this supplier-material relationship
  notes: text("notes"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // Foreign key constraints
  supplierIdFk: foreignKey({
    columns: [table.supplierId],
    foreignColumns: [suppliers.id],
  }),
  moleculeIdFk: foreignKey({
    columns: [table.moleculeId],
    foreignColumns: [molecules.id],
  }),
  // Unique constraint: one supplier can supply a material only once
  uniqueSupplierMaterial: uniqueIndex("unique_supplier_material").on(table.supplierId, table.moleculeId),
  // Indexes
  supplierIdIdx: index("supplier_material_supplier_idx").on(table.supplierId),
  moleculeIdIdx: index("supplier_material_molecule_idx").on(table.moleculeId),
}));

export type SupplierMaterial = typeof supplierMaterials.$inferSelect;
export type InsertSupplierMaterial = typeof supplierMaterials.$inferInsert;

// ============================================================================
// RELATIONS FOR SUPPLIERS
// ============================================================================

// ============================================================================
// EXTENDED SUPPLIERS (Fournisseurs détaillés)
// ============================================================================

export const extendedSuppliers = mysqlTable("extended_suppliers", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  supplierId: varchar("supplier_id", { length: 30 }).notNull().unique(), // SUP-001, SUP-002, etc.
  name: varchar("name", { length: 255 }).notNull(),
  legalName: varchar("legal_name", { length: 255 }),
  // Type
  supplierType: mysqlEnum("supplier_type", [
    "producer",       // Producteur direct
    "distiller",      // Distillateur
    "trader",         // Négociant
    "cooperative",    // Coopérative
    "laboratory",     // Laboratoire
    "broker",         // Courtier
    "other"
  ]).notNull(),
  // Contact
  country: varchar("country", { length: 100 }),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 500 }),
  contactPerson: varchar("contact_person", { length: 255 }),
  // Spécialités
  specialties: json("specialties").$type<string[]>(), // Types de plantes/produits
  mainProducts: json("main_products").$type<{
    product: string;
    quality?: string;
    availability?: string;
  }[]>(),
  // Certifications
  certifications: json("certifications").$type<{
    name: string;
    number?: string;
    validUntil?: string;
    scope?: string;
  }[]>(),
  // Conditions commerciales
  minimumOrder: varchar("minimum_order", { length: 100 }),
  leadTime: varchar("lead_time", { length: 100 }), // Délai de livraison
  paymentTerms: varchar("payment_terms", { length: 255 }),
  shippingMethods: json("shipping_methods").$type<string[]>(),
  // Évaluation
  qualityRating: mysqlEnum("quality_rating", [
    "excellent",
    "good",
    "acceptable",
    "poor",
    "not_rated"
  ]).default("not_rated"),
  reliabilityRating: mysqlEnum("reliability_rating", [
    "excellent",
    "good",
    "acceptable",
    "poor",
    "not_rated"
  ]).default("not_rated"),
  priceRating: mysqlEnum("price_rating", [
    "premium",
    "competitive",
    "standard",
    "budget",
    "not_rated"
  ]).default("not_rated"),
  // Historique
  firstOrderDate: timestamp("first_order_date"),
  lastOrderDate: timestamp("last_order_date"),
  totalOrders: int("total_orders").default(0),
  // Statut
  status: mysqlEnum("status", [
    "active",
    "inactive",
    "blacklisted",
    "prospect"
  ]).default("active"),
  // Métadonnées
  notes: text("notes"),
  internalNotes: text("internal_notes"), // Notes internes confidentielles
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ExtendedSupplier = typeof extendedSuppliers.$inferSelect;
export type InsertExtendedSupplier = typeof extendedSuppliers.$inferInsert;

// ============================================================================
// EXTENDED SUPPLIER MATERIALS (Matières par fournisseur - Point 3 étendu)
// ============================================================================

export const extendedSupplierMaterials = mysqlTable("extended_supplier_materials", {
  id: int("id").autoincrement().primaryKey(),
  supplierId: int("supplier_id").notNull(),
  plantId: int("plant_id"),
  varietyId: int("variety_id"),
  terroirId: int("terroir_id"),
  // Produit
  productName: varchar("product_name", { length: 255 }).notNull(),
  productType: varchar("product_type", { length: 100 }), // HE, absolue, concrète, etc.
  // Prix
  pricePerKg: decimal("price_per_kg", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("EUR"),
  priceDate: timestamp("price_date"),
  // Disponibilité
  availability: mysqlEnum("availability", [
    "in_stock",
    "on_order",
    "seasonal",
    "limited",
    "discontinued",
    "unknown"
  ]).default("unknown"),
  minimumQuantity: varchar("minimum_quantity", { length: 50 }),
  // Qualité
  qualityGrade: varchar("quality_grade", { length: 50 }),
  certifications: json("certifications").$type<string[]>(),
  // Métadonnées
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ExtendedSupplierMaterial = typeof extendedSupplierMaterials.$inferSelect;
export type InsertExtendedSupplierMaterial = typeof extendedSupplierMaterials.$inferInsert;

// ============================================================================
// INVENTORY ENTRIES (Entrées d'inventaire - Suivi des achats)
// ============================================================================

export const inventoryEntries = mysqlTable("inventory_entries", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  entryId: varchar("entry_id", { length: 30 }).notNull().unique(), // INV-001, INV-002, etc.
  rawMaterialId: int("raw_material_id").notNull().references(() => rawMaterials.id),
  // Informations d'achat
  purchaseDate: timestamp("purchase_date").notNull(),
  supplierId: int("supplier_id").references(() => suppliers.id),
  supplierName: varchar("supplier_name", { length: 255 }), // Nom du fournisseur si non lié
  // Quantité
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(), // Quantité achetée
  unit: mysqlEnum("unit", ["ml", "g", "kg", "L", "oz", "lb"]).default("ml").notNull(),
  remainingQuantity: decimal("remaining_quantity", { precision: 10, scale: 2 }), // Quantité restante
  // Prix
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Prix total
  currency: varchar("currency", { length: 3 }).default("CHF").notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 4 }), // Prix par unité calculé
  // Lot et traçabilité
  batchNumber: varchar("batch_number", { length: 100 }), // Numéro de lot
  expirationDate: timestamp("expiration_date"), // Date d'expiration
  // Stockage
  storageLocation: varchar("storage_location", { length: 255 }), // Emplacement de stockage
  storageConditions: text("storage_conditions"), // Conditions de stockage
  // Notes
  notes: text("notes"), // Notes diverses
  qualityNotes: text("quality_notes"), // Notes sur la qualité
  // Métadonnées
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  rawMaterialIdx: index("inventory_raw_material_idx").on(table.rawMaterialId),
  supplierIdx: index("inventory_supplier_idx").on(table.supplierId),
  purchaseDateIdx: index("inventory_purchase_date_idx").on(table.purchaseDate),
}));

export type InventoryEntry = typeof inventoryEntries.$inferSelect;
export type InsertInventoryEntry = typeof inventoryEntries.$inferInsert;

// Relations pour inventory_entries