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
