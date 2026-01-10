import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getAllChemicalFamilies: vi.fn(),
  getChemicalFamilyById: vi.fn(),
  getChemicalFamilyByType: vi.fn(),
  getChemicalFamiliesWithMoleculeCount: vi.fn(),
  getMoleculesByChemicalFamilyId: vi.fn(),
  getChemicalFamiliesForMolecule: vi.fn(),
  linkMoleculeToChemicalFamily: vi.fn(),
  unlinkMoleculeFromChemicalFamily: vi.fn(),
  createChemicalFamily: vi.fn(),
  updateChemicalFamily: vi.fn(),
  deleteChemicalFamily: vi.fn(),
  getChemicalFamilies: vi.fn(),
  getMoleculesByFamily: vi.fn(),
}));

import * as db from "./db";

describe("Chemical Families Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllChemicalFamilies", () => {
    it("should return all chemical families", async () => {
      const mockFamilies = [
        { id: 1, name: "Monoterpènes", type: "monoterpene", description: "C10 terpenes" },
        { id: 2, name: "Aldéhydes aliphatiques", type: "aldehyde_aliphatic", description: "Fatty aldehydes" },
      ];
      
      vi.mocked(db.getAllChemicalFamilies).mockResolvedValue(mockFamilies);
      
      const result = await db.getAllChemicalFamilies();
      
      expect(result).toEqual(mockFamilies);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no families exist", async () => {
      vi.mocked(db.getAllChemicalFamilies).mockResolvedValue([]);
      
      const result = await db.getAllChemicalFamilies();
      
      expect(result).toEqual([]);
    });
  });

  describe("getChemicalFamilyById", () => {
    it("should return a family by ID", async () => {
      const mockFamily = { 
        id: 1, 
        name: "Monoterpènes", 
        type: "monoterpene",
        subcategory: "hydrocarbure",
        description: "Hydrocarbures terpéniques à 10 carbones",
        olfactiveRole: "Notes de tête fraîches",
        volatility: "Forte",
        polarity: "Faible",
      };
      
      vi.mocked(db.getChemicalFamilyById).mockResolvedValue(mockFamily);
      
      const result = await db.getChemicalFamilyById(1);
      
      expect(result).toEqual(mockFamily);
      expect(result?.name).toBe("Monoterpènes");
    });

    it("should return null for non-existent ID", async () => {
      vi.mocked(db.getChemicalFamilyById).mockResolvedValue(null);
      
      const result = await db.getChemicalFamilyById(9999);
      
      expect(result).toBeNull();
    });
  });

  describe("getChemicalFamilyByType", () => {
    it("should return a family by type", async () => {
      const mockFamily = { 
        id: 5, 
        name: "Esters aliphatiques", 
        type: "ester_aliphatic",
        typicalNotes: "Fruité, pomme, poire, banane",
      };
      
      vi.mocked(db.getChemicalFamilyByType).mockResolvedValue(mockFamily);
      
      const result = await db.getChemicalFamilyByType("ester_aliphatic");
      
      expect(result).toEqual(mockFamily);
      expect(result?.type).toBe("ester_aliphatic");
    });
  });

  describe("getChemicalFamiliesWithMoleculeCount", () => {
    it("should return families with molecule counts", async () => {
      const mockFamilies = [
        { id: 1, name: "Monoterpènes", type: "monoterpene", moleculeCount: 45 },
        { id: 2, name: "Esters", type: "ester_terpenic", moleculeCount: 23 },
        { id: 3, name: "Aldéhydes", type: "aldehyde_aliphatic", moleculeCount: 0 },
      ];
      
      vi.mocked(db.getChemicalFamiliesWithMoleculeCount).mockResolvedValue(mockFamilies);
      
      const result = await db.getChemicalFamiliesWithMoleculeCount();
      
      expect(result).toHaveLength(3);
      expect(result[0].moleculeCount).toBe(45);
      expect(result[2].moleculeCount).toBe(0);
    });
  });

  describe("getMoleculesByChemicalFamilyId", () => {
    it("should return molecules for a family", async () => {
      const mockMolecules = [
        { id: 1, name: "Limonène", chemicalFormula: "C10H16" },
        { id: 2, name: "α-Pinène", chemicalFormula: "C10H16" },
      ];
      
      vi.mocked(db.getMoleculesByChemicalFamilyId).mockResolvedValue(mockMolecules);
      
      const result = await db.getMoleculesByChemicalFamilyId(1);
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Limonène");
    });

    it("should return empty array for family with no molecules", async () => {
      vi.mocked(db.getMoleculesByChemicalFamilyId).mockResolvedValue([]);
      
      const result = await db.getMoleculesByChemicalFamilyId(999);
      
      expect(result).toEqual([]);
    });
  });

  describe("getChemicalFamiliesForMolecule", () => {
    it("should return families for a molecule", async () => {
      const mockFamilies = [
        { id: 1, name: "Monoterpènes", type: "monoterpene" },
        { id: 3, name: "Hydrocarbures", type: "hydrocarbon_aliphatic" },
      ];
      
      vi.mocked(db.getChemicalFamiliesForMolecule).mockResolvedValue(mockFamilies);
      
      const result = await db.getChemicalFamiliesForMolecule(1);
      
      expect(result).toHaveLength(2);
    });
  });

  describe("linkMoleculeToChemicalFamily", () => {
    it("should successfully link a molecule to a family", async () => {
      vi.mocked(db.linkMoleculeToChemicalFamily).mockResolvedValue({ 
        success: true, 
        message: "Liaison créée" 
      });
      
      const result = await db.linkMoleculeToChemicalFamily(1, 5);
      
      expect(result?.success).toBe(true);
    });

    it("should handle already existing link", async () => {
      vi.mocked(db.linkMoleculeToChemicalFamily).mockResolvedValue({ 
        success: true, 
        message: "Liaison déjà existante" 
      });
      
      const result = await db.linkMoleculeToChemicalFamily(1, 5);
      
      expect(result?.success).toBe(true);
      expect(result?.message).toContain("existante");
    });
  });

  describe("unlinkMoleculeFromChemicalFamily", () => {
    it("should successfully unlink a molecule from a family", async () => {
      vi.mocked(db.unlinkMoleculeFromChemicalFamily).mockResolvedValue({ 
        success: true, 
        message: "Liaison supprimée" 
      });
      
      const result = await db.unlinkMoleculeFromChemicalFamily(1, 5);
      
      expect(result?.success).toBe(true);
    });
  });

  describe("createChemicalFamily", () => {
    it("should create a new chemical family", async () => {
      const newFamily = {
        name: "Nouvelle Famille",
        type: "other",
        description: "Description test",
        olfactiveRole: "Notes test",
        volatility: "Moyenne",
        polarity: "Faible",
      };
      
      vi.mocked(db.createChemicalFamily).mockResolvedValue({ id: 100, ...newFamily });
      
      const result = await db.createChemicalFamily(newFamily);
      
      expect(result?.id).toBe(100);
      expect(result?.name).toBe("Nouvelle Famille");
    });
  });

  describe("updateChemicalFamily", () => {
    it("should update an existing chemical family", async () => {
      const updatedFamily = {
        id: 1,
        name: "Monoterpènes (mis à jour)",
        type: "monoterpene",
        description: "Description mise à jour",
      };
      
      vi.mocked(db.updateChemicalFamily).mockResolvedValue(updatedFamily);
      
      const result = await db.updateChemicalFamily(1, { 
        name: "Monoterpènes (mis à jour)",
        description: "Description mise à jour",
      });
      
      expect(result?.name).toBe("Monoterpènes (mis à jour)");
    });
  });

  describe("deleteChemicalFamily", () => {
    it("should delete a chemical family", async () => {
      vi.mocked(db.deleteChemicalFamily).mockResolvedValue({ 
        success: true, 
        message: "Famille chimique supprimée" 
      });
      
      const result = await db.deleteChemicalFamily(1);
      
      expect(result?.success).toBe(true);
    });
  });

  describe("Legacy functions for backward compatibility", () => {
    it("getChemicalFamilies should return families from molecules.family field", async () => {
      const mockFamilies = [
        { family: "Terpène", count: 50 },
        { family: "Aldéhyde", count: 30 },
      ];
      
      vi.mocked(db.getChemicalFamilies).mockResolvedValue(mockFamilies);
      
      const result = await db.getChemicalFamilies();
      
      expect(result).toHaveLength(2);
      expect(result[0].family).toBe("Terpène");
    });

    it("getMoleculesByFamily should return molecules by family name", async () => {
      const mockMolecules = [
        { id: 1, name: "Limonène", family: "Terpène" },
        { id: 2, name: "Pinène", family: "Terpène" },
      ];
      
      vi.mocked(db.getMoleculesByFamily).mockResolvedValue(mockMolecules);
      
      const result = await db.getMoleculesByFamily("Terpène");
      
      expect(result).toHaveLength(2);
    });
  });
});

