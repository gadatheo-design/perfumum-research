import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Heritage & Conservation References Import", () => {
  it("should have imported the Heritage & Conservation references", async () => {
    // Vérifier que les références OH ont été importées
    const result = await db.getAllBibliographyEntries();
    const allBibEntries = result.entries || [];
    const heritageRefs = allBibEntries.filter(e => e.entryKey.startsWith("oh_"));
    
    // On devrait avoir au moins 30 références Heritage & Conservation
    expect(heritageRefs.length).toBeGreaterThanOrEqual(30);
  });

  it("should have references with correct structure", async () => {
    const result = await db.getAllBibliographyEntries();
    const allBibEntries = result.entries || [];
    const heritageRefs = allBibEntries.filter(e => e.entryKey.startsWith("oh_"));
    
    // Vérifier la structure des références
    for (const ref of heritageRefs.slice(0, 5)) {
      expect(ref.title).toBeTruthy();
      expect(ref.entryType).toBeTruthy();
      // Les tags doivent être un tableau
      if (ref.tags) {
        expect(Array.isArray(ref.tags)).toBe(true);
      }
    }
  });

  it("should have references from different domains", async () => {
    const result = await db.getAllBibliographyEntries();
    const allBibEntries = result.entries || [];
    const heritageRefs = allBibEntries.filter(e => e.entryKey.startsWith("oh_"));
    
    // Collecter les domaines uniques
    const domains = new Set(heritageRefs.map(r => r.researchDomain).filter(Boolean));
    
    // On devrait avoir au moins 3 domaines différents
    expect(domains.size).toBeGreaterThanOrEqual(3);
  });

  it("should have references with heritage-related tags", async () => {
    const result = await db.getAllBibliographyEntries();
    const allBibEntries = result.entries || [];
    const heritageRefs = allBibEntries.filter(e => e.entryKey.startsWith("oh_"));
    
    // Vérifier que certaines références ont des tags liés au patrimoine
    const heritageRelatedTags = ["olfactory-heritage", "heritage", "conservation", "museum", "GLAM", "archiving"];
    
    let foundHeritageTag = false;
    for (const ref of heritageRefs) {
      if (ref.tags && Array.isArray(ref.tags)) {
        for (const tag of ref.tags) {
          if (heritageRelatedTags.includes(tag)) {
            foundHeritageTag = true;
            break;
          }
        }
      }
      if (foundHeritageTag) break;
    }
    
    expect(foundHeritageTag).toBe(true);
  });
});

describe("Heritage Timeline with Linked Molecules", () => {
  it("should return heritage timeline entries", async () => {
    const entries = await db.getAllHeritageTimelineEntries();
    
    // On devrait avoir des entrées de timeline
    expect(entries).toBeDefined();
    expect(Array.isArray(entries)).toBe(true);
  });

  it("should support getting timeline with molecules", async () => {
    const entriesWithMolecules = await db.getAllHeritageTimelineWithMolecules();
    
    expect(entriesWithMolecules).toBeDefined();
    expect(Array.isArray(entriesWithMolecules)).toBe(true);
    
    // Vérifier la structure des entrées
    for (const entry of entriesWithMolecules.slice(0, 3)) {
      expect(entry).toHaveProperty("linkedLostMolecules");
      expect(entry).toHaveProperty("linkedMainMolecules");
      expect(Array.isArray(entry.linkedLostMolecules)).toBe(true);
      expect(Array.isArray(entry.linkedMainMolecules)).toBe(true);
    }
  });

  it("should get single timeline entry with molecules", async () => {
    const entries = await db.getAllHeritageTimelineEntries();
    
    if (entries.length > 0) {
      const entryWithMolecules = await db.getHeritageTimelineWithMolecules(entries[0].id);
      
      expect(entryWithMolecules).toBeDefined();
      if (entryWithMolecules) {
        expect(entryWithMolecules).toHaveProperty("linkedLostMolecules");
        expect(entryWithMolecules).toHaveProperty("linkedMainMolecules");
        expect(entryWithMolecules.id).toBe(entries[0].id);
      }
    }
  });

  it("should get lost molecules by IDs", async () => {
    const allLostMolecules = await db.getAllLostMolecules();
    
    if (allLostMolecules.length >= 2) {
      const ids = allLostMolecules.slice(0, 2).map(m => m.id);
      const molecules = await db.getLostMoleculesByIds(ids);
      
      expect(molecules).toBeDefined();
      expect(molecules.length).toBe(2);
      expect(molecules[0].id).toBe(ids[0]);
      expect(molecules[1].id).toBe(ids[1]);
    }
  });

  it("should return empty array for empty IDs", async () => {
    const molecules = await db.getLostMoleculesByIds([]);
    
    expect(molecules).toBeDefined();
    expect(molecules.length).toBe(0);
  });
});
