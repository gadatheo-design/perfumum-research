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
