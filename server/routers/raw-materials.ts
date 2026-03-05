import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { rawMaterials, rawMaterialMolecules, molecules, extendedSuppliers, extendedSupplierMaterials, inventoryEntries } from "../../drizzle/schema";
import { eq, like, desc, asc, sql, and, or } from "drizzle-orm";

export const rawMaterialsRouter = router({
  getAll: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const conditions = [];
      if (input?.category) conditions.push(eq(rawMaterials.category, input.category as any));
      if (input?.search) {
        conditions.push(or(
          like(rawMaterials.name, `%${input.search}%`),
          like(rawMaterials.latinName, `%${input.search}%`)
        ));
      }
      return db.select().from(rawMaterials)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(rawMaterials.createdAt))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [result] = await db.select().from(rawMaterials).where(eq(rawMaterials.id, input.id)).limit(1);
      return result || null;
    }),

  getByMaterialId: publicProcedure
    .input(z.object({ materialId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [result] = await db.select().from(rawMaterials).where(eq(rawMaterials.materialId, input.materialId)).limit(1);
      return result || null;
    }),

  getMolecules: publicProcedure
    .input(z.object({ rawMaterialId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select({
        id: rawMaterialMolecules.id,
        percentage: rawMaterialMolecules.percentage,
        isSignature: rawMaterialMolecules.isSignature,
        variability: rawMaterialMolecules.variability,
        notes: rawMaterialMolecules.notes,
        molecule: {
          id: molecules.id,
          name: molecules.name,
          casNumber: molecules.casNumber,
          chemicalFormula: molecules.chemicalFormula,
          family: molecules.family,
        }
      })
        .from(rawMaterialMolecules)
        .innerJoin(molecules, eq(rawMaterialMolecules.moleculeId, molecules.id))
        .where(eq(rawMaterialMolecules.rawMaterialId, input.rawMaterialId))
        .orderBy(desc(rawMaterialMolecules.percentage));
    }),

  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, byCategory: [], byOrigin: [] };
    const [totalCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(rawMaterials);
    const categoryStats = await db.select({
      category: rawMaterials.category,
      count: sql<number>`COUNT(*)`
    }).from(rawMaterials).groupBy(rawMaterials.category);
    const originStats = await db.select({
      origin: rawMaterials.originCountry,
      count: sql<number>`COUNT(*)`
    }).from(rawMaterials).groupBy(rawMaterials.originCountry).orderBy(desc(sql`COUNT(*)`)).limit(10);
    return { total: totalCount?.count || 0, byCategory: categoryStats, byOrigin: originStats };
  }),

  create: protectedProcedure
    .input(z.object({
      materialId: z.string(),
      name: z.string(),
      latinName: z.string().optional(),
      category: z.enum([
        "huile_essentielle", "absolue", "concrete", "resinoid",
        "co2_extract", "teinture", "infusion", "attar",
        "resine", "baume", "cire", "hydrolat",
        "dilution", "matiere_brute", "autre"
      ]),
      originCountry: z.string().optional(),
      extractionNotes: z.string().optional(),
      usageNotes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [result] = await db.insert(rawMaterials).values({
        materialId: input.materialId,
        name: input.name,
        latinName: input.latinName,
        category: input.category as any,
        originCountry: input.originCountry,
        extractionNotes: input.extractionNotes,
        usageNotes: input.usageNotes,
      });
      return { success: true, id: (result as any).insertId };
    }),

  searchByMolecule: publicProcedure
    .input(z.object({ moleculeName: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const [molecule] = await db.select().from(molecules).where(like(molecules.name, `%${input.moleculeName}%`)).limit(1);
      if (!molecule) return [];
      return db.select({
        rawMaterial: rawMaterials,
        percentage: rawMaterialMolecules.percentage,
        isSignature: rawMaterialMolecules.isSignature,
      })
        .from(rawMaterialMolecules)
        .innerJoin(rawMaterials, eq(rawMaterialMolecules.rawMaterialId, rawMaterials.id))
        .where(eq(rawMaterialMolecules.moleculeId, molecule.id))
        .orderBy(desc(rawMaterialMolecules.percentage));
    }),

  getCategories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const categories = await db.selectDistinct({ category: rawMaterials.category }).from(rawMaterials).where(sql`${rawMaterials.category} IS NOT NULL`);
    return categories.map(c => c.category).filter(Boolean);
  }),

  getOrigins: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const origins = await db.selectDistinct({ origin: rawMaterials.originCountry }).from(rawMaterials).where(sql`${rawMaterials.originCountry} IS NOT NULL`);
    return origins.map(o => o.origin).filter(Boolean);
  }),

  getInventory: publicProcedure
    .input(z.object({ rawMaterialId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(inventoryEntries).where(eq(inventoryEntries.rawMaterialId, input.rawMaterialId)).orderBy(desc(inventoryEntries.purchaseDate));
    }),

  getAllInventory: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select({
        entry: inventoryEntries,
        rawMaterial: {
          id: rawMaterials.id,
          name: rawMaterials.name,
          materialId: rawMaterials.materialId,
          category: rawMaterials.category,
        }
      })
        .from(inventoryEntries)
        .innerJoin(rawMaterials, eq(inventoryEntries.rawMaterialId, rawMaterials.id))
        .orderBy(desc(inventoryEntries.purchaseDate))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0);
    }),

  addInventoryEntry: protectedProcedure
    .input(z.object({
      rawMaterialId: z.number(),
      purchaseDate: z.string(),
      supplierName: z.string().optional(),
      quantity: z.number(),
      unit: z.enum(['ml', 'g', 'kg', 'L', 'oz', 'lb']).default('ml'),
      price: z.number(),
      currency: z.string().default('CHF'),
      batchNumber: z.string().optional(),
      expirationDate: z.string().optional(),
      storageLocation: z.string().optional(),
      storageConditions: z.string().optional(),
      notes: z.string().optional(),
      qualityNotes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [countResult] = await db.select({ count: sql<number>`COUNT(*)` }).from(inventoryEntries);
      const entryId = `INV-${String((countResult?.count || 0) + 1).padStart(4, '0')}`;
      const pricePerUnit = input.quantity > 0 ? input.price / input.quantity : 0;
      const [result] = await db.insert(inventoryEntries).values({
        entryId,
        rawMaterialId: input.rawMaterialId,
        purchaseDate: new Date(input.purchaseDate),
        supplierName: input.supplierName,
        quantity: String(input.quantity),
        unit: input.unit,
        remainingQuantity: String(input.quantity),
        price: String(input.price),
        currency: input.currency,
        pricePerUnit: String(pricePerUnit),
        batchNumber: input.batchNumber,
        expirationDate: input.expirationDate ? new Date(input.expirationDate) : undefined,
        storageLocation: input.storageLocation,
        storageConditions: input.storageConditions,
        notes: input.notes,
        qualityNotes: input.qualityNotes,
      });
      return { success: true, id: (result as any).insertId, entryId };
    }),

  updateInventoryQuantity: protectedProcedure
    .input(z.object({
      entryId: z.number(),
      remainingQuantity: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(inventoryEntries).set({ remainingQuantity: String(input.remainingQuantity) }).where(eq(inventoryEntries.id, input.entryId));
      return { success: true };
    }),

  getInventoryStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalEntries: 0, totalValue: 0, recentEntries: [] };
    const [totalEntries] = await db.select({ count: sql<number>`COUNT(*)` }).from(inventoryEntries);
    const [totalValue] = await db.select({ total: sql<number>`SUM(CAST(price AS DECIMAL(10,2)))` }).from(inventoryEntries);
    const recentEntries = await db.select({
      entry: inventoryEntries,
      rawMaterial: { id: rawMaterials.id, name: rawMaterials.name }
    })
      .from(inventoryEntries)
      .innerJoin(rawMaterials, eq(inventoryEntries.rawMaterialId, rawMaterials.id))
      .orderBy(desc(inventoryEntries.purchaseDate))
      .limit(5);
    return { totalEntries: totalEntries?.count || 0, totalValue: totalValue?.total || 0, recentEntries };
  }),

  getMsSpectra: publicProcedure
    .input(z.object({ rawMaterialId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { spectra: [], moleculesWithoutSpectra: [] };
      const materialMolecules = await db.select({
        moleculeId: rawMaterialMolecules.moleculeId,
        percentage: rawMaterialMolecules.percentage,
        moleculeName: molecules.name,
        casNumber: molecules.casNumber,
      })
        .from(rawMaterialMolecules)
        .innerJoin(molecules, eq(rawMaterialMolecules.moleculeId, molecules.id))
        .where(eq(rawMaterialMolecules.rawMaterialId, input.rawMaterialId));
      if (materialMolecules.length === 0) return { spectra: [], moleculesWithoutSpectra: [] };
      const spectraResults: any[] = [];
      const moleculesWithoutSpectra: any[] = [];
      for (const mol of materialMolecules) {
        let spectraRows: any[] = [];
        if (mol.casNumber) {
          const r = await db.execute(sql`SELECT * FROM ms_spectra WHERE cas_number = ${mol.casNumber} LIMIT 1`);
          spectraRows = (r[0] as unknown) as any[];
        }
        if (spectraRows.length === 0 && mol.moleculeName) {
          const r = await db.execute(sql`SELECT * FROM ms_spectra WHERE compound_name LIKE ${`%${mol.moleculeName}%`} LIMIT 1`);
          spectraRows = (r[0] as unknown) as any[];
        }
        if (spectraRows.length > 0) {
          spectraResults.push({ ...spectraRows[0], moleculeName: mol.moleculeName, percentage: mol.percentage });
        } else {
          moleculesWithoutSpectra.push({ name: mol.moleculeName, casNumber: mol.casNumber, percentage: mol.percentage });
        }
      }
      return { spectra: spectraResults, moleculesWithoutSpectra };
    }),
});

