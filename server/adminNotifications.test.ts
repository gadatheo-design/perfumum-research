import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Admin Notifications", () => {
  describe("getPendingContributions", () => {
    it("should return pending molecules and plants", async () => {
      const result = await db.getPendingContributions();
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('molecules');
      expect(result).toHaveProperty('plants');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.molecules)).toBe(true);
      expect(Array.isArray(result.plants)).toBe(true);
      expect(typeof result.total).toBe('number');
    });

    it("should return molecules with correct fields", async () => {
      const result = await db.getPendingContributions();
      
      if (result.molecules.length > 0) {
        const molecule = result.molecules[0];
        expect(molecule).toHaveProperty('id');
        expect(molecule).toHaveProperty('name');
        expect(molecule).toHaveProperty('validationStatus');
      }
    });

    it("should return plants with correct fields", async () => {
      const result = await db.getPendingContributions();
      
      if (result.plants.length > 0) {
        const plant = result.plants[0];
        expect(plant).toHaveProperty('id');
        expect(plant).toHaveProperty('validationStatus');
      }
    });
  });

  describe("getNewContributionsSince", () => {
    it("should return contributions since a given date", async () => {
      // Test with a date in the past (30 days ago)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const result = await db.getNewContributionsSince(thirtyDaysAgo);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('molecules');
      expect(result).toHaveProperty('plants');
      expect(result).toHaveProperty('total');
    });

    it("should return empty arrays for future date", async () => {
      // Test with a future date
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      const result = await db.getNewContributionsSince(futureDate);
      
      expect(result.molecules.length).toBe(0);
      expect(result.plants.length).toBe(0);
      expect(result.total).toBe(0);
    });
  });

  describe("generatePendingContributionsSummary", () => {
    it("should generate a summary or return null", async () => {
      const summary = await db.generatePendingContributionsSummary();
      
      // Either null (no pending) or a valid summary object
      if (summary !== null) {
        expect(summary).toHaveProperty('title');
        expect(summary).toHaveProperty('content');
        expect(summary).toHaveProperty('stats');
        expect(typeof summary.title).toBe('string');
        expect(typeof summary.content).toBe('string');
        expect(summary.stats).toHaveProperty('molecules');
        expect(summary.stats).toHaveProperty('plants');
        expect(summary.stats).toHaveProperty('total');
      }
    });

    it("should include PERFUMUM in title if there are pending contributions", async () => {
      const summary = await db.generatePendingContributionsSummary();
      
      if (summary !== null) {
        expect(summary.title).toContain('PERFUMUM');
      }
    });
  });
});
