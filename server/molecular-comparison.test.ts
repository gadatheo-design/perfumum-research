import { describe, it, expect } from "vitest";
import { 
  listMolecularMarkers,
  getMolecularMarkersByFamily,
  getKeyMolecularMarkers,
  listBiotechMolecules,
  getBiotechMoleculesByStatus,
} from "./db";

describe("Molecular Markers (AX3 - Chimie analytique trans-époques)", () => {
  describe("listMolecularMarkers", () => {
    it("should return all molecular markers", async () => {
      const markers = await listMolecularMarkers();
      expect(markers).toBeDefined();
      expect(Array.isArray(markers)).toBe(true);
      expect(markers.length).toBeGreaterThan(0);
    });

    it("should return markers with required fields", async () => {
      const markers = await listMolecularMarkers();
      if (markers.length > 0) {
        const marker = markers[0];
        expect(marker).toHaveProperty("id");
        // Check for either camelCase or snake_case properties
        expect((marker as any).markerId || (marker as any).marker_id).toBeDefined();
        expect((marker as any).botanicalFamily || (marker as any).botanical_family).toBeDefined();
        expect((marker as any).moleculeName || (marker as any).molecule_name).toBeDefined();
      }
    });
  });

  describe("getMolecularMarkersByFamily", () => {
    it("should return markers for Lamiaceae family", async () => {
      const markers = await getMolecularMarkersByFamily("Lamiaceae");
      expect(markers).toBeDefined();
      expect(Array.isArray(markers)).toBe(true);
      // Nous avons inséré 3 marqueurs Lamiaceae
      expect(markers.length).toBeGreaterThanOrEqual(3);
      
      for (const marker of markers) {
        const family = (marker as any).botanicalFamily || (marker as any).botanical_family;
        expect(family).toBe("Lamiaceae");
      }
    });

    it("should return markers for Rosaceae family", async () => {
      const markers = await getMolecularMarkersByFamily("Rosaceae");
      expect(markers).toBeDefined();
      expect(Array.isArray(markers)).toBe(true);
      // Nous avons inséré 4 marqueurs Rosaceae
      expect(markers.length).toBeGreaterThanOrEqual(4);
    });

    it("should return empty array for non-existent family", async () => {
      const markers = await getMolecularMarkersByFamily("NonExistentFamily");
      expect(markers).toBeDefined();
      expect(Array.isArray(markers)).toBe(true);
      expect(markers.length).toBe(0);
    });
  });

  describe("getKeyMolecularMarkers", () => {
    it("should return only key markers", async () => {
      const keyMarkers = await getKeyMolecularMarkers();
      expect(keyMarkers).toBeDefined();
      expect(Array.isArray(keyMarkers)).toBe(true);
      
      for (const marker of keyMarkers) {
        const isKey = (marker as any).isKeyMarker ?? (marker as any).is_key_marker;
        expect(isKey).toBeTruthy();
      }
    });
  });
});

describe("Biotech Molecules (AX4 - Biotechnologies de conservation)", () => {
  describe("listBiotechMolecules", () => {
    it("should return all biotech molecules", async () => {
      const molecules = await listBiotechMolecules();
      expect(molecules).toBeDefined();
      expect(Array.isArray(molecules)).toBe(true);
      expect(molecules.length).toBeGreaterThan(0);
    });

    it("should return molecules with required fields", async () => {
      const molecules = await listBiotechMolecules();
      if (molecules.length > 0) {
        const mol = molecules[0];
        expect(mol).toHaveProperty("id");
        // Check for either camelCase or snake_case properties
        expect((mol as any).moleculeId || (mol as any).molecule_id).toBeDefined();
        expect((mol as any).moleculeName || (mol as any).molecule_name).toBeDefined();
        expect((mol as any).productionStatus || (mol as any).production_status).toBeDefined();
      }
    });

    it("should include production metrics", async () => {
      const molecules = await listBiotechMolecules();
      const commercialMol = molecules.find(m => 
        (m as any).productionStatus === "commercial" || (m as any).production_status === "commercial"
      );
      
      if (commercialMol) {
        expect((commercialMol as any).yieldMgL || (commercialMol as any).yield_mg_l).toBeDefined();
        expect((commercialMol as any).purityPercent || (commercialMol as any).purity_percent).toBeDefined();
      }
    });
  });

  describe("getBiotechMoleculesByStatus", () => {
    it("should return commercial molecules", async () => {
      const commercial = await getBiotechMoleculesByStatus("commercial");
      expect(commercial).toBeDefined();
      expect(Array.isArray(commercial)).toBe(true);
      
      for (const mol of commercial) {
        const status = (mol as any).productionStatus || (mol as any).production_status;
        expect(status).toBe("commercial");
      }
    });

    it("should return pilot molecules", async () => {
      const pilot = await getBiotechMoleculesByStatus("pilot");
      expect(pilot).toBeDefined();
      expect(Array.isArray(pilot)).toBe(true);
      
      for (const mol of pilot) {
        const status = (mol as any).productionStatus || (mol as any).production_status;
        expect(status).toBe("pilot");
      }
    });

    it("should return research molecules", async () => {
      const research = await getBiotechMoleculesByStatus("research");
      expect(research).toBeDefined();
      expect(Array.isArray(research)).toBe(true);
      
      for (const mol of research) {
        const status = (mol as any).productionStatus || (mol as any).production_status;
        expect(status).toBe("research");
      }
    });
  });

  describe("Biotech molecule data integrity", () => {
    it("should have valid host organisms", async () => {
      const molecules = await listBiotechMolecules();
      const validHosts = [
        "Saccharomyces cerevisiae",
        "Escherichia coli",
        "Yarrowia lipolytica",
        "Pichia pastoris",
      ];
      
      for (const mol of molecules) {
        if (mol.hostOrganism) {
          expect(validHosts).toContain(mol.hostOrganism);
        }
      }
    });

    it("should have heterologous genes as array", async () => {
      const molecules = await listBiotechMolecules();
      
      for (const mol of molecules) {
        if (mol.heterologousGenes) {
          expect(Array.isArray(mol.heterologousGenes)).toBe(true);
        }
      }
    });
  });
});

describe("Cross-epoch molecular comparison", () => {
  it("should have matching molecules between markers and biotech", async () => {
    const markers = await listMolecularMarkers();
    const biotech = await listBiotechMolecules();
    
    // Vérifier que certaines molécules existent dans les deux tables
    const markerNames = markers.map(m => ((m as any).moleculeName || (m as any).molecule_name || '').toLowerCase());
    const biotechNames = biotech.map(b => ((b as any).moleculeName || (b as any).molecule_name || '').toLowerCase());
    
    // Au moins quelques molécules devraient être communes (Linalol, Citronellol, etc.)
    const commonMolecules = markerNames.filter(name => biotechNames.includes(name));
    expect(commonMolecules.length).toBeGreaterThan(0);
  });
});
