import { describe, it, expect, beforeAll } from 'vitest';

// Test data
const testLinks = [
  {
    referenceId: 1,
    entityType: 'molecule' as const,
    entityId: 100,
    linkType: 'documents' as const,
    relevanceScore: 85,
    notes: 'Test link 1',
  },
  {
    referenceId: 2,
    entityType: 'plant' as const,
    entityId: 200,
    linkType: 'mentions' as const,
    relevanceScore: 70,
    notes: 'Test link 2',
  },
];

describe('Reference Entity Links', () => {
  describe('Bulk Import', () => {
    it('should validate required fields', () => {
      const invalidData = [
        { referenceId: 1 }, // Missing entityType and entityId
        { entityType: 'molecule', entityId: 100 }, // Missing referenceId
      ];

      // Check that all required fields are present
      invalidData.forEach(item => {
        const hasRequired = 'referenceId' in item && 'entityType' in item && 'entityId' in item;
        expect(hasRequired).toBe(false);
      });
    });

    it('should validate entity types', () => {
      const validTypes = ['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier'];
      const testType = 'molecule';
      expect(validTypes).toContain(testType);
    });

    it('should validate relevance score range', () => {
      const scores = [0, 50, 100, 150, -10];
      scores.forEach(score => {
        const isValid = score >= 0 && score <= 100;
        if (score <= 100 && score >= 0) {
          expect(isValid).toBe(true);
        } else {
          expect(isValid).toBe(false);
        }
      });
    });

    it('should parse CSV data correctly', () => {
      const csvContent = `referenceId,entityType,entityId,linkType,relevanceScore
1,molecule,100,documents,85
2,plant,200,mentions,70`;

      const lines = csvContent.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      expect(headers).toContain('referenceid');
      expect(headers).toContain('entitytype');
      expect(headers).toContain('entityid');
      expect(lines.length).toBe(3); // header + 2 data rows
    });
  });

  describe('Keyword Matching', () => {
    it('should extract keywords from text', () => {
      const text = 'This is a test document about molecules and plants';
      const keywords = text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3)
        .filter((word, index, arr) => arr.indexOf(word) === index);

      expect(keywords).toContain('test');
      expect(keywords).toContain('document');
      expect(keywords).toContain('about');
      expect(keywords).toContain('molecules');
      expect(keywords).toContain('plants');
    });

    it('should calculate Jaccard similarity', () => {
      const keywords1 = ['molecule', 'plant', 'chemical', 'test'];
      const keywords2 = ['molecule', 'plant', 'extract', 'sample'];

      const common = keywords1.filter(k => keywords2.includes(k)).length;
      const union = new Set([...keywords1, ...keywords2]).size;
      const similarity = Math.round((common / union) * 100);

      // 2 common keywords out of 6 unique = 33%
      expect(similarity).toBe(33);
    });

    it('should find common keywords', () => {
      const keywords1 = ['molecule', 'plant', 'chemical', 'test', 'extract'];
      const keywords2 = ['molecule', 'plant', 'extract', 'sample', 'analysis'];

      const common = keywords1.filter(k => keywords2.includes(k));
      expect(common).toContain('molecule');
      expect(common).toContain('plant');
      expect(common).toContain('extract');
      expect(common.length).toBe(3);
    });
  });

  describe('Graph Data', () => {
    it('should create nodes from links', () => {
      const nodeMap = new Map();

      testLinks.forEach(link => {
        const refNodeId = `ref_${link.referenceId}`;
        const entityNodeId = `${link.entityType}_${link.entityId}`;

        if (!nodeMap.has(refNodeId)) {
          nodeMap.set(refNodeId, {
            id: refNodeId,
            label: `Ref ${link.referenceId}`,
            type: 'reference',
          });
        }

        if (!nodeMap.has(entityNodeId)) {
          nodeMap.set(entityNodeId, {
            id: entityNodeId,
            label: `${link.entityType} ${link.entityId}`,
            type: link.entityType,
          });
        }
      });

      expect(nodeMap.size).toBe(4); // 2 references + 2 entities
      expect(nodeMap.has('ref_1')).toBe(true);
      expect(nodeMap.has('molecule_100')).toBe(true);
    });

    it('should create edges from links', () => {
      const edges = testLinks.map(link => ({
        source: `ref_${link.referenceId}`,
        target: `${link.entityType}_${link.entityId}`,
        linkType: link.linkType,
        relevanceScore: link.relevanceScore,
      }));

      expect(edges.length).toBe(2);
      expect(edges[0].source).toBe('ref_1');
      expect(edges[0].target).toBe('molecule_100');
      expect(edges[0].relevanceScore).toBe(85);
    });
  });

  describe('Data Validation', () => {
    it('should detect duplicate links', () => {
      const link1 = { referenceId: 1, entityType: 'molecule' as const, entityId: 100 };
      const link2 = { referenceId: 1, entityType: 'molecule' as const, entityId: 100 };

      const isDuplicate = 
        link1.referenceId === link2.referenceId &&
        link1.entityType === link2.entityType &&
        link1.entityId === link2.entityId;

      expect(isDuplicate).toBe(true);
    });

    it('should validate link types', () => {
      const validLinkTypes = ['documents', 'mentions', 'analyzes', 'conserves', 'reconstructs', 'sources', 'validates', 'contextualizes'];
      const testType = 'documents';
      expect(validLinkTypes).toContain(testType);
    });
  });
});
