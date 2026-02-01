/**
 * Router tRPC pour l'enrichissement SMILES et CAS
 */

import { router, publicProcedure } from "../_core/trpc";
import { 
  previewSmilesAndCasEnrichment, 
  executeSmilesAndCasEnrichment,
  MOLECULE_REFERENCE_DATA 
} from "../smiles-cas-enrichment";

export const smilesEnrichmentRouter = router({
  // Prévisualiser l'enrichissement
  preview: publicProcedure.query(async () => {
    return previewSmilesAndCasEnrichment();
  }),
  
  // Exécuter l'enrichissement
  execute: publicProcedure.mutation(async () => {
    return executeSmilesAndCasEnrichment();
  }),
  
  // Obtenir les statistiques de la base de référence
  getReferenceStats: publicProcedure.query(async () => {
    const entries = Object.entries(MOLECULE_REFERENCE_DATA);
    const withCas = entries.filter(([_, data]) => data.cas).length;
    const withSmiles = entries.filter(([_, data]) => data.smiles).length;
    
    return {
      totalEntries: entries.length,
      withCas,
      withSmiles,
      uniqueMolecules: new Set(entries.map(([name]) => name.toLowerCase().replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u'))).size
    };
  })
});
