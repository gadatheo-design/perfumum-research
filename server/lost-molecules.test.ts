import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Lost Molecules - Analytical Methods", () => {
  it("should return all analytical methods", async () => {
    const methods = await db.getAllAnalyticalMethods();
    expect(Array.isArray(methods)).toBe(true);
    expect(methods.length).toBeGreaterThan(0);
  });

  it("should have methods with required fields", async () => {
    const methods = await db.getAllAnalyticalMethods();
    for (const method of methods) {
      expect(method.methodId).toBeDefined();
      expect(method.name).toBeDefined();
      expect(method.name.length).toBeGreaterThan(0);
    }
  });

  it("should find method by methodId", async () => {
    const method = await db.getAnalyticalMethodByMethodId("meth-gcms");
    expect(method).not.toBeNull();
    if (method) {
      expect(method.name).toContain("GC");
    }
  });
});

describe("Lost Molecules - Molecules", () => {
  it("should return all lost molecules", async () => {
    const molecules = await db.getAllLostMolecules();
    expect(Array.isArray(molecules)).toBe(true);
    expect(molecules.length).toBeGreaterThan(0);
  });

  it("should have molecules with required fields", async () => {
    const molecules = await db.getAllLostMolecules();
    for (const mol of molecules) {
      expect(mol.moleculeId).toBeDefined();
      expect(mol.name).toBeDefined();
      expect(mol.name.length).toBeGreaterThan(0);
    }
  });

  it("should find molecule by moleculeId", async () => {
    const molecule = await db.getLostMoleculeByMoleculeId("mol-nicotine");
    expect(molecule).not.toBeNull();
    if (molecule) {
      expect(molecule.name).toBe("Nicotine");
      expect(molecule.moleculeClass).toBe("alkaloid");
    }
  });

  it("should filter molecules by class", async () => {
    const alkaloids = await db.getLostMoleculesByClass("alkaloid");
    expect(Array.isArray(alkaloids)).toBe(true);
    for (const mol of alkaloids) {
      expect(mol.moleculeClass).toBe("alkaloid");
    }
  });

  it("should get molecule with evidence", async () => {
    const moleculeWithEvidence = await db.getLostMoleculeWithEvidenceByMoleculeId("mol-nicotine");
    expect(moleculeWithEvidence).not.toBeNull();
    if (moleculeWithEvidence) {
      expect(moleculeWithEvidence.evidence).toBeDefined();
      expect(Array.isArray(moleculeWithEvidence.evidence)).toBe(true);
    }
  });
});

describe("Lost Molecules - Evidence", () => {
  it("should return all molecule evidence", async () => {
    const evidence = await db.getAllMoleculeEvidence();
    expect(Array.isArray(evidence)).toBe(true);
    expect(evidence.length).toBeGreaterThan(0);
  });

  it("should have evidence with required fields", async () => {
    const evidence = await db.getAllMoleculeEvidence();
    for (const ev of evidence.slice(0, 10)) {
      expect(ev.evidenceId).toBeDefined();
      expect(ev.lostMoleculeId).toBeDefined();
    }
  });

  it("should filter evidence by confidence", async () => {
    const highConfidence = await db.getMoleculeEvidenceByConfidence("high");
    expect(Array.isArray(highConfidence)).toBe(true);
    for (const ev of highConfidence) {
      expect(ev.confidence).toBe("high");
    }
  });

  it("should filter evidence by entity type", async () => {
    const plantEvidence = await db.getMoleculeEvidenceByEntityType("plant");
    expect(Array.isArray(plantEvidence)).toBe(true);
    for (const ev of plantEvidence) {
      expect(ev.entityType).toBe("plant");
    }
  });

  it("should filter evidence by method", async () => {
    const gcmsEvidence = await db.getMoleculeEvidenceByMethod("meth-gcms");
    expect(Array.isArray(gcmsEvidence)).toBe(true);
    for (const ev of gcmsEvidence) {
      expect(ev.methodId).toBe("meth-gcms");
    }
  });
});

describe("Lost Molecules - Graph Data", () => {
  it("should return graph data with nodes and edges", async () => {
    const graphData = await db.getLostMoleculesGraphData();
    expect(graphData).toBeDefined();
    expect(graphData.nodes).toBeDefined();
    expect(graphData.edges).toBeDefined();
    expect(graphData.methods).toBeDefined();
    expect(graphData.stats).toBeDefined();
  });

  it("should have correct stats structure", async () => {
    const graphData = await db.getLostMoleculesGraphData();
    expect(graphData.stats.totalMolecules).toBeGreaterThan(0);
    expect(graphData.stats.totalEvidence).toBeGreaterThan(0);
    expect(typeof graphData.stats.byClass).toBe("object");
    expect(typeof graphData.stats.byConfidence).toBe("object");
    expect(typeof graphData.stats.byEntityType).toBe("object");
  });

  it("should have nodes with required properties", async () => {
    const graphData = await db.getLostMoleculesGraphData();
    for (const node of graphData.nodes.slice(0, 5)) {
      expect(node.id).toBeDefined();
      expect(node.name).toBeDefined();
      expect(node.type).toBe("molecule");
      expect(typeof node.evidenceCount).toBe("number");
    }
  });
});