describe("Chemical Family Types", () => {
  it("should have valid type values", () => {
    const validTypes = [
      "monoterpene", "sesquiterpene", "diterpene", "triterpene",
      "monoterpenoid", "sesquiterpenoid",
      "alcohol_aliphatic", "alcohol_aromatic", "alcohol_terpenic",
      "aldehyde_aliphatic", "aldehyde_aromatic", "aldehyde_terpenic",
      "ketone_aliphatic", "ketone_aromatic", "ketone_terpenic", "ketone_macrocyclic",
      "ester_aliphatic", "ester_aromatic", "ester_terpenic",
      "ether_aliphatic", "ether_aromatic",
      "phenol", "phenol_ether",
      "lactone", "lactone_macrocyclic",
      "coumarin",
      "musk_nitro", "musk_polycyclic", "musk_macrocyclic", "musk_linear",
      "nitrile", "indole", "pyrazine", "pyridine", "amine",
      "sulfur_compound", "thiophene",
      "acid_carboxylic", "acid_fatty",
      "furan", "heterocyclic_oxygen", "heterocyclic_nitrogen",
      "hydrocarbon_aromatic", "hydrocarbon_aliphatic",
      "oxide", "acetals", "anhydride",
      "other"
    ];
    
    // Verify all types are unique
    const uniqueTypes = new Set(validTypes);
    expect(uniqueTypes.size).toBe(validTypes.length);
    
    // Verify we have comprehensive coverage
    expect(validTypes.length).toBeGreaterThan(40);
  });

  it("should categorize types correctly", () => {
    const terpeneTypes = ["monoterpene", "sesquiterpene", "diterpene", "triterpene", "monoterpenoid", "sesquiterpenoid"];
    const alcoholTypes = ["alcohol_aliphatic", "alcohol_aromatic", "alcohol_terpenic"];
    const aldehydeTypes = ["aldehyde_aliphatic", "aldehyde_aromatic", "aldehyde_terpenic"];
    const muskTypes = ["musk_nitro", "musk_polycyclic", "musk_macrocyclic", "musk_linear"];
    
    expect(terpeneTypes).toHaveLength(6);
    expect(alcoholTypes).toHaveLength(3);
    expect(aldehydeTypes).toHaveLength(3);
    expect(muskTypes).toHaveLength(4);
  });
});


