/**
 * Chemical Families Router
 * 
 * tRPC procedures for chemical family classification and filtering
 */

import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { molecules } from '../../drizzle/schema';
import { 
  classifyMolecule, 
  getAllFamiliesForUI, 
  getFamilyById,
  CHEMICAL_FAMILIES 
} from '../chemical-families-service';

export const chemicalFamiliesRouter = router({
  /**
   * Get all chemical families for UI display
   */
  getAllFamilies: publicProcedure.query(async () => {
    return getAllFamiliesForUI();
  }),

  /**
   * Classify a single molecule
   */
  classifyMolecule: publicProcedure
    .input(z.object({
      name: z.string(),
      smiles: z.string().optional().nullable(),
      iupacName: z.string().optional().nullable()
    }))
    .query(async ({ input }) => {
      const families = classifyMolecule(input.name, input.smiles, input.iupacName);
      return {
        families,
        familyDetails: families.map(id => getFamilyById(id)).filter(Boolean)
      };
    }),

  /**
   * Batch classify all molecules and return statistics
   */
  getClassificationStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return {
      total: 0,
      classified: 0,
      unclassifiedCount: 0,
      byFamily: {},
      familyDetails: []
    };

    // Get all molecules
    const allMolecules = await db.select({
      id: molecules.id,
      name: molecules.name,
      smiles: molecules.smiles,
      iupacName: molecules.iupacName
    }).from(molecules);

    // Classify each molecule
    const stats: Record<string, number> = {};
    const unclassified: string[] = [];

    for (const mol of allMolecules) {
      const families = classifyMolecule(mol.name, mol.smiles, mol.iupacName);
      
      if (families.length === 0) {
        unclassified.push(mol.name);
      } else {
        for (const familyId of families) {
          stats[familyId] = (stats[familyId] || 0) + 1;
        }
      }
    }

    return {
      total: allMolecules.length,
      classified: allMolecules.length - unclassified.length,
      unclassifiedCount: unclassified.length,
      byFamily: stats,
      familyDetails: CHEMICAL_FAMILIES.map(f => ({
        id: f.id,
        name: f.name,
        nameFr: f.nameFr,
        count: stats[f.id] || 0
      })).sort((a, b) => b.count - a.count)
    };
  }),

  /**
   * Get molecules by chemical family
   */
  getMoleculesByFamily: publicProcedure
    .input(z.object({
      familyId: z.string(),
      limit: z.number().optional().default(100),
      offset: z.number().optional().default(0)
    }))
    .query(async ({ input }) => {
      const family = getFamilyById(input.familyId);
      if (!family) {
        throw new Error(`Unknown chemical family: ${input.familyId}`);
      }

      const db = await getDb();
      if (!db) return {
        molecules: [],
        total: 0,
        family: {
          id: family.id,
          name: family.name,
          nameFr: family.nameFr,
          description: family.description
        }
      };

      // Get all molecules
      const allMolecules = await db.select({
        id: molecules.id,
        name: molecules.name,
        smiles: molecules.smiles,
        iupacName: molecules.iupacName,
        molecularFormula: molecules.molecularFormula,
        molecularWeight: molecules.molecularWeight,
        ifraStatus: molecules.ifraStatus,
        flavornetPercepts: molecules.flavornetPercepts
      }).from(molecules);

      // Filter by family
      const filtered = allMolecules.filter(mol => {
        const families = classifyMolecule(mol.name, mol.smiles, mol.iupacName);
        return families.includes(input.familyId);
      });

      // Apply pagination
      const paginated = filtered.slice(input.offset, input.offset + input.limit);

      return {
        molecules: paginated,
        total: filtered.length,
        family: {
          id: family.id,
          name: family.name,
          nameFr: family.nameFr,
          description: family.description
        }
      };
    }),

  /**
   * Search molecules with chemical family filter
   * This is used by the main molecules page
   */
  searchWithFamilyFilter: publicProcedure
    .input(z.object({
      familyId: z.string().optional(),
      searchTerm: z.string().optional(),
      ifraStatus: z.string().optional(),
      percept: z.string().optional(),
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0)
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return {
        molecules: [],
        total: 0,
        hasMore: false
      };

      // Get all molecules first (we'll filter in JS for family)
      const allMolecules = await db.select({
        id: molecules.id,
        name: molecules.name,
        smiles: molecules.smiles,
        iupacName: molecules.iupacName,
        molecularFormula: molecules.molecularFormula,
        molecularWeight: molecules.molecularWeight,
        ifraStatus: molecules.ifraStatus,
        ifraRestrictions: molecules.ifraRestrictions,
        flavornetPercepts: molecules.flavornetPercepts,
        flavornetKovatsIndex: molecules.flavornetKovatsIndex,
        therapeuticProperties: molecules.therapeuticProperties,
        description: molecules.description,
        category: molecules.category
      }).from(molecules);

      // Apply filters
      let filtered = allMolecules;

      // Search term filter
      if (input.searchTerm) {
        const term = input.searchTerm.toLowerCase();
        filtered = filtered.filter(mol => 
          mol.name.toLowerCase().includes(term) ||
          (mol.iupacName && mol.iupacName.toLowerCase().includes(term)) ||
          (mol.molecularFormula && mol.molecularFormula.toLowerCase().includes(term))
        );
      }

      // IFRA status filter
      if (input.ifraStatus) {
        filtered = filtered.filter(mol => mol.ifraStatus === input.ifraStatus);
      }

      // Percept filter
      if (input.percept) {
        const perceptLower = input.percept.toLowerCase();
        filtered = filtered.filter(mol => {
          if (!mol.flavornetPercepts) return false;
          const percepts = mol.flavornetPercepts.split(',').map(p => p.trim().toLowerCase());
          return percepts.includes(perceptLower);
        });
      }

      // Chemical family filter
      if (input.familyId) {
        filtered = filtered.filter(mol => {
          const families = classifyMolecule(mol.name, mol.smiles, mol.iupacName);
          return families.includes(input.familyId!);
        });
      }

      // Apply pagination
      const total = filtered.length;
      const paginated = filtered.slice(input.offset, input.offset + input.limit);

      // Add chemical families to each molecule
      const withFamilies = paginated.map(mol => ({
        ...mol,
        chemicalFamilies: classifyMolecule(mol.name, mol.smiles, mol.iupacName)
      }));

      return {
        molecules: withFamilies,
        total,
        hasMore: input.offset + input.limit < total
      };
    })
});
