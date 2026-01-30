import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { rawMaterials, rawMaterialMolecules, molecules, extendedSuppliers, extendedSupplierMaterials, inventoryEntries, suppliers } from "../../drizzle/schema";
import { eq, like, desc, asc, sql, and, or, inArray } from "drizzle-orm";

export const rawMaterialsRouter = router({
  // Récupérer toutes les matières premières
  getAll: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
    }).optional())
    .query(async ({ input }) => {
      const conditions = [];
      
      if (input?.category) {
        conditions.push(eq(rawMaterials.category, input.category as any));
      }
      
      if (input?.search) {
        conditions.push(
          or(
            like(rawMaterials.name, `%${input.search}%`),
            like(rawMaterials.latinName, `%${input.search}%`)
          )
        );
      }
      
      const db = await getDb();
      const results = await db
        .select()
        .from(rawMaterials)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(rawMaterials.createdAt))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0);
      
      return results;
    }),

  // Récupérer une matière première par ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [result] = await db
        .select()
        .from(rawMaterials)
        .where(eq(rawMaterials.id, input.id))
        .limit(1);
      
      return result || null;
    }),

  // Récupérer une matière première par materialId
  getByMaterialId: publicProcedure
    .input(z.object({ materialId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [result] = await db
        .select()
        .from(rawMaterials)
        .where(eq(rawMaterials.materialId, input.materialId))
        .limit(1);
      
      return result || null;
    }),

  // Récupérer les molécules d'une matière première
  getMolecules: publicProcedure
    .input(z.object({ rawMaterialId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const results = await db
        .select({
          id: rawMaterialMolecules.id,
          percentage: rawMaterialMolecules.percentage,
          isSignature: rawMaterialMolecules.isSignature,
          variability: rawMaterialMolecules.variability,
          notes: rawMaterialMolecules.notes,
          molecule: {
            id: molecules.id,
            name: molecules.name,
            casNumber: molecules.casNumber,
            molecularFormula: molecules.molecularFormula,
            olfactiveFamily: molecules.olfactiveFamily,
          }
        })
        .from(rawMaterialMolecules)
        .innerJoin(molecules, eq(rawMaterialMolecules.moleculeId, molecules.id))
        .where(eq(rawMaterialMolecules.rawMaterialId, input.rawMaterialId))
        .orderBy(desc(rawMaterialMolecules.percentage));
      
      return results;
    }),

  // Statistiques des matières premières
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    const [totalCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(rawMaterials);
    
    const categoryStats = await db
      .select({
        category: rawMaterials.category,
        count: sql<number>`COUNT(*)`
      })
      .from(rawMaterials)
      .groupBy(rawMaterials.category);
    
    const originStats = await db
      .select({
        origin: rawMaterials.origin,
        count: sql<number>`COUNT(*)`
      })
      .from(rawMaterials)
      .groupBy(rawMaterials.origin)
      .orderBy(desc(sql`COUNT(*)`))
      .limit(10);
    
    return {
      total: totalCount?.count || 0,
      byCategory: categoryStats,
      byOrigin: originStats
    };
  }),

  // Créer une nouvelle matière première
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
      origin: z.string().optional(),
      extractionMethod: z.string().optional(),
      description: z.string().optional(),
      olfactiveProfile: z.any().optional(),
      character: z.array(z.string()).optional(),
      volume: z.string().optional(),
      price: z.number().optional(),
      currency: z.string().optional(),
      container: z.string().optional(),
      supplier: z.string().optional(),
      certifications: z.array(z.string()).optional(),
      keyMolecules: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const [result] = await db.insert(rawMaterials).values({
        materialId: input.materialId,
        name: input.name,
        latinName: input.latinName,
        category: input.category,
        origin: input.origin,
        description: input.description,
        olfactiveProfile: input.olfactiveProfile,
        character: input.character,
        suppliers: input.supplier ? [{ name: input.supplier }] : undefined,
        usageNotes: input.keyMolecules?.length 
          ? `Molécules clés: ${input.keyMolecules.join(', ')}`
          : undefined,
      });
      
      return { success: true, id: result.insertId };
    }),

  // Rechercher des matières premières par molécule
  searchByMolecule: publicProcedure
    .input(z.object({ moleculeName: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      // Trouver la molécule
      const [molecule] = await db
        .select()
        .from(molecules)
        .where(like(molecules.name, `%${input.moleculeName}%`))
        .limit(1);
      
      if (!molecule) return [];
      
      // Trouver les matières premières contenant cette molécule
      const results = await db
        .select({
          rawMaterial: rawMaterials,
          percentage: rawMaterialMolecules.percentage,
          isSignature: rawMaterialMolecules.isSignature,
        })
        .from(rawMaterialMolecules)
        .innerJoin(rawMaterials, eq(rawMaterialMolecules.rawMaterialId, rawMaterials.id))
        .where(eq(rawMaterialMolecules.moleculeId, molecule.id))
        .orderBy(desc(rawMaterialMolecules.percentage));
      
      return results;
    }),

  // Récupérer les catégories disponibles
  getCategories: publicProcedure.query(async () => {
    const db = await getDb();
    const categories = await db
      .selectDistinct({ category: rawMaterials.category })
      .from(rawMaterials)
      .where(sql`${rawMaterials.category} IS NOT NULL`);
    
    return categories.map(c => c.category).filter(Boolean);
  }),

  // Récupérer les origines disponibles
  getOrigins: publicProcedure.query(async () => {
    const db = await getDb();
    const origins = await db
      .selectDistinct({ origin: rawMaterials.origin })
      .from(rawMaterials)
      .where(sql`${rawMaterials.origin} IS NOT NULL`);
    
    return origins.map(o => o.origin).filter(Boolean);
  }),

  // ============================================================================
  // INVENTORY ENTRIES (Entrées d'inventaire)
  // ============================================================================

  // Récupérer les entrées d'inventaire d'une matière première
  getInventory: publicProcedure
    .input(z.object({ rawMaterialId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const results = await db
        .select()
        .from(inventoryEntries)
        .where(eq(inventoryEntries.rawMaterialId, input.rawMaterialId))
        .orderBy(desc(inventoryEntries.purchaseDate));
      
      return results;
    }),

  // Récupérer toutes les entrées d'inventaire
  getAllInventory: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const results = await db
        .select({
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
      
      return results;
    }),

  // Ajouter une entrée d'inventaire
  addInventoryEntry: protectedProcedure
    .input(z.object({
      rawMaterialId: z.number(),
      purchaseDate: z.string(), // ISO date string
      supplierId: z.number().optional(),
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
      
      // Générer un ID unique pour l'entrée
      const [countResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(inventoryEntries);
      const entryId = `INV-${String((countResult?.count || 0) + 1).padStart(4, '0')}`;
      
      // Calculer le prix par unité
      const pricePerUnit = input.quantity > 0 ? input.price / input.quantity : 0;
      
      const [result] = await db.insert(inventoryEntries).values({
        entryId,
        rawMaterialId: input.rawMaterialId,
        purchaseDate: new Date(input.purchaseDate),
        supplierId: input.supplierId,
        supplierName: input.supplierName,
        quantity: String(input.quantity),
        unit: input.unit,
        remainingQuantity: String(input.quantity), // Initialement, tout le stock est disponible
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
      
      return { success: true, id: result.insertId, entryId };
    }),

  // Mettre à jour la quantité restante
  updateInventoryQuantity: protectedProcedure
    .input(z.object({
      entryId: z.number(),
      remainingQuantity: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db
        .update(inventoryEntries)
        .set({ remainingQuantity: String(input.remainingQuantity) })
        .where(eq(inventoryEntries.id, input.entryId));
      
      return { success: true };
    }),

  // Statistiques d'inventaire
  getInventoryStats: publicProcedure.query(async () => {
    const db = await getDb();
    
    // Nombre total d'entrées
    const [totalEntries] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(inventoryEntries);
    
    // Valeur totale du stock
    const [totalValue] = await db
      .select({ total: sql<number>`SUM(CAST(price AS DECIMAL(10,2)))` })
      .from(inventoryEntries);
    
    // Entrées récentes (30 derniers jours)
    const recentEntries = await db
      .select({
        entry: inventoryEntries,
        rawMaterial: {
          id: rawMaterials.id,
          name: rawMaterials.name,
        }
      })
      .from(inventoryEntries)
      .innerJoin(rawMaterials, eq(inventoryEntries.rawMaterialId, rawMaterials.id))
      .orderBy(desc(inventoryEntries.purchaseDate))
      .limit(5);
    
    return {
      totalEntries: totalEntries?.count || 0,
      totalValue: totalValue?.total || 0,
      recentEntries,
    };
  }),

  // Récupérer les spectres MS liés aux molécules d'une matière première
  getMsSpectra: publicProcedure
    .input(z.object({ rawMaterialId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      
      // Récupérer les molécules de la matière première
      const materialMolecules = await db
        .select({
          moleculeId: rawMaterialMolecules.moleculeId,
          percentage: rawMaterialMolecules.percentage,
          moleculeName: molecules.name,
          casNumber: molecules.casNumber,
        })
        .from(rawMaterialMolecules)
        .innerJoin(molecules, eq(rawMaterialMolecules.moleculeId, molecules.id))
        .where(eq(rawMaterialMolecules.rawMaterialId, input.rawMaterialId));
      
      if (materialMolecules.length === 0) {
        return { spectra: [], moleculesWithoutSpectra: [] };
      }
      
      // Chercher les spectres MS correspondants par nom de molécule ou CAS number
      const spectraResults: any[] = [];
      const moleculesWithoutSpectra: any[] = [];
      
      for (const mol of materialMolecules) {
        // Chercher par nom ou CAS avec SQL brut
        let spectra: any[] = [];
        
        if (mol.casNumber) {
          spectra = await db.execute(sql`
            SELECT * FROM ms_spectra 
            WHERE cas_number = ${mol.casNumber}
            LIMIT 1
          `);
        }
        
        if (spectra.length === 0 && mol.moleculeName) {
          spectra = await db.execute(sql`
            SELECT * FROM ms_spectra 
            WHERE compound_name LIKE ${`%${mol.moleculeName}%`}
            LIMIT 1
          `);
        }
        
        if (spectra.length > 0) {
          spectraResults.push({
            ...spectra[0],
            moleculeName: mol.moleculeName,
            percentage: mol.percentage,
          });
        } else {
          moleculesWithoutSpectra.push({
            name: mol.moleculeName,
            casNumber: mol.casNumber,
            percentage: mol.percentage,
          });
        }
      }
      
      return {
        spectra: spectraResults,
        moleculesWithoutSpectra,
      };
    }),
});

// Router pour les fournisseurs
export const suppliersRouter = router({
  // Récupérer tous les fournisseurs
  getAll: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      country: z.string().optional(),
      limit: z.number().optional().default(50),
    }).optional())
    .query(async ({ input }) => {
      const conditions = [];
      
      if (input?.search) {
        conditions.push(
          or(
            like(extendedSuppliers.name, `%${input.search}%`),
            like(extendedSuppliers.country, `%${input.search}%`)
          )
        );
      }
      
      if (input?.country) {
        conditions.push(eq(extendedSuppliers.country, input.country));
      }
      
      const db = await getDb();
      const results = await db
        .select()
        .from(extendedSuppliers)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(asc(extendedSuppliers.name))
        .limit(input?.limit || 50);
      
      return results;
    }),

  // Récupérer un fournisseur par ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [result] = await db
        .select()
        .from(extendedSuppliers)
        .where(eq(extendedSuppliers.id, input.id))
        .limit(1);
      
      return result || null;
    }),

  // Récupérer les matières d'un fournisseur
  getMaterials: publicProcedure
    .input(z.object({ supplierId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const results = await db
        .select()
        .from(extendedSupplierMaterials)
        .where(eq(extendedSupplierMaterials.supplierId, input.supplierId))
        .orderBy(asc(extendedSupplierMaterials.productName));
      
      return results;
    }),

  // Statistiques des fournisseurs
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    const [totalCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(extendedSuppliers);
    
    const countryStats = await db
      .select({
        country: extendedSuppliers.country,
        count: sql<number>`COUNT(*)`
      })
      .from(extendedSuppliers)
      .groupBy(extendedSuppliers.country)
      .orderBy(desc(sql`COUNT(*)`))
      .limit(10);
    
    const typeStats = await db
      .select({
        type: extendedSuppliers.supplierType,
        count: sql<number>`COUNT(*)`
      })
      .from(extendedSuppliers)
      .groupBy(extendedSuppliers.supplierType);
    
    return {
      total: totalCount?.count || 0,
      byCountry: countryStats,
      byType: typeStats
    };
  }),

  // Créer un nouveau fournisseur
  create: protectedProcedure
    .input(z.object({
      supplierId: z.string(),
      name: z.string(),
      legalName: z.string().optional(),
      supplierType: z.enum([
        "producer", "distiller", "trader", "cooperative",
        "laboratory", "broker", "other"
      ]),
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
      const [result] = await db.insert(extendedSuppliers).values({
        supplierId: input.supplierId,
        name: input.name,
        legalName: input.legalName,
        supplierType: input.supplierType,
        country: input.country,
        region: input.region,
        email: input.email,
        phone: input.phone,
        website: input.website,
        description: input.description,
        specialties: input.specialties,
        certifications: input.certifications,
      });
      
      return { success: true, id: result.insertId };
    }),
});
