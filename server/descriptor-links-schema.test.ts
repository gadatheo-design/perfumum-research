import { afterEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicTestContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthenticatedTestContext(): TrpcContext {
  return {
    ...createPublicTestContext(),
    user: {
      id: 1,
      openId: "descriptor-integrity-test",
      name: "Test d’intégrité",
      role: "admin",
    } as TrpcContext["user"],
  };
}

describe("descriptorLinks : contrat du schéma relationnel", () => {
  const caller = appRouter.createCaller(createPublicTestContext());
  const authenticatedCaller = appRouter.createCaller(createAuthenticatedTestContext());
  const unknownDescriptorId = "__integrity_probe_without_side_effect__";
  let errorSpy: ReturnType<typeof vi.spyOn> | undefined;

  afterEach(() => {
    errorSpy?.mockRestore();
    errorSpy = undefined;
  });

  it("lit les associations plantes en utilisant les colonnes snake_case de la base", async () => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const links = await caller.descriptorLinks.getPlantsByDescriptor({
      descriptorId: unknownDescriptorId,
    });

    expect(links).toEqual([]);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("lit les associations molécules et leurs occurrences sans écrire de donnée", async () => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const [links, occurrences] = await Promise.all([
      caller.descriptorLinks.getMoleculesByDescriptor({ descriptorId: unknownDescriptorId }),
      caller.descriptorLinks.getDescriptorOccurrences({ descriptorId: unknownDescriptorId }),
    ]);

    expect(links).toEqual([]);
    expect(Number(occurrences.totalPlants)).toBe(0);
    expect(Number(occurrences.totalMolecules)).toBe(0);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("expose les liens orphelins à la revue sans supprimer de donnée", async () => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const report = await authenticatedCaller.descriptorLinks.getIntegrityReport();

    expect(Array.isArray(report.orphanPlantLinks)).toBe(true);
    expect(Array.isArray(report.orphanMoleculeLinks)).toBe(true);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("refuse une cible absente avant toute insertion de lien orphelin", async () => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const descriptors = await caller.predO3.getDescriptors({ limit: 1, offset: 0 });
    expect(descriptors.length).toBeGreaterThan(0);

    const descriptorId = descriptors[0].descriptor_id;
    await expect(
      authenticatedCaller.descriptorLinks.linkPlantToDescriptor({
        descriptorId,
        plantId: -1,
        strength: 3,
      })
    ).rejects.toThrow("Plant not found");
    await expect(
      authenticatedCaller.descriptorLinks.linkMoleculeToDescriptor({
        descriptorId,
        moleculeId: -1,
        strength: 3,
      })
    ).rejects.toThrow("Molecule not found");
  });
});
