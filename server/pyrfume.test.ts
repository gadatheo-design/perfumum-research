import { describe, it, expect, vi } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

// Test the Pyrfume router structure
describe("Pyrfume Router", () => {
  it("should export pyrfumeRouter with expected procedures", async () => {
    const { pyrfumeRouter } = await import("./routers/pyrfume");
    
    expect(pyrfumeRouter).toBeDefined();
    
    // Check that the router has the expected procedure names
    const routerDef = pyrfumeRouter._def;
    expect(routerDef).toBeDefined();
    expect(routerDef.procedures).toBeDefined();
    
    const procedureNames = Object.keys(routerDef.procedures);
    
    // Public queries
    expect(procedureNames).toContain("getStats");
    expect(procedureNames).toContain("getDatasets");
    expect(procedureNames).toContain("getKnownDatasets");
    expect(procedureNames).toContain("getDescriptorsForMolecule");
    expect(procedureNames).toContain("getMappingForMolecule");
    expect(procedureNames).toContain("getIfraForMolecule");
    expect(procedureNames).toContain("searchByDescriptor");
    expect(procedureNames).toContain("getTopDescriptors");
    expect(procedureNames).toContain("getUnmappedMolecules");
    
    // Protected mutations
    expect(procedureNames).toContain("runCidMatching");
    expect(procedureNames).toContain("runCasMatching");
    expect(procedureNames).toContain("importDataset");
    expect(procedureNames).toContain("seedDatasets");
  });

  it("getKnownDatasets should return 7 datasets", async () => {
    const { pyrfumeRouter } = await import("./routers/pyrfume");
    
    // Access the known datasets directly from the procedure
    const caller = pyrfumeRouter.createCaller({} as any);
    const datasets = await caller.getKnownDatasets();
    
    expect(datasets).toHaveLength(7);
    expect(datasets[0]).toHaveProperty("name");
    expect(datasets[0]).toHaveProperty("displayName");
    expect(datasets[0]).toHaveProperty("author");
    expect(datasets[0]).toHaveProperty("year");
    expect(datasets[0]).toHaveProperty("description");
    expect(datasets[0]).toHaveProperty("sourceUrl");
    expect(datasets[0]).toHaveProperty("citation");
  });

  it("getKnownDatasets should include key datasets", async () => {
    const { pyrfumeRouter } = await import("./routers/pyrfume");
    const caller = pyrfumeRouter.createCaller({} as any);
    const datasets = await caller.getKnownDatasets();
    
    const names = datasets.map((d: any) => d.name);
    expect(names).toContain("leffingwell");
    expect(names).toContain("dravnieks_1985");
    expect(names).toContain("goodscents");
    expect(names).toContain("keller_2016");
    expect(names).toContain("ifra_2019");
    expect(names).toContain("arctander_1969");
    expect(names).toContain("sigma_2014");
  });

  it("getStats should return zeros when DB is null", async () => {
    const { pyrfumeRouter } = await import("./routers/pyrfume");
    const caller = pyrfumeRouter.createCaller({} as any);
    const stats = await caller.getStats();
    
    expect(stats.totalMapped).toBe(0);
    expect(stats.totalDescriptors).toBe(0);
    expect(stats.datasets).toEqual([]);
    expect(stats.coverage).toBe(0);
  });

  it("getDescriptorsForMolecule should return empty array when DB is null", async () => {
    const { pyrfumeRouter } = await import("./routers/pyrfume");
    const caller = pyrfumeRouter.createCaller({} as any);
    const descriptors = await caller.getDescriptorsForMolecule({ moleculeId: 1 });
    
    expect(descriptors).toEqual([]);
  });

  it("getMappingForMolecule should return null when DB is null", async () => {
    const { pyrfumeRouter } = await import("./routers/pyrfume");
    const caller = pyrfumeRouter.createCaller({} as any);
    const mapping = await caller.getMappingForMolecule({ moleculeId: 1 });
    
    expect(mapping).toBeNull();
  });
});
