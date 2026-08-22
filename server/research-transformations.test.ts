import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("research.getTransformationsByMolecule", () => {
  it("retourne toujours deux tableaux et des statistiques cohérentes", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.research.getTransformationsByMolecule({
      moleculeId: 30002,
    });

    expect(Array.isArray(result.asSource)).toBe(true);
    expect(Array.isArray(result.asProduct)).toBe(true);

    if (result.success) {
      expect(result.stats.totalAsSource).toBe(result.asSource.length);
      expect(result.stats.totalAsProduct).toBe(result.asProduct.length);
      expect(result.stats.total).toBe(result.asSource.length + result.asProduct.length);
    }
  });
});
