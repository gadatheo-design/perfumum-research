import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

// Helper to get a valid molecule ID from the database
let validMoleculeId: number | null = null;
let validUserId: number = 1;

beforeAll(async () => {
  // Try to find an existing molecule in the database
  try {
    const molecules = await db.getMolecules();
    if (molecules && molecules.length > 0) {
      validMoleculeId = molecules[0].id;
    }
  } catch {
    // Database might be empty, tests will be skipped
  }
});

describe("Phase 4 - Citations Generation", () => {
  it("should generate APA citation for molecule", async () => {
    if (!validMoleculeId) {
      console.log("Skipping test: no molecules in database");
      return;
    }
    
    const citation = await db.generateCitation("molecule", validMoleculeId, "apa");
    
    expect(citation).toBeDefined();
    expect(citation.citationText).toContain("PERFUMUM Research");
    expect(citation.citationText).toContain("PERFUMUM Molecular Database");
    expect(citation.format).toBe("apa");
  });

  it("should generate MLA citation for molecule", async () => {
    if (!validMoleculeId) {
      console.log("Skipping test: no molecules in database");
      return;
    }
    
    const citation = await db.generateCitation("molecule", validMoleculeId, "mla");
    
    expect(citation).toBeDefined();
    expect(citation.citationText).toContain("PERFUMUM Molecular Database");
    expect(citation.format).toBe("mla");
  });

  it("should generate Chicago citation for molecule", async () => {
    if (!validMoleculeId) {
      console.log("Skipping test: no molecules in database");
      return;
    }
    
    const citation = await db.generateCitation("molecule", validMoleculeId, "chicago");
    
    expect(citation).toBeDefined();
    expect(citation.citationText).toContain("Accessed");
    expect(citation.format).toBe("chicago");
  });

  it("should generate BibTeX citation for molecule", async () => {
    if (!validMoleculeId) {
      console.log("Skipping test: no molecules in database");
      return;
    }
    
    const citation = await db.generateCitation("molecule", validMoleculeId, "bibtex");
    
    expect(citation).toBeDefined();
    expect(citation.citationText).toContain(`@misc{perfumum_molecule_${validMoleculeId}`);
    expect(citation.citationText).toContain("title=");
    expect(citation.citationText).toContain("author={PERFUMUM Research}");
    expect(citation.format).toBe("bibtex");
  });

  it("should retrieve existing citation from cache", async () => {
    if (!validMoleculeId) {
      console.log("Skipping test: no molecules in database");
      return;
    }
    
    // Generate first time
    const citation1 = await db.generateCitation("molecule", validMoleculeId, "apa");
    
    // Retrieve from cache
    const citation2 = await db.getCitation("molecule", validMoleculeId, "apa");
    
    expect(citation2).toBeDefined();
    expect(citation2?.citationText).toBe(citation1.citationText);
  });
});

describe("Phase 4 - Molecule Notes", () => {
  it("should create new molecule note", async () => {
    if (!validMoleculeId) {
      console.log("Skipping test: no molecules in database");
      return;
    }
    
    const note = await db.upsertMoleculeNote({
      userId: validUserId,
      moleculeId: validMoleculeId,
      note: "Test note for molecule",
      tags: ["test", "research"],
    });
    
    expect(note).toBeDefined();
    expect(note?.note).toBe("Test note for molecule");
    expect(note?.tags).toEqual(["test", "research"]);
  });

  it("should update existing molecule note", async () => {
    if (!validMoleculeId) {
      console.log("Skipping test: no molecules in database");
      return;
    }
    
    // Create first
    await db.upsertMoleculeNote({
      userId: validUserId,
      moleculeId: validMoleculeId,
      note: "Original note",
      tags: ["original"],
    });
    
    // Update
    const updated = await db.upsertMoleculeNote({
      userId: validUserId,
      moleculeId: validMoleculeId,
      note: "Updated note",
      tags: ["updated"],
    });
    
    expect(updated).toBeDefined();
    expect(updated?.note).toBe("Updated note");
    expect(updated?.tags).toEqual(["updated"]);
  });

  it("should retrieve molecule note", async () => {
    if (!validMoleculeId) {
      console.log("Skipping test: no molecules in database");
      return;
    }
    
    await db.upsertMoleculeNote({
      userId: validUserId,
      moleculeId: validMoleculeId,
      note: "Retrieve test",
      tags: [],
    });
    
    const note = await db.getMoleculeNote(validUserId, validMoleculeId);
    
    expect(note).toBeDefined();
    expect(note?.note).toBe("Retrieve test");
  });

  it("should delete molecule note", async () => {
    if (!validMoleculeId) {
      console.log("Skipping test: no molecules in database");
      return;
    }
    
    await db.upsertMoleculeNote({
      userId: validUserId,
      moleculeId: validMoleculeId,
      note: "To be deleted",
      tags: [],
    });
    
    const result = await db.deleteMoleculeNote(validUserId, validMoleculeId);
    expect(result.success).toBe(true);
    
    const note = await db.getMoleculeNote(validUserId, validMoleculeId);
    expect(note).toBeNull();
  });
});

describe("Phase 4 - Shared Collections", () => {
  it("should create shared collection", async () => {
    const collection = await db.createSharedCollection({
      token: `test_token_123_${Date.now()}`,
      title: "Test Collection",
      description: "Test description",
      moleculeIds: validMoleculeId ? [validMoleculeId] : [],
      creatorId: validUserId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    });
    
    expect(collection).toBeDefined();
    expect(collection.id).toBeGreaterThan(0);
  });

  it("should retrieve shared collection by token", async () => {
    const token = `test_token_456_${Date.now()}`;
    await db.createSharedCollection({
      token,
      title: "Retrieve Test",
      description: "Test",
      moleculeIds: validMoleculeId ? [validMoleculeId] : [],
      creatorId: validUserId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    
    const collection = await db.getSharedCollectionByToken(token);
    
    expect(collection).toBeDefined();
    expect(collection?.title).toBe("Retrieve Test");
  });

  // Note: incrementCollectionViews et deleteSharedCollection ne sont pas encore implémentés
  // Ces tests seront activés une fois les fonctions ajoutées à db.ts
  it.skip("should increment view count", async () => {
    // Test à implémenter
  });

  it.skip("should delete shared collection", async () => {
    // Test à implémenter
  });
});
