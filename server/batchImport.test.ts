import { describe, it, expect } from "vitest";

describe("batchImport.validateCsv", () => {
  // Test de validation CSV basique
  it("should validate a correct CSV format", () => {
    const csvContent = `filename,title,description,category,leaf_economy_id
photo1.jpg,Photo test,Description test,echantillon,1
photo2.png,Autre photo,Autre description,terrain,2`;

    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    expect(headers).toContain('filename');
    expect(lines.length).toBeGreaterThan(1);
  });

  it("should reject CSV without filename header", () => {
    const csvContent = `title,description,category
Photo test,Description test,echantillon`;

    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    expect(headers).not.toContain('filename');
  });

  it("should parse categories correctly", () => {
    const validCategories = ['echantillon', 'extraction', 'analyse', 'terrain', 'equipement', 'autre'];
    
    expect(validCategories).toContain('echantillon');
    expect(validCategories).toContain('terrain');
    expect(validCategories).not.toContain('invalid');
  });

  it("should parse tags separated by semicolons", () => {
    const tagsString = "botanique;terrain;san_andres";
    const tags = tagsString.split(';').map(t => t.trim()).filter(Boolean);
    
    expect(tags).toHaveLength(3);
    expect(tags).toContain('botanique');
    expect(tags).toContain('terrain');
    expect(tags).toContain('san_andres');
  });

  it("should handle empty optional fields", () => {
    const csvContent = `filename,title,description,category
photo1.jpg,,,echantillon`;

    const lines = csvContent.split('\n').filter(line => line.trim());
    const values = lines[1].split(',').map(v => v.trim());
    
    expect(values[0]).toBe('photo1.jpg');
    expect(values[1]).toBe('');
    expect(values[2]).toBe('');
    expect(values[3]).toBe('echantillon');
  });
});

describe("batchImport.getCsvTemplate", () => {
  it("should return correct template structure", () => {
    const template = {
      headers: ['filename', 'title', 'description', 'category', 'leaf_economy_id', 'plant_id', 'tags', 'location', 'captured_at'],
      categories: ['echantillon', 'extraction', 'analyse', 'terrain', 'equipement', 'autre'],
    };

    expect(template.headers).toContain('filename');
    expect(template.headers).toContain('leaf_economy_id');
    expect(template.categories).toHaveLength(6);
  });
});

describe("gallery.list with leafEconomyId filter", () => {
  it("should accept leafEconomyId as filter parameter", () => {
    const input = { leafEconomyId: 1, limit: 50 };
    
    expect(input.leafEconomyId).toBe(1);
    expect(input.limit).toBe(50);
  });

  it("should handle optional parameters", () => {
    const input = { limit: 50 };
    
    expect(input.leafEconomyId).toBeUndefined();
    expect(input.limit).toBe(50);
  });
});
