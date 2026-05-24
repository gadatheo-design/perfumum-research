import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";
import { eq, or, lt } from "drizzle-orm";
import { withCache, CACHE_KEYS, CACHE_TTL, invalidateMoleculeCache } from "../cache";
import { families, molecules } from "../../drizzle/schema";

export const moleculesRouter = router({
    list: publicProcedure.query(async () => {
      return await withCache(
        CACHE_KEYS.MOLECULES_LIST,
        () => db.getAllMolecules(),
        CACHE_TTL.MEDIUM
      );
    }),
    
    getSimilar: publicProcedure
      .input(z.object({
        id: z.number(),
        limit: z.number().default(3),
      }))
      .query(async ({ input }) => {
        return await db.getSimilarMolecules(input.id, input.limit);
      }),
    
    getUsageStats: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getMoleculeUsageStats(input);
      }),
    getGlobalStats: publicProcedure.query(async () => {
      return await db.getGlobalMoleculeStats();
    }),
    getTimelineData: publicProcedure.query(async () => {
      return await db.getMoleculeTimelineData();
    }),
    getById: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "number") throw new Error("Expected number");
        return val;
      })
      .query(async ({ input }) => {
        return await withCache(
          CACHE_KEYS.MOLECULE_DETAIL(input),
          () => db.getMoleculeById(input),
          CACHE_TTL.MEDIUM
        );
      }),
    create: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null) throw new Error("Expected object");
        return val as unknown;
      })
      .mutation(async ({ input }) => {
        const result = await db.createMolecule(input as Record<string, unknown>);
        invalidateMoleculeCache(); // Invalider le cache après création
        return result;
      }),
    updateRadar: publicProcedure
      .input(z.object({
        id: z.number(),
        radarIntensity: z.number().min(0).max(100),
        radarFreshness: z.number().min(0).max(100),
        radarWarmth: z.number().min(0).max(100),
        radarSweetness: z.number().min(0).max(100),
        radarSpiciness: z.number().min(0).max(100),
        radarEarthiness: z.number().min(0).max(100),
      }))
      .mutation(async ({ input }) => {
        const result = await db.updateMoleculeRadar(input);
        invalidateMoleculeCache(input.id); // Invalider le cache molécule
        invalidateRadarCache(); // Invalider le cache radar (profils recettes affectés)
        return result;
      }),
    // Recherche de molécules par nom
    search: publicProcedure
      .input(z.object({
        query: z.string(),
        limit: z.number().default(10),
      }))
      .query(async ({ input }) => {
        const allMolecules = await db.getAllMolecules();
        const queryLower = input.query.toLowerCase();
        // Recherche par nom (correspondance partielle)
        const matches = allMolecules.filter(m => 
          m.name.toLowerCase().includes(queryLower) ||
          (m.chemicalFormula && m.chemicalFormula.toLowerCase().includes(queryLower))
        ).slice(0, input.limit);
        return { molecules: matches, total: matches.length };
      }),
    // Molécules osmothèque (historiques avec statut réglementaire)
    getOsmotheque: publicProcedure
      .input(z.object({
        status: z.enum(['all', 'restricted', 'banned', 'regulated']).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional())
      .query(async ({ input }) => {
        const allMolecules = await db.getAllMolecules();
        // Filtrer les molécules osmothèque (celles avec [OSMOTHÈQUE] dans les notes)
        let osmoMolecules = allMolecules.filter(m => 
          m.notes && m.notes.includes('[OSMOTHÈQUE')
        );
        
        // Extraire le statut réglementaire des notes
        osmoMolecules = osmoMolecules.map(m => {
          const statusMatch = m.notes?.match(/\[OSMOTHÈQUE - Statut réglementaire: ([^\]]+)\]/);
          const regulatoryStatus = statusMatch ? statusMatch[1] : 'unknown';
          return { ...m, regulatoryStatus };
        });
        
        // Filtrer par statut si spécifié
        const { status, limit = 50, offset = 0 } = input || {};
        if (status && status !== 'all') {
          osmoMolecules = osmoMolecules.filter(m => {
            const rs = String((m as Record<string, unknown>).regulatoryStatus ?? '').toLowerCase();
            if (status === 'restricted') return rs.includes('restreint') || rs.includes('restricted');
            if (status === 'banned') return rs.includes('interdit') || rs.includes('banned');
            if (status === 'regulated') return rs.includes('réglementé') || rs.includes('regulated');
            return true;
          });
        }
        
        const total = osmoMolecules.length;
        const paginatedMolecules = osmoMolecules.slice(offset, offset + limit);
        
        return {
          molecules: paginatedMolecules,
          total,
          limit,
          offset,
        };
      }),
    // Suggestions par profil radar
    getSuggestionsByRadar: publicProcedure
      .input(z.object({
        radarIntensity: z.number().min(0).max(100),
        radarFreshness: z.number().min(0).max(100),
        radarWarmth: z.number().min(0).max(100),
        radarSweetness: z.number().min(0).max(100),
        radarSpiciness: z.number().min(0).max(100),
        radarEarthiness: z.number().min(0).max(100),
        limit: z.number().min(1).max(50).default(10),
      }))
      .query(async ({ input }) => {
        const allMolecules = await db.getAllMolecules();
        
        // Calculer la distance euclidienne pour chaque molécule
        const moleculesWithScore = allMolecules.map(m => {
          const diff1 = (m.radarIntensity || 50) - input.radarIntensity;
          const diff2 = (m.radarFreshness || 50) - input.radarFreshness;
          const diff3 = (m.radarWarmth || 50) - input.radarWarmth;
          const diff4 = (m.radarSweetness || 50) - input.radarSweetness;
          const diff5 = (m.radarSpiciness || 50) - input.radarSpiciness;
          const diff6 = (m.radarEarthiness || 50) - input.radarEarthiness;
          
          const distance = Math.sqrt(
            diff1 * diff1 +
            diff2 * diff2 +
            diff3 * diff3 +
            diff4 * diff4 +
            diff5 * diff5 +
            diff6 * diff6
          );
          
          // Distance maximale théorique : sqrt(6 * 100^2) = ~244.95
          // Score de compatibilité : 100% si distance = 0, 0% si distance = 244.95
          const maxDistance = Math.sqrt(6 * 100 * 100);
          const compatibilityScore = Math.round((1 - distance / maxDistance) * 100);
          
          return {
            ...m,
            compatibilityScore,
          };
        });
        
        // Trier par score décroissant et limiter
        const sorted = moleculesWithScore
          .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
          .slice(0, input.limit);
        
        return sorted;
      }),
    updateReferences: publicProcedure
      .input(z.object({
        id: z.number(),
        references: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateMoleculeReferences(input.id, input.references);
      }),
    
    // Appliquer la classification IA directement en base
    applyAIClassification: protectedProcedure
      .input(z.object({
        moleculeId: z.number(),
        chemicalClass: z.string().optional(),
        olfactiveFamily: z.string().optional(),
        olfactiveProfile: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { moleculeId, chemicalClass, olfactiveFamily, olfactiveProfile } = input;
        const dbConn = await db.getDb();
        if (!dbConn) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        const { molecules: moleculesTable } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        const updateData: Record<string, string> = {};
        if (chemicalClass !== undefined) updateData.chemicalClass = chemicalClass;
        if (olfactiveFamily !== undefined) updateData.family = olfactiveFamily;
        if (olfactiveProfile !== undefined) updateData.olfactiveProfile = olfactiveProfile;
        if (Object.keys(updateData).length === 0) return { success: false, message: 'Aucun champ à mettre à jour' };
        await dbConn.update(moleculesTable).set(updateData).where(eq(moleculesTable.id, moleculeId));
        invalidateMoleculeCache(moleculeId);
        return { success: true, updatedFields: Object.keys(updateData) };
      }),

    // Appliquer les notes du chercheur IA
    applyAINotes: protectedProcedure
      .input(z.object({
        moleculeId: z.number(),
        researcherNotes: z.string(),
        appendMode: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const { moleculeId, researcherNotes, appendMode } = input;
        const dbConn = await db.getDb();
        if (!dbConn) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        const { molecules: moleculesTable } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        let finalNotes = researcherNotes;
        if (appendMode) {
          const [existing] = await dbConn.select({ notes: moleculesTable.notes }).from(moleculesTable).where(eq(moleculesTable.id, moleculeId));
          if (existing?.notes) {
            finalNotes = existing.notes + '\n\n--- Notes IA ---\n' + researcherNotes;
          }
        }
        await dbConn.update(moleculesTable).set({ notes: finalNotes }).where(eq(moleculesTable.id, moleculeId));
        invalidateMoleculeCache(moleculeId);
        return { success: true, notes: finalNotes };
      }),

    // Liaison molécules-recettes
    linkToRecette: publicProcedure
      .input(z.object({
        recetteId: z.number(),
        molecules: z.array(z.object({
          moleculeId: z.number(),
          proportion: z.number(),
          role: z.enum(["tête", "cœur", "fond"]),
        })),
      }))
      .mutation(async ({ input }) => {
        return await db.linkMoleculesToRecette(input.recetteId, input.molecules);
      }),
    
    getByRecette: publicProcedure
      .input(z.object({
        recetteId: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getMoleculesByRecette(input.recetteId);
      }),
    
    getAll: publicProcedure.query(async () => {
      return await db.getAllMolecules();
    }),
    
    // Recherche de molécules par nom (pour la page /recherche-molecule)
    searchByName: publicProcedure
      .input(z.object({ name: z.string() }))
      .query(async ({ input }) => {
        return await db.searchMoleculesByName(input.name);
      }),
    
    // Récupérer une molécule par son nom exact (pour les badges dominant_molecules)
    getByName: publicProcedure
      .input(z.object({ name: z.string().min(1) }))
      .query(async ({ input }) => {
        return await db.getMoleculeByName(input.name);
      }),
    
    // Récupérer les plantes contenant une molécule spécifique
    getPlantsByMolecule: publicProcedure
      .input(z.object({ moleculeId: z.number() }))
      .query(async ({ input }) => {
        return await db.getPlantsByMolecule(input.moleculeId);
      }),
    
    // Audit des liaisons molécule-recette
    getRecetteAuditStats: publicProcedure.query(async () => {
      return db.getMoleculeRecetteAuditStats();
    }),
    
    // Toutes les relations avec noms
    getAllRecetteRelationsWithNames: publicProcedure.query(async () => {
      return db.getAllMoleculeRecetteRelationsWithNames();
    }),
    
    // Suggestions de liaisons
    getRecetteSuggestions: publicProcedure.query(async () => {
      return db.suggestMoleculeRecetteLinks();
    }),
    
    // Import en masse depuis CSV
    bulkImportRecettes: protectedProcedure
      .input(z.array(z.object({
        moleculeId: z.number().optional(),
        moleculeName: z.string().optional(),
        recetteId: z.number().optional(),
        recetteName: z.string().optional(),
        proportion: z.number().optional(),
        role: z.string().optional(),
        notes: z.string().optional(),
      })))
      .mutation(async ({ input }) => {
        return db.bulkImportMoleculeRecettes(input);
      }),
    
    // Création de liaisons multiples (drag-drop)
    createMultipleRecettes: protectedProcedure
      .input(z.array(z.object({
        moleculeId: z.number(),
        recetteId: z.number(),
        proportion: z.number().optional(),
        role: z.string().optional(),
        notes: z.string().optional(),
      })))
      .mutation(async ({ input }) => {
        return db.createMultipleMoleculeRecettes(input);
      }),
    
    // Gènes TPS (Terpene Synthases) associés à une molécule
    getTpsGenes: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getTpsGenesByMolecule(input);
      }),
    
    // Transformations pyrolytiques d'une molécule
    getPyrolysisTransformations: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getPyrolysisTransformationsByMolecule(input);
      }),
    
    // Produits de pyrolyse d'une molécule
    getPyrolysisProducts: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getPyrolysisTransformationsByProduct(input);
      }),
    
    // Liste des molécules avec SMILES pour visualisation
    listWithSmiles: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        chemicalClass: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }))
      .query(async ({ input }) => {
        return await db.getMoleculesWithSmiles(input);
      }),
    
    // Liste des classes chimiques disponibles
    listChemicalClasses: publicProcedure.query(async () => {
      return await db.getChemicalClasses();
    }),
    
    // Statistiques SMILES
    getSmilesStats: publicProcedure.query(async () => {
      return await db.getSmilesStats();
    }),
    
    // Enrichissement individuel via PubChem
    enrichFromPubChem: protectedProcedure
      .input(z.object({
        moleculeId: z.number(),
      }))
      .mutation(async ({ input }) => {
        return await db.enrichMoleculeFromPubChemWithTranslation(input.moleculeId);
      }),
    
    // Statistiques d'enrichissement PubChem
    getEnrichmentStats: publicProcedure.query(async () => {
      return await db.getPubChemEnrichmentStats();
    }),
    
    // Molécules non enrichies
    getUnenriched: publicProcedure
      .input(z.object({ limit: z.number().optional().default(50) }))
      .query(async ({ input }) => {
        return await db.getUnenrichedMolecules(input.limit);
      }),
    
    // Enrichissement ChEBI (alternative à PubChem)
    enrichFromChEBI: protectedProcedure
      .input(z.object({ moleculeId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.enrichMoleculeFromChEBIWithTranslation(input.moleculeId);
      }),
    
    // Molécules non enrichies pour ChEBI
    getUnenrichedForChEBI: publicProcedure
      .input(z.object({ limit: z.number().optional().default(50) }))
      .query(async ({ input }) => {
        return await db.getUnenrichedMoleculesForChEBI(input.limit);
      }),
    
    // Enrichissement COCONUT (produits naturels)
    enrichFromCOCONUT: protectedProcedure
      .input(z.object({ moleculeId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.enrichMoleculeFromCOCONUTWithTranslation(input.moleculeId);
      }),
    
    // Molécules non enrichies pour COCONUT
    getUnenrichedForCOCONUT: publicProcedure
      .input(z.object({ limit: z.number().optional().default(50) }))
      .query(async ({ input }) => {
        return await db.getUnenrichedMoleculesForCOCONUT(input.limit);
      }),
    
    // Statistiques d'enrichissement COCONUT
    getCOCONUTEnrichmentStats: publicProcedure
      .query(async () => {
        return await db.getCOCONUTEnrichmentStats();
      }),

    // Parfums emblématiques d'une molécule
    getPerfumes: publicProcedure
      .input(z.object({ moleculeId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMoleculePerfumes(input.moleculeId);
      }),

    // Toutes les liaisons parfums (navigation inverse)
    getAllPerfumeLinks: publicProcedure.query(async () => {
      return await db.getAllMoleculePerfumeLinks();
    }),

    // Toutes les transformations pyrolytiques avec filtre optionnel
    listAllPyrolysis: publicProcedure
      .input(z.object({
        mechanism: z.string().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const all = await db.getAllPyrolysisTransformations();
        if (!input) return all;
        let result = all as Record<string, unknown>[];
        if (input.mechanism) {
          result = result.filter((t: Record<string, unknown>) =>
            String(t.mechanism ?? '').toLowerCase().includes(input.mechanism!.toLowerCase())
          );
        }
        if (input.search) {
          const q = input.search.toLowerCase();
          result = result.filter((t: Record<string, unknown>) =>
            String(t.source_molecule ?? '').toLowerCase().includes(q) ||
            String(t.product_molecule ?? '').toLowerCase().includes(q) ||
            String(t.notes ?? '').toLowerCase().includes(q)
          );
        }
        return result;
      }),

    // ---- Enrichissement IA par lot ----
    getBatchEnrichStats: publicProcedure.query(async () => {
      const db2 = await db.getDb();
      const [rows] = await (db2 as unknown as { execute: (q: unknown) => Promise<[Record<string, unknown>[], unknown]> }).execute(
        `SELECT COUNT(*) as total, SUM(CASE WHEN (iupac_name IS NULL OR iupac_name = '') THEN 1 ELSE 0 END) as missingIupac, SUM(CASE WHEN (olfactiveProfile IS NULL OR olfactiveProfile = '') THEN 1 ELSE 0 END) as missingOlfactive, SUM(CASE WHEN (therapeuticProperties IS NULL OR therapeuticProperties = '') THEN 1 ELSE 0 END) as missingTherapeutic, SUM(CASE WHEN (family IS NULL OR family = '') THEN 1 ELSE 0 END) as missingFamily FROM molecules`
      );
      const row = rows[0] as Record<string,unknown>;
      return { total: Number(row.total), missingIupac: Number(row.missingIupac), missingOlfactive: Number(row.missingOlfactive), missingTherapeutic: Number(row.missingTherapeutic), missingFamily: Number(row.missingFamily) };
    }),

    getForBatchEnrich: publicProcedure.input(z.object({ filter: z.enum(["missingIupac","missingOlfactive","missingTherapeutic","missingFamily","all"]), limit: z.number().min(1).max(50).default(10), offset: z.number().min(0).default(0) })).query(async ({ input }) => {
      const db2 = await db.getDb();
      let where = '1=1';
      if (input.filter === 'missingIupac') where = "(iupac_name IS NULL OR iupac_name = '')";
      if (input.filter === 'missingOlfactive') where = "(olfactiveProfile IS NULL OR olfactiveProfile = '')";
      if (input.filter === 'missingTherapeutic') where = "(therapeuticProperties IS NULL OR therapeuticProperties = '')";
      if (input.filter === 'missingFamily') where = "(family IS NULL OR family = '')";
      const [rows] = await (db2 as unknown as { execute: (q: unknown) => Promise<[Record<string, unknown>[], unknown]> }).execute(`SELECT id, name, formula, family, iupac_name, cas_number, olfactiveProfile, therapeuticProperties FROM molecules WHERE ${where} ORDER BY name LIMIT ${input.limit} OFFSET ${input.offset}`);
      return rows as Record<string, unknown>[];
    }),

    // Synergies moléculaires : co-occurrences dans les recettes PERFUMUM
    getSynergies: publicProcedure
      .input(z.object({
        moleculeId: z.number(),
        limit: z.number().min(1).max(20).default(10),
      }))
      .query(async ({ input }) => {
        const mysql2 = await import('mysql2/promise');
        const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
        const [rows] = await conn.query(`
          SELECT 
            m2.id, m2.name, m2.family, m2.chemicalFamily,
            m2.cas_number, m2.pubchem_cid,
            COUNT(*) as co_occurrences,
            GROUP_CONCAT(DISTINCT r.name ORDER BY r.name SEPARATOR ', ') as recettes
          FROM recette_molecules rm1
          JOIN recette_molecules rm2 ON rm1.recette_id = rm2.recette_id AND rm2.molecule_id != rm1.molecule_id
          JOIN molecules m2 ON rm2.molecule_id = m2.id
          JOIN recettes r ON rm1.recette_id = r.id
          WHERE rm1.molecule_id = ?
          GROUP BY m2.id, m2.name, m2.family, m2.chemicalFamily, m2.cas_number, m2.pubchem_cid
          ORDER BY co_occurrences DESC
          LIMIT ?
        `, [input.moleculeId, input.limit]);
        await conn.end();
        return (rows as Record<string, unknown>[]).map(r => ({
          id: Number(r.id),
          name: r.name as string,
          family: r.family as string,
          chemicalFamily: r.chemicalFamily as string | null,
          cas_number: r.cas_number as string | null,
          pubchem_cid: r.pubchem_cid ? Number(r.pubchem_cid) : null,
          co_occurrences: Number(r.co_occurrences),
          recettes: r.recettes as string,
        }));
      }),

    getByFamily: publicProcedure
      .input(z.object({
        families: z.array(z.string()),
        limit: z.number().min(1).max(100).default(30),
      }))
      .query(async ({ input }) => {
        const mysql2 = await import('mysql2/promise');
        const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
        const placeholders = input.families.map(() => '?').join(', ');
        const likeConditions = input.families.map(() => 'LOWER(family) LIKE ?').join(' OR ');
        const likeParams = input.families.flatMap(f => [`%${f.toLowerCase()}%`]);
        const [rows] = await conn.query(`
          SELECT id, name, family, chemicalFamily, cas_number, pubchem_cid, chebi_id,
                 iupac_name, smiles, olfactiveProfile, therapeuticProperties
          FROM molecules
          WHERE ${likeConditions}
          ORDER BY name ASC
          LIMIT ?
        `, [...likeParams, input.limit]);
        await conn.end();
        return (rows as Record<string, unknown>[]).map(r => ({
          id: Number(r.id),
          name: r.name as string,
          family: r.family as string | null,
          chemicalFamily: r.chemicalFamily as string | null,
          cas_number: r.cas_number as string | null,
          pubchem_cid: r.pubchem_cid ? Number(r.pubchem_cid) : null,
          chebi_id: r.chebi_id as string | null,
          iupac_name: r.iupac_name as string | null,
          smiles: r.smiles as string | null,
        }));
      }),

});