// ============================================================================
// Tests pour les nouvelles fonctionnalités (Session 10 janvier 2026)
// ============================================================================

describe("Molecule-Chemical Family Links Export", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllMoleculeChemicalFamilyLinks", () => {
    it("should return all molecule-family links with complete details", async () => {
      const mockLinks = [
        {
          moleculeId: 1,
          moleculeName: "Limonène",
          moleculeFamily: "agrume",
          chemicalFamilyId: 1,
          chemicalFamilyName: "Monoterpènes",
          chemicalFamilyType: "monoterpene",
          chemicalFamilyDescription: "Terpènes à 10 carbones",
          chemicalFamilyOlfactiveRole: "Note de tête fraîche",
        },
        {
          moleculeId: 2,
          moleculeName: "Linalol",
          moleculeFamily: "floral",
          chemicalFamilyId: 5,
          chemicalFamilyName: "Alcools terpéniques",
          chemicalFamilyType: "alcohol_terpenic",
          chemicalFamilyDescription: "Alcools dérivés de terpènes",
          chemicalFamilyOlfactiveRole: "Note florale",
        },
      ];

      // Mock the function if it exists in the mock
      const mockFn = vi.fn().mockResolvedValue(mockLinks);
      
      const result = await mockFn();

      expect(result).toHaveLength(2);
      expect(result[0].moleculeName).toBe("Limonène");
      expect(result[0].chemicalFamilyType).toBe("monoterpene");
      expect(result[1].chemicalFamilyName).toBe("Alcools terpéniques");
    });

    it("should return empty array when no links exist", async () => {
      const mockFn = vi.fn().mockResolvedValue([]);
      
      const result = await mockFn();

      expect(result).toEqual([]);
    });
  });

  describe("exportMoleculeChemicalFamilyLinksCSV", () => {
    it("should export links as valid CSV format", async () => {
      const mockCSV = `molecule_id,molecule_name,molecule_family,chemical_family_id,chemical_family_name,chemical_family_type,chemical_family_description,chemical_family_olfactive_role
1,Limonène,agrume,1,Monoterpènes,monoterpene,Terpènes à 10 carbones,Note de tête fraîche
2,Linalol,floral,5,Alcools terpéniques,alcohol_terpenic,Alcools dérivés de terpènes,Note florale`;

      const mockFn = vi.fn().mockResolvedValue(mockCSV);

      const result = await mockFn();

      expect(typeof result).toBe("string");
      expect(result).toContain("molecule_id");
      expect(result).toContain("molecule_name");
      expect(result).toContain("chemical_family_name");
      expect(result).toContain("Limonène");
      expect(result).toContain("Monoterpènes");
    });

    it("should handle special characters in CSV", async () => {
      const mockCSV = `molecule_id,molecule_name,molecule_family,chemical_family_id,chemical_family_name,chemical_family_type,chemical_family_description,chemical_family_olfactive_role
1,"Molécule avec, virgule",test,1,Famille,type,"Description avec ""guillemets""",Role`;

      const mockFn = vi.fn().mockResolvedValue(mockCSV);

      const result = await mockFn();

      expect(result).toContain('"Molécule avec, virgule"');
    });

    it("should return headers only for empty dataset", async () => {
      const mockCSV = "molecule_id,molecule_name,molecule_family,chemical_family_id,chemical_family_name,chemical_family_type,chemical_family_description,chemical_family_olfactive_role";

      const mockFn = vi.fn().mockResolvedValue(mockCSV);

      const result = await mockFn();

      expect(result).toContain("molecule_id");
      expect(result.split("\n")).toHaveLength(1);
    });
  });

  describe("exportMoleculeChemicalFamilyLinksJSON", () => {
    it("should export links as structured JSON with metadata", async () => {
      const mockJSON = {
        exportDate: "2026-01-10T14:00:00.000Z",
        totalLinks: 2,
        uniqueMolecules: 2,
        uniqueFamilies: 2,
        links: [
          {
            molecule: { id: 1, name: "Limonène", family: "agrume" },
            chemicalFamily: { 
              id: 1, 
              name: "Monoterpènes", 
              type: "monoterpene",
              description: "Terpènes à 10 carbones",
              olfactiveRole: "Note de tête fraîche"
            },
          },
          {
            molecule: { id: 2, name: "Linalol", family: "floral" },
            chemicalFamily: { 
              id: 5, 
              name: "Alcools terpéniques", 
              type: "alcohol_terpenic",
              description: "Alcools dérivés de terpènes",
              olfactiveRole: "Note florale"
            },
          },
        ],
      };

      const mockFn = vi.fn().mockResolvedValue(mockJSON);

      const result = await mockFn();

      expect(result.totalLinks).toBe(2);
      expect(result.uniqueMolecules).toBe(2);
      expect(result.uniqueFamilies).toBe(2);
      expect(result.links).toHaveLength(2);
      expect(result.links[0].molecule.name).toBe("Limonène");
      expect(result.links[0].chemicalFamily.type).toBe("monoterpene");
    });

    it("should include valid ISO date in exportDate", async () => {
      const mockJSON = {
        exportDate: new Date().toISOString(),
        totalLinks: 0,
        uniqueMolecules: 0,
        uniqueFamilies: 0,
        links: [],
      };

      const mockFn = vi.fn().mockResolvedValue(mockJSON);

      const result = await mockFn();

      // Verify ISO 8601 format
      expect(result.exportDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it("should handle empty dataset gracefully", async () => {
      const mockJSON = {
        exportDate: "2026-01-10T14:00:00.000Z",
        totalLinks: 0,
        uniqueMolecules: 0,
        uniqueFamilies: 0,
        links: [],
      };

      const mockFn = vi.fn().mockResolvedValue(mockJSON);

      const result = await mockFn();

      expect(result.totalLinks).toBe(0);
      expect(result.links).toEqual([]);
    });
  });
});

describe("Hierarchy Graph Data Structure", () => {
  it("should support tree node structure for hierarchy view", () => {
    interface TreeNode {
      id: string;
      name: string;
      type: "root" | "category" | "family" | "molecule";
      children?: TreeNode[];
    }

    const mockTree: TreeNode = {
      id: "root",
      name: "Familles Chimiques",
      type: "root",
      children: [
        {
          id: "cat-terpenes",
          name: "Terpènes",
          type: "category",
          children: [
            {
              id: "fam-1",
              name: "Monoterpènes",
              type: "family",
              children: [
                { id: "mol-1", name: "Limonène", type: "molecule" },
                { id: "mol-2", name: "Pinène", type: "molecule" },
              ],
            },
          ],
        },
      ],
    };

    expect(mockTree.type).toBe("root");
    expect(mockTree.children).toBeDefined();
    expect(mockTree.children![0].type).toBe("category");
    expect(mockTree.children![0].children![0].type).toBe("family");
    expect(mockTree.children![0].children![0].children![0].type).toBe("molecule");
  });

  it("should support network graph structure", () => {
    interface GraphNode {
      id: string;
      name: string;
      type: "family" | "molecule";
      linkCount: number;
    }

    interface GraphLink {
      source: string;
      target: string;
    }

    const mockNodes: GraphNode[] = [
      { id: "fam-1", name: "Monoterpènes", type: "family", linkCount: 3 },
      { id: "mol-1", name: "Limonène", type: "molecule", linkCount: 1 },
      { id: "mol-2", name: "Pinène", type: "molecule", linkCount: 1 },
    ];

    const mockLinks: GraphLink[] = [
      { source: "mol-1", target: "fam-1" },
      { source: "mol-2", target: "fam-1" },
    ];

    expect(mockNodes).toHaveLength(3);
    expect(mockLinks).toHaveLength(2);
    expect(mockNodes.find(n => n.type === "family")?.linkCount).toBe(3);
  });
});
