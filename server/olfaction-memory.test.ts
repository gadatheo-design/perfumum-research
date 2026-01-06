import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";

describe("Olfaction & Mémoire - Database Tables", () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
  });

  it("should have olfaction_memory table created", async () => {
    const result = await db.execute(`SHOW TABLES LIKE 'olfaction_memory'`);
    expect(result[0]).toBeDefined();
    expect((result[0] as any[]).length).toBeGreaterThan(0);
  });

  it("should have memory_olfaction_concepts table created", async () => {
    const result = await db.execute(`SHOW TABLES LIKE 'memory_olfaction_concepts'`);
    expect(result[0]).toBeDefined();
    expect((result[0] as any[]).length).toBeGreaterThan(0);
  });

  it("should have olfaction_memory_sources table created", async () => {
    const result = await db.execute(`SHOW TABLES LIKE 'olfaction_memory_sources'`);
    expect(result[0]).toBeDefined();
    expect((result[0] as any[]).length).toBeGreaterThan(0);
  });

  it("should have olfaction_memory_article_sources table created", async () => {
    const result = await db.execute(`SHOW TABLES LIKE 'olfaction_memory_article_sources'`);
    expect(result[0]).toBeDefined();
    expect((result[0] as any[]).length).toBeGreaterThan(0);
  });

  it("should have olfaction_memory_article_concepts table created", async () => {
    const result = await db.execute(`SHOW TABLES LIKE 'olfaction_memory_article_concepts'`);
    expect(result[0]).toBeDefined();
    expect((result[0] as any[]).length).toBeGreaterThan(0);
  });
});

describe("Olfaction & Mémoire - Table Structure", () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
  });

  it("olfaction_memory should have required columns", async () => {
    const result = await db.execute(`DESCRIBE olfaction_memory`);
    const columns = (result[0] as any[]).map((col: any) => col.Field);
    
    expect(columns).toContain("id");
    expect(columns).toContain("title");
    expect(columns).toContain("slug");
    expect(columns).toContain("category");
    expect(columns).toContain("summary");
    expect(columns).toContain("content");
    expect(columns).toContain("status");
    expect(columns).toContain("featured");
    expect(columns).toContain("created_at");
  });

  it("memory_olfaction_concepts should have required columns", async () => {
    const result = await db.execute(`DESCRIBE memory_olfaction_concepts`);
    const columns = (result[0] as any[]).map((col: any) => col.Field);
    
    expect(columns).toContain("id");
    expect(columns).toContain("name");
    expect(columns).toContain("slug");
    expect(columns).toContain("type");
    expect(columns).toContain("definition");
    expect(columns).toContain("description");
  });

  it("olfaction_memory_sources should have required columns", async () => {
    const result = await db.execute(`DESCRIBE olfaction_memory_sources`);
    const columns = (result[0] as any[]).map((col: any) => col.Field);
    
    expect(columns).toContain("id");
    expect(columns).toContain("source_type");
    expect(columns).toContain("title");
    expect(columns).toContain("authors");
    expect(columns).toContain("publication_year");
    expect(columns).toContain("url");
  });
});

describe("Verified Suppliers - Database Tables", () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
  });

  it("should have verified_suppliers table created", async () => {
    const result = await db.execute(`SHOW TABLES LIKE 'verified_suppliers'`);
    expect(result[0]).toBeDefined();
    expect((result[0] as any[]).length).toBeGreaterThan(0);
  });

  it("should have supplier_alternative_links table created", async () => {
    const result = await db.execute(`SHOW TABLES LIKE 'supplier_alternative_links'`);
    expect(result[0]).toBeDefined();
    expect((result[0] as any[]).length).toBeGreaterThan(0);
  });

  it("verified_suppliers should have required columns", async () => {
    const result = await db.execute(`DESCRIBE verified_suppliers`);
    const columns = (result[0] as any[]).map((col: any) => col.Field);
    
    expect(columns).toContain("id");
    expect(columns).toContain("name");
    expect(columns).toContain("country");
    expect(columns).toContain("verified");
    expect(columns).toContain("certifications");
  });
});


// ============================================================================
// Tests pour les fonctions de données Olfaction & Mémoire
// ============================================================================

import * as dbFunctions from "./db";

describe("Olfaction Memory - Concepts Data Functions", () => {
  it("should list all memory olfaction concepts", async () => {
    const concepts = await dbFunctions.getMemoryOlfactionConcepts();
    expect(concepts).toBeDefined();
    expect(Array.isArray(concepts)).toBe(true);
  });

  it("should filter concepts by type", async () => {
    const brainStructures = await dbFunctions.getMemoryOlfactionConcepts("brain_structure");
    expect(brainStructures).toBeDefined();
    expect(Array.isArray(brainStructures)).toBe(true);
    if (brainStructures.length > 0) {
      expect(brainStructures.every(c => c.type === "brain_structure")).toBe(true);
    }
  });

  it("should get concept by id when exists", async () => {
    const concepts = await dbFunctions.getMemoryOlfactionConcepts();
    if (concepts.length > 0) {
      const concept = await dbFunctions.getMemoryOlfactionConceptById(concepts[0].id);
      expect(concept).toBeDefined();
      expect(concept?.id).toBe(concepts[0].id);
    }
  });

  it("should return null for non-existent concept id", async () => {
    const concept = await dbFunctions.getMemoryOlfactionConceptById(999999);
    expect(concept).toBeNull();
  });
});

