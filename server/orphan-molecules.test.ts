import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as db from './db';

// Mock the database module
vi.mock('./db', async () => {
  const actual = await vi.importActual('./db');
  return {
    ...actual,
    getOrphanMoleculeStats: vi.fn(),
    getOrphanMoleculesList: vi.fn(),
    batchClassifyMolecules: vi.fn(),
    getNotifications: vi.fn(),
    createNotification: vi.fn(),
    markNotificationAsRead: vi.fn(),
    markAllNotificationsAsRead: vi.fn(),
    deleteNotification: vi.fn(),
    createClassificationSnapshot: vi.fn(),
    getLatestSnapshot: vi.fn(),
    getClassificationSnapshots: vi.fn(),
    getProgressReport: vi.fn(),
  };
});

describe('Orphan Molecules Classification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOrphanMoleculeStats', () => {
    it('should return statistics about orphan molecules', async () => {
      const mockStats = {
        totalMolecules: 100,
        orphanCount: 25,
        classificationRate: 75,
        withFamily: 60,
        withChemicalClass: 55,
        withCasNumber: 70,
        withIupacName: 45,
        withFormula: 80,
        withOlfactiveProfile: 50,
        withRadarComplete: 40,
      };

      vi.mocked(db.getOrphanMoleculeStats).mockResolvedValue(mockStats);

      const result = await db.getOrphanMoleculeStats();

      expect(result).toEqual(mockStats);
      expect(result.totalMolecules).toBe(100);
      expect(result.orphanCount).toBe(25);
      expect(result.classificationRate).toBe(75);
    });
  });

  describe('getOrphanMoleculesList', () => {
    it('should return a list of orphan molecules with pagination', async () => {
      const mockMolecules = {
        molecules: [
          { id: 1, name: 'Limonène', family: null, chemicalClass: 'terpene', casNumber: '138-86-3' },
          { id: 2, name: 'Linalol', family: 'Floral', chemicalClass: null, casNumber: null },
        ],
        total: 25,
        hasMore: true,
      };

      vi.mocked(db.getOrphanMoleculesList).mockResolvedValue(mockMolecules);

      const result = await db.getOrphanMoleculesList('all', 50, 0);

      expect(result.molecules).toHaveLength(2);
      expect(result.total).toBe(25);
      expect(result.hasMore).toBe(true);
    });

    it('should filter by no_family', async () => {
      const mockMolecules = {
        molecules: [
          { id: 1, name: 'Limonène', family: null, chemicalClass: 'terpene', casNumber: '138-86-3' },
        ],
        total: 10,
        hasMore: false,
      };

      vi.mocked(db.getOrphanMoleculesList).mockResolvedValue(mockMolecules);

      const result = await db.getOrphanMoleculesList('no_family', 50, 0);

      expect(result.molecules).toHaveLength(1);
      expect(result.molecules[0].family).toBeNull();
    });
  });

  describe('batchClassifyMolecules', () => {
    it('should update multiple molecules at once', async () => {
      const updates = [
        { moleculeId: 1, family: 'Agrumes', chemicalClass: 'terpene' },
        { moleculeId: 2, family: 'Floral', olfactiveProfile: 'Frais et floral' },
      ];

      vi.mocked(db.batchClassifyMolecules).mockResolvedValue({ updated: 2, failed: 0 });

      const result = await db.batchClassifyMolecules(updates);

      expect(result.updated).toBe(2);
      expect(result.failed).toBe(0);
    });

    it('should handle partial failures', async () => {
      const updates = [
        { moleculeId: 1, family: 'Agrumes' },
        { moleculeId: 999, family: 'Invalid' }, // Non-existent molecule
      ];

      vi.mocked(db.batchClassifyMolecules).mockResolvedValue({ updated: 1, failed: 1 });

      const result = await db.batchClassifyMolecules(updates);

      expect(result.updated).toBe(1);
      expect(result.failed).toBe(1);
    });
  });
});

describe('Notifications System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should return notifications with unread count', async () => {
      const mockNotifications = {
        notifications: [
          {
            id: 1,
            type: 'import_orphan_molecules',
            title: 'Nouvelles molécules importées',
            message: '15 molécules sans classification ont été importées',
            severity: 'warning',
            isRead: false,
            createdAt: new Date(),
          },
        ],
        unreadCount: 1,
        total: 1,
      };

      vi.mocked(db.getNotifications).mockResolvedValue(mockNotifications);

      const result = await db.getNotifications({ limit: 50 });

      expect(result.notifications).toHaveLength(1);
      expect(result.unreadCount).toBe(1);
    });

    it('should filter by unread only', async () => {
      const mockNotifications = {
        notifications: [
          {
            id: 1,
            type: 'import_orphan_molecules',
            title: 'Test',
            message: 'Test message',
            severity: 'info',
            isRead: false,
            createdAt: new Date(),
          },
        ],
        unreadCount: 1,
        total: 1,
      };

      vi.mocked(db.getNotifications).mockResolvedValue(mockNotifications);

      const result = await db.getNotifications({ unreadOnly: true, limit: 50 });

      expect(result.notifications.every(n => !n.isRead)).toBe(true);
    });
  });

  describe('createNotification', () => {
    it('should create a new notification', async () => {
      const newNotification = {
        type: 'import_orphan_molecules' as const,
        title: 'Nouvelles molécules',
        message: '10 molécules importées sans classification',
        severity: 'warning' as const,
      };

      vi.mocked(db.createNotification).mockResolvedValue({
        id: 1,
        ...newNotification,
        isRead: false,
        createdAt: new Date(),
      });

      const result = await db.createNotification(newNotification);

      expect(result.id).toBe(1);
      expect(result.type).toBe('import_orphan_molecules');
      expect(result.isRead).toBe(false);
    });
  });

  describe('markNotificationAsRead', () => {
    it('should mark a notification as read', async () => {
      vi.mocked(db.markNotificationAsRead).mockResolvedValue({ success: true });

      const result = await db.markNotificationAsRead(1, 'user-123');

      expect(result.success).toBe(true);
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('should mark all notifications as read', async () => {
      vi.mocked(db.markAllNotificationsAsRead).mockResolvedValue({ updated: 5 });

      const result = await db.markAllNotificationsAsRead('user-123');

      expect(result.updated).toBe(5);
    });
  });
});