export const suppliersRouter = router({
  getAll: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      country: z.string().optional(),
      limit: z.number().optional().default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const conditions = [];
      if (input?.search) {
        conditions.push(or(
          like(extendedSuppliers.name, `%${input.search}%`),
          like(extendedSuppliers.country, `%${input.search}%`)
        ));
      }
      if (input?.country) conditions.push(eq(extendedSuppliers.country, input.country));
      return db.select().from(extendedSuppliers)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(asc(extendedSuppliers.name))
        .limit(input?.limit || 50);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [result] = await db.select().from(extendedSuppliers).where(eq(extendedSuppliers.id, input.id)).limit(1);
      return result || null;
    }),

  getMaterials: publicProcedure
    .input(z.object({ supplierId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(extendedSupplierMaterials).where(eq(extendedSupplierMaterials.supplierId, input.supplierId)).orderBy(asc(extendedSupplierMaterials.productName));
    }),

  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, byCountry: [], byType: [] };
    const [totalCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(extendedSuppliers);
    const countryStats = await db.select({
      country: extendedSuppliers.country,
      count: sql<number>`COUNT(*)`
    }).from(extendedSuppliers).groupBy(extendedSuppliers.country).orderBy(desc(sql`COUNT(*)`)).limit(10);
    const typeStats = await db.select({
      type: extendedSuppliers.supplierType,
      count: sql<number>`COUNT(*)`
    }).from(extendedSuppliers).groupBy(extendedSuppliers.supplierType);
    return { total: totalCount?.count || 0, byCountry: countryStats, byType: typeStats };
  }),

  create: protectedProcedure
    .input(z.object({
      supplierId: z.string(),
      name: z.string(),
      legalName: z.string().optional(),
      supplierType: z.enum(["producer", "distiller", "trader", "cooperative", "laboratory", "broker", "other"]),
      country: z.string().optional(),
      region: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      website: z.string().optional(),
      description: z.string().optional(),
      specialties: z.array(z.string()).optional(),
      certifications: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [result] = await db.insert(extendedSuppliers).values({
        supplierId: input.supplierId,
        name: input.name,
        legalName: input.legalName,
        supplierType: input.supplierType,
        country: input.country,
        region: input.region as any,
        email: input.email,
        phone: input.phone,
        website: input.website,
        description: input.description,
        specialties: input.specialties as any,
        certifications: input.certifications as any,
      } as any);
      return { success: true, id: (result as any).insertId };
    }),
});
