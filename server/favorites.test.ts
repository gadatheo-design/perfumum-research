import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

describe("Favorites System", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  let testUserId: number;
  let testMoleculeId: number;

  beforeAll(async () => {
    // Create a mock context with a test user
    const mockContext: Context = {
      user: {
        id: 1,
        openId: "test-user",
        name: "Test User",
        email: "test@example.com",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
        loginMethod: "oauth",
      },
      req: {} as any,
      res: {} as any,
    };

    caller = appRouter.createCaller(mockContext);
    testUserId = mockContext.user!.id;
    
    // Get first molecule ID from database
    const molecules = await caller.molecules.list();
    if (molecules.length === 0) {
      throw new Error("No molecules in database for testing");
    }
    testMoleculeId = molecules[0].id;
  });

  it("should add a molecule to favorites", async () => {
    const result = await caller.favorites.add({ moleculeId: testMoleculeId });
    expect(result.success).toBe(true);
  });

  it("should check if a molecule is favorited", async () => {
    const isFavorited = await caller.favorites.isFavorite({ moleculeId: testMoleculeId });
    expect(isFavorited).toBe(true);
  });

  it("should list user favorites", async () => {
    const favorites = await caller.favorites.list();
    expect(Array.isArray(favorites)).toBe(true);
    expect(favorites.length).toBeGreaterThan(0);
    
    const favorite = favorites.find(f => f.moleculeId === testMoleculeId);
    expect(favorite).toBeDefined();
    expect(favorite?.molecule).toBeDefined();
    expect(favorite?.molecule?.id).toBe(testMoleculeId);
  });

  it("should remove a molecule from favorites", async () => {
    const result = await caller.favorites.remove({ moleculeId: testMoleculeId });
    expect(result.success).toBe(true);
    
    const isFavorited = await caller.favorites.isFavorite({ moleculeId: testMoleculeId });
    expect(isFavorited).toBe(false);
  });

  it("should handle duplicate favorites gracefully", async () => {
    // Add favorite
    await caller.favorites.add({ moleculeId: testMoleculeId });
    
    // Try to add again (should not throw error)
    const result = await caller.favorites.add({ moleculeId: testMoleculeId });
    expect(result.success).toBe(true);
    
    // Verify only one favorite exists
    const favorites = await caller.favorites.list();
    const moleculeFavorites = favorites.filter(f => f.moleculeId === testMoleculeId);
    expect(moleculeFavorites.length).toBe(1);
    
    // Cleanup
    await caller.favorites.remove({ moleculeId: testMoleculeId });
  });

  it("should return empty array for unauthenticated user", async () => {
    const unauthCaller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });
    
    const favorites = await unauthCaller.favorites.list();
    expect(favorites).toEqual([]);
  });

  it("should return false for unauthenticated user checking favorite", async () => {
    const unauthCaller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });
    
    const isFavorited = await unauthCaller.favorites.isFavorite({ moleculeId: testMoleculeId });
    expect(isFavorited).toBe(false);
  });
});
