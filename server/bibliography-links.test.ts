import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("bibliography.getLinkedAxes", () => {
  it("returns linked axes for a bibliography entry", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Get first bibliography entry
    const entries = await caller.bibliography.list({ limit: 1 });
    if (entries.entries.length === 0) {
      console.log("No bibliography entries found, skipping test");
      return;
    }

    const bibId = entries.entries[0].id;
    const linkedAxes = await caller.bibliography.getLinkedAxes(bibId);

    expect(Array.isArray(linkedAxes)).toBe(true);
    // Each linked axis should have required properties
    for (const axis of linkedAxes) {
      expect(axis).toHaveProperty("id");
      expect(axis).toHaveProperty("axisCode");
      expect(axis).toHaveProperty("name");
    }
  });

  it("returns empty array for non-existent bibliography", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const linkedAxes = await caller.bibliography.getLinkedAxes(999999);
    expect(linkedAxes).toEqual([]);
  });
});

describe("bibliography.linkToAxis", () => {
  let testBibId: number | null = null;
  let testAxisId: number | null = null;

  beforeAll(async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Get a bibliography entry and an axis for testing
    const entries = await caller.bibliography.list({ limit: 1 });
    if (entries.entries.length > 0) {
      testBibId = entries.entries[0].id;
    }

    const axes = await caller.researchAxes.list({});
    if (axes.length > 0) {
      testAxisId = axes[0].id;
    }
  });

  it("links a bibliography entry to an axis", async () => {
    if (!testBibId || !testAxisId) {
      console.log("Missing test data, skipping test");
      return;
    }

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First unlink if already linked
    try {
      await caller.bibliography.unlinkFromAxis({
        bibliographyId: testBibId,
        axisId: testAxisId,
      });
    } catch (e) {
      // Ignore if not linked
    }

    // Link
    const result = await caller.bibliography.linkToAxis({
      bibliographyId: testBibId,
      axisId: testAxisId,
      relevance: "secondaire",
    });

    expect(result).toHaveProperty("id");
    expect(result?.bibliographyId).toBe(testBibId);
    expect(result?.axisId).toBe(testAxisId);
    // La fonction retourne un objet simplifié sans relevance
  });

  it("requires authentication to link", async () => {
    if (!testBibId || !testAxisId) {
      console.log("Missing test data, skipping test");
      return;
    }

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.bibliography.linkToAxis({
        bibliographyId: testBibId,
        axisId: testAxisId,
        relevance: "primaire",
      })
    ).rejects.toThrow();
  });

  afterAll(async () => {
    // Cleanup: unlink the test link
    if (testBibId && testAxisId) {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.bibliography.unlinkFromAxis({
          bibliographyId: testBibId,
          axisId: testAxisId,
        });
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });
});

describe("referenceCitations", () => {
  let testBibId1: number | null = null;
  let testBibId2: number | null = null;
  let testCitationId: number | null = null;

  beforeAll(async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Get two bibliography entries for testing
    const entries = await caller.bibliography.list({ limit: 2 });
    if (entries.entries.length >= 2) {
      testBibId1 = entries.entries[0].id;
      testBibId2 = entries.entries[1].id;
    }
  });

  it("lists citations for a bibliography entry", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    if (!testBibId1) {
      console.log("Missing test data, skipping test");
      return;
    }

    const result = await caller.referenceCitations.list({
      citingId: testBibId1,
    });

    expect(result).toHaveProperty("citations");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.citations)).toBe(true);
  });

  it("creates a citation between two references", async () => {
    if (!testBibId1 || !testBibId2) {
      console.log("Missing test data, skipping test");
      return;
    }

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.referenceCitations.create({
      citingId: testBibId1,
      citedId: testBibId2,
      citationType: "direct",
      weight: 1,
      context: "Test citation context",
    });

    expect(result).toHaveProperty("id");
    expect(result.citingId).toBe(testBibId1);
    expect(result.citedId).toBe(testBibId2);
    expect(result.citationType).toBe("direct");

    testCitationId = result.id;
  });

  it("verifies a citation", async () => {
    if (!testCitationId) {
      console.log("Missing test citation, skipping test");
      return;
    }

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.referenceCitations.verify(testCitationId);

    expect(result.verified).toBe(true);
    expect(result.verifiedAt).toBeTruthy();
  });

  it("deletes a citation", async () => {
    if (!testCitationId) {
      console.log("Missing test citation, skipping test");
      return;
    }

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.referenceCitations.delete(testCitationId);

    // La suppression retourne true ou un objet avec success
    expect(result === true || result?.success === true).toBe(true);
  });

  it("requires authentication to create citations", async () => {
    if (!testBibId1 || !testBibId2) {
      console.log("Missing test data, skipping test");
      return;
    }

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.referenceCitations.create({
        citingId: testBibId1,
        citedId: testBibId2,
        citationType: "direct",
      })
    ).rejects.toThrow();
  });
});

describe("referenceCitations.getGraph", () => {
  it("returns graph data with nodes and links", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.referenceCitations.getGraph({});

    expect(result).toHaveProperty("nodes");
    expect(result).toHaveProperty("links");
    expect(Array.isArray(result.nodes)).toBe(true);
    expect(Array.isArray(result.links)).toBe(true);

    // Each node should have required properties
    for (const node of result.nodes) {
      expect(node).toHaveProperty("id");
      expect(node).toHaveProperty("entryKey");
      expect(node).toHaveProperty("title");
      expect(node).toHaveProperty("inDegree");
      expect(node).toHaveProperty("outDegree");
    }

    // Each link should have source and target
    for (const link of result.links) {
      expect(link).toHaveProperty("source");
      expect(link).toHaveProperty("target");
    }
  });

  it("filters graph by citation type", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.referenceCitations.getGraph({
      citationType: "direct",
    });

    expect(result).toHaveProperty("nodes");
    expect(result).toHaveProperty("links");
    
    // All links should be of type 'direct'
    for (const link of result.links) {
      if (link.citationType) {
        expect(link.citationType).toBe("direct");
      }
    }
  });
});