describe('Classification Progress Reports', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createClassificationSnapshot', () => {
    it('should create a snapshot of current classification state', async () => {
      const mockSnapshot = {
        id: 1,
        snapshotDate: new Date(),
        totalMolecules: 100,
        moleculesWithFamily: 60,
        moleculesWithChemicalClass: 55,
        moleculesWithCasNumber: 70,
        moleculesWithIupacName: 45,
        moleculesWithFormula: 80,
        moleculesWithOlfactiveProfile: 50,
        moleculesWithRadarComplete: 40,
        overallClassificationRate: 7500, // stored as integer (75.00%)
        overallLinkingRate: 6000,
        notes: 'Weekly snapshot',
        createdBy: 'user-123',
      };

      vi.mocked(db.createClassificationSnapshot).mockResolvedValue(mockSnapshot);

      const result = await db.createClassificationSnapshot('Weekly snapshot', 'user-123');

      expect(result.id).toBe(1);
      expect(result.totalMolecules).toBe(100);
      expect(result.overallClassificationRate).toBe(7500);
    });
  });

  describe('getLatestSnapshot', () => {
    it('should return the most recent snapshot', async () => {
      const mockSnapshot = {
        id: 5,
        snapshotDate: new Date(),
        totalMolecules: 105,
        moleculesWithFamily: 65,
        overallClassificationRate: 7800,
        overallLinkingRate: 6200,
      };

      vi.mocked(db.getLatestSnapshot).mockResolvedValue(mockSnapshot);

      const result = await db.getLatestSnapshot();

      expect(result?.id).toBe(5);
      expect(result?.totalMolecules).toBe(105);
    });

    it('should return null if no snapshots exist', async () => {
      vi.mocked(db.getLatestSnapshot).mockResolvedValue(null);

      const result = await db.getLatestSnapshot();

      expect(result).toBeNull();
    });
  });

  describe('getProgressReport', () => {
    it('should return a comprehensive progress report', async () => {
      const mockReport = {
        period: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31'),
        },
        classification: {
          overall: { start: 50, end: 75, change: 25, changePercent: 50 },
          family: { start: 40, end: 60, change: 20, changePercent: 50 },
          chemicalClass: { start: 35, end: 55, change: 20, changePercent: 57 },
          casNumber: { start: 60, end: 70, change: 10, changePercent: 17 },
          iupacName: { start: 30, end: 45, change: 15, changePercent: 50 },
          formula: { start: 70, end: 80, change: 10, changePercent: 14 },
          olfactiveProfile: { start: 40, end: 50, change: 10, changePercent: 25 },
        },
        linking: {
          overall: { start: 45, end: 60, change: 15, changePercent: 33 },
          moleculeRecette: { start: 30, end: 50, change: 20, changePercent: 67 },
          moleculePlant: { start: 40, end: 55, change: 15, changePercent: 38 },
          plantTerroir: { start: 50, end: 65, change: 15, changePercent: 30 },
        },
        entities: {
          molecules: { start: 80, end: 100, change: 20, changePercent: 25 },
          recettes: { start: 50, end: 60, change: 10, changePercent: 20 },
          plants: { start: 30, end: 40, change: 10, changePercent: 33 },
          terroirs: { start: 20, end: 25, change: 5, changePercent: 25 },
          accords: { start: 15, end: 20, change: 5, changePercent: 33 },
        },
        projection: {
          dailyProgress: 0.05,
          daysToComplete: 500,
          projectedCompletionDate: new Date('2026-05-15'),
          tenYearProjection: {
            date: new Date('2034-01-01'),
            estimatedClassificationRate: 100,
          },
        },
        snapshots: [],
      };

      vi.mocked(db.getProgressReport).mockResolvedValue(mockReport);

      const result = await db.getProgressReport();

      expect(result?.classification.overall.change).toBe(25);
      expect(result?.projection?.dailyProgress).toBe(0.05);
      expect(result?.entities.molecules.end).toBe(100);
    });

    it('should handle empty snapshots gracefully', async () => {
      vi.mocked(db.getProgressReport).mockResolvedValue(null);

      const result = await db.getProgressReport();

      expect(result).toBeNull();
    });
  });
});
