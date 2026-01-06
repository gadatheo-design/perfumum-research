import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as db from './db';

describe('Bibliography Source Creation', () => {
  let createdSourceId: number | null = null;

  afterAll(async () => {
    // Cleanup: delete the test source if it was created
    if (createdSourceId) {
      try {
        await db.deleteBibliographySource(createdSourceId);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  describe('createBibliographySource', () => {
    it('should create a new bibliography source with required fields', async () => {
      const sourceData = {
        sourceType: 'scientific_paper',
        title: 'Test Article: Olfactory Research Methods',
        authors: JSON.stringify([{ name: 'Test Author', affiliation: 'Test University' }]),
        publicationYear: 2024,
        language: 'en',
      };

      const result = await db.createBibliographySource(sourceData);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      createdSourceId = result.id;
      
      // Verify the source was created correctly
      const source = await db.getBibliographySourceById(result.id);
      expect(source).toBeDefined();
      expect(source?.title).toBe(sourceData.title);
      expect(source?.sourceType).toBe(sourceData.sourceType);
      expect(source?.publicationYear).toBe(sourceData.publicationYear);
    });

    it('should create a source with all optional fields', async () => {
      const sourceData = {
        sourceType: 'book',
        title: 'Complete Test Book on Perfumery',
        authors: JSON.stringify([
          { name: 'Author One', affiliation: 'University A' },
          { name: 'Author Two', affiliation: 'University B' }
        ]),
        publicationYear: 2023,
        publicationMonth: 6,
        journal: 'Journal of Olfactory Science',
        volume: '12',
        issue: '3',
        pages: '100-150',
        publisher: 'Academic Press',
        edition: '2nd Edition',
        language: 'fr',
        doi: '10.1234/test.doi',
        isbn: '978-3-16-148410-0',
        url: 'https://example.com/test',
        abstract: 'This is a test abstract for the book.',
        keywords: 'olfaction, perfumery, test',
        notes: 'Test notes for this source',
        relevanceScore: 8,
        relevantAxes: 'AX1,AX2',
      };

      const result = await db.createBibliographySource(sourceData);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      
      // Verify all fields
      const source = await db.getBibliographySourceById(result.id);
      expect(source?.title).toBe(sourceData.title);
      expect(source?.doi).toBe(sourceData.doi);
      expect(source?.isbn).toBe(sourceData.isbn);
      expect(source?.relevanceScore).toBe(sourceData.relevanceScore);
      
      // Cleanup
      await db.deleteBibliographySource(result.id);
    });
  });

  describe('updateBibliographySource', () => {
    it('should update an existing source', async () => {
      // First create a source
      const sourceData = {
        sourceType: 'article',
        title: 'Original Title',
        authors: JSON.stringify([{ name: 'Original Author' }]),
      };
      const created = await db.createBibliographySource(sourceData);
      
      // Update it
      const updateData = {
        title: 'Updated Title',
        relevanceScore: 9,
        isVerified: true,
      };
      await db.updateBibliographySource(created.id, updateData);
      
      // Verify the update
      const updated = await db.getBibliographySourceById(created.id);
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.relevanceScore).toBe(9);
      expect(updated?.isVerified).toBe(true);
      
      // Cleanup
      await db.deleteBibliographySource(created.id);
    });
  });

  describe('deleteBibliographySource', () => {
    it('should delete an existing source', async () => {
      // Create a source
      const sourceData = {
        sourceType: 'report',
        title: 'Source to Delete',
        authors: JSON.stringify([{ name: 'Delete Author' }]),
      };
      const created = await db.createBibliographySource(sourceData);
      
      // Delete it
      await db.deleteBibliographySource(created.id);
      
      // Verify deletion
      const deleted = await db.getBibliographySourceById(created.id);
      expect(deleted).toBeNull();
    });
  });
});

describe('Research Entry Creation', () => {
  let testAxisId: number;
  let createdEntryId: number | null = null;

  beforeAll(async () => {
    // Get the first research axis for testing
    const axes = await db.getAllResearchAxes();
    if (axes.length > 0) {
      testAxisId = axes[0].id;
    }
  });

  afterAll(async () => {
    // Cleanup: delete the test entry if it was created
    if (createdEntryId) {
      try {
        await db.deleteResearchEntry(createdEntryId);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  describe('createResearchEntry', () => {
    it('should create a new research entry with required fields', async () => {
      if (!testAxisId) {
        console.log('Skipping test: no research axes available');
        return;
      }

      const entryData = {
        title: 'Test Research Entry',
        slug: 'test-research-entry-' + Date.now(),
        content: 'This is the content of the test research entry.',
        primaryAxisId: testAxisId,
      };

      const result = await db.createResearchEntry(entryData);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      createdEntryId = result.id;
      
      // Verify the entry was created
      const entry = await db.getResearchEntryById(result.id);
      expect(entry).toBeDefined();
      expect(entry?.entry.title).toBe(entryData.title);
      expect(entry?.entry.slug).toBe(entryData.slug);
      expect(entry?.entry.primaryAxisId).toBe(testAxisId);
    });

    it('should create an entry with all optional fields', async () => {
      if (!testAxisId) {
        console.log('Skipping test: no research axes available');
        return;
      }

      const entryData = {
        title: 'Complete Test Entry',
        slug: 'complete-test-entry-' + Date.now(),
        summary: 'A brief summary of the entry',
        content: 'Detailed content of the research entry with markdown support.',
        entryType: 'synthesis',
        status: 'in_progress',
        primaryAxisId: testAxisId,
        importance: 'high',
        isPublic: true,
        isPinned: false,
        researchDate: new Date(),
      };

      const result = await db.createResearchEntry(entryData);
      expect(result).toBeDefined();
      
      const entry = await db.getResearchEntryById(result.id);
      expect(entry?.entry.summary).toBe(entryData.summary);
      expect(entry?.entry.entryType).toBe(entryData.entryType);
      expect(entry?.entry.status).toBe(entryData.status);
      expect(entry?.entry.importance).toBe(entryData.importance);
      expect(entry?.entry.isPublic).toBe(entryData.isPublic);
      
      // Cleanup
      await db.deleteResearchEntry(result.id);
    });
  });

  describe('getResearchEntriesByAxis', () => {
    it('should return entries for a specific axis', async () => {
      if (!testAxisId) {
        console.log('Skipping test: no research axes available');
        return;
      }

      const entries = await db.getResearchEntriesByAxis(testAxisId);
      expect(entries).toBeDefined();
      expect(Array.isArray(entries)).toBe(true);
    });
  });

  describe('updateResearchEntry', () => {
    it('should update an existing entry', async () => {
      if (!testAxisId) {
        console.log('Skipping test: no research axes available');
        return;
      }

      // Create an entry
      const entryData = {
        title: 'Entry to Update',
        slug: 'entry-to-update-' + Date.now(),
        content: 'Original content',
        primaryAxisId: testAxisId,
      };
      const created = await db.createResearchEntry(entryData);
      
      // Update it
      await db.updateResearchEntry(created.id, {
        title: 'Updated Entry Title',
        status: 'completed',
        isPinned: true,
      });
      
      // Verify
      const updated = await db.getResearchEntryById(created.id);
      expect(updated?.entry.title).toBe('Updated Entry Title');
      expect(updated?.entry.status).toBe('completed');
      expect(updated?.entry.isPinned).toBe(true);
      
      // Cleanup
      await db.deleteResearchEntry(created.id);
    });
  });

  describe('deleteResearchEntry', () => {
    it('should delete an existing entry', async () => {
      if (!testAxisId) {
        console.log('Skipping test: no research axes available');
        return;
      }

      // Create an entry
      const entryData = {
        title: 'Entry to Delete',
        slug: 'entry-to-delete-' + Date.now(),
        content: 'Content to delete',
        primaryAxisId: testAxisId,
      };
      const created = await db.createResearchEntry(entryData);
      
      // Delete it
      await db.deleteResearchEntry(created.id);
      
      // Verify deletion
      const deleted = await db.getResearchEntryById(created.id);
      expect(deleted).toBeNull();
    });
  });
});

describe('Source-Entry Linking', () => {
  let testAxisId: number;
  let testSourceId: number;
  let testEntryId: number;

  beforeAll(async () => {
    // Get axis
    const axes = await db.getAllResearchAxes();
    if (axes.length > 0) {
      testAxisId = axes[0].id;
    }
    
    // Create a test source
    const sourceResult = await db.createBibliographySource({
      sourceType: 'scientific_paper',
      title: 'Test Source for Linking',
      authors: JSON.stringify([{ name: 'Link Author' }]),
    });
    testSourceId = sourceResult.id;
    
    // Create a test entry
    if (testAxisId) {
      const entryResult = await db.createResearchEntry({
        title: 'Test Entry for Linking',
        slug: 'test-entry-linking-' + Date.now(),
        content: 'Content for linking test',
        primaryAxisId: testAxisId,
      });
      testEntryId = entryResult.id;
    }
  });

  afterAll(async () => {
    // Cleanup
    if (testEntryId) {
      try {
        await db.deleteResearchEntry(testEntryId);
      } catch (e) {}
    }
    if (testSourceId) {
      try {
        await db.deleteBibliographySource(testSourceId);
      } catch (e) {}
    }
  });

  describe('linkSourceToEntry', () => {
    it('should link a source to an entry', async () => {
      if (!testEntryId || !testSourceId) {
        console.log('Skipping test: test data not available');
        return;
      }

      const result = await db.linkSourceToEntry(
        testEntryId,
        testSourceId,
        'Citation context for test',
        'pp. 10-15'
      );
      expect(result).toBeDefined();
      
      // Verify the link by fetching the entry
      const entry = await db.getResearchEntryById(testEntryId);
      expect(entry?.sources).toBeDefined();
      expect(Array.isArray(entry?.sources)).toBe(true);
    });
  });

  describe('unlinkSourceFromEntry', () => {
    it('should unlink a source from an entry', async () => {
      if (!testEntryId || !testSourceId) {
        console.log('Skipping test: test data not available');
        return;
      }

      // First ensure the link exists (try to unlink first in case it exists from previous test)
      try {
        await db.unlinkSourceFromEntry(testEntryId, testSourceId);
      } catch (e) {
        // Ignore if link doesn't exist
      }
      
      // Create the link
      await db.linkSourceToEntry(testEntryId, testSourceId);
      
      // Verify link exists
      const entryBefore = await db.getResearchEntryById(testEntryId);
      expect(entryBefore?.sources).toBeDefined();
      expect(entryBefore?.sources?.length).toBeGreaterThan(0);
      
      // Then unlink
      await db.unlinkSourceFromEntry(testEntryId, testSourceId);
      
      // Verify the unlink - sources array should be empty or not contain our source
      const entry = await db.getResearchEntryById(testEntryId);
      const hasSource = entry?.sources?.some(s => s.source?.id === testSourceId) || false;
      expect(hasSource).toBe(false);
    });
  });
});
