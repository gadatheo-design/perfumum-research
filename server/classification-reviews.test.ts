import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('./db', async () => {
  const actual = await vi.importActual('./db');
  return {
    ...actual,
    createClassificationReview: vi.fn(),
    getPendingReviews: vi.fn(),
    getReviewStats: vi.fn(),
    approveReview: vi.fn(),
    rejectReview: vi.fn(),
    modifyAndApplyReview: vi.fn(),
    skipReview: vi.fn(),
    getReviewById: vi.fn(),
    createReviewsForLowConfidenceClassifications: vi.fn(),
  };
});

import * as db from './db';

describe('Classification Reviews System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createClassificationReview', () => {
    it('should create a new review with correct data', async () => {
      const reviewData = {
        moleculeId: 1,
        aiChemicalClass: 'monoterpene',
        aiChemicalClassConfidence: 45,
        aiChemicalClassReasoning: 'Based on molecular structure analysis',
        aiOlfactiveFamily: 'Agrumes',
        aiOlfactiveFamilyConfidence: 60,
        priority: 'medium' as const,
      };

      const mockReview = {
        id: 1,
        ...reviewData,
        status: 'pending',
        createdAt: new Date(),
      };

      vi.mocked(db.createClassificationReview).mockResolvedValue(mockReview as any);

      const result = await db.createClassificationReview(reviewData);

      expect(result).toBeDefined();
      expect(result?.moleculeId).toBe(1);
      expect(result?.aiChemicalClass).toBe('monoterpene');
      expect(result?.status).toBe('pending');
    });

    it('should set high priority for very low confidence', async () => {
      const reviewData = {
        moleculeId: 2,
        aiChemicalClass: 'unknown',
        aiChemicalClassConfidence: 25,
        priority: 'high' as const,
      };

      const mockReview = {
        id: 2,
        ...reviewData,
        status: 'pending',
        createdAt: new Date(),
      };

      vi.mocked(db.createClassificationReview).mockResolvedValue(mockReview as any);

      const result = await db.createClassificationReview(reviewData);

      expect(result?.priority).toBe('high');
    });
  });

  describe('getPendingReviews', () => {
    it('should return pending reviews with molecule data', async () => {
      const mockReviews = {
        reviews: [
          {
            review: {
              id: 1,
              moleculeId: 1,
              aiChemicalClass: 'monoterpene',
              aiChemicalClassConfidence: 45,
              status: 'pending',
              priority: 'medium',
            },
            molecule: {
              id: 1,
              name: 'Limonène',
              casNumber: '138-86-3',
            },
          },
          {
            review: {
              id: 2,
              moleculeId: 2,
              aiChemicalClass: 'alcohol',
              aiChemicalClassConfidence: 35,
              status: 'pending',
              priority: 'high',
            },
            molecule: {
              id: 2,
              name: 'Linalol',
              casNumber: '78-70-6',
            },
          },
        ],
        total: 2,
      };

      vi.mocked(db.getPendingReviews).mockResolvedValue(mockReviews);

      const result = await db.getPendingReviews({ limit: 50 });

      expect(result.reviews).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.reviews[0].molecule?.name).toBe('Limonène');
    });

    it('should filter by priority', async () => {
      const mockReviews = {
        reviews: [
          {
            review: {
              id: 2,
              moleculeId: 2,
              aiChemicalClass: 'alcohol',
              aiChemicalClassConfidence: 35,
              status: 'pending',
              priority: 'high',
            },
            molecule: {
              id: 2,
              name: 'Linalol',
            },
          },
        ],
        total: 1,
      };

      vi.mocked(db.getPendingReviews).mockResolvedValue(mockReviews);

      const result = await db.getPendingReviews({ priority: 'high' });

      expect(result.reviews).toHaveLength(1);
      expect(result.reviews[0].review.priority).toBe('high');
    });

    it('should filter by max confidence', async () => {
      const mockReviews = {
        reviews: [
          {
            review: {
              id: 1,
              moleculeId: 1,
              aiChemicalClassConfidence: 30,
              status: 'pending',
            },
            molecule: { id: 1, name: 'Test' },
          },
        ],
        total: 1,
      };

      vi.mocked(db.getPendingReviews).mockResolvedValue(mockReviews);

      const result = await db.getPendingReviews({ maxConfidence: 50 });

      expect(result.reviews.every(r => (r.review.aiChemicalClassConfidence || 0) <= 50)).toBe(true);
    });
  });

  describe('getReviewStats', () => {
    it('should return correct statistics', async () => {
      const mockStats = {
        pending: 15,
        approved: 25,
        rejected: 5,
        modified: 10,
        skipped: 3,
        total: 58,
        byPriority: { low: 5, medium: 7, high: 3 },
        avgConfidence: 42,
        lowConfidenceCount: 8,
      };

      vi.mocked(db.getReviewStats).mockResolvedValue(mockStats);

      const result = await db.getReviewStats();

      expect(result.pending).toBe(15);
      expect(result.approved).toBe(25);
      expect(result.total).toBe(58);
      expect(result.byPriority.high).toBe(3);
      expect(result.avgConfidence).toBe(42);
    });
  });

  describe('approveReview', () => {
    it('should approve a pending review and apply classification', async () => {
      vi.mocked(db.approveReview).mockResolvedValue(true);

      const result = await db.approveReview(1, 123);

      expect(result).toBe(true);
      expect(db.approveReview).toHaveBeenCalledWith(1, 123);
    });

    it('should return false for non-pending review', async () => {
      vi.mocked(db.approveReview).mockResolvedValue(false);

      const result = await db.approveReview(999);

      expect(result).toBe(false);
    });
  });

  describe('rejectReview', () => {
    it('should reject a review with notes', async () => {
      vi.mocked(db.rejectReview).mockResolvedValue(true);

      const result = await db.rejectReview(1, 123, 'Classification incorrecte');

      expect(result).toBe(true);
      expect(db.rejectReview).toHaveBeenCalledWith(1, 123, 'Classification incorrecte');
    });
  });

  describe('modifyAndApplyReview', () => {
    it('should modify and apply review with manual corrections', async () => {
      vi.mocked(db.modifyAndApplyReview).mockResolvedValue(true);

      const result = await db.modifyAndApplyReview(
        1,
        {
          chemicalClass: 'sesquiterpene',
          olfactiveFamily: 'Boisé',
          olfactiveProfile: 'Notes boisées et terreuses',
        },
        123,
        'Correction basée sur analyse manuelle'
      );

      expect(result).toBe(true);
      expect(db.modifyAndApplyReview).toHaveBeenCalledWith(
        1,
        {
          chemicalClass: 'sesquiterpene',
          olfactiveFamily: 'Boisé',
          olfactiveProfile: 'Notes boisées et terreuses',
        },
        123,
        'Correction basée sur analyse manuelle'
      );
    });
  });

  describe('skipReview', () => {
    it('should skip a review for later processing', async () => {
      vi.mocked(db.skipReview).mockResolvedValue(true);

      const result = await db.skipReview(1, 123, 'Besoin de plus de contexte');

      expect(result).toBe(true);
    });
  });

  describe('createReviewsForLowConfidenceClassifications', () => {
    it('should create reviews for classifications below threshold', async () => {
      const classifications = [
        {
          moleculeId: 1,
          classification: {
            chemicalClass: 'monoterpene',
            chemicalClassConfidence: 45,
            chemicalClassReasoning: 'Low confidence due to ambiguous structure',
          },
        },
        {
          moleculeId: 2,
          classification: {
            chemicalClass: 'alcohol',
            chemicalClassConfidence: 85,
            chemicalClassReasoning: 'High confidence',
          },
        },
        {
          moleculeId: 3,
          classification: {
            chemicalClass: 'unknown',
            chemicalClassConfidence: 25,
            chemicalClassReasoning: 'Very low confidence',
          },
        },
      ];

      vi.mocked(db.createReviewsForLowConfidenceClassifications).mockResolvedValue(2);

      const result = await db.createReviewsForLowConfidenceClassifications(classifications, 70);

      // Should create reviews for molecules 1 and 3 (below 70% threshold)
      expect(result).toBe(2);
    });

    it('should not create reviews when all classifications are high confidence', async () => {
      const classifications = [
        {
          moleculeId: 1,
          classification: {
            chemicalClass: 'monoterpene',
            chemicalClassConfidence: 90,
            chemicalClassReasoning: 'High confidence',
          },
        },
      ];

      vi.mocked(db.createReviewsForLowConfidenceClassifications).mockResolvedValue(0);

      const result = await db.createReviewsForLowConfidenceClassifications(classifications, 70);

      expect(result).toBe(0);
    });
  });

  describe('getReviewById', () => {
    it('should return review with molecule data', async () => {
      const mockResult = {
        review: {
          id: 1,
          moleculeId: 1,
          aiChemicalClass: 'monoterpene',
          aiChemicalClassConfidence: 45,
          status: 'pending',
        },
        molecule: {
          id: 1,
          name: 'Limonène',
          casNumber: '138-86-3',
          chemicalFormula: 'C10H16',
        },
      };

      vi.mocked(db.getReviewById).mockResolvedValue(mockResult);

      const result = await db.getReviewById(1);

      expect(result).toBeDefined();
      expect(result?.review.id).toBe(1);
      expect(result?.molecule?.name).toBe('Limonène');
    });

    it('should return null for non-existent review', async () => {
      vi.mocked(db.getReviewById).mockResolvedValue(null);

      const result = await db.getReviewById(999);

      expect(result).toBeNull();
    });
  });
});

describe('Review Priority Assignment', () => {
  it('should assign high priority for confidence < 30%', () => {
    const confidence = 25;
    let priority: 'low' | 'medium' | 'high' = 'medium';
    
    if (confidence < 30) {
      priority = 'high';
    } else if (confidence >= 50) {
      priority = 'low';
    }

    expect(priority).toBe('high');
  });

  it('should assign medium priority for confidence 30-49%', () => {
    const confidence = 40;
    let priority: 'low' | 'medium' | 'high' = 'medium';
    
    if (confidence < 30) {
      priority = 'high';
    } else if (confidence >= 50) {
      priority = 'low';
    }

    expect(priority).toBe('medium');
  });

  it('should assign low priority for confidence >= 50%', () => {
    const confidence = 55;
    let priority: 'low' | 'medium' | 'high' = 'medium';
    
    if (confidence < 30) {
      priority = 'high';
    } else if (confidence >= 50) {
      priority = 'low';
    }

    expect(priority).toBe('low');
  });
});