describe("Olfaction Memory - Articles Data Functions", () => {
  it("should list all olfaction memory articles", async () => {
    const articles = await dbFunctions.getOlfactionMemoryArticles();
    expect(articles).toBeDefined();
    expect(Array.isArray(articles)).toBe(true);
  });

  it("should filter articles by category", async () => {
    const neurologicalArticles = await dbFunctions.getOlfactionMemoryArticles({ category: "neurological" });
    expect(neurologicalArticles).toBeDefined();
    expect(Array.isArray(neurologicalArticles)).toBe(true);
    if (neurologicalArticles.length > 0) {
      expect(neurologicalArticles.every(a => a.category === "neurological")).toBe(true);
    }
  });

  it("should get article by id when exists", async () => {
    const articles = await dbFunctions.getOlfactionMemoryArticles();
    if (articles.length > 0) {
      const article = await dbFunctions.getOlfactionMemoryArticleById(articles[0].id);
      expect(article).toBeDefined();
      expect(article?.id).toBe(articles[0].id);
    }
  });

  it("should return null for non-existent article id", async () => {
    const article = await dbFunctions.getOlfactionMemoryArticleById(999999);
    expect(article).toBeNull();
  });

  it("should get featured articles", async () => {
    const featured = await dbFunctions.getFeaturedOlfactionMemoryArticles(5);
    expect(featured).toBeDefined();
    expect(Array.isArray(featured)).toBe(true);
  });
});

describe("Olfaction Memory - Sources Data Functions", () => {
  it("should list all olfaction memory sources", async () => {
    const sources = await dbFunctions.getOlfactionMemorySources();
    expect(sources).toBeDefined();
    expect(Array.isArray(sources)).toBe(true);
  });

  it("should filter sources by type", async () => {
    const papers = await dbFunctions.getOlfactionMemorySources("scientific_paper");
    expect(papers).toBeDefined();
    expect(Array.isArray(papers)).toBe(true);
    if (papers.length > 0) {
      expect(papers.every(s => s.sourceType === "scientific_paper")).toBe(true);
    }
  });

  it("should get source by id when exists", async () => {
    const sources = await dbFunctions.getOlfactionMemorySources();
    if (sources.length > 0) {
      const source = await dbFunctions.getOlfactionMemorySourceById(sources[0].id);
      expect(source).toBeDefined();
      expect(source?.id).toBe(sources[0].id);
    }
  });

  it("should return null for non-existent source id", async () => {
    const source = await dbFunctions.getOlfactionMemorySourceById(999999);
    expect(source).toBeNull();
  });
});

describe("Olfaction Memory - Statistics", () => {
  it("should return statistics with correct structure", async () => {
    const stats = await dbFunctions.getOlfactionMemoryStats();
    expect(stats).toBeDefined();
    expect(stats.articles).toBeDefined();
    expect(stats.concepts).toBeDefined();
    expect(stats.sources).toBeDefined();
    expect(typeof stats.articles.total).toBe("number");
    expect(typeof stats.concepts.total).toBe("number");
    expect(typeof stats.sources.total).toBe("number");
  });
});

describe("Olfaction Memory - Search", () => {
  it("should search across articles, concepts and sources", async () => {
    const results = await dbFunctions.searchOlfactionMemory("mémoire", 10);
    expect(results).toBeDefined();
    expect(results.articles).toBeDefined();
    expect(results.concepts).toBeDefined();
    expect(results.sources).toBeDefined();
    expect(Array.isArray(results.articles)).toBe(true);
    expect(Array.isArray(results.concepts)).toBe(true);
    expect(Array.isArray(results.sources)).toBe(true);
  });

  it("should return empty arrays for non-matching search", async () => {
    const results = await dbFunctions.searchOlfactionMemory("xyznonexistent123", 10);
    expect(results.articles.length).toBe(0);
    expect(results.concepts.length).toBe(0);
    expect(results.sources.length).toBe(0);
  });
});

describe("Olfaction Memory - Molecule Effects", () => {
  it("should return null for non-existent molecule", async () => {
    const result = await dbFunctions.getMoleculeMemoryEffects(999999);
    expect(result).toBeNull();
  });

  it("should return null for non-existent concept", async () => {
    const result = await dbFunctions.getConceptMolecules(999999);
    expect(result).toBeNull();
  });

  it("should return molecule effects structure when molecule exists", async () => {
    const molecules = await dbFunctions.getAllMolecules();
    if (molecules.length > 0) {
      const result = await dbFunctions.getMoleculeMemoryEffects(molecules[0].id);
      expect(result).toBeDefined();
      expect(result?.molecule).toBeDefined();
      expect(result?.relatedConcepts).toBeDefined();
      expect(Array.isArray(result?.relatedConcepts)).toBe(true);
    }
  });

  it("should return concept molecules structure when concept exists", async () => {
    const concepts = await dbFunctions.getMemoryOlfactionConcepts();
    if (concepts.length > 0) {
      const result = await dbFunctions.getConceptMolecules(concepts[0].id);
      expect(result).toBeDefined();
      expect(result?.concept).toBeDefined();
      expect(result?.relatedMolecules).toBeDefined();
      expect(Array.isArray(result?.relatedMolecules)).toBe(true);
      expect(result?.suggestedMoleculeNames).toBeDefined();
      expect(Array.isArray(result?.suggestedMoleculeNames)).toBe(true);
    }
  });
});
