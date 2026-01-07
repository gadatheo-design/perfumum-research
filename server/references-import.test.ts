import { describe, it, expect } from "vitest";
import { getAllBibliographyEntries } from "./db";

describe("Bibliography References Import", () => {
  it("should have bibliography entries in the database", async () => {
    const result = await getAllBibliographyEntries();
    expect(result).toBeDefined();
    expect(result.entries).toBeDefined();
    expect(Array.isArray(result.entries)).toBe(true);
    expect(result.entries.length).toBeGreaterThan(0);
  });

  it("should have entries with required fields", async () => {
    const result = await getAllBibliographyEntries();
    const entries = result.entries;
    
    // Vérifier que les entrées ont les champs requis
    for (const entry of entries.slice(0, 10)) {
      expect(entry.title).toBeDefined();
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.entryType).toBeDefined();
    }
  });

  it("should have entries with research domains", async () => {
    const result = await getAllBibliographyEntries();
    const entries = result.entries;
    
    // Vérifier qu'au moins certaines entrées ont un domaine de recherche
    const entriesWithDomain = entries.filter(e => e.researchDomain);
    expect(entriesWithDomain.length).toBeGreaterThan(0);
  });

  it("should have entries from recent years (2020-2025)", async () => {
    const result = await getAllBibliographyEntries();
    const entries = result.entries;
    const recentEntries = entries.filter(e => e.year && e.year >= 2020 && e.year <= 2025);
    
    // Au moins quelques entrées récentes devraient exister
    expect(recentEntries.length).toBeGreaterThan(0);
  });

  it("should have total count in result", async () => {
    const result = await getAllBibliographyEntries();
    expect(result.total).toBeDefined();
    expect(typeof result.total).toBe('number');
    expect(result.total).toBeGreaterThan(0);
  });
});
