import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { rawMaterials, rawMaterialMolecules, molecules, extendedSuppliers, extendedSupplierMaterials } from "../../drizzle/schema";
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
