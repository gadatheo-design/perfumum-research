import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Phase 4 - Citations Generation", () => {
  it("should generate APA citation for molecule", async () => {
    const citation = await db.generateCitation("molecule", 1, "apa");
    
    expect(citation).toBeDefined();
    expect(citation.citationText).toContain("PERFUMUM Research");
    expect(citation.citationText).toContain("PERFUMUM Molecular Database");
    expect(citation.format).toBe("apa");
  });

  it("should generate MLA citation for molecule", async () => {
    const citation = await db.generateCitation("molecule", 1, "mla");
    
    expect(citation).toBeDefined();
    expect(citation.citationText).toContain("PERFUMUM Molecular Database");
    expect(citation.format).toBe("mla");
  });

  it("should generate Chicago citation for molecule", async () => {
    const citation = await db.generateCitation("molecule", 1, "chicago");
    
    expect(citation).toBeDefined();
    expect(citation.citationText).toContain("Accessed");
    expect(citation.format).toBe("chicago");
  });

  it("should generate BibTeX citation for molecule", async () => {
    const citation = await db.generateCitation("molecule", 1, "bibtex");
    
    expect(citation).toBeDefined();
    expect(citation.citationText).toContain("@misc{perfumum_molecule_1");
    expect(citation.citationText).toContain("title=");
    expect(citation.citationText).toContain("author={PERFUMUM Research}");
    expect(citation.format).toBe("bibtex");
  });

  it("should retrieve existing citation from cache", async () => {
    // Generate first time
    const citation1 = await db.generateCitation("molecule", 1, "apa");
    
    // Retrieve from cache
    const citation2 = await db.getCitation("molecule", 1, "apa");
    
    expect(citation2).toBeDefined();
    expect(citation2?.citationText).toBe(citation1.citationText);
  });
});

describe("Phase 4 - Molecule Notes", () => {
  it("should create new molecule note", async () => {
    const note = await db.upsertMoleculeNote({
      userId: 1,
      moleculeId: 1,
      note: "Test note for molecule",
      tags: ["test", "research"],
    });
    
    expect(note).toBeDefined();
    expect(note?.note).toBe("Test note for molecule");
    expect(note?.tags).toEqual(["test", "research"]);
  });

  it("should update existing molecule note", async () => {
    // Create first
    await db.upsertMoleculeNote({
      userId: 1,
      moleculeId: 1,
      note: "Original note",
      tags: ["original"],
    });
    
    // Update
    const updated = await db.upsertMoleculeNote({
      userId: 1,
      moleculeId: 1,
      note: "Updated note",
      tags: ["updated"],
    });
    
    expect(updated).toBeDefined();
    expect(updated?.note).toBe("Updated note");
    expect(updated?.tags).toEqual(["updated"]);
  });

  it("should retrieve molecule note", async () => {
    await db.upsertMoleculeNote({
      userId: 1,
      moleculeId: 2,
      note: "Retrieve test",
      tags: [],
    });
    
    const note = await db.getMoleculeNote(1, 2);
    
    expect(note).toBeDefined();
    expect(note?.note).toBe("Retrieve test");
  });

  it("should delete molecule note", async () => {
    await db.upsertMoleculeNote({
      userId: 1,
      moleculeId: 3,
      note: "To be deleted",
      tags: [],
    });
    
    const result = await db.deleteMoleculeNote(1, 3);
    expect(result.success).toBe(true);
    
    const note = await db.getMoleculeNote(1, 3);
    expect(note).toBeNull();
  });
});

describe("Phase 4 - Shared Collections", () => {
  it("should create shared collection", async () => {
    const collection = await db.createSharedCollection({
      token: `test_token_123_${Date.now()}`,
      title: "Test Collection",
      description: "Test description",
      moleculeIds: [1, 2, 3],
      creatorId: 1,
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
      moleculeIds: [1, 2],
      creatorId: 1,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    
    const collection = await db.getSharedCollectionByToken(token);
    
    expect(collection).toBeDefined();
    expect(collection?.title).toBe("Retrieve Test");
    expect(collection?.moleculeIds).toEqual([1, 2]);
  });

  it("should return null for expired collection", async () => {
    const token = `expired_token_${Date.now()}`;
    await db.createSharedCollection({
      token,
      title: "Expired",
      description: "Test",
      moleculeIds: [1],
      creatorId: 1,
      expiresAt: new Date(Date.now() - 1000), // Already expired
    });
    
    const collection = await db.getSharedCollectionByToken(token);
    expect(collection).toBeNull();
  });

  it("should increment view count", async () => {
    const token = `view_count_test_${Date.now()}`;
    await db.createSharedCollection({
      token,
      title: "View Count",
      description: "Test",
      moleculeIds: [1],
      creatorId: 1,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    
    // First view
    const collection1 = await db.getSharedCollectionByToken(token);
    expect(collection1?.viewCount).toBe(1);
    
    // Second view
    const collection2 = await db.getSharedCollectionByToken(token);
    expect(collection2?.viewCount).toBe(2);
  });
});
