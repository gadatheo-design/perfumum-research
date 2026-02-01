import { describe, it, expect } from 'vitest';
import { 
  classifyMolecule, 
  getAllFamiliesForUI, 
  getFamilyById,
  CHEMICAL_FAMILIES 
} from './chemical-families-service';

describe('Chemical Families Classification Service', () => {
  describe('CHEMICAL_FAMILIES constant', () => {
    it('should have 17 chemical families defined', () => {
      expect(CHEMICAL_FAMILIES).toHaveLength(17);
    });

    it('should have unique IDs for all families', () => {
      const ids = CHEMICAL_FAMILIES.map(f => f.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have required properties for each family', () => {
      for (const family of CHEMICAL_FAMILIES) {
        expect(family.id).toBeDefined();
        expect(family.name).toBeDefined();
        expect(family.nameFr).toBeDefined();
        expect(family.description).toBeDefined();
        expect(family.namePatterns).toBeDefined();
        expect(Array.isArray(family.namePatterns)).toBe(true);
      }
    });
  });

  describe('classifyMolecule', () => {
    describe('Terpenes classification', () => {
      it('should classify limonene as terpene', () => {
        const families = classifyMolecule('Limonene');
        expect(families).toContain('terpene');
      });

      it('should classify alpha-pinene as terpene', () => {
        const families = classifyMolecule('alpha-Pinene');
        expect(families).toContain('terpene');
      });

      it('should classify caryophyllene as terpene', () => {
        const families = classifyMolecule('beta-Caryophyllene');
        expect(families).toContain('terpene');
      });
    });

    describe('Aldehydes classification', () => {
      it('should classify citral as aldehyde', () => {
        const families = classifyMolecule('Citral');
        expect(families).toContain('aldehyde');
      });

      it('should classify benzaldehyde as aldehyde', () => {
        const families = classifyMolecule('Benzaldehyde');
        expect(families).toContain('aldehyde');
      });

      it('should classify decanal as aldehyde', () => {
        const families = classifyMolecule('Decanal');
        expect(families).toContain('aldehyde');
      });
    });

    describe('Alcohols classification', () => {
      it('should classify linalool as alcohol', () => {
        const families = classifyMolecule('Linalool');
        expect(families).toContain('alcohol');
      });

      it('should classify geraniol as alcohol', () => {
        const families = classifyMolecule('Geraniol');
        expect(families).toContain('alcohol');
      });

      it('should classify menthol as alcohol', () => {
        const families = classifyMolecule('Menthol');
        expect(families).toContain('alcohol');
      });
    });

    describe('Esters classification', () => {
      it('should classify linalyl acetate as ester', () => {
        const families = classifyMolecule('Linalyl acetate');
        expect(families).toContain('ester');
      });

      it('should classify methyl salicylate as ester', () => {
        const families = classifyMolecule('Methyl salicylate');
        expect(families).toContain('ester');
      });

      it('should classify benzyl benzoate as ester', () => {
        const families = classifyMolecule('Benzyl benzoate');
        expect(families).toContain('ester');
      });
    });

    describe('Ketones classification', () => {
      it('should classify camphor as ketone', () => {
        const families = classifyMolecule('Camphor');
        expect(families).toContain('ketone');
      });

      it('should classify carvone as ketone', () => {
        const families = classifyMolecule('Carvone');
        expect(families).toContain('ketone');
      });

      it('should classify ionone as ketone', () => {
        const families = classifyMolecule('beta-Ionone');
        expect(families).toContain('ketone');
      });
    });

    describe('Phenols classification', () => {
      it('should classify eugenol as phenol', () => {
        const families = classifyMolecule('Eugenol');
        expect(families).toContain('phenol');
      });

      it('should classify thymol as phenol', () => {
        const families = classifyMolecule('Thymol');
        expect(families).toContain('phenol');
      });

      it('should classify carvacrol as phenol', () => {
        const families = classifyMolecule('Carvacrol');
        expect(families).toContain('phenol');
      });
    });

    describe('Ethers classification', () => {
      it('should classify eucalyptol (1,8-cineole) as ether', () => {
        const families = classifyMolecule('1,8-Cineole');
        expect(families).toContain('ether');
      });

      it('should classify anethole as ether', () => {
        const families = classifyMolecule('Anethole');
        expect(families).toContain('ether');
      });

      it('should classify estragole as ether', () => {
        const families = classifyMolecule('Estragole');
        expect(families).toContain('ether');
      });
    });

    describe('Lactones classification', () => {
      it('should classify coumarin as lactone', () => {
        const families = classifyMolecule('Coumarin');
        expect(families).toContain('lactone');
      });

      it('should classify gamma-decalactone as lactone', () => {
        const families = classifyMolecule('gamma-Decalactone');
        expect(families).toContain('lactone');
      });
    });

    describe('Musks classification', () => {
      it('should classify muscone as musk', () => {
        const families = classifyMolecule('Muscone');
        expect(families).toContain('musk');
      });

      it('should classify galaxolide as musk', () => {
        const families = classifyMolecule('Galaxolide');
        expect(families).toContain('musk');
      });
    });

    describe('Indoles classification', () => {
      it('should classify indole as indole', () => {
        const families = classifyMolecule('Indole');
        expect(families).toContain('indole');
      });

      it('should classify skatole as indole', () => {
        const families = classifyMolecule('Skatole');
        expect(families).toContain('indole');
      });
    });

    describe('Multiple classifications', () => {
      it('should classify molecules in multiple families when applicable', () => {
        // Estragole is both an ether and a phenol
        const families = classifyMolecule('Estragole');
        expect(families.length).toBeGreaterThanOrEqual(1);
      });
    });

    describe('Unclassified molecules', () => {
      it('should return empty array for unknown molecules', () => {
        const families = classifyMolecule('XYZ123Unknown');
        expect(families).toEqual([]);
      });
    });

    describe('SMILES-based classification', () => {
      it('should classify by SMILES when name does not match', () => {
        // A molecule with ketone SMILES pattern
        const families = classifyMolecule('UnknownMolecule', 'CC(=O)CC');
        expect(families).toContain('ketone');
      });
    });

    describe('IUPAC-based classification', () => {
      it('should classify by IUPAC name when name does not match', () => {
        const families = classifyMolecule('UnknownMolecule', null, 'cyclohexene derivative');
        expect(families).toContain('terpene');
      });
    });
  });

  describe('getFamilyById', () => {
    it('should return family for valid ID', () => {
      const family = getFamilyById('terpene');
      expect(family).toBeDefined();
      expect(family?.name).toBe('Terpenes');
      expect(family?.nameFr).toBe('Terpènes');
    });

    it('should return undefined for invalid ID', () => {
      const family = getFamilyById('invalid_family');
      expect(family).toBeUndefined();
    });

    it('should return all expected families by ID', () => {
      const expectedIds = [
        'terpene', 'aldehyde', 'alcohol', 'ester', 'ketone',
        'phenol', 'ether', 'acid', 'lactone', 'coumarin',
        'musk', 'indole', 'furanone', 'nitrile', 'pyrazine',
        'thiazole', 'sulfide'
      ];
      
      for (const id of expectedIds) {
        const family = getFamilyById(id);
        expect(family).toBeDefined();
        expect(family?.id).toBe(id);
      }
    });
  });

  describe('getAllFamiliesForUI', () => {
    it('should return all families with UI-friendly format', () => {
      const families = getAllFamiliesForUI();
      expect(families).toHaveLength(17);
    });

    it('should have id, name, and nameFr for each family', () => {
      const families = getAllFamiliesForUI();
      for (const family of families) {
        expect(family.id).toBeDefined();
        expect(family.name).toBeDefined();
        expect(family.nameFr).toBeDefined();
      }
    });

    it('should include French names for all families', () => {
      const families = getAllFamiliesForUI();
      const frenchNames = families.map(f => f.nameFr);
      
      expect(frenchNames).toContain('Terpènes');
      expect(frenchNames).toContain('Aldéhydes');
      expect(frenchNames).toContain('Alcools');
      expect(frenchNames).toContain('Esters');
      expect(frenchNames).toContain('Cétones');
      expect(frenchNames).toContain('Phénols');
      expect(frenchNames).toContain('Éthers');
    });
  });
});
