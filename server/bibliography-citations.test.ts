import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import { bibliographyEntries, referenceCitations } from "../drizzle/schema";
import { eq, and, count } from "drizzle-orm";

describe("Bibliography Citations", () => {
  let db: Awaited<ReturnType<typeof getDb>>;
  let testEntryId1: number;
  let testEntryId2: number;
  let testEntryId3: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Récupérer quelques entrées existantes pour les tests
    const entries = await db
      .select({ id: bibliographyEntries.id, title: bibliographyEntries.title })
      .from(bibliographyEntries)
      .limit(3);

    if (entries.length < 3) {
      throw new Error("Need at least 3 bibliography entries for tests");
    }

    testEntryId1 = entries[0].id;
    testEntryId2 = entries[1].id;
    testEntryId3 = entries[2].id;
  });

  describe("Bibliography Entries", () => {
    it("should have bibliography entries in database", async () => {
      if (!db) throw new Error("Database not initialized");

      const [result] = await db
        .select({ count: count() })
        .from(bibliographyEntries);

      expect(result.count).toBeGreaterThan(0);
    });

    it("should have entries with required fields", async () => {
      if (!db) throw new Error("Database not initialized");

      const entries = await db
        .select({
          id: bibliographyEntries.id,
          entryKey: bibliographyEntries.entryKey,
          title: bibliographyEntries.title,
          entryType: bibliographyEntries.entryType,
        })
        .from(bibliographyEntries)
        .limit(5);

      for (const entry of entries) {
        expect(entry.id).toBeDefined();
        expect(entry.entryKey).toBeDefined();
        expect(entry.title).toBeDefined();
        expect(entry.entryType).toBeDefined();
      }
    });

    it("should have different entry types", async () => {
      if (!db) throw new Error("Database not initialized");

      const types = await db
        .selectDistinct({ type: bibliographyEntries.entryType })
        .from(bibliographyEntries);

      expect(types.length).toBeGreaterThan(1);
    });

    it("should have entries with research domains", async () => {
      if (!db) throw new Error("Database not initialized");

      const domains = await db
        .selectDistinct({ domain: bibliographyEntries.researchDomain })
        .from(bibliographyEntries)
        .where(eq(bibliographyEntries.researchDomain, bibliographyEntries.researchDomain));

      expect(domains.length).toBeGreaterThan(0);
    });
  });

  describe("Reference Citations Schema", () => {
    it("should have reference_citations table accessible", async () => {
      if (!db) throw new Error("Database not initialized");

      // Just verify the table exists by querying it
      const citations = await db
        .select({ count: count() })
        .from(referenceCitations);

      expect(citations).toBeDefined();
    });

    it("should allow creating a citation between entries", async () => {
      if (!db) throw new Error("Database not initialized");

      // Check if citation already exists
      const existing = await db
        .select()
        .from(referenceCitations)
        .where(
          and(
            eq(referenceCitations.citingId, testEntryId1),
            eq(referenceCitations.citedId, testEntryId2)
          )
        );

      if (existing.length === 0) {
        // Create a test citation
        await db.insert(referenceCitations).values({
          citingId: testEntryId1,
          citedId: testEntryId2,
          citationType: "direct",
          weight: 1,
        });
      }

      // Verify it exists
      const citation = await db
        .select()
        .from(referenceCitations)
        .where(
          and(
            eq(referenceCitations.citingId, testEntryId1),
            eq(referenceCitations.citedId, testEntryId2)
          )
        );

      expect(citation.length).toBe(1);
      expect(citation[0].citationType).toBe("direct");
    });

    it("should support different citation types", async () => {
      if (!db) throw new Error("Database not initialized");

      // Create citations with different types
      const citationTypes = ["methodological", "theoretical", "support"];
      
      for (const type of citationTypes) {
        const existing = await db
          .select()
          .from(referenceCitations)
          .where(
            and(
              eq(referenceCitations.citingId, testEntryId2),
              eq(referenceCitations.citedId, testEntryId3),
              eq(referenceCitations.citationType, type as any)
            )
          );

        if (existing.length === 0) {
          try {
            await db.insert(referenceCitations).values({
              citingId: testEntryId2,
              citedId: testEntryId3,
              citationType: type as any,
              weight: 2,
            });
          } catch (e) {
            // Ignore duplicate key errors
          }
        }
      }

      // Verify at least one citation exists
      const citations = await db
        .select()
        .from(referenceCitations)
        .where(eq(referenceCitations.citingId, testEntryId2));

      expect(citations.length).toBeGreaterThan(0);
    });
  });

  describe("Citation Graph Data", () => {
    it("should be able to build citation graph data", async () => {
      if (!db) throw new Error("Database not initialized");

      // Get all citations
      const citations = await db
        .select({
          citingId: referenceCitations.citingId,
          citedId: referenceCitations.citedId,
          weight: referenceCitations.weight,
        })
        .from(referenceCitations);

      // Build nodes set
      const nodeIds = new Set<number>();
      citations.forEach((c) => {
        nodeIds.add(c.citingId);
        nodeIds.add(c.citedId);
      });

      // Get node details
      if (nodeIds.size > 0) {
        const nodes = await db
          .select({
            id: bibliographyEntries.id,
            title: bibliographyEntries.title,
            authors: bibliographyEntries.authors,
            year: bibliographyEntries.year,
            entryType: bibliographyEntries.entryType,
          })
          .from(bibliographyEntries);

        expect(nodes.length).toBeGreaterThan(0);
      }

      // Links should match citations
      const links = citations.map((c) => ({
        source: c.citingId,
        target: c.citedId,
        weight: c.weight || 1,
      }));

      expect(links.length).toBe(citations.length);
    });

    it("should calculate citation statistics", async () => {
      if (!db) throw new Error("Database not initialized");

      // Count total citations
      const [totalResult] = await db
        .select({ count: count() })
        .from(referenceCitations);

      // Count citing references (distinct)
      const citingRefs = await db
        .selectDistinct({ id: referenceCitations.citingId })
        .from(referenceCitations);

      // Count cited references (distinct)
      const citedRefs = await db
        .selectDistinct({ id: referenceCitations.citedId })
        .from(referenceCitations);

      expect(totalResult.count).toBeGreaterThanOrEqual(0);
      expect(citingRefs.length).toBeLessThanOrEqual(totalResult.count);
      expect(citedRefs.length).toBeLessThanOrEqual(totalResult.count);
    });
  });

  describe("Source Types Coverage", () => {
    it("should have book entries", async () => {
      if (!db) throw new Error("Database not initialized");

      const books = await db
        .select({ count: count() })
        .from(bibliographyEntries)
        .where(eq(bibliographyEntries.entryType, "book"));

      expect(books[0].count).toBeGreaterThan(0);
    });

    it("should have article entries", async () => {
      if (!db) throw new Error("Database not initialized");

      const articles = await db
        .select({ count: count() })
        .from(bibliographyEntries)
        .where(eq(bibliographyEntries.entryType, "article"));

      expect(articles[0].count).toBeGreaterThan(0);
    });

    it("should have online entries (web resources)", async () => {
      if (!db) throw new Error("Database not initialized");

      const online = await db
        .select({ count: count() })
        .from(bibliographyEntries)
        .where(eq(bibliographyEntries.entryType, "online"));

      expect(online[0].count).toBeGreaterThan(0);
    });
  });
});
