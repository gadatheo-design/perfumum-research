/**
 * Tests — Europeana Sprint 1
 * Valide : nouveaux thèmes, facettes, Entity API, filtres thématiques
 */
import { describe, it, expect } from "vitest";
import {
  THEMATIC_QUERIES,
  getThematicConfig,
  buildIiifManifestUrl,
  buildThumbnailUrl,
} from "./europeana";

describe("THEMATIC_QUERIES — Sprint 1", () => {
  const allKeys = Object.keys(THEMATIC_QUERIES);

  it("contient les 6 thèmes existants", () => {
    const existing = ["rose_damas", "encens", "tabac_ottoman", "houblon", "nard", "myrrhe"];
    existing.forEach((k) => expect(allKeys).toContain(k));
  });

  it("contient les 6 nouveaux thèmes Sprint 1", () => {
    const newThemes = [
      "flacons_parfum",
      "illustrations_botaniques",
      "routes_epices",
      "distillation_alchimie",
      "jardins_botaniques",
      "rituels_olfactifs",
    ];
    newThemes.forEach((k) => expect(allKeys).toContain(k));
  });

  it("tous les thèmes ont facetsEnabled=true", () => {
    allKeys.forEach((k) => {
      expect(THEMATIC_QUERIES[k].facetsEnabled).toBe(true);
    });
  });

  it("les thèmes nature/map/manuscript/photography ont europeanaTheme défini", () => {
    expect(THEMATIC_QUERIES.houblon.europeanaTheme).toBe("nature");
    expect(THEMATIC_QUERIES.illustrations_botaniques.europeanaTheme).toBe("nature");
    expect(THEMATIC_QUERIES.routes_epices.europeanaTheme).toBe("map");
    expect(THEMATIC_QUERIES.distillation_alchimie.europeanaTheme).toBe("manuscript");
    expect(THEMATIC_QUERIES.jardins_botaniques.europeanaTheme).toBe("photography");
  });

  it("chaque thème a label, query, description, relatedPlants, relatedMolecules, color", () => {
    allKeys.forEach((k) => {
      const t = THEMATIC_QUERIES[k];
      expect(t.label).toBeTruthy();
      expect(t.query).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(Array.isArray(t.relatedPlants)).toBe(true);
      expect(Array.isArray(t.relatedMolecules)).toBe(true);
      expect(t.color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});

describe("getThematicConfig", () => {
  it("retourne 12 thèmes", () => {
    const config = getThematicConfig();
    expect(config.length).toBe(12);
  });

  it("inclut europeanaTheme et facetsEnabled dans la config", () => {
    const config = getThematicConfig();
    const houblon = config.find((c) => c.key === "houblon");
    expect(houblon?.europeanaTheme).toBe("nature");
    expect(houblon?.facetsEnabled).toBe(true);
  });
});

describe("buildIiifManifestUrl", () => {
  it("construit l'URL correctement avec slash initial", () => {
    const url = buildIiifManifestUrl("/9200365/BibliographicResource_3000126284840");
    expect(url).toBe("https://iiif.europeana.eu/presentation/9200365/BibliographicResource_3000126284840/manifest");
  });

  it("construit l'URL correctement sans slash initial", () => {
    const url = buildIiifManifestUrl("9200365/BibliographicResource_3000126284840");
    expect(url).toBe("https://iiif.europeana.eu/presentation/9200365/BibliographicResource_3000126284840/manifest");
  });
});

describe("buildThumbnailUrl", () => {
  it("construit l'URL 200px", () => {
    const url = buildThumbnailUrl("/90402/RP_P_OB_72_050", 200);
    expect(url).toBe("https://api.europeana.eu/thumbnail/v3/200/90402/RP_P_OB_72_050.jpg");
  });

  it("construit l'URL 400px par défaut", () => {
    const url = buildThumbnailUrl("/90402/RP_P_OB_72_050");
    expect(url).toBe("https://api.europeana.eu/thumbnail/v3/400/90402/RP_P_OB_72_050.jpg");
  });
});
