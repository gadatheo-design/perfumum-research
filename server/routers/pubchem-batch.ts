import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const pubchemBatchRouter = router({
  // Enrichir une seule molécule
  enrichMolecule: protectedProcedure
    .input(z.object({
      moleculeId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const { enrichMoleculeWithTranslation, inferChemicalClass } = await import('../pubchem');
      
      // Récupérer la molécule
      const molecule = await db.getMoleculeById(input.moleculeId);
      if (!molecule) {
        throw new Error('Molécule non trouvée');
      }
      
      // Enrichir via PubChem avec traduction FR→EN
      const result = await enrichMoleculeWithTranslation(molecule.name);
      
      if (result.success) {
        // Mettre à jour la molécule
        const chemicalClass = inferChemicalClass(result.iupacName, result.molecularFormula);
        
        await db.updateMoleculeScientificData(input.moleculeId, {
          casNumber: result.casNumber || molecule.casNumber || undefined,
          iupacName: result.iupacName || molecule.iupacName || undefined,
          chemicalClass: (chemicalClass || molecule.chemicalClass || undefined) as any,
        });
        
        // Ajouter une référence PubChem
        const existingRefs = molecule.references || [];
        const pubchemRef = {
          title: `PubChem CID: ${result.pubchemCID}`,
          url: `https://pubchem.ncbi.nlm.nih.gov/compound/${result.pubchemCID}`,
          type: 'pubchem' as const,
        };
        
        // Éviter les doublons
        if (!existingRefs.some(r => r.type === 'pubchem' && r.url === pubchemRef.url)) {
          await db.updateMoleculeReferences(input.moleculeId, JSON.stringify([...existingRefs, pubchemRef]));
        }
      }
      
      return result;
    }),
  
  // Enrichir plusieurs molécules en lot
  enrichBatch: protectedProcedure
    .input(z.object({
      moleculeIds: z.array(z.number()),
    }))
    .mutation(async ({ input }) => {
      const { enrichMoleculeWithTranslation, inferChemicalClass } = await import('../pubchem');
      
      const results: Array<{
        moleculeId: number;
        moleculeName: string;
        success: boolean;
        casNumber?: string;
        iupacName?: string;
        error?: string;
      }> = [];
      
      for (const moleculeId of input.moleculeIds) {
        const molecule = await db.getMoleculeById(moleculeId);
        if (!molecule) {
          results.push({
            moleculeId,
            moleculeName: 'Inconnu',
            success: false,
            error: 'Molécule non trouvée',
          });
          continue;
        }
        
        const result = await enrichMoleculeWithTranslation(molecule.name);
        
        if (result.success) {
          const chemicalClass = inferChemicalClass(result.iupacName, result.molecularFormula);
          
          await db.updateMoleculeScientificData(moleculeId, {
            casNumber: result.casNumber || molecule.casNumber || undefined,
            iupacName: result.iupacName || molecule.iupacName || undefined,
            chemicalClass: (chemicalClass || molecule.chemicalClass || undefined) as any,
          });
          
          // Ajouter référence PubChem
          const existingRefs = molecule.references || [];
          if (result.pubchemCID && !existingRefs.some(r => r.type === 'pubchem')) {
            await db.updateMoleculeReferences(moleculeId, JSON.stringify([...existingRefs, {
              title: `PubChem CID: ${result.pubchemCID}`,
              url: `https://pubchem.ncbi.nlm.nih.gov/compound/${result.pubchemCID}`,
              type: 'pubchem' as const,
            }]));
          }
        }
        
        results.push({
          moleculeId,
          moleculeName: molecule.name,
          success: result.success,
          casNumber: result.casNumber,
          iupacName: result.iupacName,
          error: result.error,
        });
        
        // Délai pour respecter les limites de l'API
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      return {
        total: results.length,
        success: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
      };
    }),
  
  // Obtenir les molécules à enrichir
  getMoleculesToEnrich: publicProcedure
    .input(z.object({
      limit: z.number().default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const allMolecules = await db.getAllMolecules();
      
      // Filtrer les molécules sans CAS ou IUPAC
      const toEnrich = allMolecules.filter(m => 
        !m.casNumber || m.casNumber === '' || !m.iupacName || m.iupacName === ''
      );
      
      return {
        total: toEnrich.length,
        molecules: toEnrich.slice(input.offset, input.offset + input.limit),
      };
    }),
  
  // Statistiques d'enrichissement
  getEnrichmentStats: publicProcedure.query(async () => {
    const allMolecules = await db.getAllMolecules();
    
    // Helper pour parser les références (peut être string JSON ou tableau)
    const parseRefs = (refs: unknown): Array<Record<string,unknown>> => {
      if (!refs) return [];
      if (Array.isArray(refs)) return refs;
      if (typeof refs === 'string') {
        try {
          const parsed = JSON.parse(refs);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    };
    
    const stats = {
      total: allMolecules.length,
      withCAS: allMolecules.filter(m => m.casNumber && m.casNumber !== '').length,
      withIUPAC: allMolecules.filter(m => m.iupacName && m.iupacName !== '').length,
      withChemicalClass: allMolecules.filter(m => m.chemicalClass).length,
      withMolecularWeight: allMolecules.filter(m => m.molecularWeight).length,
      withBoilingPoint: allMolecules.filter(m => m.boilingPoint).length,
      withPubChemRef: allMolecules.filter(m => parseRefs(m.references).some((r: Record<string,unknown>) => r.type === 'pubchem')).length,
    };
    
    return {
      ...stats,
      missingCAS: stats.total - stats.withCAS,
      missingIUPAC: stats.total - stats.withIUPAC,
      completeness: stats.total > 0 ? Math.round((stats.withCAS + stats.withIUPAC) / (stats.total * 2) * 100) : 0,
    };
  }),
  
  // Mode batch automatique - obtenir toutes les molécules à enrichir
  getAllMoleculesToEnrich: publicProcedure.query(async () => {
    const allMolecules = await db.getAllMolecules();
    
    // Helper pour parser les références (peut être string JSON ou tableau)
    const parseRefs = (refs: unknown): Array<Record<string,unknown>> => {
      if (!refs) return [];
      if (Array.isArray(refs)) return refs;
      if (typeof refs === 'string') {
        try {
          const parsed = JSON.parse(refs);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    };
    
    // Filtrer les molécules sans CAS ou sans référence PubChem
    const toEnrich = allMolecules.filter(m => 
      !m.casNumber || m.casNumber === '' || !parseRefs(m.references).some((r: Record<string,unknown>) => r.type === 'pubchem')
    );
    
    return {
      total: toEnrich.length,
      molecules: toEnrich.map(m => ({
        id: m.id,
        name: m.name,
        hasCAS: !!(m.casNumber && m.casNumber !== ''),
        hasIUPAC: !!(m.iupacName && m.iupacName !== ''),
        hasPubChemRef: parseRefs(m.references).some((r: Record<string,unknown>) => r.type === 'pubchem'),
      })),
    };
  }),
  
  // Mode batch automatique - enrichir un lot avec progression
  enrichBatchAuto: protectedProcedure
    .input(z.object({
      batchSize: z.number().min(1).max(20).default(10),
      startIndex: z.number().min(0).default(0),
    }))
    .mutation(async ({ input }) => {
      const { enrichMoleculeWithTranslation, inferChemicalClass } = await import('../pubchem');
      
      const allMolecules = await db.getAllMolecules();
      
      // Filtrer les molécules sans CAS ou sans référence PubChem
      const toEnrich = allMolecules.filter(m => 
        !m.casNumber || m.casNumber === '' || !m.references?.some(r => r.type === 'pubchem')
      );
      
      // Prendre le lot demandé
      const batch = toEnrich.slice(input.startIndex, input.startIndex + input.batchSize);
      
      const results: Array<{
        moleculeId: number;
        moleculeName: string;
        success: boolean;
        casNumber?: string;
        iupacName?: string;
        error?: string;
      }> = [];
      
      for (const molecule of batch) {
        try {
          const result = await enrichMoleculeWithTranslation(molecule.name);
          
          if (result.success) {
            const chemicalClass = inferChemicalClass(result.iupacName, result.molecularFormula);
            
            await db.updateMoleculeScientificData(molecule.id, {
              casNumber: result.casNumber || molecule.casNumber || undefined,
              iupacName: result.iupacName || molecule.iupacName || undefined,
              chemicalClass: (chemicalClass || molecule.chemicalClass || undefined) as any,
            });
            
            // Ajouter référence PubChem
            const existingRefs = molecule.references || [];
            if (result.pubchemCID && !existingRefs.some(r => r.type === 'pubchem')) {
              await db.updateMoleculeReferences(molecule.id, JSON.stringify([...existingRefs, {
                title: `PubChem CID: ${result.pubchemCID}`,
                url: `https://pubchem.ncbi.nlm.nih.gov/compound/${result.pubchemCID}`,
                type: 'pubchem' as const,
              }]));
            }
          }
          
          results.push({
            moleculeId: molecule.id,
            moleculeName: molecule.name,
            success: result.success,
            casNumber: result.casNumber,
            iupacName: result.iupacName,
            error: result.error,
          });
        } catch (error: unknown) {
          results.push({
            moleculeId: molecule.id,
            moleculeName: molecule.name,
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
          });
        }
        
        // Délai pour respecter les limites de l'API PubChem (5 req/s)
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      
      return {
        batchIndex: input.startIndex,
        batchSize: batch.length,
        totalRemaining: toEnrich.length - input.startIndex - batch.length,
        totalToEnrich: toEnrich.length,
        processed: results.length,
        success: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        hasMore: input.startIndex + batch.length < toEnrich.length,
        nextStartIndex: input.startIndex + batch.length,
        results,
      };
    }),
});
