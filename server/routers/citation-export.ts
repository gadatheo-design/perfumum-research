import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const citationExportRouter = router({
  // Générer une citation pour une molécule
  generateMoleculeCitation: publicProcedure
    .input(z.object({
      moleculeId: z.number(),
      format: z.enum(['apa', 'chicago', 'bibtex']),
    }))
    .query(async ({ input }) => {
      const molecule = await db.getMoleculeById(input.moleculeId);
      if (!molecule) {
        throw new Error('Molécule non trouvée');
      }
      
      const currentYear = new Date().getFullYear();
      const accessDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      
      // Trouver la référence PubChem si elle existe
      const pubchemRef = molecule.references?.find(r => r.type === 'pubchem');
      const pubchemCID = pubchemRef?.url?.split('/').pop();
      
      let citation = '';
      
      switch (input.format) {
        case 'apa':
          if (pubchemCID) {
            citation = `National Center for Biotechnology Information (${currentYear}). PubChem Compound Summary for CID ${pubchemCID}, ${molecule.name}. Retrieved ${accessDate}, from https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}`;
          } else {
            citation = `${molecule.name}. (${currentYear}). In PERFUMUM Research Database. Retrieved ${accessDate}.`;
          }
          if (molecule.casNumber) {
            citation += ` CAS: ${molecule.casNumber}.`;
          }
          break;
          
        case 'chicago':
          if (pubchemCID) {
            citation = `National Center for Biotechnology Information. "PubChem Compound Summary for CID ${pubchemCID}, ${molecule.name}." PubChem. Accessed ${accessDate}. https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}.`;
          } else {
            citation = `"${molecule.name}." PERFUMUM Research Database. Accessed ${accessDate}.`;
          }
          if (molecule.casNumber) {
            citation += ` CAS Registry Number: ${molecule.casNumber}.`;
          }
          break;
          
        case 'bibtex':
          const key = molecule.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
          if (pubchemCID) {
            citation = `@misc{pubchem_${key},
  author = {{National Center for Biotechnology Information}},
  title = {PubChem Compound Summary for CID ${pubchemCID}, ${molecule.name}},
  year = {${currentYear}},
  url = {https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}},
  note = {Accessed: ${accessDate}${molecule.casNumber ? `, CAS: ${molecule.casNumber}` : ''}}
}`;
          } else {
            citation = `@misc{perfumum_${key},
  title = {${molecule.name}},
  year = {${currentYear}},
  howpublished = {PERFUMUM Research Database},
  note = {${molecule.casNumber ? `CAS: ${molecule.casNumber}, ` : ''}Accessed: ${accessDate}}
}`;
          }
          break;
      }
      
      return {
        citation,
        format: input.format,
        molecule: {
          id: molecule.id,
          name: molecule.name,
          casNumber: molecule.casNumber,
          iupacName: molecule.iupacName,
        },
      };
    }),
  
  // Générer une citation pour une recette
  generateRecetteCitation: publicProcedure
    .input(z.object({
      recetteId: z.number(),
      format: z.enum(['apa', 'chicago', 'bibtex']),
    }))
    .query(async ({ input }) => {
      const recette = await db.getRecetteById(input.recetteId);
      if (!recette) {
        throw new Error('Recette non trouvée');
      }
      
      const currentYear = new Date().getFullYear();
      const accessDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      const creationYear = recette.createdAt ? new Date(recette.createdAt).getFullYear() : currentYear;
      
      let citation = '';
      
      switch (input.format) {
        case 'apa':
          citation = `PERFUMUM Research. (${creationYear}). ${recette.name}. PERFUMUM Research Database. Retrieved ${accessDate}.`;
          break;
          
        case 'chicago':
          citation = `PERFUMUM Research. "${recette.name}." PERFUMUM Research Database, ${creationYear}. Accessed ${accessDate}.`;
          break;
          
        case 'bibtex':
          const key = recette.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
          citation = `@misc{perfumum_${key},
  author = {{PERFUMUM Research}},
  title = {${recette.name}},
  year = {${creationYear}},
  howpublished = {PERFUMUM Research Database},
  note = {Accessed: ${accessDate}}
}`;
          break;
      }
      
      return {
        citation,
        format: input.format,
        recette: {
          id: recette.id,
          name: recette.name,
        },
      };
    }),
  
  // Générer des citations groupées
  generateBulkCitations: publicProcedure
    .input(z.object({
      moleculeIds: z.array(z.number()).optional(),
      recetteIds: z.array(z.number()).optional(),
      format: z.enum(['apa', 'chicago', 'bibtex']),
    }))
    .query(async ({ input }) => {
      const citations: Array<{ type: 'molecule' | 'recette'; id: number; name: string; citation: string }> = [];
      
      // Générer les citations pour les molécules
      if (input.moleculeIds && input.moleculeIds.length > 0) {
        for (const id of input.moleculeIds) {
          const molecule = await db.getMoleculeById(id);
          if (molecule) {
            const currentYear = new Date().getFullYear();
            const accessDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
            const pubchemRef = molecule.references?.find(r => r.type === 'pubchem');
            const pubchemCID = pubchemRef?.url?.split('/').pop();
            
            let citation = '';
            if (input.format === 'apa') {
              citation = pubchemCID 
                ? `National Center for Biotechnology Information (${currentYear}). PubChem Compound Summary for CID ${pubchemCID}, ${molecule.name}. Retrieved ${accessDate}, from https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}`
                : `${molecule.name}. (${currentYear}). In PERFUMUM Research Database. Retrieved ${accessDate}.`;
            } else if (input.format === 'chicago') {
              citation = pubchemCID
                ? `National Center for Biotechnology Information. "PubChem Compound Summary for CID ${pubchemCID}, ${molecule.name}." PubChem. Accessed ${accessDate}. https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}.`
                : `"${molecule.name}." PERFUMUM Research Database. Accessed ${accessDate}.`;
            } else {
              const key = molecule.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
              citation = pubchemCID
                ? `@misc{pubchem_${key}, author = {{NCBI}}, title = {${molecule.name}}, year = {${currentYear}}, url = {https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}}}`
                : `@misc{perfumum_${key}, title = {${molecule.name}}, year = {${currentYear}}, howpublished = {PERFUMUM Research Database}}`;
            }
            
            citations.push({ type: 'molecule', id: molecule.id, name: molecule.name, citation });
          }
        }
      }
      
      // Générer les citations pour les recettes
      if (input.recetteIds && input.recetteIds.length > 0) {
        for (const id of input.recetteIds) {
          const recette = await db.getRecetteById(id);
          if (recette) {
            const currentYear = new Date().getFullYear();
            const accessDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
            
            let citation = '';
            if (input.format === 'apa') {
              citation = `PERFUMUM Research. (${currentYear}). ${recette.name}. PERFUMUM Research Database. Retrieved ${accessDate}.`;
            } else if (input.format === 'chicago') {
              citation = `PERFUMUM Research. "${recette.name}." PERFUMUM Research Database, ${currentYear}. Accessed ${accessDate}.`;
            } else {
              const key = recette.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
              citation = `@misc{perfumum_${key}, author = {{PERFUMUM Research}}, title = {${recette.name}}, year = {${currentYear}}}`;
            }
            
            citations.push({ type: 'recette', id: recette.id, name: recette.name, citation });
          }
        }
      }
      
      return {
        format: input.format,
        count: citations.length,
        citations,
      };
    }),
});
