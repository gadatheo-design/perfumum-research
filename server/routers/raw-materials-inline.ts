import { z } from "zod";
import { getMysqlConnection } from "../db/mysqlPool";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const rawMaterialsInlineRouter = router({
  getAll: publicProcedure.query(async () => {
    return db.getAllRawMaterials();
  }),
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getRawMaterialById(input);
    }),
  getByMaterialId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getRawMaterialByMaterialId(input);
    }),
  getByCategory: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getRawMaterialsByCategory(input);
    }),
  getByPlant: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getRawMaterialsByPlant(input);
    }),
  getByTerroir: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getRawMaterialsByTerroir(input);
    }),
  getMolecules: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getRawMaterialMolecules(input);
    }),
  getDetail: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getRawMaterialDetail(input);
    }),
  create: protectedProcedure
    .input(z.object({
      materialId: z.string().min(1),
      name: z.string().min(1),
      latinName: z.string().optional(),
      category: z.enum(['huile_essentielle', 'absolue', 'concrete', 'resinoid', 'teinture', 'co2_extract', 'hydrolat', 'beurre', 'cire', 'oleoresine', 'infusion', 'maceration', 'distillat', 'accord_olfactif', 'molecule_isolee', 'matiere_animale', 'autre']),
      plantId: z.number().optional(),
      plantPart: z.enum(['fleur', 'feuille', 'tige', 'racine', 'ecorce', 'bois', 'resine', 'graine', 'fruit', 'zeste', 'plante_entiere', 'bourgeon', 'autre']).optional(),
      terroirId: z.number().optional(),
      originCountry: z.string().optional(),
      originRegion: z.string().optional(),
      extractionMethodId: z.number().optional(),
      extractionYield: z.string().optional(),
      extractionNotes: z.string().optional(),
      olfactiveFamily: z.enum(['floral', 'boise', 'agrume', 'epice', 'herbace', 'balsamique', 'musque', 'animal', 'vert', 'fruité', 'marin', 'terreux', 'fumé', 'gourmand', 'aromatique', 'autre']).optional(),
      olfactiveProfile: z.string().optional(),
      topNotes: z.string().optional(),
      heartNotes: z.string().optional(),
      baseNotes: z.string().optional(),
      intensity: z.number().optional(),
      tenacity: z.number().optional(),
      quality: z.enum(['conventionnel', 'bio', 'sauvage', 'biodynamique', 'aop', 'igp', 'fair_trade']).optional(),
      priceRange: z.enum(['economique', 'standard', 'premium', 'luxe', 'rare']).optional(),
      availability: z.enum(['disponible', 'saisonnier', 'rare', 'en_rupture', 'discontinue']).optional(),
      usageNotes: z.string().optional(),
      blendingTips: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createRawMaterial(input);
    }),
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        name: z.string().optional(),
        latinName: z.string().optional(),
        category: z.enum(['huile_essentielle', 'absolue', 'concrete', 'resinoid', 'teinture', 'co2_extract', 'hydrolat', 'beurre', 'cire', 'oleoresine', 'infusion', 'maceration', 'distillat', 'accord_olfactif', 'molecule_isolee', 'matiere_animale', 'autre']).optional(),
        plantId: z.number().nullable().optional(),
        plantPart: z.enum(['fleur', 'feuille', 'tige', 'racine', 'ecorce', 'bois', 'resine', 'graine', 'fruit', 'zeste', 'plante_entiere', 'bourgeon', 'autre']).optional(),
        terroirId: z.number().nullable().optional(),
        originCountry: z.string().optional(),
        originRegion: z.string().optional(),
        olfactiveFamily: z.string().optional(),
        olfactiveProfile: z.string().optional(),
        quality: z.string().optional(),
        availability: z.string().optional(),
        priceRange: z.string().optional(),
        topNotes: z.string().optional(),
        heartNotes: z.string().optional(),
        baseNotes: z.string().optional(),
        extractionYield: z.string().optional(),
        notes: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return db.updateRawMaterial(input.id, input.data as any);
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteRawMaterial(input);
      return { success: true };
    }),
  addMolecule: protectedProcedure
    .input(z.object({
      rawMaterialId: z.number(),
      moleculeId: z.number(),
      percentage: z.string().optional(),
      isSignature: z.number().optional(),
      variability: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.addMoleculeToRawMaterial(input);
    }),
  removeMolecule: protectedProcedure
    .input(z.object({
      rawMaterialId: z.number(),
      moleculeId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.removeMoleculeFromRawMaterial(input.rawMaterialId, input.moleculeId);
      return { success: true };
    }),
  getFiltered: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      category: z.string().optional(),
      categories: z.array(z.string()).optional(),
      olfactiveFamily: z.string().optional(),
      quality: z.string().optional(),
      availability: z.string().optional(),
      priceRange: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(24),
    }))
    .query(async ({ input }) => {
      return db.getRawMaterialsFiltered(input);
    }),
  getStats: publicProcedure
    .query(async () => {
      return db.getRawMaterialsStats();
    }),
  // Liaisons directes recette <-> matière première
  getRecettes: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getRecettesForRawMaterial(input);
    }),
  addRecette: protectedProcedure
    .input(z.object({
      recetteId: z.number(),
      rawMaterialId: z.number(),
      role: z.enum(['base', 'coeur', 'tete', 'fixateur', 'modificateur', 'autre']).optional(),
      dosage: z.string().optional(),
      dosageUnit: z.string().optional(),
      percentage: z.string().optional(),
      notes: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.addRecetteRawMaterial(input);
    }),
  removeRecette: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.removeRecetteRawMaterial(input);
    }),

  // ---- Enrichissement IA par lot ----
  getBatchEnrichStats: publicProcedure.query(async () => {
    const { createConnection: _ccRmStats } = await import('mysql2/promise');
    const _connRmStats = await _ccRmStats(process.env.DATABASE_URL!);
    const [rows] = await _connRmStats.query(
      `SELECT COUNT(*) as total, SUM(CASE WHEN (notes IS NULL OR notes = '') THEN 1 ELSE 0 END) as missingDescription, SUM(CASE WHEN (olfactive_profile IS NULL OR olfactive_profile = '') THEN 1 ELSE 0 END) as missingOlfactiveNotes, SUM(CASE WHEN (usage_notes IS NULL OR usage_notes = '') THEN 1 ELSE 0 END) as missingUsages FROM raw_materials`
    );
    await _connRmStats.end();
    const r = (rows as Record<string, unknown>[])[0];
    return {
      total: Number(r.total),
      missingDescription: Number(r.missingDescription),
      missingOlfactiveNotes: Number(r.missingOlfactiveNotes),
      missingUsages: Number(r.missingUsages),
    };
  }),

  getForBatchEnrich: publicProcedure
    .input(z.object({
      filter: z.enum(['all', 'missingDescription', 'missingOlfactiveNotes', 'missingUsages']).default('missingDescription'),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      let where = '1=1';
      if (input.filter === 'missingDescription') where = "(notes IS NULL OR notes = '')";
      if (input.filter === 'missingOlfactiveNotes') where = "(olfactive_profile IS NULL OR olfactive_profile = '')";
      if (input.filter === 'missingUsages') where = "(usage_notes IS NULL OR usage_notes = '')";
      const conn = await getMysqlConnection();
      const limit = Number(input.limit);
      const offset = Number(input.offset);
      const [rows] = await conn.query(`SELECT id, name, category, olfactive_family FROM raw_materials WHERE ${where} ORDER BY name LIMIT ${limit} OFFSET ${offset}`);
      const [countRows] = await conn.query(`SELECT COUNT(*) as total FROM raw_materials WHERE ${where}`);
      await conn.end();
      return {
        materials: (rows as Record<string,unknown>[]),
        total: Number((countRows as Record<string, unknown>[])[0]?.total ?? 0),
      };
    }),
  getThermalMatrix: publicProcedure.query(async () => {
    const { createConnection: _ccThermal } = await import('mysql2/promise');
    const _connThermal = await _ccThermal(process.env.DATABASE_URL!);
    const [rows] = await _connThermal.query(
      `SELECT id, name, material_id,
        thermal_tri, thermal_sai, thermal_hpi,
        thermal_volatility, thermal_survival, thermal_transformation,
        thermal_smoke_harmony, thermal_irritant_risk,
        thermal_fate, thermal_best_mode, thermal_constellation,
        absorbe_behavior_water, absorbe_behavior_fat, absorbe_key_metrics
      FROM raw_materials
      WHERE thermal_tri IS NOT NULL
      ORDER BY thermal_tri DESC, thermal_sai DESC`
    );
    await _connThermal.end();
    return rows as Record<string, unknown>[];
  }),
});
