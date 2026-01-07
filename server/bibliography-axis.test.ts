import { describe, it, expect, beforeAll } from 'vitest';
import * as db from './db';

describe('Bibliography Axis Filter', () => {
  // Test que la fonction getAllBibliographyEntries accepte le paramètre axisId
  it('should return all entries when no axisId is provided', async () => {
    const result = await db.getAllBibliographyEntries({});
    expect(result).toBeDefined();
    expect(result).toHaveProperty('entries');
    expect(result).toHaveProperty('total');
    expect(Array.isArray(result.entries)).toBe(true);
  });

  it('should filter entries by axisId when provided', async () => {
    // D'abord, récupérer un axe existant
    const axes = await db.getAllResearchAxes({});
    
    if (axes.length > 0) {
      const axisId = axes[0].id;
      const result = await db.getAllBibliographyEntries({ axisId });
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('entries');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.entries)).toBe(true);
      
      // Vérifier que le total correspond au nombre d'entrées
      expect(result.total).toBe(result.entries.length);
    }
  });

  it('should return empty results for non-existent axisId', async () => {
    // Utiliser un ID très grand qui n'existe probablement pas
    const result = await db.getAllBibliographyEntries({ axisId: 999999 });
    
    expect(result).toBeDefined();
    expect(result.entries).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('should combine axisId filter with other filters', async () => {
    const axes = await db.getAllResearchAxes({});
    
    if (axes.length > 0) {
      const axisId = axes[0].id;
      const result = await db.getAllBibliographyEntries({ 
        axisId,
        search: 'olfact' // Terme commun dans les références PERFUMUM
      });
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('entries');
      expect(Array.isArray(result.entries)).toBe(true);
    }
  });
});

describe('Bibliography-Axis Links', () => {
  it('should get bibliography entries by axis', async () => {
    const axes = await db.getAllResearchAxes({});
    
    if (axes.length > 0) {
      const axisId = axes[0].id;
      const entries = await db.getBibliographyByAxis(axisId);
      
      expect(Array.isArray(entries)).toBe(true);
      
      // Vérifier la structure des entrées retournées
      if (entries.length > 0) {
        const entry = entries[0];
        expect(entry).toHaveProperty('id');
        expect(entry).toHaveProperty('title');
        expect(entry).toHaveProperty('relevance');
      }
    }
  });

  it('should get axes by bibliography entry', async () => {
    const { entries } = await db.getAllBibliographyEntries({ limit: 1 });
    
    if (entries.length > 0) {
      const bibliographyId = entries[0].id;
      const axes = await db.getAxesByBibliography(bibliographyId);
      
      expect(Array.isArray(axes)).toBe(true);
    }
  });
});

describe('Research Axes', () => {
  it('should list all research axes', async () => {
    const axes = await db.getAllResearchAxes({});
    
    expect(Array.isArray(axes)).toBe(true);
    expect(axes.length).toBeGreaterThan(0);
    
    // Vérifier la structure d'un axe
    const axis = axes[0];
    expect(axis).toHaveProperty('id');
    expect(axis).toHaveProperty('axisCode');
    expect(axis).toHaveProperty('name');
  });

  it('should get axis by ID', async () => {
    const axes = await db.getAllResearchAxes({});
    
    if (axes.length > 0) {
      const axis = await db.getResearchAxisById(axes[0].id);
      
      expect(axis).toBeDefined();
      expect(axis).toHaveProperty('id');
      expect(axis).toHaveProperty('axisCode');
      expect(axis).toHaveProperty('name');
    }
  });

  it('should return null for non-existent axis ID', async () => {
    const axis = await db.getResearchAxisById(999999);
    expect(axis).toBeNull();
  });
});
