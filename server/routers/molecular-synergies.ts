/**
 * Router tRPC pour les synergies moléculaires
 */
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { 
  getAllSynergies, 
  getSynergiesByType, 
  getSynergiesForMolecule,
  getSynergiesByCAS,
  getSynergyStats,
  searchSynergies,
  type SynergyType
} from "../molecular-synergies-service";
import { getDb } from "../db";
import { moleculeSynergies, molecules } from "../../drizzle/schema";
import { eq, or, sql, and, inArray } from "drizzle-orm";

export const molecularSynergiesRouter = router({
  // Obtenir toutes les synergies de la base locale
  getAll: publicProcedure.query(() => {
    return getAllSynergies();
  }),
  
  // Obtenir les synergies par type
  getByType: publicProcedure
    .input(z.object({
      type: z.enum(['masquage', 'neutralisation', 'potentialisation', 'stabilisation', 'transformation'])
    }))
    .query(({ input }) => {
      return getSynergiesByType(input.type as SynergyType);
    }),
  
  // Obtenir les synergies pour une molécule
  getForMolecule: publicProcedure
    .input(z.object({
      moleculeName: z.string()
    }))
    .query(({ input }) => {
      return getSynergiesForMolecule(input.moleculeName);
    }),
  
  // Obtenir les synergies par numéro CAS
  getByCAS: publicProcedure
    .input(z.object({
      casNumber: z.string()
    }))
    .query(({ input }) => {
      return getSynergiesByCAS(input.casNumber);
    }),
  
  // Obtenir les statistiques
  getStats: publicProcedure.query(() => {
    return getSynergyStats();
  }),
  
  // Rechercher des synergies
  search: publicProcedure
    .input(z.object({
      keyword: z.string()
    }))
    .query(({ input }) => {
      return searchSynergies(input.keyword);
    }),
  
  // Obtenir les synergies depuis la base de données
  getFromDatabase: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    const synergies = await db
      .select({
        id: moleculeSynergies.id,
        molecule1Id: moleculeSynergies.molecule1Id,
        molecule2Id: moleculeSynergies.molecule2Id,
        type: moleculeSynergies.type,
        description: moleculeSynergies.description,
        chemicalMechanism: moleculeSynergies.chemicalMechanism,
        applications: moleculeSynergies.applications,
        createdAt: moleculeSynergies.createdAt
      })
      .from(moleculeSynergies);
    
    return synergies;
  }),
  
  // Obtenir les synergies avec les noms des molécules
  getWithMoleculeNames: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    // Récupérer toutes les synergies
    const synergies = await db
      .select()
      .from(moleculeSynergies);
    
    // Récupérer les IDs uniques des molécules
    const moleculeIds = new Set<number>();
    synergies.forEach(s => {
      moleculeIds.add(s.molecule1Id);
      moleculeIds.add(s.molecule2Id);
    });
    
    if (moleculeIds.size === 0) return [];
    
    // Récupérer les noms des molécules
    const moleculeList = await db
      .select({
        id: molecules.id,
        name: molecules.name,
        casNumber: molecules.casNumber
      })
      .from(molecules)
      .where(inArray(molecules.id, Array.from(moleculeIds)));
    
    // Créer un map pour accès rapide
    const moleculeMap = new Map(moleculeList.map(m => [m.id, m]));
    
    // Combiner les données
    return synergies.map(s => ({
      ...s,
      molecule1Name: moleculeMap.get(s.molecule1Id)?.name || 'Unknown',
      molecule1CAS: moleculeMap.get(s.molecule1Id)?.casNumber,
      molecule2Name: moleculeMap.get(s.molecule2Id)?.name || 'Unknown',
      molecule2CAS: moleculeMap.get(s.molecule2Id)?.casNumber
    }));
  }),
  
  // Importer les synergies locales dans la base de données
  importToDatabase: protectedProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) return { success: false, message: 'Database not available' };
    
    const localSynergies = getAllSynergies();
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];
    
    for (const synergy of localSynergies) {
      try {
        // Trouver molecule1 par nom ou CAS
        let molecule1 = null;
        if (synergy.molecule1CAS) {
          const result = await db
            .select({ id: molecules.id })
            .from(molecules)
            .where(eq(molecules.casNumber, synergy.molecule1CAS))
            .limit(1);
          molecule1 = result[0];
        }
        if (!molecule1) {
          const result = await db
            .select({ id: molecules.id })
            .from(molecules)
            .where(sql`LOWER(${molecules.name}) = LOWER(${synergy.molecule1Name})`)
            .limit(1);
          molecule1 = result[0];
        }
        
        // Trouver molecule2 par nom ou CAS
        let molecule2 = null;
        if (synergy.molecule2CAS) {
          const result = await db
            .select({ id: molecules.id })
            .from(molecules)
            .where(eq(molecules.casNumber, synergy.molecule2CAS))
            .limit(1);
          molecule2 = result[0];
        }
        if (!molecule2) {
          const result = await db
            .select({ id: molecules.id })
            .from(molecules)
            .where(sql`LOWER(${molecules.name}) = LOWER(${synergy.molecule2Name})`)
            .limit(1);
          molecule2 = result[0];
        }
        
        if (!molecule1 || !molecule2) {
          skipped++;
          continue;
        }
        
        // Vérifier si la synergie existe déjà
        const existing = await db
          .select({ id: moleculeSynergies.id })
          .from(moleculeSynergies)
          .where(and(
            eq(moleculeSynergies.molecule1Id, molecule1.id),
            eq(moleculeSynergies.molecule2Id, molecule2.id)
          ))
          .limit(1);
        
        if (existing.length > 0) {
          skipped++;
          continue;
        }
        
        // Insérer la synergie
        await db.insert(moleculeSynergies).values({
          molecule1Id: molecule1.id,
          molecule2Id: molecule2.id,
          type: synergy.type,
          description: synergy.description,
          chemicalMechanism: synergy.chemicalMechanism || null,
          applications: synergy.applications || null
        });
        
        imported++;
      } catch (error) {
        errors.push(`Error importing ${synergy.molecule1Name} + ${synergy.molecule2Name}: ${error}`);
      }
    }
    
    return {
      success: true,
      imported,
      skipped,
      total: localSynergies.length,
      errors: errors.slice(0, 10) // Limiter les erreurs retournées
    };
  }),
  
  // Obtenir la matrice de synergies pour la heatmap
  getSynergyMatrix: publicProcedure
    .input(z.object({
      moleculeIds: z.array(z.number()).optional(),
      limit: z.number().default(50)
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { molecules: [], synergies: [] };
      
      // Si des IDs sont fournis, les utiliser; sinon prendre les plus populaires
      let targetMoleculeIds: number[];
      
      if (input.moleculeIds && input.moleculeIds.length > 0) {
        targetMoleculeIds = input.moleculeIds;
      } else {
        // Prendre les molécules les plus impliquées dans des synergies
        const popularMolecules = await db
          .select({
            moleculeId: moleculeSynergies.molecule1Id,
            count: sql<number>`COUNT(*)`
          })
          .from(moleculeSynergies)
          .groupBy(moleculeSynergies.molecule1Id)
          .orderBy(sql`COUNT(*) DESC`)
          .limit(input.limit);
        
        targetMoleculeIds = popularMolecules.map(m => m.moleculeId);
      }
      
      if (targetMoleculeIds.length === 0) {
        return { molecules: [], synergies: [] };
      }
      
      // Récupérer les infos des molécules
      const moleculeList = await db
        .select({
          id: molecules.id,
          name: molecules.name,
          casNumber: molecules.casNumber
        })
        .from(molecules)
        .where(inArray(molecules.id, targetMoleculeIds));
      
      // Récupérer les synergies entre ces molécules
      const synergies = await db
        .select()
        .from(moleculeSynergies)
        .where(and(
          inArray(moleculeSynergies.molecule1Id, targetMoleculeIds),
          inArray(moleculeSynergies.molecule2Id, targetMoleculeIds)
        ));
      
      return {
        molecules: moleculeList,
        synergies
      };
    })
});
